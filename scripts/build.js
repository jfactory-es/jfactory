const cnfMgr = require('./build/buildConfig');
const { check } = require("./lib/env");
const { rollup } = require('rollup');
const colors = require('ansi-colors');

async function build(input, output) {
  let pending = [];
  let bundle = await rollup(input)
  for (const outputOptions of output) {
    pending.push(
      bundle.write(outputOptions)
        .then(result => {
          for (let output of result.output) {
            console.log(
              output.fileName
              + (output.code ? colors.gray(" " + Math.round(output.code.length/1024) + " Kio") : "")
            )
          }
        })
    );
  }
  await Promise.all(pending);
  await bundle.close();
}

async function run() {
  try {
    console.log("--[Build jFactory]--".padEnd(80, "-"));
    check();
    const startTime = Date.now();
    await Promise.all([
      build(cnfMgr.input({ devel: false }), cnfMgr.outputProd()),
      build(cnfMgr.input({ devel: true  }), cnfMgr.outputDevel()),
      build(cnfMgr.input({ devel: true, input: 'src/index.js' }), cnfMgr.outputIndex()),
    ]);

    await build(cnfMgr.input({ devel: true, input: 'scripts/test/test-app.mjs' }), cnfMgr.outputTestApp())

    const endTime = Date.now();
    const compilationTime = (endTime - startTime) / 1000;
    console.log("-".repeat(80));
    console.log(`Compilation completed in ${compilationTime} seconds`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run()