import { defineConfig } from "astro/config";
import i18nVitePlugin from "./vite-plugin-i18n.js"; // Import our new plugin

export default defineConfig({
    vite: {
        plugins: [i18nVitePlugin()],
        define: {
            "import.meta.env.CURRENT_LOCALE": JSON.stringify(process.env.CURRENT_LOCALE || "en")
        }
    }
});
