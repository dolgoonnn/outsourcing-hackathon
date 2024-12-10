import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Users, Calculator, ArrowRight } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Guidance",
      description:
        "Get expert assistance from our AI agents who understand your business needs and translate them into technical requirements.",
    },
    {
      icon: Users,
      title: "User Story Generation",
      description:
        "Automatically generate detailed user stories that help developers understand exactly what needs to be built.",
    },
    {
      icon: Calculator,
      title: "Budget Estimation",
      description:
        "Receive accurate project cost estimates based on your requirements and scope.",
    },
  ];

  return (
    // <MainNavigation>
    <div className="space-y-12 py-8 container mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-gray-900 dark:text-white">
          Transform Your Business Ideas Into Reality
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Don&apos;t let technical complexity hold you back. Our AI-powered
          platform helps non-technical business owners define and plan their
          perfect web or mobile application.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/general-info">
            <Button size="lg" className="gap-2">
              Start Your Project
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* How It Works */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Share Your Vision",
              description:
                "Tell us about your business and what you want to build",
            },
            {
              step: "2",
              title: "AI Analysis",
              description:
                "Our AI agents analyze your needs and create detailed specifications",
            },
            {
              step: "3",
              title: "Get Your Plan",
              description:
                "Receive a complete project plan with budget estimates",
            },
          ].map((item, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <feature.icon className="w-10 h-10 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 text-center space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Ready to Build Your Project?
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Let our AI experts guide you through the process of creating your
          perfect digital solution.
        </p>
        <Link href="/general-info">
          <Button size="lg" className="gap-2">
            Get Started Now
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
    // </MainNavigation>
  );
}
