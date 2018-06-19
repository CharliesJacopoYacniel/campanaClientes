import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import './main.html';
import 'select2';
import 'select2/dist/css/select2.css';
import Inputmask from "inputmask";
import { $ } from 'meteor/jquery';

//import 'bootstrap';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap-theme.css';

import '../import/ui/components/clienteNoExiste.html';
import '../import/ui/components/clienteNoSePermite.html';
import '../import/ui/components/clienteExiste.html';
import '../import/ui/components/clienteActualizado.html';
import '../import/ui/components/formulario.html';
//templates de las secuencias
import '../import/ui/secuencias/nombre.html';
import '../import/ui/secuencias/municipio.html';
import '../import/ui/secuencias/domicilio.html';
import '../import/ui/secuencias/departamento.html';
import '../import/ui/secuencias/correo.html';
import '../import/ui/secuencias/terminos.html';
import '../import/ui/secuencias/noCliente.html';
import '../import/ui/secuencias/aceptoContacto.html';
import '../import/ui/secuencias/contactoModal.html';

// Modal.allowMultiple = true;
Meteor.startup(function() {
  reCAPTCHA.config({
     publickey: '6Ldcsl0UAAAAAC9CyICwrwpI2CGjxi3DEdECcsy4',
     theme: 'dark',
     type: 'image',
     size: 'normal',
    hl:'es'// optional display language
  });
});
// Met
////////////////////////////////////////////ACCESO CLIENTES////////////////////////////////////
$.validator.addMethod("valueNotEquals", function(value, element, arg){
  return arg != element.value; 
}, "Value must not equal arg.");
Template.acessoCliente.onCreated(function(){
  $(document).ready(function(){
    let selector = document.getElementById("valueID");
    Inputmask({mask:"9999-9999-99999", placeholder:"0000-0000-00000", showMaskOnHover: true}).mask(selector);   
  });
});
Template.acessoCliente.helpers({});
Template.acessoCliente.onRendered(function(){
$("#formulario").validate({
      rules: {
        valueID:{
          required:true,
          // pattern:/^[0-9][0-9]{15}$/,
        },
      } ,
      messages: {
        valueID:{
          required:"Ingrese su identificación",
          // pattern:"numero de Identidad no valido",
        }
      }
  });
  var current = 0,
      slides = document.querySelectorAll(".prizeImage img");

  setInterval(function() {
    for (var i = 0; i < slides.length; i++) {
      slides[i].style.opacity = 0;
    }
    current = (current != slides.length - 1) ? current + 1 : 0;
    slides[current].style.opacity = 1;
  }, 5000);
   
});

