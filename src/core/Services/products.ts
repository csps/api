import { Response} from 'express';
import Products from '../../db/models/products';


/**
 * GET Request
 * getAllProducts Feature || ROUTE: GET
 * @author ampats04 (Jeremy Andy F. Ampatin)
 */

export function products(request: any, response: Response){

    switch(request.method){
        case 'GET': 
            getAllProducts(response);
        default:
            response.status(405).json({ error: 'Method not Allowed'});
    }
}

export function getAllProducts(response: Response){

    Products.getAll(response);

    }

