var fs = require('fs')
var gracefulFs = require('graceful-fs')
gracefulFs.gracefulify(fs)

const XLSX = require('xlsx');
const simpleQRGenerator = require('../qr_generators/simple');
const uuid = require('uuid/v4');
const blitSingleSided = require('../image_processing/blitSingleSided');
const blitSmartCard = require('../image_processing/blitSmartCard');
const barcodeGenerator = require('./barcodeGenerator');

const generateImages = async (data) => {
  if (data['VPA'] && data['BQR'] && data['Barcode']) {
    //Defining vars here
    let vpa = data['VPA'];
    let row = data['__rowNum__'].toString();
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
  } else {
    console.log(" Data at row " + data['__rowNum__'] + " is invalid.");
  }
}


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

  // Logos
  let useLogo = false;
  if (useLogo) {
    const jimp = require('jimp');
    let smartCardLogo = await jimp.read('images/input/smartcardlogo.png');
    await smartCardLogo.resize(415, 170).write('images/generated/logos/smartcardlogo.png');
    let oneSideLogo = await jimp.read('images/input/1sidelogo.jpg');
    await oneSideLogo.resize(1289, 254).write('images/generated/logos/1sidelogo.jpg');
  }

  //

  // for (let i = 0; i < xlData.length; i++) {
  //   const data = xlData[i];
  //   await generateImages(data);
  //   console.log("Job " + i + " finished.");
  // }

  const path = require('path');
  const WorkerPool = require('../workerpool');
  const pool = new WorkerPool(path.join(__dirname, './worker.js'), 6);
  // const items = [...new Array(100)].fill(null);
  Promise.all(xlData.map(async (_, i) => {
    await pool.run(() => ({ _ }));
    console.log('finished', i);
  })).then(() => {
    console.log('finished all');
  });

  // return await Promise.all(xlData.map(async (data) => {
  //   generateImages(data);
  // }));

  // xlData.map((data) => {
  //   generateImages(data);
  // })
  // var Promise = require("bluebird");
  // Promise.map(xlData, (data) => {
  //   generateImages(data)
  // }, { concurrency: 2 }).then(console.log("done"));


  // const { Worker } = require('worker_threads');

  // const numOfRows = xlData.length;
  // const threads = 6;

  // for (let i = 0; i < xlData.length; i++) {
  //   const data = xlData[i];
  //   // console.log(data['__rowNum__'])
  //   const port = new Worker(require.resolve('./worker.js'), {
  //     workerData: { rowNum: data['__rowNum__'], data: data }
  //   })
  // }

}

// generateFromExcel('test_data.xlsx');
generateFromExcel('spp002.xlsx');

// module.exports = generateFromExcel;