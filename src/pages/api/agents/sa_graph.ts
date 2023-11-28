// import { kv } from '@vercel/kv'
import {deflate} from "pako";
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
import { parse } from "path";
import { stringify } from "querystring";
export const runtime = "edge";
import { fromUint8Array } from "js-base64";
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

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
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
  const prompt = prompts.saGraph;

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
      console.log("🚀 ~ file: sa working ~ onCompletion ~ payload:", payload);
    },
  });
  return new StreamingTextResponse(stream);
}

export const parseCodeFromMessage = (message: string) => {
    const regex = /```(?:mermaid)?\s*([\s\S]*?)```/;
    const match = message.match(regex);
  
    if (match) {
      return match[1];
    } else {
      return message;
    }
  };
  
  export const serializeCode = (code: string) => {
    const state = {
      code: parseCodeFromMessage(code),
      mermaid: JSON.stringify(
        {
          theme: "default",
        },
        undefined,
        2
      ),
      autoSync: true,
      updateDiagram: true,
    };
    const data = new TextEncoder().encode(JSON.stringify(state));
    const compressed = deflate(data, { level: 9 });
    return fromUint8Array(compressed, true);
  };
