import { Response } from 'express';
import Product from './product';
import { ErrorTypes } from '../../types';
import Database from '../database'; 

/**
 * Products Model
 * This model contains all the Product Information and Quantity :D
 * @author ampats04 (Jeremy Andy F. Ampatin)
*/

class Products {

  public static getAll(response: Response) {
 
    const db = Database.getInstance();

    db.query('SELECT * FROM products', [], (error, results) => {
       
      if(error){
        console.log(error);
        return;
      } else if (results.length === 0) {
        return;
      }


      const products: Product[] = [];

      for(const data of results){

          const product = new Product(  
            data.product_id,
            data.id,
            data.name,
            data.thumbnail,
            data.short_descprition,
            data.likes,
            data.stock,
          );

          products.push(product);
      }

      response.json(products);

    });
   
  }
}

export default Products;