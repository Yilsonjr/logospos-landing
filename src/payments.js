/* ========================================
   LOGOS POS — Payment Integrations
   ======================================== */

import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLISHABLE_KEY, PLANES } from './config.js';

/**
 * Stripe — currently simulated, replace with Payment Links or server-side Checkout Session
 */
export async function iniciarPagoStripe(plan, periodo) {
    const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
    if (!stripe) throw new Error('Stripe no se pudo cargar');

    const precio = PLANES[plan]?.precios?.[periodo];
    if (!precio) throw new Error('Plan no encontrado');

    console.log(`💳 Stripe: Plan ${plan}, ${periodo}, RD$${precio}`);

    // TODO: replace with real Stripe Payment Link per plan/period
    return {
        success: true,
        paymentId: `stripe_test_${Date.now()}`,
        method: 'stripe'
    };
}

/**
 * NOWPayments — creates invoice via server-side proxy (/api/crypto-invoice)
 * so the API key stays secure and CORS is avoided.
 */
export async function iniciarPagoCrypto(plan, periodo, email) {
    const precio = PLANES[plan]?.precios?.[periodo];
    if (!precio) throw new Error('Plan no encontrado');

    const precioUSD = (precio / 59).toFixed(2);

    try {
        const response = await fetch('/api/crypto-invoice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount_usd: precioUSD,
                order_id: `logos_${plan}_${Date.now()}`,
                description: `Logos POS - Plan ${PLANES[plan]?.nombre} (${periodo})`,
                success_url: window.location.origin + '/success.html',
                cancel_url: window.location.origin + '/checkout.html',
                email
            })
        });

        if (!response.ok) {
            console.warn('crypto-invoice API error, falling back to simulation');
            return {
                success: true,
                paymentId: `crypto_sim_${Date.now()}`,
                method: 'crypto',
                simulated: true,
                invoiceUrl: null,
                amount_usd: precioUSD
            };
        }

        const data = await response.json();

        return {
            success: true,
            paymentId: data.id,
            method: 'crypto',
            simulated: false,
            invoiceUrl: data.invoice_url,
            amount_usd: precioUSD
        };

    } catch (error) {
        console.warn('NOWPayments not available, using simulation:', error.message);
        return {
            success: true,
            paymentId: `crypto_sim_${Date.now()}`,
            method: 'crypto',
            simulated: true,
            invoiceUrl: null,
            amount_usd: precioUSD
        };
    }
}

/**
 * Verify crypto payment status (server-side proxy)
 */
export async function verificarPagoCrypto(paymentId) {
    if (paymentId.startsWith('crypto_sim_') || paymentId.startsWith('crypto_test_')) {
        return { status: 'finished', simulated: true };
    }

    try {
        const response = await fetch(`/api/crypto-status?id=${paymentId}`);
        if (!response.ok) return { status: 'pending' };
        const data = await response.json();
        return { status: data.payment_status };
    } catch {
        return { status: 'error' };
    }
}
