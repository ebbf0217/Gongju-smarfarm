import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import { SpineFarmer } from "./SpineFarmer";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const TOTAL = 60;

const STAGE_NAME = ["씨앗", "새싹", "꽃망울", "딸기!"];

// ─── 2.5D Plant SVG ───
function PlantSVG({ stage, bad }) {
  const op = bad ? 0.45 : 1;
  if (stage === 0) return (
    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', opacity: op, display: 'block' }}>
      <ellipse cx="18" cy="29" rx="10" ry="4" fill="#795548" opacity="0.55" />
      <ellipse cx="18" cy="25" rx="5" ry="3.5" fill="#A1887F" />
      <ellipse cx="17" cy="24" rx="2.5" ry="1.5" fill="#D7CCC8" />
      <path d="M18,21 Q17,15 18,11" stroke="#66BB6A" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <ellipse cx="14" cy="14" rx="5" ry="2.2" fill="#81C784" transform="rotate(-35,14,14)" />
      <ellipse cx="22" cy="12" rx="5" ry="2.2" fill="#66BB6A" transform="rotate(35,22,12)" />
    </svg>
  );
  if (stage === 1) return (
    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', opacity: op, display: 'block' }}>
      <path d="M18,33 Q17,22 18,9" stroke="#388E3C" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M18,23 Q9,17 7,12 Q12,11 18,19Z" fill="#81C784" />
      <path d="M18,19 Q27,13 29,8 Q24,10 18,17Z" fill="#66BB6A" />
      <ellipse cx="18" cy="8" rx="5.5" ry="4.5" fill="#4CAF50" />
      <ellipse cx="18" cy="7" rx="3" ry="2.5" fill="#A5D6A7" />
    </svg>
  );
  if (stage === 2) return (
    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', opacity: op, display: 'block' }}>
      <path d="M18,33 Q17,21 18,7" stroke="#2E7D32" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M18,24 Q8,18 6,13 Q13,12 18,21Z" fill="#66BB6A" />
      <path d="M18,20 Q28,14 30,9 Q23,11 18,18Z" fill="#4CAF50" />
      <circle cx="11" cy="9" r="3.8" fill="#FAFAFA" /><circle cx="25" cy="9" r="3.8" fill="#FAFAFA" />
      <circle cx="18" cy="5" r="3.8" fill="#FAFAFA" /><circle cx="18" cy="13" r="3.8" fill="#FAFAFA" />
      <circle cx="18" cy="9" r="4.5" fill="white" />
      <circle cx="18" cy="9" r="2.6" fill="#FFF9C4" />
      <circle cx="18" cy="9" r="1.5" fill="#FFE082" />
      <circle cx="11" cy="9" r="3" fill="#FCE4EC" opacity="0.85" />
      <circle cx="25" cy="9" r="3" fill="#FCE4EC" opacity="0.85" />
      <circle cx="18" cy="5" r="3" fill="#FCE4EC" opacity="0.85" />
    </svg>
  );
  return (
    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', opacity: op, display: 'block' }}>
      <line x1="18" y1="6" x2="18" y2="10" stroke="#1B5E20" strokeWidth="2.2" />
      <path d="M18,9 Q12,3 6,5 Q8,12 18,9Z" fill="#4CAF50" />
      <path d="M18,9 Q24,3 30,5 Q28,12 18,9Z" fill="#66BB6A" />
      <path d="M18,9 Q14,2 18,0 Q22,2 18,9Z" fill="#388E3C" />
      <path d="M18,9 Q8,11 8,19 Q8,28 18,31 Q28,28 28,19 Q28,11 18,9Z" fill="url(#sbG)" />
      <defs>
        <radialGradient id="sbG" cx="38%" cy="28%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="55%" stopColor="#E53935" />
          <stop offset="100%" stopColor="#B71C1C" />
        </radialGradient>
      </defs>
      <path d="M18,9 Q12,11 11,18 Q13,26 18,29 Q14,22 15,15 Q16,11 18,9Z" fill="#EF5350" opacity="0.4" />
      <circle cx="13" cy="17" r="1.5" fill="#FF8A80" />
      <circle cx="23" cy="17" r="1.5" fill="#FF8A80" />
      <circle cx="18" cy="22" r="1.5" fill="#FF8A80" />
      <circle cx="12" cy="23" r="1.2" fill="#FF8A80" />
      <circle cx="24" cy="23" r="1.2" fill="#FF8A80" />
      <circle cx="18" cy="13" r="1.1" fill="#FF8A80" />
      <ellipse cx="13" cy="14" rx="3.2" ry="1.9" fill="rgba(255,255,255,0.45)" transform="rotate(-20,13,14)" />
    </svg>
  );
}

