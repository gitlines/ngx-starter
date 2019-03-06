import { Pipe, PipeTransform } from '@angular/core';
import {BytesFormat} from '../common/format/bytes-format';

/*
 * Convert bytes into largest possible unit.
 * Takes an precision argument that defaults to 2.
 * Usage:
 *   bytes | bytes:precision
 * Example:
 *   {{ 1024 |  bytes}}
 *   formats to: 1 KB
 */
@Pipe({name: 'bytes'})
export class BytesPipe implements PipeTransform {
    transform(bytes = 0, precision = 2): string {
        return BytesFormat.format(bytes, precision);
    }
}
