const fs = require('fs');
const path = require('path');

const textPath = path.join(__dirname, 'extracted_text_new.txt');
if (!fs.existsSync(textPath)) {
    console.error('File not found:', textPath);
    process.exit(1);
}
const text = fs.readFileSync(textPath, 'utf8');
const lines = text.split('\n').map(l => l.trim());

// ----------------------------------------------------
// 1. Parse Shopping List (Page 2)
// ----------------------------------------------------
const categories = [];
let currentCategory = null;
let currentItem = '';
let inShoppingList = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    
    if (line.startsWith('Semana 1')) {
        inShoppingList = true;
        continue;
    }
    if (line.startsWith('Página 2') || line.startsWith('Día 1 Recetas Alternativas')) {
        break;
    }
    
    if (!inShoppingList) continue;
    
    // An item line is part of a list if it starts with a digit or if we are already accumulating an item.
    // In our PDF, every single item starts with a quantity (e.g., '60 g.', '2,6 kg.').
    const isItemLine = line.match(/^\d/) || currentItem !== '';
    
    if (!isItemLine) {
        // This is a category header
        let catName = line;
        if (catName.startsWith('> ')) {
            catName = catName.substring(2);
        }
        currentCategory = { name: catName, items: [] };
        categories.push(currentCategory);
    } else {
        // Accumulate item parts (handling lines that wrapped)
        if (currentItem) {
            currentItem += ' ' + line;
        } else {
            currentItem = line;
        }
        
        if (currentItem.includes('¨')) {
            let cleanedItem = currentItem.replace(/¨/g, '').replace(/\t/g, ' ').replace(/\s+/g, ' ').trim();
            if (currentCategory) {
                currentCategory.items.push(cleanedItem);
            }
            currentItem = '';
        }
    }
}

const shoppingListJSON = { categories };

