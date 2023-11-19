import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "./ui/input"
import { toast } from "sonner";
import { useStore } from "@/lib/form/store"


const generalFormSchema = z.object({
  question2: z.string().nonempty({ message: 'Question 2 is required' }),
})

type GeneralFormValues = z.infer<typeof generalFormSchema>


export function GeneralForm() {
  const answers = useStore((state) => state.answers);
  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    // defaultValues,
  })

  function onSubmit(data: GeneralFormValues) {
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="question2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>question1</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} value={answers.question2} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile and in
                emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
             <Button type="submit">Update account</Button>
      </form>
    </Form>
  )
}