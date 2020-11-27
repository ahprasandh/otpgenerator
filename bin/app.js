#!/usr/bin/env node

"use strict";

var _ProgressBar = _interopRequireDefault(require("../bundle/ProgressBar"));

var _totpGenerator = _interopRequireDefault(require("totp-generator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function printerror(msg){
  console.log(chalk.red(msg));
}
const fs = require('fs');
const chalk = require('chalk');
let codes;
const Bar = new _ProgressBar.default();
let sec = new Date().getSeconds();
let runtime=0;
Bar.init(30);

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function printTotp(name) {
  if (name && name.length > 0) {
    !codes[name].period && (codes[name].period = 30);
    console.log(chalk.cyan(name) + " " + (0, _totpGenerator.default)(codes[name].secret, {
      period: codes[name].period
    }) + "\n");
  }
};

async function app() {
  console.clear();
  console.log(chalk.black.bgCyan("*** TOTP GENERATOR @ahprasandh ***\n"));

  for (var s in codes) {
    printTotp(s);
  }

  console.log("30s Timer:");
}

function updateProgress() {
  Bar.update(sec);
}

async function main() {
  app();
  while (1) {
    sec++;
    updateProgress();
    if (sec > 30) {
      sec -= 30;
      runtime+=30;
      app();
      updateProgress();
    }
    if(runtime > 60){
      console.log();
      return;
    }
    await sleep(1000);
  }
}

fs.readFile(__dirname+'/../config.json', 'utf8', function (err,data) {
  if (err) {
    console.log(err)
    printerror("Config.json not proper");
    return;
  }
  try{
    codes=JSON.parse(data)
  }catch(e){
    printerror("Config.json not proper");
    return;
  }
  main();
});