export const IMAGE_MAX_SIZE = 10 * 1024 * 1024; // 10MB

export function validateImage(file: File): string | null {
  if (file.size > IMAGE_MAX_SIZE) {
    return "L'image ne doit pas dépasser 10MB";
  }
  
  if (!file.type.startsWith('image/')) {
    return "Le fichier doit être une image";
  }
  
  return null;
}