'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { clusterApiUrl } from '@solana/web3.js'
import { SolanaProvider } from '@/components/providers/SolanaProvider'
import { useMemo } from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import WalletSync from '@/components/common/WalletSync'

const inter = Inter({ subsets: ['latin'] })

// Import wallet styles
import '@solana/wallet-adapter-react-ui/styles.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" className="dark">
      <head>
        <title>RentFlow - Tokenize Airbnb Properties on Solana</title>
        <meta name="description" content="Dynamic platform to tokenize verified Airbnb properties into RWA assets. Open to all wallets and all Airbnb URLs." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <SolanaProvider>
            <WalletSync />
            {children}
            <Toaster />
          </SolanaProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
