import { useState } from "react";

const practitioners = [
  {
    id: 1,
    name: "Dr. Amara Osei",
    title: "Clinical Psychologist",
    specialties: ["Anxiety", "Depression", "Trauma"],
    rating: 4.9,
    reviews: 127,
    avatar: "AO",
    color: "#C4956A",
    hourly: 85,
    weekly: 280,
    monthly: 950,
    available: true,
    bio: "10+ years helping individuals rediscover their inner strength through evidence-based therapy.",
  },
  {
    id: 2,
    name: "Marcus Lin, LPC",
    title: "Licensed Professional Counselor",
    specialties: ["Relationships", "Grief", "Life Transitions"],
    rating: 4.8,
    reviews: 94,
    avatar: "ML",
    color: "#7B9E87",
    hourly: 70,
    weekly: 230,
    monthly: 800,
    available: true,
    bio: "Compassionate guide for those navigating life's most challenging crossroads.",
  },
  {
    id: 3,
    name: "Dr. Sofia Reyes",
    title: "Psychiatrist",
    specialties: ["ADHD", "Bipolar", "Medication Management"],
    rating: 4.95,
    reviews: 213,
    avatar: "SR",
    color: "#B07BAC",
    hourly: 120,
    weekly: 390,
    monthly: 1300,
    available: false,
    bio: "Blending neuroscience and human connection to find your path to balance.",
  },
  {
    id: 4,
    name: "James Okafor, LMFT",
    title: "Marriage & Family Therapist",
    specialties: ["Couples", "Family", "Parenting"],
    rating: 4.7,
    reviews: 68,
    avatar: "JO",
    color: "#D4956A",
    hourly: 95,
    weekly: 310,
    monthly: 1050,
    available: true,
    bio: "Helping families build deeper bonds and healthier communication patterns.",
  },
];

const testimonials = [
  { name: "Priya S.", text: "Finding Dr. Amara changed everything for me. I finally feel heard.", stars: 5 },
  { name: "Tom R.", text: "Marcus helped me through my divorce with so much patience and care.", stars: 5 },
  { name: "Layla M.", text: "I was skeptical at first, but this platform made therapy feel accessible.", stars: 5 },
];

