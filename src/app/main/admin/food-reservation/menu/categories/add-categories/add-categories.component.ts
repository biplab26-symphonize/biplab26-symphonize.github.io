import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FoodReservationService } from 'app/_services';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-categories',
  templateUrl: './add-categories.component.html',
  styleUrls: ['./add-categories.component.scss'],
  animations: fuseAnimations
})
export class AddCategoriesComponent implements OnInit {
  title: string;
  public addCategories: FormGroup;
  public editCategories: boolean = false;
  public url_id: any;
  public isSubmit :  boolean = false ;

  constructor(private fb: FormBuilder, private foodReservation: FoodReservationService, private _matSnackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) {
    this.title = 'Food Reservation Categories';
    if (this.route.routeConfig.path == 'admin/food-reservation/categories/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editCategories = true;
    }
    this.url_id ? this.title = "Update Categories" : this.title = "New Categories";
   }

  ngOnInit() {
    this.setControls();
  }
  setControls(){
    this.addCategories = this.fb.group({
      category_name: this.fb.control('',[Validators.required]),
      status: this.fb.control('',[Validators.required]),
      id: this.editCategories == true ? this.url_id : '',
    });
    if (this.route.routeConfig.path == 'admin/food-reservation/categories/edit/:id') {
      this.fillCategoriesValues();
    }
  }
  fillCategoriesValues() {
    this.foodReservation.getCategoriesContent(this.url_id).subscribe(response => {
      let formData = response.categoryinfo;
      this.addCategories.patchValue(formData);
    });
  }
  onSubmit() {
    this.isSubmit = true;
    let extras_data = this.addCategories.value;
    this.foodReservation.addCategories(extras_data, this.editCategories).subscribe(response => {
      this._matSnackBar.open(response.message, 'CLOSE', {
        verticalPosition: 'top',
        duration: 2000
      });
      this.router.navigate(['/admin/food-reservation/menu/categories/list']);
    },
      error => {
        // Show the error message
        this.isSubmit = false;
        this._matSnackBar.open(error.message, 'Retry', {
          verticalPosition: 'top',
          duration: 2000
        });
      });
  }

  Cancel(){
    this.router.navigate(['/admin/food-reservation/menu/categories/list']);
  }

}
