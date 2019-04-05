import {Sort} from '../data/sort';
import {ComparatorBuilder} from '../data/field-comparator';


export class SortUtil {

  public static sortData<T>(data: T[], sorts: Sort[]): T[] {

    if (sorts && sorts.length > 0) {
      const copy = [...data];
      const sortFields = sorts.map(s => (s.dir === 'desc' ? '-' : '') +  s.prop);
      return copy.sort(ComparatorBuilder.fieldSort(...sortFields));
    } else {
      return data;
    }
  }

}
