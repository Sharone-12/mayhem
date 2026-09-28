import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'inrCurrency', standalone: true })
export class InrCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '₹0';
    const isNegative = value < 0;
    const absValue = Math.abs(value);

    // Indian number formatting
    const formatted = absValue.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    });

    return (isNegative ? '-₹' : '₹') + formatted;
  }
}
