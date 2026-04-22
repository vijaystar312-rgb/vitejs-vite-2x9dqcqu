import { useState, useEffect } from "react";

// ── DATA ────────────────────────────────────────────────────────────────────

const USERS = [
  { username: "captain",        password: "ship2024", name: "Capt. R. Santos",  role: "Captain",            dept: "deck",  initials: "RS" },
  { username: "chief.engineer", password: "ship2024", name: "C/E. J. Miller",   role: "Chief Engineer",     dept: "eng",   initials: "JM" },
  { username: "chief.officer",  password: "ship2024", name: "C/O. A. Patel",    role: "Chief Officer",      dept: "deck",  initials: "AP" },
  { username: "2nd.officer",    password: "ship2024", name: "2/O. S. Wang",     role: "2nd Officer",        dept: "deck",  initials: "SW" },
  { username: "3rd.officer",    password: "ship2024", name: "3/O. L. Cruz",     role: "3rd Officer",        dept: "deck",  initials: "LC" },
  { username: "2nd.engineer",   password: "ship2024", name: "2/E. K. Sharma",   role: "2nd Engineer",       dept: "eng",   initials: "KS" },
  { username: "3rd.engineer",   password: "ship2024", name: "3/E. M. Reyes",    role: "3rd Engineer",       dept: "eng",   initials: "MR" },
  { username: "4th.engineer",   password: "ship2024", name: "4/E. T. Nguyen",   role: "4th Engineer",       dept: "eng",   initials: "TN" },
  { username: "eto",            password: "ship2024", name: "ETO. P. Okafor",   role: "Electro Tech Officer",dept: "elec", initials: "PO" },
  { username: "superintendent", password: "ship2024", name: "Supt. D. Clarke",  role: "Shore Superintendent",dept: "shore",initials: "DC" },
];

const CAN_SCAN    = ["chief.engineer","chief.officer","2nd.engineer","3rd.engineer","4th.engineer","eto"];
const CAN_RAISE   = ["chief.engineer","chief.officer","2nd.engineer","3rd.engineer","4th.engineer","eto"];
const CAN_APPROVE = ["chief.engineer","superintendent"];
const CAN_EDIT    = ["chief.engineer","superintendent","eto"];

const CATEGORIES = [
  { code:"A", label:"Main Engine & Propulsion",    icon:"⚙️",  color:"#e05c2a" },
  { code:"B", label:"Auxiliary Machinery",         icon:"🔧",  color:"#2a7ae0" },
  { code:"C", label:"Electrical & Automation",     icon:"⚡",  color:"#e0b92a" },
  { code:"D", label:"Deck Machinery",              icon:"⚓",  color:"#2ae07a" },
  { code:"E", label:"Safety & Lifesaving",         icon:"🛟",  color:"#e02a2a" },
  { code:"F", label:"Navigation & Bridge",         icon:"🧭",  color:"#2ae0d4" },
  { code:"G", label:"Piping & Valve Systems",      icon:"🛢️",  color:"#9b2ae0" },
  { code:"H", label:"Hull & Structure",            icon:"🚢",  color:"#2a5fe0" },
  { code:"I", label:"Consumables & General Stores",icon:"🧰",  color:"#e07a2a" },
  { code:"J", label:"Medical & Safety Stores",     icon:"🏥",  color:"#2ae055" },
];

const LOCATIONS = ["Engine Room L1","Engine Room L2","Deck Store","Bridge Store","Safety Locker","Electrical Panel Room","Pump Room","Bosun Store","Hospital","Cargo Hold"];

