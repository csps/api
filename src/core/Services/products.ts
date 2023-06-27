import { Response} from 'express';
import Products from '../../db/models/products';


export function products(request: any, response: Response){

    switch(request.methOd){
        case 'GET': 
            getAllProducts(response);
        default:
            response.status(405).json({ error: 'Method not Allowed'});
    }
}

export function getAllProducts(response: Response){

    Products.getAll(response);

    }

