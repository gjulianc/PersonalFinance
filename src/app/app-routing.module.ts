import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntroGuard } from './guards/intro.guard';

const routes: Routes = [
  
  { 
    path: 'menu', 
    loadChildren: './pages/menu/menu.module#MenuPageModule',
    canActivate: [IntroGuard]
  },
  { 
    path: 'intro', 
    loadChildren: './pages/intro/intro.module#IntroPageModule' 
  },
  { 
    path: '', 
    redirectTo: 'menu/tracker', 
    pathMatch: 'full' },
  { path: 'cash-flow-modal', loadChildren: './pages/cash-flow-modal/cash-flow-modal.module#CashFlowModalPageModule' },
  { path: 'filter-popover', loadChildren: './pages/filter-popover/filter-popover.module#FilterPopoverPageModule' },
  
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
