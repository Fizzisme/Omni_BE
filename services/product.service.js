import ApiError from "../utils/ApiError.js";
import {StatusCodes} from "http-status-codes";
import {productModel} from "../models/product.model.js";
import {categoryModel} from "../models/category.model.js";

const getProductsByCategory = async (categorySlug)=>{
    const category = await categoryModel.findBySlug(categorySlug);
    if(!category) throw new ApiError(StatusCodes.NOT_FOUND,"Không tìm thấy category");
    const categoryId = category._id;
    const products = await productModel.findByCategoryId(categoryId);
    return products;
}

export const productService = {
    getProductsByCategory,
}