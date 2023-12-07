import { type UseChatHelpers } from "ai/react";

import { Button } from "@/components/ui/button";
import { PromptForm } from "@/components/prompt-form";
import { ButtonScrollToBottom } from "@/components/button-scroll-to-bottom";
import { Icons } from "@/components/ui/icons";
// import { FooterText } from '@/components/footer'

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | "append"
    | "isLoading"
    | "reload"
    | "messages"
    | "stop"
    | "input"
    | "setInput"
  > {
  id?: string;
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages,
}: ChatPanelProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="grid grid-cols-12">
        {/* <div className="col-span-4"></div> */}
        <div className="mx-auto w-[70%]  sm:px-4 col-start-3 col-span-10">
          <div className="flex items-center justify-center h-10">
            {isLoading ? (
              <Button
                variant="outline"
                onClick={() => stop()}
                className="bg-background"
              >
                <Icons.IconStop className="mr-2" />
                Stop generating
              </Button>
            ) : (
              messages?.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => reload()}
                  className="bg-background"
                >
                  <Icons.IconRefresh className="mr-2" />
                  Regenerate response
                </Button>
              )
            )}
          </div>
          <div className="px-4 py-2 space-y-4 border-t shadow-lg border-slate-500 bg-background sm:rounded-t-xl sm:border md:py-4">
            <PromptForm
              onSubmit={async (value) => {
                await append({
                  id,
                  content: value,
                  role: "user",
                });
              }}
              input={input}
              setInput={setInput}
              isLoading={isLoading}
            />
            {/* <FooterText className="hidden sm:block" /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
