import { Playlist } from './../playlists/playlist/playlist';
import { Injectable } from '@angular/core';
import { Song } from '../playlists/playlist/song/song';
import { RestApiProxyService } from './restapi.service';

@Injectable()
export class PlaylistService {

    private playlists: Set<Playlist> = new Set<Playlist>();

    constructor(private restApiService: RestApiProxyService) { 
        restApiService.getPlaylists().then((res) => {
            res.forEach(playlist => {
                let p = new Playlist(playlist.name, playlist.songs);
                this.playlists.add(p);
            }
        );
        });
     }

    addPlaylist(p: Playlist) {
        p.songs = new Set<Song>();
        this.playlists.add(p);
        this.restApiService.createPlaylist(p);
        console.log(this.playlists);
    }

    deletePlaylist(p: Playlist) {
        this.playlists.delete(p);
        this.restApiService.deletePlaylist(p);
    }

    getPlaylist(name: string) {
        // Todo: send the message _after_ fetching the heroes
        let res: Playlist;
        this.playlists.forEach((p) => {
            console.log(p.name, name);
            if (p.name === name) {
                console.log(p);
                res = p;
            }
        });
        return res;
    }

    getPlaylists(): Set<Playlist> { return this.playlists; }

    playlistsCount(): number { return this.playlists.size; }

    addSong(song: Song, p: Playlist) {
        this.playlists.forEach((el) => {
            if (el.name === p.name) {
                el.songs.add(song);
                this.restApiService.modifyPlaylist(el);
                return;
            }
        });
    }

    removeSong(song: Song, p: Playlist) {
        this.playlists.forEach((el) => {
            if (el.name === p.name) {
                el.songs.delete(song);
                this.restApiService.modifyPlaylist(el);
                return;
            }
        });
    }
}
