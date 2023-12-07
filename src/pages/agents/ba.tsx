import MainNavigation from "@/components/main-navigation";
import { Separator } from "@/components/ui/separator";
import { GeneralForm } from "@/components/general-form";
import { nanoid } from "@/lib/utils";
// import { Chat } from "@/components/chat";
import { BaChat } from "@/components/chat/ba-chat";
import { Message } from "ai";
import { useStore } from "@/lib/form/store";

export default function SettingsAccountPage() {
  const id = nanoid();
  const { formattedAnswer, answers, baChat, setBaChat, poChat } = useStore();
  console.log(
    "🚀 ~ file: agents.tsx:13 ~ SettingsAccountPage ~ formattedAnswer:",
    formattedAnswer,
  );
  // const initialMessages: Message[] = [
  //   {
  //     id: id,
  //     role: 'assistant',
  //     content: 'Please acknowledge my following request. Please respond to me as a product owner. I will ask for subject, and you will help me writing a PRD for it with these headers: Subject, Introduction, Problem Statement, Goals and Objectives, User Stories, Technical requirements, Benefits, KPIs, Development Risks.'
  //   }
  // ];
  const initialInput = `Here is my business idea's product owner analysed with question answers in json format ${JSON.stringify(
    poChat,
  )}`;
  return (
    <MainNavigation>
      <div className="space-y-6">
        {answers.question1 != undefined && (
          <BaChat
            id={id}
            initialInput={initialInput}
            agent="sa"
            initialMessages={baChat}
            setBaChat={setBaChat}
          />
        )}
        {/* <GeneralForm /> */}
      </div>
    </MainNavigation>
  );
}
