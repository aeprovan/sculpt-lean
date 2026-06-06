import { useState, useEffect, useRef, useCallback } from "react";

// ─── WORKOUT DATA ────────────────────────────────────────────────────────────
const workoutData = {
  weekly: [
    { day: "Monday",    focus: "Lower Body A — Glute & Hamstring",  type: "strength", emoji: "🍑" },
    { day: "Tuesday",   focus: "Upper Body A — Push & Define",      type: "strength", emoji: "💪" },
    { day: "Wednesday", focus: "Cardio — Zone 2 Burn",              type: "cardio",   emoji: "🔥" },
    { day: "Thursday",  focus: "Lower Body B — Quad & Glute",       type: "strength", emoji: "⚡" },
    { day: "Friday",    focus: "Upper Body B — Pull & Tone",        type: "strength", emoji: "🎯" },
    { day: "Saturday",  focus: "Full Body — Compound + Burn",       type: "strength", emoji: "✨" },
    { day: "Sunday",    focus: "Rest & Recover",                    type: "rest",      emoji: "☁️" },
  ],
  workouts: {
    Monday: {
      title: "Lower Body A — Glute & Hamstring",
      targetDuration: "70–80 min",
      cardioNote: null,
      goal: "Build the posterior chain — hips, glutes, and hamstrings are your recomp engine",
      sections: [
        { name: "Warm-Up", color: "#f0c27f", exercises: [
          { name: "Hip Circles",       sets: 3, reps: "10 each",    suggestedWeight: "BW",         note: "Loosen hips" },
          { name: "Glute Bridges",     sets: 3, reps: "15",         suggestedWeight: "BW",         note: "Activate glutes before lifting" },
          { name: "Banded Clamshells", sets: 3, reps: "12 each",    suggestedWeight: "Light band", note: "" },
        ]},
        { name: "Main Lifts", color: "#e8734a", exercises: [
          { name: "Barbell Hip Thrust",      sets: 4, reps: "10–12", suggestedWeight: "Moderate-Heavy", note: "THE #1 glute builder — squeeze hard at top" },
          { name: "Romanian Deadlift (RDL)", sets: 4, reps: "10–12", suggestedWeight: "Moderate",       note: "Feel the hamstring stretch — slow eccentric" },
          { name: "Sumo Squat",              sets: 4, reps: "12",    suggestedWeight: "Moderate",       note: "Wide stance targets inner thigh + glutes" },
        ]},
        { name: "Accessory", color: "#c45c8a", exercises: [
          { name: "Cable Kickbacks",      sets: 4, reps: "15 each",     suggestedWeight: "Light-Mod",   note: "Isolate glute — no hip swinging" },
          { name: "Lying Hamstring Curl", sets: 4, reps: "12–15",       suggestedWeight: "Moderate",    note: "" },
          { name: "Lateral Band Walks",   sets: 3, reps: "15 each way", suggestedWeight: "Medium band", note: "Glute med — shapes the side of the hip" },
        ]},
        { name: "Ab Circuit", color: "#7c5cbf", exercises: [
          { name: "Dead Bug",          sets: 3, reps: "10 each side", suggestedWeight: "BW",      note: "Deep core — protects lower back" },
          { name: "Hollow Hold",       sets: 3, reps: "25 sec",       suggestedWeight: "BW",      note: "Pull navel to spine the entire hold" },
          { name: "Leg Raises",        sets: 3, reps: "12–15",        suggestedWeight: "BW",      note: "Lower abs — slow and controlled" },
          { name: "Russian Twists",    sets: 3, reps: "15 each side", suggestedWeight: "8–10 lb", note: "Obliques = V-shape waist" },
        ]},
      ],
    },
    Tuesday: {
      title: "Upper Body A — Chest, Triceps & Tone",
      targetDuration: "~50 min lifting",
      cardioNote: { label: "Finish with Stairmaster or Incline Walk", detail: "15–20 min · glutes stay warm from the workout · perfect fat-burn window", emoji: "🔥" },
      goal: "Define and lean out arms and chest — light weight, high reps, constant tension. Target: 45–55 min",
      sections: [
        { name: "Warm-Up", color: "#f0c27f", exercises: [
          { name: "Band Pull-Aparts", sets: 2, reps: "15",               suggestedWeight: "Light band", note: "Opens chest, activates rear delts" },
          { name: "Arm Circles",      sets: 2, reps: "10 each direction", suggestedWeight: "BW",        note: "" },
        ]},
        { name: "Chest & Triceps — Define", color: "#e8734a", exercises: [
          { name: "Cable Chest Fly",           sets: 4, reps: "15–18", suggestedWeight: "15–25 lb each side", note: "Constant tension — best move for chest definition" },
          { name: "Tricep Rope Pushdown",      sets: 3, reps: "15–20", suggestedWeight: "20–30 lb cable",     note: "Full extension, squeeze at bottom" },
          { name: "Overhead Tricep Extension", sets: 3, reps: "15",    suggestedWeight: "15–20 lb DB",        note: "Long head of tricep — horseshoe definition on back of arm" },
          { name: "Tricep Dips",               sets: 3, reps: "12–15", suggestedWeight: "BW",                 note: "Bench dips — upright posture isolates tricep" },
        ]},
        { name: "Shoulder Maintenance", color: "#c45c8a", exercises: [
          { name: "Lateral Raises", sets: 2, reps: "15–20", suggestedWeight: "5–8 lb",   note: "Maintenance only — very light, just keeping tone" },
          { name: "Face Pulls",     sets: 2, reps: "20",    suggestedWeight: "15–20 lb", note: "Rear delt + posture — covers your rear delt work for the day" },
        ]},
        { name: "Ab Circuit", color: "#7c5cbf", exercises: [
          { name: "Plank",            sets: 3, reps: "40 sec",       suggestedWeight: "BW", note: "Full body tension — squeeze glutes too" },
          { name: "Bicycle Crunches", sets: 3, reps: "20 each side", suggestedWeight: "BW", note: "Slow and controlled" },
          { name: "Side Plank",       sets: 3, reps: "30 sec each",  suggestedWeight: "BW", note: "Obliques = waist definition" },
          { name: "Ab Wheel Rollout", sets: 3, reps: "8–12",         suggestedWeight: "BW", note: "Full core engagement" },
        ]},
      ],
    },
    Wednesday: {
      title: "Cardio — Zone 2 Burn",
      targetDuration: "40–50 min",
      cardioNote: null,
      goal: "Fat burning steady-state cardio — this is where body recomp accelerates",
      sections: [
        { name: "Cardio — Choose One", color: "#f0c27f", exercises: [
          { name: "Incline Treadmill Walk", sets: 1, reps: "40–50 min", suggestedWeight: "10–12% incline, 3.0–3.5 mph", note: "Zone 2 — you can hold a conversation but it's not easy" },
          { name: "Stairmaster",           sets: 1, reps: "30–40 min", suggestedWeight: "Moderate pace",               note: "Glutes engaged the whole time — don't lean on handles" },
          { name: "Elliptical",            sets: 1, reps: "40–50 min", suggestedWeight: "Moderate resistance",         note: "Low impact option — great for recovery days" },
        ]},
        { name: "Optional Core Finisher", color: "#7c5cbf", exercises: [
          { name: "Plank",         sets: 3, reps: "45 sec",        suggestedWeight: "BW",      note: "" },
          { name: "Leg Raises",    sets: 3, reps: "15",            suggestedWeight: "BW",      note: "Lower abs" },
          { name: "Russian Twists", sets: 3, reps: "15 each side", suggestedWeight: "8–10 lb", note: "" },
        ]},
      ],
    },
    Thursday: {
      title: "Lower Body B — Quad & Glute",
      targetDuration: "70–80 min",
      cardioNote: null,
      goal: "Front of legs + glute tie-ins — creates that full, sculpted leg look",
      sections: [
        { name: "Warm-Up", color: "#f0c27f", exercises: [
          { name: "Leg Swings", sets: 3, reps: "10 each", suggestedWeight: "BW", note: "" },
          { name: "Air Squats", sets: 3, reps: "15",      suggestedWeight: "BW", note: "" },
        ]},
        { name: "Main Lifts", color: "#e8734a", exercises: [
          { name: "Goblet Squat",          sets: 4, reps: "12–15",   suggestedWeight: "Moderate KB", note: "Quads + glutes, knees track toes" },
          { name: "Bulgarian Split Squat", sets: 4, reps: "10 each", suggestedWeight: "Moderate DB", note: "THE leg shaper — expect to feel this" },
          { name: "Leg Press",             sets: 4, reps: "15",      suggestedWeight: "Moderate",    note: "High foot placement = more glute" },
        ]},
        { name: "Accessory", color: "#c45c8a", exercises: [
          { name: "Walking Lunges",      sets: 4, reps: "12 each leg", suggestedWeight: "Light DB",  note: "Great for glute-hamstring tie-in" },
          { name: "Leg Extension",       sets: 3, reps: "15–20",       suggestedWeight: "Light-Mod", note: "Quad definition finisher" },
          { name: "Single-Leg Deadlift", sets: 3, reps: "10 each",     suggestedWeight: "Light DB",  note: "Balance + hamstring shape" },
        ]},
        { name: "Ab Circuit", color: "#7c5cbf", exercises: [
          { name: "Ab Wheel Rollout",  sets: 3, reps: "8–12",         suggestedWeight: "BW",      note: "Full core engagement" },
          { name: "Mountain Climbers", sets: 3, reps: "20 each side",  suggestedWeight: "BW",      note: "Cardio + core combo" },
          { name: "Hollow Hold",       sets: 3, reps: "25 sec",        suggestedWeight: "BW",      note: "Pull navel to spine" },
          { name: "Oblique Crunch",    sets: 3, reps: "15 each side",  suggestedWeight: "BW",      note: "Waist cinching — slow and squeeze" },
        ]},
      ],
    },
    Friday: {
      title: "Upper Body B — Back & Arms Tone",
      targetDuration: "~50 min lifting",
      cardioNote: { label: "Finish with Stairmaster or Incline Walk", detail: "15–20 min · post-lift is prime fat-burn time · keep it Zone 2", emoji: "🔥" },
      goal: "Lean out the back and arms — cable tension, high reps, sculpt without adding size",
      sections: [
        { name: "Warm-Up", color: "#f0c27f", exercises: [
          { name: "Band Pull-Aparts",  sets: 3, reps: "15",               suggestedWeight: "Light band", note: "Non-negotiable — shoulder health and rear delt activation" },
          { name: "Scapular Circles",  sets: 2, reps: "10 each direction", suggestedWeight: "BW",        note: "Roll shoulders back and down — wake up the lats" },
        ]},
        { name: "Back — Define & Lean", color: "#c45c8a", exercises: [
          { name: "Cable Straight-Arm Pulldown", sets: 4, reps: "15–18", suggestedWeight: "25–35 lb",  note: "Arms straight, pull bar to hips — pure lat isolation, no shoulder load" },
          { name: "Single-Arm Cable Row",        sets: 4, reps: "15 each", suggestedWeight: "25–35 lb", note: "Full rotation at the top — hits the mid-back and rear delt deeply" },
          { name: "Inverted Row",                sets: 3, reps: "12–15", suggestedWeight: "BW",         note: "Bar at hip height — bodyweight, full back engagement" },
          { name: "Seated Cable Row",            sets: 3, reps: "15",    suggestedWeight: "35–45 lb",   note: "Lighter than usual — squeeze and hold 1 sec at the top" },
          { name: "Rear Delt Fly (Cable)",       sets: 3, reps: "15–20", suggestedWeight: "8–12 lb",    note: "Cross cables, pull apart — defines back of shoulder without adding size" },
        ]},
        { name: "Arms — Lean & Toned", color: "#e8734a", exercises: [
          { name: "Cable Bicep Curl",            sets: 4, reps: "15–20", suggestedWeight: "15–20 lb cable", note: "Cable keeps tension at the top — more definition than dumbbells" },
          { name: "Hammer Curl",                 sets: 3, reps: "15",    suggestedWeight: "10–12 lb",        note: "Hits the brachialis — creates that full, defined arm shape" },
          { name: "Tricep Rope Pushdown",        sets: 4, reps: "15–20", suggestedWeight: "20–25 lb cable",  note: "3-sec lower — slow eccentric is where toning happens" },
          { name: "Diamond Push-Up",             sets: 3, reps: "10–15", suggestedWeight: "BW",              note: "Hands form a diamond — tricep and chest without shoulder load" },
        ]},
        { name: "Ab Circuit", color: "#7c5cbf", exercises: [
          { name: "Plank to Down Dog",  sets: 3, reps: "10",           suggestedWeight: "BW",      note: "Core + shoulder stability" },
          { name: "Bicycle Crunches",   sets: 3, reps: "20 each side", suggestedWeight: "BW",      note: "Slow and deliberate" },
          { name: "Flutter Kicks",      sets: 3, reps: "30 sec",       suggestedWeight: "BW",      note: "Lower abs — keep lower back pressed to floor" },
          { name: "Side Plank",         sets: 3, reps: "30 sec each",  suggestedWeight: "BW",      note: "Obliques = waist definition" },
        ]},
      ],
    },
    Saturday: {
      title: "Full Body — Compound + Burn",
      targetDuration: "~55 min + cardio",
      cardioNote: { label: "Stairmaster or Incline Walk after lifting", detail: "15–20 min · cardio is already built into Saturday — don't skip it", emoji: "✨" },
      goal: "Hit everything, elevate heart rate, maximize weekly calorie burn",
      sections: [
        { name: "Full Body Compound Circuit", color: "#e8734a", exercises: [
          { name: "Dumbbell Deadlift",           sets: 4, reps: "12",      suggestedWeight: "Moderate",    note: "Full posterior chain — hinge at hips" },
          { name: "Goblet Squat",                sets: 4, reps: "12",      suggestedWeight: "Moderate KB", note: "Squat deep — chest tall" },
          { name: "Dumbbell Row",                sets: 4, reps: "12 each", suggestedWeight: "Moderate",    note: "Elbow drives back — squeeze at top" },
          { name: "Push-Up",                     sets: 4, reps: "12–15",   suggestedWeight: "BW",          note: "Elevated if needed — full range of motion" },
          { name: "Reverse Lunge to Knee Drive", sets: 3, reps: "10 each", suggestedWeight: "BW/Light DB", note: "Explosive — drive knee up at the top" },
          { name: "Rear Delt Fly",               sets: 3, reps: "15–20",   suggestedWeight: "8–10 lb",     note: "Defines back of shoulder — no size, all tone" },
        ]},
        { name: "Cardio Finisher", color: "#f0c27f", exercises: [
          { name: "Stairmaster",        sets: 1, reps: "15–20 min", suggestedWeight: "Moderate pace",         note: "Post-lift — body is already in fat-burn mode" },
          { name: "Incline Walk (alt)", sets: 1, reps: "20–25 min", suggestedWeight: "10% incline, 3.5 mph", note: "Lower impact option after a heavy lift" },
        ]},
        { name: "Ab Circuit", color: "#7c5cbf", exercises: [
          { name: "Plank",             sets: 3, reps: "45 sec",       suggestedWeight: "BW",      note: "Squeeze everything — glutes, core, quads" },
          { name: "Russian Twists",    sets: 3, reps: "15 each side", suggestedWeight: "8–10 lb", note: "V-shape waist" },
          { name: "Leg Raises",        sets: 3, reps: "15",           suggestedWeight: "BW",      note: "Lower abs — no swinging" },
          { name: "Hollow Hold",       sets: 3, reps: "25 sec",       suggestedWeight: "BW",      note: "Full body tension — finish strong" },
        ]},
      ],
    },
  },
};

