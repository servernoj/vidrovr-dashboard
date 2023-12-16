<script setup lang="ts">
import type { PersonAppearance } from '@/types'
import { computed, ref } from 'vue'

type StripItem = {
  style: Record<string, any>
  thumbnail: string
}

const props = defineProps<{
  totalClipTime: number
  name: string
  appearances: PersonAppearance[]
}>()
// -- state
const imageURL = ref<string|null>(null)
// -- computed
const stripItems = computed<StripItem[]>(
  () => props.appearances.map(
    ({ start, end, thumbnail }) => ({
      thumbnail,
      style: {
        left: `${start / props.totalClipTime * 100}%`,
        right: `${100 - end / props.totalClipTime * 100}%`
      }
    })
  )
)
const randomizedImageURL = computed(
  () => {
    if (!imageURL.value) {
      return null
    }
    const rnd = Array.from(
      { length: 5 },
      () => '0123456789ABCDEF'.charAt(Math.floor(Math.random() * 16))
    ).join('')
    return `${imageURL.value}?rnd=${rnd}}`
  }
)

</script>

<template>
  <div class="content-thumbnails">
    <h3 class="title">
      {{ props.name }}
    </h3>
    <article class="sections">
      <section class="strip">
        <div
          v-for="stripItem,idx in stripItems"
          :key="idx"
          :style="stripItem.style"
          class="strip--item"
          @mouseover="imageURL = stripItem.thumbnail"
          @mouseleave="imageURL = null"
        />
      </section>
      <section class="preview">
        <img v-if="randomizedImageURL" :src="randomizedImageURL" alt="preview">
      </section>
    </article>
  </div>
</template>

<style scoped lang="scss">
.content-thumbnails {
  margin-top: 1em;
  .sections {
    margin-top: 0.5em;
    height: 50px;
    width: 100%;
    display: flex;
    .strip {
      height: 100%;
      flex: 1 0 0;
      position: relative;
      &--item {
        position: absolute;
        top: 0;
        bottom: 0;
        cursor: zoom-in;
        background-color: var(--royal-blue);
        border: 1px solid;
        border-radius: 5px;
      }
    }
    .preview {
      margin-left: 1em;
      height: 100%;
      flex: 0 0 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid;
      border-radius: 5px;
      img {
        height: 90%;
      }
    }
  }
}
</style>
