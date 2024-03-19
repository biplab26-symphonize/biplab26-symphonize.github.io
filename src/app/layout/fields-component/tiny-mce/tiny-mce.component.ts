import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-tiny-mce',
  template: `
	<div>
	  <label>{{field.field_label}}: </label>
      <editor [init]="tinyMceSettings" name="field.name" [formControlName]="field.name"></editor>
    </div>
  `,
  styles: []
})

export class TinyMceComponent implements OnInit {
	field: any;
	group: FormGroup;
	
	public tinyMceSettings = {
		base_url: '/tinymce', // Root for resources
		suffix: '.min',
		plugins: 'link insertdatetime paste code',
		menubar:false,
		statusbar: false,
		paste_as_text:true,
		fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px',
		toolbar:'fontsizeselect | fontselect | formatselect | bold italic underline strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify | pastetext undo redo code',
		font_formats: 'Roboto=Roboto,sans-serif;Andale Mono=andale mono,monospace;Arial=arial,helvetica,sans-serif;Arial Black=arial black,sans-serif;Book Antiqua=book antiqua,palatino,serif;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier,monospace;Georgia=georgia,palatino,serif;Helvetica=helvetica,arial,sans-serif;Impact=impact,sans-serif;sans-serif=sans-serif,sans-serif',
		content_css: [
		  
		],
		setup : function(ed) {
			ed.on('init', function (ed) {
				//ed.target.editorCommands.execCommand("fontName", false, "");
			});
		}
	};
	
  constructor(
		private fb:FormBuilder) 
		{
		}

  ngOnInit() {
	
	this.group = this.createControl();
  }
  createControl() {
    const group = this.fb.group({});
      const control = this.fb.control(this.field.value);
      group.addControl(this.field.name, control);
    return group;
  }

}

