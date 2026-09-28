import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts: Toast[] = [];
  private nextId = 0;
  toasts$ = new BehaviorSubject<Toast[]>([]);

  success(message: string) {
    this.addToast('success', message);
  }

  error(message: string) {
    this.addToast('error', message);
  }

  info(message: string) {
    this.addToast('info', message);
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.toasts$.next([...this.toasts]);
  }

  private addToast(type: Toast['type'], message: string) {
    const toast: Toast = { id: this.nextId++, type, message };
    this.toasts.push(toast);
    this.toasts$.next([...this.toasts]);
    setTimeout(() => this.remove(toast.id), 3000);
  }
}
