import {categoryModel} from "../models/category.model.js";
import {StatusCodes} from "http-status-codes";
import ApiError from "../utils/ApiError.js";

const getCategoriesBySlug = async (slug) => {

    const category = await categoryModel.findBySlug(slug);
    if (!category) throw new ApiError(StatusCodes.NOT_FOUND,"Không có category");
    return category;
}

const getAll = async () =>{
    const categories = await categoryModel.getAll();
    return categories;
}

export const categoryService = {
    getCategoriesBySlug,
    getAll
}