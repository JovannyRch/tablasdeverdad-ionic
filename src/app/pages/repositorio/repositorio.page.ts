import { Component, OnInit } from '@angular/core';
import { RepositorioService } from "../../services/repositorio.service";

@Component({
  selector: 'app-repositorio',
  templateUrl: './repositorio.page.html',
  styleUrls: ['./repositorio.page.scss'],
})
export class RepositorioPage implements OnInit {

  constructor(
    private db: RepositorioService
  ) { }

  expresion: any = {
    expresion: '',
    desc: '',
    fecha: ''
  };
  cargando: boolean = true;
  expresiones = [];
  hayInternet = true;
  ngOnInit() {
    this.cargarExpresiones();
  }

  cargarExpresiones() {
    this.cargando = true;
    this.db.read().subscribe(
      data => {
        this.expresiones = data.map(
          e => {
            return {
              id: e.payload.doc.id,
              isEdit: false,
              expresion: e.payload.doc.data()['expresion'],
              desc: e.payload.doc.data()['desc'],
              fecha: e.payload.doc.data()['fecha'],
            };
          }
        )
        this.cargando = false;
        this.hayInternet = true;
        console.log(this.expresiones);

      }
    );
  }

  guardarExmpresion() {
    if (this.expresion.expresion) {
      this.expresion.fecha = new Date();
      this.db.create(this.expresion);
    }
  }

  formatAMPM(date) {
    date = date.toDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var day = date.getDate();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = day + '/' + month + "/" + year;
    return strTime;
  }

}
