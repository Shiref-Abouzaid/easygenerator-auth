<template>
  <AuthCard
    title="Create your account"
    subtitle="Sign up with your email and a strong password."
  >
    <form class="flex flex-col gap-4" novalidate @submit.prevent="submit">
      <BaseInput
        v-model="form.email"
        label="Email"
        type="email"
        autocomplete="email"
        :error="errors.email"
      />
      <BaseInput
        v-model="form.name"
        label="Name"
        autocomplete="name"
        :error="errors.name"
      />
      <BaseInput
        v-model="form.password"
        label="Password"
        type="password"
        autocomplete="new-password"
        :error="errors.password"
      />
      <BaseInput
        v-model="form.confirmPassword"
        label="Confirm password"
        type="password"
        autocomplete="new-password"
        :error="errors.confirmPassword"
      />
      <p
        v-if="formError"
        role="alert"
        class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
      >
        {{ formError }}
      </p>
      <BaseButton type="submit" :loading="isSubmitting">Sign up</BaseButton>
    </form>

    <template #footer>
      Already have an account?
      <RouterLink
        :to="{ name: 'sign-in' }"
        class="font-medium text-indigo-600 hover:underline"
      >
        Sign in
      </RouterLink>
    </template>
  </AuthCard>
</template>

<script setup lang="ts">
import AuthCard from '@/components/views/auth/AuthCard.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import { useSignUp } from '@/composables/useSignUp';

const { form, errors, formError, isSubmitting, submit } = useSignUp();
</script>
