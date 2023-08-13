const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server.js");

chai.use(chaiHttp);

let Translator = require("../components/translator.js");
let translator = new Translator();

suite("Functional Tests", () => {
  // Translation with text and locale fields: POST request to /api/translate
  test("Translation with text and locale fields: POST request to /api/translate", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/translate")
      .type("form")
      .send({
        text: "We had a party at my friend's condo.",
        locale: "american-to-british",
      })
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status code");
        assert.equal(
          res.body.translation,
          "We had a party at my friend's <span class='highlight'>flat</span>."
        );
        done();
      });
  });
  // Translation with text and invalid locale field: POST request to /api/translate
  test("Translation with text and invalid locale field: POST request to /api/translate", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/translate")
      .type("form")
      .send({ text: "The parking lot was full", locale: "invalid" })
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status code");
        assert.notProperty(
          res.body,
          "translation",
          "reply body should not have translation property"
        );
        assert.equal(res.body.error, "Invalid value for locale field");
        done();
      });
  });
  // Translation with missing text field: POST request to /api/translate
  test("Translation with missing text field: POST request to /api/translate", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/translate")
      .type("form")
      .send({ locale: "british-to-american" })
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status code");
        assert.notProperty(
          res.body,
          "translation",
          "response should not have a translation"
        );
        assert.equal(
          res.body.error,
          "Required field(s) missing",
          "correct error text"
        );
        done();
      });
  });
  // Translation with missing locale field: POST request to /api/translate
  test("Translation with missing locale field: POST request to /api/translate", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/translate")
      .type("form")
      .send({ text: "To play hooky means to skip class or work." })
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status code.");
        assert.equal(
          res.status.error,
          "Required field(s) missing",
          "correct error text"
        );
        assert.notProperty(
          res.body,
          "translation",
          "translation does not exist in the response"
        );
        done();
      });
  });
  // Translation with empty text: POST request to /api/translate
  test("Translation with empty text: POST request to /api/translate", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/translate")
      .type("form")
      .send({ text: "", locale: "american-to-british" })
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status code");
        assert.equal(
          res.body.error,
          "No text to translate",
          "correct error text"
        );
        assert.notProperty(
          res.body,
          "translation",
          "translation does not exist in the reponse"
        );
        done();
      });
  });
  // Translation with text that needs no translation: POST request to /api/translate
  test("Translation with text that needs no translation: POST request to /api/translate", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/translate")
      .type("form")
      .send({
        text: "This does not need any translation",
        locale: "british-to-american",
      })
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status code");
        assert.equal(
          res.body.translation,
          "Everything looks good to me!",
          "correct translation text"
        );
      });
  });
});
