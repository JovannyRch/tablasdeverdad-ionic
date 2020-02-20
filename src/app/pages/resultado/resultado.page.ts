import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Storage } from '@ionic/storage';
import { ToastController, Platform, NavController } from '@ionic/angular';

import { RepositorioService } from "../../services/repositorio.service";
@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.page.html',
  styleUrls: ['./resultado.page.scss'],
})
export class ResultadoPage implements OnInit {

  constructor(
    private activeRoute: ActivatedRoute,
    private storage: Storage,
    public toastController: ToastController,

    private navCtrl: NavController,
    private repositorio: RepositorioService,
  ) { }

  expresion: any;
  guardarEnNube: boolean = false;
  descripcion: string = "";
  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.infija = params['infija'];
    });
    this.desc = this.activeRoute.snapshot.paramMap.get("desc");
    this.verExp(this.infija);
    this.toPostfix();

    this.storage.get('expresiones').then((val) => {
      if (val) {
        this.expresionesGuardadas = val;
      } else {
        this.storage.set('expresiones', this.expresionesGuardadas);
      }
    });
  }

  activarGuardarEnNube() {
    this.guardarEnNube = !this.guardarEnNube;
    this.descripcion = "";
  }

  guardarDB() {
    let registro = {
      expresion: this.infijaOrg,
      desc: this.descripcion,
      fecha: new Date()
    };
    this.repositorio.create(registro);
    this.descripcion = "";
    this.guardarEnNube = false;
  }



  fecha: string = "";
  desc: string = "";
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
  ok: boolean = false;

  expresionesGuardadas: any = [];
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


  fMostrarProceso() {
    this.mostrarProceso = !this.mostrarProceso;
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

  regresar() {
    this.navCtrl.pop();
  }

  guardarExp() {
    if (this.infijaOrg) {
      if (this.expresionesGuardadas.includes(this.infijaOrg)) {
        this.presentToast("Ya ha sido guardado previamente");
      } else {
        this.expresionesGuardadas.push(this.infijaOrg);
        this.storage.set("expresiones", this.expresionesGuardadas);
        this.presentToast("Guardado exitosamente :)");
      }
    }
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

  verExp(e: string) {
    this.clearMem();
    this.infija = e + '';
    this.setModo(this.infija);
    this.toPostfix();
    this.verGuardadas = false;
    this.ok = true;
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

  toPostfix() {
    this.ok = false;
    this.infijaOrg = this.infija;


    if (this.modo == 2) {
      this.infija = this.replaceAll(this.infija, "∧", "&");
      this.infija = this.replaceAll(this.infija, "∨", "|");
      this.infija = this.replaceAll(this.infija, "¬", "!");
    }

    this.infija = this.infija.replace('[', '(');
    this.infija = this.infija.replace(']', ')');

    this.clearMem();

    this.infija = this.check(this.infija);
    this.infijaAux = this.infija;
    let prec = {};
    prec["⊼"] = 8;
    prec["⊻"] = 7;
    prec["↓"] = 6;
    prec["!"] = 5;
    prec["&"] = 4;
    prec["|"] = 3;
    prec["⇒"] = 2;
    prec["⇔"] = 1;
    prec["("] = 0;

    let opStack = [];
    let postfixList = [];

    for (const caracter of this.infija) {
      if (!this.operadores.includes(caracter)) {
        postfixList.push(caracter);
      }
      else if (caracter === '(') {

        opStack.push(caracter);

      }
      else if (caracter === ')') {
        let topToken = opStack.pop();
        while (topToken != "(") {
          postfixList.push(topToken);
          topToken = opStack.pop();
        }


      } else {

        while (opStack.length != 0 && (prec[opStack[opStack.length - 1]] > prec[caracter])) {
          postfixList.push(opStack.pop())
        }
        opStack.push(caracter);
      }
    }
    while (opStack.length > 0) {
      postfixList.push(opStack.pop());
    }
    this.postfija = "";
    this.postfija = postfixList.join("");
    //this.router.navigate(["/evaluador/"+strPostfix+"/"+this.infija])
    this.generarTabla();
    this.ok = true;

    //return strPostfix;

  }

  normalize(oper) {
    if (this.modo == 2) {
      oper = this.replaceAll(oper, "&", "∧");
      oper = this.replaceAll(oper, "|", "∨");
      oper = this.replaceAll(oper, "!", "¬");
    }
    return oper;
  }

  checkParentesis(exp: string) {
    let iL = this.infija.indexOf(exp);
    if (iL < 0) return false;
    let iR = iL + exp.length;
    if (iL > 0 && iR <= this.infija.length - 1) {
      let cR = this.infija[iR];
      let cL = this.infija[iL - 1];
      if (cR === ")" && cL === "(") return true;
    }

    return false;

  }

  getProceso(postfija: string) {
    let pila = [];
    this.proceso = [];
    for (const c of postfija) {
      let oper = "";
      if (this.operadores.includes(c)) {
        // Evaluar
        let a = pila.pop();
        if (this.opr2var.includes(c)) {
          let b = pila.pop();
          let operator = this.opr2var[this.opr2var.indexOf(c)];
          oper = b + operator + a;
        }

        if (c === "!") {
          oper = "!" + a;
        }
        let aux = oper;

        if (this.checkParentesis(aux)) {

          pila.push("(" + oper + ")");
        }
        else {
          pila.push(oper);
        }
        this.proceso.push({ exp: oper, tabla: [] });
      } else {
        pila.push(c);
      }
    }
  }




  generarTabla() {
    this.tabla = [];
    for (const caracter of this.postfija) {
      if (!this.operadores.includes(caracter) && !this.variables.includes(caracter)) {
        this.variables.push(caracter);
      }
    }
    this.variables = this.variables.sort();
    let nCombinaciones = Math.pow(2, this.variables.length);
    this.getProceso(this.postfija);
    let cant0 = 0;
    let cant1 = 0;
    for (let i = nCombinaciones - 1; i >= 0; i--) {
      let combinacion = this.nBits(i.toString(2), this.variables.length)
      let susChida = this.sustituir(combinacion, this.postfija);
      let resultado = this.evaluar(susChida);
      if (resultado == 1) {
        cant1 += 1;
      }

      if (resultado == 0) {
        cant0 += 1;
      }

      this.tabla.push((combinacion + resultado).split(""));
    }

    if (cant1 == nCombinaciones) {
      this.diagnostico = "Tautología";
    }

    else if (cant0 == nCombinaciones) {
      this.diagnostico = "Contradicción";
    }

    else {
      this.diagnostico = "Contingencia";
    }

    if (this.modo == 2) {
      this.infija = this.replaceAll(this.infija, "&", "∧");
      this.infija = this.replaceAll(this.infija, "|", "∨");
      this.infija = this.replaceAll(this.infija, "!", "¬");
    }
    this.infija = this.infijaOrg;


  }

  sustituir(combinacion, postfija) {
    let auxPost = postfija;
    for (const caracter of auxPost) {
      if (this.variables.includes(caracter)) {
        auxPost = this.replaceAll(auxPost, caracter, combinacion[this.variables.indexOf(caracter)]);
      }
    }

    return auxPost;
  }

  nBits(bin, n) {
    while (bin.length < n) {
      bin = "0" + bin;
    }
    return bin;
  }

  evaluar(expresion: string) {
    let pila = [];

    let iAux = 0;
    for (let i = 0; i < expresion.length; i++) {
      let c = expresion[i];

      if (this.operadores.includes(c)) {
        // Evaluar
        let a = parseInt(pila.pop());
        let resultado;
        if (this.opr2var.includes(c)) {
          let b = parseInt(pila.pop());
          switch (c) {
            case "|":
              resultado = this.or(b, a);
              break;
            case "&":
              resultado = this.and(b, a);
              break;
            case "⇒":
              resultado = this.condicional(b, a);
              break;
            case "⇔":
              resultado = this.bicondicional(b, a);
              break;
            case "↓":
              resultado = this.nor(b, a);
              break;
            case "⊼":
              resultado = this.nand(b, a);
              break;
            case "⊻":
              resultado = this.xor(b, a);
              break;
          }
        }
        if (c === "!") {
          resultado = this.not(a);
        }

        pila.push(resultado);
        this.proceso[iAux].tabla.push(resultado);
        iAux += 1;
      } else {
        pila.push(c);
      }
    }

    return pila.pop();
  }



  //Sustituir dos variables juntas por la operación AND
  check(infija: string) {
    let res = "";
    for (let i = 0; i < infija.length - 1; i++) {
      let c = infija[i];
      let cNext = infija[i + 1];
      if ((cNext === "!" && this.varNames.includes(c))) {

        res += c + "&";
      }
      else if (c === ")" && cNext === "!") {

        res += c + "&";
      }
      else if (c === ")" && cNext === "(") {

        res += c + "&";
      }
      else if (this.varNames.includes(c) && this.varNames.includes(cNext)) {

        res += c + "&";
      }
      else if (this.varNames.includes(c) && cNext === "(") {

        res += c + "&";
      }
      else {
        res += c
      }

    }
    let lastC = infija[infija.length - 1];
    return res + lastC;
  }


  or(a, b) {
    if (a == 1 || b == 1) return 1;
    return 0;
  }

  and(a, b) {
    if (a == 1 && b == 1) return 1;
    return 0;
  }

  not(a) {
    if (a == 1) return 0;
    return 1;
  }


  xor(a, b) {
    if (a == b) return 0;
    return 1;
  }

  nand(a, b) {
    return this.not(this.and(a, b));
  }

  xnor(a, b) {
    return this.not(this.xor(a, b))
  }

  nor(a, b) {
    return this.not(this.or(a, b));
  }


  condicional(a, b) {
    if (a == 1 && b == 0) return 0;
    return 1;
  }

  bicondicional(a, b) {
    if (a == b) return 1;
    return 0;
  }

  formatDate(date) {
    //date = date.toDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var day = date.getDay();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = day + '/' + month + "/" + year;
    return strTime;
  }


}
