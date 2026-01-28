interface HeatmapProps {
  data: number[];
  maxValue?: number;
}

export const Heatmap = ({data, maxValue}: HeatmapProps) => {
  const max = maxValue ?? Math.max(...data, 1);

  return (
    <div className="grid grid-cols-[repeat(52,1fr)] gap-[3px]">
      {data.map((value, i) => (
        <div
          key={`${i}-${value}`}
          className="aspect-square min-w-2 rounded-sm"
          style={{
            backgroundColor:
              value === 0
                ? 'rgba(93, 78, 55, 0.1)'
                : `rgba(139, 90, 43, ${0.2 + (value / max) * 0.8})`,
          }}
          title={`${value}`}
        />
      ))}
    </div>
  );
};
