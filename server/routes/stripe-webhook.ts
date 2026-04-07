import type { RequestHandler } from "express"
import Stripe from "stripe"

export const handleStripeWebhook: RequestHandler = async (req, res) => {
  const secret = process.env.STRIPE_SECRET_KEY?.trim()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim()

  if (!secret || !webhookSecret) {
    res.status(503).json({ ok: false, error: "Stripe webhook not configured" })
    return
  }

  const sig = req.headers["stripe-signature"]
  if (!sig || typeof sig !== "string") {
    res.status(400).json({ ok: false, error: "Missing stripe-signature header" })
    return
  }

  const stripe = new Stripe(secret)

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret)
  } catch (err) {
    console.error(
      "[api/stripe/webhook] Signature verification failed:",
      err instanceof Error ? err.message : String(err)
    )
    res.status(400).json({ ok: false, error: "Webhook signature verification failed" })
    return
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      console.info("[api/stripe/webhook] Payment completed:", session.id, "status:", session.payment_status)
      // TODO: fulfill order — e.g. grant program access, send confirmation email
      break
    }
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session
      console.info("[api/stripe/webhook] Session expired:", session.id)
      break
    }
    default:
      break
  }

  res.status(200).json({ received: true })
}
