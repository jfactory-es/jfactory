/* jFactory Env, Copyright (c) 2019, Stéphane Plazis,
   https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt */

const fs = require("fs");
const colors = require("ansi-colors");
const semverSatisfies = require("semver/functions/satisfies");
const packageJson = require("../package.json");

const WORKSPACE = __dirname + "/../";

function initEnv(verbose = true) {
  process.chdir(WORKSPACE);
  let dotEnvFile = ".env";

  if (fs.existsSync(dotEnvFile)) {
    const envConfig = require("dotenv").parse(fs.readFileSync(dotEnvFile));
    for (let key in envConfig) {
      if (envConfig.hasOwnProperty(key)) {
        process.env[key] = envConfig[key]
      }
    }
  }

  let ENV = process.env.NODE_ENV;
  if (!ENV) {
    ENV = process.env.NODE_ENV = "production"
  }

  let BUNDLE = getEnv("BUNDLE");
  if (BUNDLE === undefined) {
    BUNDLE = process.env.BUNDLE = true
  }

  let DEBUG = getEnv("DEBUG");
  if (DEBUG === undefined) {
    DEBUG = process.env.DEBUG = false
  }

  const pkg = require("../package.json");
  if (verbose) {
    let pad = 8;

    let checkNode = semverSatisfies(process.version, packageJson.engines.node);
    let checkVer = !pkg.version.includes("-") || pkg.version.includes("-beta.");

    console.log("Ver".padEnd(pad, " ")    + warnIfStr(!checkVer, "v" + pkg.version));
    console.log("Node".padEnd(pad, " ")   + warnIf(!checkNode, process.version, `"${process.version}"`));
    console.log("Env".padEnd(pad, " ")    + warnIfStr(ENV !== "production", ENV));
    console.log("Bundle".padEnd(pad, " ") + warnIfBool(!BUNDLE, BUNDLE));
    console.log("Debug".padEnd(pad, " ")  + warnIfBool(DEBUG, DEBUG));
    console.log("-".repeat(80));

    if (process.env.NODE_ENV === "production" && warnCount) {
      console.log("\n" + colors.red("Production env check failure"));
      process.exit(1);
    }
  }
}

function getEnv(key) {
  let val;
  if (process.env.hasOwnProperty(key)) {
    val = process.env[key];
    switch (val.trim()) {
      case "null":
        val = null;
        break;
      case "false":
        val = false;
        break;
      case "true":
        val = true;
        break;
      default:
        !isNaN(val) && (val = parseFloat(val))
    }
  }
  return val
}

let warnCount = 0;
function warnIf(test, val, msg, type) {
  if (msg === undefined) msg = val.toString();
  if (type === "string") msg = "\"" + msg + "\"";
  if (type && type !== typeof val) {
    msg = colors.red("(" + typeof val + ") ") + msg;
  }
  if (test) {
    warnCount++;
    return colors.red(msg)
  } else {
    return colors.green(msg)
  }
}

function warnIfStr(test, val, msg) {
  return warnIf(test, val, msg, "string")
}

function warnIfBool(test, val, msg) {
  return warnIf(test, val, msg, "boolean")
}

if (require.main === module) {
  initEnv();
} else {
  module.exports = { WORKSPACE, initEnv, getEnv };
}