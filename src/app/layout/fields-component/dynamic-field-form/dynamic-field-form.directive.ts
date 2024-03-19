import { ComponentFactoryResolver,Directive, Input, OnInit, ViewContainerRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { InputComponent } from "../input/input.component";
import { HiddenComponent } from "../hidden/hidden.component";
import { ButtonComponent } from "../button/button.component";
import { SelectComponent } from "../select/select.component";
import { DateComponent } from "../date/date.component";
import { RadiobuttonComponent } from "../radiobutton/radiobutton.component";
import { CheckboxComponent } from "../checkbox/checkbox.component";
import { UploadComponent } from "../upload/upload.component";
import { AutocompleteComponent } from "../autocomplete/autocomplete.component";
import { ListComponent } from "../list/list.component";
import { TextareaComponent } from '../textarea/textarea.component';
import { RatingComponent } from "../star-rating/star-rating.component";
import { TinyMceComponent } from '../tiny-mce/tiny-mce.component';
import { DynamicComponent } from '../dynamic/dynamic.component';
import { SignatureComponent } from '../signature/signature.component';
import { TimeComponent } from '../time/time.component';
import { HtmlComponent } from '../html/html.component';
import { WebsiteComponent } from '../website/website.component';

const componentMapper = {
  text          :   InputComponent,  
  password      :   InputComponent,
  number        :   InputComponent,
  email         :   InputComponent,  
  input         :   InputComponent,
  textarea      :   TextareaComponent,
  hidden        :   HiddenComponent,
  button        :   ButtonComponent,
  select        :   SelectComponent,
  date          :   DateComponent,
  radio         :   RadiobuttonComponent,
  checkbox      :   CheckboxComponent,
  upload        :   UploadComponent,
  autocomplete  :   AutocompleteComponent,
  list          :   ListComponent,
  rating        :   RatingComponent,
  tinymce       :   TinyMceComponent,
  dynamic       :   DynamicComponent,
  signature     :   SignatureComponent,
  time          :   TimeComponent,
  html          :   HtmlComponent,
  website       :   WebsiteComponent
};

@Directive({
  selector: "[dynamicFieldForm]"
})

export class DynamicFieldFormDirective implements OnInit {

  @Input() field: any;
  @Input() group: FormGroup;
  componentRef: any;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}
  
  ngOnInit() {
    const factory = this.resolver.resolveComponentFactory(
      componentMapper[this.field.type]
    );
    
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.field = this.field;
    this.componentRef.instance.group = this.group;
  }
}
