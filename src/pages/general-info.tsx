
import MainNavigation from "@/components/main-navigation"
import { Separator } from "@/components/ui/separator"
import { GeneralForm } from "@/components/general-form"
export default function SettingsAccountPage() {
  return (
    <MainNavigation>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings. Set your preferred language and
          timezone.
        </p>
      </div>
      <Separator />
      <GeneralForm />
    </div>
    </MainNavigation>
  )
}