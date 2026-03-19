import { useState, useEffect, useRef } from "react";

// ════════════════════════════════════════════════════════════════
// 🔑  REPLACE THESE KEYS — EVERYTHING ELSE IS DONE
// ════════════════════════════════════════════════════════════════
const ANTHROPIC_KEY    = "sk-ant-YOUR_KEY_HERE";       // console.anthropic.com
const RAZORPAY_KEY     = "rzp_live_YOUR_KEY_HERE";     // dashboard.razorpay.com
const MSG91_KEY        = "YOUR_MSG91_KEY_HERE";        // msg91.com → API Keys
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";     // console.cloud.google.com → Credentials → OAuth 2.0
const APPLE_SERVICE_ID = "YOUR_APPLE_SERVICE_ID";     // developer.apple.com → Certificates → Sign In with Apple
// ════════════════════════════════════════════════════════════════
const ADMIN_EMAIL = "admin@mindwell.in";
const ADMIN_PWD   = "MindWell@Admin2026";
// ════════════════════════════════════════════════════════════════

// ── OTP via MSG91 ──────────────────────────────────────────────
let _demoOTP = "";
const sendOTP = async (phone) => {
  if (MSG91_KEY.startsWith("YOUR")) {
    _demoOTP = String(Math.floor(100000 + Math.random() * 900000));
    return { ok: true, demo: true, otp: _demoOTP };
  }
  try {
    const r = await fetch(`https://control.msg91.com/api/v5/otp?mobile=91${phone}&authkey=${MSG91_KEY}&otp_length=6&message=Your+MindWell+OTP+is+%7BOTP%7D.+Valid+for+10+minutes.`,{ method:"GET" });
    return { ok: r.ok };
  } catch { return { ok: false }; }
};
const verifyOTP = async (phone, otp) => {
  if (MSG91_KEY.startsWith("YOUR")) return otp === _demoOTP;
  try {
    const r = await fetch(`https://control.msg91.com/api/v5/otp/verify?mobile=91${phone}&otp=${otp}&authkey=${MSG91_KEY}`,{ method:"GET" });
    const d = await r.json(); return d.type === "success";
  } catch { return false; }
};

const hashPwd = async (pwd) => {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(pwd + "mw_salt_2026"));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("");
};

const getPracs    = () => { try { return JSON.parse(localStorage.getItem("mw_pracs")||"[]"); } catch { return []; } };
const savePracs   = p  => localStorage.setItem("mw_pracs", JSON.stringify(p));
const getClients  = () => { try { return JSON.parse(localStorage.getItem("mw_clients")||"[]"); } catch { return []; } };
const saveClients = c  => localStorage.setItem("mw_clients", JSON.stringify(c));
const getSessions = () => { try { return JSON.parse(localStorage.getItem("mw_shared_sessions")||"[]"); } catch { return []; } };

const GCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
  ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#E8E0F5;border-radius:4px;}
  body,input,textarea,button,select{font-family:'Nunito',sans-serif;}
  textarea{resize:none;}
  input::placeholder,textarea::placeholder{color:#B5A8C0;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
  @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
  @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .hvr{transition:transform 0.18s,box-shadow 0.18s;cursor:pointer;}.hvr:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(99,74,150,0.15);}
  .spin{animation:spin 0.9s linear infinite;}
  @media(min-width:768px){
    .app-shell{display:grid;grid-template-columns:240px 1fr;min-height:100vh;}
    .sidebar{background:#1A1035;min-height:100vh;padding:28px 18px;position:sticky;top:0;height:100vh;overflow-y:auto;}
    .main-area{background:#F7F4FE;min-height:100vh;overflow-y:auto;}
    .page-pad{max-width:720px;margin:0 auto;padding:28px 24px;}
    .bot-nav{display:none!important;}
  }
  @media(max-width:767px){
    .app-shell{display:block;}
    .sidebar{display:none!important;}
    .main-area{background:#F7F4FE;}
    .page-pad{padding:0 0 82px;}
  }
`;

const T={
  sky:"#5B8DEF",mint:"#4ECDC4",lav:"#9B7FD4",coral:"#FF6B6B",gold:"#F7B731",green:"#26de81",
  dark:"#1A1035",text:"#2D2048",sub:"#7B6EA0",border:"#E8E0F5",bg:"#F7F4FE",
  g1:"linear-gradient(135deg,#5B8DEF,#9B7FD4)",g2:"linear-gradient(135deg,#4ECDC4,#26de81)",
  g3:"linear-gradient(135deg,#9B7FD4,#FF6B6B)",g4:"linear-gradient(135deg,#F7B731,#FF6B6B)",
  gd:"linear-gradient(135deg,#1A1035,#2D1B6B)"
};

const Ic={
  home:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  search:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  journal:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  wallet:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  ai:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  community:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  blog:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  profile:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  back:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  send:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  star:<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  heart:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  bell:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  sos:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  eye:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeoff:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  check:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  phone:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6z"/></svg>,
  video:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  chat:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  admin:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
};

const inr = n => `₹${Number(n).toLocaleString("en-IN")}`;

const Card = ({children,style={}}) => (
  <div style={{background:"#fff",borderRadius:18,padding:16,boxShadow:"0 2px 16px rgba(99,74,150,0.07)",border:"1px solid #E8E0F5",...style}}>{children}</div>
);
const Badge = ({children,color=T.sky}) => (
  <span style={{background:`${color}22`,color,fontSize:10,padding:"3px 9px",borderRadius:8,fontWeight:700,display:"inline-block"}}>{children}</span>
);
const Btn = ({children,onClick,style={},grad=T.g1,full=false,ghost=false,sm=false,disabled=false,loading=false}) => (
  <button onClick={onClick} disabled={disabled||loading}
    style={{width:full?"100%":"auto",padding:sm?"8px 16px":"13px 20px",borderRadius:13,border:ghost?`2px solid ${T.lav}`:"none",background:ghost?"transparent":disabled||loading?"#C5B8D8":grad,color:ghost?T.lav:"#fff",fontSize:sm?12:14,fontWeight:700,cursor:disabled||loading?"not-allowed":"pointer",fontFamily:"'Nunito',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:7,...style}}>
    {loading&&<div style={{width:14,height:14,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff"}} className="spin"/>}
    {children}
  </button>
);
const PwdInput = ({label,value,onChange,placeholder,err,onKeyDown}) => {
  const [show,setShow] = useState(false);
  return (
    <div style={{marginBottom:14}}>
      {label&&<div style={{fontSize:11,fontWeight:700,color:T.text,marginBottom:5}}>{label}</div>}
      <div style={{position:"relative"}}>
        <input type={show?"text":"password"} value={value} onChange={onChange} onKeyDown={onKeyDown} placeholder={placeholder||"••••••••"}
          style={{width:"100%",padding:"12px 40px 12px 14px",borderRadius:12,border:`1.5px solid ${err?"#FF6B6B":"#E8E0F5"}`,background:"#fff",fontSize:14,outline:"none",color:T.text}}
          onFocus={e=>e.target.style.borderColor=T.lav} onBlur={e=>e.target.style.borderColor=err?"#FF6B6B":"#E8E0F5"}/>
        <button type="button" onClick={()=>setShow(s=>!s)} style={{position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:T.sub,cursor:"pointer"}}>{show?Ic.eyeoff:Ic.eye}</button>
      </div>
      {err&&<div style={{color:T.coral,fontSize:11,marginTop:4}}>{err}</div>}
    </div>
  );
};

const ISSUES=[{l:"Stress & Burnout",i:"🔥"},{l:"Anxiety",i:"💭"},{l:"Depression",i:"🌧"},{l:"Relationships",i:"💔"},{l:"Grief & Loss",i:"🕊"},{l:"Family Issues",i:"🏠"},{l:"Self-Growth",i:"🌱"},{l:"Trauma & PTSD",i:"💫"},{l:"Sleep Problems",i:"😴"},{l:"Addiction",i:"🔗"},{l:"Anger",i:"😤"},{l:"Loneliness",i:"🫂"}];
const MOODS=["😭","😔","😐","🙂","😄"];
const MOODL=["Terrible","Bad","Okay","Good","Great"];
const MOODC=["#EF9A9A","#FFCC80","#FFF59D","#C5E1A5","#A5D6A7"];
const RECHARGEPLANS=[499,799,999,1499,1999,2499,2999];
const PROMPTS=["What made you smile today?","Describe one emotion you felt strongly today.","What's weighing on your heart right now?","Write a letter to your future self.","What are three things you're grateful for?","What would you tell a friend going through what you're going through?"];

const DEMO_DOCS=[
  {id:1,name:"Dr. Priya Sharma",title:"Clinical Psychologist",city:"New Delhi",lang:["Hindi","English"],specs:["Anxiety","Depression","Stress","Burnout"],rating:4.9,reviews:312,color:T.sky,initials:"PS",hourly:800,online:true,exp:"12 yrs",gender:"Female",modes:["chat","audio","video"],bio:"Specialises in CBT and mindfulness for anxiety and depression. Trained at NIMHANS Bangalore. Available in Hindi and English.",reviewList:[{name:"Ananya R.",stars:5,text:"Dr. Priya completely changed how I deal with anxiety. Warm, patient, and gives real tools."},{name:"Vikash T.",stars:5,text:"She helped me through a really dark phase. Highly recommend."}]},
  {id:2,name:"Dr. Arjun Mehta",title:"Psychiatrist",city:"Mumbai",lang:["Hindi","Marathi","English"],specs:["ADHD","Bipolar","Trauma","Medication"],rating:4.95,reviews:489,color:T.mint,initials:"AM",hourly:1400,online:true,exp:"15 yrs",gender:"Male",modes:["audio","video"],bio:"Senior psychiatrist with expertise in complex mood disorders and trauma-informed care.",reviewList:[{name:"Rohan S.",stars:5,text:"Dr. Mehta finally explained my ADHD in a way I could understand."},{name:"Pooja N.",stars:5,text:"The most knowledgeable psychiatrist I've met."}]},
  {id:3,name:"Kavya Nair",title:"Relationship Counselor",city:"Bengaluru",lang:["Malayalam","Kannada","English"],specs:["Relationships","Grief","Self-esteem","Loneliness"],rating:4.8,reviews:201,color:T.lav,initials:"KN",hourly:650,online:true,exp:"8 yrs",gender:"Female",modes:["chat","audio","video"],bio:"A warm, compassionate space to heal, reconnect, and understand your relationships better.",reviewList:[{name:"Deepika M.",stars:5,text:"Kavya helped me rebuild my self-worth after a toxic relationship."},{name:"Siddharth P.",stars:4,text:"Very empathetic and non-judgmental."}]},
  {id:4,name:"Dr. Sneha Iyer",title:"CBT Therapist",city:"Chennai",lang:["Tamil","English"],specs:["OCD","Phobias","Anxiety","Sleep"],rating:4.85,reviews:267,color:T.gold,initials:"SI",hourly:750,online:true,exp:"9 yrs",gender:"Female",modes:["chat","video"],bio:"Breaking free from unhelpful thought patterns through structured, evidence-based CBT.",reviewList:[{name:"Meera S.",stars:5,text:"Dr. Sneha's CBT approach really worked for my OCD."}]},
  {id:5,name:"Dr. Farheen Qureshi",title:"LGBTQ+ Affirming Therapist",city:"Delhi",lang:["Hindi","Urdu","English"],specs:["LGBTQ+","Identity","Coming Out","Family"],rating:4.95,reviews:312,color:"#FD79A8",initials:"FQ",hourly:850,online:true,exp:"12 yrs",gender:"Female",modes:["chat","audio","video"],bio:"A safe, affirming space for LGBTQ+ individuals navigating identity and family challenges in India.",reviewList:[{name:"Rohan K.",stars:5,text:"First therapist who didn't try to 'fix' me."},{name:"Aisha T.",stars:5,text:"Incredibly affirming. I felt seen for the first time."}]},
  {id:6,name:"Dr. Sameer Joshi",title:"Mindfulness Coach",city:"Pune",lang:["Marathi","Hindi","English"],specs:["Mindfulness","Stress","Sleep","Meditation"],rating:4.82,reviews:256,color:T.mint,initials:"SJ",hourly:600,online:true,exp:"9 yrs",gender:"Male",modes:["chat","audio","video"],bio:"Combining clinical psychology with mindfulness, breathwork, and meditation.",reviewList:[{name:"Pallavi S.",stars:5,text:"Dr. Sameer's meditation techniques cured my insomnia."}]},
];

const BLOGS=[
  {id:1,author:"Dr. Priya Sharma",role:"Clinical Psychologist",title:"5-Minute Box Breathing: Your Instant Anxiety Reset",body:"When anxiety spikes, your nervous system enters overdrive. Box breathing — inhale 4s, hold 4s, exhale 4s, hold 4s — directly activates your parasympathetic nervous system. Do 4 cycles and you will physically feel your heart rate drop. I teach this to every patient as a first-response tool. The beauty is you can do it anywhere — in a meeting, on a bus, before a difficult conversation. Your breath is the only part of your autonomic nervous system you can consciously control, which makes it the master key to your anxiety response.",emoji:"🌬️",tag:"Breathwork",likes:234,color:T.sky},
  {id:2,author:"Dr. Sameer Joshi",role:"Mindfulness Coach",title:"Why 10 Minutes of Morning Meditation Changes Everything",body:"The brain's default mode network — responsible for rumination and worry — is most active in the morning. A simple 10-minute sitting practice, just observing breath without judging thoughts, structurally changes how the DMN fires over time. Harvard Medical School research shows that 8 weeks of consistent meditation physically thickens the prefrontal cortex — the area responsible for decision-making and emotional regulation.",emoji:"🧘",tag:"Meditation",likes:189,color:T.lav},
  {id:3,author:"Kavya Nair",role:"Relationship Counselor",title:"Gratitude Journaling: The Research Is Overwhelming",body:"Three studies in the Journal of Positive Psychology show that writing three specific things you're grateful for increases long-term wellbeing by 25%. The practice trains selective attention — your brain begins scanning the environment for positives rather than threats. Do this for 21 days and the shift in perspective becomes automatic.",emoji:"📓",tag:"Journaling",likes:278,color:T.green},
  {id:4,author:"Dr. Farheen Qureshi",role:"LGBTQ+ Therapist",title:"Reading Books as Therapy: Bibliotherapy Explained",body:"Bibliotherapy — using literature as a therapeutic tool — is increasingly evidence-backed. When you see your struggles mirrored in a character, your brain releases oxytocin and reduces cortisol. Fiction builds empathy circuits. Books that consistently help: 'When Breath Becomes Air', 'The Body Keeps the Score', 'Man's Search for Meaning'.",emoji:"📚",tag:"Reading",likes:167,color:"#FD79A8"},
];

const INIT_COMMUNITY=[
  {id:1,author:"Riya S.",text:"I've been using MindWell for 3 months and I genuinely feel like a different person. For anyone on the fence — just try one session.",likes:47,replies:[{author:"Arjun M.",text:"So happy for you! It really works 💙"},{author:"Meera P.",text:"This gives me hope. Starting my first session next week!"}]},
  {id:2,author:"Anonymous",text:"Does anyone else feel weird about talking to a therapist online? Any tips?",likes:23,replies:[{author:"Dr. Sameer Joshi",text:"Very common! Give it 2 sessions — most people find they prefer being in their own safe space."}]},
  {id:3,author:"Vikash T.",text:"Tried the box breathing from Dr. Priya's blog during a panic attack at work. It actually worked???",likes:89,replies:[{author:"Dr. Priya Sharma",text:"So happy this helped! Keep it up! 🌬️"}]},
];

// ═══════════════════════════════════════════════════════
// AUTH SCREENS
// ═══════════════════════════════════════════════════════

function Splash({onNext}) {
  return (
    <div onClick={onNext} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(160deg,#1A1035,#2D1B6B,#4A2D9E)",minHeight:"100vh",cursor:"pointer",position:"relative",overflow:"hidden",fontFamily:"'Nunito',sans-serif"}}>
      <div style={{position:"absolute",top:"8%",left:"8%",width:220,height:220,borderRadius:"50%",background:"rgba(91,141,239,0.06)"}}/>
      <div style={{position:"absolute",bottom:"12%",right:"3%",width:300,height:300,borderRadius:"50%",background:"rgba(155,127,212,0.05)"}}/>
      <div style={{animation:"pulse 2.5s ease infinite",marginBottom:28}}>
        <div style={{width:110,height:110,borderRadius:32,background:T.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:54,boxShadow:"0 20px 60px #9B7FD477"}}>🌿</div>
      </div>
      <div style={{fontFamily:"'Lora',serif",fontSize:44,fontWeight:600,color:"#fff",letterSpacing:-1,animation:"fadeUp 0.8s ease 0.2s both"}}>MindWell</div>
      <div style={{fontSize:15,color:"rgba(255,255,255,0.45)",marginTop:8,letterSpacing:4,textTransform:"uppercase",animation:"fadeUp 0.8s ease 0.5s both"}}>Talk. Heal. Grow.</div>
      <div style={{position:"absolute",bottom:26,fontSize:11,color:"rgba(255,255,255,0.2)",animation:"fadeUp 0.8s ease 1s both"}}>🇮🇳 Made for India with ❤️</div>
    </div>
  );
}

function Landing({goClient,goPrac,goAdmin}) {
  return (
    <div style={{fontFamily:"'Nunito',sans-serif",background:"linear-gradient(160deg,#1A1035,#2D1B6B)",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{textAlign:"center",marginBottom:36,animation:"fadeUp 0.5s ease"}}>
        <div style={{width:72,height:72,borderRadius:22,background:T.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,margin:"0 auto 16px",boxShadow:"0 12px 32px #9B7FD455"}}>🌿</div>
        <div style={{fontFamily:"'Lora',serif",fontSize:30,fontWeight:600,color:"#fff"}}>MindWell</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:5,letterSpacing:2,textTransform:"uppercase"}}>India's Mental Wellness Platform</div>
      </div>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",textAlign:"center",marginBottom:16,textTransform:"uppercase",letterSpacing:2}}>I am a</div>
        {[
          {label:"Client",sub:"I'm looking for support and therapy",icon:"🙏",action:goClient,grad:T.g1},
          {label:"Practitioner",sub:"I'm a therapist or mental health professional",icon:"👩‍⚕️",action:goPrac,grad:"linear-gradient(135deg,#4ECDC4,#26de81)"},
        ].map(opt=>(
          <button key={opt.label} onClick={opt.action} className="hvr"
            style={{width:"100%",padding:"20px",borderRadius:20,border:"none",background:"rgba(255,255,255,0.07)",cursor:"pointer",display:"flex",alignItems:"center",gap:16,marginBottom:13,textAlign:"left"}}>
            <div style={{width:54,height:54,borderRadius:17,background:opt.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0,boxShadow:"0 6px 20px rgba(0,0,0,0.3)"}}>{opt.icon}</div>
            <div style={{flex:1}}><div style={{fontWeight:800,fontSize:16,color:"#fff",marginBottom:3}}>{opt.label}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.4)",lineHeight:1.4}}>{opt.sub}</div></div>
            <div style={{color:"rgba(255,255,255,0.25)",fontSize:22}}>›</div>
          </button>
        ))}
        <button onClick={goAdmin} style={{width:"100%",padding:"11px",borderRadius:13,border:"1px solid rgba(255,255,255,0.08)",background:"none",color:"rgba(255,255,255,0.2)",fontSize:11,cursor:"pointer",fontFamily:"'Nunito',sans-serif",marginTop:6,display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
          {Ic.admin} Admin Portal
        </button>
      </div>
    </div>
  );
}

function ClientAuth({goBack,goPrac,onSuccess}) {
  const [mode,setMode] = useState("signup");
  const [phone,setPhone] = useState(""); const [name,setName] = useState(""); const [otp,setOtp] = useState("");
  const [sent,setSent] = useState(false); const [err,setErr] = useState(""); const [loading,setLoading] = useState(false);
  const [demoMsg,setDemoMsg] = useState("");
  const [oauthLoading,setOauthLoading] = useState(null); // "google" | "apple" | null

  // ── Load OAuth SDKs on mount ─────────────────────────────────
  useEffect(()=>{
    // Google Identity Services
    if (!GOOGLE_CLIENT_ID.startsWith("YOUR") && !document.getElementById("gsi-script")) {
      const s = document.createElement("script"); s.id="gsi-script";
      s.src = "https://accounts.google.com/gsi/client"; s.async = true; s.defer = true;
      document.head.appendChild(s);
    }
    // Apple Sign In
    if (!APPLE_SERVICE_ID.startsWith("YOUR") && !document.getElementById("apple-script")) {
      const s = document.createElement("script"); s.id="apple-script";
      s.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
      s.async = true; s.defer = true; document.head.appendChild(s);
    }
  },[]);

  // ── Helpers ──────────────────────────────────────────────────
  const loginWithOAuthUser = (u) => {
    const all = getClients();
    const existing = all.find(c=>c.email===u.email);
    const user = existing || {...u, joinDate:new Date().toLocaleDateString("en-IN")};
    if (!existing) { all.push(user); saveClients(all); }
    onSuccess(user);
  };

  // ── Google Sign-In ───────────────────────────────────────────
  const doGoogle = () => {
    if (GOOGLE_CLIENT_ID.startsWith("YOUR")) {
      setErr("Set your GOOGLE_CLIENT_ID constant at the top of the file to enable Google Sign-In."); return;
    }
    setOauthLoading("google"); setErr("");
    const waitForGSI = setInterval(()=>{
      if (window.google?.accounts?.id) {
        clearInterval(waitForGSI);
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (res) => {
            setOauthLoading(null);
            try {
              // Decode the JWT credential to get name + email
              const payload = JSON.parse(atob(res.credential.split(".")[1]));
              loginWithOAuthUser({ name: payload.name, email: payload.email, phone: "", avatar: payload.picture, provider: "google" });
            } catch { setErr("Google sign-in failed. Please try again."); }
          },
          error_callback: () => { setOauthLoading(null); setErr("Google sign-in was cancelled."); }
        });
        window.google.accounts.id.prompt(notification => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback: render button in hidden div and click it
            const div = document.createElement("div"); div.style.display="none"; document.body.appendChild(div);
            window.google.accounts.id.renderButton(div, {type:"standard"});
            div.querySelector("[data-identifier]")?.click();
          }
        });
      }
    }, 200);
    setTimeout(()=>{ clearInterval(waitForGSI); if(oauthLoading==="google"){setOauthLoading(null);setErr("Google sign-in timed out. Check your Client ID.");} },10000);
  };

  // ── Apple Sign-In ────────────────────────────────────────────
  const doApple = async () => {
    if (APPLE_SERVICE_ID.startsWith("YOUR")) {
      setErr("Set your APPLE_SERVICE_ID constant at the top of the file to enable Apple Sign-In."); return;
    }
    if (!window.AppleID) { setErr("Apple Sign-In SDK not loaded. Check your Service ID."); return; }
    setOauthLoading("apple"); setErr("");
    try {
      window.AppleID.auth.init({
        clientId: APPLE_SERVICE_ID,
        scope: "name email",
        redirectURI: window.location.origin,
        usePopup: true,
      });
      const data = await window.AppleID.auth.signIn();
      const name = data.user ? `${data.user.name?.firstName||""} ${data.user.name?.lastName||""}`.trim() : "Apple User";
      const email = data.user?.email || data.authorization?.id_token ? JSON.parse(atob(data.authorization.id_token.split(".")[1])).email : "";
      loginWithOAuthUser({ name: name||"Apple User", email, phone: "", provider: "apple" });
    } catch(e) {
      if (e?.error !== "popup_closed_by_user") setErr("Apple sign-in failed. Please try again.");
    }
    setOauthLoading(null);
  };

  // ── Phone OTP ────────────────────────────────────────────────
  const doSend = async () => {
    if (mode==="signup" && !name.trim()) { setErr("Please enter your full name."); return; }
    if (phone.length!==10||!/^\d+$/.test(phone)) { setErr("Enter a valid 10-digit mobile number."); return; }
    setErr(""); setLoading(true);
    const res = await sendOTP(phone); setLoading(false);
    if (res.ok) { setSent(true); if(res.demo) setDemoMsg(`Demo OTP: ${res.otp}`); }
    else setErr("Failed to send OTP. Please try again.");
  };
  const doVerify = async () => {
    if (otp.length!==6) { setErr("Enter the 6-digit OTP."); return; }
    setErr(""); setLoading(true);
    const ok = await verifyOTP(phone, otp); setLoading(false);
    if (!ok) { setErr("Incorrect OTP. Please try again."); return; }
    const all = getClients(); const existing = all.find(c=>c.phone===phone);
    if (mode==="login" && !existing) { setErr("No account found. Please sign up first."); return; }
    const u = existing || {name,phone,joinDate:new Date().toLocaleDateString("en-IN")};
    if (!existing) { all.push(u); saveClients(all); }
    setDemoMsg(""); onSuccess(u);
  };

  return (
    <div style={{fontFamily:"'Nunito',sans-serif",background:"linear-gradient(160deg,#F7F4FE,#EDE5FF)",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:440,animation:"fadeUp 0.5s ease"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{width:60,height:60,borderRadius:18,background:T.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 12px",boxShadow:"0 8px 24px #9B7FD444"}}>🌿</div>
          <div style={{fontFamily:"'Lora',serif",fontSize:25,fontWeight:600,color:T.dark}}>MindWell</div>
          <div style={{fontSize:12,color:T.sub,marginTop:4}}>India's Mental Wellness Platform</div>
        </div>
        <Card>
          {/* Tab switcher */}
          <div style={{display:"flex",background:"#F0EBF8",borderRadius:13,padding:4,marginBottom:22}}>
            {[["signup","Sign Up"],["login","Log In"]].map(([m,l])=>(
              <button key={m} onClick={()=>{setMode(m);setSent(false);setErr("");setDemoMsg("");setOtp("");}}
                style={{flex:1,padding:"11px",border:"none",borderRadius:10,background:mode===m?"#fff":"none",color:mode===m?T.lav:T.sub,fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"'Nunito',sans-serif",boxShadow:mode===m?"0 2px 10px rgba(99,74,150,0.12)":"none",transition:"all 0.2s"}}>
                {l}
              </button>
            ))}
          </div>

          {/* ── SOCIAL LOGIN BUTTONS ── */}
          {!sent&&<div style={{marginBottom:18}}>
            {/* Google */}
            <button onClick={doGoogle} disabled={!!oauthLoading}
              style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:11,padding:"12px 16px",borderRadius:13,border:"1.5px solid #E2E8F0",background:"#fff",cursor:oauthLoading?"not-allowed":"pointer",marginBottom:10,fontFamily:"'Nunito',sans-serif",boxShadow:"0 1px 6px rgba(0,0,0,0.08)",transition:"all 0.18s",position:"relative"}}
              onMouseEnter={e=>{if(!oauthLoading){e.currentTarget.style.boxShadow="0 3px 14px rgba(0,0,0,0.14)";e.currentTarget.style.transform="translateY(-1px)";}}} onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 6px rgba(0,0,0,0.08)";e.currentTarget.style.transform="translateY(0)";}}>
              {oauthLoading==="google"
                ?<div style={{width:18,height:18,borderRadius:"50%",border:"2.5px solid #E2E8F0",borderTopColor:"#4285F4"}} className="spin"/>
                :<svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              }
              <span style={{fontSize:14,fontWeight:700,color:"#1a1a2e"}}>{mode==="signup"?"Sign up with Google":"Continue with Google"}</span>
            </button>
            {/* Apple */}
            <button onClick={doApple} disabled={!!oauthLoading}
              style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:11,padding:"12px 16px",borderRadius:13,border:"none",background:"#000",cursor:oauthLoading?"not-allowed":"pointer",fontFamily:"'Nunito',sans-serif",boxShadow:"0 1px 6px rgba(0,0,0,0.18)",transition:"all 0.18s"}}
              onMouseEnter={e=>{if(!oauthLoading){e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.28)";e.currentTarget.style.transform="translateY(-1px)";}}} onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 6px rgba(0,0,0,0.18)";e.currentTarget.style.transform="translateY(0)";}}>
              {oauthLoading==="apple"
                ?<div style={{width:18,height:18,borderRadius:"50%",border:"2.5px solid rgba(255,255,255,0.3)",borderTopColor:"#fff"}} className="spin"/>
                :<svg width="18" height="22" viewBox="0 0 814 1000" fill="white"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 270-317.3 71.6 0 131 46.3 176 46.3 42.9 0 110-49.2 190.5-49.2zm-134.9-98.3c-28.5-34.7-65.2-55.3-101.8-55.3-49.8 0-80 25.6-123.4 25.6-44.4 0-84.4-25.4-130.7-25.4-62.4 0-131.1 39.4-176.1 108.5 9.5 7 80.2 39.1 80.2 135.4 0 89.7-59.4 132.8-59.4 133.5 2.2 1.4 49.6 25.6 110.3 25.6 48.3 0 82.1-23 121.9-23 37.5 0 76.4 23 126.6 23 74 0 125.1-47.6 132.2-54.4.9-.8-14.3-35.3-14.3-86.5 0-64.9 31.5-129.8 34.5-133z"/></svg>
              }
              <span style={{fontSize:14,fontWeight:700,color:"#fff"}}>{mode==="signup"?"Sign up with Apple":"Continue with Apple"}</span>
            </button>

            {/* Divider */}
            <div style={{display:"flex",alignItems:"center",gap:12,margin:"16px 0 4px"}}>
              <div style={{flex:1,height:1,background:"#E8E0F5"}}/>
              <div style={{fontSize:11,color:T.sub,fontWeight:600,whiteSpace:"nowrap"}}>or continue with phone</div>
              <div style={{flex:1,height:1,background:"#E8E0F5"}}/>
            </div>
          </div>}

          {/* ── PHONE + OTP FLOW ── */}
          {!sent ? (
            <div style={{animation:"fadeUp 0.3s ease"}}>
              {mode==="signup"&&(
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:11,fontWeight:700,color:T.text,marginBottom:5}}>Full Name</div>
                  <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name"
                    style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"1.5px solid #E8E0F5",background:"#fff",fontSize:14,outline:"none",color:T.text}}
                    onFocus={e=>e.target.style.borderColor=T.lav} onBlur={e=>e.target.style.borderColor="#E8E0F5"}/>
                </div>
              )}
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:T.text,marginBottom:5}}>Mobile Number</div>
                <div style={{display:"flex",gap:8}}>
                  <div style={{padding:"12px 14px",borderRadius:12,border:"1.5px solid #E8E0F5",background:"#F7F4FE",fontSize:13,fontWeight:700,color:T.text,flexShrink:0}}>🇮🇳 +91</div>
                  <input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/,"").slice(0,10))} placeholder="10-digit number" type="tel" maxLength={10}
                    style={{flex:1,padding:"12px 14px",borderRadius:12,border:`1.5px solid ${err?"#FF6B6B":"#E8E0F5"}`,background:"#fff",fontSize:14,outline:"none",color:T.text}}
                    onFocus={e=>e.target.style.borderColor=T.lav} onBlur={e=>e.target.style.borderColor=err?"#FF6B6B":"#E8E0F5"}/>
                </div>
              </div>
              {err&&<div style={{color:T.coral,fontSize:12,marginBottom:10,padding:"8px 11px",background:"#FFF0F0",borderRadius:9,lineHeight:1.5}}>{err}</div>}
              <Btn full loading={loading} onClick={doSend}>Send OTP →</Btn>
              <div style={{textAlign:"center",marginTop:12,fontSize:10,color:T.sub,lineHeight:1.6}}>🔒 Private · Encrypted · Never shared with anyone</div>
            </div>
          ):(
            <div style={{animation:"fadeUp 0.3s ease"}}>
              <div style={{fontFamily:"'Lora',serif",fontSize:19,fontWeight:600,color:T.dark,marginBottom:2}}>Verify your number</div>
              <div style={{fontSize:12,color:T.sub,marginBottom:14}}>OTP sent to +91 {phone}</div>
              {demoMsg&&(
                <div style={{background:"linear-gradient(135deg,#E8F5E9,#F1F8E9)",borderRadius:12,padding:"10px 14px",border:"1px solid #A5D6A7",marginBottom:14}}>
                  <div style={{fontSize:11,fontWeight:800,color:"#2E7D32",marginBottom:2}}>🧪 Demo Mode (No MSG91 key set)</div>
                  <div style={{fontSize:13,fontWeight:900,color:"#1B5E20",letterSpacing:4}}>{demoMsg}</div>
                  <div style={{fontSize:10,color:"#388E3C",marginTop:3}}>In production, this OTP is sent via SMS</div>
                </div>
              )}
              <div style={{marginBottom:18}}>
                <div style={{fontSize:11,fontWeight:700,color:T.text,marginBottom:5}}>Enter 6-digit OTP</div>
                <input value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/,"").slice(0,6))} placeholder="● ● ● ● ● ●" maxLength={6}
                  onKeyDown={e=>e.key==="Enter"&&doVerify()}
                  style={{width:"100%",padding:"16px",borderRadius:13,border:`2px solid ${err?"#FF6B6B":T.lav}`,background:"#fff",fontSize:26,outline:"none",color:T.dark,letterSpacing:12,textAlign:"center",fontWeight:800}}/>
              </div>
              {err&&<div style={{color:T.coral,fontSize:12,marginBottom:10,padding:"8px 11px",background:"#FFF0F0",borderRadius:9}}>{err}</div>}
              <Btn full loading={loading} onClick={doVerify}>{mode==="signup"?"Create Account ✓":"Log In ✓"}</Btn>
              <button onClick={()=>{setSent(false);setOtp("");setErr("");setDemoMsg("");}} style={{background:"none",border:"none",color:T.sub,fontSize:12,cursor:"pointer",marginTop:11,display:"block",width:"100%",textAlign:"center",fontFamily:"'Nunito',sans-serif"}}>← Change number · Resend OTP</button>
            </div>
          )}

          <div style={{borderTop:"1px solid #E8E0F5",marginTop:18,paddingTop:14,textAlign:"center"}}>
            <button onClick={goPrac} style={{background:"none",border:"none",color:T.lav,fontSize:12,cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:700}}>
              👩‍⚕️ Are you a therapist? → Practitioner Portal
            </button>
          </div>
        </Card>

        {/* Terms notice */}
        <div style={{textAlign:"center",marginTop:14,fontSize:10,color:T.sub,lineHeight:1.7,padding:"0 10px"}}>
          By continuing, you agree to MindWell's Terms of Service and Privacy Policy. Your data is stored securely and never sold.
        </div>
      </div>
    </div>
  );
}

function PracAuth({onLogin,onPending,goBack}) {
  const [step,setStep] = useState(0); // 0=login, 1=signup1, 2=signup2
  const [email,setEmail] = useState(""); const [pwd,setPwd] = useState("");
  const [err,setErr] = useState(""); const [loading,setLoading] = useState(false);
  const [su,setSu] = useState({name:"",email:"",phone:"",pwd:"",pwd2:"",title:"",specs:[],city:"",langs:[],exp:"",license:"",hourly:"",modes:[],bio:""});
  const [suErr,setSuErr] = useState({});

  const doLogin = async () => {
    if (!email.trim()||!pwd.trim()) { setErr("Please enter email and password."); return; }
    setErr(""); setLoading(true);
    const hash = await hashPwd(pwd);
    const found = getPracs().find(p=>p.email.toLowerCase()===email.toLowerCase()&&p.pwdHash===hash);
    setLoading(false);
    if (!found) { setErr("Incorrect email or password."); return; }
    if (found.status==="pending") { onPending(found); return; }
    if (found.status==="rejected") { setErr("Your application was not approved. Contact admin@mindwell.in"); return; }
    onLogin(found);
  };

  const step1Next = async () => {
    const e={};
    if (!su.name.trim()) e.name="Required";
    if (!su.email.trim()||!/\S+@\S+\.\S+/.test(su.email)) e.email="Valid email required";
    if (su.phone.length!==10) e.phone="10-digit number required";
    if (su.pwd.length<8) e.pwd="Minimum 8 characters";
    if (su.pwd!==su.pwd2) e.pwd2="Passwords don't match";
    if (Object.keys(e).length) { setSuErr(e); return; }
    if (getPracs().find(p=>p.email.toLowerCase()===su.email.toLowerCase())) { setSuErr({email:"Email already registered."}); return; }
    setSuErr({}); setStep(2);
  };

  const step2Submit = async () => {
    const e={};
    if (!su.title.trim()) e.title="Required";
    if (!su.city.trim()) e.city="Required";
    if (!su.license.trim()) e.license="License/registration number required";
    if (!su.hourly||isNaN(su.hourly)) e.hourly="Enter your hourly rate (₹)";
    if (su.specs.length===0) e.specs="Select at least one";
    if (su.modes.length===0) e.modes="Select at least one";
    if (Object.keys(e).length) { setSuErr(e); return; }
    setSuErr({}); setLoading(true);
    const hash = await hashPwd(su.pwd);
    const rec = {...su,pwdHash:hash,pwd:undefined,pwd2:undefined,status:"pending",appliedAt:new Date().toISOString(),id:Date.now()};
    const all = getPracs(); all.push(rec); savePracs(all);
    setLoading(false); onPending(rec);
  };

  const darkInp = (val,onChange,placeholder,type="text",onKeyDown) => (
    <input type={type} value={val} onChange={onChange} onKeyDown={onKeyDown} placeholder={placeholder}
      style={{width:"100%",padding:"11px 13px",borderRadius:12,border:"1.5px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.08)",color:"#fff",fontSize:13,outline:"none",fontFamily:"'Nunito',sans-serif"}}
      onFocus={e=>e.target.style.borderColor=T.mint} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.12)"}/>
  );

  return (
    <div style={{fontFamily:"'Nunito',sans-serif",background:"linear-gradient(160deg,#1A1035,#2D1B6B)",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:440,animation:"fadeUp 0.5s ease"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{width:62,height:62,borderRadius:20,background:T.g2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 12px",boxShadow:"0 8px 24px rgba(78,205,196,0.3)"}}>👩‍⚕️</div>
          <div style={{fontFamily:"'Lora',serif",fontSize:23,fontWeight:600,color:"#fff"}}>Practitioner Portal</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:4}}>MindWell · India's Mental Wellness Platform</div>
        </div>
        <div style={{background:"rgba(255,255,255,0.06)",backdropFilter:"blur(20px)",borderRadius:22,padding:24,border:"1px solid rgba(255,255,255,0.09)"}}>

          {step===0&&(
            <div style={{animation:"fadeUp 0.3s ease"}}>
              <div style={{fontFamily:"'Lora',serif",fontSize:20,fontWeight:600,color:"#fff",marginBottom:2}}>Welcome back 🙏</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginBottom:20}}>Log in to your practitioner account</div>
              <div style={{marginBottom:13}}>
                <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.45)",marginBottom:5}}>Email Address</div>
                {darkInp(email,e=>setEmail(e.target.value),"your@email.com","email")}
              </div>
              <div style={{marginBottom:18}}>
                <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.45)",marginBottom:5}}>Password</div>
                <div style={{position:"relative"}}>
                  <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="••••••••"
                    style={{width:"100%",padding:"11px 13px",borderRadius:12,border:"1.5px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.08)",color:"#fff",fontSize:13,outline:"none",fontFamily:"'Nunito',sans-serif"}}
                    onFocus={e=>e.target.style.borderColor=T.mint} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.12)"}/>
                </div>
              </div>
              {err&&<div style={{color:"#FF6B6B",fontSize:12,marginBottom:11,padding:"8px 12px",background:"rgba(255,107,107,0.1)",borderRadius:9,border:"1px solid rgba(255,107,107,0.2)"}}>{err}</div>}
              <Btn full loading={loading} grad={T.g2} onClick={doLogin}>Log In →</Btn>
              <div style={{textAlign:"center",marginTop:16,fontSize:12}}>
                <span style={{color:"rgba(255,255,255,0.3)"}}>New practitioner? </span>
                <button onClick={()=>setStep(1)} style={{background:"none",border:"none",color:T.mint,fontSize:12,cursor:"pointer",fontWeight:700,fontFamily:"'Nunito',sans-serif"}}>Apply to Join →</button>
              </div>
              <div style={{borderTop:"1px solid rgba(255,255,255,0.07)",marginTop:16,paddingTop:14,textAlign:"center"}}>
                <button onClick={goBack} style={{background:"none",border:"none",color:"rgba(255,255,255,0.2)",fontSize:11,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>← Back · Are you a client? → Client Login</button>
              </div>
            </div>
          )}

          {step===1&&(
            <div style={{animation:"fadeUp 0.3s ease"}}>
              <div style={{display:"flex",gap:5,marginBottom:16}}>{[1,2].map(i=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=1?T.mint:"rgba(255,255,255,0.1)"}}/>)}</div>
              <div style={{fontFamily:"'Lora',serif",fontSize:19,fontWeight:600,color:"#fff",marginBottom:2}}>Apply to Join MindWell</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginBottom:18}}>Step 1 of 2 — Account details · Admin review required</div>
              {[{l:"Full Name",k:"name",t:"text",p:"Dr. Your Name"},{l:"Email Address",k:"email",t:"email",p:"your@email.com"},{l:"Phone Number",k:"phone",t:"tel",p:"10-digit number"}].map(f=>(
                <div key={f.k} style={{marginBottom:12}}>
                  <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.45)",marginBottom:4}}>{f.l}</div>
                  {darkInp(su[f.k],e=>setSu(s=>({...s,[f.k]:e.target.value})),f.p,f.t)}
                  {suErr[f.k]&&<div style={{color:"#FF6B6B",fontSize:10,marginTop:3}}>{suErr[f.k]}</div>}
                </div>
              ))}
              {[{l:"Password (min 8 chars)",k:"pwd"},{l:"Confirm Password",k:"pwd2"}].map(f=>(
                <div key={f.k} style={{marginBottom:12}}>
                  <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.45)",marginBottom:4}}>{f.l}</div>
                  <input type="password" value={su[f.k]} onChange={e=>setSu(s=>({...s,[f.k]:e.target.value}))} placeholder="••••••••"
                    style={{width:"100%",padding:"11px 13px",borderRadius:12,border:`1.5px solid ${suErr[f.k]?"#FF6B6B":"rgba(255,255,255,0.12)"}`,background:"rgba(255,255,255,0.08)",color:"#fff",fontSize:13,outline:"none",fontFamily:"'Nunito',sans-serif"}}/>
                  {suErr[f.k]&&<div style={{color:"#FF6B6B",fontSize:10,marginTop:3}}>{suErr[f.k]}</div>}
                </div>
              ))}
              <Btn full grad={T.g2} style={{marginTop:6}} onClick={step1Next}>Next: Professional Details →</Btn>
              <button onClick={()=>setStep(0)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.25)",fontSize:11,cursor:"pointer",marginTop:11,display:"block",width:"100%",textAlign:"center",fontFamily:"'Nunito',sans-serif"}}>← Back to Login</button>
            </div>
          )}

          {step===2&&(
            <div style={{animation:"fadeUp 0.3s ease",maxHeight:"75vh",overflowY:"auto"}}>
              <div style={{display:"flex",gap:5,marginBottom:16}}>{[1,2].map(i=><div key={i} style={{flex:1,height:4,borderRadius:2,background:T.mint}}/>)}</div>
              <div style={{fontFamily:"'Lora',serif",fontSize:19,fontWeight:600,color:"#fff",marginBottom:2}}>Professional Profile</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginBottom:18}}>Step 2 of 2 — Your credentials</div>
              {[{l:"Designation / Title",k:"title",p:"e.g. Clinical Psychologist"},{l:"City",k:"city",p:"e.g. Mumbai"},{l:"RCI / MCI License No.",k:"license",p:"Registration number (required)"},{l:"Years of Experience",k:"exp",p:"e.g. 8"},{l:"Hourly Rate (₹)",k:"hourly",t:"number",p:"e.g. 800"}].map(f=>(
                <div key={f.k} style={{marginBottom:12}}>
                  <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.45)",marginBottom:4}}>{f.l}</div>
                  {darkInp(su[f.k],e=>setSu(s=>({...s,[f.k]:e.target.value})),f.p,f.t||"text")}
                  {suErr[f.k]&&<div style={{color:"#FF6B6B",fontSize:10,marginTop:3}}>{suErr[f.k]}</div>}
                </div>
              ))}
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.45)",marginBottom:7}}>Specialisations{suErr.specs&&<span style={{color:"#FF6B6B"}}> — {suErr.specs}</span>}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {["Anxiety","Depression","Trauma","Relationships","Grief","Addiction","OCD","Sleep","LGBTQ+","Family","Anger","Eating Disorders","Work Stress","ADHD","Mindfulness"].map(s=>{const sel=su.specs.includes(s);return(
                    <button key={s} onClick={()=>setSu(d=>({...d,specs:sel?d.specs.filter(x=>x!==s):[...d.specs,s]}))} style={{padding:"5px 11px",borderRadius:17,border:`1.5px solid ${sel?T.mint:"rgba(255,255,255,0.12)"}`,background:sel?`${T.mint}22`:"none",color:sel?T.mint:"rgba(255,255,255,0.35)",fontSize:11,cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:sel?700:400}}>{s}</button>
                  );})}
                </div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.45)",marginBottom:7}}>Session Modes{suErr.modes&&<span style={{color:"#FF6B6B"}}> — {suErr.modes}</span>}</div>
                <div style={{display:"flex",gap:8}}>
                  {["chat","audio","video"].map(m=>{const sel=su.modes.includes(m);return(
                    <button key={m} onClick={()=>setSu(d=>({...d,modes:sel?d.modes.filter(x=>x!==m):[...d.modes,m]}))} style={{flex:1,padding:"9px",borderRadius:12,border:`1.5px solid ${sel?T.mint:"rgba(255,255,255,0.12)"}`,background:sel?`${T.mint}22`:"none",color:sel?T.mint:"rgba(255,255,255,0.35)",fontSize:11,cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:sel?700:400}}>
                      {m==="chat"?"💬 Chat":m==="audio"?"📞 Audio":"🎥 Video"}
                    </button>
                  );})}
                </div>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.45)",marginBottom:5}}>Bio</div>
                <textarea value={su.bio} onChange={e=>setSu(s=>({...s,bio:e.target.value}))} placeholder="Your approach, experience, and what clients can expect..." rows={3}
                  style={{width:"100%",padding:"11px 13px",borderRadius:12,border:"1.5px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.08)",color:"#fff",fontSize:12,outline:"none",lineHeight:1.6,fontFamily:"'Nunito',sans-serif"}}/>
              </div>
              <div style={{background:"rgba(78,205,196,0.1)",borderRadius:11,padding:"10px 13px",border:"1px solid rgba(78,205,196,0.2)",marginBottom:16,fontSize:11,color:"rgba(78,205,196,0.9)",lineHeight:1.6}}>
                ✅ Admin reviews your application within 24–48 hrs. Your profile goes live only after approval.
              </div>
              <Btn full loading={loading} grad={T.g2} onClick={step2Submit}>Submit Application →</Btn>
              <button onClick={()=>setStep(1)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.25)",fontSize:11,cursor:"pointer",marginTop:11,display:"block",width:"100%",textAlign:"center",fontFamily:"'Nunito',sans-serif"}}>← Back</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PracPending({goBack}) {
  return (
    <div style={{fontFamily:"'Nunito',sans-serif",background:"linear-gradient(160deg,#1A1035,#2D1B6B)",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{textAlign:"center",maxWidth:400,animation:"fadeUp 0.5s ease"}}>
        <div style={{fontSize:64,marginBottom:16}}>⏳</div>
        <div style={{fontFamily:"'Lora',serif",fontSize:23,fontWeight:600,color:"#fff",marginBottom:12}}>Application Under Review</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",lineHeight:1.85,marginBottom:22}}>Your profile has been submitted. Admin review takes 24–48 hours. We verify your license before approval.</div>
        <div style={{background:"rgba(78,205,196,0.1)",borderRadius:14,padding:"14px 18px",border:"1px solid rgba(78,205,196,0.2)",marginBottom:22,textAlign:"left"}}>
          <div style={{fontSize:10,fontWeight:800,color:T.mint,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>What happens next?</div>
          {["Admin verifies your RCI/MCI license","Background & credential check","Profile reviewed for quality standards","Email confirmation sent","Your profile goes live on MindWell"].map((s,i)=>(
            <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:6}}>
              <span style={{color:T.mint,flexShrink:0,marginTop:1}}>→</span>
              <span style={{fontSize:11,color:"rgba(255,255,255,0.45)"}}>{s}</span>
            </div>
          ))}
        </div>
        <button onClick={goBack} style={{background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,padding:"11px 22px",color:"rgba(255,255,255,0.35)",fontSize:13,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Back to Home</button>
      </div>
    </div>
  );
}

function AdminAuth({onLogin,goBack}) {
  const [email,setEmail]=useState(""); const [pwd,setPwd]=useState(""); const [err,setErr]=useState("");
  const doLogin = () => {
    if (email!==ADMIN_EMAIL||pwd!==ADMIN_PWD) { setErr("Incorrect admin credentials."); return; }
    onLogin();
  };
  return (
    <div style={{fontFamily:"'Nunito',sans-serif",background:"linear-gradient(160deg,#0D0A1E,#1A1035)",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:380,animation:"fadeUp 0.5s ease"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{width:58,height:58,borderRadius:18,background:T.g3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 12px"}}>{Ic.admin}</div>
          <div style={{fontFamily:"'Lora',serif",fontSize:21,fontWeight:600,color:"#fff"}}>Admin Portal</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.2)",marginTop:4}}>MindWell · Internal Access Only</div>
        </div>
        <div style={{background:"rgba(255,255,255,0.04)",borderRadius:20,padding:22,border:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{marginBottom:13}}>
            <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.35)",marginBottom:5}}>Admin Email</div>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@mindwell.in" type="email"
              style={{width:"100%",padding:"11px 13px",borderRadius:12,border:"1.5px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.06)",color:"#fff",fontSize:13,outline:"none",fontFamily:"'Nunito',sans-serif"}}/>
          </div>
          <div style={{marginBottom:18}}>
            <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.35)",marginBottom:5}}>Password</div>
            <input value={pwd} onChange={e=>setPwd(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="••••••••" type="password"
              style={{width:"100%",padding:"11px 13px",borderRadius:12,border:"1.5px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.06)",color:"#fff",fontSize:13,outline:"none",fontFamily:"'Nunito',sans-serif"}}/>
          </div>
          {err&&<div style={{color:"#FF6B6B",fontSize:12,marginBottom:11}}>{err}</div>}
          <Btn full grad={T.g3} onClick={doLogin}>Log In →</Btn>
          <button onClick={goBack} style={{background:"none",border:"none",color:"rgba(255,255,255,0.2)",fontSize:11,cursor:"pointer",marginTop:13,display:"block",width:"100%",textAlign:"center",fontFamily:"'Nunito',sans-serif"}}>← Back</button>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({onLogout}) {
  const [aTab,setATab] = useState("pending");
  const [pending,setPending] = useState([]);
  const [approved,setApproved] = useState([]);
  useEffect(()=>{
    const all=getPracs();
    setPending(all.filter(p=>p.status==="pending"));
    setApproved(all.filter(p=>p.status==="approved"));
  },[aTab]);
  const approve = id => { const all=getPracs().map(p=>p.id===id?{...p,status:"approved",approvedAt:new Date().toISOString()}:p); savePracs(all); setPending(all.filter(p=>p.status==="pending")); setApproved(all.filter(p=>p.status==="approved")); };
  const reject  = id => { const all=getPracs().map(p=>p.id===id?{...p,status:"rejected"}:p); savePracs(all); setPending(all.filter(p=>p.status==="pending")); };
  return (
    <div style={{fontFamily:"'Nunito',sans-serif",background:"linear-gradient(160deg,#0D0A1E,#1A1035)",minHeight:"100vh",padding:22}}>
      <div style={{maxWidth:760,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <div><div style={{fontFamily:"'Lora',serif",fontSize:21,color:"#fff",fontWeight:600}}>🛡️ Admin Dashboard</div><div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:2}}>Practitioner Management</div></div>
          <button onClick={onLogout} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:11,padding:"8px 16px",color:"rgba(255,255,255,0.35)",fontSize:12,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Log Out</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
          {[[pending.length,"Pending","⏳","#F7B731"],[approved.length,"Approved","✅",T.mint],[getPracs().filter(p=>p.status==="rejected").length,"Rejected","❌",T.coral]].map(([v,l,e,c])=>(
            <div key={l} style={{background:"rgba(255,255,255,0.05)",borderRadius:16,padding:"14px 16px",border:`1px solid ${c}33`}}>
              <div style={{fontSize:24}}>{e}</div>
              <div style={{fontWeight:900,fontSize:24,color:c,lineHeight:1.1}}>{v}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {[["pending","Pending Applications"],["approved","Approved Practitioners"]].map(([id,l])=>(
            <button key={id} onClick={()=>setATab(id)} style={{padding:"9px 18px",borderRadius:12,border:"none",background:aTab===id?"rgba(155,127,212,0.3)":"rgba(255,255,255,0.05)",color:aTab===id?"#fff":"rgba(255,255,255,0.3)",fontSize:12,fontWeight:aTab===id?700:400,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>
              {l}{id==="pending"&&pending.length>0&&<span style={{marginLeft:7,background:T.coral,borderRadius:8,padding:"1px 7px",fontSize:10,fontWeight:800}}>{pending.length}</span>}
            </button>
          ))}
        </div>
        {aTab==="pending"&&(pending.length===0
          ?<div style={{textAlign:"center",padding:44,color:"rgba(255,255,255,0.25)"}}><div style={{fontSize:40,marginBottom:10}}>✅</div><div>No pending applications</div></div>
          :pending.map(p=>(
            <div key={p.id} style={{background:"rgba(255,255,255,0.05)",borderRadius:18,padding:"18px 20px",border:"1px solid rgba(255,255,255,0.07)",marginBottom:13}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div><div style={{fontWeight:800,fontSize:16,color:"#fff"}}>{p.name}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2}}>{p.title} · {p.city}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.25)",marginTop:2}}>📧 {p.email} · 📞 {p.phone}</div></div>
                <div style={{background:"rgba(247,183,49,0.15)",borderRadius:9,padding:"4px 11px",border:"1px solid rgba(247,183,49,0.3)"}}><div style={{fontSize:10,color:T.gold,fontWeight:700}}>PENDING</div></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12,fontSize:12,color:"rgba(255,255,255,0.4)"}}>
                <div>🏥 License: <span style={{color:"rgba(255,255,255,0.7)",fontWeight:600}}>{p.license}</span></div>
                <div>⏱ Exp: <span style={{color:"rgba(255,255,255,0.7)",fontWeight:600}}>{p.exp} yrs</span></div>
                <div>💰 Rate: <span style={{color:"rgba(255,255,255,0.7)",fontWeight:600}}>{inr(p.hourly)}/hr</span></div>
                <div>📅 Applied: <span style={{color:"rgba(255,255,255,0.7)",fontWeight:600}}>{new Date(p.appliedAt).toLocaleDateString("en-IN")}</span></div>
              </div>
              {p.specs?.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>{p.specs.map(s=><span key={s} style={{background:"rgba(155,127,212,0.2)",color:"#C3A8F0",fontSize:10,padding:"3px 9px",borderRadius:7,fontWeight:600}}>{s}</span>)}</div>}
              {p.bio&&<div style={{fontSize:12,color:"rgba(255,255,255,0.35)",lineHeight:1.6,marginBottom:12,padding:"10px 12px",background:"rgba(255,255,255,0.03)",borderRadius:10}}>{p.bio}</div>}
              <div style={{display:"flex",gap:9}}>
                <button onClick={()=>approve(p.id)} style={{flex:1,padding:"11px",borderRadius:13,border:"none",background:"linear-gradient(135deg,#26de81,#4ECDC4)",color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>{Ic.check} Approve — Go Live</button>
                <button onClick={()=>reject(p.id)} style={{flex:1,padding:"11px",borderRadius:13,border:"1px solid rgba(255,107,107,0.3)",background:"rgba(255,107,107,0.1)",color:"#FF6B6B",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>{Ic.x} Reject</button>
              </div>
            </div>
          ))
        )}
        {aTab==="approved"&&(approved.length===0
          ?<div style={{textAlign:"center",padding:44,color:"rgba(255,255,255,0.25)"}}><div style={{fontSize:40,marginBottom:10}}>👩‍⚕️</div><div>No approved practitioners yet</div></div>
          :approved.map(p=>(
            <div key={p.id} style={{background:"rgba(255,255,255,0.05)",borderRadius:18,padding:"16px 20px",border:"1px solid rgba(78,205,196,0.15)",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontWeight:800,fontSize:14,color:"#fff"}}>{p.name}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{p.title} · {p.city} · {inr(p.hourly)}/hr</div><div style={{fontSize:10,color:"rgba(255,255,255,0.2)",marginTop:2}}>Approved {p.approvedAt?new Date(p.approvedAt).toLocaleDateString("en-IN"):""}</div></div>
              <div style={{background:"rgba(78,205,196,0.15)",borderRadius:9,padding:"5px 12px"}}><div style={{fontSize:10,color:T.mint,fontWeight:800}}>● LIVE</div></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function PracDashboard({prac,onLogout}) {
  const [pt,setPt] = useState("home");
  const [selClient,setSelClient] = useState(null);
  const [clients,setClients] = useState([]);
  const [bookings,setBookings] = useState([]);
  const [pracChat,setPracChat] = useState([]);
  const [pracInput,setPracInput] = useState("");
  const [pracLoad,setPracLoad] = useState(false);
  const [notes,setNotes] = useState({});
  const [noteInput,setNoteInput] = useState("");
  const [myRate,setMyRate] = useState(prac.hourly||800);
  const [editRate,setEditRate] = useState(false);
  const [newRate,setNewRate] = useState("");
  const [avail,setAvail] = useState({Mon:["10:00 AM","2:00 PM"],Tue:["11:00 AM","3:00 PM"],Wed:["10:00 AM","5:00 PM"],Thu:["11:00 AM","4:00 PM"],Fri:["9:00 AM","3:00 PM"],Sat:["10:00 AM"],Sun:[]});
  const [avDay,setAvDay] = useState("Mon");
  const pracEndRef = useRef(null);
  const slots=["9:00 AM","10:00 AM","11:00 AM","12:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM"];

  useEffect(()=>{ pracEndRef.current?.scrollIntoView({behavior:"smooth"}); },[pracChat]);
  useEffect(()=>{
    const shared=getSessions().filter(s=>!s.therapistId||s.therapistId===prac.id);
    setClients(shared);
    const bks=(() => { try{return JSON.parse(localStorage.getItem("mw_shared_bookings")||"[]")}catch{return[]} })();
    setBookings(bks.filter(b=>b.therapistId===prac.id));
  },[pt]);

  const sendPracMsg = async (cl) => {
    if (!pracInput.trim()||pracLoad) return;
    const txt=pracInput.trim(); setPracInput("");
    const nm=[...pracChat,{role:"user",text:txt}]; setPracChat(nm); setPracLoad(true);
    const ctx=(cl?.aiMessages||[]).map(m=>`${m.role==="user"?"Client":"AI"}: ${m.text}`).join("\n");
    const prof=cl?.aiProfile||"No profile yet.";
    try {
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":ANTHROPIC_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,system:`You are a clinical AI assistant helping ${prac.name} (${prac.title}) prepare for a session with client ${cl?.clientName}.\nCLIENT PROFILE:\n${prof}\n\nCLIENT CHAT HISTORY:\n${ctx}\n\nProvide specific clinical insights, session prep, suggested questions, and therapeutic strategies. Indian cultural context.`,messages:nm.map(m=>({role:m.role,content:m.text}))})});
      const d=await r.json();
      setPracChat([...nm,{role:"assistant",text:d.content?.find(b=>b.type==="text")?.text||"I'm here to help you prepare."}]);
    } catch { setPracChat([...nm,{role:"assistant",text:"Unable to respond. Check your API key."}]); }
    setPracLoad(false);
  };

  const saveNote = (phone) => {
    if (!noteInput.trim()) return;
    setNotes(n=>({...n,[phone]:[...(n[phone]||[]),{text:noteInput,date:new Date().toLocaleDateString("en-IN")}]}));
    setNoteInput("");
  };

  const initials = prac.name?.split(" ").map(w=>w[0]).join("").slice(0,2)||"PR";
  const totalEarnings = bookings.reduce((s,b)=>s+(b.amount||0),0);

  const pNavItems=[{id:"home",l:"Overview",e:"🏠"},{id:"clients",l:"My Clients",e:"👥"},{id:"schedule",l:"Schedule",e:"📅"},{id:"pricing",l:"Pricing",e:"💰"},{id:"earnings",l:"Earnings",e:"📊"},{id:"profile",l:"My Profile",e:"👤"}];

  if (selClient) return (
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"'Nunito',sans-serif"}}>
      <div style={{background:"#1A1035",width:220,flexShrink:0,padding:"22px 16px",position:"sticky",top:0,height:"100vh",overflowY:"auto"}}>
        <div style={{marginBottom:18}}><div style={{fontSize:22}}>🌿</div><div style={{fontFamily:"'Lora',serif",fontSize:16,color:"#fff",fontWeight:600,marginTop:2}}>MindWell</div></div>
        <button onClick={()=>{setSelClient(null);setPracChat([]);}} style={{width:"100%",padding:"9px 12px",borderRadius:11,border:"none",background:"rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.6)",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif",marginBottom:14}}>← Back</button>
        <div style={{background:"rgba(255,255,255,0.07)",borderRadius:12,padding:13}}>
          <div style={{width:40,height:40,borderRadius:13,background:T.g1,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:16,marginBottom:8}}>{selClient.clientName?.[0]||"?"}</div>
          <div style={{fontWeight:800,fontSize:13,color:"#fff"}}>{selClient.clientName}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginTop:2}}>Last active: {selClient.lastActive||"Recently"}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:8}}>{(selClient.issues||[]).map(i=><span key={i} style={{background:"rgba(155,127,212,0.3)",color:"#C3A8F0",fontSize:9,padding:"2px 7px",borderRadius:6,fontWeight:700}}>{i}</span>)}</div>
        </div>
      </div>
      <div style={{flex:1,background:T.bg,overflowY:"auto",padding:22}}>
        <div style={{maxWidth:820,margin:"0 auto"}}>
          <div style={{fontFamily:"'Lora',serif",fontSize:20,fontWeight:600,color:T.dark,marginBottom:16}}>{selClient.clientName}'s Profile</div>
          {selClient.aiProfile
            ?<Card style={{background:"linear-gradient(135deg,#E8F5E9,#F1F8E9)",border:"1px solid #A5D6A7",marginBottom:14}}><div style={{fontSize:10,fontWeight:800,color:"#2E7D32",marginBottom:9,textTransform:"uppercase",letterSpacing:1.5}}>🤖 AI Pre-Session Brief</div><div style={{fontSize:13,color:"#1B5E20",lineHeight:1.85,whiteSpace:"pre-line"}}>{selClient.aiProfile}</div></Card>
            :<div style={{background:"#FFF3E0",borderRadius:14,padding:14,border:"1px solid #FFCC80",marginBottom:14}}><div style={{fontSize:12,fontWeight:700,color:"#E65100",marginBottom:3}}>⚠️ No AI brief generated yet</div><div style={{fontSize:11,color:"#BF360C"}}>Client hasn't generated a pre-session brief. They'll see a prompt before their next session.</div></div>
          }
          <Card style={{marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:11}}>💬 Client's AI Chat History</div>
            <div style={{maxHeight:270,overflowY:"auto",display:"flex",flexDirection:"column",gap:7}}>
              {(selClient.aiMessages||[]).map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                  <div style={{maxWidth:"76%",padding:"9px 13px",borderRadius:15,background:m.role==="user"?T.g1:"#F7F4FE",color:m.role==="user"?"#fff":T.text,fontSize:12,lineHeight:1.65,border:m.role!=="user"?"1px solid #E8E0F5":"none"}}>
                    {m.role==="user"&&<div style={{fontSize:9,fontWeight:800,opacity:0.6,marginBottom:2}}>CLIENT</div>}{m.text}
                  </div>
                </div>
              ))}
              {!(selClient.aiMessages?.length)&&<div style={{textAlign:"center",padding:18,color:T.sub,fontSize:12}}>No chat history yet</div>}
            </div>
          </Card>
          <Card style={{marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:4}}>🧠 Ask AI About This Client</div>
            <div style={{fontSize:11,color:T.sub,marginBottom:11}}>Get session prep, strategies, and clinical insights specific to {selClient.clientName}.</div>
            <div style={{maxHeight:190,overflowY:"auto",display:"flex",flexDirection:"column",gap:7,marginBottom:10}}>
              {pracChat.length===0&&<div style={{display:"flex",flexWrap:"wrap",gap:6}}>{["What should I ask first?","Best therapeutic approach?","Cultural considerations?","Risk factors?","Suggested session structure"].map(q=><button key={q} onClick={()=>setPracInput(q)} style={{padding:"5px 11px",borderRadius:9,border:`1px solid ${T.lav}`,background:"#F7F4FE",color:T.lav,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>{q}</button>)}</div>}
              {pracChat.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}><div style={{maxWidth:"78%",padding:"9px 13px",borderRadius:14,background:m.role==="user"?T.g1:"#fff",color:m.role==="user"?"#fff":T.text,fontSize:12,lineHeight:1.65,border:m.role!=="user"?"1px solid #E8E0F5":"none"}}>{m.text}</div></div>)}
              {pracLoad&&<div style={{display:"flex",gap:3,padding:"4px 8px"}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:T.lav,animation:`bounce 0.6s infinite ${i*0.15}s`}}/>)}</div>}
              <div ref={pracEndRef}/>
            </div>
            <div style={{display:"flex",gap:7}}>
              <input value={pracInput} onChange={e=>setPracInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendPracMsg(selClient)} placeholder="Ask anything about this client..." style={{flex:1,padding:"10px 13px",borderRadius:13,border:"1px solid #E8E0F5",background:T.bg,fontSize:12,outline:"none",color:T.text}}/>
              <Btn sm onClick={()=>sendPracMsg(selClient)}>Ask →</Btn>
            </div>
          </Card>
          <Card>
            <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:10}}>📝 Private Clinical Notes</div>
            {(notes[selClient.clientPhone]||[]).map((n,i)=><div key={i} style={{padding:"8px 11px",background:T.bg,borderRadius:11,marginBottom:7,borderLeft:`3px solid ${T.lav}`}}><div style={{fontSize:10,color:T.sub,marginBottom:2}}>{n.date}</div><div style={{fontSize:12,color:T.text,lineHeight:1.65}}>{n.text}</div></div>)}
            {!(notes[selClient.clientPhone]||[]).length&&<div style={{fontSize:12,color:T.sub,marginBottom:9}}>No notes yet. Only you can see these.</div>}
            <div style={{display:"flex",gap:7}}>
              <input value={noteInput} onChange={e=>setNoteInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveNote(selClient.clientPhone)} placeholder="Add a clinical note..." style={{flex:1,padding:"10px 13px",borderRadius:12,border:"1px solid #E8E0F5",background:T.bg,fontSize:12,outline:"none",color:T.text}}/>
              <Btn sm onClick={()=>saveNote(selClient.clientPhone)}>Save</Btn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"'Nunito',sans-serif"}}>
      <div style={{background:"#1A1035",width:220,flexShrink:0,padding:"24px 16px",position:"sticky",top:0,height:"100vh",overflowY:"auto"}}>
        <div style={{marginBottom:20}}><div style={{fontSize:22}}>🌿</div><div style={{fontFamily:"'Lora',serif",fontSize:16,color:"#fff",fontWeight:600,marginTop:2}}>MindWell</div><div style={{fontSize:9,color:"rgba(255,255,255,0.22)"}}>Practitioner Portal</div></div>
        <div style={{background:"rgba(255,255,255,0.07)",borderRadius:12,padding:"11px 12px",marginBottom:18,display:"flex",gap:9,alignItems:"center"}}>
          <div style={{width:36,height:36,borderRadius:11,background:T.g2,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:13,flexShrink:0}}>{initials}</div>
          <div><div style={{fontSize:11,fontWeight:800,color:"#fff",lineHeight:1.2}}>{prac.name?.split(" ").slice(0,2).join(" ")}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginTop:1}}>{prac.title}</div></div>
        </div>
        {pNavItems.map(({id,l,e})=>(
          <button key={id} onClick={()=>setPt(id)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:11,border:"none",background:pt===id?"rgba(78,205,196,0.2)":"none",color:pt===id?"#fff":"rgba(255,255,255,0.4)",fontSize:12,fontWeight:pt===id?700:400,cursor:"pointer",marginBottom:3,fontFamily:"'Nunito',sans-serif"}}>
            <span>{e}</span>{l}
          </button>
        ))}
        <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",marginTop:16,paddingTop:14}}>
          <button onClick={onLogout} style={{width:"100%",padding:"9px",borderRadius:11,border:"1px solid rgba(255,255,255,0.07)",background:"none",color:"rgba(255,255,255,0.22)",fontSize:11,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Log Out</button>
        </div>
      </div>
      <div style={{flex:1,background:T.bg,overflowY:"auto"}}>
        <div style={{maxWidth:820,margin:"0 auto",padding:22}}>

          {pt==="home"&&<div style={{animation:"fadeUp 0.3s ease"}}>
            <div style={{background:T.gd,borderRadius:20,padding:"22px 20px",marginBottom:16,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-30,right:-30,width:110,height:110,borderRadius:"50%",background:"rgba(155,127,212,0.06)"}}/>
              <div style={{fontSize:10,letterSpacing:2,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",marginBottom:4}}>Good day 🙏</div>
              <div style={{fontFamily:"'Lora',serif",fontSize:21,color:"#fff",fontWeight:600,marginBottom:2}}>{prac.name}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.38)"}}>{prac.title} · {prac.city}</div>
              <div style={{display:"flex",gap:22,marginTop:14}}>
                {[[clients.length,"Clients","👥"],[bookings.filter(b=>b.status==="completed").length,"Sessions","✅"],[inr(totalEarnings),"Earned","💰"]].map(([v,l,e])=>(
                  <div key={l}><div style={{fontSize:9,color:"rgba(255,255,255,0.28)"}}>{e}</div><div style={{fontSize:19,fontWeight:900,color:"#fff"}}>{v}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.28)"}}>{l}</div></div>
                ))}
              </div>
            </div>
            <Card>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:13,fontWeight:800,color:T.dark}}>Recent Clients</div>
                <button onClick={()=>setPt("clients")} style={{background:"none",border:"none",color:T.lav,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>See all →</button>
              </div>
              {clients.slice(0,4).map((c,i)=>(
                <div key={i} className="hvr" onClick={()=>{setSelClient(c);setPracChat([]);}} style={{display:"flex",gap:11,alignItems:"center",padding:"10px 0",borderBottom:i<3?"1px solid #E8E0F5":"none",cursor:"pointer"}}>
                  <div style={{width:38,height:38,borderRadius:12,background:T.g1,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:14,flexShrink:0}}>{c.clientName?.[0]||"?"}</div>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:T.dark}}>{c.clientName}</div><div style={{fontSize:10,color:T.sub}}>{c.issues?.slice(0,2).join(", ")||"General support"}</div></div>
                  {c.aiProfile&&<span style={{background:"#E8F5E9",color:"#2E7D32",fontSize:9,fontWeight:800,padding:"3px 8px",borderRadius:6}}>Brief Ready</span>}
                  <span style={{color:T.sub,fontSize:16}}>›</span>
                </div>
              ))}
              {!clients.length&&<div style={{textAlign:"center",padding:22,color:T.sub,fontSize:12}}>No clients yet. Your profile is live — clients can find you!</div>}
            </Card>
          </div>}

          {pt==="clients"&&<div style={{animation:"fadeUp 0.3s ease"}}>
            <div style={{fontFamily:"'Lora',serif",fontSize:20,fontWeight:600,color:T.dark,marginBottom:4}}>My Clients</div>
            <div style={{fontSize:12,color:T.sub,marginBottom:14}}>{clients.length} clients · Access their AI chat history and profiles</div>
            {clients.map((c,i)=>(
              <Card key={i} className="hvr" onClick={()=>{setSelClient(c);setPracChat([]);}} style={{marginBottom:11,cursor:"pointer",animation:`fadeUp 0.3s ease ${i*0.05}s both`}}>
                <div style={{display:"flex",gap:13,alignItems:"flex-start"}}>
                  <div style={{width:48,height:48,borderRadius:15,background:T.g1,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:18,flexShrink:0}}>{c.clientName?.[0]||"?"}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <div><div style={{fontWeight:800,fontSize:14,color:T.dark}}>{c.clientName}</div><div style={{fontSize:11,color:T.sub,marginTop:1}}>Last active: {c.lastActive||"Recently"}</div></div>
                      <div style={{display:"flex",gap:5,flexDirection:"column",alignItems:"flex-end"}}>
                        {c.aiProfile&&<span style={{background:"#E8F5E9",color:"#2E7D32",fontSize:9,fontWeight:800,padding:"3px 9px",borderRadius:7}}>✓ Brief Ready</span>}
                        <span style={{background:`${T.sky}22`,color:T.sky,fontSize:9,fontWeight:800,padding:"3px 9px",borderRadius:7}}>{(c.aiMessages||[]).filter(m=>m.role==="user").length} msgs</span>
                      </div>
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{(c.issues||[]).map(iss=><span key={iss} style={{background:`${T.lav}15`,color:T.lav,fontSize:10,padding:"3px 9px",borderRadius:7,fontWeight:600}}>{iss}</span>)}</div>
                  </div>
                </div>
              </Card>
            ))}
            {!clients.length&&<div style={{textAlign:"center",padding:44,color:T.sub}}><div style={{fontSize:40,marginBottom:12}}>👥</div><div style={{fontSize:13}}>No clients yet</div></div>}
          </div>}

          {pt==="schedule"&&<div style={{animation:"fadeUp 0.3s ease"}}>
            <div style={{fontFamily:"'Lora',serif",fontSize:20,fontWeight:600,color:T.dark,marginBottom:4}}>My Schedule</div>
            <div style={{fontSize:12,color:T.sub,marginBottom:16}}>Set weekly availability — clients see your open slots</div>
            <div style={{display:"flex",gap:7,marginBottom:14,overflowX:"auto",paddingBottom:2}}>
              {Object.keys(avail).map(d=>(
                <button key={d} onClick={()=>setAvDay(d)} style={{padding:"7px 14px",borderRadius:11,border:`2px solid ${avDay===d?T.mint:T.border}`,background:avDay===d?`${T.mint}15`:"#fff",color:avDay===d?T.mint:T.sub,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif",flexShrink:0,position:"relative"}}>
                  {d}{avail[d].length>0&&<div style={{position:"absolute",top:4,right:4,width:6,height:6,borderRadius:"50%",background:T.mint}}/>}
                </button>
              ))}
            </div>
            <Card>
              <div style={{fontSize:12,fontWeight:800,color:T.dark,marginBottom:11}}>{avDay} — Click to toggle slots</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                {slots.map(s=>{const on=avail[avDay].includes(s);return(
                  <button key={s} onClick={()=>setAvail(a=>({...a,[avDay]:on?a[avDay].filter(x=>x!==s):[...a[avDay],s]}))}
                    style={{padding:"10px 6px",borderRadius:11,border:`2px solid ${on?T.mint:T.border}`,background:on?`${T.mint}15`:"#fff",color:on?T.mint:T.sub,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>
                    {on?"✓ ":""}{s}
                  </button>
                );})}
              </div>
            </Card>
          </div>}

          {pt==="pricing"&&<div style={{animation:"fadeUp 0.3s ease"}}>
            <div style={{fontFamily:"'Lora',serif",fontSize:20,fontWeight:600,color:T.dark,marginBottom:4}}>Pricing</div>
            <div style={{fontSize:12,color:T.sub,marginBottom:16}}>Set your rate · MindWell takes 15% platform fee</div>
            <Card>
              <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:13}}>Hourly Rate</div>
              {!editRate
                ?<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div><div style={{fontFamily:"'Lora',serif",fontSize:34,fontWeight:600,color:T.lav}}>{inr(myRate)}<span style={{fontSize:13,color:T.sub,fontWeight:400}}>/hr</span></div><div style={{fontSize:11,color:T.green,marginTop:2}}>You receive: {inr(Math.round(myRate*0.85))}/hr after platform fee</div></div>
                    <Btn sm ghost onClick={()=>{setEditRate(true);setNewRate(String(myRate));}}>Edit</Btn>
                  </div>
                :<div style={{display:"flex",gap:9,alignItems:"center"}}>
                    <input value={newRate} onChange={e=>setNewRate(e.target.value)} type="number" placeholder="Rate in ₹" style={{flex:1,padding:"11px 13px",borderRadius:12,border:`1.5px solid ${T.lav}`,fontSize:16,fontWeight:700,outline:"none",color:T.dark}}/>
                    <Btn sm onClick={()=>{setMyRate(Number(newRate)||myRate);setEditRate(false);}}>Save</Btn>
                    <button onClick={()=>setEditRate(false)} style={{background:"none",border:"none",color:T.sub,fontSize:12,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Cancel</button>
                  </div>
              }
            </Card>
          </div>}

          {pt==="earnings"&&<div style={{animation:"fadeUp 0.3s ease"}}>
            <div style={{background:T.gd,borderRadius:20,padding:"22px 20px",marginBottom:14}}>
              <div style={{fontSize:10,letterSpacing:2,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",marginBottom:5}}>Total Earnings</div>
              <div style={{fontFamily:"'Lora',serif",fontSize:36,color:"#fff",fontWeight:600}}>{inr(totalEarnings)}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:3}}>After 15% platform fee: {inr(Math.round(totalEarnings*0.85))}</div>
            </div>
            <Card>
              <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:11}}>Session History</div>
              {bookings.length===0?<div style={{textAlign:"center",padding:22,color:T.sub,fontSize:12}}>No sessions yet</div>:bookings.map((b,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #E8E0F5"}}>
                  <div><div style={{fontWeight:700,fontSize:12,color:T.dark}}>{b.clientName}</div><div style={{fontSize:10,color:T.sub}}>{b.date} · {b.mode} · {b.duration} min</div></div>
                  <div style={{fontWeight:800,color:T.green,fontSize:13}}>+{inr(b.amount)}</div>
                </div>
              ))}
            </Card>
          </div>}

          {pt==="profile"&&<div style={{animation:"fadeUp 0.3s ease"}}>
            <div style={{fontFamily:"'Lora',serif",fontSize:20,fontWeight:600,color:T.dark,marginBottom:14}}>My Profile</div>
            <Card style={{marginBottom:14}}>
              <div style={{display:"flex",gap:15,alignItems:"flex-start"}}>
                <div style={{width:64,height:64,borderRadius:20,background:T.g2,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:22,flexShrink:0}}>{initials}</div>
                <div><div style={{fontFamily:"'Lora',serif",fontSize:18,fontWeight:600,color:T.dark}}>{prac.name}</div><div style={{fontSize:12,color:T.sub,marginTop:2}}>{prac.title} · {prac.city}</div>
                  <div style={{display:"flex",gap:7,marginTop:8}}><Badge color={T.mint}>● Live</Badge><Badge color={T.sky}>{inr(myRate)}/hr</Badge></div>
                </div>
              </div>
              <div style={{borderTop:"1px solid #E8E0F5",marginTop:14,paddingTop:14}}>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>{(prac.specs||[]).map(s=><Badge key={s} color={T.lav}>{s}</Badge>)}</div>
                {prac.bio&&<div style={{fontSize:13,color:T.text,lineHeight:1.75}}>{prac.bio}</div>}
              </div>
            </Card>
            <Card>
              <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:12}}>Account</div>
              {[["Email",prac.email],["Phone",prac.phone],["License",prac.license],["Experience",`${prac.exp} years`]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid #E8E0F5"}}>
                  <div style={{fontSize:12,color:T.sub}}>{l}</div><div style={{fontWeight:600,fontSize:12,color:T.dark}}>{v}</div>
                </div>
              ))}
              <button onClick={onLogout} style={{width:"100%",marginTop:16,padding:12,borderRadius:13,border:`2px solid ${T.coral}`,background:"none",color:T.coral,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Log Out</button>
            </Card>
          </div>}

        </div>
      </div>
    </div>
  );
}

function ClientApp({client,onLogout}) {
  const [tab,setTab] = useState("home");
  const [selIssues,setSelIssues] = useState([]);
  const [obDone,setObDone] = useState(()=>{try{return!!localStorage.getItem("mw_ob")}catch{return false}});
  const [balance,setBalance] = useState(()=>{try{return Number(localStorage.getItem("mw_bal")||500)}catch{return 500}});
  const [mins,setMins] = useState(()=>{try{return Number(localStorage.getItem("mw_mins")||30)}catch{return 30}});
  const [txns,setTxns] = useState(()=>{try{return JSON.parse(localStorage.getItem("mw_txns")||JSON.stringify([{type:"credit",amt:500,label:"Welcome Bonus 🎁",date:"Today"}]))}catch{return[{type:"credit",amt:500,label:"Welcome Bonus 🎁",date:"Today"}]}});
  const [therapists,setTherapists] = useState([]);
  const [fMode,setFMode] = useState("all"); const [fGender,setFGender] = useState("all"); const [fSpec,setFSpec] = useState("all"); const [searchQ,setSearchQ] = useState(""); const [fSort,setFSort] = useState("recommended");
  const [selDoc,setSelDoc] = useState(null); const [sessMode,setSessMode] = useState(null); const [inSess,setInSess] = useState(false);
  const [sessElapsed,setSessElapsed] = useState(0); const [sessMsgs,setSessMsgs] = useState([]); const [sessInput,setSessInput] = useState("");
  const [showRating,setShowRating] = useState(false); const [sessRating,setSessRating] = useState(5);
  const [cSessions,setCSessions] = useState(()=>{try{return JSON.parse(localStorage.getItem("mw_csessions")||"[]")}catch{return[]}});
  const timerRef = useRef(null);
  const [jEntries,setJEntries] = useState(()=>{try{return JSON.parse(localStorage.getItem("mw_journal")||"[]")}catch{return[]}});
  const [jText,setJText] = useState(""); const [jMood,setJMood] = useState(2); const [writing,setWriting] = useState(false);
  const [aiMsgs,setAiMsgs] = useState([{role:"assistant",text:"Namaste 🙏 I'm MindBot — your personal wellness companion. I'm here to listen without judgement. What's on your mind today?"}]);
  const [aiInput,setAiInput] = useState(""); const [aiLoad,setAiLoad] = useState(false);
  const [aiSummary,setAiSummary] = useState(null); const [sumLoad,setSumLoad] = useState(false);
  const aiEndRef = useRef(null);
  const [posts,setPosts] = useState(INIT_COMMUNITY); const [newPost,setNewPost] = useState(""); const [replyTo,setReplyTo] = useState(null); const [replyText,setReplyText] = useState(""); const [expanded,setExpanded] = useState(null);
  const [selBlog,setSelBlog] = useState(null); const [blogLikes,setBlogLikes] = useState({});
  const [showRaz,setShowRaz] = useState(false); const [razAmt,setRazAmt] = useState(null);
  const [showSOS,setShowSOS] = useState(false); const [showNotifs,setShowNotifs] = useState(false);
  const [moodDone,setMoodDone] = useState(false); const [moodIdx,setMoodIdx] = useState(null);

  useEffect(()=>{localStorage.setItem("mw_bal",balance)},[balance]);
  useEffect(()=>{localStorage.setItem("mw_mins",mins)},[mins]);
  useEffect(()=>{localStorage.setItem("mw_txns",JSON.stringify(txns))},[txns]);
  useEffect(()=>{localStorage.setItem("mw_journal",JSON.stringify(jEntries))},[jEntries]);
  useEffect(()=>{localStorage.setItem("mw_csessions",JSON.stringify(cSessions))},[cSessions]);
  useEffect(()=>{aiEndRef.current?.scrollIntoView({behavior:"smooth"})},[aiMsgs]);
  useEffect(()=>{if(inSess){timerRef.current=setInterval(()=>setSessElapsed(s=>s+1),1000);}else clearInterval(timerRef.current);return()=>clearInterval(timerRef.current);},[inSess]);
  useEffect(()=>{
    const approved=getPracs().filter(p=>p.status==="approved");
    setTherapists([...DEMO_DOCS,...approved.map((p,i)=>({id:100+i,name:p.name,title:p.title,city:p.city,lang:p.langs||[],specs:p.specs||[],rating:4.8,reviews:0,color:[T.sky,T.mint,T.lav,T.coral,T.gold][i%5],initials:p.name.split(" ").map(w=>w[0]).join("").slice(0,2),hourly:Number(p.hourly)||800,online:true,exp:p.exp||"N/A",gender:p.gender||"N/A",modes:p.modes||["chat","audio","video"],bio:p.bio||"",reviewList:[]}))]);
  },[]);

  const nav=(t)=>{setTab(t);setSelDoc(null);setInSess(false);setShowRating(false);setSessMode(null);setSelBlog(null);};

  const saveShared=(msgs)=>{try{const k="mw_shared_sessions";const all=JSON.parse(localStorage.getItem(k)||"[]");const idx=all.findIndex(s=>s.clientPhone===client?.phone);const entry={clientName:client?.name,clientPhone:client?.phone,issues:selIssues,aiMessages:msgs,lastActive:new Date().toISOString()};if(idx>=0)all[idx]={...all[idx],...entry};else all.push(entry);localStorage.setItem(k,JSON.stringify(all));}catch{}};

  const sendAI=async()=>{
    if(!aiInput.trim()||aiLoad)return;
    const txt=aiInput.trim();setAiInput("");
    const nm=[...aiMsgs,{role:"user",text:txt,ts:Date.now()}];setAiMsgs(nm);setAiLoad(true);
    try{
      const hist=aiMsgs.map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.text}));
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":ANTHROPIC_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,system:`You are MindBot, a warm compassionate AI mental health companion for MindWell. User name: ${client?.name||"Friend"}. Respond with genuine empathy. 2-3 sentences. Use warm Hindi naturally ('yaar','bilkul','haan'). Never diagnose. Gently suggest therapy. Always validate feelings first. Ask one gentle follow-up question.`,messages:[...hist,{role:"user",content:txt}]})});
      const d=await r.json();
      const reply=d.content?.find(b=>b.type==="text")?.text||"Main yahan hoon. Keep sharing.";
      const final=[...nm,{role:"assistant",text:reply,ts:Date.now()}];setAiMsgs(final);saveShared(final);
    }catch{const f=[...nm,{role:"assistant",text:"I'm here with you. Please keep sharing."}];setAiMsgs(f);saveShared(f);}
    setAiLoad(false);
  };

  const genSummary=async()=>{
    setSumLoad(true);
    const c=aiMsgs.map(m=>`${m.role==="user"?"Patient":"AI"}: ${m.text}`).join("\n");
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":ANTHROPIC_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:"Clinical briefing assistant. Use EXACTLY these bold headers: **Presenting Concerns**, **Emotional State**, **Key Themes**, **Personality Observations**, **Cultural Context**, **Recommended Focus Areas**, **Risk Flags**. Clinical but compassionate. Max 200 words. Indian context.",messages:[{role:"user",content:`Generate practitioner pre-session brief:\n\n${c}`}]})});
      const d=await r.json();const text=d.content?.find(b=>b.type==="text")?.text||"Unable to generate.";setAiSummary(text);
      try{const k="mw_shared_sessions";const all=JSON.parse(localStorage.getItem(k)||"[]");const idx=all.findIndex(s=>s.clientPhone===client?.phone);if(idx>=0){all[idx].aiProfile=text;all[idx].profileGeneratedAt=new Date().toISOString();}localStorage.setItem(k,JSON.stringify(all));}catch{}
    }catch{setAiSummary("Failed. Please try again.");}
    setSumLoad(false);
  };

  const endSess=()=>{
    setInSess(false);
    const cost=Math.max(50,Math.round(sessElapsed/60*(selDoc.hourly/60)));
    setBalance(b=>Math.max(0,b-cost));setMins(m=>Math.max(0,m-Math.ceil(sessElapsed/60)));
    const rec={therapist:selDoc.name,therapistId:selDoc.id,mode:sessMode,duration:Math.ceil(sessElapsed/60),date:new Date().toLocaleDateString("en-IN"),cost};
    setCSessions(s=>[rec,...s]);
    try{const k="mw_shared_bookings";const all=JSON.parse(localStorage.getItem(k)||"[]");all.unshift({clientName:client?.name,clientPhone:client?.phone,therapistId:selDoc.id,therapistName:selDoc.name,date:new Date().toLocaleDateString("en-IN"),duration:Math.ceil(sessElapsed/60),mode:sessMode,status:"completed",amount:cost});localStorage.setItem(k,JSON.stringify(all.slice(0,100)));}catch{}
    setShowRating(true);
  };

  const openRaz=(amt)=>{setRazAmt(amt);if(!window.Razorpay){const s=document.createElement("script");s.src="https://checkout.razorpay.com/v1/checkout.js";s.onload=()=>launchRaz(amt);document.body.appendChild(s);}else launchRaz(amt);};
  const launchRaz=(amt)=>{const opts={key:RAZORPAY_KEY,amount:amt*100,currency:"INR",name:"MindWell",description:"Therapy Session Recharge",prefill:{name:client?.name||"",contact:client?.phone||""},theme:{color:"#9B7FD4"},handler:()=>creditWallet(amt),modal:{ondismiss:()=>{setShowRaz(false);setRazAmt(null);}}};try{new window.Razorpay(opts).open();}catch{setShowRaz(true);}};
  const creditWallet=(amt)=>{setBalance(b=>b+amt);setMins(m=>m+Math.floor(amt/16.7));setTxns(t=>[{type:"credit",amt,label:`Recharge ${inr(amt)}`,date:new Date().toLocaleDateString("en-IN")},...t]);setShowRaz(false);setRazAmt(null);};

  const saveJournal=()=>{if(!jText.trim())return;setJEntries(p=>[{id:Date.now(),text:jText,mood:jMood,date:new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short"}),time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})},...p]);setJText("");setJMood(2);setWriting(false);};
  const addPost=()=>{if(!newPost.trim())return;setPosts(p=>[{id:Date.now(),author:client?.name||"Anonymous",text:newPost,likes:0,replies:[]},...p]);setNewPost("");};
  const addReply=(pid)=>{if(!replyText.trim())return;setPosts(p=>p.map(x=>x.id===pid?{...x,replies:[...x.replies,{author:client?.name||"Anonymous",text:replyText}]}:x));setReplyText("");setReplyTo(null);};

  const filteredDocs=therapists.filter(t=>{
    if(fMode!=="all"&&!t.modes.includes(fMode))return false;
    if(fGender!=="all"&&t.gender.toLowerCase()!==fGender)return false;
    if(fSpec!=="all"&&!t.specs.some(s=>s.toLowerCase().includes(fSpec.toLowerCase())))return false;
    if(searchQ.trim()){const q=searchQ.toLowerCase();if(!(t.name.toLowerCase().includes(q)||t.title.toLowerCase().includes(q)||t.city.toLowerCase().includes(q)||t.specs.some(s=>s.toLowerCase().includes(q))))return false;}
    return true;
  }).sort((a,b)=>{if(fSort==="rating")return b.rating-a.rating;if(fSort==="price_low")return a.hourly-b.hourly;if(fSort==="price_high")return b.hourly-a.hourly;return b.online-a.online||b.rating-a.rating;});

  const un=client?.name||"Friend";

  if(!obDone) return (
    <div style={{fontFamily:"'Nunito',sans-serif",background:"linear-gradient(160deg,#F7F4FE,#EDE5FF)",minHeight:"100vh",padding:"28px 20px",maxWidth:480,margin:"0 auto"}}>
      <div style={{animation:"fadeUp 0.5s ease"}}>
        <div style={{fontSize:11,letterSpacing:2,color:T.lav,textTransform:"uppercase",fontWeight:800,marginBottom:6}}>One quick step ✨</div>
        <div style={{fontFamily:"'Lora',serif",fontSize:22,fontWeight:600,color:T.dark,marginBottom:4}}>What would you like help with?</div>
        <div style={{fontSize:13,color:T.sub,marginBottom:20}}>Select all that apply — change anytime</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9,marginBottom:24}}>
          {ISSUES.map((x,i)=>{const sel=selIssues.includes(x.l);return(
            <button key={i} onClick={()=>setSelIssues(p=>sel?p.filter(v=>v!==x.l):[...p,x.l])}
              style={{padding:"13px 6px",borderRadius:14,border:`2px solid ${sel?T.lav:"#E8E0F5"}`,background:sel?"#EDE5FF":"#fff",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
              <div style={{fontSize:22,marginBottom:4}}>{x.i}</div>
              <div style={{fontSize:10,fontWeight:700,color:sel?T.lav:T.text,lineHeight:1.3}}>{x.l}</div>
            </button>
          );})}
        </div>
        <Btn full onClick={()=>{setObDone(true);localStorage.setItem("mw_ob","1");}}>{selIssues.length?`Continue (${selIssues.length} selected) →`:"Continue →"}</Btn>
        <button onClick={()=>{setObDone(true);localStorage.setItem("mw_ob","1");}} style={{background:"none",border:"none",color:T.sub,fontSize:12,cursor:"pointer",marginTop:10,display:"block",width:"100%",textAlign:"center",fontFamily:"'Nunito',sans-serif"}}>Skip</button>
      </div>
    </div>
  );

  return (
    <div style={{fontFamily:"'Nunito',sans-serif",minHeight:"100vh",background:T.bg}}>
      <div className="app-shell">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div style={{marginBottom:22}}><div style={{fontSize:24}}>🌿</div><div style={{fontFamily:"'Lora',serif",fontSize:17,color:"#fff",fontWeight:600}}>MindWell</div><div style={{fontSize:9,color:"rgba(255,255,255,0.28)"}}>Talk. Heal. Grow.</div></div>
          <div style={{background:"rgba(255,255,255,0.07)",borderRadius:12,padding:"11px 13px",marginBottom:18}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>Wallet Balance</div>
            <div style={{fontSize:19,fontWeight:900,color:"#fff"}}>{inr(balance)}</div>
            <div style={{fontSize:10,color:T.mint,marginTop:1}}>⏱ {mins} mins left</div>
          </div>
          {[{id:"home",l:"Home",ic:Ic.home},{id:"therapists",l:"Therapists",ic:Ic.search},{id:"journal",l:"Journal",ic:Ic.journal},{id:"ai",l:"AI Chat",ic:Ic.ai},{id:"wallet",l:"Wallet",ic:Ic.wallet},{id:"community",l:"Community",ic:Ic.community},{id:"blog",l:"Wellness Blog",ic:Ic.blog},{id:"profile",l:"Profile",ic:Ic.profile}].map(({id,l,ic})=>(
            <button key={id} onClick={()=>nav(id)} style={{width:"100%",display:"flex",alignItems:"center",gap:11,padding:"11px 12px",borderRadius:11,border:"none",background:tab===id?"rgba(155,127,212,0.25)":"none",color:tab===id?"#fff":"rgba(255,255,255,0.42)",fontSize:13,fontWeight:tab===id?700:400,cursor:"pointer",marginBottom:3,fontFamily:"'Nunito',sans-serif"}}>{ic}{l}</button>
          ))}
          <button onClick={()=>setShowSOS(true)} style={{width:"100%",marginTop:14,padding:"11px 12px",borderRadius:11,border:"none",background:"linear-gradient(135deg,#FF6B6B,#ee0979)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif",display:"flex",alignItems:"center",gap:8}}>{Ic.sos} SOS Help</button>
        </div>
        {/* MAIN */}
        <div className="main-area">
          <div className="page-pad">
            {/* HOME */}
            {tab==="home"&&<div style={{animation:"fadeUp 0.4s ease"}}>
              <div style={{background:T.gd,padding:"26px 18px 20px",borderRadius:"0 0 22px 22px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div><div style={{fontSize:10,letterSpacing:2,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",marginBottom:3}}>Namaste 🙏</div><div style={{fontFamily:"'Lora',serif",fontSize:23,color:"#fff",fontWeight:600,marginBottom:2}}>{un}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.38)"}}>How are you today?</div></div>
                  <button onClick={()=>setShowNotifs(true)} style={{width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>{Ic.bell}<div style={{position:"absolute",top:8,right:8,width:7,height:7,borderRadius:"50%",background:T.coral}}/></button>
                </div>
                <div style={{marginTop:12,background:"rgba(255,255,255,0.07)",borderRadius:13,padding:"11px 15px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>Wallet Balance</div><div style={{fontSize:19,fontWeight:900,color:"#fff"}}>{inr(balance)}</div></div>
                  <button onClick={()=>nav("wallet")} style={{background:T.g1,border:"none",borderRadius:10,padding:"8px 14px",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>+ Recharge</button>
                </div>
              </div>
              <div style={{padding:14}}>
                {/* FEEL GOOD POSTERS */}
                <div style={{display:"flex",gap:11,overflowX:"auto",paddingBottom:6,marginBottom:14}}>
                  {[
                    {q:"\"You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, or just bad.\"",author:"Lori Deschene",grad:"linear-gradient(135deg,#667eea,#764ba2)",icon:"🌙"},
                    {q:"\"Healing is not linear. Be patient with yourself.\"",author:"Unknown",grad:"linear-gradient(135deg,#f093fb,#f5576c)",icon:"🌸"},
                    {q:"\"There is no shame in taking care of your mental health.\"",author:"Michael Phelps",grad:"linear-gradient(135deg,#4facfe,#00f2fe)",icon:"💙"},
                    {q:"\"Your mental health is a priority. Your happiness is essential.\"",author:"MindWell",grad:"linear-gradient(135deg,#43e97b,#38f9d7)",icon:"🌿"},
                    {q:"\"It's okay to ask for help. That is strength, not weakness.\"",author:"Unknown",grad:"linear-gradient(135deg,#fa709a,#fee140)",icon:"✨"},
                  ].map((p,i)=>(
                    <div key={i} style={{minWidth:230,borderRadius:18,padding:"18px 16px",background:p.grad,flexShrink:0,position:"relative",overflow:"hidden",boxShadow:"0 6px 20px rgba(0,0,0,0.15)"}}>
                      <div style={{position:"absolute",top:-15,right:-15,fontSize:52,opacity:0.18}}>{p.icon}</div>
                      <div style={{fontSize:36,marginBottom:10}}>{p.icon}</div>
                      <div style={{fontFamily:"'Lora',serif",fontSize:13,color:"#fff",lineHeight:1.65,fontStyle:"italic",marginBottom:8}}>{p.q}</div>
                      <div style={{fontSize:10,color:"rgba(255,255,255,0.7)",fontWeight:700}}>— {p.author}</div>
                    </div>
                  ))}
                </div>
                {!moodDone?(<Card style={{marginBottom:12}}>
                  <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:11}}>How are you feeling? 💭</div>
                  <div style={{display:"flex",justifyContent:"space-between"}}>{MOODS.map((m,i)=><button key={i} onClick={()=>{setMoodIdx(i);setMoodDone(true);}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer"}}><div style={{fontSize:26}}>{m}</div><div style={{fontSize:9,color:T.sub,fontWeight:600}}>{MOODL[i]}</div></button>)}</div>
                </Card>):(
                  <div style={{background:`${MOODC[moodIdx]}44`,borderRadius:13,padding:"10px 15px",display:"flex",gap:10,alignItems:"center",marginBottom:12,border:`1px solid ${MOODC[moodIdx]}`}}>
                    <div style={{fontSize:22}}>{MOODS[moodIdx]}</div><div><div style={{fontWeight:700,fontSize:13,color:T.dark}}>Feeling {MOODL[moodIdx]} today</div><div style={{fontSize:11,color:T.sub}}>Mood logged ✓</div></div>
                  </div>
                )}
                {/* WE ARE HERE FOR YOU */}
                <div style={{background:"linear-gradient(135deg,#1A1035,#2D1B6B)",borderRadius:20,padding:"20px 18px",marginBottom:14,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,borderRadius:"50%",background:"rgba(155,127,212,0.1)"}}/>
                  <div style={{position:"absolute",bottom:-30,left:-10,width:100,height:100,borderRadius:"50%",background:"rgba(91,141,239,0.08)"}}/>
                  <div style={{display:"flex",gap:6,marginBottom:10}}>
                    {["🫂","💙","🌿"].map(e=><span key={e} style={{fontSize:20}}>{e}</span>)}
                  </div>
                  <div style={{fontFamily:"'Lora',serif",fontSize:20,color:"#fff",fontWeight:600,marginBottom:6,lineHeight:1.35}}>We are here for you</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.55)",lineHeight:1.75,marginBottom:14}}>You don't have to go through this alone. Whether it's stress, sadness, anxiety, or just feeling lost — a real human who cares is just a tap away.</div>
                  <div style={{display:"flex",gap:9}}>
                    <button onClick={()=>nav("therapists")} style={{flex:1,background:T.g1,border:"none",borderRadius:12,padding:"11px 8px",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Talk to a Therapist →</button>
                    <button onClick={()=>nav("ai")} style={{flex:1,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:12,padding:"11px 8px",color:"rgba(255,255,255,0.85)",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Chat with AI 🤖</button>
                  </div>
                </div>
                <div style={{background:T.g1,borderRadius:18,padding:"18px 18px",position:"relative",overflow:"hidden",marginBottom:12}}>
                  <div style={{position:"absolute",right:-10,top:-10,width:90,height:90,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
                  <div style={{fontSize:20,marginBottom:5}}>🧠</div>
                  <div style={{fontFamily:"'Lora',serif",fontSize:18,color:"#fff",fontWeight:600,marginBottom:3}}>Find a Therapist</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginBottom:12}}>{therapists.filter(t=>t.online).length} verified Indian practitioners available now</div>
                  <button onClick={()=>nav("therapists")} style={{background:"#fff",border:"none",borderRadius:11,padding:"10px 20px",color:T.lav,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Browse Therapists →</button>
                </div>
                <div style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}><div style={{fontSize:13,fontWeight:800,color:T.dark}}>🌱 Wellness Reads</div><button onClick={()=>nav("blog")} style={{background:"none",border:"none",color:T.lav,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>See all →</button></div>
                  <div style={{display:"flex",gap:11,overflowX:"auto",paddingBottom:4}}>
                    {BLOGS.slice(0,3).map(p=>(
                      <div key={p.id} onClick={()=>{setSelBlog(p);nav("blog");}} className="hvr" style={{minWidth:180,background:"#fff",borderRadius:15,padding:"14px 13px",border:"1px solid #E8E0F5",cursor:"pointer",flexShrink:0}}>
                        <div style={{fontSize:26,marginBottom:7}}>{p.emoji}</div><Badge color={p.color}>{p.tag}</Badge>
                        <div style={{fontSize:12,fontWeight:700,color:T.dark,lineHeight:1.4,marginTop:7}}>{p.title}</div>
                        <div style={{fontSize:10,color:T.sub,marginTop:4}}>{p.author}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}><div style={{fontSize:13,fontWeight:800,color:T.dark}}>✨ Recommended</div><button onClick={()=>nav("therapists")} style={{background:"none",border:"none",color:T.lav,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>See all →</button></div>
                  {therapists.slice(0,3).map((t,i)=>(
                    <div key={t.id} className="hvr" onClick={()=>{setSelDoc(t);setTab("therapists");}} style={{background:"#fff",borderRadius:16,padding:14,boxShadow:"0 2px 14px rgba(99,74,150,0.06)",border:"1px solid #E8E0F5",marginBottom:9,cursor:"pointer",animation:`fadeUp 0.35s ease ${i*0.07}s both`}}>
                      <div style={{display:"flex",gap:11}}>
                        <div style={{width:48,height:48,borderRadius:14,background:`linear-gradient(145deg,${t.color},${t.color}99)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:14,flexShrink:0}}>{t.initials}</div>
                        <div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:800,fontSize:13,color:T.dark}}>{t.name}</div><div style={{fontSize:10,color:T.sub}}>{t.title}</div></div><Badge color={t.online?T.mint:T.sub}>{t.online?"● Online":"Offline"}</Badge></div>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:7}}><div style={{display:"flex",gap:3,alignItems:"center",color:T.gold,fontSize:11,fontWeight:700}}>{Ic.star} {t.rating}<span style={{color:T.sub,fontWeight:400,fontSize:10}}>({t.reviews})</span></div><div style={{fontWeight:900,color:T.lav,fontSize:13}}>{inr(t.hourly)}/hr</div></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={()=>setShowSOS(true)} style={{width:"100%",padding:14,borderRadius:16,border:"none",background:"linear-gradient(135deg,#FF6B6B,#ee0979)",color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:9,fontFamily:"'Nunito',sans-serif",animation:"pulse 3s ease infinite"}}>{Ic.sos} I'm Feeling Overwhelmed — SOS</button>
              </div>
            </div>}

            {/* THERAPISTS */}
            {tab==="therapists"&&!selDoc&&!inSess&&!showRating&&<div style={{animation:"fadeUp 0.3s ease"}}>
              <div style={{background:T.gd,padding:"20px 16px 14px",borderRadius:"0 0 22px 22px"}}>
                <div style={{fontFamily:"'Lora',serif",fontSize:21,color:"#fff",fontWeight:600,marginBottom:2}}>Find Your Therapist</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.38)",marginBottom:12}}>{therapists.length} verified Indian practitioners</div>
                <div style={{position:"relative"}}><div style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.38)",pointerEvents:"none"}}>🔍</div>
                  <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search by name, issue, city..." style={{width:"100%",padding:"12px 14px 12px 36px",borderRadius:13,border:"1.5px solid rgba(255,255,255,0.13)",background:"rgba(255,255,255,0.11)",color:"#fff",fontSize:13,outline:"none",fontFamily:"'Nunito',sans-serif"}}/>
                  {searchQ&&<button onClick={()=>setSearchQ("")} style={{position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:17}}>×</button>}
                </div>
              </div>
              <div style={{background:"#fff",borderBottom:"1px solid #E8E0F5",padding:"9px 13px"}}>
                <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
                  {[{v:"all",l:"✨ All"},{v:"anxiety",l:"💭 Anxiety"},{v:"depression",l:"🌧 Depression"},{v:"trauma",l:"💫 Trauma"},{v:"relationships",l:"💔 Relationships"},{v:"stress",l:"🔥 Stress"},{v:"grief",l:"🕊 Grief"},{v:"lgbtq",l:"🏳️‍🌈 LGBTQ+"},{v:"sleep",l:"😴 Sleep"},{v:"family",l:"🏠 Family"},{v:"addiction",l:"🔗 Addiction"}].map(o=>(
                    <button key={o.v} onClick={()=>setFSpec(o.v)} style={{padding:"5px 11px",borderRadius:15,border:`1.5px solid ${fSpec===o.v?T.lav:"#E8E0F5"}`,background:fSpec===o.v?"#EDE5FF":"#F7F4FE",color:fSpec===o.v?T.lav:T.sub,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif",whiteSpace:"nowrap",flexShrink:0}}>{o.l}</button>
                  ))}
                </div>
              </div>
              <div style={{background:"#fff",borderBottom:"1px solid #E8E0F5",padding:"8px 13px"}}>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                  {[{v:"all",l:"All Modes"},{v:"chat",l:"💬 Chat"},{v:"audio",l:"📞 Audio"},{v:"video",l:"🎥 Video"}].map(o=><button key={o.v} onClick={()=>setFMode(o.v)} style={{padding:"5px 10px",borderRadius:14,border:`1.5px solid ${fMode===o.v?T.sky:"#E8E0F5"}`,background:fMode===o.v?`${T.sky}18`:"#fff",color:fMode===o.v?T.sky:T.sub,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif",whiteSpace:"nowrap"}}>{o.l}</button>)}
                  {[{v:"all",l:"Any Gender"},{v:"female",l:"👩 Female"},{v:"male",l:"👨 Male"}].map(o=><button key={o.v} onClick={()=>setFGender(o.v)} style={{padding:"5px 10px",borderRadius:14,border:`1.5px solid ${fGender===o.v?T.mint:"#E8E0F5"}`,background:fGender===o.v?`${T.mint}18`:"#fff",color:fGender===o.v?T.mint:T.sub,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif",whiteSpace:"nowrap"}}>{o.l}</button>)}
                  <select value={fSort} onChange={e=>setFSort(e.target.value)} style={{padding:"5px 10px",borderRadius:14,border:"1.5px solid #E8E0F5",background:"#fff",color:T.sub,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif",outline:"none",marginLeft:"auto"}}>
                    <option value="recommended">⭐ Recommended</option><option value="rating">🏆 Top Rated</option><option value="price_low">💰 Lowest Price</option><option value="price_high">💎 Highest Price</option>
                  </select>
                </div>
              </div>
              <div style={{padding:"11px 13px"}}>
                {filteredDocs.length===0?<div style={{textAlign:"center",padding:"44px 20px"}}><div style={{fontSize:48,marginBottom:13}}>🔍</div><div style={{fontSize:14,fontWeight:700,color:T.dark,marginBottom:6}}>No therapists found</div><Btn sm onClick={()=>{setSearchQ("");setFMode("all");setFGender("all");setFSpec("all");}}>Clear Filters</Btn></div>
                :filteredDocs.map((t,i)=>(
                  <div key={t.id} className="hvr" onClick={()=>setSelDoc(t)} style={{background:"#fff",borderRadius:20,boxShadow:"0 3px 18px rgba(99,74,150,0.07)",border:"1px solid #E8E0F5",marginBottom:12,cursor:"pointer",overflow:"hidden",animation:`fadeUp 0.3s ease ${Math.min(i*0.04,0.3)}s both`}}>
                    <div style={{background:`linear-gradient(135deg,${t.color}22,${t.color}08)`,padding:"16px 15px 12px",display:"flex",gap:13,alignItems:"flex-start"}}>
                      <div style={{position:"relative",flexShrink:0}}>
                        <div style={{width:66,height:66,borderRadius:20,background:`linear-gradient(145deg,${t.color},${t.color}99)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:21,boxShadow:`0 6px 20px ${t.color}55`}}>{t.initials}</div>
                        {t.online&&<div style={{position:"absolute",bottom:3,right:3,width:12,height:12,borderRadius:"50%",background:T.green,border:"2.5px solid #fff"}}/>}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:5}}>
                          <div><div style={{fontWeight:900,fontSize:14,color:T.dark}}>{t.name}</div><div style={{fontSize:11,color:T.sub,marginTop:1}}>{t.title}</div><div style={{fontSize:10,color:T.sub,marginTop:1}}>📍 {t.city} · {t.exp}</div></div>
                          <div style={{fontWeight:900,color:T.lav,fontSize:14,whiteSpace:"nowrap"}}>{inr(t.hourly)}<span style={{fontSize:9,fontWeight:400,color:T.sub}}>/hr</span></div>
                        </div>
                        <div style={{display:"flex",gap:4,marginTop:8,alignItems:"center"}}><div style={{display:"flex",gap:2,alignItems:"center",color:T.gold,fontSize:12,fontWeight:800}}>{Ic.star} {t.rating}</div><div style={{fontSize:10,color:T.sub}}>({t.reviews})</div></div>
                      </div>
                    </div>
                    <div style={{padding:"8px 15px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{t.specs.slice(0,3).map(s=><span key={s} style={{background:`${t.color}15`,color:t.color,fontSize:9,padding:"3px 8px",borderRadius:7,fontWeight:700}}>{s}</span>)}</div><div style={{fontSize:10,color:T.sub,marginTop:4}}>🗣 {(t.lang||[]).slice(0,2).join(", ")}</div></div>
                      <button onClick={e=>{e.stopPropagation();setSelDoc(t);}} style={{background:T.g1,border:"none",borderRadius:11,padding:"9px 15px",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif",flexShrink:0}}>View →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>}

            {/* THERAPIST DETAIL */}
            {tab==="therapists"&&selDoc&&!inSess&&!showRating&&<div style={{animation:"fadeUp 0.3s ease"}}>
              <div style={{background:`linear-gradient(160deg,${selDoc.color}33,${T.bg})`,padding:"18px 18px 0"}}>
                <button onClick={()=>setSelDoc(null)} style={{background:"none",border:"none",color:selDoc.color,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:13,fontWeight:700,marginBottom:16,fontFamily:"'Nunito',sans-serif"}}>{Ic.back} All Therapists</button>
                <div style={{textAlign:"center",paddingBottom:18}}>
                  <div style={{width:80,height:80,borderRadius:24,background:`linear-gradient(135deg,${selDoc.color},${selDoc.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:24,margin:"0 auto 11px",boxShadow:`0 10px 26px ${selDoc.color}55`}}>{selDoc.initials}</div>
                  <div style={{fontFamily:"'Lora',serif",fontSize:21,fontWeight:600,color:T.dark}}>{selDoc.name}</div>
                  <div style={{fontSize:11,color:T.sub,marginTop:2}}>{selDoc.title} · {selDoc.city} · {selDoc.exp}</div>
                  <div style={{display:"flex",gap:4,justifyContent:"center",flexWrap:"wrap",marginTop:9}}>{selDoc.specs.map(s=><Badge key={s} color={selDoc.color}>{s}</Badge>)}</div>
                </div>
              </div>
              <div style={{padding:"0 13px 20px"}}>
                <Card style={{marginBottom:12}}><div style={{fontSize:13,color:T.text,lineHeight:1.8}}>{selDoc.bio}</div></Card>
                <Card style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}><div style={{fontSize:13,fontWeight:800,color:T.dark}}>Session Type</div><div style={{fontWeight:900,color:T.lav,fontSize:14}}>{inr(selDoc.hourly)}/hr</div></div>
                  <div style={{display:"flex",gap:8}}>{selDoc.modes.map(m=><button key={m} onClick={()=>setSessMode(m)} style={{flex:1,padding:"12px 6px",borderRadius:13,border:`2px solid ${sessMode===m?T.lav:"#E8E0F5"}`,background:sessMode===m?"#EDE5FF":"#fff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <div style={{color:sessMode===m?T.lav:T.sub}}>{m==="chat"?Ic.chat:m==="audio"?Ic.phone:Ic.video}</div>
                    <div style={{fontSize:11,fontWeight:700,color:sessMode===m?T.lav:T.sub,textTransform:"capitalize"}}>{m}</div>
                  </button>)}</div>
                </Card>
                {selDoc.reviewList?.length>0&&<Card style={{marginBottom:12}}>
                  <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:11}}>Patient Reviews ⭐</div>
                  {selDoc.reviewList.map((r,i)=>(
                    <div key={i} style={{paddingBottom:10,marginBottom:10,borderBottom:i<selDoc.reviewList.length-1?"1px solid #E8E0F5":"none"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><div style={{fontWeight:700,fontSize:12,color:T.dark}}>{r.name}</div><div style={{color:T.gold,fontSize:12}}>{"⭐".repeat(r.stars)}</div></div>
                      <div style={{fontSize:12,color:T.text,lineHeight:1.65,fontStyle:"italic"}}>"{r.text}"</div>
                    </div>
                  ))}
                </Card>}
                {mins<15&&<div style={{background:"#FFF3E0",borderRadius:11,padding:"9px 13px",marginBottom:12,fontSize:11,color:"#E65100"}}>⚠️ Low balance. <span style={{fontWeight:700,cursor:"pointer",textDecoration:"underline"}} onClick={()=>nav("wallet")}>Recharge →</span></div>}
                <Btn full disabled={!sessMode} onClick={()=>{if(sessMode){setInSess(true);setSessElapsed(0);setSessMsgs([{from:"them",text:`Namaste! I'm ${selDoc.name}. I'm glad you reached out. How are you feeling today?`}]);}}}>
                  {sessMode?`Start ${sessMode} session →`:"Select a session type first"}
                </Btn>
              </div>
            </div>}

            {/* IN SESSION */}
            {tab==="therapists"&&inSess&&selDoc&&<div style={{display:"flex",flexDirection:"column",height:"100vh",background:sessMode==="video"?"#0D0A2E":sessMode==="audio"?"linear-gradient(160deg,#1A1035,#2D1B6B)":T.bg,animation:"fadeUp 0.3s ease"}}>
              {/* SESSION HEADER */}
              <div style={{background:T.gd,padding:13,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
                <div style={{display:"flex",alignItems:"center",gap:9}}>
                  <div style={{width:34,height:34,borderRadius:11,background:selDoc.color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:12}}>{selDoc.initials}</div>
                  <div><div style={{fontWeight:700,color:"#fff",fontSize:13}}>{selDoc.name}</div><div style={{fontSize:10,color:T.mint}}>● {sessMode==="video"?"Video Call":sessMode==="audio"?"Voice Call":"Chat"} · Live</div></div>
                </div>
                <div style={{display:"flex",gap:7,alignItems:"center"}}>
                  <div style={{background:"rgba(255,255,255,0.1)",borderRadius:8,padding:"5px 10px",fontSize:11,color:"#fff",fontWeight:700}}>⏱ {Math.floor(sessElapsed/60)}:{String(sessElapsed%60).padStart(2,"0")}</div>
                  <button onClick={endSess} style={{background:T.coral,border:"none",borderRadius:9,padding:"7px 12px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>End</button>
                </div>
              </div>

              {/* VIDEO MODE */}
              {sessMode==="video"&&<>
                <div style={{flex:1,position:"relative",background:"#0D0A2E",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  {/* Remote video (therapist) */}
                  <div style={{width:"100%",height:"60%",background:"linear-gradient(160deg,#1A1035,#2a1a5e)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative"}}>
                    <div style={{width:90,height:90,borderRadius:"50%",background:`linear-gradient(135deg,${selDoc.color},${selDoc.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:28,marginBottom:12,boxShadow:`0 0 0 4px ${selDoc.color}44, 0 0 0 8px ${selDoc.color}22`}}>{selDoc.initials}</div>
                    <div style={{fontWeight:700,color:"#fff",fontSize:16}}>{selDoc.name}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",marginTop:4}}>🔴 Live · Video On</div>
                    <div style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.5)",borderRadius:8,padding:"4px 10px",fontSize:9,color:"rgba(255,255,255,0.6)",fontWeight:700}}>🔒 E2E Encrypted</div>
                  </div>
                  {/* Self preview */}
                  <div style={{position:"absolute",bottom:16,right:16,width:90,height:120,borderRadius:14,background:"linear-gradient(135deg,#2D2048,#1A1035)",border:"2px solid rgba(255,255,255,0.2)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.5)"}}>
                    <div style={{fontSize:26,marginBottom:4}}>{client?.name?.[0]?.toUpperCase()||"Y"}</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.4)"}}>You</div>
                  </div>
                  {/* Video controls */}
                  <div style={{position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",display:"flex",gap:14,alignItems:"center"}}>
                    {[{icon:"🎤",label:"Mute"},{icon:"📹",label:"Camera"},{icon:"💬",label:"Chat"}].map(c=>(
                      <button key={c.label} style={{width:46,height:46,borderRadius:"50%",background:"rgba(255,255,255,0.12)",border:"none",color:"#fff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontSize:18}}>
                        {c.icon}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Chat strip below video */}
                <div style={{height:160,background:"rgba(0,0,0,0.5)",display:"flex",flexDirection:"column",flexShrink:0}}>
                  <div style={{flex:1,overflowY:"auto",padding:"8px 12px",display:"flex",flexDirection:"column",gap:6}}>
                    {sessMsgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.from==="me"?"flex-end":"flex-start"}}><div style={{maxWidth:"78%",padding:"7px 12px",borderRadius:13,background:m.from==="me"?"rgba(91,141,239,0.8)":"rgba(255,255,255,0.12)",color:"#fff",fontSize:12,lineHeight:1.5}}>{m.text}</div></div>)}
                  </div>
                  <div style={{padding:"7px 10px",display:"flex",gap:7}}>
                    <input value={sessInput} onChange={e=>setSessInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&sessInput.trim()){const t=sessInput.trim();setSessInput("");setSessMsgs(m=>[...m,{from:"me",text:t}]);setTimeout(()=>setSessMsgs(m=>[...m,{from:"them",text:"I hear you. Tell me more."}]),1200);}}} placeholder="Type a message..." style={{flex:1,padding:"8px 12px",borderRadius:14,border:"none",background:"rgba(255,255,255,0.12)",color:"#fff",fontSize:12,outline:"none"}}/>
                    <button onClick={()=>{if(!sessInput.trim())return;const t=sessInput.trim();setSessInput("");setSessMsgs(m=>[...m,{from:"me",text:t}]);setTimeout(()=>setSessMsgs(m=>[...m,{from:"them",text:"I hear you."}]),1200);}} style={{width:36,height:36,borderRadius:"50%",border:"none",background:T.g1,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.send}</button>
                  </div>
                </div>
              </>}

              {/* AUDIO MODE */}
              {sessMode==="audio"&&<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
                <div style={{width:110,height:110,borderRadius:"50%",background:`linear-gradient(135deg,${selDoc.color},${selDoc.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:32,marginBottom:16,boxShadow:`0 0 0 12px ${selDoc.color}22,0 0 0 24px ${selDoc.color}11`,animation:"pulse 2s ease infinite"}}>{selDoc.initials}</div>
                <div style={{fontFamily:"'Lora',serif",fontSize:22,color:"#fff",fontWeight:600,marginBottom:4}}>{selDoc.name}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginBottom:4}}>{selDoc.title}</div>
                <div style={{background:"rgba(78,205,196,0.2)",borderRadius:10,padding:"5px 14px",marginBottom:28}}><div style={{fontSize:11,color:T.mint,fontWeight:700}}>🎙 Voice Call · Connected</div></div>
                {/* Audio waveform animation */}
                <div style={{display:"flex",gap:4,alignItems:"center",marginBottom:32,height:36}}>
                  {[16,28,20,36,22,30,18,34,24,28,16,32,20,26].map((h,i)=>(
                    <div key={i} style={{width:4,height:h,borderRadius:2,background:`${selDoc.color}`,opacity:0.7,animation:`bounce 0.6s infinite ${i*0.07}s`}}/>
                  ))}
                </div>
                {/* Audio controls */}
                <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:28}}>
                  {[{icon:"🎤",label:"Mute",bg:"rgba(255,255,255,0.12)"},{icon:"🔊",label:"Speaker",bg:"rgba(255,255,255,0.12)"},{icon:"⌨️",label:"Keypad",bg:"rgba(255,255,255,0.12)"}].map(c=>(
                    <button key={c.label} style={{width:56,height:56,borderRadius:"50%",background:c.bg,border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2}}>
                      <span style={{fontSize:22}}>{c.icon}</span><span style={{fontSize:8,color:"rgba(255,255,255,0.5)",fontWeight:600}}>{c.label}</span>
                    </button>
                  ))}
                </div>
                <button onClick={endSess} style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B6B,#ee0979)",border:"none",color:"#fff",cursor:"pointer",fontSize:24,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 20px rgba(238,9,121,0.4)"}}>📵</button>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:10}}>Tap to end call</div>
                {/* Chat below audio */}
                <div style={{width:"100%",maxWidth:400,marginTop:20,background:"rgba(255,255,255,0.07)",borderRadius:16,padding:13}}>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Session Notes</div>
                  <div style={{maxHeight:90,overflowY:"auto",display:"flex",flexDirection:"column",gap:5,marginBottom:8}}>
                    {sessMsgs.map((m,i)=><div key={i} style={{fontSize:11,color:m.from==="me"?"rgba(155,127,212,0.9)":"rgba(255,255,255,0.5)",lineHeight:1.5}}><b>{m.from==="me"?"You":"Dr."}:</b> {m.text}</div>)}
                  </div>
                  <div style={{display:"flex",gap:7}}>
                    <input value={sessInput} onChange={e=>setSessInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&sessInput.trim()){const t=sessInput.trim();setSessInput("");setSessMsgs(m=>[...m,{from:"me",text:t}]);setTimeout(()=>setSessMsgs(m=>[...m,{from:"them",text:"Noted, thank you for sharing."}]),1200);}}} placeholder="Type a note..." style={{flex:1,padding:"8px 12px",borderRadius:12,border:"none",background:"rgba(255,255,255,0.1)",color:"#fff",fontSize:12,outline:"none"}}/>
                    <button onClick={()=>{if(!sessInput.trim())return;const t=sessInput.trim();setSessInput("");setSessMsgs(m=>[...m,{from:"me",text:t}]);}} style={{width:34,height:34,borderRadius:"50%",border:"none",background:T.g1,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.send}</button>
                  </div>
                </div>
              </div>}

              {/* CHAT MODE */}
              {sessMode==="chat"&&<>
                <div style={{flex:1,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:8}}>
                  {sessMsgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.from==="me"?"flex-end":"flex-start"}}><div style={{maxWidth:"78%",padding:"10px 14px",borderRadius:17,background:m.from==="me"?T.g1:"#fff",color:m.from==="me"?"#fff":T.text,fontSize:13,lineHeight:1.6,border:m.from!=="me"?"1px solid #E8E0F5":"none"}}>{m.text}</div></div>)}
                </div>
                <div style={{padding:"8px 11px",background:"#fff",borderTop:"1px solid #E8E0F5",display:"flex",gap:7,flexShrink:0}}>
                  <input value={sessInput} onChange={e=>setSessInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&sessInput.trim()){const t=sessInput.trim();setSessInput("");setSessMsgs(m=>[...m,{from:"me",text:t}]);setTimeout(()=>setSessMsgs(m=>[...m,{from:"them",text:"I hear you. That sounds really challenging. Can you tell me more?"}]),1200);}}} placeholder="Type a message..." style={{flex:1,padding:"10px 14px",borderRadius:18,border:"1px solid #E8E0F5",background:T.bg,fontSize:13,outline:"none",color:T.text}}/>
                  <button onClick={()=>{if(!sessInput.trim())return;const t=sessInput.trim();setSessInput("");setSessMsgs(m=>[...m,{from:"me",text:t}]);setTimeout(()=>setSessMsgs(m=>[...m,{from:"them",text:"I hear you. Can you tell me more about that?"}]),1200);}} style={{width:40,height:40,borderRadius:"50%",border:"none",background:T.g1,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.send}</button>
                </div>
              </>}
            </div>}

            {/* RATING */}
            {tab==="therapists"&&showRating&&<div style={{padding:28,textAlign:"center",animation:"fadeUp 0.4s ease"}}>
              <div style={{fontSize:60,marginBottom:14}}>🌟</div>
              <div style={{fontFamily:"'Lora',serif",fontSize:22,fontWeight:600,color:T.dark,marginBottom:7}}>Session Complete!</div>
              <div style={{fontSize:13,color:T.sub,marginBottom:22,lineHeight:1.8}}>Duration: {Math.ceil(sessElapsed/60)} min<br/>Rate your session with {selDoc?.name}</div>
              <div style={{display:"flex",justifyContent:"center",gap:11,marginBottom:26}}>{[1,2,3,4,5].map(s=><button key={s} onClick={()=>setSessRating(s)} style={{background:"none",border:"none",fontSize:30,cursor:"pointer",opacity:s<=sessRating?1:0.3,transition:"all 0.2s"}}>⭐</button>)}</div>
              <Btn full onClick={()=>{setShowRating(false);setSelDoc(null);setSessMode(null);nav("home");}}>Done ✓</Btn>
            </div>}

            {/* JOURNAL */}
            {tab==="journal"&&<div style={{animation:"fadeUp 0.3s ease"}}>
              <div style={{background:T.gd,padding:"24px 18px 18px",borderRadius:"0 0 22px 22px"}}><div style={{fontFamily:"'Lora',serif",fontSize:21,color:"#fff",fontWeight:600,marginBottom:3}}>My Journal 📓</div><div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>Private · AI-powered · Encrypted</div></div>
              <div style={{padding:"13px 13px"}}>
                {!writing?(<>
                  <button onClick={()=>setWriting(true)} style={{width:"100%",padding:14,borderRadius:14,border:`2px dashed ${T.lav}`,background:"#EDE5FF",color:T.lav,fontSize:13,fontWeight:800,cursor:"pointer",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"center",gap:7,fontFamily:"'Nunito',sans-serif"}}>✏️ Write Today's Entry</button>
                  <Card style={{marginBottom:12,background:"linear-gradient(135deg,#9B7FD422,#5B8DEF11)"}}><div style={{fontSize:10,letterSpacing:2,color:T.lav,textTransform:"uppercase",fontWeight:800,marginBottom:6}}>Today's Prompt ✨</div><div style={{fontSize:14,fontWeight:700,color:T.dark,fontFamily:"'Lora',serif",fontStyle:"italic",marginBottom:9}}>"{PROMPTS[new Date().getDay()%PROMPTS.length]}"</div><Btn sm onClick={()=>setWriting(true)}>Respond →</Btn></Card>
                  {jEntries.length===0?<div style={{textAlign:"center",padding:36,color:T.sub}}><div style={{fontSize:44,marginBottom:10}}>✏️</div><div style={{fontSize:13}}>Your journal is empty — begin your story</div></div>
                  :jEntries.map(e=>(
                    <Card key={e.id} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{fontSize:10,color:T.sub}}>{e.date} · {e.time}</div><div style={{fontSize:20}}>{MOODS[e.mood]}</div></div><div style={{height:3,borderRadius:2,background:MOODC[e.mood],marginBottom:8}}/><div style={{fontSize:13,color:T.text,lineHeight:1.75}}>{e.text}</div></Card>
                  ))}
                </>):(
                  <Card>
                    <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:12}}>How are you feeling?</div>
                    <div style={{display:"flex",justifyContent:"space-around",marginBottom:16}}>{MOODS.map((m,i)=><button key={i} onClick={()=>setJMood(i)} style={{background:"none",border:"none",fontSize:28,cursor:"pointer",opacity:jMood===i?1:0.3,transform:jMood===i?"scale(1.3)":"scale(1)",transition:"all 0.2s"}}>{m}</button>)}</div>
                    <textarea value={jText} onChange={e=>setJText(e.target.value)} placeholder="Write freely — no judgement, just you..." style={{width:"100%",height:150,padding:12,borderRadius:12,border:"1px solid #E8E0F5",background:T.bg,fontSize:13,lineHeight:1.75,color:T.text,outline:"none"}}/>
                    <div style={{display:"flex",gap:8,marginTop:11}}><button onClick={()=>setWriting(false)} style={{flex:1,padding:10,borderRadius:11,border:"2px solid #E8E0F5",background:"none",color:T.sub,fontSize:13,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Cancel</button><Btn style={{flex:2,padding:10}} onClick={saveJournal} full>Save ✓</Btn></div>
                  </Card>
                )}
              </div>
            </div>}

            {/* WALLET */}
            {tab==="wallet"&&<div style={{animation:"fadeUp 0.3s ease"}}>
              <div style={{background:"linear-gradient(135deg,#1A1035,#3D2070)",padding:"30px 20px 24px",borderRadius:"0 0 22px 22px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:-50,right:-50,width:160,height:160,borderRadius:"50%",background:"rgba(155,127,212,0.06)"}}/>
                <div style={{fontSize:10,letterSpacing:2,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",fontWeight:800,marginBottom:6}}>MindWell Wallet</div>
                <div style={{fontFamily:"'Lora',serif",fontSize:38,color:"#fff",fontWeight:600,marginBottom:3}}>{inr(balance)}</div>
                <div style={{background:"rgba(155,127,212,0.2)",borderRadius:9,padding:"5px 12px",display:"inline-block"}}><span style={{fontSize:12,color:T.mint,fontWeight:700}}>⏱ {mins} session minutes</span></div>
              </div>
              <div style={{padding:14}}>
                <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:12}}>Recharge</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:8}}>
                  {RECHARGEPLANS.map(amt=>(
                    <button key={amt} onClick={()=>openRaz(amt)} className="hvr" style={{padding:"17px 10px",borderRadius:14,border:`2px solid ${amt===799?"#9B7FD4":"#E8E0F5"}`,background:amt===799?"linear-gradient(135deg,#9B7FD4,#5B8DEF)":"#fff",cursor:"pointer",textAlign:"center",position:"relative",fontFamily:"'Nunito',sans-serif"}}>
                      {amt===799&&<div style={{position:"absolute",top:-9,left:"50%",transform:"translateX(-50%)",background:T.gold,color:"#fff",fontSize:9,fontWeight:800,padding:"2px 9px",borderRadius:7,whiteSpace:"nowrap"}}>POPULAR</div>}
                      <div style={{fontWeight:900,fontSize:21,color:amt===799?"#fff":T.dark,fontFamily:"'Lora',serif"}}>{inr(amt)}</div>
                    </button>
                  ))}
                </div>
                <div style={{fontSize:11,color:T.sub,textAlign:"center",marginBottom:18}}>🔒 Secured by Razorpay · UPI · Cards · Net Banking</div>
                <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:10}}>Transactions</div>
                {txns.map((t,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #E8E0F5"}}>
                    <div><div style={{fontSize:13,fontWeight:700,color:T.dark}}>{t.label}</div><div style={{fontSize:10,color:T.sub}}>{t.date}</div></div>
                    <div style={{fontWeight:800,color:t.type==="credit"?T.green:T.coral,fontSize:13}}>{t.type==="credit"?"+":"-"}{inr(t.amt)}</div>
                  </div>
                ))}
              </div>
            </div>}

            {/* AI CHAT */}
            {tab==="ai"&&<div style={{display:"flex",flexDirection:"column",height:"100vh",animation:"fadeUp 0.3s ease"}}>
              <div style={{background:T.gd,padding:"14px 15px 12px",borderRadius:"0 0 18px 18px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",gap:9,alignItems:"center"}}>
                    <div style={{width:40,height:40,borderRadius:13,background:T.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19}}>🤖</div>
                    <div><div style={{fontWeight:800,color:"#fff",fontSize:14}}>MindBot — Deep Dive</div><div style={{fontSize:10,color:T.mint}}>● Claude AI · Your therapist reads this</div></div>
                  </div>
                  <div style={{background:"rgba(78,205,196,0.2)",borderRadius:8,padding:"4px 9px"}}><div style={{fontSize:9,color:T.mint,fontWeight:700}}>🔒 Shared with therapist</div></div>
                </div>
                <div style={{display:"flex",gap:6,marginTop:10,overflowX:"auto",paddingBottom:2}}>
                  {["💭 Anxious about...","😔 Relationship issues...","😴 Can't sleep...","🏠 Family issues...","💼 Work stress..."].map(p=>(
                    <button key={p} onClick={()=>setAiInput(p.slice(2)+" ")} style={{padding:"5px 10px",borderRadius:13,border:"1px solid rgba(255,255,255,0.16)",background:"rgba(255,255,255,0.09)",color:"rgba(255,255,255,0.75)",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"'Nunito',sans-serif",whiteSpace:"nowrap",flexShrink:0}}>{p}</button>
                  ))}
                </div>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"12px 13px",display:"flex",flexDirection:"column",gap:8}}>
                <div style={{background:"linear-gradient(135deg,#E8F5E9,#F1F8E9)",borderRadius:13,padding:"10px 13px",border:"1px solid #A5D6A7",display:"flex",gap:8,alignItems:"flex-start"}}>
                  <div style={{fontSize:16,flexShrink:0}}>👩‍⚕️</div>
                  <div><div style={{fontSize:11,fontWeight:800,color:"#2E7D32",marginBottom:2}}>Your therapist has access to this conversation</div><div style={{fontSize:10,color:"#388E3C",lineHeight:1.5}}>Share freely — the more you open up, the better prepared your therapist will be. This saves session time and gets you to breakthroughs faster.</div></div>
                </div>
                {aiMsgs.map((m,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                    <div style={{maxWidth:"81%",padding:"11px 15px",borderRadius:19,background:m.role==="user"?T.g1:"#fff",color:m.role==="user"?"#fff":T.text,fontSize:13,lineHeight:1.65,borderBottomRightRadius:m.role==="user"?4:19,borderBottomLeftRadius:m.role==="user"?19:4,boxShadow:"0 2px 10px rgba(99,74,150,0.08)",border:m.role==="assistant"?"1px solid #E8E0F5":"none",animation:"fadeUp 0.3s ease"}}>{m.text}</div>
                  </div>
                ))}
                {aiLoad&&<div style={{display:"flex",gap:4,padding:"6px 11px"}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:T.lav,animation:`bounce 0.6s infinite ${i*0.15}s`}}/>)}</div>}
                <div ref={aiEndRef}/>
              </div>
              {aiSummary&&<div style={{margin:"0 11px 8px",background:"#E8F5E9",borderRadius:13,padding:13,border:"1px solid #A5D6A7",maxHeight:140,overflowY:"auto"}}><div style={{fontSize:9,fontWeight:800,color:"#2E7D32",marginBottom:5,textTransform:"uppercase",letterSpacing:1.5}}>✓ Pre-Session Brief — Sent to therapist</div><div style={{fontSize:11,color:"#1B5E20",lineHeight:1.7,whiteSpace:"pre-line"}}>{aiSummary}</div></div>}
              <div style={{padding:"8px 11px 11px",background:"#fff",borderTop:"1px solid #E8E0F5"}}>
                {aiMsgs.length>3&&!aiSummary&&<button onClick={genSummary} disabled={sumLoad} style={{width:"100%",padding:"9px",borderRadius:11,border:"none",background:"linear-gradient(135deg,#E8F5E9,#F1F8E9)",color:"#2E7D32",fontSize:11,fontWeight:700,cursor:"pointer",marginBottom:7,fontFamily:"'Nunito',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>{sumLoad?"⏳ Generating brief...":"📋 Generate Pre-Session Brief for Therapist"}</button>}
                <div style={{display:"flex",gap:7}}>
                  <input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendAI()} placeholder="Share anything on your mind..." style={{flex:1,padding:"11px 15px",borderRadius:20,border:"1px solid #E8E0F5",background:T.bg,fontSize:13,outline:"none",color:T.text}}/>
                  <button onClick={sendAI} style={{width:42,height:42,borderRadius:"50%",border:"none",background:T.g1,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.send}</button>
                </div>
                <div style={{textAlign:"center",marginTop:5,fontSize:9,color:T.sub}}>💾 Auto-saved · Your therapist sees this before your session</div>
              </div>
            </div>}

            {/* COMMUNITY */}
            {tab==="community"&&<div style={{animation:"fadeUp 0.3s ease"}}>
              <div style={{background:T.gd,padding:"24px 18px 18px",borderRadius:"0 0 22px 22px"}}><div style={{fontFamily:"'Lora',serif",fontSize:21,color:"#fff",fontWeight:600,marginBottom:3}}>Community 🫂</div><div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>Share your journey · Support others</div></div>
              <div style={{padding:"13px 13px"}}>
                <Card style={{marginBottom:12}}>
                  <textarea value={newPost} onChange={e=>setNewPost(e.target.value)} placeholder="Share your experience, ask a question, or offer support..." style={{width:"100%",height:80,padding:11,borderRadius:11,border:"1px solid #E8E0F5",background:T.bg,fontSize:13,outline:"none",color:T.text,lineHeight:1.6,marginBottom:9}}/>
                  <div style={{display:"flex",justifyContent:"flex-end"}}><Btn sm onClick={addPost} disabled={!newPost.trim()}>Post</Btn></div>
                </Card>
                {posts.map(post=>(
                  <Card key={post.id} style={{marginBottom:10}}>
                    <div style={{display:"flex",gap:9,marginBottom:9}}>
                      <div style={{width:32,height:32,borderRadius:10,background:T.g1,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:12,flexShrink:0}}>{post.author[0]}</div>
                      <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:T.dark}}>{post.author}</div><div style={{fontSize:13,color:T.text,lineHeight:1.7,marginTop:3}}>{post.text}</div></div>
                      <button onClick={()=>setPosts(p=>p.map(x=>x.id===post.id?{...x,likes:x.likes+1}:x))} style={{background:"none",border:"none",color:T.coral,cursor:"pointer",display:"flex",alignItems:"center",gap:3,fontSize:11,fontWeight:700,flexShrink:0}}>{Ic.heart}{post.likes}</button>
                    </div>
                    {post.replies.length>0&&<div style={{borderLeft:"3px solid #E8E0F5",paddingLeft:11,marginBottom:9}}>
                      {(expanded===post.id?post.replies:post.replies.slice(0,1)).map((r,i)=><div key={i} style={{marginBottom:6,paddingBottom:6,borderBottom:i<(expanded===post.id?post.replies:post.replies.slice(0,1)).length-1?"1px solid #F0EBF8":""}}><div style={{fontWeight:700,fontSize:11,color:T.lav,marginBottom:1}}>{r.author}</div><div style={{fontSize:12,color:T.sub,lineHeight:1.6}}>{r.text}</div></div>)}
                      {post.replies.length>1&&<button onClick={()=>setExpanded(expanded===post.id?null:post.id)} style={{background:"none",border:"none",color:T.lav,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>{expanded===post.id?"Show less ↑":`+${post.replies.length-1} more ↓`}</button>}
                    </div>}
                    {replyTo===post.id?<div style={{display:"flex",gap:7,marginTop:7}}><input value={replyText} onChange={e=>setReplyText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addReply(post.id)} placeholder="Write a reply..." style={{flex:1,padding:"7px 11px",borderRadius:11,border:"1px solid #E8E0F5",background:T.bg,fontSize:12,outline:"none",color:T.text}}/><button onClick={()=>addReply(post.id)} style={{width:33,height:33,borderRadius:"50%",border:"none",background:T.g1,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.send}</button></div>
                    :<button onClick={()=>setReplyTo(post.id)} style={{background:"none",border:"none",color:T.sub,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>💬 Reply</button>}
                  </Card>
                ))}
              </div>
            </div>}

            {/* BLOG */}
            {tab==="blog"&&!selBlog&&<div style={{animation:"fadeUp 0.3s ease"}}>
              <div style={{background:T.gd,padding:"24px 18px 18px",borderRadius:"0 0 22px 22px"}}><div style={{fontFamily:"'Lora',serif",fontSize:21,color:"#fff",fontWeight:600,marginBottom:3}}>Wellness Blog 🌱</div><div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>Healing techniques from our practitioners</div></div>
              <div style={{padding:"13px 13px"}}>
                {BLOGS.map((p,i)=>(
                  <div key={p.id} className="hvr" onClick={()=>setSelBlog(p)} style={{background:"#fff",borderRadius:18,padding:17,boxShadow:"0 2px 14px rgba(99,74,150,0.06)",border:"1px solid #E8E0F5",marginBottom:11,cursor:"pointer",animation:`fadeUp 0.3s ease ${i*0.05}s both`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div style={{fontSize:34}}>{p.emoji}</div><Badge color={p.color}>{p.tag}</Badge></div>
                    <div style={{fontFamily:"'Lora',serif",fontSize:16,fontWeight:600,color:T.dark,marginBottom:6,lineHeight:1.4}}>{p.title}</div>
                    <div style={{fontSize:12,color:T.sub,lineHeight:1.65,marginBottom:10}}>{p.body.slice(0,100)}...</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div><div style={{fontSize:11,fontWeight:700,color:T.dark}}>{p.author}</div><div style={{fontSize:10,color:T.sub}}>{p.role}</div></div>
                      <div style={{display:"flex",gap:10,alignItems:"center"}}>
                        <button onClick={e=>{e.stopPropagation();setBlogLikes(l=>({...l,[p.id]:(l[p.id]||0)+1}));}} style={{background:"none",border:"none",color:T.coral,cursor:"pointer",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:3}}>{Ic.heart}{p.likes+(blogLikes[p.id]||0)}</button>
                        <span style={{color:T.lav,fontSize:11,fontWeight:700}}>Read →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>}
            {tab==="blog"&&selBlog&&<div style={{animation:"fadeUp 0.3s ease"}}>
              <div style={{background:`linear-gradient(160deg,${selBlog.color}33,${T.bg})`,padding:"18px 18px 0"}}>
                <button onClick={()=>setSelBlog(null)} style={{background:"none",border:"none",color:selBlog.color,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:13,fontWeight:700,marginBottom:16,fontFamily:"'Nunito',sans-serif"}}>{Ic.back} Blog</button>
                <div style={{fontSize:50,marginBottom:12}}>{selBlog.emoji}</div><Badge color={selBlog.color}>{selBlog.tag}</Badge>
                <div style={{fontFamily:"'Lora',serif",fontSize:19,fontWeight:600,color:T.dark,marginBottom:12,marginTop:9,lineHeight:1.4}}>{selBlog.title}</div>
                <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:20}}>
                  <div style={{width:34,height:34,borderRadius:11,background:T.g1,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:12}}>{selBlog.author[0]}</div>
                  <div><div style={{fontWeight:700,fontSize:12,color:T.dark}}>{selBlog.author}</div><div style={{fontSize:10,color:T.sub}}>{selBlog.role}</div></div>
                </div>
              </div>
              <div style={{padding:"0 18px 22px"}}>
                <div style={{fontSize:14,color:T.text,lineHeight:1.9,marginBottom:22}}>{selBlog.body}</div>
                <div style={{borderTop:"1px solid #E8E0F5",paddingTop:16}}>
                  <div style={{fontSize:12,color:T.sub,marginBottom:11}}>Feeling overwhelmed? Our therapists are here for you.</div>
                  <Btn full onClick={()=>nav("therapists")}>Talk to a Therapist →</Btn>
                </div>
              </div>
            </div>}

            {/* PROFILE */}
            {tab==="profile"&&<div style={{animation:"fadeUp 0.3s ease"}}>
              <div style={{background:T.gd,padding:"30px 18px 24px",textAlign:"center",borderRadius:"0 0 22px 22px"}}>
                <div style={{width:68,height:68,borderRadius:22,background:T.g1,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:26,margin:"0 auto 11px"}}>{un[0]?.toUpperCase()}</div>
                <div style={{fontFamily:"'Lora',serif",fontSize:21,color:"#fff",fontWeight:600}}>{un}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:2}}>Member since {client?.joinDate}</div>
                <div style={{display:"flex",gap:20,justifyContent:"center",marginTop:13}}>{[[cSessions.length,"Sessions"],[mins,"Mins left"],[jEntries.length,"Journals"]].map(([v,l])=><div key={l} style={{textAlign:"center"}}><div style={{fontSize:16,fontWeight:900,color:"#fff"}}>{v}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>{l}</div></div>)}</div>
              </div>
              <div style={{padding:13}}>
                {cSessions.length>0&&<><div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:10}}>Session History</div>{cSessions.slice(0,5).map((s,i)=><Card key={i} style={{marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:700,fontSize:13,color:T.dark}}>{s.therapist}</div><div style={{fontSize:10,color:T.sub}}>{s.date} · {s.mode} · {s.duration} min</div></div><div style={{fontWeight:800,color:T.coral,fontSize:12}}>-{inr(s.cost)}</div></Card>)}</>}
                <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:10,marginTop:cSessions.length?14:0}}>Account</div>
                {[["📱","Phone",client?.phone||""],["💰","Wallet",inr(balance)],["🔔","Notifications","On"],["🔒","Privacy",""]].map((item,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:"1px solid #E8E0F5"}}>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}><div style={{width:32,height:32,borderRadius:10,background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>{item[0]}</div><div style={{fontWeight:600,fontSize:13,color:T.dark}}>{item[1]}</div></div>
                    <div style={{color:T.sub,fontSize:12}}>{item[2]} ›</div>
                  </div>
                ))}
                <button onClick={onLogout} style={{width:"100%",marginTop:20,padding:13,borderRadius:14,border:`2px solid ${T.coral}`,background:"none",color:T.coral,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Log Out</button>
              </div>
            </div>}
          </div>
        </div>

        {/* MOBILE BOTTOM NAV */}
        <div className="bot-nav" style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(255,255,255,0.97)",backdropFilter:"blur(16px)",borderTop:"1px solid #E8E0F5",display:"flex",zIndex:50,padding:"7px 0 9px"}}>
          {[{id:"home",l:"Home",ic:Ic.home},{id:"therapists",l:"Therapists",ic:Ic.search},{id:"ai",l:"AI Chat",ic:Ic.ai},{id:"community",l:"Community",ic:Ic.community},{id:"profile",l:"Profile",ic:Ic.profile}].map(({id,l,ic})=>(
            <button key={id} onClick={()=>nav(id)} style={{flex:1,border:"none",background:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,color:tab===id?T.lav:T.sub,padding:"3px 2px"}}>{ic}<span style={{fontSize:8,fontWeight:tab===id?900:500}}>{l}</span></button>
          ))}
        </div>

        {/* RAZORPAY FALLBACK MODAL */}
        {showRaz&&razAmt&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{background:"#fff",borderRadius:"26px 26px 0 0",padding:22,width:"100%",maxWidth:480,margin:"0 auto",animation:"slideUp 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:15}}>
              <div><div style={{fontWeight:900,fontSize:19,color:"#072654",letterSpacing:-1}}>razorpay</div><div style={{fontSize:10,color:T.sub,marginTop:1}}>Replace RAZORPAY_KEY at top of file to go live</div></div>
              <button onClick={()=>{setShowRaz(false);setRazAmt(null);}} style={{width:32,height:32,borderRadius:"50%",background:"#F5F5F5",border:"none",cursor:"pointer",fontSize:17,color:"#666"}}>×</button>
            </div>
            <div style={{background:"linear-gradient(135deg,#072654,#1a3a7a)",borderRadius:16,padding:"17px",marginBottom:14,color:"#fff",textAlign:"center"}}><div style={{fontSize:10,opacity:0.6,marginBottom:3}}>MindWell Therapy Recharge</div><div style={{fontSize:32,fontWeight:900}}>{inr(razAmt)}</div></div>
            {[{l:"UPI / Google Pay / PhonePe",i:"📱"},{l:"Credit / Debit Card",i:"💳"},{l:"Net Banking",i:"🏦"},{l:"EMI",i:"📊"}].map(opt=>(
              <button key={opt.l} onClick={()=>creditWallet(razAmt)} style={{width:"100%",padding:"12px 15px",borderRadius:12,border:"1px solid #E8E0F5",background:"#fff",display:"flex",alignItems:"center",gap:11,marginBottom:6,cursor:"pointer",fontSize:13,color:T.dark,fontFamily:"'Nunito',sans-serif",fontWeight:600}}>
                <span style={{fontSize:20}}>{opt.i}</span>{opt.l}<span style={{marginLeft:"auto",color:T.sub,fontSize:15}}>›</span>
              </button>
            ))}
            <div style={{textAlign:"center",marginTop:8,fontSize:10,color:T.sub}}>🔒 256-bit SSL · Secured by Razorpay India</div>
          </div>
        </div>}

        {/* SOS MODAL */}
        {showSOS&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{background:"#fff",borderRadius:"26px 26px 0 0",padding:26,width:"100%",maxWidth:480,margin:"0 auto",animation:"slideUp 0.3s ease",maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{textAlign:"center",marginBottom:18}}>
              <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B6B,#ee0979)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 11px",animation:"pulse 1.5s ease infinite"}}>🆘</div>
              <div style={{fontFamily:"'Lora',serif",fontSize:20,fontWeight:600,color:T.dark,marginBottom:4}}>You are not alone</div>
              <div style={{fontSize:13,color:T.sub,lineHeight:1.7}}>It's okay to reach out. Real help is available right now.</div>
            </div>
            {/* Therapy options */}
            {[{icon:"👩‍⚕️",title:"Talk to a Therapist Now",sub:"Connect with a verified professional instantly",col:T.g1,act:()=>{setShowSOS(false);nav("therapists");}},{icon:"🤖",title:"Talk to MindBot AI",sub:"Anonymous support · Available 24/7",col:T.g2,act:()=>{setShowSOS(false);nav("ai");}}].map(opt=>(
              <button key={opt.title} onClick={opt.act} style={{width:"100%",padding:"14px 17px",borderRadius:16,border:"none",background:opt.col,color:"#fff",marginBottom:8,display:"flex",alignItems:"center",gap:13,cursor:"pointer",textAlign:"left",fontFamily:"'Nunito',sans-serif"}}>
                <span style={{fontSize:22}}>{opt.icon}</span>
                <div><div style={{fontWeight:800,fontSize:13}}>{opt.title}</div><div style={{fontSize:10,opacity:0.8,marginTop:2}}>{opt.sub}</div></div>
              </button>
            ))}
            {/* Helplines */}
            <div style={{marginTop:16,marginBottom:8}}>
              <div style={{fontSize:10,fontWeight:800,color:T.sub,textTransform:"uppercase",letterSpacing:1.5,marginBottom:10}}>🇮🇳 National Mental Health Helplines</div>
              {[
                {name:"Kiran Mental Health Helpline",num:"1800-599-0019",sub:"Govt. of India · Free · 24/7 · 16 languages",icon:"🏥",col:"#E8F5E9",border:"#A5D6A7",textCol:"#2E7D32",numCol:"#1B5E20"},
                {name:"AASRA Crisis Helpline",num:"9820466627",sub:"Suicide prevention · Available 24/7",icon:"💚",col:"#E3F2FD",border:"#90CAF9",textCol:"#1565C0",numCol:"#0D47A1"},
                {name:"Vandrevala Foundation",num:"1860-2662-345",sub:"Free mental health support · 24/7",icon:"🤝",col:"#F3E5F5",border:"#CE93D8",textCol:"#6A1B9A",numCol:"#4A148C"},
              ].map(h=>(
                <a key={h.name} href={`tel:${h.num.replace(/-/g,"")}`} style={{display:"block",textDecoration:"none",marginBottom:9}}>
                  <div style={{background:h.col,borderRadius:14,padding:"12px 14px",border:`1px solid ${h.border}`,display:"flex",gap:12,alignItems:"center"}}>
                    <div style={{width:40,height:40,borderRadius:12,background:h.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{h.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:800,fontSize:12,color:h.textCol,marginBottom:2}}>{h.name}</div>
                      <div style={{fontWeight:900,fontSize:16,color:h.numCol,letterSpacing:0.5,marginBottom:2}}>{h.num}</div>
                      <div style={{fontSize:10,color:h.textCol,opacity:0.7}}>{h.sub}</div>
                    </div>
                    <div style={{fontSize:20,color:h.border}}>📞</div>
                  </div>
                </a>
              ))}
            </div>
            <button onClick={()=>setShowSOS(false)} style={{width:"100%",padding:13,borderRadius:13,border:"2px solid #E8E0F5",background:"none",color:T.sub,fontSize:13,cursor:"pointer",fontFamily:"'Nunito',sans-serif",marginTop:4}}>I'm okay, close this</button>
          </div>
        </div>}

        {/* NOTIFICATIONS MODAL */}
        {showNotifs&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:150,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{background:"#fff",borderRadius:"26px 26px 0 0",padding:22,width:"100%",maxWidth:480,margin:"0 auto",maxHeight:"65vh",overflowY:"auto",animation:"slideUp 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div style={{fontFamily:"'Lora',serif",fontSize:19,fontWeight:600,color:T.dark}}>Notifications</div><button onClick={()=>setShowNotifs(false)} style={{background:"none",border:"none",fontSize:21,cursor:"pointer",color:T.sub}}>×</button></div>
            {[{title:"Session Reminder",body:"Your next session is coming up",time:"2h ago",icon:"📅"},{title:"Journal Reminder",body:"You haven't journaled in 2 days",time:"1d ago",icon:"📓"},{title:"New Therapist",body:"Dr. Farheen Qureshi is now accepting patients",time:"2d ago",icon:"👩‍⚕️"}].map((n,i)=>(
              <div key={i} style={{display:"flex",gap:11,padding:"11px 0",borderBottom:"1px solid #E8E0F5"}}>
                <div style={{width:36,height:36,borderRadius:12,background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{n.icon}</div>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:12,color:T.dark,marginBottom:2}}>{n.title}</div><div style={{fontSize:11,color:T.sub,lineHeight:1.5}}>{n.body}</div><div style={{fontSize:9,color:T.sub,marginTop:3}}>{n.time}</div></div>
              </div>
            ))}
          </div>
        </div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN APP — Unified router
// ═══════════════════════════════════════════════════════
export default function MindWell() {
  useEffect(()=>{const s=document.createElement("style");s.textContent=GCSS;document.head.appendChild(s);},[]);
  const [view,setView] = useState(()=>{try{return localStorage.getItem("mw_view")||"splash"}catch{return"splash"}});
  const [client,setClient] = useState(()=>{try{const c=localStorage.getItem("mw_client");return c?JSON.parse(c):null}catch{return null}});
  const [prac,setPrac] = useState(()=>{try{const p=localStorage.getItem("mw_prac");return p?JSON.parse(p):null}catch{return null}});
  const [isAdmin,setIsAdmin] = useState(()=>{try{return!!localStorage.getItem("mw_admin")}catch{return false}});

  const setV=(v)=>{setView(v);try{localStorage.setItem("mw_view",v)}catch{}};
  useEffect(()=>{if(client)setV("client-app");},[client]);
  useEffect(()=>{if(prac&&prac.status==="approved")setV("prac-app");else if(prac&&prac.status==="pending")setV("prac-pending");},[prac]);
  useEffect(()=>{if(isAdmin)setV("admin-app");},[isAdmin]);

  const clientLogout=()=>{localStorage.removeItem("mw_client");localStorage.removeItem("mw_view");localStorage.removeItem("mw_ob");setClient(null);setV("landing");};
  const pracLogout=()=>{localStorage.removeItem("mw_prac");localStorage.removeItem("mw_view");setPrac(null);setV("landing");};
  const adminLogout=()=>{localStorage.removeItem("mw_admin");localStorage.removeItem("mw_view");setIsAdmin(false);setV("landing");};

  if(view==="splash") return <Splash onNext={()=>setV("landing")}/>;
  if(view==="landing") return <Landing goClient={()=>setV("client-auth")} goPrac={()=>setV("prac-auth")} goAdmin={()=>setV("admin-auth")}/>;
  if(view==="client-auth") return <ClientAuth goBack={()=>setV("landing")} goPrac={()=>setV("prac-auth")} onSuccess={u=>{localStorage.setItem("mw_client",JSON.stringify(u));setClient(u);}}/>;
  if(view==="prac-auth") return <PracAuth onLogin={p=>{localStorage.setItem("mw_prac",JSON.stringify(p));setPrac(p);}} onPending={p=>{localStorage.setItem("mw_prac",JSON.stringify(p));setPrac(p);setV("prac-pending");}} goBack={()=>setV("landing")}/>;
  if(view==="prac-pending") return <PracPending goBack={()=>{pracLogout();}}/>;
  if(view==="admin-auth") return <AdminAuth onLogin={()=>{localStorage.setItem("mw_admin","1");setIsAdmin(true);}} goBack={()=>setV("landing")}/>;
  if(view==="admin-app") return <AdminDashboard onLogout={adminLogout}/>;
  if(view==="prac-app"&&prac) return <PracDashboard prac={prac} onLogout={pracLogout}/>;
  if(view==="client-app"&&client) return <ClientApp client={client} onLogout={clientLogout}/>;
  return <Landing goClient={()=>setV("client-auth")} goPrac={()=>setV("prac-auth")} goAdmin={()=>setV("admin-auth")}/>;
}
