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
  const [triggerCalled, setTriggerCalled] = useState(false);
  const [finished, setFinished] = useState(false);

  const [timeArray, setTimeArray] = useState<string[]>([]);
  const { messages, handleSubmit, isLoading, append } = useChat({
    api: "/api/time",
    async onFinish() {
      console.log("finished");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("finished with awaited");
      setFinished(true);
    },

    // onFinish(message) {
    //   console.log("🚀 ~ file: budget.tsx:28 ~ onFinish ~ message:", message);
    // },
  });
  console.log("🚀 ~ file: budget.tsx:19 ~ messages:", messages);

  const { formattedAnswer, storyChat, setStoryChat, answers } = useStore();
  // console.log("🚀 ~ file: stories.tsx:20 ~ formattedAnswer:", formattedAnswer);

  const handleTrigger = async (text: string) => {
    const id = nanoid();
    console.log("🚀 ~ file: budget.tsx:28 ~ handleTrigger ~ id:", id);
    // if (formattedAnswer.question9.length == 0) {
    //   return;
    // }

    await append({
      id,
      content: text,
      role: "user",
    });
    setTriggerCalled(false);
  };

  useEffect(() => {
    if (answers.question9 != undefined && !isLoading && !triggerCalled) {
      // answers.question9.forEach((story) => {
      setTriggerCalled(true);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handleTrigger(
        `Given the user story in string array: '${JSON.stringify(
          answers.question9,
        )}', estimate the time required to implement this user story and return int array. Dont return anything than array estimate`,
      );
      // });
    } else if (answers.question9 === undefined || isLoading) {
      setTriggerCalled(false);
    }
  }, [answers]);

  const costPerUnitTime = 30000;
  // useEffect(() => {
  //   if (
  //     messages.length !== 0 &&
  //     !isLoading &&
  //     answers.question9 &&
  //     messages.length == answers.question9.length
  //   ) {
  //     const newTimeArray = [...timeArray];
  //     messages.forEach((message) => {
  //       if (
  //         message.role === "assistant" &&
  //         !timeArray.includes(message.content)
  //       ) {
  //         const timeEstimation = parseInt(message.content);
  //         const estimatedCost = timeEstimation * costPerUnitTime;

  //         newTimeArray.push(estimatedCost.toString());
  //         console.log(`Estimated cost for the user story: $${estimatedCost}`);
  //       }
  //     });
  //     setTimeArray(newTimeArray);
  //   }
  // }, [messages, isLoading]); // Removed timeArray from the dependencies
  let totalCost = 0;
  console.log(
    "🚀 ~ file: budget.tsx:107 ~ SettingsAccountPage ~ isLoading:",
    isLoading,
  );

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
        {/* <ChatList
          messages={
            messages.length == 0
              ? storyChat
              : filterMessagesByRole(messages, "assistant")
          }
        /> */}
        {finished &&
          !isLoading &&
          answers.question9?.map((story, index) => {
            const filteredMessages = filterMessagesByRole(
              messages,
              "assistant",
            );

            if (filteredMessages.length == 0) {
              return "";
            }
            let contentArray = [];
            try {
              contentArray = JSON.parse(
                filteredMessages[0].content,
              ) as string[];
            } catch (error) {
              console.log("Error parsing content array:", error);
              return ""; // or handle the error as needed
            }
            if (!Array.isArray(JSON.parse(filteredMessages[0].content))) {
              return "";
            }
            // const contentArray = JSON.parse(
            //   filteredMessages[0].content,
            // ) as string[];

            // Assuming messages[0] is the desired message, adjust this part accordingly
            const time = filteredMessages.length > 0 ? contentArray[index] : "";
            const cost = parseInt(time) * costPerUnitTime;
            totalCost += cost;
            return <Quote key={index} story={story} time={time} cost={cost} />;
          })}
        <div className="py-8 text-2xl">Total cost ₮{totalCost}</div>
        {/* {(messages.length !== 0 || storyChat.length !== 0) && !isLoading && (
          <StoriesForm />
        )} */}
      </div>
    </MainNavigation>
  );
}

function Quote({
  story,
  time,
  cost,
}: {
  story: string;
  time: string;
  cost: number;
}) {
  return (
    <div>
      <h2>{story}</h2>
      <p>Estimated Time: {time} hours</p>
      <p>Cost: ₮{cost}</p>
    </div>
  );
}