Template.acessoCliente.events({
  'submit .formulario' (event, instance){
    event.preventDefault();//QUITAR ESTA LINEA LUEGO
    let id=event.target.valueID.value;
    id=id.replace(/[-]/gi,"");
    console.log(id);
    // let id_ejemplo=event.target.ejemplo.value;
    // let eje=event.target.ejemplo;
    // let indexEjemplo=eje.selectedIndex;
    // let ejemplo = eje.options[indexEjemplo].text;
    // console.log(id_ejemplo+" "+ejemplo);
    Session.set("idCliente",id.trim());//INICIALIZANDO VARIABLE
    this.foundUser = new ReactiveVar([]);
    var cuerpo="<cam:wsaccesoclientes.Execute>"+
                      "<cam:Identidad>"+id.trim()+"</cam:Identidad>"
              +"</cam:wsaccesoclientes.Execute>";
    Meteor.call('wsaccesoclientes',{ body : cuerpo },(err, res) =>{
      if (err){
        console.log(err);
      } else {
        this.foundUser.set(res);
      }
      var datosWS =this.foundUser.get();
      if (datosWS.envelope){
        console.log(datosWS.envelope.body[0].wsaccesoclientesexecuteresponse[0].sdtaccesoclientes[0]);
        datosWS=datosWS.envelope.body[0].wsaccesoclientesexecuteresponse[0].sdtaccesoclientes[0];
        let existe=datosWS.existe[0];
        let nombreCliente=datosWS.cusfna[0];
        let apellidoCliente=datosWS.cusln1[0];
        let ibsCliente=datosWS.cumstcuscun[0];
        let flag3=datosWS.empleado[0];
        let fatca=datosWS.fatca[0];
        let Cusunr=datosWS.cusunr[0];
        // let fatca='S';
        // let nombreCliente='Pedro Prueba';
        // let existe='1';
        // let ibsCliente='2089291';
        // let flag3='3';
        Session.set("ibs",ibsCliente);
        Session.set("Cusunr",Cusunr);
        // console.log(Session.get("Cusunr"));
        Session.set("flagEmpleado",flag3);
        //  1   cliente no ha sido actualizado
        //  2  no existe como cliente
        //  3  que ya fue actualizado 
        // console.log(existe);
        // console.log(nombreCliente);
        var params = {};
        var queryParams = {
           name:nombreCliente,
           last:apellidoCliente,
        };
          if(fatca=='S'){
            console.log("No permitir Actualizar");
            FlowRouter.go('/clienteNoSePermite', params, queryParams);
          }else{
            if(existe=='1'){
              console.log("cliente NO ha sido Actualizado aun");
              FlowRouter.go('/clienteExiste', params, queryParams);
            }
            if(existe=='2'){
              console.log("cliente NO EXISTE");
              FlowRouter.go('/clienteNoExiste');
            }
            if (existe=='3'){
              console.log("cliente ACTUALIZADO");
              FlowRouter.go('/clienteActualizado', params, queryParams);
            }
          }
        }
    });
  },
  'click #pasaporteSI' (event){
    console.log('colocar maskara pasaporte');
    var selector = document.getElementById("valueID");
    $(document).ready(function(){
      document.getElementById("valueID").setAttribute("maxlength",10);
      document.getElementById("valueID").setAttribute("placeholder","0000-00000");
      document.getElementById("valueID").setAttribute("value","");
      $(selector).inputmask({mask:"****-*****", placeholder:"0000-00000", showMaskOnHover: true});
      });
  },
  'click #pasaporteNO' (event){
    console.log('colocar maskara identidad');
    var selector = document.getElementById("valueID");
    $(document).ready(function(){
      document.getElementById("valueID").setAttribute("maxlength",15);
      document.getElementById("valueID").setAttribute("placeholder","0000-0000-00000");
      document.getElementById("valueID").setAttribute("value","");
        Inputmask({mask:"9999-9999-99999", placeholder:"0000-0000-00000", showMaskOnHover: true}).mask(selector);  
      });
    },
});
////////////////////////////////////////////CLIENTE EXISTE////////////////////////////////////
Template.clienteExiste.onCreated(function(){
});
Template.clienteExiste.helpers({
  getIdCliente(){
    return  Session.get('idCliente'); 
  },
  getName(){
    return FlowRouter.getQueryParam("name");
  },
  getLast(){
    return FlowRouter.getQueryParam("last");
  },
});
Template.clienteExiste.events({
  'click .iniciarForm' (){
    FlowRouter.go('/formulario');
  },
  'click .iniciarSecuencia' (){
    FlowRouter.go('/nombre');
    console.log('iniciar secuancia');
  }
});
////////////////////////////////////////////CLIENTE  NO  EXISTE////////////////////////////////////
Template.clienteNoExiste.events({
  'click .regresar' (){
    console.log('no enviar datos');
    FlowRouter.go('/');
  },
  'submit .siguienteNoExiste' (event){
    event.preventDefault();
    // console.log(event.target);
    let pnombre=event.target.nombre1.value;
    let telefono=event.target.telefono.value;
    let movil=event.target.movil.value;
    let emailP=event.target.emailP.value;
        pnombre=pnombre.trim();
        // movil=movil.replace(/[-]/gi,"");
        // telefono=telefono.replace(/[-]/gi,"");
        emailP=emailP.trim();
    console.log(pnombre);
    console.log(telefono);
    console.log(movil);
    console.log(emailP);
    // let wsnocliente = new ReactiveVar([]);
    var cuerpo="<cam:wsNocliente.Execute>"
                  +"<cam:Idncli>"+Session.get("idCliente")+"</cam:Idncli>"
                  +"<cam:Rtenusurtenom>"+pnombre+"</cam:Rtenusurtenom>"
                  +"<cam:Rtenum>"+telefono+"</cam:Rtenum>"
                  +"<cam:Rtenumc>"+movil+"</cam:Rtenumc>"
                  +"<cam:Rteema>"+emailP+"</cam:Rteema>"
              +"</cam:wsNocliente.Execute>";
    Meteor.call('wsnocliente',{body:cuerpo},(err,res)=>{
        if (err){
          console.log(err);
        } else {
        var datosWS =res;
        if (datosWS.envelope){
          datosWS=datosWS.envelope.body[0].wsnoclienteexecuteresponse[0]; 
          let flag=datosWS.flage[0];
          console.log(datosWS);
          console.log(flag);
          if(flag=='S'){
           FlowRouter.go('/noCliente');
          }
          if(flag=='N'){
            FlowRouter.go('/noCliente');
           }
        }
        }
      });
  },
});
Template.clienteNoExiste.onCreated(function(){
  $(document).ready(function(){
    var telefono = document.getElementById("telefono");
    var movil = document.getElementById("movil");
    var nombre1 = document.getElementById("nombre1");
    Inputmask({ regex: "[3|8|9][0-9]{7}", mask:"", placeholder:"00000000"}).mask(movil);
    Inputmask({ regex: "[2][0-9]{7}", mask:"", placeholder:"00000000"}).mask(telefono);
    Inputmask({ regex: "[a-zA-ZáéíóúüÁÉÍÓÚñÑ ´]{50}", placeholder:"", showMaskOnHover: true}).mask(nombre1);
  });
});
Template.clienteNoExiste.helpers({});
Template.clienteNoExiste.onRendered(function(){
  
  $("#siguienteNoExiste").validate({
    rules: {
      nombre1:{
        required:true,
        // pattern: /[a-zA-ZáéíóúüÁÉÍÓÚñÑ ´]{50}/,
      },
      telefono:{
        required:false,
        pattern:/^[2][0-9]{7}$/,
      },
      movil:{
        required:true,
        // pattern:/^[3|8|9][0-9]{7}$/,
      },
      emailP:{
        required:false,
        pattern:/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
      },
    } ,
    messages: {
      nombre1:{
        required:"Ingresar nombre",
        // pattern:"No valido",
      },
      telefono:{
        // required:"Ingresar telefono",
        // pattern:"No valido",
      },
      movil:{
        required:"Ingresar movil",
        pattern:"No valido",
      },
      emailP:{
        // required:"Ingresar Email",
        pattern:"No valido",
      },
    }
});  
});
////////////////////////////////////////////CLIENTE  ACTUALIZADO////////////////////////////////////
Template.clienteActualizado.onCreated(function(){
  this.wsnumboleto = new ReactiveVar([]);
  let id=Session.get('idCliente');
  // Session.set("idCliente",id);
  let cuerpo="<cam:wsnumboleto.Execute>"
                +"<cam:Idncli>"+id+"</cam:Idncli>"
            +"</cam:wsnumboleto.Execute>";
  Meteor.call('wsnumboleto',{ body:cuerpo },(err, res) =>{
      if (err){
        console.log(err);
      } else {
        this.wsnumboleto.set(res); 
      }
    });
});
Template.clienteActualizado.events({
  'click .Aceptar' (){
    FlowRouter.go('/');
  }
});

