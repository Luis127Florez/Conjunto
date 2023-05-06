var variables = ["p", "v", "q", "v", "r", "v", "s", "v", "t", "v", "x", "v"];
var verdades = [false, false, false, false];
var proposiciones = ["p","q","r","s","t","x"];
var finalStatement = "";
var tableStatement = "";
var tipo_tabla = new Array();
var proposicionesSimples = new Array();
var array = new Array();
var answers = new Array();
var ventana = null;



//cambiar valores de verdad
function switchValue(value) {
  if ($("#valueOfP").val() == "falso") {
    variables[1] = "0";
  } else {
    variables[1] = "1";
  }

  if ($("#valueOfQ").val() == "falso") {
    variables[3] = "0";
  } else {
    variables[3] = "1";
  }

  if ($("#valueOfR").val() == "falso") {
    variables[5] = "0";
  } else {
    variables[5] = "1";
  }

  if ($("#valueOfS").val() == "falso") {
    variables[7] = "0";
  } else {
    variables[7] = "1";
  }

  if($('#valueOfT').val()=="falso"){
    variables[9]="f"
  }else{
      variables[9]="v";
  }

  if($('#valueOfX').val()=="falso"){
    variables[11]="f"
  }else{
      variables[11]="v";
  }
}

//retornar variable
function retornar(num, statement) {
  var anterior = $("#valores").val(); //obtiene lo que hay en el campo de texto de la calculadora
  document.getElementById("valores").value = anterior + num; //adiciona el elemento presionado
  finalStatement += statement;
}

//Abrir Pdf en otra ventana
function Download() {
  // Especifica la ruta al archivo PDF
  var url = "Manual/LogicApp.pdf";
  
  // Abre el archivo en una nueva pestaña y descarga el archivo
  window.open(url, '_blank').focus().setAttribute('download', 'LogicApp.pdf');
}

//eliminar ultimo valor DEL
function eliminar() {
  var anterior = $("#valores").val();
  var nuevovalor = anterior.substring(0, anterior.length - 1);
  finalStatement = finalStatement.substring(0, finalStatement.length - 1);
  document.getElementById("valores").value = nuevovalor;
}

//eliminartodo
function limpiarTextField() {
  document.getElementById("valores").value = "";
  document.getElementById("resultado").value = "";
  var texts = document.getElementsByName("value");
  for (var i = 0; i < texts.length; i++) {
    texts[i].value = "";
  }
  finalStatement = "";
}

//cerrarVentana
function cerrarTabla() {
  $(".modal").css("opacity", "0");
  $(".modal").css("top", "-20%");
  $(".oscuro").css("display", "none");
}

function crearTabla() {
  if (tableStatement !== "" && tableStatement.length !== 0) {
    answers = new Array();
    var valor = "";
    var n = calcularCantVariables(tableStatement);
    var rows = Math.pow(2, n);

    ventana = "";
    ventana +=
      "<label><h5>Tabla de Verdad</h5></label>";
    ventana += '<table border="0" class="table">';
    
    ventana += "<thead>";
    ventana += "<tr>";
    for (var i = 0; i < verdades.length; i++) {
      if (verdades[i]) {
        ventana +=
          "<th><label>" + proposiciones[i].toUpperCase() + "</label></th>";
      }
    }
    if (tableStatement.length === 1) {
      ventana +=
        "<th><label>" + proposicionesSimples[0].toUpperCase() + "</label></th>";
    } else {
      generarEncabezado();
      for (var pos = 0; pos < array.length; pos++) {
        ventana += "<th><label>" + array[pos] + "</label></th>";
      }
    }
    ventana += "</tr>";
    ventana += "</thead>";
    for (var idx = 0; idx < rows; idx++) {
      ventana += "<tr>";
      var k = 0;
      for (var j = n - 1; j >= 0; j -= 1) {
        var value = parseInt(idx / parseInt(Math.pow(2, j))) % 2;
        if (value === 1) valor = "1";
        else valor = "0";
        ventana += "<td><label>" + valor.toUpperCase() + "</label></td>";
        cambiarValor(proposicionesSimples[k], valor);
        k++;
      }
      var resultado = new Calcular().calcularTabla();
      if (answers.length > 0) {
        for (var index = 0; index < answers.length; index++) {
          ventana +=
            "<td><label>" + answers[index].toUpperCase() + "</label></td>";
        }
        tipo_tabla.push(answers[answers.length - 1]);
      } else {
        ventana += "<td><label>" + resultado.toUpperCase() + "</label></td>";
        tipo_tabla.push(resultado);
      }
      ventana += "</tr>";
      answers = new Array();
    }
    ventana += "</table>";
    var tipo = tipoTabla();
    ventana +=
      '<div ALIGN="center"><label>Es una tabla de <strong>' +
      tipo +
      "</strong></label></div>";
    $("#tabla").css("top", "50%");
    $("#tabla").css("opacity", "1");

    //$("#modalTabla").modal("show");
    $("#contenedorTabla").html(ventana);

    array = new Array();
    proposicionesSimples = new Array();
    verdades = [false, false, false, false];
  } else alert("No hay expresión guardada");
}

