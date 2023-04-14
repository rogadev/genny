<template>
  <div class="prose mb-4">
    <h1>Enter Your API Key</h1>
    <p>
      Genny uses your OpenAI API key to generate responses. Head over to OpenAI to get your key now -
      <a class="link link-primary" href="https://platform.openai.com/account/api-keys" target="_blank">
        OpenAi.com
      </a>
    </p>
    <p>
      Genny doesn't save your API key on our servers. Instead, your key is saved in your browser and sent with each
      request. You can choose to save it without setting an expiry, or select "session" if you're using a shared computer
      or just wish to have the token erased from your computer when you close your browser window.
    </p>
  </div>
  <div>
    <form @submit.prevent="saveToken">
      <div class="form-control">
        <label class="label">
          <span class="label-text">API Key</span>
        </label>
        <input class="input input-bordered" type="text" placeholder="sk-..." v-model="key" />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Storage Preference</span>
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
    navigateTo('/dashboard');
  }
});

const keySchema = z.string().regex(/^sk-[A-Za-z0-9_-]{43}$/).min(46).max(46);
type OpenAIToken = z.infer<typeof keySchema>;

const key: Ref<'' | OpenAIToken> = ref('');
const storagePreference: Ref<'local' | 'session'> = ref('local');
const feedback = ref('');
const submitted = ref(false);
const submitEnabled = computed(() => key.value.length === 46 && !submitted.value);

const saveToken = () => {
  feedback.value = '';
  try {
    keySchema.parse(key.value);
  } catch (error) {
    feedback.value = 'Please enter a valid API key.';
    return;
  }
  if (storagePreference.value === 'local') localStorage.setItem('token', key.value);
  if (storagePreference.value === 'session') sessionStorage.setItem('token', key.value);
  submitted.value = true;
  feedback.value = 'Saved! Redirecting in 5 seconds...';
  let i = 5;
  setInterval(() => {
    feedback.value = `Saved! Redirecting in ${i--} seconds...`;
  }, 1000);
  setTimeout(() => {
    navigateTo('/dashboard');
  }, 5000);
};
</script>