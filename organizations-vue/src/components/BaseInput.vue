<script setup lang="ts">
const { type = 'text'} = defineProps<{
	placeholder?: string
	type?: 'text' | 'search'
}>()

const value = defineModel<string>({
	default: ''
})
</script>

<template>
  <input
		v-model="value"
		:type="type"
		:placeholder="placeholder"
		class="border border-neutral-200 p-2 rounded-md w-full"
	>
</template>