const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
    test('Translation with text and locale fields: POST request to /api/translate', (done) => {
        chai.request(server)
         .post('/api/translate')
         .send({text: 'Like a high tech Rube Goldberg machine.', locale: 'american-to-british'})
         .end((err , res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.text, 'Like a high tech Rube Goldberg machine.');
            assert.equal(res.body.translation, 'Like a high tech <span class="highlight">Heath Robinson device</span>.')
            
        })
        done();
    })

    test('Translation with text and invalid locale field: POST request to /api/translate', (done) => {
        chai.request(server)
         .post('/api/translate')
         .send({text: 'Like a high tech Rube Goldberg machine.', locale: 'american-to-french'})
         .end((err , res) => {
            assert.equal(res.status, 400);
            assert.equal(res.body.error, 'Invalid value for locale field');
            
        })
        done();
    })

    test('Translation with missing text field: POST request to /api/translate', (done) => {
        chai.request(server)
         .post('/api/translate')
         .send({locale: 'american-to-british'})
         .end((err , res) => {
            assert.equal(res.status, 400);
            assert.equal(res.body.error, 'No text to translate');
            
        })
        done();
    })

    test('Translation with missing locale field: POST request to /api/translate', (done) => {
        chai.request(server)
         .post('/api/translate')
         .send({text: 'Like a high tech Rube Goldberg machine.'})
         .end((err , res) => {
            assert.equal(res.status, 400);
            assert.equal(res.body.error, 'Invalid value for locale field');
            
        })
        done();
    })

    test('Translation with empty text: POST request to /api/translate', (done) => {
        chai.request(server)
         .post('/api/translate')
         .send({text: '', locale: 'american-to-british'})
         .end((err , res) => {
            assert.equal(res.status, 400);
            assert.equal(res.body.error, 'No text to translate');
            
        })
        done();
    })

    test('Translation with text that needs no translation: POST request to /api/translate', (done) => {
        chai.request(server)
         .post('/api/translate')
         .send({text: 'Nothing needs to be changed here', locale: 'american-to-british'})
         .end((err , res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.text, 'Nothing needs to be changed here');
            assert.equal(res.body.translation, 'Everything looks good to me!');
            
        })
        done();
    })
});
