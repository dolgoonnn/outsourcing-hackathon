import React from "react";
import Link from "next/link";
import { ModeToggle } from "./layout/mode-toggle";

export default function Footer() {
  return (
    <section
      id="footer-bottom"
      aria-labelledby="footer-bottom-heading"
      className="flex items-center space-x-4"
    >
      <div className="flex-1 text-left text-sm leading-loose text-muted-foreground">
        Built by{" "}
        <Link
          href="https://twitter.com/sadmann17"
          target="_blank"
          rel="noreferrer"
          className="font-semibold transition-colors hover:text-foreground"
        >
          Sadman
          <span className="sr-only">Twitter</span>
        </Link>
        .
      </div>
      <div className="flex items-center space-x-1">
        {/* <Link
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
          className={cn(
            buttonVariants({
              size: "icon",
              variant: "ghost",
            }),
          )}
        >
          <Icons.gitHub className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">GitHub</span>
        </Link> */}
        <ModeToggle />
      </div>
    </section>
  );
}
