const fs = require('fs');

const text = fs.readFileSync('/home/alvaro/Projects/Quecomemos/scratch_pdf/extracted_text_new.txt', 'utf8');
const lines = text.split('\n').map(l => l.trim());

const dailyMenus = {};
let currentDay = null;
let currentMeal = null;
let currentDish = null;

const uniqueDishes = new Set();
const dishIngredientsMap = {};

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    
    // Ignore headers, footers and page markers
    if (line.startsWith('Página') || 
        line.startsWith('Informe de Dieta') || 
        line.startsWith('RE 2024') || 
        line.startsWith('Semana') ||
        line.match(/^-- \d+ of \d+ --$/)) {
        continue;
    }
    
    // Detect Day (in Menú Distribuido section)
    // The Menú Distribuido starts from Page 9, which has "Día 1"
    // Wait, let's make sure we only start parsing when we are in the Menú Distribuido section (after line 400 approx)
    if (i < 400 && !currentDay) {
        continue;
    }
    
    const dayMatch = line.match(/^Día (\d+)$/);
    if (dayMatch) {
        currentDay = parseInt(dayMatch[1]);
        currentMeal = null;
        currentDish = null;
        if (!dailyMenus[currentDay]) {
            dailyMenus[currentDay] = {
                day: currentDay,
                name: `Día ${currentDay}`,
                meals: {
                    "Desayuno": [],
                    "Almuerzo": [],
                    "Merienda": [],
                    "Cena": []
                }
            };
        }
        continue;
    }
    
    if (!currentDay) continue;
    
    // Detect Meal
    if (['Desayuno', 'Almuerzo', 'Merienda', 'Cena'].includes(line)) {
        currentMeal = line;
        currentDish = null;
        continue;
    }
    
    if (!currentMeal) continue;
    
    // Detect Ingredients
    if (line.startsWith('Ingredientes:')) {
        let ingText = line.substring(13).trim();
        // Read subsequent lines if they are part of ingredients
        while (i + 1 < lines.length) {
            const nextLine = lines[i+1].trim();
            if (!nextLine) {
                i++;
                continue;
            }
            if (nextLine.startsWith('Día') || 
                ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'].includes(nextLine) ||
                nextLine.startsWith('Ingredientes:') ||
                nextLine.startsWith('Página') ||
                nextLine.startsWith('Informe de Dieta') ||
                nextLine.startsWith('RE 2024') ||
                nextLine.match(/^-- \d+ of \d+ --$/)) {
                break;
            }
            i++;
            ingText += ' ' + nextLine;
        }
        
        if (currentDish) {
            dishIngredientsMap[currentDish] = ingText;
        }
        continue;
    }
    
    // Otherwise, this is a dish name
    currentDish = line;
    uniqueDishes.add(currentDish);
    dailyMenus[currentDay].meals[currentMeal].push(currentDish);
}

console.log('=== dailyMenus ===');
console.log(JSON.stringify(dailyMenus, null, 2));

console.log('\n=== Unique Dishes ===');
console.log(Array.from(uniqueDishes));

console.log('\n=== Specific Ingredients Found ===');
console.log(JSON.stringify(dishIngredientsMap, null, 2));
