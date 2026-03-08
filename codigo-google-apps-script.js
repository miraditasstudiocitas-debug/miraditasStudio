/* ================================================================
   MIRADITAS — GOOGLE APPS SCRIPT
   ================================================================

   Este código se pega en Google Apps Script y actúa como un
   mini servidor gratuito que recibe citas y las guarda en
   tu Google Sheet.

   📌 INSTRUCCIONES DE INSTALACIÓN (paso a paso más abajo):
      1. Crea una Google Sheet nueva
      2. Ve a Extensiones → Apps Script
      3. Borra el código que aparece y pega TODO este archivo
      4. Despliega como Web App
      5. Copia la URL que te da y pégala en script.js

   ================================================================ */


// ----------------------------------------------------------------
// 🔧 CONFIGURACIÓN — solo cambia esto
// ----------------------------------------------------------------

// Nombre exacto de la hoja dentro de tu Google Sheet
// Si la renombraste, cámbialo aquí también
const NOMBRE_HOJA = 'Citas';

// Cabeceras de las columnas (no cambiar el orden)
const CABECERAS = [
  'ID', 'Fecha Registro', 'Nombre', 'Teléfono',
  'Servicio', 'Profesional', 'Fecha Cita', 'Hora', 'Pago', 'Estado'
];


// ----------------------------------------------------------------
// doGet — responde a peticiones GET del navegador
// Maneja DOS acciones:
//   ?accion=ocupados  → consultar horarios ocupados
//   ?accion=guardar   → guardar una nueva cita
//
// Usamos solo GET (no POST) porque el navegador bloquea POST
// hacia Google Apps Script por restricciones de CORS.
// ----------------------------------------------------------------
function doGet(e) {
  try {
    const hoja   = obtenerOCrearHoja();
    const accion = e.parameter.accion || '';

    // ── ACCIÓN: consultar horarios ocupados ──────────────────────
    // Llamada: ?accion=ocupados&fecha=2024-12-15&profesional=Valentina Ríos
    if (accion === 'ocupados') {
      const fecha       = e.parameter.fecha       || '';
      const profesional = e.parameter.profesional || '';

      if (!fecha || !profesional) {
        return respuesta({ error: 'Faltan parámetros: fecha y profesional' });
      }

      const ocupados = obtenerHorariosOcupados(hoja, fecha, profesional);
      return respuesta({ ok: true, ocupados });
    }

    // ── ACCIÓN: guardar nueva cita ───────────────────────────────
    // Llamada: ?accion=guardar&nombre=Ana&telefono=...&servicio=...etc
    if (accion === 'guardar') {
      const nombre      = e.parameter.nombre      || '';
      const telefono    = e.parameter.telefono    || '';
      const servicio    = e.parameter.servicio    || '';
      const profesional = e.parameter.profesional || '';
      const fecha       = e.parameter.fecha       || '';
      const hora        = e.parameter.hora        || '';
      const pago        = e.parameter.pago        || '';

      if (!nombre || !telefono || !servicio || !profesional || !fecha || !hora) {
        return respuesta({ error: 'Faltan campos requeridos' });
      }

      const ocupados = obtenerHorariosOcupados(hoja, fecha, profesional);
      if (ocupados.includes(hora)) {
        return respuesta({
          ok:        false,
          conflicto: true,
          mensaje:   `${profesional} ya tiene una cita el ${fecha} a las ${hora}. Por favor elige otro horario.`
        });
      }

      const id = 'MIR-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      const fechaRegistro = Utilities.formatDate(new Date(), 'America/Bogota', 'yyyy-MM-dd HH:mm:ss');

      // Guardar fila — Pago va en columna 9, Estado en columna 10
      hoja.appendRow([id, fechaRegistro, nombre, telefono, servicio, profesional, fecha, hora, pago, 'pendiente']);

      // Forzar texto plano en la columna Hora (col 8) para que Sheets no la convierta
      const ultimaFila = hoja.getLastRow();
      hoja.getRange(ultimaFila, 8).setNumberFormat('@');

      return respuesta({ ok: true, id, mensaje: '¡Cita registrada exitosamente!' });
    }

    // Acción desconocida
    return respuesta({ error: 'Acción no reconocida. Usa: ocupados | guardar' });

  } catch (err) {
    return respuesta({ error: err.message });
  }
}


// ----------------------------------------------------------------
// doPost — ya no se usa desde el navegador (CORS lo bloquea)
// Se mantiene por si en el futuro se llama desde otro servidor.
// ----------------------------------------------------------------
function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents);
    const hoja  = obtenerOCrearHoja();

    const camposRequeridos = ['nombre', 'telefono', 'servicio', 'profesional', 'fecha', 'hora'];
    for (const campo of camposRequeridos) {
      if (!datos[campo]) return respuesta({ error: `Campo faltante: ${campo}` });
    }

    const ocupados = obtenerHorariosOcupados(hoja, datos.fecha, datos.profesional);
    if (ocupados.includes(datos.hora)) {
      return respuesta({ ok: false, conflicto: true, mensaje: `Horario ocupado: ${datos.hora}` });
    }

    const id = 'MIR-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const fechaRegistro = Utilities.formatDate(new Date(), 'America/Bogota', 'yyyy-MM-dd HH:mm:ss');
    hoja.appendRow([id, fechaRegistro, datos.nombre, datos.telefono, datos.servicio, datos.profesional, datos.fecha, datos.hora, datos.pago || '', 'pendiente']);
    const ultimaFila = hoja.getLastRow();
    hoja.getRange(ultimaFila, 8).setNumberFormat('@');

    return respuesta({ ok: true, id });
  } catch (err) {
    return respuesta({ error: err.message });
  }
}


