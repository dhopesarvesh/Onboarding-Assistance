import { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import DocumentViewer from "./components/DocumentViewer/DocumentViewer";
import "./App.css";

function App() {
  const [selectedDoc, setSelectedDoc] = useState(null);

  return (
    <div className="app-layout">
      <Sidebar
        selectedDocId={selectedDoc?.id}
        onSelectDocument={setSelectedDoc}
      />
      <main className="main-content">
        <DocumentViewer document={selectedDoc} />
      </main>
    </div>
  );
}

export default App;