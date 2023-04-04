/*!
 * jFactory-devel v1.8.0-alpha 2023-04-04
 * https://github.com/jfactory-es/jfactory
 * (c) 2019-2023 Stephane Plazis
 * License: https://raw.githubusercontent.com/jfactory-es/jfactory/master/LICENSE.txt
 */
import { JFACTORY_REPL, JFACTORY_CLI, jFactoryCfg } from './jFactory-env.mjs';
import { JFactoryExpect } from './JFactoryExpect.mjs';
import { helper_isNative, helper_defaultsDeep, NOOP } from './jFactory-helpers.mjs';

// ---------------------------------------------------------------------------------------------------------------------
// JFactoryLogger 1.7
// ---------------------------------------------------------------------------------------------------------------------
// A contextual logger that prepends a label and allows runtime filtering while preserving the caller line number
// ---------------------------------------------------------------------------------------------------------------------
// logger.createSubLogger(label) create a sub-logger of logger; "logger" can be a sub-logger.
// logger.disable() disable console for itself and sub-loggers
// logger.disallow('log') disallow logger.log() only
// logger.disallow('log', subLogger.label) disallow sub-logger.log() only. This is callable from any logger/sub-logger
// ---------------------------------------------------------------------------------------------------------------------
// Status : Beta
// ---------------------------------------------------------------------------------------------------------------------

const SYMBOL_ENABLED = Symbol();

class JFactoryLogger {

    constructor(options) {
        if (options) {
            JFactoryExpect("JFactoryLogger(options)", options)
                .properties(Object.getOwnPropertyNames(JFactoryLogger.DEFAULT_CONFIG));
        }
        helper_defaultsDeep(this, options, config);
        this.installAccessor("log");
        this.installAccessor("warn");
        this.installAccessor("error");
    }

    get enabled() {
        return this[SYMBOL_ENABLED] && (this.parentLogger ? this.parentLogger.enabled : true)
    }

    set enabled(v) {
        v ? this.enable() : this.disable();
    }

    enable() {
        if (this[SYMBOL_ENABLED] !== true) {
            this[SYMBOL_ENABLED] = true;
        }
    }

    disable() {
        if (this[SYMBOL_ENABLED] !== false) {
            this[SYMBOL_ENABLED] = false;
        }
    }

    disallow(nativeName, label = this.label) {
        if (!this.filters[label]) {this.filters[label] = {};}
        this.filters[label][nativeName] = true;
    }

    allow(nativeName, label = this.label) {
        if (this.filters[label]) {
            delete this.filters[label][nativeName];
        }
    }

    installAccessor(nativeName, targetName = nativeName, target = this) {
        {
            JFactoryExpect("JFactoryLogger(nativeName)", nativeName).equalIn(["log", "warn", "error"]);
        }
        Object.defineProperties(target, {
            [targetName]: {
                get: this.accessor.bind(this, nativeName/*, target*/),
                configurable: true
            }
        });
    }

    accessor(nativeName/*, target*/) {
        if (!this[SYMBOL_ENABLED]) {
            return NOOP;
        }
        return this.condition(nativeName) && this.formatter[nativeName](this) || NOOP
    }

    createSubLogger(label) {
        /** @type JFactoryLogger */
        let sub = new JFactoryLogger({
            enabled: this.enabled,
            label: this.label + "." + label,
            styles_css: this.styles_css,
            styles_cli: this.styles_cli,
            console: this.console,
            formatter: this.formatter
        });
        sub.parentLogger = this;
        sub.condition.addCondition(() => this.enabled);
        sub.filters = this.filters; // shared to allow/disallow from anywhere
        return sub
    }
}

// #limitation# To preserve the line number, we can only use native functions, like bind
// #limitation# Because we use bind(), only the style of the first element can be defined efficiently

JFactoryLogger.FORMATTER_NATIVE = {
    log: logger => logger.console.log.bind(logger.console, logger.label + ">"),
    warn: logger => logger.console.warn.bind(logger.console, logger.label + ">"),
    error: logger => logger.console.error.bind(logger.console, logger.label + ">")
};

JFactoryLogger.FORMATTER_CLI = {
    log: logger => logger.console.log.bind(logger.console, logger.styles_cli.label, logger.label + ">"),
    warn: logger => logger.console.warn.bind(logger.console, logger.styles_cli.label, logger.label + ">"),
    error: logger => logger.console.error.bind(logger.console, logger.styles_cli.label, logger.label + ">")
};

JFactoryLogger.FORMATTER_BROWSER = {
    log: logger => logger.console.log.bind(logger.console, "%c" + logger.label + ">", logger.styles_css.label),
    warn: logger => logger.console.warn.bind(logger.console, "%c" + logger.label + ">", logger.styles_css.label),
    error: logger => logger.console.error.bind(logger.console, "%c" + logger.label + ">", logger.styles_css.label)
};

/** @return {boolean} */
JFactoryLogger.DEFAULT_CONDITION = function(nativeName) {
    {
        JFactoryExpect("JFactoryLogger.condition(nativeName)", nativeName).equalIn(["log", "warn", "error"]);
        JFactoryExpect("JFactoryLogger.enabled", this.enabled).equal(true);
    }
    return !(this.filters[this.label] && this.filters[this.label][nativeName])
};

JFactoryLogger.DEFAULT_CONFIG = /** @lends JFactoryLogger# */ {
    label: "",
    enabled: true,
    parentLogger: null,
    condition: JFactoryLogger.DEFAULT_CONDITION,
    formatter:
        !helper_isNative(console.log) || JFACTORY_REPL ? JFactoryLogger.FORMATTER_NATIVE :
            JFACTORY_CLI ? JFactoryLogger.FORMATTER_CLI :
                JFactoryLogger.FORMATTER_BROWSER
    ,
    console,
    filters: {
    },
    styles_cli: {
        label: "\x1b[1;30m%s\x1b[0m"
    },
    styles_css: {
        label: "color: gray"
    }
};

const config = jFactoryCfg("JFACTORY_CFG_JFactoryLogger", JFactoryLogger.DEFAULT_CONFIG);

export { JFactoryLogger };
//# sourceMappingURL=JFactoryLogger.mjs.map
