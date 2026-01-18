
import fs from 'fs';
import path from 'path';

try {
    // 1. Read the image
    const imgPath = path.join(process.cwd(), 'public', 'images', 'brandmark.png');
    const bitmap = fs.readFileSync(imgPath);
    const base64 = Buffer.from(bitmap).toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    // 2. Create SVG content
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <style>
    .icon { transition: filter 0.3s ease; }
    @media (prefers-color-scheme: light) { 
      .icon { filter: brightness(0); } 
    }
    @media (prefers-color-scheme: dark) { 
      .icon { filter: none; } 
    }
  </style>
  <image href="${dataUrl}" width="128" height="128" class="icon" />
</svg>`;

    // 3. Write vite.svg
    const svgPath = path.join(process.cwd(), 'public', 'vite.svg');
    fs.writeFileSync(svgPath, svgContent, 'utf8');
    console.log('Successfully generated vite.svg with embedded base64 image.');

} catch (e) {
    console.error('Error generating favicon:', e);
}
