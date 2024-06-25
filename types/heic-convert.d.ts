declare module 'heic-convert' {
    export function convert(options: {
      buffer: Buffer;
      format: 'JPEG' | 'PNG';
      quality: number;
    }): Promise<Buffer>;
  }