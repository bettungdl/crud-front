<template>
    <div class="users-container">
        <div class="header-actions">
            <h2>{{ $t('user.title') }}</h2>
            <button v-if="authStore.userRole === 'Admin'" @click="openModal" class="btn-primary">
                {{ $t('user.new_user') }}
            </button>
        </div>

        <div v-if="loading" class="loading-state">
            {{ $t('user.loading_users') }}
        </div>

        <div v-else-if="error" class="error-state">
            {{ error }}
        </div>

        <div v-else class="table-responsive">
            <table class="users-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>{{ $t('user.name') }}</th>
                        <th>{{ $t('user.email') }}</th>
                        <th>{{ $t('user.role') }}</th>
                        <th>{{ $t('user.actions') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                            <span class="role-badge">
                                {{ user.role?.name || $t('user.no_role') }}
                            </span>
                        </td>
                        <td class="actions-cell">
                            <div v-if="authStore.userRole === 'Admin'" class="actions-wrapper">
                                <button @click="openEditModal(user)" class="btn-edit">{{ $t('user.edit') }}</button>
                                <button @click="handleDeleteUser(user.id)" class="btn-delete">{{ $t('user.delete')
                                }}</button>
                            </div>

                            <span v-else class="text-muted">{{ $t('user.not_allowed') }}</span>
                        </td>
                    </tr>
                    <tr v-if="users.length === 0">
                        <td colspan="5" class="empty-table">{{ $t('user.no_users') }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal-card">
                <div class="modal-header">
                    <h3>{{ isEditing ? $t('user.edit_user') : $t('user.create_user') }}</h3>
                    <button @click="closeModal" class="btn-close">{{ $t('user.close') }}</button>
                </div>

                <div v-if="formError" class="form-error-alert">
                    {{ formError }}
                </div>

                <form @submit.prevent="handleSubmitForm">
                    <div class="form-group">
                        <label for="new-name">{{ $t('user.full_name') }}</label>
                        <input id="new-name" v-model="form.name" type="text" placeholder="John Doe" required />
                    </div>

                    <div class="form-group">
                        <label for="new-email">{{ $t('login.email') }}</label>
                        <input id="new-email" v-model="form.email" type="email" placeholder="john@example.com"
                            required />
                    </div>

                    <div class="form-group">
                        <label for="new-password">{{ $t('login.password') }}</label>
                        <input id="new-password" v-model="form.password" type="password"
                            :placeholder="$t('user.minimum_password')" required />
                    </div>

                    <div class="form-group">
                        <label for="new-role">{{ $t('user.assigned_role') }}</label>
                        <select id="new-role" v-model="form.role_id" required>
                            <option value="" disabled>{{ $t('user.select_role') }}</option>
                            <option v-for="role in roles" :key="role.id" :value="role.id">
                                {{ role.name }}
                            </option>
                        </select>
                    </div>

                    <div class="modal-footer">
                        <button type="button" @click="closeModal" class="btn-secondary" :disabled="formLoading">
                            {{ $t('user.cancel') }}
                        </button>
                        <button type="submit" class="btn-save" :disabled="formLoading">
                            {{ formLoading ? $t('user.saving') : $t('user.save') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

interface Role {
    id: number
    name: string
}

interface User {
    id: number
    name: string
    email: string
    role_id: number
    role?: Role
}

const users = ref<User[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

const showModal = ref<boolean>(false)
const formLoading = ref<boolean>(false)
const formError = ref<string | null>(null)
const roles = ref<Role[]>([])

const isEditing = ref<boolean>(false)
const currentUserId = ref<number | null>(null)

const form = ref({
    name: '',
    email: '',
    password: '',
    role_id: '' as number | ''
})

const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
        const response = await api.get('/users')
        users.value = response.data
    } catch (err: any) {
        error.value = 'Failed to load users.'
        console.error(err)
    } finally {
        loading.value = false
    }
}

const fetchRoles = async () => {
    try {
        const response = await api.get('/roles')
        roles.value = response.data
    } catch (err) {
        console.error('Could not fetch roles from backend, setting fallback roles.')
    }
}

const openModal = () => {
    isEditing.value = false
    currentUserId.value = null
    showModal.value = true
}

const openEditModal = (user: User) => {
    isEditing.value = true
    currentUserId.value = user.id

    form.value = {
        name: user.name,
        email: user.email,
        password: '',
        role_id: user.role_id
    }
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    formError.value = null
    isEditing.value = false
    currentUserId.value = null
    form.value = {
        name: '',
        email: '',
        password: '',
        role_id: ''
    }
}

const handleCreateUser = async () => {
    formLoading.value = true
    formError.value = null
    try {
        const response = await api.post('/users', form.value)
        const newUser = response.data
        users.value.push(newUser)
        closeModal()
    } catch (err: any) {
        if (err.response && err.response.data && err.response.data.message) {
            formError.value = err.response.data.message
        } else {
            formError.value = 'An error occurred while creating the user.'
        }
    } finally {
        formLoading.value = false
    }
}

const handleSubmitForm = async () => {
    if (!isEditing.value) {
        await handleCreateUser()
        return
    }

    if (isEditing.value && currentUserId.value) {
        formLoading.value = true
        formError.value = null
        try {
            const response = await api.put(`/users/${currentUserId.value}`, form.value)

            const index = users.value.findIndex(u => u.id === currentUserId.value)
            if (index !== -1) {
                users.value[index] = response.data
            }
            closeModal()
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                formError.value = err.response.data.message
            } else {
                formError.value = 'An error occurred while updating the user.'
            }
        } finally {
            formLoading.value = false
        }
    }
}

const handleDeleteUser = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            await api.delete(`/users/${id}`)
            users.value = users.value.filter(u => u.id !== id)
        } catch (err: any) {
            alert(err.response?.data?.message || 'Could not delete user.')
            console.error(err)
        }
    }
}

