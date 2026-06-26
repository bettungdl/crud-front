import { createI18n } from 'vue-i18n'

const messages = {
    en: {
        navbar: {
            welcome: 'Welcome',
            logout: 'Logout',
            light: '☀️ Light',
            dark: '🌙 Dark',
        },
        login: {
            title: 'Sign In',
            subtitle: 'Enter your credentials to access the CRUD panel',
            email: 'Email Address',
            password: 'Password',
            submit: 'Login',
            sign_in: 'Signing in...'
        },
        dashboard: {
            title: 'Dashboard Overview',
            subtitle: 'Welcome back! Here is system status at a glance.',
            total_users: 'Total Users',
            admins: 'Administrators',
            standards: 'Standard Users',
            quick_actions: 'Quick Actions',
            go_to_users: 'Go to Users Management →',
            loading_metrics: 'Loading metrics...'
        },
        user: {
            title: 'Users Management',
            new_user: 'Add New User',
            loading_users: 'Loading Users',
            name: 'Name',
            email: 'Email',
            role: 'Role',
            no_role: 'No Role',
            actions: 'Actions',
            edit: 'Edit',
            delete: 'Delete',
            not_allowed: 'Not Allowed',
            no_users: 'No users found.',
            edit_user: 'Edit User',
            create_user: 'Create New User',
            close: 'Close',
            full_name: 'Full Name',
            email_address: 'Email Address',
            select_role: 'Select a role...',
            cancel: 'Cancel',
            saving: 'Saving...',
            save: 'Save User',
            assigned_role: 'Assigned Role',
            minimum_password: 'Minimum 6 characters',
        }
    },
    es: {
        navbar: {
            welcome: 'Bienvenido',
            logout: 'Cerrar Sesión',
            light: '☀️ Claro',
            dark: '🌙 Oscuro',
        },
        login: {
            title: 'Iniciar Sesión',
            subtitle: 'Ingresa tus credenciales para acceder al panel CRUD',
            email: 'Correo Electrónico',
            password: 'Contraseña',
            submit: 'Ingresar',
            sign_in: 'Iniciando sesión...'
        },
        dashboard: {
            title: 'Vista General del Dashboard',
            subtitle: '¡Bienvenido de vuelta! Aquí está el estado del sistema.',
            total_users: 'Usuarios Totales',
            admins: 'Administradores',
            standards: 'Usuarios Estándar',
            quick_actions: 'Acciones Rápidas',
            go_to_users: 'Ir a Gestión de Usuarios →',
            loading_metrics: 'Cargando métricas...'
        },
        user: {
            title: 'Gestión de Usuarios',
            new_user: 'Agregar Nuevo Usuario',
            loading_users: 'Cargando Usuarios...',
            name: 'Nombre',
            email: 'Email',
            role: 'Rol',
            no_role: 'No Hay Rol',
            actions: 'Acciones',
            edit: 'Editar',
            delete: 'Eliminar',
            not_allowed: 'No Permitido',
            no_users: 'No se encontraron usuarios.',
            edit_user: 'Editar Usuario',
            create_user: 'Crear Nuevo Usuario',
            close: 'Cerrar',
            full_name: 'Nombre Completo',
            email_address: 'Correo Electrónico',
            select_role: 'Seleccionar Rol...',
            cancel: 'Cancelar',
            saving: 'Guardando Usuario...',
            save: 'Guardar Usuario',
            assigned_role: 'Rol Asignado',
            minimum_password: 'Mínimo 6 caracteres',
        }
    }
}

const savedLocale = localStorage.getItem('locale') || 'es'

export const i18n = createI18n({
    legacy: false,
    locale: savedLocale,
    fallbackLocale: 'en',
    messages,
})