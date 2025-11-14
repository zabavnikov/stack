<script setup lang="ts">
import type { Organization } from '../types.ts'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'
import { ref, computed, toRaw } from 'vue'
import { v7 as uuid } from 'uuid'

/**
 * Описываем события, которые компонент может эмитить наружу:
 * - created / updated — когда форма отправлена
 * - submit — событие факта отправки формы
 */
const emit = defineEmits<{
	(event: 'created' | 'updated', data: Organization): void
	(event: 'submit'): void
}>()

/**
 * Флаг режима редактирования.
 * Если true — форма работает как "редактировать".
 * Если false — как "создать".
 */
const isEdit = ref(false)

/**
 * Экспортируем методы наружу, чтобы родительский компонент мог:
 * - заполнить форму (setForm)
 * - сбросить форму (resetForm)
 * - узнать режим (isEdit)
 */
defineExpose({ setForm, resetForm, isEdit })

/** Состояние формы */
const form = ref<Organization>(formInitialState())

/**
 * Валидатор — проверяет, что ВСЕ поля заполнены.
 */
const isValid = computed(() => {
	const { name, directorFullName, tel, address } = form.value

	return (
		name.trim() &&
		directorFullName.trim() &&
		tel.trim() &&
		address.city.trim() &&
		address.street.trim() &&
		address.house.trim()
	)
})

/**
 * Отправка формы:
 * - Эмитим событие created или updated
 * - Эмитим submit
 */
function onSubmit() {
	emit(isEdit.value ? 'updated' : 'created', form.value)
	emit('submit')
}

/** Сброс формы в начальное состояние */
function resetForm() {
	form.value = formInitialState()
}

/** Начальное состояние формы организации */
function formInitialState(): Organization {
	return {
		id: uuid(),
		name: '',
		directorFullName: '',
		tel: '',
		address: {
			city: '',
			street: '',
			house: '',
		},
	}
}

/**
 * Заполнение формы данными извне.
 * Используется при редактировании.
 */
function setForm(data: Organization) {
	form.value = structuredClone(toRaw(data))
	isEdit.value = true
}
</script>

<template>
	<form class="space-y-4" @submit.prevent="onSubmit">
		<BaseInput v-model="form.name" placeholder="Название" />
		<BaseInput v-model="form.directorFullName" placeholder="ФИО директора" />
		<BaseInput v-model="form.tel" placeholder="Номер телефона" />
		<BaseInput v-model="form.address.city" placeholder="Город" />
		<BaseInput v-model="form.address.street" placeholder="Улица" />
		<BaseInput v-model="form.address.house" placeholder="Дом" />
		<BaseButton :disabled="!isValid" type="submit">
			{{ isEdit ? 'Сохранить' : 'Добавить' }}
		</BaseButton>
	</form>
</template>
