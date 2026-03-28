import {StatusCodes} from "http-status-codes";
import {categoryService} from "../services/category.service.js";

const getCategoriesBySlug = async (req, res, next) => {
    try {
        const result = await categoryService.getCategoriesBySlug(req.params.slug);

        res.status(StatusCodes.OK).json(result);
    }
    catch (error) {
        next(error);
    }
}

const getAll = async (req, res, next) => {
    try {
        const result = await categoryService.getAll();
        res.status(StatusCodes.OK).json(result);
    }
    catch (error) {
        next(error);
    }
}

const  getCategoryById = async (req, res, next) => {
    try {
        const result = await categoryService.getCategoryById(req.params.id);
        res.status(StatusCodes.OK).json(result);
    }
    catch (error) {
        next(error);
    }
}

export const categoryController = {
    getCategoriesBySlug,
    getAll,
    getCategoryById
}