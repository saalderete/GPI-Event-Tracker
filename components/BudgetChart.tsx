import type { CSSProperties, ReactNode } from "react";

// The Project Budget's charts, drawn from the team's figures in the
// visitor's palette: ink for what is measured, the accent for the bar the
// reader should notice, so they read in both themes and in print. Every
// number here is typed in from the team's budget; nothing is computed
// beyond the picture.

type Tone = "ink" | "accent" | "soft";

const mono: CSSProperties = { fontFamily: "var(--font-mono)" };
const tones: Record<Tone, CSSProperties> = {
  ink: { fill: "var(--ink)" },
  accent: { fill: "var(--accent)" },
  soft: { fill: "var(--ink)", fillOpacity: 0.38 }
};
const labelStyle: CSSProperties = { ...mono, fill: "var(--ink-soft)" };
const tickStyle: CSSProperties = { ...mono, fill: "var(--muted)" };
const valueStyle: CSSProperties = { ...mono, fill: "var(--ink)", fontWeight: 500 };
const gridStyle: CSSProperties = { stroke: "var(--border)", strokeWidth: 1 };
const axisStyle: CSSProperties = { stroke: "var(--muted)", strokeWidth: 1 };

const num = (n: number) => n.toLocaleString("en-US");
const usd = (n: number) => `$${num(n)}`;
const usdK = (n: number) => `$${Math.round(n / 1000)}K`;

interface HRow {
  label: string;
  value: number;
  tone?: Tone;
}

function HBars({
  title,
  rows,
  max,
  ticks,
  fmt,
  tickFmt = fmt,
  lw,
  xlabel,
  w = 560
}: {
  title: string;
  rows: HRow[];
  max: number;
  ticks: number[];
  fmt: (n: number) => string;
  tickFmt?: (n: number) => string;
  lw: number;
  xlabel?: string;
  w?: number;
}) {
  const bh = 20;
  const gap = 11;
  const top = 8;
  const right = 76;
  const x0 = lw + 10;
  const bw = w - x0 - right;
  const base = top + rows.length * (bh + gap) - gap + 8;
  const h = base + (xlabel ? 46 : 28);
  const sx = (v: number) => x0 + (v / max) * bw;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img">
      <title>{title}</title>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={sx(t)} x2={sx(t)} y1={top - 4} y2={base} style={gridStyle} />
          <text x={sx(t)} y={base + 16} textAnchor="middle" fontSize={11} style={tickStyle}>
            {tickFmt(t)}
          </text>
        </g>
      ))}
      {rows.map((r, i) => {
        const y = top + i * (bh + gap);
        return (
          <g key={r.label}>
            <text x={lw} y={y + bh - 5} textAnchor="end" fontSize={12} style={labelStyle}>
              {r.label}
            </text>
            <rect x={x0} y={y} width={Math.max(0, sx(r.value) - x0)} height={bh} style={tones[r.tone ?? "ink"]} />
            <text x={sx(r.value) + 7} y={y + bh - 5} fontSize={11.5} style={valueStyle}>
              {fmt(r.value)}
            </text>
          </g>
        );
      })}
      <line x1={x0} x2={x0} y1={top - 4} y2={base} style={axisStyle} />
      <line x1={x0} x2={x0 + bw} y1={base} y2={base} style={axisStyle} />
      {xlabel ? (
        <text x={x0 + bw / 2} y={h - 8} textAnchor="middle" fontSize={11} style={tickStyle}>
          {xlabel}
        </text>
      ) : null}
    </svg>
  );
}

