const fs = require('fs');

// Old dishes from compile_json.js
const oldDishes = [
    "Cereales rellenos de Leche con Copos de Maiz",
    "Leche entera con cacao",
    "Bocadillo de Jamón Serrano con Pan Integral",
    "Pasta a la Boloñesa",
    "Gazpacho andaluz",
    "Yogur con nueces",
    "Crema de zanahorias",
    "Salmón a la plancha",
    "Pieza de Fruta al gusto",
    "Bocadillo de Lomo embuchado y queso",
    "Pisto con Patatas al Horno y Huevos",
    "Yogur con avellanas",
    "Weetabix cereales",
    "Salmorejo cordobés",
    "Carne de Ternera Picada con Verdura y Nachos",
    "Bocadillo de tortilla francesa",
    "Yogur con almendras",
    "Yogurt con fresas y cereales",
    "Ensalada de Pasta con Mozarella, brócoli y Cherrys",
    "Dorada a la parrilla",
    "Espaguetis Con Guacamole y Pistachos",
    "Pavo plancha",
    "Mezcla cereales avena y copos de maiz",
    "Ensalada de arroz y garbanzos",
    "Fajitas de Pollo",
    "Ensalada de arroz integral con manzana y pavo",
    "Huevo a la plancha",
    "Bebida de coco",
    "Risotto de Champiñones con Pollo",
    "Crema de calabacín",
    "Paella de pollo",
    "Ensalada Campesina",
    "Revuelto de Quinoa con Champiñones y Verdura",
    "Sopa de tomate"
];

// Unique dishes from get_daily_menus.js run output
const newDishes = [
  'Cereales rellenos de Leche con Copos de Maiz',
  'Ensalada de Pasta de Lentejas con Mozzarella',
  'Secreto iberico Hacendado',
  'Gazpacho andaluz',
  'Salmón a la plancha',
  'Pieza de Fruta al gusto',
  'Contramuslos de Pollo al Horno con Patatas',
  'Ensalada mixta tipo I',
  'Weetabix cereales',
  'Salmorejo cordobés',
  'Entrecote a la plancha',
  'Yogur con nueces',
  'Ensalada de Patatas con Hortalizas y pollo',
  'Yogur con almendras',
  'Yogurt con fresas y cereales',
  'Ensalada de arroz integral con manzana y pavo',
  'Carne de ternera picada',
  'Espaguetis Con Guacamole y Pistachos',
  'Pavo plancha',
  'Mezcla cereales avena y copos de maiz',
  'Tabulé de Verduras',
  'Garbanzos de Bote salteados con Huevo y Cebolla con Aguacate',
  'Leche entera con cacao',
  'Huevo a la plancha',
  'Bocadillo de tortilla francesa',
  'Bebida de coco',
  'Pasta integral con tiras de pollo,queso feta y cherrys',
  'Ensalada de Pasta con Mozarella, Huevo Duro y Cherrys',
  'Paella de pollo',
  'Ensalada de Canónigos, Melva, Cherrys y Perlas de Mozarella',
  'Pisto con Patatas al Horno y Huevos'
];

const newOnly = newDishes.filter(d => !oldDishes.includes(d));
console.log('--- Brand New Dishes ---');
console.log(newOnly);
