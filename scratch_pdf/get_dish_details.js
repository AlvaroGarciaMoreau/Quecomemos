const fs = require('fs');

const text = fs.readFileSync('/home/alvaro/Projects/Quecomemos/scratch_pdf/extracted_text_new.txt', 'utf8');
const lines = text.split('\n');

const brandNewDishes = [
  'Ensalada de Pasta de Lentejas con Mozzarella',
  'Secreto iberico Hacendado',
  'Contramuslos de Pollo al Horno con Patatas',
  'Ensalada mixta tipo I',
  'Entrecote a la plancha',
  'Ensalada de Patatas con Hortalizas y pollo',
  'Carne de ternera picada',
  'Tabulé de Verduras',
  'Garbanzos de Bote salteados con Huevo y Cebolla con Aguacate',
  'Pasta integral con tiras de pollo,queso feta y cherrys',
  'Ensalada de Pasta con Mozarella, Huevo Duro y Cherrys',
  'Ensalada de Canónigos, Melva, Cherrys y Perlas de Mozarella'
];

for (let dish of brandNewDishes) {
    console.log(`\n===========================================`);
    console.log(`CONTEXT FOR: ${dish}`);
    console.log(`===========================================`);
    
    let found = false;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(dish)) {
            found = true;
            const start = Math.max(0, i - 2);
            const end = Math.min(lines.length - 1, i + 6);
            for (let j = start; j <= end; j++) {
                const prefix = j === i ? '--> ' : '    ';
                console.log(`${prefix}${j + 1}: ${lines[j]}`);
            }
        }
    }
    if (!found) {
        console.log(`NOT FOUND`);
    }
}
