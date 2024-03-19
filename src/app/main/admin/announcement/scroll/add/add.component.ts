import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AnnouncementService } from 'app/_services/announcement.service';
import { OptionsList, CommonService, AuthService, ChatService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Home } from 'app/_models/homeAnn.model';
import { OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS } from '@busacca/ng-pick-datetime';
import { DateTimeAdapter } from '@busacca/ng-pick-datetime';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { User } from 'app/_models/user.model';
import { EditRestrictionComponent } from 'app/main/admin/forms/add/edit-restriction/edit-restriction.component';
import { environment } from 'environments/environment';
import { TakeOverComponent } from 'app/main/admin/forms/add/take-over/take-over.component';
import { Observable, Subject, of } from 'rxjs';

@Component({
	selector: 'app-add',
	templateUrl: './add.component.html',
	styleUrls: ['./add.component.scss'],
	animations: fuseAnimations,
	encapsulation: ViewEncapsulation.None,
	providers: [
		{ provide: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS, useValue: { useUtc: true } },
	],
})
export class AddScrollAnnComponent implements OnInit {

	confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
	public green_bg_header: any;
	public button: any;
	public accent: any;
	public min_dt: any = new Date();
	public title: string;
	public max_dt: any;
	public addScrollForm: FormGroup;
	public isSubmit: boolean = false;
	public orderlist: any = [];
	public currentUser: any;
	editAnnouncement: boolean = false;
	editScrollAnnId: number = 0;
	StatusList: any;
	loginUserInfo: any;
	public userId: any;
	public FormList: any;
	public userName: any;
	public editRestrict: boolean = false;
	public itemId: any;
	public type: any;
	public anninfo: any;
	public firstUserId: any;
	savingEntry: any = false;
	public editann;
	public pusherCounter = 0;

	constructor(
		private authenticationService: AuthService,
		private _chatService: ChatService,
		private fb: FormBuilder,
		private router: Router,
		private announcement: AnnouncementService,
		private route: ActivatedRoute,
		private _matSnackBar: MatSnackBar,
		public _matDialog: MatDialog,
		private _commonService: CommonService,
		dateTimeAdapter: DateTimeAdapter<any>
	) {

		this.announcement.getLists({ 'content_type': 'scroll-announcement' }).then(res => {
			if (this.route.routeConfig.path == 'admin/announcement/scrolling/edit/:id') {
				for (let i = 1; i <= res.data.length; i++)
					this.orderlist.push(i);
			} else {

				for (let i = 1; i <= res.data.length + 1; i++)
					this.orderlist.push(i);
			}

		})

		if (this.route.routeConfig.path == 'admin/announcement/scrolling/edit/:id' && this.route.params['value'].id > 0) {
			this.editScrollAnnId = this.route.params['value'].id;
			this.editAnnouncement = true;
		}
		this.title = this.editAnnouncement ? "Update Scrolling Announcement" : "Add New Scrolling Announcement";
	}

