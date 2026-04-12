export function Deploy() {
  return (
    <div className="flex-1 flex overflow-hidden p-6 gap-6 bg-surface h-full">
      {/* Left Pane: Deployment History & Status */}
      <section className="w-[400px] flex flex-col gap-6 no-scrollbar overflow-y-auto shrink-0">
        <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
          <h3 className="font-serif text-2xl font-medium text-on-surface mb-1 italic">Manuscript Release</h3>
          <p className="font-body text-sm text-on-surface-variant mb-6 leading-relaxed">Tracking the evolution of the digital parchment through validation cycles.</p>

          <div className="space-y-4">
            {/* Deployment Item 1: Validated */}
            <div className="relative pl-6 border-l-2 border-tertiary/20 group">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-tertiary ring-4 ring-surface-container-low"></div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-tertiary">Validated</span>
                  <span className="text-[10px] text-on-surface-variant opacity-60">12:45 PM</span>
                </div>
                <h4 className="font-serif text-lg text-primary">Final Production Build</h4>
                <p className="text-xs text-on-surface-variant">Commit: <span className="font-mono">ed7f2c</span> — "Refined editorial spacing"</p>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="bg-surface p-2 rounded-lg text-[10px] flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-xs">check_circle</span>
                    <span>Build success</span>
                  </div>
                  <div className="bg-surface p-2 rounded-lg text-[10px] flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-xs">check_circle</span>
                    <span>Tests passed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deployment Item 2: Pending */}
            <div className="relative pl-6 border-l-2 border-primary/20 group">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary animate-pulse ring-4 ring-surface-container-low"></div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Pending</span>
                  <span className="text-[10px] text-on-surface-variant opacity-60">Just now</span>
                </div>
                <h4 className="font-serif text-lg text-on-surface">Staging Environment Update</h4>
                <p className="text-xs text-on-surface-variant italic">Deploying linguistic analysis module...</p>

                <div className="mt-4 bg-surface rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px] text-tertiary">done</span> Linting Manuscript</span>
                    <span className="text-on-surface-variant font-mono">0.4s</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary animate-ping"></span> Compiling Assets</span>
                    <span className="text-primary font-mono italic">Running</span>
                  </div>
                  <div className="flex items-center justify-between text-xs opacity-40">
                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px]">circle</span> End-to-end Testing</span>
                    <span className="font-mono">--</span>
                  </div>
                  <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deployment Item 3: Error */}
            <div className="relative pl-6 border-l-2 border-error/20 group">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-error ring-4 ring-surface-container-low"></div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-error">Error</span>
                  <span className="text-[10px] text-on-surface-variant opacity-60">2h ago</span>
                </div>
                <h4 className="font-serif text-lg text-on-surface-variant opacity-60 line-through">Experimental Feature Toggle</h4>
                <div className="mt-2 bg-error-container/30 border border-error/10 p-3 rounded-lg">
                  <div className="flex items-start gap-2 text-error text-[11px] leading-relaxed">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    <span>Deploy aborted: 'LinguisticEngine' failed to initialize within 30000ms. Check logs for semantic mismatch.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Status Section */}
        <div className="mt-auto p-4 bg-surface-container-high rounded-xl border border-outline-variant/10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">System Status</span>
            <span className="text-xs font-medium text-tertiary">All Services Operational</span>
          </div>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-tertiary"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-tertiary"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-tertiary"></div>
          </div>
        </div>
      </section>

      {/* Right Pane: Live Browser Preview */}
      <section className="flex-1 flex flex-col bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/15 overflow-hidden">
        {/* Browser Header */}
        <div className="bg-surface-container-high px-6 py-3 flex items-center gap-6 border-b border-outline-variant/10">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-outline-variant/40"></div>
            <div className="w-3 h-3 rounded-full bg-outline-variant/40"></div>
            <div className="w-3 h-3 rounded-full bg-outline-variant/40"></div>
          </div>
          <div className="flex-1 flex items-center bg-surface-container-low px-4 py-1.5 rounded-lg border border-outline-variant/20 shadow-inner">
            <span className="material-symbols-outlined text-sm text-on-surface-variant mr-3">lock</span>
            <span className="text-xs text-on-surface-variant/80 font-mono tracking-tight">https://manuscript-preview-ed7f2c.editorial.ai</span>
            <span className="material-symbols-outlined text-sm text-on-surface-variant ml-auto opacity-40">refresh</span>
          </div>
          <div className="flex gap-2">
            <button className="p-1.5 rounded-lg hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">open_in_new</span>
            </button>
            <button className="p-1.5 rounded-lg hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">devices</span>
            </button>
          </div>
        </div>

        {/* Preview Area (Simulated App) */}
        <div className="flex-1 bg-white overflow-y-auto relative no-scrollbar">
          {/* Preview Overlay Indicator */}
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full border border-primary/20 backdrop-blur-sm">LIVE PREVIEW</span>
          </div>

          {/* Inner Simulated Content (Editorial Page) */}
          <div className="max-w-2xl mx-auto py-20 px-8">
            <header className="text-center mb-16">
              <h1 className="font-serif text-5xl mb-4 text-primary italic leading-tight">The Art of the Silent Margin</h1>
              <p className="text-on-surface-variant italic font-serif text-xl">A dissertation on visual breathing room in typography.</p>
            </header>

            <div className="aspect-[16/9] w-full bg-surface-container-low rounded-xl mb-12 overflow-hidden border border-outline-variant/10 shadow-sm">
              <img alt="Minimalist library" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCiWFPLD1q1qa1a46aL5FuXLHS8bCp-2iNTzky_vZ1p8AevFUBB2MvmUATolrvPffDpJSvPgUPq4RhxpbTXJ-I5d-INPFxFLbBmldDevGW4O7KZZEhUGFumSi6mvHlaZZaQYIQrGPMhxJgANkeTf-mduiGeGqAaCZEzUMooWQrezJXAK5cIeFe5-fnlbVzq1kAm6MlXSTQlP6YEqdCMxF7pPiKT3MlK2L-OR7ecdsRV4kkiGHSTsbAbvLN0A5HoN4ucxkDiWAktVwV"/>
            </div>

            <article className="prose prose-stone">
              <div className="flex gap-8 items-start">
                <div className="flex-1">
                  <p className="font-serif text-lg leading-relaxed text-on-surface-variant first-letter:text-6xl first-letter:font-serif first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                    Typography is not merely the choice of letters, but the orchestration of the space between them. In the digital age, we have often sacrificed the "white soul" of the page for the efficiency of the grid. This project seeks to reclaim the elegance of the manuscript.
                  </p>
                </div>
                <div className="w-32 bg-surface-container-low p-4 rounded-xl border-l-4 border-primary mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-2">Editorial Note</p>
                  <p className="text-[11px] italic leading-tight text-on-surface-variant">"Whitespace is not empty; it is active."</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-12">
                <div className="p-6 bg-surface-container-low rounded-2xl">
                  <h5 className="font-serif text-xl text-primary mb-2 italic">The Serif's Voice</h5>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Modern serifs carry the weight of history without the dust of the archive.</p>
                </div>
                <div className="p-6 bg-surface-container-low rounded-2xl">
                  <h5 className="font-serif text-xl text-primary mb-2 italic">Asymmetry</h5>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Dynamic balance creates a rhythm that leads the eye through the narrative.</p>
                </div>
              </div>
            </article>
          </div>
        </div>

        {/* Live Logs Console (Minimizable) */}
        <div className="bg-surface-container h-12 border-t border-outline-variant/20 flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span> CONSOLE READY
            </span>
            <div className="h-4 w-[1px] bg-outline-variant/30"></div>
            <span className="text-[10px] font-mono text-on-surface-variant/60">Watching for file changes in <span className="text-primary italic">/src/manuscript/...</span></span>
          </div>
          <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-70">
            Show Terminal <span className="material-symbols-outlined text-sm">keyboard_arrow_up</span>
          </button>
        </div>
      </section>
    </div>
  );
}
