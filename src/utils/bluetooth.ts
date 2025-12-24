export const buildEscPos = (text: string) => {
  const encoder = new TextEncoder();
  const ESC = [0x1b, 0x40]; // init
  const CENTER = [0x1b, 0x61, 0x01];
  const LEFT = [0x1b, 0x61, 0x00];
  const BOLD_ON = [0x1b, 0x45, 0x01];
  const BOLD_OFF = [0x1b, 0x45, 0x00];
  const CUT = [0x1d, 0x56, 0x00];

  const lines = text.split('\n');
  const bytes: number[] = [];
  bytes.push(...ESC);
  bytes.push(...CENTER);
  bytes.push(...BOLD_ON);

  if (lines.length > 0) {
    const title = lines[0];
    bytes.push(...Array.from(encoder.encode(title + '\n')));
    bytes.push(...BOLD_OFF);
  }

  bytes.push(...LEFT);

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    bytes.push(...Array.from(encoder.encode(line + '\n')));
  }

  bytes.push(...Array.from(encoder.encode('\n\n')));
  bytes.push(...CUT);

  return new Uint8Array(bytes);
};

const writeChunks = async (characteristic: any, data: Uint8Array) => {
  const CHUNK_SIZE = 180;
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await characteristic.writeValue(chunk);
    await new Promise((res) => setTimeout(res, 50));
  }
};

export const isBluetoothAvailable = () => {
  return typeof navigator !== 'undefined' && !!(navigator as any).bluetooth;
};

export const printTextBluetooth = async (text: string) => {
  if (!isBluetoothAvailable()) {
    alert('Web Bluetooth no está disponible en este navegador. Usa Chrome/Edge en un equipo compatible.');
    return;
  }

  const data = buildEscPos(text);

  try {
    const optionalServices = [
      '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
      '0000ffe0-0000-1000-8000-00805f9b34fb',
    ];

    // @ts-ignore
    const device = await (navigator as any).bluetooth.requestDevice({ acceptAllDevices: true, optionalServices });
    if (!device) {
      alert('Bluetooth no disponible o no se ha seleccionado ningún dispositivo.');
      return;
    }
    const server = await device.gatt.connect();

    const services = await server.getPrimaryServices();
    let writeChar: any | null = null;

    for (const service of services) {
      try {
        const chars = await service.getCharacteristics();
        for (const c of chars) {
          if (c.properties.write || c.properties.writeWithoutResponse) {
            writeChar = c;
            break;
          }
        }
      } catch (err) {
        // ignore
      }
      if (writeChar) break;
    }

    if (!writeChar) {
      alert('No se encontró una característica writable en el dispositivo. Asegúrate de que la impresora soporte BLE y tenga un servicio writable.');
      try { await server.disconnect(); } catch (e) { /* ignore */ }
      return;
    }

    await writeChunks(writeChar, data);
    alert('Enviado a la impresora por Bluetooth.');
    try { await server.disconnect(); } catch (e) { /* ignore */ }
  } catch (err: any) {
    console.error('Bluetooth print failed', err);
    const message = (err && err.message) ? err.message : String(err);
    if (message.toLowerCase().includes('adapter') || message.toLowerCase().includes('no available') || message.toLowerCase().includes('notfounderror') || message.toLowerCase().includes('no devices') || message.toLowerCase().includes('not found')) {
      alert('Bluetooth no disponible');
    } else if (message.toLowerCase().includes('not allowed') || message.toLowerCase().includes('permission')) {
      alert('Error: permiso denegado para acceder al Bluetooth. Comprueba los permisos del sitio en el navegador.');
    } else {
      alert('Error al imprimir por Bluetooth: ' + message);
    }
    throw err;
  }
};