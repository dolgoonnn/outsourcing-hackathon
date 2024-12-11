import { useChat, type Message } from "ai/react";
import { cn } from "@/lib/utils";
import { ChatList } from "@/components/chat-list";
import { ChatPanel } from "@/components/chat-panel";
import { ChatScrollAnchor } from "@/components/chat-scroll-anchor";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { filterMessagesByRole } from "@/lib/utils";
import { useStore } from "@/lib/form/store";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages: Message[];
  id?: string;
  initialInput: string;
  agent?: string;
  setBaChat: (baChat: Message[]) => void;
  // baChat: Message[];
}

export function BaChat({
  id,
  initialMessages,
  className,
  initialInput,
  agent,
  setBaChat, // baChat,
}: ChatProps) {
  // Add ref to track initial trigger
  const initialTriggerFired = useRef(false);
  const { nextStep } = useStore();

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
    // Only proceed to next step when messages have loaded and aren't empty
    else if (messages.length > 0 && !isLoading) {
      setBaChat(messages);
      nextStep();
    }
  }, [messages, isLoading, initialMessages.length, setBaChat, nextStep]);

  // Get messages after the first one, using useMemo for performance
  const restOfMessages = messages.slice(1);

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
