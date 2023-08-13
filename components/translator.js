const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

const americanToBritish = [
  ...Object.entries(americanOnly),
  ...Object.entries(americanToBritishSpelling),
  ...Object.entries(americanToBritishTitles),
];

const britishToAmerican = [
  ...Object.entries(americanToBritishSpelling).map((elem) => elem.reverse()),
  ...Object.entries(americanToBritishTitles).map((elem) => elem.reverse()),
  ...Object.entries(britishOnly),
];

class Translator {
  translate(text, locale, settings = { highlight: false }) {
    const highlight = settings.highlight;
  }
}

module.exports = Translator;
