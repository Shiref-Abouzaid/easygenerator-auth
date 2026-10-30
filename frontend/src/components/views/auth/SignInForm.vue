<template>
  <AuthCard title="Welcome back" subtitle="Sign in to continue.">
    <form class="flex flex-col gap-4" novalidate @submit.prevent="submit">
      <BaseInput
        v-model="form.email"
        label="Email"
        type="email"
        autocomplete="email"
        :error="errors.email"
      />
      <BaseInput
        v-model="form.password"
        label="Password"
        type="password"
        autocomplete="current-password"
        :error="errors.password"
      />
      <p v-if="formError" role="alert" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
        {{ formError }}
      </p>
      <BaseButton type="submit" :loading="isSubmitting">Sign in</BaseButton>
    </form>

    <template #footer>
      Don't have an account?
      <RouterLink :to="{ name: 'sign-up' }" class="font-medium text-indigo-600 hover:underline">
        Sign up
      </RouterLink>
    </template>
  </AuthCard>
</template>

<script setup lang="ts">
import AuthCard from '@/components/views/auth/AuthCard.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import { useSignIn } from '@/composables/useSignIn';

const { form, errors, formError, isSubmitting, submit } = useSignIn();
</script>