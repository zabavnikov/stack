import type { TableHeading } from '../types.ts'

interface Table<T> {
	setItems: (newItems: T[]) => void
	prependItem: (item: T) => void
	renderTable: () => void
}

export function createTable<T extends Record<string, unknown>>(
	slotName: string,
	headings: TableHeading<T>[],
	options?: {
		onDelete?: (rowIndex: number) => void,
	}
): Table<T> {
	const slot = document.querySelector(slotName)
	let items: T[] = []

	renderTable()

	function renderTable(): void {
		if (!slot) return

		slot.innerHTML = `
			<table class="border-collapse min-w-6xl">
				${theadTemplate(headings)}
				${tbodyTemplate(items)}
			</table>
		`

		if (items.length === 0) {
			slot.innerHTML += `<p class="text-center mt-4 text-gray-500">Нет данных</p>`
		}
	}

	function setItems(newItems: T[]): void {
		items = newItems
		renderTable()
	}

	function prependItem(item: T): void {
		items.unshift(item)
		renderTable()
	}

	function theadTemplate(headings: TableHeading<T>[]): string {
		const th = headings
			.map(
				(heading) =>
					`<th class="border border-neutral-200 p-4 font-medium text-left">${heading.label}</th>`,
			)
			.join('')

		return `
			<thead>
				<tr>${th}</tr>
			</thead>
		`
	}

	function tbodyTemplate(items: T[]): string {
		return `
			<tbody>
				${items
			.map(
				(item, rowIndex) =>
					`<tr data-row="${rowIndex}">${tdTemplate(item, rowIndex)}</tr>`,
			)
			.join('')}
			</tbody>
		`
	}

	function tdTemplate(item: T, rowIndex: number): string {
		function td(value: unknown): string {
			if (typeof value === 'object' && value !== null) {
				return `<td class="border border-neutral-200 p-4">${Object.values(value).join(', ')}</td>`
			}
			return `<td class="border border-neutral-200 p-4">${String(value)}</td>`
		}

		return [
			...Object.values(item).map((value) => td(value)),
			`<td class="border border-neutral-200 p-4">
				<button type="button" class="text-red-500 hover:text-red-700" data-delete="${rowIndex}">
					Удалить
				</button>
			</td>`,
		].join('')
	}

	// Добавляем обработчики после рендера
	slot?.addEventListener('click', (event) => {
		const target = event.target as HTMLElement

		if (target.matches('button[data-delete]')) {
			const index = Number(target.getAttribute('data-delete'))

			if (index >= 0 && confirm('Подтвердите удаление')) {
				options?.onDelete?.(index)
			}
		}
	})

	return {
		setItems,
		prependItem,
		renderTable,
	}
}
