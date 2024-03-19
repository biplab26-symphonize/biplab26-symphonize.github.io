import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { RolesService, CommonService, OptionsList, FormsService, SettingsService, ChatService, AuthService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray, copyArrayItem } from '@angular/cdk/drag-drop';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormFieldsComponent } from 'app/layout/components/form-fields/form-fields.component';
import { Form } from 'app/_models/form.model';
import { CommonUtils } from 'app/_helpers';
import { Observable, of } from 'rxjs';
import { User } from 'app/_models';
import { environment } from 'environments/environment';
import { TakeOverComponent } from './take-over/take-over.component';
import { EditRestrictionComponent } from './edit-restriction/edit-restriction.component';


@Component({
	selector: 'app-add',
	templateUrl: './add.component.html',
	styleUrls: ['./add.component.scss'],
	animations: fuseAnimations,
	encapsulation: ViewEncapsulation.None
})
export class AddComponent implements OnInit {

	confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
	formFieldDialogRef: MatDialogRef<FormFieldsComponent>; //FORM FIELD EDIT Changes 
	public green_bg_header: any;
	public button: any;
	public accent: any;
	public newform: FormGroup;
	public title: string = '';
	public tinyMceSettings = {};
	public url_id: any;
	public currentUser: any;
	public RoleList: any = [];
	selected3 = []
	public formTypeList: any = [];
	public papersize: any = [];
	public orientation: any = [];
	public formElements: any = [];
	public index_tmp: number;
	public fontformats: any = [];
	public fonts: any = [];
	public SettingsData: any = [];
	public Listformfields: any = [];
	public form_element_id: any;
	public workxhubChecked: boolean = false;
	public cardwatchChecked: boolean = false;
	public dragFields = [];
	public length: any;
	public formsinfo: {};
	public formentries: {};
	public editFormData: boolean = false;

	public userId: any;
	public serviceList: any;
	savingEntry: any = false;
	public editRestrict: boolean = false;
	public userName: any;
	public firstUserId: any;
	loginUserInfo: any;
	public pusherCounter = 0;
	@ViewChild('allSelected', { static: true }) private allSelected: MatOption;
	@ViewChild('tabGroup', { static: true }) tabGroup;
	readonly EDITOR_TAB = 0;
	activeTabIndex: number;
	selectall: boolean;


	constructor(
		private _chatService: ChatService,
		private authenticationService: AuthService,
		private fb: FormBuilder,
		private _rolesService: RolesService,
		private _commonService: CommonService,
		private _formService: FormsService,
		private _matSnackBar: MatSnackBar,
		private route: ActivatedRoute,
		private cdRef: ChangeDetectorRef,
		public _matDialog: MatDialog,
		public router: Router,
		private _settingService: SettingsService
	) {
		if (this.route.routeConfig.path == 'admin/forms/edit/:id' && this.route.params['value'].id > 0) {
			this.url_id = this.route.params['value'].id;
			this.editFormData = true;

		}
		this.url_id ? this.title = "Update Form" : this.title = "Add New Form";


	}

