import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormGroup,FormArray,FormBuilder,Validators,FormControl} from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-term-condition',
  templateUrl: './term-condition.component.html',
  styleUrls: ['./term-condition.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TermConditionComponent implements OnInit {
  
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef < TermConditionComponent > , @Inject(MAT_DIALOG_DATA) public data: any) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
}
