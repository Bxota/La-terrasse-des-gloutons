<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-6 md:p-8">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">
        Administration
      </h2>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="credentials.identifier"
            type="email"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            id="password"
            v-model="credentials.password"
            type="password"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          />
        </div>

        <Message v-if="authStore.error" severity="error" class="w-full">
          {{ authStore.error }}
        </Message>

        <div>
          <Button
            type="submit"
            :disabled="authStore.loading"
            class="w-full"
          >
              <span v-if="!authStore.loading">Se connecter</span>
              <i v-else class="pi pi-spin pi-spinner"></i>
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const credentials = ref({
  identifier: '',
  password: ''
})

const handleLogin = async () => {
  const success = await authStore.login(credentials.value)
  if (success) {
    navigateTo('/admin')
  }
}

// Add route middleware
definePageMeta({
  middleware: ['auth']
})
</script>