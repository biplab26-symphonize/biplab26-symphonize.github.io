import { Deserializable, Roles } from 'app/_models';
import { Form } from './form.model';
import { CommonUtils } from 'app/_helpers';

export class FormEntry implements Deserializable {

  public entry_id: number;
  public form_id: number;
  public first_name: string;
  public last_name: string;
  public status: string;
  public email: string;
  public form_title: string;
  public formtype: Form[];
  public created_at: string;
  public deleted_at: string;
  public last_login: string;
  public form_type: string;
  public login_location: string;
  public updated_at: string;


  deserialize(input: any, type: string = ''): this {
    // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
    Object.assign(this, input);
    this.getentryData(input, type);
    return this;
  }

  getentryData(input, type = '') {
    this.entry_id = input.entry_id;
    this.created_at = CommonUtils.getStringToDate(input.created_at);
    if (input.formmeta) {
      this.form_title = input.formmeta.form_title ? input.formmeta.form_title : '';

    }
    if (input.usermeta) {
      console.log("input", input);
      if (type == 'entries') {
        this.first_name = input.usermeta.first_name ? input.usermeta.first_name : '';
        this.last_name = input.usermeta.last_name ? input.usermeta.last_name : '';
        this.email = input.usermeta.email ? input.usermeta.email : '';

        if (input.entriesmeta && input.entriesmeta.length > 0) {
          //firstName
          let firstName = input.entriesmeta.find(entryItem => {
            return entryItem.formfields && ['first_name', 'first-name'].includes(entryItem.formfields.caption);
          });
          this.first_name = firstName && firstName.form_element_value !== '' ? firstName.form_element_value : this.first_name;
          //lastName
          let lastName = input.entriesmeta.find(entryItem => {
            return entryItem.formfields && ['last_name', 'last-name'].includes(entryItem.formfields.caption);
          });
          this.last_name = lastName && lastName.form_element_value !== '' ? lastName.form_element_value : this.first_name
          //email
          let emailId = input.entriesmeta.find(entryItem => {
            return entryItem.formfields && ['email'].includes(entryItem.formfields.caption);
          });
          this.email = emailId && emailId.form_element_value !== '' ? emailId.form_element_value : this.email;
        }
      }
      else {
        this.first_name = input.usermeta.first_name ? input.usermeta.first_name : '';
        this.last_name = input.usermeta.last_name ? input.usermeta.last_name : '';
        this.email = input.usermeta.email ? input.usermeta.email : '';
      }
    }
  }
}