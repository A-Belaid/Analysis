export class Song {
    name: string;
    artist: string;
    link: string;
    isSelected: boolean;
    api: string;

    constructor(name: string, artist: string, album: string, link: string, api: string) {
        this.name = name;
        this.artist = artist;
        this.link = link;
        this.api = api;
        this.isSelected = false;
    }
}
