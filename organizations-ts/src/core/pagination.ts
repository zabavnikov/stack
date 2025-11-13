interface Options<T> {
	onClick?: (items: T[]) => void
	perPage?: number
}

export function createPagination<T>(
	slotName: string,
	items: T[],
	onMounted?: (items: T[]) => void,
	options: Options<T> = {},
) {
	let _items: T[] = [...items]

	// Объединяем переданные опции с параметрами по умолчанию
	const _options = {
		perPage: 5,
		...options,
	}

	let currentPage = 1

	// Находим элемент по CSS-селектору (например, "#search-slot" или ".search-container")
	const slot = document.querySelector(slotName)

	renderPagination()

	onMounted?.(getItems())

	// Общее количество страниц
	function pages() {
		return Math.ceil(_items.length / _options.perPage)
	}

	function setItems(newItems: T[]) {
		_items = newItems
		renderPagination()
	}

	function getItems() {
		const from = (currentPage - 1) * _options.perPage
		const to = currentPage * _options.perPage

		return _items.slice(from, to)
	}

	// Переход на страницу
	function goToPage(page: number) {
		if (page >= 1 && page <= pages()) {
			currentPage = page
		}
	}

	function pagesTemplate() {
		let template = ''

		for (let page = 1; page <= pages(); page++) {
			template += `
				<li>
					<button
						type="button"
						data-page
						class="flex size-10 items-center justify-center rounded-lg cursor-pointer border border-gray-300 hover:bg-gray-100"
					>
						${page}
					</button>
				</li>
			`
		}

		if (slot) {
			// Подождем обновление DOM
			setTimeout(() => {
				slot.querySelectorAll('[data-page]').forEach((button, page) => {
					button.addEventListener('click', () => {
						goToPage(page + 1)
						_options.onClick?.(getItems())
					})
				})
			})
		}

		return template
	}

	function renderPagination() {
		if (slot) {
			slot.innerHTML = `
				<div class="space-y-4">
					<ul class="flex gap-2 items-center">
						${pagesTemplate()}
					</ul>
				</div>
			`
		}
	}

	return {
		setItems,
		getItems,
	}
}
