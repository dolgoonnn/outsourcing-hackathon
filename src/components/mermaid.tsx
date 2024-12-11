"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Card, CardContent } from "./ui/card";

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      localStorage.setItem("theme", "default");
    }
  }, []);

  async function drawChart(chart: string) {
    const theme = "default";
    const container = ref.current;

    if (chart !== "" && container) {
      container.removeAttribute("data-processed");
      mermaid.mermaidAPI.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        theme,
        logLevel: 5,
        themeVariables: {
          fontFamily: "system-ui, sans-serif",
          fontSize: "16px",
          primaryColor: "#3b82f6", // blue-500
          primaryTextColor: "#ffffff",
          primaryBorderColor: "#2563eb", // blue-600
          lineColor: "#64748b", // slate-500
          secondaryColor: "#f1f5f9", // slate-100
          tertiaryColor: "#ffffff",
        },
      });

      try {
        await mermaid.run();
      } catch (error) {
        // Handle the error if needed
        console.error("Error drawing chart:", error);
      }
    }
  }

  useEffect(() => {
    const drawChartAsync = async () => {
      await drawChart(chart);
    };

    drawChartAsync().catch((error) => {
      // Handle the error if needed
      console.error("Error in useEffect:", error);
    });
  }, [chart]);
  return (
    <Card className="w-full bg-white dark:bg-gray-800 shadow-lg">
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div
              ref={ref}
              className="mermaid flex items-center justify-center py-8 px-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              {chart}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
