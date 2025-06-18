import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

async function isBackendAvailable() {
  try {
    const res = await fetch("https://google-doc-clone-backend-2ap8.onrender.com/api/health", { cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkBackend = async () => {
      const available = await isBackendAvailable();

      if (!available) {
        // If the backend is not available, try to load from localStorage
        const stored = JSON.parse(localStorage.getItem("docs") || "[]");
        if (isMounted) setDocs(stored);
      } else {
        // If the backend is available, fetch the documents
        fetch("http://localhost:3002/api/documents")
          .then((res) => {
            if (!res.ok) throw new Error("DB not available");
            return res.json();
          })
          .then((data) => {
            if (isMounted) {
              setDocs(data.map((doc) => doc._id));
              localStorage.setItem("docs", JSON.stringify(data.map((doc) => doc._id)));
            }
          })
          .catch(() => {
            if (isMounted) {
              const stored = JSON.parse(localStorage.getItem("docs") || "[]");
              setDocs(stored);
            }
          });
      }
    };

    checkBackend();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = (docId) => {
    const updatedDocs = docs.filter((id) => id !== docId);
    setDocs(updatedDocs);
    localStorage.setItem("docs", JSON.stringify(updatedDocs));

    fetch(`http://localhost:3002/api/document/${docId}`, { method: "DELETE" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <header style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 24, background: "#2563eb", color: "#fff" }}>
        <h2>My Documents</h2>
      </header>
      <div style={{ maxWidth: 700, margin: "2em auto" }}>
        {docs.length === 0 && <div>No documents yet.</div>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {docs.map((doc) => (
            <li key={doc} style={{ background: "#fff", marginBottom: 16, padding: 20, borderRadius: 8, boxShadow: "0 2px 8px #0001", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Document: {doc}</span>
              <div>
                <button
                  onClick={() => navigate(`/document/${doc}`)}
                  style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, padding: "0.5em 1.2em", fontWeight: 600, cursor: "pointer", marginRight: 10 }}
                >
                  Open
                </button>
                <button
                  onClick={() => handleDelete(doc)}
                  style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, padding: "0.5em 1.2em", fontWeight: 600, cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}