import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

Meteor.startup(function() {
  reCAPTCHA.config({
    privatekey: '6Ldcsl0UAAAAAIYUq_tDexejL2LImzIzstl8vpO4',//clave de beanario
    settings: {
      theme: 'dark',
    type: 'image',
    size: 'normal',
    },
    config: function(settings) {
        return _.extend(this.settings, settings);
    },
    verifyCaptcha: function(clientIP,response) {
    }
  });
  
});
const urlWs="http://150.150.6.87/CampActualizacion";
// =================================
function puntos(xml) {
  return xml.replace('.','');
}
// =================================
Meteor.methods({
  'wsaccesoclientes'({body}) {
    var xml=
    "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:cam='CampañaActualizacionDatosClientes'>"
            +"<soapenv:Header/><soapenv:Body>"+body+"</soapenv:Body>"
        +"</soapenv:Envelope>";
      // console.log(xml);
      var options = {
            content: xml,
            headers: {
              'Content-Type': 'text/xml',
              },
            }
      var url=urlWs+"/awsaccesoclientes.aspx";
      // var miJson={};
      var parseStringSync = require('xml2js-parser').parseStringSync;
      var stripPrefix = require('xml2js').processors.stripPrefix;

      var xml=HTTP.call('POST',url , options).content;
      var result= parseStringSync(xml,{
                                      trim:true,
                                      normalizeTags: true,
                                      ignoreAttrs:true,
                                      tagNameProcessors: [ stripPrefix ,puntos]   
                                    });
      return result;
  },
  'wsnumboleto' ({body}) {
    var xml=
        "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:cam='CampañaActualizacionDatosClientes'>"
        +"<soapenv:Header/><soapenv:Body>"+body+"</soapenv:Body>"
        +"</soapenv:Envelope>";
      var options = {
            content: xml,
            headers: {
              'Content-Type': 'text/xml',
              },
            }
      var url=urlWs+"/awsnumboleto.aspx";
      // var miJson={};
      var parseStringSync = require('xml2js-parser').parseStringSync;
      var stripPrefix = require('xml2js').processors.stripPrefix;
      var xml=HTTP.call('POST',url,options).content;
      var result= parseStringSync(xml,{
                                      trim:true,
                                      normalizeTags: true,
                                      ignoreAttrs:true,
                                      tagNameProcessors: [ stripPrefix ,puntos]   
                                    });
      return result;
  },// =================================
  'wsnocliente' ({body}) {
    var xml="<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:cam='CampañaActualizacionDatosClientes'>"
        +"<soapenv:Header/><soapenv:Body>"+body+"</soapenv:Body>"
        +"</soapenv:Envelope>";
      var options = {
            content: xml,
            headers: {
              'Content-Type': 'text/xml',
              },
            }
      var url=urlWs+"/awsNocliente.aspx";
      // var miJson={};
      var parseStringSync = require('xml2js-parser').parseStringSync;
      var stripPrefix = require('xml2js').processors.stripPrefix;
      var xml=HTTP.call('POST',url,options).content;
      var result= parseStringSync(xml,{
                                      trim:true,
                                      normalizeTags: true,
                                      ignoreAttrs:true,
                                      tagNameProcessors: [ stripPrefix ,puntos]   
                                    });
      return result;
  },// =================================
  'wsocupacion' ({body}) {
    var xml=
     "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:cam='CampañaActualizacionDatosClientes'>"
        +"<soapenv:Header/><soapenv:Body>"+body+"</soapenv:Body>"
        +"</soapenv:Envelope>";
      var options = {
            content: xml,
            headers: {
              'Content-Type': 'text/xml',
              },
            }
      var url=urlWs+"/awsocupacion.aspx";
      // var miJson={};
      var parseStringSync = require('xml2js-parser').parseStringSync;
      var stripPrefix = require('xml2js').processors.stripPrefix;
      var xml=HTTP.call('POST',url,options).content;
      var result= parseStringSync(xml,{
                                      trim:true,
                                      normalizeTags: true,
                                      ignoreAttrs:true,
                                      tagNameProcessors: [ stripPrefix ,puntos]   
                                    });
      return result;
  },// =================================
  'wsprofesion' ({body}) {
    var xml="<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:cam='CampañaActualizacionDatosClientes'>"
        +"<soapenv:Header/><soapenv:Body>"+body+"</soapenv:Body>"
        +"</soapenv:Envelope>";
      var options = {
            content: xml,
            headers: {
              'Content-Type': 'text/xml',
              },
            }
      var url=urlWs+"/awsprofesion.aspx";
      // var miJson={};
      var parseStringSync = require('xml2js-parser').parseStringSync;
      var stripPrefix = require('xml2js').processors.stripPrefix;
      var xml=HTTP.call('POST',url,options).content;
      var result= parseStringSync(xml,{
                                      trim:true,
                                      normalizeTags: true,
                                      ignoreAttrs:true,
                                      tagNameProcessors: [ stripPrefix ,puntos]   
                                    });
      return result;
  },// =================================
  'wbmunicipio' ({body}) {
    var xml="<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:cam='CampañaActualizacionDatosClientes'>"
        +"<soapenv:Header/><soapenv:Body>"+body+"</soapenv:Body>"
        +"</soapenv:Envelope>";
      var options = {
            content: xml,
            headers: {
              'Content-Type': 'text/xml',
              },
            }
      var url=urlWs+"/awbmunicipio.aspx";
      // var miJson={};
      var parseStringSync = require('xml2js-parser').parseStringSync;
      var stripPrefix = require('xml2js').processors.stripPrefix;
      var xml=HTTP.call('POST',url,options).content;
      var result= parseStringSync(xml,{
                                      trim:true,
                                      normalizeTags: true,
                                      ignoreAttrs:true,
                                      tagNameProcessors: [ stripPrefix ,puntos]   
                                    });
      return result;
  },// =================================
  'wsciudada' ({body}) {
    var xml="<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:cam='CampañaActualizacionDatosClientes'>"
        +"<soapenv:Header/><soapenv:Body>"+body+"</soapenv:Body>"
        +"</soapenv:Envelope>";
      var options = {
            content: xml,
            headers: {
              'Content-Type': 'text/xml',
              },
            }
      var url=urlWs+"/awsciudada.aspx";
      // var miJson={};
      var parseStringSync = require('xml2js-parser').parseStringSync;
      var stripPrefix = require('xml2js').processors.stripPrefix;
      var xml=HTTP.call('POST',url,options).content;
      var result= parseStringSync(xml,{
                                      trim:true,
                                      normalizeTags: true,
                                      ignoreAttrs:true,
                                      tagNameProcessors: [ stripPrefix ,puntos]   
                                    });
      return result;
  },// =================================
  'awsbarriocolonia' ({body}) {
    var xml="<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:cam='CampañaActualizacionDatosClientes'>"
        +"<soapenv:Header/><soapenv:Body>"+body+"</soapenv:Body>"
        +"</soapenv:Envelope>";
      var options = {
            content: xml,
            headers: {
              'Content-Type': 'text/xml',
              },
            }
      var url=urlWs+"/awsbarriocolonia.aspx";
      // var miJson={};
      var parseStringSync = require('xml2js-parser').parseStringSync;
      var stripPrefix = require('xml2js').processors.stripPrefix;
      var xml=HTTP.call('POST',url,options).content;
      var result= parseStringSync(xml,{
                                      trim:true,
                                      normalizeTags: true,
                                      ignoreAttrs:true,
                                      tagNameProcessors: [ stripPrefix ,puntos]   
                                    });
      return result;
  },// =================================
  'awsguardarcliente' ({body}) {
    var xml="<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:cam='CampañaActualizacionDatosClientes'>"
        +"<soapenv:Header/><soapenv:Body>"+body+"</soapenv:Body>"
        +"</soapenv:Envelope>";
      var options = {
            content: xml,
            headers: {
              'Content-Type': 'text/xml',
              },
            }
      var url=urlWs+"/awsguardarcliente.aspx";
      // var miJson={};
      var parseStringSync = require('xml2js-parser').parseStringSync;
      var stripPrefix = require('xml2js').processors.stripPrefix;
      var xml=HTTP.call('POST',url,options).content;
      var result= parseStringSync(xml,{
                                      trim:true,
                                      normalizeTags: true,
                                      ignoreAttrs:true,
                                      tagNameProcessors: [ stripPrefix ,puntos]   
                                    });
      return result;
  },//metodo de el capcha
  'formSubmissionMethod' (captchaData) {
    let captcha_data = {
        secret: '6Ldcsl0UAAAAAIYUq_tDexejL2LImzIzstl8vpO4',
        remoteip: this.connection.clientAddress,
        response: captchaData,
    };
    var serialized_captcha_data =
        'secret=' + captcha_data.secret +
        '&remoteip=' + captcha_data.remoteip +
        '&response=' + captcha_data.response;
    let captchaVerificationResult;
    var success = false;
    try {
    captchaVerificationResult = HTTP.call("POST", "https://www.google.com/recaptcha/api/siteverify", {
                                                  content: serialized_captcha_data.toString('utf8'),
                                                  headers: {
                                                      'Content-Type': 'application/x-www-form-urlencoded',
                                                      'Content-Length': serialized_captcha_data.length
                                                  }
          });
      } catch (e) {
          console.log(e);
          return {
              'success': false,
              'error': 'Service Not Available'
          };
      }
      if (!captchaVerificationResult || !captchaVerificationResult.content) {
          return {
              'success': false,
              'error': 'Entered Text Does Not Match'
          };
      }
      let verifyCaptchaResponse = JSON.parse(captchaVerificationResult.content);
      if(verifyCaptchaResponse.success){
        success=verifyCaptchaResponse.success;
      }
      return success;
    }
});
