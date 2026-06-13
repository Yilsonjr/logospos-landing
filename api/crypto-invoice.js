// Vercel serverless function — proxies NOWPayments invoice creation
// Keeps API key server-side and avoids CORS issues

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { amount_usd, order_id, description, success_url, cancel_url, email } = req.body;

    if (!amount_usd || !order_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Payment gateway not configured' });
    }

    try {
        const response = await fetch('https://api.nowpayments.io/v1/invoice', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                price_amount: parseFloat(amount_usd),
                price_currency: 'usd',
                order_id,
                order_description: description,
                success_url,
                cancel_url,
                ...(email ? { payer_email: email } : {})
            })
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('NOWPayments error:', err);
            return res.status(response.status).json({ error: 'Payment gateway error', detail: err });
        }

        const data = await response.json();

        return res.status(200).json({
            id: data.id,
            invoice_url: data.invoice_url,
            order_id: data.order_id
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
