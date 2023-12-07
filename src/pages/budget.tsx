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
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
    "🚀 ~ file: budget.tsx:45 ~ SettingsAccountPage ~ formattedAnswer:",
    formattedAnswer,
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

  const companies = [
    {
      id: "1",
      imageUrl: "/og.png",
      title: "Nasha tech",
      email: "sales@nashatech.com",
      description:
        "As a forward-thinking technology company, we are committed to delivering high-quality software development services.",
    },
    {
      id: "1",
      imageUrl: "/og.png",
      email: "sales@tsashatech.com",
      title: "Tsasha tech",
      description:
        "We are a dynamic, innovative and well-established company. Our goal is to create value for our clients by delivering cutting-edge solutions and services.",
    },
  ];

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
        {!isLoading && (
          <>
            <div className="py-4 text-2xl">Suggested company</div>

            <div className="grid grid-cols-2 gap-4">
              {companies.map((card, index) => (
                <CompanyCard key={index} cardData={card} />
              ))}
            </div>
          </>
        )}
        {/* <div className="w-full flex justify-start">
          <div className="">Project Name: {answers.question1}</div>
        </div> */}
      </div>
    </MainNavigation>
  );
}
type CardData = {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  email: string;
};

function CompanyCard({ cardData }: { cardData: CardData }) {
  const { imageUrl, title, description, id, email } = cardData;
  return (
    <div className="p-6 flex flex-col rounded-xl border border-slate-500 bg-slate-800 relative">
      <Image
        src={imageUrl}
        height={64}
        width={64}
        alt="logo"
        className="absolute top-12 left-4 "
      />
      <div className="h-[92px]"></div>

      <div className="flex flex-col gap-4">
        <div className="text-base text-bold">{title}</div>
        <div className="text-sm text-slate-100">{description}</div>
      </div>
      <div className="pt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Send</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Send</DialogTitle>
              <DialogDescription className="pt-4">
                Company: {title}
              </DialogDescription>
              <DialogDescription className="pt-4">
                Email: {email}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4"></div>
            <DialogFooter>
              <Button type="submit">Send this info</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
