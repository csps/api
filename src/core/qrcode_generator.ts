import qrcode from 'qrcode';
import jimp from 'jimp';



/**
 * QR Code Generator
 * @author ampats04 (Jeremy Andy F. Ampatin)
 * 
 * @param data 
 * @param logoPath 
 * 
 */

export async function generateQRCode(data: string, logoPath: string): Promise<Buffer>{

    try{
        
        // Generate QR code as text
        const qrCodeText = await qrcode.toDataURL(data);

        // Load Logo Image
        const logo = await jimp.read(logoPath);

        //Resize Logo
        const logoSize = Math.min(logo.bitmap.width, logo.bitmap.height) * 0.3;
        logo.resize(logoSize, jimp.AUTO);

        //Create Composite Image
        const compositeImage = await new jimp(logo.bitmap.width, logo.bitmap.height);
        compositeImage.composite(logo,0,0);

        //Load QR Code Image
        const qrCodeImage = await jimp.read(Buffer.from(qrCodeText.split(',')[1], 'base64'));

        //Calculate positioning for centering the QR Code
        const x = (logo.bitmap.width - qrCodeImage.bitmap.width) / 2;
        const y = (logo.bitmap.height - qrCodeImage.bitmap.height) / 2;

        //Overlay QR code onto the composite image
        compositeImage.composite(qrCodeImage, x, y);

        //Get the resulting image as a buffer
        const resultBuffer = await compositeImage.getBufferAsync(jimp.MIME_PNG);

        return resultBuffer;
        
    } catch (error){
        console.error('Error generatir QR Code:', error);
        throw error;
    }
};

