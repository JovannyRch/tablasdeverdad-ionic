import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-temas',
  templateUrl: './temas.page.html',
  styleUrls: ['./temas.page.scss'],
})
export class TemasPage implements OnInit {

  constructor() { }

  temas: any = [
    "Jerarquía de operadores",
    "Operador AND ∧",
    "Operador OR ∨",
    "Operador NOT ¬",
    "Operador IMPLICACIÓN ⇒",
    "Operador BICONDICIONAL ⇔",
    "Operador NAND ⊼",
    "Operador NOR ↓",
    "Operador XOR ⊻",
  ]

  ngOnInit() {
  }

}
