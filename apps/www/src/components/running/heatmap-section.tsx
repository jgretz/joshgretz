import {useState, useCallback} from 'react';
import {cn} from '../../lib/styles';

type DailyStat = {
  id: number;
  user_id: number;
  date: string;
  total_miles: string | null;
  run_count: number | null;
  created_at: string | null;
  updated_at: string | null;
};

type HeatmapSectionProps = {
  dailyStats: DailyStat[];
  selectedYear: number;
  onYearChange: (year: number) => void;
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({length: CURRENT_YEAR - 2020 + 1}, (_, i) => CURRENT_YEAR - i);
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const getColor = (miles: number) => {
  if (miles === 0) return 'rgba(93,78,55,0.1)';
  if (miles < 3) return 'rgba(139,90,43,0.2)';
  if (miles < 5) return 'rgba(139,90,43,0.4)';
  if (miles < 8) return 'rgba(139,90,43,0.6)';
  if (miles < 12) return 'rgba(139,90,43,0.8)';
  return 'rgba(139,90,43,1.0)';
};

type CellData = {
  date: string;
  miles: number;
  week: number;
  day: number;
};

const buildGrid = (year: number, statsMap: Map<string, number>): CellData[] => {
  const cells: CellData[] = [];
  const jan1 = new Date(year, 0, 1);
  const dec31 = new Date(year, 11, 31);
  const startDay = (jan1.getDay() + 6) % 7;

  const current = new Date(jan1);
  while (current <= dec31) {
    const dateStr = current.toISOString().split('T')[0];
    const dayOfYear = Math.floor(
      (Date.UTC(current.getFullYear(), current.getMonth(), current.getDate()) -
        Date.UTC(year, 0, 1)) /
        (1000 * 60 * 60 * 24),
    );
    const dayOfWeek = (current.getDay() + 6) % 7;
    const week = Math.floor((dayOfYear + startDay) / 7);

    cells.push({
      date: dateStr,
      miles: statsMap.get(dateStr) ?? 0,
      week,
      day: dayOfWeek,
    });

    current.setDate(current.getDate() + 1);
  }

  return cells;
};

const getMonthPositions = (year: number) => {
  const jan1 = new Date(year, 0, 1);
  const startDay = (jan1.getDay() + 6) % 7;

  return MONTH_LABELS.map((label, month) => {
    const firstOfMonth = new Date(year, month, 1);
    const dayOfYear = Math.floor(
      (Date.UTC(year, month, 1) - Date.UTC(year, 0, 1)) /
        (1000 * 60 * 60 * 24),
    );
    const week = Math.floor((dayOfYear + startDay) / 7);
    return {label, week};
  });
};

export const HeatmapSection = ({dailyStats, selectedYear, onYearChange}: HeatmapSectionProps) => {
  const [tooltip, setTooltip] = useState<{
    date: string;
    miles: number;
    x: number;
    y: number;
  } | null>(null);

  const statsMap = new Map<string, number>();
  for (const stat of dailyStats) {
    statsMap.set(stat.date, parseFloat(stat.total_miles ?? '0'));
  }

  const cells = buildGrid(selectedYear, statsMap);
  const monthPositions = getMonthPositions(selectedYear);
  const totalWeeks = Math.max(...cells.map((c) => c.week)) + 1;

  const labelWidth = 28;
  const topOffset = 16;
  const cellSize = 10;
  const cellGap = 2;
  const cellStep = cellSize + cellGap;
  const svgWidth = labelWidth + totalWeeks * cellStep;
  const svgHeight = topOffset + 7 * cellStep;

  const handleMouseEnter = useCallback(
    (cell: CellData, e: React.MouseEvent<SVGRectElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({
        date: cell.date,
        miles: cell.miles,
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    },
    [],
  );

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  return (
    <section className="text-center">
      <h2 className="font-serif text-5xl text-warm-700">Year in Miles</h2>
      <p className="mt-3 font-serif text-lg italic text-warm-400">every run, every day</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {YEARS.map((year) => (
          <button
            key={year}
            onClick={() => onYearChange(year)}
            className={cn(
              'rounded-full px-3 py-1 font-sans text-sm transition-colors',
              year === selectedYear
                ? 'bg-warm-600 text-white'
                : 'bg-warm-100 text-warm-600 hover:bg-warm-200',
            )}
          >
            {year}
          </button>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-warm-200 bg-white/60 p-6">
        <div className="relative">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="block w-full">
            {monthPositions.map(({label, week}) => (
              <text
                key={label}
                x={labelWidth + week * cellStep}
                y={10}
                className="fill-warm-400 font-sans"
                fontSize={8}
              >
                {label}
              </text>
            ))}
            {DAY_LABELS.map((label, i) => (
              <text
                key={i}
                x={0}
                y={topOffset + i * cellStep + cellSize - 1}
                className="fill-warm-400 font-sans"
                fontSize={7}
              >
                {label}
              </text>
            ))}
            {cells.map((cell) => (
              <rect
                key={cell.date}
                x={labelWidth + cell.week * cellStep}
                y={topOffset + cell.day * cellStep}
                width={cellSize}
                height={cellSize}
                rx={2}
                fill={getColor(cell.miles)}
                className="cursor-pointer"
                onMouseEnter={(e) => handleMouseEnter(cell, e)}
                onMouseLeave={handleMouseLeave}
              />
            ))}
          </svg>
          {tooltip && (
            <div
              className="pointer-events-none fixed z-50 rounded bg-warm-800 px-2 py-1 font-sans text-xs text-white shadow-lg"
              style={{
                left: tooltip.x,
                top: tooltip.y - 32,
                transform: 'translateX(-50%)',
              }}
            >
              {tooltip.miles.toFixed(1)} mi — {tooltip.date}
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-end gap-2 font-sans text-xs text-warm-400">
          <span>Less</span>
          {[0, 3, 5, 8, 12].map((threshold) => (
            <div
              key={threshold}
              className="h-3 w-3 rounded-sm"
              style={{backgroundColor: getColor(threshold)}}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </section>
  );
};
