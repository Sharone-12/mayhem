import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Company } from '../../../models';
import { InrCurrencyPipe } from '../../pipes/currency.pipe';
import { PercentChangePipe } from '../../pipes/percent-change.pipe';

@Component({
  selector: 'app-company-card',
  standalone: true,
  imports: [CommonModule, InrCurrencyPipe, PercentChangePipe],
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyCardComponent {
  @Input() company!: Company;
  @Input() showDetails: boolean = false;

  get percentChange(): number {
    if (!this.company.previousPrice || this.company.previousPrice === 0) return 0;
    return ((this.company.stockPrice - this.company.previousPrice) / this.company.previousPrice) * 100;
  }

  get priceDirection(): string {
    if (this.percentChange > 0) return 'positive';
    if (this.percentChange < 0) return 'negative';
    return 'neutral';
  }
}
