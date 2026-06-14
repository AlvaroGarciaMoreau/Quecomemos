const fs = require('fs');
const path = require('path');

const plainText = fs.readFileSync('/home/alvaro/AndroidStudioProjects/quecomemos/diet_text.txt', 'utf8');

const dishesDetails = {
    "Cereales rellenos de Leche con Copos de Maiz": {
        "ingredients": "150 g. de Leche Entera Hacendado, 50 g. de Copos de Maíz Nicoli Hacendado, 50 g. de Cereales rellenos de Leche Hacendado.",
        "elaboration": ""
    },
    "Leche entera con cacao": {
        "ingredients": "220 g. de Leche entera, 5 g. de Cacao soluble.",
        "elaboration": ""
    },
    "Bocadillo de Jamón Serrano con Pan Integral": {
        "ingredients": "150 g. de Pan Integral Hacendado, 50 g. de Jamon de Cebo Iberico Hacendado, 30 g. de Tomate para Untar con AOVE Hacendado, 5 g. de Aceite de oliva.",
        "elaboration": "Cantidad de Pan integral indicada, se puede tostar el pan si se desea, añadir 30 gramos de tomate para untar con aceite de oliva virgen extra hacendado y los 50 gramos del jamón serrano."
    },
    "Pasta a la Boloñesa": {
        "ingredients": "150 g. de Ternera - magra, 100 g. de Cebolla Troceada Hacendado, 100 g. de Tomate tamizado hacendado, 100 g. de Pimiento Rojo y Verde Hacendado, 80 g. de Pasta Integral Hacendado.",
        "elaboration": "Cantidad de pasta integral indicada en la receta, cantidad de carne picada indicada en la receta, hacer un sofrito con la verdura que mas te guste, una idea es cebolla picada y pimiento rojo y verde, mercadona las vende ya troceadas congeladas, muy rápidas, usa tomate concentrado para hacer la salsa. Evitar tomate frito por su contenido en azucar añadido."
    },
    "Gazpacho andaluz": {
        "ingredients": "100 g. de Tomate Natural, 50 g. de Agua, 30 g. de Pimiento, 30 g. de Cebollas, 20 g. de Pepinos, 2 g. de Aceite de oliva.",
        "elaboration": "Poner todos los ingredientes en un recipiente y batir. Añadir vinagre y sal con moderación. Añadir agua mineral al gusto."
    },
    "Yogur con nueces": {
        "ingredients": "130 g. de Yogur Natural entero, 20 g. de Nueces sin cáscara.",
        "elaboration": ""
    },
    "Crema de zanahorias": {
        "ingredients": "120 g. de Zanahorias, 60 g. de Leche entera, 40 g. de Puerros, 20 g. de Patatas.",
        "elaboration": "Puedes añadir toda la verdura que quieras, en variedad y cantidad."
    },
    "Salmón a la plancha": {
        "ingredients": "150 g. de Salmón.", // Will override on Day 1 Cena dynamically in code or keep it generic
        "elaboration": "Poner el salmón con la plancha bien caliente."
    },
    "Pieza de Fruta al gusto": {
        "ingredients": "250 g. de Pieza de Fruta al gusto.",
        "elaboration": ""
    },
    "Bocadillo de Lomo embuchado y queso": {
        "ingredients": "80 g. de Pan de centeno hacendado, 30 g. de Lomo Embuchado Hacendado, 20 g. de Queso Havarti light hacendado, 20 g. de Tomate para Untar con AOVE Hacendado.",
        "elaboration": ""
    },
    "Pisto con Patatas al Horno y Huevos": {
        "ingredients": "150 g. de Patata asada, 120 g. de Huevo, 100 g. de Tomate Natural, 100 g. de Cebollas.",
        "elaboration": "Saltear la cebolla y el tomate muy picadito, salpimentar al gusto, elaborar pisto y servir con 2 huevos a la plancha. Cortar en cubitos la cantidad de patata indicada y elaborar en el horno."
    },
    "Yogur con avellanas": {
        "ingredients": "140 g. de Yogur Natural entero, 10 g. de Avellanas.",
        "elaboration": ""
    },
    "Weetabix cereales": {
        "ingredients": "70 g. de Weetabix cereales.",
        "elaboration": ""
    },
    "Salmorejo cordobés": {
        "ingredients": "180 g. de Tomate Natural, 20 g. de Jamón serrano, 20 g. de Pan, 10 g. de Huevo duro, 4 g. de Aceite de oliva, Ajo.",
        "elaboration": "Trituramos los tomate y le Incorporamos el pan, mejor que esté duro, y lo dejamos que se empape bien durante unos 10 minutos. Ahora incorporamos el medio ajo sin el corazón y el aceite. Rectificamos de sal poco a poco hasta llegar a nuestro gusto deseado y listo. Emplatamos con jamón y huevo duro."
    },
    "Carne de Ternera Picada con Verdura y Nachos": {
        "ingredients": "110 g. de Ternera - magra, 70 g. de Fajitas Hacendado, 70 g. de Pimiento Rojo y Verde Hacendado, 70 g. de Cebolla Troceada Hacendado.",
        "elaboration": "saltear en una sarten con el aceite justo para que no se nos pegue, cebolla troceada y pimiento rojo y verde bien troceado, cuando este casi a punto añadimos la carne de ternera picada en la cantidad que marca la receta y saltear hasta que esté en su punto, sazonar con sal al punto y especias como pimienta, hierbas provenzales. *Para cocinar los nachos, cortar en triangulos las fajitas y meter en el horno con pimentón y condimento al gusto durante 10 minutos a 180 grados."
    },
    "Bocadillo de tortilla francesa": {
        "ingredients": "100 g. de Pan Baguette, 50 g. de Huevo, 30 g. de Tomate Natural, 2 g. de Aceite de oliva.", // Can override for Day 6 Desayuno (90g)
        "elaboration": "Untar el tomate en el pan o cortar a rodajas."
    },
    "Yogur con almendras": {
        "ingredients": "140 g. de Yogur Natural entero, 10 g. de Almendras.",
        "elaboration": ""
    },
    "Yogurt con fresas y cereales": {
        "ingredients": "150 g. de Fresa, 120 g. de Yogurt Natural 0% Cremoso Hacendado, 20 g. de Corn Flakes Hacendado.",
        "elaboration": ""
    },
    "Ensalada de Pasta con Mozarella, brócoli y Cherrys": {
        "ingredients": "120 g. de Pasta Integral Hacendado, 100 g. de Brócoli, 100 g. de Perlas Mozzarela Hacendado, 100 g. de Tomates Cherry, 20 g. de Salsa de Soja Gluten Free Hacendado.",
        "elaboration": ""
    },
    "Dorada a la parrilla": {
        "ingredients": "190 g. de Dorada, 6 g. de Aceite de oliva.",
        "elaboration": "Brasear la dorada y servir. Condimentar con moderación con especies."
    },
    "Espaguetis Con Guacamole y Pistachos": {
        "ingredients": "80 g. de Queso Fresco de Burgos Hacendado 0%, 60 g. de Espagueti, 60 g. de Aguacate, 30 g. de Limón, 20 g. de Pistacho Tostado Sin Sal Hacendado.",
        "elaboration": "- Cocer los espaguetis en agua hirviendo hasta que estén a nuestro gusto. A mi me gustan al dente. - Pelar los aguacates, machacar la pulpa con un poco de zumo de limón, pimienta y sal. Reservar. - En una sartén con un poco de aceite de oliva saltear un chile picado, añadir los espaguetis cocidos, el aguacate machacado y un chorrito del agua de la cocción, remover, cocinar en conjunto un par de minutos y rectificar de sal si es necesario. - Servir en un plato, añadir unos pistachos picados por encima, unas gotas de zumo de limón y un toque de ñora molida. Añadir el queso fresco de burgos."
    },
    "Pavo plancha": {
        "ingredients": "250 g. de Pavo, pechuga.",
        "elaboration": "Hacer el pavo cuando la plancha esté muy caliente. Condimentar con moderación."
    },
    "Mezcla cereales avena y copos de maiz": {
        "ingredients": "70 g. de Leche entera, 10 g. de Copos de Avena Hacendado, 10 g. de Copos de Maíz Nicoli Hacendado.",
        "elaboration": ""
    },
    "Ensalada de arroz y garbanzos": {
        "ingredients": "120 g. de Vasito arroz integral Brillante, 100 g. de Pepinos, 80 g. de Garbanzo cocido Hacendado, 50 g. de Tomates Cherry, 50 g. de Cebollas, 50 g. de Aguacate.",
        "elaboration": "1. Cocer el arroz 1 minuto al microondas. 2. Lavar los garbanzos. 3. Picar el aguacate, pimiento, pepino y cebolla. 4. Mezclar todos los ingredientes y aderezar con especias al gusto."
    },
    "Fajitas de Pollo": {
        "ingredients": "200 g. de Pollo - pechuga, 80 g. de Cebollas, 80 g. de Pimiento Rojo y Verde Hacendado, 60 g. de Fajitas Hacendado.",
        "elaboration": "Receta para 2 fajitas de Pollo, 1 paquete de tiras de pollo hacendado, cebolla y pimiento salteado, calentar las fajitas y servir. Acompañar con algo de ensalada a su gusto. *Puedes hacerlo en la freidora de aire o en el horno, usando las fajitas como base y los ingredientes encima."
    },
    "Ensalada de arroz integral con manzana y pavo": {
        "ingredients": "120 g. de Pavo, pechuga, 70 g. de Vasito arroz integral Brillante, 60 g. de Manzanas, 30 g. de Lechuga.",
        "elaboration": "Calentar el vasito de arroz integral, una vez calentado rociarlo con zumo de limón. Trocear la manzana, poner las hojas de lechuga en una ensaladera, añadir el arroz y la manzana. Condimentar con vinagre de manzana."
    },
    "Huevo a la plancha": {
        "ingredients": "160 g. de Huevo.",
        "elaboration": ""
    },
    "Bebida de coco": {
        "ingredients": "200 g. de Bebida de coco.",
        "elaboration": ""
    },
    "Risotto de Champiñones con Pollo": {
        "ingredients": "200 g. de Caldo de Pollo Bajo en Sal Hacendado, 80 g. de Champiñones, 80 g. de Pechuga de Pollo Hacendado, 70 g. de Arroz, 40 g. de Cebolla Troceada Hacendado.",
        "elaboration": "- Pelar la cebolleta y picarla, añadir a una sartén con una cucharada de aceite de oliva a fuego bajo hasta que esté blandita pero sin dorarse. Añadir un poco de sal. - Cuando la cebolleta esté lista, subir un poco el fuego, añadir el arroz y sofreír un par de minutos. - Mover. - Hay que tener el caldo caliente sin que se enfríe durante todo el proceso para no perder la cocción, para ello lo ideal es tenerlo en otro cazo a fuego bajo. - Comenzar mojando el arroz con un par de cucharones de caldo y no se agrega más hasta que el arroz lo haya absorbido por completo. Proceder así hasta terminar el caldo por completo. Cada vez que incorporemos caldo removemos el arroz suavemente con ayuda de una cuchara de madera para que vaya soltando el almidón. - Cuando el arroz lleve unos 15 minutos cocinándose, incorporamos el pollo. Probamos y rectificamos de sal. - Pasados unos 20 minutos de cocción, durante los que habremos añadido todo el caldo, el arroz estará listo. - Deberá quedar ligeramente al dente, cremoso pero sin estar pastoso ni apelmazado."
    },
    "Crema de calabacín": {
        "ingredients": "120 g. de Calabacín, 70 g. de Patatas, 40 g. de Cebollas.",
        "elaboration": "Hervir el calabacín y las patatas con poca agua. Sofría la cebolla. Cuando esté cocido añadir el queso, y la cebolla y triturar. Servir fría o caliente."
    },
    "Paella de pollo": {
        "ingredients": "70 g. de Pollo - pechuga, 60 g. de Tomate Natural, 30 g. de Arroz, 30 g. de Judías verdes, 10 g. de Guisantes frescos o congelados.",
        "elaboration": "En una paella freír el pollo troceado hasta que esté bien dorado, añadir ajo y las verduras, después el tomate y el pimentón y seguir friendo. Poner agua, añadir el arroz y dejarlo cocer hasta que se consuma el líquido. El agua debe ser el doble que el arroz."
    },
    "Ensalada Campesina": {
        "ingredients": "100 g. de Tomate Natural, 60 g. de Pepinos, 60 g. de Queso de Burgos 0% Hacendado, 50 g. de Aceitunas negras Hacendado, 20 g. de Cebollas, 5 g. de Vinagre de manzana.",
        "elaboration": "1. Lavar el tomate y cortar en daditos. 2. Lavar el pepino y cortarlo en rodajas. 3. Pelar la cebolla y cortarla en aros. 4. Poner en una ensaladera todos los ingredientes y añadir el queso de Burgos cortado en dados. 5. Condimentar con sal, pimienta, el vinagre de manzana y aceite de oliva virgen extra."
    },
    "Revuelto de Quinoa con Champiñones y Verdura": {
        "ingredients": "90 g. de Quinoa Hacendado, 50 g. de Zanahorias, 50 g. de Cebollas, 50 g. de Champiñones, 50 g. de Pimiento Rojo y Verde Hacendado, 20 g. de Ajo.",
        "elaboration": "Saltear toda la verdura y mezclar con la Quinoa."
    },
    "Sopa de tomate": {
        "ingredients": "80 g. de Caldo vegetal, 80 g. de Tomate Natural, 30 g. de Cebollas, 5 g. de Mantequilla, 5 g. de Ajo.",
        "elaboration": "Cueza los tomates cortados con el caldo durante 20 min. Haga un sofrito con los ajos y las cebollas con la mantequilla y póngase todo a hervir a fuego lento durante 10 min. Aliñar con sal, pimienta, perejil y algo de azúcar."
    }
};

