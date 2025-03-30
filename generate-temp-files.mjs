import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const TEMP_DIR = ".temp-astro";
const VITE_CACHE_DIR = "node_modules/.vite";
const VITE_HMR_FILE = join(VITE_CACHE_DIR, "deps_temp.json");

const i18nLocales = ["es", "fr", "de"]; // Add more languages as needed

// Ensure temp directory exists
if (!existsSync(TEMP_DIR)) mkdirSync(TEMP_DIR, { recursive: true });

// Generate example translated pages
i18nLocales.forEach((locale) => {
    const filePath = join(TEMP_DIR, `${locale}/index.html`);
    const content = `<html><body><h1>Welcome to ${locale.toUpperCase()}!</h1></body></html>`;
    
    if (!existsSync(filePath)) {
        mkdirSync(join(TEMP_DIR, locale), { recursive: true });
        writeFileSync(filePath, content);
        console.log(`✅ Generated: ${filePath}`);
    }
});

// ✅ Ensure Vite cache directory exists before writing
if (!existsSync(VITE_CACHE_DIR)) {
    mkdirSync(VITE_CACHE_DIR, { recursive: true });
}

// 🚀 Trigger Vite HMR to reload changes
writeFileSync(VITE_HMR_FILE, JSON.stringify({ changed: new Date().toISOString() }), "utf-8");
console.log("🔄 Triggered Vite HMR.");
