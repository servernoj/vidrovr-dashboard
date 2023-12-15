<script setup lang="ts">
import { onMounted } from 'vue'
import { useSpinner } from '@/composables'
import AssetItem from '@/components/AssetItem.vue'
import { useAssetsStore } from '@/stores/assets'
const { spinnerShow, spinnerHide, spinnerIsActive } = useSpinner()
const assetsStore = useAssetsStore()
onMounted(
  async () => {
    // spinner show
    spinnerShow()
    await assetsStore.retrieveAssets()
    spinnerHide()
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
        v-for="asset,idx in assetsStore.assets"
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
