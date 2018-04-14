export class Song {
    name: string;
    artist: string;
    link: string;
    isSelected: boolean;

    constructor(name: string, artist: string, album: string, link: string) {
        this.name = name;
        this.artist = artist;
        this.link = link;
        this.isSelected = false;
    }
}
