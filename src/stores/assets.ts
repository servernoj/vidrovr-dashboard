import { ref, computed } from 'vue'
import keyBy from 'lodash/keyBy'
import { defineStore } from 'pinia'
import type { ApiResponse, Asset } from '@/types'
import api from '@/api'
import { throttler } from '@/utils'

export const useAssetsStore = defineStore('assets', () => {
  const assets = ref<Asset[]>([])
  const retrieveAssets = async () => {
    // Get all assets AS-IS by fetching first their IDs and then assets themselves in a controlled
    // manner, i.e. certain number of concurrent (in Promise.All sense) API requests at a time
    const unsortedAssets = await api.get<ApiResponse<string[]>>('/assets').then(
      IDs => throttler({
        array: IDs.data ?? [],
        handler: id => api.get<ApiResponse<Asset>>(`/assets/${id}`).then(({ data }) => data),
        bulkSize: 10
      })
    ) as Asset[]
    assets.value = unsortedAssets.slice().sort(
      (a, b) => {
        return new Date(a.creation_date).getTime() - new Date(b.creation_date).getTime()
      }
    )
  }
  const assetsById = computed(
    () => {
      return keyBy(assets.value, 'id')
    }
  )
  return { assets, retrieveAssets, assetsById }
})
