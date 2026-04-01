/* ================================================================
   MIRADITAS — SCRIPT.JS  (versión frontend + Google Sheets)
   ================================================================

   📌 GUÍA RÁPIDA — QUÉ Y DÓNDE CAMBIAR:

   🔧 Número de WhatsApp  → const WSP_NUMERO       (línea ~35)
   🔧 URL Google Sheets   → const SHEETS_URL        (línea ~42)
   🔧 Servicios           → array SERVICIOS[]       (línea ~55)
   🔧 Profesionales       → array EQUIPO[]          (línea ~130)
   🔧 Horarios            → array HORARIOS[]        (línea ~180)
   🔧 Opiniones           → array OPINIONES[]       (línea ~195)

   ================================================================
   TABLA DE CONTENIDO:
   01. Configuración global (editable)
   02. Integración Google Sheets (leer/guardar citas)
   03. Utilidades generales
   04. Renderizar — Servicios
   05. Renderizar — Galería
   06. Renderizar — Equipo (carrusel)
   07. Formulario de agenda (validación + Sheets + WhatsApp + Calendar)
   08. Renderizar — Opiniones
   09. Navegación y eventos de UI
   10. Inicialización
   ================================================================ */


/* ================================================================
   01. CONFIGURACIÓN GLOBAL — EDITABLE
   ================================================================ */

/**
 * 🔧 NÚMERO DE WHATSAPP
 * Solo dígitos, con código de país (57 = Colombia).
 * Ejemplo: '573117159917' → +57 311 715 9917
 */
const WSP_NUMERO = '573117159917';

/**
 * 🔧 URL DEL WEB APP DE GOOGLE APPS SCRIPT
 * Después de desplegar tu Apps Script, pega aquí la URL que te entrega.
 * Tiene este formato:
 *   https://script.google.com/macros/s/XXXXXXXXXX/exec
 *
 * ⚠️ IMPORTANTE: Mientras no pegues una URL real aquí, el formulario
 *    funciona igual pero NO verifica horarios ocupados ni guarda en Sheets.
 *    Las instrucciones para obtener esta URL están al final de este archivo.
 */
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxefKKFfbs-dmwZ4GQYWk8F6srRyepTqVtilFNdHgzbAC8CCcLBKb6OJwWqFEpTSULtxA/exec';

/**
 * 🔧 SERVICIOS
 * Campos: nombre, desc, precio (en COP), emoji, categoria, imagenes[].
 *
 * 📸 GALERÍA DE FOTOS:
 *    1. Crea una carpeta 'galeria/[servicio]/' junto a index.html.
 *    2. Pon tus fotos allí (ej: galeria/lashes/foto1.jpg).
 *    3. Actualiza el array 'imagenes' de cada servicio con esas rutas.
 *    Si la imagen no existe, se muestra un placeholder automático.
 */
