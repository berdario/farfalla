// Farfalla plugin: Readability

$(function() {  




// Create dialog form
  $('body').append('<div id="dialog-form"></div>');
  $('#dialog-form').append('<p class="farfalla_alttext_form">Add an alternative text for the image</p>');
  $('#dialog-form').append('<form></form>');
  $('#dialog-form form').append('<textarea name="farfalla-original-text" style="width:100%; height: 240px;" /></textarea>');
  $('#dialog-form form').append('<textarea name="farfalla-addalt" style="width:100%; height: 240px;" /></textarea>');
  $('#dialog-form').hide()

  $( "#dialog-form" ).dialog({
    autoOpen: false,
    height: 800,
    width: '100%',
    modal: true,
    buttons: {
      "Send your proposal": function() {

        var bValid = true;

        allFields.removeClass( "ui-state-error" );

                    if ( bValid ) {
                        $( "#users tbody" ).append( "<tr>" +
                            "<td>" + name.val() + "</td>" +
                            "<td>" + email.val() + "</td>" +
                            "<td>" + password.val() + "</td>" +
                        "</tr>" );
                        $( this ).dialog( "close" );
                    }

                },
                Cancel: function() {
                    $( this ).dialog( "close" );
                }
            },
            close: function() {
                allFields.val( "" ).removeClass( "ui-state-error" );
            }
        });


// get the current page URL
  var url = $(location).attr('href');

/*
  $.canc = function () {   
    document.esper.testo.value = "";

    document.esper.indiceG.value="89 - (Lp / 10) + (3 x Fr)"
  };

*/


// Calculate the readability of a single block
// inspired by the code at http://xoomer.virgilio.it/roberto-ricci/variabilialeatorie/esperimenti/leggibilita.htm

  $.fn.gulpease = function (content, val) {
    content = $.htmlClean(content, {allowedTags:['*'], removeTags:['img']});
    var words = content.split(" ");
    var nW=words.length;
    var lW=0;
    for (var i=0; i<nW; i++) lW += words[i].length;
    var sentences=content.split(/[.;!?\n]+ /);
    var nS=sentences.length;
    if(nW==1 && nS<3){
      return false;
    } else {
      var readability = 100;
      var score = Math.round(89 - (10 *lW / nW ) + (300*nS/nW));
      // readability maximum is 100, all higher scores are ignored
      if(readability>score){ readability = score };
      // readability minimum is 0, all lower scores are ignored
      if(score<0){ readability = 0 }
//      $(this).wrap('<div class="farfalla_readability" id="readability_'+val+'">Readability index: <span class="farfalla_readability_score" id="readability_score_'+val+'"></span> <!-- <a href="#" id="farfalla_suggest_'+val+'">Suggest your own version</a>--></div>');
//      $('#readability_score_'+val).html(lW+','+nW+','+nS+','+Math.round(89 - (10 *lW / nW ) + (300*nS/nW))) // for debug
//      $('#readability_score_'+val).html(readability);
      return readability;
    }
  }

  $.fn.readabilityLevel = function ( readability ) {
	$(this).addClass('ui-corner-all');
	$(this).css('padding','1ex');
    if(readability>=75){
      $(this).css('border','3px solid green');
    } else if(readability<75 && readability>=50) {
      $(this).css('border','3px solid orange');
    } else if(readability<50 && readability>=25) {
      $(this).css('border','3px solid yellow');
    } else if(readability<25) {
      $(this).css('border','3px solid red');
    }
  }

// Create the interface for the insertion of alternative text   
  $.fn.addalt = function ( val ) {
    $('#farfalla_suggest_'+val).click(function() {
//      alert('clicked');
      $('#dialog-form').dialog('open');  
      return false;
    });
  }

  
// Send everything to the DB
  $.fn.submitAltText = function (url, xpath, alttext, language) {    
  
    $.post(farfalla_path+'backend/alttexts/add', 
      {
        'data[Alttext][xpath]': xpath,
        'data[Alttext][url]': url,
        'data[Alttext][text]': alttext,
        'data[Alttext][language_id]': language
      }, 
      function(data) {
        alert(data);
      }
    );
      
  };

  var page_readability = 0;
  var readable = 0;
  var page_text = '';
  
  jQuery.getScript(farfalla_path +'libs/jquery.htmlClean-min.js', function(){ 
    $("p:not(.farfalla_alttext_form)").each(
      function(index){
        var read = $(this).gulpease($(this).html(),index);
		if(read!=false){	
          $(this).readabilityLevel(read);
          readable = readable+=1;
          page_readability = page_readability+=read;
          page_text = page_text+$(this).html()+'. ';
        }
      }
    );

  
// number of valid paragraphs
//   console.log(readable);
// sum of single paragraph readability scores 
//   console.log(page_readability);
// mean readability
  console.log(page_readability/readable);

//  number of sentences
//  console.log($.htmlClean(page_text, {allowedTags:['*'], removeTags:['img']}).split(/[.;!?\n]+ /).length)
// complete text of the page
//  console.log($.htmlClean(page_text, {allowedTags:['*'], removeTags:['img']}))
// gulpease index
  console.log($('body').gulpease(page_text));
    
  });



});
