const { createWorker } = require('tesseract.js');
const fs = require('fs');

async function runOCR() {
    const worker = await createWorker('spa');
    console.log('Worker initialized.');
    
    let allText = '';
    for (let page = 12; page <= 30; page++) {
        const filePath = `/home/alvaro/AndroidStudioProjects/quecomemos/scratch_pdf/page-${page}.png`;
        if (fs.existsSync(filePath)) {
            console.log(`Starting OCR on page ${page}...`);
            const ret = await worker.recognize(filePath);
            allText += `\n\n--- PAGE ${page} ---\n\n` + ret.data.text;
            console.log(`Page ${page} finished.`);
        }
    }
    
    fs.writeFileSync('/home/alvaro/AndroidStudioProjects/quecomemos/scratch_pdf/ocr_all_raw.txt', allText);
    console.log('All pages OCR finished and saved.');
    await worker.terminate();
}

runOCR().catch(err => {
    console.error(err);
});
