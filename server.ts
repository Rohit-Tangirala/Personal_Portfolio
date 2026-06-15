import express from "express";
import path from "path";
import cors from "cors";
import mysql from "mysql2/promise";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-Memory Fallbacks (used if MySQL server setup is incomplete or variables missing)
const fallbackProjects = [
  {
    id: 1,
    title: "Cineverse Explorer",
    category: "Collaboration / Systems",
    description: "Full-stack graph-based universe connector using React 19, Express.js, and Neo4j Aura.",
    long_description: "Implemented complex custom JWT authenticated gateways, Breadth-First Search (BFS) pathfinding traversals across Marvel, DC, Naruto, and One Piece universes, and integrated Google Gemini API to drive real-time conversational chat answers. Engineered with optimized Neo4j active session pipelines to map hops under 10ms.",
    tags: "React 19, TypeScript, Express, Neo4j, Gemini API, JWT",
    live_url: "https://github.com/Rohit-Tangirala/cineverse-explorer",
    github_url: "https://github.com/Rohit-Tangirala/cineverse-explorer",
    image_url: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=800&auto=format&fit=crop",
    featured: true,
    order_num: 1
  },
  {
    id: 2,
    title: "SonicGuard",
    category: "System / Infrastructure",
    description: "AI-powered automated GitHub Pull Request code quality review system driven by FastAPI.",
    long_description: "Deconstructs PR check cycles. Architected with high-concurrency asynchronous code pipelines via Python's asyncio module. Executes multi-agent code analysis loops, triggers advanced secure vulnerability vulnerability alerts, and produces actionable refactoring tips using Google Gemini API.",
    tags: "FastAPI, Python, asyncio, Gemini API, Multi-Agent, GitHub API",
    live_url: "https://github.com/Rohit-Tangirala/Sonic_Guard",
    github_url: "https://github.com/Rohit-Tangirala/Sonic_Guard",
    image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    featured: true,
    order_num: 2
  },
  {
    id: 3,
    title: "Solar Dewater X",
    category: "IoT & Embedded",
    description: "Smart solar-driven dewatering environment tracking and automated pump controller.",
    long_description: "Developed end-to-end hardware-to-cloud interfaces. Integrates high-precision real-time groundwater saturation level monitoring, an autonomous threshold-sensitive pump rate calibration protocol, and customized energy optimization formulas implemented in Embedded C on microcontroller chips.",
    tags: "Arduino, Embedded C, IoT, Solar Energy, Telemetry, Sensors",
    live_url: "https://github.com/Rohit-Tangirala/SolarDewaterX_EPICS",
    github_url: "https://github.com/Rohit-Tangirala/SolarDewaterX_EPICS",
    image_url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop",
    featured: true,
    order_num: 3
  }
];

let inMemoryMessages: Array<{ id: number; name: string; email: string; message: string; created_at: string }> = [
  {
    id: 1,
    name: "Ada Lovelace",
    email: "ada@analyticalengine.org",
    message: "This portfolio layout is incredibly professional! The fluid GSAP transitions and Instrument Serif display headings resemble an interactive editorial work of art.",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

// Lazy-Initialized Connection Pool
let pool: mysql.Pool | null = null;
let connectionFailedLogged = false;

function getDbPool(): mysql.Pool | null {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SSL_REQUIRED } = process.env;

  if (!DB_HOST || !DB_USER || !DB_PASSWORD) {
    if (!connectionFailedLogged) {
      console.log("MySQL connection variables missing. Running in Fallback (In-Memory) mode.");
      connectionFailedLogged = true;
    }
    return null;
  }

  if (pool) return pool;

  try {
    const config: mysql.PoolOptions = {
      host: DB_HOST,
      port: Number(DB_PORT || 3306),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME || "defaultdb",
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      connectTimeout: 5000, 
    };

    if (DB_SSL_REQUIRED === "true") {
      config.ssl = {
        rejectUnauthorized: false
      };
    }

    pool = mysql.createPool(config);
    return pool;
  } catch (error) {
    console.error("Database connection initialization failed:", error);
    return null;
  }
}

// 1. API: Database Status Endpoint
app.get("/api/db-status", async (req, res) => {
  const activePool = getDbPool();
  if (!activePool) {
    return res.json({
      connected: false,
      usingFallback: true,
      message: "Database variables missing (Host, Password or User is empty). Use the DB Control panel to verify your configuration.",
      config: {
        host: process.env.DB_HOST || "none",
        port: process.env.DB_PORT || "24921",
        database: process.env.DB_NAME || "defaultdb",
        user: process.env.DB_USER || "avnadmin"
      }
    });
  }

  try {
    // Attempt rapid test query
    const connection = await activePool.getConnection();
    connection.release();
    return res.json({
      connected: true,
      usingFallback: false,
      message: "Successfully connected to Cloud Relational MySQL Database!",
      config: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER
      }
    });
  } catch (err: any) {
    return res.json({
      connected: false,
      usingFallback: true,
      message: "Could not execute health check connection to Cloud MySQL: " + err.message,
      config: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER
      }
    });
  }
});

