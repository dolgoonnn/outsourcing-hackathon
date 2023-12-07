import { useChat, type Message } from "ai/react";

import { cn } from "@/lib/utils";
import { ChatList } from "@/components/chat-list";
import { ChatPanel } from "@/components/chat-panel";
// import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from "@/components/chat-scroll-anchor";

import { toast } from "sonner";
import { useEffect } from "react";
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
    if (messages.length == 0 && initialMessages.length == 0) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handleTrigger();
    } else if (messages.length > 0 && !isLoading) {
      // setSavedMessages(filterMessagesByRole(messages, "assistant"));
      setPoChat(messages);
      nextStep();
    }
  }, [messages, isLoading, initialMessages.length]);
  const restOfMessages = messages.slice(1);
  return (
    <>
      <div className={cn("pb-[250px] pt-4 md:pt-10", className)}>
        {/* {messages.length ? ( */}
        <>
          <ChatList messages={restOfMessages} />
          <ChatScrollAnchor trackVisibility={isLoading} />
        </>
        {/* // ) : (
        //   <EmptyScreen setInput={setInput} />
        // )} */}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />
    </>
  );
}
