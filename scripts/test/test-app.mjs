// Test the tree shaking when importing a class
// Check the output in test/app/**

import jquery from "jquery"
import { JFactoryPromise } from "../../dist/es/index.mjs"

console.log(jquery)
console.log(JFactoryPromise)