	ngOnInit() {
		this.tinyMceSettings = CommonUtils.getTinymceSetting();
		this.RoleList = this._rolesService.roles.data;
		this.fontformats = OptionsList.Options.fontformat;
		this.fonts = OptionsList.Options.fonts;
		this.currentUser = JSON.parse(localStorage.getItem('token'));



		this.newform = this.fb.group({
			form_title: this.fb.control('', [Validators.required]),
			form_type: this.fb.control('', [Validators.required]),
			form_desc: this.fb.control('',),
			created_by: this.fb.control(this.currentUser.user_id, [Validators.required]),
			formfields: this.fb.control([]),
			formentries: this.fb.control([]),
			form_element_id: this.fb.control(''),
			formclass: this.fb.control(''),
			login: this.fb.control('Y'),
			adminroles: this.fb.control([]),
			pdfattachment: this.fb.control('Y'),
			//pdf settings
			pdf_form_title: this.fb.control('Y'),
			empty_fields: this.fb.control('Y'),
			bgcolor: this.fb.control(''),
			header: this.fb.control(''),
			footer: this.fb.control(''),
			always_save_pdf: this.fb.control('Y'),
			filename: this.fb.control(''),
			papersize: this.fb.control(''),
			orientation: this.fb.control(''),
			requiredlogin: this.fb.control('N'),
			fontcolor: this.fb.control(''),
			// confirmation setiing 
			confirmation_name: this.fb.control(''),
			confirmation_type: this.fb.control('text'),
			message: this.fb.control(''),
			// button setting

			reset_button: this.fb.control('N'),
			reset_button_text: this.fb.control('Reset'),
			button_type: this.fb.control('text'),
			button_text: this.fb.control('Submit', [Validators.required]),
			button_path: this.fb.control(''),
			// workx hub settings 
			workxhub_status: this.fb.control('N'),
			FORM_ID: this.fb.control(''),
			DUDE_SITE: this.fb.control('seniorportal'),
			DUDE_CLIENT_ID: this.fb.control('VIqlyQf6mGRl4IX2O9JqmA2'),
			DUDE_CLIENT_SECRET: this.fb.control('0be5391c-be12-4be6-a394-792b587787d4'),
			DUDE_TOKEN_GRANT: this.fb.control('client_credentials'),
			DUDE_INSTANCE: this.fb.control('slusa'),
			DUDE_TOKEN_URL: this.fb.control('https://api.theworxhub.com/oauth/token'),
			// cardwatch 
			cardwatch_status: this.fb.control('N'),
			CARDWATCH_FORM_ID: this.fb.control(''),
			CARDWATCH_DUDE_SITE: this.fb.control(''),
			lastname: this.fb.control(''),
			firstname: this.fb.control(''),
			description: this.fb.control(''),
			requestedfor: this.fb.control(''),
			locationdescription: this.fb.control(''),
			email: this.fb.control(''),
			name: this.fb.control(''),
			permissiontoenter: this.fb.control(''),
			entrycomments: this.fb.control(''),
			department: this.fb.control(''),
			number: this.fb.control(''),
			details: this.fb.control(''),
			location: this.fb.control(''),
			requestor: this.fb.control(''),
			requestedof: this.fb.control(''),


		});

		this.getFormTypeCommanList();
		this.getPrintOptionsCommonList();
		this.getFieldList();

		let response = this._settingService.setting;



		//Load Edit Form Values
		if (this.route.routeConfig.path == 'admin/forms/edit/:id') {
			this.userId = JSON.parse(localStorage.getItem('token')).user_id;
			this.getFilteredServices();
		}
		this.setUserInfo();
		this.EditRestrictionUpdateEvent();

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
	getFilteredServices() {
		return this._formService.getForms({ 'direction': 'desc', 'column': 'form_id' }).then(Response => {
			this.serviceList = Response.data;
			this.userId = JSON.parse(localStorage.getItem('token')).user_id;
			this.serviceList.forEach(item => {
				if (this.url_id == item.form_id) { 
					let editrestriction: any;
					editrestriction = item.editrestriction;
					if (editrestriction != null) {
						if (item.editrestriction.user.id == this.userId) {
							let edit: boolean = true;
							this._formService.getFormContents(this.url_id, edit).subscribe(response => {
								this.formsinfo = response.forminfo;
								//  this.formentries = response.forminfo.formentries.entriesmeta;
								this.fillFormValues();
							});
						}
						if (item.editrestriction.user.id != this.userId) {
							this.editRestrict = true;
							this.userName = item.editrestriction.user.username;
							localStorage.setItem("first_user", this.userName);
						}
					} else {
						let edit: boolean = true;
						this._formService.getFormContents(this.url_id, edit).subscribe(response => {
							this.formsinfo = response.forminfo;
							//  this.formentries = response.forminfo.formentries.entriesmeta;
							this.fillFormValues();
						});
					}
				}
			});
			this.showDialog();
		});

	}
	showDialog() {
		if (this.editRestrict == true) {
			const dialogRef = this._matDialog.open(TakeOverComponent, {
				disableClose: true,
				width: '50%',
				panelClass: 'printentries',
				data: { type: 'form', body: '<h2>Edit Confirmation</h2>' }
			});
			dialogRef.afterClosed().subscribe(result => {
				if (result == 'goback') {
					this.savingEntry = true;
					this.router.navigate(['/admin/forms/all']);
				}
				if (result == 'preview') {
					this.router.navigate(['/admin/forms/preview', this.url_id]);
				}
				if (result == 'takeover') {
					this.editRestrictStaff();
				}
			});
		}
	}
	editRestrictStaff() {
		this._formService.updateForm(this.url_id, 'form').subscribe(response => {
			let edit: boolean = true;
			this._formService.getFormContents(this.url_id, edit).subscribe(response => {
				this.formsinfo = response.forminfo;
				//  this.formentries = response.forminfo.formentries.entriesmeta;
				this.fillFormValues();
			});
		});
	}
	setUserInfo() {
		//Set User Info to display on navbar
		let UserInfo = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
		this.loginUserInfo = new User().deserialize(UserInfo, 'single');
	}
	EditRestrictionUpdateEvent() {
		this._chatService.listen(environment.pusher.form_edit, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {
			localStorage.setItem("second_user", res.user.username);
			this.pusherCounter = this.pusherCounter + 1;
			if (this.pusherCounter == 1) {
				this.showPopup();
			}

		});
	}
	showPopup() {
		const dialogRef = this._matDialog.open(EditRestrictionComponent, {
			disableClose: true,
			width: '50%',
			panelClass: 'printentries',
			data: { type: 'form', body: '<h2>Edit Confirmation</h2>' }
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result == 'goback') {
				this.savingEntry = true;
				this.router.navigate(['/admin/forms/all']);
			}
		});
	}
	// discard Dialog
	confirmDialog(): Observable<boolean> {
		if (this.savingEntry == false) {
			this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
				disableClose: true
			});
			this.confirmDialogRef.componentInstance.confirmMessage = 'Your changes not saved, want to discard changes?';
			this.confirmDialogRef.componentInstance.userId = this.userId;
			this.confirmDialogRef.componentInstance.itemId = this.url_id;
			this.confirmDialogRef.componentInstance.confirmType = 'changes';
			this.confirmDialogRef.componentInstance.type = 'form';
			return this.confirmDialogRef.afterClosed();
		}
		else {
			return of(true);
		}
	}

	/**** EDIT FORM FILL VALUES */
	fillFormValues() {
		let formData = new Form().deserialize(this.formsinfo, '');

		this.newform.patchValue(formData);
		this.Listformfields = formData.formfields;
		let existformFields = formData.formfields;
		let existformElements = [];
		for (var i = 0; i <= existformFields.length - 1; i++) {
			let contentJson = JSON.parse(existformFields[i].content);

			let tmpObj = {};
			if (existformFields[i].fields.field_type == 'list') {

				tmpObj = {
					"created_at": "",
					"deleted_at": "",
					"field_content": contentJson,
					"field_form_type": existformFields[i].fields.field_form_type,
					"field_label": existformFields[i].description,
					"field_name": existformFields[i].caption,
					"field_pregmatch": existformFields[i].regexmatch,
					"field_required": existformFields[i].required,
					"field_type": existformFields[i].fields.field_type,
					"field_validation": "",
					"error_msg": existformFields[i].error_msg,
					"id": existformFields[i].fields.id,
					"updated_at": "",
					//Masking starts
					"ismasking": existformFields[i].fields.ismasking,
					"maskingpattern": existformFields[i].fields.maskingpattern,

					"form_element_id": existformFields[i].form_element_id ? existformFields[i].form_element_id : '',
					//Masking Ends
				};
			}
			else {
				tmpObj = {
					"created_at": "",
					"deleted_at": "",
					"field_content": {
						"options": contentJson[0].options,
						"extra_field_content": contentJson[0].extra_field_content,
						"dbsettings": contentJson[0].dbsettings,

					},
					"conditional_logic": existformFields[i].conditional_logic != '' ? JSON.parse(existformFields[i].conditional_logic) : '',
					"field_form_type": existformFields[i].fields.field_form_type,
					"field_label": existformFields[i].description,
					"field_name": existformFields[i].caption,
					"field_pregmatch": existformFields[i].regexmatch,
					"field_required": existformFields[i].required,
					"field_type": existformFields[i].fields.field_type,
					"field_validation": "",
					"form_element_id": existformFields[i].form_element_id ? existformFields[i].form_element_id : '',
					"error_msg": existformFields[i].error_msg,
					"id": existformFields[i].fields.id,
					"updated_at": "",
					//Masking starts
					"ismasking": existformFields[i].ismasking,
					"maskingpattern": existformFields[i].maskingpattern
					//Masking Ends
				};
			}

			existformElements.push(tmpObj);
		};
		this.formElements = [...existformElements];

		let data = this.newform.get('adminroles').value;
		if (data.length == this.RoleList.length) {
			this.selectall = true
		}
	}

	selectalllang() {
		let data
		if (this.selectall === false) {
			this.newform.controls.adminroles.patchValue([]);
			return;
		} else if (this.selectall === true) {

			this.newform.controls.adminroles.patchValue([...this.RoleList.map(item => item.id)]);

		}
	}

	selecteddata() {

		let data = this.newform.get('adminroles').value;
		if (data.length == this.RoleList.length) {
			this.selectall = true;
		} else {
			this.selectall = false;
		}
	}

	isEditorTab() {
		return this.activeTabIndex === this.EDITOR_TAB;
	}

	handleTabChange(e: MatTabChangeEvent) {
		this.activeTabIndex = e.index;
	}

	ngAfterViewInit() {
		this.activeTabIndex = this.tabGroup.selectedIndex;
		this.cdRef.detectChanges();
	}



	/***** GET FIELDS *****/
	getFieldList() {
		let params = [];
		params.push(
			{
				'field_form_type': 'F',
				'column': 'field_id',
				'direction': 'asc'
			}
		);
		this._formService.getFields('list/fields', params)
			.subscribe(response => {
				this.dragFields = response.data;
				this.length = response.total;
			},
				error => {
					// Show the error message
					this._matSnackBar.open(error.message, 'RETRY');
				});
	}


	/** FORM TYPE */
	getFormTypeCommanList() {
		let params = [];
		params.push(
			{
				'type': 'F'
			},
			{
				'name': 'formtype'
			});
		this._commonService.getCommonLists(params)
			.subscribe(response => {
				if (response.message === 'success' && response.status == 200) {
					this.formTypeList = (response.data[0].value).split(',');
				}
			},
				error => {
					// Show the error message
					this._matSnackBar.open(error.message, 'Retry', {
						verticalPosition: 'top',
						duration: 2000
					});
				});
	}

	/** GET PAGE SIZE & PAGE ORIENTATION */
	getPrintOptionsCommonList() {
		let params = [];
		params.push(
			{
				'type': 'P'
			},
			{
				'name': 'printoptions'
			});
		this._commonService.getCommonLists(params)
			.subscribe(response => {
				if (response.message === 'success' && response.status == 200) {
					if (response.data.length) {
						let printoptions = JSON.parse(response.data[0].value);
						this.papersize = (printoptions.papersize).split(',');
						this.orientation = (printoptions.orientation).split(',');
					}
				}
			},
				error => {
					// Show the error message
					this._matSnackBar.open(error.message, 'Retry', {
						verticalPosition: 'top',
						duration: 2000
					});
				});
	}

	onDrop(event: CdkDragDrop<string[]>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		}
		else {
			copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
		}
		this.dataParseFn(event.currentIndex);
	}

	dataParseFn(currentIndex) {

		let tempformElements = [...this.formElements];

		if (typeof tempformElements[currentIndex].field_content === 'object') {
			tempformElements[currentIndex].field_content = tempformElements[currentIndex].field_content;
		} else {
			tempformElements[currentIndex].field_content = JSON.parse(tempformElements[currentIndex].field_content);
		}
		this.formElements = [...tempformElements];

		this.newform.controls['formfields'].setValue(this.formElements);

		this.index_tmp = currentIndex;
	}

	// ******* Field edit *****//
	openDialog(type, item, indx) {

		this.formFieldDialogRef = this._matDialog.open(FormFieldsComponent, {
			disableClose: false,
			panelClass: 'forms-add-setting-popup',
			width: '700px',
			data: { FormFieldData: item, type: 'edit_form', AllFieldData: this.formElements }
		});
		// this.formFieldDialogRef.componentInstance.confirmMessage = 'Are you sure you want to remove selected field?';
		this.formFieldDialogRef.afterClosed()
			.subscribe(result => {
				if (result) {
					if (result != 'N' && result != undefined) {
						this.formElements[indx] = result;
					}
				}
			});
	}


	removeItem(item, indx): void {
		this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
			disableClose: false
		});
		this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to remove selected field ?';
		this.confirmDialogRef.afterClosed()
			.subscribe(result => {
				if (result) {
					this.form_element_id = [this.formElements[indx].form_element_id];
					this._formService.deleteFields({ "form_element_id": this.form_element_id }).subscribe(res => {
						this.formElements.splice(indx, 1);
						this.newform.controls['formfields'].setValue(this.formElements);
					})

				}
			});


	}

	//***** PREVIEW FORM *****//
	previewForm() {
		let newformData = this.newform.value;
		let tmpformfields = [...this.formElements];

		let formfieldsData = [];

		for (var i = 0; i <= tmpformfields.length - 1; i++) {
			formfieldsData.push({
				"field_id": tmpformfields[i].id,
				"field_type": tmpformfields[i].field_type,
				"caption": tmpformfields[i].field_name,
				"description": tmpformfields[i].field_label,
				"required": tmpformfields[i].field_required,
				"length": tmpformfields[i].length ? tmpformfields[i].length : '',
				"error_msg": tmpformfields[i].error_msg ? tmpformfields[i].error_msg : '',
				"regexmatch": tmpformfields[i].field_pregmatch,
				"content": tmpformfields[i].field_content,
			});
		}

		delete newformData['formfields'];
		newformData['formfields'] = formfieldsData;

		const dialogRef = this._matDialog.open(FormFieldsComponent, {
			width: '700px',
			data: { title: 'Form Preview', type: 'show_form', body: '', FormFieldData: newformData }
		});

		dialogRef.afterClosed().subscribe(result => {

		});
	}
	/** SHOW SNACK BAR */
	showSnackBar(message: string, buttonText: string) {
		this._matSnackBar.open(message, buttonText, {
			verticalPosition: 'top',
			duration: 2000
		});
	}

	saveForm(event: Event, flag) {
		this.savingEntry = true;
		event.preventDefault();
		event.stopPropagation();

		if (this.newform.valid) {
			let newformData: any = this.newform.value;

			let tmpformfields = [...this.formElements];


			let formfieldsData: any = [];

			for (var i = 0; i <= tmpformfields.length - 1; i++) {
				let tempContent = [];

				if (tmpformfields[i].field_content[0]) {

					tempContent = [...tmpformfields[i].field_content];

				}
				else {
					tempContent.push(tmpformfields[i].field_content);

				}

				formfieldsData.push({
					"field_id": tmpformfields[i].id,
					"caption": tmpformfields[i].field_name,
					"description": tmpformfields[i].field_label,
					"required": tmpformfields[i].field_required,
					"length": tmpformfields[i].length ? tmpformfields[i].length : '',
					"error_msg": tmpformfields[i].error_msg ? tmpformfields[i].error_msg : '',
					'conditional_logic': tmpformfields[i].conditional_logic ? JSON.stringify(tmpformfields[i].conditional_logic) : '',
					"regexmatch": tmpformfields[i].field_pregmatch,
					"content": JSON.stringify([...tempContent]),
					"form_element_id": tmpformfields[i].form_element_id ? tmpformfields[i].form_element_id : '',
				});


			}

			let workxhubformfields: any = {
				'description': newformData.description,
				'requestedfor': newformData.requestedfor,
				'locationdescription': newformData.locationdescription,
				'email': newformData.email,
				'firstname': newformData.firstname,
				'lastname': newformData.lastname,
				'permissiontoenter': newformData.permissiontoenter,
				'entrycomments': newformData.entrycomments,
				'department': newformData.department,
				'number': newformData.number,
				'details': newformData.details,
				'location': newformData.location,
				'requestor': newformData.requestor,
				'requestedof': newformData.requestedof
			}

			let workxhub: any = {
				'FORM_ID': newformData.FORM_ID,
				'workxhub_status': newformData.workxhub_status,
				'DUDE_SITE': newformData.DUDE_SITE,
				'DUDE_CLIENT_ID': newformData.DUDE_CLIENT_ID,
				'DUDE_CLIENT_SECRET': newformData.DUDE_CLIENT_SECRET,
				'DUDE_TOKEN_GRANT': newformData.DUDE_TOKEN_GRANT,
				'DUDE_INSTANCE': newformData.DUDE_INSTANCE,
				'DUDE_TOKEN_URL': newformData.DUDE_TOKEN_URL,
				'workxhubformfields': workxhubformfields

			}


			let general: any = {
				"formclass": newformData.formclass,
				'requiredlogin': newformData.requiredlogin,
				'workxhub': workxhub
			}
			let notifications: any = {
				"adminroles": newformData.adminroles,
				"pdfattachment": newformData.pdfattachment,

			}


			let pdf: any = {
				"form_title": newformData.pdf_form_title,
				"empty_fields": newformData.empty_fields,
				"bgcolor": newformData.bgcolor,
				"header": newformData.header,
				"footer": newformData.footer,
				"always_save_pdf": newformData.always_save_pdf,
				'filename': newformData.filename,
				'papersize': newformData.papersize,
				'orientation': newformData.orientation,
				'fontcolor': newformData.fontcolor,
			}

			let confirmation: any = {
				'confirmation_name': newformData.confirmation_name,
				'confirmation_type': newformData.confirmation_type,
				'message': newformData.message,
				'button_type': newformData.button_type,
				'reset_button': newformData.reset_button,
				'button_text': newformData.button_text,
				'reset_button_text': newformData.reset_button_text,
				'button_path': newformData.button_path
			}

			let settings: any = {
				'general': general,
				'notifications': notifications,
				'pdf': pdf,
				'confirmation': confirmation,
				// 'workxhub'		: workxhub

			}
			let settingJson: any = {
				'formsettings': settings
			}

			let setData: any = {
				'form_settings': JSON.stringify(settingJson),
				'formfields': JSON.stringify(formfieldsData),
				'form_title': newformData.form_title,
				'with_form': flag,
				'form_type': newformData.form_type,
				'form_desc': newformData.form_desc,
				'created_by': newformData.created_by,
				'form_id': this.editFormData == true ? this.url_id : '',

			}
			this._formService.saveFormData(setData, this.editFormData)
				.subscribe(response => {
					this.showSnackBar(response.message, 'CLOSE');
					this.router.navigate(['/admin/forms/all']);
				},

					error => {
						// Show the error message
						this.showSnackBar(error.message, 'Retry');
					});
		}
		else {
			this.validateAllFormFields(this.newform);
		}
	}
	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			control.markAsTouched({ onlySelf: true });
		});
	}


}
