import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: 'pages',
    component: PagesComponent,
    children: [
      {
        path: 'folder/:folderId',
        loadChildren: () => import('../file-browser/file-browser.module').then(m => m.FileBrowserModule)
      },
      {
        path: 'folder',
        loadChildren: () => import('../file-browser/file-browser.module').then(m => m.FileBrowserModule)
      },
      {
        path: 'logs',
        loadChildren: () => import('../logs/logs.module').then(m => m.LogsModule)
      },
      {
        path: '',
        redirectTo: '/pages/folder',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/pages/folder',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