function Legend({ items, x, y }: { items: { label: string; tone: Tone }[]; x: number; y: number }) {
  let cursor = x;
  return (
    <g>
      {items.map((it) => {
        const at = cursor;
        cursor += 20 + it.label.length * 6.8 + 22;
        return (
          <g key={it.label}>
            <rect x={at} y={y - 10} width={12} height={12} style={tones[it.tone]} />
            <text x={at + 18} y={y} fontSize={11} style={tickStyle}>
              {it.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function HStack({
  title,
  rows,
  max,
  ticks,
  lw,
  legend,
  w = 560
}: {
  title: string;
  rows: { label: string; parts: { value: number; tone: Tone }[] }[];
  max: number;
  ticks: number[];
  lw: number;
  legend: { label: string; tone: Tone }[];
  w?: number;
}) {
  const bh = 22;
  const gap = 14;
  const top = 8;
  const right = 76;
  const x0 = lw + 10;
  const bw = w - x0 - right;
  const base = top + rows.length * (bh + gap) - gap + 8;
  const h = base + 58;
  const sx = (v: number) => x0 + (v / max) * bw;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img">
      <title>{title}</title>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={sx(t)} x2={sx(t)} y1={top - 4} y2={base} style={gridStyle} />
          <text x={sx(t)} y={base + 16} textAnchor="middle" fontSize={11} style={tickStyle}>
            {usdK(t)}
          </text>
        </g>
      ))}
      {rows.map((r, i) => {
        const y = top + i * (bh + gap);
        let acc = 0;
        const parts = r.parts.map((p, k) => {
          const x = sx(acc);
          acc += p.value;
          return <rect key={k} x={x} y={y} width={Math.max(0, sx(acc) - x)} height={bh} style={tones[p.tone]} />;
        });
        return (
          <g key={r.label}>
            <text x={lw} y={y + bh - 6} textAnchor="end" fontSize={12} style={labelStyle}>
              {r.label}
            </text>
            {parts}
            <text x={sx(acc) + 7} y={y + bh - 6} fontSize={11.5} style={valueStyle}>
              {usd(acc)}
            </text>
          </g>
        );
      })}
      <line x1={x0} x2={x0} y1={top - 4} y2={base} style={axisStyle} />
      <line x1={x0} x2={x0 + bw} y1={base} y2={base} style={axisStyle} />
      <Legend items={legend} x={x0} y={base + 44} />
    </svg>
  );
}

function Columns({
  title,
  cols,
  max,
  ticks,
  fmt,
  ylabel,
  xlabel,
  w = 320,
  h = 250,
  barW = 54
}: {
  title: string;
  cols: { label: string[]; value: number; tone?: Tone }[];
  max: number;
  ticks: number[];
  fmt: (n: number) => string;
  ylabel?: string;
  xlabel?: string;
  w?: number;
  h?: number;
  barW?: number;
}) {
  const left = ylabel ? 58 : 40;
  const top = 20;
  const lines = Math.max(...cols.map((c) => c.label.length));
  const bottom = 12 + lines * 14 + (xlabel ? 20 : 4);
  const y0 = h - bottom;
  const ch = y0 - top;
  const cw = w - left - 10;
  const slot = cw / cols.length;
  const sy = (v: number) => y0 - (v / max) * ch;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img">
      <title>{title}</title>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={left} x2={left + cw} y1={sy(t)} y2={sy(t)} style={gridStyle} />
          <text x={left - 8} y={sy(t) + 4} textAnchor="end" fontSize={11} style={tickStyle}>
            {fmt(t)}
          </text>
        </g>
      ))}
      {cols.map((c, i) => {
        const cx = left + slot * (i + 0.5);
        return (
          <g key={c.label.join(" ")}>
            <rect x={cx - barW / 2} y={sy(c.value)} width={barW} height={Math.max(0, y0 - sy(c.value))} style={tones[c.tone ?? "ink"]} />
            <text x={cx} y={sy(c.value) - 6} textAnchor="middle" fontSize={11.5} style={valueStyle}>
              {fmt(c.value)}
            </text>
            {c.label.map((ln, k) => (
              <text key={ln} x={cx} y={y0 + 16 + k * 14} textAnchor="middle" fontSize={11} style={labelStyle}>
                {ln}
              </text>
            ))}
          </g>
        );
      })}
      <line x1={left} x2={left} y1={top - 4} y2={y0} style={axisStyle} />
      <line x1={left} x2={left + cw} y1={y0} y2={y0} style={axisStyle} />
      {ylabel ? (
        <text x={14} y={top + ch / 2} textAnchor="middle" fontSize={11} style={tickStyle} transform={`rotate(-90 14 ${top + ch / 2})`}>
          {ylabel}
        </text>
      ) : null}
      {xlabel ? (
        <text x={left + cw / 2} y={h - 6} textAnchor="middle" fontSize={11} style={tickStyle}>
          {xlabel}
        </text>
      ) : null}
    </svg>
  );
}

