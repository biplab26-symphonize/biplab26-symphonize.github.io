import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { SettingsService, RolesService, AppConfig, OptionsList, CommonService, MenusService } from 'app/_services';
import { CommonUtils } from 'app/_helpers';
import { Settings } from 'app/_models/setting.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class HomeComponent implements OnInit {

  public green_bg_header: any;
  public button: any;
  public accent: any;
  public layoutList: any;
  public navlayoutList: any[] = [];
  public anclayoutList: any[] = [];
  public featuredList: any[] = [];
  public formatList: any;
  public datetimeChecked: boolean = false;
  public homeChecked: boolean = false;
  public scrollChecked: boolean = false;
  public diningannChecked: boolean = false;
  public eventannChecked: boolean = false;
  public imageChecked: boolean = false;
  public weatherChecked: boolean = false;
  public foodreservationChecked: boolean = false;
  public eventChecked: boolean = false;
  public formChecked: boolean = false;
  public diningChecked: boolean = false;
  public tablereservationChecked: boolean = false
  public appointmentChecked: boolean = false;
  public todayEventChecked: boolean = false;
  public neighorsChecked: boolean = false;
  public GuestroomChecked: boolean = false;
  public staffChecked: boolean = false;
  public footerChecked: boolean = false;
  public isImg: boolean = false;
  public isSubmit: boolean = false;
  public bulletinChecked: boolean = false;
  public quicklinkChecked: boolean = false;
  public Sidebarchecked: boolean = false;
  public meetingroomChecked: boolean = false;
  public Navbarchecked: boolean = false;
  public favoriteeventChecked : boolean = false;
  public inputAccpets: string = ".jpeg, .jpg, .png";
  public message: string;
  public MEDIA_URL: string;

  public errorMsg: any;
  public imgURL: any;
  public AppConfig: any;
  public tinyMceSettings = {
    base_url: '/tinymce', // Root for resources
    convert_urls: true,
    relative_urls: false,
    remove_script_host: false,
    suffix: '.min',
    plugins: 'image link insertdatetime paste code wordcount lists',
    menubar: false,
    statusbar: false,
    paste_as_text: true,
    element_format: 'html',
    fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px',
    font_formats: 'Roboto=Roboto,sans-serif;Andale Mono=andale mono,monospace;Arial=arial,helvetica,sans-serif;Arial Black=arial black,sans-serif;Book Antiqua=book antiqua,palatino,serif;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier,monospace;Georgia=georgia,palatino,serif;Helvetica=helvetica,arial,sans-serif;Impact=impact,sans-serif;sans-serif=sans-serif,sans-serif',
    toolbar: 'fontsizeselect | fontselect | formatselect | bold italic underline strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist blockquote  | pastetext undo redo | image code | link',
    content_css: [
    ],
    //newly added
    formats: {
      underline: { inline: 'u', exact: true }
    },
    //
    setup: function (ed) {
      ed.on('init', function (ed) {
        //ed.target.editorCommands.execCommand("fontName", false, "");
      });
    },

  };

  public homeSettingForm: FormGroup;

  public rolesList: any = [];
  public homeSettingsData: any = [];
  public forecastList: any = [];
  public quickMenus: any[] = [];
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {fb} FormBuilder
   * @param {_matSnackBar} MatSnackBar
   * @param {_settingService} SettingsService
   */
  constructor(
    private fb: FormBuilder,
    private _commonService: CommonService,
    private _rolesService: RolesService,
    private _matSnackBar: MatSnackBar,
    private _settingService: SettingsService,
    private _menusService: MenusService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();

    // MEDIA URL
    this.AppConfig = AppConfig.Settings;
    this.MEDIA_URL = this.AppConfig.url.mediaUrl;
    this.layoutList = OptionsList.Options.homesettings.layouts;
    this.navlayoutList = OptionsList.Options.homesettings.navlayouts;
    this.anclayoutList = OptionsList.Options.homesettings.anclayouts;
    this.featuredList = OptionsList.Options.homesettings.featurelayouts;
    this.formatList = OptionsList.Options.homesettings.formatlist;
    this.forecastList = OptionsList.Options.homesettings.forecast;
  }

  ngOnInit() {

    // Subscribe to update setting on changes
    this.getMenusList();
    this.homeSettingForm = this.createSettingForm();
    this.rolesList = this._rolesService.roles.data;
    this.getUpdatedHomeSettings(this._settingService.setting);

    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  createSettingForm() {
    return this.fb.group({
      datetime: this.fb.control(''),
      datetimeformat: this.fb.control('full', [Validators.required]),
      datetime_colwidth: this.fb.control('30', [Validators.required]),
      default_layout: this.fb.control('layout-1', [Validators.required]),
      navbar_layout: this.fb.control('front-navbar-style-1', [Validators.required]),
      announcement_layout: this.fb.control('row', [Validators.required]),
      announcement_colwidth: this.fb.control('30', [Validators.required]),
      featured_image: this.fb.control('', [Validators.required]),
      featured_image_url: this.fb.control(''),
      front_title: this.fb.control(''),
      featured_layout: this.fb.control('default', [Validators.required]),
      scroll_ann: this.fb.control('', [Validators.required]),
      home_ann: this.fb.control('', [Validators.required]),
      dining_ann: this.fb.control(''),
      event_ann: this.fb.control(''),
      weather_set: this.fb.control('', [Validators.required]),
      weather_colwidth: this.fb.control('30', [Validators.required]),
      title: this.fb.control(''),
      city_id: this.fb.control(''),
      app_id: this.fb.control(''),
      city_name: this.fb.control(''),
      unit: this.fb.control('metric'),
      show_icon: this.fb.control('Y'),
      size: this.fb.control(''),
      forecast: this.fb.control(''),
      bg_color: this.fb.control('#000000'),
      text_color: this.fb.control('#FFFFFF'),
      hide_current_stats: this.fb.control(''),
      hide_weather_attribution: this.fb.control(''),
      link_to_extended: this.fb.control(''),
      todays_event: this.fb.control('', [Validators.required]),
      todays_event_colwidth: this.fb.control('30', [Validators.required]),
      event_datetime: this.fb.control('Y'),
      event_decription: this.fb.control('Y'),
      event_location: this.fb.control('Y'),
      todays_event_limit: this.fb.control(''),
      my_events: this.fb.control('', [Validators.required]),
      event_limit: this.fb.control(''),
      event_see_more_url: this.fb.control(''),
      my_favorite_events : this.fb.control(''),
      favorite_event_limit : this.fb.control(''),
      favorite_event_see_more_url : this.fb.control(''),
      my_forms: this.fb.control('', [Validators.required]),
      form_limit: this.fb.control(''),
      form_see_more_url: this.fb.control(''),
      my_dining: this.fb.control('', [Validators.required]),
      dining_limit: this.fb.control(''),
      dining_see_more_url: this.fb.control(''),
      my_appointment: this.fb.control('', [Validators.required]),
      appointment_limit: this.fb.control(''),
      appointment_see_more_url: this.fb.control(''),
      my_tablereservation: this.fb.control('', [Validators.required]),
      tablereservation_limit: this.fb.control(''),
      table_see_more_url: this.fb.control(''),
      meeting_room: this.fb.control('', [Validators.required]),
      meetingroom_limit: this.fb.control(''),
      meetingroom_see_more_url: this.fb.control(''),
      my_foodreservation: this.fb.control('', [Validators.required]),
      foodreservation_limit: this.fb.control(''),
      food_see_more_url: this.fb.control(''),
      is_newest_neighbors: this.fb.control('', [Validators.required]),
      neighbors_limit: this.fb.control(''),
      is_newest_staff: this.fb.control('', [Validators.required]),
      staff_limit: this.fb.control(''),
      is_bulletin: this.fb.control('', [Validators.required]),
      bulletin_date: this.fb.control('Y'),
      bulletin_replies: this.fb.control('Y'),
      bulletin_author: this.fb.control('Y'),
      bulletin_limit: this.fb.control(''),
      bulletin_colwidth: this.fb.control('30', [Validators.required]),
      footer_set: this.fb.control(''),
      quicklink_set: this.fb.control(''),
      quicklink_menus: this.fb.control([]),
      sidebar_set: this.fb.control(''),
      navbar_set: this.fb.control(''),
      my_guest: this.fb.control(''),
      guest_limit: this.fb.control(''),
      guest_see_more_url: this.fb.control(''),
    });
  }

  removeFeaturedLogo() {
    this.isImg = false;
    this.imgURL = '';
    this.homeSettingForm.get('featured_image_url').setValue('');
    this.imageChecked = false;
  }

  getUpdatedHomeSettings(response) {

    this.homeSettingsData = JSON.parse(response.settingsinfo.meta_value);
    let homesettings = new Settings().deserialize(this.homeSettingsData, 'homeSettings');

    this.homeSettingForm.patchValue(homesettings);

    if (this.homeSettingsData.featured_image == 'Y') {
      this.isImg = true;
      this.imgURL = this.MEDIA_URL + homesettings.featured_image_url;
    }
    // set value of toggle button
    this.datetimeChecked = homesettings.datetime;
    this.homeChecked = homesettings.home_ann;
    this.diningannChecked = homesettings.dining_ann;
    this.eventannChecked = homesettings.event_ann;
    this.scrollChecked = homesettings.scroll_ann;
    this.imageChecked = homesettings.featured_image;
    this.weatherChecked = homesettings.weather_set;
    this.eventChecked = homesettings.my_events;
    this.favoriteeventChecked = homesettings.my_favorite_events;
    this.formChecked = homesettings.my_forms;
    this.GuestroomChecked = homesettings.my_guest;
    this.diningChecked = homesettings.my_dining;
    this.appointmentChecked = homesettings.my_appointment;
    this.tablereservationChecked = homesettings.my_tablereservation;
    this.foodreservationChecked = homesettings.my_foodreservation;
    this.todayEventChecked = homesettings.todays_event;
    this.neighorsChecked = homesettings.is_newest_neighbors;
    this.staffChecked = homesettings.is_newest_staff;
    this.bulletinChecked = homesettings.is_bulletin;
    this.footerChecked = homesettings.footer_set;
    this.quicklinkChecked = homesettings.quicklink_set;
    this.Sidebarchecked = homesettings.sidebar_set;
    this.Navbarchecked = homesettings.navbar_set;
    this.meetingroomChecked = homesettings.meeting_room
  }

  preview(event: any, files) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    let featuredImg = new FormData();
    featuredImg.append('type', 'featured');
    featuredImg.append('image', event.target.files[0]);

    this._settingService.uploadMedia(featuredImg)
      .then(response => {
        if (response.status == 200) {
          this.isImg = true;
          this.imgURL = this.MEDIA_URL + response.media;
          // Show the success message
          this._matSnackBar.open('Featured image is added successfully !', 'Success', {
            verticalPosition: 'top',
            duration: 2000
          });
          this.homeSettingForm.get('featured_image_url').setValue(response.media);
        }
        else {
          // Show error message
          this._matSnackBar.open('Featured image is not added !', 'Error', {
            verticalPosition: 'top',
            duration: 2000
          });
          this.homeSettingForm.get('featured_image_url').setValue('');
        }
      },
        error => this.errorMsg = error);
  }

  onSaveFieldClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.homeSettingForm.valid) {
      this.isSubmit = true;
      let homeSettingData = this.homeSettingForm.value;

      homeSettingData.datetime = homeSettingData.datetime == true || homeSettingData.datetime == 'Y' ? 'Y' : 'N';
      homeSettingData.home_ann = homeSettingData.home_ann == true || homeSettingData.home_ann == 'Y' ? 'Y' : 'N';
      homeSettingData.scroll_ann = homeSettingData.scroll_ann == true || homeSettingData.scroll_ann == 'Y' ? 'Y' : 'N';
      homeSettingData.dining_ann = homeSettingData.dining_ann == true || homeSettingData.dining_ann == 'Y' ? 'Y' : 'N';
      homeSettingData.event_ann = homeSettingData.event_ann == true || homeSettingData.event_ann == 'Y' ? 'Y' : 'N';
      homeSettingData.featured_image = homeSettingData.featured_image == true || homeSettingData.featured_image == 'Y' ? 'Y' : 'N';
      homeSettingData.weather_set = homeSettingData.weather_set == true || homeSettingData.weather_set == 'Y' ? 'Y' : 'N';
      homeSettingData.my_events = homeSettingData.my_events == true || homeSettingData.my_events == 'Y' ? 'Y' : 'N';
      homeSettingData.my_favorite_events       = homeSettingData.my_favorite_events == true || homeSettingData.my_favorite_events == 'Y' ? 'Y' : 'N';
      homeSettingData.my_forms = homeSettingData.my_forms == true || homeSettingData.my_forms == 'Y' ? 'Y' : 'N';
      homeSettingData.my_guest = homeSettingData.my_guest == true || homeSettingData.my_guest == 'Y' ? 'Y' : 'N';
      homeSettingData.quicklink_set = homeSettingData.quicklink_set == true || homeSettingData.quicklink_set == 'Y' ? 'Y' : 'N';
      homeSettingData.my_dining = homeSettingData.my_dining == true || homeSettingData.my_dining == 'Y' ? 'Y' : 'N';
      homeSettingData.my_appointment = homeSettingData.my_appointment == true || homeSettingData.my_appointment == 'Y' ? 'Y' : 'N';
      homeSettingData.my_tablereservation = homeSettingData.my_tablereservation == true || homeSettingData.my_tablereservation == 'Y' ? 'Y' : 'N';
      homeSettingData.my_foodreservation = homeSettingData.my_foodreservation == true || homeSettingData.my_foodreservation == 'Y' ? 'Y' : 'N';
      homeSettingData.meeting_room = homeSettingData.meeting_room == true || homeSettingData.meeting_room == 'Y' ? 'Y' : 'N';
      homeSettingData.todays_event = homeSettingData.todays_event == true || homeSettingData.todays_event == 'Y' ? 'Y' : 'N';
      homeSettingData.is_newest_neighbors = homeSettingData.is_newest_neighbors == true || homeSettingData.is_newest_neighbors == 'Y' ? 'Y' : 'N';
      homeSettingData.is_newest_staff = homeSettingData.is_newest_staff == true || homeSettingData.is_newest_staff == 'Y' ? 'Y' : 'N';
      homeSettingData.is_bulletin = homeSettingData.is_bulletin == true || homeSettingData.is_bulletin == 'Y' ? 'Y' : 'N';
      homeSettingData.hide_current_stats = homeSettingData.hide_current_stats == true || homeSettingData.hide_current_stats == 'Y' ? 'Y' : 'N';
      homeSettingData.hide_weather_attribution = homeSettingData.hide_weather_attribution == true || homeSettingData.hide_weather_attribution == 'Y' ? 'Y' : 'N';
      homeSettingData.link_to_extended = homeSettingData.link_to_extended == true || homeSettingData.link_to_extended == 'Y' ? 'Y' : 'N';
      homeSettingData.footer_set = homeSettingData.footer_set == true || homeSettingData.footer_set == 'Y' ? 'Y' : 'N';
      homeSettingData.sidebar_set = homeSettingData.sidebar_set == true || homeSettingData.sidebar_set == 'Y' ? 'Y' : 'N';
      homeSettingData.navbar_set = homeSettingData.navbar_set == true || homeSettingData.navbar_set == 'Y' ? 'Y' : 'N';

      let saveData = { meta_type: 'S', meta_key: 'home_settings', meta_value: JSON.stringify(homeSettingData) };

      this._settingService.createSetting(saveData).then(response => {
        this.isSubmit = false;
        if (response.status == 200) {
          // update local storage
          this._commonService.updateLocalStorageSettings('home_settings', homeSettingData);
          // Show the success message
          this._matSnackBar.open('Home settings updated successfully !', 'Success', {
            verticalPosition: 'top', duration: 2000
          });
        }
      },
        error => console.log(error));
    }
    else {
      CommonUtils.validateAllFormFields(this.homeSettingForm)
    }
  }

  is_toggleChange(event, eventtype = null) {
    if (event == false) {
      this.homeSettingForm.get('neighbors_limit').clearValidators();
    }
    if (event == true) {
      this.homeSettingForm.get('neighbors_limit').setValidators([Validators.required]);
    }
    this.homeSettingForm.get('neighbors_limit').updateValueAndValidity();
  }

  quicklinkCheckedData(event) {
    if (event == false) {
      this.homeSettingForm.get('quicklink_menus').clearValidators();
    }
    if (event == true) {
      this.homeSettingForm.get('quicklink_menus').setValidators([Validators.required]);
    }
    this.homeSettingForm.get('quicklink_menus').updateValueAndValidity();
  }

  is_toggleChanggstaff(event) {
    if (event == false) {
      this.homeSettingForm.get('staff_limit').clearValidators();
    }
    if (event == true) {
      this.homeSettingForm.get('staff_limit').setValidators([Validators.required]);
    }
    this.homeSettingForm.get('staff_limit').updateValueAndValidity();
  }

  my_formsChange(event) {
    if (event == false) {
      this.homeSettingForm.get('form_limit').clearValidators();
      this.homeSettingForm.get('form_see_more_url').clearValidators();
    }
    if (event == true) {
      this.homeSettingForm.get('form_limit').setValidators([Validators.required]);
      this.homeSettingForm.get('form_see_more_url').setValidators([Validators.required]);
    }
    this.homeSettingForm.get('form_limit').updateValueAndValidity();
    this.homeSettingForm.get('form_see_more_url').updateValueAndValidity();
  }

  my_guestChange(event) {
    if (event == false) {
      this.homeSettingForm.get('guest_limit').clearValidators();
      this.homeSettingForm.get('guest_see_more_url').clearValidators();
    }
    if (event == true) {
      this.homeSettingForm.get('guest_limit').setValidators([Validators.required]);
      this.homeSettingForm.get('guest_see_more_url').setValidators([Validators.required]);
    }
    this.homeSettingForm.get('guest_limit').updateValueAndValidity();
    this.homeSettingForm.get('guest_see_more_url').updateValueAndValidity();
  }


  my_diningsChange(event) {
    if (event == false) {
      this.homeSettingForm.get('dining_limit').clearValidators();
      this.homeSettingForm.get('dining_see_more_url').clearValidators();
    }
    if (event == true) {
      this.homeSettingForm.get('dining_limit').setValidators([Validators.required]);
      this.homeSettingForm.get('dining_see_more_url').setValidators([Validators.required]);
    }
    this.homeSettingForm.get('dining_limit').updateValueAndValidity();
    this.homeSettingForm.get('dining_see_more_url').updateValueAndValidity();
  }



  my_appointmentsChange(event) {
    if (event == false) {
      this.homeSettingForm.get('appointment_limit').clearValidators();
      this.homeSettingForm.get('appointment_see_more_url').clearValidators();
    }
    if (event == true) {
      this.homeSettingForm.get('appointment_limit').setValidators([Validators.required]);
      this.homeSettingForm.get('appointment_see_more_url').setValidators([Validators.required]);
    }
    this.homeSettingForm.get('appointment_limit').updateValueAndValidity();
    this.homeSettingForm.get('appointment_see_more_url').updateValueAndValidity();
  }


  my_tabereservationChange(event) {
    if (event == false) {
      this.homeSettingForm.get('tablereservation_limit').clearValidators();
      this.homeSettingForm.get('table_see_more_url').clearValidators();
    }
    if (event == true) {
      this.homeSettingForm.get('tablereservation_limit').setValidators([Validators.required]);
      this.homeSettingForm.get('table_see_more_url').setValidators([Validators.required]);
    }
    this.homeSettingForm.get('tablereservation_limit').updateValueAndValidity();
    this.homeSettingForm.get('table_see_more_url').updateValueAndValidity();
  }

  my_meetingroomChange(event) {
    if (event == false) {
      this.homeSettingForm.get('meetingroom_limit').clearValidators();
      this.homeSettingForm.get('meetingroom_see_more_url').clearValidators();
    }
    if (event == true) {
      this.homeSettingForm.get('meetingroom_limit').setValidators([Validators.required]);
      this.homeSettingForm.get('meetingroom_see_more_url').setValidators([Validators.required]);
    }
    this.homeSettingForm.get('meetingroom_limit').updateValueAndValidity();
    this.homeSettingForm.get('meetingroom_see_more_url').updateValueAndValidity();
  }

  my_foodreservationChange(event) {
    if (event == false) {
      this.homeSettingForm.get('foodreservation_limit').clearValidators();
      this.homeSettingForm.get('food_see_more_url').clearValidators();
    }
    if (event == true) {
      this.homeSettingForm.get('foodreservation_limit').setValidators([Validators.required]);
      this.homeSettingForm.get('food_see_more_url').setValidators([Validators.required]);
    }
    this.homeSettingForm.get('foodreservation_limit').updateValueAndValidity();
    this.homeSettingForm.get('food_see_more_url').updateValueAndValidity();
  }

  my_eventsChange(event) {
    if (event == false) {
      this.homeSettingForm.get('event_limit').clearValidators();
      this.homeSettingForm.get('event_see_more_url').clearValidators();
    }
    if (event == true) {
      this.homeSettingForm.get('event_limit').setValidators([Validators.required]);
      this.homeSettingForm.get('event_see_more_url').setValidators([Validators.required]);
    }
    this.homeSettingForm.get('event_limit').updateValueAndValidity();
    this.homeSettingForm.get('event_see_more_url').updateValueAndValidity();
  }
  my_favorite_eventsChange(event) {
    if (event == false) {
        this.homeSettingForm.get('favorite_event_limit').clearValidators();
        this.homeSettingForm.get('favorite_event_see_more_url').clearValidators();          
    }
    if (event == true) {
        this.homeSettingForm.get('favorite_event_limit').setValidators([Validators.required]);
        this.homeSettingForm.get('favorite_event_see_more_url').setValidators([Validators.required]);
    }
    this.homeSettingForm.get('favorite_event_limit').updateValueAndValidity();
    this.homeSettingForm.get('favorite_event_see_more_url').updateValueAndValidity();     
  }

  weather_setChange(event) {
    if (event == false) {
      this.homeSettingForm.get('title').clearValidators();
      this.homeSettingForm.get('city_id').clearValidators();
      this.homeSettingForm.get('app_id').clearValidators();
      this.homeSettingForm.get('city_name').clearValidators();
      this.homeSettingForm.get('unit').clearValidators();
      this.homeSettingForm.get('show_icon').clearValidators();
      this.homeSettingForm.get('size').clearValidators();
      this.homeSettingForm.get('forecast').clearValidators();
      this.homeSettingForm.get('bg_color').clearValidators();
      this.homeSettingForm.get('text_color').clearValidators();
      this.homeSettingForm.get('hide_current_stats').clearValidators();
      this.homeSettingForm.get('hide_weather_attribution').clearValidators();
      this.homeSettingForm.get('link_to_extended').clearValidators();
    }
    if (event == true) {
      this.homeSettingForm.get('title').setValidators([Validators.required]);
      this.homeSettingForm.get('city_id').setValidators([Validators.required]);
      this.homeSettingForm.get('app_id').setValidators([Validators.required]);
      this.homeSettingForm.get('city_name').setValidators([Validators.required]);
      this.homeSettingForm.get('unit').setValidators([Validators.required]);
      this.homeSettingForm.get('show_icon').setValidators([Validators.required]);
      this.homeSettingForm.get('size').setValidators([Validators.required]);
      this.homeSettingForm.get('forecast').setValidators([Validators.required]);
      this.homeSettingForm.get('bg_color').setValidators([Validators.required]);
      this.homeSettingForm.get('text_color').setValidators([Validators.required]);
      this.homeSettingForm.get('hide_current_stats').setValidators([Validators.required]);
      this.homeSettingForm.get('hide_weather_attribution').setValidators([Validators.required]);
      this.homeSettingForm.get('link_to_extended').setValidators([Validators.required])
    }

    this.homeSettingForm.get('title').updateValueAndValidity();
    this.homeSettingForm.get('city_id').updateValueAndValidity();
    this.homeSettingForm.get('app_id').updateValueAndValidity();
    this.homeSettingForm.get('city_name').updateValueAndValidity();
    this.homeSettingForm.get('unit').updateValueAndValidity();
    this.homeSettingForm.get('show_icon').updateValueAndValidity();
    this.homeSettingForm.get('size').updateValueAndValidity();
    this.homeSettingForm.get('forecast').updateValueAndValidity();
    this.homeSettingForm.get('bg_color').updateValueAndValidity();
    this.homeSettingForm.get('text_color').updateValueAndValidity();
    this.homeSettingForm.get('hide_current_stats').updateValueAndValidity();
    this.homeSettingForm.get('hide_weather_attribution').updateValueAndValidity();
    this.homeSettingForm.get('link_to_extended').updateValueAndValidity();
  }

  //GET MENUS LIST SHOWN ON QUICKLINKS
  public getMenusList() {
    this._menusService.getMenusList({ 'menu_parent_id': 0, 'position': 'M' }).subscribe(menuinfo => {
      if (menuinfo && menuinfo.data) {
        this.quickMenus = menuinfo.data || [];
      }
    })
  }
  public returnZero() {
    return 0;
  }
}
