import { CommonUtils } from 'app/_helpers';

export class LocalStorageSettings {
    settings:{
        'APP_TIMEZONE':string;
        'SMTP_Settings':string;
        'documentsettings':string;
        'enableloginattempts':string;
        'event-settings':string;
        'eventimportfields':string;
        'exporteventattendeefields':string;
        'form_types':string;
        'general_settings':string;
        'global_media_setting':string;
        'home_settings':string;
        'permission':string;
        'residentdirectorysearch':string;
        'sendmails':string;
        'staff_settings':string;
        'ultra_admin':string;
        'userexportfields':string;
        'userimportfields':string;
        'users_settings':{
            'defaultprofile':string;
            'defaultcover':string;
            'defaultprofileratio':string;
            'defaultcoverratio':string;
            'dob_limit':number;
        };
    };
    themesettings:{
        'admin-theme-settings'?:string,
        'frontend-theme-settings'?:string
    };
    token:{
        'token':string,
        'user_id':number
    }
    constructor(settings: any = {}, themesettings: any = {}, token: any = {}) {
        this.settings = this.convertSettings(settings);
        this.themesettings = this.convertThemeSettings(themesettings);
        this.token = token;
    }
    convertSettings(settings:any){
        if(settings){
            if(settings.users_settings){
                settings.users_settings =  CommonUtils.getStringToJson(settings.users_settings);
                settings.users_settings = settings.users_settings.users_settings || {};
            }
        }
        return settings;
    }
    /**Convert Theme Settings */
    convertThemeSettings(themesettings:any){
        if(themesettings){
            if(themesettings['admin-theme-settings']) {
                themesettings['admin-theme-settings'] =  CommonUtils.getStringToJson(themesettings['admin-theme-settings']);
                themesettings['admin-theme-settings'] = themesettings['admin-theme-settings']['admin-theme-settings'];
            }
            if(themesettings['frontend-theme-settings']) {
                themesettings['frontend-theme-settings'] =  CommonUtils.getStringToJson(themesettings['frontend-theme-settings']);
                themesettings['frontend-theme-settings'] = themesettings['frontend-theme-settings']['user-theme-settings'];
            }
        }
        return themesettings;
    }
    /** Set Default Picture */
    setDefaultPictures(usersSettings:any){
        if(usersSettings.defaultprofile){
            
        }
    }
}