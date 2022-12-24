import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// MaterialUI
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { SideNavComponent } from '@components/side-nav/side-nav.component';
import { PageNotFoundComponent } from '@components/page-not-found/page-not-found.component';
import { HomePageComponent } from '@components/home-page/home-page.component';
import { MainHeaderComponent } from '@components/main-header/main-header.component';
import { AlarmsPageComponent } from '@components/alarms-page/alarms-page.component';

import { RouterService } from '@services/router.service';
import { ApiService } from '@services/api.service';
import { ApiHttpInterceptor } from '@interceptors/api.interceptor';
import { MonitorResolver } from '@resolvers/monitor.resolver';
import { AlarmsResolver } from '@resolvers/alarms.resolver';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserStateInterceptor } from '@interceptors/browser-state.interceptor';
import { SignalRService } from '@services/signalr.service';

import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';

const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL', // Edit this to change the display format (e.g 'DD/MM/YYYY')
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    HomePageComponent,
    AlarmsPageComponent,
    SideNavComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserTransferStateModule,
    AppRoutingModule,
    HttpClientModule,

    // MaterialUI
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatSortModule,

    BrowserAnimationsModule,
  ],
  providers: [
    ApiService,
    RouterService,
    SignalRService,
    MonitorResolver,
    AlarmsResolver,
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
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