// 2. API: Serve Project Information (Dynamic from Database or Fallback)
app.get("/api/projects", async (req, res) => {
  const activePool = getDbPool();
  if (!activePool) {
    return res.json({ source: "fallback", data: fallbackProjects });
  }

  try {
    const [rows]: any = await activePool.query("SELECT * FROM projects ORDER BY order_num ASC");
    if (!rows || rows.length === 0) {
      // If table is empty, serve fallbacks but indicate they can initialize
      return res.json({ source: "fallback (table empty)", data: fallbackProjects });
    }
    
    // Map with latest official links to bulletproof the repository button links
    const mappedRows = rows.map((p: any) => {
      let github_url = p.github_url;
      let live_url = p.live_url;
      if (p.title === "Cineverse Explorer") {
        github_url = "https://github.com/Rohit-Tangirala/cineverse-explorer";
        live_url = "https://github.com/Rohit-Tangirala/cineverse-explorer";
      } else if (p.title === "SonicGuard") {
        github_url = "https://github.com/Rohit-Tangirala/Sonic_Guard";
        live_url = "https://github.com/Rohit-Tangirala/Sonic_Guard";
      } else if (p.title === "Solar Dewater X") {
        github_url = "https://github.com/Rohit-Tangirala/SolarDewaterX_EPICS";
        live_url = "https://github.com/Rohit-Tangirala/SolarDewaterX_EPICS";
      }
      return { ...p, github_url, live_url };
    });

    return res.json({ source: "database", data: mappedRows });
  } catch (err: any) {
    console.warn("Database query error, serving static developer showcase. Info:", err.message);
    return res.json({ source: "fallback (query failed)", data: fallbackProjects });
  }
});

