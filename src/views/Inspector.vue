<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <h2>{{ route.params.id }}</h2>
</template>