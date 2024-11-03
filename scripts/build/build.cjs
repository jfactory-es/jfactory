const { loadConfigFile } = require('rollup/loadConfigFile');
const { envCheck } = require('../lib/env.cjs');
const { formatBytes } = require('../lib/utils.cjs');
const path = require('node:path');
const rollup = require('rollup').rollup;
const colors = require('ansi-colors');

async function build(options, logs) {
  const bundle = await rollup(options);
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

async function run(filenames) {
  if (!filenames) {
    throw new Error('invalid filenames')
  }
  if (typeof filenames === 'string') {
    filenames = [filenames]
  }

  try {
    const COL = process.stdout.isTTY ? process.stdout.columns : 80;
    const messages = []
    const startTime = Date.now();

    console.log(`--[${colors.bold('Env')}]--`.padEnd(COL, '-') + '\n');
    let envCheckResult = envCheck();
    console.log();

    for (let filename of filenames) {
      let logs = {};
      let pending = [];

      console.log(`--[${colors.bold('Build ' + filename)}]--`.padEnd(COL, '-'));
      const { options, warnings } = await loadConfigFile(
        path.resolve(__dirname, filename), {}
      );
      for (const optionsObj of options) {
        optionsObj.onLog = function(level, log, handler) {
          messages[level] || (messages[level] = []);
          messages[level].push(log);
          handler(level, log);
        };
        pending.push(build(optionsObj, logs));
      }
      await Promise.all(pending);

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
    }

    console.log(`Compilation completed in ${(Date.now() - startTime) / 1000} seconds`);
    if (envCheckResult.warn.length) {
      for (const value of envCheckResult.warn) {
        console.log(colors.red(`Env warn: ${value}`));
      }
    }
    if (envCheckResult.error.length) {
      for (const value of envCheckResult.error) {
        console.error(colors.red(`Env error: ${value}`));
      }
      process.exit(1);
    }

    Object.entries(messages).forEach(([key, value]) => {
      console.log(colors.red(`Rollup ${key}: ${value.length} ${key}${value.length > 1 ? 's' : ''}`));
    });

    if (messages.warn) {
      process.exit(1);
    }

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

if (require.main === module) {
  (async function() {
    const args = process.argv.slice(2);
    const param = args[0];
    if (!param) {
      await run([
        'rollup-jfactory.config.cjs',
        'rollup-loader.config.cjs'
      ]);
    } else {
      await run(param);
    }
  })();
} else {
  module.exports = {
    run
  }
}