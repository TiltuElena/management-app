import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { CostsService } from './services/costs.service';
import { combineLatest } from 'rxjs';
import { MdlCurrencyPipe } from '../../shared/pipes/mdl-currency.pipe';

@Component({
  selector: 'app-costs',
  standalone: true,
  imports: [CommonModule, MdlCurrencyPipe],
  templateUrl: './costs.component.html',
  styleUrl: './costs.component.scss',
})
export class CostsComponent implements OnInit, OnDestroy {
  monthlyProfits: number = 0;
  monthlyCosts: number = 0;
  salary: number = 0;
  ingredients: number = 0;
  revenue: number = 0;

  public chart: any;

  constructor(private costsService: CostsService) {}

  ngOnInit(): void {
    combineLatest([
      this.costsService.salaries$,
      this.costsService.revenue$,
    ]).subscribe(([salaries, revenue]) => {
      this.salary = salaries;
      this.revenue = revenue;

      this.monthlyCosts = salaries;
      this.monthlyProfits = revenue - this.monthlyCosts;

      this.destroyChart(this.chart);

      this.createChart();
    });

    this.costsService.getCosts();
    this.costsService.getRevenue();
  }

  ngOnDestroy(): void {
    this.destroyChart(this.chart);
  }

  destroyChart(chart: any): void {
    if (chart) {
      chart.data = [];
      chart.destroy();
    }
  }

  createChart() {
    this.destroyChart(this.chart);

    this.chart = new Chart('cost-revenue-chart', {
      type: 'pie',

      data: {
        // values on X-Axis
        labels: ['Costs', 'Revenue'],
        datasets: [
          {
            data: [this.monthlyCosts, this.revenue],
            backgroundColor: ['#5373a6', '#24263a'],
            hoverOffset: 30,
          },
        ],
      },
      options: {
        aspectRatio: 2.7,
        responsive: true,
        maintainAspectRatio: false,
        radius: '90%',
      },
    });
  }
}
