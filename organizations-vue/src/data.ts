import type { Organization } from './types.ts'

export const data: Organization[] = [
	{
		name: "ООО Ромашка",
		directorFullName: "Иванов Иван Иванович",
		tel: "+7 900 123 45 67",
		address: {
			city: "Москва",
			street: "Тверская",
			house: "10"
		}
	},
	{
		name: "АО ТехноПром",
		directorFullName: "Петров Пётр Петрович",
		tel: "+7 921 555 10 20",
		address: {
			city: "Санкт-Петербург",
			street: "Невский проспект",
			house: "28"
		}
	},
	{
		name: "ИП Смирнова",
		directorFullName: "Смирнова Анна Сергеевна",
		tel: "+7 977 888 77 66",
		address: {
			city: "Казань",
			street: "Баумана",
			house: "15А"
		}
	},
	{
		name: "ООО СтройСервис",
		directorFullName: "Кузнецов Олег Викторович",
		tel: "+7 905 222 33 44",
		address: {
			city: "Екатеринбург",
			street: "Ленина",
			house: "50"
		}
	},
	{
		name: "ЗАО АльфаТрейд",
		directorFullName: "Соколова Мария Игоревна",
		tel: "+7 916 444 55 66",
		address: {
			city: "Новосибирск",
			street: "Красный проспект",
			house: "101"
		}
	}
]