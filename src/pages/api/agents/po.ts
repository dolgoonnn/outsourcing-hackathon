// import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from "ai";
import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessage,
} from "openai-edge";
import type { NextApiRequest, NextApiResponse } from "next";
// import { auth } from '@/auth'
import { nanoid } from "@/lib/utils";
import OpenAI from "openai";
import { prompts } from "@/lib/form/prompts";
export const runtime = "edge";

interface JsonRequest {
  messages: OpenAI.Chat.ChatCompletionMessageParam[];
  previewToken?: string;
  // prompt:string
  // Add more properties as needed based on your actual JSON structure
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// const openai = new OpenAIApi(configuration)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(404);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  // Use type assertion for the whole req object
  const reqWithJson = req as unknown as { json: () => Promise<JsonRequest> };

  // Use type assertion for the result of the json method
  const json = await reqWithJson.json();

  const { messages, previewToken } = json;
  // const userId = (await auth())?.user.id

  // if (!userId) {
  //   return new Response('Unauthorized', {
  //     status: 401
  //   })
  // }
  const prompt = prompts.poRole;

  if (previewToken) {
    configuration.apiKey = previewToken;
  }
  const systemMessage: OpenAI.Chat.ChatCompletionMessageParam = {
    role: "system",
    content: prompt,
  };

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [systemMessage, ...messages],
    temperature: 0.5,
    stream: true,
    // prompt: prompt
  });
  if (messages === undefined) {
    return res.status(500);
  }
  const stream = OpenAIStream(response, {
    onCompletion(completion) {
      // const title = messages[0].content.substring(0, 100)
      const id = nanoid();
      const createdAt = Date.now();
      const path = `/chat/${id}`;
      const payload = {
        id,
        // title,
        // userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: "assistant",
          },
        ],
      };
      console.log("🚀 ~ file: chat.ts:74 ~ onCompletion ~ payload:", payload);
      // await kv.hmset(`chat:${id}`, payload)
      // await kv.zadd(`user:chat:${userId}`, {
      //   score: createdAt,
      //   member: `chat:${id}`
      // })
    },
  });

  return new StreamingTextResponse(stream);
}