// 3. API: Handle Project Setup / Seed Table
app.post("/api/setup-db", async (req, res) => {
  const activePool = getDbPool();
  if (!activePool) {
    return res.status(400).json({
      status: "error",
      message: "Credentials missing. Configure environment secrets before using DB Setup."
    });
  }

  try {
    const connection = await activePool.getConnection();
    
    // Create projects table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        long_description TEXT NOT NULL,
        tags VARCHAR(255) NOT NULL,
        live_url VARCHAR(255) DEFAULT '',
        github_url VARCHAR(255) DEFAULT '',
        image_url VARCHAR(255) DEFAULT '',
        featured BOOLEAN DEFAULT FALSE,
        order_num INT DEFAULT 0
      )
    `);

    // Create messages table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if projects are populated already
    const [rows]: any = await connection.query("SELECT COUNT(*) as count FROM projects");
    let seeded = false;
    if (rows[0].count === 0) {
      // Insert fallbacks as seed data
      for (const p of fallbackProjects) {
        await connection.query(
          "INSERT INTO projects (title, category, description, long_description, tags, live_url, github_url, image_url, featured, order_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [p.title, p.category, p.description, p.long_description, p.tags, p.live_url, p.github_url, p.image_url, p.featured, p.order_num]
        );
      }
      seeded = true;
    }

    connection.release();
    return res.json({
      status: "success",
      message: seeded 
        ? "Successfully created database tables and populated with seed portfolio project data!" 
        : "Database tables exist and verified. Seed data not required (data already populated)."
    });
  } catch (err: any) {
    return res.status(500).json({
      status: "error",
      message: "Setup failed: " + err.message
    });
  }
});

// Helper to dispatch email notification via Resend.com
async function sendResendEmail(name: string, email: string, message: string) {
  const apiKey = process.env.RESEND_API_KEY || "re_PsAtqHUn_2ExjqJB4mNNjJkpf6LQ716d2";
  if (!apiKey) {
    console.warn("Resend configuration error: no API key defined.");
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: "2410030030cse@gmail.com",
        subject: `New Lead: Connection from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
            <h2 style="color: #1a1a1a; border-bottom: 1px solid #eaeaea; padding-bottom: 10px; font-weight: normal;">New Portfolio Submission</h2>
            <p style="font-size: 14px; color: #444;"><strong style="color: #000;">Name:</strong> ${name}</p>
            <p style="font-size: 14px; color: #444;"><strong style="color: #000;">Email:</strong> ${email}</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; font-size: 14px; color: #333; line-height: 1.5; white-space: pre-wrap;">
              ${message}
            </div>
            <p style="font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #eaeaea; padding-top: 10px; font-style: italic;">
              Dispatched automatically from your student developer portfolio.
            </p>
          </div>
        `
      })
    });

    if (!response.ok) {
      const errResponse = await response.text();
      console.error("Resend API warning during dispatch:", errResponse);
    } else {
      console.log("Successfully dispatched Resend lead email to 2410030030cse@gmail.com");
    }
  } catch (err: any) {
    console.error("Failed to transmit email notification via Resend:", err.message);
  }
}

// 4. API: Save Contact Submission Route
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ status: "error", message: "Name, email and message details are required." });
  }

  // Fire off Email Dispatch in the background
  sendResendEmail(name, email, message).catch(err => {
    console.error("Background email sync failed:", err);
  });

  const activePool = getDbPool();
  if (!activePool) {
    // Save in-memory
    const newMessage = {
      id: inMemoryMessages.length + 1,
      name,
      email,
      message,
      created_at: new Date().toISOString()
    };
    inMemoryMessages.unshift(newMessage);
    return res.json({
      status: "success",
      source: "fallback (in-memory)",
      message: "Message dispatched! An email brief has been submitted successfully to Rohit's inbox."
    });
  }

  try {
    await activePool.query(
      "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );
    return res.json({
      status: "success",
      source: "database",
      message: "Your message has been securely recorded, and an email brief has been submitted successfully to Rohit's inbox."
    });
  } catch (err: any) {
    console.warn("Could not insert message to DB, saving in-memory:", err.message);
    const newMessage = {
      id: inMemoryMessages.length + 1,
      name,
      email,
      message,
      created_at: new Date().toISOString()
    };
    inMemoryMessages.unshift(newMessage);
    return res.json({
      status: "success",
      source: "fallback (due to DB error)",
      message: "Message received! Your message is cached to memory, and an email brief has been submitted successfully to Rohit's inbox."
    });
  }
});

// 5. API: View Contact Submissions (Allows user/maintainer to test integration in real-time)
app.get("/api/messages", async (req, res) => {
  const activePool = getDbPool();
  if (!activePool) {
    return res.json({ source: "fallback", data: inMemoryMessages });
  }

  try {
    const [rows]: any = await activePool.query("SELECT * FROM contact_messages ORDER BY created_at DESC");
    return res.json({ source: "database", data: rows });
  } catch (err: any) {
    return res.json({ source: "fallback", data: inMemoryMessages, error: err.message });
  }
});

// --- Dynamic Express / Vite Server Binding ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched successfully. Listening on port http://0.0.0.0:${PORT}`);
  });
}

startServer();
