import { Injectable } from '@angular/core';
import { RRule, RRuleSet, rrulestr } from 'rrule';
import moment from 'moment-timezone';
import { CommonUtils } from 'app/_helpers';
@Injectable({
  providedIn: 'root'
})
export class EventRruleService {

  constructor() { }
  generateRecurrances(rule) {
    if(rule.freq == 'D'){
      if(rule.recurring_repeat_end == 'interval'){
        return this.recDailyCount(rule);
      }
      else if(rule.recurring_repeat_end == 'on_date'){
        return this.recDailyUntil(rule);
      }
    }
    else if(rule.freq == 'W'){
      if(rule.recurring_repeat_end == 'interval' && rule.byweekday){
        return this.recWeeklyCount(rule);
      }
      else if(rule.recurring_repeat_end == 'on_date' && rule.byweekday){
        return this.recWeeklyUntil(rule);
      }
    }
    else if(rule.freq == 'M' && rule.monthly_on !== ''){
      if(rule.recurring_repeat_end == 'interval' && (rule.bymonthday || (rule.byday && rule.bysetpos))){
        return this.recMonthlyCount(rule);
      }
      else if(rule.recurring_repeat_end == 'on_date' && (rule.bymonthday || (rule.byday && rule.bysetpos))){
        return this.recMonthlyUntil(rule);
      }
    }
  }

  recDailyCount(rule) {
    const rruleObj = new RRuleSet();
    rruleObj.rrule(new RRule({
      freq: RRule.DAILY,
      interval: rule.interval,
      dtstart: rule.dtstart,
      count: rule.count
    }));
    let rruleSet = RRule.fromString(rruleObj.toString());
    
    return {'text': rruleSet.toText(), 'rule': rruleSet.toString(), 'dates': rruleSet.all()};
  }

  recDailyUntil(rule) {
    const rruleObj = new RRuleSet();
    rruleObj.rrule(new RRule({
      freq: RRule.DAILY,
      interval: rule.interval,
      dtstart: rule.dtstart,
      until: rule.until
    }));
    let rruleSet = RRule.fromString(rruleObj.toString());
    return {'text': rruleSet.toText(), 'rule': rruleSet.toString(), 'dates': rruleSet.all()};
  }

  recWeeklyCount(rule) {
    const rruleObj = new RRuleSet();
    rruleObj.rrule(new RRule({
      freq: RRule.WEEKLY,
      interval: rule.interval,
      dtstart: rule.dtstart,
      count: rule.count,
      byweekday: rule.byweekday.split(',')
    }));
    let rruleSet = RRule.fromString(rruleObj.toString());
    return {'text': rruleSet.toText(), 'rule': rruleSet.toString(), 'dates': rruleSet.all()};
  }

  recWeeklyUntil(rule) {
    const rruleObj = new RRuleSet();
    rruleObj.rrule(new RRule({
      freq: RRule.WEEKLY,
      interval: rule.interval,
      dtstart: rule.dtstart,
      until: rule.until,
      byweekday: rule.byweekday.split(',')
    }));
    let rruleSet = RRule.fromString(rruleObj.toString());
    return {'text': rruleSet.toText(), 'rule': rruleSet.toString(), 'dates': rruleSet.all()};
  }

  recMonthlyCount(rule) {
    const rruleObj = new RRuleSet();
    if(rule.bymonthday) {
      rruleObj.rrule(new RRule({
        freq: RRule.MONTHLY,
        interval: rule.interval,
        dtstart: rule.dtstart,
        count: rule.count,
        bymonthday: rule.bymonthday
      }));
    }
    else {
      rruleObj.rrule(new RRule({
        freq: RRule.MONTHLY,
        interval: rule.interval,
        dtstart: rule.dtstart,
        count: rule.count,
        bysetpos: rule.bysetpos,
        byweekday: rule.byday
      }));
    }
    let rruleSet = RRule.fromString(rruleObj.toString());
    return {'text': rruleSet.toText(), 'rule': rruleSet.toString(), 'dates': rruleSet.all()};
  }

  recMonthlyUntil(rule) {
    const rruleObj = new RRuleSet();
    if(rule.bymonthday) {
      rruleObj.rrule(new RRule({
        freq: RRule.MONTHLY,
        interval: rule.interval,
        dtstart: rule.dtstart,
        until: rule.until,
        bymonthday: rule.bymonthday
      }));
    }
    else {
      rruleObj.rrule(new RRule({
        freq: RRule.MONTHLY,
        interval: rule.interval,
        dtstart: rule.dtstart,
        until: rule.until,
        bysetpos: rule.bysetpos,
        byweekday: rule.byday
      }));
    }
    let rruleSet = RRule.fromString(rruleObj.toString());
    return {'text': rruleSet.toText(), 'rule': rruleSet.toString(), 'dates': rruleSet.all()};
  }
  getDateUTC(newDT) {
    let currentDT = CommonUtils.getStringToDate(newDT);
    let tzDifference = currentDT.getTimezoneOffset();
    let dt = new Date(currentDT.getTime() - tzDifference * 60 * 1000);
    let date = dt.getUTCDate();
    let month = dt.getUTCMonth();
    let year = dt.getUTCFullYear();
    return new Date(Date.UTC(year, month, date, 12, 12, 12));
    //DATE FUNCTION CHANGED ON 1782020
    //return moment(newDT).toDate();
  }

  calculateDateDiff(date1, date2){
    //our custom function with two parameters, each for a selected date
    let diffc = date1.getTime() - date2.getTime();
    //getTime() function used to convert a date into milliseconds. This is needed in order to perform calculations.
   
    let days = Math.round(Math.abs(diffc/(1000*60*60*24)));
    //this is the actual equation that calculates the number of days.
    return days;
  }
}
