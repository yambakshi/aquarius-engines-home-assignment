import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '@components/page-not-found/page-not-found.component';
import { HomePageComponent } from '@components/home-page/home-page.component';
import { MonitorResolver } from '@resolvers/monitor.resolver';
import { AlarmsPageComponent } from '@components/alarms-page/alarms-page.component';
import { AlarmsResolver } from '@resolvers/alarms.resolver';

const routes: Routes = [{
  path: '',
  resolve: { resolverResponse: MonitorResolver },
  component: HomePageComponent
},
{
  path: 'alarms',
  resolve: { resolverResponse: AlarmsResolver },
  component: AlarmsPageComponent
},
{
  path: '404',
  component: PageNotFoundComponent
},
{ path: '**', pathMatch: 'full', redirectTo: '404' }];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
