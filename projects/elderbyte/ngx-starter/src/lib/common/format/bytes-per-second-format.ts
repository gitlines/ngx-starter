
export class BytesPerSecondFormat {

  public static formatBytesPerSecond(bytesPerSecond: number, precision: number = null): string {

    const KBPerSecond = bytesPerSecond / 1000;
    const MBPerSecond = KBPerSecond / 1000;
    const GBPerSecond = MBPerSecond / 1000;

    if (bytesPerSecond < 500) {
      return BytesPerSecondFormat.format(bytesPerSecond, precision || 0) + ' Bps';
    } else if (KBPerSecond < 999) {
      return BytesPerSecondFormat.format(KBPerSecond, precision || 0) + ' KBps';
    } else if (MBPerSecond < 999) {
      return BytesPerSecondFormat.format(MBPerSecond, precision || 2) + ' MBps';
    } else {
      return BytesPerSecondFormat.format(GBPerSecond, precision || 2) + ' GBps';
    }
  }

  public static formatAsBitsPerSecond(bytesPerSecond: number, precision: number = null): string {

    const bitsPerSecond = bytesPerSecond * 8;

    const KbPerSecond = bitsPerSecond / 1000;
    const MbPerSecond = KbPerSecond / 1000;
    const GbPerSecond = MbPerSecond / 1000;

    if (bitsPerSecond < 500) {
      return BytesPerSecondFormat.format(bitsPerSecond, precision || 0) + ' bps';
    } else if (KbPerSecond < 999) {
      return BytesPerSecondFormat.format(KbPerSecond, precision || 0) + ' Kbps';
    } else if (MbPerSecond < 999) {
      return BytesPerSecondFormat.format(MbPerSecond, precision || 2) + ' Mbps';
    } else {
      return BytesPerSecondFormat.format(GbPerSecond, precision || 2) + ' Gbps';
    }
  }

  private static format(value: number, precision: number): number {
    return +value.toFixed(precision);
  }

}
