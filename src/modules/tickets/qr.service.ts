import QRCode from "qrcode";

export const generateQRCode = async (data: string) => {
  return QRCode.toDataURL(data);
};
