import { Injectable } from "@angular/core";
import { NativeDateAdapter } from "@angular/material/core";

export class EventsDateAdapter extends NativeDateAdapter {
  getFirstDayOfWeek(): number {
    return 0;
  }

}