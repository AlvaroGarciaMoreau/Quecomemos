const fs = require('fs');

const ocrText = fs.readFileSync('/home/alvaro/AndroidStudioProjects/quecomemos/scratch_pdf/ocr_all_raw.txt', 'utf8');
const layoutText = fs.readFileSync('/home/alvaro/AndroidStudioProjects/quecomemos/diet_text_layout.txt', 'utf8');
const plainText = fs.readFileSync('/home/alvaro/AndroidStudioProjects/quecomemos/diet_text.txt', 'utf8');

// We will build a structured data representation of the diet
const daysData = [];

// Helper to clean text
function clean(str) {
    if (!str) return '';
    return str.replace(/\s+/g, ' ').trim();
}

// Let's define the 7 days and their meals structure
// We can extract this from the layoutText pages 5 to 11
const meals = ['Desayuno', 'Media mañana', 'Almuerzo', 'Merienda', 'Cena'];

// Let's create a dictionary of all dishes found in the Menú Distribuido pages (12 to 30)
// We'll parse ocrText to find all dishes and their details
const dishesDatabase = {};

// Regex to extract page blocks from ocrText
const pages = ocrText.split(/--- PAGE \d+ ---/i);

for (const page of pages) {
    if (!page.trim()) continue;
    
    // Split by sections or lines
    // We want to find:
    // Dish Name
    // Ingredientes: ...
    // Elaboración: ... (optional)
    // Nutrientes: ... (optional, can be bound to meal or dish)
    
    const lines = page.split('\n');
    let currentDish = null;
    let currentIngredients = '';
    let currentElaboration = '';
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Check if it's "Ingredientes:"
        if (line.startsWith('Ingredientes:') || line.includes(' Ingredientes:')) {
            let ingText = line;
            // might span multiple lines
            while (i + 1 < lines.length && !lines[i+1].includes('Elaboración:') && !lines[i+1].includes('Nutrientes:') && !isNewDishOrSection(lines[i+1])) {
                i++;
                ingText += ' ' + lines[i].trim();
            }
            if (currentDish) {
                currentIngredients = ingText.substring(ingText.indexOf('Ingredientes:') + 13).trim();
                dishesDatabase[currentDish] = dishesDatabase[currentDish] || {};
                dishesDatabase[currentDish].ingredients = clean(currentIngredients);
            }
            continue;
        }
        
        // Check if it's "Elaboración:"
        if (line.startsWith('Elaboración:') || line.includes(' Elaboración:')) {
            let elabText = line;
            while (i + 1 < lines.length && !lines[i+1].includes('Nutrientes:') && !isNewDishOrSection(lines[i+1])) {
                i++;
                elabText += ' ' + lines[i].trim();
            }
            if (currentDish) {
                currentElaboration = elabText.substring(elabText.indexOf('Elaboración:') + 12).trim();
                dishesDatabase[currentDish] = dishesDatabase[currentDish] || {};
                dishesDatabase[currentDish].elaboration = clean(currentElaboration);
            }
            continue;
        }
        
        // If it's a dish name
        if (isDishName(line)) {
            currentDish = clean(line);
            dishesDatabase[currentDish] = dishesDatabase[currentDish] || {};
            currentIngredients = '';
            currentElaboration = '';
        }
    }
}

function isNewDishOrSection(line) {
    const l = line.trim();
    if (l.startsWith('Desayuno') || l.startsWith('Media mañana') || l.startsWith('Almuerzo') || l.startsWith('Merienda') || l.startsWith('Cena')) return true;
    if (l.startsWith('Ingredientes:') || l.startsWith('Elaboración:') || l.startsWith('Nutrientes:')) return true;
    return false;
}

function isDishName(line) {
    const l = line.trim();
    if (!l) return false;
    if (l.startsWith('---') || l.startsWith('Informe') || l.startsWith('RE 2024') || l.startsWith('SAMUEL') || l.startsWith('Página') || l.startsWith('Menú Distribuido')) return false;
    if (l.startsWith('Día ') || l.startsWith('Semana') || l.startsWith('Desayuno') || l.startsWith('Media mañana') || l.startsWith('Almuerzo') || l.startsWith('Merienda') || l.startsWith('Cena')) return false;
    if (l.startsWith('Ingredientes:') || l.startsWith('Elaboración:') || l.startsWith('Nutrientes:')) return false;
    if (l.length < 3) return false;
    // Don't include lines that are just numbers or symbols
    if (/^[0-9\s.,\/#!$%\^&\*;:{}=\-_`~()¨]+$/.test(l)) return false;
    return true;
}

// Print dishes base to check
console.log('Dishes database size:', Object.keys(dishesDatabase).length);
console.log(JSON.stringify(dishesDatabase, null, 2).substring(0, 1000));
