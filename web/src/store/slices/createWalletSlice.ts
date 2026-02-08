import { StateCreator } from 'zustand'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { StoreState } from '../useStore'

export interface WalletPreferences {
  autoConnect: boolean
  defaultWallet: 'phantom' | 'backpack' | 'solflare' | 'glow'
  network: 'devnet' | 'mainnet'
}

export interface WalletSlice {
  // State
  connection: Connection | null
  walletPublicKey: PublicKey | null
  walletName: string | null
  balance: {
    sol: number
    usdc: number
  }
  isConnected: boolean
  isConnecting: boolean
  walletAdapter: any | null
  walletPreferences: WalletPreferences
  recentWallets: string[]
  
  // Actions
  setConnection: (connection: Connection) => void
  setWallet: (publicKey: PublicKey | null, name: string | null) => void
  setWalletAdapter: (adapter: any | null) => void
  setBalance: (balance: { sol: number; usdc: number }) => void
  setIsConnected: (isConnected: boolean) => void
  setIsConnecting: (isConnecting: boolean) => void
  setWalletPreferences: (preferences: Partial<WalletPreferences>) => void
  fetchBalances: () => Promise<void>
  connectWallet: (walletType: string) => Promise<void>
  disconnectWallet: () => void
  addRecentWallet: (address: string) => void
}

export const createWalletSlice: StateCreator<
  StoreState,
  [],
  [],
  WalletSlice
> = (set, get) => ({
  // Initial State
  connection: null,
  walletPublicKey: null,
  walletName: null,
  balance: { sol: 0, usdc: 0 },
  isConnected: false,
  isConnecting: false,
  walletAdapter: null,
  walletPreferences: {
    autoConnect: true,
    defaultWallet: 'phantom',
    network: 'devnet'
  },
  recentWallets: [],

  // Actions
  setConnection: (connection) => set({ connection }),
  
  setWallet: (walletPublicKey, walletName) => 
    set({ walletPublicKey, walletName }),
  
  setWalletAdapter: (walletAdapter) => set({ walletAdapter }),
  
  setBalance: (balance) => set({ balance }),
  
  setIsConnected: (isConnected) => set({ isConnected }),
  
  setIsConnecting: (isConnecting) => set({ isConnecting }),
  
  setWalletPreferences: (preferences) => 
    set((state) => ({ 
      walletPreferences: { ...state.walletPreferences, ...preferences }
    })),
  
  fetchBalances: async () => {
    const { connection, walletPublicKey } = get()
    if (!connection || !walletPublicKey) return

    try {
      const solBalance = await connection.getBalance(walletPublicKey)
      
      set({ 
        balance: { 
          sol: solBalance / LAMPORTS_PER_SOL,
          usdc: 0 // Would fetch from token account in production
        }
      })
    } catch (error) {
      console.error('Error fetching balances:', error)
    }
  },

  connectWallet: async (walletType: string) => {
    try {
      if (typeof window === 'undefined') return
      
      set({ isConnecting: true })
      
      // Dynamic wallet detection and connection
      const wallet = (window as any)[walletType]
      if (!wallet) {
        throw new Error(`${walletType} wallet not found`)
      }

      const response = await wallet.connect()
      const publicKey = new PublicKey(response.publicKey)
      
      // Initialize connection
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL!
      const connection = new Connection(rpcUrl, 'confirmed')
      
      set({
        connection,
        walletPublicKey: publicKey,
        walletName: walletType,
        isConnected: true,
        isConnecting: false,
      })

      // Add to recent wallets
      get().addRecentWallet(publicKey.toString())
      
      // Fetch balances
      get().fetchBalances()

    } catch (error) {
      set({ isConnecting: false })
      console.error('Wallet connection error:', error)
      throw error
    }
  },

  disconnectWallet: () => {
    if (typeof window === 'undefined') return
    
    const { walletName } = get()
    const wallet = (window as any)[walletName!]
    
    if (wallet?.disconnect) {
      wallet.disconnect()
    }

    set({
      walletPublicKey: null,
      walletName: null,
      isConnected: false,
      balance: { sol: 0, usdc: 0 },
    })
  },

  addRecentWallet: (address) => {
    set((state) => {
      const filtered = state.recentWallets.filter(addr => addr !== address)
      return { recentWallets: [address, ...filtered].slice(0, 5) }
    })
  },
})
