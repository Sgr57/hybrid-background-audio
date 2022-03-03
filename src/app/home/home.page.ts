import {Component, OnInit} from '@angular/core';
import {Howl, Howler} from 'howler';
import {Platform} from "@ionic/angular";
import {AdvancedNativeAudio} from "advanced-native-audio";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  audioUrl = 'https://www.bensound.com/bensound-music/bensound-ukulele.mp3';
  // audioUrl = 'https://bcbolt446c5271-a.akamaihd.net/media/v1/pmp4/static/clear/4090876667001/f7c7b006-79e1-4c99-8c6b-951a5566a55f/cb4a9343-f0dc-47de-87e9-eb6efd9562f8/main.mp4?akamai_token=exp=1633383905~acl=/media/v1/pmp4/static/clear/4090876667001/f7c7b006-79e1-4c99-8c6b-951a5566a55f/cb4a9343-f0dc-47de-87e9-eb6efd9562f8/main.mp4*~hmac=122c99c040b47567cf10e7e2cc255153a60dfe6a5ff4c9a5a65a1d8d27b41e6b';
  player: Howl = null;

  constructor(
      private platform: Platform,
  ) {}

  ngOnInit() {
    this.start();
  }

  start() {
    if (this.platform.is('cordova')) {
      AdvancedNativeAudio.preload({
        assetId: "ukulele",
        assetPath: this.audioUrl,
        audioChannelNum: 1,
        trackName: "Ukulele",
        isUrl: true
      });
    } else {
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
    }
  }

  play() {
    if (this.platform.is('cordova')) {
      AdvancedNativeAudio.play({
        assetId: 'ukulele',
        time: 0.0
      });
    } else {
      if (this.player.playing()) return;
      this.player.play();
    }
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
