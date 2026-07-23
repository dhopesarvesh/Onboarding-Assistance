import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import ProjectPicker from "./components/ProjectPicker/ProjectPicker";
import Sidebar from "./components/Sidebar/Sidebar";
import DocumentViewer from "./components/DocumentViewer/DocumentViewer";
import "./App.css";
import ChatBot from "./components/ChatBot/ChatBot";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProjectPicker />} />
      <Route path="/:projectSlug/*" element={<ProjectWorkspace />} />
    </Routes>
  );
}

function ProjectWorkspace() {
  const { projectSlug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProject = useCallback(() => {
    setLoading(true);
    fetch("http://localhost:8080/api/projects")
      .then((res) => res.json())
      .then((projects) => {
        const found = projects.find((p) => p.slug === projectSlug);
        setProject(found || null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [projectSlug]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (loading) return <div className="app-loading">Loading project...</div>;
  if (error || !project) return <div className="app-loading">Project not found.</div>;

  return (
    <div className="app-layout">
      <Sidebar project={project} loading={loading} error={error} onRefresh={fetchProject} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<DocumentViewer document={null} />} />
          <Route path=":folderSlug/:docSlug" element={<DocumentRoute project={project} />} />
        </Routes>
        <ChatBot/>
      </main>
    </div>
  );
}

function DocumentRoute({ project }) {
  const { folderSlug, docSlug } = useParams();
  const folder = project.folders.find((f) => f.slug === folderSlug);
  const document = folder?.documents.find((d) => d.slug === docSlug) || null;
  return <DocumentViewer document={document} folderName={folder?.name} />;
}

export default App;