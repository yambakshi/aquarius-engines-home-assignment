import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

import { SideNavComponent } from '@components/side-nav/side-nav.component';
import { PageNotFoundComponent } from '@components/page-not-found/page-not-found.component';
import { HomePageComponent } from '@components/home-page/home-page.component';
import { MainHeaderComponent } from '@components/main-header/main-header.component';
import { ApiHttpInterceptor } from '@interceptors/api.interceptor';
import { UsersResolver } from '@resolvers/users.resolver';

import { RouterService } from '@services/router.service';
import { ApiService } from '@services/api.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserStateInterceptor } from '@interceptors/browser-state.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SideNavComponent,
    MainHeaderComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserTransferStateModule,
    AppRoutingModule,
    HttpClientModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    BrowserAnimationsModule
  ],
  providers: [
    ApiService,
    RouterService,
    UsersResolver,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BrowserStateInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiHttpInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
