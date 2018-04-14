import { Song } from './song/song';

export class Playlist {
    name: string;
    songs: Set<Song>;

    constructor(name: string, songs: Set<Song>) {
        this.name = name;
        this.songs = songs;
    }
}
