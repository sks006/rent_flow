import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createWalletSlice, WalletSlice } from './slices/createWalletSlice'
import { createPropertySlice, PropertySlice } from './slices/createPropertySlice'
import { createVerificationSlice, VerificationSlice } from './slices/createVerificationSlice'
import { createAirbnbSlice, AirbnbSlice } from './slices/createAirbnbSlice'

export type StoreState = WalletSlice & PropertySlice & VerificationSlice & AirbnbSlice

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (...a) => ({
        ...createWalletSlice(...a),
        ...createPropertySlice(...a),
        ...createVerificationSlice(...a),
        ...createAirbnbSlice(...a),
      }),
      {
        name: 'rentflow-store',
        partialize: (state) => ({
          recentProperties: state.recentProperties,
          verificationHistory: state.verificationHistory,
          walletPreferences: state.walletPreferences
        }),
      }
    )
  )
)
