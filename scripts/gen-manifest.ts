// Writes public/scenarios.json so external test repos (Playwright/axe-core,
// NVDA) can discover every scenario, its URLs and its expectations.
import { writeFileSync } from 'fs';
import { join } from 'path';
import { SCENARIOS, VARIANTS, scenarioHref } from '../src/scenarios/registry.data';

const manifest = {
  version: 1,
  urlParams: {
    variant: 'accessible | broken (default accessible)',
    delay: 'milliseconds before async updates (default per scenario; 0 = immediate)',
  },
  scenarios: SCENARIOS.map((s) => ({
    ...s,
    urls: Object.fromEntries(VARIANTS.map((v) => [v, scenarioHref(s, v)])),
  })),
};

const out = join(__dirname, '..', 'public', 'scenarios.json');
writeFileSync(out, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Wrote ${SCENARIOS.length} scenarios to ${out}`);