// ─── Ventilation Fan SVG ───
function VentFan() {
  return (
    <svg className="vent-fan-svg" viewBox="0 0 26 26" width="34" height="34">
      <circle cx="13" cy="13" r="12" fill="#37474F" stroke="#546E7A" strokeWidth="1.5" />
      <line x1="4" y1="13" x2="22" y2="13" stroke="#546E7A" strokeWidth="1" opacity="0.5" />
      <line x1="13" y1="4" x2="13" y2="22" stroke="#546E7A" strokeWidth="1" opacity="0.5" />
      <line x1="6" y1="6" x2="20" y2="20" stroke="#546E7A" strokeWidth="0.8" opacity="0.35" />
      <line x1="20" y1="6" x2="6" y2="20" stroke="#546E7A" strokeWidth="0.8" opacity="0.35" />
      <g className="fan-blade-group">
        <path d="M13,13 Q16,8 17,4 Q14,8 13,13Z" fill="#90A4AE" />
        <path d="M13,13 Q18,16 22,17 Q18,14 13,13Z" fill="#78909C" />
        <path d="M13,13 Q10,18 9,22 Q12,18 13,13Z" fill="#90A4AE" />
        <path d="M13,13 Q8,10 4,9 Q8,12 13,13Z" fill="#78909C" />
      </g>
      <circle cx="13" cy="13" r="2.8" fill="#263238" />
      <circle cx="13" cy="13" r="1.3" fill="#607D8B" />
    </svg>
  );
}

const EVENTS = [
  { title: "🔥 폭염!", msg: "냉방을 켜세요!", apply: s => ({ ...s, temp: clamp(s.temp + 7, 10, 40) }) },
  { title: "❄️ 한파!", msg: "난방을 켜세요!", apply: s => ({ ...s, temp: clamp(s.temp - 8, 10, 40) }) },
  { title: "🌧️ 습도 폭등!", msg: "제습 버튼 누르세요!", apply: s => ({ ...s, hum: clamp(s.hum + 20, 20, 95) }) },
  { title: "💨 CO₂ 고갈!", msg: "CO₂를 보충하세요!", apply: s => ({ ...s, co2: clamp(s.co2 - 280, 300, 1300) }) },
  { title: "🥀 가뭄!", msg: "물을 공급하세요!", apply: s => ({ ...s, water: clamp(s.water - 22, 0, 100) }) },
  { title: "💡 정전!", msg: "LED를 올리세요!", apply: s => ({ ...s, led: clamp(s.led - 28, 20, 100) }) },
];

const FARMER_LINES = {
  optimal: ["쑥쑥 자라고 있어요!", "완벽해요! 최고예요!", "딸기가 좋아해요~", "이 상태 유지해요!"],
  normal: ["조금만 더 맞춰요!", "거의 다 됐어요!", "살짝 아쉽네요..."],
  bad: ["위험해요! 빨리요!", "딸기가 힘들어해요!", "어서 조절해주세요!"],
  harvest: ["수확! 예스!", "따봉~!! 🎉", "딸기 최고!!"],
  event: ["앗!! 비상이에요!", "큰일 났어요!", "어어어어!!"],
};

const initVals = () => ({ temp: 24, hum: 67, co2: 820, water: 58, led: 70, health: 80, coins: 0 });
const initPlants = () => Array.from({ length: 18 }, () => ({ stage: 0, growth: 0 }));

function getStatus(s) {
  let g = 0;
  if (s.temp >= 22 && s.temp <= 26) g++;
  if (s.hum >= 60 && s.hum <= 75) g++;
  if (s.co2 >= 700 && s.co2 <= 1000) g++;
  if (s.water >= 45 && s.water <= 70) g++;
  if (s.led >= 60 && s.led <= 85) g++;
  if (g === 5) return "optimal";
  if (g >= 3) return "normal";
  return "bad";
}

// 각 파라미터가 최적 중심에 얼마나 가까운지 (0~1)
function calcPrecision(s) {
  const p = (v, lo, hi) => {
    if (v < lo || v > hi) return 0;
    const c = (lo + hi) / 2, r = (hi - lo) / 2;
    return 1 - Math.abs(v - c) / r;
  };
  return (p(s.temp,22,26) + p(s.hum,60,75) + p(s.co2,700,1000) + p(s.water,45,70) + p(s.led,60,85)) / 5;
}

// precAcc = Σ(max(precision-0.5,0) * 15) — max ~450 for 60s near-perfect
// + coins*4 + health*4
function getScore(health, coins, precAcc) {
  return Math.round(precAcc) + Math.round(coins * 4) + Math.round(health * 4);
}

function getGrade(score) {
  if (score >= 2000) return { grade: "S+", label: "👑 황금 딸기왕! 완벽해요!", emoji: "👑" };
  if (score >= 1600) return { grade: "S",  label: "🏆 전설의 딸기 농부!", emoji: "🏅" };
  if (score >= 1200) return { grade: "A",  label: "🌟 훌륭한 농부!", emoji: "🥇" };
  if (score >= 800)  return { grade: "B",  label: "👍 잘 했어요!", emoji: "🥈" };
  if (score >= 480)  return { grade: "C",  label: "🌱 성장하는 농부!", emoji: "🥉" };
  if (score >= 220)  return { grade: "D",  label: "💪 다시 도전!", emoji: "😅" };
  return                    { grade: "F",  label: "😭 딸기가 힘들어요...", emoji: "😭" };
}


