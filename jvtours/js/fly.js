$ (function () {
  
  var $proxies = $ ('')

	var flySetPosition = function (element) {
  	var newPosition = $ (element).parent ().position ()
		newPosition = {
		 'left': newPosition.left + 'px',
		 'top':  newPosition.top + 'px'
		}
    $ (element).css (newPosition)
	}
	
	var flySetPositions = function () {
 	  $.each ($proxies, function (index, element) { flySetPosition (element) })
	}

  $ ('.fly-box').wrapInner ('<div class="fly-box__proxy" />')
  $proxies = $ ('.fly-box__proxy')
  $proxies.addClass ($ ('.fly-box').attr ('class'))  

  $ (window).resize (flySetPositions)

  flySetPositions ()

  setTimeout (function () {$proxies.addClass ('fly-box__animated')}, 333)

	 
})
