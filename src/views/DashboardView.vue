<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2>{{ $t('dashboard.title') }}</h2>
      <p class="subtitle">{{ $t('dashboard.subtitle') }}</p>
    </div>

    <div v-if="loading" class="loading-state">
      {{ $t('dashboard.loading_metrics') }}
    </div>

    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>

    <div v-else class="stats-grid">
      <div class="stat-card total-users">
        <div class="card-icon">👥</div>
        <div class="card-info">
          <h3>{{ $t('dashboard.total_users') }}</h3>
          <p class="counter">{{ stats.total_users }}</p>
        </div>
      </div>

      <div class="stat-card admin-users">
        <div class="card-icon">🛡️</div>
        <div class="card-info">
          <h3>{{ $t('dashboard.admins') }}</h3>
          <p class="counter">{{ stats.admins_count }}</p>
        </div>
      </div>

      <div class="stat-card regular-users">
        <div class="card-icon">👤</div>
        <div class="card-info">
          <h3>{{ $t('dashboard.standards') }}</h3>
          <p class="counter">{{ stats.users_count }}</p>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <h3 style="color: #000;">{{ $t('dashboard.quick_actions') }}</h3>
      <div class="actions-box">
        <router-link to="/users" class="action-link-btn">
          {{ $t('dashboard.go_to_users') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

interface DashboardStats {
  total_users: number
  admins_count: number
  users_count: number
}

const stats = ref<DashboardStats>({
  total_users: 0,
  admins_count: 0,
  users_count: 0
})

const loading = ref<boolean>(true)
const error = ref<string | null>(null)

const fetchDashboardStats = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/dashboard-stats')
    stats.value = response.data
  } catch (err: any) {
    error.value = 'Failed to load dashboard metrics.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardStats()
})
</script>

<style scoped>
.stat-card,
.users-table {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  box-shadow: var(--card-shadow);
}

.counter,
.users-table td {
  color: var(--text-primary);
}

.subtitle,
.card-info h3 {
  color: var(--text-secondary);
}

.dashboard-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: sans-serif;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.subtitle {
  color: #666;
  margin-top: 0.25rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  box-shadow: var(--card-shadow);
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.card-icon {
  font-size: 2.5rem;
  background: #f0f4f8;
  padding: 0.75rem;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-info h3 {
  margin: 0;
  font-size: 1rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.counter {
  margin: 0.25rem 0 0 0;
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-primary);
}

.quick-actions {
  background: #f9fbfd;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
}

.actions-box {
  margin-top: 1rem;
}

.action-link-btn {
  display: inline-block;
  background: #3b82f6;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
}

.action-link-btn:hover {
  background: #2563eb;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #666;
}
</style>
