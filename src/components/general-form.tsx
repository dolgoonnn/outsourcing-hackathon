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
import { useRouter } from "next/router"
import { questions } from "@/lib/form/questions"


const generalFormSchema = z.object({
  question1: z.string().nonempty({ message: 'Question 1 is required' }),
  question2: z.string().nonempty({ message: 'Question 2 is required' }),
})

type GeneralFormValues = z.infer<typeof generalFormSchema>




export function GeneralForm() {
  const router = useRouter()
  const {answers,formattedAnswer, setAnswers, setFormattedAnswers,nextStep} = useStore()
  console.log("🚀 ~ file: general-form.tsx:37 ~ GeneralForm ~ answers:", answers)
  // const answers = useStore((state) => state.answers);
  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      question1: answers.question1,
      question2: answers.question2,
      // Add more fields if needed
    },
  })

  async function onSubmit(data: GeneralFormValues) {
    console.log("🚀 ~ file: general-form.tsx:45 ~ onSubmit ~ data:", data)
    const formatted = {
      [questions.generalInfo.question1]: data.question1,
      [questions.generalInfo.question2]: data.question2
    };
    setAnswers({...answers,...data})
    setFormattedAnswers({...formattedAnswer,...formatted})
    nextStep()
   await router.push('/ba-questions')
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
          name="question1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{questions.generalInfo.question1}</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} value={answers.question1} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile and in
                emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
            <FormField
          control={form.control}
          name="question2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{questions.generalInfo.question2}</FormLabel>
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
    <Button type="submit">Next step</Button>
      </form>
    </Form>
  )
}