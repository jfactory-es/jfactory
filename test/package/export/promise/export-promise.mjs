import { JFactoryPromise } from 'jfactory';

// This file is used to test how tree-shaking behaves during class imports
// Input  : /test/package/export/
// Output : /dist/test/export-compiled

console.log(JFactoryPromise);