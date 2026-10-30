<template>
  <main class="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
    <div class="w-full max-w-sm">
      <div class="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 class="text-2xl font-semibold text-slate-900">{{ title }}</h1>
        <p class="mt-1 text-sm text-slate-500">{{ subtitle }}</p>
        <div class="mt-6">
          <slot />
        </div>
      </div>
      <p class="mt-6 text-center text-sm text-slate-600">
        <slot name="footer" />
      </p>
      <p class="mt-8 text-center text-xs text-slate-400">
        Technical assessment project. Not an official Easygenerator product.
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle: string }>();
</script>