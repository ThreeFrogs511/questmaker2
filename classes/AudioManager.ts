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
    volume: 0.9,
  });

    private backgroundMedievalMusic: Howl = new Howl({
    src: ["/music/backgroundMusicMedieval.mp3"],
    loop: true,
    html5: true,
    volume: 0.9,
  });


  private battleMusic: Howl = new Howl({
    src: ["/music/battle2.mp3"],
    loop: true,
    volume: 0.1,
  });

    private tavernBrawl: Howl = new Howl({
    src: ["/music/tavernBrawl.mp3"],
    loop: true,
    volume: 0.6,
  });

  private victoryMusic: Howl = new Howl({
    src: ["/music/victory.mp3"],
    loop: false,
    volume: 0.6,
  });

  private currentMusicId: number | undefined;
  private currentSfxId: number | undefined;
  private currentHowl: Howl | undefined;
  private currentMusicTime: number = 0;

  playSfx(soundName: string) {
    let sound = soundName as keyof this;
    if ((this[sound] as Howl) === this.currentHowl) return;
    this.currentSfxId = (this[sound] as Howl)?.play();
    return this.currentSfxId;
  }

  stopSFX(soundName: string) {
    let sound = soundName as keyof this;
    (this[sound] as Howl)?.stop(this.currentSfxId);
  }

  stopMusic(musicName: string) {
    let music = musicName as keyof this;
    (this[music] as Howl)?.stop(this.currentMusicId);
  }

  muteMusic() {
    if (!this.currentHowl || !this.currentMusicId) return;
    this.currentMusicTime = this.currentHowl.seek(this.currentMusicId);
    this.currentHowl = this.currentHowl?.mute(true, this.currentMusicId);
    console.log("pausing ?");
  }

  resumeMusic() {
    if (!this.currentHowl || !this.currentMusicId) return;
    this.currentHowl?.mute(false, this.currentMusicId);
  }

  playMusic(musicName: string) {
    let music = musicName as keyof this;

    if (!this.currentHowl) {
      this.currentMusicId = (this[music] as Howl)?.play();
      this.currentHowl = this[music] as Howl;
      return;
    }

    if ((this[music] as Howl) !== this.currentHowl) {
      console.log("current howl:", this.currentHowl)
      this.currentHowl?.stop(this.currentMusicId);
      this.currentMusicId = (this[music] as Howl)?.play();
      this.currentHowl = this[music] as Howl;
      return;
    }

    if ((this[music] as Howl) === this.currentHowl) {
      (this[music] as Howl)?.play();
      return;
    }
  }

  resetAllAudio() {
    this.currentHowl?.stop(this.currentMusicId);
  }
}