function calcularCantVariables(statement) {
  var props = statement;
  for (var i = 0; i < props.length; i++) {
    switch (props[i]) {
      case "p":
        verdades[0] = true;
        break;
      case "q":
        verdades[1] = true;
        break;
      case "r":
        verdades[2] = true;
        break;
      case "s":
        verdades[3] = true;
        break;
      case "t":
        verdades[4] = true;
        break;
      case "x":
        verdades[5] = true;
        break;
    }
  }
  var cantValues = 0;
  for (var idx = 0; idx < verdades.length; idx++) {
    if (verdades[idx]) {
      switch (idx) {
        case 0:
          proposicionesSimples.push("p");
          break;
        case 1:
          proposicionesSimples.push("q");
          break;
        case 2:
          proposicionesSimples.push("r");
          break;
        case 3:
          proposicionesSimples.push("s");
          break;
        case 4:
          proposicionesSimples.push("t");
          break;
        case 5:
          proposicionesSimples.push("x");
          break;
      }
      cantValues++;
    }
  }
  return cantValues;
}

function cambiarValor(proposicion, valor) {
  for (var i = 0; i < variables.length; i++) {
    if (variables[i] === proposicion) {
      variables[i + 1] = valor;
      break;
    }
  }
}

function tipoTabla() {
  var TAUTOLOGICA = 0;
  var CONTRADICCION = 0;
  for (var i = 0; i < tipo_tabla.length; i++) {
    if (tipo_tabla[i] === "1") TAUTOLOGICA++;
    else CONTRADICCION++;
  }
  var tipo = "";
  if (TAUTOLOGICA === tipo_tabla.length) tipo = "TAUTOLOGÍA";
  else if (CONTRADICCION === tipo_tabla.length) tipo = "CONTRADICCIÓN";
  else tipo = "CONTINGENCIA";
  tipo_tabla = new Array();
  return tipo;
}

function generarEncabezado() {
  var expresion = tableStatement;
  if (expresion.length !== 0) {
    var aux = expresion;
    var e = new Expresion(aux);
    var exp = e.CompletoPrefija();
    for (var idx = 0; idx < exp.length; idx++) {
      if (exp[idx] === "!") exp.splice(idx + 1, 0, "1");
    }
    if (exp.length !== 0) {
      var ar = new ArbolExpresion();
      ar.ArbolExpresion(exp);
      ar.getExpresion();
    }
  }
}