export default function MindWell() {
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedPractitioner, setSelectedPractitioner] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("hourly");
  const [filterSpecialty, setFilterSpecialty] = useState("All");
  const [bookingStep, setBookingStep] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState([
    { from: "them", text: "Hi! I'm here to help. How are you feeling today?" }
  ]);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewStars, setReviewStars] = useState(5);
  const [bookedSession, setBookedSession] = useState(null);

  const specialties = ["All", "Anxiety", "Depression", "Trauma", "Relationships", "Grief", "ADHD", "Couples", "Family"];

  const filtered = filterSpecialty === "All"
    ? practitioners
    : practitioners.filter(p => p.specialties.includes(filterSpecialty));

  const sendMessage = () => {
    if (!chatMsg.trim()) return;
    setMessages(prev => [...prev, { from: "me", text: chatMsg }]);
    setChatMsg("");
    setTimeout(() => {
      setMessages(prev => [...prev, { from: "them", text: "Thank you for sharing that. I'm here with you. 💛" }]);
    }, 1000);
  };

  const planPrice = (p) => ({
    hourly: `$${p.hourly}/hr`,
    weekly: `$${p.weekly}/wk`,
    monthly: `$${p.monthly}/mo`,
  }[selectedPlan]);

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      background: "#FDF6EE",
      minHeight: "100vh",
      color: "#3D2B1F",
      maxWidth: 420,
      margin: "0 auto",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #C4956A 0%, #D4B896 50%, #E8D5B7 100%)",
        padding: "28px 24px 20px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -30, right: -30,
          width: 120, height: 120, borderRadius: "50%",
          background: "rgba(255,255,255,0.15)"
        }} />
        <div style={{
          position: "absolute", top: 10, right: 40,
          width: 60, height: 60, borderRadius: "50%",
          background: "rgba(255,255,255,0.1)"
        }} />
        <div style={{ fontSize: 11, letterSpacing: 3, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", marginBottom: 4 }}>
          Your wellness journey
        </div>
        <div style={{ fontSize: 28, fontWeight: "bold", color: "#fff", letterSpacing: -0.5 }}>
          MindWell 🌿
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
          Real support, on your terms
        </div>
      </div>

      {/* Nav */}
      <div style={{
        display: "flex", background: "#fff",
        borderBottom: "1px solid #EDE0D4",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        {[
          { id: "browse", label: "Explore", icon: "🔍" },
          { id: "sessions", label: "Sessions", icon: "📅" },
          { id: "messages", label: "Messages", icon: "💬" },
          { id: "reviews", label: "Reviews", icon: "⭐" },
        ].map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedPractitioner(null); setBookingStep(0); }}
            style={{
              flex: 1, padding: "12px 4px", border: "none", background: "none",
              fontSize: 10, color: activeTab === tab.id ? "#C4956A" : "#9E8676",
              fontFamily: "Georgia, serif",
              borderBottom: activeTab === tab.id ? "2px solid #C4956A" : "2px solid transparent",
              cursor: "pointer", transition: "all 0.2s",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            }}>
            <span style={{ fontSize: 16 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "0 0 80px" }}>

        {/* BROWSE TAB */}
        {activeTab === "browse" && !selectedPractitioner && (
          <div>
            {/* Hero card */}
            <div style={{
              margin: "16px", background: "linear-gradient(135deg, #7B9E87, #5C7D6A)",
              borderRadius: 20, padding: "20px", color: "#fff", position: "relative", overflow: "hidden"
            }}>
              <div style={{ position: "absolute", right: -10, bottom: -10, fontSize: 70, opacity: 0.2 }}>🧠</div>
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>You deserve support.</div>
              <div style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12, lineHeight: 1.3 }}>
                Find your perfect practitioner today
              </div>
              <button style={{
                background: "#fff", color: "#5C7D6A", border: "none",
                borderRadius: 20, padding: "8px 18px", fontSize: 12,
                fontFamily: "Georgia, serif", fontWeight: "bold", cursor: "pointer"
              }}>
                Take the quiz →
              </button>
            </div>

            {/* Plan toggle */}
            <div style={{ padding: "0 16px 12px" }}>
              <div style={{ fontSize: 12, color: "#9E8676", marginBottom: 8 }}>Show pricing by:</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["hourly", "weekly", "monthly"].map(plan => (
                  <button key={plan} onClick={() => setSelectedPlan(plan)}
                    style={{
                      flex: 1, padding: "8px", border: "none",
                      borderRadius: 10, fontSize: 11,
                      fontFamily: "Georgia, serif",
                      background: selectedPlan === plan ? "#C4956A" : "#EDE0D4",
                      color: selectedPlan === plan ? "#fff" : "#9E8676",
                      cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s"
                    }}>
                    {plan}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter */}
            <div style={{ padding: "0 16px 12px", display: "flex", gap: 8, overflowX: "auto" }}>
              {specialties.map(s => (
                <button key={s} onClick={() => setFilterSpecialty(s)}
                  style={{
                    padding: "6px 14px", borderRadius: 20, border: "none",
                    background: filterSpecialty === s ? "#3D2B1F" : "#EDE0D4",
                    color: filterSpecialty === s ? "#fff" : "#9E8676",
                    fontSize: 11, fontFamily: "Georgia, serif",
                    whiteSpace: "nowrap", cursor: "pointer", transition: "all 0.2s"
                  }}>
                  {s}
                </button>
              ))}
            </div>

            {/* Practitioners */}
            <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map(p => (
                <div key={p.id} onClick={() => setSelectedPractitioner(p)}
                  style={{
                    background: "#fff", borderRadius: 18, padding: 16,
                    boxShadow: "0 2px 16px rgba(61,43,31,0.07)",
                    cursor: "pointer", transition: "transform 0.2s",
                    border: "1px solid #EDE0D4",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: "50%",
                      background: p.color, display: "flex", alignItems: "center",
                      justifyContent: "center", color: "#fff", fontWeight: "bold",
                      fontSize: 16, flexShrink: 0,
                    }}>
                      {p.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontWeight: "bold", fontSize: 15 }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: "#9E8676", marginBottom: 6 }}>{p.title}</div>
                        </div>
                        <div style={{
                          background: p.available ? "#E8F5E9" : "#FFF3E0",
                          color: p.available ? "#4CAF50" : "#FF9800",
                          fontSize: 10, padding: "3px 8px", borderRadius: 10,
                        }}>
                          {p.available ? "Available" : "Waitlist"}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                        {p.specialties.map(s => (
                          <span key={s} style={{
                            background: "#FDF6EE", color: "#C4956A",
                            fontSize: 10, padding: "2px 8px", borderRadius: 8,
                            border: "1px solid #EDE0D4"
                          }}>{s}</span>
                        ))}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 11, color: "#9E8676" }}>
                          ⭐ {p.rating} · {p.reviews} reviews
                        </div>
                        <div style={{ fontWeight: "bold", color: "#C4956A", fontSize: 14 }}>
                          {planPrice(p)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRACTITIONER DETAIL */}
        {activeTab === "browse" && selectedPractitioner && bookingStep === 0 && (
          <div>
            <button onClick={() => setSelectedPractitioner(null)}
              style={{ margin: "16px", background: "none", border: "none", color: "#C4956A", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif" }}>
              ← Back
            </button>
            <div style={{ padding: "0 16px" }}>
              <div style={{
                background: "linear-gradient(135deg, #FDF6EE, #EDE0D4)",
                borderRadius: 20, padding: 24, textAlign: "center", marginBottom: 16,
                border: "1px solid #EDE0D4",
              }}>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: selectedPractitioner.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: "bold", fontSize: 24,
                  margin: "0 auto 12px",
                }}>
                  {selectedPractitioner.avatar}
                </div>
                <div style={{ fontSize: 20, fontWeight: "bold" }}>{selectedPractitioner.name}</div>
                <div style={{ fontSize: 12, color: "#9E8676", marginBottom: 8 }}>{selectedPractitioner.title}</div>
                <div style={{ fontSize: 13, color: "#5C3D2B", lineHeight: 1.6 }}>{selectedPractitioner.bio}</div>
              </div>

              {/* Plan selection */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: "bold", marginBottom: 10, color: "#3D2B1F" }}>Choose your plan</div>
                {["hourly", "weekly", "monthly"].map(plan => (
                  <div key={plan} onClick={() => setSelectedPlan(plan)}
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "14px 16px", borderRadius: 14, marginBottom: 8,
                      border: selectedPlan === plan ? "2px solid #C4956A" : "2px solid #EDE0D4",
                      background: selectedPlan === plan ? "#FDF0E6" : "#fff",
                      cursor: "pointer", transition: "all 0.2s",
                    }}>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: 13, textTransform: "capitalize" }}>{plan}</div>
                      <div style={{ fontSize: 11, color: "#9E8676" }}>
                        {plan === "hourly" ? "Pay per session" : plan === "weekly" ? "4 sessions/month" : "Unlimited messaging + 8 sessions"}
                      </div>
                    </div>
                    <div style={{ fontWeight: "bold", color: "#C4956A", fontSize: 16 }}>
                      {planPrice(selectedPractitioner)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { setChatOpen(true); setActiveTab("messages"); }}
                  style={{
                    flex: 1, padding: "14px", borderRadius: 14, border: "2px solid #C4956A",
                    background: "none", color: "#C4956A", fontSize: 13,
                    fontFamily: "Georgia, serif", fontWeight: "bold", cursor: "pointer"
                  }}>
                  💬 Message
                </button>
                <button onClick={() => setBookingStep(1)}
                  style={{
                    flex: 2, padding: "14px", borderRadius: 14, border: "none",
                    background: "linear-gradient(135deg, #C4956A, #A67C52)",
                    color: "#fff", fontSize: 13,
                    fontFamily: "Georgia, serif", fontWeight: "bold", cursor: "pointer"
                  }}>
                  📅 Book Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BOOKING FLOW */}
        {activeTab === "browse" && selectedPractitioner && bookingStep === 1 && (
          <div style={{ padding: "16px" }}>
            <button onClick={() => setBookingStep(0)}
              style={{ background: "none", border: "none", color: "#C4956A", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif", marginBottom: 16 }}>
              ← Back
            </button>
            <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>Select a time</div>
            <div style={{ fontSize: 12, color: "#9E8676", marginBottom: 16 }}>Available slots this week</div>

            {[
              { day: "Mon, Mar 13", times: ["9:00 AM", "2:00 PM"] },
              { day: "Wed, Mar 15", times: ["11:00 AM", "4:00 PM", "6:00 PM"] },
              { day: "Fri, Mar 17", times: ["10:00 AM", "1:00 PM"] },
            ].map(slot => (
              <div key={slot.day} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "#9E8676", marginBottom: 8 }}>{slot.day}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {slot.times.map(time => (
                    <button key={time} onClick={() => {
                      setBookedSession({ practitioner: selectedPractitioner, time, day: slot.day, plan: selectedPlan });
                      setBookingStep(2);
                    }}
                      style={{
                        padding: "10px 16px", borderRadius: 12,
                        border: "2px solid #EDE0D4", background: "#fff",
                        fontSize: 12, fontFamily: "Georgia, serif",
                        color: "#3D2B1F", cursor: "pointer", transition: "all 0.2s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#C4956A"; e.currentTarget.style.background = "#FDF0E6"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#EDE0D4"; e.currentTarget.style.background = "#fff"; }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOOKING CONFIRMATION */}
        {activeTab === "browse" && selectedPractitioner && bookingStep === 2 && bookedSession && (
          <div style={{ padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🌿</div>
            <div style={{ fontSize: 22, fontWeight: "bold", marginBottom: 8 }}>You're booked!</div>
            <div style={{ fontSize: 13, color: "#9E8676", marginBottom: 24, lineHeight: 1.6 }}>
              Your session with <strong>{bookedSession.practitioner.name}</strong><br />
              {bookedSession.day} at {bookedSession.time}<br />
              Plan: <span style={{ color: "#C4956A", textTransform: "capitalize" }}>{bookedSession.plan}</span>
            </div>
            <div style={{
              background: "#FDF0E6", borderRadius: 16, padding: 16, marginBottom: 24,
              border: "1px solid #EDE0D4"
            }}>
              <div style={{ fontSize: 12, color: "#9E8676", marginBottom: 4 }}>You'll receive a confirmation at</div>
              <div style={{ fontSize: 13, fontWeight: "bold" }}>your@email.com</div>
            </div>
            <button onClick={() => { setSelectedPractitioner(null); setBookingStep(0); setActiveTab("sessions"); }}
              style={{
                width: "100%", padding: 16, borderRadius: 16, border: "none",
                background: "linear-gradient(135deg, #C4956A, #A67C52)",
                color: "#fff", fontSize: 14, fontFamily: "Georgia, serif",
                fontWeight: "bold", cursor: "pointer"
              }}>
              View My Sessions →
            </button>
          </div>
        )}

        {/* SESSIONS TAB */}
        {activeTab === "sessions" && (
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>Your Sessions</div>
            <div style={{ fontSize: 12, color: "#9E8676", marginBottom: 16 }}>Upcoming & past</div>

            {bookedSession ? (
              <div style={{
                background: "#fff", borderRadius: 18, padding: 16,
                border: "1px solid #EDE0D4", boxShadow: "0 2px 12px rgba(61,43,31,0.06)", marginBottom: 12
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ fontSize: 11, background: "#E8F5E9", color: "#4CAF50", padding: "3px 10px", borderRadius: 10 }}>Upcoming</div>
                  <div style={{ fontSize: 11, color: "#9E8676" }}>📹 Video</div>
                </div>
                <div style={{ fontWeight: "bold", fontSize: 15, marginBottom: 2 }}>{bookedSession.practitioner.name}</div>
                <div style={{ fontSize: 12, color: "#9E8676", marginBottom: 12 }}>{bookedSession.day} · {bookedSession.time}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{
                    flex: 1, padding: "10px", borderRadius: 12,
                    background: "linear-gradient(135deg, #C4956A, #A67C52)",
                    border: "none", color: "#fff", fontSize: 12,
                    fontFamily: "Georgia, serif", cursor: "pointer"
                  }}>Join Session</button>
                  <button style={{
                    flex: 1, padding: "10px", borderRadius: 12,
                    border: "2px solid #EDE0D4", background: "none",
                    color: "#9E8676", fontSize: 12, fontFamily: "Georgia, serif", cursor: "pointer"
                  }}>Reschedule</button>
                </div>
              </div>
            ) : null}

            <div style={{
              background: "#FDF6EE", borderRadius: 18, padding: 24,
              textAlign: "center", border: "2px dashed #EDE0D4"
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
              <div style={{ fontSize: 14, color: "#9E8676", marginBottom: 16 }}>
                {bookedSession ? "No other upcoming sessions" : "No sessions yet"}
              </div>
              <button onClick={() => setActiveTab("browse")}
                style={{
                  padding: "10px 24px", borderRadius: 12, border: "none",
                  background: "#C4956A", color: "#fff", fontSize: 12,
                  fontFamily: "Georgia, serif", cursor: "pointer"
                }}>
                Browse Practitioners
              </button>
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === "messages" && (
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>Messages</div>

            {!chatOpen ? (
              <div>
                {practitioners.slice(0, 2).map(p => (
                  <div key={p.id} onClick={() => setChatOpen(true)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      background: "#fff", padding: 14, borderRadius: 16,
                      marginBottom: 10, cursor: "pointer", border: "1px solid #EDE0D4"
                    }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: p.color, display: "flex", alignItems: "center",
                      justifyContent: "center", color: "#fff", fontWeight: "bold", fontSize: 14
                    }}>{p.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "bold", fontSize: 13 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#9E8676" }}>Hi! I'm here to help. How are you feeling?</div>
                    </div>
                    <div style={{ fontSize: 10, color: "#9E8676" }}>now</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                background: "#fff", borderRadius: 20, overflow: "hidden",
                border: "1px solid #EDE0D4", height: 420, display: "flex", flexDirection: "column"
              }}>
                <div style={{
                  padding: "14px 16px", background: "#FDF6EE",
                  borderBottom: "1px solid #EDE0D4", display: "flex", alignItems: "center", gap: 10
                }}>
                  <button onClick={() => setChatOpen(false)}
                    style={{ background: "none", border: "none", color: "#C4956A", cursor: "pointer", fontSize: 16 }}>←</button>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", background: "#C4956A",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: "bold", fontSize: 11
                  }}>AO</div>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: 13 }}>Dr. Amara Osei</div>
                    <div style={{ fontSize: 10, color: "#7B9E87" }}>● Online</div>
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                  {messages.map((m, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start"
                    }}>
                      <div style={{
                        maxWidth: "75%", padding: "10px 14px", borderRadius: 16,
                        background: m.from === "me" ? "linear-gradient(135deg, #C4956A, #A67C52)" : "#FDF0E6",
                        color: m.from === "me" ? "#fff" : "#3D2B1F",
                        fontSize: 12, lineHeight: 1.5,
                        borderBottomRightRadius: m.from === "me" ? 4 : 16,
                        borderBottomLeftRadius: m.from === "me" ? 16 : 4,
                      }}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: "10px 12px", borderTop: "1px solid #EDE0D4", display: "flex", gap: 8 }}>
                  <input value={chatMsg} onChange={e => setChatMsg(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    style={{
                      flex: 1, padding: "10px 14px", borderRadius: 20,
                      border: "1px solid #EDE0D4", background: "#FDF6EE",
                      fontSize: 12, fontFamily: "Georgia, serif",
                      outline: "none", color: "#3D2B1F"
                    }} />
                  <button onClick={sendMessage}
                    style={{
                      width: 38, height: 38, borderRadius: "50%", border: "none",
                      background: "#C4956A", color: "#fff", cursor: "pointer", fontSize: 16
                    }}>→</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>Community Reviews</div>
            <div style={{ fontSize: 12, color: "#9E8676", marginBottom: 16 }}>Real stories from real people</div>

            <div style={{
              background: "linear-gradient(135deg, #C4956A, #A67C52)",
              borderRadius: 20, padding: 20, color: "#fff", marginBottom: 16, textAlign: "center"
            }}>
              <div style={{ fontSize: 40, fontWeight: "bold" }}>4.87</div>
              <div style={{ fontSize: 20, marginBottom: 4 }}>⭐⭐⭐⭐⭐</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>Based on 502 reviews</div>
            </div>

            {[...testimonials, ...(reviewText ? [{ name: "You", text: reviewText, stars: reviewStars }] : [])].map((t, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 16, padding: 16, marginBottom: 10,
                border: "1px solid #EDE0D4"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontWeight: "bold", fontSize: 13 }}>{t.name}</div>
                  <div style={{ fontSize: 12 }}>{"⭐".repeat(t.stars)}</div>
                </div>
                <div style={{ fontSize: 12, color: "#5C3D2B", lineHeight: 1.6 }}>"{t.text}"</div>
              </div>
            ))}

            {!reviewModal ? (
              <button onClick={() => setReviewModal(true)}
                style={{
                  width: "100%", padding: 14, borderRadius: 16,
                  border: "2px solid #C4956A", background: "none",
                  color: "#C4956A", fontSize: 13, fontFamily: "Georgia, serif",
                  fontWeight: "bold", cursor: "pointer", marginTop: 8
                }}>
                + Leave a Review
              </button>
            ) : (
              <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #EDE0D4", marginTop: 8 }}>
                <div style={{ fontSize: 14, fontWeight: "bold", marginBottom: 12 }}>Share your experience</div>
                <div style={{ display: "flex", gap: 6, marginBottom: 14, justifyContent: "center" }}>
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={() => setReviewStars(s)}
                      style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", opacity: s <= reviewStars ? 1 : 0.3 }}>
                      ⭐
                    </button>
                  ))}
                </div>
                <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                  placeholder="How has your experience been?"
                  style={{
                    width: "100%", height: 90, padding: "10px 14px",
                    borderRadius: 12, border: "1px solid #EDE0D4",
                    background: "#FDF6EE", fontFamily: "Georgia, serif",
                    fontSize: 12, color: "#3D2B1F", resize: "none",
                    outline: "none", boxSizing: "border-box"
                  }} />
                <button onClick={() => setReviewModal(false)}
                  style={{
                    width: "100%", marginTop: 10, padding: 12, borderRadius: 12,
                    border: "none", background: "linear-gradient(135deg, #C4956A, #A67C52)",
                    color: "#fff", fontFamily: "Georgia, serif", fontSize: 13,
                    fontWeight: "bold", cursor: "pointer"
                  }}>
                  Submit Review
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 420, background: "rgba(253,246,238,0.95)",
        backdropFilter: "blur(10px)", padding: "12px 16px",
        borderTop: "1px solid #EDE0D4",
        display: activeTab === "browse" && !selectedPractitioner ? "block" : "none"
      }}>
        <div style={{ fontSize: 10, color: "#9E8676", textAlign: "center" }}>
          🔒 All sessions are private & confidential
        </div>
      </div>
    </div>
  );
}
