<template>
    <div class="login-container">
        <div class="login-card">
            <h2>{{ $t('login.title') }}</h2>
            <p class="subtitle">{{ $t('login.subtitle') }}</p>

            <div v-if="authStore.error" class="error-alert">
                {{ authStore.error }}
            </div>

            <form @submit.prevent="handleSubmit">
                <div class="form-group">
                    <label for="email">{{ $t('login.email') }}</label>
                    <input id="email" v-model="email" type="email" placeholder="example@domain.com" required
                        :disabled="authStore.loading" />
                </div>

                <div class="form-group">
                    <label for="password">{{ $t('login.password') }}</label>
                    <input id="password" v-model="password" type="password" placeholder="••••••••" required
                        :disabled="authStore.loading" />
                </div>

                <button type="submit" :disabled="authStore.loading">
                    {{ authStore.loading ? $t('login.sign_in') : $t('login.title') }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const isDarkMode = ref<boolean>(false)
const authStore = useAuthStore()
const router = useRouter()
const { locale } = useI18n()

const email = ref('')
const password = ref('')

onMounted(() => {

    locale.value = 'es'
    localStorage.setItem('locale', 'es')


    isDarkMode.value = false
    document.documentElement.setAttribute('data-theme', 'light')

    if (authStore.isAuthenticated) {
        router.push({ name: 'dashboard' })
    }

})

const handleSubmit = async () => {
    const success = await authStore.login({
        email: email.value,
        password: password.value
    })

    if (success) {
        router.push({ name: 'dashboard' })
    }
}

</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    font-family: sans-serif;
}

.login-card {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

h2 {
    margin-bottom: 0.5rem;
    color: #1a202c;
}

.subtitle {
    color: #718096;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
}

.form-group {
    margin-bottom: 1.25rem;
    display: flex;
    flex-direction: column;
}

label {
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #4a5568;
}

input {
    padding: 0.65rem;
    border: 1px solid #cbd5e0;
    border-radius: 4px;
    font-size: 1rem;
}

input:focus {
    outline: none;
    border-color: #42b883;
    /* Verde Vue */
}

.error-alert {
    background-color: #fff5f5;
    color: #c53030;
    padding: 0.75rem;
    border-left: 4px solid #f56565;
    border-radius: 4px;
    margin-bottom: 1.25rem;
    font-size: 0.9rem;
}

button {
    width: 100%;
    padding: 0.75rem;
    background-color: #42b883;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

button:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
}
</style>