//Logica
//Clase ArbolExpresion
function ArbolExpresion() {
  this.Raiz;

  this.Evaluador = function () {
    return this.Evaluar(this.Raiz);
  };

  this.ArbolExpresion = function (Exp) {
    var aux = Exp[0];
    var q = new Nodo(aux.toString());
    var op = new Nodo(aux.toString());
    var p = new Pila();
    var antesOperando = false;
    this.Raiz = q;
    for (var i = 1; i < Exp.length; i++) {
      var aux2 = Exp[i];
      op = new Nodo(aux2.toString());
      if (antesOperando) {
        q = p.sacar();
        q.setHD(op);
      } else {
        q.setHI(op);
        p.poner(q);
      }
      q = op;
      antesOperando = !this.operador(Exp[i]);
    }
  };

  this.Hoja = function (nodo) {
    return nodo.getHI() === null && nodo.getHD() === null;
  };

  this.operador = function (c) {
    var operadores = ["&", "+", ">", "|", "!", "<"];
    var existe = false;
    var aux = c.toString().charAt(0);
    for (var i = 0; i < operadores.length && !existe; i++) {
      if (aux === operadores[i]) existe = true;
    }
    return existe;
  };

  this.Evaluar = function (R) {
    var res = "";
    if (R === null) return res;
    else {
      if (this.Hoja(R)) {
        var aux = R.getData();
        res = aux;
      } else {
        var op = R.getData().charAt(0);
        var vizq = this.Evaluar(R.getHI());
        var vder = this.Evaluar(R.getHD());
        switch (op) {
          case "&":
            res = vizq === "1" && vder === "1" ? "1" : "0";
            break;
          case "|":
            res = vizq === "0" && vder === "0" ? "0" : "1";
            break;
          case ">":
            res = vizq === "1" && vder === "0" ? "0" : "1";
            break;
          case "+":
            res = !(vizq === vder) ? "1" : "0";
            break;
          case "<":
            res = vizq === vder ? "1" : "0";
            break;
          case "!":
            res = vder === "0" ? "1" : "0";
            break;
          default:
            break;
        }
        answers.push(res);
      }
    }
    return res;
  };

  this.getExpresion = function () {
    this.getEncabezado(this.Raiz);
  };

  this.getEncabezado = function (R) {
    var res = "";
    if (R === null) return res;
    else {
      if (this.Hoja(R)) {
        var aux = R.getData();
        res = aux;
      } else {
        var op = R.getData().charAt(0);
        var vizq = this.getEncabezado(R.getHI());
        var vder = this.getEncabezado(R.getHD());
        switch (op) {
          case "&":
            op = "ʌ";
            break;
          case "|":
            op = "∨";
            break;
          case ">":
            op = "→";
            break;
          case "<":
            op = "↔";
            break;
        }
        if (op === "!") res = "(¬" + vder.toUpperCase() + ")";
        else res = "(" + vizq.toUpperCase() + op + vder.toUpperCase() + ")";
        array.push(res);
      }
    }
    return res;
  };
}

//Clase Calcular
function Calcular() {
  this.calcular = function () {
    var temp = finalStatement;
    var resultado = "";
    var validacion = new Comprobador();
    var vars = validacion.Scan(temp);
    if (vars !== "wrong") {
      var expresion = "";
      for (var i = 0; i < vars.length; i++) {
        switch (vars[i]) {
          case "p":
            expresion += variables[1];
            break;
          case "q":
            expresion += variables[3];
            break;
          case "r":
            expresion += variables[5];
            break;
          case "s":
            expresion += variables[7];
            break;
          case "t":
              expresion+=variables[9];
              break;
          case "x":
              expresion+=variables[11];
              break;
          default:
            expresion += vars[i];
            break;
        }
      }
      if (expresion.length !== 0) {
        var aux = expresion;
        var e = new Expresion(aux);
        var exp = e.CompletoPrefija();
        for (var idx = 0; idx < exp.length; idx++) {
          if (exp[idx] === "!") exp.splice(idx + 1, 0, "0");
        }
        if (exp.length !== 0) {
          var ar = new ArbolExpresion();
          ar.ArbolExpresion(exp);
          resultado = ar.Evaluador();
        }
      }
      if (resultado !== "") {
        var word = document.getElementById("valores").value;
        if (word.length < 30) {
          document.getElementById("resultado").value =
            word + " ≡ " + resultado.toUpperCase();
        } else
          document.getElementById("resultado").value =
            "Expresión ≡ " + resultado.toUpperCase();
      } else {
        document.getElementById("resultado").value = "";
        alert("No hay ninguna expresión");
      }
      document.getElementById("valores").value = "";
      tableStatement = finalStatement;
      finalStatement = "";
    }
    return resultado;
  };

  this.calcularTabla = function () {
    var vars = tableStatement;
    var expresion = "";
    for (var i = 0; i < vars.length; i++) {
      switch (vars[i]) {
        case "p":
          expresion += variables[1];
          break;
        case "q":
          expresion += variables[3];
          break;
        case "r":
          expresion += variables[5];
          break;
        case "s":
          expresion += variables[7];
          break;
        case "t":
          expresion+=variables[9];
          break;
        case "x":
          expresion+=variables[11];
          break;
        default:
          expresion += vars[i];
          break;
      }
    }
    var resultado = "";
    if (expresion.length !== 0) {
      var aux = expresion;
      var e = new Expresion(aux);
      var exp = e.CompletoPrefija();
      for (var idx = 0; idx < exp.length; idx++) {
        if (exp[idx] === "!") exp.splice(idx + 1, 0, "1");
      }
      if (exp.length !== 0) {
        var ar = new ArbolExpresion();
        ar.ArbolExpresion(exp);
        resultado = ar.Evaluador();
      }
    }
    return resultado;
  };
}

