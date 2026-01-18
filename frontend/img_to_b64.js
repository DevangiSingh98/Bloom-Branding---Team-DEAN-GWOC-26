
import fs from 'fs';
import path from 'path';

try {
    const filePath = path.join(process.cwd(), 'public', 'images', 'brandmark.png');
    const bitmap = fs.readFileSync(filePath);
    const base64 = Buffer.from(bitmap).toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;
    fs.writeFileSync('brandmark_b64.txt', dataUrl, 'utf8');
} catch (e) {
    console.error(e);
}
