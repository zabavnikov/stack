import type { Organization, TableHeading } from '../types.ts'
import { computed, ref } from 'vue'
import { data } from '../data.ts'

export function useOrganizationTable() {
	const clonedData = ref(structuredClone(data))

	const searchQuery = ref('')

	const headings: TableHeading<Organization>[] = [
		{ key: 'name', label: 'Название', sortable: true },
		{ key: 'directorFullName', label: 'ФИО директора', sortable: true },
		{ key: 'tel', label: 'Номер телефона' },
		{ key: 'address', label: 'Адрес' },
	]

	const items = computed<Organization[]>(() => {
		// Фильтрация происходит по ФИО директора, без учёта регистра.
		if (searchQuery.value.length > 0) {
			return clonedData.value.filter(item => item.directorFullName.toLowerCase().includes(searchQuery.value.toLowerCase()))
		}

		return clonedData.value
	})

	/**
	 * Удаление строки по индексу с подтверждением.
	 * @param item
	 */
	function doDelete(item: Organization) {
		if (!confirm('Подтвердите удаление')) return

		const originalIndex = clonedData.value.indexOf(item)

		if (originalIndex !== -1) {
			clonedData.value.splice(originalIndex, 1)
		}
	}

	/**
	 * Добавление организации в начало списка.
	 * @param value
	 */
	function doPrepend(value: Organization) {
		clonedData.value.unshift(value)
	}

	return {
		headings,
		items,
		searchQuery,
		doDelete,
		doPrepend,
	}
}