const SEED_PARTS = [
  { id:1,  cat:"A", partNo:"ME-22104-X", rfid:"RFID-9921", name:"Cylinder Liner Seal Ring",      qty:12, min:5,  loc:"Shelf A-14, ER1",    received:"2023.10.12", officer:"JM", status:"ok" },
  { id:2,  cat:"A", partNo:"ME-88219-A", rfid:"RFID-8812", name:"Main Bearing Shell (Upper)",     qty:2,  min:4,  loc:"Secured Locker B2",   received:"2023.11.05", officer:"SW", status:"critical" },
  { id:3,  cat:"A", partNo:"ME-44012-P", rfid:"RFID-4421", name:"Fuel Injector Nozzle",           qty:48, min:10, loc:"Shelf C-02, ER1",     received:"2023.09.28", officer:"JM", status:"ok" },
  { id:4,  cat:"A", partNo:"ME-10293-S", rfid:"RFID-1029", name:"Turbocharger Thrust Pad",        qty:4,  min:6,  loc:"Cabinet 4, ER2",      received:"2023.12.01", officer:"SW", status:"low" },
  { id:5,  cat:"A", partNo:"ME-55301-T", rfid:"RFID-5530", name:"Exhaust Valve Seat",             qty:18, min:8,  loc:"Shelf B-01, ER1",     received:"2024.01.10", officer:"JM", status:"ok" },
  { id:6,  cat:"B", partNo:"AX-10021-G", rfid:"RFID-1002", name:"Aux Engine Piston Ring Set",     qty:6,  min:4,  loc:"Engine Room L2",      received:"2024.01.15", officer:"KS", status:"ok" },
  { id:7,  cat:"B", partNo:"AX-20045-H", rfid:"RFID-2004", name:"Air Compressor Valve Plate",     qty:3,  min:5,  loc:"Aux Machinery Room",  received:"2023.11.20", officer:"MR", status:"low" },
  { id:8,  cat:"B", partNo:"AX-30088-J", rfid:"RFID-3008", name:"Purifier Disc Stack",            qty:1,  min:2,  loc:"Purifier Room",       received:"2023.10.05", officer:"TN", status:"critical" },
  { id:9,  cat:"C", partNo:"EL-10033-K", rfid:"RFID-1003", name:"Circuit Breaker 400A",           qty:4,  min:2,  loc:"Electrical Panel Room",received:"2024.02.01", officer:"PO", status:"ok" },
  { id:10, cat:"C", partNo:"EL-20019-L", rfid:"RFID-2001", name:"Motor Starter Control Card",     qty:2,  min:3,  loc:"Electrical Panel Room",received:"2023.12.15", officer:"PO", status:"low" },
  { id:11, cat:"D", partNo:"DK-10055-M", rfid:"RFID-1005", name:"Mooring Winch Brake Lining",     qty:8,  min:4,  loc:"Deck Store",          received:"2024.01.20", officer:"AP", status:"ok" },
  { id:12, cat:"D", partNo:"DK-20077-N", rfid:"RFID-2007", name:"Hatch Cover Sealing Rubber",     qty:15, min:10, loc:"Bosun Store",          received:"2023.11.10", officer:"AP", status:"ok" },
  { id:13, cat:"E", partNo:"SF-10011-O", rfid:"RFID-1001", name:"Fire Pump Impeller",             qty:1,  min:2,  loc:"Safety Locker",        received:"2023.09.15", officer:"AP", status:"critical" },
  { id:14, cat:"E", partNo:"SF-20033-P", rfid:"RFID-2003", name:"SCBA Cylinder 6L",               qty:4,  min:4,  loc:"Safety Locker",        received:"2024.01.05", officer:"LC", status:"ok" },
  { id:15, cat:"F", partNo:"NV-10044-Q", rfid:"RFID-1004", name:"Radar Scanner Motor Bearing",    qty:2,  min:2,  loc:"Bridge Store",         received:"2023.12.20", officer:"PO", status:"ok" },
  { id:16, cat:"F", partNo:"NV-20066-R", rfid:"RFID-2006", name:"GPS Antenna Connector",          qty:3,  min:2,  loc:"Bridge Store",         received:"2024.02.10", officer:"SW", status:"ok" },
  { id:17, cat:"G", partNo:"PV-10022-S", rfid:"RFID-1002", name:"Butterfly Valve Disc 150mm",     qty:6,  min:4,  loc:"Pump Room",            received:"2023.10.28", officer:"MR", status:"ok" },
  { id:18, cat:"G", partNo:"PV-20044-T", rfid:"RFID-2004", name:"Bilge Pump Mechanical Seal",     qty:2,  min:3,  loc:"Pump Room",            received:"2023.11.15", officer:"TN", status:"low" },
  { id:19, cat:"H", partNo:"HL-10033-U", rfid:"RFID-1003", name:"Zinc Anode Hull Type A",         qty:24, min:12, loc:"Bosun Store",          received:"2024.01.25", officer:"AP", status:"ok" },
  { id:20, cat:"H", partNo:"HL-20055-V", rfid:"RFID-2005", name:"Stern Tube Seal Assembly",       qty:1,  min:2,  loc:"Engine Room L2",       received:"2023.12.05", officer:"JM", status:"critical" },
  { id:21, cat:"I", partNo:"CS-10011-W", rfid:"RFID-1001", name:"Oil Filter (Main Engine)",       qty:30, min:15, loc:"Engine Room L1",       received:"2024.02.05", officer:"KS", status:"ok" },
  { id:22, cat:"I", partNo:"CS-20033-X", rfid:"RFID-2003", name:"Hydraulic Hose 1/2 inch",        qty:10, min:8,  loc:"Deck Store",           received:"2024.01.30", officer:"MR", status:"ok" },
  { id:23, cat:"J", partNo:"MD-10022-Y", rfid:"RFID-1002", name:"First Aid Kit Restock Pack",     qty:3,  min:2,  loc:"Hospital",             received:"2024.01.12", officer:"AP", status:"ok" },
  { id:24, cat:"J", partNo:"MD-20011-Z", rfid:"RFID-2001", name:"Oxygen Cylinder Mask Assembly",  qty:2,  min:3,  loc:"Hospital",             received:"2023.12.28", officer:"LC", status:"low" },
];

const SEED_REQS = [
  { id:1, partNo:"ME-88219-A", name:"Main Bearing Shell (Upper)", qty:4, cat:"A", raisedBy:"JM", raisedOn:"2024.02.10", status:"pending",  note:"Critical — below min stock" },
  { id:2, partNo:"AX-30088-J", name:"Purifier Disc Stack",        qty:2, cat:"B", raisedBy:"TN", raisedOn:"2024.02.08", status:"approved", note:"Required for PMS job #221" },
  { id:3, partNo:"SF-10011-O", name:"Fire Pump Impeller",         qty:2, cat:"E", raisedBy:"AP", raisedOn:"2024.02.09", status:"pending",  note:"Safety critical — urgent" },
];

const SEED_LOG = [
  { id:1, ts:"2024.02.12 08:14", rfid:"RFID-9921", partNo:"ME-22104-X", name:"Cylinder Liner Seal Ring",   action:"CHECK OUT", qty:2, user:"JM", loc:"Engine Room L1" },
  { id:2, ts:"2024.02.11 14:32", rfid:"RFID-4421", partNo:"ME-44012-P", name:"Fuel Injector Nozzle",       action:"CHECK IN",  qty:6, user:"KS", loc:"Shelf C-02, ER1" },
  { id:3, ts:"2024.02.11 09:05", rfid:"RFID-1001", partNo:"SF-10011-O", name:"Fire Pump Impeller",         action:"CHECK OUT", qty:1, user:"AP", loc:"Safety Locker" },
  { id:4, ts:"2024.02.10 16:48", rfid:"RFID-3008", partNo:"AX-30088-J", name:"Purifier Disc Stack",        action:"CHECK OUT", qty:1, user:"MR", loc:"Purifier Room" },
  { id:5, ts:"2024.02.10 11:20", rfid:"RFID-2005", partNo:"HL-20055-V", name:"Stern Tube Seal Assembly",   action:"CHECK IN",  qty:1, user:"JM", loc:"Engine Room L2" },
];

// ── HELPERS ──────────────────────────────────────────────────────────────────

const getUserByInitials = (init) => USERS.find(u => u.initials === init);
const getCat = (code) => CATEGORIES.find(c => c.code === code);
const statusColor = { ok:"#2ae07a", low:"#e0b92a", critical:"#e02a2a" };
const statusBg    = { ok:"rgba(42,224,122,0.12)", low:"rgba(224,185,42,0.12)", critical:"rgba(224,42,42,0.12)" };

