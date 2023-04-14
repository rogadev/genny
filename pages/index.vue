<template>
  <div class="grid grid-cols-3">
    <div class="flex flex-col justify-center col-span-1">
      <h1>Genny</h1>
      <h2>An AI Assistant Powered by GPT-4</h2>
    </div>
    <div class="flex justify-evenly items-center col-span-2">
      <NuxtLink to="/onboarding">
        <button class="btn btn-primary btn-wide">Get Started</button>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
useHead({
  title: 'Genny - An AI Assistant Powered by GPT-4',
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