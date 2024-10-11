# Proyecto: Discoverify

### Plataforma para descubrir, reseñar y calificar álbumes de música.
### *Aplicación desarrollada para asignatura Prog. App. Móviles - 2024-02*

---

## Índice

1. [Descripción](#descripción)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Instalación](#instalación)
4. [Funcionalidades Principales](#funcionalidades-principales)
5. [Plugins Nativos Utilizados](#plugins-nativos-utilizados)
6. [Notas Adicionales](#notas-adicionales)

---

## Descripción

**Discoverify** es una aplicación construida con **Angular** que permite a los usuarios explorar una vasta colección de álbumes musicales a través de un *infinite scroll*. Además, los usuarios pueden contribuir subiendo nuevos álbumes, reseñar sus favoritos y calificarlos.

---

## Tecnologías Utilizadas

- **Angular**: Framework para desarrollar aplicaciones web dinámicas.
- **Capacitor**: Integra funcionalidades nativas para mejorar la experiencia móvil.
- **TypeScript**, **HTML**, **SCSS**, **JavaScript**: Tecnologías empleadas para el desarrollo frontend.

---

## Instalación

Para configurar y ejecutar:

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/BNegro1/Discoverify.git
   ```

2. **Instalar dependencias**:
   ```bash
   cd discoverify/src
   npm install
   ```

3. **Verificar dependencias instaladas**:
   ```bash
   npm list --depth=0
   ```

4. **Iniciar la aplicación en modo desarrollo**:
   ```bash
   ionic serve
   ```
---

## Funcionalidades Principales

1. **Explorar Álbumes**  
   Los álbumes se cargan automáticamente con *infinite scroll*. Cada tarjeta de álbum muestra:
   - Portada
   - Título del álbum y nombre del artista
   - Fecha de lanzamiento

2. **Aportes de Usuarios**  
   Los usuarios pueden subir álbumes mediante un formulario, proporcionando:
   - Nombre del álbum, artista, fecha de lanzamiento y género
   - Subir una imagen desde la galería del dispositivo

---

## Plugins Nativos Utilizados

1. **Capacitor Storage**  
   Almacena los álbumes favoritos y reseñas localmente, permitiendo acceso sin conexión.

2. **Capacitor Camera**  
   Permite seleccionar imágenes de la galería para los aportes de álbumes.

---

## Notas Adicionales

1. **Recordar siempre verificar e instalar dependencias dentro de**: `discoverify/src`
2. **Recomendado**: Angular Snippets (https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2)
3. **Ver dependencias**:
   ```bash
   npm list --depth=0
   ```

# Estar pendiente del archivo "dependencias.txt"!!!
