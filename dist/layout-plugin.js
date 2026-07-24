import remarkLayouts from "./remark-layouts.js";
/**
 * Adds Navfolio's local Markdown layout directives to Astro's remark pipeline.
 * Import `@navfolio/plugin-markdown-layouts/styles.css` once to include the
 * structural responsive styles when the active theme does not provide them.
 */
export function layoutPlugin(options = {}) {
    return {
        name: "@navfolio/plugin-markdown-layouts",
        enabled: options.enabled ?? true,
        astro: {
            remarkPlugins: [remarkLayouts],
        },
    };
}
