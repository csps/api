import { Request, Response } from 'express';
import { generateQRCode } from './qrcode_generator';
import Jimp from 'jimp';
import Strings from '../config/strings';


/**
 * QR Code API
 * @author ampats04 (Jeremy Andy F. Ampatin)
 * 
 * @param request //Express Request
 * @param response  // Express Response
 */

export function qrcode(request: any , response: Response){

    switch(request.method){
        case 'GET':
            getQRCode(request,response);
            getRawQrCode(request,response);
    }

}

/**
 * GET qrcode/:q
 * 
 * @param request Express Request Object
 * @param response Express Response Object
 * @returns 
 */

async function getQRCode(request: Request , response: Response){

    try {

        const { q } = request.params;

        if (!q){
            response.status(400).json({ error: Strings.QRCODE_EMPTY_DATA});
            return;
        }

        const logoPath = 'assets/favicon.ico';
        const qrCodeBuffer = await generateQRCode(q, logoPath);
        response.type('image/png').send(qrCodeBuffer);

    } catch (error){
        
        console.error(Strings.QRCODE_GENERATED_ERROR, error);
        response.status(500).json({ error: Strings.QRCODE_SERVER_ERROR});
    }

}


/**
 * 
 * GET /qrcode/:q/raw
 * 
 * @param request Express Request Object
 * @param response Express Response Object
 */
async function getRawQrCode(request: Request, response: Response){

    try{
        const { q } = request.params;

        if(!q) {
            return response.status(400).json({ error: Strings.QRCODE_EMPTY_DATA});
        }

        const logoPath = 'assets/favicon.ico';
        const qrCodeBuffer = await generateQRCode(q, logoPath);
        const qrCodeBase64 = qrCodeBuffer.toString('base64');

        //Construct QRCode Data object
        const qrCodeData = {
            width: 300,
            height: 300,
            type: Jimp.MIME_PNG,
            data :qrCodeBase64,
        }

        //Construct JSON response

        const jsonResponse = {
            success: true,
            message: Strings.QRCODE_GENERATED_SUCCESFULLY,
            data: qrCodeData
        };

        response.json(jsonResponse);

    } catch (error){
        console.error(Strings.QRCODE_GENERATED_ERROR, error);
        response.status(500).json({error : Strings.QRCODE_SERVER_ERROR}
            );
    }

}