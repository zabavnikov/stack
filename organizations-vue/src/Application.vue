<script setup lang="ts">
import BaseButton from './components/BaseButton.vue'
import BaseInput from './components/BaseInput.vue'
import BaseTable from './components/BaseTable.vue'
import BasePagination from './components/BasePagination.vue'
import AddOrganizationDialog from './components/dialogs/AddOrganizationDialog.vue'
import { useOrganizationTable } from './composables/organization-table.ts'
import { arrayToString } from './utils/array-to-string.ts'

const { headings, items, searchQuery, doDelete, doPrepend } =
	useOrganizationTable()
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
				<AddOrganizationDialog @submit="doPrepend">
					<template #trigger="{ toggle }">
						<BaseButton @click="toggle">Добавить</BaseButton>
					</template>
				</AddOrganizationDialog>
			</div>

			<BasePagination :items="items">
				<template #default="{ items }">
					<BaseTable :headings="headings" :items="items">
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
