import MainNavigation from "@/components/main-navigation";
import { Separator } from "@/components/ui/separator";
import { BaForm } from "@/components/ba-form";
import { StoriesForm } from "@/components/stories-form";
import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";
import { useChat } from "ai/react";
import { useStore } from "@/lib/form/store";
import { filterMessagesByRole, nanoid } from "@/lib/utils";
import { ChatList } from "@/components/chat-list";
import { Message } from "ai";

export default function SettingsAccountPage() {
  const [savedMessages, setSavedMessages] = useState<Message[]>([]);
  const { messages, handleSubmit, isLoading, append } = useChat({
    api: "/api/story",
  });

  const { formattedAnswer, storyChat, setStoryChat } = useStore();
  // console.log("🚀 ~ file: stories.tsx:20 ~ formattedAnswer:", formattedAnswer);

  const handleTrigger = async () => {
    const id = nanoid();
    // if (formattedAnswer.question9.length == 0) {
    //   return;
    // }
    const initialInput = `Here is my business idea's question answers in json format ${JSON.stringify(
      formattedAnswer,
    )}`;
    // try {
    await append({
      id,
      content: initialInput,
      role: "user",
    });
  };
  useEffect(() => {
    if (messages.length == 0) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handleTrigger();
    } else if (messages.length > 0 && !isLoading) {
      setSavedMessages(filterMessagesByRole(messages, "assistant"));
      setStoryChat(filterMessagesByRole(messages, "assistant"));
    }
  }, [messages, isLoading]);
  return (
    <MainNavigation>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Account</h3>
          <p className="text-sm text-muted-foreground">
            Update your account settings. Set your preferred language and
            timezone.
          </p>
        </div>
        <Separator />
        <ChatList
          messages={
            messages.length == 0
              ? storyChat
              : filterMessagesByRole(messages, "assistant")
          }
        />
        {messages.length !== 0 && storyChat.length !== 0 && !isLoading && (
          <StoriesForm />
        )}
      </div>
    </MainNavigation>
  );
}
