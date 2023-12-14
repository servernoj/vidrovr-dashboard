<script setup lang="ts">
import type { ApiResponse, Asset } from '@/types'
import { throttler } from '@/utils'
import { ref, onMounted } from 'vue'
import { useSpinner } from '@/composables'
import api from '@/api'
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
        bulkSize: 1
      })
    )
    spinnerHide()
    assets.value = unsortedAssets as Asset[]
  }
)
</script>

<template>
  <div class="content">
    <pre v-if="!spinnerIsActive">{{ JSON.stringify(assets, null,2) }}</pre>
  </div>
</template>

<style scoped lang="scss">
  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
</style>
