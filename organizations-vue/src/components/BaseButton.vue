<script setup lang="ts">
const { type = 'button', disabled = false } = defineProps<{
	type?: 'button' | 'submit'
	disabled?: boolean
}>()
</script>

<template>
	<button
		:type="type"
		:disabled="disabled"
		class="rounded-md border border-green-200 bg-green-100 px-6 py-2 text-green-700"
		:class="{
			'cursor-not-allowed opacity-50': disabled,
			'cursor-pointer': !disabled,
		}"
	>
		<slot />
	</button>
</template>
