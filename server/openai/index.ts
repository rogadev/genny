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

export async function askGenny(question: string) {
  const messages = generatePrompt(question);
  const completion = await openai.createChatCompletion({
    model,
    messages,
  });
  return completion.data.choices[0].message?.content;
}