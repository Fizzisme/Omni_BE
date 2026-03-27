import {StatusCodes} from "http-status-codes";
import {productService} from "../services/product.service.js";

const getProductsByCategory = async (req,res,next)=>{
    try {
        const {categorySlug} = req.params;
        const result = await productService.getProductsByCategory(categorySlug);
        res.status(StatusCodes.OK).json(result);
    }
    catch(err){
        next(err);
    }
}


export const productController = {
    getProductsByCategory,
}