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
  const [timeArray, setTimeArray] = useState([""]);
  const { messages, handleSubmit, isLoading, append } = useChat({
    api: "/api/time",
  });

  const { formattedAnswer, storyChat, setStoryChat, answers } = useStore();
  // console.log("🚀 ~ file: stories.tsx:20 ~ formattedAnswer:", formattedAnswer);

  const handleTrigger = async (text: string) => {
    const id = nanoid();
    // if (formattedAnswer.question9.length == 0) {
    //   return;
    // }

    // try {
    await append({
      id,
      content: text,
      role: "user",
    });
  };
  useEffect(() => {
    // if (messages.length == 0 && storyChat.length == 0) {
    //   // eslint-disable-next-line @typescript-eslint/no-floating-promises
    //   handleTrigger();
    // } else if (messages.length > 0 && !isLoading) {
    //   // setSavedMessages(filterMessagesByRole(messages, "assistant"));
    //   // setStoryChat(filterMessagesByRole(messages, "assistant"));
    // }
    if (answers.question9 != undefined) {
      answers.question9.forEach((story) => {
        // Here, you can call the function to send the user story to GPT-4 for time estimation
        // For example:
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        handleTrigger(
          `Given the user story: '${story}', estimate the time required to implement this user story.`,
        );
      });
    }
  }, [answers, isLoading]);

  // Calculate the estimated cost for each user story
  const costPerUnitTime = 50;
  useEffect(() => {
    messages.forEach((message) => {
      if (
        message.role === "assistant" &&
        !timeArray.includes(message.content)
      ) {
        const timeEstimation = parseInt(message.content);
        const estimatedCost = timeEstimation * costPerUnitTime;
        setTimeArray([...timeArray, estimatedCost.toString()]);
        console.log(`Estimated cost for the user story: $${estimatedCost}`);
      }
    });
  }, [messages]); // This runs whenever there's a new message from the assistant
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
        {(messages.length !== 0 || storyChat.length !== 0) && !isLoading && (
          <StoriesForm />
        )}
      </div>
    </MainNavigation>
  );
}
