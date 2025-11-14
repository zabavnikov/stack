<script setup lang="ts">
import BaseButton from './components/BaseButton.vue'
import BaseInput from './components/BaseInput.vue'
import BaseTable from './components/BaseTable.vue'
import BasePagination from './components/BasePagination.vue'
import BaseDialog from './components/BaseDialog.vue'
import OrganizationForm from './components/OrganizationForm.vue'
import { useOrganizationTable } from './composables/organization-table.ts'
import { arrayToString } from './utils/array-to-string.ts'
import { nextTick, ref } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import type { Organization } from './types.ts'

const { headings, items, searchQuery, doDelete, doPrepend, doUpdate } =
	useOrganizationTable()

const dialog = ref<ComponentExposed<typeof BaseDialog>>()
const form = ref<ComponentExposed<typeof OrganizationForm>>()

async function onCellClick(data: Organization) {
	dialog.value?.toggle()
	await nextTick()
	form.value?.setForm(data)
}
</script>

<template>
	<div class="flex h-screen w-screen items-center justify-center">
		<div class="space-y-4">
			<div class="flex gap-4">
				<BaseInput
					v-model="searchQuery"
					type="search"
					placeholder="Найти по ФИО"
				/>
				<BaseDialog ref="dialog">
					<template #trigger="{ toggle }">
						<BaseButton @click="toggle">Добавить</BaseButton>
					</template>
					<OrganizationForm
						ref="form"
						@created="doPrepend"
						@updated="doUpdate"
						@submit="dialog?.toggle()"
					/>
				</BaseDialog>
			</div>

			<BasePagination :items="items">
				<template #default="{ items }">
					<BaseTable
						:headings="headings"
						:items="items"
						@cell-click="onCellClick"
					>
						<template #address="{ data }">
							{{ arrayToString([data.city, data.street, data.house]) }}
						</template>
						<template #actions="{ item }">
							<button
								type="button"
								@click="doDelete(item)"
								class="cursor-pointer"
							>
								Удалить
							</button>
						</template>
					</BaseTable>
				</template>
			</BasePagination>
		</div>
	</div>
</template>
