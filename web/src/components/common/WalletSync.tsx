'use client'

import { useEffect, useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { useStore } from '@/store/useStore'

export default function WalletSync() {
  const [mounted, setMounted] = useState(false)
  const { publicKey, wallet, connected } = useWallet()
  const { connection } = useConnection()
  const { setWallet, setConnection, setIsConnected, setWalletAdapter, fetchBalances } = useStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (publicKey) {
      setWallet(publicKey, wallet?.adapter.name || null)
      setWalletAdapter(wallet?.adapter || null)
      fetchBalances() // Fetch balance on connect
    } else {
      setWallet(null, null)
      setWalletAdapter(null)
    }
  }, [publicKey, wallet, setWallet, setWalletAdapter, fetchBalances, mounted])

  useEffect(() => {
    if (!mounted) return
    setConnection(connection)
  }, [connection, setConnection, mounted])

  useEffect(() => {
    if (!mounted) return
    setIsConnected(connected)
  }, [connected, setIsConnected, mounted])

  return null
}
