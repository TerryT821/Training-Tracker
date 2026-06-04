import { useState, useEffect } from "react";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const TRAINING_START = new Date("2026-06-06");
const RACE_DATE = new Date("2026-11-26");

// Generate all scheduled workout days (Mon–Sat) from start to race
function generateScheduledDays() {
  const days = [];
  const cursor = new Date(TRAINING_START);
  while (cursor <= RACE_DATE) {
    const dow = cursor.getDay(); // 0=Sun
    if (dow !== 0) { // exclude Sundays
      days.push(cursor.toISOString().split("T")[0]);
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}
const ALL_SCHEDULED_DAYS = generateScheduledDays();

function getWeekKey(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const mon = new Date(d.setDate(diff));
  return mon.toISOString().split("T")[0];
}

function getMonthKey(dateStr) {
  return dateStr.slice(0, 7);
}

function toDateStr(d) {
  return d.toISOString().split("T")[0];
}

function today() {
  return toDateStr(new Date());
}

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const feasibilityData = {
  analysis: [
    { label: "Target", value: "Sub-30:00 = 6:19/mile pace over 4.737 miles" },
    { label: "Race Date", value: "Nov 26, 2026 — 25 weeks from June 6 start" },
    { label: "Athletic Base", value: "3:27 marathon (2014) + collegiate rowing = high VO₂ ceiling. These don't disappear." },
    { label: "The Gap", value: "4 years deconditioned. Connective tissue adapts slower than lungs. That gap is the whole plan." },
    { label: "2026 Realistic", value: "31:00–33:00 is the honest target. Sub-30 is possible with consistency + zero injuries." },
    { label: "2027 Verdict", value: "Sub-30 becomes the floor with a full year of base. 28:xx is realistic." },
    { label: "Biggest Risks", value: "IT band + shin splints history. Trying to run too much, too soon. Family schedule collapse." },
    { label: "Course Note", value: "Mile 2 is a brutal, unrelenting uphill on Highland Street. You must build aerobic reserve to survive it without redlining." },
  ],
  probabilities: [
    { outcome: "Under 35:00", pct: 95, color: "#4ade80" },
    { outcome: "Under 33:00", pct: 75, color: "#86efac" },
    { outcome: "Under 32:00", pct: 50, color: "#facc15" },
    { outcome: "Under 31:00", pct: 30, color: "#fb923c" },
    { outcome: "Under 30:00", pct: 15, color: "#ef4444" },
  ],
};

const rowTargets = [
  { label: "Steady State", split: "2:05–2:12 / 500m", spm: "18–22 SPM", color: "#4ade80", intent: "Completely conversational. As a former rower, keep rate low and power high. Builds the deep aerobic base to run a fast 5-miler without destroying joints.", sessions: "Mon + Fri (Phase 1)" },
  { label: "Threshold", split: "1:52–1:56 / 500m", spm: "26–28 SPM", color: "#facc15", intent: "Comfortably hard. Breathing labored, one-word answers only. Directly trains your body to sustain 6:19/mile running pace.", sessions: "Wed Tempo (Phases 1–2)" },
  { label: "Highland St. Simulation", split: "1:46–1:50 / 500m", spm: "28–32 SPM", color: "#ef4444", intent: "Mile 2 of the MRR is a relentless climb. These short, high-intensity intervals simulate the exact cardiovascular strain of Highland Street. Non-negotiable for race prep.", sessions: "Sat intervals (Phase 1), then transitions to running" },
];

const phases = [
  {
    id: 1, name: "Phase 1", subtitle: "Foundation",
    weeks: "Weeks 1–6 (Jun 6 – Jul 18)", color: "#4ade80",
    focus: "Rebuild aerobic engine on the rower. Zero running — protect connective tissue. Begin tibialis raises Day 1. Build the 5am habit.",
    weeklyHours: "3–4 hrs",
    days: [
      { day: "Mon", label: "Aerobic Row + Core", duration: "35 min", details: "20 min steady state row (18–20 spm, target 2:05–2:12/500m split). 15 min: dead bugs, glute bridges, bird dogs, plank holds." },
      { day: "Tue", label: "Strength + Tibialis", duration: "30 min", details: "Goblet squats (30lb), Romanian deadlifts, single-leg glute bridges, push-ups. Finish with 3×25 tibialis raises (stand back against wall, feet 18\" out, flex toes up toward shins, hold 1 sec, lower slowly). Starts Day 1." },
      { day: "Wed", label: "Threshold Row", duration: "25 min", details: "Warm-up 5 min easy. 4×4 min at threshold (target 1:52–1:56/500m, 26–28 spm) with 2 min easy paddle. Cool-down 4 min." },
      { day: "Thu", label: "Active Recovery + Flexibility", duration: "20 min", details: "Hip flexor stretch, pigeon pose, calf/Achilles chain, IT band foam roll (roll glute medius above knee — NOT directly on the lateral knee track), thoracic spine mobility." },
      { day: "Fri", label: "Aerobic Row", duration: "35 min", details: "Recovery pace. Easy, smooth paddling. Target 2:12–2:15/500m. Heart rate low. Flush the week." },
      { day: "Sat", label: "Highland Street Simulation", duration: "40 min", details: "10 min warm-up row (steady state). 5×2 min hard sprint (target 1:46–1:50/500m, 28–32 spm) with 90 sec easy recovery. 12 min steady state to simulate running after the hill. 5 min cool-down. Saturday only — no 6:15 constraint." },
      { day: "Sun", label: "OFF — Family Day", duration: "—", details: "" },
    ],
    flexibilityNotes: ["Tibialis raises 3×25 every Tue/Thu — start this Day 1, not Phase 2", "Morning: 5 min hip flexor + calf stretch before coffee", "Evening: 5 min legs-up-the-wall after kids' bedtime", "Foam roll: glute medius (above knee) — not directly on the lateral IT band track"],
  },
  {
    id: 2, name: "Phase 2", subtitle: "Run Introduction",
    weeks: "Weeks 7–12 (Jul 19 – Aug 29)", color: "#facc15",
    focus: "Begin walk-to-run intervals. Soft surfaces only (trail, track, grass) for first 4 weeks — no concrete. Hip & calf prehab non-negotiable.",
    weeklyHours: "4–5 hrs",
    days: [
      { day: "Mon", label: "Run Intervals", duration: "30 min", details: "Walk 2 min / jog 2 min × 7 rounds. Soft surface — rail trail, track, or grass. Avoid concrete for first 4 weeks of running. Very easy jogging pace — 10–11 min/mile." },
      { day: "Tue", label: "Strength + Tibialis", duration: "30 min", details: "Step-ups, single-leg RDL (30lb), lateral band walks (clamshells), push-ups, dumbbell row. 3×10. Finish with 3×25 tibialis raises. Running-specific hip stability." },
      { day: "Wed", label: "Row Tempo", duration: "30 min", details: "5 easy / 18 min @ threshold effort (1:52–1:56/500m) / 7 easy. Maintains aerobic fitness while legs adapt to running load." },
      { day: "Thu", label: "Run + Mobility", duration: "35 min", details: "20 min easy jog (continuous by weeks 9–10). Soft surface. Follow with 15 min: eccentric calf lowers, IT band stretch, quad/hip flexor." },
      { day: "Fri", label: "Cross-Train Row or Rest", duration: "20 min", details: "Light 20 min aerobic row if energy allows. Skip entirely if legs are fatigued — recovery is training." },
      { day: "Sat", label: "Long Run", duration: "35 min", details: "3–4 miles at easy pace. Soft surface preferred. Begin road running only once shins are symptom-free for 2+ weeks." },
      { day: "Sun", label: "OFF — Family Day", duration: "—", details: "" },
    ],
    flexibilityNotes: ["Tibialis raises continue every Tue/Thu — 3×25, daily if shin tightness appears", "Pre-run: leg swings, hip circles, ankle rolls (3 min)", "Post-run always: calf-to-Achilles stretch, IT band stretch, quad/hip flexor", "Foam roll: glute medius above knee, calves — NOT the lateral knee track"],
  },
  {
    id: 3, name: "Phase 3", subtitle: "Build",
    weeks: "Weeks 13–18 (Aug 30 – Oct 10)", color: "#f97316",
    focus: "Running becomes primary. Introduce pace work. Strength shifts to maintenance. Row for cross-training only. Road running permitted if shins are healthy.",
    weeklyHours: "5–6 hrs",
    days: [
      { day: "Mon", label: "Easy Run", duration: "35 min", details: "Continuous easy run at conversational pace (~9:30–10:30/mi). Relaxed form, no speed pressure." },
      { day: "Tue", label: "Track / Interval Run", duration: "35 min", details: "Warm-up 8 min easy. 4–5 × 400m at 6:00–6:20/mi pace with 90 sec rest. Cool-down 5 min. This is your sub-30 pace — learn what it feels like." },
      { day: "Wed", label: "Row Cross-Train", duration: "30 min", details: "Aerobic row at easy effort (2:05–2:12/500m). Active recovery — keeps aerobic engine without adding leg stress." },
      { day: "Thu", label: "Tempo Run", duration: "35 min", details: "8 min easy / 15 min @ 7:00–7:20/mi (comfortably hard) / 7 min easy. Simulate sustained race effort." },
      { day: "Fri", label: "Strength + Mobility", duration: "35 min", details: "Maintenance strength: step-ups, split squats, single-leg deadlifts, tibialis raises. 3×10. Follow with full hip mobility circuit. No heavy loading." },
      { day: "Sat", label: "Long Run", duration: "45–60 min", details: "Saturday window only — longer session permitted. Build to 5–6 miles. Easy pace throughout. Include a hill segment to simulate Highland Street by week 16." },
      { day: "Sun", label: "OFF — Family Day", duration: "—", details: "" },
    ],
    flexibilityNotes: ["Post-long run: 15 min full-body stretch — mandatory, not optional", "Foam roll: glute medius + calves after every run", "Tibialis raises continue 2×/week as maintenance", "Consider monthly sports massage if budget allows"],
  },
  {
    id: 4, name: "Phase 4", subtitle: "Race-Specific",
    weeks: "Weeks 19–24 (Oct 11 – Nov 21)", color: "#ef4444",
    focus: "Sharpen at race pace. Simulate Highland Street. Taper intelligently from Week 22. Protect the body.",
    weeklyHours: "5 hrs → reducing",
    days: [
      { day: "Mon", label: "Easy Recovery Run", duration: "35 min", details: "Very easy. Flush legs. No ego. ~10:00/mi or slower." },
      { day: "Tue", label: "Race-Pace Intervals", duration: "40 min", details: "Warm-up 10 min easy. 5 × 800m @ sub-6:20 pace with 90 sec rest. Cool-down 5 min. This is what sub-30 feels like." },
      { day: "Wed", label: "Row or Rest", duration: "25 min", details: "Light aerobic row only. Sleep > workout in this phase. Listen to your body." },
      { day: "Thu", label: "Tempo Run", duration: "40 min", details: "10 min easy / 20 min @ 6:30–6:45/mi (comfortably hard) / 10 min easy. Week 22+: drop to 12 min tempo segment (taper begins)." },
      { day: "Fri", label: "Strides + Mobility", duration: "30 min", details: "15 min easy jog + 4–6 × 20-sec strides at race pace. Full mobility routine. Feel sharp." },
      { day: "Sat", label: "Long Run → Tune-Up Race", duration: "40–55 min", details: "Weeks 19–22: 5–6 mi easy with hill work (simulate Highland St). Week 23: local CT 5K tune-up race. Week 24: 30 min easy only (taper — protect legs)." },
      { day: "Sun", label: "OFF — Family Day", duration: "—", details: "" },
    ],
    flexibilityNotes: ["Race week: 10 min morning mobility every single day", "Night before race: light stretch, nothing new", "Race morning warmup: 10 min easy jog + dynamic drills"],
  },
];

const dailyHabits = [
  { time: "4:30–5:00am", habit: "Wake-up prep", detail: "Alarm at 4:30am. 30 min to get dressed, take dogs out, set up equipment. This time is not available for working out." },
  { time: "5:00–5:45am", habit: "Workout", detail: "45 min max. Equipment already set up. Start at 5:00 — stop at 5:45. Every session is designed for this window." },
  { time: "5:45–6:15am", habit: "Shower + dress", detail: "30 min to shower and get ready. Ready for kids at 6:15am." },
  { time: "Morning", habit: "CEO desk stretch", detail: "Step one foot back into a deep lunge from your desk chair. Squeeze rear glute, tuck pelvis. 60 sec/side. Twice a day. Rowers and desk-sitters get chronically short hip flexors — this reverses it." },
  { time: "Desk breaks", habit: "Tibialis wall raises", detail: "30 sec standing against a wall, flex toes up. Every 2 hours. Keeps shin tissue loaded between workouts." },
  { time: "5:30–7:30pm", habit: "Family — protected", detail: "No workout here. Dinner, bath, bedtime. Sacred." },
  { time: "7:45pm+", habit: "Foam roll + couch stretch", detail: "10 min passively: IT band (roll glute medius above knee), calves, thoracic spine. Couch stretch 2 min/side." },
];

const injuryPrevention = [
  { issue: "IT Band Syndrome", prevention: "Foam roll the glute medius (meaty hip muscle above the knee) — NOT directly on the lateral knee track. Lateral band walks + clamshells to strengthen glute medius. Never increase weekly mileage >10%. Pain = 7 days of rowing only." },
  { issue: "Shin Splints", prevention: "Tibialis anterior raises starting Day 1 — 3×25, Tue/Thu. Soft surfaces ONLY for first 4 weeks of running. Eccentric calf lowers 3×/week. Gait analysis + proper shoes before Phase 2." },
  { issue: "General Overuse", prevention: "Row replaces running whenever legs are fatigued. Never two hard sessions back-to-back. Sleep is the most underrated recovery tool you have — protect it." },
  { issue: "Low Back (rower)", prevention: "Engage core before every stroke. Never round lower back at the catch. Prioritize rate over power in Phases 1–2." },
];

// ─────────────────────────────────────────────
// STORAGE HELPERS
// ─────────────────────────────────────────────

async function loadLog() {
  try {
    const result = await window.storage.get("workout-log");
    return result ? JSON.parse(result.value) : {};
  } catch { return {}; }
}

async function saveLog(log) {
  try {
    await window.storage.set("workout-log", JSON.stringify(log));
  } catch {}
}

// ─────────────────────────────────────────────
// TRACKING HELPERS
// ─────────────────────────────────────────────

function computeStats(log) {
  const todayStr = today();
  const pastScheduled = ALL_SCHEDULED_DAYS.filter(d => d <= todayStr);

  const counts = { rx: 0, modified: 0, skipped: 0, unlogged: 0 };
  pastScheduled.forEach(d => {
    const s = log[d];
    if (!s) counts.unlogged++;
    else if (s.status === "rx") counts.rx++;
    else if (s.status === "modified") counts.modified++;
    else if (s.status === "skipped") counts.skipped++;
  });

  const completed = counts.rx + counts.modified;
  const total = pastScheduled.length;
  const pctOverall = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Week stats
  const weekStart = getWeekKey(todayStr);
  const weekDays = pastScheduled.filter(d => getWeekKey(d) === weekStart);
  const weekCompleted = weekDays.filter(d => log[d] && (log[d].status === "rx" || log[d].status === "modified")).length;

  // Month stats
  const monthKey = getMonthKey(todayStr);
  const monthDays = pastScheduled.filter(d => getMonthKey(d) === monthKey);
  const monthCompleted = monthDays.filter(d => log[d] && (log[d].status === "rx" || log[d].status === "modified")).length;

  // Streak — consecutive days back from today with any completion
  let streak = 0;
  const sortedPast = [...pastScheduled].reverse();
  for (const d of sortedPast) {
    const s = log[d];
    if (s && (s.status === "rx" || s.status === "modified")) streak++;
    else if (!s && d === todayStr) continue; // today not yet logged
    else break;
  }

  // Days to race
  const daysToRace = Math.ceil((RACE_DATE - new Date()) / (1000 * 60 * 60 * 24));

  return {
    completed, total, pctOverall, counts,
    weekCompleted, weekTotal: weekDays.length,
    monthCompleted, monthTotal: monthDays.length,
    streak, daysToRace,
    totalScheduled: ALL_SCHEDULED_DAYS.length,
  };
}

function getCurrentWorkout() {
  const todayStr = today();
  const dow = new Date().getDay();
  if (dow === 0) return null; // Sunday
  // Find which phase we're in
  const phaseRanges = [
    { phase: phases[0], start: new Date("2026-06-06"), end: new Date("2026-07-18") },
    { phase: phases[1], start: new Date("2026-07-19"), end: new Date("2026-08-29") },
    { phase: phases[2], start: new Date("2026-08-30"), end: new Date("2026-10-10") },
    { phase: phases[3], start: new Date("2026-10-11"), end: new Date("2026-11-21") },
  ];
  const now = new Date();
  const currentPhase = phaseRanges.find(r => now >= r.start && now <= r.end);
  if (!currentPhase) return null;
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const dayName = dayNames[dow];
  const workout = currentPhase.phase.days.find(d => d.day === dayName);
  return workout ? { ...workout, phaseName: currentPhase.phase.name, phaseColor: currentPhase.phase.color } : null;
}

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

function Tag({ children, color }) {
  return (
    <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
      {children}
    </span>
  );
}

// ── TODAY / LOG ──────────────────────────────

function TodaySection({ log, onLog }) {
  const todayStr = today();
  const existing = log[todayStr];
  const workout = getCurrentWorkout();
  const dow = new Date().getDay();

  const statusConfig = {
    rx:       { label: "Rx",       emoji: "✓",  bg: "#4ade8022", border: "#4ade8066", color: "#4ade80", desc: "Completed as programmed" },
    modified: { label: "Modified", emoji: "~",  bg: "#facc1522", border: "#facc1566", color: "#facc15", desc: "Completed with adjustments" },
    skipped:  { label: "Skipped",  emoji: "✕",  bg: "#ef444422", border: "#ef444466", color: "#ef4444", desc: "Did not complete" },
  };

  if (dow === 0) {
    return (
      <section style={{ marginBottom: 48 }}>
        <h2 style={styles.sectionHeader}><span style={{ color: "#4ade80" }}>07</span> Today</h2>
        <div style={{ ...styles.card, borderColor: "#4ade8033", textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏡</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#f0f0f0", fontFamily: "'Barlow Condensed', sans-serif" }}>Sunday — Rest Day</div>
          <div style={{ fontSize: 14, color: "#888", marginTop: 6 }}>Family time. You've earned it.</div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={styles.sectionHeader}><span style={{ color: "#4ade80" }}>07</span> Today</h2>

      {workout ? (
        <div style={{ ...styles.card, borderColor: workout.phaseColor + "44", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: workout.phaseColor, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", marginBottom: 4 }}>{workout.phaseName.toUpperCase()} · TODAY</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "'Barlow Condensed', sans-serif" }}>{workout.label}</div>
            </div>
            <Tag color={workout.phaseColor}>{workout.duration}</Tag>
          </div>
          <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6, borderTop: "1px solid #222", paddingTop: 12 }}>{workout.details}</div>
        </div>
      ) : (
        <div style={{ ...styles.card, marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: "#888" }}>Training starts June 6, 2026. Check back then!</div>
        </div>
      )}

      {/* Log buttons */}
      <div style={{ ...styles.card, borderColor: "#2a2a2a" }}>
        <div style={{ fontSize: 12, color: "#888", fontFamily: "'DM Mono', monospace", marginBottom: 14 }}>LOG TODAY'S WORKOUT</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {Object.entries(statusConfig).map(([key, cfg]) => {
            const isSelected = existing?.status === key;
            return (
              <button
                key={key}
                onClick={() => onLog(todayStr, key)}
                style={{
                  background: isSelected ? cfg.bg : "transparent",
                  border: `2px solid ${isSelected ? cfg.border : "#2a2a2a"}`,
                  borderRadius: 10, padding: "14px 8px", cursor: "pointer",
                  transition: "all 0.15s", textAlign: "center",
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 4, color: isSelected ? cfg.color : "#555" }}>{cfg.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: isSelected ? cfg.color : "#666", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}>{cfg.label}</div>
                <div style={{ fontSize: 11, color: isSelected ? cfg.color + "cc" : "#444", marginTop: 2 }}>{cfg.desc}</div>
              </button>
            );
          })}
        </div>
        {existing && (
          <div style={{ marginTop: 14, padding: "10px 14px", background: statusConfig[existing.status].bg, borderRadius: 8, border: `1px solid ${statusConfig[existing.status].border}` }}>
            <div style={{ fontSize: 13, color: statusConfig[existing.status].color, fontFamily: "'DM Mono', monospace" }}>
              Logged: {statusConfig[existing.status].label} {existing.note ? `— "${existing.note}"` : ""}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── HISTORY / STATS ──────────────────────────

function StatBox({ label, value, sub, color = "#4ade80", big = false }) {
  return (
    <div style={{ ...styles.card, borderColor: color + "33", textAlign: "center", padding: "20px 12px" }}>
      <div style={{ fontSize: big ? 42 : 32, fontWeight: 800, color, fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#888", marginTop: 6, fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em" }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: color + "99", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function ConsistencyBar({ completed, total, color, label }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ fontSize: 13, color: "#d0d0d0" }}>{label}</div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color }}>
          {completed}/{total} <span style={{ color: "#555" }}>sessions</span>
        </div>
      </div>
      <div style={{ height: 8, background: "#1e1e1e", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

function HistorySection({ log, onLog }) {
  const stats = computeStats(log);
  const todayStr = today();

  const statusConfig = {
    rx:       { color: "#4ade80", label: "Rx",       symbol: "✓" },
    modified: { color: "#facc15", label: "Modified", symbol: "~" },
    skipped:  { color: "#ef4444", label: "Skipped",  symbol: "✕" },
  };

  // Build calendar — last 6 weeks of scheduled days
  const recentDays = ALL_SCHEDULED_DAYS.filter(d => d <= todayStr).slice(-36);

  // Motivational message
  const getMotivation = () => {
    if (stats.streak >= 10) return { msg: "Unstoppable. Double-digit streak.", color: "#4ade80" };
    if (stats.streak >= 5) return { msg: `${stats.streak}-session streak. Momentum is building.`, color: "#4ade80" };
    if (stats.streak >= 2) return { msg: `${stats.streak} in a row. Keep the chain going.`, color: "#86efac" };
    if (stats.completed >= 20) return { msg: `${stats.completed} sessions banked. That's real fitness.`, color: "#facc15" };
    if (stats.completed >= 5) return { msg: `${stats.completed} sessions in. The habit is forming.`, color: "#facc15" };
    return { msg: "Every session counts. One at a time.", color: "#888" };
  };
  const motivation = getMotivation();

  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={styles.sectionHeader}><span style={{ color: "#4ade80" }}>08</span> Progress & History</h2>

      {/* Motivational banner */}
      <div style={{ ...styles.card, borderColor: motivation.color + "44", background: motivation.color + "0a", marginBottom: 20, textAlign: "center", padding: "18px 20px" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: motivation.color, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.04em" }}>{motivation.msg}</div>
      </div>

      {/* Big stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        <StatBox label="SESSIONS DONE" value={stats.completed} sub="Rx + Modified" color="#4ade80" big />
        <StatBox label="STREAK" value={stats.streak} sub="consecutive" color="#facc15" />
        <StatBox label="DAYS TO RACE" value={stats.daysToRace > 0 ? stats.daysToRace : "🏁"} sub="Nov 26, 2026" color="#f97316" />
        <StatBox label="Rx SESSIONS" value={stats.counts.rx} sub="as programmed" color="#86efac" />
      </div>

      {/* Consistency bars */}
      <div style={{ ...styles.card, marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "#888", fontFamily: "'DM Mono', monospace", marginBottom: 16 }}>CONSISTENCY</div>
        <ConsistencyBar completed={stats.weekCompleted} total={stats.weekTotal} color="#4ade80" label="This Week" />
        <ConsistencyBar completed={stats.monthCompleted} total={stats.monthTotal} color="#facc15" label="This Month" />
        <ConsistencyBar completed={stats.completed} total={stats.total} color="#f97316" label="Since Day 1" />
        <div style={{ marginTop: 16, padding: "10px 14px", background: "#161616", borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: "#666", fontFamily: "'DM Mono', monospace" }}>
            Modified workouts count as completions. Showing up matters most.
          </div>
        </div>
      </div>

      {/* Recent calendar */}
      <div style={{ ...styles.card, marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "#888", fontFamily: "'DM Mono', monospace", marginBottom: 14 }}>RECENT SESSIONS</div>
        {recentDays.length === 0 ? (
          <div style={{ fontSize: 13, color: "#555" }}>Training starts June 6, 2026.</div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {recentDays.map(d => {
              const entry = log[d];
              const isToday = d === todayStr;
              const cfg = entry ? statusConfig[entry.status] : null;
              const dateObj = new Date(d + "T12:00:00");
              const dayLabel = dateObj.toLocaleDateString("en-US", { weekday: "short" });
              const dateLabel = dateObj.toLocaleDateString("en-US", { month: "numeric", day: "numeric" });
              return (
                <div
                  key={d}
                  title={`${dateLabel} — ${entry ? cfg.label : "Not logged"}`}
                  style={{
                    width: 44, height: 44, borderRadius: 8, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", cursor: "default",
                    background: cfg ? cfg.color + "18" : "#161616",
                    border: `1px solid ${isToday ? "#fff" : cfg ? cfg.color + "55" : "#222"}`,
                    boxShadow: isToday ? "0 0 0 2px #ffffff33" : "none",
                  }}
                >
                  <div style={{ fontSize: 9, color: cfg ? cfg.color : "#444", fontFamily: "'DM Mono', monospace" }}>{dayLabel}</div>
                  <div style={{ fontSize: 13, color: cfg ? cfg.color : "#333", fontWeight: 700 }}>{cfg ? cfg.symbol : "·"}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Log any past day */}
      <PastDayLogger log={log} onLog={onLog} statusConfig={statusConfig} />
    </section>
  );
}

function PastDayLogger({ log, onLog, statusConfig }) {
  const [selectedDate, setSelectedDate] = useState(today());
  const existing = log[selectedDate];

  return (
    <div style={{ ...styles.card, borderColor: "#2a2a2a" }}>
      <div style={{ fontSize: 12, color: "#888", fontFamily: "'DM Mono', monospace", marginBottom: 14 }}>LOG A SESSION</div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          style={{ background: "#161616", border: "1px solid #333", borderRadius: 6, padding: "6px 10px", color: "#e0e0e0", fontFamily: "'DM Mono', monospace", fontSize: 13 }}
        />
        {existing && <Tag color={statusConfig[existing.status].color}>{statusConfig[existing.status].label}</Tag>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const isSelected = existing?.status === key;
          return (
            <button
              key={key}
              onClick={() => onLog(selectedDate, key)}
              style={{
                background: isSelected ? cfg.color + "22" : "transparent",
                border: `1px solid ${isSelected ? cfg.color + "66" : "#2a2a2a"}`,
                borderRadius: 8, padding: "10px 8px", cursor: "pointer", textAlign: "center",
              }}
            >
              <div style={{ fontSize: 16, color: isSelected ? cfg.color : "#555" }}>{cfg.symbol}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: isSelected ? cfg.color : "#555", fontFamily: "'Barlow Condensed', sans-serif" }}>{cfg.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── EXISTING SECTIONS ────────────────────────

function FeasibilitySection() {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={styles.sectionHeader}><span style={{ color: "#4ade80" }}>01</span> Feasibility Assessment</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ ...styles.card, borderColor: "#4ade8044" }}>
          <div style={{ fontSize: 11, color: "#4ade80", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", marginBottom: 8 }}>2026 VERDICT</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#f0f0f0", fontFamily: "'Barlow Condensed', sans-serif" }}>POSSIBLE</div>
          <div style={{ fontSize: 13, color: "#999", marginTop: 4 }}>honest target: 31:00–33:00</div>
        </div>
        <div style={{ ...styles.card, borderColor: "#facc1544" }}>
          <div style={{ fontSize: 11, color: "#facc15", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", marginBottom: 8 }}>2027 VERDICT</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#f0f0f0", fontFamily: "'Barlow Condensed', sans-serif" }}>HIGH CONFIDENCE</div>
          <div style={{ fontSize: 13, color: "#999", marginTop: 4 }}>sub-30 becomes the floor</div>
        </div>
      </div>
      <div style={{ ...styles.card, marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: "#888", fontFamily: "'DM Mono', monospace", marginBottom: 14 }}>2026 FINISH TIME PROBABILITIES</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {feasibilityData.probabilities.map((p, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 40px 1fr", gap: 12, alignItems: "center" }}>
              <div style={{ fontSize: 13, color: "#d0d0d0" }}>{p.outcome}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: p.color, fontFamily: "'DM Mono', monospace" }}>{p.pct}%</div>
              <div style={{ height: 6, background: "#1e1e1e", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${p.pct}%`, height: "100%", background: p.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={styles.card}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {feasibilityData.analysis.map((item, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 12, alignItems: "start", borderBottom: i < feasibilityData.analysis.length - 1 ? "1px solid #2a2a2a" : "none", paddingBottom: i < feasibilityData.analysis.length - 1 ? 14 : 0 }}>
              <div style={{ fontSize: 11, color: "#888", fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em", paddingTop: 2 }}>{item.label.toUpperCase()}</div>
              <div style={{ fontSize: 14, color: "#d0d0d0", lineHeight: 1.5 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...styles.card, marginTop: 16, borderColor: "#facc1533", background: "#facc1508" }}>
        <div style={{ fontSize: 12, color: "#facc15", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>⚡ THE MATH</div>
        <div style={{ fontSize: 14, color: "#c0c0c0", lineHeight: 1.6 }}>
          Sub-30:00 over 4.737 miles = <strong style={{ color: "#fff" }}>6:19/mile pace</strong>. Your 3:27 marathon (2014) = 7:55/mile. You had the aerobic ceiling. Treat 2026 as the proof-of-concept year and 2027 as the guarantee. <strong style={{ color: "#fff" }}>Taking 2026 pressure off is the single best thing you can do for your shin and IT band health.</strong>
        </div>
      </div>
    </section>
  );
}

function RowTargetsSection() {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={styles.sectionHeader}><span style={{ color: "#4ade80" }}>02</span> Concept 2 Split Targets</h2>
      <div style={{ ...styles.card, marginBottom: 16, borderColor: "#4ade8022", background: "#4ade800a" }}>
        <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6 }}>
          Set your Concept 2 monitor to <strong style={{ color: "#fff" }}>Projected Finish / Split view</strong>. These targets translate your sub-30 running goal into rowing splits you can actually see and hit. Over-rowing on easy days causes IT band flare-ups — stay in your zone.
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {rowTargets.map((r, i) => (
          <div key={i} style={{ ...styles.card, borderColor: r.color + "33" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: r.color, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", marginBottom: 4 }}>{r.label.toUpperCase()}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "'Barlow Condensed', sans-serif" }}>{r.split}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Tag color={r.color}>{r.spm}</Tag>
                <div style={{ fontSize: 11, color: "#666", fontFamily: "'DM Mono', monospace", marginTop: 6 }}>{r.sessions}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#999", lineHeight: 1.5, borderTop: "1px solid #222", paddingTop: 10 }}>{r.intent}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PhaseCard({ phase, isActive, onClick }) {
  return (
    <div onClick={onClick} style={{ ...styles.card, borderColor: isActive ? phase.color + "88" : "#2a2a2a", background: isActive ? phase.color + "0a" : "#111", cursor: "pointer", transition: "all 0.2s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 11, color: phase.color, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}>{phase.name.toUpperCase()}</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#f0f0f0", fontFamily: "'Barlow Condensed', sans-serif" }}>{phase.subtitle}</div>
        </div>
        <Tag color={phase.color}>{phase.weeklyHours}</Tag>
      </div>
      <div style={{ fontSize: 12, color: "#aaa", marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>{phase.weeks}</div>
      <div style={{ fontSize: 13, color: "#999", lineHeight: 1.5 }}>{phase.focus}</div>
    </div>
  );
}

function PhaseDetail({ phase }) {
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: phase.color, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 16 }}>
        Weekly Schedule — {phase.name}: {phase.subtitle}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {phase.days.map((d, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "48px 160px 64px 1fr", gap: 12, alignItems: "start", padding: "12px 16px", background: d.day === "Sun" ? "#0a0a0a" : "#161616", borderRadius: 8, border: `1px solid ${d.day === "Sun" ? "#1a1a1a" : "#222"}`, opacity: d.day === "Sun" ? 0.5 : 1 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: phase.color, fontWeight: 700, paddingTop: 2 }}>{d.day}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0" }}>{d.label}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#666", paddingTop: 2 }}>{d.duration}</div>
            <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{d.details}</div>
          </div>
        ))}
      </div>
      <div style={{ ...styles.card, marginTop: 16, borderColor: "#ffffff11" }}>
        <div style={{ fontSize: 12, color: "#888", fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>FLEXIBILITY & RECOVERY — DAILY HABITS THIS PHASE</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {phase.flexibilityNotes.map((note, i) => (
            <div key={i} style={{ fontSize: 13, color: "#aaa", paddingLeft: 12, borderLeft: `2px solid ${phase.color}44` }}>{note}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrainingPlanSection() {
  const [activePhase, setActivePhase] = useState(0);
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={styles.sectionHeader}><span style={{ color: "#4ade80" }}>03</span> 25-Week Training Plan</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 8 }}>
        {phases.map((phase, i) => (
          <PhaseCard key={i} phase={phase} isActive={activePhase === i} onClick={() => setActivePhase(i)} />
        ))}
      </div>
      <PhaseDetail phase={phases[activePhase]} />
    </section>
  );
}

function DailyStructureSection() {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={styles.sectionHeader}><span style={{ color: "#4ade80" }}>04</span> Daily Structure & Schedule</h2>
      <div style={{ ...styles.card, borderColor: "#4ade8022", marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: "#4ade80", fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>WORKOUT WINDOW</div>
        <div style={{ fontSize: 14, color: "#c0c0c0", lineHeight: 1.6 }}>
          <strong style={{ color: "#fff" }}>4:30am alarm → 30 min prep (dogs, dress, equipment) → 5:00am workout start → 5:45am done → 30 min to shower and dress → 6:15am for kids.</strong> Every session is capped at 45 min. Saturday is the one exception — longer window, no 6:15 constraint.
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {dailyHabits.map((h, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 170px 1fr", gap: 12, padding: "12px 16px", background: "#161616", borderRadius: 8, border: "1px solid #222", alignItems: "start" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#4ade80", paddingTop: 2 }}>{h.time}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0" }}>{h.habit}</div>
            <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{h.detail}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function InjurySection() {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={styles.sectionHeader}><span style={{ color: "#4ade80" }}>05</span> Injury Prevention Protocol</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {injuryPrevention.map((item, i) => (
          <div key={i} style={{ ...styles.card, borderColor: "#ef444422" }}>
            <div style={{ fontSize: 12, color: "#ef4444", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>{item.issue.toUpperCase()}</div>
            <div style={{ fontSize: 13, color: "#bbb", lineHeight: 1.6 }}>{item.prevention}</div>
          </div>
        ))}
      </div>
      <div style={{ ...styles.card, marginTop: 12, borderColor: "#ef444422", background: "#ef44440a" }}>
        <div style={{ fontSize: 12, color: "#ef4444", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>🚨 MANDATORY RULE</div>
        <div style={{ fontSize: 14, color: "#c0c0c0", lineHeight: 1.6 }}>
          Any IT band or shin pain = <strong style={{ color: "#fff" }}>stop running, row for 7 days minimum</strong>. Do not run through it. <strong style={{ color: "#fff" }}>Get a gait analysis and running shoes before Phase 2.</strong>
        </div>
      </div>
      <div style={{ ...styles.card, marginTop: 12, borderColor: "#4ade8022", background: "#4ade800a" }}>
        <div style={{ fontSize: 12, color: "#4ade80", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>TIBIALIS ANTERIOR RAISES — START DAY 1</div>
        <div style={{ fontSize: 13, color: "#c0c0c0", lineHeight: 1.6 }}>
          Stand with upper back against a wall, feet ~18 inches out. Flex toes up toward shins, hold 1 second, lower slowly. <strong style={{ color: "#fff" }}>3×25 reps, every Tue/Thu.</strong> The most evidence-backed shin splint prevention exercise. Start before symptoms appear.
        </div>
      </div>
    </section>
  );
}

function GearSection() {
  const items = [
    { name: "Running shoes", detail: "Fleet Feet Hartford or local run store. Gait analysis before Phase 2 — non-negotiable given IT band + shin history.", priority: "HIGH" },
    { name: "Concept 2 rower", detail: "You have this. Phase 1 runs entirely through it.", priority: "HAVE" },
    { name: "30lb dumbbells", detail: "Sufficient for all Phase 1–2 strength work.", priority: "HAVE" },
    { name: "Foam roller", detail: "Essential for glute medius (IT band prevention). ~$25.", priority: "BUY" },
    { name: "Loop resistance band", detail: "Lateral walks and clamshells. ~$12. Non-negotiable for hip health.", priority: "BUY" },
    { name: "HR monitor or GPS watch", detail: "Keeps easy days easy and hard days honest. Garmin, Apple Watch, or Wahoo chest strap.", priority: "HELPFUL" },
  ];
  const priorityColors = { HIGH: "#ef4444", HAVE: "#4ade80", BUY: "#facc15", HELPFUL: "#888" };
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={styles.sectionHeader}><span style={{ color: "#4ade80" }}>06</span> Equipment & Gear</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 200px 1fr", gap: 12, padding: "12px 16px", background: "#161616", borderRadius: 8, border: "1px solid #222", alignItems: "start" }}>
            <Tag color={priorityColors[item.priority]}>{item.priority}</Tag>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0" }}>{item.name}</div>
            <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{item.detail}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────

const styles = {
  card: { background: "#111", border: "1px solid #2a2a2a", borderRadius: 12, padding: 20 },
  sectionHeader: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: "#f0f0f0", letterSpacing: "0.02em", marginBottom: 20, marginTop: 0, display: "flex", gap: 12, alignItems: "center" },
};

// ─────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("today");
  const [log, setLog] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadLog().then(l => { setLog(l); setLoaded(true); });
  }, []);

  const handleLog = async (dateStr, status) => {
    const existing = log[dateStr];
    // Toggle off if clicking same status
    const newEntry = existing?.status === status ? undefined : { status, loggedAt: new Date().toISOString() };
    const newLog = { ...log };
    if (newEntry) newLog[dateStr] = newEntry;
    else delete newLog[dateStr];
    setLog(newLog);
    await saveLog(newLog);
  };

  const tabs = [
    { id: "today",      label: "Today" },
    { id: "history",    label: "Progress" },
    { id: "plan",       label: "Plan" },
    { id: "row",        label: "Row Targets" },
    { id: "feasibility",label: "Feasibility" },
    { id: "daily",      label: "Schedule" },
    { id: "injury",     label: "Injury" },
    { id: "gear",       label: "Gear" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        button:hover { opacity: 0.85; }
      `}</style>
      <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#e0e0e0", fontFamily: "'Inter', sans-serif", maxWidth: 900, margin: "0 auto", padding: "0 0 80px" }}>
        {/* Header */}
        <div style={{ padding: "28px 28px 0", borderBottom: "1px solid #1e1e1e", marginBottom: 28, paddingBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#4ade80", fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", marginBottom: 6 }}>MANCHESTER ROAD RACE — THANKSGIVING 2026</div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 38, fontWeight: 800, color: "#ffffff", lineHeight: 1, letterSpacing: "0.01em", marginBottom: 4 }}>SUB-30 TRAINING PLAN</h1>
          <div style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>4.737 miles · Nov 26, 2026 · June 6 start · 25 Weeks</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? "#4ade80" : "transparent", color: tab === t.id ? "#0a0a0a" : "#666", border: `1px solid ${tab === t.id ? "#4ade80" : "#2a2a2a"}`, borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 700, fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em", cursor: "pointer", transition: "all 0.15s" }}>
                {t.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "0 28px" }}>
          {!loaded ? (
            <div style={{ color: "#555", fontFamily: "'DM Mono', monospace", fontSize: 13 }}>Loading...</div>
          ) : (
            <>
              {tab === "today"       && <TodaySection log={log} onLog={handleLog} />}
              {tab === "history"     && <HistorySection log={log} onLog={handleLog} />}
              {tab === "plan"        && <TrainingPlanSection />}
              {tab === "row"         && <RowTargetsSection />}
              {tab === "feasibility" && <FeasibilitySection />}
              {tab === "daily"       && <DailyStructureSection />}
              {tab === "injury"      && <InjurySection />}
              {tab === "gear"        && <GearSection />}
            </>
          )}
        </div>
      </div>
    </>
  );
}
