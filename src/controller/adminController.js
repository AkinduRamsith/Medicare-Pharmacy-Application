const { PrismaClient } = require('@prisma/client');
const handleResponse = require('../util/handleResponse');
const handleError = require('../util/handleError')
const responseMessages = require('../util/responseMessages');
const path = require('path');
const bcrypt = require("bcryptjs");
const fs = require('fs');
const { all } = require('axios');
const { date } = require('joi');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");



const prisma = new PrismaClient();

const { root, createToken, refreshToken, sendEmail } = require('../../const');
const { profile } = require('console');
const rootDir = `${root}/${process.env.ADMIN_IMAGES}`

const fileUpload = async (req, res) => {

    try {
        if (!req.files || req.files.length === 0) {
            return handleError({
                res: res,
                status: 200,
                message: responseMessages.fileUploadError,
                error: null,
                responseCode: 1001
            });
        }

        const filenames = req.files.map((file) => file.filename);
        handleResponse({
            res: res,
            status: 200,
            message: responseMessages.fileUploadSuccess,
            data: { filenames: filenames },
            responseCode: 1000
        });
    } catch (error) {
        handleError({
            res: res,
            status: 200,
            message: responseMessages.serverError,
            error: error,

            responseCode: 1001
        });
    }
};

const addNewUserType = async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return handleError({
            res: res,
            status: 200,
            message: responseMessages.noContent,
            error: null,
            responseCode: 1001
        });
    }

    const { userType } = req.body;


    try {
        const existingUserType = await prisma.user_type.findFirst({
            where: {
                name: userType
            }
        });

        if (existingUserType) {
            return handleError({
                res: res,
                status: 200,
                message: responseMessages.userTypeExists,
                error: null,
                responseCode: 1001
            })
        }


        const newUserType = await prisma.user_type.create({
            data: {
                name: userType
            }
        });

        handleResponse({
            res: res,
            status: 200,
            message: responseMessages.userTypeAdded,
            data: { newUserType: newUserType },
            responseCode: 1000
        })



    } catch (error) {
        return handleError({
            res: res,
            status: 200,
            message: responseMessages.serverError,
            error: error.stack,
            responseCode: 1001
        })
    }

}

const addNewProduct = async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return handleError({
            res: res,
            status: 200,
            message: responseMessages.noContent,
            error: null,
            responseCode: 1001
        });
    }

    const { productName, categoryId, file, quantity, price, description, brand ,rating} = req.body;

    try {
        const existingProduct = await prisma.product.findFirst({
            where: {
                AND: [
                    { brand: brand },
                    { product_name: productName },
                    { category_id: categoryId },
                    { price: price }
                ]
            }
        })
        let updateProduct;
        let newProduct;
        if (existingProduct) {
            updateProduct = await prisma.product.update({
                where: {
                    id: existingProduct.id
                },
                data: {
                    image: file,
                    stock: existingProduct.stock + quantity,
                    description: description,
                    rating:rating
                }
            })
        } else {
            newProduct = await prisma.product.create({
                data: {
                    product_name: productName,
                    brand: brand,
                    category: {
                        connect: {
                            id: categoryId
                        }
                    },
                    image: file,
                    stock: quantity,
                    price: price,
                    description: description,
                    rating:rating
                }

            })
        }
        if (newProduct) {
            return handleResponse({
                res: res,
                status: 200,
                message: responseMessages.productAdded,
                data: {
                    newProduct: newProduct,
                },
                responseCode: 1000
            })
        } if (updateProduct) {
            return handleResponse({
                res: res,
                status: 200,
                message: responseMessages.productUpdated,
                data: {
                    updateProduct: updateProduct,
                },
                responseCode: 1000
            })
        }



    } catch (error) {
        return handleError({
            res: res,
            status: 200,
            message: responseMessages.serverError,
            error: error.stack,
            responseCode: 1001
        })
    }
}

const addCategory = async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return handleError({
            res: res,
            status: 200,
            message: responseMessages.noContent,
            error: null,
            responseCode: 1001
        });
    }

    const { category, file } = req.body;
    try {
        const existingCategory = await prisma.category.findFirst({
            where: {
                category_name: category
            }
        });

        if (existingCategory) {
            return handleError({
                res: res,
                status: 200,
                message: responseMessages.categoryExists,
                error: null,
                responseCode: 1001
            })
        }

        const newCategory = await prisma.category.create({
            data: {
                category_name: category,
                image: file,

            }
        })

        handleResponse({
            res: res,
            status: 200,
            message: responseMessages.categoryAdded,
            data: {
                newCategory: newCategory,
            },
            responseCode: 1000
        })

    } catch (error) {
        return handleError({
            res: res,
            status: 200,
            message: responseMessages.serverError,
            error: error.stack,
            responseCode: 1001
        })
    }

}



module.exports = {
    addNewUserType,
    fileUpload,
    addNewProduct,
    addCategory
}