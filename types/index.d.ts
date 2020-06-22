/**
 * Uttori MarkdownIt Renderer
 * @example
 * <caption>MarkdownItRenderer</caption>
 * const content = MarkdownItRenderer.render("...");
 */
declare class MarkdownItRenderer {
    /**
     * The configuration key for plugin to look for in the provided configuration.
     * @example
     * <caption>MarkdownItRenderer.configKey</caption>
     * const config = { ...MarkdownItRenderer.defaultConfig(), ...context.config[MarkdownItRenderer.configKey] };
     */
    static configKey: any;
    /**
     * The default configuration.
     * @example
     * <caption>MarkdownItRenderer.defaultConfig()</caption>
     * const config = { ...MarkdownItRenderer.defaultConfig(), ...context.config[MarkdownItRenderer.configKey] };
     * @returns The configuration.
     */
    static defaultConfig(): any;
    /**
     * Validates the provided configuration for required entries.
     * @example
     * <caption>MarkdownItRenderer.validateConfig(config, _context)</caption>
     * MarkdownItRenderer.validateConfig({ ... });
     * @param config - A configuration object.
     * @param config.configKey - A configuration object specifically for this plugin.
     * @param _context - Unused
     */
    static validateConfig(config: {
        configKey: any;
    }, _context: any): void;
    /**
     * Register the plugin with a provided set of events on a provided Hook system.
     * @example
     * <caption>MarkdownItRenderer.register(context)</caption>
     * const context = {
     *   hooks: {
     *     on: (event, callback) => { ... },
     *   },
     *   config: {
     *     [MarkdownItRenderer.configKey]: {
     *       ...,
     *       events: {
     *         renderContent: ['render-content', 'render-meta-description'],
     *         renderCollection: ['render-search-results'],
     *         validateConfig: ['validate-config'],
     *       },
     *     },
     *   },
     * };
     * MarkdownItRenderer.register(context);
     * @param context - A Uttori-like context.
     * @param context.hooks - An event system / hook system to use.
     * @param context.hooks.on - An event registration function.
     * @param context.config - A provided configuration to use.
     * @param context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
     */
    static register(context: {
        hooks: {
            on: (...params: any[]) => any;
        };
        config: {
            events: any;
        };
    }): void;
    /**
     * Renders Markdown for a provided string with a provided context.
     * @example
     * <caption>MarkdownItRenderer.renderContent(content, context)</caption>
     * const context = {
     *   config: {
     *     [MarkdownItRenderer.configKey]: {
     *       ...,
     *     },
     *   },
     * };
     * MarkdownItRenderer.renderContent(content, context);
     * @param content - Markdown content to be converted to HTML.
     * @param context - A Uttori-like context.
     * @param context.config - A provided configuration to use.
     * @returns The rendered content.
     */
    static renderContent(content: string, context: {
        config: any;
    }): string;
    /**
     * Renders Markdown for a collection of Uttori documents with a provided context.
     * @example
     * <caption>MarkdownItRenderer.renderCollection(collection, context)</caption>
     * const context = {
     *   config: {
     *     [MarkdownItRenderer.configKey]: {
     *       ...,
     *     },
     *   },
     * };
     * MarkdownItRenderer.renderCollection(collection, context);
     * @param collection - A collection of Uttori documents.
     * @param context - A Uttori-like context.
     * @param context.config - A provided configuration to use.
     * @returns } The rendered documents.
     */
    static renderCollection(collection: object[], context: {
        config: any;
    }): object[];
    /**
     * Renders Markdown for a provided string with a provided MarkdownIt configuration.
     * @example
     * <caption>MarkdownItRenderer.render(content, config)</caption>
     * const html = MarkdownItRenderer.render(content, config);
     * @param content - Markdown content to be converted to HTML.
     * @param config - A provided MarkdownIt configuration to use.
     * @returns The rendered content.
     */
    static render(content: string, config: any): string;
}

