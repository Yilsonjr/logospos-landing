/* ========================================
   LOGOS POS — Register Page Logic
   ======================================== */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './auth.css';
import { PLANES } from './src/config.js';
import { registrarUsuario, loginUsuario, getSession } from './src/supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Check if already logged in
    const session = await getSession();
    if (session) {
        const plan = new URLSearchParams(window.location.search).get('plan') || 'profesional';
        window.location.href = `/checkout.html?plan=${plan}`;
        return;
    }

    // Get plan from URL
    const params = new URLSearchParams(window.location.search);
    const selectedPlan = params.get('plan');
    const mode = params.get('mode');

    // Show selected plan
    if (selectedPlan && PLANES[selectedPlan]) {
        const planDisplay = document.getElementById('selected-plan-display');
        const planName = document.getElementById('plan-name-display');
        if (planDisplay && planName) {
            planName.textContent = `${PLANES[selectedPlan].nombre} — RD$${PLANES[selectedPlan].precios.mensual.toLocaleString()}/mes`;
            planDisplay.style.display = 'flex';
        }
    }

    // Show login tab if mode=login
    if (mode === 'login') {
        switchTab('login');
    }

    // Tab switching
    document.getElementById('tab-register')?.addEventListener('click', () => switchTab('register'));
    document.getElementById('tab-login')?.addEventListener('click', () => switchTab('login'));

    // Password toggle
    setupPasswordToggle('toggle-password', 'reg-password');
    setupPasswordToggle('toggle-login-password', 'login-password');

    // Register Form
    document.getElementById('register-form')?.addEventListener('submit', handleRegister);

    // Login Form
    document.getElementById('login-form')?.addEventListener('submit', handleLogin);
});

function switchTab(tab) {
    const registerTab = document.getElementById('tab-register');
    const loginTab = document.getElementById('tab-login');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

    if (tab === 'register') {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    } else {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    }
}

function setupPasswordToggle(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    if (!toggle || !input) return;

    toggle.addEventListener('click', () => {
        if (input.type === 'password') {
            input.type = 'text';
            toggle.querySelector('i').className = 'bi bi-eye-slash';
        } else {
            input.type = 'password';
            toggle.querySelector('i').className = 'bi bi-eye';
        }
    });
}

async function handleRegister(e) {
    e.preventDefault();

    const btn = document.getElementById('register-btn');
    const errorDiv = document.getElementById('register-error');
    const btnText = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');

    // Get form values
    const nombre = document.getElementById('reg-nombre').value.trim();
    const apellido = document.getElementById('reg-apellido').value.trim();
    const negocio = document.getElementById('reg-negocio').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const telefono = document.getElementById('reg-telefono').value.trim();
    const password = document.getElementById('reg-password').value;

    // Validate
    if (!nombre || !apellido || !negocio || !email || !username || !password) {
        showError(errorDiv, 'Por favor completa todos los campos requeridos.');
        return;
    }

    if (password.length < 6) {
        showError(errorDiv, 'La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    // Show loading
    btn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    errorDiv.style.display = 'none';

    try {
        await registrarUsuario({
            email,
            password,
            nombre,
            apellido,
            nombreNegocio: negocio,
            username,
            telefono
        });

        // Store registration data in sessionStorage for checkout
        sessionStorage.setItem('registro_data', JSON.stringify({
            nombre, apellido, negocio, email, username, telefono, password
        }));

        // Redirect to checkout
        const plan = new URLSearchParams(window.location.search).get('plan') || 'profesional';
        window.location.href = `/checkout.html?plan=${plan}`;

    } catch (error) {
        console.error('Register error:', error);
        let msg = 'Error al crear la cuenta. Intenta de nuevo.';
        if (error.message?.includes('already registered')) {
            msg = 'Este correo ya está registrado. Intenta iniciar sesión.';
        }
        showError(errorDiv, msg);
    } finally {
        btn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

async function handleLogin(e) {
    e.preventDefault();

    const btn = document.getElementById('login-btn');
    const errorDiv = document.getElementById('login-error');
    const btnText = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showError(errorDiv, 'Por favor completa todos los campos.');
        return;
    }

    btn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    errorDiv.style.display = 'none';

    try {
        await loginUsuario(email, password);
        const plan = new URLSearchParams(window.location.search).get('plan') || 'profesional';
        window.location.href = `/checkout.html?plan=${plan}`;
    } catch (error) {
        console.error('Login error:', error);
        showError(errorDiv, 'Credenciales incorrectas. Verifica tu email y contraseña.');
    } finally {
        btn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

function showError(div, msg) {
    div.textContent = msg;
    div.style.display = 'block';
}
