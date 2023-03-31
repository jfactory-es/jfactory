const colors = require('ansi-colors');

process.env.NODE_ENV || (process.env.NODE_ENV = "production");

function check(/*config*/) {
  const semverSatisfies = require('semver/functions/satisfies');
  const packageJson = require("../../package.json");

  let pad = 8;
  let checkNode = semverSatisfies(process.version, packageJson.devEngines.node);
  let checkVer = !(
    packageJson.version.includes("beta") || packageJson.version.includes("alpha")
  );

  console.log("Ver".padEnd(pad, " ")    + warnIfStr(!checkVer, "v" + packageJson.version));
  console.log("Node".padEnd(pad, " ")   + warnIf(!checkNode, process.version, `"${process.version}"`));
  console.log();

  // if (process.env.NODE_ENV === "production" && warnCount) {
  //   console.log("\n" + colors.red("Production environment check failure"));
  //   process.exit(1);
  // }
}

// function env(key, setDefault) {
//   let val;
//   if (process.env.hasOwnProperty(key)) {
//     val = process.env[key];
//     switch (val.trim()) {
//       case "null":
//         val = null;
//         break;
//       case "false":
//         val = false;
//         break;
//       case "true":
//         val = true;
//         break;
//       default:
//         !isNaN(val) && (val = parseFloat(val))
//     }
//   }
//   if (setDefault !== undefined && val === undefined) {
//     val = process.env[key] = setDefault
//   }
//   return val
// }

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

module.exports = {
  check
}