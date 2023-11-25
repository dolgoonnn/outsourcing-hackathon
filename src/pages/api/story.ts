import { prompts } from "@/lib/form/prompts";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

export const runtime = "edge";

interface JsonRequest {
  messages: OpenAI.Chat.ChatCompletionMessageParam[];
  previewToken?: string;
  // prompt:string
  // Add more properties as needed based on your actual JSON structure
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: Request, res: Response) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  // Use type assertion for the whole req object
  const reqWithJson = req as unknown as { json: () => Promise<JsonRequest> };

  // Use type assertion for the result of the json method
  const json = await reqWithJson.json();
  const { messages, previewToken } = json;

  const systemMessage: OpenAI.Chat.ChatCompletionMessageParam = {
    role: "system",
    content: prompts.userStory,
  };

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    stream: true,
    messages: [systemMessage, ...messages],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
