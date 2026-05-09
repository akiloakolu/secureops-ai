# SecureOps AI

SecureOps AI is an AI-powered security operations and enterprise risk platform that analyzes suspicious security events, generates SOC-style findings, assigns risk severity, stores analysis history, and exports incident reports.

## Live Demo

Frontend: Vercel  
Backend: Render  

## Key Features

- AI-powered threat analysis
- Risk scoring and severity classification
- MITRE ATT&CK-style mapping
- Executive risk summary
- Recommended remediation actions
- MongoDB incident history
- Threat severity dashboard
- PDF incident report export
- User authentication
- Full-stack cloud deployment

## Tech Stack

**Frontend**
- React
- Vite
- Axios
- Recharts
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- OpenAI API
- JWT Authentication

**Deployment**
- Vercel
- Render
- GitHub

## Architecture Diagram

```text
User
 │
 ▼
React Frontend (Vercel)
 │
 │  API Requests
 ▼
Node.js / Express Backend (Render)
 │
 ├── OpenAI API
 │     └── AI threat analysis, findings, executive summary
 │
 ├── MongoDB Atlas
 │     └── Stores incident history and user data
 │
 └── JWT Authentication
       └── Login and user session handling
