import type { Organization, TableHeading } from '../types.ts'
import { computed, ref } from 'vue'
import { data } from '../data.ts'

export function useOrganizationTable() {
	// Локальная реактивная копия исходных данных.
	// Нужна для возможности изменять таблицу (удаления, обновления, добавления).
	const clonedData = ref(structuredClone(data))

	// Строка поиска по ФИО директора.
	const searchQuery = ref('')

	// Описание колонок таблицы.
	// Используется для рендеринга заголовков и сортировки.
	const headings: TableHeading<Organization>[] = [
		{ key: 'name', label: 'Название', sortable: true },
		{ key: 'directorFullName', label: 'ФИО директора', sortable: true },
		{ key: 'tel', label: 'Номер телефона' },
		{ key: 'address', label: 'Адрес' },
	]

	// Список элементов таблицы с реактивной фильтрацией.
	// Фильтрация работает по ФИО директора, без учёта регистра.
	const items = computed<Organization[]>(() => {
		if (searchQuery.value.length > 0) {
			return clonedData.value.filter((item) =>
				item.directorFullName
					.toLowerCase()
					.includes(searchQuery.value.toLowerCase()),
			)
		}

		return clonedData.value
	})

	/**
	 * Удаляет организацию из списка.
	 * Показывает диалог подтверждения.
	 * @param item — организация, которую нужно удалить
	 */
	function doDelete(item: Organization) {
		if (!confirm('Подтвердите удаление')) return

		// Находим индекс элемента в реактивном массиве
		const originalIndex = clonedData.value.indexOf(item)

		// Если найден — удаляем
		if (originalIndex !== -1) {
			clonedData.value.splice(originalIndex, 1)
		}
	}

	/**
	 * Обновляет существующую организацию по совпадению ID.
	 * @param item — объект с новыми данными
	 */
	function doUpdate(item: Organization) {
		const originalIndex = clonedData.value.findIndex((i) => i.id === item.id)

		if (originalIndex !== -1) {
			clonedData.value[originalIndex] = item
		}
	}

	/**
	 * Добавляет новую организацию в начало списка.
	 * @param value — новая организация
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
		doUpdate,
	}
}