const meals = ['Desayuno', 'Media mañana', 'Almuerzo', 'Merienda', 'Cena'];

// Let's define the 7 days menu structure (exact mapping of dishes)
const dailyMenus = {
    "Día 1": {
        "Desayuno": ["Cereales rellenos de Leche con Copos de Maiz", "Leche entera con cacao"],
        "Media mañana": ["Bocadillo de Jamón Serrano con Pan Integral"],
        "Almuerzo": ["Pasta a la Boloñesa", "Gazpacho andaluz", "Yogur con nueces"],
        "Merienda": ["Cereales rellenos de Leche con Copos de Maiz", "Leche entera con cacao"],
        "Cena": ["Crema de zanahorias", "Salmón a la plancha", "Pieza de Fruta al gusto"]
    },
    "Día 2": {
        "Desayuno": ["Cereales rellenos de Leche con Copos de Maiz", "Leche entera con cacao"],
        "Media mañana": ["Bocadillo de Lomo embuchado y queso"],
        "Almuerzo": ["Pisto con Patatas al Horno y Huevos", "Salmón a la plancha", "Yogur con avellanas"],
        "Merienda": ["Weetabix cereales", "Leche entera con cacao"],
        "Cena": ["Salmorejo cordobés", "Carne de Ternera Picada con Verdura y Nachos", "Yogur con nueces"]
    },
    "Día 3": {
        "Desayuno": ["Cereales rellenos de Leche con Copos de Maiz", "Leche entera con cacao"],
        "Media mañana": ["Bocadillo de tortilla francesa"],
        "Almuerzo": ["Salmorejo cordobés", "Carne de Ternera Picada con Verdura y Nachos", "Yogur con almendras"],
        "Merienda": ["Yogurt con fresas y cereales"],
        "Cena": ["Ensalada de Pasta con Mozarella, brócoli y Cherrys", "Dorada a la parrilla", "Yogur con avellanas"]
    },
    "Día 4": {
        "Desayuno": ["Cereales rellenos de Leche con Copos de Maiz", "Leche entera con cacao"],
        "Media mañana": ["Bocadillo de Jamón Serrano con Pan Integral"],
        "Almuerzo": ["Espaguetis Con Guacamole y Pistachos", "Pavo plancha", "Pieza de Fruta al gusto"],
        "Merienda": ["Mezcla cereales avena y copos de maiz", "Leche entera con cacao"],
        "Cena": ["Ensalada de arroz y garbanzos", "Pieza de Fruta al gusto"]
    },
    "Día 5": {
        "Desayuno": ["Cereales rellenos de Leche con Copos de Maiz", "Leche entera con cacao"],
        "Media mañana": ["Bocadillo de Lomo embuchado y queso"],
        "Almuerzo": ["Fajitas de Pollo", "Salmorejo cordobés", "Yogur con nueces"],
        "Merienda": ["Cereales rellenos de Leche con Copos de Maiz", "Leche entera con cacao"],
        "Cena": ["Ensalada de arroz integral con manzana y pavo", "Huevo a la plancha", "Yogur con nueces"]
    },
    "Día 6": {
        "Desayuno": ["Bocadillo de tortilla francesa", "Bebida de coco"],
        "Media mañana": ["Bocadillo de tortilla francesa"],
        "Almuerzo": ["Risotto de Champiñones con Pollo", "Salmorejo cordobés", "Yogur con avellanas"],
        "Merienda": ["Weetabix cereales", "Leche entera con cacao"],
        "Cena": ["Crema de calabacín", "Carne de Ternera Picada con Verdura y Nachos", "Yogur con avellanas"]
    },
    "Día 7": {
        "Desayuno": ["Cereales rellenos de Leche con Copos de Maiz", "Leche entera con cacao"],
        "Media mañana": ["Bocadillo de Jamón Serrano con Pan Integral"],
        "Almuerzo": ["Paella de pollo", "Ensalada Campesina", "Yogur con almendras"],
        "Merienda": ["Yogurt con fresas y cereales"],
        "Cena": ["Revuelto de Quinoa con Champiñones y Verdura", "Sopa de tomate", "Pieza de Fruta al gusto"]
    }
};

