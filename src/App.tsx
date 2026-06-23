/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileCode, Download, Settings, Github, CheckCircle, Server, Database, BrainCircuit, Box } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-300 font-sans selection:bg-slate-800 selection:text-white px-4 md:px-8 py-12 md:py-24">
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="space-y-4">
          <div className="flex items-center space-x-3 text-blue-500 mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-bold tracking-wider uppercase">Backend Generated Successfully</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white">
            HyperMind-X API
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
            I have generated the production-ready FastAPI backend inside the workspace file system. Your Node.js preview environment handles the web UI, while the Python code is ready for you to download and run via Docker.
          </p>
        </header>

        <section className="bg-[#111827] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-xl font-medium flex items-center space-x-2 text-white">
              <Box className="w-5 h-5 text-slate-500" />
              <span>Project Architecture</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 rounded-xl bg-[#0B0F19] border border-slate-800">
              <Server className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-white">FastAPI & Uvicorn</h3>
                <p className="text-sm text-slate-500 mt-1">High-performance async REST framework.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 rounded-xl bg-[#0B0F19] border border-slate-800">
              <Database className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-white">PostgreSQL</h3>
                <p className="text-sm text-slate-500 mt-1">Robust relational storage with SQLAlchemy.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 rounded-xl bg-[#0B0F19] border border-slate-800">
              <Database className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-white">Qdrant</h3>
                <p className="text-sm text-slate-500 mt-1">Vector store for the Memory Core logic.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 rounded-xl bg-[#0B0F19] border border-slate-800">
              <BrainCircuit className="w-5 h-5 text-slate-200 mt-0.5" />
              <div>
                <h3 className="font-medium text-white">Ollama</h3>
                <p className="text-sm text-slate-500 mt-1">Local LLM support (e.g. Llama 3) for inference.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-medium text-white">How to use this code</h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 items-start p-6 rounded-2xl bg-gradient-to-br from-blue-900/20 to-transparent border border-slate-800">
              <div className="bg-[#111827] border border-slate-800 p-2.5 rounded-lg shrink-0">
                <FileCode className="w-5 h-5 text-blue-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-medium text-lg">1. Explore the files here</h3>
                <p className="text-slate-400">
                  Open the Code Editor panel and expand the <code className="bg-[#111827] px-1.5 py-0.5 rounded text-blue-400 border border-slate-800">hypermind-x/</code> folder. You'll find the modular router, structured endpoints, <code className="bg-[#111827] px-1.5 py-0.5 rounded text-slate-300 border border-slate-800">requirements.txt</code>, and <code className="bg-[#111827] px-1.5 py-0.5 rounded text-slate-300 border border-slate-800">docker-compose.yml</code>.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-transparent border border-slate-800">
              <div className="bg-[#111827] border border-slate-800 p-2.5 rounded-lg shrink-0">
                <Download className="w-5 h-5 text-purple-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-medium text-lg">2. Export the project</h3>
                <p className="text-slate-400">
                  Since this environment previews React Applications, use the top-right <strong className="text-slate-300 font-medium">Settings Menu</strong> (gear icon) to export the entire workspace.
                </p>
                <div className="flex flex-wrap gap-3 pt-3">
                  <div className="flex items-center gap-2 bg-[#111827] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-400">
                    <Download className="w-4 h-4" /> Export to ZIP
                  </div>
                  <div className="flex items-center gap-2 bg-[#111827] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-400">
                    <Github className="w-4 h-4" /> Export to GitHub
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-start p-6 rounded-2xl bg-gradient-to-br from-green-900/20 to-transparent border border-slate-800">
              <div className="bg-[#111827] border border-slate-800 p-2.5 rounded-lg shrink-0">
                <Settings className="w-5 h-5 text-green-500" />
              </div>
              <div className="space-y-4">
                <h3 className="text-white font-medium text-lg">3. Run locally</h3>
                <div className="bg-[#111827] rounded-xl p-4 border border-slate-800 font-mono text-sm text-slate-400 space-y-2">
                  <p><span className="text-slate-600"># Navigate to directory</span></p>
                  <p className="text-green-500">cd hypermind-x</p>
                  <p className="mt-4"><span className="text-slate-600"># Start services with Docker Compose</span></p>
                  <p className="text-green-500">docker-compose up -d</p>
                </div>
              </div>
            </div>
            
          </div>
        </section>
      </div>
    </div>
  );
}
