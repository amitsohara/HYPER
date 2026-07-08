import React, { useRef, useEffect } from "react";
import { useHyperMindStore } from "../../../../store/useHyperMindStore";

export function EventStreamConsole() {
  const { events } = useHyperMindStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  return (
    <div className="w-full h-full p-4 overflow-y-auto font-mono text-xs space-y-1">
      {events && events.length > 0 ? (
        events.map((ev: any, idx: number) => {
          let color = "text-zinc-400";
          if (ev.level === "ERROR") color = "text-red-400";
          if (ev.level === "WARN") color = "text-amber-400";
          if (ev.source === "HILA" || ev.source === "HRE") color = "text-indigo-400";
          if (ev.type?.includes("DECISION") || ev.type?.includes("AUTHORIZE")) color = "text-emerald-400";

          return (
            <div key={idx} className={`flex space-x-3 ${color} hover:bg-zinc-800/50 py-0.5 px-2 rounded`}>
              <span className="text-zinc-600 shrink-0">
                {ev.timestamp ? new Date(ev.timestamp).toISOString().split('T')[1].replace('Z', '') : '00:00:00.000'}
              </span>
              <span className="shrink-0 w-24 truncate font-semibold">[{ev.source || "SYS"}]</span>
              <span className="break-all">{ev.type}: {typeof ev.payload === 'object' ? JSON.stringify(ev.payload) : ev.payload}</span>
            </div>
          );
        })
      ) : (
        <div className="text-zinc-600 italic px-2">Awaiting HCNS stream...</div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
