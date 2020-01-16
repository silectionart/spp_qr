const qr = require('qr-image');

const simpleQRGenerator = (data) => {
  // let qr_svg = qr.image('I love QR!', { type: 'svg' });
  let testData = `0002010102110216443622000665627604155346970006656010616610055000665531008250000000000000000000000000111531180001028679426470010A0000005240129Mswipe.1400030819094128@kotak27330010A0000005240115BQR0000008994245204599953033565802IN5906MSWIPE6005INDIA610640001162120308QM3854786304366C`
  let qr_png = qr.image(data, { type: 'png', 'ec_level': 'L', 'size': 11, 'margin': 1 });
  return qr_png;
}

module.exports = simpleQRGenerator;
