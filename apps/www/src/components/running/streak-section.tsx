import {StatBlock} from '../ui/stat-block';

type Streak = {
  id: number;
  user_id: number;
  start_date: string | null;
  total_runs: number | null;
  total_miles: string | null;
  total_vert: number | null;
  created_at: string | null;
  updated_at: string | null;
};

type StreakSectionProps = {
  streak: Streak | null;
};

const daysSince = (dateStr: string) => {
  const start = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const formatNumber = (n: number) => n.toLocaleString();

const formatVert = (ft: number) => {
  if (ft >= 1000) return `${Math.round(ft / 1000)}K`;
  return formatNumber(ft);
};

export const StreakSection = ({streak}: StreakSectionProps) => {
  if (!streak?.start_date) return null;

  const days = daysSince(streak.start_date);
  const totalMiles = parseFloat(streak.total_miles ?? '0');
  const totalVert = streak.total_vert ?? 0;
  const avgMilesPerDay = days > 0 ? (totalMiles / days).toFixed(1) : '0';

  return (
    <section className="text-center">
      <h2 className="font-serif text-5xl text-warm-700">The Streak</h2>
      <p className="mt-3 font-serif text-lg italic text-warm-400">
        every single day since {formatDate(streak.start_date)}
      </p>
      <div className="mt-10">
        <div className="font-serif text-[10rem] leading-none text-warm-700">
          {formatNumber(days)}
        </div>
        <p className="mt-2 font-sans text-lg text-warm-500">
          consecutive days running{' '}
          <span className="font-serif italic text-warm-400">and counting</span>
        </p>
      </div>
      <div className="mt-10 rounded-2xl border border-warm-200 bg-white/60 px-8 py-8">
        <div className="grid grid-cols-3 gap-6">
          <StatBlock value={formatNumber(Math.round(totalMiles))} label="Total Miles" />
          <StatBlock value={formatVert(totalVert)} label="Feet Climbed" />
          <StatBlock value={avgMilesPerDay} label="Avg Miles/Day" />
        </div>
      </div>
    </section>
  );
};