const SERVICIOS = [
  // ── BROWS ──────────────────────────────────────────────────────
  {
    nombre: 'Depilación con cera',
    desc: 'un método muy efectivo para lograr una piel suave durante semanas.',
    emoji: '👁️',
    categoria: 'Lashes',
    imagenes: [
      'galeria/diseno_depilacion_cejas/foto1.jpg',
      'galeria/diseno_depilacion_cejas/foto2.jpg',
      'galeria/diseno_depilacion_cejas/foto3.jpg',
      'galeria/diseno_depilacion_cejas/foto4.jpg'
    ]
  },
  {
    nombre: 'Depilación bozo',
    desc: 'elimina el vello de raíz, retrasando el crecimiento del mismo y debilitándolo a lo largo del tiempo.',
    emoji: '👁️',
    categoria: 'Lashes',
    imagenes: [
      'galeria/diseno_depilacion_cejas/foto1.jpg',
      'galeria/diseno_depilacion_cejas/foto2.jpg',
      'galeria/diseno_depilacion_cejas/foto3.jpg',
      'galeria/diseno_depilacion_cejas/foto4.jpg'
    ]
  },
  
  {
    nombre: 'Diseño y Depilación de Cejas',
    desc: 'Perfilado y depilación para definir la forma natural de tus cejas.',
    emoji: '✨',
    categoria: 'Brows',
    imagenes: [
      'galeria/diseno_depilacion_cejas/foto1.jpg',
      'galeria/diseno_depilacion_cejas/foto2.jpg',
      'galeria/diseno_depilacion_cejas/foto3.jpg',
      'galeria/diseno_depilacion_cejas/foto4.jpg'
    ]
  },
  {
    nombre: 'Diseño, Depilación y Henna',
    desc: 'Perfilado de cejas con depilación y aplicación de henna para mayor definición.',
    emoji: '✨',
    categoria: 'Brows',
    imagenes: [
      'galeria/diseno_depilacion_henna/foto1.jpg',
      'galeria/diseno_depilacion_henna/foto2.jpg',
      'galeria/diseno_depilacion_henna/foto3.jpg',
      'galeria/diseno_depilacion_henna/foto4.jpg'
    ]
  },
  {
    nombre: 'Laminado de Cejas',
    desc: 'Tratamiento que fija y define las cejas dándoles forma y volumen duradero.',
    emoji: '✨',
    categoria: 'Brows',
    imagenes: [
      'galeria/laminado_cejas/foto1.jpg',
      'galeria/laminado_cejas/foto2.jpg',
      'galeria/laminado_cejas/foto3.jpg',
      'galeria/laminado_cejas/foto4.jpg'
    ]
  },
  {
    nombre: 'Micropigmentación',
    desc: 'Técnica semipermanente que rellena y define las cejas con pigmento natural.',
    emoji: '✨',
    categoria: 'Brows',
    imagenes: [
      'galeria/micropigmentacion/foto1.jpg',
      'galeria/micropigmentacion/foto2.jpg',
      'galeria/micropigmentacion/foto3.jpg',
      'galeria/micropigmentacion/foto4.jpg'
    ]
  },

  // ── LASHES ─────────────────────────────────────────────────────
  
  {
    nombre: 'Lifting de Pestañas',
    desc: 'Riza y levanta las pestañas naturales desde la raíz para una mirada abierta y definida.',
    emoji: '👁️',
    categoria: 'Lashes',
    imagenes: [
      'galeria/lifting_pestanas/foto1.jpg',
      'galeria/lifting_pestanas/foto2.jpg',
      'galeria/lifting_pestanas/foto3.jpg',
      'galeria/lifting_pestanas/foto4.jpg'
    ]
  },
  {
    nombre: 'Retoque de Pestañas',
    desc: 'Mantenimiento de extensiones para conservar su volumen y forma.',
    emoji: '👁️',
    categoria: 'Lashes',
    imagenes: [
      'galeria/retoque_pestanas/foto1.jpg',
      'galeria/retoque_pestanas/foto2.jpg',
      'galeria/retoque_pestanas/foto3.jpg',
      'galeria/retoque_pestanas/foto4.jpg'
    ]
  },
  {
    nombre: 'Pestañas Efecto Natural',
    desc: 'Extensiones ligeras que realzan la mirada con un acabado natural.',
    emoji: '👁️',
    categoria: 'Lashes',
    imagenes: [
      'galeria/pestanas_efecto_natural/foto1.jpg',
      'galeria/pestanas_efecto_natural/foto2.jpg',
      'galeria/pestanas_efecto_natural/foto3.jpg',
      'galeria/pestanas_efecto_natural/foto4.jpg'
    ]
  },
  
  {
    nombre: 'Pestañas Efecto Semi Natural',
    desc: 'Extensiones de densidad media para un look elegante entre lo natural y el glamour.',
    emoji: '👁️',
    categoria: 'Lashes',
    imagenes: [
      'galeria/pestanas_efecto_semi_natural/foto1.jpg',
      'galeria/pestanas_efecto_semi_natural/foto2.jpg',
      'galeria/pestanas_efecto_semi_natural/foto3.jpg',
      'galeria/pestanas_efecto_semi_natural/foto4.jpg'
    ]
  },
  {
    nombre: 'Pestañas Volumen Ruso',
    desc: 'Técnica de mega volumen con abanicos de pestañas ultrafinas para una mirada impactante.',
    emoji: '👁️',
    categoria: 'Lashes',
    imagenes: [
      'galeria/pestanas_volumen_ruso/foto1.jpg',
      'galeria/pestanas_volumen_ruso/foto2.jpg',
      'galeria/pestanas_volumen_ruso/foto3.jpg',
      'galeria/pestanas_volumen_ruso/foto4.jpg'
    ]
  },
 

  // ── NAILS ──────────────────────────────────────────────────────
  {
    nombre: 'Uñas Tradicionales',
    desc: 'Servicio de manicure tradicional con esmalte clásico y acabado profesional.',
    emoji: '💅',
    categoria: 'Nails',
    imagenes: [
      'galeria/unas_tradicionales/foto1.jpeg',
      'galeria/unas_tradicionales/foto2.jpeg',
      'galeria/unas_tradicionales/foto3.jpeg',
      'galeria/unas_tradicionales/foto4.jpeg'
    ]
  },
  {
    nombre: 'Uñas Semipermanente',
    desc: 'Manicure con esmalte semipermanente de larga duración y acabado profesional.',
    emoji: '💅',
    categoria: 'Nails',
    imagenes: [
      'galeria/unas_semipermanente/foto1.jpeg',
      'galeria/unas_semipermanente/foto2.jpeg',
      'galeria/unas_semipermanente/foto3.jpeg',
      'galeria/unas_semipermanente/foto4.jpeg'
    ]
  },
  {
    nombre: 'Uñas Semipermanente Rubber',
    desc: 'Semipermanente con base rubber de efecto goma para mayor adherencia y durabilidad.',
    emoji: '💅',
    categoria: 'Nails',
    imagenes: [
      'galeria/unas_semipermanente_rubber/foto1.jpg',
      'galeria/unas_semipermanente_rubber/foto2.jpg',
      'galeria/unas_semipermanente_rubber/foto3.jpg',
      'galeria/unas_semipermanente_rubber/foto4.jpg'
    ]
  },
  {
    nombre: 'Uñas Poligel',
    desc: 'Extensión y diseño de uñas con poligel para mayor resistencia y durabilidad.',
    emoji: '💅',
    categoria: 'Nails',
    imagenes: [
      'galeria/unas_poligel/foto1.jpeg',
      'galeria/unas_poligel/foto2.jpeg',
      'galeria/unas_poligel/foto3.jpeg',
      'galeria/unas_poligel/foto4.jpeg'
    ]
  },
  {
    nombre: 'Uñas Press On',
    desc: 'Uñas postizas personalizadas de aplicación rápida y sin daño en la uña natural.',
    emoji: '💅',
    categoria: 'Nails',
    imagenes: [
      'galeria/unas_press_on/foto1.jpg',
      'galeria/unas_press_on/foto2.jpeg',
      'galeria/unas_press_on/foto3.jpeg',
      'galeria/unas_press_on/foto4.jpeg'
    ]
  },
  {
    nombre: 'Uñas Acrílicas',
    desc: 'Extensión de uñas con acrílico de alta resistencia para mayor durabilidad y diseños impactantes.',
    emoji: '💅',
    categoria: 'Nails',
    imagenes: [
      'galeria/unas_acrilicas/foto1.jpeg',
      'galeria/unas_acrilicas/foto2.jpeg',
      'galeria/unas_acrilicas/foto3.jpeg',
      'galeria/unas_acrilicas/foto4.jpeg'
    ]
  },
  {
    nombre: 'Diseño Press On',
    desc: 'Diseño y fabricación de uñas press on personalizadas con acabados únicos.',
    emoji: '💅',
    categoria: 'Nails',
    imagenes: [
      'galeria/diseno_press_on/foto1.jpg',
      'galeria/diseno_press_on/foto2.jpg',
      'galeria/diseno_press_on/foto3.jpg',
      'galeria/diseno_press_on/foto4.jpg'
    ]
  },
  {
    nombre: 'Diseño Poligel',
    desc: 'Diseño artístico sobre extensiones de poligel con los acabados más creativos.',
    emoji: '💅',
    categoria: 'Nails',
    imagenes: [
      'galeria/diseno_poligel/foto1.jpg',
      'galeria/diseno_poligel/foto2.jpg',
      'galeria/diseno_poligel/foto3.jpg',
      'galeria/diseno_poligel/foto4.jpg'
    ]
  },
  {
    nombre: 'Retiro Semipermanente',
    desc: 'Retiro seguro de esmalte semipermanente sin dañar la uña natural.',
    emoji: '💅',
    categoria: 'Nails',
    imagenes: [
      'galeria/retiro_semipermanente/foto1.jpg',
      'galeria/retiro_semipermanente/foto2.jpg',
      'galeria/retiro_semipermanente/foto3.jpg',
      'galeria/retiro_semipermanente/foto4.jpg'
    ]
  },
  {
    nombre: 'Retiro Press On',
    desc: 'Retiro profesional y seguro de uñas press on sin dañar la uña natural.',
    emoji: '💅',
    categoria: 'Nails',
    imagenes: [
      'galeria/retiro_press_on/foto1.jpg',
      'galeria/retiro_press_on/foto2.jpg',
      'galeria/retiro_press_on/foto3.jpg',
      'galeria/retiro_press_on/foto4.jpg'
    ]
  },

  // ── PIES ───────────────────────────────────────────────────────
  {
    nombre: 'Pedicura Tradicional',
    desc: 'Limpieza, corte y limado de uñas de los pies con acabado en esmalte clásico.',
    emoji: '🦶',
    categoria: 'Pies',
    imagenes: [
      'galeria/pedicura_tradicional/foto1.jpg',
      'galeria/pedicura_tradicional/foto2.jpg',
      'galeria/pedicura_tradicional/foto3.jpg',
      'galeria/pedicura_tradicional/foto4.jpg'
    ]
  },
  {
    nombre: 'Pedicura Semipermanente',
    desc: 'Pedicura completa con esmalte semipermanente de larga duración.',
    emoji: '🦶',
    categoria: 'Pies',
    imagenes: [
      'galeria/pedicura_semipermanente/foto1.jpg',
      'galeria/pedicura_semipermanente/foto2.jpg',
      'galeria/pedicura_semipermanente/foto3.jpg',
      'galeria/pedicura_semipermanente/foto4.jpg'
    ]
  },

  // ── CABELLO ────────────────────────────────────────────────────
  {
    nombre: 'Keratina',
    desc: 'Alisa, hidrata y elimina el frizz con tratamiento de keratina profesional.',
    emoji: '💈',
    categoria: 'Cabello',
    imagenes: [
      'galeria/keratina/foto1.jpg',
      'galeria/keratina/foto2.jpg',
      'galeria/keratina/foto3.jpg',
      'galeria/keratina/foto4.jpg'
    ]
  },
  {
    nombre: 'Estilismo',
    desc: 'Peinados, ondas, brushing y todo lo que necesitas para lucir impecable.',
    emoji: '💈',
    categoria: 'Cabello',
    imagenes: [
      'galeria/estilista/foto1.jpg',
      'galeria/estilista/foto2.jpg',
      'galeria/estilista/foto3.jpg',
      'galeria/estilista/foto4.jpg'
    ]
  },

  // ── MAQUILLAJE ─────────────────────────────────────────────────
  {
    nombre: 'Maquillaje Profesional',
    desc: 'Para eventos, novias o sesiones fotográficas con acabado de larga duración.',
    emoji: '🎨',
    categoria: 'Maquillaje',
    imagenes: [
      'galeria/maquillaje_profesional/foto1.jpg',
      'galeria/maquillaje_profesional/foto2.jpg',
      'galeria/maquillaje_profesional/foto3.jpg',
      'galeria/maquillaje_profesional/foto4.jpg'
    ]
  }
];

