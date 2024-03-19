//Declare structure of Settings
export interface UserSettings {
    users_settings?: {
      defaultprofile:string,
      defaultcover:string,
      dob_limit:number,
      biography_char_limit:number,
      allow_change_email:string,
      allow_chat:string,
      domain_emails:string,
      restrict_form_roles:any[]
    };
  }
  