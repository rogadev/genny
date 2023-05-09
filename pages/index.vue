<template>
  <div class="grid grid-cols-3 mb-6">
    <div class="flex flex-col justify-center col-span-1">
      <h1 class="text-5xl mb-3">Genny</h1>
      <h2>An AI Assistant Powered by <span class="font-bold text-4xl">GPT-4</span></h2>
    </div>
    <div v-if="!keyFound" class="flex justify-evenly items-center col-span-2">
      <NuxtLink to="/setup">
        <button class="btn btn-primary btn-wide">Get Started</button>
      </NuxtLink>
    </div>
  </div>
  <!-- Chat Container - Conditionally Rendered -->
  <div v-if="keyFound" class="chat-container">
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
        {{ message.content }}
      </div>
    </div>
    <progress v-show="thinking" class="progress w-full"></progress>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 mt-4">
      <input class="input input-bordered input-primary" ref="inputElement" :disabled="thinking" v-model="userMessage"
        placeholder="Type your message..." />
      <button class="btn btn-primary ml-auto px-10" type="submit">Send</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { Configuration, OpenAIApi } from "openai";
useHead({
  title: 'Genny - An AI Assistant Powered by GPT-4',
});

type Role = 'user' | 'assistant' | 'system';
type Message = {
  role: Role;
  content: string;
};

const MAX_WORD_COUNT = 100;
const model = "gpt-4";

const keyFound = ref(false);
const thinking = ref(false);
const assistantMessage = ref('');
const userMessage = ref('');
const messages = ref<Message[]>([]);
const feedback = ref('');
const inputElement = ref<HTMLInputElement | null>(null);

const addMessage = (role: Role, content: string) => {
  if (role !== 'user' && role !== 'assistant') {
    console.error('Invalid role provided to addMessage(). Expected "user" or "assistant".');
    return;
  }
  if (role === 'user' && !(content && content.trim())) {
    console.error('Invalid content provided to addMessage(). Expected a string with length > 0.');
    return;
  }
  messages.value.push({ role, content, });
};

const handleSubmit = async (e: Event) => {
  const message = userMessage.value.trim();
  const apiKey = localStorage.getItem('token');
  // Validation
  if (!message) return;
  if (!apiKey) {
    console.error('API key was not found in local storage. This error was not expected. Please contact the site administrator. <ryan@roga.dev>');
    feedback.value = 'No API key was found saved in your browser. Contact the administrator if this problem continues.';
    return;
  }
  // Word Count
  const messageWordCount = message.split(' ').length;
  if (messageWordCount > MAX_WORD_COUNT) {
    feedback.value = `Your message is too long. Please keep it under ${MAX_WORD_COUNT} words.`;
    return;
  }
  // Processing
  thinking.value = true;
  addMessage('user', message);
  userMessage.value = '';
  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  // Does messages have a {role: 'system'} message? If not, add one.
  // if (!messages.value.find(m => m.role === 'system')) {
  //   messages.value.unshift({
  //     role: 'system',
  //     content: `Hello! We are so excited to have you helping our users today. You are a happy, friendly, helpful AI assistant made by OpenAI. To your users you're known as "Genny". A user has a question for you. Please respond in a way that keeps the response short but informative. Thank you!`
  //   });
  // };

  const completion = await openai.createChatCompletion({
    model,
    messages: messages.value,
  });
  const newMessage = completion.data.choices[0].message?.content ?? 'Oops, something went wrong...';
  addMessage('assistant', newMessage);
  assistantMessage.value = newMessage;
  thinking.value = false;
  // focus the input element after 100 ms
  setTimeout(() => {
    inputElement.value?.focus();
  }, 100);
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
onMounted(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    keyFound.value = false;
  } else {
    keyFound.value = true;
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

.message {
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.message.user {
  align-self: flex-start;
  text-align: center;
  margin-left: 1rem;
  margin-right: 1rem;
  @apply bg-primary text-primary-content;
}

.message.assistant {
  align-self: flex-end;
  @apply bg-secondary text-secondary-content;
}
</style>