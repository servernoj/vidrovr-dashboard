<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAssetsStore } from '@/stores/assets'
import { ref, onMounted, computed } from 'vue'
import type { Asset, Person } from '@/types'
import { useSpinner } from '@/composables'
const { spinnerShow, spinnerHide, spinnerIsActive } = useSpinner()
const route = useRoute()
const assetsStore = useAssetsStore()
const asset = computed<Asset|null>(
  () => {
    const assetId = Array.isArray(route.params.id) && route.params.id.length
      ? route.params.id[0]
      : route.params.id as string
    return assetsStore.assetsById[assetId] ?? null
  }
)
const persons = ref<Person[]>([])
onMounted(
  async () => {
    spinnerShow()
    if (!assetsStore.assets.length) {
      await assetsStore.retrieveAssets()
    }
    if (asset.value) {
      persons.value = await assetsStore.retrievePersons(asset.value.id)
    }
    spinnerHide()
  }
)
</script>

<template>
  <div v-if="!spinnerIsActive" class="content">
    <h2>Asset</h2>
    <pre v-if="asset">{{ assetsStore.assetsById[asset.id] }}</pre>
    <h2>Persons</h2>
    <pre v-if="asset">{{ persons }}</pre>
  </div>
</template>

<style scoped lang="scss">
.content {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    gap: 2em;
  }
</style>
