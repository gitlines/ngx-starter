import { PipeTransform } from '@angular/core';
export declare class BytesPipe implements PipeTransform {
    private units;
    transform(bytes?: number, precision?: number): string;
}
