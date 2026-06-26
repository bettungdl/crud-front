<template>
  <div id="app-container">
    <nav v-if="authStore.isAuthenticated" class="navbar">
      <div class="nav-brand">
        <router-link to="/dashboard" style="text-decoration: none; color: inherit;">
          <strong>{{ appTitle }}</strong>
        </router-link>
      </div>

      <div class="nav-user-info">
        <select v-model="locale" @change="changeLanguage" class="select-lang">
          <option value="es">🇲🇽 ES</option>
          <option value="en">🇺🇸 EN</option>
        </select>

        <button @click="toggleTheme" class="btn-theme">
          {{ isDarkMode ? $t('navbar.light') : $t('navbar.dark') }}
        </button>

        <span class="user-name">{{ $t('navbar.welcome') }}, {{ authStore.user?.name }}</span>
        <button @click="handleLogout" class="logout-btn">{{ $t('navbar.logout') }}</button>
      </div>
    </nav>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { RouterView, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const appTitle = import.meta.env.VITE_APP_TITLE || 'CRUD Panel'

const authStore = useAuthStore()
const router = useRouter()
const isDarkMode = ref<boolean>(false)
const { locale } = useI18n()

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  const theme = isDarkMode.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

const changeLanguage = () => {
  localStorage.setItem('locale', locale.value)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    isDarkMode.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    isDarkMode.value = false
    document.documentElement.setAttribute('data-theme', 'light')
  }
})

const handleLogout = async () => {
  await authStore.logout()
  router.push({ name: 'login' })
}

</script>

<style></style>
