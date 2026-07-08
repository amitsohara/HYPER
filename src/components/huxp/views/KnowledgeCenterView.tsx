import React, { useState } from "react";
import { BookOpen, Search, Filter, Database, Brain, Hexagon } from "lucide-react";

export function KnowledgeCenterView() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semantic Memory");

  return (
    <div className="flex-1 flex flex-col p-8 overflow-auto">
      <div className="max-w-6xl mx-auto w-full space-y-8 flex-1 flex flex-col">
        <header>
          <h1 className="text-3xl font-light tracking-tight mb-2">Knowledge Center</h1>
          <p className="text-zinc-400">Unified repository for Semantic, Procedural, and Episodic memory.</p>
        </header>

        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search concepts, strategies, or past episodes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-zinc-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button onClick={() => alert("Filter options opened")} className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-xl hover:bg-zinc-800 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 flex-1">
          {/* Categories Sidebar */}
          <div className="space-y-4">
            <CategoryCard icon={Database} title="Semantic Memory" count="1,240" active={activeCategory === "Semantic Memory"} onClick={() => setActiveCategory("Semantic Memory")} />
            <CategoryCard icon={Hexagon} title="Procedural Memory" count="86" active={activeCategory === "Procedural Memory"} onClick={() => setActiveCategory("Procedural Memory")} />
            <CategoryCard icon={Brain} title="Episodic Memory" count="4,592" active={activeCategory === "Episodic Memory"} onClick={() => setActiveCategory("Episodic Memory")} />
          </div>

          {/* Content Area */}
          <div className="col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col">
            <h2 className="text-xl font-medium mb-4">Recent {activeCategory} Nodes</h2>
            <div className="flex-1 space-y-3 overflow-auto">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="p-4 border border-zinc-800 rounded-xl hover:bg-zinc-800/50 cursor-pointer transition-colors" onClick={() => alert("Memory node details opened")}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-indigo-400">Node_{activeCategory.split(' ')[0]}_{i}</h3>
                    <span className="text-xs text-zinc-500 font-mono">Confidence: 0.9{i}</span>
                  </div>
                  <p className="text-sm text-zinc-400">
                    A generalized abstraction derived from recent mission data, indicating a strong correlation between operational load and cognitive latency.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function CategoryCard({ icon: Icon, title, count, active, onClick }: any) {
  return (
    <div onClick={onClick} className={`p-5 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
      active ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
    }`}>
      <div className="flex items-center space-x-3">
        <Icon className={`w-5 h-5 ${active ? 'text-indigo-400' : 'text-zinc-500'}`} />
        <span className={`font-medium ${active ? 'text-zinc-100' : 'text-zinc-300'}`}>{title}</span>
      </div>
      <span className="text-sm text-zinc-500 bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800">
        {count}
      </span>
    </div>
  );
}
