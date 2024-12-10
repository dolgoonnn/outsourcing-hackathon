import { useChat, type Message } from "ai/react";
import { cn } from "@/lib/utils";
import { ChatList } from "@/components/chat-list";
import { ChatScrollAnchor } from "@/components/chat-scroll-anchor";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { useStore } from "@/lib/form/store";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages: Message[];
  id?: string;
  initialInput: string;
  agent?: string;
  setPoChat: (poChat: Message[]) => void;
}

export function Chat({
  id,
  initialMessages,
  className,
  initialInput,
  agent,
  setPoChat,
}: ChatProps) {
  // Add a ref to track if initial trigger has been fired
  const initialTriggerFired = useRef(false);

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      api: "/api/agents/po",
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

  const { nextStep } = useStore();

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
      setPoChat(messages);
      nextStep();
    }
  }, [messages, isLoading, initialMessages.length, setPoChat, nextStep]);

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
