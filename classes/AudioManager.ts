import { Howl, Howler } from "howler";



// transformer en classe Abstraite "Audio"
//avec deux classes enfants : "Music" et "Sfx"
export default class AudioManager {
  private volume: number = 1.0;
  private punchSound: Howl = new Howl({ src: ["/sounds/punch.m4a"] });
  private fireballSound: Howl = new Howl({ src: ["/sounds/fireball.m4a"] });
  private slashSound: Howl = new Howl({ src: ["/sounds/slash.m4a"] });
  private missSound: Howl = new Howl({ src: ["/sounds/miss.m4a"] });
  private diceRollSound: Howl = new Howl({ src: ["/sounds/dice.m4a"] });
  private headbuttSound: Howl = new Howl({ src: ["/sounds/headbutt.m4a"] });

  private backgroundMusic: Howl = new Howl({
    src: ["/music/ost2.mp3"],
    loop: true,
    html5: true,
    volume: 0.8,
  });
  private battleMusic: Howl = new Howl({
    src: ["/music/battle2.mp3"],
    loop: true,
    html5: true,
    volume: 0.1,
  });

  private currentMusicId: number=0;
  private currentSfxId: number=0;

  playSfx(soundName: string) {
    let sound = soundName as keyof this;
    this.currentSfxId = (this[sound] as Howl).play();
    return this.currentSfxId;
  }

  stopSFX(soundName: string) {
    let sound = soundName as keyof this;
    (this[sound] as Howl).stop(this.currentSfxId);
  };

  stopMusic(musicName: string) {
      let music = musicName as keyof this;
      (this[music] as Howl).stop(this.currentMusicId);
  }


  playMusic(musicName: string) {
    // if (this.currentMusicId) {
    //   Howler.stop(this.currentMusicId);
    // }
    let music = musicName as keyof this;
    this.currentMusicId = (this[music] as Howl).play();
    return this.currentMusicId;
  }

  resetAllAudio() {
    Howler.stop();
  }
}
