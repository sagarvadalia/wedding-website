import { createUploadthing, type FileRouter } from 'uploadthing/express';

const f = createUploadthing();

const uploadRouter: FileRouter = {
  guestbookPhoto: f({
    image: {
      maxFileSize: '2MB',
      maxFileCount: 1,
    },
  }).onUploadComplete(() => {
    // Optional: persist to DB or notify - guestbook create handles storage
  }),

  guestbookAudio: f({
    audio: {
      maxFileSize: '2MB',
      maxFileCount: 1,
    },
  }).onUploadComplete(() => {
    // Optional: persist to DB or notify - guestbook create handles storage
  }),
};

export { uploadRouter };
export type UploadRouter = typeof uploadRouter;
