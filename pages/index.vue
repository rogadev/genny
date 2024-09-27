<script lang="ts" setup>
import { Configuration, OpenAIApi } from "openai";
import { ref, onMounted, watch } from 'vue';
import { useHead } from '#app';

useHead({
  title: 'Genny - An AI Assistant Powered by GPT-4',
});

// Define types for message roles and structure
type Role = 'user' | 'assistant' | 'system';
type Message = {
  role: Role;
  content: string;
};

// Constants
const MAX_WORD_COUNT = 100;
const model = "gpt-4";

// Reactive variables
const keyFound = ref<boolean>(false);
const thinking = ref<boolean>(false);
const userMessage = ref<string>('');
const messages = ref<Message[]>([]);
const feedback = ref<string>('');
const inputElement = ref<HTMLInputElement | null>(null);
const hasError = ref<boolean>(false);
const isTokenError = ref<boolean>(false);

// Initialize messages with a system prompt
let openai: OpenAIApi | null = null;
let apiKey: string | null = null;
onMounted(() => {
  // Configuration and OpenAI Client Initialization
  apiKey = localStorage.getItem('token');
  const configuration = new Configuration({
    apiKey,
  });
  openai = new OpenAIApi(configuration);
  try {
    keyFound.value = !!apiKey;
    if (!keyFound.value) {
      throw new Error('No API key found in localStorage.');
    }
    messages.value = [
      {
        role: 'system',
        content: 'You are Genny, an AI assistant powered by GPT-4.',
      },
    ];
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    feedback.value = 'Unable to retrieve API key from localStorage.';
    hasError.value = true;
  }
});

// Function to add messages to the conversation
const addMessage = (role: Role, content: string): void => {
  if (role === 'user' && !content.trim()) {
    console.error('Invalid content provided. Expected a non-empty string.');
    return;
  }
  messages.value.push({ role, content });
};

// Function to handle form submission and API interaction
const handleSubmit = async (e: Event): Promise<void> => {
  e.preventDefault();

  // Early exit for empty message
  const message = userMessage.value.trim();
  if (!message) return;

  if (!apiKey) {
    hasError.value = true;
    feedback.value = 'No API key found. Please set up your API key in the settings.';
    return;
  }

  // Optimistically update the UI before waiting for the response
  addMessage('user', message);
  userMessage.value = ''; // Clear input for next message
  thinking.value = true;
  isTokenError.value = false; // Reset token error flag before making a new request

  try {
    const completion = await openai.createChatCompletion({
      model,
      messages: messages.value,
    });
    const newMessage = completion.data.choices[0].message?.content ?? 'Oops, something went wrong...';
    addMessage('assistant', newMessage);
  } catch (error: any) {
    console.error('Error calling OpenAI API:', error);
    hasError.value = true;

    // Check for specific token-related errors
    if (error.response?.data?.error?.message === "Your authentication token is not from a valid issuer.") {
      feedback.value = 'Invalid API key. Please clear your token and try again.';
      isTokenError.value = true; // Set token error flag to true
    } else {
      feedback.value = error.response?.data?.error?.message || 'There was an error processing your request. Please try again.';
    }

  } finally {
    thinking.value = false;
    inputElement.value?.focus();
  }
};

// Function to clear the token from localStorage and reset the app state
const clearToken = () => {
  localStorage.removeItem('token');
  feedback.value = '';
  hasError.value = false;
  keyFound.value = false;
  messages.value = [];
  userMessage.value = '';
  // Optionally, reload the page to reset the state
  location.reload(); // Reloads the entire page to start fresh
};

// Function to handle speech synthesis
let speechTimeout: ReturnType<typeof setTimeout>;
const speakMessage = (messageContent: string): void => {
  if ('speechSynthesis' in window) {
    if (speechTimeout) clearTimeout(speechTimeout);

    speechTimeout = setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(messageContent);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }, 100); // Small delay to debounce
  } else {
    console.warn('Speech synthesis not supported in this browser.');
  }
};

// Watcher to trigger speech synthesis when a new assistant message is added
watch(messages, (newMessages, oldMessages) => {
  const lastMessage = newMessages[newMessages.length - 1];
  if (lastMessage && lastMessage.role === 'assistant') {
    speakMessage(lastMessage.content);
  }
});

</script>

<template>
  <section class="flex flex-col items-center gap-4 py-8">
    <h1 class="text-3xl font-bold">Genny - An AI Assistant Powered by GPT-4</h1>

    <!-- Initial Instructions -->
    <div v-if="!keyFound" class="p-8 mb-4 bg-white shadow-md rounded-lg">
      <p class="text-lg font-semibold text-gray-700 mb-4">
        To get started with our chat applet, you'll first need to have an account with
        <a href="https://openai.com" class="text-blue-600 underline hover:text-blue-800"
          aria-label="Sign up for OpenAI">
          OpenAI
        </a>. If you don't have one, you can easily
        <a href="https://openai.com/signup" class="text-blue-600 underline hover:text-blue-800">
          sign up
        </a>.
      </p>
      <p class="text-lg font-semibold text-gray-700 mb-4">
        Once your account is set up, generate your unique API key from the
        <span class="font-bold">API section</span>. Your key is stored securely in your browser.
      </p>
      <p class="text-lg font-semibold text-gray-700">
        After entering your key, you're all set! Type your message into the text box and hit 'Send'.
      </p>
    </div>

    <div v-if="!keyFound">
      <NuxtLink to="/setup">
        <button class="btn btn-primary btn-wide" aria-label="Go to setup">Get Started</button>
      </NuxtLink>
    </div>

    <!-- Chat Container -->
    <div v-else class="chat-container flex flex-col items-center">
      <!-- Messages -->
      <div class="messages flex flex-col w-full max-w-2xl mb-4 px-4">
        <div v-for="(message, index) in messages" :key="index" :class="[
          'message p-4 rounded-lg mb-2 max-w-3xl break-words',
          message.role === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'
        ]">
          {{ message.role === 'system' ? 'Hello. What can I help with today?' : message.content }}
        </div>
      </div>

      <!-- Thinking Indicator -->
      <progress v-show="thinking" class="progress w-full max-w-2xl mb-4"
        aria-label="Processing your request..."></progress>

      <!-- Error Feedback -->
      <div v-if="hasError" class="error-message">
        <p>{{ feedback }}</p>
        <button @click="clearToken">Clear Token and Start Over</button>
      </div>

      <!-- Input Form -->
      <form @submit.prevent="handleSubmit" class="flex flex-col w-full max-w-2xl px-4 gap-2"
        aria-labelledby="chat-form">
        <label for="userMessage" class="sr-only">Your message</label>
        <input class="input input-bordered input-primary" ref="inputElement" :disabled="thinking" v-model="userMessage"
          id="userMessage" placeholder="Type your message..." aria-required="true" />
        <button class="btn btn-primary ml-auto px-10" type="submit" :disabled="thinking">Send</button>
      </form>

    </div>
  </section>
</template>

<style scoped>
h1 {
  font-size: 2.5rem;
}

.message {
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}
</style>
