const express = require('express');
const bodyParser = require('body-parser');
const parseInteger = require('./helpers/parseInt');
const ejs = require('ejs');
const app = express();
const port = 3000;

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.use(bodyParser.urlencoded({ extended: true }));

let simpleQRGenerator = require('./helpers/qr_generators/simple');

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/qr', (req, res) => {
  let qr = simpleQRGenerator();
  res.type('png');
  qr.pipe(res);
});

app.get('/generateSticker', (req, res) => {
  res.render('generateSticker');
})
app.post('/generateSticker', function (req, res) {
  // const {
  //   baseFile,
  //   qrx, qry,
  //   qrSize,
  //   text1x, text1y,
  //   batch, batchx, batchy,
  //   xlName,
  //   outputFolder
  // } = req.body;
  const pool = require('./helpers/qr_generators/singleImageWithQr/pool_singleImageWithQr');
  let formData = parseInteger(req.body,
    ['qrSize', 'qrx', 'qry', 'text1x', 'text1y', 'startRow', 'endRow', 'batchx', 'batchy']
  )
  // console.log(formData);
  pool(formData);
  res.redirect('/success');
  // res.send("Image Generation Started. See logs for more details");
});



app.get('/success', (req, res) => {
  res.send("Image Generation Started. See logs for more details. Generated Images will appear under images/generated folder.");
})


app.listen(port, () => console.log(`App is listening at http://localhost:${port}`));