export default function i18nVitePlugin() {
    const supportedLocales = ["es", "fr", "de"];

    return {
        name: "astro-i18n-routes",
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                const urlParts = req.url.split("/");
                const lang = urlParts[1];

                if (supportedLocales.includes(lang)) {
                    process.env.CURRENT_LOCALE = lang; // Store the locale globally
                    req.url = req.url.replace(`/${lang}`, ""); // Rewrite URL
                } else {
                    process.env.CURRENT_LOCALE = "en"; // Default to English
                }

                next();
            });
        }
    };
}
