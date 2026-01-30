import {useState, useCallback} from 'react';
import {US_STATE_PATHS, STATE_NAMES} from '../../data/us-map-paths';

type StateStat = {
  id: number;
  user_id: number;
  state: string;
  run_count: number | null;
  marathon_count: number | null;
  created_at: string | null;
  updated_at: string | null;
};

type USMapSectionProps = {
  stateStats: StateStat[];
};

const COLORS = {
  marathon: '#8b5a2b',
  runOnly: '#c4a574',
  none: '#e8dfd5',
} as const;

type StateStatus = 'marathon' | 'runOnly' | 'none';

const getStateStatus = (
  abbr: string,
  statsMap: Map<string, StateStat>,
): StateStatus => {
  const stat = statsMap.get(abbr);
  if (!stat) return 'none';
  if ((stat.marathon_count ?? 0) > 0) return 'marathon';
  if ((stat.run_count ?? 0) > 0) return 'runOnly';
  return 'none';
};

const statusLabel = (status: StateStatus) => {
  switch (status) {
    case 'marathon':
      return 'Marathon raced';
    case 'runOnly':
      return 'Run in';
    case 'none':
      return 'Not yet';
  }
};

export const USMapSection = ({stateStats}: USMapSectionProps) => {
  const [tooltip, setTooltip] = useState<{
    name: string;
    status: string;
    x: number;
    y: number;
  } | null>(null);

  const statsMap = new Map<string, StateStat>();
  for (const stat of stateStats) {
    statsMap.set(stat.state, stat);
  }

  const statesRun = stateStats.filter((s) => (s.run_count ?? 0) > 0).length;
  const statesMarathon = stateStats.filter((s) => (s.marathon_count ?? 0) > 0).length;

  const handleMouseEnter = useCallback(
    (abbr: string, status: StateStatus, e: React.MouseEvent<SVGPathElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({
        name: STATE_NAMES[abbr] ?? abbr,
        status: statusLabel(status),
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    },
    [],
  );

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  return (
    <section className="text-center">
      <h2 className="font-serif text-5xl text-warm-700">50 States Journey</h2>
      <p className="mt-3 font-serif text-lg italic text-warm-400">running across America</p>
      <div className="mt-6 flex justify-center gap-12">
        <div>
          <div className="font-serif text-3xl text-warm-700">{statesRun}/50</div>
          <div className="font-sans text-sm text-warm-400">states run</div>
        </div>
        <div>
          <div className="font-serif text-3xl text-warm-700">{statesMarathon}/50</div>
          <div className="font-sans text-sm text-warm-400">marathon states</div>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-warm-200 bg-white/60 p-6">
        <div className="relative">
          <svg viewBox="0 0 960 600" className="mx-auto w-full max-w-3xl">
            {Object.entries(US_STATE_PATHS).map(([abbr, path]) => {
              const status = getStateStatus(abbr, statsMap);
              return (
                <path
                  key={abbr}
                  d={path}
                  fill={COLORS[status]}
                  stroke="#000"
                  strokeWidth={0.5}
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  onMouseEnter={(e) => handleMouseEnter(abbr, status, e)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
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
              {tooltip.name} — {tooltip.status}
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-end gap-4 font-sans text-xs text-warm-500">
          <span className="flex items-center gap-1">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{backgroundColor: COLORS.marathon}}
            />
            Marathon
          </span>
          <span className="flex items-center gap-1">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{backgroundColor: COLORS.runOnly}}
            />
            Run only
          </span>
          <span className="flex items-center gap-1">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{backgroundColor: COLORS.none}}
            />
            Not yet
          </span>
        </div>
      </div>
    </section>
  );
};