/**
 * 🔧 EQUIPO — Profesionales
 * Campos: nombre, cargo, especialidad, experiencia, desc, emoji, foto, tags[].
 *
 * 📸 FOTOS:
 *    1. Crea la carpeta 'fotos/' junto a index.html.
 *    2. Pon la foto allí (ej: fotos/valentina.jpg).
 *    3. El campo 'foto' ya apunta a esa ruta. Si no existe, se usa el emoji.
 */
const EQUIPO = [
  {
    nombre: 'Vanesa Herrera/Lashista',
    cargo: 'Especialista Lashes',
    especialidad: 'Cejas y Pestañas',
    experiencia: '2 años',
    desc: 'Artista de la mirada con certificación',
    emoji: '💁',
    foto: 'fotos/vanesa.jpeg',
    tags: ['Extensiones', 'Lifting', 'Tinte']
  },
  {
    nombre: 'Lizeth Niño/Lashista',
    cargo: 'Especialista Lashes',
    especialidad: 'Cejas y Pestañas',
    experiencia: '2 años',
    desc: 'Artista de la mirada con certificación',
    emoji: '💁',
    foto: 'fotos/lizeth.jpeg',
    tags: ['Extensiones', 'Lifting', 'Tinte']
  },

  {
    nombre: 'Diana Gómez/Manicurista',
    cargo: 'Manicurista',
    especialidad: 'Todas las técnicas',
    experiencia: '20 años',
    desc: 'Diseñadora de uñas en todas las técnicas y los más increíbles diseños artísticos.',
    emoji: '🧖‍♀️',
    foto: 'fotos/diana.jpeg',
    tags: ['Gel', 'Acrílico', 'Nail Art']
  },

 

  {
    nombre: 'Dayana Casallas/Manicurista',
    cargo: 'Manicurista',
    especialidad: 'Todas las técnicas',
    experiencia: '4 años',
    desc: 'Diseñadora de uñas en todas las técnicas y los más increíbles diseños artísticos.',
    emoji: '🧖‍♀️',
    foto: 'fotos/dayana.jpeg',
    tags: ['Gel', 'Acrílico', 'Nail Art']
  },
  {
    nombre: 'Angie Villamizar/Manicurista',
    cargo: 'Manicurista/Sábados',
    especialidad: 'Todas las técnicas',
    experiencia: '4 años',
    desc: 'Diseñadora de uñas en todas las técnicas y los más increíbles diseños artísticos.',
    emoji: '🧖‍♀️',
    foto: 'fotos/angie.png',
    tags: ['Gel', 'Acrílico', 'Nail Art']
  },

  {
    nombre: 'Andrea Rincón/Gerente',
    cargo: 'Gerente',
    especialidad: 'PQRS',
    emoji: '🧖‍♀️',
    foto: 'fotos/andrea.jpeg',
    tags: ['Peticiones', 'Quejas', 'Reclamos', 'Sugerencias']
  },
];

/**
 * 🔧 HORARIOS DISPONIBLES — 9:00 AM a 7:00 PM
 * Formato 24h. Agrega o elimina según tu disponibilidad.
 */
const HORARIOS = [
  '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30',
  '19:00'
];

/**
 * 🔧 MÉTODOS DE PAGO
 * Agrega o elimina los que aceptes en tu salón.
 */
const PAGOS = ['Efectivo', 'Nequi', 'Daviplata', 'Transferencia', 'Tarjeta'];

/** Variable global que guarda el método de pago actualmente seleccionado */
let pagoSeleccionado = '';

/**
 * 🔧 OPINIONES — testimonios que se muestran en la sección de opiniones.
 * Puedes agregar, editar o eliminar los que quieras.
 * Campos: nombre, servicio, estrellas (1-5), comentario, emoji.
 */
const OPINIONES = [
  {
    nombre: 'Andrea M.',
    servicio: 'Extensiones de Pestañas',
    estrellas: 5,
    comentario: 'Increíble trabajo, mis pestañas quedaron perfectas. Vanesa es una artista.',
    emoji: '💁'
  },
  {
    nombre: 'Sofía R.',
    servicio: 'Uñas Gel',
    estrellas: 5,
    comentario: 'Dayana hizo magia en mis manos. El diseño duró más de 3 semanas impecable.',
    emoji: '💅'
  },
  {
    nombre: 'María P.',
    servicio: 'Limpieza Facial',
    estrellas: 5,
    comentario: 'Mi piel quedó como seda. me explicó todo el proceso. Volvería mil veces.',
    emoji: '🧖'
  },
  {
    nombre: 'Carolina V.',
    servicio: 'Micropigmentación',
    estrellas: 5,
    comentario: 'Ana es una profesional. Mis cejas quedaron naturales y simétricas. El mejor dinero invertido.',
    emoji: '✨'
  },
  {
    nombre: 'Paola L.',
    servicio: 'Lifting & Laminado',
    estrellas: 5,
    comentario: 'Me enamoré del resultado. Mis pestañas se ven increíbles sin rizador. ¡Totalmente recomendado!',
    emoji: '🌸'
  },
  {
    nombre: 'Isabella T.',
    servicio: 'Maquillaje Profesional',
    estrellas: 5,
    comentario: 'Para mi boda pedí maquillaje y quedé espectacular. Duró todo el día. Gracias Miraditas Studio 💕',
    emoji: '💋'
  }
];


/* ================================================================
   02. INTEGRACIÓN GOOGLE SHEETS
   ================================================================
   Estas funciones se comunican con tu Google Apps Script Web App.
   Si SHEETS_URL no está configurada, el sistema avisa pero
   igual permite agendar (modo degradado sin verificación).
   ================================================================ */

/**
 * Devuelve true si la URL de Sheets está configurada correctamente.
 * Se usa para saber si podemos consultar/guardar en Google Sheets.
 */