// Alternatives for each day and dish (manually extracted from the PDF layout list pages 5 to 11 to avoid regex errors)
const alternativesDatabase = {
    "Día 1": {
        "Desayuno": {
            "Cereales rellenos de Leche con Copos de Maiz": ["Zumo de albaricoque y pera", "Leche entera con azúcar", "Zumo de fruta con miel"],
            "Leche entera con cacao": ["Café con leche entera", "Leche descremada con cacao", "Leche descremada"]
        },
        "Media mañana": {
            "Bocadillo de Jamón Serrano con Pan Integral": ["Bocadillo integral de lomo a la plancha", "Bocadillo de lomo a la plancha", "Bocadillo de hamburguesa y queso cheddar"]
        },
        "Almuerzo": {
            "Pasta a la Boloñesa": ["Paella de pollo", "Habas tiernas con acelgas", "Arroz Chaufa"],
            "Gazpacho andaluz": ["Lenguado con zanahoria", "Pollo con sanfaina", "Pavo a la naranja"],
            "Yogur con nueces": ["Carpaccio de mango y aguacate", "Tarta Queso Burgos Natural", "Yogur Natural Desnatado"]
        },
        "Merienda": {
            "Cereales rellenos de Leche con Copos de Maiz": ["Crackers y jamón serrano", "Pan y sobrasada", "Tostadas int. Con jamón york"],
            "Leche entera con cacao": ["Yogur Natural Entero", "Yogur Bio Natural", "Yogur Natural Desnatado"]
        },
        "Cena": {
            "Crema de zanahorias": ["Patatas guisadas", "Puré de verduras", "Sopa vegetal de arroz"],
            "Salmón a la plancha": ["Solomillo de buey a la plancha", "Chuleta de cerdo a la parrilla", "Filete de buey a la plancha"],
            "Pieza de Fruta al gusto": ["Zumo de limón", "Fresas con zumo de limón", "Fresas"]
        }
    },
    "Día 2": {
        "Desayuno": {
            "Cereales rellenos de Leche con Copos de Maiz": ["Zumo de albaricoque y pera", "Leche entera con azúcar", "Zumo de fruta con miel"],
            "Leche entera con cacao": ["Café con leche entera", "Leche descremada con cacao", "Leche descremada"]
        },
        "Media mañana": {
            "Bocadillo de Lomo embuchado y queso": ["Bocadillo de hamburguesa y queso cheddar", "Bocadillo con hamburguesa", "Bocadillo de lomo a la plancha"]
        },
        "Almuerzo": {
            "Pisto con Patatas al Horno y Huevos": ["Verduras rehogadas con jamón", "Picadillo de patatas con atún, huevo y aceitunas", "Guisantes a la primavera"],
            "Salmón a la plancha": ["Solomillo de buey a la plancha", "Chuleta de cerdo a la parrilla", "Filete de buey a la plancha"],
            "Yogur con avellanas": ["Yogur Natural Desnatado", "Yogur Bio Natural", "Carpaccio de mango y aguacate"]
        },
        "Merienda": {
            "Weetabix cereales": ["Tostadas int. con miel", "Tostadas int. con mermelada", "Brioche"],
            "Leche entera con cacao": ["Yogur Natural Entero", "Yogur Bio Natural", "Yogur Natural Desnatado"]
        },
        "Cena": {
            "Salmorejo cordobés": ["Canelones de champiñones y espárragos", "Crema de espinacas", "Crema de apio y coliflor"],
            "Carne de Ternera Picada con Verdura y Nachos": ["Pollo con curry", "Callos", "Bistec de ternera con patata asada"],
            "Yogur con nueces": ["Carpaccio de mango y aguacate", "Tarta Queso Burgos Natural", "Yogur Natural Desnatado"]
        }
    },
    "Día 3": {
        "Desayuno": {
            "Cereales rellenos de Leche con Copos de Maiz": ["Zumo de albaricoque y pera", "Leche entera con azúcar", "Zumo de fruta con miel"],
            "Leche entera con cacao": ["Café con leche entera", "Leche descremada con cacao", "Leche descremada"]
        },
        "Media mañana": {
            "Bocadillo de tortilla francesa": ["Bocadillo integral de lomo a la plancha", "Bocadillo integral de Pepito de ternera", "Bocadillo de tortilla de patatas"]
        },
        "Almuerzo": {
            "Salmorejo cordobés": ["Canelones de champiñones y espárragos", "Crema de espinacas", "Crema de apio y coliflor"],
            "Carne de Ternera Picada con Verdura y Nachos": ["Pollo con curry", "Callos", "Bistec de ternera con patata asada"],
            "Yogur con almendras": ["Yogur Natural Desnatado", "Yogur Bio Natural", "Cuajada"]
        },
        "Merienda": {
            "Yogurt con fresas y cereales": ["Zumo de fruta", "Mandarinas", "Piña"]
        },
        "Cena": {
            "Ensalada de Pasta con Mozarella, brócoli y Cherrys": ["Lentejas estofadas", "Gazpachuelo", "Garbanzos, espinacas y huevo duro"],
            "Dorada a la parrilla": ["Salmonete a la plancha", "Tortilla de atún", "Bonito a la plancha"],
            "Yogur con avellanas": ["Yogur Natural Desnatado", "Yogur Bio Natural", "Carpaccio de mango y aguacate"]
        }
    },
    "Día 4": {
        "Desayuno": {
            "Cereales rellenos de Leche con Copos de Maiz": ["Zumo de albaricoque y pera", "Leche entera con azúcar", "Zumo de fruta con miel"],
            "Leche entera con cacao": ["Café con leche entera", "Leche descremada con cacao", "Leche descremada"]
        },
        "Media mañana": {
            "Bocadillo de Jamón Serrano con Pan Integral": ["Bocadillo integral de lomo a la plancha", "Bocadillo de lomo a la plancha", "Bocadillo de hamburguesa y queso cheddar"]
        },
        "Almuerzo": {
            "Espaguetis Con Guacamole y Pistachos": ["Empedrado de Garbanzos", "Garbanzos, espinacas y huevo duro", "Tortellini con champiñones"],
            "Pavo plancha": ["Pollo al limón", "Merluza molinera", "Parrillada de pescado"],
            "Pieza de Fruta al gusto": ["Zumo de limón", "Fresas con zumo de limón", "Fresas"]
        },
        "Merienda": {
            "Mezcla cereales avena y copos de maiz": ["Yogur de frutas", "Plátano maduro", "Plátanos"],
            "Leche entera con cacao": ["Yogur Natural Entero", "Yogur Bio Natural", "Yogur Natural Desnatado"]
        },
        "Cena": {
            "Ensalada de arroz y garbanzos": ["Sopa de arroz con verduras", "Patatas hervidas y acelgas", "Verduras a la jardinera"],
            "Pieza de Fruta al gusto": ["Zumo de limón", "Fresas con zumo de limón", "Fresas"]
        }
    },
    "Día 5": {
        "Desayuno": {
            "Cereales rellenos de Leche con Copos de Maiz": ["Zumo de albaricoque y pera", "Leche entera con azúcar", "Zumo de fruta con miel"],
            "Leche entera con cacao": ["Café con leche entera", "Leche descremada con cacao", "Leche descremada"]
        },
        "Media mañana": {
            "Bocadillo de Lomo embuchado y queso": ["Bocadillo de hamburguesa y queso cheddar", "Bocadillo con hamburguesa", "Bocadillo de lomo a la plancha"]
        },
        "Almuerzo": {
            "Fajitas de Pollo": ["Picadillo de patatas con huevo y pollo picado", "Guisantes con sepia", "Paella de pollo"],
            "Salmorejo cordobés": ["Lenguado a la naranja", "Conejo estofado", "Tortilla jardinera"],
            "Yogur con nueces": ["Carpaccio de mango y aguacate", "Tarta Queso Burgos Natural", "Yogur Natural Desnatado"]
        },
        "Merienda": {
            "Cereales rellenos de Leche con Copos de Maiz": ["Crackers y jamón serrano", "Pan y sobrasada", "Tostadas int. Con jamón york"],
            "Leche entera con cacao": ["Yogur Natural Entero", "Yogur Bio Natural", "Yogur Natural Desnatado"]
        },
        "Cena": {
            "Ensalada de arroz integral con manzana y pavo": ["Paella de pollo", "Habas tiernas con acelgas", "Arroz Chaufa"],
            "Huevo a la plancha": ["Dorada al limón", "Escalopas de cerdo", "Merluza al perejil"],
            "Yogur con nueces": ["Carpaccio de mango y aguacate", "Tarta Queso Burgos Natural", "Yogur Natural Desnatado"]
        }
    },
    "Día 6": {
        "Desayuno": {
            "Bocadillo de tortilla francesa": ["Zumo de albaricoque y pera", "Leche entera con azúcar", "Leche entera con cacao"],
            "Bebida de coco": ["Café con leche entera", "Leche entera", "Leche entera con miel"]
        },
        "Media mañana": {
            "Bocadillo de tortilla francesa": ["Bocadillo integral de lomo a la plancha", "Bocadillo integral de Pepito de ternera", "Bocadillo de tortilla de patatas"]
        },
        "Almuerzo": {
            "Risotto de Champiñones con Pollo": ["Guisantes estofados", "Guisantes hervidos", "Judías verdes con patatas y atún"],
            "Salmorejo cordobés": ["Lenguado a la naranja", "Conejo estofado", "Tortilla jardinera"],
            "Yogur con avellanas": ["Yogur Natural Desnatado", "Yogur Bio Natural", "Carpaccio de mango y aguacate"]
        },
        "Merienda": {
            "Weetabix cereales": ["Tostadas int. con miel", "Tostadas int. con mermelada", "Brioche"],
            "Leche entera con cacao": ["Yogur Natural Entero", "Yogur Bio Natural", "Yogur Natural Desnatado"]
        },
        "Cena": {
            "Crema de calabacín": ["Guisantes salteados con zanahorias", "Pastel de patata y calabacín", "Ensalada de coliflor"],
            "Carne de Ternera Picada con Verdura y Nachos": ["Pollo con curry", "Callos", "Bistec de ternera con patata asada"],
            "Yogur con avellanas": ["Yogur Natural Desnatado", "Yogur Bio Natural", "Carpaccio de mango y aguacate"]
        }
    },
    "Día 7": {
        "Desayuno": {
            "Cereales rellenos de Leche con Copos de Maiz": ["Zumo de albaricoque y pera", "Leche entera con azúcar", "Zumo de fruta con miel"],
            "Leche entera con cacao": ["Café con leche entera", "Leche descremada con cacao", "Leche descremada"]
        },
        "Media mañana": {
            "Bocadillo de Jamón Serrano con Pan Integral": ["Bocadillo integral de lomo a la plancha", "Bocadillo de lomo a la plancha", "Bocadillo de hamburguesa y queso cheddar"]
        },
        "Almuerzo": {
            "Paella de pollo": ["Guisantes hervidos", "Alcachofas y patatas salteadas con jamón", "Guisantes estofados"],
            "Ensalada Campesina": ["Callos a la riojana", "Lenguado con zanahoria", "Pollo con sanfaina"],
            "Yogur con almendras": ["Yogur Natural Desnatado", "Yogur Bio Natural", "Cuajada"]
        },
        "Merienda": {
            "Yogurt con fresas y cereales": ["Zumo de fruta", "Mandarinas", "Piña"]
        },
        "Cena": {
            "Revuelto de Quinoa con Champiñones y Verdura": ["Tortellini pomo doro", "Paella vegetal", "Arroz con almejas"],
            "Sopa de tomate": ["Carne de cerdo guisada", "Pavo a la naranja", "Albóndigas de pollo con hierbas"],
            "Pieza de Fruta al gusto": ["Zumo de limón", "Fresas con zumo de limón", "Fresas"]
        }
    }
};

