var fs = require('fs')
var gracefulFs = require('graceful-fs')
gracefulFs.gracefulify(fs)

const path = require('path');

const pool = require('../../../modules/forkpool');
// const pool = require('../../forkPool')

const XLSX = require('xlsx');
const drainer = (pool) => {
  if (pool.pool) {}
};

const generateFromExcel = async (genData) => {
  let workbook = await XLSX.readFile('./sheets/' + genData.xlName);
  let sheet_name_list = workbook.SheetNames;
  let xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  // console.log(xlData);

  ///////////////////////////////////////
  let newJob = true;
  if (newJob) {
    const fsExtra = require('fs-extra');

    await fsExtra.ensureDir('images/generated/' + genData.outputFolder);
    await fsExtra.ensureDir('images/generated/' + genData.outputFolder + '/qr');
    await fsExtra.ensureDir('images/generated/' + genData.outputFolder + '/barcode');
    await fsExtra.ensureDir('images/generated/' + genData.outputFolder + '/sticker1sided');


    await fsExtra.emptyDir('images/generated/' + genData.outputFolder + '/qr');
    await fsExtra.emptyDir('images/generated/' + genData.outputFolder + '/barcode');
    await fsExtra.emptyDir('images/generated/' + genData.outputFolder + '/sticker1sided');
  }
  //////////////////////////////////////////

  const Pool = new pool(path.join(__dirname, './fork_singleImageWithQr.js'), null, null, {});
  let PoolCounter = 0;
  console.log("Total Entries in Sheet is", xlData.length)
  let i = genData.startRow || 0;
  let j = genData.endRow || xlData.length;
  let totalRtoP = j - i;
  for (i; i < j; i++) {
    Pool.enqueue({
      data: xlData[i],
      row: xlData[i]['__rowNum__'],
      genData: genData
    }, (err, obj) => {
      // console.dir(obj);
      PoolCounter++;
      // console.log(PoolCounter);
      // console.log(Pool.available + " available")
      process.stdout.write(PoolCounter + ' Jobs Completed\r');
      // console.log(PoolCounter + ' Jobs Completed...');

      if (PoolCounter === totalRtoP) {
        console.log(PoolCounter + ' Jobs Completed. Now Draining.')
        Pool.drain();
      }
    });
  }


}

// generateFromExcel('spp001.xlsx');

module.exports = generateFromExcel;