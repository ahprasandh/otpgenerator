#!/usr/bin/env node

"use strict";

var _ProgressBar = _interopRequireDefault(require("../bundle/ProgressBar"));

var _totpGenerator = _interopRequireDefault(require("totp-generator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

const Bar = new _ProgressBar.default();
if(!process.env.totpsecrets){
  console.log('\x1b[33m%s\x1b[0m', "Set `totpsecrets` in .env file in "+__dirname+"\n\nRefer .env.example for format"); 
  return;
}
const codes = JSON.parse(process.env.totpsecrets);
let sec = new Date().getSeconds();
Bar.init(30);

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

var printTotp = function (name) {
  if (name && name.length > 0) {
    !codes[name].period && (codes[name].period = 30);
    console.log(name + " " + (0, _totpGenerator.default)(codes[name].secret, {
      period: codes[name].period
    }) + "\n");
  }
};

async function app() {
  console.clear();
  console.log("*** TOTP GENERATOR @ahprasandh ***\n");

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
      app();
      updateProgress();
    }

    await sleep(1000);
  }
}

main();