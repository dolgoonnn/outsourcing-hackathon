"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

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
    <div className="w-full">
      <div ref={ref} className="mermaid flex items-center justify-center mt-12">
        {chart}
      </div>
    </div>
  );
}