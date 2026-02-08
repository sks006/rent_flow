import { NextRequest, NextResponse } from 'next/server'
import { AirbnbVerifier } from '@/lib/verification/airbnbVerifier'

// For production: Uncomment Puppeteer import
// import puppeteer from 'puppeteer-core';
// import chromium from '@sparticuz/chromium';

export async function POST(request: NextRequest) {
  try {
    const { url, walletAddress } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    console.log(`Verification request for URL: ${url} from wallet: ${walletAddress}`)

    // Validate URL format
    if (!AirbnbVerifier.validateAirbnbUrl(url)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid Airbnb URL format',
        requirements: [
          'Use a valid Airbnb listing URL',
          'URL should be in format: https://airbnb.com/rooms/12345678',
          'Make sure the listing is publicly accessible'
        ]
      })
    }

    // Perform verification
    const verificationResult = await AirbnbVerifier.verifyListing(url)

    // Log the verification attempt
    console.log(`Verification result for ${url}:`, {
      isVerified: verificationResult.isVerified,
      hostScore: verificationResult.hostScore,
      issues: verificationResult.issues.length
    })

    return NextResponse.json({
      success: true,
      url,
      walletAddress,
      verification: verificationResult,
      timestamp: new Date().toISOString(),
      metadata: {
        minReviews: parseInt(process.env.NEXT_PUBLIC_MIN_REVIEWS || '5'),
        minRating: parseFloat(process.env.NEXT_PUBLIC_MIN_RATING || '4.0'),
        requireIdentity: process.env.NEXT_PUBLIC_REQUIRE_IDENTITY_VERIFICATION === 'true',
        requireLocation: process.env.NEXT_PUBLIC_REQUIRE_LOCATION_VERIFICATION === 'true'
      }
    })

  } catch (error: any) {
    console.error('Verification API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Verification failed',
      message: error.message || 'Unknown error occurred',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')
  const wallet = searchParams.get('wallet')

  if (!url || !wallet) {
    return NextResponse.json(
      { error: 'URL and wallet address are required' },
      { status: 400 }
    )
  }

  return NextResponse.json({
    success: true,
    message: 'Verification API is active',
    endpoints: {
      POST: '/api/verification - Submit verification request',
      GET: '/api/verification?url=...&wallet=... - Quick verification'
    },
    example: {
      url: 'https://airbnb.com/rooms/12345678',
      walletAddress: 'YourWalletAddressHere'
    }
  })
}
