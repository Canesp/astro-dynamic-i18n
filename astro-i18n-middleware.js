import { existsSync, mkdirSync, rmSync, cpSync, readdirSync, statSync } from 'fs';
import { join, pathToFileURL } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';

export default function i18nMiddleware({ supportedLocales = ['en', 'es', 'fr'], defaultLocale = 'en', includeDefaultLocale = false } = {}) {
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
        generateLanguageFolders(pagesDir, supportedLocales, defaultLocale, includeDefaultLocale);

        // Convert tempSrc to a file URL
        const tempSrcURL = pathToFileURL(tempSrc);
        config.srcDir = new URL(tempSrcURL.href + '/'); // Force Astro to recognize it
        config.pages = new URL('pages/', config.srcDir); // Explicitly set pages dir
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


function generateLanguageFolders(pagesDir, locales, defaultLocale, includeDefault) {
  const pages = readdirSync(pagesDir);

  for (const locale of locales) {
    // Skip default locale if not including it
    if (!includeDefault && locale === defaultLocale) continue;

    const localePath = path.join(pagesDir, locale);
    if (!existsSync(localePath)) {
      mkdirSync(localePath, { recursive: true });
    }

    // Copy content from root pages/ into pages/<locale>/
    for (const file of pages) {
      const originalPath = path.join(pagesDir, file);
      const targetPath = path.join(localePath, file);

      if (file === locale) continue; // Skip already existing locale folders
      if (statSync(originalPath).isDirectory()) {
        cpSync(originalPath, targetPath, { recursive: true });
      } else {
        cpSync(originalPath, targetPath);
      }
    }
  }
}