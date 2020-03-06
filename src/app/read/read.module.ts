import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';

import { ScripturesService } from '../services/scriptures.service';
import { ResourceHandlerService } from '../services/resource-handler.service';
import { PlayerService } from '../services/player.service';
import { SpeechSynthesisService } from '../services/speech-synthesis.service';
import { SnackbarService } from '../services/snackbar.service';
import { DialogService } from '../services/dialog.service';
import { DbIpcService } from '../services/db-ipc.service';

import { AppComponent } from '../app.component';
import { ReadComponent } from './read.component';
import { SearchPaneComponent } from '../search-pane/search-pane.component';
import { MoreComponent } from '../more/more.component';

import { ScrollViewDirective } from '../directives/scroll-view.directive';
import { ActionScrollDirective } from '../directives/action-scroll.directive';
import { ScriptureNavigatorDirective } from '../directives/scripture-navigator.directive';
import { ScriptureItemComponent } from '../scripture-item/scripture-item.component';
import { ReactionConsoleComponent } from '../reaction-console/reaction-console.component';
import { ToggleReactionsVisibilityDirective } from '../directives/toggle-reactions-visibility.directive';
import { ScriptureContainerComponent } from '../scripture-container/scripture-container.component';
import { ScripturePlayerComponent } from '../scripture-player/scripture-player.component';
import { ReadRoutingModule } from './read-routing.module';
import { FavoriteDirective } from '../directives/favorite.directive';
import { TwitterShareDirective } from '../directives/twitter-share.directive';
import { RendererBwService } from '../services/renderer-bw.service';
import { MoreDirective } from '../directives/more.directive';
import { FavoritesComponent } from '../favorites/favorites.component';
import { DeleteFavoriteDirective } from '../directives/delete-favorite.directive';
import { ShowFavoriteDetailDirective } from '../directives/show-favorite-detail.directive';

@NgModule({
  declarations: [
    AppComponent,
    ReadComponent,
    SearchPaneComponent,
    ScrollViewDirective,
    ActionScrollDirective,
    ScriptureNavigatorDirective,
    ScriptureItemComponent,
    ReactionConsoleComponent,
    ToggleReactionsVisibilityDirective,
    ScriptureContainerComponent,
    ScripturePlayerComponent,
    FavoriteDirective,
    TwitterShareDirective,
    MoreDirective,
    MoreComponent,
    FavoritesComponent,
    DeleteFavoriteDirective,
    ShowFavoriteDetailDirective
  ],
  imports: [
    CommonModule,
    ReadRoutingModule,
    CoreModule,
  ],
  exports: [ CoreModule, ReadRoutingModule],
  providers: [
    ScripturesService,
    ResourceHandlerService,
    PlayerService,
    SpeechSynthesisService,
    SnackbarService,
    DialogService,
    DbIpcService,
    RendererBwService
  ],
  entryComponents: [
    MoreComponent
  ]
})
export class ReadModule { }
