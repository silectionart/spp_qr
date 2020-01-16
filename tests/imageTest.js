const jimp = require('jimp');

const blit = async () => {
  const mainImage = await jimp.read('tests/images/sticker1sided.jpg');
  const qrImage = await jimp.read('tests/images/qr.png');
  const font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
  await qrImage.resize(665, 665).write('tests/images/qr.png');

  //max size 658, sides 320
  let text = "Mswipe.1400030819094128@kotak";
  let textBottom = "R8-094128"
  let textSize = jimp.measureText(font, text);
  mainImage.blit(qrImage, 316, 867)
    .print(font, (320 + (658 - textSize) / 2), 1620, text)
    .print(font, 47, 1920, textBottom)
    .write('tests/images/processed.jpg');
}

blit();