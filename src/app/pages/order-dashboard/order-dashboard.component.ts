import { Component, OnInit } from '@angular/core';
import { OrderReport, OrderService } from 'src/app/services/order.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './order-dashboard.component.html',
  styleUrls: ['./order-dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  reports: OrderReport[] = [];
  loading = false;
  error: string | null = null;
  reportType: 'DAY' | 'MONTH' | 'YEAR' = 'MONTH';
  startDate = '2000-01-01';
  endDate = '2026-01-01';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.loading = true;
    this.error = null;

    this.orderService.getOrderReport(this.startDate, this.endDate, this.reportType)
      .subscribe({
        next: (data) => {
          this.reports = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'Cannot load report data.';
          this.loading = false;
        }
      });
  }
}
