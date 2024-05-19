'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      const text = req.body.text;
      const locale = req.body.locale;

      if (text == null || locale == null) {
        return res.status(400).send({
          error: 'Required field(s) missing'
        })
      }

      if (text === "") {
        return res.status(400).send({
          error: 'No text to translate'
        })
      }

      if (locale !== 'american-to-british' && locale !== 'british-to-american') {
        return res.status(400).send({
          error: 'Invalid value for locale field'
        })
      }

      if (locale === 'american-to-british') {
        const british = translator.americanToBritish(text);

        if (british === text) {
          return res.send({
            text: text,
            translation: 'Everything looks good to me!'
          })
        }

        res.send({
          text: text,
          translation: british
        });
      } else {
        const american = translator.britishToAmerican(text);

        if (american === text) {
          return res.send({
            text: text,
            translation: 'Everything looks good to me!'
          })
        }

        return res.send({
          text: text,
          translation: american
        })
      }

    });
};
