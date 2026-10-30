<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
      <h1 class="text-2xl font-semibold text-slate-900">Welcome to the application.</h1>
      <div class="mt-6">
        <BaseButton @click="signOut">Log out</BaseButton>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import { useSignOut } from '@/composables/useSignOut';

const { signOut } = useSignOut();
</script>