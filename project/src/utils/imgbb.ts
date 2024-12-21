const IMGBB_API_KEY = '0cdf4c9cedf4469f4d62420fec520463';
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

async function convertToJPG(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Fond blanc pour les images PNG avec transparence
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Could not convert image'));
          return;
        }
        const convertedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
          type: 'image/jpeg',
        });
        resolve(convertedFile);
      }, 'image/jpeg', 0.95);
    };
    
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = URL.createObjectURL(file);
  });
}

export async function uploadImageToImgBB(file: File): Promise<string> {
  try {
    // Convertir en JPG si ce n'est pas déjà le cas
    const jpgFile = file.type !== 'image/jpeg' ? await convertToJPG(file) : file;
    
    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', jpgFile);

    const response = await fetch(IMGBB_API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload de l\'image');
    }

    const data = await response.json();
    return data.data.url;
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    throw new Error('Impossible d\'uploader l\'image. Veuillez réessayer.');
  }
}

export async function uploadImageFromURL(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
    return await uploadImageToImgBB(file);
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    throw new Error('Impossible d\'uploader l\'image. Veuillez réessayer.');
  }
}
