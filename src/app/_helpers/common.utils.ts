import { FormGroup } from '@angular/forms';
import { AppConfig } from 'app/_services';
import { Injectable } from "@angular/core";

@Injectable()
export class CommonUtils {
    /**
     * Prepare Filter Array On Table List
     *
     * @param item
     * @param array
     */
    public static getFilterJson(sortArray, paginationArray, formArray): any {
        var filterJson = {};
        //Sort Array
        if (sortArray.active && sortArray.direction) {
            filterJson['column'] = sortArray.active;
            filterJson['direction'] = sortArray.direction;
        }
        //Pagination Array
        if (paginationArray.pageIndex >= 0 && paginationArray.pageSize > 0) {
            filterJson['page'] = paginationArray.pageIndex == 0 ? 1 : paginationArray.pageIndex + 1;
            filterJson['limit'] = paginationArray.pageSize;
        }

        //Form Array
        if (formArray) {
            if (formArray.searchKey !== '' && formArray.searchKey !== null && formArray.searchKey !== undefined) {
                filterJson['searchKey'] = formArray.searchKey;
            }
            if (formArray.front !== '' && formArray.front !== undefined) {
                filterJson['front'] = formArray.front;
            }
            if (formArray.status !== '' && formArray.status !== undefined) {
                filterJson['status'] = formArray.status;
            }
            if (formArray.type !== '' && formArray.type !== undefined) {
                filterJson['type'] = formArray.type;
            }
            if (formArray.eventstype !== '' && formArray.eventstype !== undefined) {
                filterJson['eventstype'] = formArray.eventstype;
            }
            if (formArray.service_id !== '' && formArray.service_id !== undefined) {
                filterJson['service_id'] = formArray.service_id;
            }
            if (formArray.from_date !== '' && formArray.from_date !== undefined) {
                filterJson['from_date'] = formArray.from_date;
            }
            if (formArray.to_date !== '' && formArray.to_date !== undefined) {
                filterJson['to_date'] = formArray.to_date;
            }
            if (formArray.roles && formArray.roles.length > 0) {
                filterJson['roles'] = formArray.roles.join(",");
            }
            if (formArray.form_id > 0) {
                filterJson['form_id'] = formArray.form_id;
            }
            if (formArray.trash !== '' && formArray.trash !== undefined) {
                filterJson['trash'] = formArray.trash;
            }
            if (formArray.display !== '' && formArray.display !== undefined) {
                filterJson['display'] = formArray.display;
            }
            if (formArray.field_form_type !== '' && formArray.field_form_type !== undefined) {
                filterJson['field_form_type'] = formArray.field_form_type;
            }
            if (formArray.categories) {
                filterJson['categories'] = formArray.categories.join(",");;
            }
            if (formArray.subcategories) {
                filterJson['subcategories'] = formArray.subcategories.join(",");;
            }
            if (formArray.eventcategories) {
                filterJson['eventcategories'] = formArray.eventcategories;
            }
            //send event meta in filters
            if (formArray.metafields !== '' && formArray.metafields !== [] && formArray.metafields !== null && formArray.metafields !== undefined) {
                filterJson['metafields'] = formArray.metafields;
            }
            if (formArray.pagetype !== undefined && formArray.pagetype !== '') {
                filterJson['pagetype'] = formArray.pagetype;
            }
            if (formArray.menu_id !== undefined && formArray.menu_id !== '') {
                filterJson['menu_id'] = formArray.menu_id;
            }
            if (formArray.month) {
                filterJson['month'] = formArray.month;
            }
            if (formArray.year) {
                filterJson['year'] = formArray.year;
            }
            if (formArray.monthyear) {
                filterJson['monthyear'] = formArray.monthyear;
            }
            if (formArray.type !== '' && formArray.type !== undefined) {
                filterJson['type'] = formArray.type;
            }
            if (formArray.preview !== '' && formArray.preview !== undefined) {
                filterJson['preview'] = formArray.preview;
            }
            //categories Filter by category_type
            if (formArray.category_type !== '' && formArray.category_type !== undefined) {
                filterJson['category_type'] = formArray.category_type;
            }
            if (formArray.dates !== '' && formArray.dates !== undefined) {
                filterJson['dates'] = formArray.dates;
            }
            //send menu type url,page on files/library
            if (formArray.menu_source !== '' && formArray.menu_source !== undefined) {
                filterJson['menu_source'] = formArray.menu_source;
            }
            //send menu type url,page on files/library
            if (formArray.menu_source_type !== '' && formArray.menu_source_type !== undefined) {
                filterJson['menu_source_type'] = formArray.menu_source_type;
            }
            //send menu_type = page/url for file uploader
            if (formArray.menu_type !== '' && formArray.menu_type !== undefined) {
                filterJson['menu_type'] = formArray.menu_type;
            }
            //send eventId on attendees list page
            if (formArray.event_id !== '' && formArray.event_id !== undefined) {
                filterJson['event_id'] = formArray.event_id;
            }
            if (formArray.event_location !== '' && formArray.event_location !== null && formArray.event_location !== undefined) {
                filterJson['event_location'] = formArray.event_location;
            }
            if (formArray.event_start_date !== '' && formArray.event_start_date !== null && formArray.event_start_date !== undefined) {
                filterJson['event_start_date'] = formArray.event_start_date;
            }
            //Print calendar
            if (formArray.display !== '' && formArray.display !== null && formArray.display !== undefined) {
                filterJson['display'] = formArray.display;
            }
            if (formArray.print !== '0' && formArray.print !== null && formArray.print !== undefined) {
                filterJson['print'] = formArray.print;
            }
            if (formArray.date !== '' && formArray.date !== null && formArray.date !== undefined) {
                filterJson['date'] = formArray.date;
            }
            if (formArray.username !== '' && formArray.username !== null && formArray.username !== undefined) {
                filterJson['username'] = formArray.username;
            }
            if (formArray.preffix !== '' && formArray.preffix !== null && formArray.preffix !== undefined) {
                filterJson['preffix'] = formArray.preffix;
            }
            if (formArray.first_name !== '' && formArray.first_name !== null && formArray.first_name !== undefined) {
                filterJson['first_name'] = formArray.first_name;
            }
            if (formArray.last_name !== '' && formArray.last_name !== null && formArray.last_name !== undefined) {
                filterJson['last_name'] = formArray.last_name;
            }
            if (formArray.middle_name !== '' && formArray.middle_name !== null && formArray.middle_name !== undefined) {
                filterJson['middle_name'] = formArray.middle_name;
            }
            if (formArray.email !== '' && formArray.email !== null && formArray.email !== undefined) {
                filterJson['email'] = formArray.email;
            }
            if (formArray.phone !== '' && formArray.phone !== null && formArray.phone !== undefined) {
                filterJson['phone'] = formArray.phone;
            }
            if (formArray.birthdate !== '' && formArray.birthdate !== null && formArray.birthdate !== undefined) {
                filterJson['birthdate'] = formArray.birthdate;
            }
            if (formArray.name !== '' && formArray.name !== null && formArray.name !== undefined) {
                filterJson['name'] = formArray.name;
            }
            if (formArray.email !== '' && formArray.email !== null && formArray.email !== undefined) {
                filterJson['email'] = formArray.email;
            }
            if (formArray.designation !== '' && formArray.designation !== null && formArray.designation !== undefined) {
                filterJson['designation'] = formArray.designation;
            }
            //Resident Directory LetterSearch
            if (formArray.letters !== '' && formArray.letters !== null && formArray.letters !== undefined) {
                filterJson['letters'] = formArray.letters;
            }
            //Event - special event filter control
            if (formArray.special_event !== '' && formArray.special_event !== null && formArray.special_event !== undefined) {
                filterJson['special_event'] = formArray.special_event;
            }
            //Event - calendar_id filter control
            if (formArray.calendar_id !== '' && formArray.calendar_id !== null && formArray.calendar_id !== undefined) {
                filterJson['calendar_id'] = formArray.calendar_id;
            }
            //Event - calendar slug
            if (formArray.slug !== '' && formArray.slug !== null && formArray.slug !== undefined) {
                filterJson['slug'] = formArray.slug;
            }
            //notification_type filter
            if (formArray.notification_type !== '' && formArray.notification_type !== null && formArray.notification_type !== undefined) {
                filterJson['notification_type'] = formArray.notification_type;
            }
        }

        return filterJson;
    }

