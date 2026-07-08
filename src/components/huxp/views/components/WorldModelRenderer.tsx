import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export function WorldModelRenderer({ worldState }: { worldState: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const svg = d3.select(svgRef.current);
    
    svg.selectAll("*").remove(); // Clear previous

    const entities = worldState?.entities || [];

    if (entities.length === 0) {
      svg.append("text")
         .attr("x", width / 2)
         .attr("y", height / 2)
         .attr("text-anchor", "middle")
         .attr("fill", "#52525b") // zinc-500
         .attr("font-family", "monospace")
         .text("Awaiting Spatial Data...");
      return;
    }

    // Simple Force Graph for World Model Entities
    const simulation = d3.forceSimulation(entities)
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    const nodeGroup = svg.append("g");

    const nodes = nodeGroup.selectAll("g")
      .data(entities)
      .enter()
      .append("g")
      .call(d3.drag<any, any>()
        .on("start", (e, d) => {
          if (!e.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on("drag", (e, d) => {
          d.fx = e.x; d.fy = e.y;
        })
        .on("end", (e, d) => {
          if (!e.active) simulation.alphaTarget(0);
          d.fx = null; d.fy = null;
        })
      );

    nodes.append("circle")
      .attr("r", 24)
      .attr("fill", "#18181b") // zinc-900
      .attr("stroke", "#3f3f46") // zinc-700
      .attr("stroke-width", 2);

    nodes.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("fill", "#34d399") // emerald-400
      .attr("font-size", "10px")
      .attr("font-family", "monospace")
      .text((d: any) => d.type ? d.type.substring(0,3) : "OBJ");

    nodes.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "35px")
      .attr("fill", "#a1a1aa") // zinc-400
      .attr("font-size", "12px")
      .text((d: any) => d.name || "Entity");

    simulation.on("tick", () => {
      nodes.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [worldState]);

  return (
    <div ref={containerRef} className="w-full h-full bg-[#09090b] relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0" style={{ 
        backgroundImage: 'radial-gradient(#27272a 1px, transparent 1px)', 
        backgroundSize: '24px 24px',
        opacity: 0.5 
      }} />
      <svg ref={svgRef} className="w-full h-full relative z-10" />
    </div>
  );
}
