/* jFactory, Copyright (c) 2019, Stéphane Plazis, https://github.com/jfactory-es/jfactory/LICENSE.txt */

const fs = require("fs");
const rollup = require("rollup");
const path = require("path");
const del = require("del");
const colors = require("ansi-colors");
const { formatSize } = require("webpack/lib/SizeFormatHelpers");
const env = require("../env");

const CONF_ROLLUP = require("./conf.rollup");

function build() { // https://github.com/rollup/rollup/issues/761
  cleanDist();
  const promises = [];
  for (let config of CONF_ROLLUP) { // running in parallel
    promises.push(bundle(config, config.output));
  }
  return Promise.all(promises)
    .then(() => console.log("-".repeat(80)))
}

function watch() {
  cleanDist();

  let _done, count = 0, ready = false,
    promise = new Promise(done => _done = done);

  for (let config of CONF_ROLLUP) {

    let watchOptions = {
      ...config,
      output: [config.output]
    };

    let watcher = rollup.watch(watchOptions);

    watcher.on("event", event => {
      // event.code can be one of:
      //   START        — the watcher is (re)starting
      //   BUNDLE_START — building an individual bundle
      //   BUNDLE_END   — finished building a bundle
      //   END          — finished building all bundles
      //   ERROR        — encountered an error while bundling
      //   FATAL        — encountered an unrecoverable error
      switch (event.code) {
        case "END":
          if (!ready) {
            count++;
            if ((ready = (count === CONF_ROLLUP.length))) {
              _done();
            }
          }
          break;
        case "ERROR":
        case "FATAL":
          onErr(event.error, false)
      }
    });
  }
  return promise
}

function cleanDist() {
  if (!env.WORKSPACE) {
    throw new Error("invalid env.WORKSPACE")
  }
  let dist = path.normalize(env.WORKSPACE + "/dist");
  if (fs.existsSync(dist)) {
    del.sync(dist + "/*.{m,}js", { dryRun: false });
  }
}

function bundle(inputOptions, outputOptions) {
  return rollup.rollup(inputOptions)
    .then(bundle => bundle.write(outputOptions))
    .then(() => onBundleEnd(outputOptions.file))
    .catch(onErr)
}

function onBundleEnd(file) {
  console.log(file.padEnd(30, " ") + formatSize(fs.statSync(file).size));
}

function onErr({ code, message, loc, frame }, fatal = true) {
  let output = [];
  if (message) {
    code && output.push(colors.red(code + ": " + message));
    loc && output.push("file: " + colors.blueBright(path.relative(process.cwd(), loc.file) + ":" + loc.line));
    frame && output.push("-".repeat(80) + "\n" + colors.bold(frame) + "\n" + "-".repeat(80));
  } else {
    output.push(arguments[0])
  }
  console.error("\n" + output.join("\n"));
  fatal && process.exit()
}

module.exports = { build, watch };