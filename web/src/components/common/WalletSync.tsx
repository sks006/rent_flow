'use client'

import { useEffect } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { useStore } from '@/store/useStore'

export default function WalletSync() {
  const { publicKey, wallet, connected } = useWallet()
  const { connection } = useConnection()
  const { setWallet, setConnection, setIsConnected, setWalletAdapter, fetchBalances } = useStore()

  useEffect(() => {
    if (publicKey) {
      setWallet(publicKey, wallet?.adapter.name || null)
      setWalletAdapter(wallet?.adapter || null)
      fetchBalances() // Fetch balance on connect
    } else {
      setWallet(null, null)
      setWalletAdapter(null)
    }
  }, [publicKey, wallet, setWallet, setWalletAdapter, fetchBalances])

  useEffect(() => {
    setConnection(connection)
  }, [connection, setConnection])

  useEffect(() => {
    setIsConnected(connected)
  }, [connected, setIsConnected])

  return null
}
