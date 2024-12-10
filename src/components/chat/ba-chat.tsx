import { useChat, type Message } from "ai/react";
import { cn } from "@/lib/utils";
import { ChatList } from "@/components/chat-list";
import { ChatPanel } from "@/components/chat-panel";
import { ChatScrollAnchor } from "@/components/chat-scroll-anchor";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { filterMessagesByRole } from "@/lib/utils";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages: Message[];
  id?: string;
  initialInput: string;
  agent?: string;
  setBaChat: (baChat: Message[]) => void;
  baChat: Message[];
}

export function BaChat({
  id,
  initialMessages,
  className,
  initialInput,
  agent,
  setBaChat,
  baChat,
}: ChatProps) {
  // Add ref to track initial trigger
  const hasTriggeredChat = useRef(false);

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      api: "/api/agents/ba",
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

  // First useEffect to handle initial trigger
  useEffect(() => {
    if (
      !hasTriggeredChat.current &&
      baChat.length === 0 &&
      initialMessages.length === 0
    ) {
      hasTriggeredChat.current = true;
      setInput("");
      handleTrigger();
    }
  }, [baChat.length, initialMessages.length]);

  // Second useEffect to handle message updates
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      const assistantMessages = filterMessagesByRole(messages, "assistant");
      if (JSON.stringify(assistantMessages) !== JSON.stringify(baChat)) {
        setBaChat(assistantMessages);
      }
    }
  }, [messages, isLoading]);

  // Get messages to display
  const displayMessages =
    messages.length === 0
      ? baChat
      : filterMessagesByRole(messages, "assistant");
  const restOfMessages = displayMessages.slice(1);

  return (
    <>
      <div className={cn("pb-[250px] pt-4 md:pt-10", className)}>
        <>
          <ChatList messages={restOfMessages} />
          <ChatScrollAnchor trackVisibility={isLoading} />
        </>
      </div>
    </>
  );
}
