<script setup lang="ts" generic="T extends Record<string, any>">
import type { TableHeading, SortOrder } from '../types.ts'
import { ref, computed } from 'vue'

type Slots = { [K in keyof T]?: (slotProps: { data: T[K] }) => any } & {
	actions: (slotProps: { item: T }) => any
}

const { items, headings } = defineProps<{
	headings: TableHeading<T>[]
	items: T[]
}>()

defineSlots<Slots>()

const emit = defineEmits<{
	(event: 'cell-click', data: T): void
}>()

const sortKey = ref<keyof T | null>(null)
const sortOrder = ref<SortOrder>('asc')

// Вычисляемый список элементов с применённой сортировкой
const sortedItems = computed<T[]>(() => {
	// Если ключ сортировки не выбран — возвращаем исходный список без изменений
	if (!sortKey.value) return items

	// Создаём отсортированную копию массива (не мутируем оригинал)
	return items.toSorted((a: T, b: T) => {
		// Получаем значения для сравнения по текущему ключу сортировки
		const aValue = a[sortKey.value as keyof T]
		const bValue = b[sortKey.value as keyof T]

		// Сравниваем строки с помощью localeCompare:
		// → если порядок ASC — сравниваем a с b
		// → если DESC — меняем местами для обратной сортировки
		// aValue, bValue приводим к строке, чтобы было доступно свойство localeCompare,
		// для сортировки по числовым полям, например по ID.
		return sortOrder.value === 'asc'
			? `${aValue}`.localeCompare(`${bValue}`)
			: `${bValue}`.localeCompare(`${aValue}`)
	})
})

/**
 * Сортирует таблицу по указанному столбцу.
 *
 * Логика работы:
 * - Если сортировка уже была по этому ключу → переключает направление (asc ↔ desc)
 * - Если кликнули по новому ключу → устанавливает его как активный и сортирует по возрастанию (asc)
 *
 * @param key – имя поля объекта T, по которому выполняется сортировка
 */
function doSort(key: keyof T) {
	if (sortKey.value === key) {
		// Переключаем порядок сортировки при повторном клике
		sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
	} else {
		// Устанавливаем новый ключ сортировки и сбрасываем порядок на ASC
		sortKey.value = key
		sortOrder.value = 'asc'
	}
}
</script>

<template>
	<table class="min-w-6xl border-collapse">
		<thead>
			<tr>
				<th
					v-for="heading in headings"
					:key="heading.key"
					class="border border-neutral-200 p-4"
				>
					<button
						v-if="heading?.sortable"
						type="button"
						class="cursor-pointer"
						@click="doSort(heading.key)"
					>
						{{ heading.label }}
						<span v-if="sortKey === heading.key">
							{{ sortOrder === 'asc' ? '▲' : '▼' }}
						</span>
					</button>

					<span v-else>{{ heading.label }}</span>
				</th>
				<th v-if="$slots?.actions" class="border border-neutral-200 p-4">
					Действия
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="item in sortedItems" :key="JSON.stringify(item)">
				<td
					v-for="(heading, cellIndex) in headings"
					:key="`cell-${heading.key as string}-${cellIndex}`"
					class="border border-neutral-200 p-4"
					@click="emit('cell-click', item)"
				>
					<slot :name="heading.key" :data="item[heading.key]">
						{{ item[heading.key] }}
					</slot>
				</td>
				<td v-if="$slots?.actions" class="border border-neutral-200 p-4">
					<slot name="actions" :item="item" />
				</td>
			</tr>
		</tbody>
	</table>
	<p v-if="items.length === 0" class="text-center">Нет данных</p>
</template>
