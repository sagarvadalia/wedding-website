import { genUploader } from 'uploadthing/client';
import type { FileRouter } from 'uploadthing/types';

// Minimal type for our routes - must match server/src/uploadthing.ts
type OurFileRouter = FileRouter & {
  guestbookPhoto: unknown;
  guestbookAudio: unknown;
};

const getUploadUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/uploadthing`;
  }
  return '/api/uploadthing';
};

export const { uploadFiles } = genUploader<OurFileRouter>({
  url: getUploadUrl(),
});
