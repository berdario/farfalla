// Main Farfalla Library: includes the functions used to draw the toolbar and the reusable functions for plugins
jQuery.noConflict();
(function($) {
  $(function() {
      
    var storage = new CrossDomainStorage("http://localhost", "/libs/crossdomainstorage/storagehandler.html");
    var toolbar_metadata = {
        "ui": {
            "choose": "Choose your profile...",
            "logo": "Click on the Farfalla logo to show or hide the toolbar",
            "handle": "<strong>Drag the bar up and down from here</strong><br />The position will be remembered",
            "home": "Go to <strong>Farfalla project</strong> website"
        },
        "plugins": [{
            "Plugin": {
                "id": "1",
                "name": "magnifier",
                "visible": true
            }
        }, {
            "Plugin": {
                "id": "2",
                "name": "keyboard",
                "visible": true
            }
        }, {
            "Plugin": {
                "id": "3",
                "name": "text-to-speech",
                "visible": false
            }
        }, {
            "Plugin": {
                "id": "4",
                "name": "fontsize",
                "visible": true
        }
        }, {
            "Plugin": {
                "id": "6",
                "name": "hicontrast",
                "visible": true
            }
        }, {
            "Plugin": {
                "id": "7",
                "name": "addalt",
                "visible": false
            }
        }, {
            "Plugin": {
                "id": "18",
                "name": "imagination",
                "visible": false
            }
        }, {
            "Plugin": {
                "id": "19",
                "name": "virtual-mouse",
                "visible": false
            }
        }, {
            "Plugin": {
                "id": "9",
                "name": "bigcursor",
                "visible": true
            }
        }, {
            "Plugin": {
                "id": "10",
                "name": "fivekeys",
                "visible": false
            }
        }, {
            "Plugin": {
                "id": "11",
                "name": "step-by-step",
                "visible": false
        }
        }, {
            "Plugin": {
                "id": "12",
                "name": "selection",
                "visible": false
            }
        }, {
            "Plugin": {
                "id": "13",
                "name": "jplayer",
                "visible": false
            }
        }, {
            "Plugin": {
                "id": "14",
                "name": "dasher",
                "visible": false
            }
        }, {
            "Plugin": {
                "id": "15",
                "name": "readability",
                "visible": false
            }
        }, {
            "Plugin": {
                "id": "17",
                "name": "clarifier",
                "visible": true
            }
        }]
    }

      var detected_language = "en";
      var strings = new Array(
          "ft_farfalla_project"
          ,"ft_accessibility_preferences"
          ,"ft_actions"
          ,"save_session"
          ,"reset"
          ,"hicontrast"
          ,"fontsize"
          ,"clarifier"
          ,"magnifier"
          ,"keyboard"
          ,"bigcursor"
          ,"Color_schemes"
          ,"Actions"
      );
      
      // XXX these need to be localized
      var translations = new Array(
          "Farfalla project","Accessibility Preferences","Actions","Save current settings for the future","Reset all settings","Contrast and color scheme control","Font size control","High readability","Selective magnification","Onscreen virtual keyboard","Larger mouse cursor","Color schemes","Actions"
      );
      


    // Inclusion of the needed css stylesheets

    $('<link>').attr('type','text/css').attr('rel','stylesheet').attr('href',farfalla_path+'css/jquery-ui.custom.min.css').prependTo('head');
    $('<link>').attr('type','text/css').attr('rel','stylesheet').attr('href',farfalla_path+'css/farfalla.css').appendTo('head');
    $('<link>').attr('type','text/css').attr('rel','stylesheet').attr('href',farfalla_path+'css/jquery.qtip.min.css').appendTo('head');

    // Main variables

    var options = farfalla_ui_options();
    var allowedColors = new Array("white","yellow","orange","red","purple","navy","blue","cyan","lime","green");
    var active_plugins = new Array();
    if($.cookie('farfalla_active_plugins')){
      var remember_profile = 1
    } else {
      var remember_profile = 0
    }

    $('body').attr('id','farfalla_body').css('padding',0);

    var snapper = new Snap({
      element: document.getElementById('farfalla_body'),
      disable: 'left',
      dragger: null,
      addBodyClasses: true,
      hyperextensible: false,
      resistance: 0.5,
      flickThreshold: 50,
      transitionSpeed: 0.3,
      easing: 'ease',
      maxPosition: 360,
      minPosition: -360,
      tapToClose: false,
      touchToDrag: true,
      slideIntent: 40,
      minDragDistance: 5
    });
            
        

/*
    #######################################
    #                                     #
    #    Reusable functions for plugins   #
    #                                     #
    #######################################
*/

    // Bridge function for cakephp gettext translations

    $.__ = function (string){
      index = $.inArray(string,strings);
      if(index>=0){
        return translations[index];
      } else {
        return string;
      }
    }

    // A function to move focus and caret to the end of textareas and input elements.
    // Source: http://stackoverflow.com/questions/637287/how-can-you-move-the-cursor-to-the-last-position-of-a-textarea-in-javascript

    $.fn.focusToEnd = function() {
        return this.each(function() {
            var v = $(this).val();
            $(this).focus().val("").val(v);
        });
    };

    // Add plugin configuration area

    $.farfalla_create_plugin_options = function ( plugin_name ){

      $('<div></div>')
        .attr({
          'id': plugin_name+'_options',
          'class':'plugin_options donttouchme'
        })
        .addClass('ui-corner-bottom')
        .hide()
        .insertBefore('#farfalla_remember_profile');

      $('<div></div>')
        .attr({
          'id': plugin_name+'_options_custom',
          'class':'plugin_options_actions donttouchme'
        })
        .appendTo('#'+plugin_name+'_options')

      $('<div></div>')
        .attr({
          'id': plugin_name+'_options_common',
          'class':'plugin_options_actions donttouchme'
        })
        .appendTo('#'+plugin_name+'_options')

      $('<input />')
        .attr({
          'id':plugin_name+'_options_deactivate',
          'class':'plugin_options_deactivate donttouchme',
          'type':'button',
          'value':'X'
        })
        .css({
          'background':'url("'+farfalla_path+'plugins/'+plugin_name+'/icons/'+plugin_name+'_deactivate.png") no-repeat #fff'
        })
        .appendTo('#'+plugin_name+'_options_common')

      var position = $('#'+plugin_name+'Activator').position();
      var width = $('#'+plugin_name+'_options').width();

    }


    // Add plugin-specific UI
    // ...

    $.farfalla_add_ui = function( plugin_name, type, name, value, callback ){
      console.log('Adding UI for '+plugin_name);
      switch(type){
        case 'slider':
          $('#'+plugin_name+'_options_custom').append('<div id="'+plugin_name+'_slider" class="farfalla_slider"></div>');
          $('#'+plugin_name+'_slider').slider();
        break;

        case 'button':
          $('#'+plugin_name+'_options_custom').append('<input type="button" id="'+name+'_button" class="farfalla_button" name="'+name+'" value="'+value+'"></input>');
          $('#'+name+'_button').addClass('donttouchme').css('background','url("'+farfalla_path+'plugins/'+plugin_name+'/icons/'+name+'.png")').click(callback);
        break;

      }
    }

    // Add plugin-specific section of UI elements
    // ...

    $.farfalla_add_ui_section = function( plugin_name, title ){

        $('#'+plugin_name+'_options_custom').append('<h2>'+title+'</h2>');

      }

    // Add plugin-specific CSS
    // ...

    $.farfalla_add_css = function( plugin_name, sheet_name ) {
      if($('link[href*="'+sheet_name+'"]').length == 0){
        $('<link></link>').attr({
          "rel":"stylesheet",
          "type":"text/css",
          "href":farfalla_path+"plugins/"+plugin_name+"/css/"+sheet_name+".farfalla.css"
        }).appendTo($('head'));
      }
    };

    $.farfalla_remove_plugin_css = function(plugin_name){
      $('link[href*="'+plugin_name+'_"]').remove();
    }


    // A function for adding buttons to the toolbar
    // name -> text displayed on the button
    // id -> unique identifier for the button: the final id will be something like button_id
    // accesskey -> the value for the accesskey attribute useful for activating the buttons from the keyboard
    // callback -> a function to be triggered by the button
    // ...

    $.fn.farfalla_add_button = function( name, text, id, accesskey, bgcolor, txtcolor, callback ){
      $('<li></li>').appendTo('#farfalla_buttons ul');
      $('<input></input>')
        .attr({
          'value': text,
          'type':'button',
          'id':'button_'+id,
          'accesskey':accesskey
        })
        .css('cssText',
          'background : '+bgcolor+' !important; /* border : 2px solid '+txtcolor+' !important; */ color : '+txtcolor+' !important;'
        )
        .addClass('ui-corner-all')
        .addClass('plugin-button')
        .appendTo('#farfalla_buttons ul li:last');
      $('#button_'+id).click(callback);
      $('#farfalla_buttons').show();
    };

    // A function for getting options

    $.farfalla_get_option = function(key, callback){ storage.getValue(key, callback) };

    // A function for setting options

    $.farfalla_set_option = function(key, value){ storage.setValue(key, value) };

    // A function for getting the XPath of an element

    $.getXPath = function ( element ) {
    var xpath = '';
    for ( ; element && element.nodeType == 1; element = element.parentNode )
      {
        var id = $(element.parentNode).children(element.tagName).index(element) + 1;
        id > 1 ? (id = '[' + id + ']') : (id = '');
        xpath = '/' + element.tagName.toLowerCase() + id + xpath;
      }
      return xpath;
    }

    $.fn.farfalla_switch_on = function ( plugin_name ) {
      $(this).addClass('active').css({
        'background': 'url("'+farfalla_path+'plugins/'+plugin_name+'/icons/'+plugin_name+'_selected.png") no-repeat'
      })
      farfalla_track_plugins(plugin_name,1);
      console.log('activated '+plugin_name);
    }

    $.fn.farfalla_switch_off = function ( plugin_name ) {
      $(this).removeClass('active').css({
        'background': 'url("'+farfalla_path+'plugins/'+plugin_name+'/icons/'+plugin_name+'.png") no-repeat'
      })
      farfalla_track_plugins(plugin_name,0);
      console.log('deactivated '+plugin_name);
    }

/*
    #######################################
    #                                     #
    #           Core functions            #
    #                                     #
    #######################################
*/


        // Parses the options passed along while including farfalla.js

        function farfalla_ui_options() {
          // if no options are passed, this is skipped (thanks to the "?" in the matching string)
          var source = $("script[src*='farfalla.js?']").attr('src');
          if (source){
            var optStart = source.search('\\?');
            var options = source.substr(optStart+1).replace(/&/g,'","');
            options = options.replace(/=/g,'":"');
            options = '{"'+options+'"}';
            options = $.parseJSON(options);
          } else { options = 0; }
          return options;
        };


        // Creates the main toolbar

        function farfalla_toolbar_create() {

            $('<div></div>').attr('id','farfalla_container').addClass('snap-drawers').prependTo('body');
            $('<div></div>').attr('id','farfalla_badge').addClass('donttouchme').prependTo('body');
            $('<div>Accessibility</div>').attr('id','farfalla_badge_label').addClass('donttouchme').hide().appendTo('#farfalla_badge');
            $('<div></div>').attr('id','farfalla_badge_logo').addClass('donttouchme').appendTo('#farfalla_badge');
            $('<div></div>').attr('id','farfalla_toolbar').appendTo('#farfalla_container');
            $('<div></div>').attr('id','farfalla_logo')
              .html('<h1><a href="http://farfalla-project.org/">'+$.__('ft_farfalla_project')+'</a></h1><p>'+$.__('ft_accessibility_preferences')+'</p>')
              .appendTo('#farfalla_toolbar');
            $('<div class="farfalla_toolbar_separator"></div>').appendTo($('#farfalla_toolbar'));
            $('<div></div>').attr('id','farfalla_toolbar_plugins').appendTo('#farfalla_toolbar');
            $('<div class="farfalla_toolbar_separator"></div>').appendTo($('#farfalla_toolbar'));
            $('<div></div>').attr('id','farfalla_remember_profile').css('background','url("'+farfalla_path+'images/save.png") no-repeat').appendTo('#farfalla_toolbar');
            $('<div></div>').attr('id','farfalla_reset_all').css('background','url("'+farfalla_path+'images/reset.png") no-repeat').appendTo('#farfalla_toolbar');
            $('<div></div>').attr('id','farfalla_toolbar_shade').addClass('donttouchme').hide().appendTo('body');


            $('#farfalla_toolbar_shade').click( function() {
              $(this).hide();
              $('#farfalla_badge').click();
            });


            if(options.border){
              if($.inArray(options.border, allowedColors)>=0){
                $('#farfalla_badge').css({
                  'border-left': '2px solid '+options.border,
                  'border-top': '2px solid '+options.border,
                  'border-bottom': '2px solid '+options.border
                });
                $('#farfalla_toolbar').css({
                  'border-left': '2px solid '+options.border,
                });
              }
            };


            $('#farfalla_badge_logo')
              .css({
                'background': 'url("'+farfalla_path+'images/farfalla_badge_'+detected_language+'.png")',
                'background-position':'12px 12px',
                'background-repeat':'no-repeat',
                'cursor':'url(\''+farfalla_path+'images/hand.png\'), auto'
              });

            $('#farfalla_badge')
              .mouseup(
                function(){
                  $(this).css('cursor','url(\''+farfalla_path+'images/hand.png\'), auto')
                })
              .mousedown(
                function(){
                  $(this).css('cursor','url(\''+farfalla_path+'images/grab.png\'), auto')
                })
              .mouseover(
                function(){
                  $('#farfalla_badge_label').show();
                })
              .mouseleave(
                function(){
                  $('#farfalla_badge_label').hide();
                })
              .draggable({
                'axis':'y',
                stop: function(event, ui) {
                 //save top position
                    storage.setValue("top-position", $(this).css('top'));
                }
              });

            $('#farfalla_remember_profile')
            .toggle(
              function() {
                farfalla_remember_profile();
                remember_profile = 1;
                $(this).css('background','url("'+farfalla_path+'images/save_selected.png")')
              },
              function() {
                farfalla_forget_profile();
                remember_profile = 0;
                $(this).css('background','url("'+farfalla_path+'images/save.png")')
              }
            ).qtip({
              content :  $.__('save_session'),
              position: {
                my: 'top center',
                at: 'bottom center'
              },
              style: {
                classes: 'ui-tooltip-light ui-tooltip-shadow ui-tooltip-rounded',
                width: 'auto'
              }
             });

            $('#farfalla_reset_all')
            .click(function(){
              $('.plugin_options_deactivate').click();
              $('.active').click();
              storage.clear();
              farfalla_forget_profile();
              remember_profile = 0;
              $('#farfalla_remember_profile').css('background','url("'+farfalla_path+'images/save.png")')
            }).qtip({
              content :  $.__('reset'),
              position: {
                my: 'top center',
                at: 'bottom center'
              },
              style: {
                classes: 'ui-tooltip-light ui-tooltip-shadow ui-tooltip-rounded',
                width: 'auto'
              }
             });
        };

        function farfalla_remember_profile() {
          $.cookie('farfalla_active_plugins', active_plugins, { expires: 7 })
        }

        function farfalla_forget_profile() {
          $.cookie('farfalla_active_plugins',null)
        }

        // Adds the profile selection form

        function farfalla_toolbar_populate(top) {
                  $.each(toolbar_metadata.plugins, function(){
                      var plugin = this.Plugin;
                      $('<div></div>')
                        .attr({
                          'id':plugin.name+'Activator'
                        })
                        .addClass('plugin_activator ui-corner-all')
                        .appendTo('#farfalla_toolbar_plugins');

                      $('#'+plugin.name+'Activator').qtip({
                        content :  $.__(plugin.name),
                        position: {
                          my: 'top center',
                          at: 'bottom center',
                          target: $('#'+plugin.name+'Activator')
                        },
                        style: {
                          classes: 'ui-tooltip-light ui-tooltip-shadow ui-tooltip-rounded',
                          width: 'auto'
                        }
                      })
                      .click( function(){
                          head.js(farfalla_path+'plugins/'+plugin.name+'/'+plugin.name+'.farfalla.js');
                          $(this).unbind('click'); // first click only!
                        }
                      );

                      if(plugin.visible==0){
                        $('#'+plugin.name+'Activator').hide()
                      } else {
                        $('#'+plugin.name+'Activator').css({'background':'url("'+farfalla_path+'plugins/'+plugin.name+'/icons/'+plugin.name+'.png") no-repeat'});
                      }

                    });

                    farfalla_autoactivate_plugins();
        };

        // Checks if a profile has already been selected, then initializes what is needed

        function farfalla_check_status() {
            storage.getValue("top-position", function(key, position){
                if(position) {
                    farfalla_set_top(position);
                } else if (options.top) {
                      farfalla_set_top(options.top);
                }
            })
            
              storage.getValue("show-farfalla", function(key, visible){
                  if (visible) {
                      $('#farfalla_badge').click()
                  }
              })

            farfalla_toolbar_populate();
        };


        // Adds the show/hide effect to the toolbar logo

        function farfalla_toggle_visibility() {

            $('#farfalla_badge').toggle(
              function() {
snapper.open('right');
//                $('#farfalla_toolbar').show();
                $('#farfalla_toolbar_shade').show();
//                $('#farfalla_container').animate({'width':'360px'/*,'left':$(window).width()-360+'px'*/});
                storage.setValue("show-farfalla", true);
              },
              function() {
snapper.close();
//                $('#farfalla_container').animate({'width':'0'/*,'left':$(window).width()+'px'*/});
//                $('#farfalla_toolbar').hide();
                $('#farfalla_toolbar_shade').hide();
                storage.setValue("show-farfalla", false);
              }
            );



        }


        // Set 'top' value for toolbar positioning

        function farfalla_set_top(value) {
            if (value !== null){
                $('#farfalla_badge').css('top',value);
            } else {
                $('#farfalla_badge').css('top','200px');
            }
        }


        // Track activated/deactivated plugins for consistent browsing in different pages

        function farfalla_track_plugins(name, value) {
          if(value==1){
            if(active_plugins.indexOf(name)<0){
              active_plugins.push(name);
            }
          } else {
            active_plugins.splice(active_plugins.indexOf(name),1);
          }
          if(remember_profile==1){
            farfalla_remember_profile()
          }
          $.farfalla_set_option('active_plugins',active_plugins.join(","));
        }

        function farfalla_autoactivate_plugins() {

          if($.cookie('farfalla_active_plugins')!=null){
            active = $.cookie('farfalla_active_plugins').split(',')

            $.each(active, function(index, value){
              $('#'+value+'Activator').click();
            })

            $('#farfalla_remember_profile').click();
          } else {

            $.farfalla_get_option('active_plugins', function(key, value){

                if (value){
                    active = value.split(',');
                    $.each(active, function(index, value){
                        $('#'+value+'Activator').click();
                    })
                }
            })
          }

        }


/*
    #######################################
    #                                     #
    #           Real execution...         #
    #                                     #
    #######################################
*/



// determine wether to add the toolbar or not

    if(window.location.href.search(farfalla_path)=='-1' && window.location.href.search('lisp8.formazione.unimib.it')=='-1' && window.location == window.parent.location){

        farfalla_toolbar_create();

        farfalla_check_status();

        farfalla_toggle_visibility();

// end "if" to determine wether to add the toolbar or not
    };

});
})(jQuery);
