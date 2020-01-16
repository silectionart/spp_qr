const simpleQRGenerator = require('./simple');
const blitSingleSided = require('../image_processing/blitSingleSided');
const blitSmartCard = require('../image_processing/blitSmartCard');
const barcodeGenerator = require('./barcodeGenerator');

// console.log(rowNum)
const genImage = async (xdata) => {
  let data = xdata.data;
  if (data['VPA'] && data['BQR'] && data['Barcode']) {
    //Defining vars here
    let vpa = data['VPA'];
    // let row = data['__rowNum__'].toString();
    let row = xdata.row.toString();
    if (row.length < 6) {
      let repeatTimes = 6 - row.length;
      row = '0'.repeat(repeatTimes) + row;
    }
    let batch = 'sp01-' + row;
    // let srNo = data['SR'];
    let qrCode = data['BQR'];
    let barcode = data['Barcode'];
    let uid = vpa.match(/[^\.]+(?=@)/g);
    // end of vars
    let qr = simpleQRGenerator(qrCode);
    await qr.pipe(require('fs').createWriteStream('images/generated/qr/qr_' + uid + '.png'));
    await blitSingleSided(uid, vpa, batch);
    await blitSmartCard(uid, vpa, batch);
    await barcodeGenerator(uid, barcode, batch);
    return "Complete";
  } else {
    console.log(" Data at row " + data['__rowNum__'] + " is invalid.");
    return "errored";
  }
}

process.on('message', async (data) => {
  console.log('starting job');
  const result = await genImage(data);
  process.send(result)
  console.log('end of job');
  // process.exit();
});