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
  url: string = 'http://localhost:4000'
  nr: number = 0;


  getNrOfCustomers(){
    return this.httpClient.get(`${this.url}/customers/count`)
  }

  getNrOfEmployees(){
    return this.httpClient.get(`${this.url}/employees/count`)
  }

  getNrOfProducts(){
    return this.httpClient.get(`${this.url}/products/count`)
  }

  getNrOfOrders(){
    return this.httpClient.get(`${this.url}/orders/count`)
  }

  ngOnInit() {
    this.getNrOfCustomers().subscribe((res: any) => {
      this.pages[0].quantity = res
    })

    this.getNrOfEmployees().subscribe((res: any) => {
      this.pages[1].quantity = res
    })

    this.getNrOfProducts().subscribe((res: any) => {
      this.pages[2].quantity = res
    })

    this.getNrOfOrders().subscribe((res: any) => {
      this.pages[3].quantity = res
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
      icon: 'local_cafe',
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
