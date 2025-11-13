import './assets/css/main.css'
import { createSearch } from './core/search.ts'
import { createTable } from './core/table.ts'
import { createPagination } from './core/pagination.ts'
import { createDialog } from './core/dialog.ts'
import { createForm } from './core/form.ts'
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
const table = createTable<Organization>(
	'[data-table]',
	headings,
	{
		onDelete: (rowIndex: number) => {
			data.splice(rowIndex, 1)
			pagination.setItems(data)
			table.setItems(pagination.getItems())
		},
	}
)

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

const form = createForm((formData) => {
	// Базовый шаблон новой организации
	const organization: Organization = {
		name: '',
		directorFullName: '',
		tel: '',
		address: {
			city: '',
			street: '',
			house: '',
		},
	}

	// Проход по полям формы и сбор данных
	formData.forEach((value, key) => {
		// Если поле относится к адресу — записываем внутрь address
		if (['city', 'street', 'house'].includes(key)) {
			organization.address[key as keyof Organization['address']] =
				value as string
		} else {
			// Иначе — добавляем как обычное свойство
			organization[key as keyof Omit<Organization, 'address'>] = value as any
		}
	})

	// Добавляем новую организацию в начало таблицы
	data.unshift(organization)
	pagination.setItems(data)
	table.setItems(pagination.getItems())

	// Закрываем диалог
	dialog.close()
})

const dialog = createDialog('[data-add-organization]', form, () => {
	form.reset()
})
