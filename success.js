/* ========================================
   LOGOS POS — Success Page Logic
   ======================================== */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './auth.css';
import { PRODUCTOS, POS_APP_URL } from './src/config.js';

document.addEventListener('DOMContentLoaded', () => {
    const result = JSON.parse(sessionStorage.getItem('provision_result') || 'null');

    if (result) {
        document.getElementById('cred-negocio').textContent = result.negocio;
        document.getElementById('cred-username').textContent = result.username;
        document.getElementById('cred-password').textContent = result.password !== '(ya establecida)' ? result.password : '••••••';
        document.getElementById('cred-plan').textContent = result.plan;
    }

    const producto = sessionStorage.getItem('producto_seleccionado') || 'pos_general';
    const posUrl = PRODUCTOS[producto]?.app_url || POS_APP_URL;
    document.getElementById('go-to-pos').href = posUrl;

    // Clean up
    sessionStorage.removeItem('provision_result');
    sessionStorage.removeItem('producto_seleccionado');
});
