import { PlaylistComponent } from './playlist/playlist.component';
import { Component, OnInit } from '@angular/core';
import { Playlist } from './playlist/playlist';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { PlaylistService } from '../services/playlist.service';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css'],
  providers: []
})
export class PlaylistsComponent implements OnInit {

  currentName = '';
  isCreating: boolean;

  constructor(private playlistService: PlaylistService) {
    this.isCreating = false;
  }

  ngOnInit() {
  }

  onCreatePlaylist(): void {
    if (this.currentName.length > 0) {
      this.playlistService.addPlaylist(new Playlist(this.currentName));
      this.isCreating = false;
    }
  }

  onCreatePlaylistBtn(): void {
    this.isCreating = !this.isCreating;
    this.currentName = '';
  }

  onDeletePlaylist(p: Playlist): void {
    this.playlistService.deletePlaylist(p);
  }
}
