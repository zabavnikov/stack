/**
 * Преобразует массив строк в одну строку,
 * соединяя элементы через запятую.
 *
 * @param arr — массив строк
 * @returns строка вида "a, b, c"
 */
export const arrayToString = (arr: string[]) => arr.join(', ')