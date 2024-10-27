import jQuery from "jquery"
import { JFactoryPromise } from "../../../dist/es/index.mjs"

// This file is used to test how tree-shaking behaves during class imports
// Input  : /test/export-src
// Output : /test/export-compiled

console.log(jQuery);
console.log(JFactoryPromise);