function getStatus(qty, min) {
  if (qty === 0 || qty < min) return "critical";
  if (qty <= min * 1.5) return "low";
  return "ok";
}

// ── COMPONENTS ───────────────────────────────────────────────────────────────

function Avatar({ initials, size = 30 }) {
  const colors = { JM:"#e05c2a", SW:"#2a7ae0", KS:"#9b2ae0", MR:"#2ae0d4", TN:"#e0b92a", AP:"#2ae07a", PO:"#e02a2a", LC:"#2a5fe0", RS:"#e07a2a", DC:"#2ae055" };
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:colors[initials]||"#555", display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.36, fontWeight:700, color:"#fff", flexShrink:0 }}>
      {initials}
    </div>
  );
}

function Badge({ status }) {
  return (
    <span style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:statusBg[status], color:statusColor[status], fontWeight:600, textTransform:"uppercase", letterSpacing:"0.5px" }}>
      {status === "critical" ? "🔴 Critical" : status === "low" ? "🟡 Low" : "🟢 OK"}
    </span>
  );
}

function StatCard({ label, value, sub, subColor, highlight }) {
  return (
    <div style={{ background: highlight ? "#7a2000" : "var(--card)", border:`1px solid ${highlight ? "#c03000" : "var(--border)"}`, borderRadius:12, padding:"20px 24px", flex:1, minWidth:180 }}>
      <div style={{ fontSize:11, color: highlight ? "#ffaa88" : "var(--muted)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:8 }}>{label}</div>
      <div style={{ fontFamily:"'Barlow Condensed', sans-serif", fontSize:42, fontWeight:700, color: highlight ? "#ff6030" : "var(--text)", lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:12, marginTop:8, color: highlight ? "#ffaa88" : "var(--muted)", display:"flex", alignItems:"center", gap:6 }}>
        {subColor && <span style={{ background:subColor, color:"#fff", padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:600 }}>{sub}</span>}
        {!subColor && sub}
      </div>}
    </div>
  );
}

// ── LOGIN ────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }) {
  const [un, setUn] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = () => {
    const user = USERS.find(u => u.username === un.trim().toLowerCase() && u.password === pw);
    if (user) { setErr(""); onLogin(user); }
    else setErr("Invalid credentials. Check username & password.");
  };

  return (
    <div style={{ minHeight:"100vh", background:"#040810", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@400;600;700&display=swap');`}</style>
      <div style={{ width:400, background:"#0a1020", border:"1px solid #1a2540", borderRadius:16, padding:40, boxShadow:"0 30px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:40, marginBottom:8 }}>⚓</div>
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:22, fontWeight:700, color:"#e8f0ff", letterSpacing:"2px", textTransform:"uppercase" }}>Maritime RFID</div>
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:13, color:"#4a6080", letterSpacing:"3px", textTransform:"uppercase" }}>Inventory System</div>
          <div style={{ marginTop:8, fontSize:12, color:"#2a4a6a", background:"#0d1828", padding:"4px 12px", borderRadius:20, display:"inline-block" }}>MV VESSEL ALPHA-7 · BULK CARRIER</div>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:11, color:"#4a6080", textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:6 }}>Username</label>
          <input value={un} onChange={e=>setUn(e.target.value)} placeholder="e.g. chief.engineer"
            style={{ width:"100%", background:"#0d1828", border:"1px solid #1a2540", borderRadius:8, padding:"10px 14px", color:"#e8f0ff", fontFamily:"inherit", fontSize:14, outline:"none", boxSizing:"border-box" }}
            onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:11, color:"#4a6080", textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:6 }}>Password</label>
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••"
            style={{ width:"100%", background:"#0d1828", border:"1px solid #1a2540", borderRadius:8, padding:"10px 14px", color:"#e8f0ff", fontFamily:"inherit", fontSize:14, outline:"none", boxSizing:"border-box" }}
            onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
        </div>
        {err && <div style={{ background:"rgba(224,42,42,0.12)", border:"1px solid rgba(224,42,42,0.3)", color:"#e07070", borderRadius:8, padding:"10px 14px", fontSize:13, marginBottom:16 }}>{err}</div>}
        <button onClick={handleLogin} style={{ width:"100%", background:"#e05c2a", border:"none", borderRadius:8, padding:"12px", color:"#fff", fontFamily:"'Barlow Condensed'", fontSize:16, fontWeight:700, letterSpacing:"1px", cursor:"pointer", textTransform:"uppercase" }}>
          Board System
        </button>
        <div style={{ marginTop:20, fontSize:11, color:"#2a3a50", textAlign:"center" }}>
          Roles: captain · chief.engineer · chief.officer · 2nd/3rd.officer<br/>2nd/3rd/4th.engineer · eto · superintendent<br/>
          <span style={{ color:"#1a2a40" }}>Password: ship2024</span>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [parts, setParts] = useState(SEED_PARTS);
  const [reqs, setReqs] = useState(SEED_REQS);
  const [log, setLog] = useState(SEED_LOG);
  const [activeCat, setActiveCat] = useState("A");
  const [search, setSearch] = useState("");
  const [rfidInput, setRfidInput] = useState("");
  const [rfidResult, setRfidResult] = useState(null);
  const [scanMode, setScanMode] = useState("out");
  const [showAddPart, setShowAddPart] = useState(false);
  const [newPart, setNewPart] = useState({ cat:"A", partNo:"", rfid:"", name:"", qty:0, min:1, loc:"Engine Room L1" });
  const [reqForm, setReqForm] = useState({ partNo:"", name:"", qty:1, cat:"A", note:"" });
  const [showReqForm, setShowReqForm] = useState(false);

  if (!user) return <LoginScreen onLogin={setUser} />;

  const canScan    = CAN_SCAN.includes(user.username);
  const canRaise   = CAN_RAISE.includes(user.username);
  const canApprove = CAN_APPROVE.includes(user.username);
  const canEdit    = CAN_EDIT.includes(user.username);

  const criticals = parts.filter(p => getStatus(p.qty, p.min) === "critical").length;
  const lows      = parts.filter(p => getStatus(p.qty, p.min) === "low").length;
  const catParts  = parts.filter(p => p.cat === activeCat && (search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.partNo.toLowerCase().includes(search.toLowerCase()) || p.rfid.toLowerCase().includes(search.toLowerCase())));

  const handleRfidScan = () => {
    const part = parts.find(p => p.rfid.toLowerCase() === rfidInput.toLowerCase() || p.partNo.toLowerCase() === rfidInput.toLowerCase());
    if (!part) { setRfidResult({ error: `No part found for tag: ${rfidInput}` }); return; }
    setRfidResult({ part, mode: scanMode });
  };

  const confirmScan = () => {
    if (!rfidResult?.part) return;
    const p = rfidResult.part;
    const delta = scanMode === "out" ? -1 : 1;
    setParts(prev => prev.map(x => x.id === p.id ? { ...x, qty: Math.max(0, x.qty + delta) } : x));
    const entry = { id: Date.now(), ts: new Date().toISOString().slice(0,16).replace("T"," "), rfid: p.rfid, partNo: p.partNo, name: p.name, action: scanMode === "out" ? "CHECK OUT" : "CHECK IN", qty:1, user: user.initials, loc: p.loc };
    setLog(prev => [entry, ...prev]);
    setRfidResult(null); setRfidInput("");
  };

  const addPart = () => {
    if (!newPart.partNo || !newPart.name || !newPart.rfid) return;
    setParts(prev => [...prev, { ...newPart, id: Date.now(), status: getStatus(newPart.qty, newPart.min), officer: user.initials, received: new Date().toISOString().slice(0,10).replace(/-/g,".") }]);
    setShowAddPart(false);
    setNewPart({ cat:"A", partNo:"", rfid:"", name:"", qty:0, min:1, loc:"Engine Room L1" });
  };

  const raiseReq = () => {
    if (!reqForm.partNo || !reqForm.name) return;
    setReqs(prev => [...prev, { id: Date.now(), ...reqForm, raisedBy: user.initials, raisedOn: new Date().toISOString().slice(0,10).replace(/-/g,"."), status:"pending" }]);
    setShowReqForm(false);
    setReqForm({ partNo:"", name:"", qty:1, cat:"A", note:"" });
  };

  const approveReq = (id) => setReqs(prev => prev.map(r => r.id === id ? { ...r, status:"approved" } : r));

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@400;600;700&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    :root {
      --bg:#040810; --sidebar:#070e1c; --card:#0a1220; --border:#142035;
      --text:#d8e8ff; --muted:#4a6080; --accent:#e05c2a; --accent2:#2a7ae0;
      --font:'Barlow', sans-serif; --fontc:'Barlow Condensed', sans-serif;
    }
    body { background:var(--bg); color:var(--text); font-family:var(--font); }
    ::-webkit-scrollbar { width:4px; height:4px; } ::-webkit-scrollbar-track { background:#0a1220; } ::-webkit-scrollbar-thumb { background:#1a2540; border-radius:4px; }
    .nav-item { display:flex; align-items:center; gap:10px; padding:10px 16px; border-radius:8px; cursor:pointer; font-size:13px; color:var(--muted); transition:all 0.2s; border:none; background:none; width:100%; text-align:left; font-family:var(--font); }
    .nav-item:hover { background:#0d1828; color:var(--text); }
    .nav-item.active { background:#0d1828; color:var(--accent); border-left:2px solid var(--accent); }
    .cat-chip { padding:7px 14px; border-radius:8px; border:1px solid var(--border); cursor:pointer; font-size:12px; background:var(--card); color:var(--muted); transition:all 0.2s; white-space:nowrap; font-family:var(--font); }
    .cat-chip.active { border-color:var(--accent); color:var(--accent); background:rgba(224,92,42,0.1); }
    .cat-chip:hover:not(.active) { border-color:#1a2540; color:var(--text); }
    .btn-primary { background:var(--accent); color:#fff; border:none; border-radius:8px; padding:9px 18px; font-family:var(--fontc); font-size:14px; font-weight:600; cursor:pointer; letter-spacing:0.5px; text-transform:uppercase; transition:opacity 0.2s; }
    .btn-primary:hover { opacity:0.85; }
    .btn-secondary { background:transparent; color:var(--text); border:1px solid var(--border); border-radius:8px; padding:9px 18px; font-family:var(--fontc); font-size:14px; cursor:pointer; letter-spacing:0.5px; text-transform:uppercase; transition:all 0.2s; }
    .btn-secondary:hover { border-color:var(--accent2); color:var(--accent2); }
    .btn-sm { padding:5px 12px; font-size:12px; border-radius:6px; }
    .input { background:#0d1828; border:1px solid var(--border); border-radius:8px; padding:9px 13px; color:var(--text); font-family:var(--font); font-size:13px; outline:none; transition:border-color 0.2s; width:100%; }
    .input:focus { border-color:var(--accent2); }
    .select { background:#0d1828; border:1px solid var(--border); border-radius:8px; padding:9px 13px; color:var(--text); font-family:var(--font); font-size:13px; outline:none; cursor:pointer; width:100%; }
    table { width:100%; border-collapse:collapse; }
    th { font-size:11px; text-transform:uppercase; letter-spacing:1px; color:var(--muted); padding:10px 14px; border-bottom:1px solid var(--border); text-align:left; font-weight:500; }
    td { padding:13px 14px; border-bottom:1px solid #0d1828; font-size:13px; vertical-align:middle; }
    tr:last-child td { border-bottom:none; }
    tr:hover td { background:#0d1828; }
    .modal-bg { position:fixed; inset:0; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:100; }
    .modal { background:#0a1220; border:1px solid var(--border); border-radius:16px; padding:32px; width:500px; max-width:95vw; }
    @keyframes fadeIn { from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)} }
    .fade-in { animation:fadeIn 0.25s ease forwards; }
  `;

  const catStats = CATEGORIES.map(c => {
    const cp = parts.filter(p => p.cat === c.code);
    const crit = cp.filter(p => getStatus(p.qty, p.min) === "critical").length;
    const low  = cp.filter(p => getStatus(p.qty, p.min) === "low").length;
    const health = crit > 0 ? "critical" : low > 0 ? "low" : "ok";
    return { ...c, total: cp.length, crit, low, health };
  });

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"var(--font)" }}>
      <style>{css}</style>

      {/* SIDEBAR */}
      <div style={{ width:220, background:"var(--sidebar)", borderRight:"1px solid var(--border)", display:"flex", flexDirection:"column", flexShrink:0, overflow:"auto" }}>
        <div style={{ padding:"20px 16px", borderBottom:"1px solid var(--border)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>⚓</div>
            <div>
              <div style={{ fontFamily:"var(--fontc)", fontSize:14, fontWeight:700, letterSpacing:"1px" }}>MARITIME RFID</div>
              <div style={{ fontFamily:"var(--fontc)", fontSize:10, color:"var(--muted)", letterSpacing:"2px" }}>INVENTORY</div>
            </div>
          </div>
          <div style={{ fontSize:10, color:"#1a3050", marginTop:6, fontFamily:"var(--fontc)", letterSpacing:"1px" }}>VESSEL ALPHA-7 · BULK CARRIER</div>
        </div>

        <div style={{ padding:"12px 8px", flex:1 }}>
          <div style={{ fontSize:10, color:"var(--muted)", padding:"4px 12px", letterSpacing:"1.5px", marginBottom:4, textTransform:"uppercase" }}>Navigation</div>
          {[
            { id:"dashboard", icon:"📊", label:"Dashboard" },
            { id:"inventory", icon:"📦", label:"Inventory" },
            { id:"scan",      icon:"📡", label:"RFID Scanner", restricted: !canScan },
            { id:"requisitions", icon:"📋", label:"Requisitions" },
            { id:"logbook",   icon:"📒", label:"Log Book" },
          ].filter(n => !n.restricted).map(n => (
            <button key={n.id} className={`nav-item ${page===n.id?"active":""}`} onClick={() => setPage(n.id)}>
              <span>{n.icon}</span> {n.label}
              {n.id==="scan" && criticals > 0 && <span style={{ marginLeft:"auto", background:"#e02a2a", color:"#fff", fontSize:10, padding:"1px 6px", borderRadius:10 }}>{criticals}</span>}
            </button>
          ))}

          <div style={{ fontSize:10, color:"var(--muted)", padding:"12px 12px 4px", letterSpacing:"1.5px", textTransform:"uppercase" }}>Categories</div>
          {CATEGORIES.map(c => (
            <button key={c.code} className={`nav-item ${page==="inventory"&&activeCat===c.code?"active":""}`}
              onClick={() => { setActiveCat(c.code); setPage("inventory"); }}>
              <span>{c.icon}</span>
              <span style={{ fontSize:12 }}>{c.label.length > 20 ? c.label.slice(0,20)+"…" : c.label}</span>
              {catStats.find(x=>x.code===c.code)?.health !== "ok" && (
                <span style={{ marginLeft:"auto", width:8, height:8, borderRadius:"50%", background: catStats.find(x=>x.code===c.code)?.health==="critical"?"#e02a2a":"#e0b92a", flexShrink:0 }} />
              )}
            </button>
          ))}
        </div>

        <div style={{ padding:"12px 16px", borderTop:"1px solid var(--border)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <Avatar initials={user.initials} size={32} />
            <div>
              <div style={{ fontSize:12, fontWeight:600 }}>{user.name.split(" ").slice(-1)[0]}</div>
              <div style={{ fontSize:10, color:"var(--muted)" }}>{user.role}</div>
            </div>
          </div>
          <button className="btn-secondary btn-sm" style={{ width:"100%", fontSize:11 }} onClick={() => setUser(null)}>Sign Out</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* TOPBAR */}
        <div style={{ height:56, borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", padding:"0 24px", gap:16, flexShrink:0 }}>
          <div style={{ fontFamily:"var(--fontc)", fontSize:18, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:"var(--text)" }}>
            {page === "dashboard" ? "Dashboard" : page === "inventory" ? `${getCat(activeCat)?.icon} ${getCat(activeCat)?.label}` : page === "scan" ? "RFID Scanner" : page === "requisitions" ? "Requisitions" : "Log Book"}
          </div>
          <div style={{ flex:1 }} />
          {(page === "dashboard" || page === "inventory") && (
            <div style={{ display:"flex", alignItems:"center", gap:8, background:"#0a1220", border:"1px solid var(--border)", borderRadius:8, padding:"6px 12px" }}>
              <span style={{ color:"var(--muted)", fontSize:14 }}>🔍</span>
              <input className="input" style={{ border:"none", background:"transparent", padding:0, width:200 }} placeholder="Search parts…" value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
          )}
          <div style={{ fontSize:11, color:"var(--muted)", background:"#0a1220", border:"1px solid var(--border)", borderRadius:8, padding:"6px 12px" }}>
            🟢 SYSTEM ONLINE · LAST SYNC 14:02 GMT
          </div>
          <Avatar initials={user.initials} size={34} />
        </div>

        {/* PAGE CONTENT */}
        <div style={{ flex:1, overflow:"auto", padding:24 }} className="fade-in" key={page+activeCat}>

          {/* ── DASHBOARD ── */}
          {page === "dashboard" && (
            <div>
              <div style={{ display:"flex", gap:16, marginBottom:24, flexWrap:"wrap" }}>
                <StatCard label="Total Parts" value={parts.length.toLocaleString()} sub="+2.4% vs LY" subColor="#2a7ae0" />
                <StatCard label="Consumed Parts" value={log.filter(l=>l.action==="CHECK OUT").length} sub="Last 30 days cycle" />
                <StatCard label="New Parts" value="156" sub="Arriving Singapore" subColor="#2ae07a" />
                <StatCard label="Low Critical" value={criticals} sub="URGENT RESTOCK" subColor="#e02a2a" highlight />
              </div>

              <div style={{ fontFamily:"var(--fontc)", fontSize:16, fontWeight:700, letterSpacing:"1px", marginBottom:16, textTransform:"uppercase" }}>Category Overview</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:12, marginBottom:28 }}>
                {catStats.map(c => (
                  <div key={c.code} style={{ background:"var(--card)", border:`1px solid ${c.health==="critical"?"rgba(224,42,42,0.4)":c.health==="low"?"rgba(224,185,42,0.3)":"var(--border)"}`, borderRadius:12, padding:"16px", cursor:"pointer", transition:"border-color 0.2s" }}
                    onClick={() => { setActiveCat(c.code); setPage("inventory"); }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                      <span style={{ fontSize:22 }}>{c.icon}</span>
                      <Badge status={c.health} />
                    </div>
                    <div style={{ fontSize:11, color:"var(--muted)", letterSpacing:"0.5px", marginBottom:4 }}>Cat {c.code}</div>
                    <div style={{ fontFamily:"var(--fontc)", fontSize:13, fontWeight:600, marginBottom:8, lineHeight:1.3 }}>{c.label}</div>
                    <div style={{ fontFamily:"var(--fontc)", fontSize:26, fontWeight:700, color:c.color }}>{parts.filter(p=>p.cat===c.code).length}</div>
                    <div style={{ fontSize:11, color:"var(--muted)" }}>parts tracked</div>
                    {(c.crit > 0 || c.low > 0) && (
                      <div style={{ marginTop:8, fontSize:11, color:c.crit>0?"#e02a2a":"#e0b92a" }}>
                        {c.crit > 0 ? `${c.crit} critical` : `${c.low} low`}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ fontFamily:"var(--fontc)", fontSize:16, fontWeight:700, letterSpacing:"1px", marginBottom:12, textTransform:"uppercase" }}>Recent RFID Activity</div>
              <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
                <table>
                  <thead><tr><th>Timestamp</th><th>RFID Tag</th><th>Part Name</th><th>Action</th><th>Officer</th><th>Location</th></tr></thead>
                  <tbody>
                    {log.slice(0,5).map(l => {
                      const u = getUserByInitials(l.user);
                      return (
                        <tr key={l.id}>
                          <td style={{ color:"var(--muted)", fontSize:12 }}>{l.ts}</td>
                          <td><span style={{ background:"#0d1828", padding:"2px 8px", borderRadius:6, fontSize:11, color:"var(--accent2)" }}>{l.rfid}</span></td>
                          <td style={{ fontWeight:500 }}>{l.name}</td>
                          <td><span style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:l.action==="CHECK OUT"?"rgba(224,92,42,0.15)":"rgba(42,224,122,0.12)", color:l.action==="CHECK OUT"?"#e05c2a":"#2ae07a", fontWeight:600 }}>{l.action}</span></td>
                          <td><div style={{ display:"flex", alignItems:"center", gap:8 }}><Avatar initials={l.user} size={24} /><span style={{ fontSize:12 }}>{u?.name.split(" ").slice(-1)[0]}</span></div></td>
                          <td style={{ color:"var(--muted)", fontSize:12 }}>{l.loc}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── INVENTORY ── */}
          {page === "inventory" && (
            <div>
              <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
                {CATEGORIES.map(c => (
                  <button key={c.code} className={`cat-chip ${activeCat===c.code?"active":""}`} onClick={() => setActiveCat(c.code)}>
                    {c.icon} {c.code} — {c.label.split(" ").slice(0,2).join(" ")}
                  </button>
                ))}
              </div>

              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <div>
                  <div style={{ fontFamily:"var(--fontc)", fontSize:18, fontWeight:700 }}>{getCat(activeCat)?.icon} {getCat(activeCat)?.label} Inventory</div>
                  <div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>MV Vessel Alpha-7 · {catParts.length} parts</div>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <button className="btn-secondary btn-sm">Export CSV</button>
                  {canEdit && <button className="btn-primary btn-sm" onClick={()=>setShowAddPart(true)}>+ Add New Part</button>}
                </div>
              </div>

              <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
                <table>
                  <thead><tr><th>Part Number</th><th>Tag Number</th><th>Part Name</th><th>QTY</th><th>Stored Location</th><th>Received Date</th><th>Person In Charge</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {catParts.length === 0 && <tr><td colSpan={9} style={{ textAlign:"center", color:"var(--muted)", padding:40 }}>No parts found</td></tr>}
                    {catParts.map(p => {
                      const st = getStatus(p.qty, p.min);
                      const u = getUserByInitials(p.officer);
                      return (
                        <tr key={p.id}>
                          <td style={{ fontSize:12, color:"var(--muted)", fontFamily:"monospace" }}>{p.partNo}</td>
                          <td><span style={{ background:"#0d1828", padding:"2px 8px", borderRadius:6, fontSize:11, color:"var(--accent2)" }}>{p.rfid}</span></td>
                          <td style={{ fontWeight:500, color: st==="critical"?"#e07070": st==="low"?"#e0c070":"var(--text)" }}>{p.name}</td>
                          <td>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <span style={{ fontFamily:"var(--fontc)", fontSize:18, fontWeight:700 }}>{p.qty}</span>
                              <div style={{ width:40, height:4, borderRadius:2, background:"#142035", overflow:"hidden" }}>
                                <div style={{ height:"100%", borderRadius:2, width:`${Math.min(100,(p.qty/Math.max(p.min*2,1))*100)}%`, background:statusColor[st] }} />
                              </div>
                            </div>
                          </td>
                          <td style={{ fontSize:12, color:"var(--muted)" }}>{p.loc}</td>
                          <td style={{ fontSize:12, color:"var(--muted)" }}>{p.received}</td>
                          <td><div style={{ display:"flex", alignItems:"center", gap:8 }}><Avatar initials={p.officer} size={24} /><span style={{ fontSize:12 }}>{u?.name.split(" ").slice(-1)[0]||p.officer}</span></div></td>
                          <td><Badge status={st} /></td>
                          <td>
                            <button style={{ background:"none", border:"none", color:"var(--muted)", cursor:"pointer", fontSize:18, padding:"2px 6px" }}>⋯</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── RFID SCANNER ── */}
          {page === "scan" && (
            <div style={{ maxWidth:560 }}>
              <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, padding:28, marginBottom:20 }}>
                <div style={{ fontFamily:"var(--fontc)", fontSize:16, fontWeight:700, marginBottom:6, textTransform:"uppercase" }}>📡 RFID Tag Scanner</div>
                <div style={{ fontSize:12, color:"var(--muted)", marginBottom:20 }}>Enter RFID tag or Part Number to check in / check out</div>

                <div style={{ display:"flex", gap:10, marginBottom:16 }}>
                  {["out","in"].map(m => (
                    <button key={m} onClick={() => setScanMode(m)} style={{ flex:1, padding:"10px", borderRadius:8, border:`1px solid ${scanMode===m?(m==="out"?"var(--accent)":"#2ae07a"):"var(--border)"}`, background: scanMode===m?(m==="out"?"rgba(224,92,42,0.15)":"rgba(42,224,122,0.1)"):"transparent", color: scanMode===m?(m==="out"?"var(--accent)":"#2ae07a"):"var(--muted)", cursor:"pointer", fontFamily:"var(--fontc)", fontSize:14, fontWeight:600, textTransform:"uppercase" }}>
                      {m === "out" ? "⬆ Check Out" : "⬇ Check In"}
                    </button>
                  ))}
                </div>

                <div style={{ display:"flex", gap:10 }}>
                  <input className="input" placeholder="Scan RFID tag or enter Part No…" value={rfidInput} onChange={e=>setRfidInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleRfidScan()} style={{ flex:1 }} />
                  <button className="btn-primary" onClick={handleRfidScan}>Scan</button>
                </div>

                {rfidResult?.error && (
                  <div style={{ marginTop:16, background:"rgba(224,42,42,0.1)", border:"1px solid rgba(224,42,42,0.3)", borderRadius:8, padding:"12px 16px", color:"#e07070", fontSize:13 }}>{rfidResult.error}</div>
                )}

                {rfidResult?.part && (
                  <div style={{ marginTop:16, background:"#0d1828", border:"1px solid var(--accent2)", borderRadius:12, padding:20 }}>
                    <div style={{ fontFamily:"var(--fontc)", fontSize:14, fontWeight:700, marginBottom:12, color:"var(--accent2)", textTransform:"uppercase" }}>Part Found — Confirm {scanMode === "out" ? "Check Out" : "Check In"}</div>
                    {[["Part Number", rfidResult.part.partNo],["RFID Tag", rfidResult.part.rfid],["Name", rfidResult.part.name],["Current Qty", rfidResult.part.qty],["Location", rfidResult.part.loc]].map(([k,v]) => (
                      <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13 }}>
                        <span style={{ color:"var(--muted)" }}>{k}</span>
                        <span style={{ fontWeight:500 }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ display:"flex", gap:10, marginTop:16 }}>
                      <button className="btn-primary" style={{ flex:1 }} onClick={confirmScan}>✓ Confirm {scanMode === "out" ? "Check Out" : "Check In"}</button>
                      <button className="btn-secondary" onClick={() => setRfidResult(null)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ fontFamily:"var(--fontc)", fontSize:14, fontWeight:700, marginBottom:12, textTransform:"uppercase" }}>Recent Scans</div>
              <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
                <table>
                  <thead><tr><th>Time</th><th>RFID</th><th>Part</th><th>Action</th><th>By</th></tr></thead>
                  <tbody>
                    {log.slice(0,8).map(l => (
                      <tr key={l.id}>
                        <td style={{ fontSize:11, color:"var(--muted)" }}>{l.ts.slice(11)}</td>
                        <td style={{ fontSize:11, color:"var(--accent2)" }}>{l.rfid}</td>
                        <td style={{ fontSize:12 }}>{l.name}</td>
                        <td><span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:l.action==="CHECK OUT"?"rgba(224,92,42,0.15)":"rgba(42,224,122,0.12)", color:l.action==="CHECK OUT"?"#e05c2a":"#2ae07a" }}>{l.action}</span></td>
                        <td><Avatar initials={l.user} size={22} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── REQUISITIONS ── */}
          {page === "requisitions" && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                <div>
                  <div style={{ fontFamily:"var(--fontc)", fontSize:18, fontWeight:700 }}>Part Requisitions</div>
                  <div style={{ fontSize:12, color:"var(--muted)" }}>{reqs.filter(r=>r.status==="pending").length} pending approval</div>
                </div>
                {canRaise && <button className="btn-primary" onClick={()=>setShowReqForm(true)}>+ Raise Requisition</button>}
              </div>

              <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
                <table>
                  <thead><tr><th>Part No</th><th>Part Name</th><th>Category</th><th>Qty</th><th>Raised By</th><th>Date</th><th>Note</th><th>Status</th>{canApprove&&<th>Action</th>}</tr></thead>
                  <tbody>
                    {reqs.map(r => {
                      const u = getUserByInitials(r.raisedBy);
                      return (
                        <tr key={r.id}>
                          <td style={{ fontSize:12, color:"var(--muted)", fontFamily:"monospace" }}>{r.partNo}</td>
                          <td style={{ fontWeight:500 }}>{r.name}</td>
                          <td><span style={{ fontSize:11, color:getCat(r.cat)?.color }}>Cat {r.cat}</span></td>
                          <td style={{ fontFamily:"var(--fontc)", fontSize:18, fontWeight:700 }}>{r.qty}</td>
                          <td><div style={{ display:"flex", alignItems:"center", gap:8 }}><Avatar initials={r.raisedBy} size={24} /><span style={{ fontSize:12 }}>{u?.role.split(" ")[0]}</span></div></td>
                          <td style={{ fontSize:12, color:"var(--muted)" }}>{r.raisedOn}</td>
                          <td style={{ fontSize:12, color:"var(--muted)", maxWidth:160 }}>{r.note}</td>
                          <td>
                            <span style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:r.status==="approved"?"rgba(42,224,122,0.12)":"rgba(224,185,42,0.12)", color:r.status==="approved"?"#2ae07a":"#e0b92a", fontWeight:600, textTransform:"uppercase" }}>
                              {r.status}
                            </span>
                          </td>
                          {canApprove && <td>{r.status==="pending"&&<button className="btn-primary btn-sm" onClick={()=>approveReq(r.id)}>Approve</button>}</td>}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── LOGBOOK ── */}
          {page === "logbook" && (
            <div>
              <div style={{ fontFamily:"var(--fontc)", fontSize:18, fontWeight:700, marginBottom:16 }}>RFID Movement Log</div>
              <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
                <table>
                  <thead><tr><th>Timestamp</th><th>RFID Tag</th><th>Part Number</th><th>Part Name</th><th>Action</th><th>Qty</th><th>Officer</th><th>Location</th></tr></thead>
                  <tbody>
                    {log.map(l => {
                      const u = getUserByInitials(l.user);
                      return (
                        <tr key={l.id}>
                          <td style={{ fontSize:12, color:"var(--muted)" }}>{l.ts}</td>
                          <td><span style={{ background:"#0d1828", padding:"2px 8px", borderRadius:6, fontSize:11, color:"var(--accent2)" }}>{l.rfid}</span></td>
                          <td style={{ fontSize:12, color:"var(--muted)", fontFamily:"monospace" }}>{l.partNo}</td>
                          <td style={{ fontWeight:500 }}>{l.name}</td>
                          <td><span style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:l.action==="CHECK OUT"?"rgba(224,92,42,0.15)":"rgba(42,224,122,0.12)", color:l.action==="CHECK OUT"?"#e05c2a":"#2ae07a", fontWeight:600 }}>{l.action}</span></td>
                          <td style={{ fontFamily:"var(--fontc)", fontSize:18, fontWeight:700 }}>{l.qty}</td>
                          <td><div style={{ display:"flex", alignItems:"center", gap:8 }}><Avatar initials={l.user} size={24} /><span style={{ fontSize:12 }}>{u?.name.split(" ").slice(-1)[0]||l.user}</span></div></td>
                          <td style={{ fontSize:12, color:"var(--muted)" }}>{l.loc}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* STATUS BAR */}
        <div style={{ height:36, borderTop:"1px solid var(--border)", background:"#040810", display:"flex", alignItems:"center", padding:"0 20px", gap:24, fontSize:11, color:"var(--muted)", flexShrink:0 }}>
          <span>🟢 SYSTEM ONLINE · NODE-ALPHA-7</span>
          <span>PORT OF ROTTERDAM</span>
          <span>NETHERLANDS (NL)</span>
          <span style={{ marginLeft:"auto", color:"#2ae07a" }}>SECURE MARITIME PROTOCOL 2.4</span>
          <span>LAST SYNC: {new Date().toTimeString().slice(0,8)} GMT</span>
        </div>
      </div>

      {/* ── MODALS ── */}
      {showAddPart && (
        <div className="modal-bg" onClick={()=>setShowAddPart(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{ fontFamily:"var(--fontc)", fontSize:18, fontWeight:700, marginBottom:20, textTransform:"uppercase" }}>Add New Part</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[["Part Number","partNo"],["RFID Tag","rfid"],["Part Name","name"]].map(([l,k])=>(
                <div key={k} style={{ gridColumn: k==="name"?"span 2":"auto" }}>
                  <label style={{ fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:5 }}>{l}</label>
                  <input className="input" value={newPart[k]} onChange={e=>setNewPart(p=>({...p,[k]:e.target.value}))} />
                </div>
              ))}
              <div>
                <label style={{ fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:5 }}>Category</label>
                <select className="select" value={newPart.cat} onChange={e=>setNewPart(p=>({...p,cat:e.target.value}))}>
                  {CATEGORIES.map(c=><option key={c.code} value={c.code}>{c.code} — {c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:5 }}>Location</label>
                <select className="select" value={newPart.loc} onChange={e=>setNewPart(p=>({...p,loc:e.target.value}))}>
                  {LOCATIONS.map(l=><option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:5 }}>Quantity</label>
                <input className="input" type="number" value={newPart.qty} onChange={e=>setNewPart(p=>({...p,qty:+e.target.value}))} />
              </div>
              <div>
                <label style={{ fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:5 }}>Min Stock</label>
                <input className="input" type="number" value={newPart.min} onChange={e=>setNewPart(p=>({...p,min:+e.target.value}))} />
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:24 }}>
              <button className="btn-primary" style={{ flex:1 }} onClick={addPart}>Add Part</button>
              <button className="btn-secondary" onClick={()=>setShowAddPart(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showReqForm && (
        <div className="modal-bg" onClick={()=>setShowReqForm(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{ fontFamily:"var(--fontc)", fontSize:18, fontWeight:700, marginBottom:20, textTransform:"uppercase" }}>Raise Part Requisition</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[["Part Number","partNo"],["Part Name","name"]].map(([l,k])=>(
                <div key={k} style={{ gridColumn:"span 2" }}>
                  <label style={{ fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:5 }}>{l}</label>
                  <input className="input" value={reqForm[k]} onChange={e=>setReqForm(p=>({...p,[k]:e.target.value}))} />
                </div>
              ))}
              <div>
                <label style={{ fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:5 }}>Category</label>
                <select className="select" value={reqForm.cat} onChange={e=>setReqForm(p=>({...p,cat:e.target.value}))}>
                  {CATEGORIES.map(c=><option key={c.code} value={c.code}>{c.code} — {c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:5 }}>Quantity Needed</label>
                <input className="input" type="number" value={reqForm.qty} onChange={e=>setReqForm(p=>({...p,qty:+e.target.value}))} />
              </div>
              <div style={{ gridColumn:"span 2" }}>
                <label style={{ fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:5 }}>Note / Reason</label>
                <input className="input" value={reqForm.note} onChange={e=>setReqForm(p=>({...p,note:e.target.value}))} placeholder="e.g. Required for PMS job #221" />
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:24 }}>
              <button className="btn-primary" style={{ flex:1 }} onClick={raiseReq}>Submit Requisition</button>
              <button className="btn-secondary" onClick={()=>setShowReqForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
