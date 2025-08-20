// ==UserScript==
// @name         Chameleon AI-Forge: Genesis Command Center
// @namespace    https://chameleon-ai-forge.com/genesis
// @version      2026.11.0
// @description  The ultimate AI web co-pilot. Features a futuristic glassmorphism UI, a true intent-driven AI driver with conversational memory, proactive workflow automation, a session recorder, API interception, vulnerability scanning, and generative page remixing tools.
// @author       Chameleon AI-Forge Team
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_openInTab
// @connect      127.0.0.1
// @connect      localhost
// @connect      chameleon-ai-forge.com
// @connect      api.chameleon-ai.pro
// @connect      * // Required for GM_xmlhttpRequest to arbitrary domains (e.g., Hacker News, Amazon, Best Buy)
// @run-at       document-start
// @updateURL    https://chameleon-ai-forge.com/genesis/userscript.js
// @downloadURL  https://chameleon-ai-forge.com/genesis/userscript.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const CONFIG = {
        VERSION: '2026.11.0',
        ID_PREFIX: 'chameleon-genesis__',
        API_BASE: 'http://127.0.0.1:5000/api',
        DEBUG: true,
    };

    // --- ICONS, THEMES, UTILITIES, COMMANDS ... ---
    // NOTE: All previous code (Icons, Themes, DOMUtils, snarkdown, Command classes, etc.)
    // is assumed to be here. It is omitted for brevity in this view.

    /**
     * @class ChameleonAIForge
     */
    class ChameleonAIForge {
        constructor() {
            this.state = { /* ... */ };
            this.ui = new UIManager(this);
            this.settings = new SettingsManager(this);
            this.commandRegistry = new CommandRegistry(this);
            this.missionControl = new MissionControl(this);
            this.styler = new NeuralStyleEngine(this);
            this.analyzer = new PageAnalyzer(this);
            this.toolkit = new ToolKit(this);
            this.genesis = new GenesisDriver(this);
            this.foresight = new ForesightEngine(this);
            this.apiMonitor = new APIMonitor(this);
            this.vulnerabilityScanner = new VulnerabilityScanner(this);
            this.agent = new AgentCore(this);
            this.palette = new CommandPalette(this);
            this.contextMenu = new ContextMenu(this);
            this.highlighter = new ElementHighlighter(this);
            this.exposePluginAPI();
        }

        async init() {
            if (this.isFrame() || this.state.isInitialized) {
                this.log('Detected as iframe or already initialized. Skipping.');
                return;
            }
            this.log(`Initializing Genesis Command Center v${CONFIG.VERSION}...`);

            addGlobalStyles();
            this.styler.init();
            this.apiMonitor.init();
            this.registerCommands();

            await this.waitForDOMReady();

            this.ui.inject();

            // NEW: Render modules with error boundaries
            this.renderModulesWithRobustness();

            this.foresight.init();
            this.agent.init();
            this.palette.init();
            this.contextMenu.init();
            this.highlighter.init();
            this.setupGlobalListeners();

            if (GM_getValue('firstRun', true)) {
                this.ui.showWelcomeModal();
                GM_setValue('firstRun', false);
            }
            this.state.isInitialized = true;
            this.log('Genesis Command Center Initialized.');
            GM_registerMenuCommand('Toggle Chameleon Command Center', () => this.ui.togglePanel());
            GM_registerMenuCommand('Open Command Palette (Ctrl+Shift+P)', () => this.palette.toggle());
        }

        /**
         * Renders all UI modules with individual error handling to prevent a single
         * module from crashing the entire application.
         */
        renderModulesWithRobustness() {
            const modulesToRender = {
                'genesis': this.genesis,
                'missions': this.missionControl,
                'analyze': this.analyzer,
                'network': this.apiMonitor,
                'security': this.vulnerabilityScanner,
                'tools': this.toolkit,
                'style': this.styler,
                'settings': this.settings,
            };

            for (const [tabId, moduleInstance] of Object.entries(modulesToRender)) {
                if (moduleInstance && typeof moduleInstance.render === 'function') {
                    try {
                        moduleInstance.render();
                    } catch (err) {
                        this.error(`Failed to render module for tab '${tabId}':`, err);
                        const tabContent = document.getElementById(`${CONFIG.ID_PREFIX}tab-${tabId}`);
                        if (tabContent) {
                            tabContent.innerHTML = `<div class="chameleon-error-state"><h3>Error</h3><p>Could not load the '${tabId}' module.</p><pre>${err.message}</pre></div>`;
                        }
                    }
                }
            }
        }

        // ... (rest of ChameleonAIForge methods are the same)
    }

    /**
     * @class ForesightEngine
     * @description Proactively observes the DOM for potential issues or enhancement opportunities.
     *              Now with debouncing for performance.
     */
    class ForesightEngine {
        constructor(c) {
            this.controller = c;
            this.observer = null;
            this.userActionHistory = [];
            this.mutationQueue = [];
            this.debounceTimeout = null;
        }

        init() {
            if (GM_getValue('autoEnhance', true)) {
                this.startObserver();
            }
            this.addGlobalActionListeners();
        }

        startObserver() {
            if (this.observer) return;
            this.controller.log('Foresight Engine observer started.');
            this.observer = new MutationObserver(this.queueMutations);
            this.observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['alt', 'aria-label', 'placeholder', 'title', 'href', 'target', 'disabled']
            });
            this.controller.ui.updateStatus('Foresight Engine Active.', 'info');
        }

        stopObserver() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
                clearTimeout(this.debounceTimeout);
                this.controller.log('Foresight Engine observer stopped.');
            }
        }

        /**
         * Queues mutations and debounces the processing call.
         * @param {MutationRecord[]} mutationsList - The list of mutations from the observer.
         */
        queueMutations = (mutationsList) => {
            this.mutationQueue.push(...mutationsList);
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => this.processMutationQueue(), 750); // Process after 750ms of inactivity
        }

        /**
         * Processes the queued mutations in a batch.
         */
        processMutationQueue() {
            if (this.mutationQueue.length === 0) return;

            const mutationsToProcess = [...this.mutationQueue];
            this.mutationQueue = [];

            this.controller.log(`Processing ${mutationsToProcess.length} queued mutations.`);

            // Use a Set to avoid processing the same node multiple times
            const nodesToProcess = new Set();
            mutationsToProcess.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => nodesToProcess.add(node));
                } else if (mutation.type === 'attributes') {
                    nodesToProcess.add(mutation.target);
                }
            });

            nodesToProcess.forEach(node => {
                if (node.nodeType !== Node.ELEMENT_NODE) return;

                // Accessibility: Image without alt
                if (node.tagName === 'IMG' && (!node.hasAttribute('alt') || node.getAttribute('alt').trim() === '')) {
                    this.controller.agent.processInsight('accessibility_issue', { type: 'image_no_alt', element: node });
                }
                // Accessibility: Button without accessible name
                if (node.tagName === 'BUTTON' && !node.textContent.trim() && !node.querySelector('svg') && !node.hasAttribute('aria-label') && !node.hasAttribute('title')) {
                    this.controller.agent.processInsight('accessibility_issue', { type: 'button_no_label', element: node });
                }
                // UX: External links without target="_blank"
                if (node.tagName === 'A' && node.href && !node.href.startsWith(window.location.origin) && !node.target) {
                    this.controller.agent.processInsight('ux_issue', { type: 'external_link_no_target_blank', element: node });
                }
            });
        }

        // ... (rest of ForesightEngine is the same)
    }

    // ... (All other classes are the same)

    function addGlobalStyles() {
        GM_addStyle(`
            /* ... (all previous styles) ... */

            /* --- Error State --- */
            .chameleon-error-state {
                padding: 20px;
                text-align: center;
                color: var(--danger);
            }
            .chameleon-error-state h3 {
                margin-top: 0;
            }
            .chameleon-error-state pre {
                background: rgba(248, 81, 73, 0.1);
                padding: 10px;
                border-radius: 6px;
                border: 1px solid var(--danger);
                text-align: left;
                white-space: pre-wrap;
                word-break: break-all;
                font-size: 12px;
            }
        `);
    }

    const chameleonAI = new ChameleonAIForge();
    chameleonAI.init().catch(err => console.error('[CGF] CRITICAL ERROR:', err));

})();
// NOTE: For brevity, only the newly added or significantly changed classes/methods are shown in full.
// Unchanged code from the previous version is assumed to be included.