// ----------------------------------------------------
// 2. Define Dishes Details Database
// ----------------------------------------------------
const dishesDetails = {
    "Cereales rellenos de Leche con Copos de Maiz": {
        "ingredients": "150 g. de Leche Entera Hacendado, 50 g. de Copos de Maíz Nicoli Hacendado, 50 g. de Cereales rellenos de Leche Hacendado.",
        "elaboration": "Mezclar todos los ingredientes en un bol."
    },
    "Leche entera con cacao": {
        "ingredients": "220 g. de Leche entera, 5 g. de Cacao soluble.",
        "elaboration": "Calentar la leche y añadir el cacao soluble, remover bien."
    },
    "Ensalada de Pasta de Lentejas con Mozzarella": {
        "ingredients": "130 g. de Pasta de Harina de Lenteja, 80 g. de Perlas Mozzarela Hacendado, 50 g. de Tomates Cherry.",
        "elaboration": "Cocer la pasta de lentejas. Escurrir, dejar enfriar y mezclar en un bol con las perlas de mozzarella y los tomates cherry partidos a la mitad."
    },
    "Secreto iberico Hacendado": {
        "ingredients": "200 g. de Secreto Ibérico Hacendado.",
        "elaboration": "Cocinar el secreto ibérico a la plancha por ambos lados a fuego fuerte hasta que quede dorado por fuera y jugoso por dentro. Condimentar con sal."
    },
    "Yogur con nueces": {
        "ingredients": "130 g. de Yogur Natural entero, 20 g. de Nueces sin cáscara.",
        "elaboration": "Añadir las nueces troceadas al yogur natural y servir."
    },
    "Gazpacho andaluz": {
        "ingredients": "100 g. de Tomate Natural, 50 g. de Agua, 30 g. de Pimiento, 30 g. de Cebollas, 20 g. de Pepinos, 5 g. de Aceite de oliva.",
        "elaboration": "Triturar las hortalizas con el agua y el aceite de oliva. Aderezar con vinagre y sal con moderación y servir frío."
    },
    "Salmón a la plancha": {
        "ingredients": "200 g. de Salmón.",
        "elaboration": "Cocinar el filete de salmón en una plancha bien caliente hasta dorar por ambos lados."
    },
    "Pieza de Fruta al gusto": {
        "ingredients": "250 g. de Pieza de Fruta al gusto.",
        "elaboration": "Lavar, pelar y trocear la fruta elegida."
    },
    "Contramuslos de Pollo al Horno con Patatas": {
        "ingredients": "150 g. de Pollo - muslo, 400 g. de Patata asada, 5 g. de Aceite de oliva.",
        "elaboration": "Hornear el pollo junto con las patatas cortadas a rodajas y sazonadas a 200°C durante 35-40 minutos."
    },
    "Ensalada mixta tipo I": {
        "ingredients": "90 g. de Tomate Natural, 40 g. de Pimiento, 40 g. de Lechuga, 30 g. de Rábanos, 3 g. de Aceite de oliva.",
        "elaboration": "Trocear los ingredientes, mezclar en una ensaladera y aliñar con el aceite de oliva y una pizca de sal."
    },
    "Weetabix cereales": {
        "ingredients": "70 g. de Weetabix cereales.",
        "elaboration": "Servir con leche o yogur."
    },
    "Salmorejo cordobés": {
        "ingredients": "180 g. de Tomate Natural, 20 g. de Jamón serrano, 20 g. de Pan, 10 g. de Huevo duro, 4 g. de Aceite de oliva, Ajo.",
        "elaboration": "Triturar los tomates con el pan, el ajo y el aceite. Decorar con huevo duro y jamón serrano picados."
    },
    "Entrecote a la plancha": {
        "ingredients": "250 g. de Ternera - lomo.",
        "elaboration": "Hacer el filete a la plancha a fuego fuerte, sazonar con sal gorda."
    },
    "Yogur con avellanas": {
        "ingredients": "140 g. de Yogur Natural entero, 10 g. de Avellanas.",
        "elaboration": "Servir el yogur mezclado con las avellanas picadas."
    },
    "Ensalada de Patatas con Hortalizas y pollo": {
        "ingredients": "150 g. de Pollo - pechuga, 150 g. de Patata asada, 50 g. de Tomate Natural, 30 g. de Cebollas, 30 g. de Pimiento.",
        "elaboration": "Cortar el pollo cocinado y la patata asada en dados. Añadir las hortalizas picadas, mezclar y aderezar al gusto."
    },
    "Yogur con almendras": {
        "ingredients": "140 g. de Yogur Natural entero, 10 g. de Almendras.",
        "elaboration": "Mezclar el yogur con las almendras."
    },
    "Yogurt con fresas y cereales": {
        "ingredients": "150 g. de Fresa, 120 g. de Yogurt Natural 0% Cremoso Hacendado, 20 g. de Corn Flakes Hacendado.",
        "elaboration": "Trocear las fresas y colocarlas en un bol con el yogur y los cereales."
    },
    "Ensalada de arroz integral con manzana y pavo": {
        "ingredients": "120 g. de Pavo, pechuga, 70 g. de Vasito arroz integral Brillante, 60 g. de Manzanas, 30 g. de Lechuga.",
        "elaboration": "Calentar el arroz integral, mezclarlo con la manzana y el pavo troceados sobre una base de lechuga."
    },
    "Carne de ternera picada": {
        "ingredients": "200 g. de Ternera - magra.",
        "elaboration": "Cocinar la carne en una sartén antiadherente salpimentando al gusto."
    },
    "Espaguetis Con Guacamole y Pistachos": {
        "ingredients": "80 g. de Queso Fresco de Burgos Hacendado 0%, 60 g. de Espagueti, 60 g. de Aguacate, 30 g. de Limón, 20 g. de Pistacho Tostado Sin Sal Hacendado.",
        "elaboration": "Cocer los espaguetis. Servirlos mezclados con el aguacate machacado con limón y decorados con los pistachos y dados de queso fresco."
    },
    "Pavo plancha": {
        "ingredients": "270 g. de Pavo, pechuga.",
        "elaboration": "Hacer a la plancha caliente con un poco de aceite de oliva por ambos lados."
    },
    "Mezcla cereales avena y copos de maiz": {
        "ingredients": "70 g. de Leche entera, 10 g. de Copos de Avena Hacendado, 10 g. de Copos de Maíz Nicoli Hacendado.",
        "elaboration": "Mezclar los copos de avena y de maíz en un bol con la leche."
    },
    "Tabulé de Verduras": {
        "ingredients": "30 g. de Cuscus Hacendado, 50 g. de Tomate Natural, 30 g. de Pepinos, 30 g. de Cebollas, 30 g. de Pimiento, 5 g. de Vinagre de manzana.",
        "elaboration": "Hidratar el cuscús. Picar las verduras muy finas y mezclar todo en frío aliñado con el vinagre."
    },
    "Garbanzos de Bote salteados con Huevo y Cebolla con Aguacate": {
        "ingredients": "100 g. de Garbanzos, 50 g. de Aguacate, 100 g. de Huevo, 50 g. de Cebollas.",
        "elaboration": "Saltear la cebolla picada con los garbanzos en una sartén. Verter los huevos batidos, revolver hasta cuajar y acompañar con el aguacate troceado."
    },
    "Huevo a la plancha": {
        "ingredients": "160 g. de Huevo.",
        "elaboration": "Hacer los huevos en la plancha caliente con apenas una gota de aceite."
    },
    "Bocadillo de tortilla francesa": {
        "ingredients": "90 g. de Pan Baguette, 100 g. de Huevo, 2 g. de Aceite de oliva.",
        "elaboration": "Hacer una tortilla francesa con los huevos y servirla dentro del pan abierto a la mitad."
    },
    "Bebida de coco": {
        "ingredients": "200 g. de Bebida de coco.",
        "elaboration": "Servir fría en un vaso."
    },
    "Pasta integral con tiras de pollo,queso feta y cherrys": {
        "ingredients": "100 g. de Pasta Integral Hacendado, 140 g. de Tiras de Pollo Asado al horno Hacendado, 100 g. de Tomates Cherry, 50 g. de Queso Feta Hacendado, 150 g. de Tomate Natural.",
        "elaboration": "Cocer la pasta. Mezclar con el pollo, queso feta, tomates cherry cortados por la mitad y salsa de tomate."
    },
    "Ensalada de Pasta con Mozarella, Huevo Duro y Cherrys": {
        "ingredients": "100 g. de Pasta Hacendado, 100 g. de Perlas Mozzarela Hacendado, 60 g. de Huevo duro, 150 g. de Tomates Cherry, 10 g. de Vinagre de manzana.",
        "elaboration": "Mezclar la pasta cocida fría con los tomates cherry partidos, las perlas de mozzarella y el huevo duro troceado. Aliñar con el vinagre."
    },
    "Pollo sencillo": {
        "ingredients": "250 g. de Pollo - pechuga.",
        "elaboration": "Cocinar la pechuga de pollo a la plancha bien caliente."
    },
    "Paella de pollo": {
        "ingredients": "250 g. de Pollo - pechuga, 80 g. de Cebollas, 60 g. de Tomate Natural, 30 g. de Arroz, 30 g. de Judías verdes, 10 g. de Guisantes frescos o congelados.",
        "elaboration": "Dorar el pollo troceado, añadir verduras picadas, tomate rallado, el arroz, agua (el doble) y dejar cocer hasta que se evapore el líquido."
    },
    "Ensalada de Canónigos, Melva, Cherrys y Perlas de Mozarella": {
        "ingredients": "100 g. de Dúo rúcula y canónigos Hacendado, 80 g. de Lomo de Melva en AOVE Hacendado, 60 g. de Tomates Cherry, 60 g. de Huevo duro, 50 g. de Perlas Mozzarela Hacendado.",
        "elaboration": "Colocar los canónigos y la rúcula como base, añadir cherrys, perlas de mozzarella, huevo en cuartos y coronar con la melva desmigada y su aceite."
    },
    "Pisto con Patatas al Horno y Huevos": {
        "ingredients": "150 g. de Patata asada, 140 g. de Huevo, 100 g. de Tomate Natural, 100 g. de Cebollas.",
        "elaboration": "Hornear las patatas troceadas. Elaborar el pisto salteando cebolla y tomate. Servir las patatas con el pisto y dos huevos a la plancha."
    }
};

