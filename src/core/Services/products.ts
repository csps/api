import { Response } from 'express';
import Product from '../../db/models/product';
import { ErrorTypes } from '../../types';


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

    Product.getAll(response, (error,product) => {

        if(error === ErrorTypes.DB_ERROR){
           response.status(500).json({
                error: 'Internal Server Error'
           });
        } else if (error === ErrorTypes.DB_EMPTY_RESULT){
            response.status(404).json({
                error: 'Products not Found'
            });
        } else {
            response.json(product);
        }
    });

    }

