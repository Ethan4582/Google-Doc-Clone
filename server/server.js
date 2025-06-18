require("dotenv").config();

const mongoose = require("mongoose");
const Document = require("./Document");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const xss = require("xss"); 

const app = express();


app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  })
);

const allowedOrigins = [
  "https://google-doc-frontend-3z2r.onrender.com"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // if you ever use cookies/auth
  })
);
app.use(express.json());

// Clean connection config (no deprecated options)
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const io = new Server(3001, {
  cors: {
    origin: "https://google-doc-frontend-3z2r.onrender.com",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("get-document", async (documentId) => {
    const cleanId = xss(documentId); // sanitize input
    const document = await findOrCreateDocument(cleanId);
    socket.join(cleanId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(cleanId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(cleanId, { data });
    });
  });
});

app.listen(3002, () => console.log("REST API running on 3002"));

async function findOrCreateDocument(id) {
  if (id == null) return;
  let document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: {} });
}

// Example REST route with input sanitation
app.delete("/api/document/:id", async (req, res) => {
  const cleanId = xss(req.params.id);
  await Document.findByIdAndDelete(cleanId);
  res.json({ success: true });
});
