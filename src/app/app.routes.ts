import { Routes } from '@angular/router';
import { MarkdownViewerComponent } from './markdown-viewer.component';
import { OtherComponent } from './other.component';

export const routes: Routes = [
  { path: '', component: MarkdownViewerComponent },
  { path: 'other', component: OtherComponent },
];
