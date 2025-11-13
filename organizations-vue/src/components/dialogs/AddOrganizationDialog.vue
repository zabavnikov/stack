<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import BaseButton from '../BaseButton.vue'
import BaseInput from '../BaseInput.vue'
import type { Organization } from '../../types.ts'

defineSlots<{
	trigger: (props: { open: boolean, toggle: () => void }) => any
}>()

const emit = defineEmits<{
	(event: 'submit', data: Organization): void
}>()

const open = ref(false)
const form = ref<Organization>(formInitialState())

/** Проверяем, что все поля заполнены */
const isValid = computed(() => {
	let emptyFields = 0

	const fields = Object.values(form.value)

	fields.forEach(field => {
		// Если поле является объектом,
		// то проверим, что вложенные поля не пустые.
		if (field && typeof field === 'object') {
			Object.values(field).forEach(value => {
				if (value.trim() === '') emptyFields++
			})
		} else if (typeof field === 'string') {
			if (field.trim() === '') emptyFields++
		}
	})

	return emptyFields === 0
})

onMounted(() => document.addEventListener('keydown', closeByEsc))
onUnmounted(() => document.removeEventListener('keydown', closeByEsc))

watch(open, (value) => {
	if (!value) resetForm()
})

function closeByEsc(event: KeyboardEvent) {
	if (event.key === 'Escape') open.value = false
}

function onSubmit() {
	emit('submit', form.value)
	open.value = false
}

function toggle() {
	open.value = !open.value
}

function resetForm() {
	form.value = formInitialState()
}

function formInitialState(): Organization {
	return {
		name: '',
		directorFullName: '',
		tel: '',
		address: {
			city: '',
			street: '',
			house: '',
		}
	}
}
</script>

<template>
	<div>
		<slot name="trigger" :open="open" :toggle="toggle" />
		<Teleport to="body">
			<div v-if="open" class="fixed inset-0 bg-slate-600/70 flex items-center justify-center">
				<div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
					<div class="flex justify-between items-center mb-6">
						<h2 class="text-2xl">Добавить организацию</h2>
						<button @click="open = false" class="cursor-pointer">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
						</button>
					</div>

					<form class="space-y-4" @submit.prevent="onSubmit">
						<BaseInput v-model="form.name" placeholder="Название" />
						<BaseInput v-model="form.directorFullName" placeholder="ФИО директора" />
						<BaseInput v-model="form.tel" placeholder="Номер телефона" />
						<BaseInput v-model="form.address.city" placeholder="Город" />
						<BaseInput v-model="form.address.street" placeholder="Улица" />
						<BaseInput v-model="form.address.house" placeholder="Дом" />
						<BaseButton :disabled="!isValid" type="submit">Добавить</BaseButton>
					</form>
				</div>
			</div>
		</Teleport>
	</div>
</template>