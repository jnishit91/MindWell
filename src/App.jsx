import { useState, useEffect, useRef } from "react";

/* ─── GLOBAL CSS ───────────────────────────────────────────────── */
const GCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
  ::-webkit-scrollbar{display:none;}
  body,input,textarea,button,select{font-family:'Nunito',sans-serif;}
  textarea{resize:none;}
  input::placeholder,textarea::placeholder{color:#B5A8C0;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
  @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
  @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.4);opacity:0}}
  .hvr{transition:transform 0.18s ease,box-shadow 0.18s ease;}
  .hvr:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(99,74,150,0.15);}
`;

/* ─── DESIGN TOKENS ─────────────────────────────────────────────── */
const T = {
  sky:"#5B8DEF", mint:"#4ECDC4", lavender:"#9B7FD4", coral:"#FF6B6B",
  gold:"#F7B731", green:"#26de81", dark:"#1A1035", text:"#2D2048",
  sub:"#7B6EA0", border:"#E8E0F5", bg:"#F7F4FE", white:"#FFFFFF",
  card:"#FFFFFF", grad1:"linear-gradient(135deg,#5B8DEF,#9B7FD4)",
  grad2:"linear-gradient(135deg,#4ECDC4,#26de81)",
  grad3:"linear-gradient(135deg,#9B7FD4,#FF6B6B)",
  grad4:"linear-gradient(135deg,#F7B731,#FF6B6B)",
  razBlue:"#072654",
};

/* ─── ICONS ──────────────────────────────────────────────────────── */
const Ic = {
  home: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  journal: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  wallet: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="16" cy="15" r="1.2" fill="currentColor"/></svg>,
  ai: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  profile: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  back: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  send: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  video: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  phone: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  chat: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  bell: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  sos: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  star: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  mic: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  heart: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  settings: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
};

/* ─── DATA ──────────────────────────────────────────────────────── */
const LANGUAGES = ["English","हिंदी","தமிழ்","తెలుగు","বাংলা","मराठी","ਪੰਜਾਬੀ","ગુજરાતી","ಕನ್ನಡ","മലയാളം"];

const THERAPISTS = [
  { id:1, name:"Dr. Priya Sharma", title:"Clinical Psychologist", city:"New Delhi", lang:["Hindi","English"], specs:["Anxiety","Depression","Stress","Burnout"], rating:4.9, reviews:312, color:T.sky, initials:"PS", hourly:800, online:true, exp:"12 yrs", gender:"Female", modes:["chat","audio","video"], bio:"Specialises in CBT and mindfulness for anxiety and depression. Trained at NIMHANS Bangalore." },
  { id:2, name:"Dr. Arjun Mehta", title:"Psychiatrist", city:"Mumbai", lang:["Hindi","Marathi","English"], specs:["ADHD","Bipolar","Trauma","Medication"], rating:4.95, reviews:489, color:T.mint, initials:"AM", hourly:1400, online:true, exp:"15 yrs", gender:"Male", modes:["audio","video"], bio:"Senior psychiatrist with expertise in complex mood disorders and trauma-informed care." },
  { id:3, name:"Kavya Nair", title:"Relationship Counselor", city:"Bengaluru", lang:["Malayalam","Kannada","English"], specs:["Relationships","Grief","Self-esteem","Loneliness"], rating:4.8, reviews:201, color:T.lavender, initials:"KN", hourly:650, online:true, exp:"8 yrs", gender:"Female", modes:["chat","audio","video"], bio:"Warm, compassionate space to heal, reconnect, and understand your relationships better." },
  { id:4, name:"Dr. Rohit Kapoor", title:"Trauma Specialist", city:"Pune", lang:["Hindi","English"], specs:["Trauma","PTSD","Anger","Addiction"], rating:4.7, reviews:145, color:T.coral, initials:"RK", hourly:1100, online:false, exp:"10 yrs", gender:"Male", modes:["audio","video"], bio:"Somatic trauma therapy specialist. Helping people find safety in their own bodies." },
  { id:5, name:"Dr. Sneha Iyer", title:"CBT Therapist", city:"Chennai", lang:["Tamil","English"], specs:["OCD","Phobias","Anxiety","Sleep"], rating:4.85, reviews:267, color:"#F7B731", initials:"SI", hourly:750, online:true, exp:"9 yrs", gender:"Female", modes:["chat","video"], bio:"Structured CBT to break free from unhelpful thought patterns — practical and evidence-based." },
  { id:6, name:"Vikram Bose", title:"Family Therapist", city:"Kolkata", lang:["Bengali","Hindi","English"], specs:["Family","Parenting","Couples","Divorce"], rating:4.75, reviews:132, color:"#9E7B6A", initials:"VB", hourly:900, online:true, exp:"11 yrs", gender:"Male", modes:["chat","audio","video"], bio:"Systemic family therapy to build stronger bonds and healthier communication patterns." },
  { id:7, name:"Dr. Ananya Rao", title:"Child & Adolescent Therapist", city:"Hyderabad", lang:["Telugu","English"], specs:["Teens","ADHD","Learning","Anxiety"], rating:4.88, reviews:178, color:"#26de81", initials:"AR", hourly:900, online:true, exp:"13 yrs", gender:"Female", modes:["chat","video"], bio:"Specialised in child development and adolescent mental health with play therapy techniques." },
  { id:8, name:"Rahul Singhania", title:"Life Coach & Counselor", city:"Jaipur", lang:["Hindi","English","Rajasthani"], specs:["Career","Self-Growth","Motivation","Stress"], rating:4.72, reviews:98, color:"#FF6B6B", initials:"RS", hourly:500, online:true, exp:"6 yrs", gender:"Male", modes:["chat","audio"], bio:"Helping professionals find clarity, purpose, and confidence in their personal and work lives." },
];

const PLANS = [
  { id:"free", name:"Free", price:0, tag:"Get Started", color:T.sub, desc:"2 AI chat sessions/week\nJournal access\nMood tracker", highlight:false },
  { id:"payg", name:"Pay-as-you-go", price:null, tag:"Most Flexible", color:T.sky, desc:"₹499 = 30 mins\n₹799 = 60 mins\nNo expiry", highlight:false },
  { id:"sub", name:"Monthly", price:999, tag:"Best Value ⭐", color:T.lavender, desc:"100 mins/month\nUnlimited AI chat\nPriority booking\nGroup sessions", highlight:true },
];

const ISSUES = [
  {l:"Stress & Burnout",i:"🔥"},{l:"Anxiety",i:"💭"},{l:"Depression",i:"🌧"},
  {l:"Relationships",i:"💔"},{l:"Grief & Loss",i:"🕊"},{l:"Family Issues",i:"🏠"},
  {l:"Self-Growth",i:"🌱"},{l:"Trauma & PTSD",i:"💫"},{l:"Sleep Problems",i:"😴"},
  {l:"Addiction",i:"🔗"},{l:"Anger",i:"😤"},{l:"Loneliness",i:"🫂"},
];

const MOODS = ["😭","😔","😐","🙂","😄"];
const MOODLABEL = ["Terrible","Bad","Okay","Good","Great"];
const MOODCOL = ["#EF9A9A","#FFCC80","#FFF59D","#C5E1A5","#A5D6A7"];

const NOTIFS = [
  { title:"Session Reminder", body:"Your session with Dr. Priya is in 30 mins", time:"2h ago", icon:"📅", read:false },
  { title:"New Therapist Available", body:"Dr. Ananya Rao is now accepting patients", time:"5h ago", icon:"👩‍⚕️", read:false },
  { title:"Journal Reminder", body:"You haven't journaled in 2 days. How are you?", time:"1d ago", icon:"📓", read:true },
  { title:"Diwali Offer 🪔", body:"Get 20% extra minutes on recharge today!", time:"2d ago", icon:"🎁", read:true },
];

/* ─── HELPERS ───────────────────────────────────────────────────── */
const inr = n => `₹${Number(n).toLocaleString("en-IN")}`;
const Btn = ({children,onClick,style={},grad=T.grad1,full=false,ghost=false,sm=false}) => (
  <button onClick={onClick} style={{ width:full?"100%":"auto", padding:sm?"9px 18px":"14px 22px", borderRadius:16, border:ghost?`2px solid #9B7FD4`:"none", background:ghost?"transparent":grad, color:ghost?"#9B7FD4":"#fff", fontSize:sm?12:14, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif", transition:"opacity 0.15s", ...style }}
    onMouseEnter={e=>e.currentTarget.style.opacity="0.88"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
    {children}
  </button>
);
const Card = ({children,style={}}) => <div style={{ background:T.white, borderRadius:20, padding:18, boxShadow:"0 2px 20px rgba(99,74,150,0.08)", border:`1px solid ${T.border}`, ...style }}>{children}</div>;
const Label = ({children}) => <div style={{ fontSize:10, letterSpacing:2.5, color:T.lavender, textTransform:"uppercase", fontWeight:800 }}>{children}</div>;
const BackBtn = ({onClick}) => <button onClick={onClick} style={{ background:"none", border:"none", color:T.lavender, cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:13, fontWeight:700, fontFamily:"'Nunito',sans-serif", marginBottom:18 }}>{Ic.back} Back</button>;
const Badge = ({children,color=T.sky}) => <span style={{ background:`${color}22`, color:color, fontSize:10, padding:"3px 10px", borderRadius:8, fontWeight:700 }}>{children}</span>;

