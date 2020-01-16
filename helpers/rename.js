var fs = require('fs')
var gracefulFs = require('graceful-fs');
gracefulFs.gracefulify(fs);

const XLSX = require('xlsx');

let fileName = "prod_sp_01.xlsx";
let start = 2000;
let stop = 5000;
let folder = "new_sp01";

// test
// let fileName = "test_prod_sp_01.xlsx";
// let start = 5;
// let stop = 15;
// let folder = "test_sp01";
// test over
const rename = async () => {
  let workbook = await XLSX.readFile('./sheets/' + fileName);
  let sheet_name_list = workbook.SheetNames;
  let xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  for (start; start < stop; start++) {
    let data = xlData[start];
    let vpa = data['VPA'];
    let batch = data['vendor code'];
    let uid = vpa.match(/[^\.]+(?=@)/g);
    let oldStickerPath = 'images/generated/' + folder + '/sticker1sided/sticker1sided_' + uid + '.jpg';
    let newStickerPath = 'images/generated/' + folder + '/sticker1sided/' + batch + '.jpg';
    fs.rename(oldStickerPath, newStickerPath, (err) => {
      if (err) {
        console.log(err);
      }
    });
    let oldBarPath = 'images/generated/' + folder + '/barcode/barcode_' + uid + '.jpg';
    let newBarPath = 'images/generated/' + folder + '/barcode/' + batch + '.jpg';
    fs.rename(oldBarPath, newBarPath, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
}
rename();