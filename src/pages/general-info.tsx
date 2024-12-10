import MainNavigation from "@/components/main-navigation";
import { Separator } from "@/components/ui/separator";
import { GeneralForm } from "@/components/general-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function GeneralInfoPage() {
  return (
    <MainNavigation>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            General Information
          </h1>
          <p className="text-muted-foreground">
            Let&apos;s start by understanding your business needs and project
            requirements.
          </p>
        </div> */}

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Please provide detailed answers to help us better understand your
              vision.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GeneralForm />
          </CardContent>
        </Card>
      </div>
    </MainNavigation>
  );
}