Template.clienteActualizado.helpers({
  wsnumboleto(){
    var datosWS =Template.instance().wsnumboleto.get();
    if (datosWS.envelope) {
      // console.log(datosWS.envelope.body[0].wsnumboletoexecuteresponse[0]);
      let exite=datosWS.envelope.body[0].wsnumboletoexecuteresponse[0].exite;
      if (exite==1){
        datosWS=datosWS.envelope.body[0].wsnumboletoexecuteresponse[0]; 
        // console.log(datosWS);  
      }
    }
  return datosWS.codnum;
  },
  getName(){
    return FlowRouter.getQueryParam("name");
  },
  getLast(){
    return FlowRouter.getQueryParam("last");
  },
});
////////////////////////////////////////////CLIENTE NO SE  PERMITE ACTUALIZAR////////////////////////////////////
Template.clienteNoSePermite.helpers({
  getName(){
    return FlowRouter.getQueryParam("name");
  },
  getLast(){
    return FlowRouter.getQueryParam("last");
  },
});

Template.clienteNoSePermite.events({
  'click .Aceptar' (){
    FlowRouter.go('/');
  }
});

//===========================-----------------------//////CODIGO DE SECUENCIA///////////------------------------======================================
// fomulario1  Nombre completo , profesion y ocupacion
let wsprofesion = new ReactiveVar([]);
let wsocupacion = new ReactiveVar([]);

Template.nombre.onCreated(function(){
     //=============================================wsaccesoclientes=================================================
     let id=Session.get('idCliente');
     this.foundUser = new ReactiveVar([]);
     var cuerpo="<cam:wsaccesoclientes.Execute>"+
                       "<cam:Identidad>"+id+"</cam:Identidad>"
               +"</cam:wsaccesoclientes.Execute>";
     Meteor.call('wsaccesoclientes',{ body : cuerpo },(err, res) =>{
       if (err){
         console.log(err);
       } else {
         this.foundUser.set(res);
       } 
     });
     //=============================================wsProfesion=================================================   
       var cuerpo="<cam:wsProfesion.Execute>"
                       +"<cam:Dscr></cam:Dscr>"
                   +"</cam:wsProfesion.Execute>";
       Meteor.call('wsprofesion',{body:cuerpo},  (err, res) =>{
           if (err){
             console.log(err);
           } else {
             let datosWS=res.envelope.body[0].wsprofesionexecuteresponse[0].sdtprofesion[0].sdtprofesionsdtprofesionitem;
             console.log(datosWS);
            wsprofesion.set(datosWS); 
           }
         });
          //=============================================wsocupacion=================================================
         var cuerpo="<cam:wsOcupacion.Execute>"
                        +"<cam:Ocupacion></cam:Ocupacion>"
                  +"</cam:wsOcupacion.Execute>";
        Meteor.call('wsocupacion',{ body:cuerpo },  (err, res)=> {
          if (err){
          console.log(err);
          } else {
          let datosWS =res.envelope.body[0].wsocupacionexecuteresponse[0].sdtocupacion[0].sdtocupacionsdtocupacionitem;
          wsocupacion.set(datosWS);
          }
        });
    
});

