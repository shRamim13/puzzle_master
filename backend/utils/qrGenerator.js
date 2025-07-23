const QRCode = require('qrcode');
const crypto = require('crypto');

const generateQRCode = async (data) => {
  try {
    const qrDataURL = await QRCode.toDataURL(JSON.stringify(data));
    return qrDataURL;
  } catch (error) {
    throw new Error('QR code generation failed');
  }
};

const generateUniqueCode = () => {
  return crypto.randomBytes(16).toString('hex');
};

const generateQRCodeForPuzzle = async (level, difficulty, puzzleId, baseUrl) => {
  const uniqueCode = generateUniqueCode();
  const redirectUrl = `${baseUrl}/puzzle/${uniqueCode}`;
  
  const qrData = {
    code: uniqueCode,
    level,
    difficulty,
    puzzleId,
    redirectUrl
  };

  const qrImage = await generateQRCode(qrData);
  
  return {
    code: uniqueCode,
    qrImage,
    redirectUrl
  };
};

module.exports = {
  generateQRCode,
  generateUniqueCode,
  generateQRCodeForPuzzle
}; 