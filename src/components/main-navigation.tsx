import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Home,
  FileText,
  Users,
  Calculator,
  Brain,
  ChevronRight,
  Check,
  Lock,
} from "lucide-react";
import { useStore } from "@/lib/form/store";
import { useRouter } from "next/router";

const MainNavigation = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { answers, step, storyChat, baChat, saChat, poChat } = useStore();

  const navItems = [
    {
      title: "General info",
      href: "/general-info",
      icon: Home,
      step: 1,
      isComplete: () => {
        return (
          answers.question1 &&
          answers.question2 &&
          answers.question3 &&
          answers.question4 &&
          answers.question5
        );
      },
    },
    {
      title: "BA questions",
      href: "/ba-questions",
      icon: FileText,
      step: 2,
      isComplete: () => {
        return answers.question6 && answers.question7 && answers.question8;
      },
    },
    {
      title: "User stories",
      href: "/stories",
      icon: Users,
      step: 3,
      isComplete: () => storyChat.length > 0,
    },
    {
      title: "PO Agent",
      href: "/agents",
      icon: Brain,
      step: 4,
      isComplete: () => poChat.length > 0,
    },
    {
      title: "BA Agent",
      href: "/agents/ba",
      icon: Brain,
      step: 5,
      isComplete: () => baChat.length > 0,
    },
    {
      title: "SA Agent",
      href: "/agents/sa",
      icon: Brain,
      step: 6,
      isComplete: () => saChat.length > 0,
    },
    {
      title: "Budget calculation",
      href: "/budget",
      icon: Calculator,
      step: 7,
      isComplete: () => step > 7, // Or add specific budget completion check
    },
  ];

  const currentStepIndex = navItems.findIndex((item) => item.href === pathname);

  // Check if a step is accessible based on store step
  const canAccessStep = (stepNumber: number) => {
    // Can always access current or previous steps
    return stepNumber <= step;
  };

  // Calculate overall progress
  const completedSteps = navItems.filter((item) => item.isComplete()).length;
  const progress = (completedSteps / navItems.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                AI-Based Outsourcing Solution
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Let&apos;s help you define your project requirements through
                AI-assisted guidance
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Navigation sidebar */}
              <div className="md:col-span-3">
                <nav className="space-y-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    const isCompleted = item.isComplete();
                    const isAccessible = canAccessStep(item.step);

                    return (
                      <div key={item.href} className="relative">
                        {isAccessible ? (
                          <Link
                            href={item.href}
                            className={`
                              flex items-center space-x-3 px-4 py-2 rounded-lg
                              ${
                                isActive
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                  : isCompleted
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                              }
                            `}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700">
                                {isCompleted ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <span className="text-xs">{index + 1}</span>
                                )}
                              </div>
                              <Icon className="w-5 h-5" />
                              <span>{item.title}</span>
                            </div>
                            {isActive && <ChevronRight className="w-5 h-5" />}
                          </Link>
                        ) : (
                          <div className="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-400 dark:text-gray-600 cursor-not-allowed">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700">
                                <Lock className="w-3 h-3" />
                              </div>
                              <Icon className="w-5 h-5" />
                              <span>{item.title}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* Main content */}
              <main className="md:col-span-9">{children}</main>
            </div>
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          {currentStepIndex > 0 && (
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="gap-2"
            >
              Previous Step
            </Button>
          )}
          {currentStepIndex < navItems.length - 1 &&
            navItems[currentStepIndex].isComplete() && (
              <Button
                className="ml-auto gap-2"
                onClick={() => {
                  const nextItem = navItems[currentStepIndex + 1];
                  if (nextItem) {
                    void router.push(nextItem.href); // Use router.push instead of window.location
                  }
                }}
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
        </div>
      </div>
    </div>
  );
};

export default MainNavigation;
