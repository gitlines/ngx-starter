import { Pipe, PipeTransform } from '@angular/core';


/*
 * Convert milligrams into largest possible unit.
 * Takes an precision argument that defaults to 2.
 * Usage:
 *   weight | weight:unit:precision
 * Example:
 *   {{ 1024 |  weight:'g':2}}
 *   formats to: 1.02kg
 */
@Pipe({name: 'weight'})
export class WeightPipe implements PipeTransform {

    transform(value = 0, unit = 'kg', precision = 2): string {

        if (isNaN(parseFloat(String(value))) || !isFinite(value)) { return '?'; }

        let mg = 0;
        switch (unit) {
            case 'mg': mg = value; break;
            case 'g' : mg = value * 1000; break;
            case 'kg': mg = value * 1000 * 1000; break;
            case 't' : mg = value * 1000 * 1000 * 1000; break;
            default: throw new Error(`Unknown input unit in weight pipe: '${unit}'`);
        }

        const g = mg / 1000.0;
        const kg = g / 1000.0;
        const t = kg / 1000.0;

        if (t > 1) {
            return t.toFixed(+precision) + 't';
        } else if (kg > 1) {
            return kg.toFixed(+precision) + 'kg';
        } else if (g > 1) {
            return kg.toFixed(+precision) + 'g';
        } else {
            return mg.toFixed(+precision) + 'mg';
        }
    }
}


