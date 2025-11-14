import type { Organization } from '../types.ts'
import { v7 as uuid } from 'uuid'

/**
 * Создаёт новый объект Organization с пустыми полями.
 * Используется при создании новой организации, если данных ещё нет.
 * @returns новый объект Organization
 */
export function createEmptyOrganization(): Organization {
	return {
		id: uuid(), // уникальный идентификатор
		name: '', // название организации
		directorFullName: '', // ФИО директора
		tel: '', // телефон
		address: {
			city: '', // город
			street: '', // улица
			house: '', // дом
		},
	}
}

/**
 * Заполняет объект Organization данными из FormData.
 * Если объект organization не передан — создаётся новый через createEmptyOrganization.
 * Глубокая копия объекта создаётся, чтобы избежать мутаций исходного объекта.
 *
 * @param formData - данные формы, полученные через FormData
 * @param organization - объект Organization, который нужно заполнить
 * @returns клон Organization с обновлёнными данными
 */
export function fillOrganization(
	formData: FormData,
	organization?: Organization,
) {
	// Если организация не передана — создаём пустой объект
	if (!organization) {
		organization = createEmptyOrganization()
	}

	// Глубокая копия, чтобы исходный объект не изменялся
	const clonedOrganization = structuredClone(organization)

	// Проходим по всем парам ключ-значение из FormData
	formData.forEach((value, key) => {
		// Если ключ относится к адресу, записываем внутрь address
		if (['city', 'street', 'house'].includes(key)) {
			clonedOrganization.address[key as keyof Organization['address']] =
				value as string
		} else if (key !== 'id') {
			// Иначе записываем как обычное свойство Organization
			clonedOrganization[key as keyof Organization] = value as any
		}
	})

	return clonedOrganization
}
