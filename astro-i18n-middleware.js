import { existsSync, mkdirSync, rmSync, cpSync, readdirSync } from 'fs';
import { join, pathToFileURL } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

export default function i18nMiddleware({ supportedLocales = ['en', 'es', 'fr'], defaultLocale = 'en' } = {}) {
  return {
    name: 'astro-i18n-middleware',
    hooks: {
      'astro:config:setup': ({ config }) => {
        const originalSrc = fileURLToPath(config.srcDir);
        const tempSrc = join(process.cwd(), 'src_temp');

        // Cleanup old temp source if it exists
        if (existsSync(tempSrc)) {
          rmSync(tempSrc, { recursive: true, force: true });
        }

        // Copy original src to tempSrc
        cpSync(originalSrc, tempSrc, { recursive: true });

        // Ensure pages directory exists in tempSrc
        const pagesDir = join(tempSrc, 'pages');
        if (!existsSync(pagesDir)) {
          mkdirSync(pagesDir, { recursive: true });
        }

        // Generate language subfolders in tempSrc
        for (const locale of supportedLocales) {
          const localeDir = join(tempSrc, locale);
          if (!existsSync(localeDir)) {
            mkdirSync(localeDir, { recursive: true });
          }
        }

        // Convert tempSrc to a file URL
        const tempSrcURL = pathToFileURL(tempSrc);
        config.srcDir = new URL(tempSrcURL.href + '/'); // Force Astro to recognize it
        config.pages = new URL('pages/', config.srcDir); // Explicitly set pages dir

        // Debugging Logs
        console.log('Original src:', originalSrc);
        console.log('Temporary src:', tempSrc);
        console.log('Pages dir exists:', existsSync(pagesDir));
        console.log('Pages dir contents:', readdirSync(pagesDir));
        console.log('Final config.srcDir:', config.srcDir);
        console.log('Final config.pages:', config.pages);
      },
      'astro:build:done': async () => {
        // Cleanup temp source folder after build
        const tempSrc = join(process.cwd(), 'src_temp');
        if (existsSync(tempSrc)) {
          rmSync(tempSrc, { recursive: true, force: true });
        }
      }
    }
  };
}
