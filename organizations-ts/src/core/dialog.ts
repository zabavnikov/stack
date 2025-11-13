/**
 * Интерфейс публичного API диалога.
 * Позволяет закрыть открытое модальное окно вручную.
 */
interface Dialog {
	close: () => void
}

/**
 * Создаёт диалоговое (модальное) окно и управляет его отображением.
 *
 * @param triggerSelector — CSS-селектор кнопки или элемента, по клику на который диалог будет открыт.
 * @param slot — HTML-элемент (например, форма), который будет вставлен внутрь диалога.
 * @param onClose
 *
 * @returns Объект `Dialog` с методом `close()`, позволяющим закрыть диалог извне.
 *
 * Пример:
 * ```ts
 * const dialog = createDialog('[data-add-organization]', createForm())
 * dialog.close() // закрыть программно
 * ```
 */
export function createDialog(
	triggerSelector: string,
	slot: HTMLElement,
	onClose?: () => void,
): Dialog {
	// Находим элемент, который будет открывать диалог
	const trigger = document.querySelector(triggerSelector)

	if (trigger) {
		// Добавляем слушатель открытия по клику
		trigger.addEventListener('click', () => {
			// Создаём контейнер для диалога
			const dialog = document.createElement('div')

			// Устанавливаем базовые атрибуты и классы для затемнения фона и центрирования окна
			dialog.setAttribute('id', 'dialog')
			dialog.setAttribute(
				'class',
				'fixed inset-0 bg-slate-600/70 flex items-center justify-center',
			)

			// Вставляем разметку модального окна
			dialog.innerHTML = `
				<div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
					<!-- Заголовок и кнопка закрытия -->
					<div class="flex justify-between items-center mb-6">
						<h2 class="text-2xl">Добавить организацию</h2>
						<div data-close-button-slot></div>
					</div>
					
					<!-- Контентный слот для формы или других элементов -->
					<div data-content-slot></div>
				</div>
			`

			// Вставляем кнопку закрытия
			dialog
				.querySelector('[data-close-button-slot]')
				?.append(createCloseButton())

			// Если передан элемент (например, форма) — добавляем его внутрь контента
			if (slot) {
				dialog.querySelector('[data-content-slot]')?.append(slot)
			}

			// Добавляем диалог в конец body
			document.body.append(dialog)

			// Добавляем слушатель клавиши Escape при каждом открытии
			document.addEventListener('keydown', closeByEsc)
		})
	}

	/**
	 * Создаёт кнопку закрытия диалога (X).
	 * Кнопка содержит SVG-иконку и вешает обработчик события `click` → close().
	 */
	function createCloseButton() {
		const closeButton = document.createElement('button')
		closeButton.setAttribute('type', 'button')
		closeButton.innerHTML = `
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
				viewBox="0 0 24 24" fill="none" stroke="currentColor"
				stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M18 6 6 18"/><path d="m6 6 12 12"/>
			</svg>
		`

		closeButton.addEventListener('click', close)
		return closeButton
	}

	/**
	 * Закрывает диалог и снимает слушатель клавиши Escape.
	 */
	function close() {
		const dialog = document.getElementById('dialog')

		if (dialog) {
			dialog.remove()
			document.removeEventListener('keydown', closeByEsc)
		}

		if (typeof onClose === 'function') {
			onClose()
		}
	}

	/**
	 * Закрывает диалог при нажатии клавиши Escape.
	 * Добавляется при открытии и удаляется после закрытия.
	 */
	function closeByEsc(event: KeyboardEvent) {
		if (event.key === 'Escape') close()
	}

	// Возвращаем публичный API
	return { close }
}
