import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { CommonUtils } from 'app/_helpers';
import { GuestRoomService } from 'app/_services';
import { UsersService } from 'app/_services/users.service';
import moment from 'moment';
import { AddNewInvoiceComponent } from '../add-new-invoice/add-new-invoice.component';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EditComponent implements OnInit {


  addlimitForm : any = FormGroup;
  url_id :any;
  editBookingData : boolean = false;
  Editformdata : any;
  public invoices : FormArray;
  public invoiceinfo : any =[];
  title :any 
  currentdate = new Date();
  constructor(
    private fb : FormBuilder,
    private _userService   : UsersService,
    private _matSnackBar   : MatSnackBar,
    private router         : Router,
    private route          : ActivatedRoute,
    private _dialog        : MatDialog,
    private _guest_service : GuestRoomService,
  ) { 
    if (this.route.routeConfig.path == 'admin/guest-room/room/invoice/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
    }
      this.title = "Update Invoice";
  }

  ngOnInit(): void {
    this. setControls();
  }

  
   // set the default cotntrol to the user 
   setControls(){
    this.addlimitForm = this.fb.group({	
       
        due_date        : this.fb.control('',[Validators.required]),
        issue_date      : this.fb.control('',[Validators.required]),
        booking_id      : this.fb.control('',[Validators.required]),
        min_nights      : this.fb.control('',[Validators.required]),
        max_nights      : this.fb.control('',[Validators.required]),
        start_on        : this.fb.control('',[Validators.required]),
        discount        : this.fb.control(0,[Validators.required]),
        tax             : this.fb.control('',[Validators.required]),
        subtotal        : this.fb.control('',[Validators.required]),
        total           : this.fb.control('',[Validators.required]),
        amount_due      : this.fb.control('',[Validators.required]),
        payment_method  : this.fb.control('',[Validators.required]),
        status          : this.fb.control('',[Validators.required]),
        notes           : this.fb.control(''),

    });

    this._guest_service.getinvoicesContents(this.url_id).subscribe(response => {      
      let formData = response.invoiceinfo;
      this.Editformdata = response.invoiceinfo;
      this.invoiceinfo = response.invoiceinfo.invoiceitem;
      console.log("formData",formData);
      this.addlimitForm.patchValue(formData);
      this.addlimitForm.get('due_date').setValue(CommonUtils.getStringToDate(formData.due_date));
      this.addlimitForm.get('issue_date').setValue(CommonUtils.getStringToDate(formData.issue_date));
    });

  }
  removeImage(index){
    this.invoiceinfo.splice(index,1);
  }

  // send the email data 
  Sendemail(){
    let value={
        'id':this.url_id,
        'email':1,
    }
  
    this._guest_service.getinvoicesemail(value)
    .subscribe(response =>
    { 
        this.showSnackBar(response.message, 'CLOSE');
    },	
    error => {
        // Show the error message
        this.showSnackBar(error.message, 'RETRY');
    });
}  

  //  send the print data 
 printdata(){

    let params = [];

    params.push(    
        {
        'id': this.url_id
        },
        {
        'print':'1'
        },);
        this._guest_service.getPrintfromlistentries('guestroom/view/invoice',params);
}

    /** SHOW SNACK BAR */
   showSnackBar(message:string,buttonText:string){
      this._matSnackBar.open(message, buttonText, {
          verticalPosition: 'top',
          duration        : 2000
      });
  }

  EditData(index){
    let value = this.invoiceinfo[index]
    const dialogRef = this._dialog.open(AddNewInvoiceComponent, {
      disableClose: true,
      width: '50%',
      panelClass:'editrecords',
      data: {type :'edit',value}
    });
    dialogRef.afterClosed().subscribe(result => {      
      if(result != 'N'){
      let data ={
        amount: result.amount,
        booking_invoice_id: this.url_id,
        due_date: "",
        id: '',
        issue_date: "",
        name: result.name,
        quantity: result.quantity,
        unit_price: result.unit_price,
        description : result.description
      }
      this.invoiceinfo[index] =data;
    }
    });
  }
  AddRecord(){
  const dialogRef = this._dialog.open(AddNewInvoiceComponent, {
          disableClose: true,
          width: '50%',
          panelClass:'editrecords',
          data: {type :'add'}
        });
        dialogRef.afterClosed().subscribe(result => {          
          if(result != 'N'){
          let data ={
            amount: result.amount,
            booking_invoice_id: this.url_id,
            due_date: "",
            id: '',
            issue_date: "",
            name: result.name,
            quantity: result.quantity,
            unit_price: result.unit_price,
            description : result.description
           }           
          this.invoiceinfo.push(data);           
         }
        });
  }

  onsubmit(){

      let value = this.addlimitForm.value;
      let finaldata ={ 
                  id:this.url_id,
                  booking_id:this.Editformdata.booking_id,
                  issue_date:value.issue_date,
                  due_date:value.due_date,
                  status:value.status,
                  payment_method: value.payment_method,
                  subtotal: value.subtotal,
                  discount:value.discount,
                  tax: value.tax,
                  total: value.total,
                  amount_due: value.amount_due,
                  name: this.Editformdata.name,
                  email : this.Editformdata.email,
                  phone : this.Editformdata.phone,
                  notes:value.notes,
                  iteminfo : JSON.stringify(this.invoiceinfo)
            }

            this._guest_service.updateinvoice(finaldata).subscribe(response=>  { 
              this.showSnackBar(response.message, 'CLOSE');
          },	
          error => {
              // Show the error message
              this.showSnackBar(error.message, 'RETRY');
          });
          
      }

}
