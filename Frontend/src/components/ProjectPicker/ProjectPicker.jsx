import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectPicker.css";

function ProjectPicker() {
  const [projects, setProjects] = useState([]);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const fetchProjects = () => {
    fetch("http://localhost:8080/api/projects")
      .then((res) => res.json())
      .then(setProjects);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async () => {
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    const res = await fetch("http://localhost:8080/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const project = await res.json();
    setCreating(false);
    setNewName("");
    navigate(`/${project.slug}`);
  };

  return (
    <div className="project-picker">
      <h1 className="picker-title">📘 OnboardAI</h1>
      <p className="picker-subtitle">Choose a project or create a new one</p>

      <div className="project-list">
        {projects.map((p) => (
          <button key={p.id} className="project-card" onClick={() => navigate(`/${p.slug}`)}>
            <span className="project-icon">📁</span>
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      <div className="create-project-row">
        <input
          className="project-input"
          placeholder="New project name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createProject()}
        />
        <button className="create-btn" onClick={createProject} disabled={creating}>
          {creating ? "Creating..." : "Create Project"}
        </button>
      </div>
    </div>
  );
}

export default ProjectPicker;