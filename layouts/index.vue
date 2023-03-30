<template>
  <slot />
</template>

<script lang="ts" setup>
useHead({
  title: 'Home',
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' },
    { rel: 'stylesheet', href: 'https://unpkg.com/@picocss/pico@1.*/css/pico.min.css' },
  ],
});
</script>