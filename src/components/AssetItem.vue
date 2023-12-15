<script setup lang="ts">
import { RouterLink } from 'vue-router'
const props = defineProps<{
  id: string
  created?: Date
  title: string
  thumbnail: string
  isVideo?: boolean
}>()
</script>

<template>
  <RouterLink class="asset-item" :to="`/${props.id}`">
    <section class="section left">
      <img :src="props.thumbnail" alt="thumbnail image of the asset" class="thumbnail">
      <h2 class="title">
        {{ props.title }}
      </h2>
    </section>
    <section class="section right">
      <h3 class="type">
        {{ props.isVideo ? 'video' : 'image' }}
      </h3>
      <h3 class="created">
        {{ props.created?.toLocaleString() }}
      </h3>
    </section>
  </RouterLink>
</template>

<style scoped lang="scss">
  .asset-item {
    padding: 0.75em;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 10px;
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:hover {
      border-color: var(--royal-blue)
    }
    .section {
      display: flex;
      align-items: center;
      gap: 1em;
    }
    .left {
      .title {
        color: var(--vt-c-text-dark-2)
      }
      .thumbnail {
        height: 50px;
        border-radius: 10px;
      }
    }
    .right {
      display: flex;
      justify-content: flex-end;
      flex: 1 0 0;
      color: var(--vt-c-text-dark-2);
      & > * {
        text-align: end;
      }
      .created {
        flex-basis: 250px;
      }
      .type {
        flex-basis: 100px;
      }
    }
  }
</style>
