import MainNavigation from "@/components/main-navigation";
import { Separator } from "@/components/ui/separator";
import { GeneralForm } from "@/components/general-form";
import { nanoid } from "@/lib/utils";
import { Chat } from "@/components/chat";
import { Message } from "ai";
import { useStore } from "@/lib/form/store";

export default function SettingsAccountPage() {
  const id = nanoid();
  const { formattedAnswer, answers, poChat, setPoChat } = useStore();
  console.log("🚀 ~ SettingsAccountPage ~ poChat:", poChat);
  console.log(
    "🚀 ~ file: index.tsx:12 ~ SettingsAccountPage ~ answers:",
    answers,
  );

  // const initialMessages: Message[] = [
  //   {
  //     id: id,
  //     role: 'assistant',
  //     content: 'Please acknowledge my following request. Please respond to me as a product owner. I will ask for subject, and you will help me writing a PRD for it with these headers: Subject, Introduction, Problem Statement, Goals and Objectives, User Stories, Technical requirements, Benefits, KPIs, Development Risks.'
  //   }
  // ];
  const initialInput = `Here is my business idea's question answers in json format ${JSON.stringify(
    formattedAnswer,
  )}`;
  return (
    <MainNavigation>
      <div className="space-y-6">
        {answers.question1 != undefined && (
          <Chat
            id={id}
            initialInput={initialInput}
            agent="po"
            initialMessages={poChat}
            setPoChat={setPoChat}
          />
        )}
        {/* <GeneralForm /> */}
      </div>
    </MainNavigation>
  );
}
