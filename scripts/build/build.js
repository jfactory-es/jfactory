const { loadConfigFile } = require('rollup/loadConfigFile');
const { envCheck } = require('../lib/env');
const { formatBytes } = require('../lib/utils');
const path = require('node:path');
const rollup = require('rollup').rollup;
const colors = require('ansi-colors');

async function build(options, logs) {
  const bundle = await rollup(options)
  const pending = [];
  for (const outputOptions of options.output) {
    logs[outputOptions.dir] = [];
    pending.push(
      bundle.write(outputOptions)
        .then(result => {
          result.output.forEach(output => {
            logs[outputOptions.dir].push({
              fileName: output.fileName,
              size: output.code?.length || output.source.length
            });
          });
        })
    );
  }
  await Promise.all(pending);
  await bundle.close();
}

async function run(filename = 'rollup.jfactory.config.cjs') {
  try {
    console.log('--[' + colors.bold('Env') + ']--'.padEnd(80, '-') + '\n');
    let envCheckResult = envCheck();
    console.log();

    console.log('--[' + colors.bold('Build') + ']--'.padEnd(80, '-'));
    const startTime = Date.now();

    loadConfigFile(
      path.resolve(__dirname, filename),
      {}
    )
      .then(async ({ options, warnings }) => {
        if (warnings.count) {
          console.log(`${warnings.count} warnings`);
          warnings.flush();
        }

        let pending = [];
        let logs = {}

        for (const optionsObj of options) {
          pending.push(build(optionsObj, logs));
        }

        await Promise.all(pending);
        const endTime = Date.now();
        const compilationTime = (endTime - startTime) / 1000;

        for (const [key, logEntries] of Object.entries(logs)) {
          console.log(`\n[${colors.bold(key)}]`);
          let totalSize = 0;
          for (let log of logEntries) {
            totalSize += log.size;
            console.log(`   ${log.fileName}${colors.gray(' ' + formatBytes(log.size))}`)
          }
          console.log(colors.bold(`   Total Size: ${formatBytes(totalSize)} in ${key}`))
        }
        console.log();

        console.log(`Compilation completed in ${compilationTime} seconds`);

        if (envCheckResult.warn.length) {
          for (const value of envCheckResult.warn) {
            console.warn(colors.red(`Env warning: ${value}`));
          }
        }
        if (envCheckResult.error.length) {
          for (const value of envCheckResult.error) {
            console.error(colors.red(`Env errors: ${value}`));
          }
          process.exit(1);
        }
        if (warnings.count) {
          console.warn(colors.red(`Compilation warnings: ${warnings.count}`));
        }
      })

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const param = args[0];
  run(param);
} else {
  module.exports = {
    run
  }
}