/* jFactory, Copyright (c) 2019, Stéphane Plazis, https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt */

// ---------------------------------------------------------------------------------------------------------------------
// jFactory Env
// ---------------------------------------------------------------------------------------------------------------------

// Compile-time immutable Env; used by Tree Shaking to remove unused code
export const JFACTORY_DEV = typeof COMPILER_DEV === "undefined" ? false : COMPILER_DEV; // Developer Mode
export const JFACTORY_DEBUG = typeof COMPILER_DEBUG === "undefined" ? false : COMPILER_DEBUG; // Debug the library
export const JFACTORY_CLI = typeof COMPILER_CLI === "undefined" ?
    typeof process !== "undefined" && process.versions && process.versions.node : COMPILER_CLI;