// ----------------------------------------------------
// 3. Define Daily Menus and Alternatives
// ----------------------------------------------------
const dailyMenus = {
    "Día 1": {
        "Desayuno": ["Cereales rellenos de Leche con Copos de Maiz", "Leche entera con cacao"],
        "Almuerzo": ["Ensalada de Pasta de Lentejas con Mozzarella", "Secreto iberico Hacendado", "Yogur con nueces"],
        "Merienda": ["Cereales rellenos de Leche con Copos de Maiz", "Leche entera con cacao"],
        "Cena": ["Gazpacho andaluz", "Salmón a la plancha", "Pieza de Fruta al gusto"]
    },
    "Día 2": {
        "Desayuno": ["Cereales rellenos de Leche con Copos de Maiz", "Leche entera con cacao"],
        "Almuerzo": ["Contramuslos de Pollo al Horno con Patatas", "Ensalada mixta tipo I", "Yogur con avellanas"],
        "Merienda": ["Weetabix cereales", "Leche entera con cacao"],
        "Cena": ["Salmorejo cordobés", "Entrecote a la plancha", "Yogur con nueces"]
    },
    "Día 3": {
        "Desayuno": ["Cereales rellenos de Leche con Copos de Maiz", "Leche entera con cacao"],
        "Almuerzo": ["Ensalada de Patatas con Hortalizas y pollo", "Yogur con almendras"],
        "Merienda": ["Yogurt con fresas y cereales"],
        "Cena": ["Ensalada de arroz integral con manzana y pavo", "Carne de ternera picada", "Yogur con avellanas"]
    },
    "Día 4": {
        "Desayuno": ["Cereales rellenos de Leche con Copos de Maiz", "Leche entera con cacao"],
        "Almuerzo": ["Espaguetis Con Guacamole y Pistachos", "Pavo plancha", "Pieza de Fruta al gusto"],
        "Merienda": ["Mezcla cereales avena y copos de maiz", "Leche entera con cacao"],
        "Cena": ["Tabulé de Verduras", "Salmón a la plancha", "Pieza de Fruta al gusto"]
    },
    "Día 5": {
        "Desayuno": ["Cereales rellenos de Leche con Copos de Maiz", "Leche entera con cacao"],
        "Almuerzo": ["Garbanzos de Bote salteados con Huevo y Cebolla con Aguacate", "Yogur con nueces"],
        "Merienda": ["Cereales rellenos de Leche con Copos de Maiz", "Leche entera con cacao"],
        "Cena": ["Salmorejo cordobés", "Huevo a la plancha", "Yogur con nueces"]
    },
    "Día 6": {
        "Desayuno": ["Bocadillo de tortilla francesa", "Bebida de coco"],
        "Almuerzo": ["Pasta integral con tiras de pollo,queso feta y cherrys", "Yogur con avellanas"],
        "Merienda": ["Weetabix cereales", "Leche entera con cacao"],
        "Cena": ["Ensalada de Pasta con Mozarella, Huevo Duro y Cherrys", "Pollo sencillo", "Yogur con avellanas"]
    },
    "Día 7": {
        "Desayuno": ["Cereales rellenos de Leche con Copos de Maiz", "Leche entera con cacao"],
        "Almuerzo": ["Paella de pollo", "Ensalada de Canónigos, Melva, Cherrys y Perlas de Mozarella", "Yogur con almendras"],
        "Merienda": ["Yogurt con fresas y cereales"],
        "Cena": ["Pisto con Patatas al Horno y Huevos", "Gazpacho andaluz", "Pieza de Fruta al gusto"]
    }
};

