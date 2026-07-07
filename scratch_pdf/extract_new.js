const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const pdfPath = '/home/alvaro/Projects/Quecomemos/Samuel García López - Informe de Dieta Personalizado - Dieta 1 - 02-07-2026 10-11.PDF';

if (!fs.existsSync(pdfPath)) {
    console.error('PDF file does not exist at:', pdfPath);
    process.exit(1);
}

let dataBuffer = fs.readFileSync(pdfPath);

const parser = new PDFParse({ data: dataBuffer });
parser.getText().then(function(data) {
    fs.writeFileSync('/home/alvaro/Projects/Quecomemos/scratch_pdf/extracted_text_new.txt', data.text);
    console.log('Success! Total text length written:', data.text.length);
}).catch(err => {
    console.error('Error parsing PDF:', err);
});