function sheetsConfigurado() {
  return SHEETS_URL && SHEETS_URL !== 'PEGA_AQUI_TU_URL_DE_APPS_SCRIPT';
}

/**
 * Consulta a Google Sheets los horarios ya ocupados para
 * una fecha y profesional específicas.
 *
 * @param {string} fecha       - Fecha en formato YYYY-MM-DD.
 * @param {string} profesional - Nombre exacto de la profesional.
 * @returns {Promise<string[]>} Array de horas ocupadas, ej: ['09:00', '11:30'].
 *                              Devuelve [] si Sheets no está configurado o falla.
 */
async function consultarOcupados(fecha, profesional) {
  if (!sheetsConfigurado()) return [];

  try {
    const url = `${SHEETS_URL}?accion=ocupados&fecha=${encodeURIComponent(fecha)}&profesional=${encodeURIComponent(profesional)}`;
    // redirect:'follow' es esencial — Google Apps Script redirige la petición
    const res = await fetch(url, { redirect: 'follow' });
    const json = await res.json();
    return json.ok ? json.ocupados : [];
  } catch (err) {
    console.warn('No se pudieron consultar horarios ocupados:', err);
    return [];
  }
}

/**
 * Guarda una nueva cita en Google Sheets.
 *
 * ⚠️ IMPORTANTE SOBRE CORS:
 *    Google Apps Script no acepta fetch() POST desde el navegador por CORS.
 *    La solución es enviar todos los datos como parámetros en una petición GET.
 *    El Apps Script recibe todo en doGet() y lo guarda igual.
 */
async function guardarCitaEnSheets(cita) {
  if (!sheetsConfigurado()) {
    // Sin Sheets configurado: avisar en consola pero dejar pasar (modo desarrollo)
    console.warn('⚠️ Sheets no configurado — las citas no se están verificando ni guardando.');
    return { ok: true, id: 'MIR-' + Math.random().toString(36).substr(2, 6).toUpperCase() };
  }

  // Enviamos todos los datos como parámetros GET para evitar el bloqueo CORS
  // Google Apps Script redirige — redirect:'follow' es obligatorio
  const params = new URLSearchParams({
    accion: 'guardar',
    nombre: cita.nombre.trim(),
    telefono: cita.telefono.trim(),
    servicio: cita.servicio.trim(),
    profesional: cita.profesional.trim(),
    fecha: cita.fecha.trim(),
    hora: cita.hora.trim(),
    pago: (cita.pago || '').trim()
  });

  const res = await fetch(`${SHEETS_URL}?${params.toString()}`, { redirect: 'follow' });

  // Si la respuesta no es OK a nivel HTTP, lanzar error (no dejar pasar silenciosamente)
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json();
  return json;
  // IMPORTANTE: ya NO hay catch aquí — si falla, el error sube al handler
  // principal que muestra "Error de conexión" en lugar de dejar pasar la cita
}


/* ================================================================
   03. UTILIDADES GENERALES
   ================================================================ */

/**
 * Muestra una notificación tipo "toast" en la esquina inferior derecha.
 * Desaparece automáticamente después de 3 segundos.
 * @param {string} msg - Texto del mensaje a mostrar.
 */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/**
 * Abre un modal haciendo visible el overlay.
 * @param {string} id - ID del elemento modal en el DOM.
 */
function abrirModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden'; // bloquear scroll del fondo
}

/**
 * Cierra un modal quitando la clase 'open'.
 * @param {string} id - ID del elemento modal en el DOM.
 */
function cerrarModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = ''; // restaurar scroll
}
window.cerrarModal = cerrarModal; // exponer para el onclick del HTML

/**
 * Retorna la fecha de hoy en formato YYYY-MM-DD.
 * Se usa para bloquear fechas pasadas en el campo de fecha.
 */
function hoy() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Convierte una hora en formato 24h (HH:MM) a formato 12h con AM/PM.
 * Ejemplo: '09:00' → '9:00 AM', '15:30' → '3:30 PM'
 * @param {string} hora24 - Hora en formato 'HH:MM'.
 * @returns {string} Hora en formato '12h AM/PM'.
 */
function formatoAmPm(hora24) {
  const [hh, mm] = hora24.split(':').map(Number);
  const periodo = hh >= 12 ? 'PM' : 'AM';
  const hora12 = hh % 12 || 12;
  return `${hora12}:${String(mm).padStart(2, '0')} ${periodo}`;
}

/**
 * Genera un SVG placeholder elegante para cuando la foto
 * de un servicio aún no existe. Muestra el emoji y nombre.
 * @param {string} emoji  - Emoji del servicio.
 * @param {string} nombre - Nombre del servicio.
 * @returns {string} Data URL del SVG en base64.
 */
function generarPlaceholder(emoji, nombre) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FDF8F5"/>
          <stop offset="100%" style="stop-color:#FCE8F0"/>
        </linearGradient>
      </defs>
      <rect width="800" height="560" fill="url(#g)"/>
      <circle cx="400" cy="230" r="110" fill="rgba(232,160,180,0.18)" stroke="rgba(232,160,180,0.35)" stroke-width="1.5"/>
      <text x="400" y="255" text-anchor="middle" font-size="80">${emoji}</text>
      <text x="400" y="330" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="#9B3A5A" font-style="italic">${nombre}</text>
      <text x="400" y="370" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" fill="#7A6060">📸 Agrega tus fotos en la carpeta galeria/</text>
    </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.trim());
}


/* ================================================================
   03. RENDERIZAR — SERVICIOS
   ================================================================
   Genera las tarjetas de servicios en el grid de la sección.
   Al hacer clic en una tarjeta se abre la galería de fotos.
   ================================================================ */
// Categoría activa del carrusel de servicios
let srvCategoriaActiva = 'Todos';

