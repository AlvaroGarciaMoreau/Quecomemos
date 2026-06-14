const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const pdfPath = '/home/alvaro/AndroidStudioProjects/quecomemos/Samuel García López - Informe de Dieta Personalizado - Dieta 1 - 06-05-2026 10-47.PDF';

let dataBuffer = fs.readFileSync(pdfPath);

const parser = new PDFParse({ data: dataBuffer });
parser.getText().then(function(data) {
    fs.writeFileSync('/home/alvaro/AndroidStudioProjects/quecomemos/scratch_pdf/extracted_pages.txt', data.text);
    console.log('Extracted successfully. Length:', data.text.length);
}).catch(err => {
    console.error(err);
});
