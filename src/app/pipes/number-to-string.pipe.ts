import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToString'
})
export class NumberToStringPipe implements PipeTransform {
  transform(value: number | undefined): string | undefined {
    if (!value) return undefined;
    return String(value);
  }
}
