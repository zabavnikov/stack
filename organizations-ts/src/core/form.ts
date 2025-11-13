/**
 * Создаёт HTML-форму для добавления организации и управляет её состоянием.
 *
 * @param onSubmit — функция-обработчик, вызываемая при отправке формы.
 *                   В аргумент передаётся объект `FormData` со всеми введёнными значениями.
 *
 * @returns HTMLFormElement — готовый элемент формы, который можно вставить в DOM.
 *
 * Пример использования:
 * ```ts
 * const form = createForm((formData) => {
 *   console.log(Object.fromEntries(formData.entries()))
 * })
 * document.body.append(form)
 * ```
 */
export function createForm(onSubmit?: (formData: FormData) => void) {
	// Создаём сам элемент <form>
	const form = document.createElement('form')
	form.setAttribute('class', 'space-y-4')

	// Флаг для блокировки кнопки "Добавить", пока есть пустые поля
	let disabled = false

	/**
	 * Массив полей, из которых будет состоять форма.
	 * Каждое поле содержит:
	 * - name: имя поля (ключ FormData)
	 * - placeholder: текст-подсказку
	 * - isEmpty: флаг, показывающий, заполнено ли поле
	 */
	const fields = [
		{ name: 'name', placeholder: 'Название организации', isEmpty: true },
		{ name: 'directorFullName', placeholder: 'ФИО директора', isEmpty: true },
		{ name: 'tel', placeholder: 'Номер телефона', isEmpty: true },
		{ name: 'city', placeholder: 'Город', isEmpty: true },
		{ name: 'street', placeholder: 'Улица', isEmpty: true },
		{ name: 'house', placeholder: 'Дом', isEmpty: true },
	]

	// Генерируем разметку для полей ввода
	fields.forEach(({ name, placeholder }) => {
		form.innerHTML += `<input name="${name}" class="ui-input" placeholder="${placeholder}" />`
	})

	// Добавляем кнопку отправки
	form.innerHTML += `
		<button disabled type="submit" class="ui-button">Добавить</button>
	`

	// Находим кнопку для последующего включения/отключения
	const submitButton = form.querySelector('button[type="submit"]')

	/**
	 * Обработчик события `input`
	 * — отслеживает заполненность всех полей и включает кнопку, если форма заполнена.
	 */
	form.addEventListener('input', (event: Event) => {
		const target = event.target as HTMLInputElement

		// Обновляем флаг isEmpty для конкретного поля
		fields.forEach((field) => {
			if (field.name === target.name) {
				field.isEmpty = target.value.trim() === ''
			}
		})

		// Проверяем, остались ли пустые поля
		disabled = fields.some((field) => field.isEmpty)

		// Переключаем состояние кнопки
		if (disabled) {
			submitButton?.setAttribute('disabled', '')
		} else {
			submitButton?.removeAttribute('disabled')
		}
	})

	/**
	 * Обработчик отправки формы
	 * — предотвращает перезагрузку страницы и вызывает переданный callback.
	 */
	form.addEventListener('submit', (event) => {
		event.preventDefault()

		if (typeof onSubmit === 'function') {
			onSubmit(new FormData(form))
		}

		form.reset()
	})

	// Возвращаем готовую форму
	return form
}
