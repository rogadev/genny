<template>
  <div>
    <button v-if="!recording" @click="startRecording" :disabled="recording">Start Recording</button>
    <button v-else @click="stopRecording" :disabled="!recording">Stop Recording</button>
    <audio v-if="audioData.url" :src="audioData.url" controls></audio>
    <div v-if="audioData.url">
      <button @click="sendAudio">Send Audio</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const recording = ref(false);
const audioData = ref<AudioData>({ blob: null, url: null });
let chunks: Blob[] = [];
let mediaRecorder: MediaRecorder;

const startRecording = () => {
  chunks = [];
  recording.value = true;
  const mediaStream = navigator.mediaDevices.getUserMedia({ audio: true });
  mediaStream.then(stream => {
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.addEventListener('dataavailable', event => {
      chunks.push(event.data);
    });

    mediaRecorder.addEventListener('stop', () => {
      const blob = new Blob(chunks, {
        type: 'audio/wav' // Change this to match your audio file format
      });
      const url = URL.createObjectURL(blob);

      audioData.value = { blob, url };
      recording.value = false;
    });

    mediaRecorder.start();
  });
};

const stopRecording = async () => {
  recording.value = false;
  mediaRecorder.stop();
  await sendAudio();
};

const sendAudio = async () => {
  const audioToSend = audioData.value.blob;
  if (!audioToSend) {
    console.error("No audio data recorded.");
    return;
  }

  const formData = new FormData();
  formData.append('audio', audioToSend, 'recorded-audio.wav');
  const response = await fetch('/api/stt', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  return data;
};
</script>