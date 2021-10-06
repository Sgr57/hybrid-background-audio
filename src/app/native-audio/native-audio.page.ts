import { Component, OnInit } from '@angular/core';
import {Platform} from "@ionic/angular";
import {NativeAudio} from "@capacitor-community/native-audio";

@Component({
  selector: 'app-native-audio',
  templateUrl: './native-audio.page.html',
  styleUrls: ['./native-audio.page.scss'],
})
export class NativeAudioPage implements OnInit {

  // audioUrl = 'https://www.bensound.com/bensound-music/bensound-ukulele.mp3';
  audioUrl = 'public/assets/ukulele.mp3';
  volume: number = 1.0;
  isPlaying = false;
  isStarted = false;

  constructor(
      private platform: Platform,
  ) {}

  ngOnInit() {
    this.start();
  }

  start() {
    if (this.platform.is('cordova')) {
      NativeAudio.preload({
        assetId: "ukulele",
        assetPath: this.audioUrl,
        isUrl: false,
        audioChannelNum: 1,
        volume: this.volume,
      });
    }
  }

  play(time: number = 0.0) {
    if (this.platform.is('cordova')) {
      NativeAudio.play({
        assetId: 'ukulele',
        time
      }).then(() => {
        this.isPlaying = true;
        this.isStarted = true;
      });
    }
  }

  pause() {
    if (!this.isPlaying) return;
    NativeAudio.pause({
      assetId: 'ukulele',
    }).then(() => {
      this.isPlaying = false;
    });
  }

  resume() {
    if (this.isPlaying) return;
    NativeAudio.resume({
      assetId: 'ukulele',
    }).then(() => {
      this.isPlaying = true;
    });
  }

  stop() {
    if (!this.isStarted) return;
    NativeAudio.stop({
      assetId: 'ukulele',
    }).then(() => {
      this.isPlaying = false;
      this.isStarted = false;
    });
  }

  volumeUp() {
    let volume = Math.round((this.volume + 0.1) * 10) / 10;
    if (volume > 1.0) volume = 1.0;
    NativeAudio.setVolume({
      assetId: 'ukulele',
      volume
    }).then(() => {
      this.volume = volume;
    });
  }

  volumeDown() {
    let volume = Math.round((this.volume - 0.1) * 10) / 10;
    if (volume < 0) volume = 0;
    NativeAudio.setVolume({
      assetId: 'ukulele',
      volume
    }).then(() => {
      this.volume = volume;
    });
  }

  seek() {
    NativeAudio.getCurrentTime({
      assetId: 'ukulele'
    }).then(result => {
      console.log('seek: ', result.currentTime);
    });
  }

  duration() {
    NativeAudio.getDuration({
      assetId: 'ukulele'
    }).then(result => {
      console.log('duration: ', result.duration);
    });
  }

  goto(time) {
    this.stop();
    this.play(time);
  }

}
