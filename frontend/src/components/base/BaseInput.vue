<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="text-sm font-medium text-slate-700">{{
      label
    }}</label>
    <input
      :id="id"
      v-model="model"
      :type="type"
      :autocomplete="autocomplete"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      class="rounded-lg border px-3 py-2 text-slate-900 transition outline-none focus:ring-2"
      :class="
        error
          ? 'border-red-500 focus:ring-red-200'
          : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
      "
    />
    <p v-if="error" :id="`${id}-error`" class="text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue';

const {
  label,
  type = 'text',
  autocomplete = 'off',
  error = '',
} = defineProps<{
  label: string;
  type?: 'text' | 'email' | 'password';
  autocomplete?: string;
  error?: string;
}>();

const model = defineModel<string>({ required: true });
const id = useId();
</script>
