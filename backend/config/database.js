import { initializeFileStorage, closeFileStorage } from './fileStorage.js';

export async function connectDatabase() {
  try {
    initializeFileStorage();
    console.log('✅ File-based storage connected successfully');
  } catch (error) {
    console.error('❌ File storage initialization failed:', error);
    process.exit(1);
  }
}

export function closeDatabase() {
  return closeFileStorage();
}
