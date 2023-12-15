<script setup lang="ts">
import type { ApiResponse, Asset } from '@/types'
import { throttler } from '@/utils'
import { ref, onMounted } from 'vue'
import { useSpinner } from '@/composables'
import api from '@/api'
import AssetItem from '@/components/AssetItem.vue'
const assets = ref<Asset[]>([])
const { spinnerShow, spinnerHide, spinnerIsActive } = useSpinner()

onMounted(
  async () => {
    // spinner show
    spinnerShow()
    // Get all assets AS-IS by fetching first their IDs and then assets themselves in a controlled
    // manner, i.e. certain number of concurrent (in Promise.All sense) API requests at a time
    const unsortedAssets = await api.get<ApiResponse<string[]>>('/assets').then(
      IDs => throttler({
        array: IDs.data ?? [],
        handler: id => api.get<ApiResponse<Asset>>(`/assets/${id}`).then(({ data }) => data),
        bulkSize: 10
      })
    ) as Asset[]
    spinnerHide()
    assets.value = unsortedAssets.slice().sort(
      (a, b) => {
        return new Date(a.creation_date).getTime() - new Date(b.creation_date).getTime()
      }
    )
  }
)
</script>

<template>
  <div v-if="!spinnerIsActive" class="content">
    <header>
      <h1>
        Please select an asset to work with
      </h1>
    </header>
    <section class="assets-list">
      <AssetItem
        v-for="asset,idx in assets"
        :id="asset.id"
        :key="idx"
        :title="asset.title"
        :created="new Date(asset.creation_date)"
        :thumbnail="asset.thumbnail"
        :is-video="asset.fps > 0"
      />
    </section>
  </div>
</template>

<style scoped lang="scss">
  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
    gap: 2em;
    .assets-list {
      flex: 1 0 0;
      overflow-y: auto;
    }
  }
</style>
