import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AttendeesService } from 'app/_services';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-mail-to-attendees',
  templateUrl: './mailtoattendees.component.html',
  styleUrls: ['./mailtoattendees.component.scss']
})
export class MailtoAttendeesComponent
{
    mailForm: FormGroup;
    public exportOption: string;
    mailData: any={};
    isSubmit: boolean=false;
    //TINY MCE EDITOR//
    public tinyMceSettings = {
      base_url      : '/tinymce', // Root for resources
      suffix        : '.min',
      plugins       : 'link insertdatetime paste code',
      menubar       : false,
      statusbar     : false,
      paste_as_text :true,
      fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px',
      toolbar       : 'fontsizeselect | fontselect | formatselect | bold italic underline strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify | pastetext undo redo code',
      font_formats  : 'Roboto=Roboto,sans-serif;Andale Mono=andale mono,monospace;Arial=arial,helvetica,sans-serif;Arial Black=arial black,sans-serif;Book Antiqua=book antiqua,palatino,serif;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier,monospace;Georgia=georgia,palatino,serif;Helvetica=helvetica,arial,sans-serif;Impact=impact,sans-serif;sans-serif=sans-serif,sans-serif',
      content_css   : [],
      setup : function(ed) {
        ed.on('init', function (ed) {
          //ed.target.editorCommands.execCommand("fontName", false, "");
        });
      }
    };
    // Private
    private _unsubscribeAll: Subject<any>;
    /**
     * Constructor
     * @param {FormBuilder} _formBuilder
     * @param {MatDialogRef<MailtoAttendeesComponent>} dialogRef
     */
    constructor(
        private route: ActivatedRoute,
        private _attendeeService: AttendeesService,
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<MailtoAttendeesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.mailData        = this.data; 
    }

    ngOnInit(){
      //Declare Filter Form
      this.mailForm = this._formBuilder.group({
          emailsubject : ['', Validators.required],
          message      : ['', Validators.required],
          event_id     : [this.mailData.event_id || ''],
          attendee_id  : [this.mailData.attendee_id || []],
          sendalert    : '1',
          sendeventinfo: ['Y',Validators.required]        
      });
    }
    /**SEND MAIl TO SEND SELECTED ATTENDEES FOR SELECTED EVENT */
    sendattendeeMail(){
      if(this.mailForm.valid){
        this.isSubmit = true;
        this._attendeeService.sendMail(this.mailForm.value)
        .pipe(
            takeUntil(this._unsubscribeAll)
        )
        .subscribe(response =>
        {
          this.dialogRef.close(response);
        },
        error => {
          this.dialogRef.close(error);
        })
      }
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}
