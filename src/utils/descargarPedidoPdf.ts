import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

/**
 * CONFIGURACIÓN REAL PARA TICKET 58mm
 */
const PAGE_WIDTH = 165;
const MARGIN_X = 10;
const MARGIN_TOP = 10;
const LINE_HEIGHT = 16;
const FONT_SIZE = 14;

/**
 * Número REAL de caracteres que caben por línea
 * Courier + 14px + 58mm ≈ 18 caracteres
 */
const MAX_CHARS = 18;

/**
 * Corta texto en líneas SIN partir palabras
 */
function wrapLine(text: string): string[] {
  const lines: string[] = [];
  let remaining = text.trim();

  while (remaining.length > MAX_CHARS) {
    let cut = remaining.lastIndexOf(' ', MAX_CHARS);

    // Si no hay espacio, corte forzado
    if (cut === -1) {
      cut = MAX_CHARS;
    }

    lines.push(remaining.slice(0, cut));
    remaining = remaining.slice(cut).trim();
  }

  if (remaining.length > 0) {
    lines.push(remaining);
  }

  return lines;
}

export async function descargarPedidoPdf(
  lineasEntrada: string[],
  nombre: string
) {
  /**
   * AJUSTE DE LÍNEAS (WRAP)
   */
  const lineas: string[] = [];
  lineasEntrada.forEach(linea => {
    wrapLine(linea).forEach(l => lineas.push(l));
  });

  const PAGE_HEIGHT =
    MARGIN_TOP * 2 + lineas.length * LINE_HEIGHT;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const font = await pdfDoc.embedFont(StandardFonts.Courier);

  // Fondo blanco
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: rgb(1, 1, 1),
  });

  let y = PAGE_HEIGHT - MARGIN_TOP - FONT_SIZE;

  /**
   * DIBUJAR TEXTO
   */
  for (const linea of lineas) {
    page.drawText(linea, {
      x: MARGIN_X,
      y,
      size: FONT_SIZE,
      font,
      color: rgb(0, 0, 0),
    });
    y -= LINE_HEIGHT;
  }

  const pdfBytes = await pdfDoc.save();

  const base64 = btoa(
    pdfBytes.reduce((data, byte) => data + String.fromCharCode(byte), '')
  );

  /**
   * WEB
   */
  if (!Capacitor.isNativePlatform()) {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${nombre}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return;
  }

  /**
   * ANDROID
   */
  await Filesystem.writeFile({
    path: `${nombre}.pdf`,
    data: base64,
    directory: Directory.Documents,
  });

  alert('Pedido guardado en Documentos');
}
