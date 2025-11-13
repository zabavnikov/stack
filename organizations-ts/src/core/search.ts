/**
 * Создаёт поле поиска внутри указанного элемента (слота) на странице.
 *
 * Внутрь элемента, найденного по CSS-селектору `slotName`, вставляется HTML-инпут
 * с возможностью указать placeholder и обработчик ввода текста.
 *
 * @param {string} slotName - CSS-селектор элемента, в который нужно вставить поле поиска.
 * @param {Object} options - Дополнительные параметры настройки.
 * @param {string} [options.placeholder="Найти"] - Текст-заполнитель для поля ввода.
 * @param {(event: Event) => void} [options.onInput] - Обработчик события ввода (input).
 *
 * @returns {void} Функция ничего не возвращает.
 *
 * @example
 * ```ts
 * createSearch('#search-slot', {
 *   placeholder: 'Поиск по имени',
 *   onInput: (e) => {
 *     const value = (e.target as HTMLInputElement).value
 *     console.log('Поиск:', value)
 *   },
 * })
 * ```
 */
interface Options {
	onInput?: (event: Event) => void
	placeholder?: string
}

export function createSearch(slotName: string, options: Options = {}) {
	// Находим элемент по CSS-селектору (например, "#search-slot" или ".search-container")
	const slot = document.querySelector(slotName)

	if (slot) {
		// Объединяем переданные опции с параметрами по умолчанию
		const _options = {
			placeholder: 'Найти',
			...options,
		}

		// Вставляем внутрь найденного элемента HTML-разметку поля ввода
		slot.innerHTML = `
			<input data-search-input type="search" class="border border-neutral-200 p-2 rounded-md w-full" type="text" placeholder="${_options.placeholder}">
		`

		// Если передан обработчик события ввода — навешиваем его
		if (typeof _options?.onInput === 'function') {
			document
				.querySelector('[data-search-input]')!
				.addEventListener('input', _options.onInput)
		}
	}
}
