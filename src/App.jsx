import { useState, useEffect, useRef, useCallback } from "react";

const SUPABASE_URL = "https://iqwmuzbcfzfcpmdvcjli.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxd211emJjZnpmY3BtZHZjamxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjgwNDMsImV4cCI6MjA2NDU0NDA0M30.FPpKgaUHxdRHxOjBo14939OdMcyHUzFSZ8YyWMsdFnE";

const EXERCISE_LIBRARY = {
  Glutes: [
    { name: "Barbell Hip Thrust", suggestedWeight: "Moderate-Heavy", reps: "10-12", sets: 4, note: "THE #1 glute builder" },
    { name: "Cable Kickbacks", suggestedWeight: "Light-Mod", reps: "15 each", sets: 3, note: "Isolate glute" },
    { name: "Frog Pumps", suggestedWeight: "BW", reps: "20", sets: 3, note: "Glute activation" },
    { name: "Glute Bridge", suggestedWeight: "BW or plate", reps: "15", sets: 3, note: "Squeeze 2 sec at top" },
    { name: "Step Ups", suggestedWeight: "Light-Mod DB", reps: "12 each", sets: 3, note: "Drive through heel" },
    { name: "Sumo Squat", suggestedWeight: "Moderate", reps: "12", sets: 3, note: "Wide stance targets inner thigh" },
  ],
  Hamstrings: [
    { name: "Romanian Deadlift (RDL)", suggestedWeight: "Moderate", reps: "10-12", sets: 4, note: "Slow eccentric" },
    { name: "Lying Hamstring Curl", suggestedWeight: "Moderate", reps: "12-15", sets: 3, note: "" },
    { name: "Single-Leg Deadlift", suggestedWeight: "Light DB", reps: "10 each", sets: 3, note: "Balance + hamstring shape" },
    { name: "Good Mornings", suggestedWeight: "Light bar", reps: "12", sets: 3, note: "Hinge at hips, feel hamstring" },
  ],
  Quads: [
    { name: "Goblet Squat", suggestedWeight: "Moderate KB", reps: "12-15", sets: 3, note: "Knees track toes" },
    { name: "Bulgarian Split Squat", suggestedWeight: "Moderate DB", reps: "10 each", sets: 3, note: "THE shelf builder" },
    { name: "Leg Press", suggestedWeight: "Moderate", reps: "15", sets: 3, note: "High foot = more glute" },
    { name: "Leg Extension", suggestedWeight: "Light-Mod", reps: "15-20", sets: 3, note: "Quad definition finisher" },
    { name: "Walking Lunges", suggestedWeight: "Light DB", reps: "12 each leg", sets: 3, note: "Glute-hamstring tie-in" },
    { name: "Step Ups", suggestedWeight: "Light-Mod DB", reps: "12 each", sets: 3, note: "Drive through heel" },
  ],
  Back: [
    { name: "Cable Straight-Arm Pulldown", suggestedWeight: "25-35 lb", reps: "15-18", sets: 3, note: "Pure lat isolation" },
    { name: "Single-Arm Cable Row", suggestedWeight: "25-35 lb", reps: "15 each", sets: 3, note: "" },
    { name: "Seated Cable Row", suggestedWeight: "35-45 lb", reps: "15", sets: 3, note: "Squeeze 1 sec at top" },
    { name: "Lat Pulldown", suggestedWeight: "Moderate", reps: "12-15", sets: 3, note: "Drive elbows to lats" },
    { name: "Inverted Row", suggestedWeight: "BW", reps: "12-15", sets: 3, note: "Full back engagement" },
    { name: "Rear Delt Fly (Cable)", suggestedWeight: "8-12 lb", reps: "15-20", sets: 3, note: "Defines back of shoulder" },
  ],
  Chest: [
    { name: "Cable Chest Fly", suggestedWeight: "15-25 lb each side", reps: "15-18", sets: 3, note: "Best move for chest definition" },
    { name: "Push-Up", suggestedWeight: "BW", reps: "12-15", sets: 3, note: "Full range of motion" },
    { name: "Dumbbell Press", suggestedWeight: "Moderate", reps: "12", sets: 3, note: "Control the descent" },
    { name: "Incline Dumbbell Fly", suggestedWeight: "Light-Mod", reps: "15", sets: 3, note: "Upper chest definition" },
  ],
  Arms: [
    { name: "Cable Bicep Curl", suggestedWeight: "15-20 lb cable", reps: "15-20", sets: 3, note: "Constant tension" },
    { name: "Hammer Curl", suggestedWeight: "10-12 lb", reps: "15", sets: 3, note: "Full arm shape" },
    { name: "Tricep Rope Pushdown", suggestedWeight: "20-30 lb cable", reps: "15-20", sets: 3, note: "Full extension" },
    { name: "Overhead Tricep Extension", suggestedWeight: "15-20 lb DB", reps: "15", sets: 3, note: "Long head of tricep" },
    { name: "Diamond Push-Up", suggestedWeight: "BW", reps: "10-15", sets: 3, note: "Tricep + chest" },
    { name: "Tricep Dips", suggestedWeight: "BW", reps: "12-15", sets: 3, note: "Upright posture" },
  ],
  Shoulders: [
    { name: "Lateral Raises", suggestedWeight: "5-8 lb", reps: "15-20", sets: 2, note: "Maintenance only - very light" },
    { name: "Face Pulls", suggestedWeight: "15-20 lb", reps: "20", sets: 2, note: "Rear delt + posture" },
    { name: "Band Pull-Aparts", suggestedWeight: "Light band", reps: "15", sets: 2, note: "Shoulder health" },
    { name: "Rear Delt Fly", suggestedWeight: "8-10 lb", reps: "15-20", sets: 3, note: "No size, all tone" },
  ],
  Core: [
    { name: "Plank", suggestedWeight: "BW", reps: "40-45 sec", sets: 3, note: "Squeeze glutes too" },
    { name: "Dead Bug", suggestedWeight: "BW", reps: "10 each side", sets: 3, note: "Deep core" },
    { name: "Hollow Hold", suggestedWeight: "BW", reps: "25 sec", sets: 3, note: "Pull navel to spine" },
    { name: "Leg Raises", suggestedWeight: "BW", reps: "12-15", sets: 3, note: "Lower abs" },
    { name: "Russian Twists", suggestedWeight: "8-10 lb", reps: "15 each side", sets: 3, note: "V-shape waist" },
    { name: "Bicycle Crunches", suggestedWeight: "BW", reps: "20 each side", sets: 3, note: "Slow and deliberate" },
    { name: "Ab Wheel Rollout", suggestedWeight: "BW", reps: "8-12", sets: 3, note: "Full core" },
    { name: "Mountain Climbers", suggestedWeight: "BW", reps: "20 each side", sets: 3, note: "Cardio + core" },
    { name: "Side Plank", suggestedWeight: "BW", reps: "30 sec each", sets: 3, note: "Obliques" },
    { name: "Flutter Kicks", suggestedWeight: "BW", reps: "30 sec", sets: 3, note: "Lower abs" },
    { name: "Oblique Crunch", suggestedWeight: "BW", reps: "15 each side", sets: 3, note: "Waist cinching" },
  ],
  Cardio: [
    { name: "Stairmaster", suggestedWeight: "Level 6-8", reps: "25-30 min", sets: 1, note: "Glutes engaged - don't lean" },
    { name: "Incline Treadmill Walk", suggestedWeight: "10-12%, 3.5 mph", reps: "25-30 min", sets: 1, note: "Zone 2 steady state" },
    { name: "Elliptical", suggestedWeight: "Moderate resistance", reps: "25-30 min", sets: 1, note: "Low impact option" },
  ],
};

