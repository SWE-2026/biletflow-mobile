import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function shareFile(fileName: string, mimeType: string, base64: string) {
  if (!(await Sharing.isAvailableAsync())) throw new Error('Sharing is not available on this device.');

  const safeName = fileName.replace(/[/\\?%*:|"<>]/g, '-') || 'download';
  const file = new File(Paths.cache, safeName);
  if (file.exists) file.delete();
  file.create();
  file.write(base64, { encoding: 'base64' });

  await Sharing.shareAsync(file.uri, { mimeType, dialogTitle: safeName });
}
