import { Howl } from "howler";
import AudioManager from "./AudioManager";

export default class JournalAudioManager extends AudioManager {
  private tickingSound: Howl = new Howl({
    src: ["/sounds/pickupCoin.wav"],
    volume: 0.1,
  });
  private untickingSound: Howl = new Howl({
    src: ["/sounds/click.wav"],
    volume: 0.1,
  });
  private deletingQuestSound: Howl = new Howl({
    src: ["/sounds/explosion.wav"],
    volume: 0.1,
  });

  private pageTurnSound: Howl = new Howl({
    src: ["/sounds/page.mp3"],
    volume:0.1
  })
}
