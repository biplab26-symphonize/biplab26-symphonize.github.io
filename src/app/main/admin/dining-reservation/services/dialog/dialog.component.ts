import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormGroup,FormArray,FormBuilder,Validators,FormControl} from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class DialogComponent implements OnInit {
  public serviceDialog: FormGroup;
  public Savedata        : any [];
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef < DialogComponent > , @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.setControls();
  }
  setControls() {
    this.serviceDialog = this.fb.group({
      sendmail: this.fb.control(''),     
    });
  }
  onYesClick() {
    this.dialogRef.close('Y');
}

onNoClick(): void {
    this.dialogRef.close('N');
}
onSubmitRecBooking() {
  this.dialogRef.close(this.serviceDialog.value);
}
}
