import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormGroup,FormArray,FormBuilder,Validators,FormControl} from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-edit-restriction',
  templateUrl: './edit-restriction.component.html',
  styleUrls: ['./edit-restriction.component.scss']
})
export class EditRestrictionComponent implements OnInit {

  public entriesDialog: FormGroup;
  public Savedata        : any [];
  public userName: any;
  constructor(private fb: FormBuilder,
              public dialogRef: MatDialogRef <EditRestrictionComponent>,
             @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.setControls();
    this.userName = localStorage.getItem("second_user");
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
