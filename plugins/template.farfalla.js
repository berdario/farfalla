// Farfalla plugin: ##plugin_name##
// This is a template for new plugins. Replace ##plugin_name## with the exact name of a new plugin to start creating yours.


jQuery.noConflict();
(function($) {

  $(function() {

    // New logic here

    $.##plugin_name##_on = function () {
      $('###plugin_name##Activator').farfalla_switch_on('##plugin_name##');

     // New logic here

    }

    $.##plugin_name##_off = function () {
      $('###plugin_name##Activator').farfalla_switch_off('##plugin_name##');

    // New logic here

    }

    $.##plugin_name##_on()

    $('###plugin_name##Activator').click( function(){
      if($(this).hasClass('active')){
        $.##plugin_name##_off()
      } else {
        $.##plugin_name##_on()
      }
    });

  });

})(jQuery);
