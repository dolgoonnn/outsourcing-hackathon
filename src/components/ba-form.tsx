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
  question3: z.string().nonempty({ message: 'Question 3 is required' }),
  question4: z.string().nonempty({ message: 'Question 4 is required' }),
})

type BaFormValues = z.infer<typeof baFormSchema>


export function BaForm() {
  const router = useRouter()
  const {answers,formattedAnswer, setAnswers, setFormattedAnswers,nextStep,prevStep} = useStore()
  console.log("🚀 ~ file: ba-form.tsx:35 ~ BaForm ~ answers:", answers)
  const form = useForm<BaFormValues>({
    resolver: zodResolver(baFormSchema),
    defaultValues: {
      question3: answers.question3,
      question4: answers.question4,
      // Add more fields if needed
    },
  })

  async function onSubmit(data: BaFormValues) {
    const formatted = {
      [questions.businessAnalyst.question3]: data.question3,
      [questions.businessAnalyst.question4]: data.question4
    };
    setAnswers({...answers,...data})
    setFormattedAnswers({...formattedAnswer,...formatted})
    nextStep()
   await router.push('/agents')
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
          name="question3"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{questions.businessAnalyst.question3}</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} value={answers.question3} />
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
          name="question4"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{questions.businessAnalyst.question4}</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} value={answers.question4} />
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