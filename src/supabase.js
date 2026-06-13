/* ========================================
   LOGOS POS — Supabase Auth & Provisioning
   ======================================== */

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY, PERMISOS_SUPER_ADMIN } from './config.js';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export { supabase };

/**
 * Register a new user (creates Supabase Auth user)
 */
export async function registrarUsuario({ email, password, nombre, apellido, nombreNegocio, username, telefono }) {
    // 1. Create auth user in Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                nombre,
                apellido,
                nombre_negocio: nombreNegocio
            }
        }
    });

    if (authError) throw authError;

    // 2. Store registration data
    const { error: regError } = await supabase
        .from('landing_registros')
        .insert([{
            auth_user_id: authData.user?.id,
            nombre,
            apellido,
            email,
            username,
            nombre_negocio: nombreNegocio,
            telefono: telefono || null,
            estado: 'pendiente_pago'
        }]);

    if (regError) {
        console.warn('⚠️ Error guardando registro:', regError);
        // Don't throw — auth was created successfully
    }

    return authData;
}

/**
 * Login existing user
 */
export async function loginUsuario(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

/**
 * Get current session
 */
export async function getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

/**
 * Logout
 */
export async function logout() {
    await supabase.auth.signOut();
}

/**
 * Provision a new tenant in the POS system
 * Replicates DevAdminService.crearTenant() from Angular app
 */
export async function provisionarTenant({ nombre, apellido, email, username, password, nombreNegocio, telefono, plan, periodo, metodoPago, pagoId }) {
    try {
        console.log('🔄 Creando tenant:', nombreNegocio);

        // 1. Create tenant
        const { data: tenant, error: errorTenant } = await supabase
            .from('tenants')
            .insert([{
                nombre: nombreNegocio,
                email: email,
                telefono: telefono || null,
                plan_slug: plan,
                estado: 'activo'
            }])
            .select()
            .single();

        if (errorTenant) throw errorTenant;

        // 2. Create 'Super Administrador' role for this tenant
        const { data: rol, error: errorRol } = await supabase
            .from('roles')
            .insert([{
                tenant_id: tenant.id,
                nombre: 'Super Administrador',
                descripcion: 'Acceso completo al sistema',
                color: '#dc2626',
                permisos: PERMISOS_SUPER_ADMIN,
                activo: true
            }])
            .select()
            .single();

        if (errorRol) throw errorRol;

        // 3. Create admin user
        const { data: usuario, error: errorUser } = await supabase
            .from('usuarios')
            .insert([{
                tenant_id: tenant.id,
                nombre: nombre,
                apellido: apellido,
                email: email,
                username: username,
                password: password,
                rol_id: rol.id,
                activo: true
            }])
            .select()
            .single();

        if (errorUser) throw errorUser;

        // 4. Create subscription
        const fechaInicio = new Date();
        const fechaFin = new Date();
        if (periodo === 'anual') {
            fechaFin.setFullYear(fechaFin.getFullYear() + 1);
        } else {
            fechaFin.setMonth(fechaFin.getMonth() + 1);
        }

        const { error: errorSub } = await supabase
            .from('subscripciones')
            .insert([{
                tenant_id: tenant.id,
                plan_slug: plan,
                estado: 'activa',
                metodo_pago: metodoPago,
                monto_pagado: getPrecio(plan, periodo),
                fecha_inicio: fechaInicio.toISOString(),
                fecha_fin: fechaFin.toISOString()
            }]);

        if (errorSub) {
            console.warn('⚠️ Error creating subscription:', errorSub);
        }

        // 5. Update landing registration status
        await supabase
            .from('landing_registros')
            .update({ estado: 'completado', plan_seleccionado: plan })
            .eq('email', email);

        console.log('✅ Tenant provisioned:', nombreNegocio);

        return {
            tenant,
            usuario,
            rol,
            credenciales: {
                username,
                password,
                email
            }
        };

    } catch (error) {
        console.error('💥 Error provisioning tenant:', error);
        throw error;
    }
}

function getPrecio(plan, periodo) {
    const precios = {
        emprendedor: { mensual: 1200, anual: 960 },
        profesional: { mensual: 2500, anual: 2000 },
        enterprise: { mensual: 5000, anual: 4000 }
    };
    return precios[plan]?.[periodo] || 0;
}
