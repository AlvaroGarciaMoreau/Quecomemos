const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const pdfPath = '/home/alvaro/AndroidStudioProjects/quecomemos/Samuel García López - Informe de Dieta Personalizado - Dieta 1 - 06-05-2026 10-47.PDF';

let dataBuffer = fs.readFileSync(pdfPath);

const parser = new PDFParse({ data: dataBuffer });
parser.getText({ partial: [12] }).then(() => {
    // Wait, let's use the underlying pdfjs to get the raw text items
    // Let's write a script that accesses parser's internal document or use pdfjs-dist directly.
    const pdfjs = require('pdf-parse/node_modules/pdfjs-dist' || 'pdfjs-dist');
    // Let's see if we can read the page using pdfjs-dist directly
    pdfjs.getDocument(new Uint8Array(dataBuffer)).promise.then(async (doc) => {
        const page = await doc.getPage(12);
        const textContent = await page.getTextContent();
        console.log("=== Raw Items on Page 12 ===");
        for (let item of textContent.items) {
            console.log(`[${item.transform[4].toFixed(1)}, ${item.transform[5].toFixed(1)}]: "${item.str}"`);
        }
    });
}).catch(err => {
    console.error(err);
});
