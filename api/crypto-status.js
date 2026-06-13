// Vercel serverless function — checks NOWPayments payment status

export default async function handler(req, res) {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing payment id' });

    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Not configured' });

    try {
        const response = await fetch(`https://api.nowpayments.io/v1/payment/${id}`, {
            headers: { 'x-api-key': apiKey }
        });

        if (!response.ok) return res.status(response.status).json({ error: 'Gateway error' });

        const data = await response.json();
        return res.status(200).json({ payment_status: data.payment_status, id: data.payment_id });

    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}
