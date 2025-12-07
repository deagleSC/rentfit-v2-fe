export type OnboardingRole = 'landlord' | 'tenant' | null;

export type OnboardingStep = 1 | 2 | 3;

export interface OnboardingMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date | string; // Allow string for serialization
}

export interface OnboardingState {
  step: OnboardingStep;
  selectedRole: OnboardingRole;
  wantsToCompleteProfile: boolean | null;
  isComplete: boolean;
  messages: OnboardingMessage[];
  profileData: {
    landlord?: import('@/types/profile').LandlordProfileFormValues;
    tenant?: import('@/types/profile').TenantProfileFormValues;
  } | null;
}

export interface OnboardingActions {
  setStep: (step: OnboardingStep) => void;
  setSelectedRole: (role: OnboardingRole) => void;
  setWantsToCompleteProfile: (wants: boolean) => void;
  addMessage: (message: OnboardingMessage) => void;
  setMessages: (messages: OnboardingMessage[]) => void;
  initializeMessages: () => void;
  setProfileData: (data: {
    landlord?: import('@/types/profile').LandlordProfileFormValues;
    tenant?: import('@/types/profile').TenantProfileFormValues;
  }) => void;
  clearProfileData: () => void;
  completeOnboarding: () => void;
  reset: () => void;
}
