import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

import './index.css'
import App from './App.tsx'

// 🔑 Tu public key de Stripe (NO la secret)
const stripePromise = loadStripe('pk_test_51TL2tXJnBAA7FMbKtS449vG2QiXzNk6QcCtu62eLiyDKDHKLBpbDRIe4xJ2gAOQVMYQ87unm49z0pMehzFGJTVOJ00yS6jiAYI')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </StrictMode>,
)