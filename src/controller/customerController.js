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

