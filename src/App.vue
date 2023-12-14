<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="layout">
    <nav class="nav-bar">
      <RouterLink to="/" class="link">
        <img src="@/assets/logo-light.svg" alt="logo" class="logo">
      </RouterLink>
      <section class="right" />
    </nav>
    <main class="viewport">
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
  .layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
    .nav-bar {
      flex-basis: 64px;
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid grey;
      .link {
        display: flex;
        align-items: center;
      }
      .logo {
        height: 32px;
      }
    }
    .viewport {
      flex: 1 0 0;
      padding: 1em;
      overflow-y: hidden
    }
  }
</style>
