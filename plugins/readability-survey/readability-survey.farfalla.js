// Farfalla plugin: Readability Survey, for W4A 2012

$(function() {  


// Set some initial variables
   var totalLW = 0;
   var totalNW = 0;
   var totalNS = 0;
   var totalNP = 0;
   
// get the current page URL
  var url = $(location).attr('href');

  $('<div id="farfalla_readability"></div>').prependTo('body');

// Function to calculate the readability of a single html element using the Gulpease formula
// Inspired by the code at http://xoomer.virgilio.it/roberto-ricci/variabilialeatorie/esperimenti/leggibilita.htm

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
      totalNP = totalNP+1; 
      var results = new Array();
      results[0] = lW;
      results[1] = nW;
      results[2] = nS;
      results[3] = readability;
      results[4] = totalNP;
      return results
    }
  }

// Function to mark the readability visually, using a colored border

  $.fn.readabilityLevel = function ( readability ) {

//    $.getScript(farfalla_path +'libs/star-rating/jquery.rating.js', function(){ 
      $(this).addClass('ui-corner-all');
      
	  $(this).css({
	    'width':'50%',
	    'margin':'auto'
	  });
	  
//      $(this).html(readability);
	  
	  $(this).progressbar({
			value: readability
		});
	  
	  $('.ui-progressbar-value').css({
        '-ms-filter':'progid:DXImageTransform.Microsoft.Alpha(Opacity=30)',
        'filter': 'alpha(opacity=30)',
        '-moz-opacity':0.3,
        '-khtml-opacity': 0.3,
        'opacity': 0.6
	  });

      if(readability>=80){
        $('.ui-progressbar').css('background-color','green');
	  } else if(readability<80 && readability>=60) {
        $('.ui-progressbar').css('background-color','lightgreen');
      } else if(readability<60 && readability>=40) {
        $('.ui-progressbar').css('background-color','yellow');
      } else if(readability<40 && readability>=20) {
        $('.ui-progressbar').css('background-color','orange');
      } else if(readability<20) {
        $('.ui-progressbar').css('background-color','red');
      } 
//    });
  }
  
// Function to send the results of   
  
  $.submitCount = function (url, lW, nW, nS, readability, position) {

      $.post(farfalla_path+'backend/counts/add', 
      {
        'data[Count][url]': url,
        'data[Count][lw]': lW,
        'data[Count][nw]': nW,
        'data[Count][ns]': nS,
        'data[Count][readability]': readability,
        'data[Count][position]': position

      }
    );

}

// Cycle through the paragraphs, analysing and reporting :)
  
  $.getScript(farfalla_path +'libs/jquery.htmlClean-min.js', function(){ 
    $("p").each(
      function(index){
        var read = $(this).gulpease($(this).html(),index);
		if(read[3] && read[3]!=false){	
//          $(this).readabilityLevel(read[3]);
          totalLW += read[0];
          totalNW += read[1];
          totalNS += read[2];
//          $.submitCount(url, read[0], read[1], read[2], read[3], read[4]);
        }
      }
    );
    
    var total_readability =  Math.round(89 - (10 *totalLW / totalNW ) + (300*totalNS/totalNW));
    
    $('#farfalla_readability').readabilityLevel(total_readability);
	

    console.log(total_readability);
    console.log(totalNP);


  });

});


/*

  


});
*/