function ProductiveMonth({ title }: { title: string }) {
  const w = 320;
  const h = 310;
  const left = 46;
  const top = 16;
  const bottom = 78;
  const y0 = h - bottom;
  const ch = y0 - top;
  const max = 160;
  const sy = (v: number) => y0 - (v / max) * ch;
  const cx = left + (w - left - 16) / 2;
  const bw = 110;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img">
      <title>{title}</title>
      {[0, 40, 80, 120, 160].map((t) => (
        <g key={t}>
          <line x1={left} x2={w - 16} y1={sy(t)} y2={sy(t)} style={gridStyle} />
          <text x={left - 8} y={sy(t) + 4} textAnchor="end" fontSize={11} style={tickStyle}>
            {t}
          </text>
        </g>
      ))}
      <rect x={cx - bw / 2} y={sy(130)} width={bw} height={y0 - sy(130)} style={tones.ink} />
      <rect x={cx - bw / 2} y={sy(160)} width={bw} height={sy(130) - sy(160)} style={tones.accent} />
      <text x={cx} y={(sy(130) + y0) / 2 + 5} textAnchor="middle" fontSize={15} style={{ ...mono, fill: "var(--paper)", fontWeight: 500 }}>
        130
      </text>
      <text x={cx} y={(sy(160) + sy(130)) / 2 + 5} textAnchor="middle" fontSize={15} style={{ ...mono, fill: "var(--on-accent)", fontWeight: 500 }}>
        30
      </text>
      <line x1={left} x2={left} y1={top - 4} y2={y0} style={axisStyle} />
      <line x1={left} x2={w - 16} y1={y0} y2={y0} style={axisStyle} />
      <text x={cx} y={y0 + 18} textAnchor="middle" fontSize={11.5} style={labelStyle}>
        One full-time month
      </text>
      <Legend items={[{ label: "Productive project hours, 130", tone: "ink" }]} x={left} y={y0 + 44} />
      <Legend items={[{ label: "Meetings, email, support, time off, 30", tone: "accent" }]} x={left} y={y0 + 64} />
    </svg>
  );
}

