require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");


const Analysis = require("./models/Analysis");


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SecureOps AI backend is running");
});

app.get("/analyses", async (req, res) => {
  const analyses = await Analysis.find().sort({ createdAt: -1 });
  res.json(analyses);
});

app.post("/analyze", async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({
        error: "No security input provided",
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a SOC analyst and cybersecurity risk expert.",
        },
        {
          role: "user",
          content: input,
        },
      ],
    });

    const aiText =
      completion.choices[0].message.content;
      const cleanAiText = aiText
  .replace(/###/g, "")
  .replace(/\*\*/g, "")
  .trim();

    const result = {
      riskLevel: "High",
      riskScore: 85,
      category: "AI Security Analysis",
      mitreTechnique: "See summary",
      summary: cleanAiText,
      findings: [cleanAiText],
      remediation: [
        "Review the AI analysis and take appropriate SOC action",
      ],
      executiveSummary: cleanAiText,
    };

    await Analysis.create({
      input: input,
      result: JSON.stringify(result),
      severity: result.riskLevel,
    });

    res.json(result);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Analysis failed",
    });
  }
});

 
const PORT = 5000;

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({
      message: "Signup successful",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Signup failed",
    });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`SecureOps AI server running on port ${PORT}`);
});