const simpleQRGenerator = require('../simple');
const blitSingleSided = require('../../image_processing/blitSingleSided');
const barcodeGenerator = require('../barcodeGenerator');

// console.log(rowNum)
const genImage = async (xdata) => {
  let data = xdata.data;
  let genData = xdata.genData;
  if (data['VPA'] && data['qr code'] && data['Barcode']) {
    //Defining vars here
    let vpa = data['VPA'];
    // let row = data['__rowNum__'].toString();
    // let row = xdata.row.toString();
    // if (row.length < 6) {
    //   let repeatTimes = 6 - row.length;
    //   row = '0'.repeat(repeatTimes) + row;
    // }
    // let batch = 'sp01-' + row;
    let batch = data['vendor code'];
    // let srNo = data['SR'];
    let qrCode = data['qr code'];
    let barcode = data['Barcode'];
    let uid = vpa.match(/[^\.]+(?=@)/g);
    let inVpa = vpa.match(/[^\.]+(?=[a-zA-Z0-9@]?$)/g)[0];
    // end of vars
    let qr = simpleQRGenerator(qrCode);
    await qr.pipe(require('fs').createWriteStream('images/generated/' + genData.outputFolder + '/qr/qr_' + uid + '.png'));
    await blitSingleSided(uid, inVpa, batch, genData);
    await barcodeGenerator(uid, barcode, batch, genData);
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