/**
 * Load server/.env so RESEND_API_KEY etc. are available before any other app code.
 * Must be imported first in index.ts so it runs before routes (and emailService) load.
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });
