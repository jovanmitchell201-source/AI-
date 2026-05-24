'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'
import { PRODUCTS, Product } from '@/lib/products'
import Checkout from '@/components/checkout'

function PricingCard({ product, onSelect }: { product: Product; onSelect: () => void }) {
  const price = product.priceInCents / 100
  const isFree = product.priceInCents === 0
  
  return (
    <div
      className={`relative flex flex-col rounded-xl border p-6 ${
        product.highlighted
          ? 'border-accent bg-card/50 ring-1 ring-accent'
          : 'border-border bg-card'
      }`}
    >
      {product.highlighted && (
        <div className="absolute -top-3 right-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            <Sparkles className="h-3 w-3" />
            Recommended
          </span>
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-4xl font-bold text-foreground">${price}</span>
          {!isFree && (
            <span className="text-muted-foreground">
              /{product.interval === 'year' ? 'year' : 'month'}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
      </div>
      
      <ul className="mb-6 flex-1 space-y-3">
        {product.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${product.highlighted ? 'text-accent' : 'text-muted-foreground'}`} />
            <span className="text-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      
      <button
        onClick={onSelect}
        disabled={isFree}
        className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
          product.highlighted
            ? 'bg-foreground text-background hover:bg-foreground/90'
            : isFree
            ? 'border border-border bg-secondary text-secondary-foreground cursor-default'
            : 'border border-border bg-background text-foreground hover:bg-secondary'
        }`}
      >
        {isFree ? 'Start Building' : product.highlighted ? `Start a ${product.name} plan` : `Upgrade to ${product.name}`}
      </button>
    </div>
  )
}

export default function PricingPage() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <button
            onClick={() => setSelectedProduct(null)}
            className="mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back to pricing
          </button>
          <h1 className="mb-8 text-2xl font-bold text-foreground">Complete your purchase</h1>
          <Checkout productId={selectedProduct} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-16">
        {/* Header */}
        <div className="mb-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            <span className="rounded-full bg-accent px-2 py-0.5 text-accent-foreground">New</span>
            Introducing Credit-Based Pricing
            <span className="text-muted-foreground">&rarr;</span>
          </Link>
        </div>
        
        <h1 className="text-balance text-center text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Plans and Pricing
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-center text-muted-foreground">
          Get started immediately for free. Upgrade for more credits, usage and collaboration.
        </p>

        {/* Pricing Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PRODUCTS.map((product) => (
            <PricingCard
              key={product.id}
              product={product}
              onSelect={() => setSelectedProduct(product.id)}
            />
          ))}
        </div>

        {/* Enterprise Section */}
        <div className="mt-8 rounded-xl border border-border bg-card p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground">Enterprise</h3>
              <p className="mt-1 text-muted-foreground">
                For large companies that require additional security.
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {[
                  'Training opt-out by default',
                  'SAML SSO',
                  'Priority access for better performance and no queues',
                  'Dedicated customer support',
                  'Access to all AI models',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0">
              <a
                href="mailto:sales@example.com"
                className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary md:w-auto"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>

        {/* Back to App */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back to app
          </Link>
        </div>
      </div>
    </div>
  )
}
