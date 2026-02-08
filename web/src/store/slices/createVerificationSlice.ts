import { StateCreator } from 'zustand'
import { StoreState } from '../useStore'
import { AirbnbVerifier, VerificationResult } from '@/lib/verification/airbnbVerifier'

export interface VerificationRequest {
  id: string
  url: string
  walletAddress: string
  result: VerificationResult
  submittedAt: string
  completedAt?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
}

export interface VerificationSlice {
  // State
  verificationHistory: VerificationRequest[]
  currentVerification: VerificationResult | null
  isVerifying: boolean
  verificationError: string | null
  
  // Actions
  verifyAirbnbUrl: (url: string, walletAddress: string) => Promise<VerificationResult>
  clearVerification: () => void
  getVerificationHistory: (walletAddress: string) => VerificationRequest[]
  saveVerification: (request: VerificationRequest) => void
  retryVerification: (id: string) => Promise<VerificationResult>
}

export const createVerificationSlice: StateCreator<
  StoreState,
  [],
  [],
  VerificationSlice
> = (set, get) => ({
  // Initial State
  verificationHistory: [],
  currentVerification: null,
  isVerifying: false,
  verificationError: null,

  // Actions
  verifyAirbnbUrl: async (url: string, walletAddress: string) => {
    set({ isVerifying: true, verificationError: null })
    
    try {
      // Call verification API
      const response = await fetch('/api/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, walletAddress })
      })

      if (!response.ok) {
        throw new Error('Verification API failed')
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Verification failed')
      }

      const verificationResult = data.verification as VerificationResult
      
      // Save to history
      const request: VerificationRequest = {
        id: `verification-${Date.now()}`,
        url,
        walletAddress,
        result: verificationResult,
        submittedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        status: 'completed'
      }
      
      get().saveVerification(request)
      
      set({ 
        currentVerification: verificationResult,
        isVerifying: false 
      })
      
      return verificationResult
      
    } catch (error: any) {
      const errorMessage = error.message || 'Verification failed'
      
      // Save failed attempt
      const request: VerificationRequest = {
        id: `verification-${Date.now()}`,
        url,
        walletAddress,
        result: {
          isVerified: false,
          verificationLevel: 'none',
          verifiedBadges: [],
          hostScore: 0,
          issues: [errorMessage],
          requirements: ['Check your internet connection', 'Verify the URL is correct']
        },
        submittedAt: new Date().toISOString(),
        status: 'failed'
      }
      
      get().saveVerification(request)
      
      set({ 
        verificationError: errorMessage,
        isVerifying: false 
      })
      
      throw error
    }
  },
  
  clearVerification: () => 
    set({ currentVerification: null, verificationError: null }),
  
  getVerificationHistory: (walletAddress: string) => {
    return get().verificationHistory
      .filter(req => req.walletAddress === walletAddress)
      .sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      )
  },
  
  saveVerification: (request: VerificationRequest) => {
    set((state) => ({
      verificationHistory: [request, ...state.verificationHistory].slice(0, 50)
    }))
  },
  
  retryVerification: async (id: string) => {
    const request = get().verificationHistory.find(req => req.id === id)
    if (!request) {
      throw new Error('Verification request not found')
    }
    
    return get().verifyAirbnbUrl(request.url, request.walletAddress)
  },
})
