import { Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { Dashboard } from "./pages/Dashboard";
import { Workspace } from "./pages/Workspace";
import { Deploy } from "./pages/Deploy";

function App() {
  return (
    <div className="flex w-full h-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-surface">
        <TopNav />
        <main className="flex-1 overflow-hidden relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/deploy" element={<Deploy />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
