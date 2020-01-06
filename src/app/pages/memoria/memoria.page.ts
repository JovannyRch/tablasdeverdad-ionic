import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from "@ionic/angular";
@Component({
  selector: 'app-memoria',
  templateUrl: './memoria.page.html',
  styleUrls: ['./memoria.page.scss'],
})
export class MemoriaPage implements OnInit {
  expresionesGuardadas: any = [];
  constructor(
    private storage: Storage,
    private navCtrl: NavController
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



  atras() {
    this.navCtrl.pop();
  }

  eliminarExp(index: number) {
    this.expresionesGuardadas.splice(index, 1);
    this.storage.set("expresiones", this.expresionesGuardadas);
  }

}