const alternativesDatabase = {
    "Día 1": {
        "Desayuno": {
            "Cereales rellenos de Leche con Copos de Maiz": ["Zumo de albaricoque y pera", "Leche entera con azúcar", "Zumo de fruta con miel"],
            "Leche entera con cacao": ["Café con leche entera", "Leche descremada con cacao", "Leche descremada"]
        },
        "Almuerzo": {
            "Ensalada de Pasta de Lentejas con Mozzarella": ["Potaje de alubias blancas", "Ensalada de alubias con atún y huevo", "Arroz Chaufa"],
            "Secreto iberico Hacendado": ["Filete de ternera a la plancha", "Carpaccio con parmesano y limón", "Chuleta de buey a la plancha"],
            "Yogur con nueces": ["Carpaccio de mango y aguacate", "Tarta Queso Burgos Natural", "Yogur Natural Desnatado"]
        },
        "Merienda": {
            "Cereales rellenos de Leche con Copos de Maiz": ["Crackers y jamón serrano", "Pan y sobrasada", "Tostadas int. Con jamón york"],
            "Leche entera con cacao": ["Yogur Natural Entero", "Yogur Bio Natural", "Yogur Natural Desnatado"]
        },
        "Cena": {
            "Gazpacho andaluz": ["Crema de pimientos", "Ensalada variada de apio", "Ensalada de pimientos y tomates asados"],
            "Salmón a la plancha": ["Solomillo de buey a la plancha", "Chuleta de cerdo a la parrilla", "Filete de buey a la plancha"],
            "Pieza de Fruta al gusto": ["Zumo de limón", "Sandía", "Fresas con zumo de limón"]
        }
    },
    "Día 2": {
        "Desayuno": {
            "Cereales rellenos de Leche con Copos de Maiz": ["Zumo de albaricoque y pera", "Leche entera con azúcar", "Zumo de fruta con miel"],
            "Leche entera con cacao": ["Café con leche entera", "Leche descremada con cacao", "Leche descremada"]
        },
        "Almuerzo": {
            "Contramuslos de Pollo al Horno con Patatas": ["Arroz Chaufa", "Pasta de Quinoa con Bacalao", "Guisantes hervidos"],
            "Ensalada mixta tipo I": ["Lenguado con zanahoria", "Carne de cerdo guisada", "Albóndigas de pollo con hierbas"],
            "Yogur con avellanas": ["Yogur Natural Desnatado", "Yogur Bio Natural", "Carpaccio de mango y aguacate"]
        },
        "Merienda": {
            "Weetabix cereales": ["Tostadas int. con miel", "Tostadas int. con mermelada", "Brioche"],
            "Leche entera con cacao": ["Yogur Natural Entero", "Yogur Bio Natural", "Yogur Natural Desnatado"]
        },
        "Cena": {
            "Salmorejo cordobés": ["Canelones de champiñones y espárragos", "Crema de espinacas", "Crema de apio y coliflor"],
            "Entrecote a la plancha": ["Roast beef solo", "Chuleta de cerdo a la parrilla", "Atún fresco plancha"],
            "Yogur con nueces": ["Carpaccio de mango y aguacate", "Tarta Queso Burgos Natural", "Yogur Natural Desnatado"]
        }
    },
    "Día 3": {
        "Desayuno": {
            "Cereales rellenos de Leche con Copos de Maiz": ["Zumo de albaricoque y pera", "Leche entera con azúcar", "Zumo de fruta con miel"],
            "Leche entera con cacao": ["Café con leche entera", "Leche descremada con cacao", "Leche descremada"]
        },
        "Almuerzo": {
            "Ensalada de Patatas con Hortalizas y pollo": ["Carpaccio de piña con pollo", "Ensalada de pollo y naranja", "Ensalada de pollo y huevo"],
            "Yogur con almendras": ["Yogur Natural Desnatado", "Yogur Bio Natural", "Cuajada"]
        },
        "Merienda": {
            "Yogurt con fresas y cereales": ["Zumo de fruta", "Mandarinas", "Piña"]
        },
        "Cena": {
            "Ensalada de arroz integral con manzana y pavo": ["Paella de pollo", "Habas tiernas con acelgas", "Arroz Chaufa"],
            "Carne de ternera picada": ["Roast beef solo", "Ternera a la parrilla", "Entrecote a la plancha"],
            "Yogur con avellanas": ["Yogur Natural Desnatado", "Yogur Bio Natural", "Carpaccio de mango y aguacate"]
        }
    },
    "Día 4": {
        "Desayuno": {
            "Cereales rellenos de Leche con Copos de Maiz": ["Zumo de albaricoque y pera", "Leche entera con azúcar", "Zumo de fruta con miel"],
            "Leche entera con cacao": ["Café con leche entera", "Leche descremada con cacao", "Leche descremada"]
        },
        "Almuerzo": {
            "Espaguetis Con Guacamole y Pistachos": ["Empedrado de Garbanzos", "Garbanzos, espinacas y huevo duro", "Tortellini con champiñones"],
            "Pavo plancha": ["Pollo al limón", "Merluza molinera", "Parrillada de pescado"],
            "Pieza de Fruta al gusto": ["Zumo de limón", "Sandía", "Fresas con zumo de limón"]
        },
        "Merienda": {
            "Mezcla cereales avena y copos de maiz": ["Yogur de frutas", "Plátanos", "Plátano maduro"],
            "Leche entera con cacao": ["Yogur Natural Entero", "Yogur Bio Natural", "Yogur Natural Desnatado"]
        },
        "Cena": {
            "Tabulé de Verduras": ["Ensalada de pollo y naranja", "Picadillo de patatas con huevo y pollo picado", "Brócoli con jamón"],
            "Salmón a la plancha": ["Solomillo de buey a la plancha", "Chuleta de cerdo a la parrilla", "Filete de buey a la plancha"],
            "Pieza de Fruta al gusto": ["Zumo de limón", "Sandía", "Fresas con zumo de limón"]
        }
    },
    "Día 5": {
        "Desayuno": {
            "Cereales rellenos de Leche con Copos de Maiz": ["Zumo de albaricoque y pera", "Leche entera con azúcar", "Zumo de fruta con miel"],
            "Leche entera con cacao": ["Café con leche entera", "Leche descremada con cacao", "Leche descremada"]
        },
        "Almuerzo": {
            "Garbanzos de Bote salteados con Huevo y Cebolla con Aguacate": ["Garbanzos, espinacas y huevo duro", "Quiche de espinacas y queso", "Ensalada de alubias con atún y huevo"],
            "Yogur con nueces": ["Carpaccio de mango y aguacate", "Tarta Queso Burgos Natural", "Yogur Natural Desnatado"]
        },
        "Merienda": {
            "Cereales rellenos de Leche con Copos de Maiz": ["Crackers y jamón serrano", "Pan y sobrasada", "Tostadas int. Con jamón york"],
            "Leche entera con cacao": ["Yogur Natural Entero", "Yogur Bio Natural", "Yogur Natural Desnatado"]
        },
        "Cena": {
            "Salmorejo cordobés": ["Canelones de champiñones y espárragos", "Crema de espinacas", "Crema de apio y coliflor"],
            "Huevo a la plancha": ["Dorada al limón", "Escalopas de cerdo", "Merluza al perejil"],
            "Yogur con nueces": ["Carpaccio de mango y aguacate", "Tarta Queso Burgos Natural", "Yogur Natural Desnatado"]
        }
    },
    "Día 6": {
        "Desayuno": {
            "Bocadillo de tortilla francesa": ["Zumo de albaricoque y pera", "Leche entera con azúcar", "Leche entera con cacao"],
            "Bebida de coco": ["Café con leche entera", "Leche entera", "Leche entera con miel"]
        },
        "Almuerzo": {
            "Pasta integral con tiras de pollo,queso feta y cherrys": ["Paella de pollo", "Alcachofas rebozadas", "Arroz Chaufa"],
            "Yogur con avellanas": ["Yogur Natural Desnatado", "Yogur Bio Natural", "Carpaccio de mango y aguacate"]
        },
        "Merienda": {
            "Weetabix cereales": ["Tostadas int. con miel", "Tostadas int. con mermelada", "Brioche"],
            "Leche entera con cacao": ["Yogur Natural Entero", "Yogur Bio Natural", "Yogur Natural Desnatado"]
        },
        "Cena": {
            "Ensalada de Pasta con Mozarella, Huevo Duro y Cherrys": ["Gazpachuelo", "Quiche de espinacas y queso", "Arroz Chaufa"],
            "Pollo sencillo": ["Solomillo de buey a la plancha", "Salmón a la plancha", "Merluza a la plancha"],
            "Yogur con avellanas": ["Yogur Natural Desnatado", "Yogur Bio Natural", "Carpaccio de mango y aguacate"]
        }
    },
    "Día 7": {
        "Desayuno": {
            "Cereales rellenos de Leche con Copos de Maiz": ["Zumo de albaricoque y pera", "Leche entera con azúcar", "Zumo de fruta con miel"],
            "Leche entera con cacao": ["Café con leche entera", "Leche descremada con cacao", "Leche descremada"]
        },
        "Almuerzo": {
            "Paella de pollo": ["Guisantes hervidos", "Alcachofas y patatas salteadas con jamón", "Guisantes estofados"],
            "Ensalada de Canónigos, Melva, Cherrys y Perlas de Mozarella": ["Tortilla de champiñones", "Chuleta de buey con tomate", "Tortilla de espinacas"],
            "Yogur con almendras": ["Yogur Natural Desnatado", "Yogur Bio Natural", "Cuajada"]
        },
        "Merienda": {
            "Yogurt con fresas y cereales": ["Zumo de fruta", "Mandarinas", "Piña"]
        },
        "Cena": {
            "Pisto con Patatas al Horno y Huevos": ["Verduras rehogadas con jamón", "Picadillo de patatas con atún, huevo y aceitunas", "Guisantes a la primavera"],
            "Gazpacho andaluz": ["Lenguado con zanahoria", "Pollo con sanfaina", "Pavo a la naranja"],
            "Pieza de Fruta al gusto": ["Zumo de limón", "Sandía", "Fresas con zumo de limón"]
        }
    }
};

