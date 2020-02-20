import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private admobFree: AdMobFree,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.statusBar.hide();
      this.mostrarBanner();
      this.mostrarVideo();
    });
  }

  mostrarBanner() {
    const bannerConfig: AdMobFreeBannerConfig = {
      id: 'ca-app-pub-4665787383933447/6762703339',
      isTesting: false,
      autoShow: true,
    };
    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner.prepare()
      .then(() => {
        this.admobFree.banner.show();
      });
  }

  mostrarVideo() {
    const videoConfig: AdMobFreeRewardVideoConfig = {
      id: 'ca-app-pub-4665787383933447/1334937592',
      isTesting: false,
      autoShow: true,
    };
    this.admobFree.rewardVideo.config(videoConfig);
    this.admobFree.rewardVideo.prepare()
      .then(() => {
        this.admobFree.rewardVideo.show();
      });
  }
}
