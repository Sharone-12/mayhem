import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of (toastService.toasts$ | async) || []; track toast.id) {
        <div class="toast toast-{{ toast.type }}" (click)="toastService.remove(toast.id)">
          <span class="toast-icon">
            @switch (toast.type) {
              @case ('success') { &#x2713; }
              @case ('error') { &#x2717; }
              @case ('info') { &#x2139; }
            }
          </span>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      border-radius: var(--radius-md, 10px);
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      animation: slideInRight 0.3s ease;
      min-width: 250px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.4);
    }
    .toast-success { background: #1b5e20; border-left: 3px solid #00E676; }
    .toast-error { background: #b71c1c; border-left: 3px solid #FF1744; }
    .toast-info { background: #0d47a1; border-left: 3px solid #448AFF; }
    .toast-icon { font-size: 16px; }
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
