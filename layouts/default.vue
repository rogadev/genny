<template>
  <!-- Header Section -->
  <header class="chat-header sticky top-0 bg-white shadow-md z-10">
    <Navbar />
  </header>

  <!-- Main Content -->
  <main class="bg-gray-50 py-12 px-6 md:px-12 min-h-screen">
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

<style scoped>
.chat-header {
  /* Ensure a solid header with shadow for distinction */
  padding: 1rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  /* Light gray border for subtle separation */
}
</style>
