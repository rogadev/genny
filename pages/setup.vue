<template>
  <div class="p-8 bg-white shadow-md rounded-lg mb-4">
    <h1 class="text-2xl font-bold text-gray-700 mb-4">Enter Your API Key</h1>
    <p class="text-lg font-semibold text-gray-700 mb-4">
      Head over to
      <a href="https://platform.openai.com/account/api-keys" target="_blank"
        class="text-blue-600 underline hover:text-blue-800">
        OpenAI
      </a>
      to get your API key if you haven't already.
    </p>
    <p class="text-lg font-semibold text-gray-700 mb-4">
      You can choose to save it without setting an expiry, or select "session" if you're using a shared computer or wish
      to have the token erased when you close your browser window.
    </p>
  </div>
  <div>
    <form @submit.prevent="saveToken" class="p-8 bg-white shadow-md rounded-lg">
      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text text-lg font-semibold text-gray-700">API Key</span>
        </label>
        <input class="input input-bordered" type="text" placeholder="sk-..." v-model="token" />
      </div>
      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text text-lg font-semibold text-gray-700">Storage Preference</span>
        </label>
        <select class="select select-bordered w-full" v-model="storagePreference">
          <option value="local">Local</option>
          <option value="session">Session</option>
        </select>
      </div>
      <div class="form-control my-4">
        <button :disabled="!submitEnabled" type="submit" class="btn btn-primary btn-wide">Save</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import z from 'zod';

useHead({
  title: 'Genny - Onboarding',
});

onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    navigateTo('/');
  }
});

const keySchema = z.string().regex(/^sk-[A-Za-z0-9_-]{43}$/).min(46).max(46);
type OpenAIToken = z.infer<typeof keySchema>;

const token: Ref<'' | OpenAIToken> = ref('');
const storagePreference: Ref<'local' | 'session'> = ref('local');
const feedback = ref('');
const submitted = ref(false);
// const submitEnabled = computed(() => key.value.length === 47 && !submitted.value);
const submitEnabled = computed(() => true);

const saveToken = () => {
  feedback.value = '';
  // TODO Fix schema validation
  // try {
  //   keySchema.parse(token.value);
  // } catch (error) {
  //   feedback.value = 'Please enter a valid API key.';
  //   return;
  // }
  localStorage.setItem('token', token.value);
  // TODO handle storage preference - local vs session
  submitted.value = true;
  feedback.value = 'Saved! Redirecting in 5 seconds...';
  let i = 5;
  setInterval(() => {
    feedback.value = `Saved! Redirecting in ${i--} seconds...`;
  }, 1000);
  setTimeout(() => {
    navigateTo('/');
  }, 5000);
};
</script>