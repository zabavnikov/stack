<script setup lang="ts" generic="T">
import { computed, ref } from 'vue'

/**
 * Пропсы:
 * - items: список элементов для пагинации
 * - perPage: количество элементов на странице (по умолчанию 5)
 */
const { items = [], perPage = 5 } = defineProps<{
	items: T[]
	perPage?: number
}>()

// Текущая страница
const currentPage = ref(1)

/**
 * Общее количество страниц.
 * Округляем вверх, чтобы вместить все элементы.
 */
const pages = computed(() => Math.ceil(items.length / perPage))

/**
 * Элементы текущей страницы.
 * Вычисляются реактивно через slice().
 */
const getItems = computed<T[]>(() => {
	const from = (currentPage.value - 1) * perPage
	const to = currentPage.value * perPage
	return items.slice(from, to)
})

/**
 * Переход на конкретную страницу.
 * Проверяем, что страница находится в допустимых пределах.
 */
function goToPage(page: number) {
	if (page >= 1 && page <= pages.value) {
		currentPage.value = page
	}
}

/**
 * Переход на следующую страницу.
 */
function nextPage() {
	if (currentPage.value < pages.value) currentPage.value++
}

/**
 * Переход на предыдущую страницу.
 */
function previousPage() {
	if (currentPage.value > 1) currentPage.value--
}
</script>


<template>
	<div class="space-y-4">
		<slot :items="getItems" />

		<ul v-if="items.length > 0" class="flex gap-2 items-center">
			<li>
				<button
					@click="previousPage"
					:disabled="currentPage === 1"
					class="flex size-10 items-center justify-center rounded-lg border border-light-gray hover:bg-light-gray disabled:opacity-50 cursor-pointer"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
				</button>
			</li>

			<li v-for="page in pages" :key="page">
				<button
					@click="goToPage(page)"
					:class="{
						'bg-black text-white': currentPage === page,
						'bg-light-gray text-black hover:bg-gray': currentPage !== page,
					}"
					class="flex size-10 items-center justify-center rounded-lg cursor-pointer"
				>
					{{ page }}
				</button>
			</li>

			<li>
				<button
					@click="nextPage"
					:disabled="currentPage === pages"
					class="flex size-10 items-center justify-center rounded-lg border border-light-gray hover:bg-light-gray disabled:opacity-50 cursor-pointer"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
				</button>
			</li>
		</ul>
	</div>
</template>