function renderServicios() {
  // ── Construir tabs ──────────────────────────────────────────
  const tabsEl = document.getElementById('servicios-tabs');
  const categorias = ['Todos', ...new Set(SERVICIOS.map(s => s.categoria))];

  tabsEl.innerHTML = categorias.map(cat => `
    <button class="srv-tab ${cat === srvCategoriaActiva ? 'active' : ''}"
            onclick="filtrarServicios('${cat}')">
      ${cat}
    </button>
  `).join('');

  // ── Filtrar servicios por categoría ──────────────────────────
  const filtrados = srvCategoriaActiva === 'Todos'
    ? SERVICIOS
    : SERVICIOS.filter(s => s.categoria === srvCategoriaActiva);

  // ── Renderizar tarjetas ──────────────────────────────────────
  const contenedor = document.getElementById('servicios-grid');
  contenedor.innerHTML = filtrados.map((s) => {
    const idx = SERVICIOS.indexOf(s);
    return `
      <div class="srv-card" onclick="abrirGaleria(${idx})" title="Ver galería de ${s.nombre}">
        <div class="srv-card-accent"></div>
        <div class="srv-card-icon-wrap">
          <div class="srv-card-icon">${s.emoji}</div>
          <span class="srv-card-cat">${s.categoria}</span>
        </div>
        <div class="srv-card-body">
          <div class="srv-card-name">${s.nombre}</div>
          <div class="srv-card-desc">${s.desc}</div>
          <div class="srv-card-footer">
            <div class="srv-card-dot"></div>
            <span class="srv-card-tag">Ver galería 📸</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // ── Dots indicadores ──────────────────────────────────────────
  const dotsEl = document.getElementById('srv-dots');
  // Un dot por cada servicio filtrado para navegación precisa
  dotsEl.innerHTML = Array.from({ length: filtrados.length }, (_, i) =>
    `<div class="srv-dot ${i === 0 ? 'active' : ''}" onclick="srvScrollTo(${i})"></div>`
  ).join('');

  // ── Flechas de navegación ────────────────────────────────────
  contenedor.addEventListener('scroll', actualizarDots, { passive: true });
  document.getElementById('srv-prev').onclick = () => srvDesplazar(-1);
  document.getElementById('srv-next').onclick = () => srvDesplazar(1);

  contenedor.scrollLeft = 0;
}

function filtrarServicios(cat) {
  srvCategoriaActiva = cat;
  renderServicios();
}

function srvDesplazar(dir) {
  const track = document.getElementById('servicios-grid');
  // Calcular el ancho real de una tarjeta desde el DOM para mayor precisión
  const card = track.querySelector('.srv-card');
  const cardWidth = card ? card.offsetWidth + 22 : 282;
  track.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
}

function srvScrollTo(dotIdx) {
  const track = document.getElementById('servicios-grid');
  const card = track.querySelector('.srv-card');
  const cardWidth = card ? card.offsetWidth + 22 : 282;
  track.scrollTo({ left: dotIdx * cardWidth, behavior: 'smooth' });
}

function actualizarDots() {
  const track = document.getElementById('servicios-grid');
  const dotsEl = document.getElementById('srv-dots');
  if (!dotsEl) return;
  const dots = dotsEl.querySelectorAll('.srv-dot');
  const card = track.querySelector('.srv-card');
  const cardWidth = card ? card.offsetWidth + 22 : 282;
  const activeDot = Math.round(track.scrollLeft / cardWidth);
  dots.forEach((d, i) => d.classList.toggle('active', i === activeDot));
}


/* ================================================================
   04. RENDERIZAR — GALERÍA DE FOTOS
   ================================================================
   Lightbox con navegación por flechas, miniaturas y teclado.
   Al hacer clic en "Agendar este servicio" va al formulario.
   ================================================================ */

// Variables de estado de la galería (índice actual y fotos del servicio)
let galeriaIndice = 0;
let galeriaImagenes = [];

/**
 * Abre la galería modal para el servicio en la posición 'idx' del array.
 * @param {number} idx - Índice del servicio en el array SERVICIOS.
 */
function abrirGaleria(idx) {
  const servicio = SERVICIOS[idx];
  galeriaImagenes = servicio.imagenes || [];
  galeriaIndice = 0;

  // Rellenar la cabecera del modal con los datos del servicio
  document.getElementById('galeria-titulo').textContent = servicio.nombre;
  document.getElementById('galeria-emoji').textContent = servicio.emoji;
  document.getElementById('galeria-cat').textContent = servicio.categoria;
  document.getElementById('galeria-desc').textContent = servicio.desc;

  // El botón "Agendar este servicio" preselecciona el servicio en el formulario
  document.getElementById('btn-galeria-agendar').onclick = () => {
    cerrarGaleria();
    irAgendar(servicio.nombre, '');
  };

  renderFotoGaleria();
  abrirModal('modal-galeria');
}
window.abrirGaleria = abrirGaleria;

/**
 * Renderiza la foto activa, el contador y las miniaturas.
 * Si la imagen no carga, muestra el placeholder SVG automáticamente.
 */
function renderFotoGaleria() {
  const total = galeriaImagenes.length;
  const src = galeriaImagenes[galeriaIndice];
  const img = document.getElementById('galeria-img');
  const contador = document.getElementById('galeria-contador');
  const thumbs = document.getElementById('galeria-thumbs');
  const emoji = document.getElementById('galeria-emoji').textContent;
  const titulo = document.getElementById('galeria-titulo').textContent;

  // Actualizar contador "2 / 4"
  contador.textContent = `${galeriaIndice + 1} / ${total}`;

  // Cargar imagen con placeholder si falla
  img.style.opacity = '0';
  img.onload = () => { img.style.opacity = '1'; };
  img.onerror = () => {
    img.src = generarPlaceholder(emoji, titulo);
    img.style.opacity = '1';
  };
  img.src = src;
  img.alt = `${titulo} — foto ${galeriaIndice + 1}`;

  // Mostrar/ocultar flechas según posición
  document.getElementById('galeria-prev').style.opacity = galeriaIndice === 0 ? '0.3' : '1';
  document.getElementById('galeria-next').style.opacity = galeriaIndice === total - 1 ? '0.3' : '1';

  // Renderizar miniaturas
  thumbs.innerHTML = galeriaImagenes.map((src, i) => `
    <div class="galeria-thumb ${i === galeriaIndice ? 'active' : ''}" onclick="irAFoto(${i})">
      <img src="${src}" alt="miniatura ${i + 1}"
        onerror="this.parentElement.innerHTML='<span style=font-size:1.4rem>${emoji}</span>'">
    </div>
  `).join('');
}

/** Muestra la foto anterior */
function galeriaAnterior() {
  if (galeriaIndice > 0) { galeriaIndice--; renderFotoGaleria(); }
}
window.galeriaAnterior = galeriaAnterior;

/** Muestra la foto siguiente */
function galeriaSiguiente() {
  if (galeriaIndice < galeriaImagenes.length - 1) { galeriaIndice++; renderFotoGaleria(); }
}
window.galeriaSiguiente = galeriaSiguiente;

/** Salta a una foto específica desde las miniaturas */
function irAFoto(i) { galeriaIndice = i; renderFotoGaleria(); }
window.irAFoto = irAFoto;

/** Cierra la galería */
function cerrarGaleria() { cerrarModal('modal-galeria'); }
window.cerrarGaleria = cerrarGaleria;

// Navegación por teclado: ← → cambian foto, Esc cierra la galería
document.addEventListener('keydown', (e) => {
  if (!document.getElementById('modal-galeria').classList.contains('open')) return;
  if (e.key === 'ArrowLeft') galeriaAnterior();
  if (e.key === 'ArrowRight') galeriaSiguiente();
  if (e.key === 'Escape') cerrarGaleria();
});

// Cerrar al hacer clic en el fondo oscuro del modal
document.getElementById('modal-galeria').addEventListener('click', function (e) {
  if (e.target === this) cerrarGaleria();
});


/* ================================================================
   05. RENDERIZAR — EQUIPO (CARRUSEL INFINITO)
   ================================================================
   Duplica el array de profesionales para el efecto de scroll continuo.
   Al pasar el cursor sobre el carrusel, la animación se pausa.
   ================================================================ */
function renderEquipo() {
  const cardHTML = p => {
    const avatar = p.foto
      ? `<img src="${p.foto}" alt="${p.nombre}"
           style="width:100%;height:100%;object-fit:cover;border-radius:50%;"
           onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
         <span style="display:none;font-size:2.2rem">${p.emoji}</span>`
      : p.emoji;

    return `
      <div class="card-equipo">
        <div class="card-equipo-avatar">${avatar}</div>
        <div class="card-equipo-name">${p.nombre}</div>
        <div class="card-equipo-cargo">${p.cargo}</div>
        <div class="card-equipo-exp">⭐ ${p.experiencia} de experiencia</div>
        <div class="card-equipo-desc">${p.desc}</div>
        <div class="card-equipo-tags">
          ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <button class="btn-agendar-pro" data-profesional="${p.nombre}">
          Agendar con ${p.nombre.split(' ')[0]} →
        </button>
      </div>
    `;
  };

  const todas = [...EQUIPO, ...EQUIPO, ...EQUIPO, ...EQUIPO];
  document.getElementById('equipo-track').innerHTML = todas.map(cardHTML).join('');

  // Listener centralizado: evita que el carrusel cancele el click
  document.getElementById('equipo-track').addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-agendar-pro');
    if (!btn) return;
    e.stopPropagation();
    e.preventDefault();
    irAgendar('', btn.dataset.profesional);
  });
}


/* ================================================================
   07. FORMULARIO DE AGENDA
   ================================================================
   FLUJO AL PRESIONAR "CONFIRMAR RESERVA":
     1. Valida campos.
     2. Consulta Google Sheets — ¿está libre ese horario?
     3. Si está ocupado → avisa y bloquea. Si está libre →
     4. Guarda la cita en Google Sheets.
     5. Abre WhatsApp con mensaje prellenado + enlace de Calendar.
     6. Muestra modal de confirmación.
   ================================================================ */

/**
 * Inicializa el formulario de reserva:
 * - Rellena selects de servicios, profesionales y horarios.
 * - Fija fecha mínima en hoy.
 * - Activa el listener para bloquear horas cuando cambia fecha o profesional.
 */
function initFormulario() {
  // Select de servicios
  const selServicio = document.getElementById('f-servicio');
  selServicio.innerHTML = '<option value="">— Selecciona servicio —</option>' +
    SERVICIOS.map(s => `<option value="${s.nombre}">${s.nombre}</option>`).join('');

  // Select de profesionales
  const selProfesional = document.getElementById('f-profesional');
  selProfesional.innerHTML = '<option value="">— Selecciona profesional —</option>' +
    EQUIPO.map(e => `<option value="${e.nombre}">${e.nombre}</option>`).join('');

  // Select de horarios (se rellenará con opciones bloqueadas dinámicamente)
  const selHora = document.getElementById('f-hora');
  selHora.innerHTML = '<option value="">— Selecciona hora —</option>' +
    HORARIOS.map(h => `<option value="${h}">${formatoAmPm(h)}</option>`).join('');

  // Fecha mínima = hoy
  document.getElementById('f-fecha').min = hoy();

  // Cuando cambia la fecha o la profesional, actualizar horas disponibles
  document.getElementById('f-fecha').addEventListener('change', actualizarHorasDisponibles);
  document.getElementById('f-profesional').addEventListener('change', actualizarHorasDisponibles);

  // Generar botones de método de pago desde el array PAGOS
  const pagoContainer = document.getElementById('pago-options');
  if (pagoContainer) {
    pagoContainer.innerHTML = PAGOS.map(p =>
      `<button type="button" class="pago-btn" onclick="selectPago('${p}',this)">${p}</button>`
    ).join('');
  }

  // Botón flotante WhatsApp
  const wspFloat = document.getElementById('wsp-float-btn');
  if (wspFloat) {
    wspFloat.href = `https://wa.me/${WSP_NUMERO}?text=${encodeURIComponent('Hola, quiero agendar una cita en Miraditas 💅✨')}`;
  }
}

/** Marca visualmente el botón de pago elegido y guarda su valor */
function selectPago(pago, el) {
  pagoSeleccionado = pago;
  document.querySelectorAll('.pago-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}
window.selectPago = selectPago;

/**
 * Consulta Google Sheets y bloquea en el select de horas
 * los horarios ya ocupados para la fecha + profesional elegidas.
 * Muestra un spinner en el select mientras carga.
 */
async function actualizarHorasDisponibles() {
  const fecha = document.getElementById('f-fecha').value;
  const profesional = document.getElementById('f-profesional').value;
  const selHora = document.getElementById('f-hora');

  // Resetear el select primero
  selHora.innerHTML = '<option value="">— Selecciona hora —</option>' +
    HORARIOS.map(h => `<option value="${h}">${formatoAmPm(h)}</option>`).join('');

  // Solo consultar si ambos campos están seleccionados
  if (!fecha || !profesional) return;

  // Mostrar indicador de carga en el select
  selHora.innerHTML = '<option value="">⏳ Consultando disponibilidad...</option>';
  selHora.disabled = true;

  // Consultar horarios ocupados en Google Sheets
  const ocupados = await consultarOcupados(fecha, profesional);

  // Reconstruir el select marcando ocupados con ❌ y disponibles con ✅
  // IMPORTANTE: el value debe ser exactamente igual a como se guarda en Sheets (sin espacios)
  selHora.innerHTML = '<option value="">— Selecciona hora —</option>' +
    HORARIOS.map(h => {
      const estaOcupado = ocupados.includes(h.trim());
      return `<option value="${h.trim()}" ${estaOcupado ? 'disabled' : ''}>${formatoAmPm(h)}  ${estaOcupado ? '❌ Ocupado' : '✅ Disponible'}</option>`;
    }).join('');

  selHora.disabled = false;

  // Avisar si Sheets no está configurado aún
  if (!sheetsConfigurado()) {
    console.info('💡 Sheets no configurado: los horarios no están verificados en tiempo real.');
  }
}

/**
 * Navega a la sección de agenda y preselecciona
 * el servicio y/o la profesional indicados.
 * Se llama desde las tarjetas de servicios y del equipo.
 *
 * @param {string} nombreServicio    - Nombre del servicio a preseleccionar (vacío = no preselecciona).
 * @param {string} nombreProfesional - Nombre de la profesional (vacío = no preselecciona).
 */
function irAgendar(nombreServicio, nombreProfesional) {
  if (nombreServicio) {
    const sel = document.getElementById('f-servicio');
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === nombreServicio) { sel.selectedIndex = i; break; }
    }
  }
  if (nombreProfesional) {
    const sel = document.getElementById('f-profesional');
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === nombreProfesional) { sel.selectedIndex = i; break; }
    }
  }
  // Hacer scroll suave a la sección de agenda
  document.getElementById('agenda').scrollIntoView({ behavior: 'smooth' });
}
window.irAgendar = irAgendar;

