import { Request, Response } from 'express';
import { generateQRCode } from './qrcode_generator';


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
    }


}

/**
 * GET qrcode/:q
 * 
 * @param request Express Request Object
 * @param response Express Response Object
 * @returns 
 */

async function getQRCode(request: Request ,response: Response){

    try {

        const { q } = request.params;

        if (!q){
            return response.status(400).json({ error: 'Data is required'});
        }

        const logoPath = 'assets\favicon.ico';
        const qrCodeBuffer = await generateQRCode(q, logoPath);
        response.type('image/png').send(qrCodeBuffer);

    } catch (error){
        
        console.error('Error generating QR Code:', error);
        response.status(500).json({ error: 'Internal server error. '});
    }

}