const tips = [
  { icon: "🥩", title: "Protein is Non-Negotiable", body: "Aim for ~120–135g protein daily. This is what preserves muscle while you lose fat. Prioritize chicken, eggs, Greek yogurt, fish, cottage cheese." },
  { icon: "📈", title: "Progressive Overload",      body: "Every 2 weeks, add 5 lbs or 1 rep. Muscle is what makes you look 'toned' — you have to challenge it to keep it." },
  { icon: "🚶‍♀️", title: "Cardio Sweet Spot",       body: "3–4x/week of Zone 2 cardio (incline walk or stairmaster) is ideal. Too much cardio can eat muscle. Keep sessions 30–45 min." },
  { icon: "⚖️", title: "Slight Calorie Deficit",   body: "~200–300 cal deficit is enough. Too aggressive and you'll lose muscle. Recomp is slow — trust the process." },
  { icon: "😴", title: "Sleep = Fat Loss",          body: "7–9 hours. Growth hormone (released during sleep) drives fat loss and muscle repair. This is not optional." },
  { icon: "💧", title: "Hydration",                 body: "Half your bodyweight in oz daily (~72 oz). Dehydration tanks performance and makes you look flat." },
];

const REST_PRESETS = [30, 60, 90, 120];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function loadPhotos() {
  try { return JSON.parse(localStorage.getItem("recomp_photos") || "[]"); } catch { return []; }
}
function savePhotos(arr) {
  localStorage.setItem("recomp_photos", JSON.stringify(arr));
}

