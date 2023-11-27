import { Separator } from "./ui/separator";
import { SidebarNav } from "./ui/sidebar-nav";
import Image from "next/image";

const sidebarNavItems = [
  {
    title: "General info",
    href: "/general-info",
  },
  {
    title: "BA questions",
    href: "/ba-questions",
  },
  {
    title: "User stories",
    href: "/stories",
  },
  {
    title: "Agents",
    href: "/agents",
  },
  {
    title: "Budget calculation",
    href: "/budget",
  },
  // {
  //   title: "Agents",
  //   href: "/agents",
  // },
  // {
  //   title: "Agents",
  //   href: "/agents",
  // },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function MainNavigation({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            AI-Based Outsourcing Solution
          </h2>
          <p className="text-muted-foreground">
            This project aims to assist users who lack IT project experience but
            need a web or app for their business. The solution will guide users
            through the process of defining their project requirements through
            interactions with AI agents.
          </p>
        </div>
        <Separator className="my-6" />
        {/* <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10"> */}
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}
