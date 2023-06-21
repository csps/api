import Database from "../database";
import { ErrorTypes } from "../../types";

/**
 * Products Model
 * This model contains all the Product Information and Quantity :D
 * @author ampats11 (Jeremy Andy F. Ampatin)
*/


class Product{
 
    private id: number;
    private dbid: number;
    private name: string;
    private thumbnail: string;
    private short_descprition: string;
    private likes: number;
    private stock: number;


/**
 * Product Private Constructor
 */

private constructor(

    id: number,
    dbid: number,
    name: string,
    thumbnail: string,
    short_description: string,
    likes: number,
    stock: number
){
    this.id = id;
    this.dbid = dbid;   
    this.name = name;
    this.thumbnail = thumbnail;
    this.short_descprition = short_description;
    this.likes = likes;
    this.stock = stock;
}

/**
 * Get Product list from the database using the Product ID generated
 * @param id Product ID
 */

    public static fromId(id: number, callback: (error: ErrorTypes | null, product: Product | null) => void){
        // Get database instance
        const db = Database.getInstance();

        //Query the database

        db.query("SELECT * FROM products WHERE id =?", [id], (error,results) => {
            
            //If has an error
            if (error){
                console.error(error);
                    callback(ErrorTypes.DB_ERROR, null);
                    return;
            }

            //If has no error
            if (results.length === 0){
                    callback(ErrorTypes.DB_EMPTY_RESULT,null);
                    return;
            }

            //Get result

            const data = results[0];

            const product = new Product(

                //Product ID 
                data.product_id,
                //Product Primary key ID
                data.id,
                //Product Name
                data.name,
                //Product URL Thumbnail
                data.thumbnail,
                //Product Short Description
                data.short_descprition,
                //Product Popularity
                data.likes,
                //Proudct Stocks
                data.stock,
                
            );

            callback(null,product); // (no errors, product object)
        });
    }
}

export default Product;