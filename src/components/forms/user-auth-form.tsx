import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { Label } from "../ui/label";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Input } from "../ui/input";

export function UserAuthForm() {
  const router = useRouter();
  const session = useSession();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (session.data != null) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push("/dashboard");
    }
  }, [session]);

  const onSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/dashboard",
      });

      if (data?.error) {
        setIsLoading(false);
        switch (data.error) {
          case "CredentialsSignin":
            setError("И-мейл эсвэл нууц үг буруу байна");
            break;
          default:
            setError("Something went wrong!");
        }
      } else {
        console.log(data);
        setIsLoading(false);
        if (data && data.error === null) {
          console.log("triggered");

          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          // router.push("/dashboard");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={cn("grid gap-6")}>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Label className="sr-only" htmlFor="email">
            И-мейл
          </Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Label className="sr-only" htmlFor="email">
            Нууц үг
          </Label>
          <Input
            id="password"
            placeholder="****"
            type="password"
            autoCapitalize="none"
            disabled={isLoading}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button disabled={isLoading} onClick={onSubmit}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Нэвтрэх
        </Button>
        {error && <div className="text-center text-red-600">{error}</div>}
      </div>
    </div>
  );
}
