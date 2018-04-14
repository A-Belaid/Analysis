import { Playlist } from './../playlists/playlist/playlist';
import { RestApiProxyService } from './../services/restapi.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { log } from 'util';
import { PlaylistService } from '../services/playlist.service';
import { Song } from '../playlists/playlist/song/song';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  providers: []
})
export class PlayerComponent implements OnInit {

  title: string;
  playlist: Playlist;
  private selectedSong: Song;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playlistsService: PlaylistService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.title = params['name'];
      this.playlist = this.playlistsService.getPlaylist(this.title);
    });

  }

  onDeleteSong(s: Song): void {
    this.playlistsService.removeSong(s, this.playlist);
  }

  OnSelect(s: Song) {
    this.selectedSong.isSelected = false;
    s.isSelected = true;
    this.selectedSong = s;
  }
}
