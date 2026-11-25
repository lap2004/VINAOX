export interface MediaUploadValidation {
  valid: boolean;
  error?: string;
  sanitizedFilename: string;
  category: 'news' | 'products' | 'certificates' | 'general';
}

const ALLOWED_EXTENSIONS = ['.webp', '.png', '.jpg', '.jpeg'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export function validateMediaUpload(filename: string, base64Content: string, categoryInput?: string): MediaUploadValidation {
  if (!filename || typeof filename !== 'string') {
    return { valid: false, error: 'Tên tệp không hợp lệ.', sanitizedFilename: '', category: 'general' };
  }

  const cleanName = filename.toLowerCase().replace(/[^a-z0-9._-]/g, '_');
  const ext = '.' + cleanName.split('.').pop();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: 'Chỉ chấp nhận định dạng ảnh WebP, PNG, JPG, JPEG.', sanitizedFilename: '', category: 'general' };
  }

  if (!base64Content || typeof base64Content !== 'string') {
    return { valid: false, error: 'Dữ liệu ảnh rỗng hoặc không đúng định dạng Base64.', sanitizedFilename: '', category: 'general' };
  }

  const raw = base64Content.replace(/^data:image\/[a-z]+;base64,/, '');
  const approxSize = (raw.length * 3) / 4;
  if (approxSize > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'Dung lượng ảnh vượt quá giới hạn cho phép (tối đa 5MB).', sanitizedFilename: '', category: 'general' };
  }

  let category: 'news' | 'products' | 'certificates' | 'general' = 'general';
  if (categoryInput === 'news' || categoryInput === 'products' || categoryInput === 'certificates') {
    category = categoryInput;
  }

  return {
    valid: true,
    sanitizedFilename: cleanName,
    category
  };
}