function CumulativeSpend({ title }: { title: string }) {
  const w = 560;
  const h = 300;
  const left = 62;
  const top = 24;
  const bottom = 44;
  const right = 24;
  const pts = [0, 17820, 35625, 49622, 49622, 49622, 49622];
  const max = 60000;
  const cw = w - left - right;
  const y0 = h - bottom;
  const ch = y0 - top;
  const sx = (i: number) => left + (i / 6) * cw;
  const sy = (v: number) => y0 - (v / max) * ch;
  const path = pts.map((v, i) => `${i ? "L" : "M"}${sx(i).toFixed(1)} ${sy(v).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img">
      <title>{title}</title>
      {[0, 10000, 20000, 30000, 40000, 50000, 60000].map((t) => (
        <g key={t}>
          <line x1={left} x2={left + cw} y1={sy(t)} y2={sy(t)} style={gridStyle} />
          <text x={left - 8} y={sy(t) + 4} textAnchor="end" fontSize={11} style={tickStyle}>
            {usdK(t)}
          </text>
        </g>
      ))}
      <path d={path} fill="none" style={{ stroke: "var(--ink)", strokeWidth: 2 }} />
      {pts.map((v, i) => (
        <g key={i}>
          <circle cx={sx(i)} cy={sy(v)} r={4.5} style={i >= 1 && i <= 3 ? tones.accent : tones.ink} />
          <text x={sx(i)} y={y0 + 18} textAnchor="middle" fontSize={11} style={tickStyle}>
            M{i}
          </text>
        </g>
      ))}
      {[1, 2].map((i) => (
        <text key={i} x={sx(i) - 9} y={sy(pts[i]) - 4} textAnchor="end" fontSize={11.5} style={valueStyle}>
          {usd(pts[i])}
        </text>
      ))}
      <text x={sx(3)} y={sy(pts[3]) - 12} textAnchor="middle" fontSize={11.5} style={valueStyle}>
        {usd(pts[3])}
      </text>
      <line x1={left} x2={left} y1={top - 4} y2={y0} style={axisStyle} />
      <line x1={left} x2={left + cw} y1={y0} y2={y0} style={axisStyle} />
      <text x={left + cw / 2} y={h - 8} textAnchor="middle" fontSize={11} style={tickStyle}>
        month
      </text>
    </svg>
  );
}

function Ranges({
  title,
  rows,
  min,
  max,
  ticks,
  marker,
  xlabel,
  w = 560
}: {
  title: string;
  rows: { label: string; sub: string; from: number; to: number }[];
  min: number;
  max: number;
  ticks: number[];
  marker: { value: number; label: string };
  xlabel?: string;
  w?: number;
}) {
  const lw = 150;
  const top = 34;
  const rh = 46;
  const bh = 18;
  const right = 24;
  const x0 = lw + 10;
  const bw = w - x0 - right;
  const base = top + rows.length * rh;
  const h = base + (xlabel ? 46 : 28);
  const sx = (v: number) => x0 + ((v - min) / (max - min)) * bw;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img">
      <title>{title}</title>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={sx(t)} x2={sx(t)} y1={top - 6} y2={base} style={gridStyle} />
          <text x={sx(t)} y={base + 16} textAnchor="middle" fontSize={11} style={tickStyle}>
            {num(t)}
          </text>
        </g>
      ))}
      {rows.map((r, i) => {
        const y = top + i * rh + (rh - bh) / 2;
        return (
          <g key={r.label}>
            <text x={lw} y={y + 5} textAnchor="end" fontSize={12} style={labelStyle}>
              {r.label}
            </text>
            <text x={lw} y={y + 19} textAnchor="end" fontSize={11} style={tickStyle}>
              {r.sub}
            </text>
            <rect x={sx(r.from)} y={y} width={Math.max(0, sx(r.to) - sx(r.from))} height={bh} rx={9} style={tones.ink} />
          </g>
        );
      })}
      <line x1={sx(marker.value)} x2={sx(marker.value)} y1={top - 10} y2={base} style={{ stroke: "var(--accent)", strokeWidth: 2 }} />
      <text x={sx(marker.value)} y={top - 16} textAnchor="middle" fontSize={11.5} style={{ ...mono, fill: "var(--accent)", fontWeight: 500 }}>
        {marker.label}
      </text>
      <line x1={x0} x2={x0 + bw} y1={base} y2={base} style={axisStyle} />
      {xlabel ? (
        <text x={x0 + bw / 2} y={h - 8} textAnchor="middle" fontSize={11} style={tickStyle}>
          {xlabel}
        </text>
      ) : null}
    </svg>
  );
}

const charts: Record<string, { caption: string; width: number; render: (title: string) => ReactNode }> = {
  "hours-by-package": {
    caption: "Hours by package: the seven packages at 14.73 hours per story point and the 58.5 project management hours carved out first, 603.67 hours in all.",
    width: 560,
    render: (title) => (
      <HBars
        title={title}
        lw={168}
        max={150}
        ticks={[0, 50, 100, 150]}
        fmt={num}
        xlabel="hours (total 603.67)"
        rows={[
          { label: "Unified calendar", value: 117.9 },
          { label: "Events by date", value: 73.7 },
          { label: "Event details", value: 44.2 },
          { label: "Account and categories", value: 117.9 },
          { label: "Ranked feed", value: 73.7 },
          { label: "Saving an event", value: 44.2 },
          { label: "Search", value: 73.7 },
          { label: "Project management", value: 58.5, tone: "accent" }
        ]}
      />
    )
  },
  "effort-estimates": {
    caption: "Effort estimates in hours. Bottom-up and PERT are the same number by construction; the analogous estimate is the independent comparison. The planning value is 603.67 hours.",
    width: 560,
    render: (title) => (
      <HBars
        title={title}
        lw={150}
        max={700}
        ticks={[0, 200, 400, 600]}
        fmt={num}
        xlabel="hours"
        rows={[
          { label: "Bottom-up", value: 603.67 },
          { label: "Three-point (PERT)", value: 603.67 },
          { label: "Analogous", value: 491 },
          { label: "Planning value", value: 603.67, tone: "accent" }
        ]}
      />
    )
  },
  "productive-month": {
    caption: "One full-time month: 160 nominal hours, of which 130 are productive project hours and 30 go to meetings, email, support and time off.",
    width: 320,
    render: (title) => <ProductiveMonth title={title} />
  },
  "base-cost": {
    caption: "Base cost over the horizon: the $49,622 build and $21,381 a year of operating cost. Total cost of ownership for one year, $71,003.",
    width: 560,
    render: (title) => (
      <HBars
        title={title}
        lw={130}
        max={60000}
        ticks={[0, 10000, 20000, 30000, 40000, 50000, 60000]}
        fmt={usd}
        tickFmt={usdK}
        xlabel="Total cost of ownership, 1 year: $71,003"
        rows={[
          { label: "Base build", value: 49622 },
          { label: "Annual operating", value: 21381, tone: "soft" }
        ]}
      />
    )
  },
  "emv-by-risk": {
    caption: "Expected monetary value by risk, chance times impact: $3,061, $2,663 and $719, a contingency reserve of $6,443.",
    width: 560,
    render: (title) => (
      <HBars
        title={title}
        lw={168}
        max={3500}
        ticks={[0, 1000, 2000, 3000]}
        fmt={usd}
        xlabel="EMV ($), total $6,443"
        rows={[
          { label: "Effort near pessimistic", value: 3061 },
          { label: "Organizers don't post", value: 2663 },
          { label: "Messy event data", value: 719 }
        ]}
      />
    )
  },
  "cumulative-spend": {
    caption: "Cumulative base spend by month: $17,820 after month 1, $35,625 after month 2, and the full $49,622 base build by the end of month 3.",
    width: 560,
    render: (title) => <CumulativeSpend title={title} />
  },
  "building-the-request": {
    caption: "Building the request: the $49,622 base build, the $6,443 contingency that makes the $56,065 cost baseline, and the $2,803 management reserve that makes the $58,868 total request.",
    width: 560,
    render: (title) => (
      <HStack
        title={title}
        lw={110}
        max={70000}
        ticks={[0, 10000, 20000, 30000, 40000, 50000, 60000, 70000]}
        legend={[
          { label: "Base build", tone: "ink" },
          { label: "Contingency", tone: "soft" },
          { label: "Management reserve", tone: "accent" }
        ]}
        rows={[
          { label: "Base build", parts: [{ value: 49622, tone: "ink" }] },
          {
            label: "Cost baseline",
            parts: [
              { value: 49622, tone: "ink" },
              { value: 6443, tone: "soft" }
            ]
          },
          {
            label: "Total request",
            parts: [
              { value: 49622, tone: "ink" },
              { value: 6443, tone: "soft" },
              { value: 2803, tone: "accent" }
            ]
          }
        ]}
      />
    )
  },
  "effort-ranges": {
    caption: "Effort, two methods and the planning value: function points give 426 to 852 hours, the analogous method 394 to 595 hours, and the PERT planning value of 603.67 hours sits inside the first range, just above the second.",
    width: 560,
    render: (title) => (
      <Ranges
        title={title}
        min={350}
        max={900}
        ticks={[400, 500, 600, 700, 800]}
        xlabel="team hours"
        marker={{ value: 603.67, label: "Planning value 603.67 h" }}
        rows={[
          { label: "Function points", sub: "426 to 852 h", from: 426, to: 852 },
          { label: "Analogous", sub: "394 to 595 h", from: 394, to: 595 }
        ]}
      />
    )
  },
  "people-needed": {
    caption: "People needed for 4.64 FTE-months: 1.66 full-time people over the plan's 2.8 months, or 2.51 over the sponsor's 8 weeks (1.85 months).",
    width: 320,
    render: (title) => (
      <Columns
        title={title}
        max={3}
        ticks={[0, 1, 2, 3]}
        fmt={(n) => n.toFixed(n % 1 ? 2 : 1)}
        ylabel="Full-time people"
        cols={[
          { label: ["Our plan", "(2.8 months)"], value: 1.66 },
          { label: ["Sponsor's 8 weeks", "(1.85 months)"], value: 2.51, tone: "accent" }
        ]}
      />
    )
  },
  "communication-paths": {
    caption: "Communication paths, n(n − 1) ÷ 2: with five people there are ten pairs where a misunderstanding can happen.",
    width: 320,
    render: (title) => (
      <Columns
        title={title}
        max={30}
        ticks={[0, 10, 20, 30]}
        fmt={num}
        ylabel="Paths"
        xlabel="People on the team (the accent marks our 5)"
        barW={24}
        cols={[2, 3, 4, 5, 6, 7, 8].map((n) => ({ label: [String(n)], value: (n * (n - 1)) / 2, tone: n === 5 ? "accent" : "ink" }))}
      />
    )
  }
};

export type ChartName = keyof typeof charts;

export function Chart({ name }: { name: ChartName }) {
  const c = charts[name];
  if (!c) throw new Error(`Unknown chart: ${name}`);
  return (
    <figure className="chart" style={{ maxWidth: c.width }}>
      {c.render(c.caption)}
      <figcaption className="meta">{c.caption}</figcaption>
    </figure>
  );
}
