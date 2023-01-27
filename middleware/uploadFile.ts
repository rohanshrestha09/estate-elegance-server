import { getStorage } from 'firebase-admin/storage';
import { v4 as uuidv4 } from 'uuid';

const uploadFile = async (
  targetFile: Buffer,
  contentType: string,
  filename: string
) => {
  const storageRef = getStorage().bucket();

  const uuid = uuidv4();

  const file = storageRef.file(filename);

  await file
    .save(targetFile, {
      metadata: { contentType, firebaseStorageDownloadTokens: uuid },
    })
    .then(async () => await file.makePublic());

  return `https://firebasestorage.googleapis.com/v0/b/estate-elegance.appspot.com/o/${encodeURIComponent(
    file.name
  )}?alt=media&token=${uuid}`;
};

export default uploadFile;
