import * as fs from 'fs';
import * as path from 'path';
import { featureFlagMap } from '../src/enums/feature-flags/feature-flags-enum';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeatureFlag {
  name: string;
  description: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const OUTPUT_DIR = path.join(__dirname, '../../docs/feature-flags');

// ─── Template ─────────────────────────────────────────────────────────────────

function toMarkdown(flag: FeatureFlag): string {
  const lines: string[] = [];

  lines.push(`# ${flag.name}`);
  lines.push('');

  lines.push('## Name');
  lines.push('');
  lines.push(`\`${flag.name}\``);
  lines.push('');

  lines.push('## Description');
  lines.push('');
  lines.push(flag.description);
  lines.push('');

  lines.push('## Additional Information');
  lines.push('');
  lines.push('## Images');

  return lines.join('\n');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const flags: FeatureFlag[] = featureFlagMap;

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Generate one markdown file per item if flag doesn't already exist
  let created = 0;
  for (const flag of flags) {
    if (!fs.existsSync(path.join(OUTPUT_DIR, `${flag.name}.md`))) {
      const filename = `${flag.name}.md`;
      const filepath = path.join(OUTPUT_DIR, filename);
      const content = toMarkdown(flag);

      fs.writeFileSync(filepath, content, 'utf-8');
      console.log(`✓ Created: ${filename}`);
      created++;
    }
  }

  console.log(`\nDone — ${created} file(s) written to: ${OUTPUT_DIR}`);
}

main();
