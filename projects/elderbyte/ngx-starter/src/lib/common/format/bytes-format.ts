
export class BytesFormat {

  private static units = [
    'bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB'
  ];

  public static format(bytes: number, precision = 2): string {
    if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) { return '?'; }

    let unit = 0;

    while (bytes >= 1024) {
      bytes /= 1024;
      unit++;
    }

    return bytes.toFixed(+precision) + ' ' + this.units[unit];
  }
}
