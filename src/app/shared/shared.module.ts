import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SecurePipe } from './pipes/secure.pipe';

@NgModule({
  declarations: [SecurePipe],
  imports: [
    CommonModule
  ],
  exports: [
    SecurePipe
  ]
})
export class SharedModule { }
