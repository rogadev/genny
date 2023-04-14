<template>
  <header class="chat-header">
    <Navbar />
  </header>
  <main class="p-8">
    <div class="grid grid-cols-3">
      <div class="flex flex-col justify-center col-span-1">
        <h1>Genny</h1>
        <h2>An AI Assistant Powered by GPT-4</h2>
      </div>
      <div class="flex justify-evenly items-center col-span-2">
        <NuxtLink to="/login">
          <button class="btn btn-primary btn-wide">Login</button>
        </NuxtLink>
        <NuxtLink to="/register">
          <button class="btn btn-secondary btn-wide">Register</button>
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
<script lang="ts" setup>
const thinking = ref(false);
const assistantMessage = ref('');
const handleSubmit = async (e: Event) => {
  thinking.value = true;
  const formData = new FormData(e.target as HTMLFormElement);
  const { passphrase, prompt } = Object.fromEntries(formData.entries());
  const response = await fetch('/api/assistant', {
    method: 'POST',
    body: JSON.stringify({ passphrase, prompt }),
  });
  const { message } = await response.json();
  assistantMessage.value = message;
  thinking.value = false;
};
const speakMessage = () => {
  const utterance = new SpeechSynthesisUtterance(assistantMessage.value);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
};
watch(assistantMessage, (message) => {
  if (message) {
    speakMessage();
  }
});
</script>

<style>
h1 {
  font-size: 2.5rem;
  font-weight: 700;
}

h2 {
  font-size: 1.5rem;
  font-weight: 400;
}
</style>