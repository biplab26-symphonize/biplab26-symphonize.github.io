import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, tap, switchMap } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatService, UsersService } from 'app/_services';
import { CommonUtils } from 'app/_helpers';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {

  dialogTitle: string = 'Create Group';
  groupForm: FormGroup;
  groupMembers: any[]=[];
  removable = true;
  selectable = true;
  public isSubmit : boolean = false;
  inviteArray: any[] = [];
  filteredUsers: any[] = [];
  // Private
  private _unsubscribeAll: Subject<any>;
  constructor(
    private _formBuilder: FormBuilder,
    private _matSnackBar: MatSnackBar,
    private _userService: UsersService,
    private _chatService: ChatService,
    public dialogRef: MatDialogRef<CreateGroupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    //Declare Sorting Form
    this.dialogTitle   = 'Create Group'; 
    
    this.groupForm = this._formBuilder.group({
      group_id      : [''],
      group_name    : ['',Validators.required],
      created_by    : [this.data.created_by,Validators.required ],   
      status        : ['A',Validators.required],
      invited_by    : [this.data.created_by,Validators.required ],
      invite_text   : ['',Validators.required],
      invite_name   : [''],
      invited_to     : [this.inviteArray,Validators.required]               
    });
    if(this.data.group){
      this.patchFormValues();
    }
    
    this.setIgnorIds();

    this.groupForm
    .get('invite_name').valueChanges
    .pipe(
      debounceTime(300),
      tap(),
      switchMap(value => this._userService.getUsers({'searchKey': value,user_id:this.data.created_by,type:'groupinvite',ignore_ids:this.groupMembers.join(',')}))
    )
    .subscribe(users => this.filteredUsers = users.data);
  }
  patchFormValues(){
    this.groupForm.patchValue(this.data.group);
  }

  onSubmit(event : Event){
    event.preventDefault();
		event.stopPropagation();
    if(this.groupForm.valid==true){
      if(this.data.type=='create'){
        this.createGroup(); //Create Group
      }
      else if(this.data.type=='invite'){
        this.sendInvite(); // Send Invite to join Group
      }      
    }
  }
  //Create Group
  createGroup(){
    const groupInfo = {
      group_name:this.groupForm.get('group_name').value,
      created_by:this.groupForm.get('created_by').value,
      invited_to:this.groupForm.get('invited_to').value,
      invite_text:this.groupForm.get('invite_text').value,
      status:this.groupForm.get('status').value
    };
    this.isSubmit = true;
    this._chatService.createGroup(groupInfo)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(group=>{
      if(group.status==200){
        this.isSubmit = false;
        this.showSnackBar(group.message,'OK');
        this.dialogRef.close(this.data.type);
      }
    });
  }
  //Send Invite
  sendInvite(){
    const inviteInfo = {
      group_id:this.data.group.group_id,
      invite_text:this.groupForm.get('invite_text').value,
      invited_by:this.groupForm.get('invited_by').value,
      invited_to:this.groupForm.get('invited_to').value,
      status:'P'
    };
    this.isSubmit = true;
    this._chatService.sendInvite(inviteInfo)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(invite=>{
      if(invite.status==200){
        this.isSubmit = false;
        this.showSnackBar(invite.message,'OK');
        this.groupForm.reset();
        this.dialogRef.close(this.data.type);
      }
    });
  }
  setFormfields(userInfo:any){    
    if(userInfo.option.value){
      this.groupForm.get('invite_name').reset();  
      //create invite to array
      this.inviteArray.push({id:userInfo.option.value.id,first_name:userInfo.option.value.first_name,last_name:userInfo.option.value.last_name,email:userInfo.option.value.email});
      this.groupForm.get('invited_to').setValue(this.inviteArray.map(item=>{return item.id}));
    }
  } 
  //Remove invitee
  removeInvite(invite: any): void {
    const index = this.inviteArray.findIndex(invitem=>{return invitem.id===invite.id});
    if (index >= 0) {
      this.inviteArray.splice(index, 1);
      this.groupForm.get('invited_to').setValue(this.inviteArray.map(item=>{return item.id}));
    }
  }
  //SetIgnoreIds
  setIgnorIds(){
    if(this.data.group && this.data.group.memberinfo){
      //Get Group Members Ids and avoid those ids from autosuggest
      const groupMembers = this.data.group.memberinfo.map(item=>{
        if(item.status && item.status=='A'){
          return item.invited_to
        }
      }).filter(item=>{return item!==undefined});
      this.groupMembers = [...groupMembers];
    }
      let ignoreIds        = this.groupForm.get('invited_to').value!==null ? this.groupForm.get('invited_to').value : [];
      var userIdsIgnore    = this.groupMembers.concat(ignoreIds);
      this.groupMembers    = [...userIdsIgnore];
      this.groupMembers    = [...CommonUtils.removeDuplicates(this.groupMembers)];
  } 
  /** SHOW SNACK BAR */
  showSnackBar(message:string,buttonText:string){
    this._matSnackBar.open(message, buttonText, {
        verticalPosition: 'top',
        duration        : 2000
    });
  }

}
