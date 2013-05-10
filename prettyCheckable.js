/*
 *  Project: prettyCheckable
 *  Description: jQuery plugin to replace checkboxes and radios for custom images
 *  Author: Arthur Gouveia
 *  License: Licensed under the MIT License
 */

;(function ( $, window, undefined ) {

    var pluginName = 'prettyCheckable',
      document = window.document,
      defaults = {
        labelPosition: 'right',
        customClass: '',
        color: 'blue'
      };

    function Plugin( element, options ) {
      this.element = element;
      this.options = $.extend( {}, defaults, options) ;

      this._defaults = defaults;
      this._name = pluginName;

      this.init();
    }

    function addCheckableEvents(input){
        input.on('change', function(){
            input.siblings('a').toggleClass('checked', this.checked);
        });
        input.siblings('a, label')
            .on('click',  function(event){
                event.preventDefault();
                event.stopImmediatePropagation();
                input.trigger('click');
                if (input.attr('type') == 'radio') {
                    $('input[name="' + input.attr('name') + '"]').not(input).change();
                }
            })
            .on('keyup', function(e){
                if (e.keyCode === 32){
                    $(this).click();
                }
            });
    }

    Plugin.prototype.init = function () {

      var el = $(this.element);

      el.css('display', 'none');

      var classType = el.data('type') !== undefined ? el.data('type') : el.attr('type');

      var label = el.data('label') !== undefined ? el.data('label') : '';

      var labelPosition = el.data('labelposition') !== undefined ? 'label' + el.data('labelposition') : 'label' + this.options.labelPosition;

      var customClass = el.data('customclass') !== undefined ? el.data('customclass') : this.options.customClass;

      var color =  el.data('color') !== undefined ? el.data('color') : this.options.color;

      var disabled = el.prop('disabled') === true ? 'disabled' : '';

      var containerClasses = ['pretty' + classType, labelPosition, customClass, color, disabled].join(' ');

      el.wrap('<div class="clearfix ' + containerClasses + '"></div>').parent().html();

      var dom = [];
      var isChecked = el.prop('checked') ? 'checked' : '';
      var isDisabled = el.prop('disabled') ? true : false;

      if (labelPosition === 'labelright') {

        dom.push('<a href="#" class="' + isChecked + '"></a>');
        dom.push('<label for="' + el.attr('id') + '">' + label + '</label>');

      } else {

        dom.push('<label for="' + el.attr('id') + '">' + label + '</label>');
        dom.push('<a href="#" class="' + isChecked + '"></a>');

      }

      el.parent().append(dom.join('\n'));
      addCheckableEvents(el);

    };

    Plugin.prototype.disableInput = function () {

      var el = $(this.element);

      el.parent().addClass('disabled');
      el.prop('disabled', true);

    };

    Plugin.prototype.enableInput = function () {

      var el = $(this.element);

      el.parent().removeClass('disabled');
      el.prop('disabled', false);

    };

    $.fn[pluginName] = function ( options ) {
      var inputs = [];
      this.each(function () {
        if (!$.data(this, 'plugin_' + pluginName)) {
          inputs.push($.data(this, 'plugin_' + pluginName, new Plugin( this, options )));
        }
      });
      return inputs;
    };

}(jQuery, window));