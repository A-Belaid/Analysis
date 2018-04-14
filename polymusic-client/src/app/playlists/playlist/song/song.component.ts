import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Song } from './song';
import { PlaylistService } from '../../../services/playlist.service';
import { RestApiProxyService } from '../../../services/restapi.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit {

  @Input() song: Song;
  @Output() selectionChanged: EventEmitter<string> = new EventEmitter();
  isAdding = false; 
  iFrame: SafeResourceUrl;

  constructor(private playlistsService: PlaylistService,
              private domSanitizer: DomSanitizer,
              private restApiService: RestApiProxyService) { }

  ngOnInit() {
  }

  async selectSong() {
    this.song.isSelected = !this.song.isSelected;
    this.selectionChanged.emit(this.song.name)
    this.iFrame = this.domSanitizer.bypassSecurityTrustResourceUrl(this.song.link);
  }
}
