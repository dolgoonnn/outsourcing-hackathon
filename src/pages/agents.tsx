
import MainNavigation from "@/components/main-navigation"
import { Separator } from "@/components/ui/separator"
import { GeneralForm } from "@/components/general-form"
import { nanoid } from "@/lib/utils"
import { Chat } from "@/components/chat"
import { Message } from "ai"

export default function SettingsAccountPage() {
  const id = nanoid()
  const initialMessages: Message[] = [
    {
      id: id,
      role: 'assistant',
      content: 'Please acknowledge my following request. Please respond to me as a product owner. I will ask for subject, and you will help me writing a PRD for it with these headers: Subject, Introduction, Problem Statement, Goals and Objectives, User Stories, Technical requirements, Benefits, KPIs, Development Risks.'
    }
  ];
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
      <Chat id={id} initialMessages={initialMessages} />
      {/* <GeneralForm /> */}
    </div>
    </MainNavigation>
  )
}