/**
 * Construye el enlace de Google Calendar con los datos de la cita.
 * Usa el parámetro action=TEMPLATE de la URL pública de Google Calendar.
 *
 * @param {Object} cita - Datos de la cita { nombre, servicio, profesional, fecha, hora }.
 * @returns {string} URL de Google Calendar con los parámetros prellenados.
 */
function generarEnlaceCalendar(cita) {
  // Convertir la fecha y hora al formato que necesita Google Calendar: YYYYMMDDTHHMMSS
  // Ejemplo: '2024-12-15' + '14:30' → '20241215T143000'
  const fechaHoraInicio = cita.fecha.replace(/-/g, '') + 'T' + cita.hora.replace(':', '') + '00';

  // Calcular hora de fin (1 hora después del inicio)
  const [hh, mm] = cita.hora.split(':').map(Number);
  const horaFin = String(hh + 1).padStart(2, '0') + mm.toString().padStart(2, '0');
  const fechaHoraFin = cita.fecha.replace(/-/g, '') + 'T' + horaFin + '00';

  // Texto del evento
  const titulo = `Cita en Miraditas — ${cita.servicio}`;
  const detalle =
    `Cita agendada en Miraditas Salón de Belleza.\n\n` +
    `👤 Cliente: ${cita.nombre}\n` +
    `✨ Servicio: ${cita.servicio}\n` +
    `👩 Profesional: ${cita.profesional}\n` +
    `📞 Teléfono: ${cita.telefono}`;

  // Construir la URL de Google Calendar
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: titulo,
    dates: `${fechaHoraInicio}/${fechaHoraFin}`,
    details: detalle,
    location: 'Miraditas Salón de Belleza'
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Maneja el envío del formulario de agenda.
 *
 * FLUJO COMPLETO:
 *   1. Valida campos obligatorios.
 *   2. Muestra spinner en el botón mientras procesa.
 *   3. Guarda la cita en Google Sheets (que verifica el conflicto en el servidor).
 *   4. Si hay conflicto → avisa y actualiza las horas disponibles.
 *   5. Si todo OK → construye mensaje WhatsApp con enlace de Calendar.
 *   6. Abre el modal de confirmación con ambos botones.
 *   7. Limpia el formulario.
 */
document.getElementById('btn-agendar').addEventListener('click', async function () {
  const nombre = document.getElementById('f-nombre').value.trim();
  const telefono = document.getElementById('f-telefono').value.trim();
  const servicio = document.getElementById('f-servicio').value;
  const profesional = document.getElementById('f-profesional').value;
  const fecha = document.getElementById('f-fecha').value;
  const hora = document.getElementById('f-hora').value;

  // --- Validación ---
  if (!nombre || !telefono || !servicio || !profesional || !fecha || !hora) {
    showToast('⚠️ Por favor completa todos los campos');
    return;
  }
  if (!pagoSeleccionado) {
    showToast('⚠️ Selecciona un método de pago');
    // Hacer scroll al campo de pago para que sea visible
    document.getElementById('pago-options').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  if (fecha < hoy()) {
    showToast('⚠️ Selecciona una fecha válida (hoy o en el futuro)');
    return;
  }

  // --- Spinner: deshabilitar botón mientras se procesa ---
  const btnAgendar = document.getElementById('btn-agendar');
  const textoOriginal = btnAgendar.textContent;
  btnAgendar.textContent = '⏳ Verificando disponibilidad...';
  btnAgendar.disabled = true;

  try {
    const cita = { nombre, telefono, servicio, profesional, fecha, hora, pago: pagoSeleccionado };

    // --- Intentar guardar en Google Sheets ---
    // El servidor hace una verificación final del conflicto antes de guardar.
    const resultado = await guardarCitaEnSheets(cita);

    // El horario ya está ocupado → no dejar agendar
    if (resultado.conflicto) {
      showToast(`❌ ${resultado.mensaje}`);
      // Refrescar el select de horas para que se vea el horario como ocupado
      await actualizarHorasDisponibles();
      return;
    }

    if (!resultado.ok) {
      showToast('❌ Ocurrió un error. Por favor intenta de nuevo.');
      return;
    }

    // --- Todo OK: construir mensajes ---
    const citaId = resultado.id;

    // Enlace de Google Calendar (primero, para incluirlo en el mensaje de WhatsApp)
    const urlCalendar = generarEnlaceCalendar(cita);

    // Mensaje de WhatsApp con todos los datos + enlace de Calendar para que TÚ lo guardes
    const mensajeWsp =
      `¡Hola Miraditas! 💅✨\n\nQuiero agendar una cita:\n\n` +
      `👤 Nombre: ${nombre}\n` +
      `📞 Teléfono: ${telefono}\n` +
      `✨ Servicio: ${servicio}\n` +
      `👩 Profesional: ${profesional}\n` +
      `📅 Fecha: ${fecha}\n` +
      `⏰ Hora: ${formatoAmPm(hora)}\n` +
      `💳 Pago: ${pagoSeleccionado}\n` +
      `🔖 Código: ${citaId}\n\n` +
      `─────────────────────\n` +
      `📆 Agregar al calendario:\n${urlCalendar}\n` +
      `─────────────────────\n` +
      `¡Gracias! 🌸`;

    const urlWsp = `https://wa.me/${WSP_NUMERO}?text=${encodeURIComponent(mensajeWsp)}`;

    // --- Rellenar modal de confirmación ---
    document.getElementById('modal-detalle').innerHTML =
      `<strong>${nombre}</strong> — ${servicio}<br>
       📅 ${fecha} a las <strong>${formatoAmPm(hora)}</strong><br>
       👩 Con <strong>${profesional}</strong><br>
       📞 ${telefono}<br>
       💳 Pago: <strong>${pagoSeleccionado}</strong><br>
       🔖 Código: <strong style="color:var(--rose-deep)">${citaId}</strong>`;

    document.getElementById('btn-wsp-confirm').href = urlWsp;
    document.getElementById('btn-calendar').href = urlCalendar;

    abrirModal('modal-confirmacion');
    resetFormulario();
    showToast('✅ ¡Horario disponible! Ahora envía el mensaje por WhatsApp');

    // Refrescar horas disponibles en el select para futuros usos
    await actualizarHorasDisponibles();

  } catch (err) {
    console.error('Error al agendar:', err);
    showToast('❌ Error de conexión. Revisa tu internet e intenta de nuevo.');
  } finally {
    // Siempre restaurar el botón al estado original
    btnAgendar.textContent = textoOriginal;
    btnAgendar.disabled = false;
  }
});

/** Limpia todos los campos del formulario después de agendar */
function resetFormulario() {
  document.getElementById('f-nombre').value = '';
  document.getElementById('f-telefono').value = '';
  document.getElementById('f-servicio').selectedIndex = 0;
  document.getElementById('f-profesional').selectedIndex = 0;
  document.getElementById('f-fecha').value = '';
  document.getElementById('f-hora').selectedIndex = 0;
  pagoSeleccionado = '';
  document.querySelectorAll('.pago-btn').forEach(b => b.classList.remove('active'));
}


/* ================================================================
   07. RENDERIZAR — OPINIONES
   ================================================================
   Muestra las opiniones estáticas definidas en el array OPINIONES.
   Para actualizarlas, edita ese array al inicio de este archivo.
   ================================================================ */
function renderOpiniones() {
  const grid = document.getElementById('opiniones-grid');
  const summary = document.getElementById('rating-summary');

  // Calcular calificación promedio
  const promedio = OPINIONES.reduce((acc, o) => acc + o.estrellas, 0) / OPINIONES.length;

  // Resumen de calificación
  summary.innerHTML = `
    <div><div class="rating-big">${promedio.toFixed(1)}</div></div>
    <div>
      <div class="rating-stars">${'★'.repeat(Math.round(promedio))}</div>
      <div class="rating-count">${OPINIONES.length} opiniones verificadas</div>
    </div>
  `;

  // Tarjetas de opinión
  grid.innerHTML = OPINIONES.map(o => `
    <div class="card-opinion">
      <div class="opinion-stars">${'★'.repeat(o.estrellas)}</div>
      <div class="opinion-text">"${o.comentario}"</div>
      <div class="opinion-author">
        <div class="opinion-avatar">${o.emoji}</div>
        <div>
          <div class="opinion-name">${o.nombre}</div>
          <div class="opinion-servicio">${o.servicio}</div>
        </div>
      </div>
    </div>
  `).join('');

  // Animación de aparición al hacer scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card-opinion').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
  });
}


