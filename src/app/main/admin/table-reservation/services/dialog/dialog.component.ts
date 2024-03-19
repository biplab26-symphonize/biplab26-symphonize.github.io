import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  public serviceDialog: FormGroup;
  public Savedata        : any [];
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef < DialogComponent >,
     @Inject(MAT_DIALOG_DATA) public data: any) { }

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
