<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

/**
 * Определяем доступные слоты:
 * — trigger: получает состояние `open` и функцию `toggle`
 * — default: содержимое, которое показывается при открытии
 */
defineSlots<{
	trigger: (props: { open: boolean; toggle: () => void }) => any
	default: () => any
}>()

/**
 * Модель для двустороннего связывания состояния открытия.
 * По умолчанию закрыто.
 */
const open = defineModel<boolean>({ default: false })

/**
 * Делаем публичным метод toggle(), чтобы можно было вызвать снаружи через ref.
 */
defineExpose({ toggle })

/**
 * При монтировании — подписываемся на нажатие клавиши.
 * При размонтировании — отписываемся, чтобы избежать утечек.
 */
onMounted(() => document.addEventListener('keydown', closeByEsc))
onUnmounted(() => document.removeEventListener('keydown', closeByEsc))

/**
 * Закрывает, если пользователь нажал клавишу Escape.
 */
function closeByEsc(event: KeyboardEvent) {
	if (event.key === 'Escape') open.value = false
}

/**
 * Переключает состояние открытия/закрытия.
 */
function toggle() {
	open.value = !open.value
}
</script>


<template>
	<div>
		<slot name="trigger" :open="open" :toggle="toggle" />
		<Teleport v-if="open" to="body">
			<div class="fixed inset-0 flex items-center justify-center bg-slate-600/70">
				<div class="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
					<div class="mb-6 flex items-center justify-between">
						<h2 class="text-2xl">Добавить организацию</h2>
						<button @click="open = false" class="cursor-pointer">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M18 6 6 18" />
								<path d="m6 6 12 12" />
							</svg>
						</button>
					</div>

					<slot />
				</div>
			</div>
		</Teleport>
	</div>
</template>
