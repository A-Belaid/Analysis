import { Component, OnInit, Input } from '@angular/core';
import { Song } from './song/song';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  @Input() name: string;
  songs: Set<Song>;

  constructor() {
    this.songs = new Set<Song>();
  }

  ngOnInit() { }

}
