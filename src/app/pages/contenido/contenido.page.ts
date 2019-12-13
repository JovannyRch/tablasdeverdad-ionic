import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.page.html',
  styleUrls: ['./contenido.page.scss'],
})
export class ContenidoPage implements OnInit {

  constructor(private activeRoute: ActivatedRoute) { }

  index: number = -1;
  tema: String = "";
  ngOnInit() {
    this.tema = this.activeRoute.snapshot.paramMap.get("tema");
    this.index = parseInt(this.activeRoute.snapshot.paramMap.get("indice"));
  }

}
