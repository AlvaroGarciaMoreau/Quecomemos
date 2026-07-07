const fs = require('fs');

const text = fs.readFileSync('/home/alvaro/Projects/Quecomemos/scratch_pdf/extracted_text_new.txt', 'utf8');

// Parse daily menus and alternatives from Page 2 to 8
// Format in text:
// Día X Recetas Alternativas
// Desayuno Zumo de...
// Main Dish
// ...

const days = {};
for (let d = 1; d <= 7; d++) {
    days[d] = {
        name: `Día ${d}`,
        meals: {
            "Desayuno": { dishes: [], alternatives: {} },
            "Almuerzo": { dishes: [], alternatives: {} },
            "Merienda": { dishes: [], alternatives: {} },
            "Cena": { dishes: [], alternatives: {} }
        }
    };
}

const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

let currentDay = null;
let currentMeal = null;
let lastAlternatives = null;

// Parse Alternatives section first
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if we reached the Menú Distribuido section (Día 1, Día 2, etc. without "Recetas Alternativas")
    if (line.match(/^Día \d+$/)) {
        break; 
    }
    
    const dayMatch = line.match(/^Día (\d+) Recetas Alternativas$/);
    if (dayMatch) {
        currentDay = parseInt(dayMatch[1]);
        currentMeal = null;
        lastAlternatives = null;
        continue;
    }
    
    if (!currentDay) continue;
    
    // Check if line starts with a meal name
    const mealMatch = line.match(/^(Desayuno|Almuerzo|Merienda|Cena)\s+(.*)$/);
    if (mealMatch) {
        currentMeal = mealMatch[1];
        const altText = mealMatch[2];
        lastAlternatives = parseAlternatives(altText);
        continue;
    }
    
    // If we have a current meal, lines alternate between:
    // 1. Dish Name (if lastAlternatives was set, this is the dish that has those alternatives)
    // 2. Or another alternatives list (without meal prefix)
    if (currentMeal) {
        if (lastAlternatives) {
            // This line is the dish name for the last alternatives
            const dishName = line;
            days[currentDay].meals[currentMeal].dishes.push(dishName);
            days[currentDay].meals[currentMeal].alternatives[dishName] = lastAlternatives;
            lastAlternatives = null;
        } else {
            // This line is a new list of alternatives
            lastAlternatives = parseAlternatives(line);
        }
    }
}

function parseAlternatives(text) {
    // Clean and split by comma
    return text.replace(/\.$/, '').split(',').map(s => s.trim()).filter(Boolean);
}

// Now parse the Menú Distribuido to get ingredients
const dishesIngredients = {};

currentDay = null;
currentMeal = null;
let currentDish = null;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect day
    const dayMatch = line.match(/^Día (\d+)$/);
    if (dayMatch) {
        currentDay = parseInt(dayMatch[1]);
        currentMeal = null;
        currentDish = null;
        continue;
    }
    
    if (!currentDay) continue;
    
    // Detect meal
    if (['Desayuno', 'Almuerzo', 'Merienda', 'Cena'].includes(line)) {
        currentMeal = line;
        currentDish = null;
        continue;
    }
    
    if (!currentMeal) continue;
    
    // If it starts with "Ingredientes:"
    if (line.startsWith('Ingredientes:')) {
        let ingText = line.substring(13).trim();
        // Check if ingredients span multiple lines
        while (i + 1 < lines.length && 
               !lines[i+1].startsWith('Día') && 
               !['Desayuno', 'Almuerzo', 'Merienda', 'Cena'].includes(lines[i+1]) && 
               !lines[i+1].startsWith('Ingredientes:') && 
               !lines[i+1].match(/^-- \d+ of \d+ --$/) &&
               !lines[i+1].startsWith('Página') &&
               !lines[i+1].startsWith('Informe de Dieta') &&
               !lines[i+1].startsWith('RE 2024')) {
            i++;
            ingText += ' ' + lines[i];
        }
        if (currentDish) {
            dishesIngredients[currentDish] = ingText;
        }
        continue;
    }
    
    // Ignore footer/header lines
    if (line.startsWith('Página') || 
        line.startsWith('Informe de Dieta') || 
        line.startsWith('RE 2024') || 
        line.match(/^-- \d+ of \d+ --$/)) {
        continue;
    }
    
    // Otherwise, it's a dish name
    currentDish = line;
}

console.log('--- PARSED DAYS MENU ---');
console.log(JSON.stringify(days, null, 2));

console.log('--- EXTRACTED INGREDIENTS ---');
console.log(JSON.stringify(dishesIngredients, null, 2));