// ─── Gauge item ───
function GItem({ icon, value, unit, lo, hi, min, max, color, onM, onP }) {
  const good = value >= lo && value <= hi;
  const warn = !good && ((value >= lo - 12 && value < lo) || (value > hi && value <= hi + 12));
  const cls = good ? "ok" : warn ? "warn" : "danger";
  const pct = clamp(((value - min) / (max - min)) * 100, 2, 100);
  const barC = good ? color : warn ? "#FF9500" : "#E53935";
  const disp = unit === "ppm" ? `${Math.round(value)}` : unit === "℃" ? `${Math.round(value)}℃` : `${Math.round(value)}%`;
  return (
    <div className={`g-item ${cls}`}>
      <div className="g-icon">{icon}</div>
      <div className="g-val">{disp}{unit === "ppm" ? <span style={{ fontSize: 8 }}>ppm</span> : ""}</div>
      <div className="g-range">{lo}~{hi}{unit}</div>
      <div className="g-bar-bg"><div className="g-bar-fill" style={{ width: `${pct}%`, background: barC }} /></div>
      <div className="g-btns">
        <button className="g-btn" onClick={onM}>▼</button>
        <button className="g-btn" onClick={onP}>▲</button>
      </div>
    </div>
  );
}

// ─── Particle canvas ───
function PCanvas({ pRef, tick }) {
  const cRef = useRef(null);
  useEffect(() => {
    const c = cRef.current; if (!c) return;
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    pRef.current.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x * c.width, p.y * c.height, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace("$", p.life.toFixed(2));
      ctx.fill();
    });
  });
  return <canvas ref={cRef} className="particle-canvas" />;
}

// ─── Cloud ───
function Clouds() {
  const clouds = [
    { top: "8%", dur: 18, delay: 0, size: 32 },
    { top: "15%", dur: 25, delay: 6, size: 24 },
    { top: "5%", dur: 22, delay: 12, size: 28 },
  ];
  return <>
    {clouds.map((c, i) => (
      <div key={i} className="cloud" style={{ top: c.top, fontSize: c.size, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }}>☁️</div>
    ))}
  </>;
}

