import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

import { ToastController, Platform, NavController } from '@ionic/angular';

import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Router, NavigationExtras } from "@angular/router";
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free/ngx';
//importamos nuestro plugin
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

  constructor(platform: Platform,
    private admobFree: AdMobFree,
    public toastController: ToastController,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public navCtrl: NavController,
    private router: Router,

  ) {
    platform.ready().then(() => {
      //statusBar.styleDefault();
      //splashScreen.hide();
      //this.pushAdmob();
    });
    this.backButtonEvent();
  }

  backButtonEvent() {
    document.addEventListener("backbutton", () => {
      console.log(this.router.url);
      if (this.router.url.toString().includes('/home')) {
        navigator['app'].exitApp();
      }
    });
  }

  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  ngAfterViewInit() {

  }
  expresionesGuardadas: any = [];
  ngOnInit() {
    const bannerConfig: AdMobFreeBannerConfig = {
      id: 'ca-app-pub-4665787383933447/6762703339',
      isTesting: false,
      autoShow: true,
    };
    const videoConfig: AdMobFreeBannerConfig = {
      id: 'ca-app-pub-4665787383933447/1334937592',
      isTesting: false,
      autoShow: true,
    };
    this.admobFree.banner.config(bannerConfig);
    this.admobFree.rewardVideo.config(videoConfig);


    // this.pushAdmob();

    //this.mostrarVideo();
  }

  mostrarBanner() {

    this.admobFree.banner.prepare()
      .then(() => {
        this.admobFree.banner.show();
        console.log("show banner");
      });
  }

  mostrarVideo() {
    this.admobFree.rewardVideo.prepare()
      .then(() => {
        this.admobFree.rewardVideo.show();
      });
  }


  postfija: string = "";
  infija: string = "";
  infijaOrg: string = "";
  infijaAux: string = "";

  variables: string[] = [];
  operadores: string = "!&|()⇔⇒⊼⊻↓";
  opr2var: string = "|&⇔⇒⊼⊻↓";
  varMays: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  varNames: string = this.varMays + this.varMays.toLowerCase();
  tabla: any = [];

  diagnostico: string = "";

  proceso: any = [];

  // Modo 2 => Lógica proposicional, 1 => Electrónica
  modo: number = 2;
  conVsFs: boolean = false;

  opers: any = {
    "and": { 1: "&", 2: "∧" },
    "or": { 1: "|", 2: "∨" },
    "not": { 1: "!", 2: "¬" },
  }

  verGuardadas: boolean = false;
  mostrarProceso: boolean = false;
  guardarEnNube: boolean = false;

  descripcion: string = "";

  cambiar01() {
    this.conVsFs = !this.conVsFs;
  }

  checkChange01(x) {
    if (!this.conVsFs) {
      if (x == "0") return "F";
      return "V";
    }
    return x;
  }





  caseMm: number = 1;
  letras: any = [
    { 1: "A", 0: "a" },
    { 1: "B", 0: "b" },
    { 1: "C", 0: "c" },
    { 1: "D", 0: "d" },
    { 1: "E", 0: "e" },
    { 1: "F", 0: "f" },

    { 1: "G", 0: "g" },
    { 1: "H", 0: "h" },
    { 1: "I", 0: "i" },
    { 1: "J", 0: "j" },
    { 1: "K", 0: "k" },

    { 1: "L", 0: "l" },
    { 1: "M", 0: "m" },
    { 1: "N", 0: "n" },
    { 1: "O", 0: "o" },

    { 1: "P", 0: "p" },
    { 1: "Q", 0: "q" },
    { 1: "R", 0: "r" },
    { 1: "S", 0: "s" },
    { 1: "T", 0: "t" },
    { 1: "U", 0: "u" },
    { 1: "V", 0: "v" },
    { 1: "W", 0: "w" },
    { 1: "X", 0: "x" },
    { 1: "Y", 0: "y" },
    { 1: "Z", 0: "z" },
  ];

  //bandera para saber si una expresion es correcta
  ok: boolean = false;
  saveImg() {
  }


  replaceAll(str: string, find: string, replace: string) {
    while (str.includes(find)) {
      str = str.replace(find, replace);
    }
    return str;
  }

  setOpr(option: number) {
    this.modo = option;
    if (this.modo == 1) {
      this.infija = this.replaceAll(this.infija, "∧", "&");
      this.infija = this.replaceAll(this.infija, "∨", "|");
      this.infija = this.replaceAll(this.infija, "¬", "!");
    }
    else {
      this.infija = this.replaceAll(this.infija, "&", "∧");
      this.infija = this.replaceAll(this.infija, "|", "∨");
      this.infija = this.replaceAll(this.infija, "!", "¬");
    }

  }

  fverGuardadas(val: boolean) {
    this.verGuardadas = val;
  }





  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }


  setModo(cadena: string) {
    let aux: string = cadena;
    cadena = this.replaceAll(cadena, "∧", "&");
    cadena = this.replaceAll(cadena, "∨", "|");
    cadena = this.replaceAll(cadena, "¬", "!");

    if (cadena !== aux) {
      this.modo = 2;
    } else {
      if (cadena.includes("&") || cadena.includes("|") || cadena.includes("!")) {
        this.modo = 1;
      }
    }

  }

  clear() {
    this.infija = "";
  }

  clickVar(c: string) {
    if (this.infija.length > 0 && this.operadores.includes(c)) {
      let lasC = this.infija[this.infija.length - 1];

      if (!(this.opr2var.includes(lasC) && this.opr2var.includes(c))) {
        this.infija = this.infija + c;
      }
    } else {
      if (!(this.opr2var.includes(c))) {
        this.infija = this.infija + c;
      }
    }
  }

  delete() {
    if (this.infija.length > 0) {
      this.infija = this.infija.substr(0, this.infija.length - 1);
    }
  }

  back() {
    this.ok = false;
  }

  clearMem() {
    this.tabla = [];
    this.variables = [];
    this.mostrarProceso = false;
  }

  //Cambiar de mayusculas a minusculas
  changeCase() {
    if (this.caseMm == 1) this.caseMm = 0;
    else this.caseMm = 1;
  }

  verResultado() {
    //'/resultado/'+infija
    console.log(this.infija);
    if (this.validar()) {
      /*  let random = Math.random() * 100;
       console.log(random);
       if (random >= 69) {
        
       } */
      let navigationExtras: NavigationExtras = {
        queryParams: { infija: this.infija }
      };
      this.router.navigate(["resultado"], navigationExtras);
    }
  }

  validar() {
    if (this.infija === "") return false;
    return true;
  }

}
