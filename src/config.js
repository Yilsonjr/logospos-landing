/* ========================================
   LOGOS POS — Configuration
   ======================================== */

// Supabase (same project as POS)
export const SUPABASE_URL = 'https://lvijusbqkkxdgcbqmupe.supabase.co';
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2aWp1c2Jxa2t4ZGdjYnFtdXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMTU0NTksImV4cCI6MjA4Nzc5MTQ1OX0.P91meRFUyUxquSs7MDH4YUr7QDEZhflTbFk6Fsay5eo';

// Stripe (test keys - replace with live keys for production)
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_PLACEHOLDER';

// NOWPayments (live)
export const NOWPAYMENTS_API_KEY = 'NJM2T7H-XTG4XP6-MS2F6MR-1DZMJG5';
export const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

// POS URLs per product
export const POS_APP_URL = 'https://app.logospos.com';
export const POS_FOOD_URL = 'https://food.logospos.com';

// Products — two verticals, same pricing tiers, different features & redirect
export const PRODUCTOS = {
    pos_general: {
        slug: 'pos_general',
        nombre: 'POS General',
        subtitulo: 'Retail, Tiendas, Farmacias',
        icon: 'bi-shop',
        app_url: 'https://app.logospos.com',
        planes: {
            emprendedor: {
                incluidos: ['1 usuario', 'Punto de Venta rápido', 'Hasta 500 productos', 'Gestión de clientes', 'Caja (apertura/cierre)', 'Dashboard básico', 'Modo offline'],
                excluidos: ['Facturación fiscal (DGII)', 'Cuentas por cobrar/pagar', 'Multi-sucursal']
            },
            profesional: {
                incluidos: ['Hasta 5 usuarios', 'Todo del Emprendedor', 'Productos ilimitados', 'Compras y proveedores', 'Facturación fiscal (NCF/DGII)', 'Reportes DGII (606/607/608)', 'Cuentas por cobrar', 'Roles y permisos (3 roles)', 'Hasta 3 sucursales', 'Margen de ganancia'],
                excluidos: []
            },
            enterprise: {
                incluidos: ['Usuarios ilimitados', 'Todo del Profesional', 'Sucursales ilimitadas', 'Roles ilimitados', 'Cuentas por cobrar y pagar', 'Estado de cuenta clientes', 'API de integración', 'Soporte prioritario 24/7', 'Personalización de marca', 'Onboarding dedicado'],
                excluidos: []
            }
        }
    },
    pos_food: {
        slug: 'pos_food',
        nombre: 'Restaurante / Billar',
        subtitulo: 'Comandas, Mesas, Cocina',
        icon: 'bi-egg-fried',
        app_url: 'https://food.logospos.com',
        planes: {
            emprendedor: {
                incluidos: ['1 usuario', 'Comandas por mesa', 'Hasta 10 mesas', 'Menú digital', 'Caja (apertura/cierre)', 'Dashboard básico', 'Modo offline'],
                excluidos: ['Display de cocina (KDS)', 'División de cuenta', 'Multi-local']
            },
            profesional: {
                incluidos: ['Hasta 5 usuarios', 'Todo del Emprendedor', 'Mesas ilimitadas', 'Display de cocina (KDS)', 'División de cuenta', 'Propinas y cortesías', 'Reportes de meseros', 'Módulo de billar', 'Hasta 2 sucursales', 'Facturación fiscal (NCF)'],
                excluidos: []
            },
            enterprise: {
                incluidos: ['Usuarios ilimitados', 'Todo del Profesional', 'Multi-local ilimitado', 'Reservaciones online', 'Roles ilimitados', 'Reportes DGII (606/607/608)', 'API de integración', 'Soporte prioritario 24/7', 'Personalización de marca', 'Onboarding dedicado'],
                excluidos: []
            }
        }
    }
};

// Plans configuration
export const PLANES = {
    emprendedor: {
        slug: 'emprendedor',
        nombre: 'Emprendedor',
        descripcion: 'Para negocios que están empezando',
        icon: 'bi-rocket-takeoff',
        precios: {
            mensual: 1200,
            anual: 960
        },
        ahorro_anual: 2880,
        features: [
            '1 usuario',
            'Punto de Venta',
            'Hasta 500 productos',
            'Gestión de clientes',
            'Caja (apertura/cierre)',
            'Dashboard básico',
            'Modo offline'
        ],
        max_usuarios: 1,
        max_productos: 500
    },
    profesional: {
        slug: 'profesional',
        nombre: 'Profesional',
        descripcion: 'Para negocios en crecimiento',
        icon: 'bi-stars',
        popular: true,
        precios: {
            mensual: 2500,
            anual: 2000
        },
        ahorro_anual: 6000,
        features: [
            'Hasta 5 usuarios',
            'Todo del Emprendedor',
            'Productos ilimitados',
            'Compras y proveedores',
            'Facturación fiscal (NCF/DGII)',
            'Reportes DGII (606/607/608)',
            'Cuentas por cobrar',
            'Roles y permisos (3 roles)',
            'Hasta 3 sucursales',
            'Margen de ganancia'
        ],
        max_usuarios: 5,
        max_productos: null
    },
    enterprise: {
        slug: 'enterprise',
        nombre: 'Enterprise',
        descripcion: 'Para empresas grandes',
        icon: 'bi-building',
        precios: {
            mensual: 5000,
            anual: 4000
        },
        ahorro_anual: 12000,
        features: [
            'Usuarios ilimitados',
            'Todo del Profesional',
            'Sucursales ilimitadas',
            'Roles ilimitados',
            'Cuentas por cobrar y pagar',
            'Estado de cuenta clientes',
            'API de integración',
            'Soporte prioritario 24/7',
            'Personalización de marca',
            'Onboarding dedicado'
        ],
        max_usuarios: null,
        max_productos: null
    }
};

// All permissions for Super Admin role
export const PERMISOS_SUPER_ADMIN = [
    'dashboard.ver',
    'inventario.ver', 'inventario.crear', 'inventario.editar', 'inventario.eliminar', 'inventario.exportar',
    'proveedores.ver', 'proveedores.crear', 'proveedores.editar', 'proveedores.eliminar',
    'clientes.ver', 'clientes.crear', 'clientes.editar', 'clientes.eliminar',
    'ventas.ver', 'ventas.crear', 'ventas.cancelar', 'ventas.historial', 'ventas.exportar',
    'caja.ver', 'caja.abrir', 'caja.cerrar', 'caja.movimientos', 'caja.arqueo', 'caja.historial',
    'cuentas.ver', 'cuentas.pagos', 'cuentas.recordatorios', 'cuentas.exportar',
    'usuarios.ver', 'usuarios.crear', 'usuarios.editar', 'usuarios.eliminar',
    'roles.ver', 'roles.crear', 'roles.editar', 'roles.eliminar',
    'reportes.ventas', 'reportes.inventario', 'reportes.caja', 'reportes.clientes',
    'config.general', 'config.backup', 'config.logs'
];