const DEFAULT_WORKOUTS = {
  Monday: {
    title: "Lower Body A - Glute & Hamstring",
    targetDuration: "~60 min",
    cardioNote: { label: "Daily Cardio - Separate Session", detail: "25-30 min Stairmaster or incline walk - your step builder", emoji: "🔥" },
    goal: "Build the posterior chain - glutes and hamstrings are your recomp engine",
    sections: [
      { name: "Warm-Up", color: "#f0c27f", exercises: [
        { name: "Glute Bridges", sets: 3, reps: "15", suggestedWeight: "BW", note: "Activate glutes before loading" },
        { name: "Banded Clamshells", sets: 3, reps: "12 each", suggestedWeight: "Light band", note: "Glute med activation" },
        { name: "Hip Circles", sets: 3, reps: "10 each", suggestedWeight: "BW", note: "Loosen hips and hip flexors" },
      ]},
      { name: "Main Lifts", color: "#e8734a", exercises: [
        { name: "Barbell Hip Thrust", sets: 4, reps: "10-12", suggestedWeight: "Moderate-Heavy", note: "Add weight each week - THE glute builder 🍑" },
        { name: "Romanian Deadlift (RDL)", sets: 4, reps: "10-12", suggestedWeight: "Moderate", note: "3 sec lowering - feel every inch of that hamstring" },
        { name: "Sumo Squat", sets: 3, reps: "12", suggestedWeight: "Moderate KB/DB", note: "Wide stance - inner thigh and glute target" },
        { name: "Cable Kickbacks", sets: 3, reps: "15 each", suggestedWeight: "Light-Mod", note: "Full extension at top - squeeze hard" },
        { name: "Lying Hamstring Curl", sets: 3, reps: "12-15", suggestedWeight: "Moderate", note: "Slow and controlled - hamstring isolation" },
        { name: "Lateral Band Walks", sets: 3, reps: "15 each way", suggestedWeight: "Medium band", note: "Glute med - shapes the outer hip" },
      ]},
      { name: "Ab Circuit", color: "#7c5cbf", exercises: [
        { name: "Dead Bug", sets: 3, reps: "10 each side", suggestedWeight: "BW", note: "Deep core - protects lower back" },
        { name: "Leg Raises", sets: 3, reps: "12-15", suggestedWeight: "BW", note: "Lower abs - slow and controlled" },
        { name: "Russian Twists", sets: 3, reps: "15 each side", suggestedWeight: "8-10 lb", note: "Obliques = V-shape waist" },
        { name: "Hollow Hold", sets: 3, reps: "25 sec", suggestedWeight: "BW", note: "Pull navel to spine the whole time" },
      ]},
    ],
  },
  Tuesday: {
    title: "Upper Body A - Chest, Triceps & Shoulders",
    targetDuration: "~60 min",
    cardioNote: { label: "Daily Cardio - Separate Session", detail: "25-30 min Stairmaster or incline walk - your step builder", emoji: "🔥" },
    goal: "Define chest and arms - high reps, constant tension, no bulk. Light shoulders maintenance only",
    sections: [
      { name: "Warm-Up", color: "#f0c27f", exercises: [
        { name: "Band Pull-Aparts", sets: 3, reps: "15", suggestedWeight: "Light band", note: "Opens chest, rear delt activation" },
        { name: "Arm Circles", sets: 2, reps: "10 each direction", suggestedWeight: "BW", note: "Warm up the shoulder joint" },
      ]},
      { name: "Main Lifts", color: "#e8734a", exercises: [
        { name: "Cable Chest Fly", sets: 4, reps: "15-18", suggestedWeight: "15-25 lb each side", note: "Constant tension - best chest definition move" },
        { name: "Tricep Rope Pushdown", sets: 4, reps: "15-20", suggestedWeight: "20-30 lb cable", note: "Full extension, squeeze at bottom - add weight weekly" },
        { name: "Overhead Tricep Extension", sets: 3, reps: "15", suggestedWeight: "15-20 lb DB", note: "Long head of tricep - horseshoe shape" },
        { name: "Tricep Dips", sets: 3, reps: "12-15", suggestedWeight: "BW", note: "Upright posture isolates the tricep" },
        { name: "Lateral Raises", sets: 3, reps: "15-20", suggestedWeight: "5-8 lb", note: "Maintenance ONLY - very light, just keeping tone" },
        { name: "Face Pulls", sets: 3, reps: "20", suggestedWeight: "15-20 lb", note: "Rear delt + posture - non negotiable" },
      ]},
      { name: "Ab Circuit", color: "#7c5cbf", exercises: [
        { name: "Plank", sets: 3, reps: "40-45 sec", suggestedWeight: "BW", note: "Squeeze everything - glutes too" },
        { name: "Bicycle Crunches", sets: 3, reps: "20 each side", suggestedWeight: "BW", note: "Slow and deliberate - no rushing" },
        { name: "Side Plank", sets: 3, reps: "30 sec each", suggestedWeight: "BW", note: "Obliques = waist definition" },
        { name: "Ab Wheel Rollout", sets: 3, reps: "8-12", suggestedWeight: "BW", note: "Full core engagement" },
      ]},
    ],
  },
  Wednesday: {
    title: "Cardio - Zone 2 Burn",
    targetDuration: "40-45 min",
    cardioNote: null,
    goal: "Dedicated fat burning day - steady state cardio accelerates recomp more than you think",
    sections: [
      { name: "Cardio - Choose One", color: "#f0c27f", exercises: [
        { name: "Stairmaster", sets: 1, reps: "40-45 min", suggestedWeight: "Level 7-8", note: "Don't lean on handles - glutes engaged the whole time" },
        { name: "Incline Treadmill Walk", sets: 1, reps: "40-45 min", suggestedWeight: "10-12%, 3.0-3.5 mph", note: "Zone 2 - you can talk but it's not easy" },
        { name: "Elliptical", sets: 1, reps: "40-45 min", suggestedWeight: "Moderate resistance", note: "Low impact option - great recovery day cardio" },
      ]},
      { name: "Ab Circuit", color: "#7c5cbf", exercises: [
        { name: "Plank", sets: 3, reps: "45 sec", suggestedWeight: "BW", note: "Full body tension" },
        { name: "Leg Raises", sets: 3, reps: "15", suggestedWeight: "BW", note: "Lower abs" },
        { name: "Russian Twists", sets: 3, reps: "15 each side", suggestedWeight: "8-10 lb", note: "Obliques" },
        { name: "Hollow Hold", sets: 3, reps: "25 sec", suggestedWeight: "BW", note: "Finish strong" },
      ]},
    ],
  },
  Thursday: {
    title: "Lower Body B - Glute & Quad",
    targetDuration: "~60 min",
    cardioNote: { label: "Daily Cardio - Separate Session", detail: "25-30 min Stairmaster or incline walk - your step builder", emoji: "🔥" },
    goal: "Glute shelf + quad definition - hip thrusts first to prime everything that follows",
    sections: [
      { name: "Warm-Up", color: "#f0c27f", exercises: [
        { name: "Air Squats", sets: 3, reps: "15", suggestedWeight: "BW", note: "Full depth - chest tall" },
        { name: "Leg Swings", sets: 2, reps: "10 each", suggestedWeight: "BW", note: "Front to back and side to side" },
      ]},
      { name: "Main Lifts", color: "#e8734a", exercises: [
        { name: "Barbell Hip Thrust", sets: 3, reps: "12", suggestedWeight: "Moderate-Heavy", note: "Glute primer - sets the tone for the whole session 🍑" },
        { name: "Bulgarian Split Squat", sets: 3, reps: "10 each", suggestedWeight: "15-20 lb DB", note: "Lean forward slightly - glute emphasis over quad" },
        { name: "Leg Press", sets: 3, reps: "15", suggestedWeight: "Moderate", note: "High foot placement = more glute activation" },
        { name: "Goblet Squat", sets: 3, reps: "12-15", suggestedWeight: "Moderate KB", note: "Full depth - add weight each week" },
        { name: "Step Ups", sets: 3, reps: "12 each leg", suggestedWeight: "Light-Mod DB", note: "Drive through HEEL - this is what hits glute not quad" },
        { name: "Leg Extension", sets: 3, reps: "15-20", suggestedWeight: "Light-Mod", note: "Quad definition finisher - slow and squeeze" },
      ]},
      { name: "Ab Circuit", color: "#7c5cbf", exercises: [
        { name: "Ab Wheel Rollout", sets: 3, reps: "8-12", suggestedWeight: "BW", note: "Full core engagement" },
        { name: "Mountain Climbers", sets: 3, reps: "20 each side", suggestedWeight: "BW", note: "Cardio + core combo" },
        { name: "Oblique Crunch", sets: 3, reps: "15 each side", suggestedWeight: "BW", note: "Waist cinching - slow and squeeze" },
        { name: "Hollow Hold", sets: 3, reps: "25 sec", suggestedWeight: "BW", note: "Pull navel to spine" },
      ]},
    ],
  },
  Friday: {
    title: "Upper Body B - Back & Biceps",
    targetDuration: "~60 min",
    cardioNote: { label: "Daily Cardio - Separate Session", detail: "25-30 min Stairmaster or incline walk - your step builder", emoji: "🔥" },
    goal: "Lean out the back and define arms - cable tension, high reps, sculpt without adding size",
    sections: [
      { name: "Warm-Up", color: "#f0c27f", exercises: [
        { name: "Band Pull-Aparts", sets: 3, reps: "15", suggestedWeight: "Light band", note: "Non-negotiable - shoulder health every single week" },
        { name: "Scapular Circles", sets: 2, reps: "10 each direction", suggestedWeight: "BW", note: "Wake up the lats before pulling" },
      ]},
      { name: "Main Lifts", color: "#c45c8a", exercises: [
        { name: "Cable Straight-Arm Pulldown", sets: 4, reps: "15-18", suggestedWeight: "25-35 lb", note: "Arms straight, pull to hips - pure lat isolation" },
        { name: "Single-Arm Cable Row", sets: 4, reps: "15 each", suggestedWeight: "25-35 lb", note: "Full rotation at top - mid-back and rear delt" },
        { name: "Seated Cable Row", sets: 3, reps: "15", suggestedWeight: "35-45 lb", note: "Squeeze and hold 1 sec at top" },
        { name: "Cable Bicep Curl", sets: 3, reps: "15-20", suggestedWeight: "15-20 lb cable", note: "Constant tension - more definition than dumbbells" },
        { name: "Hammer Curl", sets: 3, reps: "15", suggestedWeight: "10-12 lb", note: "Hits brachialis - creates full defined arm" },
        { name: "Rear Delt Fly (Cable)", sets: 3, reps: "15-20", suggestedWeight: "8-12 lb", note: "Defines back of shoulder - no size, all tone" },
      ]},
      { name: "Ab Circuit", color: "#7c5cbf", exercises: [
        { name: "Plank to Down Dog", sets: 3, reps: "10", suggestedWeight: "BW", note: "Core + shoulder stability" },
        { name: "Bicycle Crunches", sets: 3, reps: "20 each side", suggestedWeight: "BW", note: "Slow and deliberate" },
        { name: "Flutter Kicks", sets: 3, reps: "30 sec", suggestedWeight: "BW", note: "Lower abs - back pressed to floor" },
        { name: "Side Plank", sets: 3, reps: "30 sec each", suggestedWeight: "BW", note: "Obliques = waist definition" },
      ]},
    ],
  },
  Saturday: {
    title: "Full Body - Compound + Burn",
    targetDuration: "~60 min",
    cardioNote: { label: "Daily Cardio - Separate Session", detail: "25-30 min Stairmaster or incline walk - your step builder", emoji: "🔥" },
    goal: "Hit every muscle group, elevate heart rate, maximize weekly calorie burn",
    sections: [
      { name: "Warm-Up", color: "#f0c27f", exercises: [
        { name: "Glute Bridges", sets: 2, reps: "15", suggestedWeight: "BW", note: "Posterior chain activation" },
        { name: "Band Pull-Aparts", sets: 2, reps: "15", suggestedWeight: "Light band", note: "Upper body prep" },
      ]},
      { name: "Main Lifts", color: "#e8734a", exercises: [
        { name: "Dumbbell Deadlift", sets: 4, reps: "12", suggestedWeight: "Moderate", note: "Full posterior chain - hinge at hips, add weight weekly" },
        { name: "Goblet Squat", sets: 3, reps: "12", suggestedWeight: "Moderate KB", note: "Squat deep - chest tall" },
        { name: "Single-Arm Dumbbell Row", sets: 3, reps: "12 each", suggestedWeight: "Moderate", note: "Elbow drives back - squeeze at top" },
        { name: "Push-Up", sets: 3, reps: "12-15", suggestedWeight: "BW", note: "Full range - elevate if needed" },
        { name: "Reverse Lunge to Knee Drive", sets: 3, reps: "10 each", suggestedWeight: "BW/Light DB", note: "Explosive - drive knee up at top" },
        { name: "Rear Delt Fly", sets: 3, reps: "15-20", suggestedWeight: "8-10 lb", note: "Posture + definition - no size" },
      ]},
      { name: "Ab Circuit", color: "#7c5cbf", exercises: [
        { name: "Plank", sets: 3, reps: "45 sec", suggestedWeight: "BW", note: "Squeeze everything - glutes, core, quads" },
        { name: "Russian Twists", sets: 3, reps: "15 each side", suggestedWeight: "8-10 lb", note: "V-shape waist" },
        { name: "Leg Raises", sets: 3, reps: "15", suggestedWeight: "BW", note: "Lower abs - no swinging" },
        { name: "Hollow Hold", sets: 3, reps: "25 sec", suggestedWeight: "BW", note: "Full body tension - finish strong" },
      ]},
    ],
  },
};

