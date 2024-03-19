import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AnnouncementService } from 'app/_services/announcement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { Home } from 'app/_models/homeAnn.model';
import { OptionsList, CommonService, AuthService, ChatService } from 'app/_services';
import { CommonUtils } from 'app/_helpers';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { environment } from 'environments/environment';
import { EditRestrictionComponent } from 'app/main/admin/forms/add/edit-restriction/edit-restriction.component';
import { TakeOverComponent } from 'app/main/admin/forms/add/take-over/take-over.component';
import { User } from 'app/_models';
import { Observable, of } from 'rxjs';

@Component({
	selector: 'app-add',
	templateUrl: './add.component.html',
	styleUrls: ['./add.component.scss'],
	animations: fuseAnimations,
	encapsulation: ViewEncapsulation.None
})
export class AddComponent implements OnInit {

	confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes  
	public green_bg_header: any;
	public button: any;
	public accent: any;
	public min_dt: any = new Date();
	public title: string;
	public max_dt: any;
	public showEditor: boolean = false;
	public addHomeForm: FormGroup;
	public sessionInfo: any;
	public isSubmit: boolean = false;
	public submitted: boolean = false;
	public orderlist: any = [];
	public ContentDataById: any;
	public url_id: any;
	public editAnnouncement: boolean = false;
	public editHomeAnnId: number = 0;
	public StatusList: any;
	public field: any;
	public currentUser: any;
	public file
	public Imgname;
	public selectedFile;
	public filetype: boolean = false;
	public appConfig: any;
	public imgurl;
	uploadInfo: any = {
		'avatar': { 'type': 'avatar', 'media_id': 0, 'formControlName': 'avatar_media_id', 'url': "", 'apimediaUrl': 'media/userupload' },
	};
	public tinyMceSettings = {};

	public ann_list: any;
	public editann: any;
	public userId: any;
	public editRestrict: boolean = false;
	public userName: any;
	public firstUserId: any;
	public loginUserInfo: any;
	public savingEntry: any = false;
	public pusherCounter = 0;
	constructor(
		private authenticationService: AuthService,
		private _chatService: ChatService,
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		public _matDialog: MatDialog,
		private _matSnackBar: MatSnackBar,
		private AnnouncementService: AnnouncementService,
		private _commonService: CommonService) {
		this.AnnouncementService.getLists({ 'content_type': 'home-announcement' }).then(res => {
			if (this.route.routeConfig.path == 'admin/announcement/home/edit/:id') {
				for (let i = 1; i <= res.data.length; i++)
					this.orderlist.push(i);
			} else {

				for (let i = 1; i <= res.data.length + 1; i++)
					this.orderlist.push(i);
			}

		})

		if (this.route.routeConfig.path == 'admin/announcement/home/edit/:id' && this.route.params['value'].id > 0) {
			this.editHomeAnnId = this.route.params['value'].id;
			this.editAnnouncement = true;
		}
		this.editAnnouncement == true ? this.title = "Update Home Announcement" : this.title = "Add New Home Announcement";
	}

