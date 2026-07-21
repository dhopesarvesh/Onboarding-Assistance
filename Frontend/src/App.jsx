import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import DocumentViewer from "./components/DocumentViewer/DocumentViewer";
import "./App.css";

function App() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFolders = useCallback(() => {
    setLoading(true);
    fetch("http://localhost:8080/api/folders")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load folders");
        return res.json();
      })
      .then((data) => {
        setFolders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  return (
    <div className="app-layout">
      <Sidebar
        folders={folders}
        loading={loading}
        error={error}
        onRefresh={fetchFolders}
      />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<DocumentViewer document={null} />} />
          <Route
            path="/:folderSlug/:docSlug"
            element={<DocumentRoute folders={folders} />}
          />
        </Routes>
      </main>
    </div>
  );
}

function DocumentRoute({ folders }) {
  const { folderSlug, docSlug } = useParams();
  const folder = folders.find((f) => f.slug === folderSlug);
  const document = folder?.documents.find((d) => d.slug === docSlug) || null;
  return <DocumentViewer document={document} folderName={folder?.name} />;
}

export default App;