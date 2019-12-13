/* jFactory Lint, Copyright (c) 2019, Stéphane Plazis,
   https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt */

// https://eslint.org/docs/6.0.0/developer-guide/nodejs-api

const files = ".";
const config = { extensions: [".js", ".mjs"] };

const CLIEngine = require("eslint").CLIEngine;
const inquirer = require("inquirer");

function parse() {
  let cli = new CLIEngine(config); // re-parse config file
  let report = cli.executeOnFiles(files);
  if (report.errorCount + report.warningCount) {
    let formatter = cli.getFormatter("unix");
    console.log(formatter(report.results));
  } else {
    console.log("0 problem")
  }
  menu()
}

function fix() {
  inquirer
    .prompt([
      {
        name: "confirm",
        type: "confirm",
        message: "Confirm fix all",
        default: false
      }
    ])
    .then(answers => {
      if (answers.confirm) {
        let cli = new CLIEngine({
          fix: true,
          ...config
        });
        let report = cli.executeOnFiles(files);
        CLIEngine.outputFixes(report);
        console.log("Fixed");
        parse();
      } else {
        menu()
      }
    });
}

function menu() {
  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        message: "Action",
        choices: ["retry", "fix", "quit"]
      }
    ])
    .then(answers => {
      switch (answers.action) {
        case "quit":
          process.exit(0);
          break;
        case "fix":
          fix();
          break;
        case "retry":
          parse();
          break;
      }
    });
}

parse();