import { StateCreator } from 'zustand'
import { StoreState } from '../useStore'
import { VerificationResult } from '@/lib/verification/airbnbVerifier'

export interface AirbnbSlice {
  // State from User Protocol
  activeProperty: any | null
  currentStep: number
  isLoading: boolean
  error: string | null
  
  // Actions
  verifyProperty: (url: string) => Promise<void>
  setCurrentStep: (step: number) => void
  resetAirbnbVerification: () => void
}

export const createAirbnbSlice: StateCreator<
  StoreState,
  [],
  [],
  AirbnbSlice
> = (set, get) => ({
  // Initial State
  activeProperty: null,
  currentStep: 1, // 1: Input URL, 2: Verify Result, 3: Tokenize
  isLoading: false,
  error: null,

  // Actions from User Protocol
  verifyProperty: async (url: string) => {
    set({ isLoading: true, error: null });
    
    // 🏎️ Simulate the "Scan"
    await new Promise(r => setTimeout(r, 1500));

    if (process.env.NEXT_PUBLIC_ENABLE_REAL_VERIFICATION === 'false') {
      // Inject the High-Fidelity Mock Data for the Investor
      const mockProperty = {
        id: `mock-${Date.now()}`,
        url: url,
        title: "Penthouse Overlooking Central Park",
        nightlyPrice: 450,
        image: "/demo/loft_ny.jpg",
        verified: true,
        hostName: "Jameson",
        hostScore: 98,
        location: "Manhattan, New York",
        rating: 4.98,
        reviewCount: 124,
        verification: {
          isVerified: true,
          level: 'pro',
          score: 98,
          badges: ['identity', 'location', 'superhost']
        }
      };
      set({ 
        activeProperty: mockProperty, 
        currentStep: 2, 
        isLoading: false 
      });
    } else {
      // Future: Call your actual scraper/API
      // For now, use the existing createVerificationSlice or similar logic
      try {
        const result = await get().verifyAirbnbUrl(url, get().walletPublicKey?.toString() || '')
        set({ 
          activeProperty: {
            ...result,
            title: result.scrapeData?.title,
            nightlyPrice: result.scrapeData?.pricePerNight,
            // mapping more fields...
          },
          currentStep: 2,
          isLoading: false
        })
      } catch (error: any) {
        set({ isLoading: false, error: error.message || 'Verification failed' })
        throw error
      }
    }
  },

  setCurrentStep: (currentStep) => set({ currentStep }),

  resetAirbnbVerification: () => set({ 
    activeProperty: null, 
    currentStep: 1, 
    isLoading: false,
    error: null
  })
})
