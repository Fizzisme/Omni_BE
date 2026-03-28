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

const getAll = async (req,res,next)=>{
    try {
        const result = await productService.getAll();
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}


export const productController = {
    getProductsByCategory,
    getAll,
}