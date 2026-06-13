/* ========================================
   LOGOS POS — Checkout Page Logic
   ======================================== */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './auth.css';
import { PLANES, POS_APP_URL } from './src/config.js';
import { getSession, provisionarTenant } from './src/supabase.js';
import { iniciarPagoStripe, iniciarPagoCrypto } from './src/payments.js';

let currentPlan = 'profesional';
let currentPeriod = 'mensual';
let registroData = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Get plan and product from URL
    const params = new URLSearchParams(window.location.search);
    currentPlan = params.get('plan') || 'profesional';
    const producto = params.get('producto') || 'pos_general';
    sessionStorage.setItem('producto_seleccionado', producto);

    // Get registration data
    registroData = JSON.parse(sessionStorage.getItem('registro_data') || 'null');

    if (!registroData) {
        // Check session
        const session = await getSession();
        if (!session) {
            window.location.href = `/register.html?plan=${currentPlan}`;
            return;
        }
        // User is logged in but no registro data — may be returning
        registroData = {
            nombre: session.user.user_metadata?.nombre || '',
            apellido: session.user.user_metadata?.apellido || '',
            negocio: session.user.user_metadata?.nombre_negocio || 'Mi Negocio',
            email: session.user.email,
            username: session.user.email.split('@')[0],
            password: '(ya establecida)',
            telefono: ''
        };
    }

    // Display plan info
    updatePlanDisplay();

    // Period toggle
    document.getElementById('btn-mensual')?.addEventListener('click', () => setPeriod('mensual'));
    document.getElementById('btn-anual')?.addEventListener('click', () => setPeriod('anual'));

    // Payment buttons
    document.getElementById('pay-stripe')?.addEventListener('click', handleStripePayment);
    document.getElementById('pay-crypto')?.addEventListener('click', handleCryptoPayment);

    // Greeting
    if (registroData?.nombre) {
        document.getElementById('user-greeting').textContent =
            `Hola ${registroData.nombre}, selecciona tu método de pago`;
    }
});

function updatePlanDisplay() {
    const plan = PLANES[currentPlan];
    if (!plan) return;

    document.getElementById('checkout-plan-name').textContent = plan.nombre;
    document.getElementById('checkout-plan-desc').textContent = plan.descripcion;
    document.getElementById('plan-icon').innerHTML = `<i class="bi ${plan.icon}"></i>`;

    updatePrice();
}

function setPeriod(period) {
    currentPeriod = period;

    document.getElementById('btn-mensual').classList.toggle('active', period === 'mensual');
    document.getElementById('btn-anual').classList.toggle('active', period === 'anual');

    updatePrice();
}

function updatePrice() {
    const plan = PLANES[currentPlan];
    if (!plan) return;

    const precio = plan.precios[currentPeriod];
    document.getElementById('checkout-price').textContent = precio.toLocaleString();

    const annualNote = document.getElementById('annual-note');
    const savingsAmount = document.getElementById('savings-amount');

    if (currentPeriod === 'anual') {
        annualNote.style.display = 'block';
        savingsAmount.textContent = `RD$${plan.ahorro_anual.toLocaleString()}`;
    } else {
        annualNote.style.display = 'none';
    }
}

async function handleStripePayment() {
    showProcessing(true);

    try {
        const result = await iniciarPagoStripe(currentPlan, currentPeriod);

        if (result.success) {
            // Payment successful — provision tenant
            await provisionAndRedirect(result.paymentId, 'tarjeta');
        }
    } catch (error) {
        console.error('Stripe error:', error);
        showProcessing(false);
        alert('Error al procesar el pago. Intenta de nuevo.');
    }
}

async function handleCryptoPayment() {
    showProcessing(true);

    try {
        const result = await iniciarPagoCrypto(currentPlan, currentPeriod, registroData?.email);

        if (result.success) {
            if (result.invoiceUrl && !result.simulated) {
                // Open NOWPayments invoice in a new window
                window.open(result.invoiceUrl, '_blank');

                // For now, assume test mode — provision immediately
                // In production: webhook would handle this
                setTimeout(async () => {
                    await provisionAndRedirect(result.paymentId, 'crypto');
                }, 2000);
            } else {
                // Simulated / test mode — provision immediately
                await provisionAndRedirect(result.paymentId, 'crypto');
            }
        }
    } catch (error) {
        console.error('Crypto error:', error);
        showProcessing(false);
        alert('Error al procesar el pago con criptomonedas. Intenta de nuevo.');
    }
}

async function provisionAndRedirect(paymentId, metodoPago) {
    if (!registroData) {
        alert('Datos de registro no encontrados. Regresa al paso de registro.');
        window.location.href = '/register.html';
        return;
    }

    try {
        const result = await provisionarTenant({
            nombre: registroData.nombre,
            apellido: registroData.apellido,
            email: registroData.email,
            username: registroData.username,
            password: registroData.password,
            nombreNegocio: registroData.negocio,
            telefono: registroData.telefono,
            plan: currentPlan,
            periodo: currentPeriod,
            metodoPago,
            pagoId: paymentId
        });

        // Store success data
        sessionStorage.setItem('provision_result', JSON.stringify({
            negocio: registroData.negocio,
            username: registroData.username,
            password: registroData.password,
            plan: PLANES[currentPlan]?.nombre || currentPlan,
            email: registroData.email
        }));

        // Clear registration data
        sessionStorage.removeItem('registro_data');

        // Redirect to success
        window.location.href = '/success.html';

    } catch (error) {
        console.error('Provisioning error:', error);
        showProcessing(false);
        alert(`Error al configurar tu cuenta: ${error.message || 'Intenta de nuevo.'}`);
    }
}

function showProcessing(show) {
    const processing = document.getElementById('payment-processing');
    const methods = document.querySelector('.payment-methods-section');

    if (show) {
        processing.style.display = 'flex';
        methods.style.display = 'none';
    } else {
        processing.style.display = 'none';
        methods.style.display = 'block';
    }
}
