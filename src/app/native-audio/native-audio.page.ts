import {Component, NgZone, OnInit} from '@angular/core';
import {Platform} from "@ionic/angular";
import {NativeAudio} from "@capacitor-community/native-audio";

@Component({
  selector: 'app-native-audio',
  templateUrl: './native-audio.page.html',
  styleUrls: ['./native-audio.page.scss'],
})
export class NativeAudioPage implements OnInit {

  audioUrlRemote = 'https://www.bensound.com/bensound-music/bensound-ukulele.mp3';
  audioUrl = 'public/assets/ukulele.mp3';
  assetId = 'ukulele';
  isInitializated = false;
  isPlaying = false;
  isStarted = false;
  duration: number = 0;
  elapsed: number = 0;
  elapsedInterval;

  skipTime:number = 15;

  constructor(
      private platform: Platform,
      private _ngZone: NgZone
  ) {}

  ngOnInit() {
    this.initEventsListener();
  }

  startRemote() {
    if (this.platform.is('cordova')) {
      NativeAudio.preload({
        assetId: this.assetId,
        assetPath: this.audioUrlRemote,
        isUrl: true,
        audioChannelNum: 1,
        volume: 1.0,
        trackName: 'Ukulele',
        artist: 'artist',
        album: 'album',
        cover: 'https://www.macitynet.it/wp-content/uploads/2017/05/Yuri-Di-Prodo-2017-Macitynet-004-Ukulele-Andoer.jpg',
      }).then(() => {
        this.isInitializated = true;
      });
    }
  }

  start() {
    if (this.platform.is('cordova')) {
      NativeAudio.preload({
        assetId: this.assetId,
        assetPath: this.audioUrl,
        isUrl: false,
        audioChannelNum: 1,
        volume: 1.0,
        trackName: 'Ukulele',
        artist: 'artist',
        album: 'album',
        cover: 'https://www.macitynet.it/wp-content/uploads/2017/05/Yuri-Di-Prodo-2017-Macitynet-004-Ukulele-Andoer.jpg',
      }).then(() => {
        this.isInitializated = true;
      });
    }
  }

  async play(time: number = 0.0) {
    NativeAudio.play({
      assetId: this.assetId,
      time
    }).then(() => {
      console.log('play - success');
      this.isPlaying = true;
      this.isStarted = true;
    }).catch((err) => {
      console.log('play - err: ', err);
    });
  }

  pause() {
    NativeAudio.pause({
      assetId: this.assetId,
    }).then(() => {
      console.log('pause - success');
      this.isPlaying = false;
    }).catch((err) => {
      console.log('pause - err: ', err);
    });
  }

  resume() {
    NativeAudio.resume({
      assetId: this.assetId,
    }).then(() => {
      console.log('resume - success');
      this.isPlaying = true;
    }).catch((err) => {
      console.log('resume - err: ', err);
    });
  }

  stop() {
    NativeAudio.stop({
      assetId: this.assetId,
    }).then(() => {
      console.log('stop - success');
      this.isPlaying = false;
      this.isStarted = false;
    }).catch((err) => {
      console.log('stop - err: ', err);
    });
  }

  volumeUp() {
    NativeAudio.getVolume({ assetId: this.assetId}).then((res) => {
      console.log('getVolume - success - res: ', res);
      const currentVolume = res.volume;
      const targetVolume = currentVolume + 0.1;
      NativeAudio.setVolume({
        assetId: this.assetId,
        volume: targetVolume
      }).then(() => {
        console.log('setVolume - success');
      }).catch((err) => {
        console.log('setVolume - err: ', err);
      });
    }).catch((err) => {
      console.log('getVolume - err: ', err);
    });
  }

  volumeDown() {
    NativeAudio.getVolume({ assetId: this.assetId}).then((res) => {
      console.log('getVolume - success - res: ', res);
      const currentVolume = res.volume;
      const targetVolume = currentVolume - 0.1;
      NativeAudio.setVolume({
        assetId: this.assetId,
        volume: targetVolume
      }).then(() => {
        console.log('setVolume - success');
      }).catch((err) => {
        console.log('setVolume - err: ', err);
      });
    }).catch((err) => {
      console.log('getVolume - err: ', err);
    });
  }

  currentTime() {
    return NativeAudio.getCurrentTime({
      assetId: this.assetId,
    }).then(res => {
      console.log('getCurrentTime - success - res: ', res);
      const currentTime = res.time;
      return currentTime;
    }).catch(err => {
      console.log('getCurrentTime - err: ', err);
    });
  }

  updateDuration() {
    return NativeAudio.getDuration({
      assetId: this.assetId,
    }).then(result => {
      console.log('duration: ', result.duration);
      this.duration = result.duration;
      return result.duration;
    });
  }

  skipForward() {
    NativeAudio.getCurrentTime({
      assetId: this.assetId,
    }).then(res => {
      console.log('getCurrentTime - success - res: ', res);
      const currentTime = res.time;
      const targetTime = currentTime + this.skipTime;
      NativeAudio.setCurrentTime({
        assetId: this.assetId,
        time: targetTime,
      }).then(() => {
        console.log('setCurrentTime - success');
      }).catch(err => {
        console.log('setCurrentTime - err: ', err);
      })
    }).catch(err => {
      console.log('getCurrentTime - err: ', err);
    });
  }

  skipBackward() {
    NativeAudio.getCurrentTime({
      assetId: this.assetId,
    }).then(res => {
      console.log('getCurrentTime - success - res: ', res);
      const currentTime = res.time;
      const targetTime = currentTime - this.skipTime;
      NativeAudio.setCurrentTime({
        assetId: this.assetId,
        time: targetTime,
      }).then(() => {
        console.log('setCurrentTime - success');
      }).catch(err => {
        console.log('setCurrentTime - err: ', err);
      })
    }).catch(err => {
      console.log('getCurrentTime - err: ', err);
    });
  }

  initEventsListener() {
    NativeAudio.addListener('playbackStateChanged', (info: { status: any; position: number }) => {
      console.log('playbackStateChanged was fired: ', info);
      console.log('NgZone.isInAngularZone: ', NgZone.isInAngularZone());
      this._ngZone.run(() => {
        // this.handleControlsEvent(info);
        this.elapsed = info.position;
        switch (info.status) {
          case 'PLAYING':
            this.isStarted = true;
            this.isPlaying = true;
            break;
          case 'PAUSED':
            this.isPlaying = false;
            break;
          case 'STOPPED':
            this.isStarted = false;
            this.isPlaying = false;
            break;
          case 'PLAYING':
            this.isPlaying = true;
            break;
          case 'PLAYING':
            this.isPlaying = true;
            break;
          default:
            console.log(' /!\\ unhandled');
            break;
        }
      })
    });
  }


}
