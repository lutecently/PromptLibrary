import { execFileSync } from 'child_process';
import path from 'path';

/**
 * Re-runs the index/pagination generation scripts so public/data stays in
 * sync after an admin write. Only ever called from admin API routes, which
 * are excluded from the static export build (see scripts/build-static.js).
 */
export function regenerateStaticData(): void {
  const cwd = process.cwd();
  const scripts = ['generate-index.js', 'generate-paginated-data.js'];

  for (const script of scripts) {
    execFileSync('node', [path.join(cwd, 'scripts', script)], { cwd, stdio: 'ignore' });
  }
}
