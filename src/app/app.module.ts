import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';

import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { AppComponent } from './app.component';
import { ReadComponent } from './read/read.component';

import { ScripturesService } from './services/scriptures.service';
import { ResourceHandlerService } from './services/resource-handler.service'; 

@NgModule({
  declarations: [
    AppComponent,
    ReadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TypeaheadModule.forRoot(),
    HttpClientModule
  ],
  providers: [ScripturesService, ResourceHandlerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
