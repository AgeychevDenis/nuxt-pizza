<template>
  <div>
    <p class="font-bold mb-3">{{ title }}</p>
    <div class="mb-5" v-if="isShowAll">
      <Input class="bg-gray-50 border-none" v-model="searchValue" :placeholder="searchInputPlaceholder" />
    </div>

    <div class="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar">
      <FilterCheckbox
        v-if="!isLoading"
        v-for="(item, index) in list"
        :key="index"
        :text="item.text"
        :value="item.value"
        :name="name"
        :on-checked-change="() => onClickCheckbox?.(item.value)"
        :checked="selectedIds?.has(item.value)"
      />
      <Skeleton v-else v-for="item in limit" :key="item" class="h-6 rounded-[8px]" />
    </div>

    <div v-if="items.length > limit" class="border-t border-t-neutral-100 mt-4">
      <Button @click="isShowAll = !isShowAll" class="text-primary mt-3" variant="secondary">{{ textBtn }}</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FilterCheckbox } from '@/components/shared'

import type { FilterCheckboxProps } from './FilterCheckbox.vue'

type Item = FilterCheckboxProps

interface Props {
  name: string
  title: string
  items: Item[]
  defaultItems?: Item[]
  limit?: number
  isLoading: boolean
  searchInputPlaceholder?: string
  onClickCheckbox?: (value: string) => void
  selectedIds?: Set<string>
}

const props = withDefaults(defineProps<Props>(), {
  limit: 5,
  searchInputPlaceholder: 'Поиск...',
})

const isShowAll = ref(false)
const searchValue = ref('')

const textBtn = computed(() => (isShowAll.value ? 'Скрыть' : '+ Показать все'))

const list = computed(() => {
  return isShowAll.value
    ? props.items.filter((item: Item) => item.text.toLocaleLowerCase().includes(searchValue.value.toLocaleLowerCase()))
    : (props.defaultItems || props.items).slice(0, props.limit)
})
</script>

<style scoped></style>
