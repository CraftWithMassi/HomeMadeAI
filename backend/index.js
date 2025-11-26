import express from 'express';
import Groq from "groq-sdk";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

if (!process.env.GROQ_API_KEY) {
    console.error("ERROR: GROQ_API_KEY is not set in .env file!");
    console.error("Please create a .env file in the backend folder with: GROQ_API_KEY=your_api_key_here");
}

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== "string") {
            return res.status(400).json({ error: "Message is required" });
        }

        const completion = await client.chat.completions.create({
            model: "groq/compound",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful AI assistant.",
                },
                {
                    role: "user",
                    content: message,
                },
            ],
        });

        res.json({
            reply: completion.choices?.[0]?.message?.content ?? "No reply generated.",
        });
    } catch (err) {
        console.error("Error details:", err);
        const errorMessage = err.message || "Unknown error occurred";
        res.status(500).json({ 
            error: "AI API Error",
            details: errorMessage 
        });
    }
});

app.listen(3001, () => console.log("Backend running on port 3001"));