export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  features: string[]
  highlighted?: boolean
  mode: 'payment' | 'subscription'
  interval?: 'month' | 'year'
}

export const PRODUCTS: Product[] = [
  {
    id: 'free-tier',
    name: 'Free',
    description: 'For people looking to explore.',
    priceInCents: 0,
    mode: 'payment',
    features: [
      '$5 of included monthly credits',
      'Access to AI chat',
      'Basic model access',
      'Community support',
    ],
  },
  {
    id: 'premium-monthly',
    name: 'Premium',
    description: 'For higher limits and power users.',
    priceInCents: 2000,
    mode: 'subscription',
    interval: 'month',
    features: [
      '$20 of included monthly credits',
      'Purchase additional credits outside of your monthly usage',
      '5x higher attachment size limit',
      'Priority model access',
      'Access to advanced AI models',
    ],
  },
  {
    id: 'team-monthly',
    name: 'Team',
    description: 'For fast moving teams and collaboration.',
    priceInCents: 3000,
    mode: 'subscription',
    interval: 'month',
    highlighted: true,
    features: [
      '$30 of included monthly credits per user',
      'Purchase additional credits outside of your monthly usage shared across your team',
      'Centralized billing',
      'Share chats and collaborate with your team',
      'Access to all AI models',
    ],
  },
]
