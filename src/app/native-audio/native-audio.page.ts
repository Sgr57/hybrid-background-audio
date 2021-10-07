import {Component, NgZone, OnInit} from '@angular/core';
import {Platform} from "@ionic/angular";
import {NativeAudio} from "@capacitor-community/native-audio";
import {BackgroundMode} from "@ionic-native/background-mode/ngx";
import { Plugins } from '@capacitor/core';
const { CapacitorMusicControls } = Plugins;

@Component({
  selector: 'app-native-audio',
  templateUrl: './native-audio.page.html',
  styleUrls: ['./native-audio.page.scss'],
})
export class NativeAudioPage implements OnInit {

  // audioUrl = 'https://www.bensound.com/bensound-music/bensound-ukulele.mp3';
  audioUrl = 'public/assets/ukulele.mp3';
  assetId = 'ukulele';
  volume: number = 1.0;
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
    this.start();
  }

  start() {
    if (this.platform.is('cordova')) {
      NativeAudio.preload({
        assetId: this.assetId,
        assetPath: this.audioUrl,
        isUrl: false,
        audioChannelNum: 1,
        volume: this.volume,
      });
    }
  }

  async play(time: number = 0.0) {
    NativeAudio.play({
      assetId: this.assetId,
      time
    }).then(() => {
      console.log('play - success');
    }).catch((err) => {
      console.log('play - err: ', err);
    });

    this.duration = await this.updateDuration();
    this.startControls();
    this.startElapsedMonitor();

    this.isPlaying = true;
    this.isStarted = true;
  }

  pause() {
    NativeAudio.pause({
      assetId: this.assetId,
    }).then(() => {
      console.log('pause - success');
    }).catch((err) => {
      console.log('pause - err: ', err);
    });
    this.stopElapsedMonitor();
    this.isPlaying = false;
  }

  resume() {
    NativeAudio.resume({
      assetId: this.assetId,
    }).then(() => {
      console.log('resume - success');
    }).catch((err) => {
      console.log('resume - err: ', err);
    });
    this.startElapsedMonitor();
    this.isPlaying = true;
  }

  stop() {
    NativeAudio.stop({
      assetId: this.assetId,
    }).then(() => {
      console.log('stop - success');
    }).catch((err) => {
      console.log('stop - err: ', err);
    });
    this.stopElapsedMonitor();
    this.isPlaying = false;
    this.isStarted = false;
  }

  volumeUp() {
    let volume = Math.round((this.volume + 0.1) * 10) / 10;
    if (volume > 1.0) volume = 1.0;
    NativeAudio.setVolume({
      assetId: this.assetId,
      volume
    }).then(() => {
      console.log('setVolume - success');
    }).catch((err) => {
      console.log('setVolume - err: ', err);
    });
    this.volume = volume;
  }

  volumeDown() {
    let volume = Math.round((this.volume - 0.1) * 10) / 10;
    if (volume < 0) volume = 0;
    NativeAudio.setVolume({
      assetId: this.assetId,
      volume
    }).then(() => {
      console.log('setVolume - success');
    }).catch((err) => {
      console.log('setVolume - err: ', err);
    });
    this.volume = volume;
  }

  seek() {
    return NativeAudio.getCurrentTime({
      assetId: this.assetId,
    }).then(result => {
      console.log('seek: ', result.currentTime);
      this.elapsed = result.currentTime;
      return result.currentTime;
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
    this.stop();
    let time = this.elapsed + this.skipTime;
    if (time >= this.duration) time = this.duration;
    this.play(time);
  }

  skipBackward() {
    this.stop();
    let time = this.elapsed - this.skipTime;
    if (time >= this.duration) time = this.duration;
    this.play(time);
  }


  startControls() {
    const options = {
      track       : 'Time is Running Out',		// optional, default : ''
      artist      : 'Muse',						// optional, default : ''
      album       : 'Absolution',     // optional, default: ''
      cover       : 'https://upload.wikimedia.org/wikipedia/en/b/b4/Muse_-_Absolution_Cover_UK.jpg',		// optional, default : nothing
      // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
      //			 or a remote url ('http://...', 'https://...', 'ftp://...')

      // hide previous/next/close buttons:
      hasPrev   : false,		// show previous button, optional, default: true
      hasNext   : false,		// show next button, optional, default: true
      hasClose  : true,		// show close button, optional, default: false

      // iOS only, optional
      duration : this.duration, // optional, default: 0
      elapsed : this.elapsed, // optional, default: 0
      hasSkipForward : true, //optional, default: false. true value overrides hasNext.
      hasSkipBackward : true, //optional, default: false. true value overrides hasPrev.
      skipForwardInterval : this.skipTime, //optional. default: 15.
      skipBackwardInterval : this.skipTime, //optional. default: 15.
      hasScrubbing : false, //optional. default to false. Enable scrubbing from control center progress bar

      // Android only, optional
      isPlaying   : this.isPlaying,							// optional, default : true
      dismissable : true,							// optional, default : false
      // text displayed in the status bar when the notification (and the ticker) are updated
      ticker	  : 'Now playing "Time is Running Out"',
      //All icons default to their built-in android equivalents
      //The supplied drawable name, e.g. 'media_play', is the name of a drawable found under android/res/drawable* folders
      playIcon: 'media_play',
      pauseIcon: 'media_pause',
      prevIcon: 'media_prev',
      nextIcon: 'media_next',
      closeIcon: 'media_close',
      notificationIcon: 'notification'
    };
    CapacitorMusicControls.create(options).then(res => {
      console.log('CapacitorMusicControls.create - success: ', res);

      CapacitorMusicControls.addListener('controlsNotification', (info: any) => {
        console.log('controlsNotification was fired: ', info);
        console.log('NgZone.isInAngularZone: ', NgZone.isInAngularZone());
        this._ngZone.run(() => {
          this.handleControlsEvent(info);
        })
      });
    }).catch(err => {
      console.log('CapacitorMusicControls.create - err: ', err);
    });
  }

  startElapsedMonitor() {
    if (this.elapsedInterval) {
      clearInterval(this.elapsedInterval);
    }
    this.seek().then(elapsed => {
      this.elapsed = elapsed;
      this.updateControls();
    });
    this.elapsedInterval = setInterval(() => {
      this.seek().then(elapsed => {
        this.elapsed = elapsed;
        this.updateControls();
      });
    }, 1000);
  }

  stopElapsedMonitor() {
    if (this.elapsedInterval) {
      clearInterval(this.elapsedInterval);
    }
  }

  updateControls() {
    CapacitorMusicControls.updateIsPlaying({
      isPlaying: this.isPlaying, // affects Android only
      elapsed: this.elapsed // affects iOS Only
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
        this.pause();
        break;
      case 'music-controls-play':
        // resumed
        this.resume();
        break;
      case 'music-controls-destroy':
        // controls were destroyed
        this.stop();
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
        this.skipForward();
        break;
      case 'music-controls-skip-backward':
        // Do something
        this.skipBackward();
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

}
