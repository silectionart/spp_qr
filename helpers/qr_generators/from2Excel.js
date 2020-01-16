var fs = require('fs')
var gracefulFs = require('graceful-fs')
gracefulFs.gracefulify(fs)

const XLSX = require('xlsx');
// const simpleQRGenerator = require('../qr_generators/simple');
// const uuid = require('uuid/v4');
// const blitSingleSided = require('../image_processing/blitSingleSided');
// const blitSmartCard = require('../image_processing/blitSmartCard');
// const barcodeGenerator = require('./barcodeGenerator');

// const generateImages = async (data) => {
//   if (data['VPA'] && data['BQR'] && data['Barcode']) {
//     //Defining vars here
//     let vpa = data['VPA'];
//     let row = data['__rowNum__'].toString();
//     if (row.length < 6) {
//       let repeatTimes = 6 - row.length;
//       row = '0'.repeat(repeatTimes) + row;
//     }
//     let batch = 'sp01-' + row;
//     // let srNo = data['SR'];
//     let qrCode = data['BQR'];
//     let barcode = data['Barcode'];
//     let uid = vpa.match(/[^\.]+(?=@)/g);
//     // end of vars
//     let qr = simpleQRGenerator(qrCode);
//     await qr.pipe(require('fs').createWriteStream('images/generated/qr/qr_' + uid + '.png'));
//     await blitSingleSided(uid, vpa, batch);
//     await blitSmartCard(uid, vpa, batch);
//     await barcodeGenerator(uid, barcode, batch);
//   } else {
//     console.log(" Data at row " + data['__rowNum__'] + " is invalid.");
//   }
// }


const generateFromExcel = async (sheetName) => {
  let workbook = await XLSX.readFile('./sheets/' + sheetName);
  let sheet_name_list = workbook.SheetNames;
  let xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  // console.log(xlData);

  ///////////////////////////////////////
  let newJob = true;
  if (newJob) {
    const fsExtra = require('fs-extra');
    await fsExtra.emptyDir('images/generated/qr');
    await fsExtra.emptyDir('images/generated/barcode');
    await fsExtra.emptyDir('images/generated/smartcard');
    await fsExtra.emptyDir('images/generated/sticker1sided');
  }
  //////////////////////////////////////////

  // // Logos
  // let useLogo = false;
  // if (useLogo) {
  //   const jimp = require('jimp');
  //   let smartCardLogo = await jimp.read('images/input/smartcardlogo.png');
  //   await smartCardLogo.resize(415, 170).write('images/generated/logos/smartcardlogo.png');
  //   let oneSideLogo = await jimp.read('images/input/1sidelogo.jpg');
  //   await oneSideLogo.resize(1289, 254).write('images/generated/logos/1sidelogo.jpg');
  // }

  //

  // for (let i = 0; i < xlData.length; i++) {
  //   const data = xlData[i];
  //   await generateImages(data);
  //   console.log("Job " + i + " finished.");
  // }

  const path = require('path');
  // const WorkerPool = require('../workerpool');
  // const pool = new WorkerPool(path.join(__dirname, './worker.js'), 6);
  // // const items = [...new Array(100)].fill(null);
  // Promise.all(xlData.map(async (_, i) => {
  //   await pool.run(() => ({ _ }));
  //   console.log('finished', i);
  // })).then(() => {
  //   console.log('finished all');
  // });


  // const forkPool = require('../forkPool');
  // const pool = new forkPool(path.join(__dirname, './fork.js'), 6);
  // Promise.all(xlData.map(async (_, i) => {
  //   await pool.run(() => ({ _ }));
  //   console.log('finished', i);
  // })).then(() => {
  //   console.log('finished all');
  // });


  // for (let i = 0; i < 7; i++) {
  //   const { fork } = require('child_process');
  //   let forker = fork(path.join(__dirname, './fork.js'));
  //   forker.send({ data: xlData[i], row: xlData[i]['__rowNum__'] });
  //   forker.on('exit', (code) => {
  //     console.log('process exited with code', code)
  //   })
  // }

  const pool = require('fork-pool');
  const Pool = new pool(path.join(__dirname, './fork.js'), null, null, {});
  for (let i = 0; i < xlData.length; i++) {
    Pool.enqueue({ data: xlData[i], row: xlData[i]['__rowNum__'] }, (err, obj) => {
      console.dir(obj);
    });
  }

}

generateFromExcel('spp001.xlsx');

// module.exports = generateFromExcel;