export default function App() {
  const [screen, setScreen] = useState("start");
  const [nickname, setNickname] = useState("");
  const [vals, setVals] = useState(initVals());
  const [time, setTime] = useState(TOTAL);
  const [plants, setPlants] = useState(initPlants());
  const [event, setEvent] = useState(null);
  const [pops, setPops] = useState({});
  const [farmer, setFarmer] = useState({ pos: 0.1, anim: "", bubble: "" });
  const [shake, setShake] = useState(false);
  const [bee, setBee] = useState({ y: 30, visible: false, id: 0 });
  const [ranking, setRanking] = useState(() => JSON.parse(localStorage.getItem("gjue_farm") || "[]"));
  const [finalScore, setFinalScore] = useState(0);
  const [animTick, setAnimTick] = useState(0);
  const [combo, setCombo] = useState(0);
  const [streak, setStreak] = useState(0);
  const [phase, setPhase] = useState(1);
  const [liveScore, setLiveScore] = useState(0);

  const pRef = useRef([]);
  const timerRef = useRef(null);
  const eventRef = useRef(null);
  const beeRef = useRef(null);
  const animRef = useRef(null);
  const farmerWalkRef = useRef(null);
  const vRef = useRef(vals);
  const tRef = useRef(time);
  const pRef2 = useRef(plants);
  const precAccRef = useRef(0);
  const farmerVDirRef = useRef(1);   // 1=아래, -1=위
  const farmerVPosRef = useRef(0.10); // top % within gh-body
  vRef.current = vals;
  tRef.current = time;
  pRef2.current = plants;

  const status = getStatus(vals);

  // anim loop
  useEffect(() => {
    if (screen !== "game") return;
    const tick = () => {
      pRef.current = pRef.current
        .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.0005, life: p.life - 0.025 }))
        .filter(p => p.life > 0);
      setAnimTick(t => t + 1);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [screen]);

  const spawnP = useCallback((type, x = 0.5, y = 0.5) => {
    const n = type === "harvest" ? 28 : type === "bee" ? 16 : 14;
    const col = type === "harvest" ? "rgba(255,215,0,$)" : type === "water" ? "rgba(80,200,255,$)" : "rgba(255,180,80,$)";
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 0.003 + Math.random() * 0.005;
      pRef.current.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 0.004, life: 1, r: 3 + Math.random() * 5, color: col });
    }
  }, []);

  const setFarmerReact = useCallback((anim, bubbleArr) => {
    const msg = bubbleArr[Math.floor(Math.random() * bubbleArr.length)];
    setFarmer(f => ({ ...f, anim, bubble: msg }));
    setTimeout(() => setFarmer(f => ({ ...f, anim: "", bubble: "" })), 2000);
  }, []);

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 380);
  }, []);

  const finishGame = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(eventRef.current);
    clearInterval(beeRef.current);
    clearInterval(farmerWalkRef.current);
    cancelAnimationFrame(animRef.current);
    const v = vRef.current;
    const sc = getScore(v.health, v.coins, precAccRef.current);
    setFinalScore(sc);
    const entry = { name: nickname || "딸기농부", score: sc, health: Math.round(v.health), coins: v.coins };
    const next = [...JSON.parse(localStorage.getItem("gjue_farm") || "[]"), entry]
      .sort((a, b) => b.score - a.score).slice(0, 10);
    localStorage.setItem("gjue_farm", JSON.stringify(next));
    setRanking(next);
    setScreen("result");
  }, [nickname]);

  const startGame = useCallback(() => {
    [timerRef, eventRef, beeRef, farmerWalkRef].forEach(r => clearInterval(r.current));
    cancelAnimationFrame(animRef.current);
    pRef.current = [];
    precAccRef.current = 0;
    farmerVDirRef.current = 1;
    farmerVPosRef.current = 0.10;
    setVals(initVals());
    setTime(TOTAL);
    setPlants(initPlants());
    setEvent(null);
    setPops({});
    setLiveScore(0);
    setFarmer({ top: 0.10, anim: "dance", bubble: "화이팅! 🍓" });
    setTimeout(() => setFarmer(f => ({ ...f, anim: "", bubble: "" })), 2000);
    setCombo(0);
    setStreak(0);
    setPhase(1);
    setScreen("game");

    // 농부 통로 위아래 왕복
    farmerWalkRef.current = setInterval(() => {
      if (tRef.current <= 0) return;
      let vp = farmerVPosRef.current + farmerVDirRef.current * 0.025;
      if (vp >= 0.42) { farmerVDirRef.current = -1; vp = 0.42; }
      else if (vp <= 0.06) { farmerVDirRef.current = 1; vp = 0.06; }
      farmerVPosRef.current = vp;
      setFarmer(f => ({ ...f, top: vp }));
    }, 480);

    // main tick
    timerRef.current = setInterval(() => {
      const cv = vRef.current;
      const ct = tRef.current;
      if (ct <= 0) { finishGame(); return; }
      setTime(t => t - 1);

      // phase transitions
      if (ct === 40) {
        setPhase(2);
        setEvent({ title: "⚡ 중반전!", msg: "코인 2배 돌입!" });
        setTimeout(() => setEvent(null), 2500);
        triggerShake();
      }
      if (ct === 20) {
        setPhase(3);
        setEvent({ title: "🔥 러시 타임!", msg: "마지막 20초! 코인 3배!" });
        setTimeout(() => setEvent(null), 2500);
        triggerShake();
        setFarmerReact("surprise", ["러시 타임이다!!", "달려라!!", "마지막 스퍼트!"]);
      }

      const curPhase = ct > 40 ? 1 : ct > 20 ? 2 : 3;
      const coinMult = curPhase;

      // 매 초 정밀도 누적 (적정 중심 근접도 × 45)
      // 적정 범위 중심에 가까울수록 점수 — 0.5 이상만 인정 (초반 무료 점수 방지)
      const prec = Math.max(calcPrecision(cv) - 0.5, 0);
      precAccRef.current += prec * 15;
      setLiveScore(Math.round(precAccRef.current + cv.coins * 4 + cv.health * 4));

      let pen = 0;
      if (cv.temp < 22 || cv.temp > 26) pen += Math.abs(cv.temp - 24) * 0.28;
      if (cv.hum < 60 || cv.hum > 75) pen += Math.abs(cv.hum - 67.5) * 0.14;
      if (cv.co2 < 700 || cv.co2 > 1000) pen += Math.abs(cv.co2 - 850) * 0.007;
      if (cv.water < 45 || cv.water > 70) pen += Math.abs(cv.water - 57.5) * 0.14;
      if (cv.led < 60 || cv.led > 85) pen += Math.abs(cv.led - 72.5) * 0.14;

      const st = getStatus(cv);
      const growRate = st === "optimal" ? 9 : st === "normal" ? 3.5 : 0;
      const evap = 0.4 + Math.max(0, (cv.temp - 24) * 0.07);

      // streak multiplier
      if (st === "optimal") {
        setStreak(s => Math.min(s + 1, 30));
      } else {
        setStreak(s => Math.max(s - 2, 0));
      }

      // auto-harvest stage 3 plants
      const stage3Idx = pRef2.current
        .map((p, i) => p.stage === 3 ? i : -1)
        .filter(i => i >= 0);
      if (stage3Idx.length > 0) {
        let coinsEarned = 0;
        const newPops = {};
        stage3Idx.forEach(i => {
          const base = curPhase === 3 ? 6 : curPhase === 2 ? 4 : 3;
          const reward = base + Math.floor(Math.random() * 4);
          coinsEarned += reward;
          const isRight = (i % 6) >= 3;
          spawnP("harvest", isRight ? 0.72 : 0.22, 0.25 + Math.floor(i / 6) * 0.2);
          newPops[i] = `+🪙${reward}`;
        });
        if (stage3Idx.length >= 2) {
          const bonus = stage3Idx.length * 4;
          coinsEarned += bonus;
          setCombo(stage3Idx.length);
          setTimeout(() => setCombo(0), 1600);
          spawnP("harvest", 0.5, 0.4);
        }
        setPops(pp => ({ ...pp, ...newPops }));
        setTimeout(() => setPops(pp => {
          const n = { ...pp };
          stage3Idx.forEach(i => delete n[i]);
          return n;
        }), 900);
        setVals(prev => ({ ...prev, coins: prev.coins + coinsEarned }));
        setPlants(prev => prev.map((p, i) => stage3Idx.includes(i) ? { stage: 0, growth: 0 } : p));
        setFarmerReact("jump", FARMER_LINES.harvest);
      }

      setPlants(prev => prev.map(p => {
        if (p.stage >= 3) return p;
        const ng = p.growth + growRate;
        if (ng >= 100) return { stage: p.stage + 1, growth: 0 };
        return { ...p, growth: ng };
      }));

      setVals(prev => ({
        ...prev,
        health: clamp(prev.health + (st === "optimal" ? 1.5 : -pen), 0, 100),
        water: clamp(prev.water - evap, 0, 100),
        co2: clamp(prev.co2 - 5, 300, 1300),
        hum: clamp(prev.hum - 0.12, 20, 95),
        coins: st === "optimal" ? prev.coins + coinMult : prev.coins,
      }));

      // rush phase: 추가 랜덤 이벤트
      if (curPhase === 3 && Math.random() < 0.25) {
        const e = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        setEvent(e);
        setVals(prev => e.apply(prev));
        triggerShake();
        setFarmerReact("surprise", FARMER_LINES.event);
        setTimeout(() => setEvent(null), 2500);
      }

      // farmer react
      if (Math.random() < 0.15) {
        const lines = st === "optimal" ? FARMER_LINES.optimal : st === "normal" ? FARMER_LINES.normal : FARMER_LINES.bad;
        const anim = st === "optimal" ? "dance" : st === "bad" ? "worry" : "";
        setFarmerReact(anim, lines);
      }
    }, 1000);

    // random events (10s interval)
    eventRef.current = setInterval(() => {
      const ct = tRef.current;
      if (ct <= 20) return; // rush phase handles its own events
      const e = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      setEvent(e);
      setVals(prev => e.apply(prev));
      triggerShake();
      setFarmerReact("surprise", FARMER_LINES.event);
      setTimeout(() => setEvent(null), 3500);
    }, 10000);

    // bee — CSS 애니메이션으로 좌→우 비행
    const spawnBee = () => {
      setBee({ y: 15 + Math.random() * 55, visible: true, id: Date.now() });
      setTimeout(() => setBee(b => ({ ...b, visible: false })), 5500);
    };
    beeRef.current = setInterval(spawnBee, 8000);
    setTimeout(spawnBee, 3000);
  }, [finishGame, triggerShake, setFarmerReact]);

  const ctrl = useCallback((type, amt) => {
    if (type === "water" && amt > 0) spawnP("water", 0.25, 0.55);
    setVals(prev => ({
      ...prev,
      [type]: clamp(prev[type] + amt, type === "co2" ? 300 : type === "temp" ? 10 : 0, type === "co2" ? 1300 : type === "temp" ? 40 : 100)
    }));
  }, [spawnP]);

  const harvestBed = useCallback((i) => {
    if (pRef2.current[i].stage < 3) return;
    const reward = 3 + Math.floor(Math.random() * 4);
    spawnP("harvest", 0.08 + (i % 6) * 0.16, 0.72);
    setPops(prev => ({ ...prev, [i]: `+🪙${reward}` }));
    setTimeout(() => setPops(prev => { const n = { ...prev }; delete n[i]; return n; }), 900);
    setVals(prev => ({ ...prev, coins: prev.coins + reward }));
    setPlants(prev => prev.map((p, idx) => idx === i ? { stage: 0, growth: 0 } : p));
    setFarmerReact("jump", FARMER_LINES.harvest);
  }, [spawnP, setFarmerReact]);

  const clickBee = useCallback(() => {
    spawnP("bee", 0.5, bee.y / 100);
    setVals(prev => ({ ...prev, coins: prev.coins + 2 }));
    setBee(b => ({ ...b, visible: false }));
  }, [bee.y, spawnP]);

  // derived
  const skyClass = vals.temp > 28 ? "sky-hot" : vals.temp < 20 ? "sky-cold" : "sky-day";
  const ledPct = vals.led / 100;
  const ledColor = `hsl(${55 - ledPct * 10},${5 + ledPct * 18}%,${12 + ledPct * 83}%)`;
  const ledGlow = `0 0 ${8 + ledPct * 22}px ${3 + ledPct * 14}px rgba(255,252,230,${0.15 + ledPct * 0.75})`;
  const mistOp = vals.hum > 78 ? Math.min((vals.hum - 78) / 16, 0.9) : 0;
  const hasFungus = vals.hum > 83;
  const co2Op = vals.co2 < 650 ? 0.15 : 0.75;
  const waterOp = vals.water < 45 ? 0.2 : 0.85;
  const timerPct = time / TOTAL;
  const timerColor = timerPct > 0.5 ? "#6DC54A" : timerPct > 0.25 ? "#FFB300" : "#E53935";
  const isRush = time <= 20;
  const stLabel = status === "optimal" ? "🍓 최적! 코인+" + (isRush ? 3 : phase) + "/초" : status === "normal" ? "🌱 보통" : "🥀 위험!";
  const streakMult = streak >= 20 ? 3 : streak >= 10 ? 2 : 1;

  // ── 환경 시각 효과 강도 (0~1) ──
  const envHot   = clamp((vals.temp - 26) / 12, 0, 1);   // 26~38°C
  const envCold  = clamp((22 - vals.temp) / 10, 0, 1);   // 22~12°C
  const envFog   = clamp((vals.hum - 72) / 20, 0, 1);    // 72~92%
  const envDry   = clamp((52 - vals.hum) / 28, 0, 1);    // 52~24%
  const envCO2hi = clamp((vals.co2 - 950) / 300, 0, 1);  // 950~1250ppm
  const envDrought = clamp((40 - vals.water) / 35, 0, 1);// 40~5%
  const envBright  = clamp((vals.led - 78) / 17, 0, 1);  // 78~95%
  const envDark    = clamp((52 - vals.led) / 28, 0, 1);  // 52~24%

  // ── SCREENS ──
  if (screen !== "game") {
    return (
      <div className="screen">
        {screen === "start" && (
          <div className="start-card">
            <div className="farm-badge">🎓 공주교육대학교 딸기농장</div>
            <span className="game-logo">🍓</span>
            <div className="game-title">스마트팜 게임</div>
            <div className="game-tagline">60초 안에 딸기를 키우고 수확하세요!</div>

            {/* 게임 설명 */}
            <div className="how-to-play">
              <div className="htp-title">📖 게임 방법</div>
              <div className="htp-steps">
                <div className="htp-step"><span className="htp-num">1</span><span>아래 5개 환경 지표를 <b>적정 범위</b>로 유지하세요</span></div>
                <div className="htp-step"><span className="htp-num">2</span><span>조건이 맞으면 딸기가 자라고 <b>자동 수확</b>!</span></div>
                <div className="htp-step"><span className="htp-num">3</span><span>40초 → <b>2배 코인</b>, 20초 → <b>3배 러시!</b></span></div>
                <div className="htp-step"><span className="htp-num">4</span><span><b>꿀벌</b>이 나타나면 탭하면 보너스 코인!</span></div>
                <div className="htp-step"><span className="htp-num">5</span><span>건강도와 코인으로 <b>최고 점수</b>를 노려요</span></div>
              </div>
            </div>

            <div className="guide-pills">
              <span className="guide-pill">🌡️ 온도 22~26℃</span>
              <span className="guide-pill">💧 습도 60~75%</span>
              <span className="guide-pill">💨 CO₂ 700~1000</span>
              <span className="guide-pill">🚿 물 45~70%</span>
              <span className="guide-pill">💡 LED 60~85%</span>
            </div>

            <input className="name-input" value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="농부 이름을 입력하세요" maxLength={10} />
            <button className="btn-start" onClick={startGame}>🌱 게임 시작!</button>
            <button className="btn-rank" onClick={() => setScreen("ranking")}>🏆 랭킹 보기</button>
          </div>
        )}
        {screen === "result" && (() => {
          const { label, emoji, grade } = getGrade(finalScore);
          return (
            <div className="result-card">
              <span className="result-icon">{emoji}</span>
              <div className="result-title">수확 완료!</div>
              <div className="result-name">{nickname || "딸기농부"}님의 점수</div>
              <span className="result-score">{finalScore}</span>
              <div className="result-grade">{grade}등급</div>
              <div className="result-detail">{label}<br />건강도 {Math.round(vals.health)}% · 수확 코인 {vals.coins}개</div>
              <button className="btn-start" onClick={startGame}>🔄 다시 하기</button>
              <button className="btn-rank" onClick={() => setScreen("ranking")}>🏆 랭킹 보기</button>
            </div>
          );
        })()}
        {screen === "ranking" && (
          <div className="rank-card">
            <div className="rank-title">🏆 공주교대 딸기왕</div>
            {ranking.length === 0
              ? <p style={{ textAlign: "center", color: "#A8804A", padding: "16px 0" }}>아직 기록이 없어요 🌱</p>
              : ranking.map((r, i) => (
                <div key={i} className={`rank-row${i === 0 ? " gold" : i === 1 ? " silver" : i === 2 ? " bronze" : ""}`}>
                  <b>{i + 1}위 {r.name}</b>
                  <span>{r.score}점</span>
                </div>
              ))}
            <button className="btn-start" style={{ marginTop: 14 }} onClick={() => setScreen("start")}>처음으로</button>
          </div>
        )}
      </div>
    );
  }

  // ── GAME ──
  return (
    <div className={`game-wrap${shake ? " shaking" : ""}`}>
      {/* HUD */}
      <div className="hud">
        <div className="hud-name">🍓 공주교대 딸기농장 · {nickname || "딸기농부"}</div>
        <div className="timer-wrap">
          <svg width="42" height="42" viewBox="0 0 42 42">
            <circle cx="21" cy="21" r="17" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="4" />
            <circle cx="21" cy="21" r="17" fill="none" stroke={timerColor} strokeWidth="4"
              strokeDasharray="106.8" strokeDashoffset={106.8 * (1 - timerPct)}
              strokeLinecap="round" transform="rotate(-90 21 21)"
              style={{ transition: "stroke-dashoffset 1s linear, stroke .5s" }} />
          </svg>
          <div className="timer-num" style={{ color: timerColor }}>{time}</div>
        </div>
        <div className="hud-stats">
          <div className={`stat-chip${vals.health < 30 ? " danger" : ""}`}>❤️{Math.round(vals.health)}</div>
          <div className="stat-chip">🪙{vals.coins}</div>
          <div className="stat-chip">⭐{liveScore}</div>
          {isRush && <div className="stat-chip rush-chip">🔥RUSH!</div>}
          {streakMult > 1 && !isRush && <div className="stat-chip streak-chip">×{streakMult}🔗</div>}
        </div>
        {event && <div className="event-banner">{event.title} {event.msg}</div>}
      </div>

      {/* SCENE */}
      <div className="scene">
        <div className={`sky ${skyClass}`} />
        <Clouds />
        <div className="sun">☀️</div>

        <div className="greenhouse">
          {/* smart farm top panel */}
          <div className="gh-roof">
            <div className="sf-roof-stripe" />
            <div className="fans">
              <div className="fan-slot"><VentFan /><span className="fan-lbl">환풍</span></div>
              <div className="fan-slot" style={{ '--spd': '.52s' }}><VentFan /><span className="fan-lbl">환풍</span></div>
              <div className="fan-slot"><VentFan /><span className="fan-lbl">환풍</span></div>
            </div>
            <div className="sf-sensor-bar">
              <div className="sf-iot-chip">IoT</div>
              <div className={`sf-status-dot sd-${status}`} />
              <div className="sf-temp-chip">°C/{Math.round(vals.temp)}</div>
            </div>
          </div>

          {/* smart farm body */}
          <div className="gh-body">
            {/* 원근감 배경 - 이미지처럼 흰 내부 */}
            <div className="sf-back-wall" />

            {/* 측면 프레임 */}
            <div className="sf-column sf-column-left" />
            <div className="sf-column sf-column-right" />

            {/* 메인 급수 파이프 */}
            <div className="sf-water-pipe" style={{ opacity: waterOp, filter: vals.water < 45 ? "grayscale(1) brightness(0.5)" : "none" }}>
              <span className="pipe-label">💧 급수관</span>
              {[0,1,2,3,4].map(i => <div key={i} className="nozzle" style={{ left: `${12 + i * 18}%` }} />)}
            </div>

            {/* ─── 환경 시각 효과 ─── */}

            {/* 온도 높음: 주황빛 열기 + 아지랑이 */}
            {envHot > 0 && (
              <div className="env-hot" style={{ opacity: envHot }}>
                {[0,1,2,3,4].map(i => (
                  <div key={i} className="heat-wave-line" style={{ bottom:`${14+i*14}%`, animationDuration:`${1.0+i*0.22}s`, animationDelay:`${i*0.18}s` }} />
                ))}
              </div>
            )}
            {/* 온도 낮음: 파란 냉기 + 눈송이 */}
            {envCold > 0 && (
              <div className="env-cold" style={{ opacity: Math.min(envCold*1.2,1) }}>
                {[0,1,2,3,4,5].map(i => (
                  <span key={i} className="snow-petal" style={{ left:`${5+i*18}%`, fontSize:`${12+i%2*7}px`, animationDuration:`${2.6+i*0.38}s`, animationDelay:`${i*0.44}s` }}>❄</span>
                ))}
              </div>
            )}
            {/* 습도 높음: 짙은 안개 + 물방울 */}
            {envFog > 0 && (
              <div className="env-fog" style={{ opacity: envFog }}>
                <div className="fog-layer fl1" /><div className="fog-layer fl2" /><div className="fog-layer fl3" />
                {vals.hum > 78 && [0,1,2,3,4,5,6].map(i => (
                  <span key={i} className="fog-drip" style={{ left:`${3+i*14}%`, animationDuration:`${1.0+i%3*0.35}s`, animationDelay:`${i*0.22}s` }}>💧</span>
                ))}
              </div>
            )}
            {/* 습도 낮음: 노란 건조 먼지 */}
            {envDry > 0 && <div className="env-dry" style={{ opacity: envDry * 0.8 }} />}
            {/* CO₂ 높음: 초록 가스 구름 */}
            {envCO2hi > 0 && (
              <div className="env-co2hi" style={{ opacity: envCO2hi }}>
                {[0,1,2].map(i => (
                  <div key={i} className="gas-puff" style={{ left:`${15+i*32}%`, animationDuration:`${2.4+i*0.7}s`, animationDelay:`${i*0.75}s` }} />
                ))}
              </div>
            )}
            {/* 물 부족: 주황빛 가뭄 */}
            {envDrought > 0.2 && <div className="env-drought" style={{ opacity: envDrought * 0.85 }} />}
            {/* LED 밝음: 눈부신 흰빛 */}
            {envBright > 0 && <div className="env-led-bright" style={{ opacity: envBright * 0.72 }} />}
            {/* LED 어두움: 암전 */}
            {envDark > 0 && <div className="env-led-dark" style={{ opacity: Math.min(envDark*0.9, 0.88) }} />}
            {/* 고습도 곰팡이 */}
            {hasFungus && (
              <div className="fungus" style={{ opacity: Math.min((vals.hum - 83) / 12, 0.7) }}>🍄🍄🍄</div>
            )}
            <div className="mist" style={{ opacity: mistOp }} />

            {/* CO₂ 배출구 */}
            <div className="co2-row" style={{ opacity: co2Op }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="co2-vent">
                  <div className="co2-vent-icon">
                    <div className="co2-puff" style={{ animationDelay: `${i * 0.55}s` }} />
                  </div>
                  <span className="co2-vent-lbl">CO₂</span>
                </div>
              ))}
            </div>

            {/* 농장 타이틀 오버레이 */}
            <div className="farm-scene-title">🍓 공주교대 딸기농장</div>

            {/* 좌측 선반 + 중앙 통로 + 우측 선반 */}
            <div className="shelf-section">
              {/* 좌측 선반 */}
              <div className="shelf-bank">
                {[0, 1, 2].map(row => (
                  <div key={row} className="shelf-row">
                    <div className="shelf-led-bar" style={{ background: ledColor, boxShadow: ledGlow }} />
                    <div className="shelf-tray">
                      {plants.slice(row * 6, row * 6 + 3).map((p, j) => {
                        const i = row * 6 + j;
                        return (
                          <div key={i}
                            className={`bed s${p.stage}${p.stage === 3 ? " harvestable" : ""}${status === "bad" ? " bad" : ""}`}
                            onClick={() => harvestBed(i)}>
                            <div className="bed-plant"><PlantSVG stage={p.stage} bad={status === 'bad'} /></div>
                            <div className="bed-bar"><div className="bed-bar-fill" style={{ width: `${p.growth}%` }} /></div>
                            {pops[i] && <div className="pop">{pops[i]}</div>}
                          </div>
                        );
                      })}
                    </div>
                    <div className="shelf-support" />
                  </div>
                ))}
              </div>

              {/* 중앙 통로 - 농부 여기 걸어다님 */}
              <div className="sf-aisle" />

              {/* 우측 선반 */}
              <div className="shelf-bank">
                {[0, 1, 2].map(row => (
                  <div key={row} className="shelf-row">
                    <div className="shelf-led-bar" style={{ background: ledColor, boxShadow: ledGlow }} />
                    <div className="shelf-tray">
                      {plants.slice(row * 6 + 3, row * 6 + 6).map((p, j) => {
                        const i = row * 6 + 3 + j;
                        return (
                          <div key={i}
                            className={`bed s${p.stage}${p.stage === 3 ? " harvestable" : ""}${status === "bad" ? " bad" : ""}`}
                            onClick={() => harvestBed(i)}>
                            <div className="bed-plant"><PlantSVG stage={p.stage} bad={status === 'bad'} /></div>
                            <div className="bed-bar"><div className="bed-bar-fill" style={{ width: `${p.growth}%` }} /></div>
                            {pops[i] && <div className="pop">{pops[i]}</div>}
                          </div>
                        );
                      })}
                    </div>
                    <div className="shelf-support" />
                  </div>
                ))}
              </div>
            </div>

            {/* 농부 - 중앙 통로 위아래 이동 */}
            <div className={`farmer-wrap ${farmer.anim}`}
              style={{ top: `${(farmer.top ?? 0.10) * 100}%` }}>
              {farmer.bubble && <div className="bubble">{farmer.bubble}</div>}
              <SpineFarmer anim={farmer.anim} />
            </div>

            {/* 꿀벌 — CSS로 좌→우 비행 */}
            {bee.visible && (
              <div key={bee.id} className="bee" style={{ top: `${bee.y}%` }} onClick={clickBee}>
                <div className="bee-body">🐝</div>
                <div className="bee-tap">TAP!</div>
              </div>
            )}
          </div>
        </div>

        {status === 'bad' && <div className="danger-vignette" />}
        {isRush && <div className="rush-vignette" />}
        {combo >= 2 && (
          <div className="combo-banner">🍓 COMBO ×{combo}! +{combo * 4}🪙 보너스!</div>
        )}
        <div className={`status-tag${status === 'bad' ? ' status-danger' : isRush ? ' status-rush' : ''}`}>{stLabel}</div>
        <PCanvas pRef={pRef} tick={animTick} />
      </div>

      {/* BOTTOM PANEL */}
      <div className="bottom-panel">
        <div className="gauges">
          <GItem icon="🌡️" value={vals.temp} unit="℃" lo={22} hi={26} min={10} max={40} color="#FF7043"
            onM={() => ctrl("temp", -1)} onP={() => ctrl("temp", 1)} />
          <GItem icon="💧" value={vals.hum} unit="%" lo={60} hi={75} min={20} max={95} color="#42A5F5"
            onM={() => ctrl("hum", -3)} onP={() => ctrl("hum", 3)} />
          <GItem icon="💨" value={vals.co2} unit="ppm" lo={700} hi={1000} min={300} max={1300} color="#66BB6A"
            onM={() => ctrl("co2", -50)} onP={() => ctrl("co2", 50)} />
          <GItem icon="🚿" value={vals.water} unit="%" lo={45} hi={70} min={0} max={100} color="#29B6F6"
            onM={() => ctrl("water", -3)} onP={() => ctrl("water", 3)} />
          <GItem icon="💡" value={vals.led} unit="%" lo={60} hi={85} min={20} max={100} color="#CE93D8"
            onM={() => ctrl("led", -3)} onP={() => ctrl("led", 3)} />
        </div>
      </div>
    </div>
  );
}
