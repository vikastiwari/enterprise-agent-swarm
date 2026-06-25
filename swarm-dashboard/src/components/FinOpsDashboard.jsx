import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, TrendingUp, TrendingDown, Zap, Cpu, 
  AlertTriangle, CheckCircle2, ArrowUpRight, ArrowDownRight,
  PieChart, BarChart3, Wallet, Target, Download
} from 'lucide-react';
import TiltCard from './TiltCard';

/* ── mock data ── */
const COST_BREAKDOWN = [
  { label: 'GPU Compute (L4)', value: 1.42, color: '#8a2be2', pct: 45 },
  { label: 'Wan 2.5 I2V API', value: 0.68, color: '#00f0ff', pct: 22 },
  { label: 'Cloud Storage', value: 0.38, color: '#ff003c', pct: 12 },
  { label: 'EchoMimic TTS', value: 0.34, color: '#00e676', pct: 11 },
  { label: 'Misc. Network', value: 0.31, color: '#ffea00', pct: 10 },
];

const DAILY_SPEND = [
  { day: 'Mon', spend: 2.10, rev: 42 },
  { day: 'Tue', spend: 1.85, rev: 38 },
  { day: 'Wed', spend: 3.10, rev: 67 },
  { day: 'Thu', spend: 2.50, rev: 55 },
  { day: 'Fri', spend: 1.90, rev: 44 },
  { day: 'Sat', spend: 3.40, rev: 78 },
  { day: 'Sun', spend: 2.80, rev: 61 },
];

const ROI_CHANNELS = [
  { name: 'Horror Stories', cost: 0.42, rev: 48.5, roi: 11452, trend: 'up' },
  { name: 'True Crime', cost: 0.55, rev: 62.3, roi: 11227, trend: 'up' },
  { name: 'Tech Explained', cost: 0.38, rev: 31.2, roi: 8110, trend: 'down' },
  { name: 'Motivation', cost: 0.31, rev: 28.9, roi: 9222, trend: 'up' },
  { name: 'AI & Science', cost: 0.48, rev: 52.1, roi: 10754, trend: 'up' },
  { name: 'Cooking Shorts', cost: 0.29, rev: 19.8, roi: 6727, trend: 'down' },
  { name: 'History Facts', cost: 0.35, rev: 41.2, roi: 11671, trend: 'up' },
  { name: 'Space & NASA', cost: 0.44, rev: 38.7, roi: 8795, trend: 'up' },
  { name: 'Fitness Tips', cost: 0.27, rev: 22.4, roi: 8296, trend: 'down' },
  { name: 'Crypto & Stocks', cost: 0.52, rev: 58.9, roi: 11327, trend: 'up' },
];

