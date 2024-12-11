import MainNavigation from "@/components/main-navigation";
import { useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { useStore } from "@/lib/form/store";
import { filterMessagesByRole, nanoid } from "@/lib/utils";
import { ChatList } from "@/components/chat-list";
import { StoriesForm } from "@/components/stories-form";

export default function StoriesPage() {
  const { messages, append, isLoading } = useChat({
    api: "/api/story",
  });

  const { formattedAnswer, answers, storyChat, setStoryChat } = useStore();
  const hasTriggeredChat = useRef(false);

  const handleTrigger = async () => {
    const id = nanoid();
    const initialInput = `Here is my business idea's question answers in json format ${JSON.stringify(
      formattedAnswer,
    )}`;
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
      storyChat.length === 0 &&
      answers.question1 !== undefined
    ) {
      hasTriggeredChat.current = true;
      void handleTrigger();
    }
  }, [answers.question1, storyChat.length]);

  // Second useEffect to handle message updates
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      const assistantMessages = filterMessagesByRole(messages, "assistant");
      if (JSON.stringify(assistantMessages) !== JSON.stringify(storyChat)) {
        setStoryChat(assistantMessages);
      }
    }
  }, [messages, isLoading]);

  const displayMessages =
    messages.length === 0
      ? storyChat
      : filterMessagesByRole(messages, "assistant");

  return (
    <MainNavigation>
      <div className="space-y-6">
        <ChatList messages={displayMessages} />
        {displayMessages.length > 0 && !isLoading && <StoriesForm />}
      </div>
    </MainNavigation>
  );
}
