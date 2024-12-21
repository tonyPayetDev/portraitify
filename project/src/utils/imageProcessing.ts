export async function convertToDPI(file: File, targetDPI: number = 300): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    img.onload = () => {
      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Convert to blob with DPI information
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to convert image'));
            return;
          }

          // Convert blob to array buffer to inject DPI information
          const reader = new FileReader();
          reader.onload = () => {
            const buffer = reader.result as ArrayBuffer;
            const dpiBlob = injectDPIMetadata(buffer, targetDPI);
            
            const newFileName = file.name.replace(
              /\.[^/.]+$/,
              `_${targetDPI}dpi.jpg`
            );
            
            const convertedFile = new File([dpiBlob], newFileName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            resolve(convertedFile);
          };
          reader.readAsArrayBuffer(blob);
        },
        'image/jpeg',
        1.0 // Maximum quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

function injectDPIMetadata(buffer: ArrayBuffer, dpi: number): Blob {
  const array = new Uint8Array(buffer);
  
  // JFIF header marker (0xFFE0)
  const jfifMarker = [0xFF, 0xE0];
  // APP1 marker for EXIF (0xFFE1)
  const exifMarker = [0xFF, 0xE1];
  
  // Find position after SOI marker (0xFFD8)
  let pos = 2;
  
  // Create DPI metadata
  const dpiX = dpi;
  const dpiY = dpi;
  
  // Convert DPI to JFIF density values (1 meter = 39.3701 inches)
  const density = Math.round(dpi * 39.3701);
  
  // Create JFIF segment
  const jfifData = [
    ...jfifMarker,
    0x00, 0x10, // Length of segment
    0x4A, 0x46, 0x49, 0x46, 0x00, // 'JFIF\0'
    0x01, 0x02, // Version 1.2
    0x01, // Units = dots per inch
    (density >> 8) & 0xFF, density & 0xFF, // X density (big-endian)
    (density >> 8) & 0xFF, density & 0xFF, // Y density (big-endian)
    0x00, 0x00 // Thumbnail size (none)
  ];
  
  // Create new array with space for the DPI metadata
  const newArray = new Uint8Array(buffer.byteLength + jfifData.length);
  
  // Copy SOI marker
  newArray[0] = array[0];
  newArray[1] = array[1];
  
  // Insert JFIF segment
  jfifData.forEach((byte, i) => {
    newArray[pos + i] = byte;
  });
  
  // Copy rest of the original data
  for (let i = 2; i < array.length; i++) {
    newArray[pos + jfifData.length + i - 2] = array[i];
  }
  
  return new Blob([newArray], { type: 'image/jpeg' });
}
