<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{
  src: string
  alt: string
}>()
const isReady = ref(false)
const readyHandler = () => {
  isReady.value = true
}
</script>

<template>
  <div class="stack">
    <transition>
      <img v-show="isReady" :src="props.src" :alt="props.alt" class="stack-item image" @load="readyHandler">
    </transition>
    <transition name="placeholder">
      <slot v-if="!isReady" class="stack-item placeholder" />
    </transition>
  </div>
</template>

<style scoped lang="scss">
.stack {
  position: relative;
  .stack-item {
    position: absolute;
    border-radius: 5px;
    height: 100%;
    &.placeholder {
      z-index: 0
    }
    &.image {
      z-index: 1
    }
  }
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
  z-index: 0;
}
.v-enter-active,
.v-leave-active {
  transition: all 1s;
}
.placeholder-enter-from,
.placeholder-leave-to {
  opacity: 0
}
.placeholder-enter-active,
.placeholder-leave-active {
  transition: all 0.5s;
}
</style>
