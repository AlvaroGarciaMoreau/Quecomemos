# Quecomemos 🍳🥗

**Quecomemos** es una aplicación nativa para Android diseñada para facilitar el seguimiento de dietas personalizadas (como las elaboradas por nutricionistas). A partir del documento PDF original de la dieta, el proyecto utiliza herramientas para digitalizar, estructurar y cargar los menús diarios, recetas e ingredientes en la aplicación. 

Con **Quecomemos**, tendrás siempre a mano el menú semanal, los macronutrientes de cada comida, las recetas paso a paso y una lista de la compra automatizada con persistencia de estado.

---

## ✨ Características Principales

### 📱 Aplicación Android (Nativa - Kotlin)
*   **🗓️ Vista Semanal Interactiva:** Selector de días (Día 1 a Día 7) para navegar cómodamente por la planificación semanal de la dieta.
*   **🍽️ Distribución Diaria Completa:** Organización por comidas clave: *Desayuno, Media mañana, Almuerzo, Merienda y Cena*.
*   **📖 Detalle de Recetas & Elaboración:** Al pulsar en cualquier comida, se despliega un panel inferior (*BottomSheet*) con:
    *   **Ingredientes interactivos:** Lista con casillas de verificación (*Checkboxes*) para marcar lo que ya tienes o lo que has preparado.
    *   **Elaboración:** Instrucciones detalladas de preparación del plato.
    *   **Macronutrientes:** Resumen nutricional específico (Kcal, proteínas, carbohidratos, grasas).
    *   **Alternativas de plato:** Sugerencias y variaciones si no te apetece o no dispones del plato principal.
*   **🛒 Lista de la Compra Inteligente:**
    *   Agrupación automática por categorías de alimentos (Lácteos, Verduras, Carnes, etc.).
    *   **Persistencia:** El estado de los artículos comprados se guarda automáticamente en el dispositivo (utilizando `SharedPreferences`), para que no pierdas tu progreso al cerrar la app.
    *   **Reinicio rápido:** Botón para vaciar y restablecer la lista al empezar un nuevo ciclo de dieta.

---

## 🛠️ Procesamiento y Extracción de Datos (`scratch_pdf/`)

Para no tener que transcribir los extensos PDF de los nutricionistas a mano, el proyecto incluye un flujo de trabajo optimizado en Node.js para digitalizar y compilar los datos:

1.  **OCR con Tesseract.js (`ocr_all.js`):** Escanea las imágenes de las páginas del PDF (páginas 12 a 30) usando reconocimiento óptico de caracteres con el modelo en español (`spa.traineddata`) para volcar el texto bruto.
2.  **Compilador de Dieta (`compile_json.js`):** Toma las transcripciones de texto, las asocia con una base de datos local de recetas, ingredientes, macronutrientes y alternativas, y exporta dos archivos estructurados directamente a los recursos de la aplicación:
    *   `diet_data.json`
    *   `shopping_list.json`

---

## 📂 Estructura del Proyecto

A continuación se detalla la arquitectura de directorios del repositorio:

```text
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── assets/                 # Archivos de datos generados (diet_data.json y shopping_list.json)
│   │   │   ├── java/com/moreausoft/quecomemos/
│   │   │   │   ├── data/
│   │   │   │   │   ├── DietModel.kt      # Modelos de datos (DietDay, DietMeal, DietDish, ShoppingCategory)
│   │   │   │   │   └── DietRepository.kt # Carga de datos desde Assets de la App
│   │   │   │   ├── ui/
│   │   │   │   │   └── DietViewModel.kt  # Gestión de estados (día activo, lista de la compra)
│   │   │   │   ├── MainActivity.kt       # Pantalla principal e interacciones de interfaz (Dieta y Compra)
│   │   │   │   └── SplashActivity.kt     # Pantalla de bienvenida
│   │   │   └── res/                      # Diseños XML (layouts), recursos de diseño, colores y estilos
│   │   └── build.gradle.kts              # Configuración y dependencias del módulo app
│   └── build.gradle.kts                  # Configuración de compilación global
├── scratch_pdf/                          # Herramientas de extracción y compilación
│   ├── ocr_all.js                        # Script de extracción de texto mediante OCR
│   ├── compile_json.js                   # Compilador de texto estructurado a archivos JSON
│   ├── package.json                      # Dependencias de node (tesseract.js)
│   └── (imágenes y archivos auxiliares de procesamiento)
├── spa.traineddata                       # Datos de idioma español para Tesseract OCR
└── settings.gradle.kts                   # Configuración del proyecto Gradle
```

---

## 🚀 Requisitos e Instalación

### 📱 Para compilar y ejecutar la App Android
*   **Android SDK:** Target SDK 36 (Android 14/15 compatible).
*   **Mínimo SDK:** SDK 34 (Android 14).
*   **Gradle:** Soporte para Gradle Kotlin DSL.
*   **Kotlin:** Versión de Kotlin configurada en las dependencias oficiales del proyecto.

#### Pasos para compilar:
1. Abre el proyecto en **Android Studio**.
2. Deja que Gradle sincronice las dependencias.
3. Conecta tu dispositivo Android (o emulador) y pulsa en **Run / Ejecutar**.
4. Alternativamente, puedes compilar desde la terminal:
   ```bash
   ./gradlew assembleDebug
   ```

---

### ⚙️ Para el procesamiento de PDFs y Datos (`scratch_pdf`)
Si deseas procesar tu propia dieta en PDF:
1. Asegúrate de tener **Node.js** instalado en tu sistema.
2. Instala las dependencias necesarias en la carpeta `scratch_pdf/`:
   ```bash
   cd scratch_pdf
   npm install
   ```
3. Coloca las páginas de tu PDF convertidas a imagen en el directorio `scratch_pdf/` con el formato `page-XX.png`.
4. Ejecuta el script de OCR:
   ```bash
   node ocr_all.js
   ```
5. Revisa y compila los resultados en formato JSON para la aplicación móvil:
   ```bash
   node compile_json.js
   ```

*(Nota: Los archivos resultantes se copiarán automáticamente a los assets del proyecto Android `app/src/main/assets/`)*.

---

## 🎨 Tecnologías y Librerías Utilizadas

*   **Kotlin & Android SDK:** Para todo el desarrollo nativo móvil.
*   **Material Design 3:** Tarjetas interactivas (`MaterialCardView`), botones y hojas inferiores dinámicas (`BottomSheetDialog`).
*   **Architecture Components (MVVM):** `ViewModel` y `LiveData` para una correcta separación de la lógica de negocio y UI reactiva.
*   **SharedPreferences:** Para almacenar de manera persistente las selecciones de la lista de la compra del usuario de forma local y ligera.
*   **Node.js & Tesseract.js:** Para automatizar el procesamiento digital de la dieta directamente desde la máquina local.

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia que elijas para tu repositorio de GitHub. 

---
*¡Llevar el control de tu dieta y organizar tu lista de la compra nunca había sido tan fácil!* 🍉🥦🥩
