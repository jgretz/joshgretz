type FutureRace = {
  id: number;
  user_id: number;
  title: string;
  location: string | null;
  distance: string | null;
  url: string | null;
  race_date: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type UpcomingRacesSectionProps = {
  races: FutureRace[];
};

const parseRaceDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return {
    day: d.getDate(),
    month: d.toLocaleDateString('en-US', {month: 'short'}).toUpperCase(),
  };
};

export const UpcomingRacesSection = ({races}: UpcomingRacesSectionProps) => {
  if (races.length === 0) return null;

  return (
    <section className="text-center">
      <h2 className="font-serif text-3xl sm:text-5xl text-warm-700">What&apos;s Next</h2>
      <p className="mt-3 font-serif text-lg italic text-warm-400">
        always chasing the next finish line
      </p>
      <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        {races.map((race) => {
          const date = race.race_date ? parseRaceDate(race.race_date) : null;

          return (
            <div
              key={race.id}
              className="flex items-center gap-4 rounded-xl border border-warm-200 bg-white/60 p-4 text-left"
            >
              {date && (
                <div className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-full bg-warm-600 text-white">
                  <span className="font-serif text-lg leading-none">{date.day}</span>
                  <span className="font-sans text-[10px] font-medium tracking-wider">
                    {date.month}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <div className="font-sans font-medium text-warm-700">{race.title}</div>
                <div className="font-sans text-sm text-warm-400">
                  {[race.distance, race.location].filter(Boolean).join(' · ')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
