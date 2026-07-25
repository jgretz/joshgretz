// Canonical source: every other lookup in this file derives from it. Ordering is the
// order states appear in admin dropdowns.
export const US_STATE_NAMES: Record<string, string> = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DC: 'District of Columbia',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
};

// Alternate spellings reverse geocoding may return for a state.
const STATE_NAME_ALIASES: Record<string, string> = {
  'washington, d.c.': 'DC',
  'washington dc': 'DC',
};

export const US_STATES: string[] = Object.keys(US_STATE_NAMES);

export const STATE_NAME_TO_ABBR: Record<string, string> = Object.entries(US_STATE_NAMES).reduce(
  (lookup, [abbr, name]) => ({...lookup, [name.toLowerCase()]: abbr}),
  {...STATE_NAME_ALIASES},
);

export const stateNameToAbbr = (name: string): string | null => {
  const normalized = name.trim().toLowerCase();
  // check if already an abbreviation
  if (normalized.length === 2) {
    const upper = normalized.toUpperCase();
    return US_STATES.includes(upper) ? upper : null;
  }
  return STATE_NAME_TO_ABBR[normalized] ?? null;
};
