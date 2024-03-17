import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { CostsService } from './costs.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-costs',
  standalone: true,
  imports: [CommonModule],
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
  public chart2: any;

  constructor(private costsService: CostsService) {}

  ngOnInit(): void {
    combineLatest([
      this.costsService.salaries$,
      this.costsService.ingredients$,
      this.costsService.revenue$,
    ]).subscribe(([salaries, ingredients, revenue]) => {
      this.salary = salaries;
      this.ingredients = ingredients;
      this.revenue = revenue;

      this.monthlyCosts = salaries + ingredients;
      this.monthlyProfits = revenue - this.monthlyCosts;

      this.destroyChart(this.chart);
      this.destroyChart(this.chart2);

      this.createChart();
      this.createChart2();
    });

    this.costsService.getCosts();
    this.costsService.getRevenue();
  }

  ngOnDestroy(): void {
    this.destroyChart(this.chart);
    this.destroyChart(this.chart2);
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

  createChart2() {
    this.destroyChart(this.chart2);
    this.chart2 = new Chart('cost-chart', {
      type: 'pie',

      data: {
        // values on X-Axis
        labels: ['Salaries', 'Ingredients'],
        datasets: [
          {
            data: [this.salary, this.ingredients],
            backgroundColor: ['#222273', '#5b94de'],
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
