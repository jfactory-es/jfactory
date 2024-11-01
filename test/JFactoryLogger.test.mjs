// ---------------------------------------------------------------------------------------------------------------------
// JFactoryLogger
// ---------------------------------------------------------------------------------------------------------------------

import {
    jFactoryModule,
    describe, it, expect
} from "../scripts/test/test-import.mjs";

const {
    JFactoryLogger
} = jFactoryModule;

describe("JFactoryLogger", function() {
    let logger;

    it("enable(), disable(), enabled accessor, default value", function() {
        // init default / false
        logger = new JFactoryLogger({ enabled: false });
        logger.enabled = false;
        expect(logger.enabled).equal(false);

        // init true
        logger = new JFactoryLogger({ enabled: true });
        logger.enabled = true;
        expect(logger.enabled).equal(true);

        logger = new JFactoryLogger();

        // true
        logger.enabled = true;
        expect(logger.enabled).equal(true);

        // false
        logger.enabled = false;
        expect(logger.enabled).equal(false);

        // enable()
        logger.enable();
        expect(logger.enabled).equal(true);

        // disable()
        logger.disable();
        expect(logger.enabled).equal(false);
    });

    it("should provides log, warn, error like native console", function() {
        logger = new JFactoryLogger();
        expect(logger.log).to.be.instanceof(Function);
        expect(logger.warn).to.be.instanceof(Function);
        expect(logger.error).to.be.instanceof(Function);
    });

    it("should be configurable", function() {
        let default_formatter = JFactoryLogger.DEFAULT_CONFIG.formatter;

        logger = new JFactoryLogger({ enabled: true, label: "test", styles_css: { label: "color: blue" } });
        expect(logger.enabled).equal(true);
        expect(logger.log).to.be.instanceof(Function);
        expect(logger.label).equal("test");
        expect(logger.formatter.log).equal(default_formatter.log);
        expect(logger.styles_css.label).equal("color: blue");

        logger = new JFactoryLogger({ enabled: false, label: "test", formatter: default_formatter });
        expect(logger.enabled).equal(false);
        expect(logger.log).to.be.instanceof(Function);
        expect(logger.label).equal("test");
        expect(logger.styles_css.label).equal("color: gray");
        expect(logger.formatter.log).equal(default_formatter.log);
    });

    it("should stylize", function() {
        let r, _log = console.log;
        let message = "a stylized log test";
        let label = "JFactoryLogger.test";
        console.log = (...arg) => arg.join("|");

        logger = new JFactoryLogger(
            { enabled: true, label, formatter: JFactoryLogger.FORMATTER_BROWSER });
        r = logger.log(message);
        expect(r).equal("%c" + label + ">|" + logger.styles_css.label + "|" + message);

        logger = new JFactoryLogger(
            { enabled: true, label, formatter: JFactoryLogger.FORMATTER_CLI });
        r = logger.log(message);
        expect(r).equal(logger.styles_cli.label + "|" + label + ">|" + message);

        console.log = _log;
    });
});