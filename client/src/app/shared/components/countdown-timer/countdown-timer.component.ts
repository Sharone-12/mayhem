import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-countdown-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountdownTimerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() endTime: Date | null = null;
  @Input() totalDuration: number = 0; // total duration in seconds for progress calculation
  @Output() expired = new EventEmitter<void>();

  remainingSeconds: number = 0;
  progressPercent: number = 100;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['endTime']) {
      this.startTimer();
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  get displayTime(): string {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  get timerClass(): string {
    if (this.remainingSeconds <= 10) return 'danger';
    if (this.remainingSeconds <= 30) return 'warning';
    return 'normal';
  }

  private startTimer(): void {
    this.clearTimer();
    if (!this.endTime) return;

    this.updateRemaining();

    this.intervalId = setInterval(() => {
      this.updateRemaining();
      this.cdr.markForCheck();
    }, 1000);
  }

  private updateRemaining(): void {
    if (!this.endTime) {
      this.remainingSeconds = 0;
      this.progressPercent = 0;
      return;
    }

    const now = Date.now();
    const end = this.endTime.getTime();
    const diff = Math.max(0, Math.floor((end - now) / 1000));
    this.remainingSeconds = diff;

    if (this.totalDuration > 0) {
      this.progressPercent = (diff / this.totalDuration) * 100;
    } else {
      this.progressPercent = diff > 0 ? 100 : 0;
    }

    if (diff <= 0) {
      this.clearTimer();
      this.expired.emit();
    }
  }

  private clearTimer(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
