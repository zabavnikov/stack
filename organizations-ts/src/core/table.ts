import type { TableHeading, SortOrder } from '../types.ts'

/**
 * Публичный интерфейс таблицы.
 */
interface Table<T> {
	setItems: (newItems: T[]) => void
	prependItem: (item: T) => void
	renderTable: () => void
}

/**
 * Функция создаёт таблицу и полностью управляет её состоянием:
 * — рендер
 * — сортировка
 * — обновление данных
 * — удаление через обработчики
 */
export function createTable<T extends Record<string, any>>(
	slotName: string,
	headings: TableHeading<T>[],
	options?: {
		onDelete?: (uuid: string) => void
		onCellClick?: (item: T) => void
	},
): Table<T> {
	/** DOM-элемент, куда будет отрисована таблица */
	const slot = document.querySelector(slotName)

	/** Текущий набор данных */
	let items: T[] = []

	/**
	 * Состояние сортировки:
	 * — key: по какому полю сортируем
	 * — direction: asc/desc
	 */
	let sortState: {
		key: keyof T | null
		direction: SortOrder
	} = { key: null, direction: 'asc' }

	// Первый рендер
	renderTable()

	/**
	 * Основная функция отрисовки таблицы.
	 * Полностью пересобирает HTML каждый раз.
	 */
	function renderTable(): void {
		if (!slot) return

		slot.innerHTML = `
			<table class="border-collapse min-w-6xl">
				${theadTemplate()}
				${tbodyTemplate()}
			</table>
		`

		// Когда нет данных — показываем сообщение
		if (items.length === 0) {
			slot.innerHTML += `<p class="text-center mt-4 text-gray-500">Нет данных</p>`
		}

		// Активируем обработчики сортировки
		attachSortingHandlers()
		attachCellClickHandlers()
	}

	/**
	 * Заменяет весь список элементов.
	 * После этого — сортируем и перерисовываем.
	 */
	function setItems(newItems: T[]): void {
		items = newItems
		applySorting()
		renderTable()
	}

	/**
	 * Добавление нового элемента в начало таблицы.
	 */
	function prependItem(item: T): void {
		items.unshift(item)
		applySorting()
		renderTable()
	}

	/**
	 * Формирование заголовка <thead>.
	 * Добавляем стрелочки сортировки и data-sort.
	 */
	function theadTemplate(): string {
		const th = headings
			.map((heading) => {
				// Проверяем, отсортирована ли колонка
				const isSorted = sortState.key === heading.key

				// Отображение стрелки
				const arrow =
					heading.sortable && isSorted
						? sortState.direction === 'asc'
							? '▲'
							: '▼'
						: ''

				return `
					<th
						class="border border-neutral-200 p-4 font-medium text-left ${
					heading.sortable ? 'cursor-pointer select-none' : ''
				}"
						data-sort="${heading.sortable ? String(heading.key) : ''}"
					>
						${heading.label} ${arrow}
					</th>
				`
			})
			.join('')

		return `
			<thead>
				<tr>${th}</tr>
			</thead>
		`
	}

	/**
	 * Формирование строк таблицы (<tbody>).
	 */
	function tbodyTemplate(): string {
		return `
			<tbody>
				${items.map((item) => `<tr>${tdTemplate(item)}</tr>`).join('')}
			</tbody>
		`
	}

	/**
	 * Формирование <td> для строки.
	 * Поддерживает объекты (например, address).
	 */
	function tdTemplate(item: T): string {
		function td(value: any): string {
			// Если значение объект — выводим список полей
			if (typeof value === 'object' && value !== null) {
				return `
					<td class="border border-neutral-200 p-4" data-row-id="${item.id}">
						${Object.values(value).join(', ')}
					</td>
				`
			}

			// Иначе обычный текст
			return `<td class="border border-neutral-200 p-4" data-row-id="${item.id}">${String(value)}</td>`
		}

		// Значения + колонка действий
		return [
			...Object.values(item).map((value) => td(value)),
			`<td class="border border-neutral-200 p-4">
				<button type="button" class="cursor-pointer" data-delete="${item.id}">
					Удалить
				</button>
			</td>`,
		].join('')
	}

	function attachCellClickHandlers() {
		slot!.querySelectorAll('td[data-row-id]').forEach((td) => {
			td.addEventListener('click', () => {
				const rowId = td.getAttribute('data-row-id')
				if (!rowId) return
				options?.onCellClick?.(items.find((item) => item.id === rowId)!)
			})
		})
	}

	/**
	 * Добавляет обработчики клика по <th data-sort>.
	 */
	function attachSortingHandlers() {
		slot!.querySelectorAll('th[data-sort]').forEach((th) => {
			const key = th.getAttribute('data-sort')
			if (!key) return

			th.addEventListener('click', () => {
				toggleSort(key as keyof T)
			})
		})
	}

	/**
	 * Переключение сортировки:
	 * — если нажали по той же колонке → меняем направление
	 * — если по другой → сортируем по новой колонке (asc)
	 */
	function toggleSort(key: keyof T) {
		if (sortState.key === key) {
			sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc'
		} else {
			sortState.key = key
			sortState.direction = 'asc'
		}

		applySorting()
		renderTable()
	}

	/**
	 * Применяет сортировку к items по-текущему sortState.
	 * Используем localeCompare для корректной сортировки строк.
	 */
	function applySorting() {
		if (!sortState.key) return

		items.sort((a, b) => {
			const aValue = String(a[sortState.key!])
			const bValue = String(b[sortState.key!])

			return sortState.direction === 'asc'
				? aValue.localeCompare(bValue)
				: bValue.localeCompare(aValue)
		})
	}

	/**
	 * Обработка кликов по кнопкам "Удалить" внутри таблицы.
	 */
	slot?.addEventListener('click', (event) => {
		const target = event.target as HTMLElement

		if (target.matches('button[data-delete]')) {
			const uuid = target.getAttribute('data-delete')

			if (uuid && confirm('Подтвердите удаление')) {
				options?.onDelete?.(uuid)
			}
		}
	})

	return {
		setItems,
		prependItem,
		renderTable,
	}
}
