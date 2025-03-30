// @ts-check
// @ts-ignore
import { defineConfig } from 'astro/config';
import fs from "fs";
import path from "path";

const TEMP_DIR = ".temp-astro";

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [
            {
                name: "i18n-middleware",
                // @ts-ignore
                configureServer(server) {
                  // @ts-ignore
                  server.middlewares.use((req, res, next) => {
                    let reqPath = req.url.split("?")[0]; // Remove query params
                    if (reqPath.endsWith("/")) reqPath += "index"; // Handle folder-based paths
        
                    const tempFile = path.join(TEMP_DIR, reqPath + ".html");
        
                    if (fs.existsSync(tempFile)) {
                        res.setHeader("Content-Type", "text/html");
                        res.end(fs.readFileSync(tempFile, "utf-8"));
                    } else {
                        next(); // Let Astro handle non-i18n routes
                    }
                  });
                },
            },
        ],

        server: {
            watch: {
              ignored: ["!./.temp-astro/**"], // Tell Vite to watch .temp-astro
            },
        },
    }
});
