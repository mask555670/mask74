import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ICONS_DIR = 'public/icons';
const SOURCE_ICON = 'src/assets/logo.png'; // Исходное изображение логотипа

// Создаем директорию для иконок, если её нет
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// Размеры иконок для PWA
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Генерация иконок разных размеров
async function generateIcons() {
  try {
    // Проверяем наличие исходного изображения
    if (!fs.existsSync(SOURCE_ICON)) {
      console.error('Исходное изображение не найдено:', SOURCE_ICON);
      process.exit(1);
    }

    // Генерируем иконки всех размеров
    for (const size of ICON_SIZES) {
      const outputPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);
      
      await sharp(SOURCE_ICON)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`Создана иконка ${size}x${size}:`, outputPath);
    }

    // Генерируем иконки для быстрых действий
    await sharp(SOURCE_ICON)
      .resize(192, 192)
      .composite([{
        input: Buffer.from(
          '<svg><text x="50%" y="50%" text-anchor="middle" font-size="120" fill="white">+</text></svg>'
        ),
        top: 0,
        left: 0,
      }])
      .toFile(path.join(ICONS_DIR, 'add-workout.png'));

    await sharp(SOURCE_ICON)
      .resize(192, 192)
      .composite([{
        input: Buffer.from(
          '<svg><text x="50%" y="50%" text-anchor="middle" font-size="120" fill="white">📈</text></svg>'
        ),
        top: 0,
        left: 0,
      }])
      .toFile(path.join(ICONS_DIR, 'progress.png'));

    // Генерируем badge иконку
    await sharp(SOURCE_ICON)
      .resize(72, 72)
      .toFile(path.join(ICONS_DIR, 'badge-72x72.png'));

    console.log('Все иконки успешно созданы!');
  } catch (error) {
    console.error('Ошибка при генерации иконок:', error);
    process.exit(1);
  }
}

generateIcons(); 