	ngOnInit() {
		/* ===============================
			Login User Data
		=================================*/
		this.StatusList = OptionsList.Options.tables.status.users;
		this.currentUser = JSON.parse(localStorage.getItem('token'));
		this.setControls();

		// apply theme settings
		let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
		if (typeof themeData == 'string') {
			let currentData = JSON.parse(themeData);
			themeData = currentData[0];
		}
		this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
		this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color }
		this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
		
	}
	setControls() {
		this.addScrollForm = this.fb.group({
			content_id: this.fb.control(null),
			content_type: this.fb.control('scroll-announcement', [Validators.required]),
			content_title: this.fb.control(''),
			content_desc: this.fb.control(''),
			created_by: this.fb.control(this.currentUser.user_id, [Validators.required]),
			schedule: this.fb.control('A', [Validators.required]),
			start_datetime: this.fb.control(''),
			end_datetime: this.fb.control(''),
			status: this.fb.control('A', [Validators.required]),
			order: this.fb.control(1),
			contentaccess: this.fb.control([]),
			contentmeta: this.fb.control([]),
		});

		//Load Edit Form Values
		if (this.route.routeConfig.path == 'admin/announcement/scrolling/edit/:id') {
			//this.fillAnnouncementValues();
			this.userId = JSON.parse(localStorage.getItem('token')).user_id;
			this.getFilteredAnnouncement();
		}
		this.setUserInfo();
		this.EditRestrictionUpdateEvent();
	}
	getFilteredAnnouncement() {
		return this.announcement.getLists({ 'content_type': 'scroll-announcement' }).then(Response => {
			this.FormList = Response.data;
			this.userId = JSON.parse(localStorage.getItem('token')).user_id;
			this.FormList.forEach(item => {
				if (this.editScrollAnnId == item.content_id) {
					let editrestriction: any;
					editrestriction = item.editrestriction;
					if (editrestriction != null) {
						if (item.editrestriction.user.id == this.userId) {
							this.fillAnnouncementValues();
						}
						if (item.editrestriction.user.id != this.userId) {
							this.editRestrict = true;
							this.userName = item.editrestriction.user.username;
							localStorage.setItem("first_user", this.userName);
							this.firstUserId = item.editrestriction.user.id;
						}
					} else {
						this.fillAnnouncementValues();
					}
				}
			});
			this.showDialog();
		});
	}

	EditRestrictionUpdateEvent() {
		this._chatService.listen(environment.pusher.ann_edit, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {
			localStorage.setItem("second_user", res.user.username);
			this.pusherCounter = this.pusherCounter + 1;
			if (this.pusherCounter != 2) {
				this.showPopup();
			}
		});
	}


	showPopup() {
		const dialogRef = this._matDialog.open(EditRestrictionComponent, {
			disableClose: true,
			width: '50%',
			panelClass: 'printentries',
			data: { type: 'UpdateAnnouncement', body: '<h2>Recurring Confirmation</h2>' }
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result == 'goback') {
				this.savingEntry = true;
				this.router.navigate(['/admin/announcement/scrolling']);
			}
		});
	}


	showDialog() {
		if (this.editRestrict == true) {
			const dialogRef = this._matDialog.open(TakeOverComponent, {
				disableClose: true,
				width: '50%',
				panelClass: 'printentries',
				data: { type: 'UpdateAnnouncement', body: '<h2>Recurring Confirmation</h2>' }
			});
			dialogRef.afterClosed().subscribe(result => {
				if (result == 'goback') {
					this.savingEntry = true;
					this.router.navigate(['/admin/announcement/scrolling']);
				}
				if (result == 'takeover') {
					//  this.formentries = response.forminfo.formentries.entriesmeta;					
					this.editRestrictForm();
				}
			});
		}
	}

	editRestrictForm() {
		this.announcement.updateForm(this.editScrollAnnId, 'scroll-announcement').subscribe(response => {
			this.fillAnnouncementValues()
		});
	}

	setUserInfo() {
		//Set User Info to display on navbar
		let UserInfo = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
		this.loginUserInfo = new User().deserialize(UserInfo, 'single');
	}
	// discard Dialog
	confirmDialog(): Observable<boolean> {
		if (this.savingEntry == false) {
			this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
				disableClose: true
			});
			this.confirmDialogRef.componentInstance.confirmMessage = 'Your changes not saved, want to discard changes?';
			this.confirmDialogRef.componentInstance.userId = this.userId;
			this.confirmDialogRef.componentInstance.itemId = this.editScrollAnnId;
			this.confirmDialogRef.componentInstance.confirmType = 'changes';
			this.confirmDialogRef.componentInstance.type = 'scroll-announcement';
			return this.confirmDialogRef.afterClosed();
		}
		else {
			return of(true);
		}
	}

	/** FILL FORM FROM EDIT ROUTE */
	fillAnnouncementValues() {
		let edit: boolean = true;
		this.announcement.getEditContent(this.editScrollAnnId, edit).then(res => {
			this.editann = res.contentinfo;
			let formData = new Home().deserialize(this.editann, 'single');
			let tempSchedule = 'A', startTS: any = '', endTS: any = '';
			if (formData.start_datetime || formData.start_datetime != null
				|| formData.end_datetime || formData.end_datetime != null) {
				tempSchedule = 'C';
				formData['schedule'] = tempSchedule;

				startTS = this._commonService.getMySqlDate(formData.start_datetime) ? new Date(formData.start_datetime) : '';
				endTS = this._commonService.getMySqlDate(formData.end_datetime) ? new Date(formData.end_datetime) : '';
				this.min_dt = startTS;
				this.max_dt = endTS;
				formData.start_datetime = startTS;
				formData.end_datetime = endTS;
			}
			this.addScrollForm.patchValue(formData);
		});
	}

	changeMinDTime() {
		if (this.addScrollForm.controls['start_datetime'].value) {
			this.min_dt = new Date(new Date().setHours(0, 0, 0, 0));
		}
	}

	changeMaxDTime() {
		if (this.addScrollForm.controls['end_datetime'].value) {
			this.max_dt = this.addScrollForm.controls['end_datetime'].value;
		}
	}

	onRadioChange(value) {
		if (value == 'C') {
			this.addScrollForm.get('start_datetime').setValidators([Validators.required]);
			this.addScrollForm.get('end_datetime').setValidators([Validators.required]);
		}
		else {
			this.addScrollForm.get('start_datetime').clearValidators();
			this.addScrollForm.get('end_datetime').clearValidators();
			this.addScrollForm.get('start_datetime').setValue('');
			this.addScrollForm.get('end_datetime').setValue('');
		}
		this.addScrollForm.get('start_datetime').updateValueAndValidity();
		this.addScrollForm.get('end_datetime').updateValueAndValidity();
	}

	onSaveFieldClick(event: Event) {
		this.savingEntry = true;
		event.preventDefault();
		event.stopPropagation();
		if (this.addScrollForm.valid) {
			this.isSubmit = true;
			let addScrollFormData = this.addScrollForm.value;

			let startTS = '', endTS = '';
			if ((addScrollFormData.start_datetime && addScrollFormData.start_datetime != 'NaN-NaN-NaN') && (addScrollFormData.end_datetime && addScrollFormData.end_datetime != 'NaN-NaN-NaN')) {
				/*var start_datetime = new Date(addScrollFormData.start_datetime);
				startTS = start_datetime.getFullYear() +'-'+ (start_datetime.getMonth() + 1) + '-' + start_datetime.getDate();*/
				startTS = this._commonService.getDateTimeFormat(new Date(addScrollFormData.start_datetime));

				/*var end_datetime = new Date(addScrollFormData.end_datetime);
				endTS = end_datetime.getFullYear() +'-'+ (end_datetime.getMonth() + 1) + '-' + end_datetime.getDate();*/
				endTS = this._commonService.getDateTimeFormat(new Date(addScrollFormData.end_datetime));
			}

			addScrollFormData.start_datetime = startTS;
			addScrollFormData.end_datetime = endTS;
			addScrollFormData.created_by = this.currentUser.user_id;

			if (this.editAnnouncement == true) {
				delete addScrollFormData['schedule'];
			}
			this.announcement.saveAnnouncement(addScrollFormData, this.editAnnouncement)
				.subscribe(response => {
					this.isSubmit = false;
					this._matSnackBar.open(response.message, 'CLOSE', {
						verticalPosition: 'top',
						duration: 2000
					});
					this.router.navigate(['/admin/announcement/scrolling']);
				},
					error => {
						// Show the error message
						this._matSnackBar.open(error.message, 'Retry', {
							verticalPosition: 'top',
							duration: 2000
						});
					});
		}
		else {
			this.validateAllFormFields(this.addScrollForm);
		}
	}

	deleteItem(id) {

		this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
			disableClose: false
		});

		this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected announcement?';
		this.confirmDialogRef.afterClosed()
			.subscribe(result => {
				if (result) {
					let deleteData = {
						'content_id': id.toString().split(',')
					};
					let deleteUrl = 'delete/content';

					this.announcement.deleteField(deleteUrl, deleteData)
						.subscribe(deleteResponse => {
							// Show the success message
							this.router.navigate(['/admin/announcement/scrolling']);
							this._matSnackBar.open(deleteResponse.message, 'CLOSE', {
								verticalPosition: 'top',
								duration: 2000
							});
						},
							error => {
								// Show the error message
								this._matSnackBar.open(error.message, 'Retry', {
									verticalPosition: 'top',
									duration: 2000
								});
							});
				}
				this.confirmDialogRef = null;
			});
	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			control.markAsTouched({ onlySelf: true });
		});
	}
}