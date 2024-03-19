import { Component, OnInit } from '@angular/core';
import { CommonUtils } from 'app/_helpers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OptionsList, AnnouncementService, AuthService, CategoryService } from 'app/_services';
import { first, takeUntil } from 'rxjs/operators';
import { Home } from 'app/_models';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.scss'],
  animations   : fuseAnimations,

})
export class CreateTopicComponent implements OnInit {
  public  tinyMceSettings : any = {};
  public  ForumSettings   : any; 
  public  editForm        : boolean = false;
  public createNewTopics  : boolean = false;
  public  forum_id        : any = 0;
  private user_id         : number = 0;
  public  topicform       : FormGroup;
  public  inputAccpets    : string = '*';
  public  uploadedResponse: any = {};
  public  final;
  public  file;
  public  url;
  public  selectedFile    : any;
  public  filetype        : boolean = true;
  public ForumList : any ;
  uploadInfo: any={
    'avatar':{'type':'avatar','media_id':0,'formControlName':'avatar_media_id','url':"",'apimediaUrl':'media/userupload'},
  };  

  // Private
  private _unsubscribeAll: Subject<any>;
  
  constructor(
    private _fuseConfigService: FuseConfigService,
    private route : ActivatedRoute,
    private _topicService : AnnouncementService,
    private _authenticationService : AuthService,
    private _matSnackBar: MatSnackBar,
    private _categorService : CategoryService,
    private fb : FormBuilder,
    private router : Router) { 

      // Set the private defaults
      this._unsubscribeAll = new Subject();
      // Configure the layout
      this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
  
    this.tinyMceSettings    = CommonUtils.getTinymceSetting('topics');
    this.forum_id           = this.route.params['value'].id;
    this.user_id            = this._authenticationService.currentUserValue.token.user.id;
  }
  ngOnInit(){
    this.ForumSettings      = OptionsList.Options.forumsettings;

    this.topicform = this.fb.group({
      content_id        : this.fb.control(null),  
      content_title     : this.fb.control('',[Validators.required]),
      content_type      : this.fb.control('forum'),
      status            :  this.fb.control('A'),
      forum_id          : this.fb.control(this.forum_id),
      content_desc      : this.fb.control('',[Validators.required]),
      created_by        : this.fb.control(this.user_id),
      forumslist        : this.fb.control(''),
      display_status    : this.fb.control('pending'),     
    });
    let s = window.location.href
    this.final = s.substr(s.lastIndexOf('/') + 1);
    
    //Load Edit Form Values
    if(this.route.routeConfig.path == 'edit-topic/:id'){
      this.editForm = true;
      this.fillFormValues();
    }
    if(this.route.routeConfig.path == 'forums/create-topic'){
      this.createNewTopics = true;
      this._categorService.getForums({'category_type':'FC','status':'A','direction':'asc'}).then(forums=>{
         this.ForumList = forums.data;
        console.log(this.ForumList);
      })
    }
  }

  /** FILL FORM FROM EDIT ROUTE */
  fillFormValues(){
    this._topicService.getContent(this.route.params['value'].id).then(topicInfo=>{
      var topicData = new Home().deserialize(topicInfo.contentinfo,'single');
      this.topicform.patchValue(topicData);
      if(topicInfo.contentinfo.forum && topicInfo.contentinfo.forum.category_alias){
        this.final = topicInfo.contentinfo.forum.category_alias;
      }

    });
  }
  
  onSubmit(event){
    event.preventDefault();
    event.stopPropagation();  
    if(this.route.routeConfig.path == 'forums/create-topic') {
     let data =this.topicform.value;
     this.topicform.get('forum_id').setValue(data.forumslist)
     console.log(this.topicform.value);
    } 
    if(this.topicform.valid){
      this._topicService.saveAnnouncement(this.topicform.value,this.editForm)
            .pipe(first(),takeUntil(this._unsubscribeAll))
            .subscribe(
                data => {
                    if(data.status==200){
                      this.showSnackBar(data.message,'CLOSE');
                      this.topicform.reset();
                      this.router.navigate(['/forums/topics/' + this.final])
                    }
                    else{
                      this.showSnackBar(data.message,'CLOSE');
                    }
                },
                error => {
                    // Show the error message
                    this._matSnackBar.open(error.message, 'Retry', {
                        verticalPosition: 'top',
                        duration        : 2000
                });
            });
    }
    else{
      CommonUtils.validateAllFormFields(this.topicform);
    }
  }

  /** SHOW SNACK BAR */
  showSnackBar(message:string,buttonText:string){
    this._matSnackBar.open(message, buttonText, {
        verticalPosition: 'top',
        duration        : 2000
    });
  }
  fileChangeEvent($event){
    return true;
  }
}
