import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  OnboardingState,
  OnboardingActions,
  OnboardingStep,
  OnboardingRole,
  OnboardingMessage,
} from '@/types/onboarding';

const initialState: OnboardingState = {
  step: 1,
  selectedRole: null,
  wantsToCompleteProfile: null,
  isComplete: false,
  messages: [],
  profileData: null,
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step: OnboardingStep) => {
        set({ step });
      },

      setSelectedRole: (role: OnboardingRole) => {
        set({ selectedRole: role });
      },

      setWantsToCompleteProfile: (wants: boolean) => {
        set({ wantsToCompleteProfile: wants });
      },

      setProfileData: (data: {
        landlord?: import('@/types/profile').LandlordProfileFormValues;
        tenant?: import('@/types/profile').TenantProfileFormValues;
      }) => {
        set({ profileData: data });
      },

      clearProfileData: () => {
        set({ profileData: null });
      },

      addMessage: (message: OnboardingMessage) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      },

      setMessages: (messages: OnboardingMessage[]) => {
        set({ messages });
      },

      initializeMessages: () => {
        const state = get();
        // Only initialize if messages array is empty
        if (state.messages.length > 0) return;

        const initialMessages: OnboardingMessage[] = [
          {
            id: '1',
            type: 'bot',
            content: "Welcome to RentFit! Let's get you started.",
            timestamp: new Date(),
          },
        ];

        // If we have a selected role, add those messages
        if (state.selectedRole) {
          initialMessages.push({
            id: '2',
            type: 'bot',
            content: 'What describes you the best?',
            timestamp: new Date(),
          });
          initialMessages.push({
            id: '3',
            type: 'user',
            content: `I am a ${state.selectedRole}`,
            timestamp: new Date(),
          });

          // If we have a profile choice, add those messages
          if (state.wantsToCompleteProfile !== null) {
            initialMessages.push({
              id: '4',
              type: 'bot',
              content: 'Would you like to complete your profile?',
              timestamp: new Date(),
            });
            initialMessages.push({
              id: '5',
              type: 'user',
              content: state.wantsToCompleteProfile
                ? 'Yes, complete my profile'
                : "I'll do this later",
              timestamp: new Date(),
            });

            // If step 3 and not completing profile, add final question
            if (state.step === 3 && !state.wantsToCompleteProfile) {
              initialMessages.push({
                id: '6',
                type: 'bot',
                content: 'Ready to get started?',
                timestamp: new Date(),
              });
            }
          } else {
            // Step 2 question
            initialMessages.push({
              id: '4',
              type: 'bot',
              content: 'Would you like to complete your profile?',
              timestamp: new Date(),
            });
          }
        } else {
          // Step 1 question
          initialMessages.push({
            id: '2',
            type: 'bot',
            content: 'What describes you the best?',
            timestamp: new Date(),
          });
        }

        set({ messages: initialMessages });
      },

      completeOnboarding: () => {
        set({ isComplete: true, step: 3 });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'onboarding-storage',
      partialize: (state) => ({
        step: state.step,
        selectedRole: state.selectedRole,
        wantsToCompleteProfile: state.wantsToCompleteProfile,
        isComplete: state.isComplete,
        messages: state.messages.map((msg) => ({
          ...msg,
          timestamp:
            typeof msg.timestamp === 'string' ? msg.timestamp : msg.timestamp.toISOString(),
        })),
        profileData: state.profileData,
      }),
    }
  )
);
