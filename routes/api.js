"use strict";

const Translator = require("../components/translator.js");

class InputError extends Error {
  constructor(message) {
    super(message);
    this.name = "InputError";
  }
}

module.exports = function (app) {
  const translator = new Translator();

  app.route("/api/translate").post((req, res) => {
    const validLocales = ["american-to-british", "british-to-american"];
    try {
      if (req.body.text != undefined && !req.body.text)
        throw new InputError("No text to translate");
      if (!req.body.locale || req.body.text == undefined)
        throw new InputError("Required field(s) missing");
      if (!validLocales.includes(req.body.locale))
        throw new InputError("Invalid value for locale field");

      const translation = translator.translate(req.body.text, req.body.locale, {
        highlight: true,
      });
      if (translation != req.body.text) {
        res.status(200).json({ translation: translation });
      } else {
        res.status(200).json({ translation: "Everything looks good to me!" });
      }
    } catch (e) {
      if (e instanceof InputError) {
        res.status(200).json({ error: e.message });
      } else {
        res.status(500).send("Something went wrong");
      }
    }
  });
};
