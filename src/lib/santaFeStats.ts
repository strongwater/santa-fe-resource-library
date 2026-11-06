// Santa Fe's own stats, used by <SantaFeComparison /> on every city profile
// (except Santa Fe's own profile and the two state-level profiles). This
// replaces the ~20KB of identical text that was copy-pasted into 26 city
// templates in the original single-file site — see MIGRATION_GUIDE.md.
//
// Keep this in sync with the "Snapshot" numbers on Santa Fe's own profile
// (src/content/cities/santafe.md) if either is updated.
export const santaFeStats = {
  population: '89,837',
  populationNote: '2025 est.',
  landArea: '~37.4 sq mi',
  density: '~2,400/sq mi',
  climateZone: '5B, cool-dry (BSk, cold semi-arid)',
  medianHouseholdIncome: '$73,482',
  medianHomeValue: '$444,900',
  medianHomeValueNote: '2020–24 ACS',
  priceToIncomeRatio: '6.1×',
  costToBuild: '~$200–$350/sqft',
  costToBuildNote: 'adobe-style construction runs higher than typical U.S. framing',
  costToBuy: '~$260/sqft',
  costToBuyNote: 'implied from median home value at a typical local home size',
  buildToBuyPremium: '0.95×',
  sourceNote:
    'Source: U.S. Census Bureau QuickFacts, Wikipedia infoboxes, and DOE/IECC climate zone maps, cross-checked; build/buy figures are planning-level estimates, not independently audited.',
};