onMounted(() => {
    fetchUsers()
    fetchRoles()
})
</script>

<style scoped>
.users-container {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

h2 {
    color: #2d3748;
}

.btn-primary {
    background-color: #42b883;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
}

.btn-primary:hover {
    background-color: #3aa373;
}

.loading-state,
.error-state {
    text-align: center;
    padding: 2rem;
    color: #718096;
}

.error-state {
    color: #e53e3e;
}

.table-responsive {
    width: 100%;
    overflow-x: auto;
}

.users-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    background-color: var(--bg-surface);
    border: 1px solid var(--border-color);
    box-shadow: var(--card-shadow);
}

.users-table th,
.users-table td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #edf2f7;
}

.users-table th {
    background-color: #f7fafc;
    color: #4a5568;
    font-weight: 600;
}

.role-badge {
    display: inline-block;
    background-color: #ebf8ff;
    color: #2b6cb0;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 500;
}

.actions-cell {
    vertical-align: middle;
    gap: 0.5rem;
}

.actions-wrapper {
    display: flex;
    gap: 0.5rem;
}

.btn-edit {
    background-color: #ecc94b;
    color: #744210;
    border: none;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
}

.btn-delete {
    background-color: #fed7d7;
    color: #9b2c2c;
    border: none;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
}

.empty-table {
    text-align: center;
    color: #a0aec0;
    padding: 2rem;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-card {
    background: white;
    width: 100%;
    max-width: 500px;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.btn-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #a0aec0;
}

.btn-close:hover {
    color: #4a5568;
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

input,
select {
    padding: 0.65rem;
    border: 1px solid #cbd5e0;
    border-radius: 4px;
    font-size: 1rem;
    width: 100%;
}

input:focus,
select:focus {
    outline: none;
    border-color: #42b883;
}

.form-error-alert {
    background-color: #fff5f5;
    color: #c53030;
    padding: 0.75rem;
    border-left: 4px solid #f56565;
    border-radius: 4px;
    margin-bottom: 1.25rem;
    font-size: 0.9rem;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.75rem;
}

.btn-secondary {
    background-color: #e2e8f0;
    color: #4a5568;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
}

.btn-secondary:hover {
    background-color: #cbd5e0;
}

.btn-save {
    background-color: #42b883;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
}

.btn-save:hover {
    background-color: #3aa373;
}
</style>
