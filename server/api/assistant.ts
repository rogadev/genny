import { askGenny } from "../openai";

const { PASSPHRASE } = useRuntimeConfig();
let timeout = Math.floor(Date.now() / 1000 / 60);
let penalty = 0;

export default defineEventHandler(async (event) => {
  if (penalty > 10) return sendError(event, 'Server detected possible brute force attack. Requests are no longer being accepted. Goodbye.');
  const { prompt, passphrase } = await readBody(event);
  if (!passphrase || passphrase !== PASSPHRASE) {
    if (timeout > Math.floor(Date.now() / 1000 / 60)) {
      penalty += 1;
      timeout = Math.floor(Date.now() / 1000 / 60) + penalty;
      return sendError(event, `Invalid passphrase. Please try again in ${penalty} minute${penalty > 1 ? 's' : ''}.`);
    } else {
      penalty = 1;
      timeout = Math.floor(Date.now() / 1000 / 60) + penalty;
      return sendError(event, 'Invalid passphrase. Please try again in 1 minute.');
    }
  }

  const message = await askGenny(prompt);
  return { message };
});