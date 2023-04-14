<template>
  <header class="chat-header">
    <Navbar />
  </header>
  <main class="p-8">
    <slot />
  </main>
</template>

<script lang="ts" setup>
useHead({
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ],
});
</script>