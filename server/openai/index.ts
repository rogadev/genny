import { Configuration, OpenAIApi } from "openai";
const { OPENAI_API_KEY: apiKey } = useRuntimeConfig();

const model = "gpt-3.5-turbo";
const configuration = new Configuration({ apiKey });
const openai = new OpenAIApi(configuration);
const generatePrompt = (content: string) => {
  return [
    {
      role: 'system',
      content: `Hello! We are so excited to have you helping our users today. You are a happy, friendly, helpful AI assistant made by OpenAI. To your users you're known as "Genny". A user has a question for you. Please respond in a way that keeps the response short but informative. Thank you!`
    },
    {
      role: 'user',
      content
    }
  ];
};

export async function askGenny(query: string) {
  const messages = generatePrompt(query);
  const completion = await openai.createChatCompletion({
    model,
    messages,
  });
  return completion.data.choices[0].message?.content;
}

export async function talkToGenny(audio) {
  // Convert the audio to a readable stream
  const audioStream = createReadStream(audio.path);

  // Convert the audio format to wav
  const { exec } = require('child_process');
  const wavAudioPath = '/path/to/wav/audio/file';
  await new Promise((resolve, reject) => {
    const command = `ffmpeg -i ${audio.path} -acodec pcm_s16le -ar 16000 ${wavAudioPath}`;
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  const wavAudioStream = createReadStream(wavAudioPath);

  // Pass the wav audio stream to the OpenAI API for transcription
  const resp = await openai.createTranscription(wavAudioStream, "whisper-1");
  console.log(resp);
  return resp.data[0].text;
}