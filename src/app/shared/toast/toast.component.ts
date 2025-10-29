// toast.component.ts
import { Component, OnInit } from '@angular/core';
import { ToastMessage, ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  toasts: ToastMessage[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.messages$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  closeToast(id: number) {
    this.toastService.removeToast(id);
  }
}
