import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from "../../shared/modules/material/material.module";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
constructor(private httpClient: HttpClient) {}
  url: string = 'http://localhost:8082'
  nr: number = 0;

  getDashboardInfo(){
    return this.httpClient.get(`${this.url}/dashboard`)
  }

  ngOnInit() {
    this.getDashboardInfo().subscribe((res:any) => {
      this.pages[0].quantity = res.customers
      this.pages[1].quantity = res.employees
      this.pages[2].quantity = res.products
      this.pages[3].quantity = res.orders
    })
  }

  pages: PagesInterface[] = [
    {
      name: 'Customers',
      quantity: this.nr,
      icon: 'group'
    },
    {
      name: 'Employees',
      quantity: this.nr,
      icon: 'contact_mail',
    },
    {
      name: 'Products',
      quantity: this.nr,
      icon: 'fastfood',
    },
    {
      name: 'Orders',
      quantity: this.nr,
      icon: 'receipt_long',
    },
  ];
}

interface PagesInterface {
  name: string;
  quantity: number;
  icon: string;
}
