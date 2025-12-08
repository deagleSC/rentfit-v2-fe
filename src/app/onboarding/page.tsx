'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { MessageBubble } from '@/components/onboarding/message-bubble';
import { OptionCard } from '@/components/onboarding/option-card';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/zustand/stores/onboarding-store';
import { useAuthStore } from '@/zustand/stores/auth-store';
import { Home, User, Building2, CheckCircle2, RotateCcw } from 'lucide-react';
import type { OnboardingMessage } from '@/types/onboarding';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { UpdateProfilePayload } from '@/types/auth';

export default function OnboardingPage() {
  const router = useRouter();
  const {
    step,
    selectedRole,
    wantsToCompleteProfile,
    messages,
    profileData,
    setStep,
    setSelectedRole,
    setWantsToCompleteProfile,
    addMessage,
    initializeMessages,
    completeOnboarding,
    reset,
  } = useOnboardingStore();
  const { updateProfile } = useAuthStore();
  const profileMessageAddedRef = useRef(false);

  // Initialize messages on mount if empty
  useEffect(() => {
    initializeMessages();
  }, [initializeMessages]);

  // Check if user returned from profile completion
  useEffect(() => {
    if (profileData && wantsToCompleteProfile === true && !profileMessageAddedRef.current) {
      // Check if message already exists to prevent duplicates
      const messageExists = messages.some(
        (msg) =>
          msg.content === 'Great! Your profile has been saved. Ready to start exploring RentFit?'
      );

      if (!messageExists) {
        // Add bot message about profile completion
        const profileCompleteMessage: OnboardingMessage = {
          id: `bot-profile-${Date.now()}`,
          type: 'bot',
          content: 'Great! Your profile has been saved. Ready to start exploring RentFit?',
          timestamp: new Date(),
        };
        addMessage(profileCompleteMessage);
        setStep(3);
        profileMessageAddedRef.current = true;
      }
    }
  }, [profileData, wantsToCompleteProfile, addMessage, setStep, messages]);

  // Handle role selection (Step 1)
  const handleRoleSelection = (role: 'landlord' | 'tenant') => {
    setSelectedRole(role);
    setStep(2);

    // Add user's selection message
    const userMessage: OnboardingMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: `I am a ${role}`,
      timestamp: new Date(),
    };
    addMessage(userMessage);

    // Add step 2 question after a short delay
    setTimeout(() => {
      const step2Message: OnboardingMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: 'Would you like to complete your profile?',
        timestamp: new Date(),
      };
      addMessage(step2Message);
    }, 500);
  };

  // Handle profile completion choice (Step 2)
  const handleProfileChoice = (wantsToComplete: boolean) => {
    setWantsToCompleteProfile(wantsToComplete);
    setStep(3);

    // Add user's choice message
    const userMessage: OnboardingMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: wantsToComplete ? 'Yes, complete my profile' : "I'll do this later",
      timestamp: new Date(),
    };
    addMessage(userMessage);

    // Navigate to complete profile if selected
    if (wantsToComplete) {
      setTimeout(() => {
        router.push('/onboarding/complete-profile');
      }, 500);
      return;
    }

    // Add step 3 question after a short delay
    setTimeout(() => {
      const step3Message: OnboardingMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: 'Ready to get started?',
        timestamp: new Date(),
      };
      addMessage(step3Message);
    }, 500);
  };

  // Handle final CTA (Step 3)
  const handleGetStarted = async () => {
    console.log('handleGetStarted called', { profileData, selectedRole });

    try {
      // Build payload object - backend accepts partial updates
      const payloadData: Record<string, unknown> = {
        checkpoint: 'complete',
      };

      // Add selectedRole to roles array if a role is selected
      if (selectedRole) {
        payloadData.roles = [selectedRole];
      }

      // If profile data exists, include it in the payload
      if (profileData) {
        if (selectedRole === 'landlord' && profileData.landlord) {
          const data = profileData.landlord;
          if (data.image) payloadData.image = data.image;

          const landlordProfile: Record<string, unknown> = {};
          if (data.phone) landlordProfile.phone = data.phone;
          if (data.address) landlordProfile.address = data.address;
          if (data.city) landlordProfile.city = data.city;
          if (data.state) landlordProfile.state = data.state;
          if (data.pincode) landlordProfile.pincode = data.pincode;
          if (data.upiId) landlordProfile.upiId = data.upiId;

          if (data.bankDetails) {
            const bankDetails: Record<string, unknown> = {};
            if (data.bankDetails.accountNumber)
              bankDetails.accountNumber = data.bankDetails.accountNumber;
            if (data.bankDetails.ifscCode) bankDetails.ifscCode = data.bankDetails.ifscCode;
            if (data.bankDetails.accountHolderName)
              bankDetails.accountHolderName = data.bankDetails.accountHolderName;
            if (data.bankDetails.bankName) bankDetails.bankName = data.bankDetails.bankName;
            if (data.bankDetails.branchName) bankDetails.branchName = data.bankDetails.branchName;
            if (Object.keys(bankDetails).length > 0) {
              landlordProfile.bankDetails = bankDetails;
            }
          }

          if (data.documents) {
            const documents: Record<string, unknown> = {};
            if (data.documents.aadhaarDocument)
              documents.aadhaarDocument = data.documents.aadhaarDocument;
            if (Object.keys(documents).length > 0) {
              landlordProfile.documents = documents;
            }
          }

          if (Object.keys(landlordProfile).length > 0) {
            payloadData.landlordProfile = landlordProfile;
          }
        } else if (selectedRole === 'tenant' && profileData.tenant) {
          const data = profileData.tenant;
          if (data.image) payloadData.image = data.image;

          const tenantProfile: Record<string, unknown> = {};
          if (data.phone) tenantProfile.phone = data.phone;
          if (data.gender) tenantProfile.gender = data.gender;
          if (data.currentEmployer) tenantProfile.currentEmployer = data.currentEmployer;
          if (data.jobTitle) tenantProfile.jobTitle = data.jobTitle;
          if (data.employmentType) tenantProfile.employmentType = data.employmentType;
          if (data.monthlyIncome) tenantProfile.monthlyIncome = data.monthlyIncome;
          if (data.permanentAddress) tenantProfile.permanentAddress = data.permanentAddress;
          if (data.city) tenantProfile.city = data.city;
          if (data.state) tenantProfile.state = data.state;
          if (data.pincode) tenantProfile.pincode = data.pincode;

          if (data.documents) {
            const documents: Record<string, unknown> = {};
            if (data.documents.aadhaarDocument)
              documents.aadhaarDocument = data.documents.aadhaarDocument;
            if (data.documents.employmentLetterDocument)
              documents.employmentLetterDocument = data.documents.employmentLetterDocument;
            if (Object.keys(documents).length > 0) {
              tenantProfile.documents = documents;
            }
          }

          if (Object.keys(tenantProfile).length > 0) {
            payloadData.tenantProfile = tenantProfile;
          }
        }
      }

      console.log('Updating profile with payload:', payloadData);
      // Update profile - cast to UpdateProfilePayload since backend accepts partial updates
      await updateProfile(payloadData as UpdateProfilePayload);
      console.log('Profile updated successfully');

      // Clear onboarding data
      reset();

      // Complete onboarding
      completeOnboarding();

      // Navigate to home or dashboard
      router.push('/');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      // Still complete onboarding and navigate even if update fails
      reset();
      completeOnboarding();
      router.push('/');
    }
  };

  // Normalize timestamps (convert string to Date if needed)
  const normalizedMessages: OnboardingMessage[] = messages.map((msg) => ({
    ...msg,
    timestamp: typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp,
  }));

  return (
    <div className="flex h-screen flex-col p-6">
      <Card className="border-none h-full flex flex-col w-full">
        <CardHeader className="border-b shrink-0 w-full">
          <div className="flex items-center justify-between gap-4 w-full">
            <CardTitle>
              <div className="text-2xl ">Welcome to RentFit.</div>
              <div className="text-sm font-normal text-muted-foreground">
                Let&apos;s get you started.
              </div>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                reset();
                initializeMessages();
              }}
              className="shrink-0"
              title="Reset onboarding"
            >
              <RotateCcw className="h-full w-full" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 overflow-hidden">
          <Conversation className="h-full bg-card">
            <ConversationContent>
              {normalizedMessages.map((message) => {
                // Determine which options to show based on step and message content
                let optionsContent = null;

                if (message.type === 'bot') {
                  // Step 1: Show role selection options for "What describes you the best?" message
                  if (
                    step === 1 &&
                    (message.content.includes('What describes you') ||
                      message.content.includes('best'))
                  ) {
                    optionsContent = (
                      <div className="flex flex-col gap-3">
                        <OptionCard
                          title="Landlord"
                          description="I own property and want to rent it out"
                          icon={<Building2 className="h-5 w-5" />}
                          onClick={() => handleRoleSelection('landlord')}
                          selected={selectedRole === 'landlord'}
                        />
                        <OptionCard
                          title="Tenant"
                          description="I'm looking for a place to rent"
                          icon={<Home className="h-5 w-5" />}
                          onClick={() => handleRoleSelection('tenant')}
                          selected={selectedRole === 'tenant'}
                        />
                      </div>
                    );
                  }
                  // Step 2: Show profile completion options for "Would you like to complete your profile?" message
                  else if (
                    step === 2 &&
                    (message.content.includes('complete your profile') ||
                      message.content.includes('Would you like'))
                  ) {
                    optionsContent = (
                      <div className="flex flex-col gap-3">
                        <OptionCard
                          title="Complete Profile"
                          description="Set up your profile now"
                          icon={<CheckCircle2 className="h-5 w-5" />}
                          onClick={() => handleProfileChoice(true)}
                          selected={wantsToCompleteProfile === true}
                        />
                        <OptionCard
                          title="Do This Later"
                          description="I'll complete it later"
                          icon={<User className="h-5 w-5" />}
                          onClick={() => handleProfileChoice(false)}
                          selected={wantsToCompleteProfile === false}
                        />
                      </div>
                    );
                  }
                  // Step 3: Show CTA button for "Ready to get started?" or profile completion message
                  else if (
                    step === 3 &&
                    (message.content.includes('Ready to get started') ||
                      message.content.includes('start exploring') ||
                      message.content.includes('profile has been saved'))
                  ) {
                    optionsContent = (
                      <div className="flex justify-start">
                        <Button
                          onClick={handleGetStarted}
                          size="lg"
                          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 font-semibold shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 active:scale-95 border-0 w-full min-w-sm"
                        >
                          {profileData ? 'Start Exploring RentFit' : 'Get Started'}
                        </Button>
                      </div>
                    );
                  }
                }

                return (
                  <MessageBubble key={message.id} type={message.type} content={message.content}>
                    {optionsContent}
                  </MessageBubble>
                );
              })}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </CardContent>
      </Card>
    </div>
  );
}
