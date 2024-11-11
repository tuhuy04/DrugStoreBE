import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

// Hàm lấy ảnh ngẫu nhiên từ thư mục
function getRandomImagePath(directory) {
    const files = fs.readdirSync(directory);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    const randomFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
    return path.join(directory, randomFile);
}

// Hàm sinh CAPTCHA
export async function generateCaptcha() {
    const canvas = createCanvas(320, 200);
    const ctx = canvas.getContext('2d');

    // Lấy ảnh ngẫu nhiên từ thư mục 'uploads'
    const randomImagePath = getRandomImagePath('uploads/captcha');
    const img = await loadImage(randomImagePath);
    console.log(randomImagePath)
   
    ctx.drawImage(img, 0, 0, 320, 200);

  
    const pieceCanvas = createCanvas(50, 50);
    const pieceCtx = pieceCanvas.getContext('2d');
    const pieceX = Math.floor(Math.random() * (320 - 60)); // Xác định vị trí x ngẫu nhiên
    const pieceY = Math.floor(Math.random() * (200 - 60)); // Xác định vị trí y ngẫu nhiên

    console.log(`Random CAPTCHA piece position: x = ${pieceX}, y = ${pieceY}`);
    pieceCtx.drawImage(img, pieceX, pieceY, 60, 60, 0, 0, 60, 60);

    return {
        background: canvas.toDataURL(),
        piece: pieceCanvas.toDataURL(),
        piecePosition: { x: pieceX, y: pieceY }
    };
}

export async function getCaptcha(req, res) {
    const { background, piece, piecePosition } = await generateCaptcha();
    req.session.captchaPosition = piecePosition;
    req.session.captchaTimestamp = Date.now(); // Lưu thời gian tạo CAPTCHA
    res.json({ background, piece });
}

export function validateCaptcha(req, res) {
    const captchaAge = Date.now() - req.session.captchaTimestamp;
    const maxCaptchaAge = 5 * 60 * 1000; // e.g., 5 phút

    if (captchaAge > maxCaptchaAge) {
        return res.status(400).json({ message: 'CAPTCHA đã hết hạn. Vui lòng thử lại.' });
    }

    const { x, y } = req.body;
    const correctPosition = req.session.captchaPosition;

    if (!correctPosition) {
        return res.status(400).json({ message: 'CAPTCHA chưa được tạo hoặc đã hết hạn.' });
    }

    const tolerance = 10;
    const isValidCaptcha = Math.abs(x - correctPosition.x) <= tolerance && Math.abs(y - correctPosition.y) <= tolerance;

    if (isValidCaptcha) {
        req.session.isCaptchaValid = true;
        req.session.captchaPosition = null; // Xóa vị trí CAPTCHA sau khi xác minh thành công
        return res.json({ valid: true, message: 'CAPTCHA hợp lệ.' });
    } else {
        req.session.isCaptchaValid = false;
        return res.json({ valid: false, message: 'CAPTCHA không hợp lệ.' });
    }
}
