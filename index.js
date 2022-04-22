const request = require('request');
const { v4: uuidv4 }= require('uuid');
const express = require('express');
var app = express();

const port = process.env.PORT || 3000;

var key_var = process.env.KEY;
var endpoint_var = 'https://api.cognitive.microsofttranslator.com';
var region_var = 'westeurope';

function translateText(lang, text, callback) {
    let options = {
        method: 'POST',
        baseUrl: endpoint_var,
        url: 'translate',
        qs: {
          'api-version': '3.0',
          'to': lang
        },
        headers: {
          'Ocp-Apim-Subscription-Key': key_var,
          'Ocp-Apim-Subscription-Region': region_var,
          'Content-type': 'application/json',
          'X-ClientTraceId': uuidv4().toString()
        },
        body: [{
              'text': text
        }],
        json: true,
    };

    request(options, function (err, res, body) {
            let r = body[0].translations[0].text;

            callback(r);
    });
};

app.set('json spaces', 4); 
app.use(express.static(`${__dirname}/`));
app.listen(port);

app.get('/translate', async function(req, res) {
    let lang = req.query.lang || null;
    let text = req.query.text || null;

    if(lang === null || text === null) {
        res.json({
            "success": false,
            "text": "invalid query"
        });
    } else {
        translateText(lang, text, function(r) {
            res.json({
                "success": true,
                "text": r
            });
        });
    }
});