Template.nombre.onRendered(function(){
  $(document).ready(function(){
    //========================================================validacion de profesion====================================
    var $select =  $('#profesion').select2({
      allowClear: false
    });
    // Aplicando la validacion del select cada vez que cambie
    $select.on('change', function() {
      $(this).trigger('blur');
    });
   //Permitiendo la validacion de campos ocultos
    $('#siguienteNombre').validate({
      ignore: '.select2-input, .select2-focusser',
      submitHandler: function(form) {
        alert("enviado")
      },
      errorPlacement: function(error, element) {
        $(element).next().append(error);
      }
    });
    // agregando la validacion del select ya que no tiene un atributo name el plugin
    $select.rules('add', {
      valueNotEquals:"nulo",
      // required: true,
      messages: {
        // required: "Es necesario que seleccione una opción"
        valueNotEquals: "Seleccione una opción"
      }
    });
 //========================================================validacion de ocupacion====================================
    var $select =  $('#ocupacion').select2({
      // placeholder: 'Seleccione una ocupación',
      allowClear: false
    });
    // Aplicando la validacion del select cada vez que cambie
    $select.on('change', function() {
      $(this).trigger('blur');
    });
    //Permitiendo la validacion de campos ocultos
    $('#siguienteNombre').validate({
      ignore: '.select2-input, .select2-focusser',
      submitHandler: function(form) {
        alert("enviado")
      },
      errorPlacement: function(error, element) {
        $(element).next().append(error);
      }
    });
    // agregando la validacion del select ya que no tiene un atributo name el plugin
    $select.rules('add', {
      valueNotEquals:"nulo",
      // required: true,
      messages: {
        // required: "Es necesario que seleccione una opción"
        valueNotEquals: "Seleccione una opción"
      }
    });
  });
  $("#siguienteNombre").validate({
    rules: {
      nombre1:{
        required:true,
        pattern: /^[a-zA-ZáéíïóúüÁÉÍÏÓÚÜñÑ\'\"\s]+$/,
      },
      nombre2:{
        required:false,
        pattern: /^[a-zA-ZáéíïóúüÁÉÍÏÓÚÜñÑ\'\"\s]+$/,
      },
      apellido1:{
        required:true,
        pattern: /^[a-zA-ZáéíïóúüÁÉÍÏÓÚÜñÑ\'\"\s]+$/,
      },
      apellido2:{
        required:false,
        pattern: /^[a-zA-ZáéíïóúüÁÉÍÏÓÚÜñÑ\'\"\s]+$/,
      },
    } ,
    messages: {
      nombre1:{
        required:"Verifique primer nombre",
        pattern:"No valido",
      },
      nombre2:{
        pattern:"No valido",
      },
      apellido1:{
        required:"Verifique su primer apellido",
        pattern:"No valido",
      },
      apellido2:{
        // required:"Verifique su segundo apellido",
        pattern:"No valido",
      },
    }
 });    
 });
Template.nombre.helpers({
  wsaccesoclientes(){
    var datosWS =Template.instance().foundUser.get();
      if (datosWS.envelope) {
        datosWS=datosWS.envelope.body[0].wsaccesoclientesexecuteresponse[0].sdtaccesoclientes[0];
        // console.log(datosWS);
      }
  return datosWS;
  },
  //=============================================wsocupacion=================================================
  wsocupacion(){
  return wsocupacion.get();
  },
  // //==========================================wsprofesion====================================================
  wsprofesion(){
    return wsprofesion.get();
  },
 
});
Template.nombre.events({
  'submit .siguienteNombre'(event, instance){
     event.preventDefault();
     let nombre1=event.target.nombre1.value;
     let nombre2=event.target.nombre1.value;
     let apellido1=event.target.apellido1.value;
     let apellido2=event.target.apellido2.value;

     let idProfesion=event.target.profesion.value;
     let prof=event.target.profesion;
     let indexProf=prof.selectedIndex;
     let profesion = prof.options[indexProf].text;
     
     // let var=event.target.ocupacion;
     let idocupacion=event.target.ocupacion.value;
     let ocup=event.target.ocupacion;
     let indexOcupa=ocup.selectedIndex;
     let ocupacion = ocup.options[indexOcupa].text;
    
     Session.set("nombre1",nombre1);
     Session.set("nombre2",nombre1);
     Session.set("apellido1",apellido1);
     Session.set("apellido2",apellido2);

     Session.set("idProfesion",idProfesion);
     Session.set("profesion",profesion);
     Session.set("idocupacion",idocupacion);
     Session.set("ocupacion",ocupacion);
     console.log(idProfesion+" "+profesion);
     console.log(idocupacion+" "+ocupacion);
     FlowRouter.go('/municipio');
  },
  'click .atras'(event){
    FlowRouter.go('/clienteExiste');
  },
});
//==============================================================================================

// fomulario3  municipio,ciudad,barrio
let wbmunicipio = new ReactiveVar([]);
let wsciudada = new ReactiveVar([]);
let awsbarriocolonia = new ReactiveVar([]);

Template.municipio.onCreated(function(){});
Template.municipio.onRendered(function(){
  $(document).ready(function(){
     //========================================================validacion de depto================================== ==
     var $select =  $('#depto').select2({
      allowClear: false
    });
    // Aplicando la validacion del select cada vez que cambie
    $select.on('change', function(){
      $(this).trigger('blur');
    });
   //Permitiendo la validacion de campos ocultos
    $('#siguienteMunicipio').validate({
      ignore: '.select2-input, .select2-focusser',
      submitHandler: function(form) {
        // console.log('validad aqui');
      },
      errorPlacement: function(error, element) {
        $(element).next().append(error);
      }
    });
    // agregando la validacion del select ya que no tiene un atributo name el plugin
    $select.rules('add', {
      valueNotEquals:"nulo",
      // required: true,
      messages: {
        // required: "Es necesario que seleccione una opción"
        valueNotEquals: "Seleccione una opción"
      }
    });
    //========================================================validacion de municipio================================== ==
    var $select =  $('#municipio').select2({
      allowClear: false
    });
    // Aplicando la validacion del select cada vez que cambie
    $select.on('change', function(){
      $(this).trigger('blur');
    });
   //Permitiendo la validacion de campos ocultos
    $('#siguienteMunicipio').validate({
      ignore: '.select2-input, .select2-focusser',
      submitHandler: function(form) {
        
      },
      errorPlacement: function(error, element) {
        $(element).next().append(error);
      }
    });
    // agregando la validacion del select ya que no tiene un atributo name el plugin
    $select.rules('add', {
      valueNotEquals:"nulo",
      // required: true,
      messages: {
        // required: "Es necesario que seleccione una opción"
        valueNotEquals: "Seleccione una opción"
      }
    });
  //   //========================================================validacion de ciudad================================== ==
  var $select =  $('#ciudad').select2({
    allowClear: false
  });
  // Aplicando la validacion del select cada vez que cambie
  $select.on('change', function(){
    $(this).trigger('blur');
  });
 //Permitiendo la validacion de campos ocultos
  $('#siguienteMunicipio').validate({
    ignore: '.select2-input, .select2-focusser',
    submitHandler: function(form) {
      // console.log('esta entrando aqui');
    },
    errorPlacement: function(error, element) {
      $(element).next().append(error);
    }
  });
  // agregando la validacion del select ya que no tiene un atributo name el plugin
  $select.rules('add', {
    valueNotEquals:"nulo",
    // required: true,
    messages: {
      // required: "Es necesario que seleccione una opción"
      valueNotEquals: "Seleccione una opción"
    }
  });
  //   //========================================================validacion de colonia================================== ==
  var $select = $('#colonia').select2({
    allowClear: false
  });
  // Aplicando la validacion del select cada vez que cambie
  $select.on('change', function(){
    $(this).trigger('blur');
  });
 //Permitiendo la validacion de campos ocultos
  $('#siguienteMunicipio').validate({
    ignore: '.select2-input, .select2-focusser',
    submitHandler: function(form){
      // console.log('esta entrando aqui');
    },
    errorPlacement: function(error, element){
      $(element).next().append(error);
    }
  });
  // agregando la validacion del select ya que no tiene un atributo name el plugin
  $select.rules('add', {
    valueNotEquals:"nulo",
    // required: true,
    messages: {
      // required: "Es necesario que seleccione una opción"
      valueNotEquals: "Seleccione una opción"
    }
  });
    //========================================================validacion de colonia====================================
  });
  $("#siguienteMunicipio").validate({
    rules: {
      nombre1:{
        required:true,
        pattern: /^[a-zA-ZáéíïóúüÁÉÍÏÓÚÜñÑ\'\"\s]+$/,
      },
    } ,
    messages: {
      nombre1:{
        required:"Verifique primer nombre",
        pattern:"No valido",
      },
    }
 });    
});
Template.municipio.helpers({
  //===============================================wbmunicipio===============================================
  wbmunicipio(){
    return wbmunicipio.get();
  },
  //============================================wsciudada==================================================
  wsciudada(){
    return wsciudada.get();
  },
  //===========================================awsbarriocolonia===================================================
  awsbarriocolonia(){
    return awsbarriocolonia.get();
  },
});
Template.municipio.events({
  'submit .siguienteMunicipio'(event, instance){
    event.preventDefault();
    let iddepto=event.target.depto.value;
    let depto=event.target.depto;
    let indexDepto=depto.selectedIndex;
    let departamento = depto.options[indexDepto].text;

    let idmuni=event.target.muni.value;
    let muni=event.target.muni;
    let indexMuni=muni.selectedIndex;
    let municipio = muni.options[indexMuni].text;
    // let var=event.target.ciudad;
    let idciudad=event.target.ciudad.value;
    let ciu=event.target.ciudad;
    let indexCiud=ciu.selectedIndex;
    let ciudad = ciu.options[indexCiud].text;
    
    // let var=event.target.barrio;
    let idbarrio=event.target.barrio.value;
    let bar=event.target.barrio;
    let indexBar=bar.selectedIndex;
    let barrio = bar.options[indexBar].text;
    // console.log(idmuni+" "+municipio);
    // console.log(idciudad+" "+ciudad);
    // console.log(idbarrio+" "+barrio);
    // console.log(iddepto+' '+departamento);
    Session.set("iddepto",iddepto);
    Session.set("departamento",departamento);
    Session.set("idmuni",idmuni);
    Session.set("idciudad",idciudad);
    Session.set("idbarrio",idbarrio);
    Session.set("municipio",municipio);
    Session.set("ciudad",ciudad);
    Session.set("barrio",barrio);
    console.log('aqui hice submit');
    FlowRouter.go('/domicilio');
  },
  'click .atras'(event){
    FlowRouter.go('/nombre');
 },
 'change .depto'(event){
   //================================================wbmunicipio================================================
   let Depto=document.getElementById("depto").value;
   console.log('ide depto',Depto);
   var cuerpo="<cam:wbMunicipio.Execute>"
   +"<cam:Desmun></cam:Desmun>"
   +"<cam:Depto>"+Depto+"</cam:Depto>"
   +"</cam:wbMunicipio.Execute>";
   Meteor.call('wbmunicipio',{ body:cuerpo },(err, res) =>{
     if (err){
       console.log(err);
      } else {
        var datosWS =res;
        if (datosWS.envelope) {
          console.log(datosWS.envelope.body[0].wbmunicipioexecuteresponse[0].sdtmunicipio[0].sdtmunicipiosdtmunicipioitem);
          datosWS=datosWS.envelope.body[0].wbmunicipioexecuteresponse[0].sdtmunicipio[0].sdtmunicipiosdtmunicipioitem; 
          wbmunicipio.set(datosWS);
          document.getElementById("municipio").disabled=false;
        }
      }
    });
    
  },
  'change .municipio' (event){
    //================================================wsciudada================================================
    let Municipioid=document.getElementById("municipio").value;
    console.log('id muni',Municipioid);
    // var Municipioid="HN0308";
    var cuerpo="<cam:wsCiudadA.Execute>"
                  +"<cam:Descaldea></cam:Descaldea>"
                  +"<cam:Municipioid>"+Municipioid+"</cam:Municipioid>"
                +"</cam:wsCiudadA.Execute>";
    Meteor.call('wsciudada',{ body:cuerpo },(err, res) =>{
        if(err){
          console.log(err);
        } else {
          var datosWS =res;
          if (datosWS.envelope){
            datosWS=datosWS.envelope.body[0].wsciudadaexecuteresponse[0].sdtciudadaldea[0].sdtciudadaldeasdtciudadaldeaitem; 
            wsciudada.set(datosWS); 
            document.getElementById("ciudad").disabled=false;
          } 
        }
      });    
  },
  'change .ciudad'(event){
    //================================================awsbarriocolonia===============================================
    let Ciad=document.getElementById("ciudad").value;
    console.log('id ciuda',Ciad);
    var cuerpo="<cam:wsBarrioColonia.Execute>"
                    +"<cam:Desbcc></cam:Desbcc>"
                    +"<cam:Ciad>"+Ciad+"</cam:Ciad>"
                  +"</cam:wsBarrioColonia.Execute>";
    Meteor.call('awsbarriocolonia',{ body:cuerpo },(err,res) =>{
        if(err){
          console.log(err);
        } else {
          var datosWS=res;
          if(datosWS.envelope){
            datosWS=datosWS.envelope.body[0].wsbarriocoloniaexecuteresponse[0].sdtbarriocolonia[0].sdtbarriocoloniasdtbarriocoloniaitem; 
            awsbarriocolonia.set(datosWS); 
            document.getElementById("colonia").disabled=false;
          }
        }
      });
 },
//   'change .colonia'(event){
//     console.log('select colonia cambio');
//   // document.getElementById("siguiente").disabled=false;
// },
 
});
//==============================================================================================
// fomulario4  domicilio,telfono y movil
Template.domicilio.onCreated(function(){
  $(document).ready(function(){
    var domicilio=document.getElementById("domicilio");
    var telefono = document.getElementById("telefono");
    var movil = document.getElementById("movil");
    // Inputmask({ regex: "[3|8|9][0-9]{7}", mask:"", placeholder:"00000000"}).mask(movil);
    // Inputmask({ regex: "[2][0-9]{7}", mask:"", placeholder:"00000000"}).mask(telefono);
    Inputmask({ regex: "[a-zA-Z0-9áéíïóúüÁÉÍÏÓÚÜñÑ ,.]*",placeholder:""}).mask(domicilio);  
    Inputmask({ regex: "[2][0-9]{7}",mask:"", placeholder:"00000000", showMaskOnHover: true}).mask(telefono);  
    Inputmask({ regex: "[9|3|8][0-9]{7}", mask:"",placeholder:"00000000", showMaskOnHover: true}).mask(movil);  
  });
});

Template.domicilio.onRendered(function(){
  console.log(document.getElementById("telefono"));
  console.log(document.getElementById("movil"));
  $( "#siguienteDomicilio" ).validate({
    rules: {
      domicilio: {
        required:true,
        // pattern:/^[ a-zA-Z0-9áéíïóúüÁÉÍÏÓÚÜñÑ,;.'\\s]*$/,
      },
      // telefono:{
      //   required:false,
      //   // pattern:/^[2][0-9]{11}$/,
      // },
      movil:{
        // required:true,
        // pattern:/^[9|3|8][0-9]{11}$/,
      },
    },
    messages: {
      domicilio: {
        required:"Rellena este campo",
        pattern:"Dato no válido",
      },
      // telefono:{
      //   // required:"Rellena este campo",
      //   // pattern:"Dato no válido",
      // },
      movil:{
        required:"Rellena este campo",
        // pattern:"Dato no válido",
      },
    }
  });
});
Template.domicilio.helpers({});
Template.domicilio.events({
  'submit .siguienteDomicilio'(event){
    event.preventDefault();
    let domicilio=event.target.domicilio.value;
    let telefono=event.target.telefono.value;
    let movil=event.target.movil.value;
    domicilio=domicilio.trim();
    // telefono=telefono.replace(/[-]/gi,"");
    // movil=movil.replace(/[-]/gi,"");
    Session.set("domicilio",domicilio);
    Session.set("telefono",telefono);
    Session.set("movil",movil);
    console.log(domicilio);
    console.log(telefono);
    console.log(movil);

    FlowRouter.go('/correo');
  },
  'click .atras'(event){
    FlowRouter.go('/municipio');
 },
 'input #domicilio'(){
  $("#movil").addClass("required");
 },
 'input #movil'(event){
  // $("#movil").addClass("required");
  $("#telefono").removeClass("required");
  console.log(document.getElementById("movil"));
  console.log(document.getElementById("telefono"));
  console.log("telefono",document.getElementById("telefono").value);
  console.log("movil",document.getElementById("movil").value);
  },
 'input #telefono'(event){
  // $("#telefono").addClass("required");
  $("#movil").removeClass("required");
  console.log( document.getElementById("movil") );
  console.log( document.getElementById("telefono") );
  console.log("movil", document.getElementById("movil").value );
  console.log("telefono", document.getElementById("telefono").value );
  },
});
//==============================================================================================
// formulario5 correo personal, trabajo,residencia
var banderaAcepta=true;

Template.correo.onCreated(function(){
 
});
Template.correo.onDestroyed(function () {
  
});
Template.correo.onRendered(function(){
  

  document.getElementById("labelCaptcha").style.display = "none";
  $("#siguienteCorreo").validate({
    rules: {
      emailP:{
        required:false,
        pattern:/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
      },
      emailT:{
        required:false,
        pattern:/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
      },
      residente:{
        required:true,
      },
    },
    messages: {
      emailP:{
        // required:"Rellenar este campo",
        pattern:"Dato no válido",
      },
      emailT:{
        // required:"Rellenar este campo",
        pattern:"Dato no válido",
      },
      residente:{
        required:"Selecciona una respuesta",
      },
    }
  });
});
Template.correo.helpers({
  getEmailP(){
    return Session.get("emailP");
  },
  getEmailT(){
    return Session.get("emailT");
  }
});
Template.correo.events({
  'submit .siguienteCorreo'(event){
    event.preventDefault();
    console.log(document.getElementById('aceptoNO').checked);
  
    if(document.getElementById('aceptoNO').checked){
      // FlowRouter.go('/aceptoContacto');
      // Modal.show('contactoModal');
      // console.log('mostrar mensaje');
    }
    // else
    // {
    let emailP=event.target.emailP.value;
    let emailT=event.target.emailT.value;
    let residente=event.target.residente.value;
    let declara=event.target.declara.value;
    let acepto=event.target.acepto.value;
    if(residente=='si'){
      residente='S';
    }else{
      residente='N';
    }
    Session.set("emailP",emailP);
    Session.set("emailT",emailT);
    Session.set("residente",residente);
    Session.set("declara",declara);
    Session.set("acepto",acepto);
      //===============INCIO LLAMADAO AL CAPCHTA
    var formData = {};
    var captchaData = grecaptcha.getResponse();
    if(captchaData==""){
      console.log('captcah vacio');
      document.getElementById("labelCaptcha").style.display = "block";
      $('#labelCaptcha').html('Autentifique captcha');
    }else{
      document.getElementById("labelCaptcha").style.display = "none";
      console.log(captchaData);
      Meteor.call('formSubmissionMethod',captchaData,function(error, result){
        if (error) {
          console.log('There was an error: ' + error.reason);
        } else {
            if(result){
              grecaptcha.reset();
              console.log('Success!',result);
              var Codcli=Session.get("ibs");//"2089291";
              var Cusunr=Session.get("Cusunr");
              var Idncli=Session.get("idCliente");//"0801199306450";
              var Pnombre=Session.get("nombre1");//"Axel";
              var Snombre=Session.get("nombre2");//"Enrique";
              var Papellido=Session.get("apellido1");//"Landa";
              var Sapellido=Session.get("apellido2");//"Salgado";
              var Idprof=Session.get("idProfesion");;//"033";
              var Profd=Session.get("profesion");//"INGENIERíA DE LA CONSTRUCCIóN Y GERENCIA D";
              var Rteacliidocup=Session.get("idocupacion");//"EZOP";
              var Rteacliocupacion=Session.get("ocupacion");//"PROFESOR, EDUCACION SUPERIOR/ZOOLOGIA";
              var Declaro=Session.get("declara");//"S";
              var Acepto=Session.get("acepto");//"N";
              var Dptoid= Session.get("iddepto");//"HN01";
              var Dptonombre=Session.get("departamento");//"AtláAntida";
              var Idmunc= Session.get("idmuni");//"HN0101";
              var Desmunc=Session.get("municipio");//"La Ceiba";
              var Idcald= Session.get("idciudad"); //"HN010104";
              var Descald=Session.get("ciudad");//"Corozal";
              var Id_bcc= Session.get("idbarrio");//"HN010104002";
              var Descrbcc=Session.get("barrio");//"La Ensenada";
              var Dirdom=Session.get("domicilio");//"La ensenada b2 c 905 contiguo a plaza azul";
              var Numtelf=Session.get("telefono");//"22467469";
              var Nummovil=Session.get("movil");//"33822840";
              var Emailp=Session.get("emailP");//"axellanda93@gmail.com";
              var Emailt=Session.get("emailT");//"alanda@bancatlan.hn";
              var Flag1=Session.get("residente");//"N";
              var Flag3=Session.get("flagEmpleado");//"S";
              var Estado="";
              var cuerpo="<cam:wsGuardarCliente.Execute>"
                              +"<cam:Codcli>"+Codcli+"</cam:Codcli>"
                              +"<cam:Cusunr>"+Cusunr+"</cam:Cusunr>"
                              +"<cam:Idncli>"+Idncli+"</cam:Idncli>"
                              +"<cam:Pnombre>"+Pnombre+"</cam:Pnombre>"
                              +"<cam:Snombre>"+Snombre+"</cam:Snombre>"
                              +"<cam:Papellido>"+Papellido+"</cam:Papellido>"
                              +"<cam:Sapellido>"+Sapellido+"</cam:Sapellido>"
                              +"<cam:Idprof>"+Idprof+"</cam:Idprof>"
                              +"<cam:Profd>"+Profd+"</cam:Profd>"
                              +"<cam:Rteacliidocup>"+Rteacliidocup+"</cam:Rteacliidocup>"
                              +"<cam:Rteacliocupacion>"+Rteacliocupacion+"</cam:Rteacliocupacion>"
                              +"<cam:Declaro>"+Declaro+"</cam:Declaro>"
                              +"<cam:Acepto>"+Acepto+"</cam:Acepto>" 
                              +"<cam:Dptoid>"+Dptoid+"</cam:Dptoid>"
                              +"<cam:Dptonombre>"+Dptonombre+"</cam:Dptonombre>"
                              +"<cam:Idmunc>"+Idmunc+"</cam:Idmunc>" 
                              +"<cam:Desmunc>"+Desmunc+"</cam:Desmunc>"
                              +"<cam:Idcald>"+Idcald+"</cam:Idcald>"
                              +"<cam:Descald>"+Descald+"</cam:Descald>"
                              +"<cam:Id_bcc>"+Id_bcc+"</cam:Id_bcc>"
                              +"<cam:Descrbcc>"+Descrbcc+"</cam:Descrbcc>"
                              +"<cam:Dirdom>"+Dirdom+"</cam:Dirdom>"
                              +"<cam:Numtelf>"+Numtelf+"</cam:Numtelf>" 
                              +"<cam:Nummovil>"+Nummovil+"</cam:Nummovil>"
                              +"<cam:Emailp>"+Emailp+"</cam:Emailp>"
                              +"<cam:Emailt>"+Emailt+"</cam:Emailt>"
                              +"<cam:Flag1>"+Flag1+"</cam:Flag1>"
                              +"<cam:Flag3>"+Flag3+"</cam:Flag3>"
                              +"<cam:Estado>"+Estado+"</cam:Estado>"
                          +"</cam:wsGuardarCliente.Execute>";
               Meteor.call('awsguardarcliente',{body:cuerpo},(err,res) =>{
                        if (err){
                          console.log(err);
                        } else {
                          var datosWS =res;
                          if (datosWS.envelope) {
                            console.log(datosWS.envelope.body[0].wsguardarclienteexecuteresponse[0]);
                            let estado=datosWS.envelope.body[0].wsguardarclienteexecuteresponse[0].estado[0]; 
                            var params = {};
                            var queryParams = {
                                name:Pnombre,
                                last:Papellido,
                              };
                            if(estado==0){
                              console.log('se guardo informacion');
                              FlowRouter.go('/clienteActualizado', params, queryParams);
                            }
                            if (estado==1){
                              console.log('Cliente ya existe');
                              FlowRouter.go('/clienteYaExiste', params, queryParams);
                            }
                          }
                        }
                      });
            }else{console.log('error al verificar captcha')}
          }
      });
    }//===============FIN LLAMDO AL CAPCHA
    // }//fin si capeto es NO
  },
  'click .terminos'(event){
    let emailP=document.getElementById('emailP').value;
    let emailT=document.getElementById('emailT').value;
    Session.set("emailP",emailP);
    Session.set("emailT",emailT);
    FlowRouter.go('/terminos');
 },
  'click .atras'(event){
    FlowRouter.go('/domicilio');
 },
 'click .declara'(event){
  document.getElementById('enviarDatos').disabled=false;
  console.log('datos declara');
  },
  'click #aceptoNO'(event){
    // Modal.show('contactoModal');
    $('.modal').fadeIn(300);

  },
});
//==================================================terminos============================================
Template.terminos.events({
  'click .aceptar'(){
    FlowRouter.go('/correo');
  },
});
//==================================================Nocliente Almacenado============================================
Template.noCliente.events({
  'click .aceptar'(){
    FlowRouter.go('/');
  },
});
//==================================================Cliente ya existe============================================
Template.clienteYaExiste.events({
  'click .aceptar'(){
    FlowRouter.go('/');
  },
});
Template.clienteYaExiste.helpers({
  getName(){
    return FlowRouter.getQueryParam("name");
  },
  getLast(){
    return FlowRouter.getQueryParam("last");
  },
});
//==================================================aceptoContacto============================================
Template.contactoModal.events({
  'click .buttonContainer button'(){
    $('.modal').fadeOut(300);
  },
});





