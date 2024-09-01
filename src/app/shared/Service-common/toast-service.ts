import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts = [];
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  toasterMsg(message: string, type: string): void {
    if (type === 'error') {
      return this.show(message, { classname: 'bg-danger text-white text-center', delay: 5000 });
    } else if (type === 'success') {
      return this.show(message, { classname: 'bg-success text-white text-center', delay: 5000 });
    }
  }
}
