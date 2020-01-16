const jsBarcode = require('jsbarcode');
const Canvas = require("canvas");
const fs = require('fs');

const barcodeGenerator = async (uid, barcode, batch, genData) => {

  if (barcode.indexOf('@') >= 0) {
    barcode = barcode.split('@')[0];
  }


  let canvas = Canvas.createCanvas();

  // console.log(canvas.width + ' and height is ' + canvas.height);
  await jsBarcode(canvas, barcode, {
    format: 'CODE128C',
    ean128: true,
    width: 4,
    font: "Sans",
    fontSize: 28
    // marginBottom: 40
  });
  // canvas.height = canvas.height + 30;
  let canvas2 = Canvas.createCanvas(556, 172);
  let ctx = canvas2.getContext('2d');
  // ctx.fillStyle = ctx.createGradient('rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.45)');
  ctx.drawImage(canvas, 0, 0)
  ctx.beginPath();
  ctx.moveTo(0, 150);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 150, 575, 30);
  ctx.font = '18px "Sans"';
  ctx.fillStyle = "#000000";
  ctx.fillText(batch, 424, 162);
  ctx.save();
  // console.log(ctx.canvas.width + ' and height is ' + ctx.canvas.height);
  const out = fs.createWriteStream('images/generated/' + genData.outputFolder + '/barcode/' + batch + '.jpg')
  const stream = canvas2.createJPEGStream()
  await stream.pipe(out)
  // out.on('finish', () => console.log('The PNG file was created.'));
}


// barcodeGenerator('1234', '1400030819094128', 'R8-09412');

module.exports = barcodeGenerator;