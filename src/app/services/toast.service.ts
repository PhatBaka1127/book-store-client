// toast.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  text: string;
  isSuccess: boolean;
  duration?: number; 
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messagesSubject = new BehaviorSubject<ToastMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private counter = 0;

  showMessage(text: string, isSuccess: boolean = true, duration: number = 3000) {
    const id = this.counter++;
    const toast: ToastMessage = { id, text, isSuccess, duration };
    this.messagesSubject.next([...this.messagesSubject.value, toast]);

    // tự động xóa toast
    setTimeout(() => this.removeToast(id), duration);
  }

  showFromResponse(response: any) {
    const isSuccess = !!response.result;
    const message = response.message || (isSuccess ? 'Success' : 'Error');
    this.showMessage(message, isSuccess);
  }

  removeToast(id: number) {
    this.messagesSubject.next(this.messagesSubject.value.filter(t => t.id !== id));
  }
}