// ─── REST TIMER ──────────────────────────────────────────────────────────────
function RestTimer({ onClose }) {
  const [selected, setSelected] = useState(60);
  const [timeLeft, setTimeLeft] = useState(null);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const start = useCallback((sec) => { clearInterval(intervalRef.current); setTimeLeft(sec); setRunning(true); }, []);
  useEffect(() => {
    if (!running || timeLeft === null) return;
    if (timeLeft <= 0) { setRunning(false); return; }
    intervalRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, timeLeft]);
  const r = 42, circ = 2 * Math.PI * r;
  const done = timeLeft === 0;
  const progress = timeLeft !== null ? timeLeft / selected : 1;
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(13,13,15,0.93)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#161618", borderRadius: 24, padding: "32px 28px", width: 300, border: "1px solid rgba(242,237,232,0.1)", textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c45c8a", fontFamily: "sans-serif", marginBottom: 20 }}>Rest Timer</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24 }}>
          {REST_PRESETS.map(s => (
            <button key={s} onClick={() => { setSelected(s); setTimeLeft(null); setRunning(false); clearInterval(intervalRef.current); }}
              style={{ padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontFamily: "sans-serif", fontSize: 12, background: selected === s ? "#e8734a" : "rgba(242,237,232,0.08)", color: selected === s ? "#0d0d0f" : "rgba(242,237,232,0.6)", fontWeight: selected === s ? "bold" : "normal" }}>
              {s}s
            </button>
          ))}
        </div>
        <div style={{ position: "relative", width: 110, height: 110, margin: "0 auto 24px" }}>
          <svg width="110" height="110" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(242,237,232,0.08)" strokeWidth="6" />
            <circle cx="55" cy="55" r={r} fill="none" stroke={done ? "#7cbf8a" : "#e8734a"} strokeWidth="6"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - (running || done ? progress : 1))}
              strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s linear, stroke 0.3s" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 26, color: done ? "#7cbf8a" : "#f2ede8" }}>{done ? "✓" : timeLeft !== null ? fmt(timeLeft) : fmt(selected)}</div>
            {done && <div style={{ fontSize: 11, color: "#7cbf8a", fontFamily: "sans-serif" }}>Done!</div>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 16 }}>
          <button onClick={() => start(selected)} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", cursor: "pointer", background: "#e8734a", color: "#0d0d0f", fontFamily: "sans-serif", fontSize: 14, fontWeight: "bold" }}>
            {running ? "Restart" : "Start"}
          </button>
          {running && (
            <button onClick={() => { setRunning(false); clearInterval(intervalRef.current); }} style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(242,237,232,0.15)", background: "transparent", color: "rgba(242,237,232,0.6)", cursor: "pointer", fontFamily: "sans-serif", fontSize: 14 }}>
              Pause
            </button>
          )}
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(242,237,232,0.3)", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>Close</button>
      </div>
    </div>
  );
}

