(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{dK4b:function(e,t,r){"use strict";r.r(t),r.d(t,"AuthenticationModule",(function(){return $}));var o=r("dNgK"),n=r("tyNb"),i=r("bTqV"),a=r("bSwM"),s=r("kmnG"),p=r("NFeN"),d=r("qFsG"),m=r("5HBU"),l=r("3Pt+"),f=r("SxV6"),g=r("1G5W"),c=r("XNiG"),u=r("PVWW"),w=r("J9tS"),h=r("fXoL"),x=r("0JVi"),b=r("B9zo"),v=r("XiUz"),S=r("znSr"),y=r("EwFO"),E=r("ofXK");function k(e,t){1&e&&(h["\u0275\u0275elementStart"](0,"mat-error"),h["\u0275\u0275text"](1," Username is required "),h["\u0275\u0275elementEnd"]())}function P(e,t){1&e&&(h["\u0275\u0275elementStart"](0,"mat-error"),h["\u0275\u0275text"](1," Please Enter A Valid Username "),h["\u0275\u0275elementEnd"]())}var j=function(){return{delay:"100ms",y:"25px"}},I=function(e){return{value:"*",params:e}},_=function(){return{delay:"300ms",x:"100%"}},F=function(){return{scale:"0.2"}},L=[{path:"login",component:function(){function e(e,t,r,o,n,i,a,s,p){this._settingService=e,this._fuseConfigService=t,this._matSnackBar=r,this._formBuilder=o,this.route=n,this.router=i,this.authenticationService=a,this.settingsservices=s,this._appConfig=p,this.submitted=!1,this.pwdhide=!0,this.generalSettings={},this._fuseConfigService.config={colorTheme:"theme-viibrant",layout:{style:"vertical-layout-1",front:!1,navbar:{hidden:!0},toolbar:{hidden:!0},footer:{hidden:!0},sidepanel:{hidden:!0}}},this.appConfig=w.c.Settings,this.authenticationService.currentUserValue&&this.router.navigate([this.appConfig.url.redirectAfterLogin]),this._unsubscribeAll=new c.a}return e.prototype.ngOnInit=function(){this.loginForm=this._formBuilder.group({username:["",[l.B.required]],password:["",l.B.required],remember:[!0]}),this.getGeneralSettings()},e.prototype.getGeneralSettings=function(){var e=this;this._settingService.getSettingLoginPage().subscribe((function(t){e.exGeneral=JSON.parse(t.settings.general_settings),e.logoUrl=e.exGeneral.login_page_logo,""==e.logoUrl&&(e.logoUrl="assets/images/logos/default.png")}))},Object.defineProperty(e.prototype,"f",{get:function(){return this.loginForm.controls},enumerable:!1,configurable:!0}),e.prototype.onLogin=function(){var e=this;this.submitted=!0,this.returnUrl=this.route.snapshot.queryParams.returnUrl||this.appConfig.url.redirectAfterLogin,this.loginForm.invalid||this.authenticationService.login(this.f.username.value,this.f.password.value,this.f.remember.value).pipe(Object(f.a)(),Object(g.a)(this._unsubscribeAll)).subscribe((function(t){e._matSnackBar.open(t.message,"CLOSE",{verticalPosition:"top",horizontalPosition:"right",duration:200==t.status?2e3:5e4}),e._appConfig.setLocalStorage(t),e.router.navigate([e.returnUrl])}),(function(t){e._matSnackBar.open(t.message,"Retry",{verticalPosition:"top",horizontalPosition:"right",duration:2e3})}))},e.prototype.onLogout=function(){var e=this;this.authenticationService.logout().pipe(Object(f.a)(),Object(g.a)(this._unsubscribeAll)).subscribe((function(t){e._matSnackBar.open(t.message,"CLOSE",{verticalPosition:"top",horizontalPosition:"right",duration:2e3}),console.log("data",t),e.router.navigate(["/authentication/login"])}),(function(t){e._matSnackBar.open(t.message,"Retry",{verticalPosition:"top",horizontalPosition:"right",duration:2e3}),e.router.navigate(["/authentication/login"])}))},e.prototype.ngOnDestroy=function(){this._unsubscribeAll.next(),this._unsubscribeAll.complete()},e.\u0275fac=function(t){return new(t||e)(h["\u0275\u0275directiveInject"](w.N),h["\u0275\u0275directiveInject"](x.b),h["\u0275\u0275directiveInject"](o.b),h["\u0275\u0275directiveInject"](l.g),h["\u0275\u0275directiveInject"](n.a),h["\u0275\u0275directiveInject"](n.g),h["\u0275\u0275directiveInject"](w.g),h["\u0275\u0275directiveInject"](w.N),h["\u0275\u0275directiveInject"](w.c))},e.\u0275cmp=h["\u0275\u0275defineComponent"]({type:e,selectors:[["login"]],decls:37,vars:22,consts:[["id","login","fxLayout","row","fxLayoutAlign","start",1,"inner-scroll"],["id","login-intro","fxFlex","","fxHide","","fxShow.gt-xs",""],[1,"mb-20","login-footer"],["href","#",1,"t-white"],["id","login-form-wrapper","fusePerfectScrollbar",""],["id","login-form"],[1,"logo"],[3,"src"],[1,"title","accent-fg","login-text"],["autocomplete","off","name","loginForm","novalidate","",3,"formGroup","ngSubmit"],["appearance","outline"],["matInput","","formControlName","username"],["matSuffix","",1,"secondary-text"],[4,"ngIf"],["matInput","","type","password","formControlName","password","placeholder","password",3,"type"],["type","button","mat-icon-button","","matSuffix","",3,"click"],["fxLayout","row","fxLayout.xs","column","fxLayoutAlign","space-between center",1,"remember-forgot-password"],["formControlName","remember","aria-label","Remember Me",1,"remember-me"],[1,"forgot-password","secondary-Ocean-text",3,"routerLink"],["mat-raised-button","","aria-label","LOGIN",1,"submit-button","py-8",3,"disabled"]],template:function(e,t){1&e&&(h["\u0275\u0275elementStart"](0,"div",0),h["\u0275\u0275elementStart"](1,"div",1),h["\u0275\u0275elementStart"](2,"h4",2),h["\u0275\u0275text"](3," Powered By "),h["\u0275\u0275elementStart"](4,"a",3),h["\u0275\u0275text"](5," Viibrant.com "),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](6,"div",4),h["\u0275\u0275elementStart"](7,"div",5),h["\u0275\u0275elementStart"](8,"div",6),h["\u0275\u0275element"](9,"img",7),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](10,"div",8),h["\u0275\u0275text"](11,"Login To Your Account"),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](12,"form",9),h["\u0275\u0275listener"]("ngSubmit",(function(){return t.onLogin()})),h["\u0275\u0275elementStart"](13,"mat-form-field",10),h["\u0275\u0275elementStart"](14,"mat-label"),h["\u0275\u0275text"](15,"Username"),h["\u0275\u0275elementEnd"](),h["\u0275\u0275element"](16,"input",11),h["\u0275\u0275elementStart"](17,"mat-icon",12),h["\u0275\u0275text"](18,"person"),h["\u0275\u0275elementEnd"](),h["\u0275\u0275template"](19,k,2,0,"mat-error",13),h["\u0275\u0275template"](20,P,2,0,"mat-error",13),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](21,"mat-form-field",10),h["\u0275\u0275elementStart"](22,"mat-label"),h["\u0275\u0275text"](23,"Password"),h["\u0275\u0275elementEnd"](),h["\u0275\u0275element"](24,"input",14),h["\u0275\u0275elementStart"](25,"button",15),h["\u0275\u0275listener"]("click",(function(){return t.pwdhide=!t.pwdhide})),h["\u0275\u0275elementStart"](26,"mat-icon",12),h["\u0275\u0275text"](27),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](28,"mat-error"),h["\u0275\u0275text"](29," Password Is Required "),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](30,"div",16),h["\u0275\u0275elementStart"](31,"mat-checkbox",17),h["\u0275\u0275text"](32," Remember Me "),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](33,"a",18),h["\u0275\u0275text"](34," Forgot Password ? "),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](35,"button",19),h["\u0275\u0275text"](36," LOGIN "),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"]()),2&e&&(h["\u0275\u0275advance"](2),h["\u0275\u0275property"]("@animate",h["\u0275\u0275pureFunction1"](14,I,h["\u0275\u0275pureFunction0"](13,j))),h["\u0275\u0275advance"](4),h["\u0275\u0275property"]("@animate",h["\u0275\u0275pureFunction1"](17,I,h["\u0275\u0275pureFunction0"](16,_))),h["\u0275\u0275advance"](2),h["\u0275\u0275property"]("@animate",h["\u0275\u0275pureFunction1"](20,I,h["\u0275\u0275pureFunction0"](19,F))),h["\u0275\u0275advance"](1),h["\u0275\u0275propertyInterpolate"]("src",t.logoUrl,h["\u0275\u0275sanitizeUrl"]),h["\u0275\u0275advance"](3),h["\u0275\u0275property"]("formGroup",t.loginForm),h["\u0275\u0275advance"](7),h["\u0275\u0275property"]("ngIf",t.loginForm.get("username").hasError("required")),h["\u0275\u0275advance"](1),h["\u0275\u0275property"]("ngIf",!t.loginForm.get("username").hasError("required")&&t.loginForm.get("username").hasError("username")),h["\u0275\u0275advance"](4),h["\u0275\u0275property"]("type",t.pwdhide?"password":"text"),h["\u0275\u0275advance"](1),h["\u0275\u0275attribute"]("aria-label","Hide password")("aria-pressed",t.pwdhide),h["\u0275\u0275advance"](2),h["\u0275\u0275textInterpolate"](t.pwdhide?"visibility_off":"visibility"),h["\u0275\u0275advance"](6),h["\u0275\u0275property"]("routerLink","/authentication/forgot-password"),h["\u0275\u0275advance"](2),h["\u0275\u0275property"]("disabled",t.loginForm.invalid))},directives:[b.a,v.d,v.c,v.b,S.b,y.a,l.C,l.u,l.l,s.c,s.g,d.b,l.c,l.t,l.j,p.a,s.i,E.t,i.b,s.b,a.a,n.j],styles:['#login{width:100%}#login #login-intro{display:flex;align-items:flex-end;justify-content:center;position:relative;background:url(/assets/images/backgrounds/img-login1.jpg) no-repeat;background-size:cover;background-position:50%}@media screen and (min-width:600px) and (max-width:959px){#login #login-intro{padding:128px 64px}}#login #login-intro:before{content:"";position:absolute;width:100%;height:100%;background-color:#000;opacity:.3}#login #login-intro .login-footer{position:relative}#login #login-form-wrapper{width:540px;min-width:540px;max-width:540px;overflow:auto;-webkit-overflow-scrolling:touch;box-shadow:0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12)}@media screen and (min-width:600px) and (max-width:959px){#login #login-form-wrapper{width:360px;min-width:360px;max-width:360px}}@media screen and (max-width:599px){#login #login-form-wrapper{width:100%;min-width:100%;max-width:100%}}#login #login-form-wrapper #login-form{padding:48px 68px}@media screen and (max-width:599px){#login #login-form-wrapper #login-form{text-align:center;padding:24px}}#login #login-form-wrapper #login-form .logo{text-align:center;margin:32px auto}#login #login-form-wrapper #login-form .title{font-size:26px;text-align:center;font-weight:600}#login #login-form-wrapper #login-form .description{padding-top:8px}#login #login-form-wrapper #login-form form{width:100%;padding-top:32px}#login #login-form-wrapper #login-form form mat-form-field{width:100%}@media screen and (max-width:599px){#login #login-form-wrapper #login-form form mat-form-field{width:100%}}#login #login-form-wrapper #login-form form mat-checkbox{margin:0}#login #login-form-wrapper #login-form form .remember-forgot-password{font-size:13px;margin-top:8px}#login #login-form-wrapper #login-form form .remember-forgot-password .remember-me{margin-bottom:16px}#login #login-form-wrapper #login-form form .remember-forgot-password .forgot-password{font-size:13px;font-weight:600;margin-bottom:16px}#login #login-form-wrapper #login-form form .submit-button{width:100%;margin:16px auto;display:block;background-color:#3e5c59!important;color:#fff!important}@media screen and (max-width:599px){#login #login-form-wrapper #login-form form .submit-button{width:100%!important}}#login #login-form-wrapper #login-form .separator{font-size:15px;font-weight:600;margin:24px auto;position:relative;overflow:hidden;width:100px;text-align:center}#login #login-form-wrapper #login-form .separator .text{display:inline-flex;position:relative;padding:0 8px;z-index:9999}#login #login-form-wrapper #login-form .separator .text:after,#login #login-form-wrapper #login-form .separator .text:before{content:"";display:block;width:30px;position:absolute;top:10px;border-top:1px solid}#login #login-form-wrapper #login-form .separator .text:before{right:100%}#login #login-form-wrapper #login-form .separator .text:after{left:100%}#login #login-form-wrapper #login-form button.facebook,#login #login-form-wrapper #login-form button.google{width:70%;text-transform:none;color:#fff;font-size:13px}@media screen and (max-width:599px){#login #login-form-wrapper #login-form button.facebook,#login #login-form-wrapper #login-form button.google{width:60%}}#login #login-form-wrapper #login-form button.facebook mat-icon,#login #login-form-wrapper #login-form button.google mat-icon{color:#fff;margin:0 8px 0 0}#login #login-form-wrapper #login-form button.google{background-color:#d73d32;margin-bottom:8px}#login #login-form-wrapper #login-form button.facebook{background-color:#3f5c9a}#login #login-form-wrapper #login-form .register{margin:32px auto 24px;width:250px;font-weight:600}#login #login-form-wrapper #login-form .register .text{margin-right:8px}#login .t-white{color:#fff!important}@media screen and (max-width:599px){#login .logo{margin:0 auto!important}#login .forgot-password{margin-bottom:0!important}#login .remember-me{margin-bottom:8px!important}}'],encapsulation:2,data:{animation:u.a}}),e}()}],C=function(){function e(){}return e.\u0275mod=h["\u0275\u0275defineNgModule"]({type:e}),e.\u0275inj=h["\u0275\u0275defineInjector"]({factory:function(t){return new(t||e)},imports:[[n.k.forChild(L),i.c,a.b,s.e,p.b,d.c,m.a]]}),e}(),B=r("k1t7");function O(e,t){1&e&&(h["\u0275\u0275elementStart"](0,"mat-error"),h["\u0275\u0275text"](1," username is required "),h["\u0275\u0275elementEnd"]())}function N(e,t){1&e&&(h["\u0275\u0275elementStart"](0,"mat-error"),h["\u0275\u0275text"](1," Please enter a valid username "),h["\u0275\u0275elementEnd"]())}var A=function(){return{delay:"100ms",y:"25px"}},z=function(e){return{value:"*",params:e}},U=function(){return{delay:"300ms",x:"100%"}},G=[{path:"forgot-password",component:function(){function e(e,t,r,o,n,i,a,s,p){this._settingService=e,this._fuseConfigService=t,this._fuseProgressBarService=r,this._matSnackBar=o,this._formBuilder=n,this.settingsservices=i,this.route=a,this.router=s,this.authenticationService=p,this.submitted=!1,this.generalSettings={},this._fuseConfigService.config={colorTheme:"theme-viibrant",layout:{navbar:{hidden:!0},toolbar:{hidden:!0},footer:{hidden:!0},sidepanel:{hidden:!0}}},this._unsubscribeAll=new c.a}return e.prototype.ngOnInit=function(){this.forgotPasswordForm=this._formBuilder.group({username:["",[l.B.required]]}),this.getGeneralSettings()},e.prototype.getGeneralSettings=function(){var e=this;this._settingService.getSettingLoginPage().subscribe((function(t){e.exGeneral=JSON.parse(t.settings.general_settings),e.logoUrl=e.exGeneral.login_page_logo,""==e.logoUrl&&(e.logoUrl="assets/images/logos/default.png"),console.log("logoUrl",e.logoUrl)}))},Object.defineProperty(e.prototype,"f",{get:function(){return this.forgotPasswordForm.controls},enumerable:!1,configurable:!0}),e.prototype.onForgot=function(){var e=this;this.submitted=!0,this.forgotPasswordForm.invalid||(this._fuseProgressBarService.show(),this.authenticationService.forgot(this.f.username.value).pipe(Object(f.a)(),Object(g.a)(this._unsubscribeAll)).subscribe((function(t){e._fuseProgressBarService.hide(),e._matSnackBar.open(t.message,200==t.status?"CLOSE":"Retry",{verticalPosition:"top",duration:5e3})}),(function(t){e._fuseProgressBarService.hide(),e._matSnackBar.open(t.message,"Retry",{verticalPosition:"top",duration:5e3})})))},e.prototype.ngOnDestroy=function(){this._unsubscribeAll.next(),this._unsubscribeAll.complete()},e.\u0275fac=function(t){return new(t||e)(h["\u0275\u0275directiveInject"](w.N),h["\u0275\u0275directiveInject"](x.b),h["\u0275\u0275directiveInject"](B.a),h["\u0275\u0275directiveInject"](o.b),h["\u0275\u0275directiveInject"](l.g),h["\u0275\u0275directiveInject"](w.N),h["\u0275\u0275directiveInject"](n.a),h["\u0275\u0275directiveInject"](n.g),h["\u0275\u0275directiveInject"](w.g))},e.\u0275cmp=h["\u0275\u0275defineComponent"]({type:e,selectors:[["forgot-password"]],decls:26,vars:14,consts:[["id","forgot-password","fxLayout","row","fxLayoutAlign","start",1,"inner-scroll"],["id","forgot-password-intro","fxFlex","","fxHide","","fxShow.gt-xs",""],[1,"mb-20","login-footer"],["href","#",1,"t-white"],["id","forgot-password-form-wrapper","fusePerfectScrollbar",""],["id","forgot-password-form"],[1,"logo"],[3,"src"],[1,"title","accent-fg"],["name","forgoPasswordForm","novalidate","",3,"formGroup","ngSubmit"],["appearance","outline"],["matInput","","formControlName","username"],["matSuffix","",1,"secondary-text"],[4,"ngIf"],["mat-raised-button","","color","green","aria-label","SEND RESET LINK",1,"submit-button","py-8",3,"disabled"],["fxLayout","row","fxLayoutAlign","center center",1,"login"],[1,"link","secondary-Ocean-text",3,"routerLink"]],template:function(e,t){1&e&&(h["\u0275\u0275elementStart"](0,"div",0),h["\u0275\u0275elementStart"](1,"div",1),h["\u0275\u0275elementStart"](2,"h4",2),h["\u0275\u0275text"](3," Powered By "),h["\u0275\u0275elementStart"](4,"a",3),h["\u0275\u0275text"](5," Viibrant.com "),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](6,"div",4),h["\u0275\u0275elementStart"](7,"div",5),h["\u0275\u0275elementStart"](8,"div",6),h["\u0275\u0275element"](9,"img",7),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](10,"div",8),h["\u0275\u0275text"](11,"Recover Password"),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](12,"form",9),h["\u0275\u0275listener"]("ngSubmit",(function(){return t.onForgot()})),h["\u0275\u0275elementStart"](13,"mat-form-field",10),h["\u0275\u0275elementStart"](14,"mat-label"),h["\u0275\u0275text"](15,"Username"),h["\u0275\u0275elementEnd"](),h["\u0275\u0275element"](16,"input",11),h["\u0275\u0275elementStart"](17,"mat-icon",12),h["\u0275\u0275text"](18,"person"),h["\u0275\u0275elementEnd"](),h["\u0275\u0275template"](19,O,2,0,"mat-error",13),h["\u0275\u0275template"](20,N,2,0,"mat-error",13),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](21,"button",14),h["\u0275\u0275text"](22," SEND RESET LINK "),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](23,"div",15),h["\u0275\u0275elementStart"](24,"a",16),h["\u0275\u0275text"](25,"Go Back To Login"),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"]()),2&e&&(h["\u0275\u0275advance"](2),h["\u0275\u0275property"]("@animate",h["\u0275\u0275pureFunction1"](9,z,h["\u0275\u0275pureFunction0"](8,A))),h["\u0275\u0275advance"](4),h["\u0275\u0275property"]("@animate",h["\u0275\u0275pureFunction1"](12,z,h["\u0275\u0275pureFunction0"](11,U))),h["\u0275\u0275advance"](3),h["\u0275\u0275propertyInterpolate"]("src",t.logoUrl,h["\u0275\u0275sanitizeUrl"]),h["\u0275\u0275advance"](3),h["\u0275\u0275property"]("formGroup",t.forgotPasswordForm),h["\u0275\u0275advance"](7),h["\u0275\u0275property"]("ngIf",t.forgotPasswordForm.get("username").hasError("required")),h["\u0275\u0275advance"](1),h["\u0275\u0275property"]("ngIf",t.forgotPasswordForm.get("username").hasError("username")),h["\u0275\u0275advance"](1),h["\u0275\u0275property"]("disabled",t.forgotPasswordForm.invalid),h["\u0275\u0275advance"](3),h["\u0275\u0275property"]("routerLink","/authentication/login"))},directives:[b.a,v.d,v.c,v.b,S.b,y.a,l.C,l.u,l.l,s.c,s.g,d.b,l.c,l.t,l.j,p.a,s.i,E.t,i.b,n.j,s.b],styles:['forgot-password .t-white{color:#fff!important}forgot-password #forgot-password{width:100%}forgot-password #forgot-password #forgot-password-intro{display:flex;align-items:flex-end;justify-content:center;position:relative;background:url(/assets/images/backgrounds/img-login2.jpg) no-repeat;background-size:cover;background-position:50%}@media screen and (min-width:600px) and (max-width:959px){forgot-password #forgot-password #forgot-password-intro{padding:128px 64px}}forgot-password #forgot-password #forgot-password-intro:before{content:"";position:absolute;width:100%;height:100%;background-color:#000;opacity:.3}forgot-password #forgot-password #forgot-password-intro .login-footer{position:relative}forgot-password #forgot-password #forgot-password-form-wrapper{width:540px;min-width:540px;max-width:540px;overflow:auto;-webkit-overflow-scrolling:touch;box-shadow:0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12)}@media screen and (min-width:600px) and (max-width:959px){forgot-password #forgot-password #forgot-password-form-wrapper{width:360px;min-width:360px;max-width:360px}}@media screen and (max-width:599px){forgot-password #forgot-password #forgot-password-form-wrapper{width:100%;min-width:100%;max-width:100%}}forgot-password #forgot-password #forgot-password-form-wrapper #forgot-password-form{padding:48px 68px}@media screen and (max-width:599px){forgot-password #forgot-password #forgot-password-form-wrapper #forgot-password-form{text-align:center;padding:24px}}forgot-password #forgot-password #forgot-password-form-wrapper #forgot-password-form .logo{text-align:center;margin:32px auto}forgot-password #forgot-password #forgot-password-form-wrapper #forgot-password-form .title{font-size:26px;text-align:center;font-weight:600}forgot-password #forgot-password #forgot-password-form-wrapper #forgot-password-form .description{padding-top:8px}forgot-password #forgot-password #forgot-password-form-wrapper #forgot-password-form form{width:100%;padding-top:32px}forgot-password #forgot-password #forgot-password-form-wrapper #forgot-password-form form mat-form-field{width:100%}@media screen and (max-width:599px){forgot-password #forgot-password #forgot-password-form-wrapper #forgot-password-form form mat-form-field{width:100%}}forgot-password #forgot-password #forgot-password-form-wrapper #forgot-password-form form .submit-button{width:100%;margin:16px auto;display:block;background-color:#3e5c59!important;color:#fff!important}@media screen and (max-width:599px){forgot-password #forgot-password #forgot-password-form-wrapper #forgot-password-form form .submit-button{width:100%}}forgot-password #forgot-password #forgot-password-form-wrapper #forgot-password-form .login{margin:32px auto 24px;width:250px;font-weight:600}forgot-password #forgot-password #forgot-password-form-wrapper #forgot-password-form .login .text{margin-right:8px}@media screen and (max-width:599px){.logo{margin:0 auto!important}}'],encapsulation:2,data:{animation:u.a}}),e}()}],R=function(){function e(){}return e.\u0275mod=h["\u0275\u0275defineNgModule"]({type:e}),e.\u0275inj=h["\u0275\u0275defineInjector"]({factory:function(t){return new(t||e)},imports:[[n.k.forChild(G),i.c,s.e,p.b,d.c,m.a]]}),e}();function q(e,t){1&e&&(h["\u0275\u0275elementStart"](0,"mat-error"),h["\u0275\u0275text"](1," Password Confirmation Is Required "),h["\u0275\u0275elementEnd"]())}function M(e,t){1&e&&(h["\u0275\u0275elementStart"](0,"mat-error"),h["\u0275\u0275text"](1," Passwords Must Match "),h["\u0275\u0275elementEnd"]())}var T=function(){return{delay:"100ms",y:"25px"}},V=function(e){return{value:"*",params:e}},D=function(){return{delay:"300ms",x:"100%"}},J=function(){function e(e,t,r,o,n,i){var a=this;this._fuseConfigService=e,this._formBuilder=t,this._matSnackBar=r,this.route=o,this.router=n,this.authenticationService=i,this.resettoken="",this._fuseConfigService.config={colorTheme:"theme-viibrant",layout:{navbar:{hidden:!0},toolbar:{hidden:!0},footer:{hidden:!0},sidepanel:{hidden:!0}}},this._unsubscribeAll=new c.a,this.route.params.subscribe((function(e){a.resettoken=e.token}))}return e.prototype.ngOnInit=function(){var e=this;this.resetPasswordForm=this._formBuilder.group({token:[this.resettoken,l.B.required],newpassword:["",l.B.required],passwordConfirm:["",[l.B.required,H]]}),this.resetPasswordForm.get("newpassword").valueChanges.pipe(Object(g.a)(this._unsubscribeAll)).subscribe((function(){e.resetPasswordForm.get("passwordConfirm").updateValueAndValidity()}))},e.prototype.ngOnDestroy=function(){this._unsubscribeAll.next(),this._unsubscribeAll.complete()},e.prototype.onResetPassword=function(){var e=this;this.resetPasswordForm.invalid||(console.log(this.resetPasswordForm.value),this.authenticationService.reset(this.resetPasswordForm.value).pipe(Object(f.a)()).subscribe((function(t){e._matSnackBar.open(t.message,"CLOSE",{verticalPosition:"top",duration:2e3}),e.router.navigate(["/authentication/login"])}),(function(t){e._matSnackBar.open(t.message,"Retry",{verticalPosition:"top",duration:2e3})})))},e.\u0275fac=function(t){return new(t||e)(h["\u0275\u0275directiveInject"](x.b),h["\u0275\u0275directiveInject"](l.g),h["\u0275\u0275directiveInject"](o.b),h["\u0275\u0275directiveInject"](n.a),h["\u0275\u0275directiveInject"](n.g),h["\u0275\u0275directiveInject"](w.g))},e.\u0275cmp=h["\u0275\u0275defineComponent"]({type:e,selectors:[["reset-password"]],decls:34,vars:13,consts:[["id","reset-password","fxLayout","row","fxLayoutAlign","start",1,"inner-scroll"],["id","reset-password-intro","fxFlex","","fxHide","","fxShow.gt-xs",""],[1,"mb-20","login-footer"],["href","#",1,"t-white"],["id","reset-password-form-wrapper","fusePerfectScrollbar",""],["id","reset-password-form"],["fxHide.gt-xs","",1,"logo"],["src","assets/images/logos/fuse.svg"],[1,"title","accent-fg"],["name","resetPasswordForm","novalidate","",3,"formGroup","ngSubmit"],["appearance","outline"],["matInput","","type","password","formControlName","newpassword"],["matSuffix","",1,"secondary-text"],["matInput","","type","password","formControlName","passwordConfirm"],[4,"ngIf"],["mat-raised-button","","color","green","aria-label","RESET MY PASSWORD",1,"submit-button","py-8",3,"disabled"],["fxLayout","row","fxLayoutAlign","center center",1,"login"],[1,"link",3,"routerLink"]],template:function(e,t){1&e&&(h["\u0275\u0275elementStart"](0,"div",0),h["\u0275\u0275elementStart"](1,"div",1),h["\u0275\u0275elementStart"](2,"h4",2),h["\u0275\u0275text"](3," Powered By "),h["\u0275\u0275elementStart"](4,"a",3),h["\u0275\u0275text"](5," Viibrant.com "),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](6,"div",4),h["\u0275\u0275elementStart"](7,"div",5),h["\u0275\u0275elementStart"](8,"div",6),h["\u0275\u0275element"](9,"img",7),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](10,"div",8),h["\u0275\u0275text"](11,"Reset Password"),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](12,"form",9),h["\u0275\u0275listener"]("ngSubmit",(function(){return t.onResetPassword()})),h["\u0275\u0275elementStart"](13,"mat-form-field",10),h["\u0275\u0275elementStart"](14,"mat-label"),h["\u0275\u0275text"](15,"Password"),h["\u0275\u0275elementEnd"](),h["\u0275\u0275element"](16,"input",11),h["\u0275\u0275elementStart"](17,"mat-icon",12),h["\u0275\u0275text"](18,"vpn_key"),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](19,"mat-error"),h["\u0275\u0275text"](20," Password Is Required "),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](21,"mat-form-field",10),h["\u0275\u0275elementStart"](22,"mat-label"),h["\u0275\u0275text"](23,"Password (Confirm)"),h["\u0275\u0275elementEnd"](),h["\u0275\u0275element"](24,"input",13),h["\u0275\u0275elementStart"](25,"mat-icon",12),h["\u0275\u0275text"](26,"vpn_key"),h["\u0275\u0275elementEnd"](),h["\u0275\u0275template"](27,q,2,0,"mat-error",14),h["\u0275\u0275template"](28,M,2,0,"mat-error",14),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](29,"button",15),h["\u0275\u0275text"](30," RESET MY PASSWORD "),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](31,"div",16),h["\u0275\u0275elementStart"](32,"a",17),h["\u0275\u0275text"](33,"Go Back To Login"),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"]()),2&e&&(h["\u0275\u0275advance"](2),h["\u0275\u0275property"]("@animate",h["\u0275\u0275pureFunction1"](8,V,h["\u0275\u0275pureFunction0"](7,T))),h["\u0275\u0275advance"](4),h["\u0275\u0275property"]("@animate",h["\u0275\u0275pureFunction1"](11,V,h["\u0275\u0275pureFunction0"](10,D))),h["\u0275\u0275advance"](6),h["\u0275\u0275property"]("formGroup",t.resetPasswordForm),h["\u0275\u0275advance"](15),h["\u0275\u0275property"]("ngIf",t.resetPasswordForm.get("passwordConfirm").hasError("required")),h["\u0275\u0275advance"](1),h["\u0275\u0275property"]("ngIf",!t.resetPasswordForm.get("passwordConfirm").hasError("required")&&t.resetPasswordForm.get("passwordConfirm").hasError("passwordsNotMatching")),h["\u0275\u0275advance"](1),h["\u0275\u0275property"]("disabled",t.resetPasswordForm.invalid),h["\u0275\u0275advance"](3),h["\u0275\u0275property"]("routerLink","/authentication/login"))},directives:[b.a,v.d,v.c,v.b,S.b,y.a,l.C,l.u,l.l,s.c,s.g,d.b,l.c,l.t,l.j,p.a,s.i,s.b,E.t,i.b,n.j],styles:['reset-password #reset-password{width:100%}reset-password #reset-password #reset-password-intro{display:flex;align-items:flex-end;justify-content:center;position:relative;background:url(/assets/images/backgrounds/img-login1.jpg) no-repeat;background-size:cover;background-position:50%}@media screen and (min-width:600px) and (max-width:959px){reset-password #reset-password #reset-password-intro{padding:128px 64px}}reset-password #reset-password #reset-password-intro:before{content:"";position:absolute;width:100%;height:100%;background-color:#000;opacity:.3}reset-password #reset-password #reset-password-intro .login-footer{position:relative}reset-password #reset-password #reset-password-form-wrapper{width:540px;min-width:540px;max-width:540px;overflow:auto;-webkit-overflow-scrolling:touch;box-shadow:0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12)}@media screen and (min-width:600px) and (max-width:959px){reset-password #reset-password #reset-password-form-wrapper{width:360px;min-width:360px;max-width:360px}}@media screen and (max-width:599px){reset-password #reset-password #reset-password-form-wrapper{width:100%;min-width:100%;max-width:100%}}reset-password #reset-password #reset-password-form-wrapper #reset-password-form{padding:48px 68px}@media screen and (max-width:599px){reset-password #reset-password #reset-password-form-wrapper #reset-password-form{text-align:center;padding:24px}}reset-password #reset-password #reset-password-form-wrapper #reset-password-form .logo{text-align:center;margin:32px auto}reset-password #reset-password #reset-password-form-wrapper #reset-password-form .title{font-size:26px;text-align:center;font-weight:600}reset-password #reset-password #reset-password-form-wrapper #reset-password-form .description{padding-top:8px}reset-password #reset-password #reset-password-form-wrapper #reset-password-form form{width:100%;padding-top:32px}reset-password #reset-password #reset-password-form-wrapper #reset-password-form form mat-form-field{width:100%}@media screen and (max-width:599px){reset-password #reset-password #reset-password-form-wrapper #reset-password-form form mat-form-field{width:80%}}reset-password #reset-password #reset-password-form-wrapper #reset-password-form form .submit-button{width:100%;margin:16px auto;display:block}@media screen and (max-width:599px){reset-password #reset-password #reset-password-form-wrapper #reset-password-form form .submit-button{width:80%}}reset-password #reset-password #reset-password-form-wrapper #reset-password-form .login{margin:32px auto 24px;width:250px;font-weight:600}reset-password #reset-password #reset-password-form-wrapper #reset-password-form .login .text{margin-right:8px}'],encapsulation:2,data:{animation:u.a}}),e}(),H=function(e){if(!e.parent||!e)return null;var t=e.parent.get("newpassword"),r=e.parent.get("passwordConfirm");return t&&r?""===r.value||t.value===r.value?null:{passwordsNotMatching:!0}:null},K=[{path:"reset-password/:token",component:J}],W=function(){function e(){}return e.\u0275mod=h["\u0275\u0275defineNgModule"]({type:e}),e.\u0275inj=h["\u0275\u0275defineInjector"]({factory:function(t){return new(t||e)},imports:[[n.k.forChild(K),i.c,s.e,p.b,d.c,m.a]]}),e}(),X=r("UD4K"),Y=r("xgIS"),Q=[{path:"errors/error-500",component:function(){function e(e){this.router=e,this.subscriptions=[]}return e.prototype.ngOnInit=function(){this.onlineEvent=Object(Y.a)(window,"online"),this.offlineEvent=Object(Y.a)(window,"offline"),this.subscriptions.push(this.onlineEvent.subscribe((function(e){})))},e.prototype.ngOnDestroy=function(){this.subscriptions.forEach((function(e){return e.unsubscribe()}))},e.\u0275fac=function(t){return new(t||e)(h["\u0275\u0275directiveInject"](n.g))},e.\u0275cmp=h["\u0275\u0275defineComponent"]({type:e,selectors:[["error-500"]],decls:10,vars:1,consts:[["id","error-500","fxLayout","column","fxLayoutAlign","center center"],["fxLayout","column","fxLayoutAlign","center center",1,"content"],[1,"error-code"],[1,"message"],[1,"sub-message"],[1,"report-link",3,"routerLink"]],template:function(e,t){1&e&&(h["\u0275\u0275elementStart"](0,"div",0),h["\u0275\u0275elementStart"](1,"div",1),h["\u0275\u0275elementStart"](2,"div",2),h["\u0275\u0275text"](3,"500"),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](4,"div",3),h["\u0275\u0275text"](5,"Well, you broke the internet!"),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](6,"div",4),h["\u0275\u0275text"](7," Just kidding, looks like we have an internal issue, please try again in couple minutes "),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementStart"](8,"a",5),h["\u0275\u0275text"](9,"Report this problem"),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"](),h["\u0275\u0275elementEnd"]()),2&e&&(h["\u0275\u0275advance"](8),h["\u0275\u0275property"]("routerLink","/apps/dashboards/project"))},directives:[v.d,v.c,n.j],styles:["error-500 #error-500{width:100%}error-500 #error-500 .content{width:90%;max-width:512px!important}error-500 #error-500 .content .error-code{font-size:112px;line-height:1;text-align:center;margin-bottom:16px;font-weight:600}error-500 #error-500 .content .message{font-size:24px;text-align:center}error-500 #error-500 .content .sub-message{font-size:17px;text-align:center;margin:16px auto 48px}error-500 #error-500 .content .report-link{text-align:center;font-size:15px}"],encapsulation:2}),e}()}],Z=function(){function e(){}return e.\u0275mod=h["\u0275\u0275defineNgModule"]({type:e}),e.\u0275inj=h["\u0275\u0275defineInjector"]({factory:function(t){return new(t||e)},imports:[[n.k.forChild(Q),m.a]]}),e}(),$=function(){function e(){}return e.\u0275mod=h["\u0275\u0275defineNgModule"]({type:e}),e.\u0275inj=h["\u0275\u0275defineInjector"]({factory:function(t){return new(t||e)},imports:[[o.c,C,R,W,X.a,Z]]}),e}()}}]);