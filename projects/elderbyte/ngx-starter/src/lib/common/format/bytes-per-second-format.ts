
export class BytesPerSecondFormat {

  public static formatBytesPerSecond(bytesPerSecond: number): string {

    const KBPerSecond = bytesPerSecond / 1000;
    const MBPerSecond = KBPerSecond / 1000;
    const GBPerSecond = MBPerSecond / 1000;

    if (bytesPerSecond < 500) {
      return bytesPerSecond + ' Bps';
    } else if (KBPerSecond < 999) {
      return KBPerSecond + ' KBps';
    } else if (MBPerSecond < 999) {
      return MBPerSecond + ' MBps';
    } else {
      return GBPerSecond + ' GBps';
    }
  }

  public static formatAsBitsPerSecond(bytesPerSecond: number): string {

    const bitsPerSecond = bytesPerSecond * 8;

    const KbPerSecond = bitsPerSecond / 1000;
    const MbPerSecond = KbPerSecond / 1000;
    const GbPerSecond = MbPerSecond / 1000;

    if (bitsPerSecond < 500) {
      return bitsPerSecond + ' bps';
    } else if (KbPerSecond < 999) {
      return KbPerSecond + ' Kbps';
    } else if (MbPerSecond < 999) {
      return MbPerSecond + ' Mbps';
    } else {
      return GbPerSecond + ' Gbps';
    }
  }

}
