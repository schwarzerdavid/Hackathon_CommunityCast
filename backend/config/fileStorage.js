import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Read data from a JSON file
 */
export function readData(filename) {
  const filepath = path.join(DATA_DIR, filename);

  if (!fs.existsSync(filepath)) {
    return [];
  }

  try {
    const data = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

/**
 * Write data to a JSON file
 */
export function writeData(filename, data) {
  const filepath = path.join(DATA_DIR, filename);

  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

/**
 * Initialize file storage
 */
export function initializeFileStorage() {
  console.log('📁 File storage initialized at:', DATA_DIR);

  // Create empty files if they don't exist
  if (!fs.existsSync(path.join(DATA_DIR, 'businesses.json'))) {
    writeData('businesses.json', []);
  }

  if (!fs.existsSync(path.join(DATA_DIR, 'advertisements.json'))) {
    writeData('advertisements.json', []);
  }

  console.log('✅ File storage ready');
}

/**
 * Close file storage (for compatibility with MongoDB interface)
 */
export function closeFileStorage() {
  console.log('📁 File storage closed');
  return Promise.resolve();
}
