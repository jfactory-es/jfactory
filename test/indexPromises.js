const { setPromiseAdapter } = require("./promises-aplus-fork/lib/programmaticRunner");
const { JFactoryPromise } = require("../dist");
setPromiseAdapter(JFactoryPromise);

require("./promises-aplus-fork/lib/tests/2.1.2.test");
require("./promises-aplus-fork/lib/tests/2.1.3.test");
require("./promises-aplus-fork/lib/tests/2.2.1.test");
require("./promises-aplus-fork/lib/tests/2.2.2.test");
require("./promises-aplus-fork/lib/tests/2.2.3.test");
require("./promises-aplus-fork/lib/tests/2.2.4.test");
require("./promises-aplus-fork/lib/tests/2.2.5.test");
require("./promises-aplus-fork/lib/tests/2.2.6.test");
require("./promises-aplus-fork/lib/tests/2.2.7.test");
require("./promises-aplus-fork/lib/tests/2.3.1.test");
require("./promises-aplus-fork/lib/tests/2.3.2.test");
require("./promises-aplus-fork/lib/tests/2.3.3.test");
require("./promises-aplus-fork/lib/tests/2.3.4.test");