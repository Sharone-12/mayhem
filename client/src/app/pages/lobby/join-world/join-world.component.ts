import { Component, inject, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-join-world',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './join-world.component.html',
  styleUrl: './join-world.component.scss'
})
export class JoinWorldComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);

  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef<HTMLInputElement>>;

  codeDigits: string[] = ['', '', '', '', '', ''];
  error = '';
  isSubmitting = false;

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code');
    if (code && code.length === 6) {
      this.codeDigits = code.toUpperCase().split('');
    }
  }

  get roomCode(): string {
    return this.codeDigits.join('');
  }

  get isValid(): boolean {
    return this.roomCode.length === 6 && this.codeDigits.every(d => d.length === 1);
  }

  onInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (value.length > 0) {
      this.codeDigits[index] = value.charAt(0);
      input.value = this.codeDigits[index];

      // Auto-focus next input
      if (index < 5) {
        const inputs = this.codeInputs.toArray();
        inputs[index + 1]?.nativeElement.focus();
      }
    } else {
      this.codeDigits[index] = '';
    }

    this.error = '';
  }

  onKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.codeDigits[index] && index > 0) {
      const inputs = this.codeInputs.toArray();
      inputs[index - 1]?.nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = (event.clipboardData?.getData('text') || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (pasted.length >= 6) {
      this.codeDigits = pasted.slice(0, 6).split('');
    }
  }

  joinWorld(): void {
    if (!this.isValid || this.isSubmitting) return;
    this.isSubmitting = true;
    this.error = '';

    this.apiService.joinWorld(this.roomCode).subscribe({
      next: world => this.router.navigate(['/lobby', world._id]),
      error: () => {
        this.error = 'Invalid room code. Please try again.';
        this.isSubmitting = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