const weeklySchedule = [
  { day: "Monday", focus: "Lower Body A - Glute & Hamstring", type: "strength", emoji: "🍑" },
  { day: "Tuesday", focus: "Upper Body A - Chest, Triceps & Shoulders", type: "strength", emoji: "💪" },
  { day: "Wednesday", focus: "Cardio - Zone 2 Burn", type: "cardio", emoji: "🔥" },
  { day: "Thursday", focus: "Lower Body B - Glute & Quad", type: "strength", emoji: "⚡" },
  { day: "Friday", focus: "Upper Body B - Back & Biceps", type: "strength", emoji: "🎯" },
  { day: "Saturday", focus: "Full Body - Compound + Burn", type: "strength", emoji: "✨" },
  { day: "Sunday", focus: "Rest & Recover", type: "rest", emoji: "☁️" },
];

const tips = [
  { icon: "🥩", title: "Protein is Non-Negotiable", body: "Aim for 120g+ daily. Prioritize steak, eggs, Greek yogurt, ground turkey, shrimp, cottage cheese. This preserves your glutes while you lose fat." },
  { icon: "📈", title: "Progressive Overload is the Secret", body: "Every 1-2 weeks add 5 lbs or 1 rep to your main lifts. This is what creates visible change. Track your weights every session." },
  { icon: "🚶", title: "10k Steps Daily", body: "Your daily 25-30 min cardio session gets you halfway. Add walking throughout the day. Steps are your #1 fat loss tool outside the gym." },
  { icon: "⚖️", title: "300-400 Cal Deficit Only", body: "Too aggressive loses muscle. Whole foods, portion awareness, measure granola and almonds. You already eat clean - just tighten portions." },
  { icon: "😴", title: "Sleep = Fat Loss", body: "7-9 hours. Growth hormone released during sleep drives fat loss and muscle repair. No alcohol means better sleep quality already." },
  { icon: "💧", title: "Hydration Protocol", body: "100oz daily minimum. Drink 20oz BEFORE preworkout - not after. Electrolytes on hard training days. Heavy sweating needs sodium replenishment." },
];

const REST_PRESETS = [30, 60, 90, 120];

async function sbFetch(path, opts = {}) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation", ...opts.headers },
      ...opts,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function loadCustomWorkouts() {
  const data = await sbFetch("custom_workouts?select=*&order=updated_at.desc&limit=1");
  if (data && data.length > 0) { try { return JSON.parse(data[0].workout_data); } catch {} }
  return null;
}

async function saveCustomWorkouts(workouts) {
  await sbFetch("custom_workouts", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify({ id: 1, workout_data: JSON.stringify(workouts), updated_at: new Date().toISOString() }),
  });
}

