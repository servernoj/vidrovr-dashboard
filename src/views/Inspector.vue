<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAssetsStore } from '@/stores/assets'
import { ref, type Ref } from 'vue'
const route = useRoute()
const assetsStore = useAssetsStore()
const assetId = ref<string>() as Ref<string>
assetId.value = Array.isArray(route.params.id) && route.params.id.length
  ? route.params.id[0]
  : route.params.id as string
</script>

<template>
  <h2>{{ assetId }}</h2>
  <pre>{{ assetsStore.assetsById[assetId] }}</pre>
</template>
