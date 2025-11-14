import type { Organization } from '../types.ts'

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
interface FormOptions {
	onSubmit?: (formData: FormData, isEdit: boolean) => void
}
export function createForm(options: FormOptions = {}) {
	// Создаём сам элемент <form>
	const form = document.createElement('form')
	form.setAttribute('class', 'space-y-4')

	// Флаг для блокировки кнопки "Добавить", пока есть пустые поля
	let disabled = false
	let isEdit = false

	/**
	 * Массив полей, из которых будет состоять форма.
	 * Каждое поле содержит:
	 * - name: имя поля (ключ FormData)
	 * - placeholder: текст-подсказку
	 * - isEmpty: флаг, показывающий, заполнено ли поле
	 */
	const fields = [
		{ name: 'id', placeholder: 'ID', isEmpty: false, hidden: true },
		{
			name: 'name',
			placeholder: 'Название организации',
			isEmpty: true,
			hidden: false,
		},
		{
			name: 'directorFullName',
			placeholder: 'ФИО директора',
			isEmpty: true,
			hidden: false,
		},
		{
			name: 'tel',
			placeholder: 'Номер телефона',
			isEmpty: true,
			hidden: false,
		},
		{ name: 'city', placeholder: 'Город', isEmpty: true, hidden: false },
		{ name: 'street', placeholder: 'Улица', isEmpty: true, hidden: false },
		{ name: 'house', placeholder: 'Дом', isEmpty: true, hidden: false },
	]

	// Генерируем разметку для полей ввода
	fields.forEach(({ name, placeholder, hidden }) => {
		if (hidden) {
			form.innerHTML += `<input name="${name}" type="hidden" />`
		} else {
			form.innerHTML += `<input name="${name}" class="ui-input" placeholder="${placeholder}" />`
		}
	})

	// Добавляем кнопку отправки
	form.innerHTML += `
		<button disabled type="submit" class="ui-button">Сохранить</button>
	`

	// Находим кнопку для последующего включения/отключения
	const submitButton = form.querySelector('button[type="submit"]')

	/**
	 * Обработчик события `input`
	 * — отслеживает заполненность всех полей и включает кнопку, если форма заполнена.
	 */
	form.addEventListener('input', (event: Event) =>
		validate(event.target as HTMLInputElement),
	)

	/**
	 * Обработчик отправки формы
	 * — предотвращает перезагрузку страницы и вызывает переданный callback.
	 */
	form.addEventListener('submit', (event) => {
		event.preventDefault()
		options?.onSubmit?.(new FormData(form), isEdit)
		isEdit = false
		form.reset()
	})

	function validate(target: HTMLInputElement) {
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
	}

	function setForm(data: Organization) {
		fields.forEach(({ name }) => {
			const input = form.querySelector<HTMLInputElement>(`[name="${name}"]`)

			if (input) {
				if (['city', 'street', 'house'].includes(name)) {
					input.value =
						data.address[name as keyof Organization['address']] || ''
				} else {
					input.value = (data[name] as string) || ''
				}

				validate(input)
			}
		})

		isEdit = true
	}

	return {
		form,
		setForm,
	}
}
