import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const paystackSecret = Deno.env.get('PAYSTACK_SECRET_KEY')
    if (!paystackSecret) {
      throw new Error('Paystack secret key not configured')
    }

    // Verify webhook signature
    const signature = req.headers.get('x-paystack-signature')
    const body = await req.text()
    
    const hash = await createHmac("sha512", paystackSecret)
      .update(body)
      .digest("hex")

    if (signature !== hash) {
      return new Response('Unauthorized', { status: 401 })
    }

    const event = JSON.parse(body)
    console.log('Paystack webhook event:', event.event)

    switch (event.event) {
      case 'charge.success':
        await handleSuccessfulPayment(supabase, event.data)
        break
      
      case 'subscription.create':
        await handleSubscriptionCreated(supabase, event.data)
        break
      
      case 'subscription.disable':
        await handleSubscriptionDisabled(supabase, event.data)
        break
      
      case 'invoice.create':
        await handleInvoiceCreated(supabase, event.data)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(supabase, event.data)
        break
      
      default:
        console.log('Unhandled webhook event:', event.event)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function handleSuccessfulPayment(supabase: any, data: any) {
  const { reference, amount, customer, metadata } = data

  // Update transaction status
  const { error: transactionError } = await supabase
    .from('transactions')
    .update({
      status: 'success',
      paystack_transaction_id: data.id,
      metadata: data,
      updated_at: new Date().toISOString()
    })
    .eq('paystack_reference', reference)

  if (transactionError) {
    console.error('Error updating transaction:', transactionError)
    return
  }

  // If this is a subscription payment, update subscription status
  if (metadata?.subscription_id) {
    await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        paystack_customer_code: customer.customer_code,
        updated_at: new Date().toISOString()
      })
      .eq('id', metadata.subscription_id)
  }

  console.log('Payment processed successfully:', reference)
}

async function handleSubscriptionCreated(supabase: any, data: any) {
  const { subscription_code, customer, plan } = data

  // Find the subscription by customer email or subscription code
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, users(*)')
    .eq('paystack_subscription_code', subscription_code)
    .single()

  if (error || !subscription) {
    console.error('Subscription not found:', subscription_code)
    return
  }

  // Update subscription with Paystack details
  await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      paystack_customer_code: customer.customer_code,
      next_payment_date: data.next_payment_date,
      updated_at: new Date().toISOString()
    })
    .eq('id', subscription.id)

  // Update user role based on plan
  const planTier = getPlanTierFromPaystackPlan(plan.plan_code)
  if (planTier) {
    await supabase
      .from('users')
      .update({
        role: planTier,
        subscription_id: subscription.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscription.user_id)
  }

  console.log('Subscription created:', subscription_code)
}

async function handleSubscriptionDisabled(supabase: any, data: any) {
  const { subscription_code } = data

  // Update subscription status
  const { data: subscription } = await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('paystack_subscription_code', subscription_code)
    .select('user_id')
    .single()

  if (subscription) {
    // Downgrade user to free tier
    await supabase
      .from('users')
      .update({
        role: 'free',
        subscription_id: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscription.user_id)
  }

  console.log('Subscription disabled:', subscription_code)
}

async function handleInvoiceCreated(supabase: any, data: any) {
  // Log invoice creation for record keeping
  console.log('Invoice created:', data.invoice_code)
}

async function handlePaymentFailed(supabase: any, data: any) {
  const { subscription_code } = data

  // Update subscription status to indicate payment failure
  await supabase
    .from('subscriptions')
    .update({
      status: 'expired',
      updated_at: new Date().toISOString()
    })
    .eq('paystack_subscription_code', subscription_code)

  console.log('Payment failed for subscription:', subscription_code)
}

function getPlanTierFromPaystackPlan(planCode: string): string | null {
  // Map Paystack plan codes to our internal tiers
  const planMapping: Record<string, string> = {
    'PLN_pro_monthly': 'pro',
    'PLN_pro_annual': 'pro',
    'PLN_enterprise_monthly': 'enterprise',
    'PLN_enterprise_annual': 'enterprise'
  }

  return planMapping[planCode] || null
}