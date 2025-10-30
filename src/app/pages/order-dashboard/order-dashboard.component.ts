import { Component, OnInit } from "@angular/core";
import { OrderReport, OrderService } from "src/app/services/order.service";
import { ChartData, ChartOptions } from "chart.js";

@Component({
  selector: "app-dashboard",
  templateUrl: "./order-dashboard.component.html",
  styleUrls: ["./order-dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  reports: OrderReport[] = [];
  loading = false;
  reportType: "DAY" | "MONTH" | "YEAR" = "DAY";
  startDate = "2000-01-01";
  endDate = "2026-01-01";

  chartData: ChartData<"bar"> = {
    labels: [],
    datasets: [],
  };

  chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true },
    },
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "📊 Orders, Quantity & Revenue (₫)" },
    },
  };

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.loading = true;

    this.orderService
      .getOrderReport(this.startDate, this.endDate, this.reportType)
      .subscribe({
        next: (data) => {
          this.reports = data;
          this.updateChart();
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
  }

  updateChart(): void {
    const labels = this.reports.map((r) =>
      new Date(r.date).toLocaleDateString()
    );
    const orders = this.reports.map((r) => r.orders);
    const quantity = this.reports.map((r) => r.quantity);
    const revenue = this.reports.map((r) => r.revenue);
    this.chartOptions = {
      responsive: true,
      scales: {
        x: { stacked: false },
        y: {
          beginAtZero: true,
          position: "left",
          title: { display: true, text: "Orders / Quantity" },
        },
        y1: {
          beginAtZero: true,
          position: "right",
          grid: { drawOnChartArea: false },
          title: { display: true, text: "Revenue (₫)" },
        },
      },
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "📊 Orders, Quantity & Revenue" },
      },
    };

    this.chartData = {
      labels,
      datasets: [
        {
          label: "Orders",
          data: orders,
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          yAxisID: "y", 
        },
        {
          label: "Quantity",
          data: quantity,
          backgroundColor: "rgba(255, 206, 86, 0.7)",
          borderColor: "rgba(255, 206, 86, 1)",
          borderWidth: 1,
          yAxisID: "y", 
        },
        {
          label: "Revenue (₫)",
          data: revenue,
          backgroundColor: "rgba(75, 192, 192, 0.7)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          yAxisID: "y1", 
        },
      ],
    };
  }
}
