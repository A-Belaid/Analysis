import { Injectable } from '@angular/core';
import { Response, Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

import { Song } from '../playlists/playlist/song/song';
import { Playlist } from '../playlists/playlist/playlist';

@Injectable()
export class RestApiProxyService {

    // API Url for new Puzzle request to the server
    protected _urlApi = 'http://localhost:8888/';
    protected _headers = new Headers({ 'Content-Type': 'application/json' });
    protected _options = new RequestOptions({ headers: this._headers });
    
    constructor(private http: Http) { }

    public async searchSong(params: string): Promise<Array<Song>> {
        let songs = new Array<Song>();
        await this.http.get(this._urlApi + "tracks?name=" + params).toPromise()
            .then(response => {
                console.debug(response);
                if (response.status === 200) {
                    const data: Array<Song> = response.json()['tracks'];
                    console.debug(data)
                    for (let s of data) {
                        songs.push(s);
                    };
                }
                console.debug(songs)
            }
        );
        return songs;
    }

    public async getPlaylists(): Promise<Set<Playlist>> {
        let playlists = new Set();
        await this.http.get(this._urlApi + "playlists" ).toPromise()
            .then(response => {
                console.debug(response);
                if (response.status === 200) {
                    const data = response.json()['playlists'];
                    for (let p of data) {
                        let songs = JSON.parse(p.songs)
                        p.songs = new Set<Song>();
                        songs.forEach(element => {
                            p.songs.add(element);
                        });
                        playlists.add(p);
                    };
                }
            }
        );
        return playlists;
    }

    public async createPlaylist(playlist: Playlist) {
        let body = {
            playlistBody: playlist
        }
        this.http.post(this._urlApi + "playlists?name=" + playlist.name, JSON.stringify(body), this._options).toPromise().then((res) => console.debug(res));
    }

    public async deletePlaylist(playlist: Playlist) {
        this.http.post(this._urlApi + "playlists?name=" + playlist.name, "").toPromise().then(res => console.debug(res));
    }
    
    public async modifyPlaylist(playlist: Playlist) {
        let body = {
            playlistBody: {
                name: playlist.name,
                songs: JSON.stringify(Array.from(playlist.songs.values()))
            }
        }
        this.http.put(this._urlApi + "playlists?name=" + playlist.name, JSON.stringify(body), this._options).toPromise().then(res => console.debug(res));
    }

}
