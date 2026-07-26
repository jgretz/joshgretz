import {type FormEvent, memo, useCallback, useId, useState} from 'react';
import {US_STATES, US_STATE_NAMES, stateNameToAbbr} from 'running/states';
import {updateActivityDetails} from '../../services/activities/activities-server';
import {Button} from '../ui/button';
import {formatDate, formatDistance, formatTime} from './activity-format';

export type AdminActivity = {
  id: number;
  name: string | null;
  strava_id: string;
  start_date_local: string | null;
  distance: string | null;
  moving_time: string | null;
  location_city: string | null;
  location_state: string | null;
  location_country: string | null;
  featured_marathon: boolean | null;
};

// Only activities at or beyond marathon distance are eligible to represent a state.
const MARATHON_METERS = 42195;

// Geocoding stores full state names but may use an alternate spelling; resolve whatever is
// on the record back to a value the dropdown actually offers.
const toStateName = (value: string | null): string => {
  if (!value) return '';
  const abbr = stateNameToAbbr(value);
  return abbr ? US_STATE_NAMES[abbr] ?? '' : '';
};

const inputClass =
  'w-full rounded-lg border border-warm-300 px-3 py-1.5 text-sm focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500';

type ActivityRowProps = {
  activity: AdminActivity;
  onSaved: (activity: AdminActivity) => void;
};

export const ActivityRow = memo(function ActivityRow({activity, onSaved}: ActivityRowProps) {
  const stateFieldId = useId();
  const cityFieldId = useId();
  const featuredFieldId = useId();

  const [editing, setEditing] = useState(false);
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const qualifies = parseFloat(activity.distance ?? '0') >= MARATHON_METERS;

  const handleEdit = useCallback(() => {
    setState(toStateName(activity.location_state));
    setCity(activity.location_city ?? '');
    setFeatured(Boolean(activity.featured_marathon));
    setError(null);
    setEditing(true);
  }, [activity]);

  const handleCancel = useCallback(() => {
    setEditing(false);
    setError(null);
  }, []);

  const handleSave = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setError(null);

      try {
        const updated = await updateActivityDetails({
          data: {
            id: activity.id,
            details: {
              location_state: state || null,
              location_city: city.trim() || null,
              location_country: state
                ? activity.location_country ?? 'United States'
                : activity.location_country,
              featured_marathon: featured,
            },
          },
        });
        onSaved(updated);
        setEditing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save activity');
      } finally {
        setSaving(false);
      }
    },
    [activity, state, city, featured, onSaved],
  );

  return (
    <>
      <tr className="bg-white">
        <td className="px-4 py-3 text-warm-600">{activity.id}</td>
        <td className="px-4 py-3 text-warm-800">{activity.name ?? '-'}</td>
        <td className="px-4 py-3 text-warm-600">{formatDate(activity.start_date_local)}</td>
        <td className="px-4 py-3 text-warm-600">{formatDistance(activity.distance)}</td>
        <td className="px-4 py-3 text-warm-600">{formatTime(activity.moving_time)}</td>
        <td className="px-4 py-3 text-warm-600">
          {activity.location_state ?? <span className="text-red-600">not set</span>}
        </td>
        <td className="px-4 py-3 text-warm-600">{activity.featured_marathon ? 'featured' : '-'}</td>
        <td className="px-4 py-3">
          <a
            href={`https://www.strava.com/activities/${activity.strava_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-warm-700 underline hover:text-warm-900"
          >
            {activity.strava_id}
          </a>
        </td>
        <td className="px-4 py-3">
          <button
            type="button"
            onClick={editing ? handleCancel : handleEdit}
            className="text-warm-700 underline hover:text-warm-900"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </td>
      </tr>

      {editing && (
        <tr className="bg-warm-50">
          <td colSpan={9} className="px-4 py-4">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={stateFieldId}
                    className="mb-1 block text-sm font-medium text-warm-700"
                  >
                    State
                  </label>
                  <select
                    id={stateFieldId}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">No state</option>
                    {US_STATES.map((abbr) => (
                      <option key={abbr} value={US_STATE_NAMES[abbr]}>
                        {US_STATE_NAMES[abbr]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor={cityFieldId}
                    className="mb-1 block text-sm font-medium text-warm-700"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id={cityFieldId}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g., West Windsor"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor={featuredFieldId}
                  className="flex items-center gap-2 text-sm text-warm-700"
                >
                  <input
                    type="checkbox"
                    id={featuredFieldId}
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="accent-warm-700"
                  />
                  Use as this state&rsquo;s featured race
                </label>
                {!qualifies && (
                  <p className="mt-1 text-xs text-warm-500">
                    This activity is under marathon distance, so it will not be picked as a
                    state&rsquo;s race regardless of this setting.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                {error && <span className="text-sm text-red-600">{error}</span>}
              </div>
            </form>
          </td>
        </tr>
      )}
    </>
  );
});
