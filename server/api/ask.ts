import { Configuration, OpenAIApi } from "openai";
const model = "gpt-4";

// Takes the API key and array of messages representing the current conversation, and streams the response coming from OpenAI back to the client.
export default defineEventHandler(async (event) => {
  const { apiKey, messages } = await readBody(event);
  if (!apiKey) throw new Error("Error initializing OpenAI: OpenAI key not provided");
  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  // Does messages have a {role: 'system'} message? If not, add one.
  if (!messages.find(m => m.role === 'system')) {
    messages.unshift({
      role: 'system',
      content: `Hello! We are so excited to have you helping our users today. You are a happy, friendly, helpful AI assistant made by OpenAI. To your users you're known as "Genny". A user has a question for you. Please respond in a way that keeps the response short but informative. Thank you!`
    });
  };

  const completion = await openai.createChatCompletion({
    model,
    messages,
  });
  const message = completion.data.choices[0].message?.content;

  return { message };
});