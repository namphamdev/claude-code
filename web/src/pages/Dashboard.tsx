export function Dashboard() {
  return (
    <div className="flex-1 overflow-y-auto bg-surface relative h-full">
      <div className="max-w-7xl mx-auto px-12 py-16">
        {/* Hero Section */}
        <section className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-2xl">
            <h2 className="text-7xl font-serif leading-tight text-on-surface mb-6">
              The Workspace of the Future.
            </h2>
            <p className="text-lg text-on-surface-variant font-body leading-relaxed max-w-lg opacity-80">
              Synthesizing intelligence and editorial precision. Your manuscripts, code, and insights are refined through a sophisticated agentic dialogue.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <span className="block text-4xl font-serif text-primary">12</span>
              <span className="text-xs uppercase tracking-widest text-on-surface-variant">Active Agent Nodes</span>
            </div>
            <div className="h-12 w-[1px] bg-outline-variant/30"></div>
            <div className="text-right">
              <span className="block text-4xl font-serif text-primary">89%</span>
              <span className="text-xs uppercase tracking-widest text-on-surface-variant">Review Efficiency</span>
            </div>
          </div>
        </section>

        {/* Bento Grid of Active Projects */}
        <section className="mb-20">
          <div className="flex items-baseline justify-between mb-10">
            <h3 className="font-serif text-3xl text-on-surface">Active Projects</h3>
            <a className="text-primary hover:underline text-sm font-medium" href="#">View Archive</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Project Card 1: Large/Featured */}
            <div className="md:col-span-2 bg-[#ffffff] p-8 rounded-xl parchment-glow border border-outline-variant/10 flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">Refinement Stage</span>
                  <span className="material-symbols-outlined text-outline-variant">auto_awesome</span>
                </div>
                <h4 className="font-serif text-4xl mb-4 group-hover:text-primary transition-colors">Neural Literary Engine</h4>
                <p className="text-on-surface-variant leading-relaxed max-w-md mb-8">
                  Fine-tuning an LLM to adapt the prose style of 19th-century epistolary novels for modern technical documentation.
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex-1 bg-surface-container h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[72%]"></div>
                </div>
                <span className="font-serif italic text-lg text-primary">72%</span>
              </div>
            </div>

            {/* Project Card 2 */}
            <div className="bg-[#ffffff] p-8 rounded-xl parchment-glow border border-outline-variant/10 group">
              <div className="flex justify-between items-start mb-6">
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">Active</span>
                <button className="material-symbols-outlined text-outline-variant">more_vert</button>
              </div>
              <h4 className="font-serif text-2xl mb-3">Semantic Compiler</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                Analyzing logical fallacies in codebase architecture via natural language processing.
              </p>
              <div className="pt-6 border-t border-outline-variant/10 flex justify-between items-center">
                <span className="text-xs text-on-surface-variant italic">Updated 2h ago</span>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-tertiary"></div>
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-primary"></div>
                </div>
              </div>
            </div>

            {/* Project Card 3 */}
            <div className="bg-[#ffffff] p-8 rounded-xl parchment-glow border border-outline-variant/10 group">
              <div className="flex justify-between items-start mb-6">
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">Idle</span>
                <button className="material-symbols-outlined text-outline-variant">more_vert</button>
              </div>
              <h4 className="font-serif text-2xl mb-3">The Poetry Module</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                Heuristic analysis of meter and rhyme in generated technical responses.
              </p>
              <div className="pt-6 border-t border-outline-variant/10 flex justify-between items-center">
                <span className="text-xs text-on-surface-variant italic">Updated yesterday</span>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-outline-variant"></div>
                </div>
              </div>
            </div>

            {/* Project Card 4 */}
            <div className="md:col-span-2 bg-primary-container text-on-primary-container p-8 rounded-xl shadow-lg flex items-center justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="font-serif text-3xl mb-2">Automated Peer Review</h4>
                <p className="opacity-80 max-w-sm text-sm">Deploying a multi-agent swarm to critique the structural integrity of the latest manuscript submission.</p>
                <button className="mt-6 px-6 py-2 bg-on-primary-container text-primary rounded-lg font-bold text-sm hover:bg-white transition-colors cursor-pointer">
                  Initialize Swarm
                </button>
              </div>
              <div className="absolute -right-10 top-0 opacity-10 scale-150 rotate-12 group-hover:rotate-6 transition-transform duration-700">
                <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
              </div>
            </div>
          </div>
        </section>

        {/* Activity & Logs Section (Two Column) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-20">
          {/* Recent Activity List */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-2xl text-on-surface mb-8">Agent Logs & Activity</h3>
            <div className="space-y-1">
              {/* Log Item 1 */}
              <div className="flex gap-6 p-4 rounded-xl hover:bg-surface-container-low transition-colors group">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-sm">psychology</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-sm text-on-surface">Critic Agent</span>
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">10:42 AM</span>
                  </div>
                  <p className="text-sm text-on-surface-variant">Flagged logical inconsistency in "Section 4: The Paradox of Choice". Recommending structural inversion of paragraphs 2 and 3.</p>
                </div>
              </div>
              {/* Log Item 2 */}
              <div className="flex gap-6 p-4 rounded-xl hover:bg-surface-container-low transition-colors group">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-sm">history_edu</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-sm text-on-surface">Stylist Agent</span>
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">09:15 AM</span>
                  </div>
                  <p className="text-sm text-on-surface-variant">Completed stylistic harmonisation across the entire Neural Literary repository. Prose tone is now 84% consistent with Victorian standards.</p>
                </div>
              </div>
              {/* Log Item 3 */}
              <div className="flex gap-6 p-4 rounded-xl hover:bg-surface-container-low transition-colors group">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-outline-variant/20 flex items-center justify-center text-outline">
                  <span className="material-symbols-outlined text-sm">database</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-sm text-on-surface">Archive Service</span>
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Yesterday</span>
                  </div>
                  <p className="text-sm text-on-surface-variant">Successfully committed version V1.2.0-Manuscript to the distributed ledger. All nodes synchronized.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Sidebar Info / Stats */}
          <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/10">
            <h4 className="font-serif text-xl mb-6">Manuscript Health</h4>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="uppercase tracking-widest text-on-surface-variant">Structural Integrity</span>
                  <span className="font-bold">92%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary w-[92%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="uppercase tracking-widest text-on-surface-variant">Voice Consistency</span>
                  <span className="font-bold">88%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[88%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="uppercase tracking-widest text-on-surface-variant">Citation Accuracy</span>
                  <span className="font-bold">100%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-full"></div>
                </div>
              </div>
            </div>
            <div className="mt-12">
              <div className="aspect-square rounded-xl overflow-hidden relative group">
                <img alt="Data visualization" className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbu5WmRoB_gRW_o3pBNsehWxwI7Abtrmw5RZkA2il_zY0MXMNWb0O0vLaZl4OmSmLxaossq6SNFaMwMDx3PJpE1uZS4jLHxQ8IUN16ZkwCJiETKubsoJqxjfRhceeEcsSujXxD31HiBvN_p5LwN5Bx19rXo1TugZaIdisysuC9sSWwLkowDsRf41TqPtyY1qWBwclxFLwzvg_v3TlQf-7iD0xPCBQaVMnDACfNpLmxhi2KYQLPuJAe8hrkuPXIGI38u8Ox1slVWQ80"/>
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="text-xs font-serif italic text-on-surface">Agent Convergence Map</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 cursor-pointer">
        <span className="material-symbols-outlined text-3xl">edit_note</span>
      </button>
    </div>
  );
}
