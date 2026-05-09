import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

import { useState } from "react";
import axios from "axios";
import { ShieldAlert, Activity, Brain, FileText } from "lucide-react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [isLogin, setIsLogin] = useState(true);
const [user, setUser] = useState(null);

  const fetchHistory = async () => {
    const response = await axios.get("http://localhost:5000/analyses");
    setHistory(response.data);
  };
  const severityData = [
  {
    name: "High",
    value: history.filter((item) => item.severity === "High").length,
  },
  {
    name: "Medium",
    value: history.filter((item) => item.severity === "Medium").length,
  },
  {
    name: "Low",
    value: history.filter((item) => item.severity === "Low").length,
  },
];

  const analyzeThreat = async () => {
  try{
    setLoading(true);
    const response = await axios.post(
      "http://localhost:5000/analyze",
      {
        input,
      }
    );

    setResult(response.data);

    fetchHistory();
    
    setLoading(false);

  } catch (error) {
    setLoading(false);
    alert("Analysis failed. Make sure backend is running.");
  }
};
const exportReportToPDF = async () => {
  const reportElement = document.getElementById("incident-report");

  if (!reportElement) {
    alert("No report available to export.");
    return;
  }

  const canvas = await html2canvas(reportElement);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 190;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
  pdf.save("SecureOps-AI-Incident-Report.pdf");
};
const handleAuth = async () => {
  try {
    alert("Button clicked");

    const endpoint = isLogin ? "login" : "signup";

    alert("Sending request to backend");

    const response = await axios.post(
      `https://secureops-ai-backend.onrender.com/${endpoint}`,
      {
        name,
        email,
        password,
      }
    );

    alert("Backend responded");

    if (isLogin) {
  localStorage.setItem("token", response.data.token);
  setUser(response.data.user);
  alert("Login successful");
} else {
      alert("Signup successful. Please login.");
      setIsLogin(true);
    }
  } catch (error) {
    alert(error.response?.data?.message || "Authentication failed");
  }
};

  return (
    <div className="app">
      <header>
        <h1>SecureOps AI</h1>
        <p>
          AI-powered security operations and enterprise risk command center
        </p>
      </header>
      {!user && (
  <div className="auth-box">
  <h2>{isLogin ? "Login" : "Create Account"}</h2>

  {!isLogin && (
    <input
      type="text"
      placeholder="Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  )}

  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <button
  type="button"
  onClick={() => {
    console.log("Login button clicked directly");
    handleAuth();
  }}
>
  {isLogin ? "Login" : "Sign Up"}
</button>

  <p
    onClick={() => setIsLogin(!isLogin)}
    style={{ cursor: "pointer", marginTop: "10px" }}
  >
    {isLogin
      ? "Don't have an account? Sign Up"
      : "Already have an account? Login"}
  </p>
</div>
)}

      <section className="cards">
        <div className="card">
          <ShieldAlert />
          <h3>Threat Analysis</h3>
          <p>Analyze suspicious logs and alerts.</p>
        </div>

        <div className="card">
          <Activity />
          <h3>Risk Scoring</h3>
          <p>Classify severity and business impact.</p>
        </div>

        <div className="card">
          <Brain />
          <h3>AI Insight</h3>
          <p>Generate analyst-style explanations.</p>
        </div>

        <div className="card">
          <FileText />
          <h3>Executive Summary</h3>
          <p>Translate threats into business language.</p>
        </div>
      </section>

      <section className="analyzer">
        <h2>Security Event Analyzer</h2>

        <textarea
          placeholder="Paste a log, phishing email, IAM event, or cloud alert here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button onClick={analyzeThreat} disabled={loading}>
  {loading ? "Analyzing..." : "Analyze Threat"}
</button>
      </section>

      {result && (
        <section className="result-section" id="incident-report">
          <h2>Incident Analysis Result</h2>
          <button onClick={exportReportToPDF}>
  Export Report to PDF
</button>

          <div className="risk-box">
            <p>
              <strong>Risk Level:</strong> {result.riskLevel}
            </p>

            <p>
              <strong>Risk Score:</strong> {result.riskScore}/100
            </p>

            <p>
              <strong>Category:</strong> {result.category}
            </p>

            <p>
              <strong>MITRE ATT&CK:</strong> {result.mitreTechnique}
            </p>
            <div className="mitre-box">
  <h3>MITRE ATT&CK Mapping</h3>

  <div className="mitre-grid">
    <div className="mitre-card">
      <strong>Tactic</strong>
      <span>Execution</span>
    </div>

    <div className="mitre-card">
      <strong>Technique</strong>
      <span>{result.mitreTechnique}</span>
    </div>

    <div className="mitre-card">
      <strong>Platform</strong>
      <span>Windows / Endpoint</span>
    </div>

    <div className="mitre-card">
      <strong>Detection Source</strong>
      <span>PowerShell Logs / SIEM Alert</span>
    </div>
  </div>
</div>
        
          </div>

          <h3>Analyst Summary</h3>
          <p>{result.summary}</p>

          <h3>Key Findings</h3>

          <ul>
            {result.findings.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3>Recommended Actions</h3>

          <ul>
            {result.remediation.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <div className="executive-summary">
  <h3>Executive Risk Summary</h3>
  <p>{result.executiveSummary}</p>
</div>
        </section>
      )}
      <section className="history-section">
        <section className="dashboard-section">
  <h2>Threat Severity Dashboard</h2>

  <PieChart width={350} height={300}>
    <Pie
      data={severityData}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={100}
      label
    />
    <Tooltip />
    <Legend />
  </PieChart>
</section>
<PieChart width={350} height={300}>
  <Pie
  data={severityData}
  dataKey="value"
  nameKey="name"
  cx="50%"
  cy="50%"
  outerRadius={100}
  label
>
  <Cell fill="#ff4d4f" />
  <Cell fill="#faad14" />
  <Cell fill="#52c41a" />
  </Pie>

  <Tooltip />
  <Legend />
</PieChart>

  <h2>Saved Analysis History</h2>
  <input
  type="text"
  placeholder="Search incidents..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="search-input"
/>

  {history
  .filter((item) =>
    item.input.toLowerCase().includes(search.toLowerCase())
  )
  .map((item) => (
    <div className="history-card" key={item._id}>
      <h3 className={item.severity.toLowerCase()}>
  {item.severity}
</h3>
      <p><strong>Input:</strong> {item.input}</p>
      <p><strong>Risk:</strong> {JSON.parse(item.result).riskLevel}</p>
<p><strong>Score:</strong> {JSON.parse(item.result).riskScore}</p>
<p><strong>Category:</strong> {JSON.parse(item.result).category}</p>
<p>
  <strong>Time:</strong>{" "}
  {new Date(item.createdAt).toLocaleString()}
</p>
    </div>
  ))}
</section>
    </div>
  );
}

export default App;