// Nutritional information (totals per day and macros where specified in planning)
// Day 1 has total kcal values for meals:
// Desayuno: 653 kcal (macros can be parsed from page 12)
// Media mañana: 543 kcal
// Almuerzo: 888 kcal
// Merienda: 316 kcal
// Cena: 444 kcal
// We can extract this from plainText!
const nutrientsDatabase = {};
// Let's parse all lines containing "Nutrientes:" in plainText
const nutrientsLines = plainText.match(/Nutrientes:.*?\n/g) || [];
for (const line of nutrientsLines) {
    // Look at this line, e.g. "Nutrientes: 653 kcal (23%), 21 g de Prót. (12%), 94 g de Glú. (30%), 21 g de Lip. (23%)."
    // Let's clean and match numbers
    const cleanLine = cleanText(line);
    const kcalMatch = cleanLine.match(/(\d+)\s*kcal/i);
    const protMatch = cleanLine.match(/(\d+)\s*g\s*de\s*Pr[óo]t/i);
    const carbMatch = cleanLine.match(/(\d+)\s*g\s*de\s*Gl[úu]/i);
    const fatMatch = cleanLine.match(/(\d+)\s*g\s*de\s*Lip/i);
    
    // We can associate this with the page it came from.
    // Instead of parsing dynamically, let's hardcode the daily meal nutrients which are fixed in the PDF:
}

