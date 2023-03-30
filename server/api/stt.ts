import { talkToGenny } from '../openai';
import { createReadStream } from 'fs';

export default async (req, res) => {
  try {
    // Get the audio file from the request body
    const audio = req.body.audio;

    // Convert the audio to a readable stream
    const audioStream = createReadStream(audio.path);

    // Transcribe the speech in the audio file to text
    const text = await talkToGenny(audioStream);

    // Return the transcribed text to the frontend
    res.status(200).json({ text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error transcribing speech.' });
  }
};