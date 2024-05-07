import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mdlCurrency',
  standalone: true,
})
export class MdlCurrencyPipe implements PipeTransform {
  transform(value: number, fractionSize: number = 2): string {
    const formattedValue = Number(value).toFixed(fractionSize);
    return `${formattedValue} MDL`;
  }
}
