import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@/shared/modules/material/material.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { BehaviorSubject } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

interface SelectInterface {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.scss',
})
export class ProductsFormComponent {
  constructor(
    private productsService: ProductsService,
    private snackBar: MatSnackBar,
  ) {}

  chooseIngredients: SelectInterface[] = [];
  ingredients: any = [];
  currentCustomerId: number = 0;
  show: boolean = false;
  show$: BehaviorSubject<boolean> = this.productsService.show$;
  isInEditMode$: BehaviorSubject<boolean> = this.productsService.isInEditMode$;
  isInAddMode$: BehaviorSubject<boolean> = this.productsService.isInAddMode$;
  addForm: FormGroup = this.productsService.addForm;
  selectedIngredients: string[] = [];

  snackbarOptions: MatSnackBarConfig = {
    panelClass: 'snackbar',
    verticalPosition: 'top',
    duration: 5000,
  };
  // getSelectedIngredientsView(): string {
  //   return this.selectedIngredients.map(id => {
  //     const ingredient = this.chooseIngredients.find(ing => ing.value === id);
  //     return ingredient ? ingredient.viewValue : '';
  //   }).join(', ');
  // }

  getSelectedIngredientsView(): string {
    const lastSelectedIngredientId =
      this.selectedIngredients[this.selectedIngredients.length - 1];
    const ingredient = this.chooseIngredients.find(
      (ing) => ing.value === lastSelectedIngredientId,
    );
    return ingredient ? ingredient.viewValue : '';
  }

  onIngredientsSelectionChange(event: MatSelectChange) {
    this.selectedIngredients = event.value;
  }

  ngOnInit() {
    this.show$.subscribe((value: any) => (this.show = value));

    this.productsService.getIngredients().subscribe((data: any) => {
      this.chooseIngredients = data.items.map((item: any) => ({
        value: item.id.toString(),
        viewValue: item.name,
      }));
    });
  }

  enterAddMode(): void {
    this.show$.subscribe((value: any) => (this.show = !value));
    this.show$.next(this.show);
    this.productsService.isInAddMode$.next(true);
    this.productsService.isInEditMode$.next(false);
  }

  // addIngredient() {
  //   const name = Number(this.addForm.controls['ingredients'].value);
  //
  //   if (!this.ingredients.includes(name)) {
  //     this.ingredients.push(name);
  //   }
  //
  //   this.addForm.controls['ingredients'].reset();
  // }

  addProduct(): void {
    // const number = Number(this.addForm.controls['ingredients'].value);
    // if (!this.ingredients.includes(name)) {
    //   this.ingredients.push(name);
    // }

    const data = {
      ingredients: this.addForm.controls['ingredients'].value,
      name: this.addForm.controls['name'].value,
      description: this.addForm.controls['description'].value,
      price: Number(this.addForm.controls['price'].value),
    };

    this.ingredients = [];
    this.productsService.addProducts(data).subscribe({
      next: () => {
        this.snackBar.open('Success', 'Close', {
          ...this.snackbarOptions,
        });

        this.productsService.updateTable();
      },
      error: (error: any) => {
        console.error('Error: ', error);
        this.snackBar.open(`Error: ${error.name}  ${error.status}`, 'Close', {
          ...this.snackbarOptions,
        });
      },
    });
    this.productsService.show$.next(false);
    this.addForm.reset();
  }

  editProduct() {
    this.productsService.currentProductId$.subscribe(
      (value: number) => (this.currentCustomerId = value),
    );

    // const ingredientId = Number(this.addForm.controls['ingredients'].value);
    // this.selectedIngredients  = this.productsService.ingredients$
    //   .getValue()
    // .map((prod: any) => prod.name);

    // if (!this.ingredients.includes(ingredientId)) {
    //   this.ingredients.push(ingredientId);
    // }

    const data = {
      ingredients: this.addForm.controls['ingredients'].value,
      name: this.addForm.controls['name'].value,
      description: this.addForm.controls['description'].value,
      price: Number(this.addForm.controls['price'].value),
    };

    this.ingredients = [];
    this.productsService.editProducts(this.currentCustomerId, data).subscribe({
      next: () => {
        this.snackBar.open('Success', 'Close', {
          ...this.snackbarOptions,
        });

        this.productsService.updateTable();
      },
      error: (error: any) => {
        console.error('Error: ', error);
        this.snackBar.open(`Error: ${error.name}  ${error.status}`, 'Close', {
          ...this.snackbarOptions,
        });
      },
    });
    this.productsService.isInEditMode$.next(false);
    this.productsService.show$.next(false);
    this.addForm.reset();
  }

  getErrorRequiredMessage(): string {
    if (this.addForm.controls['name'].hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }
}
