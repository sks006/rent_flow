import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useToast } from './ToastContext'

export interface AccountState {
  initialized: boolean
  balance: number
  owner: string
  rentExemption: number
  totalDeposited: number
  totalWithdrawn: number
  activeCycles: number[]
}

export interface Cycle {
  id: number
  duration: number // months
  multiplier: number
  lockedUntil: number // timestamp
  amount: number
}

interface RentFlowContextType {
  accountState: AccountState | null
  cycles: Cycle[]
  loading: boolean
  error: string | null
  initializeAccount: () => Promise<void>
  calculateRent: (size: number) => Promise<number>
  depositFunds: (amount: number) => Promise<void>
  withdrawFunds: (amount: number) => Promise<void>
  lockCycle: (amount: number, duration: number) => Promise<void>
  claimFees: (cycleId: number) => Promise<void>
  refreshData: () => Promise<void>
}

const RentFlowContext = createContext<RentFlowContextType | undefined>(undefined)

export const useRentFlow = () => {
  const context = useContext(RentFlowContext)
  if (!context) {
    throw new Error('useRentFlow must be used within RentFlowProvider')
  }
  return context
}

interface RentFlowProviderProps {
  children: ReactNode
}

export const RentFlowProvider: React.FC<RentFlowProviderProps> = ({ children }) => {
  const [accountState, setAccountState] = useState<AccountState | null>(null)
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { showToast } = useToast()

  const initializeAccount = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newState: AccountState = {
        initialized: true,
        balance: 0,
        owner: 'simulated-owner',
        rentExemption: 0,
        totalDeposited: 0,
        totalWithdrawn: 0,
        activeCycles: []
      }
      
      setAccountState(newState)
      showToast('Account initialized successfully!', 'success')
    } catch (err: any) {
      const message = err.message || 'Failed to initialize account'
      setError(message)
      showToast(message, 'error')
      throw err
    } finally {
      setLoading(false)
    }
  }, [showToast])

  const calculateRent = useCallback(async (size: number) => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate calculation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const rentExemption = size * 0.0001 // Simplified calculation
      
      if (accountState) {
        setAccountState({ ...accountState, rentExemption })
      }
      
      showToast(`Rent calculated: ${rentExemption.toFixed(4)} SOL`, 'success')
      return rentExemption
    } catch (err: any) {
      const message = err.message || 'Failed to calculate rent'
      setError(message)
      showToast(message, 'error')
      throw err
    } finally {
      setLoading(false)
    }
  }, [accountState, showToast])

  const depositFunds = useCallback(async (amount: number) => {
    try {
      setLoading(true)
      setError(null)
      
      if (amount <= 0) {
        throw new Error('Amount must be greater than 0')
      }
      
      // Simulate deposit
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (accountState) {
        const updatedState = {
          ...accountState,
          balance: accountState.balance + amount,
          totalDeposited: accountState.totalDeposited + amount
        }
        setAccountState(updatedState)
      }
      
      showToast(`Deposited ${amount} SOL successfully!`, 'success')
    } catch (err: any) {
      const message = err.message || 'Failed to deposit funds'
      setError(message)
      showToast(message, 'error')
      throw err
    } finally {
      setLoading(false)
    }
  }, [accountState, showToast])

  const withdrawFunds = useCallback(async (amount: number) => {
    try {
      setLoading(true)
      setError(null)
      
      if (amount <= 0) {
        throw new Error('Amount must be greater than 0')
      }
      
      if (accountState && amount > accountState.balance) {
        throw new Error('Insufficient balance')
      }
      
      // Simulate withdrawal
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (accountState) {
        const updatedState = {
          ...accountState,
          balance: accountState.balance - amount,
          totalWithdrawn: accountState.totalWithdrawn + amount
        }
        setAccountState(updatedState)
      }
      
      showToast(`Withdrew ${amount} SOL successfully!`, 'success')
    } catch (err: any) {
      const message = err.message || 'Failed to withdraw funds'
      setError(message)
      showToast(message, 'error')
      throw err
    } finally {
      setLoading(false)
    }
  }, [accountState, showToast])

  const lockCycle = useCallback(async (amount: number, duration: number) => {
    try {
      setLoading(true)
      setError(null)
      
      if (amount <= 0) {
        throw new Error('Amount must be greater than 0')
      }
      
      if (accountState && amount > accountState.balance) {
        throw new Error('Insufficient balance')
      }
      
      // Simulate lock
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newCycle: Cycle = {
        id: Date.now(),
        duration,
        multiplier: duration === 1 ? 1.0 : duration === 3 ? 1.05 : duration === 6 ? 1.1 : 1.2,
        lockedUntil: Date.now() + duration * 30 * 24 * 60 * 60 * 1000,
        amount
      }
      
      setCycles(prev => [...prev, newCycle])
      
      if (accountState) {
        const updatedState = {
          ...accountState,
          balance: accountState.balance - amount,
          activeCycles: [...accountState.activeCycles, newCycle.id]
        }
        setAccountState(updatedState)
      }
      
      showToast(`Locked ${amount} SOL for ${duration} month(s)`, 'success')
    } catch (err: any) {
      const message = err.message || 'Failed to lock cycle'
      setError(message)
      showToast(message, 'error')
      throw err
    } finally {
      setLoading(false)
    }
  }, [accountState, showToast])

  const claimFees = useCallback(async (cycleId: number) => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate claim
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const cycle = cycles.find(c => c.id === cycleId)
      if (!cycle) {
        throw new Error('Cycle not found')
      }
      
      const feeAmount = cycle.amount * (cycle.multiplier - 1)
      
      if (accountState) {
        const updatedState = {
          ...accountState,
          balance: accountState.balance + feeAmount
        }
        setAccountState(updatedState)
      }
      
      setCycles(prev => prev.filter(c => c.id !== cycleId))
      
      showToast(`Claimed ${feeAmount.toFixed(4)} SOL in fees!`, 'success')
    } catch (err: any) {
      const message = err.message || 'Failed to claim fees'
      setError(message)
      showToast(message, 'error')
      throw err
    } finally {
      setLoading(false)
    }
  }, [cycles, accountState, showToast])

  const refreshData = useCallback(async () => {
    try {
      setLoading(true)
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 500))
      showToast('Data refreshed!', 'success')
    } catch (err: any) {
      showToast('Failed to refresh data', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  const value: RentFlowContextType = {
    accountState,
    cycles,
    loading,
    error,
    initializeAccount,
    calculateRent,
    depositFunds,
    withdrawFunds,
    lockCycle,
    claimFees,
    refreshData,
  }

  return (
    <RentFlowContext.Provider value={value}>
      {children}
    </RentFlowContext.Provider>
  )
}
