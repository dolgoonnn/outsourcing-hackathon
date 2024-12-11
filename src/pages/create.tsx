import CreateProjectNavigation from "@/components/layout/create-form-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <CreateProjectNavigation>
      <div>
        <Link href={"/general-info"}>
          <Button>Let&apos;s Start</Button>
        </Link>
      </div>
    </CreateProjectNavigation>
  );
}
