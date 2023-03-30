export { };

declare global {
  interface AudioData {
    blob: Blob | null;
    url: string | null;
  }
}