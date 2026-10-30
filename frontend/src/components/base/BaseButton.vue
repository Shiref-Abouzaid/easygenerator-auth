<template>
  <button
    :type="type"
    :disabled="loading"
    :aria-busy="loading"
    class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
  >
    <span
      v-if="loading"
      class="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
const { type = 'button', loading = false } = defineProps<{
  type?: 'button' | 'submit';
  loading?: boolean;
}>();
</script>
