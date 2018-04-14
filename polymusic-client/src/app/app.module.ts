import { PlaylistService } from './services/playlist.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { PlaylistComponent } from './playlists/playlist/playlist.component';
import { SongComponent } from './playlists/playlist/song/song.component';
import { PlayerComponent } from './player/player.component';
import { RestApiProxyService } from './services/restapi.service';

const appRoutes: Routes = [
  { path: 'playlists/', component: PlaylistsComponent },
  { path: 'playlists/:name', component: PlayerComponent, pathMatch: 'full' },
  { path: 'search/:query', component: SearchComponent },
  { path: 'search/', component: SearchComponent },
  // {
  //   path: 'heroes',
  //   component: HeroListComponent,
  //   data: { title: 'Heroes List' }
  // },
  // { path: '',
  //   redirectTo: '/heroes',
  //   pathMatch: 'full'
  // },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    PlaylistsComponent,
    PlaylistComponent,
    SongComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [PlaylistService, RestApiProxyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
