const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

const americanToBritish = [
  ...Object.entries(americanOnly),
  ...Object.entries(americanToBritishSpelling),
];

const britishToAmerican = [
  ...Object.entries(americanToBritishSpelling).map((elem) => elem.reverse()),
  ...Object.entries(britishOnly),
];

const britishTitle = Object.entries(americanToBritishTitles).map((elem) =>
  elem.reverse()
);
const americanTitle = Object.entries(americanToBritishTitles);

const fromBritishTime = /\d{1,2}\.\d{2}/g;
const fromAmericanTime = /\d{1,2}:\d{2}/g;

class Translator {
  translate(text, locale, settings = { highlight: false }) {
    const highlight = settings.highlight;
    const translationObject =
      locale == "american-to-british" ? americanToBritish : britishToAmerican;
    let newText = text;

    for (let translation of translationObject) {
      let tester = new RegExp(`(?<!-)(\\b${translation[0]}\\b)`, "gi");
      if (tester.test(newText)) {
        let replacement = highlight
          ? '<span class="highlight">' + translation[1] + "</span>"
          : translation[1];
        newText = newText.replace(tester, replacement);
      }
    }

    const titleTranslation =
      locale == "american-to-british" ? americanTitle : britishTitle;

    for (let title of titleTranslation) {
      let tester = new RegExp(title[0] + "(?=\\s)", "gi");
      if (tester.test(newText)) {
        let replacement = highlight
          ? `<span class="highlight">${title[1]}</span>`
          : title[1];
        newText = newText.replace(tester, replacement);
      }
    }

    const timeTester =
      locale == "american-to-british" ? fromAmericanTime : fromBritishTime;

    if (timeTester.test(newText)) {
      let forReplacement = newText.match(timeTester);
      for (let timeStamp of forReplacement) {
        let replacement = timeStamp.includes(":")
          ? timeStamp.replace(":", ".")
          : timeStamp.replace(".", ":");

        highlight
          ? (replacement = '<span class="highlight">' + replacement + "</span>")
          : null;

        newText = newText.replace(timeStamp, replacement);
      }
    }

    return newText;
  }
}

module.exports = Translator;