//Clase Expresion
function Expresion(expr) {
  this.Exp = expr;

  this.getExpresion = function () {
    return this.Exp;
  };

  this.CompletoPrefija = function () {
    var sep = this.Separar();
    var completo = new Array();
    var n = sep.length - 1;
    var j = 0;
    var pfija = this.preFija();
    for (var i = 0; i < pfija.length && j <= n; i++) {
      var e1 = pfija[i];
      if (this.isLetterUpper(e1)) {
        completo.push(sep[j]);
        j++;
      } else completo.push(e1);
    }
    return completo;
  };

  this.preFija = function () {
    var c;
    var d;
    var e;
    var i;
    var prioridadCima;
    var prioridadOper;
    var expPre = new Array();
    var aux = new Pila();
    var med = new Pila();
    var pre = new Pila();
    var Expr = this.Clasica();

    for (i = 0; i < Expr.length; i++) {
      aux.poner(Expr.charAt(i));
    }
    while (!aux.vacia()) {
      c = aux.sacar();
      if (c === ")") {
        med.poner(c);
      } else {
        if (c === "(") {
          e = med.cima();
          while (e !== ")") {
            c = med.sacar();
            pre.poner(c);
            e = med.cima();
          }
          med.sacar();
        } else if (this.operador(c)) {
          e = med.cima();
          prioridadCima = this.prioridad(e);
          prioridadOper = this.prioridad(c);
          while (!med.vacia() && prioridadOper < prioridadCima) {
            d = med.sacar();
            pre.poner(d);
            e = med.cima();
            prioridadCima = this.prioridad(e);
          }
          med.poner(c);
        } else pre.poner(c);
      }
    }

    while (!med.vacia()) {
      c = med.sacar();
      pre.poner(c);
    }
    while (!pre.vacia()) {
      c = pre.sacar();
      expPre.push(c);
    }
    return expPre;
  };

  this.operador = function (c) {
    var operadores = ["&", "+", ">", "|", "!", "<"];
    var op = false;
    for (var i = 0; i < operadores.length && !op; i++) {
      if (operadores[i] === c) op = true;
    }
    return op;
  };

  this.prioridad = function (op) {
    var r = 4;
    if (op !== null) {
      switch (op) {
        case ")": {
          r = 0;
          break;
        }
        case "(": {
          r = 0;
          break;
        }
        case "&": {
          r = 1;
          break;
        }
        case "|": {
          r = 1;
          break;
        }
        case ">": {
          r = 1;
          break;
        }
        case "<": {
          r = 1;
          break;
        }
        case "+": {
          r = 1;
          break;
        }
        case "!": {
          r = 2;
          break;
        }
      }
    }
    return r;
  };

  this.Separar = function () {
    var i = 0;
    var n = this.Exp.length - 1;
    var aux1;
    var aux2 = this.Exp;
    var e = new Array();
    while (i <= n) {
      while (i <= n && !this.isLetter(aux2.charAt(i))) i++;
      aux1 = "";
      while (i <= n && this.isLetter(aux2.charAt(i))) {
        aux1 = aux1 + aux2.charAt(i);
        i++;
      }
      e.push(aux1);
    }
    return e;
  };

  this.isLetter = function (texto) {
    var letras = "abcdefghyjklmnñopqrstuvwxyz";
    for (var i = 0; i < texto.length; i++) {
      if (letras.indexOf(texto.charAt(i), 0) !== -1) {
        return true;
      }
    }
    return false;
  };

  this.isLetterUpper = function (texto) {
    var letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    for (var i = 0; i < texto.length; i++) {
      if (letras.indexOf(texto.charAt(i), 0) !== -1) {
        return true;
      }
    }
    return false;
  };

  this.Valores = function () {
    var a = this.Separar();
    var aux = "[ ";
    for (var i = 0; i < a.length; i++) {
      if (i + 1 === a.length) aux = aux + a[i].toString();
      else aux = aux + a[i].toString() + " ";
    }
    aux = aux + " ]";
    return aux;
  };

  this.Clasica = function () {
    var Cara = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var p = -1;
    var aux = this.Exp;
    var n = aux.length - 1;
    var i = 0;
    var aux1 = "";
    while (i <= n) {
      while (i <= n && !this.isLetter(aux.charAt(i))) {
        aux1 = aux1 + aux.charAt(i);
        i++;
      }
      var sw = false;
      while (i <= n && this.isLetter(aux.charAt(i))) {
        if (sw === false) {
          sw = true;
          p++;
        }
        i++;
      }
      if (p !== -1 && sw) aux1 = aux1 + Cara.charAt(p);
    }
    return aux1;
  };
}