const meals = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'];

// ----------------------------------------------------
// 4. Compile Diet Data JSON
// ----------------------------------------------------
const compiledData = [];

for (let d = 1; d <= 7; d++) {
    const dayName = `Día ${d}`;
    const dayMenu = dailyMenus[dayName];
    const dayAlternatives = alternativesDatabase[dayName];
    
    const dayEntry = {
        day: d,
        name: dayName,
        meals: {}
    };
    
    for (const meal of meals) {
        dayEntry.meals[meal] = {
            dishes: dayMenu[meal].map(dishName => {
                const details = dishesDetails[dishName] || { ingredients: "", elaboration: "" };
                return {
                    name: dishName,
                    ingredients: details.ingredients,
                    elaboration: details.elaboration,
                    nutrients: null // Nutritional info is not specified in the new PDF report
                };
            }),
            alternatives: dayAlternatives[meal] ? Object.values(dayAlternatives[meal]).flat() : []
        };
    }
    compiledData.push(dayEntry);
}

// ----------------------------------------------------
// 5. Save Output Files
// ----------------------------------------------------
const outputAssetsDir = path.join(__dirname, '..', 'app', 'src', 'main', 'assets');
if (!fs.existsSync(outputAssetsDir)) {
    fs.mkdirSync(outputAssetsDir, { recursive: true });
}

// Write diet_data.json
const dietDataPath = path.join(outputAssetsDir, 'diet_data.json');
fs.writeFileSync(dietDataPath, JSON.stringify(compiledData, null, 4));
console.log('Successfully written diet_data.json to assets.');

// Write shopping_list.json
const shoppingListPath = path.join(outputAssetsDir, 'shopping_list.json');
fs.writeFileSync(shoppingListPath, JSON.stringify(shoppingListJSON, null, 4));
console.log('Successfully written shopping_list.json to assets.');

// Also save local copies in scratch_pdf for reference
fs.writeFileSync(path.join(__dirname, 'diet_data.json'), JSON.stringify(compiledData, null, 4));
fs.writeFileSync(path.join(__dirname, 'shopping_list.json'), JSON.stringify(shoppingListJSON, null, 4));
console.log('Successfully saved local copy of JSONs in scratch_pdf.');
