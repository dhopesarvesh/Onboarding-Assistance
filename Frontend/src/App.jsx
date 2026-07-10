import Sidebar from "./components/Sidebar/Sidebar";
import "./App.css";

function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <h1>Main content goes here</h1>
      </main>
    </div>
  );
}

export default App;