import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'percentChange', standalone: true })
export class PercentChangePipe implements PipeTransform {
  transform(value: number | null | undefined, format: 'text' | 'class' = 'text'): string {
    if (value == null) return format === 'class' ? 'neutral' : '0.00%';

    if (format === 'class') {
      if (value > 0) return 'positive';
      if (value < 0) return 'negative';
      return 'neutral';
    }

    const prefix = value > 0 ? '+' : '';
    return `${prefix}${value.toFixed(2)}%`;
  }
}
