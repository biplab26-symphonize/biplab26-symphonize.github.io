export interface Validator {
	name?: any;
	validator?: any;
	message: any;
	value?:any;
}

export interface Options {
	key: string;
	value: any;
}

export interface FieldConfig {
	label?: string;
	name?: string;
	inputType?: string;
	options?: Options[];
	collections?: any;
	type: string;
	value?: any;
	minDate?: any;
	maxDate?: any;
	validations?: Validator[];
	class?:string;
	id?:string;
	readonly?:string;
	multiselect?:any;
	event?: string;
    event_type?: string;
    event_function_name?: string;
}

export interface MainTempData{
	grnd_level?: number;
	humidity?: number;
	pressure?: number;
	sea_level?: number;
	temp?: number;
	temp_max?: number;
	temp_min?: number;
   }