import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-staff-biography',
  templateUrl: './staff-biography.component.html',
  styleUrls: ['./staff-biography.component.scss']
})
export class StaffBiographyComponent  implements OnInit{
    public biographydata:any = 'Biography not found.';
    /**
     * Constructor
     *
     * @param {MatDialogRef<StaffBiographyComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<StaffBiographyComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    )
    {
      
    }

    ngOnInit() {
      if(this.data){
        this.biographydata = this.data;
      }
    }

}