//Clase nodo
function Nodo(dat) {
  this.HI = null;
  this.data = dat;
  this.HD = null;

  this.setHI = function (Hizq) {
    this.HI = Hizq;
  };

  this.setHD = function (Hder) {
    this.HD = Hder;
  };

  this.getData = function () {
    return this.data;
  };

  this.getHI = function () {
    return this.HI;
  };

  this.getHD = function () {
    return this.HD;
  };
}

//clase Pila
function Pila() {
  this.v = new Array();
  this.tope = -1;
  this.max = 100;

  this.Pila = function (max) {
    this.max = max;
    this.tope = -1;
  };

  this.vacia = function () {
    return this.tope === -1;
  };

  this.llena = function () {
    return this.tope === this.max - 1;
  };

  this.poner = function (dato) {
    if (!this.llena()) {
      var pos = this.tope++;
      this.v[pos] = dato;
    }
  };

  this.sacar = function () {
    var dato = null;
    if (!this.vacia()) {
      this.tope--;
      dato = this.v[this.tope];
    }
    return dato;
  };

  this.cima = function () {
    if (!this.vacia()) {
      var pos = this.tope - 1;
      return this.v[pos];
    } else return null;
  };
}

//clase comprobador
function Comprobador() {
  this.Scan = function (Exp) {
    var x = this.limpiarEspacios(Exp);
    if (this.okParentesis(x)) {
      if (this.okOperadores(x)) {
        if (this.okProposiciones(x)) return x;
        else alert("Verifique la expresión, hay dos proposiciones juntas.");
      } else alert("Verifique la expresión, hay operadores juntos.");
    } else alert("Verifique los parentesis.");
    return "wrong";
  };
  this.limpiarEspacios = function (Exp) {
    var aux = "";
    for (var i = 0; i < Exp.length; i++) {
      if (Exp.charAt(i) !== " ") aux = aux + Exp.charAt(i);
    }
    return aux;
  };
  this.okParentesis = function (Exp) {
    var p = new Pila();
    for (var i = 0; i < Exp.length; i++) {
      if (Exp.charAt(i) === "(") p.poner(Exp.charAt(i));
      else {
        if (Exp.charAt(i) === ")") {
          if (p.vacia()) return false;
          else p.sacar();
        }
      }
    }
    return p.vacia() === true;
  };
  this.okOperadores = function (Exp1) {
    var Exp = this.limpiarParentesis(Exp1);
    if (
      this.Operador(Exp.charAt(0)) ||
      this.Operador(Exp.charAt(Exp.length - 1))
    )
      return false;
    else {
      var sw = true;
      for (var i = 1; i < Exp.length - 1; i++) {
        if (this.Operador(Exp.charAt(i)) && this.Operador(Exp.charAt(i + 1)))
          return false;
      }
      return sw;
    }
  };
  this.okProposiciones = function (Exp1) {
    var Exp = this.limpiarParentesis(Exp1);
    var sw = true;
    for (var i = 0; i < Exp.length - 1; i++) {
      if (
        this.Proposicion(Exp.charAt(i)) &&
        this.Proposicion(Exp.charAt(i + 1))
      )
        return false;
    }
    return sw;
  };
  this.limpiarParentesis = function (Exp) {
    var aux = "";
    for (var i = 0; i < Exp.length; i++) {
      if (Exp.charAt(i) !== "(" && Exp.charAt(i) !== ")")
        aux = aux + Exp.charAt(i);
    }
    return aux;
  };
  this.Operador = function (x) {
    var sw = false;
    switch (x) {
      case "&":
        sw = true;
        break;
      case "+":
        sw = true;
        break;
      case ">":
        sw = true;
        break;
      case "<":
        sw = true;
        break;
      case "|":
        sw = true;
        break;
    }
    return sw;
  };
  this.Proposicion = function (x) {
    var sw = false;
    switch (x) {
      case "p":
        sw = true;
        break;
      case "q":
        sw = true;
        break;
      case "r":
        sw = true;
        break;
      case "s":
        sw = true;
        break;
      case "t":
        sw = true;
        break;
      case "x":
        sw = true;
        break;
    }
    return sw;
  };
}