// ----------------------------------------------------------------
// FUNCIONES AUXILIARES
// ----------------------------------------------------------------

/**
 * Obtiene la hoja "Citas" dentro del Spreadsheet activo.
 * Si no existe, la crea y agrega las cabeceras automáticamente.
 */
function obtenerOCrearHoja() {
  const ss   = SpreadsheetApp.getActiveSpreadsheet();
  let   hoja = ss.getSheetByName(NOMBRE_HOJA);

  // Si la hoja no existe, crearla con las cabeceras
  if (!hoja) {
    hoja = ss.insertSheet(NOMBRE_HOJA);
    hoja.appendRow(CABECERAS);

    // Formatear la fila de cabeceras: negrita + fondo rosa suave
    const rangoCabeceras = hoja.getRange(1, 1, 1, CABECERAS.length);
    rangoCabeceras.setFontWeight('bold');
    rangoCabeceras.setBackground('#F8D7DA');
    rangoCabeceras.setHorizontalAlignment('center');

    // Ajustar el ancho de columnas para mejor lectura
    hoja.setColumnWidth(1, 110);  // ID
    hoja.setColumnWidth(2, 160);  // Fecha Registro
    hoja.setColumnWidth(3, 150);  // Nombre
    hoja.setColumnWidth(4, 130);  // Teléfono
    hoja.setColumnWidth(5, 200);  // Servicio
    hoja.setColumnWidth(6, 160);  // Profesional
    hoja.setColumnWidth(7, 110);  // Fecha Cita
    hoja.setColumnWidth(8, 80);   // Hora
    hoja.setColumnWidth(9, 120);  // Pago
    hoja.setColumnWidth(10, 100); // Estado

    // Congelar la fila de cabeceras para que siempre sea visible al hacer scroll
    hoja.setFrozenRows(1);
  }

  return hoja;
}

/**
 * Devuelve un array con los horarios ya ocupados para una
 * combinación de fecha + profesional.
 * Solo considera citas con estado distinto de 'cancelada'.
 *
 * @param {Sheet}  hoja        - Objeto Sheet de Google Apps Script.
 * @param {string} fecha       - Fecha en formato YYYY-MM-DD.
 * @param {string} profesional - Nombre exacto de la profesional.
 * @returns {string[]} Array de horas ocupadas, ej: ['09:00', '11:30']
 */
function obtenerHorariosOcupados(hoja, fecha, profesional) {
  const datos = hoja.getDataRange().getValues();

  const COL_PROFESIONAL = 5;
  const COL_FECHA_CITA  = 6;
  const COL_HORA        = 7;
  const COL_ESTADO      = 9;  // ← columna 10 (índice 9) después de agregar Pago

  // Normalizar los parámetros de búsqueda para comparación limpia
  const fechaBuscar       = String(fecha).trim();
  const profesionalBuscar = String(profesional).trim().toLowerCase();

  const ocupados = [];

  for (let i = 1; i < datos.length; i++) {
    const fila = datos[i];

    // Normalizar fecha (Google Sheets puede convertirla a objeto Date)
    let fechaCita = fila[COL_FECHA_CITA];
    if (fechaCita instanceof Date) {
      fechaCita = Utilities.formatDate(fechaCita, 'America/Bogota', 'yyyy-MM-dd');
    } else {
      fechaCita = String(fechaCita).trim();
    }

    // Normalizar hora — Google Sheets a veces la convierte a fracción decimal o Date
    let filaHora = fila[COL_HORA];
    if (filaHora instanceof Date) {
      // Si Sheets convirtió la hora a Date, extraer HH:MM
      filaHora = Utilities.formatDate(filaHora, 'America/Bogota', 'HH:mm');
    } else {
      filaHora = String(filaHora).trim();
    }

    const filaProfesional = String(fila[COL_PROFESIONAL]).trim().toLowerCase();
    const filaEstado      = String(fila[COL_ESTADO]).trim().toLowerCase();

    if (
      fechaCita         === fechaBuscar &&
      filaProfesional   === profesionalBuscar &&
      filaEstado        !== 'cancelada'
    ) {
      ocupados.push(filaHora);
    }
  }

  return ocupados;
}

/**
 * Construye y devuelve la respuesta JSON.
 * Google Apps Script Web App no permite headers personalizados,
 * pero al estar publicado como "Cualquier persona" ya admite CORS básico.
 */
function respuesta(datos) {
  return ContentService
    .createTextOutput(JSON.stringify(datos))
    .setMimeType(ContentService.MimeType.JSON);
}
