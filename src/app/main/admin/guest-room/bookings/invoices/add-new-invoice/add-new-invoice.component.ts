import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormGroup,FormArray,FormBuilder,Validators,FormControl} from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-add-new-invoice',
  templateUrl: './add-new-invoice.component.html',
  styleUrls: ['./add-new-invoice.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AddNewInvoiceComponent implements OnInit {

  public entriesDialog: FormGroup;
  public Savedata        : any [];
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef < AddNewInvoiceComponent > , @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.setControls();
   
  }
  setControls() {
    this.entriesDialog = this.fb.group({
      quantity: this.fb.control(''), 
      name: this.fb.control(''),      
      unit_price: this.fb.control(''),   
      amount: this.fb.control(''),  
      description : this.fb.control('')     
    });
    if(this.data.type == 'edit'){
      this.pathchvalue(this.data.value);
    }
  }

  pathchvalue(value){
    this.entriesDialog.patchValue(value);

  }

  onYesClick() {
    this.dialogRef.close('Y');
}

onNoClick(): void {
    this.dialogRef.close('N');
}
onSubmitRecBooking() {
  if(  this.entriesDialog.valid){
    this.dialogRef.close(this.entriesDialog.value);
  }
  
}
}
