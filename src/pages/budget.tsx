import MainNavigation from "@/components/main-navigation";
import { useEffect, useState } from "react";
import { useChat } from "ai/react";
import { useStore } from "@/lib/form/store";
import { nanoid } from "@/lib/utils";
import { Message } from "ai";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { filterMessagesByRole } from "@/lib/utils";

export default function SettingsAccountPage() {
  const [savedMessages, setSavedMessages] = useState<Message[]>([]);
  const [triggerCalled, setTriggerCalled] = useState(false);
  const [finished, setFinished] = useState(false);

  const [timeArray, setTimeArray] = useState<string[]>([]);
  const { messages, handleSubmit, isLoading, append } = useChat({
    api: "/api/time",
    async onFinish() {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFinished(true);
    },

    // onFinish(message) {
    //   console.log("🚀 ~ file: budget.tsx:28 ~ onFinish ~ message:", message);
    // },
  });
  console.log("🚀 ~ file: budget.tsx:19 ~ messages:", messages);

  const { formattedAnswer, storyChat, setStoryChat, answers } = useStore();
  console.log(
    "🚀 ~ file: budget.tsx:32 ~ SettingsAccountPage ~ answers:",
    answers,
  );
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

  const costPerUnitTime = 50000;

  let totalCost = 0;

  function formatNumberWithCommas(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  }

  return (
    <MainNavigation>
      <div className="space-y-6">
        <div className="py-8 text-2xl">Cost estimation</div>

        {!isLoading ? (
          finished &&
          (() => {
            const filteredMessages = filterMessagesByRole(
              messages,
              "assistant",
            );

            if (filteredMessages.length === 0) {
              return null;
            }

            let contentArray = [];
            try {
              contentArray = JSON.parse(
                filteredMessages[0].content,
              ) as string[];
            } catch (error) {
              console.log("Error parsing content array:", error);
              return null; // or handle the error as needed
            }

            if (!Array.isArray(contentArray)) {
              return null;
            }

            const time = filteredMessages.length > 0 ? contentArray[0] : "";

            const time2 = filteredMessages.length > 0 ? contentArray[1] : "";
            const cost = parseInt(time) * costPerUnitTime;
            const cost2 = parseInt(time2) * costPerUnitTime;
            totalCost += cost;

            return (
              <div className="flex flex-col gap-8">
                <Slider defaultValue={[28, 70]} />
                <div className="grid grid-cols-10">
                  <div className="col-start-3">
                    <Badge>{formatNumberWithCommas(cost)}₮</Badge>
                  </div>
                  <div className="col-start-7">
                    <Badge>{formatNumberWithCommas(cost2)}₮</Badge>
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="w-full h-[100px] flex items-center justify-center">
            <div className="flex flex-col gap-4 justify-center items-center">
              <Icons.spinner
                className="w-8 h-8 md:mr-2 animate-spin "
                aria-hidden="true"
              />
              <div>Loading</div>
            </div>
          </div>
        )}
        {/* <div className="w-full flex justify-start">
          <div className="">Project Name: {answers.question1}</div>
        </div> */}
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
