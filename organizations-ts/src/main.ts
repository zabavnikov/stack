import './assets/css/main.css'
import { createSearch } from './core/search.ts'
import { createTable } from './core/table.ts'
import { createPagination } from './core/pagination.ts'
import { createDialog } from './core/dialog.ts'
import { createForm } from './core/organization-form.ts'
import { fillOrganization } from './utils/organization.ts'
import { data } from './data.ts'
import type { Organization, TableHeading } from './types.ts'

/**
 * Основная точка входа приложения.
 * Создаёт базовую структуру интерфейса с поиском, таблицей, пагинацией и кнопкой добавления организации.
 */
document.querySelector<HTMLDivElement>('#application')!.innerHTML = `
  <div class="flex items-center justify-center h-screen w-screen">
  	<div class="space-y-4">
			<!-- Верхняя панель: поиск + кнопка -->
			<div class="flex gap-4">
				<div data-search class="flex-1"></div>
				<button type="button" data-add-organization class="ui-button">
					Добавить
				</button>
			</div>

			<!-- Таблица организаций -->
			<div data-table></div>

			<!-- Пагинация -->
			<div data-pagination></div>
		</div>
  </div>
`

/**
 * Конфигурация заголовков таблицы.
 * Каждый объект описывает столбец: ключ данных, заголовок и признак сортировки.
 */
const headings: TableHeading<Organization>[] = [
	{ key: 'id', label: 'ID', sortable: true },
	{ key: 'name', label: 'Название', sortable: true },
	{ key: 'directorFullName', label: 'ФИО директора', sortable: true },
	{ key: 'tel', label: 'Номер телефона' },
	{ key: 'address', label: 'Адрес' },
	{ key: 'actions', label: 'Действия' },
]

/**
 * Создание таблицы организаций.
 * Возвращает API с методами управления данными (например, setItems, prependItem).
 */
const table = createTable<Organization>('[data-table]', headings, {
	onDelete: (uuid: string) => {
		const itemIndex = data.findIndex((item) => item.id === uuid)

		if (itemIndex !== -1) {
			data.splice(itemIndex, 1)
			setItems(data)
		}
	},
	onCellClick(item) {
		form.setForm(item)
		dialog.open()
	}
})

/**
 * Инициализация поисковой строки.
 * При вводе фильтрует данные и обновляет таблицу.
 */
createSearch('[data-search]', {
	onInput: (event: Event) => {
		const input = event.target as HTMLInputElement

		// Фильтрация по ФИО директора (без учёта регистра)
		const filtered = pagination
			.getItems()
			.filter((item) =>
				item.directorFullName.toLowerCase().includes(input.value.toLowerCase()),
			)

		table.setItems(filtered)
	},
	placeholder: 'Найти по ФИО',
})

/**
 * Инициализация пагинации.
 * Разбивает массив `data` на страницы и управляет переключением.
 * Каждый раз при смене страницы вызывается table.setItems().
 */
const pagination = createPagination(
	'[data-pagination]',
	data,
	(items) => {
		table.setItems(items)
	},
	{
		onClick(items) {
			table.setItems(items)
		},
	},
)

const form = createForm({
	onSubmit: (formData, isEdit) => {
		if (isEdit) {
			const editableIndex = data.findIndex((item) => item.id === formData.get('id'))

			if (editableIndex !== -1) {
				data[editableIndex] = fillOrganization(formData, data[editableIndex])
				setItems(data)
			}

			dialog.close()
			return
		}

		// Добавляем новую организацию в начало таблицы
		data.unshift(fillOrganization(formData))

		setItems(data)

		// Закрываем диалог
		dialog.close()
	},
})

const dialog = createDialog('[data-add-organization]', form.form, () => {
	form.form.reset()
})

function setItems(data: Organization[]) {
	pagination.setItems(data)
	table.setItems(pagination.getItems())
}
