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

const { root,createToken,refreshToken,sendEmail } = require('../../const');
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
                responseCode:1001
            });
        }

        const filenames = req.files.map((file) => file.filename);
        handleResponse({
            res: res,
            status: 200,
            message: responseMessages.fileUploadSuccess,
            data: { filenames: filenames},
            responseCode:1000
        });
    } catch (error) {
        handleError({
            res: res,
            status: 200,
            message: responseMessages.serverError,
            error: error,
   
            responseCode:1001
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



module.exports = {
    addNewUserType,
    fileUpload,
}