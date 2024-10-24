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
    const { envCheck } = require("../lib/env");
    console.log("--[Env checking]--".padEnd(80, "-"));
    let envCheckResult = envCheck();

    console.log();

    const cnfMgr = require('./buildConfig');
    console.log("--[Build jFactory]--".padEnd(80, "-"));
    const startTime = Date.now();

    // Build packages
    await Promise.all([
      build(cnfMgr.input({ devel: false }), cnfMgr.outputProd()),
      build(cnfMgr.input({ devel: true  }), cnfMgr.outputDevel()),
      build(cnfMgr.input({ devel: true, input: 'src/index.js' }), cnfMgr.outputIndex()),
    ]);

    // Build apps
    await build(cnfMgr.input({
      devel: true, input: 'test/app/promise/app-promise.mjs'
    }), cnfMgr.outputTestApp())

    const endTime = Date.now();
    const compilationTime = (endTime - startTime) / 1000;
    console.log("-".repeat(80));
    console.log(`Compilation completed in ${compilationTime} seconds`);

    if (envCheckResult.warn.length) {
      envCheckResult.warn.forEach((value, index, array)=>{
        console.warn(colors.red(`Env warning: ${value}`));
      });
    }
    if (envCheckResult.error.length) {
      envCheckResult.error.forEach((value, index, array)=>{
        console.error(colors.red(`Env errors: ${value}`));
      });
      process.exit(1);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run()