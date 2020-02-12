import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';

import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { AppComponent } from './app.component';
import { ReadComponent } from './read/read.component';
import { SearchPaneComponent } from './search-pane/search-pane.component';

import { ScripturesService } from './services/scriptures.service';
import { ResourceHandlerService } from './services/resource-handler.service';
import { PlayerService } from './services/player.service';
import { SpeechSynthesisService } from './services/speech-synthesis.service';

import { ScrollViewDirective } from './directives/scroll-view.directive';
import { ActionScrollDirective } from './directives/action-scroll.directive';
import { ScriptureNavigatorDirective } from './directives/scripture-navigator.directive';

@NgModule({
  declarations: [
    AppComponent,
    ReadComponent,
    SearchPaneComponent,
    ScrollViewDirective,
    ActionScrollDirective,
    ScriptureNavigatorDirective
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
    MatButtonModule,
    TypeaheadModule.forRoot(),
    HttpClientModule,
    MatProgressBarModule
  ],
  providers: [
    ScripturesService,
    ResourceHandlerService,
    PlayerService,
    SpeechSynthesisService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
