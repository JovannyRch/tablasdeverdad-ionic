import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from "@ionic/angular";
import { Router, NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-memoria',
  templateUrl: './memoria.page.html',
  styleUrls: ['./memoria.page.scss'],
})
export class MemoriaPage implements OnInit {
  expresionesGuardadas: any = [];
  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.storage.get('expresiones').then((val) => {
      if (val) {
        this.expresionesGuardadas = val;
      } else {
        this.storage.set('expresiones', this.expresionesGuardadas);
      }
    });
  }

  verResultado(infija) {
    let navigationExtras: NavigationExtras = {
      queryParams: { infija }
    };
    this.router.navigate(["resultado/"], navigationExtras);
  }


  atras() {
    this.navCtrl.pop();
  }

  eliminarExp(index: number) {
    this.expresionesGuardadas.splice(index, 1);
    this.storage.set("expresiones", this.expresionesGuardadas);
  }

}
