import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";
import { useStore } from "@/lib/form/store";
import { Icons } from "./icons";

interface SidebarNavItem {
  href: string;
  title: string;
  children?: SidebarNavItem[];
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: SidebarNavItem[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  const { step } = useStore();
  console.log("🚀 ~ file: sidebar-nav.tsx:18 ~ SidebarNav ~ step:", step);
  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className,
      )}
      {...props}
    >
      {items.map((item, index) => (
        <div key={item.href} className="flex gap-4 w-full items-center">
          {index < step - 1 ? (
            <span className="bg-secondary rounded-full">
              <Icons.checkedCircle className="stroke-slate-900" />
            </span>
          ) : (
            <span>
              <Icons.dashedCircle />
            </span>
          )}

          <Link
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "justify-start",
            )}
          >
            {item.title}
            {item.children && (
              <div className="dropdown-menu">
                {item.children.map((child) => (
                  <Link key={child.href} href={child.href}>
                    {child.title}
                  </Link>
                ))}
              </div>
            )}
          </Link>
        </div>
      ))}
    </nav>
  );
}
