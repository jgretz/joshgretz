type PersonalRecord = {
  id: number;
  user_id: number;
  title: string;
  time_seconds: number;
  activity_id: number | null;
  distance: string | null;
  pace_seconds: number | null;
  race_name: string | null;
  race_location: string | null;
  strava_id: string | null;
  race_date: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type PersonalRecordsSectionProps = {
  records: PersonalRecord[];
};

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
  });

const formatPace = (paceSeconds: number) => {
  const m = Math.floor(paceSeconds / 60);
  const s = paceSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}/mi`;
};

const PRCard = ({pr}: {pr: PersonalRecord}) => (
  <div className="rounded-xl border border-warm-200 bg-white/60 px-4 py-6 text-center">
    <div className="font-sans text-sm font-medium uppercase tracking-widest text-warm-500">
      {pr.title}
    </div>
    <div className="mt-2 font-serif text-3xl text-warm-700">
      {formatTime(pr.time_seconds)}
    </div>
    {pr.pace_seconds && (
      <div className="mt-2 font-sans text-sm text-warm-400">
        {formatPace(pr.pace_seconds)}
      </div>
    )}
    {pr.race_name && (
      <div className="mt-2 font-serif text-sm italic text-warm-500">
        {pr.strava_id ? (
          <a
            href={`https://www.strava.com/activities/${pr.strava_id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {pr.race_name}
          </a>
        ) : (
          pr.race_name
        )}
      </div>
    )}
    {(pr.race_date || pr.created_at) && (
      <div className="mt-2 font-sans text-sm text-warm-400">
        {formatDate(pr.race_date || pr.created_at!)}
      </div>
    )}
  </div>
);

export const PersonalRecordsSection = ({records}: PersonalRecordsSectionProps) => {
  if (records.length === 0) return null;

  return (
    <section className="text-center">
      <h2 className="font-serif text-5xl text-warm-700">Personal Records</h2>
      <p className="mt-3 font-serif text-lg italic text-warm-400">
        from the mile to the hundred
      </p>
      <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {records.map((pr) => (
          <PRCard key={pr.id} pr={pr} />
        ))}
      </div>
    </section>
  );
};
