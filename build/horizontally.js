//============================================================
//
// The MIT License
//
// Copyright (C) 2014 Jean-Baptiste Delhommeau - @jbdelhommeau
//
// Permission is hereby granted, free of charge, to any
// person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the
// Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute,
// sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do
// so, subject to the following conditions:
//
// The above copyright notice and this permission notice
// shall be included in all copies or substantial portions
// of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY
// OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
// LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
// EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
// FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
// AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
// OR OTHER DEALINGS IN THE SOFTWARE.
//
//============================================================

/**
 * Horizontally.js
 * @author Jean-Baptiste Delhommeau - @jbdelhommeau
 * @description Create a horizontal content
 */

;(function(window, document, undefined) {

  // Strict Mode
  'use strict';

  // Constants
  var NAME = 'Horizontally';
  var DEFAULTS = {
    test: false,
  };

  function Horizontally(element, options) {

    // DOM Context
    this.element = element;

    // Data Extraction
    var data = {
      test: this.data(this.element, 'test'),
    };

    // Delete Null Data Values
    for (var key in data) {
      if (data[key] === null) delete data[key];
    }

    // Compose Settings Object
    this.extend(this, DEFAULTS, options, data);

    // States
    this.enabled = false;

    // 
    this.rotate = 0;

    // Callbacks
    this.onDeviceOrientation = this.onDeviceOrientation.bind(this);

    // Initialise
    this.initialise();

  }

  // Functions Helpers
  Horizontally.prototype.extend = function() {
    if (arguments.length > 1) {
      var master = arguments[0];
      for (var i = 1, l = arguments.length; i < l; i++) {
        var object = arguments[i];
        for (var key in object) {
          master[key] = object[key];
        }
      }
    }
  };

  Horizontally.prototype.data = function(element, name) {
    return this.deserialize(element.getAttribute('data-' + name));
  };

  Horizontally.prototype.deserialize = function(value) {
    if (value === "true") {
      return true;
    } else if (value === "false") {
      return false;
    } else if (value === "null") {
      return null;
    } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
      return parseFloat(value);
    } else {
      return value;
    }
  };

  Horizontally.prototype.camelCase = function(value) {
    return value.replace(/-+(.)?/g, function(match, character){
      return character ? character.toUpperCase() : '';
    });
  };

  Horizontally.prototype.transformSupport = function(value) {
    var element = document.createElement('div');
    var propertySupport = false;
    var propertyValue = null;
    var featureSupport = false;
    var cssProperty = null;
    var jsProperty = null;
    for (var i = 0, l = this.stylePropertyPrefix.length; i < l; i++) {
      if (this.stylePropertyPrefix[i] !== null) {
        cssProperty = this.stylePropertyPrefix[i][0] + 'transform';
        jsProperty = this.stylePropertyPrefix[i][1] + 'Transform';
      } else {
        cssProperty = 'transform';
        jsProperty = 'transform';
      }
      if (element.style[jsProperty] !== undefined) {
        propertySupport = true;
        break;
      }
    }
    switch(value) {
      case '2D':
        featureSupport = propertySupport;
        break;
      case '3D':
        if (propertySupport) {
          var body = document.body || document.createElement('body');
          var documentElement = document.documentElement;
          var documentOverflow = documentElement.style.overflow;
          if (!document.body) {
            documentElement.style.overflow = 'hidden';
            documentElement.appendChild(body);
            body.style.overflow = 'hidden';
            body.style.background = '';
          }
          body.appendChild(element);
          element.style[jsProperty] = 'translate3d(1px,1px,1px)';
          propertyValue = window.getComputedStyle(element).getPropertyValue(cssProperty);
          featureSupport = propertyValue !== undefined && propertyValue.length > 0 && propertyValue !== "none";
          documentElement.style.overflow = documentOverflow;
          body.removeChild(element);
        }
        break;
    }
    return featureSupport;
  };

  Horizontally.prototype.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i);
  Horizontally.prototype.orientationSupport = !!window.DeviceOrientationEvent;
  Horizontally.prototype.stylePropertyPrefix = [null,['-webkit-','webkit'],['-moz-','Moz'],['-o-','O'],['-ms-','ms']];
  Horizontally.prototype.stylePropertyCache = {};
  Horizontally.prototype.transform2DSupport = Horizontally.prototype.transformSupport('2D');

  Horizontally.prototype.initialise = function() {

    // Configure Context Style
    var style = window.getComputedStyle(this.element);
    /*
    if (style.getPropertyValue('position') === 'static') {
      this.element.style.position = 'relative';
    }
    */

    // Setup
    this.enable();
  };

  Horizontally.prototype.enable = function() {
    if (!this.enabled) {
      this.enabled = true;
      if (this.orientationSupport) {
        this.portrait = null;
        window.addEventListener('deviceorientation', this.onDeviceOrientation);
        //setTimeout(this.onOrientationTimer, this.supportDelay);
      }
      //window.addEventListener('resize', this.onWindowResize);
      //this.raf = requestAnimationFrame(this.onAnimationFrame);
    }
  };

  Horizontally.prototype.css = function(element, property, value) {
    var jsProperty = this.stylePropertyCache[property];
    if (!jsProperty) {
      for (var i = 0, l = this.stylePropertyPrefix.length; i < l; i++) {
        if (this.stylePropertyPrefix[i] !== null) {
          jsProperty = this.camelCase(this.stylePropertyPrefix[i][1] + '-' + property);
        } else {
          jsProperty = property;
        }
        if (element.style[jsProperty] !== undefined) {
          this.stylePropertyCache[property] = jsProperty;
          break;
        }
      }
    }
    element.style[jsProperty] = value;
  };

  Horizontally.prototype.setRotate = function(degree) {
    if (this.transform2DSupport) {
      console.log(this.element);
      this.css(this.element, 'transform', 'rotate('+ degree +'deg)');
      this.css(this.element, 'transform-origin', '50% 50%');

      //Add trigonometry margin-top Tan a = O / A
    }
  };

  Horizontally.prototype.onDeviceOrientation = function(event) {

    // Validate environnement and event properties
    if (this.desktop && event.alpha !== null) {

      // Extract Rotation
      var degree = (event.alpha || 0);
      this.setRotate(degree);
      this.rotate = degree;
    }
  };


  // Expose Horizontally
  window[NAME] = Horizontally;

 })(window, document);
 