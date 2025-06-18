import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

export default function TextEditor() {
  const { id: documentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);
    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (!socket || !quill) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  const wrapperRef = useCallback(
    (wrapper) => {
      if (wrapper == null) return;

      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      wrapper.append(editor);
      const q = new Quill(editor, {
        theme: "snow",
        modules: { toolbar: TOOLBAR_OPTIONS },
      });
      q.disable();
      q.setText("Loading...");
      setQuill(q);
    },
    []
  );

  const handleShare = () => {
    const url = window.location.origin + location.pathname;
    navigator.clipboard.writeText(url);
    alert("Document link copied to clipboard!");
  };

  // Ensure doc is in localStorage
  useEffect(() => {
    const docs = JSON.parse(localStorage.getItem("docs") || "[]");
    if (!docs.includes(documentId)) {
      docs.push(documentId);
      localStorage.setItem("docs", JSON.stringify(docs));
    }
  }, [documentId]);

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.5em 2em",
          background: "#2563eb",
          color: "#fff",
          boxShadow: "0 2px 8px #0002",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: "1.3em",
          }}
        >
          Google Docs Clone
        </h2>
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "#fff",
              color: "#2563eb",
              border: "none",
              borderRadius: 6,
              padding: "0.5em 1.2em",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 1px 4px #0001",
              marginRight: 12,
            }}
          >
            Dashboard
          </button>
          <button
            onClick={handleShare}
            style={{
              background: "#fff",
              color: "#2563eb",
              border: "none",
              borderRadius: 6,
              padding: "0.5em 1.2em",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 1px 4px #0001",
            }}
          >
            Share
          </button>
        </div>
      </div>
      <div
        className="container"
        ref={wrapperRef}
        style={{
          background: "#fff",
          margin: "2em auto",
          borderRadius: 12,
          boxShadow: "0 2px 16px #0001",
          maxWidth: 900,
          minHeight: 500,
          padding: 24,
        }}
      ></div>
    </div>
  );
}