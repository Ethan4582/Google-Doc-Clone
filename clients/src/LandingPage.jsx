import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleNewDoc = async () => {
    const id = uuidV4();

    try {
      await fetch("http://localhost:3002/api/document/" + id, { method: "POST" });
    } catch {
      
    }
  
    const docs = JSON.parse(localStorage.getItem("docs") || "[]");
    if (!docs.includes(id)) {
      docs.push(id);
      localStorage.setItem("docs", JSON.stringify(docs));
    }
    navigate(`/document/${id}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "3em 4em",
          borderRadius: "18px",
          boxShadow: "0 8px 32px rgba(60,60,120,0.12)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src="https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_5.ico"
          alt="Google Docs Logo"
          style={{ width: 64, marginBottom: 24 }}
        />
        <h1 style={{ fontWeight: 700, fontSize: "2.5em", color: "#2563eb", marginBottom: 8 }}>
          Google Docs Clone
        </h1>
        <p style={{ color: "#64748b", marginBottom: 32, fontSize: "1.1em" }}>
          Create and share collaborative documents in real time.
        </p>
        <button
          onClick={handleNewDoc}
          style={{
            padding: "0.9em 2.5em",
            fontSize: "1.2em",
            background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(37,99,235,0.08)",
            transition: "background 0.2s",
          }}
        >
          Start a New Document
        </button>
      </div>
      <footer style={{ marginTop: 40, color: "#94a3b8", fontSize: "0.95em" }}>
        &copy; {new Date().getFullYear()} Google Docs Clone. For demo purposes only.
      </footer>
    </div>
  );
}