import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/router";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Save, Check } from "lucide-react";
import { useStore } from "@/lib/form/store";
import { questions } from "@/lib/form/questions";

const generalFormSchema = z.object({
  question1: z.string().nonempty({ message: "Question 1 is required" }),
  question2: z.string().nonempty({ message: "Question 2 is required" }),
  question3: z.string().nonempty({ message: "Question 3 is required" }),
  question4: z.string().nonempty({ message: "Question 4 is required" }),
  question5: z.string().nonempty({ message: "Question 5 is required" }),
});

type GeneralFormValues = z.infer<typeof generalFormSchema>;

const SaveIndicator = ({ status }: { status: "saving" | "saved" | "idle" }) => {
  if (status === "idle") return null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
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

export function GeneralForm() {
  const router = useRouter();
  const {
    answers,
    formattedAnswer,
    setAnswers,
    setFormattedAnswers,
    nextStep,
  } = useStore();
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | "idle">(
    "idle",
  );

  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      question1: answers.question1 ?? "",
      question2: answers.question2 ?? "",
      question3: answers.question3 ?? "",
      question4: answers.question4 ?? "",
      question5: answers.question5 ?? "",
    },
  });

  // Handle individual field changes
  const handleFieldChange = (name: keyof GeneralFormValues, value: string) => {
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
      [questions.generalInfo[name]]: value,
    });

    // Show saved indicator briefly
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 1500);
    }, 500);
  };

  async function onSubmit(data: GeneralFormValues) {
    const formatted = {
      [questions.generalInfo.question1]: data.question1,
      [questions.generalInfo.question2]: data.question2,
      [questions.generalInfo.question3]: data.question3,
      [questions.generalInfo.question4]: data.question4,
      [questions.generalInfo.question5]: data.question5,
    };

    setAnswers({ ...answers, ...data });
    setFormattedAnswers({ ...formattedAnswer, ...formatted });
    nextStep();
    await router.push("/ba-questions");
  }

  const formFields = [
    {
      name: "question1",
      label: questions.generalInfo.question1,
      placeholder: "Enter your answer",
    },
    {
      name: "question2",
      label: questions.generalInfo.question2,
      placeholder: "Enter your answer",
    },
    {
      name: "question3",
      label: questions.generalInfo.question3,
      placeholder: "Enter your answer",
    },
    {
      name: "question4",
      label: questions.generalInfo.question4,
      placeholder: "Enter your answer",
    },
    {
      name: "question5",
      label: questions.generalInfo.question5,
      placeholder: "Enter your answer",
    },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Project Information</h3>
          <SaveIndicator status={saveStatus} />
        </div>

        <div className="space-y-4">
          {formFields.map((field, index) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name as keyof GeneralFormValues}
              render={({ field: fieldProps }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {index + 1}. {field.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      onChange={(e) => {
                        fieldProps.onChange(e);
                        handleFieldChange(
                          field.name as keyof GeneralFormValues,
                          e.target.value,
                        );
                      }}
                      placeholder={field.placeholder}
                      className="h-20 py-2 resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="min-w-[120px]"
          >
            {form.formState.isSubmitting ? (
              "Saving..."
            ) : (
              <>
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default GeneralForm;
