const TrailSvg = () => (
  <svg
    viewBox="0 0 1000 200"
    preserveAspectRatio="xMidYMax slice"
    className="absolute bottom-0 left-0 right-0 h-[140px] w-full opacity-20"
    aria-hidden="true"
  >
    {/* Far hills */}
    <path d="M0 200 Q80 100 200 140 T450 110 T700 150 T1000 120 L1000 200 Z" fill="#c4a574" />
    {/* Near hills */}
    <path d="M0 200 Q150 140 350 170 T700 155 T1000 180 L1000 200 Z" fill="#8b7355" />
    {/* Winding dashed trail */}
    <path
      d="M-20 175 Q100 150 250 168 Q400 186 550 160 Q700 134 850 155 Q950 170 1020 150"
      stroke="#fef9f3"
      strokeWidth="3"
      fill="none"
      strokeDasharray="10 5"
      strokeLinecap="round"
    />
  </svg>
);

const StravaLogo = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
  </svg>
);

export const StravaCTASection = () => (
  <section>
    <div className="relative overflow-hidden rounded-2xl bg-warm-700 p-6 sm:p-12">
      <TrailSvg />
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-8">
        <div>
          <p className="font-hand text-lg text-warm-400">follow along</p>
          <h2 className="mt-1 font-serif text-2xl sm:text-3xl text-warm-50">
            Want to see what tomorrow brings?
          </h2>
          <p className="mt-3 max-w-md font-sans text-warm-300">
            Every mile logged, every trail explored. Follow my running journey on Strava.
          </p>
        </div>
        <a
          href="https://www.strava.com/athletes/joshgretz"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-warm-50 px-6 py-3 font-sans font-medium text-warm-700 transition-opacity hover:opacity-90"
        >
          <StravaLogo />
          Follow on Strava
        </a>
      </div>
    </div>
  </section>
);