    /** ARRAY TO STRING CONVERSION */
    getArrayToString(input: []): string {
        return input.toString();
    }
    /**STRign to JSON */
    public static getStringToJson(input: string): object {

        //    console.log("type of input", typeof(input));
        // pre code 
        // return JSON.parse(input);
        // new code 
        let contentInfo = typeof input === 'string' ? JSON.parse(input) : input;
        return contentInfo;
    }
    /**AGE CALCULATION */
    public static CalculateAge(birthDate: any): number {
        if (birthDate) {
            var timeDiff = Math.abs(Date.now() - new Date(birthDate).getTime());
            var validAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
            return validAge;
        }
        return 0;
    }
    /** Get Json Format For save to server */
    public static getSettingsJsonFormat(jsonInfo, settingType = 'userimportfields', PreFieldsArray) {
        let FieldsArray: any;

        if (settingType == 'userimportfields') {
            FieldsArray = { corefields: '', metafields: '', roleid: '' };
            //Corefields
            FieldsArray.corefields = jsonInfo.corefields.join(",");
            //metaFields
            FieldsArray.metafields = PreFieldsArray.metaFieldsArray.filter(item => {
                return jsonInfo.metafields.includes(item.id);
            });
            //RoleID
            FieldsArray.roleid = jsonInfo.userroles || "";
            FieldsArray = JSON.stringify([FieldsArray]);
        }

        if (settingType == 'staffimportfields') {
            FieldsArray = { corefields: '', metafields: '', roleid: '' };
            //Corefields
            FieldsArray.corefields = jsonInfo.corefields.join(",");
            //metaFields
            FieldsArray.metafields = PreFieldsArray.metaFieldsArray.filter(item => {
                return jsonInfo.metafields.includes(item.id);
            });
            //RoleID
            FieldsArray.roleid = jsonInfo.userroles || "";
            FieldsArray = JSON.stringify([FieldsArray]);
        }
        if (settingType == 'eventimportfields') {
            FieldsArray = { corefields: '', metafields: '', roleid: '' };
            //Corefields
            FieldsArray.corefields = jsonInfo.corefields.join(",");
            //metaFields
            FieldsArray.metafields = PreFieldsArray.metaFieldsArray.filter(item => {
                return jsonInfo.metafields.includes(item.id);
            });
            //RoleID
            FieldsArray.roleid = jsonInfo.userroles || "";
            FieldsArray = JSON.stringify([FieldsArray]);
        }



        //Export fields settings
        if (settingType == 'userexportfields') {
            FieldsArray = { corefields: '', metafields: '' };
            //Corefields
            FieldsArray.corefields = jsonInfo.corefields.join(",");
            //metaFields
            FieldsArray.metafields = PreFieldsArray.metaFieldsArray.filter(item => {
                return jsonInfo.metafields.includes(item.id);
            });
            FieldsArray = JSON.stringify([FieldsArray]);
        }

        //Export Staff    
        if (settingType == 'staffexportfields') {
            FieldsArray = { corefields: '', metafields: '' };
            //Corefields
            FieldsArray.corefields = jsonInfo.corefields.join(",");
            //metaFields
            FieldsArray.metafields = PreFieldsArray.metaFieldsArray.filter(item => {
                return jsonInfo.metafields.includes(item.id);
            });
            FieldsArray = JSON.stringify([FieldsArray]);
        }

        //Export Event    
        if (settingType == 'eventexportfields') {
            FieldsArray = { corefields: '', metafields: '' };
            //Corefields
            FieldsArray.corefields = jsonInfo.corefields.join(",");
            //metaFields
            FieldsArray.metafields = PreFieldsArray.metaFieldsArray.filter(item => {
                return jsonInfo.metafields.includes(item.id);
            });
            FieldsArray = JSON.stringify([FieldsArray]);
        }

        //Export Event Attendee   
        if (settingType == 'exporteventattendeefields') {
            FieldsArray = { corefields: '', metafields: '' };
            //Corefields
            FieldsArray.corefields = jsonInfo.corefields.join(",");
            //metaFields
            FieldsArray.metafields = PreFieldsArray.metaFieldsArray.filter(item => {
                return jsonInfo.metafields.includes(item.id);
            });
            FieldsArray = JSON.stringify([FieldsArray]);
        }

        if (settingType == 'exportactivitylogfields') {
            FieldsArray = { corefields: '', metafields: '' };
            //Corefields
            FieldsArray.corefields = jsonInfo.corefields.join(",");
            //metaFields
            FieldsArray.metafields = PreFieldsArray.metaFieldsArray.filter(item => {
                return jsonInfo.metafields!=undefined?jsonInfo.metafields.includes(item.id):'';
            });
            FieldsArray = JSON.stringify([FieldsArray]);
        }    


        
        
        //Resident Directory Settings
        if (settingType == 'residentdirectorysearch') {
            FieldsArray = {
                corefields: '',
                metafields: [],
                profilecorefields: '',
                profilemetafields: [],
                neighbourcorefields: [],
                neighbourmetafields: [],
                printoptions: {
                    showcorefields: '',
                    showmetafields: []
                },
                filteroptions: {
                    filtercorefields: '',
                    filtermetafields: []
                },
                subtractdays: 0,
                user_limit: 0,
                alpha_sorting: '',
                newest_neighbours:'',
                letter_sorting: '',
                directory_view: '',
                edit_user_access: ''
            };
            //Corefields
            FieldsArray.corefields = jsonInfo.corefields.join(",");
            //metaFields
            FieldsArray.metafields = PreFieldsArray.metaFieldsArray.filter(item => {
                return jsonInfo.metafields.includes(item.id);
            });

            //ProfileCorefields
            FieldsArray.profilecorefields = jsonInfo.profilecorefields.join(",");
            //ProfilemetaFields
            FieldsArray.profilemetafields = PreFieldsArray.profilemetaFieldsArray.filter(item => {
                return jsonInfo.profilemetafields.includes(item.id);
            });


            //Corefields for Print
            FieldsArray.printoptions.showcorefields = jsonInfo.printoptions.showcorefields.join(",");
            //metaFields for Print
            FieldsArray.printoptions.showmetafields = jsonInfo.printoptions.showmetafields;
            //Corefields for filter
            FieldsArray.filteroptions.filtercorefields = jsonInfo.filteroptions.filtercorefields.join(",");
            //metaFields for filter
            FieldsArray.filteroptions.filtermetafields = jsonInfo.filteroptions.filtermetafields;
            //RoleID
            FieldsArray.subtractdays = jsonInfo.subtractdays || 0;
            FieldsArray.user_limit = jsonInfo.user_limit || 0;
            FieldsArray.alpha_sorting = jsonInfo.alpha_sorting;
            FieldsArray.newest_neighbours = jsonInfo.newest_neighbours;
            FieldsArray.letter_sorting = jsonInfo.letter_sorting;
            FieldsArray.directory_view = jsonInfo.directory_view;
            FieldsArray.edit_user_access = jsonInfo.edit_user_access;
            FieldsArray.show_in_list = jsonInfo.show_in_list;

            //NeighbourCorefields
            FieldsArray.neighbourcorefields = jsonInfo.neighbourcorefields.join(",");
            //NeighbourmetaFields
            FieldsArray.neighbourmetafields = PreFieldsArray.neighbourmetafieldsArray.length > 0 ? PreFieldsArray.neighbourmetafieldsArray.filter(item => {
                return jsonInfo.neighbourmetafields.includes(item.id);
            }) : jsonInfo.neighbourmetafields;

            FieldsArray = JSON.stringify([FieldsArray]);
        }
        return FieldsArray;
    }