	ngOnInit() {
		/* ===============================
		Login User Data
	=================================*/
		// this.getContent();
		this.StatusList = OptionsList.Options.tables.status.users;
		this.currentUser = JSON.parse(localStorage.getItem('token'));
		this.tinyMceSettings = CommonUtils.getTinymceSetting();
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
		this.addHomeForm = this.fb.group({
			content_id: this.fb.control(null),
			content_type: this.fb.control('home-announcement', [Validators.required]),
			content_title: this.fb.control('', [Validators.required]),
			content_desc: this.fb.control('', [Validators.required]),
			created_by: this.fb.control(this.currentUser.user_id, [Validators.required]),
			schedule: this.fb.control('A', [Validators.required]),
			start_datetime: this.fb.control(''),
			end_datetime: this.fb.control(''),
			status: this.fb.control('A', [Validators.required]),
			image: this.fb.control(''),
			order: this.fb.control(1),
			contentaccess: this.fb.control([]),
			contentmeta: this.fb.control([])
		});
		this.field = { field_label: " Content Description", type: "tinymce", name: "content_desc" };
		//Load Edit Form Values
		if (this.route.routeConfig.path == 'admin/announcement/home/edit/:id') {
			this.userId = JSON.parse(localStorage.getItem('token')).user_id;
			this.getFilteredAnnouncement();
			//this.fillAnnouncementValues();
		}
		this.setUserInfo();
		this.EditRestrictionUpdateEvent();
	}
	getFilteredAnnouncement() {
		return this.AnnouncementService.getLists({ 'content_type': 'home-announcement' }).then(Response => {
			this.ann_list = Response.data;
			this.userId = JSON.parse(localStorage.getItem('token')).user_id;
			this.ann_list.forEach(item => {
				if (this.editHomeAnnId == item.content_id) {
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
				this.router.navigate(['/admin/announcement/home']);
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
					this.router.navigate(['/admin/announcement/home']);
				}
				if (result == 'takeover') {
					this.editRestrictForm();
				}
			});
		}
	}

	editRestrictForm() {
		this.AnnouncementService.updateForm(this.editHomeAnnId, 'home-announcement').subscribe(response => {
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
			this.confirmDialogRef.componentInstance.itemId = this.editHomeAnnId;
			this.confirmDialogRef.componentInstance.confirmType = 'changes';
			this.confirmDialogRef.componentInstance.type = 'home-announcement';
			return this.confirmDialogRef.afterClosed();
		}
		else {
			return of(true);
		}
	}
	/** FILL FORM  EDIT ROUTE */
	fillAnnouncementValues() {
		let edit: boolean = true;
		this.AnnouncementService.getEditContent(this.editHomeAnnId, edit).then(res => {
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
			this.addHomeForm.patchValue(formData);
		});
	}

	//set editor media
	setEditorMedia($event: any) {				
		let description: any;
		description = this.addHomeForm.get('content_desc').value;
		let timemcData = description + ' ' + $event.element;		
		setTimeout(() => {
			this.addHomeForm.get($event.controlName).setValue(timemcData);
		}, 1000);
	}

	onSelectFile(event) {
		const file = event && event.target.files[0] || null;
		this.file = file;
		this.Imgname = this.file.name;

		if (event.target.files && event.target.files[0]) {
			var reader = new FileReader();

			// let selectedFile = event.target.files[0];
			reader.readAsDataURL(this.file);
			this.selectedFile = event.target.files[0];

			// read file as data url
			reader.onload = (event: any) => { // called once readAsDataURL is completed

				let index = this.selectedFile.name.lastIndexOf(".") + 1;
				let extFile = this.selectedFile.name.substr(index, this.selectedFile.size).toLocaleLowerCase();
				if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "gif") {
					this.filetype = true;
				}
				else {

					this.filetype = false;
				}
			}

		}


	}

	changeMinDTime() {
		if (this.addHomeForm.controls['start_datetime'].value) {
			this.min_dt = new Date(new Date().setHours(0, 0, 0, 0));
			//   this.min_dt = this.addHomeForm.controls['start_datetime'].value;
		}
	}

	changeMaxDTime() {
		if (this.addHomeForm.controls['end_datetime'].value) {
			this.max_dt = this.addHomeForm.controls['end_datetime'].value;
		}
	}

	onRadioChange(value) {
		if (value == 'C') {
			this.addHomeForm.get('start_datetime').setValidators([Validators.required]);
			this.addHomeForm.get('end_datetime').setValidators([Validators.required]);
		}
		else {
			this.addHomeForm.get('start_datetime').clearValidators();
			this.addHomeForm.get('end_datetime').clearValidators();
			this.addHomeForm.get('start_datetime').setValue('');
			this.addHomeForm.get('end_datetime').setValue('');
		}
		this.addHomeForm.get('start_datetime').updateValueAndValidity();
		this.addHomeForm.get('end_datetime').updateValueAndValidity();
	}

	dateToTimestamp(dt) {
		let millitime = new Date(dt).setSeconds(0);
		return millitime;
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
					this.AnnouncementService.deleteField(deleteUrl, deleteData)
						.subscribe(deleteResponse => {
							// Show the success message
							this._matSnackBar.open(deleteResponse.message, 'CLOSE', {
								verticalPosition: 'top',
								duration: 2000
							});
							this.router.navigate(['/admin/announcement/home']);
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

	onSaveFieldClick(event: Event) {
		this.savingEntry = true;
		this.submitted = true;
		event.preventDefault();
		event.stopPropagation();
		if (this.addHomeForm.valid) {
			this.isSubmit = true;
			let addHomeFormData = this.addHomeForm.value;
			let startTS = '', endTS = '';
			if ((addHomeFormData.start_datetime && addHomeFormData.start_datetime != 'NaN-NaN-NaN') && (addHomeFormData.end_datetime && addHomeFormData.end_datetime != 'NaN-NaN-NaN')) {
				/*var start_datetime = new Date(addHomeFormData.start_datetime);
				startTS = start_datetime.getFullYear() +'-'+ (start_datetime.getMonth() + 1) + '-' + start_datetime.getDate();*/
				startTS = this._commonService.getDateTimeFormat(new Date(addHomeFormData.start_datetime));

				/*var end_datetime = new Date(addHomeFormData.end_datetime);
				endTS = end_datetime.getFullYear() +'-'+ (end_datetime.getMonth() + 1) + '-' + end_datetime.getDate();*/
				endTS = this._commonService.getDateTimeFormat(new Date(addHomeFormData.end_datetime));
			}


			addHomeFormData.start_datetime = startTS;
			addHomeFormData.end_datetime = endTS;
			addHomeFormData.created_by = this.currentUser.user_id;
			var formData = new FormData();
			formData.append("image", this.file);
			addHomeFormData.image = formData;
			// formData.append("image",this.file);

			// addHomeFormData.created_by=
			if (this.editAnnouncement == true) {
				delete addHomeFormData['schedule'];
			}
			this.AnnouncementService.saveAnnouncement(addHomeFormData, this.editAnnouncement)
				.subscribe(response => {
					this.isSubmit = false;
					this._matSnackBar.open(response.message, 'CLOSE', {
						verticalPosition: 'top',
						duration: 2000
					});
					this.router.navigate(['/admin/announcement/home']);
				},
					error => {
						this._matSnackBar.open(error.message, 'Retry', {
							verticalPosition: 'top',
							duration: 2000
						});
					});
		}
		else {
			this.validateAllFormFields(this.addHomeForm);
		}
	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			control.markAsTouched({ onlySelf: true });
		});
	}

}
