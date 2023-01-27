import { getStorage } from 'firebase-admin/storage';

const deleteFile = async (filename: string): Promise<void> => {
  const storageRef = getStorage().bucket();

  await storageRef.file(filename).delete();
};

export default deleteFile;
