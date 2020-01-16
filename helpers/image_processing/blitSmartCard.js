const jimp = require('jimp');

const blitSmartCard = async (uid, VPA, sr_no) => {
  const mainImage = await jimp.read('images/input/smartcard.jpg');
  const qrImage = await jimp.read('images/generated/qr/qr_' + uid + '.png');
  // const font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);
  const font = await jimp.loadFont('fonts/arial.fnt');
  await qrImage.resize(375, 375).write('images/generated/qr/qr_' + uid + '.png');

  //max size 658, sides 320

  let textSize = jimp.measureText(font, VPA);
  // 405 by 160
  // xy 34:185
  let useLogo = false;
  if (useLogo) {
    let logo = await jimp.read('images/generated/logos/smartcardlogo.png');
    mainImage.blit(qrImage, 550, 176)
      .blit(logo, 49, 200)
      .print(font, (502 + (478 - textSize) / 2), 600, VPA)
      .print(font, 47, 580, sr_no)
      .write('images/generated/smartcard/smartcard_' + uid + '.jpg');
  } else {
    mainImage.blit(qrImage, 560, 165)
      .print(font, (570 + (360 - textSize) / 2), 585, VPA)
      .print(font, 47, 585, sr_no)
      .write('images/generated/smartcard/smartcard_' + uid + '.jpg');
  }
}

// let VPA = "Mswipe.1400030819094128@kotak";
// let sr_no = "R8-094128"
// blitSmartCard('', VPA, sr_no);

module.exports = blitSmartCard;