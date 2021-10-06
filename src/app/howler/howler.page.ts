import { Component, OnInit } from '@angular/core';
import {Howl, Howler} from 'howler';
import { Plugins } from '@capacitor/core';
const { CapacitorMusicControls } = Plugins;

@Component({
  selector: 'app-howler',
  templateUrl: './howler.page.html',
  styleUrls: ['./howler.page.scss'],
})
export class HowlerPage implements OnInit {

  // audioUrl = 'https://www.bensound.com/bensound-music/bensound-ukulele.mp3';
  audioUrl = './assets/ukulele.mp3';
  player: Howl = null;

  constructor() {}

  ngOnInit() {
    this.start();
  }

  startControls() {
    const options = {};
    CapacitorMusicControls.create(options).then(res => {
      console.log('CapacitorMusicControls.create - success: ', res);

      CapacitorMusicControls.addListener('controlsNotification', (info: any) => {
        console.log('controlsNotification was fired');
        console.log(info);
        this.handleControlsEvent(info);
      });
    }).catch(err => {
      console.log('CapacitorMusicControls.create - err: ', err);
    });


  }

  handleControlsEvent(action) {

    console.log("hello from handleControlsEvent")
    const message = action.message;

    console.log("message: " + message)

    switch(message) {
      case 'music-controls-next':
        // next
        break;
      case 'music-controls-previous':
        // previous
        break;
      case 'music-controls-pause':
        // paused
        console.log('music-controls-pause');
        this.pause();
        break;
      case 'music-controls-play':
        // resumed
        console.log('music-controls-play');
        this.play();
        break;
      case 'music-controls-destroy':
        // controls were destroyed
        break;

        // External controls (iOS only)
      case 'music-controls-toggle-play-pause' :
        // do something
        break;
      case 'music-controls-skip-to':
        // do something
        break;
      case 'music-controls-skip-forward':
        // Do something
        break;
      case 'music-controls-skip-backward':
        // Do something
        break;

        // Headset events (Android only)
        // All media button events are listed below
      case 'music-controls-media-button' :
        // Do something
        break;
      case 'music-controls-headset-unplugged':
        // Do something
        break;
      case 'music-controls-headset-plugged':
        // Do something
        break;
      default:
        break;
    }
  }

  start() {
    if (this.player) {
      this.player.stop();
    }
    this.player = new Howl({
      src: this.audioUrl,
      volume: 1.0,
      html5: false,
      loop: false,
      preload: true,
      autoplay: false,
      mute: false,
      rate: 1.0,
      pool: 2,
      onplayerror: () => {
        console.log('onplayerror');
      },
      onplay: () => {
        console.log('onplay');
      },
      onend: () => {
        console.log('onend');
      },
      onpause: () => {
        console.log('onpause');
      },
      onstop: () => {
        console.log('onstop');
      },
      onmute: () => {
        console.log('onmute');
      },
      onvolume: () => {
        console.log('onvolume');
      },
      onrate: () => {
        console.log('onrate');
      },
      onseek: () => {
        console.log('onseek');
      },
      onfade: () => {
        console.log('onfade');
      },
      onunlock: () => {
        console.log('onunlock');
      },
    });

    this.startControls();
  }

  play() {
    if (this.player.playing()) return;
    this.player.play();
  }

  pause() {
    if (!this.player.playing()) return;
    this.player.pause();
  }

  stop() {
    this.player.stop();
  }

  mute() {
    this.player.mute();
  }

  volumeUp() {
    this.player.volume(this.player.volume() + 0.1);
    console.log('volume: ', this.player.volume());
  }

  volumeDown() {
    this.player.volume(this.player.volume() - 0.1);
    console.log('volume: ', this.player.volume());
  }

  fade() {
    this.player.fade();
  }

  rate() {
    this.player.rate();
  }

  seek() {
    console.log('seek: ', this.player.seek());
  }

  loop() {
    this.player.loop();
  }

  state() {
    console.log('state: ', this.player.state());
  }

  playing() {
    console.log('playing: ', this.player.playing());
  }

  duration() {
    console.log('duration: ', this.player.duration());
  }

}
