import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { CostsService } from './services/costs.service';
import { combineLatest, forkJoin } from 'rxjs';
import { MdlCurrencyPipe } from '@/shared/pipes/mdl-currency.pipe';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import { MaterialModule } from '@/shared/modules/material/material.module';

@Component({
  selector: 'app-costs',
  standalone: true,
  imports: [CommonModule, MdlCurrencyPipe, MaterialModule],
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

  exportReport() {
    interface jsPDFWithPlugin extends jsPDF {
      autoTable: (options: UserOptions) => jsPDF;
    }

    const margin = {
      top: 30,
      bottom: 30,
      left: 40,
      right: 30,
    };

    let startY = 70;

    forkJoin([
      this.costsService.getCustomers(),
      this.costsService.getEmployees(),
      this.costsService.getOrdersModified(),
      this.costsService.getProducts(),
      this.costsService.getIngredients(),
    ]).subscribe(([customers, employees, orders, products, ingredients]) => {
      const doc = new jsPDF('p', 'pt') as jsPDFWithPlugin;

      doc.setFont('Times New Roman');
      doc.setFontSize(18);
      doc.text('Raport', margin.left, 30);

      doc.setFontSize(16);
      doc.text('Customers', margin.left, 60);

      const customerHeaders = [
        ['ID', 'First Name', 'Last Name', 'Phone', 'Email'],
      ];
      const customerRows = customers.items.map((item: any) => [
        item.id,
        item.firstName,
        item.lastName,
        item.phone,
        item.email,
      ]);

      doc.autoTable({
        head: customerHeaders,
        body: customerRows,
        startY: startY,
        theme: 'grid',
      });
      startY += (customerRows.length + 1) * 20 + 40;
      doc.text('Employees', margin.left, startY);
      startY += 10;
      const employeeHeaders = [
        [
          'ID',
          'First Name',
          'Last Name',
          'Address',
          'Phone',
          'Email',
          'Salary',
        ],
      ];
      const employeeRows = employees.items.map((item: any) => [
        item.id,
        item.firstName,
        item.lastName,
        item.address,
        item.phone,
        item.email,
        item.salary,
      ]);

      doc.autoTable({
        head: employeeHeaders,
        body: employeeRows,
        startY: startY,
        theme: 'grid',
      });

      startY += (employeeRows.length + 1) * 20 + 40;
      doc.text('Orders', margin.left, startY);
      startY += 10;
      const orderHeaders = [
        ['Order ID', 'Customer Name', 'Order Date', 'Products', 'Total Price'],
      ];
      const orderRows = orders.map((order: any) => {
        console.log(order);
        const customerName = `${order.customer.name}`;
        const orderDate = new Date(order.date).toLocaleDateString();

        const products = order.products
          .map((product: any) => {
            return `${product.quantity} x ${product.name}`;
          })
          .join(', ');

        return [order.id, customerName, orderDate, products, order.totalPrice];
      });

      doc.autoTable({
        head: orderHeaders,
        body: orderRows,
        startY: startY,
        theme: 'grid',
      });

      startY += (orderRows.length + 1) * 20 + 40;
      doc.text('Products', margin.left, startY);
      startY += 10;
      const productHeaders = [
        ['ID', 'Name', 'Description', 'Price', 'Ingredients'],
      ];
      const productRows = products.items.map((product: any) => {
        const ingredients = product.ingredients
          .map((ingredient: any) => ingredient.name)
          .join(', ');

        return [
          product.id,
          product.name,
          product.description,
          product.price,
          ingredients,
        ];
      });

      doc.autoTable({
        head: productHeaders,
        body: productRows,
        startY: startY,
        theme: 'grid',
      });

      startY += (productRows.length + 1) * 20 + 40;
      doc.text('Ingredients', margin.left, startY);
      startY += 10;
      const ingredientHeaders = [['ID', 'Name']];
      const ingredientRows = ingredients.items.map((ingredient: any) => [
        ingredient.id,
        ingredient.name,
      ]);

      doc.autoTable({
        head: ingredientHeaders,
        body: ingredientRows,
        startY: startY,
        theme: 'grid',
      });

      doc.save('raport.pdf');
    });
  }
}
