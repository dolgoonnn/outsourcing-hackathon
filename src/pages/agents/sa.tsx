import MainNavigation from "@/components/main-navigation";
import { Separator } from "@/components/ui/separator";
import { GeneralForm } from "@/components/general-form";
import { nanoid } from "@/lib/utils";
import { Chat } from "@/components/chat";
import { Message } from "ai";
import { useStore } from "@/lib/form/store";

export default function SettingsAccountPage() {
  const id = nanoid();
  const { formattedAnswer } = useStore();
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
  const initialInput = `Here is my business idea's question answers in json format ${JSON.stringify(
    formattedAnswer,
  )}`;
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
        <Chat
          id={id}
          initialInput={initialInput}
          agent="sa"
          initialMessages={[]}
        />
        {/* <GeneralForm /> */}
      </div>
    </MainNavigation>
  );
}
