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
const rootDir = `${root}/${process.env.USER_IMAGES}`

const getDashboardDetails = async (req,res)=>{
    const customerId = req.params.customerId;

    try{
        const existingCustomer = await prisma.customer.findFirst({
            where:{
                id:customerId
            }
        });

        if(existingCustomer){
            return handleError({
                res:res,
                status:200,
                message:responseMessages.customerNotExist,
                error:null,
                responseCode:1001
            })
        }

        const customerDetails = await prisma.customer.findFirst({
            where:{
                id:customerId
            },
            select:{
                first_name:true,
                last_name:true,
                user:{
                    select:{
                        email:true
                    }
                },
                mobile_number:true,
                street_address:true,
                city:true,
                gender:true,
                nic:true,
                image:true,

            }


        });

        const categoryDetails = await prisma.category.findMany({
            select:{
                id:true,
                category_name:true,
                image:true,
                
            }
        })
    }catch(error){
        return handleError({
            res: res,
            status: 200,
            message: responseMessages.serverError,
            error: error,
            responseCode:1001
        })
    }
}