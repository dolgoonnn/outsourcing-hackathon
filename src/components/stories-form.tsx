import React, { useState, useEffect } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Icons } from "./ui/icons";
import { useStore } from "@/lib/form/store";
import { questions } from "@/lib/form/questions";
import { Plus, Trash2, FileText, ArrowRight } from "lucide-react";

const generalFormSchema = z.object({
  question9: z.array(z.string().min(1, "User story cannot be empty")),
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
  const [activeStory, setActiveStory] = useState<number | null>(null);

  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      question9: answers.question9 ?? [""],
    },
  });

  useEffect(() => {
    if (answers.question9 && answers.question9.length !== 0) {
      setInputs(answers.question9);
    }
  }, [answers.question9]);

  const handleInputChange = (index: number, value: string) => {
    const values = [...inputs];
    values[index] = value;
    setInputs(values);
  };

  const handleAddClick = () => {
    setInputs([...inputs, ""]);
    setActiveStory(inputs.length);
  };

  const handleRemoveClick = (index: number) => {
    const values = [...inputs];
    values.splice(index, 1);
    setInputs(values);
    if (activeStory === index) {
      setActiveStory(null);
    }
  };

  async function onSubmit() {
    const filteredInputs = inputs.filter((input) => input.trim() !== "");
    if (filteredInputs.length === 0) {
      return;
    }

    const formatted = {
      [questions.userStories.question9]: filteredInputs,
    };

    setAnswers({ ...answers, question9: filteredInputs });
    setFormattedAnswers({ ...formattedAnswer, ...formatted });
    nextStep();
    await router.push("/agents");
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">User Stories</h2>
            <p className="text-muted-foreground mt-1">
              Based on your requirements, here are the suggested user stories.
              Feel free to edit or add more.
            </p>
          </div>
          <Button onClick={handleAddClick} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Story
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {inputs.map((input, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name="question9"
                  render={() => (
                    <FormItem>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                        <div className="flex-grow space-y-1.5">
                          <FormLabel className="text-base font-medium">
                            User Story {index + 1}
                          </FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input
                                value={input}
                                className={`flex-grow text-base py-3 ${
                                  activeStory === index
                                    ? "ring-2 ring-primary"
                                    : ""
                                }`}
                                placeholder="As a [type of user], I want [goal] so that [benefit]"
                                onChange={(e) =>
                                  handleInputChange(index, e.target.value)
                                }
                                onFocus={() => setActiveStory(index)}
                                onBlur={() => setActiveStory(null)}
                              />
                              {inputs.length > 1 && (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => handleRemoveClick(index)}
                                  className="flex-shrink-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </FormControl>
                          {index === 0 && (
                            <FormDescription>
                              Follow the format:&quot;As a [user type], I want
                              [goal] so that [benefit]&quot;
                            </FormDescription>
                          )}
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button
                type="submit"
                className="gap-2"
                disabled={inputs.every((input) => !input.trim())}
              >
                Continue to Agents
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
