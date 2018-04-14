import { Component, OnInit } from '@angular/core';
import { Song } from '../playlists/playlist/song/song';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiProxyService } from '../services/restapi.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [RestApiProxyService]
})
export class SearchComponent implements OnInit {

  results: Song[];
  searchQuery = '';

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private api: RestApiProxyService
    ) {
    this.results = new Array<Song>();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.searchQuery = params['query'];
      this.api.searchSong(this.searchQuery).then((res) => {
        this.results = res;
      });
    });
  }
}