/* ── Animated Donut ── */
const DonutChart = ({ data }) => {
  const [hovered, setHovered] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const size = 200;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {data.map((item, i) => {
          const segmentLength = (item.pct / 100) * circumference;
          const offset = cumulativeOffset;
          cumulativeOffset += segmentLength;
          return (
            <motion.circle
              key={item.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={hovered === i ? strokeWidth + 6 : strokeWidth}
              strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${segmentLength} ${circumference - segmentLength}` }}
              transition={{ duration: 1, delay: i * 0.15, ease: 'easeOut' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer', filter: hovered === i ? `drop-shadow(0 0 8px ${item.color})` : 'none', transition: 'stroke-width 0.2s, filter 0.2s' }}
            />
          );
        })}
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <motion.span 
          key={hovered}
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}
        >
          ${hovered !== null ? data[hovered].value.toFixed(2) : total.toFixed(2)}
        </motion.span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {hovered !== null ? data[hovered].label : 'Total / Day'}
        </span>
      </div>
    </div>
  );
};

/* ── Sparkline Bar Chart ── */
const SparklineChart = ({ data }) => {
  const maxSpend = Math.max(...data.map(d => d.spend));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '120px', padding: '0 4px' }}>
      {data.map((d, i) => (
        <motion.div
          key={d.day}
          initial={{ height: 0 }}
          animate={{ height: `${(d.spend / maxSpend) * 100}%` }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          style={{
            flex: 1,
            background: `linear-gradient(to top, var(--accent-purple), var(--accent-cyan))`,
            borderRadius: '4px 4px 0 0',
            position: 'relative',
            cursor: 'pointer',
            minWidth: 0,
          }}
          whileHover={{ filter: 'brightness(1.3)', scale: 1.05 }}
          title={`${d.day}: $${d.spend.toFixed(2)}`}
        >
          <span style={{
            position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)',
            fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap'
          }}>
            ${d.spend.toFixed(2)}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

/* ── ROI Heatmap Row ── */
const ROIRow = ({ channel, index }) => {
  const roiColor = channel.roi > 10000 ? '#00e676' : channel.roi > 8000 ? 'var(--accent-cyan)' : '#ffea00';
  const barWidth = Math.min((channel.roi / 12000) * 100, 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '140px 70px 70px 1fr 60px',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: '0.85rem',
      }}
    >
      <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{channel.name}</span>
      <span style={{ color: 'var(--text-muted)' }}>${channel.cost.toFixed(2)}</span>
      <span style={{ color: '#00e676' }}>${channel.rev.toFixed(1)}</span>
      <div style={{ position: 'relative', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${barWidth}%` }}
          transition={{ duration: 0.8, delay: index * 0.05 }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${roiColor}80, ${roiColor})`,
            borderRadius: '4px',
            boxShadow: `0 0 8px ${roiColor}40`,
          }}
        />
      </div>
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: roiColor, fontWeight: 600, fontSize: '0.8rem' }}>
        {channel.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {(channel.roi / 100).toFixed(0)}x
      </span>
    </motion.div>
  );
};

/* ── Main FinOps Dashboard ── */
const FinOpsDashboard = () => {
  const [budgetLimit, setBudgetLimit] = useState(5.00);
  
  const totalDailySpend = useMemo(() => DAILY_SPEND.reduce((s, d) => s + d.spend, 0) / DAILY_SPEND.length, []);
  const totalDailyRev = useMemo(() => DAILY_SPEND.reduce((s, d) => s + d.rev, 0) / DAILY_SPEND.length, []);
  const overallROI = ((totalDailyRev / totalDailySpend) * 100).toFixed(0);

  const exportCSV = () => {
    const csvRows = ['Day,Spend,Revenue'];
    DAILY_SPEND.forEach(d => {
      csvRows.push(`${d.day},${d.spend},${d.rev}`);
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finops-telemetry.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wallet size={20} color="var(--accent-cyan)" /> Financial Telemetry
        </h2>
        <button onClick={exportCSV} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* ── KPI Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        {[
          { icon: <DollarSign size={20} />, label: 'Avg. Daily Spend', value: `$${totalDailySpend.toFixed(2)}`, color: 'var(--accent-cyan)', sub: 'across 10 channels' },
          { icon: <TrendingUp size={20} />, label: 'Avg. Daily Revenue', value: `$${totalDailyRev.toFixed(0)}`, color: '#00e676', sub: 'AdSense + sponsorships' },
          { icon: <Target size={20} />, label: 'Overall ROI', value: `${overallROI}%`, color: 'var(--accent-purple)', sub: 'cost → rev ratio' },
          { icon: <Wallet size={20} />, label: 'Budget Utilization', value: `${((totalDailySpend / budgetLimit) * 100).toFixed(0)}%`, color: totalDailySpend > budgetLimit ? 'var(--accent-magenta)' : 'var(--accent-cyan)', sub: `limit: $${budgetLimit.toFixed(2)}/day` },
        ].map((kpi, i) => (
          <TiltCard key={i} className="glass-panel glitch-hover" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ color: kpi.color }}>{kpi.icon}</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</span>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{ fontSize: '2rem', fontWeight: 'bold', color: kpi.color }}
            >
              {kpi.value}
            </motion.div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>{kpi.sub}</span>
          </TiltCard>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

        {/* Cost Breakdown Donut */}
        <TiltCard className="glass-panel glitch-hover" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={18} color="var(--accent-purple)" /> Cost Breakdown
          </h2>
          <DonutChart data={COST_BREAKDOWN} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '1.5rem', justifyContent: 'center' }}>
            {COST_BREAKDOWN.map(item => (
              <span key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                {item.label}
              </span>
            ))}
          </div>
        </TiltCard>

        {/* Daily Spend Sparkline */}
        <TiltCard className="glass-panel glitch-hover" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="var(--accent-cyan)" /> 7-Day Spend Trend
          </h2>
          <SparklineChart data={DAILY_SPEND} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            {DAILY_SPEND.map(d => (
              <span key={d.day} style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flex: 1, textAlign: 'center' }}>{d.day}</span>
            ))}
          </div>
          
          {/* Budget Slider */}
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-dark)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={14} color="var(--accent-cyan)" /> Daily Budget Limit
              </span>
              <motion.span
                key={budgetLimit}
                initial={{ scale: 1.2, color: '#fff' }}
                animate={{ scale: 1, color: 'var(--accent-cyan)' }}
                style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
              >
                ${budgetLimit.toFixed(2)}
              </motion.span>
            </div>
            <input
              type="range"
              className="finops-slider"
              min="1"
              max="20"
              step="0.50"
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(parseFloat(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              <span>$1.00</span>
              <span>$10.00</span>
              <span>$20.00</span>
            </div>
          </div>
        </TiltCard>
      </div>

      {/* ── ROI Heatmap Table ── */}
      <TiltCard className="glass-panel glitch-hover" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} color="#00e676" /> Channel ROI Performance
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '140px 70px 70px 1fr 60px',
          gap: '12px',
          padding: '10px 16px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <span>Channel</span>
          <span>Cost</span>
          <span>Revenue</span>
          <span>ROI Bar</span>
          <span>Factor</span>
        </div>
        {ROI_CHANNELS.map((ch, i) => (
          <ROIRow key={ch.name} channel={ch} index={i} />
        ))}
      </TiltCard>

    </div>
  );
};

export default FinOpsDashboard;
