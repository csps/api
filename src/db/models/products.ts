import { Response } from 'express';
import Product from './product';

class Products {
  private static items: Product[] = [];

  public static getAll(response: Response) {
 
    const products = this.items;

    response.json(products);
  }

  public static addProduct(product: Product) {
    this.items.push(product);
  }
}

export default Products;