'use strict';

import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';
import { HTTP_STATUS_CODE } from "../utilities/constants.js";

function getRandomImagePath(directory) {
    const files = fs.readdirSync(directory);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    const randomFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
    return path.join(directory, randomFile);
}

export async function generateCaptcha() {
    const canvas = createCanvas(320, 200);
    const ctx = canvas.getContext('2d');

    // Get a random image from the 'uploads/captcha' directory
    const randomImagePath = getRandomImagePath('uploads/captcha');
    const img = await loadImage(randomImagePath);
    console.log('Random image:', randomImagePath);
    ctx.drawImage(img, 0, 0, 320, 200);

    // Generate a piece for the puzzle
    const pieceCanvas = createCanvas(60, 60);
    const pieceCtx = pieceCanvas.getContext('2d');
    const pieceX = Math.floor(Math.random() * (320 - 60));
    const pieceY = Math.floor(Math.random() * (200 - 60));
    pieceCtx.drawImage(img, pieceX, pieceY, 60, 60, 0, 0, 60, 60);
    console.log('Piece position:', pieceX, pieceY);
    return {
        background: canvas.toDataURL(),
        piece: pieceCanvas.toDataURL(),
        piecePosition: { x: pieceX, y: pieceY }
    };
}

export async function getCaptcha(req, res) {
    try {
        const { background, piece, piecePosition } = await generateCaptcha();
        req.session.captchaPosition = piecePosition;
        req.session.captchaTimestamp = Date.now();
        res.status(HTTP_STATUS_CODE.OK).json({
            code: HTTP_STATUS_CODE.OK,
            status: 'success',
            data: { background, piece },
            message: 'CAPTCHA generated successfully'
        });
    } catch (error) {
        console.error('Error generating CAPTCHA:', error);
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            status: 'fail',
            message: error.message || 'An error occurred while generating CAPTCHA.'
        });
    }
}

export function validateCaptcha(req, res) {
    const captchaAge = Date.now() - req.session.captchaTimestamp;
    const maxCaptchaAge = 5 * 60 * 1000;

    if (captchaAge > maxCaptchaAge) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
            code: HTTP_STATUS_CODE.BAD_REQUEST,
            status: 'fail',
            message: 'CAPTCHA has expired. Please try again.'
        });
    }

    const { x, y } = req.body;
    const correctPosition = req.session.captchaPosition;

    if (!correctPosition) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
            code: HTTP_STATUS_CODE.BAD_REQUEST,
            status: 'fail',
            message: 'CAPTCHA has not been generated or has expired.'
        });
    }

    const tolerance = 10;
    const isValidCaptcha = Math.abs(x - correctPosition.x) <= tolerance && Math.abs(y - correctPosition.y) <= tolerance;

    if (isValidCaptcha) {
        req.session.isCaptchaValid = true;
        req.session.captchaPosition = null;
        return res.status(HTTP_STATUS_CODE.OK).json({
            code: HTTP_STATUS_CODE.OK,
            status: 'success',
            message: 'CAPTCHA validated successfully.'
        });
    } else {
        req.session.isCaptchaValid = false;
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
            code: HTTP_STATUS_CODE.BAD_REQUEST,
            status: 'fail',
            message: 'CAPTCHA validation failed.'
        });
    }
}
