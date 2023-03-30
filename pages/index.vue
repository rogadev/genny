<template>
  <div class="container">
    <h1>Ask Your Questions</h1>
    <h4>Hey, I'm Genny. A helpful AI that can answer just about anything you want to know better than Google Assistant and
      Siri put together!</h4>
    <p v-if="assistantMessage" class="assistant-message">{{ assistantMessage }}</p>
    <form class="container" @submit.prevent="handleSubmit">
      <input required type="password" name="passphrase" id="message" placeholder="Passphrase">
      <textarea required name="prompt" id="prompt" placeholder="Question"></textarea>
      <button type="submit" :disabled="thinking">Submit</button>
    </form>
  </div>
</template>
<script lang="ts" setup>
useHead({
  title: 'Genny',
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' },
    { rel: 'stylesheet', href: 'https://unpkg.com/@picocss/pico@1.*/css/pico.min.css' },
  ],
});
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