/* ================================================================
   08. NAVEGACIÓN Y EVENTOS DE UI
   ================================================================ */

/** Abre y cierra el menú hamburguesa en móvil */
document.getElementById('nav-toggle').addEventListener('click', function () {
  document.getElementById('main-nav').classList.toggle('open');
});

/** Cierra el menú al hacer clic en cualquier enlace de navegación */
document.querySelectorAll('#main-nav a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('main-nav').classList.remove('open'));
});

/** Añade sombra al header al hacer scroll */
window.addEventListener('scroll', () => {
  document.getElementById('header').classList.toggle('scrolled', window.scrollY > 20);
});

/** Cerrar modal de confirmación al hacer clic en el fondo oscuro */
document.getElementById('modal-confirmacion').addEventListener('click', function (e) {
  if (e.target === this) cerrarModal('modal-confirmacion');
});


/* ================================================================
   09. INICIALIZACIÓN
   ================================================================
   Se ejecuta al cargar la página.
   Llama a todas las funciones de render para construir el contenido.
   ================================================================ */
(function init() {
  renderServicios();   // Genera las tarjetas de servicios
  renderEquipo();      // Genera el carrusel del equipo
  initFormulario();    // Prepara el formulario de agenda
  renderOpiniones();   // Muestra las opiniones
})();