    /** Validate form fields*/
    public static validateAllFormFields(formGroup: FormGroup): any {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            control.markAsTouched({ onlySelf: true });
        });
    }
    public static scrollToFirstInvalidControl(element) {
        const firstInvalidControl: HTMLElement = element.nativeElement.querySelector("form .ng-invalid");
        if (firstInvalidControl) {
            firstInvalidControl.scrollIntoView(); //without smooth behavior
        }
    }

    /**custom validate email */
    public static validCustomEmail(str) {
        // Handle All Requirements 1-5
        var regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regEx.test(str);
    }
    /** Get Flat Json From Object */
    public static getFlatSingleJson(obj) {
        let result = [];
        result.push({
            menu_id: obj.menu_id,
            menu_title: obj.menu_title,
            menu_parent_id: obj.menu_parent_id,
            order: obj.order
        });
        if (obj.children && obj.children.length) {
            obj.children.forEach(child => {
                result = result.concat(CommonUtils.getFlatSingleJson(child));
            });
        }
        return result;
    }

    // added another method to run forEach
    public static getFlatArrayJson(arr) {
        let result = [];
        arr.forEach(obj => {
            result = result.concat(CommonUtils.getFlatSingleJson(obj));
        });

        return result;
    }
    //Get Sorted Array by Criteria
    public static sortJsonbyArray(jsonArray, SortArr) {
        if (jsonArray && SortArr) {
            let result = [];
            let catsArray = [];
            SortArr.forEach(obj => { result = result.concat(jsonArray.filter(catItem => { return catItem.id == obj })); });
            catsArray = result.concat(jsonArray);
            catsArray = catsArray.filter((li, idx, self) => self.map(itm => itm.id).indexOf(li.id) === idx);
            return catsArray;
        }
        return jsonArray;

    }

    /****GET FORMATED DATA OF DROPDOWN */
    public getFormatElementofDepartment(ele) {
        let deptArr = [];
        for (let i = 0; i < ele.length; i++) {
            if (ele[i].category_type == 'DEPT' && ele[i].status == 'A') {

                let objDept: any = {};
                objDept.id = ele[i].id;
                objDept.category_name = ele[i].category_name;
                objDept.status = ele[i].status;
                objDept.sub_categories = ele[i].subcategories;
                deptArr.push(objDept);
            }
        }
        return deptArr;
    }

    /********** GET TINYMCE SETTING */
    public static getTinymceSetting(editorType: string = 'forum', maxChars: number = 5000, enablelimit=false) {
        var max_length = maxChars;
        console.log('max_length',maxChars);
        let MediaUploadUrl = AppConfig.Settings.url.apiUrl;
        let tokenInfo = JSON.parse(localStorage.getItem('token'));
        let tinyMceSettings = {
            base_url: '/tinymce', // Root for resources
            convert_urls: true,
            relative_urls: false,
            remove_script_host: false,
            suffix: '.min',
            plugins: 'image link insertdatetime paste wordcount lists',
            menubar: false,
            statusbar: false,
            paste_as_text: true,
            element_format: 'html',
            fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px',
            toolbar1: 'fontsizeselect | formatselect | bold italic underline strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist blockquote | wordcount',
            toolbar2: 'pastetext undo redo | image | link',
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
                if(enablelimit==false){
                    ed.on('keyup keydown', function (e) {
                        var content = ed.getContent().replace(/(<([^>]+)>)/ig, "");
                        if (content.length >= max_length && e.keyCode !== 8) {
                            let validtext = content.substring(0, max_length);
                            ed.setContent(validtext);
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }
                        return true;
                    });
                }
            },
            images_upload_handler: function (blobInfo, success, failure) {
                var xhr, formData;
                xhr = new XMLHttpRequest();
                xhr.withCredentials = false;
                xhr.open('POST', MediaUploadUrl + 'media/upload');
                xhr.setRequestHeader("Authorization", "Bearer " + tokenInfo.token);
                xhr.onload = function () {
                    var json;
                    if (xhr.status != 200) {
                        failure('HTTP Error: ' + xhr.status);
                        return;
                    }
                    json = JSON.parse(xhr.responseText);

                    if (!json || typeof json.location != 'string') {
                        failure('Invalid JSON: ' + xhr.responseText);
                        return;
                    }
                    success(json.location);
                };

                formData = new FormData();
                formData.append('image', blobInfo.blob(), blobInfo.filename());
                formData.append('type', editorType);
                formData.append('upload_by', 'editor');
                xhr.send(formData);
            }
        };
        return tinyMceSettings;
    }



    public static setHorizontalLayout() {
        //Settings to Hide Sidebar and searchbar
        let restrictRoles = AppConfig.Settings.permissions;
        let currentuserRole = JSON.parse(localStorage.getItem('token')).role_id;
        let showAccountSidebar = restrictRoles['kiosk'].includes(currentuserRole) ? true : false;

        let horizontalLayout =
        {
            colorTheme: 'theme-viibrant',
            layout: {
                style: 'front-horizontal-layout-1',
                width: 'fullwidth',
                front: true,
                scroll: true,
                breadcumb: false,
                navbar: {
                    primaryBackground: 'blue-grey-50',
                    secondaryBackground: 'accent',
                    folded: false,
                    hidden: false,
                    position: 'top',
                    variant: 'front-vertical-style-1'
                },
                //Tools are used here as mobile header
                toolbar: {
                    hidden: false,
                    position: 'above',
                    customBackgroundColor: true,
                    background: 'blue-grey-50'
                },
                footer: {
                    customBackgroundColor: true,
                    background: 'footer-Color',
                    hidden: false,
                    position: 'below-static'
                },
                sidepanel: {
                    hidden: showAccountSidebar,
                    position: 'right'
                },
                searchbar: showAccountSidebar
            }
        };
        return horizontalLayout;
    }

    //Set Vertical Layout for admin part
    public static setVerticalLayout() {
        let verticalLayout =
        {
            colorTheme      : 'theme-default',
            customScrollbars: true,
            enablesettings:false,
            layout          : {
                style    : 'vertical-layout-1',
                width    : 'fullwidth',
                front    : false,
                scroll   : false,   
                breadcumb    : false,
                navbar   : {
                    primaryBackground  : 'fuse-navy-700',
                    secondaryBackground: 'fuse-navy-900',
                    folded             : false,
                    hidden             : false,
                    position           : 'left',
                    variant            : 'vertical-style-2'
                },
                toolbar  : {
                    customBackgroundColor: false,
                    background           : 'fuse-white-500',
                    hidden               : false,
                    position             : 'below-static'
                },
                footer   : {
                    customBackgroundColor: true,
                    background           : 'fuse-navy-900',
                    hidden               : true,
                    position             : 'below-fixed'
                },
                sidepanel: {
                    hidden  : false,
                    position: 'right'
                },
                searchbar:true
            }
        };
        return verticalLayout;
    }
    //Convert Fields Content Stringify Data to Json used for validations,radiobuttons etc...
    public static convertFieldsContent(fieldInfo: any = []) {
        fieldInfo.map((field, index) => {
            if (field.content) {
                let contentInfo;
                contentInfo = typeof field.content === 'string' ? JSON.parse(field.content) : field.content;
                fieldInfo[index].content = contentInfo.length > 0 && field.fields.field_type !== 'list' ? contentInfo[0] : contentInfo;

            }
        });
        return fieldInfo;
    }
    //Return usermeta fields with its name and type
    public static getMetaValues(metaArray: any[] = []) {
        let metaArrayValues = [];
        if (metaArray) {
            metaArray.map(item => {
                metaArrayValues.push(
                    {
                        'field_id': item.field_id,
                        'field_value': item.field_value,
                        'dynamicfields': item.dynamicfields,
                        'field_type': item.user_fields ? item.user_fields.field_type : '',
                        'field_name': item.user_fields ? item.user_fields.field_name : '',
                        'field_label': item.user_fields ? item.user_fields.field_label : '',
                        'field_content': item.user_fields && item.user_fields.field_content ? JSON.parse(item.user_fields.field_content) : null
                    }
                )
            })
        }
        return metaArrayValues;
    }
    //GetYearsDropdown
    public static getSelectYears(maxYears, lastYear = true) {
        let YearsArray = [];
        let currentYear = new Date().getFullYear();
        let maximumYear = currentYear + maxYears;
        let previousYear = lastYear == true ? currentYear - 1 : currentYear;
        for (var i = currentYear; i <= maximumYear; i++) {
            YearsArray.push(i);
        }
        return YearsArray;
    }
    //Get Status Registration
    public static getRegistrationStatus(regInfo: any) {
        if (regInfo.is_waiting == 'N' && regInfo.status == 'registered') {
            return '-Registered';
        } else if (regInfo.is_waiting == 'N' && regInfo.status == 'checkedin') {
            return '-Registered(Checked In)';
        } else if (regInfo.is_waiting == 'Y' && regInfo.status == 'registered') {
            return '-Waitlist(Approved)';
        } else if (regInfo.is_waiting == 'Y' && regInfo.status == 'checkedin') {
            return '-Checked In(Waitlist)';
        } else if (regInfo.is_waiting == 'Y' && regInfo.status == 'waitlist') {
            return '-Waitlist';
        } else if (regInfo.is_waiting == 'N' && regInfo.status == 'cancelled') {
            return '-Registered(Cancelled)';
        } else if (regInfo.is_waiting == 'Y' && regInfo.status == 'cancelled') {
            return '-Waitlist(Cancelled)';
        } else {
            return '';
        }
    }
    //GET WEEK OF MONTH
    public static getWeekOfMonth(date, statrtofWeek = 0) {
        const startWeekDayIndex = statrtofWeek; // 1 MonthDay 0 Sundays
        const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const firstDay = firstDate.getDay();

        let weekNumber = Math.ceil((date.getDate() + firstDay) / 7);
        if (startWeekDayIndex === 1) {
            if (date.getDay() === 0 && date.getDate() > 1) {
                weekNumber -= 1;
            }
            if (firstDate.getDate() === 1 && firstDay === 0 && date.getDate() > 1) {
                weekNumber += 1;
            }
        }
        return weekNumber;
    }
    //get nthDay Of the Month
    public static getDayofMonth(date) {
        var nth = [1, 2, 3, 4, 5, 6];
        return nth[Math.floor(date.getDate() / 7)];
    }
    //RemoveDuplicates
    public static removeDuplicates(dupArr: any[] = []) {
        var uniqueIds = dupArr.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
        });
        return uniqueIds;
    }
    //GetStringtoDateObject
    public static getStringToDate(dateString: any = '') {
        if (dateString) {
            return new Date(dateString.replace(/-/g, '\/'));
        }
        return dateString;
    }
}
