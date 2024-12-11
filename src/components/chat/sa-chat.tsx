import { useChat, type Message } from "ai/react";
import { cn } from "@/lib/utils";
import { ChatList } from "@/components/chat-list";
import { ChatScrollAnchor } from "@/components/chat-scroll-anchor";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { Mermaid } from "@/components/mermaid";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages: Message[];
  id?: string;
  initialInput: string;
  agent?: string;
  setSaChat: (saChat: Message[]) => void;
}

export function SaChat({
  id,
  initialMessages,
  className,
  initialInput,
  agent,
  setSaChat,
}: ChatProps) {
  // Add ref to track initial trigger
  const initialTriggerFired = useRef(false);

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      api: "/api/agents/sa",
      initialInput,
      initialMessages,
      id,
      body: {
        id,
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText);
        }
      },
    });

  const handleTrigger = async () => {
    await append({
      id,
      content: initialInput,
      role: "user",
    });
  };

  useEffect(() => {
    setInput("");

    // Only trigger initial message if it hasn't been fired and there are no messages
    if (
      !initialTriggerFired.current &&
      messages.length === 0 &&
      initialMessages.length === 0
    ) {
      initialTriggerFired.current = true;
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handleTrigger();
    }
    // Only update messages when they've loaded and aren't empty
    else if (messages.length > 0 && !isLoading) {
      setSaChat(messages);
    }
  }, [messages, isLoading, initialMessages.length, setSaChat]);

  // Get messages after the first one
  const restOfMessages = messages.slice(1);

  return (
    <>
      <div className={cn("pb-[250px] pt-4 md:pt-10", className)}>
        <>
          <ChatList messages={restOfMessages} />
          <ChatScrollAnchor trackVisibility={isLoading} />
        </>
        {/* Only render Mermaid chart when messages are loaded and not empty */}
        {!isLoading && messages.length > 0 && (
          <Mermaid chart={restOfMessages[0]?.content} />
        )}
      </div>
    </>
  );
}
