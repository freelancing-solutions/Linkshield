export async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const secret = process.env.PAYPAL_SECRET || process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !secret) {
    throw new Error('PayPal credentials not set')
  }

  const base = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com'

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to get PayPal token: ${text}`)
  }

  const json = await res.json()
  return json.access_token as string
}

export const PAYPAL_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com'
