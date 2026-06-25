import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface TrendData {
  year: number;
  value: number;
}

interface FutureTrendsChartProps {
  data: TrendData[];
  domain: string;
}

export function FutureTrendsChart({ data, domain }: FutureTrendsChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.year) as [number, number])
      .range([0, width]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")))
      .attr("color", "#475569") // slate-600
      .selectAll("text")
      .attr("fill", "#94a3b8"); // slate-400

    // Y axis
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) as number])
      .range([height, 0]);

    svg
      .append("g")
      .call(d3.axisLeft(y).ticks(5))
      .attr("color", "#475569")
      .selectAll("text")
      .attr("fill", "#94a3b8");

    // Grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-width)
          .tickFormat(() => "")
      )
      .attr("color", "#1e293b") // slate-800
      .attr("stroke-opacity", 0.5);

    // Line generator
    const line = d3
      .line<TrendData>()
      .x((d) => x(d.year))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    // Add the line
    const path = svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6") // blue-500
      .attr("stroke-width", 2)
      .attr("d", line);

    // Animate line
    const totalLength = path.node()?.getTotalLength() || 0;
    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    // Add dots
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.year))
      .attr("cy", (d) => y(d.value))
      .attr("r", 4)
      .attr("fill", "#111")
      .attr("stroke", "#60a5fa") // blue-400
      .attr("stroke-width", 2)
      .style("opacity", 0)
      .transition()
      .delay((d, i) => (i / data.length) * 2000)
      .duration(200)
      .style("opacity", 1);
      
    // Tooltip
    const tooltip = d3
      .select(chartRef.current)
      .append("div")
      .style("opacity", 0)
      .attr("class", "absolute bg-black border border-slate-700 p-2 rounded text-xs text-white pointer-events-none");

    svg
      .selectAll("circle")
      .on("mouseover", (event, d: any) => {
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip
          .html(`Year: ${d.year}<br/>Value: ${d.value}`)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

  }, [data, domain]);

  return (
    <div className="w-full relative">
      <div ref={chartRef} className="w-full" />
    </div>
  );
}
