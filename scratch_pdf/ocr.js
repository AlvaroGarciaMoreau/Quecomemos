const { createWorker } = require('tesseract.js');
const fs = require('fs');

async function runOCR() {
    const worker = await createWorker('spa');
    console.log('Worker initialized. Starting OCR...');
    const ret = await worker.recognize('/home/alvaro/AndroidStudioProjects/quecomemos/scratch_pdf/page-12.png');
    console.log('=== OCR Result ===');
    console.log(ret.data.text);
    fs.writeFileSync('/home/alvaro/AndroidStudioProjects/quecomemos/scratch_pdf/ocr_page_12.txt', ret.data.text);
    await worker.terminate();
}

runOCR().catch(err => {
    console.error(err);
});
