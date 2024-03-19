import { Deserializable, Roles } from 'app/_models';
import { OptionsList } from 'app/_services';
import { settings } from 'cluster';

export class Form implements Deserializable {

  public form_id: number;
  public form_type: string;
  public form_title: string;

  public created_at: string;
  public deleted_at: string;
  public last_login: string;

  public login_location: string;
  public updated_at: string;

  public created_by
  public formfields
  public formclass
  public confirmationmessage
  public listfield_allow_multiple
  public listfield_max_entries
  public sendoption
  public requiredlogin
  public mailtoadmin
  public adminroles
  public create_subject
  public create_message
  public status_change_subject
  public status_approved_message
  public status_cancelled_message_user
  public status_cancelled_message_admin
  public status_show_entry
  public pdfattachment
  public mailtoclient
  //pdf settings
  public pdf_form_title
  public empty_fields
  public bgcolor
  public header
  public footer
  public always_save_pdf
  public filename
  public papersize
  public orientation
  public font
  public fontsize
  public fontcolor
  public first_page_header
  public first_page_footer
  public page_names
  public notificationpdf
  public enable_pdf_security
  public enable_public_access
  public restrict_owner
  public formElements
  // confirmation setting
  public confirmation_name
  public confirmation_type
  public message
  // button setting
  public button_type
  public button_text
  public reset_button_text
  public reset_button
  public button_path
  // workxhub settings
  public FORM_ID
  public workxhub_status
  public DUDE_SITE
  public DUDE_CLIENT_ID
  public DUDE_CLIENT_SECRET
  public DUDE_TOKEN_GRANT
  public DUDE_INSTANCE
  public DUDE_TOKEN_URL
  description
  requestedfor
  locationdescription
  email
  permissiontoenter
  department
  number
  details
  firstname
  lastname
  requestedof
  location
  requestor


  deserialize(input: any, type: string = ''): this {

    // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
    Object.assign(this, input);
    if (type == '') {
      this.getEditForm(input);
    }

    if (type == 'myformslist') {
      this.getMyFormsList(input);
    }

    return this;
  }

  getEditForm(input) {

    let settingData;
    let general;
    let notification;
    let pdf;
    let confirmation;
    let workxhub;

    settingData = JSON.parse(input.form_settings);
    general = settingData.formsettings.general;
    notification = settingData.formsettings.notifications;
    pdf = settingData.formsettings.pdf;
    confirmation = settingData.formsettings.confirmation;
    // workxhub        =   settingData.formsettings.general.workxhub;

    //general
    this.formclass = general.formclass;
    this.confirmationmessage = general.confirmationmessage;
    this.requiredlogin = general.requiredlogin;
    // workXhub settings 
    this.FORM_ID = general.workxhub.FORM_ID;
    this.workxhub_status = general.workxhub.workxhub_status;
    this.DUDE_SITE = general.workxhub.DUDE_SITE;
    this.DUDE_CLIENT_ID = general.workxhub.DUDE_CLIENT_ID;
    this.DUDE_CLIENT_SECRET = general.workxhub.DUDE_CLIENT_SECRET;
    this.DUDE_TOKEN_GRANT = general.workxhub.DUDE_TOKEN_GRANT;
    this.DUDE_INSTANCE = general.workxhub.DUDE_INSTANCE;
    this.DUDE_TOKEN_URL = general.workxhub.DUDE_TOKEN_URL;
    if(general.workxhub && general.workxhub.workxhubformfields!==undefined){
      this.description = general.workxhub.workxhubformfields.description;
      this.requestedfor = general.workxhub.workxhubformfields.requestedfor;
      this.locationdescription = general.workxhub.workxhubformfields.locationdescription;
      this.email = general.workxhub.workxhubformfields.email;
      this.firstname = general.workxhub.workxhubformfields.firstname;
      this.lastname = general.workxhub.workxhubformfields.lastname;
      this.permissiontoenter = general.workxhub.workxhubformfields.permissiontoenter;
      this.department = general.workxhub.workxhubformfields.department;
      this.number = general.workxhub.workxhubformfields.number;
      this.details = general.workxhub.workxhubformfields.details;
      this.location = general.workxhub.workxhubformfields.location;
      this.requestedof = general.workxhub.workxhubformfields.requestedof;
      this.requestor = general.workxhub.workxhubformfields.requestor;
    }
    //notification
    this.sendoption = notification.sendoption;
    this.mailtoadmin = notification.mailtoadmin;
    this.adminroles = notification.adminroles;
    this.create_subject = notification.create_subject;
    this.create_message = notification.create_message;
    this.status_change_subject = notification.status_change_subject;
    this.status_approved_message = notification.status_approved_message;
    this.status_cancelled_message_user = notification.status_cancelled_message_user;
    this.status_cancelled_message_admin = notification.status_cancelled_message_admin;
    this.pdfattachment = notification.pdfattachment;
    this.status_show_entry = notification.status_show_entry;
    this.mailtoclient = notification.mailtoclient;
    //pdf
    this.pdf_form_title = pdf.form_title;
    this.empty_fields = pdf.empty_fields;
    this.bgcolor = pdf.bgcolor;
    this.header = pdf.header;
    this.footer = pdf.footer;
    this.always_save_pdf = pdf.always_save_pdf;
    this.filename = pdf.filename;
    this.papersize = pdf.papersize;
    this.orientation = pdf.orientation;
    this.font = pdf.font;
    this.fontsize = pdf.fontsize;
    this.fontcolor = pdf.fontcolor;
    this.first_page_header = pdf.first_page_header;
    this.first_page_footer = pdf.first_page_footer;
    this.page_names = pdf.page_names;
    this.notificationpdf = pdf.notificationpdf;
    this.enable_pdf_security = pdf.enable_pdf_security;
    this.enable_public_access = pdf.enable_public_access;
    this.restrict_owner = pdf.restrict_owner;
    // confirmation setting 
    this.confirmation_name = confirmation.confirmation_name;
    this.confirmation_type = confirmation.confirmation_type;
    this.message = confirmation.message;
    this.button_type = confirmation.button_type;
    this.button_text = confirmation.button_text;
    this.button_path = confirmation.button_path;
    this.reset_button = confirmation.reset_button;
    this.reset_button_text = confirmation.reset_button_text;


  }

  getMyFormsList(input) {
    this.form_title = input.formmeta.form_title;
  }
}