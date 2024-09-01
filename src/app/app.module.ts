import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';



// Auth
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { initFirebaseBackend } from './authUtils';
import { FakeBackendInterceptor } from './core/helpers/fake-backend';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';

// Flat Picker
import { FlatpickrDefaults, FlatpickrModule } from "angularx-flatpickr";

// Language
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { LayoutsModule } from './core/modules/layouts/layouts.module';
import { ErrorCatchingInterceptor } from './core/interceptor/error-catching.interceptor';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from "@ng-select/ng-select";
import { initializeApp } from "firebase/app";
import { LightboxModule } from "ngx-lightbox";
import { ForgotPasswordComponent } from "./modules/forgot-password/forgot-password.component";
import { NgbActiveModal, NgbActiveOffcanvas, NgbCarouselModule } from "@ng-bootstrap/ng-bootstrap";
import { DatePipe } from '@angular/common';
initializeApp(environment.firebase);
export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent, ForgotPasswordComponent],
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: "en",
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    BrowserAnimationsModule,
    HttpClientModule,
    NgHttpLoaderModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    LayoutsModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    LightboxModule,
    NgbCarouselModule,
    FlatpickrModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorCatchingInterceptor,
      multi: true,
    },
    DatePipe,
    FlatpickrDefaults, NgbActiveModal
    , NgbActiveOffcanvas    // { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