/* ═══════════════════════════════════════════════════════════════════ */
export default function MindWell() {
  useEffect(()=>{ const s=document.createElement("style"); s.textContent=GCSS; document.head.appendChild(s); },[]);

  /* Flow state */
  const [screen, setScreen] = useState("splash");
  const [lang, setLang] = useState("English");
  const [therapyFor, setTherapyFor] = useState(null); // individual/couples/teen
  const [introSlide, setIntroSlide] = useState(0);
  const [authMode, setAuthMode] = useState("login"); // login/signup
  const [phone, setPhone] = useState(""); const [otp, setOtp] = useState(""); const [otpSent, setOtpSent] = useState(false);
  const [signupData, setSignupData] = useState({name:"",dob:"",gender:"",phone:"",referral:""});
  const [userName, setUserName] = useState("Riya");

  /* Onboarding */
  const [obStep, setObStep] = useState(0);
  const [selIssues, setSelIssues] = useState([]);

  /* App */
  const [tab, setTab] = useState("home");
  const [moodToday, setMoodToday] = useState(null);
  const [moodChecked, setMoodChecked] = useState(false);

  /* Therapist */
  const [filterMode, setFilterMode] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [filterLang, setFilterLang] = useState("all");
  const [filterSpec, setFilterSpec] = useState("all");
  const [selTherapist, setSelTherapist] = useState(null);
  const [sessionMode, setSessionMode] = useState(null);
  const [inSession, setInSession] = useState(false);
  const [sessionMins, setSessionMins] = useState(30);
  const [sessionTimer, setSessionTimer] = useState(null);
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const [sessionMsgs, setSessionMsgs] = useState([{from:"them",text:"Namaste! I'm so glad you reached out. How are you feeling today?"}]);
  const [sessionInput, setSessionInput] = useState("");
  const [showRating, setShowRating] = useState(false);
  const [sessionRating, setSessionRating] = useState(5);
  const [sessions, setSessions] = useState([]);

  /* Wallet */
  const [balance, setBalance] = useState(150);
  const [mins, setMins] = useState(10);
  const [txns, setTxns] = useState([{type:"credit",amt:150,label:"Welcome Bonus",date:"Today",mins:10}]);
  const [showRaz, setShowRaz] = useState(false);
  const [razPlan, setRazPlan] = useState(null);

  /* Journal */
  const [jEntries, setJEntries] = useState([]);
  const [jText, setJText] = useState(""); const [jMood, setJMood] = useState(2); const [writing, setWriting] = useState(false);
  const [jPrompts] = useState(["What made you smile today?","Describe one emotion you felt strongly today.","What's weighing on your heart right now?","Write a letter to your future self.","What are three things you're grateful for?"]);

  /* AI */
  const [aiMsgs, setAiMsgs] = useState([{role:"assistant",text:"Namaste 🙏 I'm MindBot — your personal wellness companion. I'm here to listen without judgement. What's on your mind today?"}]);
  const [aiInput, setAiInput] = useState(""); const [aiLoad, setAiLoad] = useState(false);
  const [summary, setSummary] = useState(null); const [sumLoad, setSumLoad] = useState(false);
  const aiEnd = useRef(null);

  /* SOS */
  const [showSOS, setShowSOS] = useState(false);

  /* Notifications */
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(()=>{ if(screen==="splash") setTimeout(()=>setScreen("language"),2600); },[screen]);
  useEffect(()=>{ aiEnd.current?.scrollIntoView({behavior:"smooth"}); },[aiMsgs]);

  /* Session timer */
  useEffect(()=>{
    if(inSession){
      const t=setInterval(()=>setSessionElapsed(s=>s+1),1000);
      setSessionTimer(t); return ()=>clearInterval(t);
    } else { if(sessionTimer) clearInterval(sessionTimer); }
  },[inSession]);

  const filteredTherapists = THERAPISTS.filter(t=>{
    if(filterMode!=="all"&&!t.modes.includes(filterMode)) return false;
    if(filterGender!=="all"&&t.gender.toLowerCase()!==filterGender) return false;
    if(filterLang!=="all"&&!t.lang.includes(filterLang)) return false;
    if(filterSpec!=="all"&&!t.specs.includes(filterSpec)) return false;
    return true;
  });

  const sendSession = () => {
    if(!sessionInput.trim()) return;
    const txt=sessionInput.trim(); setSessionInput("");
    setSessionMsgs(m=>[...m,{from:"me",text:txt}]);
    setTimeout(()=>setSessionMsgs(m=>[...m,{from:"them",text:"I hear you. That sounds really challenging. Can you tell me more about when this feeling started?"}]),1200);
  };

  const endSession = () => {
    setInSession(false);
    const cost=Math.ceil(sessionElapsed/60)*Math.ceil(selTherapist.hourly/60);
    setBalance(b=>Math.max(0,b-cost));
    setMins(m=>Math.max(0,m-Math.ceil(sessionElapsed/60)));
    setSessions(s=>[{therapist:selTherapist,mode:sessionMode,duration:Math.ceil(sessionElapsed/60),date:"Today",cost},...s]);
    setShowRating(true);
  };

  const sendAI = async()=>{
    if(!aiInput.trim()||aiLoad) return;
    const txt=aiInput.trim(); setAiInput("");
    setAiMsgs(m=>[...m,{role:"user",text:txt}]); setAiLoad(true);
    try {
      const hist=aiMsgs.map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.text}));
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:`You are MindBot, a warm compassionate AI mental health companion for MindWell — an Indian mental wellness platform. The user's name is ${userName}. Language preference: ${lang}. Respond with genuine empathy and cultural sensitivity. Keep responses to 2-4 sentences. Occasionally use warm Hindi/regional expressions naturally. Never diagnose. Gently recommend professional therapy when appropriate. Always validate feelings first.`,messages:[...hist,{role:"user",content:txt}]})});
      const d=await r.json();
      setAiMsgs(m=>[...m,{role:"assistant",text:d.content?.find(b=>b.type==="text")?.text||"I'm here with you. Please continue sharing."}]);
    } catch { setAiMsgs(m=>[...m,{role:"assistant",text:"I'm here with you. Please keep sharing — I'm listening carefully."}]); }
    setAiLoad(false);
  };

  const genSummary=async()=>{
    setSumLoad(true);
    const c=aiMsgs.map(m=>`${m.role==="user"?"Patient":"AI"}: ${m.text}`).join("\n");
    try {
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:"You are a clinical assistant. Generate a concise practitioner briefing. Use EXACTLY these bold headers: **Presenting Concerns**, **Emotional State**, **Key Themes**, **Recommended Focus Areas**. Be clinical but compassionate. Max 150 words. Consider Indian cultural context.",messages:[{role:"user",content:`Practitioner summary for:\n\n${c}`}]})});
      const d=await r.json();
      setSummary(d.content?.find(b=>b.type==="text")?.text||"Unable to generate summary.");
    } catch { setSummary("Summary failed. Please try again."); }
    setSumLoad(false);
  };

  const confirmRazorpay=()=>{
    setBalance(b=>b+razPlan.price);
    setMins(m=>m+razPlan.mins);
    setTxns(t=>[{type:"credit",amt:razPlan.price,label:razPlan.label,date:"Today",mins:razPlan.mins},...t]);
    setShowRaz(false); setRazPlan(null);
  };

  const W = { fontFamily:"'Nunito',sans-serif", background:T.bg, minHeight:"100vh", maxWidth:430, margin:"0 auto" };

  /* ══ SPLASH ══ */
  if(screen==="splash") return (
    <div style={{...W,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(160deg,#1A1035,#2D1B6B,#4A2D9E)",minHeight:"100vh"}}>
      <div style={{animation:"pulse 2s ease infinite"}}>
        <div style={{width:100,height:100,borderRadius:30,background:"linear-gradient(135deg,#5B8DEF,#9B7FD4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:50,boxShadow:"0 16px 48px #9B7FD466",marginBottom:28}}>🌿</div>
      </div>
      <div style={{fontFamily:"'Lora',serif",fontSize:40,fontWeight:600,color:"#fff",marginBottom:8,animation:"fadeUp 0.8s ease 0.3s both"}}>MindWell</div>
      <div style={{fontSize:15,color:"rgba(255,255,255,0.6)",animation:"fadeUp 0.8s ease 0.6s both"}}>Talk. Heal. Grow.</div>
      <div style={{position:"absolute",bottom:60,display:"flex",gap:6}}>
        {[0,1,2].map(i=><div key={i} style={{width:i===0?24:8,height:8,borderRadius:4,background:i===0?"#9B7FD4":"rgba(255,255,255,0.3)",transition:"all 0.3s"}}/>)}
      </div>
      <div style={{position:"absolute",bottom:36,fontSize:11,color:"rgba(255,255,255,0.3)"}}>🇮🇳 Made for India with ❤️</div>
    </div>
  );

  /* ══ LANGUAGE ══ */
  if(screen==="language") return (
    <div style={{...W,padding:"48px 24px 32px",background:"linear-gradient(160deg,#F7F4FE,#EDE5FF)"}}>
      <div style={{animation:"fadeUp 0.5s ease"}}>
        <div style={{fontSize:32,marginBottom:12,textAlign:"center"}}>🌐</div>
        <div style={{fontFamily:"'Lora',serif",fontSize:26,fontWeight:600,color:T.dark,textAlign:"center",marginBottom:6}}>Choose your language</div>
        <div style={{fontSize:13,color:T.sub,textAlign:"center",marginBottom:32}}>आप जिस भाषा में बात करना चाहते हैं</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {LANGUAGES.map(l=>(
            <button key={l} onClick={()=>{setLang(l);setScreen("therapy_for");}}
              style={{padding:"16px 12px",borderRadius:16,border:`2px solid ${lang===l?T.lavender:T.border}`,background:lang===l?"#EDE5FF":"#fff",cursor:"pointer",fontSize:15,fontWeight:700,color:lang===l?T.lavender:T.text,transition:"all 0.2s",animation:"fadeUp 0.4s ease"}}>
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  /* ══ FOR WHOM (BetterHelp style) ══ */
  if(screen==="therapy_for") return (
    <div style={{...W,padding:"48px 24px 32px",background:"linear-gradient(160deg,#F7F4FE,#EDE5FF)"}}>
      <div style={{animation:"fadeUp 0.5s ease",textAlign:"center"}}>
        <div style={{fontFamily:"'Lora',serif",fontSize:28,fontWeight:600,color:T.dark,marginBottom:8}}>What type of support are you looking for?</div>
        <div style={{fontSize:13,color:T.sub,marginBottom:36}}>Select who the therapy is for</div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {[
            {id:"individual",icon:"🧍",title:"Individual",sub:"For myself — personal growth, mental health",color:T.sky},
            {id:"couples",icon:"👫",title:"Couples",sub:"For me and my partner — relationship support",color:T.lavender},
            {id:"teen",icon:"👦",title:"Teen / Child",sub:"For my child or teenager",color:T.mint},
          ].map(opt=>(
            <button key={opt.id} onClick={()=>{setTherapyFor(opt.id);setScreen("intro");}}
              style={{padding:"22px 20px",borderRadius:20,border:`2px solid ${T.border}`,background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:16,textAlign:"left",transition:"all 0.2s",boxShadow:"0 2px 16px rgba(99,74,150,0.08)"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=opt.color;e.currentTarget.style.background=`${opt.color}11`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background="#fff";}}>
              <div style={{width:56,height:56,borderRadius:18,background:`${opt.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>{opt.icon}</div>
              <div><div style={{fontWeight:800,fontSize:15,color:T.dark,marginBottom:2}}>{opt.title}</div><div style={{fontSize:12,color:T.sub,lineHeight:1.4}}>{opt.sub}</div></div>
            </button>
          ))}
        </div>
        <div style={{marginTop:20,fontSize:12,color:T.sub}}>🔒 Your answers are private and confidential</div>
      </div>
    </div>
  );

  /* ══ INTRO SLIDES ══ */
  if(screen==="intro") {
    const slides=[
      {icon:"🤝",title:"You are not alone",body:"Millions of Indians silently struggle. MindWell makes it safe, affordable, and accessible to talk to a real professional — in your own language.",color:T.sky},
      {icon:"🌿",title:"Talk. Heal. Grow.",body:"Chat, call, or video session with verified Indian therapists. Use AI journaling between sessions to track your journey.",color:T.lavender},
      {icon:"💰",title:"₹150 = 10 minutes",body:"No monthly commitment needed. Pay only for what you use. Free AI chat always available. Real support shouldn't be a luxury.",color:T.mint},
    ];
    const s=slides[introSlide];
    return (
      <div style={{...W,display:"flex",flexDirection:"column",padding:"60px 28px 40px",background:`linear-gradient(160deg,${s.color}22,${T.bg})`,minHeight:"100vh"}}>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",animation:"fadeUp 0.5s ease"}}>
          <div style={{fontSize:80,marginBottom:28}}>{s.icon}</div>
          <div style={{fontFamily:"'Lora',serif",fontSize:28,fontWeight:600,color:T.dark,marginBottom:16,lineHeight:1.3}}>{s.title}</div>
          <div style={{fontSize:15,color:T.sub,lineHeight:1.8,maxWidth:320}}>{s.body}</div>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:32}}>
          {slides.map((_,i)=><div key={i} style={{width:i===introSlide?28:8,height:8,borderRadius:4,background:i===introSlide?s.color:T.border,transition:"all 0.3s"}}/>)}
        </div>
        <Btn full grad={`linear-gradient(135deg,${s.color},${T.lavender})`} onClick={()=>{ if(introSlide<2) setIntroSlide(i=>i+1); else setScreen("auth"); }}>
          {introSlide<2?"Continue →":"Get Started →"}
        </Btn>
        {introSlide<2&&<button onClick={()=>setScreen("auth")} style={{background:"none",border:"none",color:T.sub,fontSize:13,cursor:"pointer",marginTop:16,fontFamily:"'Nunito',sans-serif"}}>Skip</button>}
      </div>
    );
  }

  /* ══ AUTH ══ */
  if(screen==="auth") return (
    <div style={{...W,padding:"48px 24px 40px",background:"linear-gradient(160deg,#F7F4FE,#EDE5FF)",minHeight:"100vh"}}>
      <div style={{animation:"fadeUp 0.5s ease"}}>
        <div style={{display:"flex",gap:0,background:T.border,borderRadius:16,padding:4,marginBottom:32}}>
          {["login","signup"].map(m=><button key={m} onClick={()=>setAuthMode(m)} style={{flex:1,padding:"11px",border:"none",borderRadius:13,background:authMode===m?"#fff":"none",color:authMode===m?T.lavender:T.sub,fontWeight:800,fontSize:13,cursor:"pointer",transition:"all 0.2s",fontFamily:"'Nunito',sans-serif",textTransform:"capitalize",boxShadow:authMode===m?"0 2px 10px rgba(99,74,150,0.12)":"none"}}>{m==="login"?"Log In":"Sign Up"}</button>)}
        </div>

        {authMode==="login"?(
          <div>
            <div style={{fontFamily:"'Lora',serif",fontSize:26,fontWeight:600,color:T.dark,marginBottom:6}}>Welcome back 👋</div>
            <div style={{fontSize:13,color:T.sub,marginBottom:28}}>Log in with your phone number</div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:12,fontWeight:700,color:T.text,marginBottom:6}}>Phone Number</div>
              <div style={{display:"flex",gap:8}}>
                <div style={{padding:"13px 14px",borderRadius:14,border:`1px solid ${T.border}`,background:"#fff",fontSize:13,fontWeight:600,color:T.text}}>🇮🇳 +91</div>
                <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="10-digit number" style={{flex:1,padding:"13px 16px",borderRadius:14,border:`1px solid ${T.border}`,background:"#fff",fontSize:14,outline:"none",color:T.text}}/>
              </div>
            </div>
            {otpSent&&<div style={{marginBottom:14}}>
              <div style={{fontSize:12,fontWeight:700,color:T.text,marginBottom:6}}>Enter OTP</div>
              <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="6-digit OTP" style={{width:"100%",padding:"13px 16px",borderRadius:14,border:`1px solid ${T.border}`,background:"#fff",fontSize:16,outline:"none",color:T.text,letterSpacing:6}}/>
            </div>}
            {!otpSent?<Btn full onClick={()=>setOtpSent(true)}>Send OTP</Btn>
            :<Btn full onClick={()=>{setUserName(signupData.name||"Friend");setScreen("onboarding");}}>Verify & Login</Btn>}
          </div>
        ):(
          <div>
            <div style={{fontFamily:"'Lora',serif",fontSize:26,fontWeight:600,color:T.dark,marginBottom:6}}>Join MindWell 🌿</div>
            <div style={{fontSize:13,color:T.sub,marginBottom:24}}>Begin your wellness journey</div>
            {[["Full Name","name","text"],["Date of Birth","dob","date"],["Phone","phone","tel"],["Referral Code (optional)","referral","text"]].map(([label,key,type])=>(
              <div key={key} style={{marginBottom:14}}>
                <div style={{fontSize:12,fontWeight:700,color:T.text,marginBottom:6}}>{label}</div>
                <input type={type} value={signupData[key]} onChange={e=>setSignupData(d=>({...d,[key]:e.target.value}))} placeholder={label} style={{width:"100%",padding:"13px 16px",borderRadius:14,border:`1px solid ${T.border}`,background:"#fff",fontSize:14,outline:"none",color:T.text}}/>
              </div>
            ))}
            <div style={{marginBottom:22}}>
              <div style={{fontSize:12,fontWeight:700,color:T.text,marginBottom:8}}>Gender</div>
              <div style={{display:"flex",gap:8}}>
                {["Male","Female","Other"].map(g=><button key={g} onClick={()=>setSignupData(d=>({...d,gender:g}))} style={{flex:1,padding:"10px",border:`2px solid ${signupData.gender===g?T.lavender:T.border}`,borderRadius:12,background:signupData.gender===g?"#EDE5FF":"#fff",color:signupData.gender===g?T.lavender:T.sub,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>{g}</button>)}
              </div>
            </div>
            <Btn full onClick={()=>{setUserName(signupData.name||"Friend");setScreen("onboarding");}}>Create Account →</Btn>
          </div>
        )}
        <div style={{textAlign:"center",marginTop:20,fontSize:11,color:T.sub}}>🔒 Your data is encrypted and never shared</div>
      </div>
    </div>
  );

  /* ══ ONBOARDING: MULTI-SELECT ISSUES ══ */
  if(screen==="onboarding") return (
    <div style={{...W,padding:"32px 20px",background:"linear-gradient(160deg,#F7F4FE,#EDE5FF)",minHeight:"100vh"}}>
      <div style={{animation:"fadeUp 0.5s ease"}}>
        <div style={{fontSize:13,color:T.lavender,fontWeight:800,marginBottom:6}}>Almost there! ✨</div>
        <div style={{fontFamily:"'Lora',serif",fontSize:24,fontWeight:600,color:T.dark,marginBottom:4}}>What would you like to work on?</div>
        <div style={{fontSize:13,color:T.sub,marginBottom:24}}>Select all that apply — you can always change this</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:28}}>
          {ISSUES.map((issue,i)=>{
            const sel=selIssues.includes(issue.l);
            return <button key={i} onClick={()=>setSelIssues(prev=>sel?prev.filter(x=>x!==issue.l):[...prev,issue.l])}
              style={{padding:"14px 8px",borderRadius:16,border:`2px solid ${sel?T.lavender:T.border}`,background:sel?"#EDE5FF":"#fff",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
              <div style={{fontSize:24,marginBottom:6}}>{issue.i}</div>
              <div style={{fontSize:10,fontWeight:700,color:sel?T.lavender:T.text,lineHeight:1.3}}>{issue.l}</div>
              {sel&&<div style={{marginTop:4,color:T.lavender}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>}
            </button>;
          })}
        </div>
        <Btn full onClick={()=>setScreen("app")} style={{opacity:selIssues.length?1:0.55}}>
          {selIssues.length?`Continue with ${selIssues.length} topic${selIssues.length>1?"s":""}  →`:"Select at least one to continue"}
        </Btn>
        {selIssues.length===0&&<button onClick={()=>setScreen("app")} style={{background:"none",border:"none",color:T.sub,fontSize:12,cursor:"pointer",marginTop:12,display:"block",width:"100%",fontFamily:"'Nunito',sans-serif"}}>Skip for now</button>}
      </div>
    </div>
  );

  /* ════════════════ MAIN APP ════════════════ */

  return (
    <div style={{...W,paddingBottom:74}}>

      {/* ── HOME ── */}
      {tab==="home"&&(
        <div style={{animation:"fadeUp 0.4s ease"}}>
          {/* Header */}
          <div style={{background:"linear-gradient(135deg,#1A1035,#2D1B6B)",padding:"36px 20px 24px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(155,127,212,0.12)"}}/>
            <div style={{position:"absolute",top:20,right:80,width:70,height:70,borderRadius:"50%",background:"rgba(91,141,239,0.1)"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:11,letterSpacing:2,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",marginBottom:4}}>Namaste 🙏</div>
                <div style={{fontFamily:"'Lora',serif",fontSize:28,color:"#fff",fontWeight:600,marginBottom:2}}>{userName}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.55)",marginTop:2}}>{selIssues.length?`Working on: ${selIssues.slice(0,2).join(", ")}${selIssues.length>2?" +more":""}` :"How are you today?"}</div>
              </div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <button onClick={()=>setShowNotifs(true)} style={{width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                  {Ic.bell}
                  <div style={{position:"absolute",top:6,right:6,width:8,height:8,borderRadius:"50%",background:T.coral}}/>
                </button>
              </div>
            </div>
            {/* Wallet strip */}
            <div style={{marginTop:20,background:"rgba(255,255,255,0.08)",borderRadius:16,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",backdropFilter:"blur(10px)"}}>
              <div><div style={{fontSize:10,color:"rgba(255,255,255,0.5)",marginBottom:2}}>Wallet · {mins} mins left</div><div style={{fontSize:22,fontWeight:900,color:"#fff"}}>{inr(balance)}</div></div>
              <button onClick={()=>setTab("wallet")} style={{background:T.grad1,border:"none",borderRadius:12,padding:"9px 18px",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>+ Recharge</button>
            </div>
          </div>

          {/* Mood Check-in */}
          {!moodChecked&&(
            <div style={{margin:"16px 16px 0"}}>
              <Card>
                <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:12}}>How are you feeling right now? 💭</div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  {MOODS.map((m,i)=>(
                    <button key={i} onClick={()=>{setMoodToday(i);setMoodChecked(true);}}
                      style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:"none",border:"none",cursor:"pointer"}}>
                      <div style={{fontSize:28,transition:"transform 0.2s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.3)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>{m}</div>
                      <div style={{fontSize:9,color:T.sub,fontWeight:600}}>{MOODLABEL[i]}</div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          )}
          {moodChecked&&(
            <div style={{margin:"16px 16px 0"}}>
              <div style={{background:MOODCOL[moodToday]+"44",borderRadius:16,padding:"12px 16px",display:"flex",gap:10,alignItems:"center",border:`1px solid ${MOODCOL[moodToday]}`}}>
                <div style={{fontSize:28}}>{MOODS[moodToday]}</div>
                <div><div style={{fontWeight:700,fontSize:13,color:T.dark}}>Feeling {MOODLABEL[moodToday]} today</div><div style={{fontSize:11,color:T.sub}}>Mood logged ✓</div></div>
              </div>
            </div>
          )}

          {/* Talk Now CTA */}
          <div style={{margin:"16px 16px 0",background:T.grad1,borderRadius:22,padding:"22px 20px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",right:-10,top:-10,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
            <div style={{fontSize:22,marginBottom:6}}>🧠</div>
            <div style={{fontFamily:"'Lora',serif",fontSize:20,color:"#fff",fontWeight:600,marginBottom:4}}>Talk to a Therapist Now</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",marginBottom:16}}>6 therapists available right now · Starting ₹150</div>
            <button onClick={()=>setTab("therapists")} style={{background:"#fff",border:"none",borderRadius:14,padding:"12px 24px",color:T.lavender,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Find a Therapist →</button>
          </div>

          {/* Plans */}
          <div style={{padding:"16px 16px 0"}}>
            <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:12}}>Session Plans</div>
            <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4}}>
              {PLANS.map(p=>(
                <div key={p.id} style={{minWidth:150,background:p.highlight?"linear-gradient(135deg,#9B7FD4,#5B8DEF)":"#fff",borderRadius:18,padding:"16px 14px",border:p.highlight?"none":`1px solid ${T.border}`,position:"relative",flexShrink:0}}>
                  {p.highlight&&<div style={{position:"absolute",top:-8,left:"50%",transform:"translateX(-50%)",background:T.gold,color:"#fff",fontSize:9,fontWeight:800,padding:"3px 10px",borderRadius:8,whiteSpace:"nowrap"}}>BEST VALUE</div>}
                  <div style={{fontSize:11,fontWeight:800,color:p.highlight?"rgba(255,255,255,0.7)":T.sub,marginBottom:4}}>{p.name}</div>
                  <div style={{fontSize:p.price===null?14:20,fontWeight:900,color:p.highlight?"#fff":T.dark,marginBottom:6}}>{p.price===null?"From ₹499":p.price===0?"FREE":`₹${p.price}/mo`}</div>
                  {p.desc.split("\n").map((d,i)=><div key={i} style={{fontSize:10,color:p.highlight?"rgba(255,255,255,0.75)":T.sub,marginBottom:2}}>✓ {d}</div>)}
                  <button onClick={()=>setTab("wallet")} style={{width:"100%",marginTop:10,padding:"8px",borderRadius:10,border:"none",background:p.highlight?"rgba(255,255,255,0.2)":T.border,color:p.highlight?"#fff":T.text,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>{p.price===0?"Start Free":"Get Plan"}</button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Therapists */}
          <div style={{padding:"16px 16px 0"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:800,color:T.dark}}>
                {selIssues.length?"✨ Matched for you":"Top Therapists"}
              </div>
              <button onClick={()=>setTab("therapists")} style={{background:"none",border:"none",color:T.lavender,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>See all →</button>
            </div>
            {THERAPISTS.slice(0,3).map((t,i)=>(
              <div key={t.id} className="hvr" onClick={()=>{setSelTherapist(t);setTab("therapists");}}
                style={{...{background:T.card,borderRadius:20,padding:16,boxShadow:"0 2px 20px rgba(99,74,150,0.08)",border:`1px solid ${T.border}`},marginBottom:10,cursor:"pointer",animation:`fadeUp 0.4s ease ${i*0.07}s both`}}>
                <div style={{display:"flex",gap:12}}>
                  <div style={{width:52,height:52,borderRadius:16,background:`linear-gradient(135deg,${t.color},${t.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:16,flexShrink:0}}>{t.initials}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <div>
                        <div style={{fontWeight:800,fontSize:14,color:T.dark}}>{t.name}</div>
                        <div style={{fontSize:11,color:T.sub}}>{t.title} · {t.city}</div>
                      </div>
                      <Badge color={t.online?T.mint:T.sub}>{t.online?"● Online":"Offline"}</Badge>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
                      <div style={{display:"flex",gap:4,alignItems:"center",color:T.gold,fontSize:12,fontWeight:700}}>{Ic.star} {t.rating} <span style={{color:T.sub,fontWeight:400}}>({t.reviews})</span></div>
                      <div style={{fontWeight:900,color:T.lavender,fontSize:15}}>{inr(t.hourly)}/hr</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SOS Button */}
          <div style={{padding:"16px 16px 0"}}>
            <button onClick={()=>setShowSOS(true)} style={{width:"100%",padding:"16px",borderRadius:18,border:"none",background:"linear-gradient(135deg,#FF6B6B,#ee0979)",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,fontFamily:"'Nunito',sans-serif",animation:"pulse 3s ease infinite"}}>
              {Ic.sos} I'm Feeling Overwhelmed — SOS Help
            </button>
          </div>
        </div>
      )}

      {/* ── THERAPISTS ── */}
      {tab==="therapists"&&!inSession&&!selTherapist&&(
        <div style={{animation:"fadeUp 0.3s ease"}}>
          <div style={{padding:"28px 20px 16px",background:"linear-gradient(135deg,#1A1035,#2D1B6B)"}}>
            <div style={{fontFamily:"'Lora',serif",fontSize:24,color:"#fff",fontWeight:600,marginBottom:4}}>Find Your Therapist</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.55)"}}>Verified · Indian · In your language</div>
          </div>
          {/* Filters */}
          <div style={{padding:"14px 16px",borderBottom:`1px solid ${T.border}`,background:"#fff"}}>
            <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:2}}>
              {[
                {label:"Mode",options:["all","chat","audio","video"],val:filterMode,set:setFilterMode},
                {label:"Gender",options:["all","female","male"],val:filterGender,set:setFilterGender},
              ].map(f=>(
                <div key={f.label} style={{display:"flex",gap:6,flexShrink:0}}>
                  {f.options.map(o=><button key={o} onClick={()=>f.set(o)} style={{padding:"7px 14px",borderRadius:20,border:`1.5px solid ${f.val===o?T.lavender:T.border}`,background:f.val===o?"#EDE5FF":"#fff",color:f.val===o?T.lavender:T.sub,fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'Nunito',sans-serif",textTransform:"capitalize"}}>{o==="all"?"All":o}</button>)}
                </div>
              ))}
            </div>
          </div>
          {/* Results */}
          <div style={{padding:"12px 16px"}}>
            <div style={{fontSize:12,color:T.sub,marginBottom:12}}>{filteredTherapists.length} therapists found</div>
            {filteredTherapists.map((t,i)=>(
              <div key={t.id} className="hvr" onClick={()=>setSelTherapist(t)}
                style={{...{background:T.card,borderRadius:20,padding:18,boxShadow:"0 2px 20px rgba(99,74,150,0.07)",border:`1px solid ${T.border}`},marginBottom:12,cursor:"pointer",animation:`fadeUp 0.35s ease ${i*0.05}s both`}}>
                <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                  <div style={{width:60,height:60,borderRadius:18,background:`linear-gradient(135deg,${t.color},${t.color}99)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:18,flexShrink:0}}>{t.initials}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                      <div>
                        <div style={{fontWeight:800,fontSize:15,color:T.dark}}>{t.name}</div>
                        <div style={{fontSize:11,color:T.sub}}>{t.title} · {t.city} · {t.exp}</div>
                      </div>
                      <Badge color={t.online?T.mint:T.coral}>{t.online?"Online":"Offline"}</Badge>
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>
                      {t.specs.slice(0,3).map(s=><span key={s} style={{background:`${T.lavender}15`,color:T.lavender,fontSize:10,padding:"2px 8px",borderRadius:6,fontWeight:600}}>{s}</span>)}
                    </div>
                    <div style={{display:"flex",gap:6,marginBottom:10}}>
                      {t.modes.map(m=>(<span key={m} style={{display:"flex",alignItems:"center",gap:3,background:T.bg,borderRadius:8,padding:"3px 8px",fontSize:10,color:T.sub,fontWeight:600}}>
                        {m==="chat"?Ic.chat:m==="audio"?Ic.mic:Ic.video}{m}
                      </span>))}
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{display:"flex",gap:3,alignItems:"center",color:T.gold,fontSize:12,fontWeight:800}}>{Ic.star} {t.rating} <span style={{color:T.sub,fontWeight:400,fontSize:11}}>({t.reviews})</span></div>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <div style={{fontWeight:900,color:T.lavender,fontSize:15}}>{inr(t.hourly)}/hr</div>
                        <button onClick={e=>{e.stopPropagation();setSelTherapist(t);}} style={{background:T.grad1,border:"none",borderRadius:10,padding:"7px 14px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Talk Now</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* THERAPIST DETAIL */}
      {tab==="therapists"&&selTherapist&&!inSession&&!showRating&&(
        <div style={{animation:"fadeUp 0.3s ease"}}>
          <div style={{background:`linear-gradient(160deg,${selTherapist.color}33,${T.bg})`,padding:"20px 20px 0"}}>
            <BackBtn onClick={()=>setSelTherapist(null)}/>
            <div style={{textAlign:"center",paddingBottom:24}}>
              <div style={{width:88,height:88,borderRadius:26,background:`linear-gradient(135deg,${selTherapist.color},${selTherapist.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:28,margin:"0 auto 14px",boxShadow:`0 10px 30px ${selTherapist.color}55`}}>{selTherapist.initials}</div>
              <div style={{fontFamily:"'Lora',serif",fontSize:24,fontWeight:600,color:T.dark}}>{selTherapist.name}</div>
              <div style={{fontSize:12,color:T.sub,marginTop:3}}>{selTherapist.title} · {selTherapist.city} · {selTherapist.exp}</div>
              <div style={{fontSize:12,color:T.sub,marginTop:2}}>🗣 {selTherapist.lang.join(", ")}</div>
              <div style={{display:"flex",gap:4,justifyContent:"center",flexWrap:"wrap",marginTop:12}}>
                {selTherapist.specs.map(s=><Badge key={s} color={selTherapist.color}>{s}</Badge>)}
              </div>
            </div>
          </div>
          <div style={{padding:"0 16px 20px"}}>
            <Card style={{marginBottom:14}}><div style={{fontSize:13,color:T.text,lineHeight:1.75}}>{selTherapist.bio}</div></Card>
            <Card style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:13,fontWeight:800,color:T.dark}}>Choose Session Type</div><div style={{fontWeight:900,color:T.lavender,fontSize:16}}>{inr(selTherapist.hourly)}/hr</div></div>
              <div style={{display:"flex",gap:8}}>
                {selTherapist.modes.map(m=><button key={m} onClick={()=>setSessionMode(m)}
                  style={{flex:1,padding:"14px 8px",borderRadius:14,border:`2px solid ${sessionMode===m?T.lavender:T.border}`,background:sessionMode===m?"#EDE5FF":"#fff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                  <div style={{color:sessionMode===m?T.lavender:T.sub}}>{m==="chat"?Ic.chat:m==="audio"?Ic.mic:Ic.video}</div>
                  <div style={{fontSize:11,fontWeight:700,color:sessionMode===m?T.lavender:T.sub,textTransform:"capitalize"}}>{m}</div>
                </button>)}
              </div>
            </Card>
            {mins<15&&<div style={{background:"#FFF3E0",borderRadius:14,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#E65100"}}>⚠️ Low session minutes. <span style={{fontWeight:700,cursor:"pointer",textDecoration:"underline"}} onClick={()=>setTab("wallet")}>Recharge now →</span></div>}
            <Btn full onClick={()=>{if(sessionMode){setInSession(true);setSessionElapsed(0);setSessionMsgs([{from:"them",text:`Namaste! I'm ${selTherapist.name}. I'm so glad you reached out. How are you feeling today?`}]);}}} style={{opacity:sessionMode?1:0.5}}>
              {sessionMode?`Start ${sessionMode} session →`:"Select a session type"}
            </Btn>
          </div>
        </div>
      )}

      {/* IN SESSION */}
      {tab==="therapists"&&inSession&&selTherapist&&(
        <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 74px)",animation:"fadeUp 0.3s ease"}}>
          <div style={{background:"linear-gradient(135deg,#1A1035,#2D1B6B)",padding:"16px 16px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:38,height:38,borderRadius:12,background:`${selTherapist.color}`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:13}}>{selTherapist.initials}</div>
              <div><div style={{fontWeight:700,color:"#fff",fontSize:13}}>{selTherapist.name}</div><div style={{fontSize:10,color:T.mint}}>● {sessionMode} session live</div></div>
            </div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{background:"rgba(255,255,255,0.1)",borderRadius:10,padding:"6px 12px",fontSize:12,color:"#fff",fontWeight:700}}>⏱ {Math.floor(sessionElapsed/60)}:{String(sessionElapsed%60).padStart(2,"0")}</div>
              <button onClick={endSession} style={{background:"#FF6B6B",border:"none",borderRadius:10,padding:"7px 14px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>End</button>
            </div>
          </div>
          {sessionMode==="video"&&<div style={{background:"#0D0A2E",height:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{textAlign:"center",color:"rgba(255,255,255,0.4)"}}>
              <div style={{fontSize:48,marginBottom:8}}>{selTherapist.initials[0]}</div>
              <div style={{fontSize:12}}>Video · Encrypted · Private</div>
            </div>
          </div>}
          <div style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:10}}>
            {sessionMsgs.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.from==="me"?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"80%",padding:"11px 15px",borderRadius:18,background:m.from==="me"?T.grad1:"#fff",color:m.from==="me"?"#fff":T.text,fontSize:13,lineHeight:1.6,border:m.from!=="me"?`1px solid ${T.border}`:"none",borderBottomRightRadius:m.from==="me"?4:18,borderBottomLeftRadius:m.from==="me"?18:4}}>{m.text}</div>
              </div>
            ))}
          </div>
          <div style={{padding:"10px 12px",background:"#fff",borderTop:`1px solid ${T.border}`,display:"flex",gap:8}}>
            <input value={sessionInput} onChange={e=>setSessionInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendSession()} placeholder="Type a message..." style={{flex:1,padding:"11px 16px",borderRadius:20,border:`1px solid ${T.border}`,background:T.bg,fontSize:13,outline:"none",color:T.text}}/>
            <button onClick={sendSession} style={{width:42,height:42,borderRadius:"50%",border:"none",background:T.grad1,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.send}</button>
          </div>
        </div>
      )}

      {/* POST SESSION RATING */}
      {tab==="therapists"&&showRating&&(
        <div style={{padding:32,textAlign:"center",animation:"fadeUp 0.4s ease"}}>
          <div style={{fontSize:64,marginBottom:16}}>🌟</div>
          <div style={{fontFamily:"'Lora',serif",fontSize:24,fontWeight:600,color:T.dark,marginBottom:8}}>Session Complete</div>
          <div style={{fontSize:13,color:T.sub,marginBottom:28,lineHeight:1.7}}>Duration: {Math.ceil(sessionElapsed/60)} min<br/>How was your session with {selTherapist?.name}?</div>
          <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:28}}>
            {[1,2,3,4,5].map(s=><button key={s} onClick={()=>setSessionRating(s)} style={{background:"none",border:"none",fontSize:32,cursor:"pointer",opacity:s<=sessionRating?1:0.3,transition:"all 0.2s",transform:s<=sessionRating?"scale(1.1)":"scale(1)"}}>⭐</button>)}
          </div>
          <Btn full onClick={()=>{setShowRating(false);setSelTherapist(null);setSessionMode(null);setTab("home");}}>Done</Btn>
        </div>
      )}

      {/* ── JOURNAL ── */}
      {tab==="journal"&&(
        <div style={{animation:"fadeUp 0.3s ease"}}>
          <div style={{padding:"28px 20px 18px",background:"linear-gradient(135deg,#1A1035,#2D1B6B)"}}>
            <div style={{fontFamily:"'Lora',serif",fontSize:26,color:"#fff",fontWeight:600,marginBottom:4}}>My Journal 📓</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>AI-powered · Private · Yours forever</div>
          </div>
          <div style={{padding:"14px 16px"}}>
            {!writing?(
              <>
                <button onClick={()=>setWriting(true)} style={{width:"100%",padding:16,borderRadius:18,border:`2px dashed ${T.lavender}`,background:"#EDE5FF",color:T.lavender,fontSize:13,fontWeight:800,cursor:"pointer",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"'Nunito',sans-serif"}}>
                  {Ic.plus} Write Today's Entry
                </button>
                {/* AI Prompt */}
                <Card style={{marginBottom:14,background:"linear-gradient(135deg,#9B7FD455,#5B8DEF22)"}}>
                  <Label>Today's Prompt ✨</Label>
                  <div style={{fontSize:14,fontWeight:700,color:T.dark,marginTop:6,marginBottom:10,fontFamily:"'Lora',serif",fontStyle:"italic"}}>"{jPrompts[new Date().getDay()%jPrompts.length]}"</div>
                  <Btn sm onClick={()=>setWriting(true)}>Respond →</Btn>
                </Card>
                {jEntries.length===0?<div style={{textAlign:"center",padding:40,color:T.sub}}><div style={{fontSize:48,marginBottom:12}}>✏️</div><div style={{fontSize:13}}>Your journal is empty — begin your story</div></div>
                :jEntries.map(e=>(
                  <Card key={e.id} style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <div style={{fontSize:11,color:T.sub}}>{e.date} · {e.time}</div>
                      <div style={{fontSize:22}}>{MOODS[e.mood]}</div>
                    </div>
                    <div style={{height:3,borderRadius:2,background:MOODCOL[e.mood],marginBottom:10}}/>
                    <div style={{fontSize:13,color:T.text,lineHeight:1.75}}>{e.text}</div>
                  </Card>
                ))}
              </>
            ):(
              <Card>
                <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:14}}>How are you feeling?</div>
                <div style={{display:"flex",justifyContent:"space-around",marginBottom:18}}>
                  {MOODS.map((m,i)=><button key={i} onClick={()=>setJMood(i)} style={{background:"none",border:"none",fontSize:32,cursor:"pointer",opacity:jMood===i?1:0.3,transform:jMood===i?"scale(1.3)":"scale(1)",transition:"all 0.2s"}}>{m}</button>)}
                </div>
                <textarea value={jText} onChange={e=>setJText(e.target.value)} placeholder="Write freely — no judgement, just you..." style={{width:"100%",height:180,padding:"14px",borderRadius:14,border:`1px solid ${T.border}`,background:T.bg,fontSize:13,lineHeight:1.75,color:T.text,outline:"none"}}/>
                <div style={{display:"flex",gap:10,marginTop:14}}>
                  <button onClick={()=>setWriting(false)} style={{flex:1,padding:12,borderRadius:14,border:`2px solid ${T.border}`,background:"none",color:T.sub,fontSize:13,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Cancel</button>
                  <Btn style={{flex:2,padding:12}} onClick={()=>{if(jText.trim()){setJEntries(e=>[{id:Date.now(),text:jText,mood:jMood,date:new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short"}),time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})},...e]);setJText("");setJMood(2);setWriting(false);}}} full>Save Entry ✓</Btn>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* ── WALLET ── */}
      {tab==="wallet"&&(
        <div style={{animation:"fadeUp 0.3s ease"}}>
          <div style={{background:"linear-gradient(135deg,#1A1035,#3D2070)",padding:"36px 22px 28px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-50,right:-50,width:180,height:180,borderRadius:"50%",background:"rgba(155,127,212,0.07)"}}/>
            <Label>MindWell Wallet</Label>
            <div style={{fontFamily:"'Lora',serif",fontSize:44,color:"#fff",fontWeight:600,marginBottom:2,marginTop:8}}>{inr(balance)}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginBottom:6}}>Available balance</div>
            <div style={{background:"rgba(155,127,212,0.2)",borderRadius:12,padding:"8px 14px",display:"inline-block"}}>
              <span style={{fontSize:13,color:T.mint,fontWeight:700}}>⏱ {mins} session minutes remaining</span>
            </div>
          </div>
          <div style={{padding:16}}>
            <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:12}}>Recharge Plans</div>
            {[
              {label:"Starter",price:499,mins:30,tag:"",color:T.sky},
              {label:"Standard",price:799,mins:60,tag:"Popular 🔥",color:T.lavender},
              {label:"Premium",price:999,mins:100,tag:"Best Value ⭐",color:T.grad3},
              {label:"Plus ₹1499",price:1499,mins:180,tag:"Therapist Pick",color:T.mint},
            ].map(plan=>(
              <div key={plan.label} onClick={()=>{setRazPlan(plan);setShowRaz(true);}}
                className="hvr" style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fff",borderRadius:16,padding:"16px 18px",marginBottom:10,border:`1.5px solid ${T.border}`,cursor:"pointer"}}>
                <div><div style={{fontWeight:800,fontSize:14,color:T.dark}}>{inr(plan.price)} <span style={{fontSize:11,color:T.sub,fontWeight:400}}>= {plan.mins} mins</span></div>{plan.tag&&<div style={{fontSize:10,color:T.lavender,fontWeight:700,marginTop:2}}>{plan.tag}</div>}</div>
                <div style={{background:T.grad1,borderRadius:10,padding:"8px 16px",color:"#fff",fontSize:12,fontWeight:700}}>Recharge</div>
              </div>
            ))}
            <div style={{marginTop:20,fontSize:13,fontWeight:800,color:T.dark,marginBottom:12}}>Transaction History</div>
            {txns.length===0?<div style={{textAlign:"center",padding:24,color:T.sub,fontSize:13}}>No transactions yet</div>
            :txns.map((t,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
                <div><div style={{fontSize:13,fontWeight:700,color:T.dark}}>{t.label}</div><div style={{fontSize:11,color:T.sub}}>{t.date}{t.mins?` · ${t.mins} mins`:""}</div></div>
                <div style={{fontWeight:800,color:t.type==="credit"?"#26de81":T.coral,fontSize:14}}>{t.type==="credit"?"+":"-"}{inr(t.amt)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── AI CHAT ── */}
      {tab==="ai"&&(
        <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 74px)",animation:"fadeUp 0.3s ease"}}>
          <div style={{padding:"18px 16px 14px",background:"linear-gradient(135deg,#1A1035,#2D1B6B)"}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:42,height:42,borderRadius:14,background:T.grad1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🤖</div>
              <div>
                <div style={{fontWeight:800,color:"#fff",fontSize:15}}>MindBot</div>
                <div style={{fontSize:11,color:T.mint}}>● AI Wellness Companion · Always here</div>
              </div>
            </div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:8}}>Your conversation privately informs your therapist's approach</div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"16px 14px",display:"flex",flexDirection:"column",gap:10}}>
            {aiMsgs.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"82%",padding:"12px 16px",borderRadius:20,background:m.role==="user"?T.grad1:"#fff",color:m.role==="user"?"#fff":T.text,fontSize:13,lineHeight:1.65,borderBottomRightRadius:m.role==="user"?4:20,borderBottomLeftRadius:m.role==="user"?20:4,boxShadow:"0 2px 10px rgba(99,74,150,0.09)",border:m.role==="assistant"?`1px solid ${T.border}`:"none",animation:"fadeUp 0.3s ease"}}>{m.text}</div>
              </div>
            ))}
            {aiLoad&&<div style={{display:"flex",gap:5,padding:"6px 12px"}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:T.lavender,animation:`bounce 0.6s infinite ${i*0.15}s`}}/>)}</div>}
            <div ref={aiEnd}/>
          </div>
          {summary&&(
            <div style={{margin:"0 12px 10px",background:"#E8F5E9",borderRadius:14,padding:14,border:"1px solid #A5D6A7",maxHeight:160,overflowY:"auto"}}>
              <div style={{fontSize:10,fontWeight:800,color:"#2E7D32",marginBottom:6,textTransform:"uppercase",letterSpacing:1.5}}>✓ Practitioner Summary Generated</div>
              <div style={{fontSize:11,color:"#1B5E20",lineHeight:1.7,whiteSpace:"pre-line"}}>{summary}</div>
            </div>
          )}
          <div style={{padding:"10px 12px 12px",background:"#fff",borderTop:`1px solid ${T.border}`}}>
            {aiMsgs.length>3&&!summary&&(
              <button onClick={genSummary} disabled={sumLoad} style={{width:"100%",padding:"9px",borderRadius:12,border:"none",background:"#E8F5E9",color:"#2E7D32",fontSize:12,fontWeight:700,cursor:"pointer",marginBottom:8,fontFamily:"'Nunito',sans-serif"}}>
                {sumLoad?"⏳ Generating...":"📋 Generate Practitioner Summary"}
              </button>
            )}
            <div style={{display:"flex",gap:8}}>
              <input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendAI()} placeholder="Share what's on your mind..." style={{flex:1,padding:"12px 16px",borderRadius:22,border:`1px solid ${T.border}`,background:T.bg,fontSize:13,outline:"none",color:T.text}}/>
              <button onClick={sendAI} style={{width:44,height:44,borderRadius:"50%",border:"none",background:T.grad1,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.send}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── PROFILE ── */}
      {tab==="profile"&&(
        <div style={{animation:"fadeUp 0.3s ease"}}>
          <div style={{background:"linear-gradient(135deg,#1A1035,#2D1B6B)",padding:"36px 20px 28px",textAlign:"center"}}>
            <div style={{width:80,height:80,borderRadius:26,background:T.grad1,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:30,margin:"0 auto 14px"}}>{userName[0]?.toUpperCase()}</div>
            <div style={{fontFamily:"'Lora',serif",fontSize:24,color:"#fff",fontWeight:600}}>{userName}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:4}}>{lang} · {therapyFor||"Individual"}</div>
            <div style={{display:"flex",gap:20,justifyContent:"center",marginTop:16}}>
              {[[sessions.length,"Sessions"],[mins,"Mins left"],[jEntries.length,"Journals"]].map(([v,l])=>(
                <div key={l} style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:900,color:"#fff"}}>{v}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>{l}</div></div>
              ))}
            </div>
          </div>
          <div style={{padding:16}}>
            {/* Sessions History */}
            {sessions.length>0&&<>
              <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:12}}>Session History</div>
              {sessions.map((s,i)=>(
                <Card key={i} style={{marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><div style={{fontWeight:700,fontSize:13,color:T.dark}}>{s.therapist.name}</div><div style={{fontSize:11,color:T.sub}}>{s.date} · {s.mode} · {s.duration} min</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontWeight:800,color:T.coral,fontSize:12}}>-{inr(s.cost||0)}</div><div style={{fontSize:10,color:T.sub}}>Completed</div></div>
                </Card>
              ))}
            </>}
            {/* Settings */}
            <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:12,marginTop:sessions.length?16:0}}>Settings</div>
            {[
              {icon:"🌐",label:"Language",val:lang},
              {icon:"💰",label:"Wallet",val:inr(balance)},
              {icon:"🔔",label:"Notifications",val:"On"},
              {icon:"🆘",label:"Emergency Contact",val:"Set up"},
              {icon:"🔒",label:"Privacy & Data",val:""},
              {icon:"💬",label:"Help & Support",val:""},
            ].map((item,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:`1px solid ${T.border}`,cursor:"pointer"}}>
                <div style={{display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{width:38,height:38,borderRadius:12,background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{item.icon}</div>
                  <div style={{fontWeight:600,fontSize:14,color:T.dark}}>{item.label}</div>
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center",color:T.sub,fontSize:12}}>{item.val}<span style={{fontSize:16}}>›</span></div>
              </div>
            ))}
            <button onClick={()=>setScreen("welcome")} style={{width:"100%",marginTop:24,padding:14,borderRadius:16,border:`2px solid ${T.coral}`,background:"none",color:T.coral,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Log Out</button>
          </div>
        </div>
      )}

      {/* ── BOTTOM NAV ── */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"rgba(255,255,255,0.97)",backdropFilter:"blur(16px)",borderTop:`1px solid ${T.border}`,display:"flex",zIndex:50,padding:"8px 0 10px"}}>
        {[
          {id:"home",l:"Home",ic:Ic.home},
          {id:"therapists",l:"Therapists",ic:Ic.search},
          {id:"journal",l:"Journal",ic:Ic.journal},
          {id:"ai",l:"AI Chat",ic:Ic.ai},
          {id:"wallet",l:"Wallet",ic:Ic.wallet},
          {id:"profile",l:"Profile",ic:Ic.profile},
        ].map(({id,l,ic})=>(
          <button key={id} onClick={()=>{setTab(id);setSelTherapist(null);setInSession(false);setShowRating(false);}}
            style={{flex:1,border:"none",background:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,color:tab===id?T.lavender:T.sub,padding:"4px 2px",transition:"color 0.2s"}}>
            {ic}<span style={{fontSize:8,fontWeight:tab===id?900:500}}>{l}</span>
          </button>
        ))}
      </div>

      {/* ── RAZORPAY MODAL ── */}
      {showRaz&&razPlan&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center",maxWidth:430,margin:"0 auto",left:"50%",transform:"translateX(-50%)",width:"100%"}}>
          <div style={{background:"#fff",borderRadius:"28px 28px 0 0",padding:24,width:"100%",animation:"slideUp 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <div>
                <div style={{fontWeight:900,fontSize:20,color:T.razBlue,letterSpacing:-1}}>razorpay</div>
                <div style={{fontSize:10,color:T.sub,marginTop:1}}>Demo Mode · No real payment</div>
              </div>
              <button onClick={()=>setShowRaz(false)} style={{width:34,height:34,borderRadius:"50%",background:"#F5F5F5",border:"none",cursor:"pointer",fontSize:18,color:"#666"}}>×</button>
            </div>
            <div style={{background:`linear-gradient(135deg,${T.razBlue},#1a3a7a)`,borderRadius:18,padding:"20px",marginBottom:18,color:"#fff",textAlign:"center"}}>
              <div style={{fontSize:11,opacity:0.6,marginBottom:4}}>{razPlan.label} Plan · {razPlan.mins} minutes</div>
              <div style={{fontSize:36,fontWeight:900}}>{inr(razPlan.price)}</div>
            </div>
            {[{l:"UPI / Google Pay / PhonePe",i:"📱"},{l:"Credit / Debit Card",i:"💳"},{l:"Net Banking",i:"🏦"},{l:"EMI (No Cost)",i:"📊"}].map(opt=>(
              <button key={opt.l} onClick={confirmRazorpay} style={{width:"100%",padding:"14px 16px",borderRadius:14,border:`1px solid ${T.border}`,background:"#fff",display:"flex",alignItems:"center",gap:12,marginBottom:8,cursor:"pointer",fontSize:13,color:T.dark,fontFamily:"'Nunito',sans-serif",fontWeight:600}}>
                <span style={{fontSize:22}}>{opt.i}</span>{opt.l}<span style={{marginLeft:"auto",color:T.sub,fontSize:16}}>›</span>
              </button>
            ))}
            <div style={{textAlign:"center",marginTop:10,fontSize:10,color:T.sub}}>🔒 256-bit SSL · Secured by Razorpay India</div>
          </div>
        </div>
      )}

      {/* ── SOS MODAL ── */}
      {showSOS&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center",maxWidth:430,margin:"0 auto",left:"50%",transform:"translateX(-50%)",width:"100%"}}>
          <div style={{background:"#fff",borderRadius:"28px 28px 0 0",padding:28,width:"100%",animation:"slideUp 0.3s ease"}}>
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B6B,#ee0979)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 14px",animation:"pulse 1.5s ease infinite"}}>🆘</div>
              <div style={{fontFamily:"'Lora',serif",fontSize:22,fontWeight:600,color:T.dark,marginBottom:4}}>You are not alone</div>
              <div style={{fontSize:13,color:T.sub,lineHeight:1.7}}>It's okay to ask for help. We're here for you right now.</div>
            </div>
            {[
              {icon:"👩‍⚕️",title:"Talk to a Therapist Now",sub:"Connect instantly with an available therapist",col:"linear-gradient(135deg,#5B8DEF,#9B7FD4)",action:()=>{setShowSOS(false);setTab("therapists");}},
              {icon:"🤖",title:"Talk to MindBot AI",sub:"Anonymous, immediate support 24/7",col:"linear-gradient(135deg,#4ECDC4,#26de81)",action:()=>{setShowSOS(false);setTab("ai");}},
              {icon:"📞",title:"iCall Helpline",sub:"022-25521111 · Free, confidential",col:"linear-gradient(135deg,#F7B731,#FF6B6B)",action:()=>setShowSOS(false)},
            ].map(opt=>(
              <button key={opt.title} onClick={opt.action} style={{width:"100%",padding:"16px 18px",borderRadius:18,border:"none",background:opt.col,color:"#fff",marginBottom:10,display:"flex",alignItems:"center",gap:14,cursor:"pointer",textAlign:"left",fontFamily:"'Nunito',sans-serif"}}>
                <span style={{fontSize:26}}>{opt.icon}</span>
                <div><div style={{fontWeight:800,fontSize:14}}>{opt.title}</div><div style={{fontSize:11,opacity:0.8,marginTop:2}}>{opt.sub}</div></div>
              </button>
            ))}
            <button onClick={()=>setShowSOS(false)} style={{width:"100%",padding:14,borderRadius:14,border:`2px solid ${T.border}`,background:"none",color:T.sub,fontSize:13,cursor:"pointer",fontFamily:"'Nunito',sans-serif",marginTop:4}}>I'm okay, close this</button>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {showNotifs&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:150,display:"flex",alignItems:"flex-end",justifyContent:"center",maxWidth:430,margin:"0 auto",left:"50%",transform:"translateX(-50%)",width:"100%"}}>
          <div style={{background:"#fff",borderRadius:"28px 28px 0 0",padding:24,width:"100%",maxHeight:"70vh",overflowY:"auto",animation:"slideUp 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontFamily:"'Lora',serif",fontSize:20,fontWeight:600,color:T.dark}}>Notifications</div>
              <button onClick={()=>setShowNotifs(false)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:T.sub}}>×</button>
            </div>
            {NOTIFS.map((n,i)=>(
              <div key={i} style={{display:"flex",gap:12,padding:"14px 0",borderBottom:`1px solid ${T.border}`,opacity:n.read?0.6:1}}>
                <div style={{width:42,height:42,borderRadius:14,background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{n.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13,color:T.dark,marginBottom:2}}>{n.title}</div>
                  <div style={{fontSize:12,color:T.sub,lineHeight:1.5}}>{n.body}</div>
                  <div style={{fontSize:10,color:T.sub,marginTop:4}}>{n.time}</div>
                </div>
                {!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:T.lavender,marginTop:4,flexShrink:0}}/>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