// ─── EXERCISE CARD ────────────────────────────────────────────────────────────
function ExerciseCard({ ex, exKey, sectionColor, onTimerOpen }) {
  const storageKey = `recomp_${exKey}`;
  const [expanded, setExpanded] = useState(false);
  const [completedSets, setCompletedSets] = useState(() => { try { return JSON.parse(localStorage.getItem(storageKey + "_sets")) || []; } catch { return []; } });
  const [totalSets, setTotalSets] = useState(() => { const s = localStorage.getItem(storageKey + "_total"); return s ? parseInt(s) : ex.sets; });
  const [note, setNote] = useState(() => localStorage.getItem(storageKey + "_note") || "");
  const [noteDraft, setNoteDraft] = useState("");
  const [editingNote, setEditingNote] = useState(false);
  const allDone = completedSets.length >= totalSets;

  const toggleSet = (i) => {
    const next = completedSets.includes(i) ? completedSets.filter(x => x !== i) : [...completedSets, i];
    setCompletedSets(next);
    localStorage.setItem(storageKey + "_sets", JSON.stringify(next));
    if (!completedSets.includes(i)) onTimerOpen();
  };

  const adjustSets = (delta) => {
    const next = Math.max(1, Math.min(8, totalSets + delta));
    setTotalSets(next);
    localStorage.setItem(storageKey + "_total", String(next));
    // remove completed markers beyond new total
    if (delta < 0) {
      const pruned = completedSets.filter(i => i < next);
      setCompletedSets(pruned);
      localStorage.setItem(storageKey + "_sets", JSON.stringify(pruned));
    }
  };

  const saveNote = () => {
    const saved = noteDraft.trim();
    const full = saved ? `[${new Date().toLocaleDateString()}] ${saved}` : "";
    const prev = note ? note + "\n" + full : full;
    const trimmed = prev.trim();
    setNote(trimmed);
    localStorage.setItem(storageKey + "_note", trimmed);
    setNoteDraft(""); setEditingNote(false);
  };
  return (
    <div style={{ marginBottom: 10, borderRadius: 14, background: allDone ? `${sectionColor}12` : "rgba(242,237,232,0.04)", border: `1px solid ${allDone ? sectionColor + "40" : "rgba(242,237,232,0.09)"}`, overflow: "hidden", transition: "all 0.25s" }}>
      <div onClick={() => setExpanded(e => !e)} style={{ padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, color: allDone ? "rgba(242,237,232,0.45)" : "#f2ede8", textDecoration: allDone ? "line-through" : "none", marginBottom: 4 }}>{ex.name}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontFamily: "sans-serif", color: sectionColor, background: sectionColor + "20", padding: "2px 8px", borderRadius: 20 }}>{totalSets} sets × {ex.reps}{totalSets !== ex.sets ? " ✎" : ""}</span>
            <span style={{ fontSize: 11, fontFamily: "sans-serif", color: "rgba(242,237,232,0.35)" }}>{ex.suggestedWeight}</span>
          </div>
          {ex.note && <div style={{ fontSize: 12, color: "rgba(242,237,232,0.3)", fontFamily: "sans-serif", marginTop: 5, fontStyle: "italic" }}>{ex.note}</div>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {note && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#c45c8a" }} />}
          <div style={{ color: "rgba(242,237,232,0.25)", fontSize: 16, transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>›</div>
        </div>
      </div>
      {expanded && (
        <div style={{ padding: "0 16px 16px" }}>
          {/* Set count adjuster */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(242,237,232,0.3)", fontFamily: "sans-serif" }}>Tap set to complete · timer auto-starts</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button onClick={(e) => { e.stopPropagation(); adjustSets(-1); }}
                disabled={totalSets <= 1}
                style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(242,237,232,0.15)", background: "transparent", color: totalSets <= 1 ? "rgba(242,237,232,0.15)" : "rgba(242,237,232,0.5)", cursor: totalSets <= 1 ? "default" : "pointer", fontSize: 16, lineHeight: 1, fontFamily: "sans-serif" }}>−</button>
              <span style={{ fontSize: 12, fontFamily: "sans-serif", color: "rgba(242,237,232,0.4)", minWidth: 20, textAlign: "center" }}>{totalSets}</span>
              <button onClick={(e) => { e.stopPropagation(); adjustSets(1); }}
                disabled={totalSets >= 8}
                style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(242,237,232,0.15)", background: "transparent", color: totalSets >= 8 ? "rgba(242,237,232,0.15)" : "rgba(242,237,232,0.5)", cursor: totalSets >= 8 ? "default" : "pointer", fontSize: 16, lineHeight: 1, fontFamily: "sans-serif" }}>+</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {Array.from({ length: totalSets }).map((_, i) => {
              const done = completedSets.includes(i);
              return (
                <button key={i} onClick={() => toggleSet(i)} style={{ width: 44, height: 44, borderRadius: 10, border: "none", cursor: "pointer", background: done ? sectionColor : "rgba(242,237,232,0.08)", color: done ? "#0d0d0f" : "rgba(242,237,232,0.5)", fontSize: done ? 16 : 14, fontFamily: "sans-serif", fontWeight: "bold", transition: "all 0.18s" }}>
                  {done ? "✓" : i + 1}
                </button>
              );
            })}
            <button onClick={onTimerOpen} style={{ width: 44, height: 44, borderRadius: 10, border: "1px dashed rgba(242,237,232,0.15)", background: "transparent", cursor: "pointer", fontSize: 18, color: "rgba(242,237,232,0.3)" }}>⏱</button>
          </div>
          <div style={{ borderTop: "1px solid rgba(242,237,232,0.07)", paddingTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(242,237,232,0.3)", fontFamily: "sans-serif" }}>Progress Notes</div>
              {note && <button onClick={() => { setNote(""); localStorage.removeItem(storageKey + "_note"); }} style={{ background: "none", border: "none", color: "rgba(242,237,232,0.2)", fontSize: 11, fontFamily: "sans-serif", cursor: "pointer" }}>Clear</button>}
            </div>
            {note && <div style={{ background: "rgba(196,92,138,0.08)", borderRadius: 10, padding: "10px 12px", marginBottom: 10, fontSize: 12, fontFamily: "sans-serif", color: "rgba(242,237,232,0.55)", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{note}</div>}
            {editingNote ? (
              <div>
                <textarea autoFocus value={noteDraft} onChange={e => setNoteDraft(e.target.value)}
                  placeholder={`e.g. "95 lbs × 10 — felt strong"`}
                  style={{ width: "100%", boxSizing: "border-box", background: "rgba(242,237,232,0.06)", border: "1px solid rgba(242,237,232,0.15)", borderRadius: 10, padding: "10px 12px", color: "#f2ede8", fontFamily: "sans-serif", fontSize: 13, resize: "none", outline: "none", lineHeight: 1.5, minHeight: 72 }} />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={saveNote} style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: "none", cursor: "pointer", background: sectionColor, color: "#0d0d0f", fontFamily: "sans-serif", fontSize: 13, fontWeight: "bold" }}>Save</button>
                  <button onClick={() => { setEditingNote(false); setNoteDraft(""); }} style={{ padding: "9px 14px", borderRadius: 10, border: "1px solid rgba(242,237,232,0.12)", background: "transparent", color: "rgba(242,237,232,0.4)", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setEditingNote(true)} style={{ width: "100%", padding: "9px 0", borderRadius: 10, border: "1px dashed rgba(242,237,232,0.15)", background: "transparent", color: "rgba(242,237,232,0.35)", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>
                + Add weight / reps note
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PHOTO LIGHTBOX ───────────────────────────────────────────────────────────
function PhotoLightbox({ photo, onClose, onDelete }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(13,13,15,0.97)", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ maxWidth: 400, width: "100%" }}>
        <img src={photo.dataUrl} alt="" style={{ width: "100%", borderRadius: 16, objectFit: "contain", maxHeight: "65vh" }} />
        <div style={{ marginTop: 14, textAlign: "center" }}>
          <div style={{ fontSize: 15, color: "#f2ede8", marginBottom: 4 }}>{photo.label}</div>
          <div style={{ fontSize: 12, color: "rgba(242,237,232,0.4)", fontFamily: "sans-serif", marginBottom: 6 }}>{photo.date}</div>
          {photo.caption && <div style={{ fontSize: 13, color: "rgba(242,237,232,0.5)", fontFamily: "sans-serif", fontStyle: "italic", marginBottom: 16 }}>{photo.caption}</div>}
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button onClick={onDelete} style={{ padding: "10px 20px", borderRadius: 12, border: "1px solid rgba(232,80,80,0.3)", background: "rgba(232,80,80,0.1)", color: "#e85050", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>Delete</button>
            <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 12, border: "1px solid rgba(242,237,232,0.15)", background: "transparent", color: "rgba(242,237,232,0.5)", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROGRESS PHOTOS TAB ──────────────────────────────────────────────────────
function PhotosTab() {
  const [photos, setPhotos] = useState(loadPhotos);
  const [lightbox, setLightbox] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [filterDay, setFilterDay] = useState("All");
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileRef = useRef();

  const dayOptions = ["All", ...workoutData.weekly.map(d => d.day)];

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target.result);
    reader.readAsDataURL(file);
    setUploading(true);
  };

  const handleSave = () => {
    if (!previewUrl) return;
    const newPhoto = {
      id: Date.now(),
      dataUrl: previewUrl,
      label: selectedDay,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      caption: caption.trim(),
    };
    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    savePhotos(updated);
    setPreviewUrl(null);
    setCaption("");
    setUploading(false);
    fileRef.current.value = "";
  };

  const handleCancel = () => {
    setPreviewUrl(null); setCaption(""); setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDelete = (id) => {
    const updated = photos.filter(p => p.id !== id);
    setPhotos(updated);
    savePhotos(updated);
    setLightbox(null);
  };

  const filtered = filterDay === "All" ? photos : photos.filter(p => p.label === filterDay);

  // Group by month for timeline
  const grouped = filtered.reduce((acc, p) => {
    const month = p.date.split(" ").slice(0, 2).join(" "); // "Jun 2025"
    if (!acc[month]) acc[month] = [];
    acc[month].push(p);
    return acc;
  }, {});

  const typeColors = { Monday: "#e8734a", Tuesday: "#f0c27f", Wednesday: "#c45c8a", Thursday: "#7cbf8a", Friday: "#e8734a", Saturday: "#7c5cbf", Sunday: "#8899aa" };

  return (
    <div style={{ padding: "24px 16px" }}>
      {lightbox && (
        <PhotoLightbox
          photo={lightbox}
          onClose={() => setLightbox(null)}
          onDelete={() => handleDelete(lightbox.id)}
        />
      )}

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: "normal", margin: "0 0 6px" }}>Progress Photos</h2>
        <p style={{ fontSize: 13, color: "rgba(242,237,232,0.4)", fontFamily: "sans-serif", margin: 0, lineHeight: 1.5 }}>
          Document your transformation. Consistency compounds — trust what you can't see yet.
        </p>
      </div>

      {/* Upload area */}
      {!uploading ? (
        <div onClick={() => fileRef.current.click()}
          style={{
            border: "1.5px dashed rgba(196,92,138,0.35)", borderRadius: 16, padding: "28px 20px",
            textAlign: "center", cursor: "pointer", marginBottom: 20,
            background: "rgba(196,92,138,0.05)", transition: "all 0.2s",
          }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
          <div style={{ fontSize: 15, color: "#f2ede8", marginBottom: 4 }}>Add progress photo</div>
          <div style={{ fontSize: 12, color: "rgba(242,237,232,0.35)", fontFamily: "sans-serif" }}>Tap to choose from camera roll</div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
        </div>
      ) : (
        <div style={{ marginBottom: 20, background: "rgba(242,237,232,0.04)", borderRadius: 16, padding: 16, border: "1px solid rgba(242,237,232,0.1)" }}>
          {previewUrl && (
            <img src={previewUrl} alt="preview" style={{ width: "100%", borderRadius: 12, objectFit: "cover", maxHeight: 240, marginBottom: 14 }} />
          )}

          {/* Day tag */}
          <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(242,237,232,0.4)", fontFamily: "sans-serif", marginBottom: 8 }}>Tag workout day</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {workoutData.weekly.filter(d => d.type !== "rest").map(d => (
              <button key={d.day} onClick={() => setSelectedDay(d.day)} style={{
                padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer",
                fontFamily: "sans-serif", fontSize: 12,
                background: selectedDay === d.day ? (typeColors[d.day] || "#e8734a") : "rgba(242,237,232,0.08)",
                color: selectedDay === d.day ? "#0d0d0f" : "rgba(242,237,232,0.55)",
                fontWeight: selectedDay === d.day ? "bold" : "normal",
              }}>
                {d.day}
              </button>
            ))}
          </div>

          {/* Caption */}
          <input
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Add a note (optional) — e.g. 'Week 3, feeling leaner'"
            style={{
              width: "100%", boxSizing: "border-box",
              background: "rgba(242,237,232,0.06)", border: "1px solid rgba(242,237,232,0.12)",
              borderRadius: 10, padding: "10px 12px", color: "#f2ede8",
              fontFamily: "sans-serif", fontSize: 13, outline: "none",
            }}
          />

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button onClick={handleSave} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", cursor: "pointer", background: "#c45c8a", color: "#fff", fontFamily: "sans-serif", fontSize: 14, fontWeight: "bold" }}>
              Save Photo
            </button>
            <button onClick={handleCancel} style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(242,237,232,0.12)", background: "transparent", color: "rgba(242,237,232,0.4)", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter row */}
      {photos.length > 0 && (
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 20, scrollbarWidth: "none" }}>
          {dayOptions.map(d => (
            <button key={d} onClick={() => setFilterDay(d)} style={{
              padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer",
              fontFamily: "sans-serif", fontSize: 12, whiteSpace: "nowrap", flexShrink: 0,
              background: filterDay === d ? "#e8734a" : "rgba(242,237,232,0.08)",
              color: filterDay === d ? "#0d0d0f" : "rgba(242,237,232,0.5)",
              fontWeight: filterDay === d ? "bold" : "normal",
            }}>
              {d}
            </button>
          ))}
        </div>
      )}

      {/* Photo grid / timeline */}
      {photos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(242,237,232,0.2)", fontFamily: "sans-serif", fontSize: 14 }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🌱</div>
          Your journey starts with the first photo.<br />No comparison needed — just consistency.
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px 0", color: "rgba(242,237,232,0.25)", fontFamily: "sans-serif", fontSize: 13 }}>No photos tagged for {filterDay} yet.</div>
      ) : (
        Object.entries(grouped).map(([month, monthPhotos]) => (
          <div key={month} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(242,237,232,0.3)", fontFamily: "sans-serif", marginBottom: 12, paddingLeft: 2 }}>
              {month} · {monthPhotos.length} photo{monthPhotos.length !== 1 ? "s" : ""}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              {monthPhotos.map(photo => (
                <div key={photo.id} onClick={() => setLightbox(photo)}
                  style={{ borderRadius: 12, overflow: "hidden", cursor: "pointer", position: "relative", aspectRatio: "3/4", background: "rgba(242,237,232,0.04)" }}>
                  <img src={photo.dataUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    background: "linear-gradient(transparent, rgba(13,13,15,0.85))",
                    padding: "20px 10px 10px",
                  }}>
                    <div style={{ fontSize: 11, fontFamily: "sans-serif", fontWeight: "bold", color: typeColors[photo.label] || "#e8734a" }}>{photo.label}</div>
                    <div style={{ fontSize: 11, fontFamily: "sans-serif", color: "rgba(242,237,232,0.5)" }}>{photo.date}</div>
                    {photo.caption && <div style={{ fontSize: 11, fontFamily: "sans-serif", color: "rgba(242,237,232,0.4)", fontStyle: "italic", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{photo.caption}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Stats strip */}
      {photos.length > 0 && (
        <div style={{ marginTop: 8, padding: "16px 18px", background: "rgba(196,92,138,0.08)", borderRadius: 14, border: "1px solid rgba(196,92,138,0.2)" }}>
          <div style={{ display: "flex" }}>
            {[
              { label: "Total Photos", val: photos.length },
              { label: "Days Tracked", val: [...new Set(photos.map(p => p.date))].length },
              { label: "Most Recent", val: photos[0]?.label || "—" },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", borderRight: i < 2 ? "1px solid rgba(242,237,232,0.08)" : "none" }}>
                <div style={{ fontSize: i === 2 ? 13 : 18, color: "#f2ede8" }}>{s.val}</div>
                <div style={{ fontSize: 10, fontFamily: "sans-serif", color: "rgba(242,237,232,0.35)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function loadHistory() {
  try { return JSON.parse(localStorage.getItem("recomp_history") || "[]"); } catch { return []; }
}
function saveHistory(arr) { localStorage.setItem("recomp_history", JSON.stringify(arr)); }

// ─── HISTORY TAB ─────────────────────────────────────────────────────────────
function HistoryTab() {
  const [history, setHistory] = useState(loadHistory);
  const [expanded, setExpanded] = useState(null);

  const typeColors = { Monday: "#e8734a", Tuesday: "#f0c27f", Wednesday: "#c45c8a", Thursday: "#7cbf8a", Friday: "#e8734a", Saturday: "#7c5cbf", Sunday: "#8899aa" };
  const typeEmoji = { Monday: "🍑", Tuesday: "🔥", Wednesday: "💪", Thursday: "🌿", Friday: "⚡", Saturday: "✨" };

  const deleteEntry = (id) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    saveHistory(updated);
    if (expanded === id) setExpanded(null);
  };

  // Group by week (Mon–Sun)
  const grouped = history.reduce((acc, entry) => {
    const d = new Date(entry.timestamp);
    const day = d.getDay(); // 0=Sun
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((day + 6) % 7));
    const weekKey = monday.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (!acc[weekKey]) acc[weekKey] = [];
    acc[weekKey].push(entry);
    return acc;
  }, {});

  // streak calc
  const uniqueDates = [...new Set(history.map(h => new Date(h.timestamp).toDateString()))].sort((a, b) => new Date(b) - new Date(a));
  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (uniqueDates.length > 0 && (uniqueDates[0] === today || uniqueDates[0] === yesterday)) {
    let check = new Date(uniqueDates[0]);
    for (let i = 0; i < uniqueDates.length; i++) {
      if (new Date(uniqueDates[i]).toDateString() === check.toDateString()) {
        streak++;
        check.setDate(check.getDate() - 1);
      } else break;
    }
  }

  const dayCounts = history.reduce((acc, h) => { acc[h.day] = (acc[h.day] || 0) + 1; return acc; }, {});
  const mostFrequent = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div style={{ padding: "24px 16px" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: "normal", margin: "0 0 6px" }}>Workout History</h2>
        <p style={{ fontSize: 13, color: "rgba(242,237,232,0.4)", fontFamily: "sans-serif", margin: 0 }}>Every session logged. Every rep counts.</p>
      </div>

      {/* Stats strip */}
      {history.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
          {[
            { icon: "🏋️", label: "Total", val: history.length },
            { icon: "🔥", label: "Streak", val: `${streak} day${streak !== 1 ? "s" : ""}` },
            { icon: "⭐", label: "Top Day", val: mostFrequent ? mostFrequent[0].slice(0, 3) : "—" },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(242,237,232,0.04)", borderRadius: 12, padding: "12px 10px", textAlign: "center", border: "1px solid rgba(242,237,232,0.08)" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 18, color: "#f2ede8" }}>{s.val}</div>
              <div style={{ fontSize: 10, fontFamily: "sans-serif", color: "rgba(242,237,232,0.35)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Weekly heatmap bar */}
      {history.length > 0 && (
        <div style={{ background: "rgba(242,237,232,0.04)", borderRadius: 14, padding: "14px 16px", marginBottom: 20, border: "1px solid rgba(242,237,232,0.08)" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(242,237,232,0.3)", fontFamily: "sans-serif", marginBottom: 10 }}>Sessions per day</div>
          <div style={{ display: "flex", gap: 6 }}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => {
              const fullDay = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][i];
              const count = dayCounts[fullDay] || 0;
              const max = Math.max(...Object.values(dayCounts), 1);
              const intensity = count / max;
              return (
                <div key={d} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ height: 36, borderRadius: 6, background: count > 0 ? `rgba(232,115,74,${0.15 + intensity * 0.75})` : "rgba(242,237,232,0.05)", marginBottom: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {count > 0 && <span style={{ fontSize: 11, fontFamily: "sans-serif", color: "#f2ede8", fontWeight: "bold" }}>{count}</span>}
                  </div>
                  <div style={{ fontSize: 9, fontFamily: "sans-serif", color: "rgba(242,237,232,0.3)" }}>{d}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History list */}
      {history.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 0", color: "rgba(242,237,232,0.2)", fontFamily: "sans-serif", fontSize: 14, lineHeight: 1.8 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
          No workouts logged yet.<br />Complete a session and tap<br />"Mark as Complete" to start your log.
        </div>
      ) : (
        Object.entries(grouped).map(([week, entries]) => (
          <div key={week} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(242,237,232,0.3)", fontFamily: "sans-serif", marginBottom: 10, paddingLeft: 2 }}>
              Week of {week} · {entries.length} session{entries.length !== 1 ? "s" : ""}
            </div>
            {entries.map(entry => (
              <div key={entry.id} style={{ marginBottom: 10, borderRadius: 14, background: "rgba(242,237,232,0.04)", border: "1px solid rgba(242,237,232,0.09)", overflow: "hidden" }}>
                {/* Row */}
                <div onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                  style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${typeColors[entry.day] || "#e8734a"}20`, border: `1px solid ${typeColors[entry.day] || "#e8734a"}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    {typeEmoji[entry.day] || "💪"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, color: "#f2ede8", marginBottom: 2 }}>{entry.day} — {entry.title}</div>
                    <div style={{ fontSize: 11, fontFamily: "sans-serif", color: "rgba(242,237,232,0.35)" }}>
                      {entry.dateLabel} · {entry.setsCompleted} sets · {entry.duration}
                    </div>
                  </div>
                  <div style={{ fontSize: 16, color: "rgba(242,237,232,0.2)", transform: expanded === entry.id ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>›</div>
                </div>

                {/* Expanded detail */}
                {expanded === entry.id && (
                  <div style={{ padding: "0 16px 14px", borderTop: "1px solid rgba(242,237,232,0.06)" }}>
                    {entry.note && (
                      <div style={{ background: "rgba(196,92,138,0.08)", borderRadius: 10, padding: "10px 12px", margin: "12px 0 10px", fontSize: 12, fontFamily: "sans-serif", color: "rgba(242,237,232,0.5)", fontStyle: "italic", lineHeight: 1.5 }}>
                        "{entry.note}"
                      </div>
                    )}
                    <div style={{ fontSize: 12, fontFamily: "sans-serif", color: "rgba(242,237,232,0.3)", marginBottom: 10, marginTop: entry.note ? 0 : 12 }}>
                      Completed {entry.setsCompleted} of {entry.totalSets} sets
                    </div>
                    <button onClick={() => deleteEntry(entry.id)} style={{ background: "none", border: "1px solid rgba(232,80,80,0.25)", borderRadius: 8, padding: "6px 14px", color: "rgba(232,80,80,0.5)", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer" }}>
                      Delete entry
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function RecompApp() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [activeTab, setActiveTab] = useState("schedule");
  const [showTimer, setShowTimer] = useState(false);

  const typeColors = { strength: "#e8734a", cardio: "#f0c27f", recovery: "#7cbf8a", rest: "#8899aa" };
  const selectedWorkout = selectedDay ? workoutData.workouts[selectedDay] : null;

  const markComplete = (day) => {
    const workout = workoutData.workouts[day];
    if (!workout) return;
    // count completed sets from localStorage
    let setsCompleted = 0, totalSets = 0;
    workout.sections.forEach((sec, si) => {
      sec.exercises.forEach((ex, ei) => {
        const key = `recomp_${day}_s${si}_e${ei}`;
        const customTotal = localStorage.getItem(key + "_total");
        const total = customTotal ? parseInt(customTotal) : ex.sets;
        totalSets += total;
        try { setsCompleted += (JSON.parse(localStorage.getItem(key + "_sets")) || []).length; } catch {}
      });
    });
    // grab any notes from first exercise as session note
    let note = "";
    try { note = localStorage.getItem(`recomp_${day}_s0_e0_note`) || ""; } catch {}
    const entry = {
      id: Date.now(),
      day,
      title: workout.title,
      timestamp: new Date().toISOString(),
      dateLabel: new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      setsCompleted,
      totalSets,
      duration: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      note: note.split("\n").pop() || "",
    };
    const prev = loadHistory();
    saveHistory([entry, ...prev]);
  };

  const TABS = [
    { id: "schedule", label: "Plan" },
    { id: "history",  label: "History" },
    { id: "photos",   label: "Photos" },
    { id: "tips",     label: "Tips" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0f", color: "#f2ede8", fontFamily: "'Georgia', serif", position: "relative", overflowX: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse at 20% 20%, rgba(196,92,138,0.07) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(232,115,74,0.07) 0%, transparent 55%)" }} />
      {showTimer && <RestTimer onClose={() => setShowTimer(false)} />}

      <div style={{ position: "relative", zIndex: 1, maxWidth: 520, margin: "0 auto", paddingBottom: 80 }}>

        {/* Header */}
        <div style={{ padding: "36px 24px 20px", borderBottom: "1px solid rgba(242,237,232,0.08)" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c45c8a", marginBottom: 8, fontFamily: "sans-serif" }}>Body Recomposition</div>
          <h1 style={{ fontSize: 30, fontWeight: "normal", margin: 0, lineHeight: 1.2 }}>Sculpt & Lean<br /><span style={{ color: "#e8734a" }}>Program</span></h1>
          <p style={{ margin: "10px 0 0", fontSize: 13, color: "rgba(242,237,232,0.45)", fontFamily: "sans-serif", lineHeight: 1.5 }}>6-day recomp plan · Lower body priority · Core + cardio</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(242,237,232,0.08)", padding: "0 24px" }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedDay(null); }}
              style={{ background: "none", border: "none", padding: "14px 0", marginRight: 22, fontSize: 13, fontFamily: "sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", color: activeTab === tab.id ? "#e8734a" : "rgba(242,237,232,0.35)", borderBottom: activeTab === tab.id ? "2px solid #e8734a" : "2px solid transparent", transition: "all 0.2s" }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── SCHEDULE LIST ── */}
        {activeTab === "schedule" && !selectedDay && (
          <div style={{ padding: "24px 16px" }}>
            {workoutData.weekly.map((item, i) => (
              <div key={i} onClick={() => item.type !== "rest" && setSelectedDay(item.day)}
                style={{ display: "flex", alignItems: "center", padding: "16px", marginBottom: 10, borderRadius: 14, background: "rgba(242,237,232,0.04)", border: "1px solid rgba(242,237,232,0.09)", cursor: item.type !== "rest" ? "pointer" : "default", transition: "all 0.2s" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${typeColors[item.type]}20`, border: `1px solid ${typeColors[item.type]}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginRight: 14, flexShrink: 0 }}>{item.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontFamily: "sans-serif", color: typeColors[item.type], letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>{item.day}</div>
                  <div style={{ fontSize: 15, color: item.type === "rest" ? "rgba(242,237,232,0.25)" : "#f2ede8" }}>{item.focus}</div>
                </div>
                {item.type !== "rest" && <div style={{ color: "rgba(242,237,232,0.25)", fontSize: 18 }}>›</div>}
              </div>
            ))}
            <div style={{ marginTop: 8, padding: "18px 20px", background: "rgba(232,115,74,0.08)", borderRadius: 14, border: "1px solid rgba(232,115,74,0.2)" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#e8734a", fontFamily: "sans-serif", marginBottom: 12 }}>Weekly Overview</div>
              <div style={{ display: "flex" }}>
                {[{ label: "Strength", val: "5 days" }, { label: "Cardio", val: "1 day" }, { label: "Ab Circuit", val: "Every day" }].map((s, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center", borderRight: i < 2 ? "1px solid rgba(242,237,232,0.1)" : "none" }}>
                    <div style={{ fontSize: 18, color: "#f2ede8" }}>{s.val}</div>
                    <div style={{ fontSize: 11, fontFamily: "sans-serif", color: "rgba(242,237,232,0.35)", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── WORKOUT DETAIL ── */}
        {activeTab === "schedule" && selectedDay && selectedWorkout && (
          <div style={{ padding: "20px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <button onClick={() => setSelectedDay(null)} style={{ background: "none", border: "none", color: "rgba(242,237,232,0.35)", fontSize: 13, fontFamily: "sans-serif", cursor: "pointer", padding: 0 }}>← Back</button>
              <button onClick={() => setShowTimer(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(232,115,74,0.15)", border: "1px solid rgba(232,115,74,0.3)", borderRadius: 20, padding: "7px 14px", cursor: "pointer", color: "#e8734a", fontFamily: "sans-serif", fontSize: 13 }}>
                ⏱ Rest Timer
              </button>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c45c8a", fontFamily: "sans-serif", marginBottom: 6 }}>{selectedDay}</div>
              <h2 style={{ fontSize: 24, fontWeight: "normal", margin: "0 0 8px" }}>{selectedWorkout.title}</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                {selectedWorkout.targetDuration && (
                  <span style={{ fontSize: 11, fontFamily: "sans-serif", background: "rgba(232,115,74,0.15)", color: "#e8734a", border: "1px solid rgba(232,115,74,0.25)", borderRadius: 20, padding: "3px 10px" }}>
                    ⏱ {selectedWorkout.targetDuration}
                  </span>
                )}
                {selectedWorkout.cardioNote && (
                  <span style={{ fontSize: 11, fontFamily: "sans-serif", background: "rgba(240,194,127,0.12)", color: "#f0c27f", border: "1px solid rgba(240,194,127,0.25)", borderRadius: 20, padding: "3px 10px" }}>
                    + cardio after
                  </span>
                )}
              </div>
              <p style={{ fontSize: 13, color: "rgba(242,237,232,0.45)", fontFamily: "sans-serif", margin: 0, lineHeight: 1.5 }}>💡 {selectedWorkout.goal}</p>
            </div>
            {selectedWorkout.sections.map((section, si) => (
              <div key={si} style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "sans-serif", color: section.color, marginBottom: 10, paddingLeft: 12, borderLeft: `2px solid ${section.color}` }}>{section.name}</div>
                {section.exercises.map((ex, ei) => (
                  <ExerciseCard key={ei} ex={ex} exKey={`${selectedDay}_s${si}_e${ei}`} sectionColor={section.color} onTimerOpen={() => setShowTimer(true)} />
                ))}
              </div>
            ))}

            {/* Cardio reminder */}
            {selectedWorkout.cardioNote && (
              <div style={{ marginBottom: 10, padding: "16px 18px", background: "rgba(240,194,127,0.08)", borderRadius: 14, border: "1px solid rgba(240,194,127,0.2)", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 24 }}>{selectedWorkout.cardioNote.emoji}</div>
                <div>
                  <div style={{ fontSize: 14, color: "#f0c27f", marginBottom: 3 }}>{selectedWorkout.cardioNote.label}</div>
                  <div style={{ fontSize: 12, color: "rgba(242,237,232,0.4)", fontFamily: "sans-serif", lineHeight: 1.5 }}>{selectedWorkout.cardioNote.detail}</div>
                </div>
              </div>
            )}

            {/* Mark complete */}
            <button onClick={() => { markComplete(selectedDay); setActiveTab("history"); setSelectedDay(null); }}
              style={{ width: "100%", marginTop: 6, padding: "14px 0", borderRadius: 14, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #e8734a, #c45c8a)", color: "#fff", fontFamily: "sans-serif", fontSize: 15, fontWeight: "bold", letterSpacing: "0.04em" }}>
              ✓ Mark Workout Complete
            </button>

            {/* Post-workout photo prompt */}
            <div onClick={() => { setActiveTab("photos"); setSelectedDay(null); }}
              style={{ marginTop: 8, padding: "16px 18px", background: "rgba(196,92,138,0.08)", borderRadius: 14, border: "1px solid rgba(196,92,138,0.2)", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 26 }}>📸</div>
              <div>
                <div style={{ fontSize: 14, color: "#f2ede8", marginBottom: 2 }}>Log a progress photo</div>
                <div style={{ fontSize: 12, color: "rgba(242,237,232,0.4)", fontFamily: "sans-serif" }}>Tap to add today's check-in to your timeline</div>
              </div>
              <div style={{ color: "rgba(242,237,232,0.25)", fontSize: 18, marginLeft: "auto" }}>›</div>
            </div>
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {activeTab === "history" && <HistoryTab />}

        {/* ── PHOTOS TAB ── */}
        {activeTab === "photos" && <PhotosTab />}

        {/* ── TIPS TAB ── */}
        {activeTab === "tips" && (
          <div style={{ padding: "24px 16px" }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: "normal", margin: "0 0 6px" }}>Recomp Principles</h2>
              <p style={{ fontSize: 13, color: "rgba(242,237,232,0.4)", fontFamily: "sans-serif", margin: 0 }}>The training is 40%. These make up the other 60%.</p>
            </div>
            {tips.map((tip, i) => (
              <div key={i} style={{ padding: "18px", marginBottom: 12, borderRadius: 14, background: "rgba(242,237,232,0.04)", border: "1px solid rgba(242,237,232,0.09)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ fontSize: 22, width: 44, height: 44, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(196,92,138,0.12)", borderRadius: 10 }}>{tip.icon}</div>
                  <div>
                    <div style={{ fontSize: 15, marginBottom: 5, color: "#f2ede8" }}>{tip.title}</div>
                    <div style={{ fontSize: 13, color: "rgba(242,237,232,0.5)", fontFamily: "sans-serif", lineHeight: 1.6 }}>{tip.body}</div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ padding: "20px 18px", background: "rgba(240,194,127,0.08)", borderRadius: 14, border: "1px solid rgba(240,194,127,0.2)" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#f0c27f", fontFamily: "sans-serif", marginBottom: 14 }}>Cardio Guide</div>
              {[
                { label: "Incline Walk", detail: "10–12% incline · 3.0–3.5 mph · 30–45 min · Zone 2 heart rate" },
                { label: "Stairmaster",  detail: "Moderate pace · 25–35 min · Glutes engaged, don't lean on handles" },
                { label: "Frequency",    detail: "3–4×/week · Never two hard days in a row" },
                { label: "Timing",       detail: "Post-lift cardio burns more fat. Fasted cardio optional." },
              ].map((c, i) => (
                <div key={i} style={{ marginBottom: i < 3 ? 12 : 0, paddingBottom: i < 3 ? 12 : 0, borderBottom: i < 3 ? "1px solid rgba(242,237,232,0.07)" : "none" }}>
                  <div style={{ fontSize: 13, color: "#f0c27f", marginBottom: 3 }}>{c.label}</div>
                  <div style={{ fontSize: 12, color: "rgba(242,237,232,0.5)", fontFamily: "sans-serif", lineHeight: 1.5 }}>{c.detail}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
