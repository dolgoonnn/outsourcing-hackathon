import MainNavigation from "@/components/main-navigation";
import { useEffect, useState } from "react";
import { useChat } from "ai/react";
import { useStore } from "@/lib/form/store";
import { nanoid } from "@/lib/utils";
import { Message } from "ai";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { filterMessagesByRole } from "@/lib/utils";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsAccountPage() {
  const [finished, setFinished] = useState(false);
  const [triggerCalled, setTriggerCalled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estimates, setEstimates] = useState<number[]>([]);

  const { messages, append, isLoading } = useChat({
    api: "/api/time",
    onResponse(response) {
      if (!response.ok) {
        setError("Failed to get time estimation. Please try again.");
      }
    },
    async onFinish() {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFinished(true);
    },
  });

  const { answers } = useStore();
  const costPerUnitTime = 50000;

  const handleTrigger = async () => {
    const id = nanoid();
    setError(null);

    try {
      const prompt = `Given these user stories: ${JSON.stringify(
        answers.question9,
      )}, provide time estimates in hours as a JSON array of numbers. Only return the array, nothing else. Format example: [40, 20, 30]`;

      await append({
        id,
        content: prompt,
        role: "user",
      });
      setTriggerCalled(false);
    } catch (err) {
      setError("Failed to send request. Please try again.");
    }
  };

  useEffect(() => {
    if (answers.question9 != undefined && !isLoading && !triggerCalled) {
      setTriggerCalled(true);
      void handleTrigger();
    }
  }, [answers.question9, isLoading]);

  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      const assistantMessages = filterMessagesByRole(messages, "assistant");
      if (assistantMessages.length > 0) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const parsed = JSON.parse(assistantMessages[0].content);
          if (Array.isArray(parsed)) {
            setEstimates(parsed);
          }
        } catch (err) {
          setError("Invalid response format. Please try again.");
        }
      }
    }
  }, [messages, isLoading]);

  const formatCost = (hours: number) => {
    const cost = hours * costPerUnitTime;
    return cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  };

  const companies = [
    {
      id: "1",
      imageUrl: "/og.png",
      title: "Nasha tech",
      email: "sales@nashatech.com",
      description:
        "Forward-thinking technology company delivering high-quality software development services.",
      rating: 4.8,
      completedProjects: 150,
    },
    {
      id: "2",
      imageUrl: "/og.png",
      email: "sales@tsashatech.com",
      title: "Tsasha tech",
      description:
        "Dynamic, innovative company creating value through cutting-edge solutions and services.",
      rating: 4.6,
      completedProjects: 120,
    },
  ];

  return (
    <MainNavigation>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Cost Estimation</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="flex flex-col items-center gap-4">
                  <Icons.spinner className="h-8 w-8 animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    Calculating estimates...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-4 p-8">
                <Icons.alert className="h-8 w-8 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
                <Button onClick={() => handleTrigger()}>Retry</Button>
              </div>
            ) : (
              estimates.length > 0 && (
                <div className="space-y-6">
                  {answers.question9?.map((story, index) => (
                    <div key={index} className="space-y-2">
                      <p className="text-sm font-medium">{story}</p>
                      <div className="flex items-center gap-4">
                        <Slider
                          defaultValue={[estimates[index]]}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                        <Badge
                          variant="secondary"
                          className="w-32 justify-center"
                        >
                          {formatCost(estimates[index])}₮
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="font-medium">Total Estimate:</span>
                      <Badge variant="default" className="text-lg">
                        {formatCost(estimates.reduce((a, b) => a + b, 0))}₮
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>

        {!isLoading && estimates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recommended Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {companies.map((company) => (
                  <CompanyCard key={company.id} cardData={company} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainNavigation>
  );
}

type CardData = {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  email: string;
  rating: number;
  completedProjects: number;
};

function CompanyCard({ cardData }: { cardData: CardData }) {
  const { imageUrl, title, description, email, rating, completedProjects } =
    cardData;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Image
            src={imageUrl}
            height={64}
            width={64}
            alt={`${title} logo`}
            className="rounded-lg"
          />
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold">{title}</h3>
            <div className="flex items-center gap-2">
              <Icons.star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{rating}</span>
              <span className="text-sm text-muted-foreground">
                ({completedProjects} projects)
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full mt-4">Contact Company</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Contact {title}</DialogTitle>
                  <DialogDescription className="space-y-2 pt-4">
                    <p>Email: {email}</p>
                    {/* <p>
                      Project Budget:{" "}
                      {formatCost(estimates?.reduce((a, b) => a + b, 0) || 0)}₮
                    </p> */}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button type="submit">Send Request</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// function formatCost(hours: number): string {
//   // Calculate total cost from hours
//   const cost = hours * costPerUnitTime;

//   // Format with thousand separators and handle decimal places
//   return new Intl.NumberFormat('en-US', {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//     useGrouping: true,
//   })
//   .format(cost)
//   .replace(/,/g, "'"); // Replace commas with apostrophes for the desired format
// }
