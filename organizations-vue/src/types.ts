/**
 * Организация (юр. лицо или компания), включая контактные данные и юридический адрес.
 */
export interface Organization {
	id: string

	/** Название организации (например: "ООО Ромашка") */
	name: string

	/** ФИО директора полностью (например: "Иванов Иван Иванович") */
	directorFullName: string

	/** Контактный номер телефона (рекомендуемый формат: +7 900 000 00 00) */
	tel: string

	/** Юридический адрес организации */
	address: {
		/** Город (например: "Москва") */
		city: string

		/** Улица (например: "Тверская") */
		street: string

		/** Номер дома / строение (например: "10" или "10с2") */
		house: string
	}
}

export type TableHeading<T> = { key: Extract<keyof T, string>, label: string, sortable?: boolean }
export type SortOrder = 'asc' | 'desc'