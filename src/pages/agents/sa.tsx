import MainNavigation from "@/components/main-navigation";
import { Separator } from "@/components/ui/separator";
import { GeneralForm } from "@/components/general-form";
import { nanoid } from "@/lib/utils";
import { Chat } from "@/components/chat";
import { Message } from "ai";
import { useStore } from "@/lib/form/store";
import { SaChat } from "@/components/chat/sa-chat";
import { Mermaid } from "@/components/mermaid";

export default function SettingsAccountPage() {
  const id = nanoid();
  const { formattedAnswer, answers, saChat, setSaChat } = useStore();
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
  const initialInput = `Here is my business analyst analysed with question answers in json format. Given the user story in string array: ${JSON.stringify(
    answers.question9,
  )}`;
  const customInput = `
  sequenceDiagram\n participant MarketingManager as "Marketing Manager"\n participant MarketingEnthusiast as "Marketing Enthusiast"\n participant ProductOwner as "Product Owner"\n participant User as "User"\n participant BusinessOwner as "Business Owner"\n participant Marketer as "Marketer"\n\n MarketingManager->ProductOwner: Implement effective marketing activities\n MarketingEnthusiast->MarketingManager: Learn effective marketing strategies\n ProductOwner->Platform: Register product or service information\n User->Platform: Access registered information\n BusinessOwner->Platform: Receive marketing suggestions\n Marketer->Platform: Gather and suggest up-to-date information\n User->Platform: Use user-friendly interface\n MarketingProfessional->Platform: Use analytics tools\n BusinessOwner->Platform: Set up notification preferences\n User->Platform: Receive continuous updates and adaptions`;
  return (
    <MainNavigation>
      <div className="space-y-6">
        {answers.question1 != undefined && (
          <SaChat
            id={id}
            initialInput={initialInput}
            agent="sa"
            initialMessages={saChat}
            setSaChat={setSaChat}
          />
        )}
        {/* <Mermaid chart={customInput} /> */}
        {/* <GeneralForm /> */}
      </div>
    </MainNavigation>
  );
}
