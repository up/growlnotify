/**
 * growlnotify.js
 * Growl like notification system for HTML
 * 
 * Original by Srinath (http://iambot.net/projects/tinypop/)
 * Modified 2011 by Uli Preuss
 */

(function(global) {

  var growl = {

    id: 0,
    wrapper: {},
    popups: [],

    notify: function(config) {

      this.id++;

      if (typeof config === 'undefined') {
        config = {
          method: 'error',
          head: 'No content to display!'
        };
      }

      var 
        id = this.id,
        wrapper = this.wrapper,
        popups = this.popups,
        method = config["method"] || 'default', // ok, info, warning, error
        gn_icon = method === 'default' ? false : true,
        icon = config["icon"] || false,
        head = config["head"] || false,
        body = config["body"] || false,
        path = config["path"] || '',
        position,
        fragment,
        popup,
        sticky,
        cache = ''
      ;

      popups[id] = {};
      sticky = popups[id].sticky = config["sticky"] !== null ? config["sticky"] : false;
      popups[id].timeout = config["timeout"] !== undefined ? parseInt(config["timeout"], 10) : 500;
      position = popups[id].position = config["position"] || 'bottom right';
      popups[id].opacity = 0;

      if (typeof wrapper[position] === 'undefined') {
        wrapper[position] = document.createElement("div");
        fragment = wrapper[position];
        fragment.className = "gn";
        if (/right/.test(position)) {
          fragment.style.right = '0';
        } else if (/left/.test(position)) {
          fragment.style.left = '0';
        }
        if (/top/.test(position)) {
          fragment.style.top = '0';
        } else if (/bottom/.test(position)) {
          fragment.style.bottom = '0';
        }
        document.body.appendChild(fragment);
      }

      popup = popups[id].notice = document.createElement("div");
      if (sticky) {
        cache += "<span class='gn-close' id='gn-close-" + id + "'></span>";
      }
      if (gn_icon || icon) {
        cache += "<img src='" + (icon ? icon + "'" : path + "icons/gn-" + method + ".png'") + " class='gn-icon' />";
      }
      if (head) {
        cache += "<h3 class='gn-head'>" + head + "</h3>";
      }
      if (body) {
        cache += "<div class='gn-body'>" + body + "</div>";
      }
      popup.innerHTML = cache;
      popup.className = "gn-wrapper";
      popup.id = "gn-wrapper_" + id;
      popup.style.opacity = "0";
      popup.style.filter = "alpha(opacity = 0)";
      wrapper[position].appendChild(popup);
      if (sticky) {
        var self = this;
        var closeButton = document.getElementById("gn-close-" + id);
        closeButton.onclick = function() {
          self.close(this, "slow");
        };
        closeButton.style.backgroundImage= 'url(' + path + 'icons/gn-close.png)';
      }
      this.show(id);
    },

    close: function(obj, speed) {
      var id = obj.id.split('-')[2];
      if (document.getElementById("gn-close-" + id)) {
        this.hide(id, speed);
      }
    },

    show: function(id) {
      var 
        popups = this.popups,
        popup = popups[id].notice,
        timer = popups[id].timer,
        opacity
      ;

      popups[id].opacity += 10;
      opacity = popups[id].opacity;
      popup.style.opacity = opacity / 100;
      popup.style.filter = "alpha(opacity = " + opacity + ")";

      if (opacity !== 90) {
        timer = setTimeout("growl.show('" + id + "')", 75);
      } else {
        clearTimeout(timer);
        if (!popups[id].sticky) {
          setTimeout("growl.hide('" + id + "')", popups[id].timeout);
        }
      }
    },

    hide: function(id, speed) {
      var 
        popups = this.popups,
        wrapper = this.wrapper,
        popup = popups[id].notice,
        timer = popups[id].timer,
        opacity, steps = speed === 'slow' ? 20 : 10
      ;

      popups[id].opacity -= steps;
      opacity = popups[id].opacity;
      popup.style.opacity = opacity / 100;
      popup.style.filter = "alpha(opacity = " + opacity + ")";
      if (opacity >= 0) {
        timer = setTimeout("growl.hide('" + id + "', '" + speed + "')", 75);
      } else {
        clearTimeout(timer);
        wrapper[popups[id].position].removeChild(popup);
      }
    },

    add_growl_styles: (function() {
      var style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = ' ' +
      '.gn { ' +
      '  position: fixed; padding: 20px 20px 0px; min-width: 250px; max-width: 350px; ' +
      '}' +
      '.gn-wrapper {' +
      '  width: auto; min-height: 27px; display: block; background-color: #242321; margin-bottom: 15px;' +
      '  font-family: Lucida Grande,Lucida Sans Unicode,Geneva,Verdana,sans-serif; padding: 0px 10px 10px;' +
      '  box-shadow: 0px 0px 7px #000; -moz-box-shadow: 0px 0px 7px #000; -webkit-box-shadow: 0px 0px 7px #000;' +
      '  border-radius: 9px; -moz-border-radius: 9px; -webkit-border-radius: 9px; position: relative; border: thin solid #AAA' +
      '}' + 
      '.gn-close {' +
      '   position: absolute; right: -10px; top: -11px; cursor: pointer; color: #EFEFEF;' +
      '   font: bold 14px Arial, Helvetica, sans-serif; width: 28px; height: 28px; display: inline-block;' + 
      //'   background-image: url(icons/gn-close.png);' +
      '   background-position: 0 0;' +
      '}' + 
      '.gn-close:hover {' +
      '   color: #CEA500; background-position: 0 28px;' +
      '}' + 
      '.gn-icon {' +
      '  position: relative; top: 7px; width: 24px; height: 24px; margin: 0px 6px 0px 0px;' +
      '}' + 
      '.gn-head {' +
      '  display: inline-block; font-size: 13px; word-wrap: break-word; color: #FFF; line-height: 120%; margin: 9px 0px 0px 0px;' +
      '}' + 
      '.gn-body {' +
      '  padding-top: 12px; font-size: 12px; color: #FEFEFE; line-height: 120%;' +
      '}';
      document.getElementsByTagName('head')[0].appendChild(style);
    } ())

  };

  // Expose growl to the global object
  global.growl = growl;

  // aliases for public use
  global.growl.notify = growl.notify;
  global.growl.close = growl.close;

}(window));
