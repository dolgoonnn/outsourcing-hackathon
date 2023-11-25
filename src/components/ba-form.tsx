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


const baFormSchema = z.object({
  question6: z.string().nonempty({ message: 'Question 6 is required' }),
  question7: z.string().nonempty({ message: 'Question 7 is required' }),
  question8: z.string().nonempty({ message: 'Question 8 is required' }),
})

type BaFormValues = z.infer<typeof baFormSchema>


export function BaForm() {
  const router = useRouter()
  const {answers,formattedAnswer, setAnswers, setFormattedAnswers,nextStep,prevStep} = useStore()
  console.log("🚀 ~ file: ba-form.tsx:35 ~ BaForm ~ answers:", answers)
  const form = useForm<BaFormValues>({
    resolver: zodResolver(baFormSchema),
    defaultValues: {
      question6: answers.question6,
      question7: answers.question7,
      question8: answers.question8,
      // Add more fields if needed
    },
  })

  async function onSubmit(data: BaFormValues) {
    const formatted = {
      [questions.businessAnalyst.question6]: data.question6,
      [questions.businessAnalyst.question7]: data.question7,
      [questions.businessAnalyst.question8]: data.question8
    };
    setAnswers({...answers,...data})
    setFormattedAnswers({...formattedAnswer,...formatted})
    nextStep()
   await router.push('/stories')
  }
  async function onStepBack(){
    await router.push('/general-info')
    prevStep()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="question6"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{questions.businessAnalyst.question6}</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} value={answers.question6} />
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
          name="question7"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{questions.businessAnalyst.question7}</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} value={answers.question7} />
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
          name="question8"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{questions.businessAnalyst.question8}</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} value={answers.question8} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile and in
                emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">

             <Button onClick={()=>onStepBack()} variant={"secondary"}>Back</Button>
             <Button type="submit">Next step</Button>
        </div>
      </form>
    </Form>
  )
}