function loadPhotos() { try { return JSON.parse(localStorage.getItem("recomp_photos") || "[]"); } catch { return []; } }
function savePhotos(arr) { localStorage.setItem("recomp_photos", JSON.stringify(arr)); }
function loadHistory() { try { return JSON.parse(localStorage.getItem("recomp_history") || "[]"); } catch { return []; } }
function saveHistory(arr) { localStorage.setItem("recomp_history", JSON.stringify(arr)); }

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
  const r = 42, circ = 2 * Math.PI * r, done = timeLeft === 0;
  const progress = timeLeft !== null ? timeLeft / selected : 1;
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(13,13,15,0.93)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#161618", borderRadius: 24, padding: "32px 28px", width: 300, border: "1px solid rgba(242,237,232,0.1)", textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c45c8a", fontFamily: "sans-serif", marginBottom: 20 }}>Rest Timer</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24 }}>
          {REST_PRESETS.map(s => (
            <button key={s} onClick={() => { setSelected(s); setTimeLeft(null); setRunning(false); clearInterval(intervalRef.current); }}
              style={{ padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontFamily: "sans-serif", fontSize: 12, background: selected === s ? "#e8734a" : "rgba(242,237,232,0.08)", color: selected === s ? "#0d0d0f" : "rgba(242,237,232,0.6)", fontWeight: selected === s ? "bold" : "normal" }}>{s}s</button>
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
          <button onClick={() => start(selected)} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", cursor: "pointer", background: "#e8734a", color: "#0d0d0f", fontFamily: "sans-serif", fontSize: 14, fontWeight: "bold" }}>{running ? "Restart" : "Start"}</button>
          {running && <button onClick={() => { setRunning(false); clearInterval(intervalRef.current); }} style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(242,237,232,0.15)", background: "transparent", color: "rgba(242,237,232,0.6)", cursor: "pointer", fontFamily: "sans-serif", fontSize: 14 }}>Pause</button>}
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(242,237,232,0.3)", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>Close</button>
      </div>
    </div>
  );
}

function AddExerciseModal({ onAdd, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState("Glutes");
  const [custom, setCustom] = useState({ name: "", reps: "", suggestedWeight: "", sets: 3, note: "" });
  const [mode, setMode] = useState("library");
  const categories = Object.keys(EXERCISE_LIBRARY);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(13,13,15,0.95)", zIndex: 150, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "#161618", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 520, maxHeight: "85vh", overflowY: "auto", border: "1px solid rgba(242,237,232,0.1)", borderBottom: "none" }}>
        <div style={{ padding: "24px 20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 18, color: "#f2ede8" }}>Add Exercise</div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(242,237,232,0.4)", fontSize: 26, cursor: "pointer", lineHeight: 1 }}>×</button>
          </div>
          <div style={{ display: "flex", background: "rgba(242,237,232,0.06)", borderRadius: 12, padding: 3, marginBottom: 20 }}>
            {["library", "custom"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, background: mode === m ? "#e8734a" : "transparent", color: mode === m ? "#0d0d0f" : "rgba(242,237,232,0.5)", fontWeight: mode === m ? "bold" : "normal" }}>
                {m === "library" ? "Exercise Library" : "Custom Exercise"}
              </button>
            ))}
          </div>
          {mode === "library" ? (
            <>
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 16, scrollbarWidth: "none" }}>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontFamily: "sans-serif", fontSize: 12, whiteSpace: "nowrap", flexShrink: 0, background: selectedCategory === cat ? "#c45c8a" : "rgba(242,237,232,0.08)", color: selectedCategory === cat ? "#fff" : "rgba(242,237,232,0.5)", fontWeight: selectedCategory === cat ? "bold" : "normal" }}>{cat}</button>
                ))}
              </div>
              <div style={{ paddingBottom: 32 }}>
                {EXERCISE_LIBRARY[selectedCategory].map((ex, i) => (
                  <div key={i} onClick={() => { onAdd(ex); onClose(); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", marginBottom: 8, borderRadius: 12, background: "rgba(242,237,232,0.04)", border: "1px solid rgba(242,237,232,0.09)", cursor: "pointer" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, color: "#f2ede8", marginBottom: 3 }}>{ex.name}</div>
                      <div style={{ fontSize: 11, fontFamily: "sans-serif", color: "rgba(242,237,232,0.35)" }}>{ex.sets} sets x {ex.reps} · {ex.suggestedWeight}</div>
                      {ex.note && <div style={{ fontSize: 11, fontFamily: "sans-serif", color: "rgba(242,237,232,0.25)", fontStyle: "italic", marginTop: 2 }}>{ex.note}</div>}
                    </div>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(196,92,138,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c45c8a", fontSize: 20, flexShrink: 0, marginLeft: 12 }}>+</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ paddingBottom: 32 }}>
              {[{ label: "Exercise Name *", key: "name", placeholder: "e.g. Hip Thrust" }, { label: "Reps", key: "reps", placeholder: "e.g. 12-15" }, { label: "Weight / Equipment", key: "suggestedWeight", placeholder: "e.g. Moderate DB" }, { label: "Notes (optional)", key: "note", placeholder: "e.g. Squeeze glutes at top" }].map(field => (
                <div key={field.key} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(242,237,232,0.35)", fontFamily: "sans-serif", marginBottom: 6 }}>{field.label}</div>
                  <input value={custom[field.key]} onChange={e => setCustom(p => ({ ...p, [field.key]: e.target.value }))} placeholder={field.placeholder}
                    style={{ width: "100%", boxSizing: "border-box", background: "rgba(242,237,232,0.06)", border: "1px solid rgba(242,237,232,0.12)", borderRadius: 10, padding: "10px 12px", color: "#f2ede8", fontFamily: "sans-serif", fontSize: 13, outline: "none" }} />
                </div>
              ))}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(242,237,232,0.35)", fontFamily: "sans-serif", marginBottom: 6 }}>Sets</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button onClick={() => setCustom(p => ({ ...p, sets: Math.max(1, p.sets - 1) }))} style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(242,237,232,0.15)", background: "transparent", color: "rgba(242,237,232,0.6)", cursor: "pointer", fontSize: 18 }}>-</button>
                  <span style={{ fontSize: 18, color: "#f2ede8", minWidth: 24, textAlign: "center" }}>{custom.sets}</span>
                  <button onClick={() => setCustom(p => ({ ...p, sets: Math.min(8, p.sets + 1) }))} style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(242,237,232,0.15)", background: "transparent", color: "rgba(242,237,232,0.6)", cursor: "pointer", fontSize: 18 }}>+</button>
                </div>
              </div>
              <button onClick={() => { if (!custom.name.trim()) return; onAdd(custom); onClose(); }}
                style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", cursor: "pointer", background: custom.name.trim() ? "#c45c8a" : "rgba(242,237,232,0.08)", color: custom.name.trim() ? "#fff" : "rgba(242,237,232,0.3)", fontFamily: "sans-serif", fontSize: 14, fontWeight: "bold" }}>
                Add Exercise
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ExerciseCard({ ex, exKey, sectionColor, onTimerOpen, onRemove, editMode }) {
  const storageKey = `recomp_${exKey}`;
  const [expanded, setExpanded] = useState(false);
  const [completedSets, setCompletedSets] = useState(() => { try { return JSON.parse(localStorage.getItem(storageKey + "_sets")) || []; } catch { return []; } });
  const [totalSets, setTotalSets] = useState(() => { const s = localStorage.getItem(storageKey + "_total"); return s ? parseInt(s) : ex.sets; });
  const [note, setNote] = useState(() => localStorage.getItem(storageKey + "_note") || "");
  const [noteDraft, setNoteDraft] = useState("");
  const [editingNote, setEditingNote] = useState(false);
  const allDone = completedSets.length >= totalSets;
  const toggleSet = (i) => { const next = completedSets.includes(i) ? completedSets.filter(x => x !== i) : [...completedSets, i]; setCompletedSets(next); localStorage.setItem(storageKey + "_sets", JSON.stringify(next)); if (!completedSets.includes(i)) onTimerOpen(); };
  const adjustSets = (delta) => { const next = Math.max(1, Math.min(8, totalSets + delta)); setTotalSets(next); localStorage.setItem(storageKey + "_total", String(next)); if (delta < 0) { const pruned = completedSets.filter(i => i < next); setCompletedSets(pruned); localStorage.setItem(storageKey + "_sets", JSON.stringify(pruned)); } };
  const saveNote = () => { const saved = noteDraft.trim(); const full = saved ? `[${new Date().toLocaleDateString()}] ${saved}` : ""; const prev = note ? note + "\n" + full : full; const trimmed = prev.trim(); setNote(trimmed); localStorage.setItem(storageKey + "_note", trimmed); setNoteDraft(""); setEditingNote(false); };
  return (
    <div style={{ marginBottom: 10, borderRadius: 14, background: allDone ? `${sectionColor}12` : "rgba(242,237,232,0.04)", border: `1px solid ${allDone ? sectionColor + "40" : "rgba(242,237,232,0.09)"}`, overflow: "hidden", transition: "all 0.25s" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {editMode && <button onClick={onRemove} style={{ background: "none", border: "none", color: "rgba(232,80,80,0.8)", fontSize: 22, cursor: "pointer", padding: "0 4px 0 14px", flexShrink: 0, lineHeight: 1 }}>-</button>}
        <div onClick={() => !editMode && setExpanded(e => !e)} style={{ flex: 1, padding: "14px 16px", cursor: editMode ? "default" : "pointer", display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, color: allDone ? "rgba(242,237,232,0.45)" : "#f2ede8", textDecoration: allDone ? "line-through" : "none", marginBottom: 4 }}>{ex.name}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontFamily: "sans-serif", color: sectionColor, background: sectionColor + "20", padding: "2px 8px", borderRadius: 20 }}>{totalSets} sets x {ex.reps}{totalSets !== ex.sets ? " *" : ""}</span>
              <span style={{ fontSize: 11, fontFamily: "sans-serif", color: "rgba(242,237,232,0.35)" }}>{ex.suggestedWeight}</span>
            </div>
            {ex.note && <div style={{ fontSize: 12, color: "rgba(242,237,232,0.3)", fontFamily: "sans-serif", marginTop: 5, fontStyle: "italic" }}>{ex.note}</div>}
          </div>
          {!editMode && <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {note && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#c45c8a" }} />}
            <div style={{ color: "rgba(242,237,232,0.25)", fontSize: 16, transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>›</div>
          </div>}
        </div>
      </div>
      {expanded && !editMode && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(242,237,232,0.3)", fontFamily: "sans-serif" }}>Tap set to complete · timer auto-starts</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button onClick={(e) => { e.stopPropagation(); adjustSets(-1); }} disabled={totalSets <= 1} style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(242,237,232,0.15)", background: "transparent", color: totalSets <= 1 ? "rgba(242,237,232,0.15)" : "rgba(242,237,232,0.5)", cursor: totalSets <= 1 ? "default" : "pointer", fontSize: 16, lineHeight: 1, fontFamily: "sans-serif" }}>-</button>
              <span style={{ fontSize: 12, fontFamily: "sans-serif", color: "rgba(242,237,232,0.4)", minWidth: 20, textAlign: "center" }}>{totalSets}</span>
              <button onClick={(e) => { e.stopPropagation(); adjustSets(1); }} disabled={totalSets >= 8} style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(242,237,232,0.15)", background: "transparent", color: totalSets >= 8 ? "rgba(242,237,232,0.15)" : "rgba(242,237,232,0.5)", cursor: totalSets >= 8 ? "default" : "pointer", fontSize: 16, lineHeight: 1, fontFamily: "sans-serif" }}>+</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {Array.from({ length: totalSets }).map((_, i) => { const done = completedSets.includes(i); return (<button key={i} onClick={() => toggleSet(i)} style={{ width: 44, height: 44, borderRadius: 10, border: "none", cursor: "pointer", background: done ? sectionColor : "rgba(242,237,232,0.08)", color: done ? "#0d0d0f" : "rgba(242,237,232,0.5)", fontSize: done ? 16 : 14, fontFamily: "sans-serif", fontWeight: "bold", transition: "all 0.18s" }}>{done ? "✓" : i + 1}</button>); })}
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
                <textarea autoFocus value={noteDraft} onChange={e => setNoteDraft(e.target.value)} placeholder='e.g. "95 lbs x 10 - felt strong"'
                  style={{ width: "100%", boxSizing: "border-box", background: "rgba(242,237,232,0.06)", border: "1px solid rgba(242,237,232,0.15)", borderRadius: 10, padding: "10px 12px", color: "#f2ede8", fontFamily: "sans-serif", fontSize: 13, resize: "none", outline: "none", lineHeight: 1.5, minHeight: 72 }} />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={saveNote} style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: "none", cursor: "pointer", background: sectionColor, color: "#0d0d0f", fontFamily: "sans-serif", fontSize: 13, fontWeight: "bold" }}>Save</button>
                  <button onClick={() => { setEditingNote(false); setNoteDraft(""); }} style={{ padding: "9px 14px", borderRadius: 10, border: "1px solid rgba(242,237,232,0.12)", background: "transparent", color: "rgba(242,237,232,0.4)", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setEditingNote(true)} style={{ width: "100%", padding: "9px 0", borderRadius: 10, border: "1px dashed rgba(242,237,232,0.15)", background: "transparent", color: "rgba(242,237,232,0.35)", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>+ Add weight / reps note</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PhotosTab() {
  const [photos, setPhotos] = useState(loadPhotos);
  const [lightbox, setLightbox] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [filterDay, setFilterDay] = useState("All");
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileRef = useRef();
  const typeColors = { Monday: "#e8734a", Tuesday: "#f0c27f", Wednesday: "#c45c8a", Thursday: "#7cbf8a", Friday: "#e8734a", Saturday: "#7c5cbf", Sunday: "#8899aa" };
  const dayOptions = ["All", ...weeklySchedule.map(d => d.day)];
  const handleFile = (e) => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = (ev) => setPreviewUrl(ev.target.result); reader.readAsDataURL(file); setUploading(true); };
  const handleSave = () => { if (!previewUrl) return; const newPhoto = { id: Date.now(), dataUrl: previewUrl, label: selectedDay, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), caption: caption.trim() }; const updated = [newPhoto, ...photos]; setPhotos(updated); savePhotos(updated); setPreviewUrl(null); setCaption(""); setUploading(false); fileRef.current.value = ""; };
  const handleCancel = () => { setPreviewUrl(null); setCaption(""); setUploading(false); if (fileRef.current) fileRef.current.value = ""; };
  const handleDelete = (id) => { const updated = photos.filter(p => p.id !== id); setPhotos(updated); savePhotos(updated); setLightbox(null); };
  const filtered = filterDay === "All" ? photos : photos.filter(p => p.label === filterDay);
  const grouped = filtered.reduce((acc, p) => { const month = p.date.split(" ").slice(0, 2).join(" "); if (!acc[month]) acc[month] = []; acc[month].push(p); return acc; }, {});
  return (
    <div style={{ padding: "24px 16px" }}>
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, background: "rgba(13,13,15,0.97)", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 400, width: "100%" }}>
            <img src={lightbox.dataUrl} alt="" style={{ width: "100%", borderRadius: 16, objectFit: "contain", maxHeight: "65vh" }} />
            <div style={{ marginTop: 14, textAlign: "center" }}>
              <div style={{ fontSize: 15, color: "#f2ede8", marginBottom: 4 }}>{lightbox.label}</div>
              <div style={{ fontSize: 12, color: "rgba(242,237,232,0.4)", fontFamily: "sans-serif", marginBottom: 16 }}>{lightbox.date}</div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button onClick={() => handleDelete(lightbox.id)} style={{ padding: "10px 20px", borderRadius: 12, border: "1px solid rgba(232,80,80,0.3)", background: "rgba(232,80,80,0.1)", color: "#e85050", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>Delete</button>
                <button onClick={() => setLightbox(null)} style={{ padding: "10px 20px", borderRadius: 12, border: "1px solid rgba(242,237,232,0.15)", background: "transparent", color: "rgba(242,237,232,0.5)", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: "normal", margin: "0 0 6px" }}>Progress Photos</h2>
        <p style={{ fontSize: 13, color: "rgba(242,237,232,0.4)", fontFamily: "sans-serif", margin: 0 }}>Document your transformation. Consistency compounds.</p>
      </div>
      {!uploading ? (
        <div onClick={() => fileRef.current.click()} style={{ border: "1.5px dashed rgba(196,92,138,0.35)", borderRadius: 16, padding: "28px 20px", textAlign: "center", cursor: "pointer", marginBottom: 20, background: "rgba(196,92,138,0.05)" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
          <div style={{ fontSize: 15, color: "#f2ede8", marginBottom: 4 }}>Add progress photo</div>
          <div style={{ fontSize: 12, color: "rgba(242,237,232,0.35)", fontFamily: "sans-serif" }}>Tap to choose from camera roll</div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
        </div>
      ) : (
        <div style={{ marginBottom: 20, background: "rgba(242,237,232,0.04)", borderRadius: 16, padding: 16, border: "1px solid rgba(242,237,232,0.1)" }}>
          {previewUrl && <img src={previewUrl} alt="preview" style={{ width: "100%", borderRadius: 12, objectFit: "cover", maxHeight: 240, marginBottom: 14 }} />}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {weeklySchedule.filter(d => d.type !== "rest").map(d => (
              <button key={d.day} onClick={() => setSelectedDay(d.day)} style={{ padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontFamily: "sans-serif", fontSize: 12, background: selectedDay === d.day ? (typeColors[d.day] || "#e8734a") : "rgba(242,237,232,0.08)", color: selectedDay === d.day ? "#0d0d0f" : "rgba(242,237,232,0.55)", fontWeight: selectedDay === d.day ? "bold" : "normal" }}>{d.day}</button>
            ))}
          </div>
          <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Add a note (optional)" style={{ width: "100%", boxSizing: "border-box", background: "rgba(242,237,232,0.06)", border: "1px solid rgba(242,237,232,0.12)", borderRadius: 10, padding: "10px 12px", color: "#f2ede8", fontFamily: "sans-serif", fontSize: 13, outline: "none" }} />
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button onClick={handleSave} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", cursor: "pointer", background: "#c45c8a", color: "#fff", fontFamily: "sans-serif", fontSize: 14, fontWeight: "bold" }}>Save Photo</button>
            <button onClick={handleCancel} style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(242,237,232,0.12)", background: "transparent", color: "rgba(242,237,232,0.4)", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>Cancel</button>
          </div>
        </div>
      )}
      {photos.length > 0 && (
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 20, scrollbarWidth: "none" }}>
          {dayOptions.map(d => (<button key={d} onClick={() => setFilterDay(d)} style={{ padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontFamily: "sans-serif", fontSize: 12, whiteSpace: "nowrap", flexShrink: 0, background: filterDay === d ? "#e8734a" : "rgba(242,237,232,0.08)", color: filterDay === d ? "#0d0d0f" : "rgba(242,237,232,0.5)", fontWeight: filterDay === d ? "bold" : "normal" }}>{d}</button>))}
        </div>
      )}
      {photos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(242,237,232,0.2)", fontFamily: "sans-serif", fontSize: 14 }}><div style={{ fontSize: 36, marginBottom: 10 }}>🌱</div>Your journey starts with the first photo.</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px 0", color: "rgba(242,237,232,0.25)", fontFamily: "sans-serif", fontSize: 13 }}>No photos tagged for {filterDay} yet.</div>
      ) : (
        Object.entries(grouped).map(([month, monthPhotos]) => (
          <div key={month} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(242,237,232,0.3)", fontFamily: "sans-serif", marginBottom: 12, paddingLeft: 2 }}>{month} · {monthPhotos.length} photo{monthPhotos.length !== 1 ? "s" : ""}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              {monthPhotos.map(photo => (
                <div key={photo.id} onClick={() => setLightbox(photo)} style={{ borderRadius: 12, overflow: "hidden", cursor: "pointer", position: "relative", aspectRatio: "3/4", background: "rgba(242,237,232,0.04)" }}>
                  <img src={photo.dataUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(13,13,15,0.85))", padding: "20px 10px 10px" }}>
                    <div style={{ fontSize: 11, fontFamily: "sans-serif", fontWeight: "bold", color: typeColors[photo.label] || "#e8734a" }}>{photo.label}</div>
                    <div style={{ fontSize: 11, fontFamily: "sans-serif", color: "rgba(242,237,232,0.5)" }}>{photo.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function HistoryTab() {
  const [history, setHistory] = useState(loadHistory);
  const [expanded, setExpanded] = useState(null);
  const typeColors = { Monday: "#e8734a", Tuesday: "#f0c27f", Wednesday: "#c45c8a", Thursday: "#7cbf8a", Friday: "#e8734a", Saturday: "#7c5cbf", Sunday: "#8899aa" };
  const typeEmoji = { Monday: "🍑", Tuesday: "💪", Wednesday: "🔥", Thursday: "⚡", Friday: "🎯", Saturday: "✨" };
  const deleteEntry = (id) => { const updated = history.filter(h => h.id !== id); setHistory(updated); saveHistory(updated); if (expanded === id) setExpanded(null); };
  const grouped = history.reduce((acc, entry) => { const d = new Date(entry.timestamp); const day = d.getDay(); const monday = new Date(d); monday.setDate(d.getDate() - ((day + 6) % 7)); const weekKey = monday.toLocaleDateString("en-US", { month: "short", day: "numeric" }); if (!acc[weekKey]) acc[weekKey] = []; acc[weekKey].push(entry); return acc; }, {});
  const uniqueDates = [...new Set(history.map(h => new Date(h.timestamp).toDateString()))].sort((a, b) => new Date(b) - new Date(a));
  let streak = 0;
  if (uniqueDates.length > 0 && (uniqueDates[0] === new Date().toDateString() || uniqueDates[0] === new Date(Date.now() - 86400000).toDateString())) {
    let check = new Date(uniqueDates[0]);
    for (let i = 0; i < uniqueDates.length; i++) { if (new Date(uniqueDates[i]).toDateString() === check.toDateString()) { streak++; check.setDate(check.getDate() - 1); } else break; }
  }
  const dayCounts = history.reduce((acc, h) => { acc[h.day] = (acc[h.day] || 0) + 1; return acc; }, {});
  const mostFrequent = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0];
  return (
    <div style={{ padding: "24px 16px" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: "normal", margin: "0 0 6px" }}>Workout History</h2>
        <p style={{ fontSize: 13, color: "rgba(242,237,232,0.4)", fontFamily: "sans-serif", margin: 0 }}>Every session logged. Every rep counts.</p>
      </div>
      {history.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
          {[{ icon: "🏋️", label: "Total", val: history.length }, { icon: "🔥", label: "Streak", val: `${streak}d` }, { icon: "⭐", label: "Top Day", val: mostFrequent ? mostFrequent[0].slice(0, 3) : "-" }].map((s, i) => (
            <div key={i} style={{ background: "rgba(242,237,232,0.04)", borderRadius: 12, padding: "12px 10px", textAlign: "center", border: "1px solid rgba(242,237,232,0.08)" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 18, color: "#f2ede8" }}>{s.val}</div>
              <div style={{ fontSize: 10, fontFamily: "sans-serif", color: "rgba(242,237,232,0.35)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}
      {history.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 0", color: "rgba(242,237,232,0.2)", fontFamily: "sans-serif", fontSize: 14, lineHeight: 1.8 }}><div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>No workouts logged yet.<br />Complete a session to start your log.</div>
      ) : (
        Object.entries(grouped).map(([week, entries]) => (
          <div key={week} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(242,237,232,0.3)", fontFamily: "sans-serif", marginBottom: 10, paddingLeft: 2 }}>Week of {week} · {entries.length} session{entries.length !== 1 ? "s" : ""}</div>
            {entries.map(entry => (
              <div key={entry.id} style={{ marginBottom: 10, borderRadius: 14, background: "rgba(242,237,232,0.04)", border: "1px solid rgba(242,237,232,0.09)", overflow: "hidden" }}>
                <div onClick={() => setExpanded(expanded === entry.id ? null : entry.id)} style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${typeColors[entry.day] || "#e8734a"}20`, border: `1px solid ${typeColors[entry.day] || "#e8734a"}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{typeEmoji[entry.day] || "💪"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, color: "#f2ede8", marginBottom: 2 }}>{entry.day} - {entry.title}</div>
                    <div style={{ fontSize: 11, fontFamily: "sans-serif", color: "rgba(242,237,232,0.35)" }}>{entry.dateLabel} · {entry.setsCompleted} sets · {entry.duration}</div>
                  </div>
                  <div style={{ fontSize: 16, color: "rgba(242,237,232,0.2)", transform: expanded === entry.id ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>›</div>
                </div>
                {expanded === entry.id && (
                  <div style={{ padding: "0 16px 14px", borderTop: "1px solid rgba(242,237,232,0.06)" }}>
                    <div style={{ fontSize: 12, fontFamily: "sans-serif", color: "rgba(242,237,232,0.3)", marginBottom: 10, marginTop: 12 }}>Completed {entry.setsCompleted} of {entry.totalSets} sets</div>
                    <button onClick={() => deleteEntry(entry.id)} style={{ background: "none", border: "1px solid rgba(232,80,80,0.25)", borderRadius: 8, padding: "6px 14px", color: "rgba(232,80,80,0.5)", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer" }}>Delete entry</button>
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

export default function RecompApp() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [activeTab, setActiveTab] = useState("schedule");
  const [showTimer, setShowTimer] = useState(false);
  const [workouts, setWorkouts] = useState(DEFAULT_WORKOUTS);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const typeColors = { strength: "#e8734a", cardio: "#f0c27f", rest: "#8899aa" };
  const selectedWorkout = selectedDay ? workouts[selectedDay] : null;

  useEffect(() => { loadCustomWorkouts().then(data => { if (data) setWorkouts(data); setLoading(false); }).catch(() => setLoading(false)); }, []);

  const persistWorkouts = async (updated) => { setSaving(true); setWorkouts(updated); await saveCustomWorkouts(updated); setSaving(false); };
  const handleAddExercise = (si, exercise) => { const newEx = { name: exercise.name, sets: exercise.sets || 3, reps: exercise.reps || "12", suggestedWeight: exercise.suggestedWeight || "Moderate", note: exercise.note || "" }; const updated = { ...workouts, [selectedDay]: { ...workouts[selectedDay], sections: workouts[selectedDay].sections.map((sec, i) => i === si ? { ...sec, exercises: [...sec.exercises, newEx] } : sec) } }; persistWorkouts(updated); };
  const handleRemoveExercise = (si, ei) => { const updated = { ...workouts, [selectedDay]: { ...workouts[selectedDay], sections: workouts[selectedDay].sections.map((sec, i) => i === si ? { ...sec, exercises: sec.exercises.filter((_, j) => j !== ei) } : sec) } }; persistWorkouts(updated); };

  const markComplete = (day) => {
    const workout = workouts[day]; if (!workout) return;
    let setsCompleted = 0, totalSets = 0;
    workout.sections.forEach((sec, si) => { sec.exercises.forEach((ex, ei) => { const key = `recomp_${day}_s${si}_e${ei}`; const t = localStorage.getItem(key + "_total"); totalSets += t ? parseInt(t) : ex.sets; try { setsCompleted += (JSON.parse(localStorage.getItem(key + "_sets")) || []).length; } catch {} }); });
    let note = ""; try { note = localStorage.getItem(`recomp_${day}_s0_e0_note`) || ""; } catch {}
    saveHistory([{ id: Date.now(), day, title: workout.title, timestamp: new Date().toISOString(), dateLabel: new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }), setsCompleted, totalSets, duration: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }), note: note.split("\n").pop() || "" }, ...loadHistory()]);
  };

  const TABS = [{ id: "schedule", label: "Plan" }, { id: "history", label: "History" }, { id: "photos", label: "Photos" }, { id: "tips", label: "Tips" }];

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0d0d0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "rgba(242,237,232,0.4)", fontFamily: "sans-serif" }}><div style={{ fontSize: 32, marginBottom: 12 }}>🍑</div><div>Loading your program...</div></div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0f", color: "#f2ede8", fontFamily: "'Georgia', serif", position: "relative", overflowX: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse at 20% 20%, rgba(196,92,138,0.07) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(232,115,74,0.07) 0%, transparent 55%)" }} />
      {showTimer && <RestTimer onClose={() => setShowTimer(false)} />}
      {showAddModal !== null && <AddExerciseModal onAdd={(ex) => handleAddExercise(showAddModal, ex)} onClose={() => setShowAddModal(null)} />}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 520, margin: "0 auto", paddingBottom: 80 }}>

        <div style={{ padding: "36px 24px 20px", borderBottom: "1px solid rgba(242,237,232,0.08)" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c45c8a", marginBottom: 8, fontFamily: "sans-serif" }}>Body Recomposition</div>
          <h1 style={{ fontSize: 30, fontWeight: "normal", margin: 0, lineHeight: 1.2 }}>Sculpt & Lean<br /><span style={{ color: "#e8734a" }}>Program</span></h1>
          <p style={{ margin: "10px 0 0", fontSize: 13, color: "rgba(242,237,232,0.45)", fontFamily: "sans-serif", lineHeight: 1.5 }}>6-day split · 60 min strength · 30 min daily cardio · 10k steps</p>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid rgba(242,237,232,0.08)", padding: "0 24px" }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedDay(null); setEditMode(false); }}
              style={{ background: "none", border: "none", padding: "14px 0", marginRight: 22, fontSize: 13, fontFamily: "sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", color: activeTab === tab.id ? "#e8734a" : "rgba(242,237,232,0.35)", borderBottom: activeTab === tab.id ? "2px solid #e8734a" : "2px solid transparent", transition: "all 0.2s" }}>{tab.label}</button>
          ))}
        </div>

        {activeTab === "schedule" && !selectedDay && (
          <div style={{ padding: "24px 16px" }}>
            {/* Daily cardio reminder banner */}
            <div style={{ marginBottom: 16, padding: "14px 16px", background: "rgba(232,115,74,0.08)", borderRadius: 12, border: "1px solid rgba(232,115,74,0.2)", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 20 }}>🔥</div>
              <div>
                <div style={{ fontSize: 13, color: "#e8734a", marginBottom: 2 }}>Daily Cardio - Separate Session</div>
                <div style={{ fontSize: 11, fontFamily: "sans-serif", color: "rgba(242,237,232,0.4)" }}>25-30 min Stairmaster or incline walk · Every day · 10k steps goal</div>
              </div>
            </div>
            {weeklySchedule.map((item, i) => (
              <div key={i} onClick={() => item.type !== "rest" && setSelectedDay(item.day)}
                style={{ display: "flex", alignItems: "center", padding: "16px", marginBottom: 10, borderRadius: 14, background: "rgba(242,237,232,0.04)", border: "1px solid rgba(242,237,232,0.09)", cursor: item.type !== "rest" ? "pointer" : "default" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${typeColors[item.type]}20`, border: `1px solid ${typeColors[item.type]}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginRight: 14, flexShrink: 0 }}>{item.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontFamily: "sans-serif", color: typeColors[item.type], letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>{item.day}</div>
                  <div style={{ fontSize: 15, color: item.type === "rest" ? "rgba(242,237,232,0.25)" : "#f2ede8" }}>{item.type !== "rest" && workouts[item.day] ? workouts[item.day].title : item.focus}</div>
                </div>
                {item.type !== "rest" && <div style={{ color: "rgba(242,237,232,0.25)", fontSize: 18 }}>›</div>}
              </div>
            ))}
            <div style={{ marginTop: 8, padding: "18px 20px", background: "rgba(124,191,138,0.08)", borderRadius: 14, border: "1px solid rgba(124,191,138,0.2)" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#7cbf8a", fontFamily: "sans-serif", marginBottom: 12 }}>Weekly Structure</div>
              <div style={{ display: "flex" }}>
                {[{ label: "Strength", val: "60 min" }, { label: "Cardio", val: "30 min/day" }, { label: "Steps", val: "10k/day" }].map((s, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center", borderRight: i < 2 ? "1px solid rgba(242,237,232,0.1)" : "none" }}>
                    <div style={{ fontSize: 16, color: "#f2ede8" }}>{s.val}</div>
                    <div style={{ fontSize: 11, fontFamily: "sans-serif", color: "rgba(242,237,232,0.35)", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "schedule" && selectedDay && selectedWorkout && (
          <div style={{ padding: "20px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <button onClick={() => { setSelectedDay(null); setEditMode(false); }} style={{ background: "none", border: "none", color: "rgba(242,237,232,0.35)", fontSize: 13, fontFamily: "sans-serif", cursor: "pointer", padding: 0 }}>← Back</button>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setEditMode(e => !e)} style={{ display: "flex", alignItems: "center", gap: 6, background: editMode ? "rgba(196,92,138,0.2)" : "rgba(242,237,232,0.06)", border: `1px solid ${editMode ? "rgba(196,92,138,0.4)" : "rgba(242,237,232,0.15)"}`, borderRadius: 20, padding: "7px 14px", cursor: "pointer", color: editMode ? "#c45c8a" : "rgba(242,237,232,0.5)", fontFamily: "sans-serif", fontSize: 13 }}>
                  {editMode ? "✓ Done" : "✏️ Edit"}
                </button>
                {!editMode && <button onClick={() => setShowTimer(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(232,115,74,0.15)", border: "1px solid rgba(232,115,74,0.3)", borderRadius: 20, padding: "7px 14px", cursor: "pointer", color: "#e8734a", fontFamily: "sans-serif", fontSize: 13 }}>⏱ Timer</button>}
              </div>
            </div>
            {saving && <div style={{ textAlign: "center", padding: "8px", marginBottom: 12, background: "rgba(124,191,138,0.1)", borderRadius: 10, fontSize: 12, fontFamily: "sans-serif", color: "#7cbf8a" }}>Saving to cloud...</div>}
            {editMode && <div style={{ padding: "12px 14px", marginBottom: 16, background: "rgba(196,92,138,0.08)", borderRadius: 12, border: "1px solid rgba(196,92,138,0.2)", fontSize: 13, fontFamily: "sans-serif", color: "rgba(242,237,232,0.6)" }}>Tap <strong style={{ color: "#c45c8a" }}>-</strong> to remove · <strong style={{ color: "#c45c8a" }}>+ Add</strong> to add to any section</div>}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c45c8a", fontFamily: "sans-serif", marginBottom: 6 }}>{selectedDay}</div>
              <h2 style={{ fontSize: 24, fontWeight: "normal", margin: "0 0 8px" }}>{selectedWorkout.title}</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontFamily: "sans-serif", background: "rgba(232,115,74,0.15)", color: "#e8734a", border: "1px solid rgba(232,115,74,0.25)", borderRadius: 20, padding: "3px 10px" }}>⏱ {selectedWorkout.targetDuration}</span>
                {selectedDay !== "Wednesday" && <span style={{ fontSize: 11, fontFamily: "sans-serif", background: "rgba(232,115,74,0.08)", color: "#e8734a", border: "1px solid rgba(232,115,74,0.15)", borderRadius: 20, padding: "3px 10px" }}>🔥 + 30 min cardio separate</span>}
              </div>
              <p style={{ fontSize: 13, color: "rgba(242,237,232,0.45)", fontFamily: "sans-serif", margin: 0, lineHeight: 1.5 }}>💡 {selectedWorkout.goal}</p>
            </div>

            {selectedWorkout.sections.map((section, si) => (
              <div key={si} style={{ marginBottom: 22 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "sans-serif", color: section.color, paddingLeft: 12, borderLeft: `2px solid ${section.color}` }}>{section.name}</div>
                  {editMode && <button onClick={() => setShowAddModal(si)} style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(196,92,138,0.15)", border: "1px solid rgba(196,92,138,0.3)", borderRadius: 20, padding: "5px 12px", cursor: "pointer", color: "#c45c8a", fontFamily: "sans-serif", fontSize: 12 }}>+ Add</button>}
                </div>
                {section.exercises.map((ex, ei) => (
                  <ExerciseCard key={ei} ex={ex} exKey={`${selectedDay}_s${si}_e${ei}`} sectionColor={section.color} onTimerOpen={() => setShowTimer(true)} editMode={editMode} onRemove={() => handleRemoveExercise(si, ei)} />
                ))}
                {section.exercises.length === 0 && editMode && <div style={{ textAlign: "center", padding: "16px", border: "1px dashed rgba(242,237,232,0.1)", borderRadius: 12, color: "rgba(242,237,232,0.2)", fontFamily: "sans-serif", fontSize: 13 }}>No exercises - tap + Add</div>}
              </div>
            ))}

            {selectedWorkout.cardioNote && !editMode && (
              <div style={{ marginBottom: 10, padding: "16px 18px", background: "rgba(232,115,74,0.08)", borderRadius: 14, border: "1px solid rgba(232,115,74,0.2)", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 24 }}>{selectedWorkout.cardioNote.emoji}</div>
                <div>
                  <div style={{ fontSize: 14, color: "#e8734a", marginBottom: 3 }}>{selectedWorkout.cardioNote.label}</div>
                  <div style={{ fontSize: 12, color: "rgba(242,237,232,0.4)", fontFamily: "sans-serif", lineHeight: 1.5 }}>{selectedWorkout.cardioNote.detail}</div>
                </div>
              </div>
            )}

            {!editMode && (
              <>
                <button onClick={() => { markComplete(selectedDay); setActiveTab("history"); setSelectedDay(null); }}
                  style={{ width: "100%", marginTop: 6, padding: "14px 0", borderRadius: 14, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #e8734a, #c45c8a)", color: "#fff", fontFamily: "sans-serif", fontSize: 15, fontWeight: "bold", letterSpacing: "0.04em" }}>
                  ✓ Mark Workout Complete
                </button>
                <div onClick={() => { setActiveTab("photos"); setSelectedDay(null); }}
                  style={{ marginTop: 8, padding: "16px 18px", background: "rgba(196,92,138,0.08)", borderRadius: 14, border: "1px solid rgba(196,92,138,0.2)", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 26 }}>📸</div>
                  <div><div style={{ fontSize: 14, color: "#f2ede8", marginBottom: 2 }}>Log a progress photo</div><div style={{ fontSize: 12, color: "rgba(242,237,232,0.4)", fontFamily: "sans-serif" }}>Tap to add today's check-in</div></div>
                  <div style={{ color: "rgba(242,237,232,0.25)", fontSize: 18, marginLeft: "auto" }}>›</div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "history" && <HistoryTab />}
        {activeTab === "photos" && <PhotosTab />}

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
                  <div><div style={{ fontSize: 15, marginBottom: 5, color: "#f2ede8" }}>{tip.title}</div><div style={{ fontSize: 13, color: "rgba(242,237,232,0.5)", fontFamily: "sans-serif", lineHeight: 1.6 }}>{tip.body}</div></div>
                </div>
              </div>
            ))}
            <div style={{ padding: "20px 18px", background: "rgba(124,191,138,0.08)", borderRadius: 14, border: "1px solid rgba(124,191,138,0.2)", marginTop: 4 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#7cbf8a", fontFamily: "sans-serif", marginBottom: 14 }}>Supabase SQL - Run This Once</div>
              <div style={{ background: "rgba(13,13,15,0.6)", borderRadius: 10, padding: "12px 14px", fontSize: 11, fontFamily: "monospace", color: "rgba(242,237,232,0.6)", lineHeight: 1.8, wordBreak: "break-all" }}>
                CREATE TABLE IF NOT EXISTS custom_workouts (id INTEGER PRIMARY KEY, workout_data TEXT, updated_at TIMESTAMPTZ DEFAULT NOW());
              </div>
              <div style={{ fontSize: 11, fontFamily: "sans-serif", color: "rgba(242,237,232,0.3)", marginTop: 10 }}>Run in Supabase SQL Editor to enable workout saving</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
