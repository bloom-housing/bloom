import * as fs from 'fs';
import * as path from 'path';
import { featureFlagMap } from '../src/enums/feature-flags/feature-flags-enum';

interface FeatureFlag {
  name: string;
  description: string;
}

const OUTPUT_DIR = path.join(__dirname, '../../docs/feature-flags');
const README_PATH = path.join(__dirname, '../../docs/feature-flags.md');

const START_MARKER = '<!-- TABLE:START -->';
const END_MARKER = '<!-- TABLE:END -->';

const TABLE_HEADER = `| Flag | Description |
|------|-------------|`;

function rowToMarkdown(row: FeatureFlag): string {
  return `| \[${row.name}\](./feature-flags/${row.name}.md) | ${row.description} |`;
}

function buildTable(rows: FeatureFlag[]): string {
  const sorted = [...rows].sort((a, b) => a.name.localeCompare(b.name));
  return [TABLE_HEADER, ...sorted.map(rowToMarkdown)].join('\n');
}

function injectTable(readmeContent: string, table: string): string {
  const startIndex = readmeContent.indexOf(START_MARKER);
  const endIndex = readmeContent.indexOf(END_MARKER);

  // Neither marker exists — create them and append to end of file
  if (startIndex === -1 && endIndex === -1) {
    console.log(
      '⚠ Markers not found — appending markers and table to end of file.',
    );
    return `${readmeContent.trimEnd()}\n\n${START_MARKER}\n\n${table}\n\n${END_MARKER}\n`;
  }

  if (startIndex === -1)
    throw new Error('Found END marker but missing START marker.');
  if (endIndex === -1)
    throw new Error('Found START marker but missing END marker.');
  if (startIndex > endIndex)
    throw new Error('START marker appears after END marker.');

  const before = readmeContent.slice(0, startIndex + START_MARKER.length);
  const after = readmeContent.slice(endIndex);

  return `${before}\n\n${table}\n\n${after}`;
}

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
  console.log(
    `\nDone creating files — ${created} file(s) written to: ${OUTPUT_DIR}`,
  );

  // Update the base readme file's table
  let readmeContent = '';
  if (fs.existsSync(README_PATH)) {
    readmeContent = fs.readFileSync(README_PATH, 'utf-8');
  } else {
    console.log('⚠ README not found — creating a new one.');
    readmeContent = '# README\n';
  }
  const table = buildTable(flags);
  const updatedReadme = injectTable(readmeContent, table);
  fs.writeFileSync(README_PATH, updatedReadme, 'utf-8');

  console.log(`\nDone updating feature-flags.md`);
}

main();
