import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Company } from '../../../models';
import { InrCurrencyPipe } from '../../pipes/currency.pipe';
import { PercentChangePipe } from '../../pipes/percent-change.pipe';

@Component({
  selector: 'app-stock-ticker',
  standalone: true,
  imports: [CommonModule, InrCurrencyPipe, PercentChangePipe],
  templateUrl: './stock-ticker.component.html',
  styleUrls: ['./stock-ticker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockTickerComponent {
  @Input() companies: Company[] = [];
  @Output() companyClicked = new EventEmitter<string>();

  getPercentChange(company: Company): number {
    if (!company.previousPrice || company.previousPrice === 0) return 0;
    return ((company.stockPrice - company.previousPrice) / company.previousPrice) * 100;
  }

  onCompanyClick(companyId: string): void {
    this.companyClicked.emit(companyId);
  }

  trackByCompanyId(_index: number, company: Company): string {
    return company.id;
  }
}
