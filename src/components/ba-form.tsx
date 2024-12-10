import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/router";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, Check } from "lucide-react";
import { questions } from "@/lib/form/questions";
import { useStore } from "@/lib/form/store";

const baFormSchema = z.object({
  question6: z.string().min(1, { message: "Question 6 is required" }),
  question7: z.string().min(1, { message: "Question 7 is required" }),
  question8: z.string().min(1, { message: "Question 8 is required" }),
});

type BaFormValues = z.infer<typeof baFormSchema>;

const SaveIndicator = ({ status }: { status: "saving" | "saved" | "idle" }) => {
  if (status === "idle") return null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 absolute top-4 right-4">
      {status === "saving" ? (
        <>
          <Save className="w-4 h-4 animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <Check className="w-4 h-4 text-green-500" />
          <span className="text-green-500">Saved</span>
        </>
      )}
    </div>
  );
};

export function BaForm() {
  const router = useRouter();
  const {
    answers,
    formattedAnswer,
    setAnswers,
    setFormattedAnswers,
    nextStep,
    prevStep,
  } = useStore();
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | "idle">(
    "idle",
  );

  const form = useForm<BaFormValues>({
    resolver: zodResolver(baFormSchema),
    defaultValues: {
      question6: answers.question6 ?? "",
      question7: answers.question7 ?? "",
      question8: answers.question8 ?? "",
    },
  });

  // Handle individual field changes
  const handleFieldChange = (name: keyof BaFormValues, value: string) => {
    // Show saving indicator
    setSaveStatus("saving");

    // Update Zustand store
    setAnswers({
      ...answers,
      [name]: value,
    });

    // Update formatted answers
    setFormattedAnswers({
      ...formattedAnswer,
      [questions.businessAnalyst[name]]: value,
    });

    // Show saved indicator briefly
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 1500);
    }, 500);
  };

  async function onSubmit(data: BaFormValues) {
    const formatted = {
      [questions.businessAnalyst.question6]: data.question6,
      [questions.businessAnalyst.question7]: data.question7,
      [questions.businessAnalyst.question8]: data.question8,
    };
    setAnswers({ ...answers, ...data });
    setFormattedAnswers({ ...formattedAnswer, ...formatted });
    nextStep();
    await router.push("/stories");
  }

  async function onStepBack() {
    await router.push("/general-info");
    prevStep();
  }

  const formFields = [
    {
      name: "question6",
      label: questions.businessAnalyst.question6,
      description: "Provide specific details about your business processes.",
    },
    {
      name: "question7",
      label: questions.businessAnalyst.question7,
      description: "Describe your key requirements.",
    },
    {
      name: "question8",
      label: questions.businessAnalyst.question8,
      description: "Outline any specific technical requirements.",
    },
  ];

  return (
    <Card className="p-6 relative">
      <SaveIndicator status={saveStatus} />

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Business Analysis Questions
        </h2>
        <p className="text-gray-600 mb-4">
          Please provide detailed answers to help us better understand your
          business requirements.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {formFields.map((field, index) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name as keyof BaFormValues}
              render={({ field: fieldProps }) => (
                <FormItem>
                  <FormLabel>
                    {index + 1}. {field.label}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your answer here"
                      className="min-h-[100px]"
                      {...fieldProps}
                      onChange={(e) => {
                        fieldProps.onChange(e);
                        handleFieldChange(
                          field.name as keyof BaFormValues,
                          e.target.value,
                        );
                      }}
                    />
                  </FormControl>
                  <FormDescription>{field.description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <div className="flex gap-4">
            <Button type="button" onClick={onStepBack} variant="outline">
              Back
            </Button>
            <Button type="submit">Next step</Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}

export default BaForm;