// Complete compiled JSON structure
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
                
                // Get nutritional values for specific meal of specific day from the PDF:
                let nutrients = null;
                if (d === 1 && meal === "Desayuno") nutrients = { kcal: 653, protein: "21g", carbs: "94g", fat: "21g" };
                if (d === 1 && meal === "Media mañana") nutrients = { kcal: 543, protein: "30g", carbs: "65g", fat: "16g" };
                if (d === 1 && meal === "Almuerzo") nutrients = { kcal: 888, protein: "57g", carbs: "90g", fat: "27g" };
                if (d === 1 && meal === "Merienda") nutrients = { kcal: 316, protein: "12g", carbs: "39g", fat: "12g" };
                if (d === 1 && meal === "Cena") nutrients = { kcal: 444, protein: "56g", carbs: "23g", fat: "13g" };
                
                if (d === 2 && meal === "Desayuno") nutrients = { kcal: 653, protein: "21g", carbs: "94g", fat: "21g" };
                if (d === 2 && meal === "Media mañana") nutrients = { kcal: 305, protein: "25g", carbs: "35g", fat: "7g" };
                if (d === 2 && meal === "Almuerzo") nutrients = { kcal: 714, protein: "58g", carbs: "54g", fat: "30g" };
                if (d === 2 && meal === "Merienda") nutrients = { kcal: 408, protein: "16g", carbs: "61g", fat: "9g" };
                if (d === 2 && meal === "Cena") nutrients = { kcal: 828, protein: "48g", carbs: "75g", fat: "34g" };

                if (d === 3 && meal === "Desayuno") nutrients = { kcal: 653, protein: "21g", carbs: "94g", fat: "21g" };
                if (d === 3 && meal === "Media mañana") nutrients = { kcal: 366, protein: "18g", carbs: "52g", fat: "10g" };
                if (d === 3 && meal === "Almuerzo") nutrients = { kcal: 763, protein: "48g", carbs: "75g", fat: "26g" };
                if (d === 3 && meal === "Merienda") nutrients = { kcal: 194, protein: "8g", carbs: "39g", fat: "1g" };
                if (d === 3 && meal === "Cena") nutrients = { kcal: 1127, protein: "79g", carbs: "97g", fat: "46g" };

                if (d === 4 && meal === "Desayuno") nutrients = { kcal: 653, protein: "24g", carbs: "94g", fat: "21g" };
                if (d === 4 && meal === "Media mañana") nutrients = { kcal: 543, protein: "30g", carbs: "65g", fat: "16g" };
                if (d === 4 && meal === "Almuerzo") nutrients = { kcal: 759, protein: "66g", carbs: "73g", fat: "23g" };
                if (d === 4 && meal === "Merienda") nutrients = { kcal: 308, protein: "13g", carbs: "37g", fat: "11g" };
                if (d === 4 && meal === "Cena") nutrients = { kcal: 405, protein: "12g", carbs: "60g", fat: "13g" };

                if (d === 5 && meal === "Desayuno") nutrients = { kcal: 653, protein: "21g", carbs: "94g", fat: "21g" };
                if (d === 5 && meal === "Media mañana") nutrients = { kcal: 305, protein: "25g", carbs: "35g", fat: "7g" };
                if (d === 5 && meal === "Almuerzo") nutrients = { kcal: 799, protein: "65g", carbs: "67g", fat: "32g" };
                if (d === 5 && meal === "Merienda") nutrients = { kcal: 316, protein: "12g", carbs: "39g", fat: "12g" };
                if (d === 5 && meal === "Cena") nutrients = { kcal: 722, protein: "51g", carbs: "47g", fat: "37g" };

                if (d === 6 && meal === "Desayuno") nutrients = { kcal: 768, protein: "21g", carbs: "56g", fat: "52g" };
                if (d === 6 && meal === "Media mañana") nutrients = { kcal: 366, protein: "18g", carbs: "52g", fat: "10g" };
                if (d === 6 && meal === "Almuerzo") nutrients = { kcal: 707, protein: "43g", carbs: "83g", fat: "23g" };
                if (d === 6 && meal === "Merienda") nutrients = { kcal: 408, protein: "16g", carbs: "61g", fat: "9g" };
                if (d === 6 && meal === "Cena") nutrients = { kcal: 753, protein: "48g", carbs: "76g", fat: "25g" };

                if (d === 7 && meal === "Desayuno") nutrients = { kcal: 653, protein: "21g", carbs: "94g", fat: "21g" };
                if (d === 7 && meal === "Media mañana") nutrients = { kcal: 543, protein: "30g", carbs: "65g", fat: "16g" };
                if (d === 7 && meal === "Almuerzo") nutrients = { kcal: 502, protein: "35g", carbs: "48g", fat: "20g" };
                if (d === 7 && meal === "Merienda") nutrients = { kcal: 194, protein: "8g", carbs: "39g", fat: "1g" };
                if (d === 7 && meal === "Cena") nutrients = { kcal: 571, protein: "23g", carbs: "90g", fat: "12g" };

                return {
                    name: dishName,
                    ingredients: details.ingredients,
                    elaboration: details.elaboration,
                    nutrients: nutrients
                };
            }),
            alternatives: dayAlternatives[meal] ? Object.values(dayAlternatives[meal]).flat() : []
        };
    }
    compiledData.push(dayEntry);
}

// Write the compiled JSON
const outputDir = '/home/alvaro/AndroidStudioProjects/quecomemos/app/src/main/assets';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
const outputPath = path.join(outputDir, 'diet_data.json');
fs.writeFileSync(outputPath, JSON.stringify(compiledData, null, 4));
fs.writeFileSync('/home/alvaro/AndroidStudioProjects/quecomemos/scratch_pdf/diet_data.json', JSON.stringify(compiledData, null, 4));
console.log('Successfully compiled JSON data to', outputPath);
