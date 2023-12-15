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
const isMediaLoaded = ref(false)

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
    <template v-if="asset">
      <h1>{{ asset.title }}</h1>
      <section class="media">
        <template v-if="asset.fps">
          <video v-show="isMediaLoaded" controls preload="metadata" @loadedmetadata="isMediaLoaded = true">
            <source :src="asset.media_url" :type="asset.mime_type">
            <p>
              Sorry, your browser doesn't support embedded videos. You can
              <a :href="asset.media_url">download it</a>
              and watch it offline
            </p>
          </video>
        </template>
        <img v-else :src="asset.media_url">
      </section>
    </template>
    <h2 v-else>
      Asset not found
    </h2>
  </div>
</template>

<style scoped lang="scss">
.content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  gap: 2em;
  .media {
    width: 75%;
    & > * {
      width: 100%;
    }
  }
}
</style>
