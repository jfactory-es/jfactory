const packageJson = require('../../package.json');
const colors = require('ansi-colors');
const path = require('path');
const fs = require('fs');

function envCheck() {
  const semverSatisfies = require('semver/functions/satisfies');
  const result = {
    error: [],
    warn: []
  };
  const pad = 18;

  // process.chdir(path.join(__dirname, '../../'));
  const packagePath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packagePath)) {
    console.log('Must be run in this project folder');
    process.exit(1)
  }

  // Check Package VERSION
  let checkVer = !(
    packageJson.version.includes('beta') || packageJson.version.includes('alpha')
  );
  console.log('Package Version'.padEnd(pad, ' ') + warnIfStr(!checkVer, 'v' + packageJson.version));
  if (!checkVer) {
    result.warn.push(`This build is not a stable release: ${packageJson.version}`)
  }

  // Check package COPYRIGHT
  const year = new Date().getFullYear().toString();
  const copyrightYear = packageJson['x-copyrightYear'].split('-');
  const checkCopyrightYear = copyrightYear[1] === year;
  console.log('Package Copyright'.padEnd(pad, ' ')   + warnIfStr(!checkCopyrightYear, packageJson['x-copyrightYear']));
  if (!checkCopyrightYear) {
    result.error.push(`package.json property x-copyrightYear must be updated: ${copyrightYear[1]}`)
    // packageJson['x-copyrightYear'] = copyrightYear[0]+'-'+year;
  }

  // Check NODE
  let checkNode = semverSatisfies(process.version, packageJson.devEngines.runtime.version);
  console.log('Node'.padEnd(pad, ' ') + warnIf(!checkNode, process.version, `"${process.version}"`));
  if (!checkNode) {
    result.warn.push(`This build requires node ${packageJson.devEngines.runtime.version}`)
  }

  return result;
}

function warnIf(test, val, msg, type) {
  if (msg === undefined) msg = val.toString();
  if (type === 'string') msg = '"' + msg + '"';
  if (type && type !== typeof val) {
    msg = colors.red('(' + typeof val + ') ') + msg;
  }
  if (test) {
    return colors.red(msg)
  } else {
    return colors.green(msg)
  }
}

function warnIfStr(test, val, msg) {
  return warnIf(test, val, msg, 'string')
}

module.exports = {
  envCheck
}