/* ================================================================
   🔗 INSTRUCCIONES: CONECTAR GOOGLE SHEETS EN 10 MINUTOS
   ================================================================

   PASO 1 — Crear la Google Sheet
   ───────────────────────────────
   1. Ve a https://sheets.google.com
   2. Crea una hoja en blanco. Ponle el nombre que quieras,
      por ejemplo "Miraditas Citas".
   3. Déjala abierta, la necesitarás en el paso 2.


   PASO 2 — Crear el Apps Script (el mini servidor)
   ──────────────────────────────────────────────────
   1. Dentro de tu Google Sheet, ve al menú:
        Extensiones → Apps Script
      Se abre el editor de código de Google.

   2. Borra TODO el código que aparece por defecto
      (la función vacía que ya está ahí).

   3. Abre el archivo "codigo-google-apps-script.js" que
      descargaste junto con este proyecto.

   4. Copia TODO su contenido y pégalo en el editor de Apps Script.

   5. Haz clic en 💾 "Guardar proyecto" (o Ctrl+S).
      Dale el nombre "Miraditas" cuando te lo pida.


   PASO 3 — Desplegar como Web App
   ─────────────────────────────────
   1. En el editor de Apps Script, haz clic en:
        "Implementar" → "Nueva implementación"

   2. Haz clic en el ⚙️ engranaje al lado de "Tipo"
      y selecciona: "Aplicación web"

   3. Configura así:
      - Descripción:           Miraditas v1
      - Ejecutar como:         Yo (tu cuenta de Google)
      - Quién tiene acceso:    Cualquier persona   ← MUY IMPORTANTE

   4. Haz clic en "Implementar".

   5. Google te pedirá que autorices los permisos.
      Haz clic en "Autorizar acceso" y sigue los pasos.
      (Si aparece "Google no verificó esta app", haz clic en
       "Configuración avanzada" → "Ir a Miraditas (no seguro)")

   6. Copia la URL que aparece. Tiene este formato:
        https://script.google.com/macros/s/XXXXXXXXXX/exec


   PASO 4 — Pegar la URL en script.js
   ────────────────────────────────────
   1. Abre el archivo script.js de tu proyecto.
   2. Busca esta línea (cerca del inicio):
        const SHEETS_URL = 'PEGA_AQUI_TU_URL_DE_APPS_SCRIPT';
   3. Reemplaza 'PEGA_AQUI_TU_URL_DE_APPS_SCRIPT' con tu URL:
        const SHEETS_URL = 'https://script.google.com/macros/s/XXXX/exec';
   4. Guarda el archivo y vuelve a subir a Vercel (o GitHub).


   PASO 5 — Verificar que funciona
   ─────────────────────────────────
   1. Abre tu web y llena el formulario con una cita de prueba.
   2. Presiona "Confirmar Reserva".
   3. Abre tu Google Sheet — deberías ver la fila con la cita.
   4. Intenta agendar otra cita con la misma profesional,
      fecha y hora → debería aparecer ese horario como ❌ Ocupado.


   ⚠️ SI ALGO FALLA:
   ──────────────────
   - Asegúrate de que "Quién tiene acceso" sea "Cualquier persona".
   - Si cambias el código del Apps Script, debes crear una
     NUEVA implementación (no reutilices la misma versión).
     Ve a: Implementar → Administrar implementaciones →
     Editar → Nueva versión → Implementar.
   - Cada nueva implementación genera una URL diferente.
     Actualiza SHEETS_URL en script.js con la nueva URL.

   ================================================================ */


/* ================================================================
   🚀 INSTRUCCIONES PARA DESPLEGAR EN VERCEL
   ================================================================

   Vercel despliega proyectos de solo frontend de forma gratuita
   y muy sencilla. Sigue estos pasos:

   OPCIÓN A — Desde la interfaz web (recomendado para no programadores):
   ─────────────────────────────────────────────────────────────────────
   1. Crea una cuenta gratis en https://vercel.com (puedes entrar
      con tu cuenta de GitHub, GitLab o correo).

   2. Sube tu proyecto a GitHub:
      a. Ve a https://github.com y crea un repositorio nuevo.
      b. Sube los 3 archivos: index.html, styles.css, script.js.
         También sube logo.png si lo tienes.
         (Opcionalmente, sube las carpetas galeria/ y fotos/)

   3. En Vercel, haz clic en "Add New Project".

   4. Conecta tu repositorio de GitHub (autoriza el acceso).

   5. En la pantalla de configuración:
      - Framework Preset: "Other" (no selecciones ninguno)
      - Root Directory: / (déjalo vacío, usa la raíz)
      - Build & Output Settings: déjalo todo en blanco

   6. Haz clic en "Deploy". En menos de 1 minuto tendrás una URL
      como: https://miraditas.vercel.app ✅

   7. Cada vez que subas cambios a GitHub, Vercel los desplegará
      automáticamente (CI/CD automático).

   OPCIÓN B — Desde la terminal con Vercel CLI:
   ─────────────────────────────────────────────
   1. Instala Node.js desde https://nodejs.org
   2. Abre la terminal en la carpeta del proyecto y ejecuta:
        npm install -g vercel
   3. Inicia sesión:
        vercel login
   4. Despliega con un solo comando:
        vercel --prod
   5. Vercel te dará la URL pública de tu sitio.

   DOMINIO PERSONALIZADO (ej: www.miraditas.com):
   ──────────────────────────────────────────────
   En el panel de Vercel → tu proyecto → Settings → Domains.
   Agrega tu dominio y sigue las instrucciones para configurar
   los DNS en tu proveedor de dominio (GoDaddy, Namecheap, etc).

   ================================================================ */

