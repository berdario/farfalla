// Farfalla plugin: Readability Survey, for W4A 2012

$(function() {  

  var participant = "Andrea";
  var url = $(location).attr('href');
  


// Calculate the readability of a single block
  $.fn.elab = function (val) {   
    var results = new Array();
    var words=$(this).html().split(" ");
    var nW=words.length;
    var lW=0;
    for (var i=0; i<nW; i++) lW += words[i].length;
    var sentences=$(this).html().split(/[.;!?\n]+/);
    var nS=sentences.length;
    results[0] = lW;
    results[1] = nW;
    results[2] = nS;
    return results;
//    var readability = Math.round(89 - (10 *lW / nW ) + (300*nS/nW));
//    return readability;
  }

$.submitCount = function (participant, url, lW, nW, nS) {

      $.post(farfalla_path+'backend/counts/add', 
      {
        'data[Count][participant]': participant,
        'data[Count][url]': url,
        'data[Count][lw]': lW,
        'data[Count][nw]': nW,
        'data[Count][ns]': nS
      }, 
      function(data) {
//        alert(data);
      }
    );

}
  
$("p").each(
    function(index){
      var results = $(this).elab(index);
      $.submitCount(participant, url, results[0], results[1], results[2]);
    }
  );


});
