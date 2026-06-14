const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const pdfPath = '/home/alvaro/AndroidStudioProjects/quecomemos/Samuel García López - Informe de Dieta Personalizado - Dieta 1 - 06-05-2026 10-47.PDF';

let dataBuffer = fs.readFileSync(pdfPath);

const parser = new PDFParse({ data: dataBuffer });
parser.getInfo({ parsePageInfo: true }).then(async (info) => {
    // Let's parse page 12 only and print all its items
    const textData = await parser.getText({ partial: [12] });
    console.log("=== Page 12 Text ===");
    console.log(textData.text);
}).catch(err => {
    console.error(err);
});
