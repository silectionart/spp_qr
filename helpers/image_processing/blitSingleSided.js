const jimp = require("jimp");

const blitSingleSided = async (uid, VPA, batch, genData, merchantName) => {
  const mainImage = await jimp.read("images/input/" + genData.baseFile);
  const qrImage = await jimp.read(
    "images/generated/" + genData.outputFolder + "/qr/" + batch + ".png"
  );
  const font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
  let font2;
  if (
    merchantName &&
    merchantName.length <= 12 &&
    merchantName.replace(/[^A-Z]/g, "").length <= 6
  ) {
    font2 = await jimp.loadFont(jimp.FONT_SANS_64_BLACK);
  } else {
    font2 = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
  }
  // const font = await jimp.loadFont('fonts/opensans_56.fnt');
  // const font = await jimp.loadFont('fonts/opensans_48-80.fnt');
  await qrImage
    .resize(genData.qrSize, genData.qrSize)
    .write(
      "images/generated/" + genData.outputFolder + "/qr/" + batch + ".png"
    );

  //max size 658, sides 320

  let textSize = await jimp.measureText(font, VPA);
  let merchantTextSize = 0;
  if (merchantName) {
    merchantTextSize = await jimp.measureText(font2, merchantName);
  }

  // 1289 by 254
  // xy 34:185
  let useLogo = false;
  if (useLogo) {
    let logo = await jimp.read("images/generated/logos/1sidelogo.jpg");
    mainImage
      .blit(qrImage, genData.qrx, genData.qry)
      .blit(logo, 0, mainImage.getHeight() - 254)
      .print(font, 182 + (932 - textSize) / 2, 1450, VPA)
      .print(font, 27, 1670, batch)
      .write("images/generated/sticker1sided/" + batch + ".jpg");
  } else {
    mainImage
      .blit(qrImage, genData.qrx, genData.qry)
      .print(
        font,
        genData.text1x + (genData.qrSize - textSize) / 2,
        genData.text1y,
        VPA
      )
      // .print(font, genData.text1x, genData.text1y, VPA)
      .print(font, genData.batchx, genData.batchy, batch);
    if (merchantName) {
      let merchantBoxStartX = 99;
      let merchantBoxStartY = 808;
      let merchantBoxEndX = 578;
      let merchantBoxEndY = 981;
      if (merchantTextSize < merchantBoxEndX - merchantBoxStartX - 20) {
        mainImage.print(
          font2,
          merchantBoxStartX +
            (merchantBoxEndX - merchantBoxStartX) / 2 -
            merchantTextSize / 2,
          merchantBoxStartY +
            (merchantBoxEndY - merchantBoxStartY) / 2 -
            64 / 2,
          merchantName
        );
      } else {
        mainImage.print(
          font2,
          merchantBoxStartX + 10,
          merchantBoxStartY + 10,
          {
            text: merchantName,
            alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
          },
          merchantBoxEndX - merchantBoxStartX - 20,
          merchantBoxEndY - merchantBoxStartY - 20
        );
      }
    }
    mainImage.write(
      "images/generated/" +
        genData.outputFolder +
        "/sticker1sided/" +
        batch +
        ".jpg"
    );
  }
};

// let VPA = "Mswipe.1400030819094128@kotak";
// let batch = "R8-094128"
// blitSingleSided('', VPA, batch);

module.exports = blitSingleSided;
