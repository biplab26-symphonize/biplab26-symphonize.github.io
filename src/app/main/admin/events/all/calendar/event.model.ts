import { startOfDay, endOfDay } from 'date-fns';

export class CalendarEventModel {
    id?: string;
    groupId?: string;
    allDay: boolean;
    title: string;
    url: string;
    start: Date;
    end?: Date;
    editable: boolean;
    RegColors: any = { regBgColor: '#000000', regBorderColor: '#ffffff' };
    backgroundColor: string = '#ffffff';
    borderColor: string = '#ffffff';
    textColor: string = '#000000';
    extendedProps: any = {};

    /**
     * Constructor
     *
     * @param data
     */
    constructor(eventItem: any = {}, regColors: any) {
        this.RegColors = regColors;
        this.start = new Date(eventItem.event_start_date.replace(/-/g, '\/') + ' ' + eventItem.event_start_time) || startOfDay(new Date());
        this.end = new Date(eventItem.event_end_date) || endOfDay(new Date());
        this.title = eventItem.event_title || '';
        //Modify Dates Support on SAFARI -------
        eventItem.event_start_date = new Date(eventItem.event_start_date.replace(/-/g, '\/') + ' ' + eventItem.event_start_time);
        if (eventItem.event_end_time) {
            eventItem.event_end_date = new Date(eventItem.event_end_date.replace(/-/g, '\/') + ' ' + eventItem.event_end_time);
        }

        if (eventItem.registration_start) {
            eventItem.registration_start = new Date(eventItem.registration_start.replace(/-/g, '\/'));
        }
        if (eventItem.registration_end) {
            eventItem.registration_end = new Date(eventItem.registration_end.replace(/-/g, '\/'));
        }
        //multiple locations alter
        if(eventItem && eventItem.eventlocations && eventItem.eventlocations.length>0 ){
            let locationsString = eventItem.eventlocations.map(item=>{
                let locationName = item.eventlocation && item.eventlocation.category_name ? item.eventlocation.category_name : '';
                return locationName;
            });
            eventItem.eventlocation.category_name = locationsString!=='' && locationsString!==undefined && locationsString.length>0 ? locationsString.join(', ') : '';
        }

        this.extendedProps = eventItem;
        this.getCategoryBgColor(eventItem);
        this.getCategoryFontColor(eventItem);
        this.getRegistrationColor(eventItem);

    }
    //get background color
    getCategoryBgColor(eventItem: any) {
        let categoryInfo = eventItem.eventcategories && eventItem.eventcategories.length > 0 ? eventItem.eventcategories : [];
        //subcategories
        let subcategoryInfo = eventItem.eventsubcategories && eventItem.eventsubcategories.length > 0 ? eventItem.eventsubcategories : [];

        if (categoryInfo && categoryInfo.length > 0 && categoryInfo[0].categories && categoryInfo[0].categories.bg_color) {
            // this.backgroundColor = categoryInfo[0].categories.bg_color || "";
            this.backgroundColor = "transparent";
            this.borderColor = categoryInfo[0].categories.bg_color;
        }
        else if (subcategoryInfo && subcategoryInfo.length > 0 && subcategoryInfo[0].subcategories && subcategoryInfo[0].subcategories.bg_color) {
            // this.backgroundColor = subcategoryInfo[0].subcategories.bg_color || "";
            this.backgroundColor = "transparent";
            this.borderColor = subcategoryInfo[0].subcategories.bg_color;
        }
    }
    //get background color
    getCategoryFontColor(categoryInfo: any[] = []) {
        if (categoryInfo.length > 0 && categoryInfo[0].categories && categoryInfo[0].categories.font_color) {
            this.textColor = categoryInfo[0].categories.font_color || "";
        }
    }
    //Registration Required Colors            
    getRegistrationColor(eventInfo: any) {
        if (eventInfo.req_register == 'Y') {
            this.backgroundColor = this.RegColors.regBgColor;
            //this.borderColor     = this.RegColors.regBorderColor;
        }
        else {
            this.backgroundColor = this.backgroundColor;
            //this.borderColor     = this.borderColor;
        }
    }
}
