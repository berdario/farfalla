// Farfalla plugin: Readability Survey, for W4A 2012

$(function() {  


// Set some initial variables
   var totalLW = 0;
   var totalNW = 0;
   var totalNS = 0;
   
// get the current page URL
  var url = $(location).attr('href');

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
      
      var results = new Array();
      results[0] = lW;
      results[1] = nW;
      results[2] = nS;
      results[3] = readability;
      return results
    }
  }

// Function to mark the readability visually, using a colored border

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
  
// Function to send the results of   
  
  $.submitCount = function (url, lW, nW, nS, readability) {

      $.post(farfalla_path+'backend/counts/add', 
      {
        'data[Count][url]': url,
        'data[Count][lw]': lW,
        'data[Count][nw]': nW,
        'data[Count][ns]': nS,
        'data[Count][readability]': readability
      }
    );

}

// Cycle through the paragraphs, analysing and reporting :)
  
  $.getScript(farfalla_path +'libs/jquery.htmlClean-min.js', function(){ 
    $("p").each(
      function(index){
        var read = $(this).gulpease($(this).html(),index);
		if(read[3] && read[3]!=false){	
          $(this).readabilityLevel(read[3]);
          totalLW += read[0];
          totalNW += read[1];
          totalNS += read[2];
//          $.submitCount(url, read[0], read[1], read[2], read[3]);
        }
      }
    );
    
    var total_readability =  Math.round(89 - (10 *totalLW / totalNW ) + (300*totalNS/totalNW));
    var total_readability_rev =  Math.round(89 + (300 * totalNS - 10 * totalLW)/totalNW);
    var total_readability_rev_2 =  Math.round(89 - (totalLW * 100 / totalNW )/10 + 3*(totalNS*100/totalNW));
    
    console.log(total_readability);
    console.log(total_readability_rev);
    console.log(total_readability_rev_2);


  });

});


/*

  


});
*/
