import { useState, useEffect, useRef } from "react";

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || "";
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || "";

const GCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
  ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#E8E0F5;border-radius:4px;}
  body,input,textarea,button,select{font-family:'Nunito',sans-serif;}
  textarea{resize:none;}
  input::placeholder,textarea::placeholder{color:#B5A8C0;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
  @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
  @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  .hvr{transition:transform 0.18s,box-shadow 0.18s;}.hvr:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(99,74,150,0.15);}
  @media(min-width:768px){
    .app-shell{display:grid;grid-template-columns:240px 1fr;min-height:100vh;}
    .sidebar{background:#1A1035;min-height:100vh;padding:28px 18px;position:sticky;top:0;height:100vh;overflow-y:auto;}
    .main-area{background:#F7F4FE;min-height:100vh;overflow-y:auto;}
    .page-pad{max-width:700px;margin:0 auto;padding:28px 24px;}
    .bottom-nav{display:none!important;}
    .mob-header{display:none!important;}
  }
  @media(max-width:767px){
    .app-shell{display:block;}
    .sidebar{display:none!important;}
    .main-area{background:#F7F4FE;}
    .page-pad{padding:0 0 80px;}
  }
`;

const T={sky:"#5B8DEF",mint:"#4ECDC4",lav:"#9B7FD4",coral:"#FF6B6B",gold:"#F7B731",green:"#26de81",
  dark:"#1A1035",text:"#2D2048",sub:"#7B6EA0",border:"#E8E0F5",bg:"#F7F4FE",white:"#FFFFFF",
  g1:"linear-gradient(135deg,#5B8DEF,#9B7FD4)",g2:"linear-gradient(135deg,#4ECDC4,#26de81)",
  g3:"linear-gradient(135deg,#9B7FD4,#FF6B6B)",g4:"linear-gradient(135deg,#F7B731,#FF6B6B)",
  gd:"linear-gradient(135deg,#1A1035,#2D1B6B)"};

const Ic={
  home:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  search:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  journal:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  wallet:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="16" cy="15" r="1.2" fill="currentColor"/></svg>,
  ai:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  community:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  blog:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  profile:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  back:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  send:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  star:<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  heart:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  bell:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  sos:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  phone:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  video:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  chat:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
};

const inr=n=>`₹${Number(n).toLocaleString("en-IN")}`;
const Card=({children,style={}})=><div style={{background:"#fff",borderRadius:18,padding:16,boxShadow:"0 2px 16px rgba(99,74,150,0.07)",border:`1px solid #E8E0F5`,...style}}>{children}</div>;
const Badge=({children,color=T.sky})=><span style={{background:`${color}22`,color,fontSize:10,padding:"3px 9px",borderRadius:8,fontWeight:700}}>{children}</span>;
const Btn=({children,onClick,style={},grad=T.g1,full=false,ghost=false,sm=false,disabled=false})=>(
  <button onClick={onClick} disabled={disabled}
    style={{width:full?"100%":"auto",padding:sm?"8px 16px":"13px 20px",borderRadius:13,border:ghost?`2px solid ${T.lav}`:"none",background:ghost?"transparent":disabled?"#C5B8D8":grad,color:ghost?T.lav:"#fff",fontSize:sm?12:14,fontWeight:700,cursor:disabled?"not-allowed":"pointer",fontFamily:"'Nunito',sans-serif",...style}}>
    {children}
  </button>
);

const THERAPISTS=[
  {id:1,name:"Dr. Priya Sharma",title:"Clinical Psychologist",city:"New Delhi",lang:["Hindi","English"],specs:["Anxiety","Depression","Stress","Burnout"],rating:4.9,reviews:312,color:T.sky,initials:"PS",hourly:800,online:true,exp:"12 yrs",gender:"Female",modes:["chat","audio","video"],bio:"Specialises in CBT and mindfulness for anxiety and depression. Trained at NIMHANS Bangalore.",reviewList:[{name:"Ananya R.",stars:5,text:"Dr. Priya completely changed how I deal with anxiety. She's warm, patient, and gives you real tools."},{name:"Vikash T.",stars:5,text:"Very understanding. Helped me through a really dark phase of my life. Highly recommend."}]},
  {id:2,name:"Dr. Arjun Mehta",title:"Psychiatrist",city:"Mumbai",lang:["Hindi","Marathi","English"],specs:["ADHD","Bipolar","Trauma","Medication"],rating:4.95,reviews:489,color:T.mint,initials:"AM",hourly:1400,online:true,exp:"15 yrs",gender:"Male",modes:["audio","video"],bio:"Senior psychiatrist with expertise in complex mood disorders and trauma-informed care.",reviewList:[{name:"Rohan S.",stars:5,text:"Dr. Mehta finally explained my ADHD in a way I could understand. Life-changing consultation."},{name:"Pooja N.",stars:5,text:"The most knowledgeable psychiatrist I've met. Worth every rupee."}]},
  {id:3,name:"Kavya Nair",title:"Relationship Counselor",city:"Bengaluru",lang:["Malayalam","Kannada","English"],specs:["Relationships","Grief","Self-esteem","Loneliness"],rating:4.8,reviews:201,color:T.lav,initials:"KN",hourly:650,online:true,exp:"8 yrs",gender:"Female",modes:["chat","audio","video"],bio:"A warm, compassionate space to heal, reconnect, and understand your relationships better.",reviewList:[{name:"Deepika M.",stars:5,text:"Kavya helped me rebuild my self-worth after a toxic relationship. Truly transformative."},{name:"Siddharth P.",stars:4,text:"Very empathetic and non-judgmental. Great experience overall."}]},
  {id:4,name:"Dr. Rohit Kapoor",title:"Trauma Specialist",city:"Pune",lang:["Hindi","English"],specs:["Trauma","PTSD","Anger","Addiction"],rating:4.7,reviews:145,color:T.coral,initials:"RK",hourly:1100,online:false,exp:"10 yrs",gender:"Male",modes:["audio","video"],bio:"Somatic trauma therapy specialist. Helping people find safety and groundedness in their own bodies.",reviewList:[{name:"Neha G.",stars:5,text:"I never thought I'd heal from my past. Dr. Kapoor made it possible."},{name:"Anil K.",stars:4,text:"Very professional. Sessions are intense but remarkably effective."}]},
  {id:5,name:"Dr. Sneha Iyer",title:"CBT Therapist",city:"Chennai",lang:["Tamil","English"],specs:["OCD","Phobias","Anxiety","Sleep"],rating:4.85,reviews:267,color:T.gold,initials:"SI",hourly:750,online:true,exp:"9 yrs",gender:"Female",modes:["chat","video"],bio:"Breaking free from unhelpful thought patterns through structured, evidence-based CBT.",reviewList:[{name:"Meera S.",stars:5,text:"Dr. Sneha's CBT approach really worked for my OCD. Practical and effective."},{name:"Karthik R.",stars:5,text:"She gave me actual tools to use. Not just talk. Really helpful."}]},
  {id:6,name:"Vikram Bose",title:"Family Therapist",city:"Kolkata",lang:["Bengali","Hindi","English"],specs:["Family","Parenting","Couples","Divorce"],rating:4.75,reviews:132,color:"#9E7B6A",initials:"VB",hourly:900,online:true,exp:"11 yrs",gender:"Male",modes:["chat","audio","video"],bio:"Building stronger family bonds through systemic therapy and compassionate dialogue.",reviewList:[{name:"Rina D.",stars:5,text:"Vikram helped our family communicate better. We're in a much better place now."},{name:"Suresh B.",stars:4,text:"Patient and thorough. Takes time to understand the full family dynamic."}]},
  {id:7,name:"Dr. Ananya Rao",title:"Child & Adolescent Therapist",city:"Hyderabad",lang:["Telugu","English"],specs:["Teens","ADHD","Learning","Anxiety"],rating:4.88,reviews:178,color:T.green,initials:"AR",hourly:900,online:true,exp:"13 yrs",gender:"Female",modes:["chat","video"],bio:"Specialised in child development and adolescent mental health with play therapy techniques.",reviewList:[{name:"Priti V.",stars:5,text:"My daughter opened up to Dr. Ananya in ways she never did with anyone else."},{name:"Mahesh R.",stars:5,text:"Incredibly skilled with teenagers. My son's grades and mood improved a lot."}]},
  {id:8,name:"Rahul Singhania",title:"Life Coach & Counselor",city:"Jaipur",lang:["Hindi","English"],specs:["Career","Self-Growth","Motivation","Stress"],rating:4.72,reviews:98,color:T.coral,initials:"RS",hourly:500,online:true,exp:"6 yrs",gender:"Male",modes:["chat","audio"],bio:"Helping professionals find clarity, purpose, and confidence in their work and personal lives.",reviewList:[{name:"Amit J.",stars:5,text:"Rahul helped me quit my toxic job and pursue my passion. Forever grateful."},{name:"Komal S.",stars:4,text:"Great motivator. Gives practical steps, not just pep talk."}]},
  {id:9,name:"Dr. Lakshmi Venkat",title:"Grief Counselor",city:"Chennai",lang:["Tamil","Telugu","English"],specs:["Grief","Loss","Bereavement","Trauma"],rating:4.92,reviews:224,color:"#C06C84",initials:"LV",hourly:700,online:true,exp:"14 yrs",gender:"Female",modes:["chat","audio","video"],bio:"Specialised in grief and loss counseling, helping people navigate bereavement with compassion.",reviewList:[{name:"Sunita P.",stars:5,text:"After losing my mother, Dr. Lakshmi was the only one who truly understood my grief."},{name:"Rajesh V.",stars:5,text:"She gave me permission to grieve at my own pace. Incredibly compassionate."}]},
  {id:10,name:"Dr. Imran Sheikh",title:"Addiction Specialist",city:"Mumbai",lang:["Urdu","Hindi","English"],specs:["Addiction","Alcohol","Recovery","Substance"],rating:4.78,reviews:167,color:"#355C7D",initials:"IS",hourly:1000,online:true,exp:"11 yrs",gender:"Male",modes:["audio","video"],bio:"Compassionate, non-judgmental support for those struggling with addiction and on the path to recovery.",reviewList:[{name:"Anonymous",stars:5,text:"Dr. Imran helped me get sober without shame or judgment. 8 months clean now."},{name:"Fatima K.",stars:5,text:"His approach is so different from traditional rehab. Truly life-saving."}]},
  {id:11,name:"Dr. Ritu Agarwal",title:"Women's Wellness Therapist",city:"Lucknow",lang:["Hindi","English"],specs:["Postpartum","PCOS","Body Image","Women's Health"],rating:4.85,reviews:143,color:"#F67280",initials:"RA",hourly:800,online:true,exp:"10 yrs",gender:"Female",modes:["chat","audio","video"],bio:"Dedicated to women's mental health across all life stages — from adolescence to menopause.",reviewList:[{name:"Simran A.",stars:5,text:"Finally a therapist who understood postpartum anxiety without dismissing it."},{name:"Vandana G.",stars:5,text:"Dr. Ritu helped me love my body again after years of struggle."}]},
  {id:12,name:"Aditya Kumar",title:"Sports & Performance Psychologist",city:"Bengaluru",lang:["Hindi","Kannada","English"],specs:["Performance","Burnout","Focus","Athletes"],rating:4.68,reviews:89,color:"#6C5CE7",initials:"AK",hourly:950,online:true,exp:"7 yrs",gender:"Male",modes:["chat","video"],bio:"Helping athletes and high-performers break mental blocks and reach their peak potential.",reviewList:[{name:"Arjun M.",stars:5,text:"Aditya helped me overcome performance anxiety before tournaments. Game changer."},{name:"Priya L.",stars:4,text:"Really understands the pressures of competitive performance. Very helpful."}]},
  {id:13,name:"Dr. Nalini Krishnamurthy",title:"Geriatric Mental Health",city:"Coimbatore",lang:["Tamil","English"],specs:["Elderly Care","Dementia","Isolation","Aging"],rating:4.9,reviews:78,color:"#A29BFE",initials:"NK",hourly:700,online:true,exp:"16 yrs",gender:"Female",modes:["audio","video"],bio:"Specialised in mental health care for the elderly, including dementia support and caregiver counseling.",reviewList:[{name:"Karthikeyan R.",stars:5,text:"Dr. Nalini is a blessing for our family. She understands aging so well."},{name:"Usha M.",stars:5,text:"The warmth she brings to every session is remarkable. Deeply caring."}]},
  {id:14,name:"Dr. Sameer Joshi",title:"Mindfulness & Meditation Coach",city:"Pune",lang:["Marathi","Hindi","English"],specs:["Mindfulness","Stress","Sleep","Meditation"],rating:4.82,reviews:256,color:T.mint,initials:"SJ",hourly:600,online:true,exp:"9 yrs",gender:"Male",modes:["chat","audio","video"],bio:"Combining clinical psychology with mindfulness, breathwork, and meditation for whole-person healing.",reviewList:[{name:"Pallavi S.",stars:5,text:"Dr. Sameer's meditation techniques literally cured my insomnia."},{name:"Nikhil T.",stars:5,text:"He makes mindfulness practical and accessible. Not woo-woo at all."}]},
  {id:15,name:"Dr. Farheen Qureshi",title:"LGBTQ+ Affirming Therapist",city:"Delhi",lang:["Hindi","Urdu","English"],specs:["LGBTQ+","Identity","Coming Out","Family"],rating:4.95,reviews:312,color:"#FD79A8",initials:"FQ",hourly:850,online:true,exp:"12 yrs",gender:"Female",modes:["chat","audio","video"],bio:"A safe, affirming space for LGBTQ+ individuals navigating identity, family, and societal challenges in India.",reviewList:[{name:"Rohan K.",stars:5,text:"Dr. Farheen was the first therapist who didn't try to 'fix' me. She accepted me fully."},{name:"Aisha T.",stars:5,text:"Incredibly affirming. I felt seen for the first time in my life."}]},
  {id:16,name:"Suresh Menon",title:"Anger Management Specialist",city:"Kochi",lang:["Malayalam","English"],specs:["Anger","Impulse Control","Relationships","Stress"],rating:4.65,reviews:94,color:"#E17055",initials:"SM",hourly:700,online:true,exp:"8 yrs",gender:"Male",modes:["audio","video"],bio:"Practical tools and compassionate support for managing anger and improving emotional regulation.",reviewList:[{name:"Biju V.",stars:5,text:"I haven't lost my temper at work in 3 months since starting with Suresh."},{name:"Jaya K.",stars:4,text:"He gives you real techniques that actually work."}]},
  {id:17,name:"Dr. Divya Patel",title:"Eating Disorder Specialist",city:"Ahmedabad",lang:["Gujarati","Hindi","English"],specs:["Eating Disorders","Body Image","Recovery","Nutrition"],rating:4.88,reviews:134,color:"#74B9FF",initials:"DP",hourly:950,online:true,exp:"11 yrs",gender:"Female",modes:["chat","video"],bio:"Evidence-based treatment for eating disorders with a compassionate, non-diet approach.",reviewList:[{name:"Meghna S.",stars:5,text:"Dr. Divya saved my life. I was in a very dark place and she guided me to recovery."},{name:"Nisha R.",stars:5,text:"Incredibly knowledgeable and kind. Never once made me feel shame."}]},
  {id:18,name:"Dr. Prakash Iyer",title:"Work & Organizational Psychologist",city:"Mumbai",lang:["Tamil","Hindi","English"],specs:["Work Stress","Burnout","Leadership","Career"],rating:4.77,reviews:189,color:"#00B894",initials:"PI",hourly:1200,online:true,exp:"13 yrs",gender:"Male",modes:["chat","audio","video"],bio:"Helping professionals navigate workplace stress, burnout, and career transitions with clarity.",reviewList:[{name:"Rahul A.",stars:5,text:"Dr. Prakash helped me handle a toxic boss and move to a better job."},{name:"Savita M.",stars:5,text:"His understanding of workplace dynamics is exceptional. Very practical."}]},
];

const ISSUES=[{l:"Stress & Burnout",i:"🔥"},{l:"Anxiety",i:"💭"},{l:"Depression",i:"🌧"},{l:"Relationships",i:"💔"},{l:"Grief & Loss",i:"🕊"},{l:"Family Issues",i:"🏠"},{l:"Self-Growth",i:"🌱"},{l:"Trauma & PTSD",i:"💫"},{l:"Sleep Problems",i:"😴"},{l:"Addiction",i:"🔗"},{l:"Anger",i:"😤"},{l:"Loneliness",i:"🫂"}];
const MOODS=["😭","😔","😐","🙂","😄"];
const MOODL=["Terrible","Bad","Okay","Good","Great"];
const MOODC=["#EF9A9A","#FFCC80","#FFF59D","#C5E1A5","#A5D6A7"];
const RECHARGEPLANS=[499,799,999,1499,1999,2499,2999];

const BLOGS=[
  {id:1,author:"Dr. Priya Sharma",role:"Clinical Psychologist",title:"5-Minute Box Breathing: Your Instant Anxiety Reset",body:"When anxiety spikes, your nervous system enters overdrive. Box breathing — inhale 4s, hold 4s, exhale 4s, hold 4s — directly activates your parasympathetic nervous system. Do this 4 cycles and you will physically feel your heart rate drop. I teach this to every single patient as a first-response tool. The beauty is you can do it anywhere — in a meeting, on a bus, before a difficult conversation. Your breath is the only part of your autonomic nervous system you can consciously control, which makes it the master key to your anxiety response.",emoji:"🌬️",tag:"Breathwork",likes:234,color:T.sky},
  {id:2,author:"Dr. Sameer Joshi",role:"Mindfulness Coach",title:"Why 10 Minutes of Morning Meditation Changes Everything",body:"The brain's default mode network — responsible for rumination and worry — is most active in the morning. A simple 10-minute sitting practice, just observing breath without judging thoughts, structurally changes how the DMN fires over time. You don't need an app, a cushion, or a mountain retreat. You need a quiet corner and a timer. The research from Harvard Medical School shows that 8 weeks of consistent meditation physically thickens the prefrontal cortex — the area responsible for decision-making and emotional regulation.",emoji:"🧘",tag:"Meditation",likes:189,color:T.lav},
  {id:3,author:"Rahul Singhania",role:"Life Coach",title:"Visualisation Is Not Woo-Woo — It's Neuroscience",body:"When you vividly imagine performing an action, the same neural pathways fire as when you actually do it. This is why elite athletes have used visualisation for decades. Spend 5 minutes daily visualising the version of yourself you want to become — not as fantasy, but as deliberate rehearsal. Your brain genuinely cannot distinguish between a vivid mental image and reality. Use all five senses. See the room. Feel the feeling. The more specific and emotionally charged the image, the more deeply it's encoded.",emoji:"✨",tag:"Visualisation",likes:312,color:T.gold},
  {id:4,author:"Dr. Ananya Rao",role:"Child Therapist",title:"Gratitude Journaling: The Research Is Overwhelming",body:"Three studies in the Journal of Positive Psychology show that writing three specific things you're grateful for — not generic but specific — increases long-term wellbeing by 25%. The key word is specific. Not 'my family' but 'the way my sister laughed when I called her today.' Specificity creates neural anchors. The practice works because it trains selective attention — your brain begins scanning the environment for positives rather than threats. Do this for 21 days and the shift in perspective becomes automatic.",emoji:"📓",tag:"Journaling",likes:278,color:T.green},
  {id:5,author:"Dr. Divya Patel",role:"Eating Disorder Specialist",title:"Your Body Is Not the Problem — Diet Culture Is",body:"In India we're surrounded by messaging that thinner equals healthier equals happier. The research says otherwise. Intuitive eating — listening to hunger and fullness cues without moral judgment — leads to better physical and mental health outcomes than any diet. When you stop treating food as the enemy, you stop treating yourself as the enemy. Healing your relationship with food starts with recognising that your body is not a project to be fixed. It is a home to be cared for.",emoji:"💚",tag:"Body Wellness",likes:445,color:T.coral},
  {id:6,author:"Dr. Farheen Qureshi",role:"LGBTQ+ Therapist",title:"Reading Books as Therapy: Bibliotherapy Explained",body:"Bibliotherapy — using literature as a therapeutic tool — is increasingly evidence-backed. When you see your struggles mirrored in a character, your brain releases oxytocin and reduces cortisol. Fiction especially builds empathy circuits. I recommend my patients read at least 20 pages of meaningful fiction daily. Some books that consistently help: 'When Breath Becomes Air', 'The Body Keeps the Score', 'Man's Search for Meaning'. Your bookshelf is one of the cheapest, most accessible mental health tools available to you.",emoji:"📚",tag:"Reading",likes:167,color:"#FD79A8"},
];

const INIT_COMMUNITY=[
  {id:1,author:"Riya S.",text:"I've been using MindWell for 3 months and I genuinely feel like a different person. For anyone on the fence — just try one session. It works when you commit.",likes:47,replies:[{author:"Arjun M.",text:"So happy for you! I had a similar experience. It really works 💙"},{author:"Meera P.",text:"This gives me hope. Starting my first session next week!"}]},
  {id:2,author:"Anonymous",text:"Does anyone else feel weird about talking to a therapist online? I've been going to a clinic for years and shifting to video feels strange. Any tips?",likes:23,replies:[{author:"Dr. Sameer Joshi",text:"Very common! The first online session always feels unusual. Give it 2 sessions — most people find they prefer being in their own safe space."},{author:"Kavya Nair",text:"I felt the same initially. Now I actually prefer it. You can be in your comfy corner at home 🏡"}]},
  {id:3,author:"Vikash T.",text:"Tried the box breathing from Dr. Priya's blog. Had a panic attack at work and used it. It actually worked??? Shared with my whole team.",likes:89,replies:[{author:"Dr. Priya Sharma",text:"So happy this helped! Box breathing is one of the most researched tools for acute anxiety. Keep it up! 🌬️"}]},
];

const NOTIFS=[
  {title:"Session Reminder",body:"Your session with Dr. Priya is in 30 mins",time:"2h ago",icon:"📅",read:false},
  {title:"New Therapist Available",body:"Dr. Farheen Qureshi is now accepting patients",time:"5h ago",icon:"👩‍⚕️",read:false},
  {title:"Journal Reminder",body:"You haven't journaled in 2 days. How are you?",time:"1d ago",icon:"📓",read:true},
  {title:"Diwali Offer 🪔",body:"Get 20% extra on your next recharge today!",time:"2d ago",icon:"🎁",read:true},
];

export default function MindWell(){
  useEffect(()=>{const s=document.createElement("style");s.textContent=GCSS;document.head.appendChild(s);},[]);

  // PERSISTENT AUTH
  const [user,setUser]=useState(()=>{try{const u=localStorage.getItem("mw_user");return u?JSON.parse(u):null;}catch{return null;}});
  const [authMode,setAuthMode]=useState("signup");
  const [form,setForm]=useState({name:"",phone:"",dob:"",gender:"",referral:"",otp:""});
  const [otpSent,setOtpSent]=useState(false);
  const [authErr,setAuthErr]=useState("");
  const [obDone,setObDone]=useState(()=>{try{return!!localStorage.getItem("mw_ob");}catch{return false;}});
  const [selIssues,setSelIssues]=useState([]);

  // APP
  const [tab,setTab]=useState("home");
  const [moodDone,setMoodDone]=useState(false);
  const [moodIdx,setMoodIdx]=useState(null);

  // THERAPISTS
  const [fMode,setFMode]=useState("all");
  const [fGender,setFGender]=useState("all");
  const [fSpec,setFSpec]=useState("all");
  const [searchQ,setSearchQ]=useState("");
  const [fSort,setFSort]=useState("recommended");
  const [selDoc,setSelDoc]=useState(null);
  const [sessMode,setSessMode]=useState(null);
  const [inSess,setInSess]=useState(false);
  const [sessElapsed,setSessElapsed]=useState(0);
  const [sessMsgs,setSessMsgs]=useState([]);
  const [sessInput,setSessInput]=useState("");
  const [showRating,setShowRating]=useState(false);
  const [sessRating,setSessRating]=useState(5);
  const [sessions,setSessions]=useState(()=>{try{return JSON.parse(localStorage.getItem("mw_sessions")||"[]");}catch{return[];}});
  const timerRef=useRef(null);

  // WALLET
  const [balance,setBalance]=useState(()=>{try{return Number(localStorage.getItem("mw_bal")||500);}catch{return 500;}});
  const [mins,setMins]=useState(()=>{try{return Number(localStorage.getItem("mw_mins")||30);}catch{return 30;}});
  const [txns,setTxns]=useState(()=>{try{return JSON.parse(localStorage.getItem("mw_txns")||JSON.stringify([{type:"credit",amt:500,label:"Welcome Bonus 🎁",date:"Today"}]));}catch{return[{type:"credit",amt:500,label:"Welcome Bonus 🎁",date:"Today"}];}});
  const [showRaz,setShowRaz]=useState(false);
  const [razAmt,setRazAmt]=useState(null);

  // JOURNAL
  const [entries,setEntries]=useState(()=>{try{return JSON.parse(localStorage.getItem("mw_journal")||"[]");}catch{return[];}});
  const [jText,setJText]=useState(""); const [jMood,setJMood]=useState(2); const [writing,setWriting]=useState(false);
  const prompts=["What made you smile today?","Describe one emotion you felt strongly today.","What's weighing on your heart right now?","Write a letter to your future self.","What are three things you're grateful for?","What would you tell a friend going through what you're going through?"];

  // AI
  const [aiMsgs,setAiMsgs]=useState([{role:"assistant",text:"Namaste 🙏 I'm MindBot — your personal wellness companion. I'm here to listen without judgement. What's on your mind today?"}]);
  const [aiInput,setAiInput]=useState(""); const [aiLoad,setAiLoad]=useState(false);
  const [summary,setSummary]=useState(null); const [sumLoad,setSumLoad]=useState(false);
  const aiEnd=useRef(null);

  // COMMUNITY
  const [posts,setPosts]=useState(()=>{try{const p=localStorage.getItem("mw_community");return p?JSON.parse(p):INIT_COMMUNITY;}catch{return INIT_COMMUNITY;}});
  const [newPost,setNewPost]=useState("");
  const [replyTo,setReplyTo]=useState(null);
  const [replyText,setReplyText]=useState("");
  const [expanded,setExpanded]=useState(null);

  // BLOG
  const [selBlog,setSelBlog]=useState(null);
  const [blogLikes,setBlogLikes]=useState({});

  // MODALS
  const [showSOS,setShowSOS]=useState(false);
  const [showNotifs,setShowNotifs]=useState(false);

  // INTRO FLOW (only shown once, first launch)
  const [splashDone,setSplashDone]=useState(()=>{try{return!!localStorage.getItem("mw_splash");}catch{return false;}});
  const [therapyFor,setTherapyFor]=useState(null);
  const [introSlide,setIntroSlide]=useState(0);
  const [introDone,setIntroDone]=useState(()=>{try{return!!localStorage.getItem("mw_intro");}catch{return false;}});

  useEffect(()=>{if(splashDone)localStorage.setItem("mw_splash","1");},[splashDone]);
  useEffect(()=>{if(introDone)localStorage.setItem("mw_intro","1");},[introDone]);
  // PERSIST DATA
  useEffect(()=>{if(user)localStorage.setItem("mw_user",JSON.stringify(user));},[user]);
  useEffect(()=>{localStorage.setItem("mw_bal",balance);},[balance]);
  useEffect(()=>{localStorage.setItem("mw_mins",mins);},[mins]);
  useEffect(()=>{localStorage.setItem("mw_txns",JSON.stringify(txns));},[txns]);
  useEffect(()=>{localStorage.setItem("mw_journal",JSON.stringify(entries));},[entries]);
  useEffect(()=>{localStorage.setItem("mw_sessions",JSON.stringify(sessions));},[sessions]);
  useEffect(()=>{localStorage.setItem("mw_community",JSON.stringify(posts));},[posts]);
  useEffect(()=>{if(obDone)localStorage.setItem("mw_ob","1");},[obDone]);
  useEffect(()=>{aiEnd.current?.scrollIntoView({behavior:"smooth"});},[aiMsgs]);
  useEffect(()=>{
    if(inSess){timerRef.current=setInterval(()=>setSessElapsed(s=>s+1),1000);}
    else clearInterval(timerRef.current);
    return()=>clearInterval(timerRef.current);
  },[inSess]);

  const filteredDocs=THERAPISTS.filter(t=>{
    if(fMode!=="all"&&!t.modes.includes(fMode))return false;
    if(fGender!=="all"&&t.gender.toLowerCase()!==fGender)return false;
    if(fSpec!=="all"&&!t.specs.some(s=>s.toLowerCase().includes(fSpec.toLowerCase())))return false;
    if(searchQ.trim()){
      const q=searchQ.toLowerCase();
      if(!(t.name.toLowerCase().includes(q)||t.title.toLowerCase().includes(q)||t.city.toLowerCase().includes(q)||t.specs.some(s=>s.toLowerCase().includes(q))||t.lang.some(l=>l.toLowerCase().includes(q))))return false;
    }
    return true;
  }).sort((a,b)=>{
    if(fSort==="rating")return b.rating-a.rating;
    if(fSort==="price_low")return a.hourly-b.hourly;
    if(fSort==="price_high")return b.hourly-a.hourly;
    return b.online-a.online||b.rating-a.rating;
  });

  const userName=user?.name||"Friend";

  const doAuth=()=>{
    if(authMode==="signup"){
      if(!form.name.trim()||!form.phone.trim()){setAuthErr("Name and phone are required.");return;}
      if(!/^[6-9]\d{9}$/.test(form.phone.trim())){setAuthErr("Enter a valid 10-digit Indian mobile number.");return;}
      if(!otpSent){setOtpSent(true);setAuthErr("");return;}
      setUser({name:form.name,phone:form.phone,dob:form.dob,gender:form.gender,joinDate:new Date().toLocaleDateString("en-IN")});
    } else {
      if(!form.phone.trim()){setAuthErr("Enter your phone number.");return;}
      if(!/^[6-9]\d{9}$/.test(form.phone.trim())){setAuthErr("Enter a valid 10-digit Indian mobile number.");return;}
      if(!otpSent){setOtpSent(true);setAuthErr("");return;}
      setUser({name:"Friend",phone:form.phone,joinDate:new Date().toLocaleDateString("en-IN")});
    }
  };
  const logout=()=>{localStorage.removeItem("mw_user");setUser(null);setOtpSent(false);setForm({name:"",phone:"",dob:"",gender:"",referral:"",otp:""});setAuthMode("signup");};
  const nav=(t)=>{setTab(t);setSelDoc(null);setInSess(false);setShowRating(false);setSessMode(null);setSelBlog(null);};

  const endSess=()=>{
    setInSess(false);
    const cost=Math.max(50,Math.round(Math.ceil(sessElapsed/60)*(selDoc.hourly/60)));
    setBalance(b=>Math.max(0,b-cost));
    setMins(m=>Math.max(0,m-Math.ceil(sessElapsed/60)));
    setSessions(s=>[{therapist:selDoc.name,mode:sessMode,duration:Math.ceil(sessElapsed/60),date:new Date().toLocaleDateString("en-IN"),cost},...s]);
    setShowRating(true);
  };

  const sendAI=async()=>{
    if(!aiInput.trim()||aiLoad)return;
    const txt=aiInput.trim();setAiInput("");
    setAiMsgs(m=>[...m,{role:"user",text:txt}]);setAiLoad(true);
    try{
      const hist=aiMsgs.map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.text}));
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,system:`You are MindBot, a warm compassionate AI mental health companion for MindWell — India's mental wellness platform. The user's name is ${userName}. Respond with genuine empathy and cultural sensitivity. 2-3 sentences max. Occasionally use warm Hindi expressions naturally (like 'yaar', 'bilkul', 'shukriya', 'haan'). Never diagnose. Gently suggest professional therapy when appropriate. Always validate feelings first.`,messages:[...hist,{role:"user",content:txt}]})});
      if(!r.ok) throw new Error(`API error: ${r.status}`);
      const d=await r.json();
      setAiMsgs(m=>[...m,{role:"assistant",text:d.content?.find(b=>b.type==="text")?.text||"Main yahan hoon. Keep sharing — I'm listening."}]);
    }catch(err){console.error("MindBot AI error:",err);setAiMsgs(m=>[...m,{role:"assistant",text:"I'm having trouble connecting right now. Please try again in a moment, or reach out to a therapist directly."}]);}
    setAiLoad(false);
  };

  const genSummary=async()=>{
    setSumLoad(true);
    const c=aiMsgs.map(m=>`${m.role==="user"?"Patient":"AI"}: ${m.text}`).join("\n");
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,system:"Clinical briefing assistant. Use EXACTLY these bold headers: **Presenting Concerns**, **Emotional State**, **Key Themes**, **Recommended Focus Areas**. Clinical but compassionate. Max 150 words. Indian cultural context.",messages:[{role:"user",content:`Generate practitioner summary:\n\n${c}`}]})});
      if(!r.ok) throw new Error(`API error: ${r.status}`);
      const d=await r.json();
      setSummary(d.content?.find(b=>b.type==="text")?.text||"Unable to generate.");
    }catch(err){console.error("Summary generation error:",err);setSummary("Failed to generate summary. Please check your connection and try again.");}
    setSumLoad(false);
  };

  const openRaz=(amt)=>{
    setRazAmt(amt);
    if(typeof window!=="undefined"&&!window.Razorpay){
      const s=document.createElement("script");s.src="https://checkout.razorpay.com/v1/checkout.js";
      s.onload=()=>launchRaz(amt);document.body.appendChild(s);
    } else { launchRaz(amt); }
  };
  const launchRaz=(amt)=>{
    const opts={
      key:RAZORPAY_KEY,
      amount:amt*100,currency:"INR",name:"MindWell",
      description:"Therapy Session Recharge",
      prefill:{name:user?.name||"",contact:user?.phone||""},
      theme:{color:"#9B7FD4"},
      handler:()=>{creditWallet(amt);},
      modal:{ondismiss:()=>{setShowRaz(false);setRazAmt(null);}},
    };
    try{const rz=new window.Razorpay(opts);rz.open();}
    catch{setShowRaz(true);}
  };
  const creditWallet=(amt)=>{
    setBalance(b=>b+amt);setMins(m=>m+Math.floor(amt/16.7));
    setTxns(t=>[{type:"credit",amt,label:`Recharge — ${inr(amt)}`,date:new Date().toLocaleDateString("en-IN")},...t]);
    setShowRaz(false);setRazAmt(null);
  };

  const saveJournal=()=>{
    if(!jText.trim())return;
    setEntries(p=>[{id:Date.now(),text:jText,mood:jMood,date:new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short"}),time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})},...p]);
    setJText("");setJMood(2);setWriting(false);
  };

  const addPost=()=>{
    if(!newPost.trim())return;
    setPosts(p=>[{id:Date.now(),author:userName,text:newPost,likes:0,replies:[]},...p]);
    setNewPost("");
  };
  const addReply=(pid)=>{
    if(!replyText.trim())return;
    setPosts(p=>p.map(x=>x.id===pid?{...x,replies:[...x.replies,{author:userName,text:replyText}]}:x));
    setReplyText("");setReplyTo(null);
  };

  // ═══ SPLASH ═══
  if(!splashDone) return(
    <div style={{fontFamily:"'Nunito',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(160deg,#1A1035,#2D1B6B,#4A2D9E)",minHeight:"100vh",position:"relative",overflow:"hidden"}} onClick={()=>setSplashDone(true)}>
      <div style={{position:"absolute",top:"10%",left:"10%",width:200,height:200,borderRadius:"50%",background:"rgba(91,141,239,0.07)"}}/>
      <div style={{position:"absolute",bottom:"15%",right:"5%",width:280,height:280,borderRadius:"50%",background:"rgba(155,127,212,0.06)"}}/>
      <div style={{animation:"pulse 2.4s ease infinite",marginBottom:28}}>
        <div style={{width:110,height:110,borderRadius:32,background:"linear-gradient(135deg,#5B8DEF,#9B7FD4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:54,boxShadow:"0 20px 60px #9B7FD477"}}>🌿</div>
      </div>
      <div style={{fontFamily:"'Lora',serif",fontSize:44,fontWeight:600,color:"#fff",letterSpacing:-1,animation:"fadeUp 0.8s ease 0.2s both"}}>MindWell</div>
      <div style={{fontSize:16,color:"rgba(255,255,255,0.55)",marginTop:8,letterSpacing:4,textTransform:"uppercase",animation:"fadeUp 0.8s ease 0.5s both"}}>Talk. Heal. Grow.</div>
      <div style={{position:"absolute",bottom:56,display:"flex",gap:7,animation:"fadeUp 0.8s ease 0.8s both"}}>
        {[0,1,2].map(i=><div key={i} style={{width:i===0?28:8,height:8,borderRadius:4,background:i===0?"#9B7FD4":"rgba(255,255,255,0.25)",transition:"all 0.3s"}}/>)}
      </div>
      <div style={{position:"absolute",bottom:28,fontSize:11,color:"rgba(255,255,255,0.25)",animation:"fadeUp 0.8s ease 1s both"}}>🇮🇳 Made for India with ❤️</div>
    </div>
  );

  // ═══ FOR WHOM (BetterHelp style) ═══
  if(!therapyFor) return(
    <div style={{fontFamily:"'Nunito',sans-serif",background:"linear-gradient(160deg,#F7F4FE,#EDE5FF)",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:"100%",maxWidth:460,animation:"fadeUp 0.5s ease"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:40,marginBottom:12}}>🤝</div>
          <div style={{fontFamily:"'Lora',serif",fontSize:26,fontWeight:600,color:T.dark,marginBottom:8}}>What type of support are you looking for?</div>
          <div style={{fontSize:13,color:T.sub}}>Select who the therapy is for</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          {[{id:"individual",icon:"🧍",title:"Individual",sub:"For myself — personal growth & mental health",color:T.sky},{id:"couples",icon:"👫",title:"Couples",sub:"For me and my partner — relationship support",color:T.lav},{id:"teen",icon:"👦",title:"Teen / Child",sub:"For my child or teenager",color:T.mint}].map(opt=>(
            <button key={opt.id} onClick={()=>setTherapyFor(opt.id)}
              style={{padding:"20px 18px",borderRadius:20,border:`2px solid #E8E0F5`,background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:16,textAlign:"left",transition:"all 0.2s",boxShadow:"0 2px 16px rgba(99,74,150,0.07)"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=opt.color;e.currentTarget.style.background=`${opt.color}11`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#E8E0F5";e.currentTarget.style.background="#fff";}}>
              <div style={{width:56,height:56,borderRadius:18,background:`${opt.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>{opt.icon}</div>
              <div><div style={{fontWeight:800,fontSize:15,color:T.dark,marginBottom:3}}>{opt.title}</div><div style={{fontSize:12,color:T.sub,lineHeight:1.4}}>{opt.sub}</div></div>
            </button>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:20,fontSize:11,color:T.sub}}>🔒 Your answers are private and confidential</div>
      </div>
    </div>
  );

  // ═══ 3-SLIDE INTRO ═══
  if(!introDone){
    const slides=[
      {icon:"🤝",title:"You are not alone",body:"Millions of Indians silently struggle. MindWell makes it safe, affordable, and accessible to talk to a real professional — in your own language, any time.",color:T.sky},
      {icon:"🌿",title:"Talk. Heal. Grow.",body:"Chat, call, or video session with verified Indian therapists. Use AI journaling between sessions to track your inner journey and celebrate your growth.",color:T.lav},
      {icon:"💰",title:"₹500 = 30 minutes",body:"No monthly commitment. Pay only for what you use. Free AI chat always available. Because real support shouldn't ever be a luxury.",color:T.mint},
    ];
    const s=slides[introSlide];
    return(
      <div style={{fontFamily:"'Nunito',sans-serif",display:"flex",flexDirection:"column",padding:"60px 28px 40px",background:`linear-gradient(160deg,${s.color}18,#F7F4FE)`,minHeight:"100vh"}}>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",animation:"fadeUp 0.5s ease"}}>
          <div style={{fontSize:84,marginBottom:30}}>{s.icon}</div>
          <div style={{fontFamily:"'Lora',serif",fontSize:28,fontWeight:600,color:T.dark,marginBottom:16,lineHeight:1.3}}>{s.title}</div>
          <div style={{fontSize:15,color:T.sub,lineHeight:1.85,maxWidth:320}}>{s.body}</div>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:28}}>
          {slides.map((_,i)=><div key={i} style={{width:i===introSlide?28:8,height:8,borderRadius:4,background:i===introSlide?s.color:"#E8E0F5",transition:"all 0.35s"}}/>)}
        </div>
        <Btn full grad={`linear-gradient(135deg,${s.color},#9B7FD4)`}
          onClick={()=>{ if(introSlide<2){setIntroSlide(i=>i+1);}else{setIntroDone(true);} }}>
          {introSlide<2?"Continue →":"Get Started →"}
        </Btn>
        {introSlide<2&&<button onClick={()=>setIntroDone(true)} style={{background:"none",border:"none",color:T.sub,fontSize:13,cursor:"pointer",marginTop:14,fontFamily:"'Nunito',sans-serif"}}>Skip</button>}
      </div>
    );
  }

  // ═══ AUTH SCREEN ═══
  if(!user) return(
    <div style={{fontFamily:"'Nunito',sans-serif",background:"linear-gradient(160deg,#F7F4FE,#EDE5FF)",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:460,animation:"fadeUp 0.5s ease"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:68,height:68,borderRadius:20,background:T.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,margin:"0 auto 14px",boxShadow:"0 8px 24px #9B7FD444"}}>🌿</div>
          <div style={{fontFamily:"'Lora',serif",fontSize:30,fontWeight:600,color:T.dark}}>MindWell</div>
          <div style={{fontSize:13,color:T.sub,marginTop:4}}>Talk. Heal. Grow. 🇮🇳</div>
        </div>
        <Card>
          <div style={{display:"flex",background:"#F0EBF8",borderRadius:13,padding:4,marginBottom:24}}>
            {[["signup","Sign Up"],["login","Log In"]].map(([m,l])=>(
              <button key={m} onClick={()=>{setAuthMode(m);setOtpSent(false);setAuthErr("");}}
                style={{flex:1,padding:"11px",border:"none",borderRadius:10,background:authMode===m?"#fff":"none",color:authMode===m?T.lav:T.sub,fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"'Nunito',sans-serif",boxShadow:authMode===m?"0 2px 10px rgba(99,74,150,0.12)":"none",transition:"all 0.2s"}}>
                {l}
              </button>
            ))}
          </div>

          {authMode==="signup"?(
            <div>
              <div style={{fontFamily:"'Lora',serif",fontSize:22,fontWeight:600,color:T.dark,marginBottom:4}}>Join MindWell 🌿</div>
              <div style={{fontSize:12,color:T.sub,marginBottom:18}}>Begin your wellness journey today</div>
              {!otpSent?(
                <>
                  {[["Full Name","name","text"],["Phone Number","phone","tel"],["Date of Birth","dob","date"]].map(([l,k,t])=>(
                    <div key={k} style={{marginBottom:11}}>
                      <div style={{fontSize:11,fontWeight:700,color:T.text,marginBottom:4}}>{l}</div>
                      <input type={t} value={form[k]} onChange={e=>setForm(d=>({...d,[k]:e.target.value}))} placeholder={l}
                        style={{width:"100%",padding:"11px 13px",borderRadius:11,border:`1.5px solid #E8E0F5`,background:"#fff",fontSize:14,outline:"none",color:T.text}}/>
                    </div>
                  ))}
                  <div style={{marginBottom:11}}>
                    <div style={{fontSize:11,fontWeight:700,color:T.text,marginBottom:4}}>Gender</div>
                    <div style={{display:"flex",gap:8}}>
                      {["Male","Female","Other"].map(g=><button key={g} onClick={()=>setForm(d=>({...d,gender:g}))}
                        style={{flex:1,padding:"9px",border:`2px solid ${form.gender===g?T.lav:"#E8E0F5"}`,borderRadius:10,background:form.gender===g?"#EDE5FF":"#fff",color:form.gender===g?T.lav:T.sub,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>{g}</button>)}
                    </div>
                  </div>
                  <div style={{marginBottom:18}}>
                    <div style={{fontSize:11,fontWeight:700,color:T.text,marginBottom:4}}>Referral Code (optional)</div>
                    <input value={form.referral} onChange={e=>setForm(d=>({...d,referral:e.target.value}))} placeholder="Enter referral code"
                      style={{width:"100%",padding:"11px 13px",borderRadius:11,border:`1.5px solid #E8E0F5`,background:"#fff",fontSize:14,outline:"none",color:T.text}}/>
                  </div>
                  {authErr&&<div style={{color:T.coral,fontSize:12,marginBottom:10}}>{authErr}</div>}
                  <Btn full onClick={doAuth}>Send OTP →</Btn>
                </>
              ):(
                <>
                  <div style={{fontSize:13,color:T.sub,marginBottom:12}}>OTP sent to +91 {form.phone}</div>
                  <div style={{marginBottom:18}}>
                    <div style={{fontSize:11,fontWeight:700,color:T.text,marginBottom:4}}>Enter OTP</div>
                    <input value={form.otp} onChange={e=>setForm(d=>({...d,otp:e.target.value}))} placeholder="● ● ● ● ● ●"
                      style={{width:"100%",padding:"14px",borderRadius:11,border:`1.5px solid ${T.lav}`,background:"#fff",fontSize:22,outline:"none",color:T.text,letterSpacing:10,textAlign:"center"}}/>
                  </div>
                  {authErr&&<div style={{color:T.coral,fontSize:12,marginBottom:10}}>{authErr}</div>}
                  <Btn full onClick={doAuth}>Create My Account ✓</Btn>
                  <button onClick={()=>setOtpSent(false)} style={{background:"none",border:"none",color:T.sub,fontSize:11,cursor:"pointer",marginTop:10,display:"block",width:"100%",fontFamily:"'Nunito',sans-serif"}}>← Change number</button>
                </>
              )}
            </div>
          ):(
            <div>
              <div style={{fontFamily:"'Lora',serif",fontSize:22,fontWeight:600,color:T.dark,marginBottom:4}}>Welcome back 👋</div>
              <div style={{fontSize:12,color:T.sub,marginBottom:18}}>Log in with your phone number</div>
              {!otpSent?(
                <>
                  <div style={{marginBottom:18}}>
                    <div style={{fontSize:11,fontWeight:700,color:T.text,marginBottom:4}}>Phone Number</div>
                    <div style={{display:"flex",gap:8}}>
                      <div style={{padding:"11px 13px",borderRadius:11,border:`1.5px solid #E8E0F5`,background:"#fff",fontSize:13,fontWeight:700,color:T.text,whiteSpace:"nowrap"}}>🇮🇳 +91</div>
                      <input value={form.phone} onChange={e=>setForm(d=>({...d,phone:e.target.value}))} placeholder="10-digit number"
                        style={{flex:1,padding:"11px 13px",borderRadius:11,border:`1.5px solid #E8E0F5`,background:"#fff",fontSize:14,outline:"none",color:T.text}}/>
                    </div>
                  </div>
                  {authErr&&<div style={{color:T.coral,fontSize:12,marginBottom:10}}>{authErr}</div>}
                  <Btn full onClick={doAuth}>Send OTP →</Btn>
                </>
              ):(
                <>
                  <div style={{fontSize:13,color:T.sub,marginBottom:12}}>OTP sent to +91 {form.phone}</div>
                  <div style={{marginBottom:18}}>
                    <div style={{fontSize:11,fontWeight:700,color:T.text,marginBottom:4}}>Enter OTP</div>
                    <input value={form.otp} onChange={e=>setForm(d=>({...d,otp:e.target.value}))} placeholder="● ● ● ● ● ●"
                      style={{width:"100%",padding:"14px",borderRadius:11,border:`1.5px solid ${T.lav}`,background:"#fff",fontSize:22,outline:"none",color:T.text,letterSpacing:10,textAlign:"center"}}/>
                  </div>
                  {authErr&&<div style={{color:T.coral,fontSize:12,marginBottom:10}}>{authErr}</div>}
                  <Btn full onClick={doAuth}>Log In ✓</Btn>
                  <button onClick={()=>setOtpSent(false)} style={{background:"none",border:"none",color:T.sub,fontSize:11,cursor:"pointer",marginTop:10,display:"block",width:"100%",fontFamily:"'Nunito',sans-serif"}}>← Change number</button>
                </>
              )}
            </div>
          )}
          <div style={{textAlign:"center",marginTop:14,fontSize:11,color:T.sub}}>🔒 Encrypted · Private · Never shared with anyone</div>
        </Card>
      </div>
    </div>
  );

  // ═══ ONBOARDING ═══
  if(!obDone) return(
    <div style={{fontFamily:"'Nunito',sans-serif",background:"linear-gradient(160deg,#F7F4FE,#EDE5FF)",minHeight:"100vh",padding:"28px 20px",maxWidth:480,margin:"0 auto"}}>
      <div style={{animation:"fadeUp 0.5s ease"}}>
        <div style={{fontSize:11,letterSpacing:2,color:T.lav,textTransform:"uppercase",fontWeight:800,marginBottom:6}}>One quick step ✨</div>
        <div style={{fontFamily:"'Lora',serif",fontSize:23,fontWeight:600,color:T.dark,marginBottom:4}}>What would you like to work on?</div>
        <div style={{fontSize:13,color:T.sub,marginBottom:20}}>Select all that apply — change anytime</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9,marginBottom:24}}>
          {ISSUES.map((x,i)=>{const s=selIssues.includes(x.l);return(
            <button key={i} onClick={()=>setSelIssues(p=>s?p.filter(v=>v!==x.l):[...p,x.l])}
              style={{padding:"13px 6px",borderRadius:14,border:`2px solid ${s?T.lav:"#E8E0F5"}`,background:s?"#EDE5FF":"#fff",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
              <div style={{fontSize:22,marginBottom:4}}>{x.i}</div>
              <div style={{fontSize:10,fontWeight:700,color:s?T.lav:T.text,lineHeight:1.3}}>{x.l}</div>
            </button>
          );})}
        </div>
        <Btn full onClick={()=>setObDone(true)}>{selIssues.length?`Continue (${selIssues.length} selected) →`:"Continue →"}</Btn>
        <button onClick={()=>setObDone(true)} style={{background:"none",border:"none",color:T.sub,fontSize:12,cursor:"pointer",marginTop:10,display:"block",width:"100%",fontFamily:"'Nunito',sans-serif"}}>Skip for now</button>
      </div>
    </div>
  );

  // ═══ MAIN APP ═══
  const Sidebar=()=>(
    <div className="sidebar">
      <div style={{marginBottom:24}}>
        <div style={{fontSize:26,marginBottom:3}}>🌿</div>
        <div style={{fontFamily:"'Lora',serif",fontSize:20,color:"#fff",fontWeight:600}}>MindWell</div>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginTop:1}}>Talk. Heal. Grow.</div>
      </div>
      <div style={{background:"rgba(255,255,255,0.07)",borderRadius:12,padding:"11px 13px",marginBottom:20}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginBottom:1}}>Wallet Balance</div>
        <div style={{fontSize:19,fontWeight:900,color:"#fff"}}>{inr(balance)}</div>
        <div style={{fontSize:10,color:T.mint,marginTop:1}}>⏱ {mins} mins left</div>
      </div>
      {[{id:"home",l:"Home",ic:Ic.home},{id:"therapists",l:"Therapists",ic:Ic.search},{id:"journal",l:"Journal",ic:Ic.journal},{id:"ai",l:"AI Chat",ic:Ic.ai},{id:"wallet",l:"Wallet",ic:Ic.wallet},{id:"community",l:"Community",ic:Ic.community},{id:"blog",l:"Wellness Blog",ic:Ic.blog},{id:"profile",l:"Profile",ic:Ic.profile}].map(({id,l,ic})=>(
        <button key={id} onClick={()=>nav(id)}
          style={{width:"100%",display:"flex",alignItems:"center",gap:11,padding:"11px 12px",borderRadius:11,border:"none",background:tab===id?"rgba(155,127,212,0.25)":"none",color:tab===id?"#fff":"rgba(255,255,255,0.5)",fontSize:13,fontWeight:tab===id?700:500,cursor:"pointer",marginBottom:3,fontFamily:"'Nunito',sans-serif",transition:"all 0.2s"}}>
          {ic}{l}
        </button>
      ))}
      <button onClick={()=>setShowSOS(true)} style={{width:"100%",marginTop:14,padding:"11px 12px",borderRadius:11,border:"none",background:"linear-gradient(135deg,#FF6B6B,#ee0979)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif",display:"flex",alignItems:"center",gap:8}}>
        {Ic.sos} SOS Help
      </button>
    </div>
  );

  return(
    <div style={{fontFamily:"'Nunito',sans-serif",minHeight:"100vh",background:T.bg}}>
      <div className="app-shell">
        <Sidebar/>
        <div className="main-area">
          <div className="page-pad">

            {/* ── HOME ── */}
            {tab==="home"&&(
              <div style={{animation:"fadeUp 0.4s ease"}}>
                <div style={{background:T.gd,padding:"28px 18px 22px",borderRadius:"0 0 22px 22px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <div style={{fontSize:10,letterSpacing:2,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",marginBottom:3}}>Namaste 🙏</div>
                      <div style={{fontFamily:"'Lora',serif",fontSize:25,color:"#fff",fontWeight:600,marginBottom:2}}>{userName}</div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.45)"}}>{selIssues.length?`Working on: ${selIssues.slice(0,2).join(", ")}`:"How are you today?"}</div>
                    </div>
                    <button onClick={()=>setShowNotifs(true)} style={{width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                      {Ic.bell}<div style={{position:"absolute",top:8,right:8,width:7,height:7,borderRadius:"50%",background:T.coral}}/>
                    </button>
                  </div>
                  <div style={{marginTop:14,background:"rgba(255,255,255,0.07)",borderRadius:13,padding:"11px 15px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div><div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginBottom:1}}>Wallet · {mins} mins</div><div style={{fontSize:20,fontWeight:900,color:"#fff"}}>{inr(balance)}</div></div>
                    <button onClick={()=>nav("wallet")} style={{background:T.g1,border:"none",borderRadius:10,padding:"8px 14px",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>+ Recharge</button>
                  </div>
                </div>
                <div style={{padding:16}}>
                  {/* Mood */}
                  {!moodDone?(<Card style={{marginBottom:13}}>
                    <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:11}}>How are you feeling right now? 💭</div>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      {MOODS.map((m,i)=><button key={i} onClick={()=>{setMoodIdx(i);setMoodDone(true);}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer"}}>
                        <div style={{fontSize:26,transition:"transform 0.2s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.3)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>{m}</div>
                        <div style={{fontSize:9,color:T.sub,fontWeight:600}}>{MOODL[i]}</div>
                      </button>)}
                    </div>
                  </Card>):(
                    <div style={{background:`${MOODC[moodIdx]}44`,borderRadius:13,padding:"11px 15px",display:"flex",gap:10,alignItems:"center",marginBottom:13,border:`1px solid ${MOODC[moodIdx]}`}}>
                      <div style={{fontSize:24}}>{MOODS[moodIdx]}</div>
                      <div><div style={{fontWeight:700,fontSize:13,color:T.dark}}>Feeling {MOODL[moodIdx]} today</div><div style={{fontSize:11,color:T.sub}}>Mood logged ✓</div></div>
                    </div>
                  )}

                  {/* Talk Now */}
                  <div style={{background:T.g1,borderRadius:18,padding:"20px 18px",position:"relative",overflow:"hidden",marginBottom:13}}>
                    <div style={{position:"absolute",right:-10,top:-10,width:90,height:90,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
                    <div style={{fontSize:20,marginBottom:5}}>🧠</div>
                    <div style={{fontFamily:"'Lora',serif",fontSize:19,color:"#fff",fontWeight:600,marginBottom:3}}>Talk to a Therapist Now</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",marginBottom:13}}>{THERAPISTS.filter(t=>t.online).length} therapists available · Starting {inr(500)}</div>
                    <button onClick={()=>nav("therapists")} style={{background:"#fff",border:"none",borderRadius:11,padding:"10px 20px",color:T.lav,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Find a Therapist →</button>
                  </div>

                  {/* Blog preview */}
                  <div style={{marginBottom:13}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <div style={{fontSize:13,fontWeight:800,color:T.dark}}>🌱 From Our Practitioners</div>
                      <button onClick={()=>nav("blog")} style={{background:"none",border:"none",color:T.lav,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>See all →</button>
                    </div>
                    <div style={{display:"flex",gap:11,overflowX:"auto",paddingBottom:4}}>
                      {BLOGS.slice(0,3).map(p=>(
                        <div key={p.id} onClick={()=>{setSelBlog(p);nav("blog");}} className="hvr"
                          style={{minWidth:185,background:"#fff",borderRadius:15,padding:"14px 13px",border:`1px solid #E8E0F5`,cursor:"pointer",flexShrink:0}}>
                          <div style={{fontSize:26,marginBottom:7}}>{p.emoji}</div>
                          <Badge color={p.color}>{p.tag}</Badge>
                          <div style={{fontSize:12,fontWeight:700,color:T.dark,lineHeight:1.4,marginTop:7}}>{p.title}</div>
                          <div style={{fontSize:10,color:T.sub,marginTop:4}}>{p.author}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended therapists */}
                  <div style={{marginBottom:13}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <div style={{fontSize:13,fontWeight:800,color:T.dark}}>✨ Recommended for You</div>
                      <button onClick={()=>nav("therapists")} style={{background:"none",border:"none",color:T.lav,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>See all →</button>
                    </div>
                    {THERAPISTS.slice(0,3).map((t,i)=>(
                      <div key={t.id} className="hvr" onClick={()=>{setSelDoc(t);setTab("therapists");}}
                        style={{background:"#fff",borderRadius:16,padding:15,boxShadow:"0 2px 14px rgba(99,74,150,0.06)",border:`1px solid #E8E0F5`,marginBottom:9,cursor:"pointer",animation:`fadeUp 0.35s ease ${i*0.07}s both`}}>
                        <div style={{display:"flex",gap:11}}>
                          <div style={{width:48,height:48,borderRadius:14,background:`linear-gradient(135deg,${t.color},${t.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:14,flexShrink:0}}>{t.initials}</div>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                              <div><div style={{fontWeight:800,fontSize:13,color:T.dark}}>{t.name}</div><div style={{fontSize:10,color:T.sub}}>{t.title}</div></div>
                              <Badge color={t.online?T.mint:T.sub}>{t.online?"● Online":"Offline"}</Badge>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:7}}>
                              <div style={{display:"flex",gap:3,alignItems:"center",color:T.gold,fontSize:11,fontWeight:700}}>{Ic.star} {t.rating}<span style={{color:T.sub,fontWeight:400,fontSize:10}}>({t.reviews})</span></div>
                              <div style={{fontWeight:900,color:T.lav,fontSize:13}}>{inr(t.hourly)}/hr</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button onClick={()=>setShowSOS(true)}
                    style={{width:"100%",padding:15,borderRadius:16,border:"none",background:"linear-gradient(135deg,#FF6B6B,#ee0979)",color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:9,fontFamily:"'Nunito',sans-serif",animation:"pulse 3s ease infinite"}}>
                    {Ic.sos} I'm Feeling Overwhelmed — SOS Help
                  </button>
                </div>
              </div>
            )}

            {/* ── THERAPISTS LIST ── */}
            {tab==="therapists"&&!selDoc&&!inSess&&!showRating&&(
              <div style={{animation:"fadeUp 0.3s ease"}}>
                {/* Header with search */}
                <div style={{background:T.gd,padding:"22px 16px 16px",borderRadius:"0 0 22px 22px"}}>
                  <div style={{fontFamily:"'Lora',serif",fontSize:22,color:"#fff",fontWeight:600,marginBottom:2}}>Find Your Therapist</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:13}}>18 verified Indian practitioners</div>
                  {/* SEARCH BAR */}
                  <div style={{position:"relative"}}>
                    <div style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.45)",pointerEvents:"none"}}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                    <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search by name, issue, city, language..."
                      style={{width:"100%",padding:"12px 14px 12px 38px",borderRadius:14,border:"1.5px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.12)",color:"#fff",fontSize:13,outline:"none",fontFamily:"'Nunito',sans-serif",backdropFilter:"blur(8px)"}}/>
                    {searchQ&&<button onClick={()=>setSearchQ("")} style={{position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:17,lineHeight:1}}>×</button>}
                  </div>
                </div>

                {/* SPECIALTY CHIPS — scrollable */}
                <div style={{background:"#fff",borderBottom:`1px solid #E8E0F5`,padding:"11px 14px 11px"}}>
                  <div style={{fontSize:10,fontWeight:700,color:T.sub,marginBottom:7,textTransform:"uppercase",letterSpacing:1}}>I'm looking for help with</div>
                  <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:3}}>
                    {[{v:"all",l:"✨ All"},{v:"anxiety",l:"💭 Anxiety"},{v:"depression",l:"🌧 Depression"},{v:"trauma",l:"💫 Trauma"},{v:"relationships",l:"💔 Relationships"},{v:"stress",l:"🔥 Stress"},{v:"grief",l:"🕊 Grief"},{v:"addiction",l:"🔗 Addiction"},{v:"sleep",l:"😴 Sleep"},{v:"ocd",l:"🔄 OCD"},{v:"lgbtq",l:"🏳️‍🌈 LGBTQ+"},{v:"teens",l:"👦 Teens"},{v:"family",l:"🏠 Family"},{v:"anger",l:"😤 Anger"},{v:"eating",l:"💚 Eating"},{v:"work",l:"💼 Work"}].map(o=>(
                      <button key={o.v} onClick={()=>setFSpec(o.v)}
                        style={{padding:"6px 13px",borderRadius:18,border:`1.5px solid ${fSpec===o.v?T.lav:"#E8E0F5"}`,background:fSpec===o.v?"#EDE5FF":"#F7F4FE",color:fSpec===o.v?T.lav:T.sub,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif",whiteSpace:"nowrap",flexShrink:0,transition:"all 0.2s"}}>
                        {o.l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* MODE / GENDER / SORT FILTERS */}
                <div style={{background:"#fff",borderBottom:`1px solid #E8E0F5`,padding:"10px 14px"}}>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {/* Mode */}
                    {[{v:"all",l:"All Modes"},{v:"chat",l:"💬 Chat"},{v:"audio",l:"📞 Audio"},{v:"video",l:"🎥 Video"}].map(o=>(
                      <button key={o.v} onClick={()=>setFMode(o.v)}
                        style={{padding:"5px 11px",borderRadius:16,border:`1.5px solid ${fMode===o.v?T.sky:"#E8E0F5"}`,background:fMode===o.v?`${T.sky}18`:"#fff",color:fMode===o.v?T.sky:T.sub,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif",whiteSpace:"nowrap"}}>
                        {o.l}
                      </button>
                    ))}
                    {/* Gender */}
                    {[{v:"all",l:"Any Gender"},{v:"female",l:"👩 Female"},{v:"male",l:"👨 Male"}].map(o=>(
                      <button key={o.v} onClick={()=>setFGender(o.v)}
                        style={{padding:"5px 11px",borderRadius:16,border:`1.5px solid ${fGender===o.v?T.mint:"#E8E0F5"}`,background:fGender===o.v?`${T.mint}18`:"#fff",color:fGender===o.v?T.mint:T.sub,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif",whiteSpace:"nowrap"}}>
                        {o.l}
                      </button>
                    ))}
                    {/* Sort */}
                    <select value={fSort} onChange={e=>setFSort(e.target.value)}
                      style={{padding:"5px 11px",borderRadius:16,border:`1.5px solid #E8E0F5`,background:"#fff",color:T.sub,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif",outline:"none",marginLeft:"auto"}}>
                      <option value="recommended">⭐ Recommended</option>
                      <option value="rating">🏆 Top Rated</option>
                      <option value="price_low">💰 Lowest Price</option>
                      <option value="price_high">💎 Highest Price</option>
                    </select>
                  </div>
                </div>

                {/* RESULTS */}
                <div style={{padding:"11px 14px"}}>
                  {filteredDocs.length===0?(
                    <div style={{textAlign:"center",padding:"44px 20px"}}>
                      <div style={{fontSize:48,marginBottom:13}}>🔍</div>
                      <div style={{fontSize:14,fontWeight:700,color:T.dark,marginBottom:6}}>No therapists found</div>
                      <div style={{fontSize:12,color:T.sub,marginBottom:16}}>Try adjusting your search or filters</div>
                      <Btn sm onClick={()=>{setSearchQ("");setFMode("all");setFGender("all");setFSpec("all");}}>Clear All Filters</Btn>
                    </div>
                  ):(
                    <>
                      <div style={{fontSize:11,color:T.sub,marginBottom:13}}>{filteredDocs.length} therapist{filteredDocs.length!==1?"s":""} found{searchQ?` for "${searchQ}"`:""}</div>
                      {filteredDocs.map((t,i)=>(
                        <div key={t.id} className="hvr" onClick={()=>setSelDoc(t)}
                          style={{background:"#fff",borderRadius:20,boxShadow:"0 3px 18px rgba(99,74,150,0.08)",border:`1px solid #E8E0F5`,marginBottom:13,cursor:"pointer",overflow:"hidden",animation:`fadeUp 0.3s ease ${Math.min(i*0.04,0.3)}s both`}}>
                          {/* Face-first top strip */}
                          <div style={{background:`linear-gradient(135deg,${t.color}22,${t.color}08)`,padding:"18px 16px 14px",display:"flex",gap:14,alignItems:"flex-start"}}>
                            {/* Big avatar */}
                            <div style={{position:"relative",flexShrink:0}}>
                              <div style={{width:72,height:72,borderRadius:22,background:`linear-gradient(145deg,${t.color},${t.color}99)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:22,boxShadow:`0 6px 20px ${t.color}55`}}>
                                {t.initials}
                              </div>
                              {t.online&&<div style={{position:"absolute",bottom:3,right:3,width:13,height:13,borderRadius:"50%",background:T.green,border:"2.5px solid #fff"}}/>}
                            </div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:6}}>
                                <div>
                                  <div style={{fontWeight:900,fontSize:15,color:T.dark,lineHeight:1.2}}>{t.name}</div>
                                  <div style={{fontSize:11,color:T.sub,marginTop:2}}>{t.title}</div>
                                  <div style={{fontSize:10,color:T.sub,marginTop:1}}>📍 {t.city} · {t.exp}</div>
                                </div>
                                <div style={{fontWeight:900,color:T.lav,fontSize:15,whiteSpace:"nowrap"}}>{inr(t.hourly)}<span style={{fontSize:9,fontWeight:500,color:T.sub}}>/hr</span></div>
                              </div>
                              <div style={{display:"flex",gap:4,marginTop:8,alignItems:"center"}}>
                                <div style={{display:"flex",gap:2,alignItems:"center",color:T.gold,fontSize:12,fontWeight:800}}>{Ic.star} {t.rating}</div>
                                <div style={{fontSize:10,color:T.sub}}>({t.reviews} reviews)</div>
                                <div style={{marginLeft:"auto",display:"flex",gap:4}}>
                                  {t.modes.map(m=><span key={m} style={{width:22,height:22,borderRadius:7,background:"rgba(255,255,255,0.8)",display:"flex",alignItems:"center",justifyContent:"center",color:T.sub}}>
                                    {m==="chat"?<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>:m==="audio"?<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6z"/></svg>:<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>}
                                  </span>)}
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Specs + languages + CTA */}
                          <div style={{padding:"10px 16px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                                {t.specs.slice(0,3).map(s=><span key={s} style={{background:`${t.color}15`,color:t.color,fontSize:9,padding:"3px 8px",borderRadius:7,fontWeight:700}}>{s}</span>)}
                              </div>
                              <div style={{fontSize:10,color:T.sub,marginTop:5}}>🗣 {t.lang.slice(0,2).join(", ")}{t.lang.length>2?` +${t.lang.length-2}`:""}</div>
                            </div>
                            <button onClick={e=>{e.stopPropagation();setSelDoc(t);}}
                              style={{background:T.g1,border:"none",borderRadius:12,padding:"10px 16px",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif",whiteSpace:"nowrap",flexShrink:0}}>
                              View Profile →
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* THERAPIST DETAIL */}
            {tab==="therapists"&&selDoc&&!inSess&&!showRating&&(
              <div style={{animation:"fadeUp 0.3s ease"}}>
                <div style={{background:`linear-gradient(160deg,${selDoc.color}33,${T.bg})`,padding:"18px 18px 0"}}>
                  <button onClick={()=>setSelDoc(null)} style={{background:"none",border:"none",color:selDoc.color,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:13,fontWeight:700,marginBottom:16,fontFamily:"'Nunito',sans-serif"}}>{Ic.back} All Therapists</button>
                  <div style={{textAlign:"center",paddingBottom:20}}>
                    <div style={{width:80,height:80,borderRadius:24,background:`linear-gradient(135deg,${selDoc.color},${selDoc.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:24,margin:"0 auto 12px",boxShadow:`0 10px 26px ${selDoc.color}55`}}>{selDoc.initials}</div>
                    <div style={{fontFamily:"'Lora',serif",fontSize:22,fontWeight:600,color:T.dark}}>{selDoc.name}</div>
                    <div style={{fontSize:11,color:T.sub,marginTop:2}}>{selDoc.title} · {selDoc.city} · {selDoc.exp}</div>
                    <div style={{fontSize:11,color:T.sub,marginTop:2}}>🗣 {selDoc.lang.join(", ")}</div>
                    <div style={{display:"flex",gap:4,justifyContent:"center",flexWrap:"wrap",marginTop:10}}>
                      {selDoc.specs.map(s=><Badge key={s} color={selDoc.color}>{s}</Badge>)}
                    </div>
                  </div>
                </div>
                <div style={{padding:"0 14px 20px"}}>
                  <Card style={{marginBottom:13}}><div style={{fontSize:13,color:T.text,lineHeight:1.8}}>{selDoc.bio}</div></Card>

                  <Card style={{marginBottom:13}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}>
                      <div style={{fontSize:13,fontWeight:800,color:T.dark}}>Session Type</div>
                      <div style={{fontWeight:900,color:T.lav,fontSize:14}}>{inr(selDoc.hourly)}/hr</div>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      {selDoc.modes.map(m=><button key={m} onClick={()=>setSessMode(m)}
                        style={{flex:1,padding:"13px 7px",borderRadius:13,border:`2px solid ${sessMode===m?T.lav:"#E8E0F5"}`,background:sessMode===m?"#EDE5FF":"#fff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                        <div style={{color:sessMode===m?T.lav:T.sub}}>{m==="chat"?Ic.chat:m==="audio"?Ic.phone:Ic.video}</div>
                        <div style={{fontSize:11,fontWeight:700,color:sessMode===m?T.lav:T.sub,textTransform:"capitalize"}}>{m}</div>
                      </button>)}
                    </div>
                  </Card>

                  {/* REVIEWS */}
                  <Card style={{marginBottom:13}}>
                    <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:11}}>Patient Reviews ⭐</div>
                    {selDoc.reviewList.map((r,i)=>(
                      <div key={i} style={{paddingBottom:11,marginBottom:11,borderBottom:i<selDoc.reviewList.length-1?`1px solid #E8E0F5`:"none"}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                          <div style={{fontWeight:700,fontSize:12,color:T.dark}}>{r.name}</div>
                          <div style={{color:T.gold,fontSize:12}}>{"⭐".repeat(r.stars)}</div>
                        </div>
                        <div style={{fontSize:12,color:T.text,lineHeight:1.65,fontStyle:"italic"}}>"{r.text}"</div>
                      </div>
                    ))}
                  </Card>

                  {mins<15&&<div style={{background:"#FFF3E0",borderRadius:11,padding:"9px 13px",marginBottom:13,fontSize:11,color:"#E65100"}}>⚠️ Low minutes. <span style={{fontWeight:700,cursor:"pointer",textDecoration:"underline"}} onClick={()=>nav("wallet")}>Recharge now →</span></div>}
                  <Btn full disabled={!sessMode} onClick={()=>{if(sessMode){setInSess(true);setSessElapsed(0);setSessMsgs([{from:"them",text:`Namaste! I'm ${selDoc.name}. I'm so glad you reached out. How are you feeling today?`}]);}}}>
                    {sessMode?`Start ${sessMode} session →`:"Select a session type first"}
                  </Btn>
                </div>
              </div>
            )}

            {/* IN SESSION */}
            {tab==="therapists"&&inSess&&selDoc&&(
              <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 0px)",animation:"fadeUp 0.3s ease"}}>
                <div style={{background:T.gd,padding:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div style={{width:35,height:35,borderRadius:11,background:selDoc.color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:12}}>{selDoc.initials}</div>
                    <div><div style={{fontWeight:700,color:"#fff",fontSize:13}}>{selDoc.name}</div><div style={{fontSize:10,color:T.mint}}>● {sessMode} · Live</div></div>
                  </div>
                  <div style={{display:"flex",gap:7,alignItems:"center"}}>
                    <div style={{background:"rgba(255,255,255,0.1)",borderRadius:8,padding:"5px 10px",fontSize:11,color:"#fff",fontWeight:700}}>⏱ {Math.floor(sessElapsed/60)}:{String(sessElapsed%60).padStart(2,"0")}</div>
                    <button onClick={endSess} style={{background:T.coral,border:"none",borderRadius:9,padding:"7px 12px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>End</button>
                  </div>
                </div>
                {sessMode==="video"&&<div style={{background:"#0D0A2E",height:150,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{textAlign:"center",color:"rgba(255,255,255,0.3)"}}><div style={{fontSize:42,marginBottom:5}}>{selDoc.initials}</div><div style={{fontSize:11}}>Video · End-to-end encrypted</div></div></div>}
                <div style={{flex:1,overflowY:"auto",padding:13,display:"flex",flexDirection:"column",gap:9}}>
                  {sessMsgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.from==="me"?"flex-end":"flex-start"}}>
                    <div style={{maxWidth:"78%",padding:"10px 14px",borderRadius:17,background:m.from==="me"?T.g1:"#fff",color:m.from==="me"?"#fff":T.text,fontSize:13,lineHeight:1.6,border:m.from!=="me"?`1px solid #E8E0F5`:"none",borderBottomRightRadius:m.from==="me"?4:17,borderBottomLeftRadius:m.from==="me"?17:4}}>{m.text}</div>
                  </div>)}
                </div>
                <div style={{padding:"9px 11px",background:"#fff",borderTop:`1px solid #E8E0F5`,display:"flex",gap:7}}>
                  <input value={sessInput} onChange={e=>setSessInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){if(!sessInput.trim())return;const txt=sessInput.trim();setSessInput("");setSessMsgs(m=>[...m,{from:"me",text:txt}]);setTimeout(()=>setSessMsgs(m=>[...m,{from:"them",text:"I hear you. That sounds really challenging. Can you tell me more about when this feeling started?"}]),1200);}}} placeholder="Type a message..."
                    style={{flex:1,padding:"10px 14px",borderRadius:18,border:`1px solid #E8E0F5`,background:T.bg,fontSize:13,outline:"none",color:T.text}}/>
                  <button onClick={()=>{if(!sessInput.trim())return;const txt=sessInput.trim();setSessInput("");setSessMsgs(m=>[...m,{from:"me",text:txt}]);setTimeout(()=>setSessMsgs(m=>[...m,{from:"them",text:"I hear you. That sounds really challenging. Can you tell me more about when this feeling started?"}]),1200);}} style={{width:40,height:40,borderRadius:"50%",border:"none",background:T.g1,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.send}</button>
                </div>
              </div>
            )}

            {/* RATING */}
            {tab==="therapists"&&showRating&&(
              <div style={{padding:28,textAlign:"center",animation:"fadeUp 0.4s ease"}}>
                <div style={{fontSize:60,marginBottom:14}}>🌟</div>
                <div style={{fontFamily:"'Lora',serif",fontSize:22,fontWeight:600,color:T.dark,marginBottom:7}}>Session Complete!</div>
                <div style={{fontSize:13,color:T.sub,marginBottom:22,lineHeight:1.8}}>Duration: {Math.ceil(sessElapsed/60)} min<br/>How was your session with {selDoc?.name}?</div>
                <div style={{display:"flex",justifyContent:"center",gap:11,marginBottom:26}}>
                  {[1,2,3,4,5].map(s=><button key={s} onClick={()=>setSessRating(s)} style={{background:"none",border:"none",fontSize:30,cursor:"pointer",opacity:s<=sessRating?1:0.3,transform:s<=sessRating?"scale(1.1)":"scale(1)",transition:"all 0.2s"}}>⭐</button>)}
                </div>
                <Btn full onClick={()=>{setShowRating(false);setSelDoc(null);setSessMode(null);nav("home");}}>Done ✓</Btn>
              </div>
            )}

            {/* ── JOURNAL ── */}
            {tab==="journal"&&(
              <div style={{animation:"fadeUp 0.3s ease"}}>
                <div style={{background:T.gd,padding:"26px 18px 18px",borderRadius:"0 0 22px 22px"}}>
                  <div style={{fontFamily:"'Lora',serif",fontSize:22,color:"#fff",fontWeight:600,marginBottom:3}}>My Journal 📓</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>AI-powered · Private · Encrypted</div>
                </div>
                <div style={{padding:"13px 14px"}}>
                  {!writing?(
                    <>
                      <button onClick={()=>setWriting(true)} style={{width:"100%",padding:14,borderRadius:14,border:`2px dashed ${T.lav}`,background:"#EDE5FF",color:T.lav,fontSize:13,fontWeight:800,cursor:"pointer",marginBottom:13,display:"flex",alignItems:"center",justifyContent:"center",gap:7,fontFamily:"'Nunito',sans-serif"}}>
                        ✏️ Write Today's Entry
                      </button>
                      <Card style={{marginBottom:13,background:"linear-gradient(135deg,#9B7FD422,#5B8DEF11)"}}>
                        <div style={{fontSize:10,letterSpacing:2,color:T.lav,textTransform:"uppercase",fontWeight:800,marginBottom:7}}>Today's Prompt ✨</div>
                        <div style={{fontSize:14,fontWeight:700,color:T.dark,fontFamily:"'Lora',serif",fontStyle:"italic",marginBottom:9}}>"{prompts[new Date().getDay()%prompts.length]}"</div>
                        <Btn sm onClick={()=>setWriting(true)}>Respond →</Btn>
                      </Card>
                      {entries.length===0?<div style={{textAlign:"center",padding:36,color:T.sub}}><div style={{fontSize:44,marginBottom:10}}>✏️</div><div style={{fontSize:13}}>Your journal is empty — begin your story</div></div>
                      :entries.map(e=>(
                        <Card key={e.id} style={{marginBottom:11}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                            <div style={{fontSize:10,color:T.sub}}>{e.date} · {e.time}</div>
                            <div style={{fontSize:20}}>{MOODS[e.mood]}</div>
                          </div>
                          <div style={{height:3,borderRadius:2,background:MOODC[e.mood],marginBottom:9}}/>
                          <div style={{fontSize:13,color:T.text,lineHeight:1.75}}>{e.text}</div>
                        </Card>
                      ))}
                    </>
                  ):(
                    <Card>
                      <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:13}}>How are you feeling?</div>
                      <div style={{display:"flex",justifyContent:"space-around",marginBottom:17}}>
                        {MOODS.map((m,i)=><button key={i} onClick={()=>setJMood(i)} style={{background:"none",border:"none",fontSize:28,cursor:"pointer",opacity:jMood===i?1:0.3,transform:jMood===i?"scale(1.3)":"scale(1)",transition:"all 0.2s"}}>{m}</button>)}
                      </div>
                      <textarea value={jText} onChange={e=>setJText(e.target.value)} placeholder="Write freely — no judgement, just you..."
                        style={{width:"100%",height:170,padding:13,borderRadius:13,border:`1px solid #E8E0F5`,background:T.bg,fontSize:13,lineHeight:1.75,color:T.text,outline:"none"}}/>
                      <div style={{display:"flex",gap:9,marginTop:13}}>
                        <button onClick={()=>setWriting(false)} style={{flex:1,padding:11,borderRadius:12,border:`2px solid #E8E0F5`,background:"none",color:T.sub,fontSize:13,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Cancel</button>
                        <Btn style={{flex:2,padding:11}} onClick={saveJournal} full>Save ✓</Btn>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* ── WALLET ── */}
            {tab==="wallet"&&(
              <div style={{animation:"fadeUp 0.3s ease"}}>
                <div style={{background:"linear-gradient(135deg,#1A1035,#3D2070)",padding:"32px 20px 26px",borderRadius:"0 0 22px 22px",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:-50,right:-50,width:170,height:170,borderRadius:"50%",background:"rgba(155,127,212,0.07)"}}/>
                  <div style={{fontSize:10,letterSpacing:2,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",fontWeight:800,marginBottom:6}}>MindWell Wallet</div>
                  <div style={{fontFamily:"'Lora',serif",fontSize:40,color:"#fff",fontWeight:600,marginBottom:3}}>{inr(balance)}</div>
                  <div style={{background:"rgba(155,127,212,0.2)",borderRadius:9,padding:"6px 13px",display:"inline-block"}}>
                    <span style={{fontSize:12,color:T.mint,fontWeight:700}}>⏱ {mins} session minutes</span>
                  </div>
                </div>
                <div style={{padding:16}}>
                  <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:13}}>Recharge</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:9}}>
                    {RECHARGEPLANS.map(amt=>(
                      <button key={amt} onClick={()=>openRaz(amt)} className="hvr"
                        style={{padding:"18px 10px",borderRadius:14,border:`2px solid ${amt===799?"#9B7FD4":"#E8E0F5"}`,background:amt===799?"linear-gradient(135deg,#9B7FD4,#5B8DEF)":"#fff",cursor:"pointer",textAlign:"center",position:"relative",fontFamily:"'Nunito',sans-serif"}}>
                        {amt===799&&<div style={{position:"absolute",top:-9,left:"50%",transform:"translateX(-50%)",background:T.gold,color:"#fff",fontSize:9,fontWeight:800,padding:"2px 9px",borderRadius:7,whiteSpace:"nowrap"}}>POPULAR</div>}
                        <div style={{fontWeight:900,fontSize:22,color:amt===799?"#fff":T.dark,fontFamily:"'Lora',serif"}}>{inr(amt)}</div>
                      </button>
                    ))}
                  </div>
                  <div style={{fontSize:11,color:T.sub,textAlign:"center",marginBottom:20}}>🔒 Secured by Razorpay · UPI · Cards · Net Banking · EMI</div>

                  <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:11}}>Transactions</div>
                  {txns.length===0?<div style={{textAlign:"center",padding:22,color:T.sub,fontSize:13}}>No transactions yet</div>
                  :txns.map((t,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid #E8E0F5`}}>
                      <div><div style={{fontSize:13,fontWeight:700,color:T.dark}}>{t.label}</div><div style={{fontSize:10,color:T.sub}}>{t.date}</div></div>
                      <div style={{fontWeight:800,color:t.type==="credit"?T.green:T.coral,fontSize:13}}>{t.type==="credit"?"+":"-"}{inr(t.amt)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── AI CHAT ── */}
            {tab==="ai"&&(
              <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 0px)",animation:"fadeUp 0.3s ease"}}>
                <div style={{background:T.gd,padding:"16px 16px 13px",borderRadius:"0 0 18px 18px"}}>
                  <div style={{display:"flex",gap:9,alignItems:"center"}}>
                    <div style={{width:40,height:40,borderRadius:13,background:T.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19}}>🤖</div>
                    <div><div style={{fontWeight:800,color:"#fff",fontSize:14}}>MindBot</div><div style={{fontSize:10,color:T.mint}}>● Powered by Claude AI · Always here</div></div>
                  </div>
                </div>
                <div style={{flex:1,overflowY:"auto",padding:"14px 13px",display:"flex",flexDirection:"column",gap:9}}>
                  {aiMsgs.map((m,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                      <div style={{maxWidth:"81%",padding:"11px 15px",borderRadius:19,background:m.role==="user"?T.g1:"#fff",color:m.role==="user"?"#fff":T.text,fontSize:13,lineHeight:1.65,borderBottomRightRadius:m.role==="user"?4:19,borderBottomLeftRadius:m.role==="user"?19:4,boxShadow:"0 2px 10px rgba(99,74,150,0.08)",border:m.role==="assistant"?`1px solid #E8E0F5`:"none",animation:"fadeUp 0.3s ease"}}>{m.text}</div>
                    </div>
                  ))}
                  {aiLoad&&<div style={{display:"flex",gap:4,padding:"6px 11px"}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:T.lav,animation:`bounce 0.6s infinite ${i*0.15}s`}}/>)}</div>}
                  <div ref={aiEnd}/>
                </div>
                {summary&&(
                  <div style={{margin:"0 11px 9px",background:"#E8F5E9",borderRadius:13,padding:13,border:"1px solid #A5D6A7",maxHeight:150,overflowY:"auto"}}>
                    <div style={{fontSize:9,fontWeight:800,color:"#2E7D32",marginBottom:5,textTransform:"uppercase",letterSpacing:1.5}}>✓ Practitioner Summary</div>
                    <div style={{fontSize:11,color:"#1B5E20",lineHeight:1.7,whiteSpace:"pre-line"}}>{summary}</div>
                  </div>
                )}
                <div style={{padding:"9px 11px 11px",background:"#fff",borderTop:`1px solid #E8E0F5`}}>
                  {aiMsgs.length>3&&!summary&&(
                    <button onClick={genSummary} disabled={sumLoad} style={{width:"100%",padding:"8px",borderRadius:11,border:"none",background:"#E8F5E9",color:"#2E7D32",fontSize:11,fontWeight:700,cursor:"pointer",marginBottom:7,fontFamily:"'Nunito',sans-serif"}}>
                      {sumLoad?"⏳ Generating...":"📋 Generate Practitioner Summary"}
                    </button>
                  )}
                  <div style={{display:"flex",gap:7}}>
                    <input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendAI()} placeholder="Share what's on your mind..."
                      style={{flex:1,padding:"11px 15px",borderRadius:20,border:`1px solid #E8E0F5`,background:T.bg,fontSize:13,outline:"none",color:T.text}}/>
                    <button onClick={sendAI} style={{width:42,height:42,borderRadius:"50%",border:"none",background:T.g1,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.send}</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── COMMUNITY ── */}
            {tab==="community"&&(
              <div style={{animation:"fadeUp 0.3s ease"}}>
                <div style={{background:T.gd,padding:"26px 18px 18px",borderRadius:"0 0 22px 22px"}}>
                  <div style={{fontFamily:"'Lora',serif",fontSize:22,color:"#fff",fontWeight:600,marginBottom:3}}>Community 🫂</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Share your journey · Support others</div>
                </div>
                <div style={{padding:"13px 14px"}}>
                  <Card style={{marginBottom:13}}>
                    <div style={{fontSize:13,fontWeight:700,color:T.dark,marginBottom:9}}>Share with the community</div>
                    <textarea value={newPost} onChange={e=>setNewPost(e.target.value)} placeholder="Share your experience, ask a question, or offer support to someone..."
                      style={{width:"100%",height:85,padding:11,borderRadius:11,border:`1px solid #E8E0F5`,background:T.bg,fontSize:13,outline:"none",color:T.text,lineHeight:1.6}}/>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:9}}>
                      <div style={{fontSize:10,color:T.sub}}>Posted as {userName}</div>
                      <Btn sm onClick={addPost} disabled={!newPost.trim()}>Post</Btn>
                    </div>
                  </Card>
                  {posts.map(post=>(
                    <Card key={post.id} style={{marginBottom:11}}>
                      <div style={{display:"flex",gap:9,marginBottom:9}}>
                        <div style={{width:32,height:32,borderRadius:10,background:T.g1,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:12,flexShrink:0}}>{post.author[0]}</div>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:700,fontSize:13,color:T.dark}}>{post.author}</div>
                          <div style={{fontSize:13,color:T.text,lineHeight:1.7,marginTop:3}}>{post.text}</div>
                        </div>
                        <button onClick={()=>setPosts(p=>p.map(x=>x.id===post.id?{...x,likes:x.likes+1}:x))}
                          style={{background:"none",border:"none",color:T.coral,cursor:"pointer",display:"flex",alignItems:"center",gap:3,fontSize:11,fontWeight:700,flexShrink:0}}>
                          {Ic.heart}{post.likes}
                        </button>
                      </div>
                      {post.replies.length>0&&(
                        <div style={{borderLeft:`3px solid #E8E0F5`,paddingLeft:11,marginBottom:9}}>
                          {(expanded===post.id?post.replies:post.replies.slice(0,1)).map((r,i)=>(
                            <div key={i} style={{marginBottom:7,paddingBottom:7,borderBottom:i<(expanded===post.id?post.replies:post.replies.slice(0,1)).length-1?`1px solid #F0EBF8`:"none"}}>
                              <div style={{fontWeight:700,fontSize:11,color:T.lav,marginBottom:2}}>{r.author}</div>
                              <div style={{fontSize:12,color:T.sub,lineHeight:1.6}}>{r.text}</div>
                            </div>
                          ))}
                          {post.replies.length>1&&<button onClick={()=>setExpanded(expanded===post.id?null:post.id)} style={{background:"none",border:"none",color:T.lav,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>
                            {expanded===post.id?"Show less ↑":`+${post.replies.length-1} more ↓`}
                          </button>}
                        </div>
                      )}
                      {replyTo===post.id?(
                        <div style={{display:"flex",gap:7,marginTop:7}}>
                          <input value={replyText} onChange={e=>setReplyText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addReply(post.id)} placeholder="Write a reply..."
                            style={{flex:1,padding:"8px 11px",borderRadius:11,border:`1px solid #E8E0F5`,background:T.bg,fontSize:12,outline:"none",color:T.text}}/>
                          <button onClick={()=>addReply(post.id)} style={{width:34,height:34,borderRadius:"50%",border:"none",background:T.g1,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.send}</button>
                        </div>
                      ):<button onClick={()=>setReplyTo(post.id)} style={{background:"none",border:"none",color:T.sub,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>💬 Reply</button>}
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* ── BLOG LIST ── */}
            {tab==="blog"&&!selBlog&&(
              <div style={{animation:"fadeUp 0.3s ease"}}>
                <div style={{background:T.gd,padding:"26px 18px 18px",borderRadius:"0 0 22px 22px"}}>
                  <div style={{fontFamily:"'Lora',serif",fontSize:22,color:"#fff",fontWeight:600,marginBottom:3}}>Wellness Blog 🌱</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Healing techniques from our practitioners</div>
                </div>
                <div style={{padding:"13px 14px"}}>
                  {BLOGS.map((p,i)=>(
                    <div key={p.id} className="hvr" onClick={()=>setSelBlog(p)}
                      style={{background:"#fff",borderRadius:18,padding:18,boxShadow:"0 2px 14px rgba(99,74,150,0.06)",border:`1px solid #E8E0F5`,marginBottom:11,cursor:"pointer",animation:`fadeUp 0.3s ease ${i*0.05}s both`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:11}}>
                        <div style={{fontSize:34}}>{p.emoji}</div>
                        <Badge color={p.color}>{p.tag}</Badge>
                      </div>
                      <div style={{fontFamily:"'Lora',serif",fontSize:16,fontWeight:600,color:T.dark,marginBottom:7,lineHeight:1.4}}>{p.title}</div>
                      <div style={{fontSize:12,color:T.sub,lineHeight:1.65,marginBottom:11}}>{p.body.slice(0,110)}...</div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div><div style={{fontSize:11,fontWeight:700,color:T.dark}}>{p.author}</div><div style={{fontSize:10,color:T.sub}}>{p.role}</div></div>
                        <div style={{display:"flex",gap:11,alignItems:"center"}}>
                          <button onClick={e=>{e.stopPropagation();setBlogLikes(l=>({...l,[p.id]:(l[p.id]||0)+1}));}} style={{background:"none",border:"none",color:T.coral,cursor:"pointer",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:3}}>
                            {Ic.heart}{p.likes+(blogLikes[p.id]||0)}
                          </button>
                          <span style={{color:T.lav,fontSize:11,fontWeight:700}}>Read →</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BLOG DETAIL */}
            {tab==="blog"&&selBlog&&(
              <div style={{animation:"fadeUp 0.3s ease"}}>
                <div style={{background:`linear-gradient(160deg,${selBlog.color}33,${T.bg})`,padding:"18px 18px 0"}}>
                  <button onClick={()=>setSelBlog(null)} style={{background:"none",border:"none",color:selBlog.color,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:13,fontWeight:700,marginBottom:16,fontFamily:"'Nunito',sans-serif"}}>{Ic.back} Blog</button>
                  <div style={{fontSize:50,marginBottom:13}}>{selBlog.emoji}</div>
                  <Badge color={selBlog.color}>{selBlog.tag}</Badge>
                  <div style={{fontFamily:"'Lora',serif",fontSize:21,fontWeight:600,color:T.dark,marginBottom:13,marginTop:10,lineHeight:1.4}}>{selBlog.title}</div>
                  <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:22}}>
                    <div style={{width:36,height:36,borderRadius:11,background:T.g1,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:12}}>{selBlog.author[0]}</div>
                    <div><div style={{fontWeight:700,fontSize:12,color:T.dark}}>{selBlog.author}</div><div style={{fontSize:10,color:T.sub}}>{selBlog.role}</div></div>
                  </div>
                </div>
                <div style={{padding:"0 18px 22px"}}>
                  <div style={{fontSize:14,color:T.text,lineHeight:1.9,marginBottom:22}}>{selBlog.body}</div>
                  <div style={{borderTop:`1px solid #E8E0F5`,paddingTop:18}}>
                    <div style={{fontSize:12,color:T.sub,marginBottom:12}}>Feeling overwhelmed? Our therapists are here for you.</div>
                    <Btn full onClick={()=>nav("therapists")}>Talk to a Therapist →</Btn>
                  </div>
                </div>
              </div>
            )}

            {/* ── PROFILE ── */}
            {tab==="profile"&&(
              <div style={{animation:"fadeUp 0.3s ease"}}>
                <div style={{background:T.gd,padding:"32px 18px 26px",textAlign:"center",borderRadius:"0 0 22px 22px"}}>
                  <div style={{width:72,height:72,borderRadius:22,background:T.g1,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:26,margin:"0 auto 11px"}}>{userName[0]?.toUpperCase()}</div>
                  <div style={{fontFamily:"'Lora',serif",fontSize:22,color:"#fff",fontWeight:600}}>{userName}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:2}}>Member since {user?.joinDate}</div>
                  <div style={{display:"flex",gap:22,justifyContent:"center",marginTop:14}}>
                    {[[sessions.length,"Sessions"],[mins,"Mins left"],[entries.length,"Journals"]].map(([v,l])=>(
                      <div key={l} style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:900,color:"#fff"}}>{v}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.4)"}}>{l}</div></div>
                    ))}
                  </div>
                </div>
                <div style={{padding:14}}>
                  {sessions.length>0&&<>
                    <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:11}}>Session History</div>
                    {sessions.slice(0,5).map((s,i)=>(
                      <Card key={i} style={{marginBottom:9,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div><div style={{fontWeight:700,fontSize:13,color:T.dark}}>{s.therapist}</div><div style={{fontSize:10,color:T.sub}}>{s.date} · {s.mode} · {s.duration} min</div></div>
                        <div style={{fontWeight:800,color:T.coral,fontSize:12}}>-{inr(s.cost)}</div>
                      </Card>
                    ))}
                  </>}
                  <div style={{fontSize:13,fontWeight:800,color:T.dark,marginBottom:11,marginTop:sessions.length?14:0}}>Settings</div>
                  {[["🌐","Language","English"],["💰","Wallet",inr(balance)],["🔔","Notifications","On"],["🆘","Emergency Contact","Set up"],["🔒","Privacy",""],["💬","Help & Support",""]].map((item,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid #E8E0F5`,cursor:"pointer"}}>
                      <div style={{display:"flex",gap:11,alignItems:"center"}}>
                        <div style={{width:34,height:34,borderRadius:11,background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{item[0]}</div>
                        <div style={{fontWeight:600,fontSize:13,color:T.dark}}>{item[1]}</div>
                      </div>
                      <div style={{display:"flex",gap:5,alignItems:"center",color:T.sub,fontSize:11}}>{item[2]}<span style={{fontSize:15}}>›</span></div>
                    </div>
                  ))}
                  <button onClick={logout} style={{width:"100%",marginTop:22,padding:13,borderRadius:14,border:`2px solid ${T.coral}`,background:"none",color:T.coral,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Log Out</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="bottom-nav" style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(255,255,255,0.97)",backdropFilter:"blur(16px)",borderTop:`1px solid #E8E0F5`,display:"flex",zIndex:50,padding:"7px 0 9px"}}>
        {[{id:"home",l:"Home",ic:Ic.home},{id:"therapists",l:"Therapists",ic:Ic.search},{id:"ai",l:"AI Chat",ic:Ic.ai},{id:"community",l:"Community",ic:Ic.community},{id:"profile",l:"Profile",ic:Ic.profile}].map(({id,l,ic})=>(
          <button key={id} onClick={()=>nav(id)}
            style={{flex:1,border:"none",background:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,color:tab===id?T.lav:T.sub,padding:"3px 2px",transition:"color 0.2s"}}>
            {ic}<span style={{fontSize:8,fontWeight:tab===id?900:500}}>{l}</span>
          </button>
        ))}
      </div>

      {/* RAZORPAY FALLBACK */}
      {showRaz&&razAmt&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{background:"#fff",borderRadius:"26px 26px 0 0",padding:22,width:"100%",maxWidth:480,margin:"0 auto",animation:"slideUp 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <div style={{fontWeight:900,fontSize:19,color:"#072654",letterSpacing:-1}}>razorpay</div>
                <div style={{fontSize:10,color:T.sub,marginTop:1}}>Add your Razorpay key in App.jsx → go live instantly</div>
              </div>
              <button onClick={()=>{setShowRaz(false);setRazAmt(null);}} style={{width:32,height:32,borderRadius:"50%",background:"#F5F5F5",border:"none",cursor:"pointer",fontSize:17,color:"#666"}}>×</button>
            </div>
            <div style={{background:"linear-gradient(135deg,#072654,#1a3a7a)",borderRadius:16,padding:"18px",marginBottom:16,color:"#fff",textAlign:"center"}}>
              <div style={{fontSize:10,opacity:0.6,marginBottom:3}}>MindWell Therapy Recharge</div>
              <div style={{fontSize:34,fontWeight:900}}>{inr(razAmt)}</div>
            </div>
            {[{l:"UPI / Google Pay / PhonePe",i:"📱"},{l:"Credit / Debit Card",i:"💳"},{l:"Net Banking",i:"🏦"},{l:"EMI (No Cost)",i:"📊"}].map(opt=>(
              <button key={opt.l} onClick={()=>creditWallet(razAmt)} style={{width:"100%",padding:"13px 15px",borderRadius:13,border:`1px solid #E8E0F5`,background:"#fff",display:"flex",alignItems:"center",gap:11,marginBottom:7,cursor:"pointer",fontSize:13,color:T.dark,fontFamily:"'Nunito',sans-serif",fontWeight:600}}>
                <span style={{fontSize:20}}>{opt.i}</span>{opt.l}<span style={{marginLeft:"auto",color:T.sub,fontSize:15}}>›</span>
              </button>
            ))}
            <div style={{textAlign:"center",marginTop:9,fontSize:10,color:T.sub}}>🔒 256-bit SSL · Secured by Razorpay India</div>
          </div>
        </div>
      )}

      {/* SOS */}
      {showSOS&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{background:"#fff",borderRadius:"26px 26px 0 0",padding:26,width:"100%",maxWidth:480,margin:"0 auto",animation:"slideUp 0.3s ease"}}>
            <div style={{textAlign:"center",marginBottom:22}}>
              <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B6B,#ee0979)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 11px",animation:"pulse 1.5s ease infinite"}}>🆘</div>
              <div style={{fontFamily:"'Lora',serif",fontSize:21,fontWeight:600,color:T.dark,marginBottom:4}}>You are not alone</div>
              <div style={{fontSize:13,color:T.sub,lineHeight:1.7}}>It's okay to reach out. We're here right now.</div>
            </div>
            {[{icon:"👩‍⚕️",title:"Talk to a Therapist Now",sub:"Connect instantly · Available right now",col:T.g1,action:()=>{setShowSOS(false);nav("therapists");}},{icon:"🤖",title:"Talk to MindBot AI",sub:"Anonymous support · Available 24/7",col:T.g2,action:()=>{setShowSOS(false);nav("ai");}},{icon:"📞",title:"iCall Helpline",sub:"022-25521111 · Free & confidential",col:T.g4,action:()=>setShowSOS(false)}].map(opt=>(
              <button key={opt.title} onClick={opt.action} style={{width:"100%",padding:"15px 17px",borderRadius:16,border:"none",background:opt.col,color:"#fff",marginBottom:9,display:"flex",alignItems:"center",gap:13,cursor:"pointer",textAlign:"left",fontFamily:"'Nunito',sans-serif"}}>
                <span style={{fontSize:22}}>{opt.icon}</span>
                <div><div style={{fontWeight:800,fontSize:13}}>{opt.title}</div><div style={{fontSize:10,opacity:0.8,marginTop:2}}>{opt.sub}</div></div>
              </button>
            ))}
            <button onClick={()=>setShowSOS(false)} style={{width:"100%",padding:13,borderRadius:13,border:`2px solid #E8E0F5`,background:"none",color:T.sub,fontSize:13,cursor:"pointer",fontFamily:"'Nunito',sans-serif",marginTop:3}}>I'm okay, close this</button>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS */}
      {showNotifs&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:150,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{background:"#fff",borderRadius:"26px 26px 0 0",padding:22,width:"100%",maxWidth:480,margin:"0 auto",maxHeight:"68vh",overflowY:"auto",animation:"slideUp 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <div style={{fontFamily:"'Lora',serif",fontSize:19,fontWeight:600,color:T.dark}}>Notifications</div>
              <button onClick={()=>setShowNotifs(false)} style={{background:"none",border:"none",fontSize:21,cursor:"pointer",color:T.sub}}>×</button>
            </div>
            {NOTIFS.map((n,i)=>(
              <div key={i} style={{display:"flex",gap:11,padding:"12px 0",borderBottom:`1px solid #E8E0F5`,opacity:n.read?0.6:1}}>
                <div style={{width:38,height:38,borderRadius:12,background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{n.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:12,color:T.dark,marginBottom:2}}>{n.title}</div>
                  <div style={{fontSize:11,color:T.sub,lineHeight:1.5}}>{n.body}</div>
                  <div style={{fontSize:9,color:T.sub,marginTop:3}}>{n.time}</div>
                </div>
                {!n.read&&<div style={{width:7,height:7,borderRadius:"50%",background:T.lav,marginTop:3,flexShrink:0}}/>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
