import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useStore } from "@/lib/form/store";
import { useRouter } from "next/router";
import { questions } from "@/lib/form/questions";
import { useState } from "react";
import { Icons } from "./ui/icons";
import { type Message } from "ai";

const generalFormSchema = z.object({
  question9: z.array(z.string().min(1)),
});

type GeneralFormValues = z.infer<typeof generalFormSchema>;

export function StoriesForm() {
  const router = useRouter();
  const {
    answers,
    formattedAnswer,
    setAnswers,
    setFormattedAnswers,
    nextStep,
  } = useStore();
  const [inputs, setInputs] = useState<string[]>([""]);

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const values = [...inputs];
    values[index] = event.target.value;
    setInputs(values);
  };

  const handleAddClick = () => {
    setInputs([...inputs, ""]);
  };

  const handleRemoveClick = (index: number) => {
    const values = [...inputs];
    values.splice(index, 1);
    setInputs(values);
  };

  // const answers = useStore((state) => state.answers);
  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      question9: answers.question9,
    },
  });

  async function onSubmit() {
    // console.log("🚀 ~ file: general-form.tsx:45 ~ onSubmit ~ data:", data);
    // const data: Record<string, string[]> = {
    //   answers.question9: inputs,
    // };
    const formatted = {
      [questions.userStories.question9]: inputs,
    };
    console.log(
      "🚀 ~ file: stories-form.tsx:72 ~ onSubmit ~ formatted:",
      formatted,
    );
    setAnswers({ ...answers, question9: inputs });
    setFormattedAnswers({ ...formattedAnswer, ...formatted });
    nextStep();
    await router.push("/agents");
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
        {/* <FormField
          control={form.control}
          name="question9"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{questions.userStories.question9}</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  {...field}
                  value={answers.question9}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        /> */}
        {inputs.map((input, index) => (
          <FormField
            key={index}
            control={form.control}
            name="question9"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{`User story ${index + 1}`}</FormLabel>
                <FormControl>
                  <div className="flex w-full gap-2">
                    <Input
                      type="text"
                      value={input || ""}
                      required
                      // {...field}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                    {inputs.length !== 1 && (
                      <Button
                        type="button"
                        variant={"outline"}
                        onClick={() => handleRemoveClick(index)}
                      >
                        <Icons.remove className="h-4 w-4" />
                      </Button>
                    )}
                    {index === inputs.length - 1 && ( // Check if it's the last element
                      <Button type="button" onClick={handleAddClick}>
                        <Icons.add className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        {/* {inputs.map((input, index) => (
          <div key={index} className="flex w-full gap-2">
            <Input
              type="text"
              value={input || ""}
              onChange={(event) => handleInputChange(index, event)}
            />
            <Button type="button" onClick={handleAddClick}>
              <Icons.IconPlus />
            </Button>
          </div>
        ))} */}

        <Button type="submit">Next step</Button>
      </form>
    </Form>
  );
}
