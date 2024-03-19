import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormGroup,FormArray,FormBuilder,Validators,FormControl} from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-take-over',
  templateUrl: './take-over.component.html',
  styleUrls: ['./take-over.component.scss']
})
export class TakeOverComponent implements OnInit {

  public entriesDialog: FormGroup;
  public Savedata        : any [];
  public userName: any;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef < TakeOverComponent > , @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.setControls();
    this.userName = localStorage.getItem("first_user");
  }
  setControls() {
    this.entriesDialog = this.fb.group({
      pagebreak: this.fb.control(''),     
      adminnotes: this.fb.control(''),     
    });
  }
  onYesClick() {
    this.dialogRef.close('Y');
}

onNoClick(string): void {
    this.dialogRef.close(string);
}
onSubmitRecBooking() {
  this.dialogRef.close(this.entriesDialog.value);
}

}
