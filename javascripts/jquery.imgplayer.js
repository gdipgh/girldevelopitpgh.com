(function($) {  
	
	$.fn.imgplayer = function(options) {

		var ip = $.imgplayer;
		var status;

	  	ip.options = $.extend( {}, $.fn.imgplayer.defaults, options ); 
				
		return this.each(function() {

			img = $(this);
			
	      	var options = $.meta ? 
	      		$.extend({}, ip.options, img.data()) : ip.options;


			ip.image 		= img; 
			ip.frame 		= 'div.' + options.frameClassName;

			ip.imageWidth 	= img.width();
			ip.imageHeight  = img.height();	
						
			ip.frames 		= options.frames;
			ip.framesNum 	= options.frames.length;

			ip.activeFrame  = options.startFrame;
			ip.nextFrame 	= parseInt(options.startFrame) + 1;		

			// Get object data & do the resize math
			target = getTargetObject(options.startFrame);
			target = resizeMath(target)

			

			img
			
				// Add page class
				.addClass('page')

				// Scale & shift image
				.css({
					marginTop: 	'-' + target.top + 'px',
					marginLeft: '-' + target.left + 'px',
					width: 		target.imgWidth,
					height: 	target.imgHeight,
				})

				// Wrap image in frame
				.wrap('<div class="' + options.frameClassName + ' loading"></div>')
			;
			
			var frame = img.parent();

			// Scale frame
			frame.css({
				overflow: 	'hidden', 
				width: 		target.width,
				height: 	target.height	
			});


			// If image loaded
			
			img.load(function(){
			
				var loadedImage = $(this);
			
				// Show frame
				if(typeof options.startEffect == 'function') {
					options.startEffect.call(this);
				} else {

					// Show image	
					switch(options.startEffect) {
						
						case 'static': 
							loadedImage.show(0, function(){ 
								onFirstLoaded(loadedImage); 
							}); 
						break;
							
						case 'fadeIn': 
							loadedImage.fadeIn(options.startFadeDuration, function(){ 
								onFirstLoaded(loadedImage); 
							}); 
						break;
					}
				}
			
				// Show controls
				initControls(target, frame);

				// Show Logo 
				if(ip.options.showLogo){
					$(frame).prepend(
						'<div class="ui logo" style="position: absolute; display: block; opacity:1; width:200px; text-align: left; top:-6px; z-index:100;">' +
						    '<a href="http://imgplayer.yaycomics.net"><img src="../imgplayer/images/logo.png" style="border:none; opacity:0.25;margin: 12px;"></a>' +
						'</div>'
					);	
				}

				/* DEV -------------------------------------------

				// UI Elements 
						
				// Fullscreen
				if($.imgplayer.options.showFullscreen){
					$(frame).prepend(
						'<div class="ui fullscreen-button" style="position: absolute; display: block; float:right; opacity:1; width:50px; text-align: right; bottom:-8px;right:0;  z-index:100;">' +
						    '<a class="goFullscreen"><img src="../imgplayer/images/fullscreen.png" style="border:none; opacity:0.25;"></a>' +
						'</div>'
					);
				}			
				$('.goFullscreen').click(function(){ $.imgplayer.goFullscreen(); });
			
				*/

				// Autoplay
				if(ip.options.autoplay) {
				
					ip.autoplay(ip.options.autoplayDelay);
					
					if(ip.options.autoplayHoverPause) {
						
						frame.hover(function(){
						
							// Todo: Move in function autoplayPause()
							ip.stopAutoplay(autoplay);
							img.stop().animate({opacity:0.4}, 200);
							//$(frame).prepend(ip.options.tplAutoplayPause); 
						
						}, function(){
						
							// Todo: Move in function autoplayContinue()
							img.stop().animate({opacity:1}, 200);
							ip.autoplay(ip.options.autoplayDelay);
							//$('.autoplay-pause').remove();
						
						});				
					}
				} 
				
				// Hover UI Buttons
				$('.ui img').hover(function(){
					$(this).stop().animate({opacity: 1});
				},function(){
					$(this).stop().animate({opacity: 0.25});
				});
				
				// onImageClick Callback	
				if(typeof ip.options.onImageClick == 'function'){
					$(frame).click(function(){
						ip.options.onImageClick.call(this);					
					});
				}


			});	// End of image .load()
		

			
			/*
			$('.navi a').hide();
			// onImageClick behaviour			
			if($.imgplayer.options.onImageClick) {
				$(frame).css('cursor', 'pointer');
				$('.navi a').hover(function(){
					$(this).show();
				}, function(){
					$(this).fadeOut();
				});
			}
			*/
			
			/* Round corners support */			
			var borderRadius = img.css('border-radius');
			var borderRadiusInt = parseInt(borderRadius);
			if(borderRadiusInt!=0) {
				img.wrap('<div class="imgplayer-borderradius" style="border-radius:'+borderRadius+'; -webkit-border-radius:'+borderRadius+'; -moz-border-radius:'+borderRadius+'; overflow:hidden; height: 100%" />'); 
			}
			
			
			
			
			
		});		
	};  

	$.fn.imgplayer.defaults = {

		frameClassName: 		'imgplayer-frame',
		framesNavElement: 		'#imgplayer-nav',
		
		maxHeight: 				$(window).height() - 250,	// Maximum height of the frame.
		maxWidth: 				$(window).width() - 200,	// Maximum width of the frame.
		
		startEffect: 			'fadeIn',					// 'fadeIn', 'static', (or a custom function)
		startFadeDuration:  	'slow', 					// 'slow', 'fast' or a number
		
		changeEffect: 			'animate', 					// 'animate', 'static', or a custom function
		
		animateDuration: 		600, 						// The animation speed (only for changeEffect 'animate')
		animateEasing: 			'swing',    				// Animation easing style (only for changeEffect 'animate')
		
		startFrame: 			1,							// First frame of the walk.

		lock:					false,
		loop: 					true,

		autoplay: 				false,
		autoplayDelay: 			3000,
		autoplayHoverPause: 	true,

		showControls: 			true,
		// showStartupControls: true,
		// showStartupImage: 	yayplayer.png
		
		controlsOpacity:  		0.4, 
		
		showLogo: 				false, 
		showFullscreen: 		false, 
		
		onImageClick: 			'prev-next',				// false, 'prev', 'next', 'prev-next' or a function to call	

		onFirstLoaded: 			function(){},		
		onStart: 				function(){},
		onComplete: 			function(){},
		
		tplBackwards:			'<div class="controls">' +
									'<a class="goto-prev prev" title="Backwards">&larr;</a>' +
								'</div>',
								
		tplForwards:			'<div class="controls">' +
			    					'<a class="goto-next next" title="Forwards">&rarr;</a>' +
								'</div>',
								
		tplPrevNext: 			'<div class="controls">' +
								    '<a class="goto-prev left" title="Backwards">&larr;</a>' + 
								    '<a class="goto-next right" title="Forwards">&rarr;</a>' +
								'</div>',

		tplAutoplayPause:		'<div class="controls autoplay-pause">' +
			    					'<span>Autoplay paused</span>' +
								'</div>',
										
		tplNaviBefore: 			'<ul class="imgplayer-navi">',
		tplNaviElement:			'',
		tplNaviAfter:			'<br style="clear:both"></ul>'
		
									
	
	}	


	/* Private methods */

	initControls = function(target, frame) {
	
		var ip = $.imgplayer;
		
		switch(ip.options.onImageClick){
			case 'prev': 	  $(frame).prepend(ip.options.tplBackwards); break;
			case 'next': 	  $(frame).prepend(ip.options.tplForwards); break;
			case 'prev-next': $(frame).prepend(ip.options.tplPrevNext);  break;
		}
		
		$('.controls a').css('height', target.height);
		

		// frameNavigation
		//$(frame).append('<div id="imgplayer-nav" style="position: absolute;bottom:0"></div>');
		//$('#imgplayer-nav').html(frameNavigation()).fadeIn();		


		// Execute option 'showControls'
		if(ip.options.showControls==false){
			$('.controls a').css('background-image', 'none');
		}		

		// Execute option 'controlsOpacity'
		$('.controls').css('opacity', ip.options.controlsOpacity);


		// Skip links
		$('.goto-prev').click(function(){ ip.gotoPrev(); });
		$('.goto-next').click(function(){ ip.gotoNext(); });
		$('.goto-full').click(function(){ ip.gotoFull(); });

		// Frame Navigation
		$(ip.options.framesNavElement)
			.css('display','none')
			.html(frameNavigation())
			.fadeIn();				

		// Goto
		$(ip.options.framesNavElement+' a').click(function(){
			var targetID   = $(this).text();
			ip.activeFrame = targetID;
			ip.nextFrame   = targetID + 1;				
			ip.goto(targetID);
		});
	}

	frameNavigation = function() {
	
		var ip = $.imgplayer;
		
		var fnum = 0;
		
		var navi = tpl('NaviBefore');
		
		$.each(ip.frames, function(key, value){
			fnum++;
			var CSSactiveClass = (fnum == ip.activeFrame) ? ' active' : '';

			//navi += tpl('NaviElement', {num:fnum, classes: CSSactiveClass}); //'<li><a title="Go to frame '+fnum+'" id="goto-'+fnum+'" class="goto-'+fnum+' button'+CSSactiveClass+'">'+fnum+'</a></li>';
			navi += '<li><a title="Go to frame '+fnum+'" id="goto-'+fnum+'" class="goto-'+fnum+' button'+CSSactiveClass+'">'+fnum+'</a></li>';
			
		});

		navi += tpl('NaviAfter');

		return navi;
	}
	
	onFirstLoaded = function(e) {
	
		var ip = $.imgplayer;
		
		$(e).parent().removeClass('loading');
		if(ip.options.onFirstLoaded){
			ip.options.onFirstLoaded.call(this);
		}
	}

	getTargetObject = function(targetData) {

		var ip = $.imgplayer;
		var target = {};	
	
		// No target delivered: return full page
		if(targetData == null) {
			target.id 			= 0;			
			target.top 			= '0';
			target.left 		= '0';
			target.width 		= ip.imageWidth;
			target.height 		= ip.imageHeight;			
			target.options 		= ip.options.frames[arrayCount(target.id)][4];												
		} 
		
		// Target is an array: assume coords		
		else if(targetData instanceof Array) {
			target.id 			= 0;			
			target.top 			= targetData[0];
			target.left 		= targetData[1];
			target.width 		= targetData[2];
			target.height 		= targetData[3];
			target.options 		= targetData[4];											
		}		

		// Target is a number: assume a frame ID
		else if (targetData > 0) {
			target.id	 		= parseInt(targetData);
			target.top 			= ip.options.frames[arrayCount(target.id)][0];
			target.left 		= ip.options.frames[arrayCount(target.id)][1];
			target.width 		= ip.options.frames[arrayCount(target.id)][2];
			target.height 		= ip.options.frames[arrayCount(target.id)][3];			
			target.options 		= ip.options.frames[arrayCount(target.id)][4];						
		}
		
		// Get format value
		target.format = getFormat(target.width, target.height);	

		return target;
	}

	getFormat = function(width, height) {
		
		if(width > height) { 
			return 'horizontal';
		} else {
			return 'vertical';
		}			
	}		
				
	resizeMath = function(target) {
	
		var ip = $.imgplayer,
			t  = target;

		diffX = ip.options.maxWidth / target.width; 
		diffY = ip.options.maxHeight / target.height; 
				
		var diff = (diffX < diffY) ? diffX : diffY;

		t.width 	= t.width * diff;
		t.height 	= t.height * diff;
		t.top 		= t.top * diff;
		t.left 	    = t.left * diff;
		t.imgWidth  = ip.imageWidth * diff;
		t.imgHeight = ip.imageHeight * diff;
		
		//alert($.imgplayer.imageHeight);
		
		return t;			
	}

	updateData = function() {
	
		var ip = $.imgplayer;

		$(ip.options.framesNavElement+' a').removeClass('active');
		$(ip.options.framesNavElement+' a#goto-'+ip.activeFrame).addClass('active');
		
		$(ip.image).attr({'title': 'Frame ' + ip.activeFrame + ' of ' + ip.framesNum + ' (click to skip)'});
	
		if(ip.options.debug) ip.debug(target);			

	};	

	gotoStatic = function(target) {
	
		var ip = $.imgplayer;
						
		$(ip.image).stop(true).css({
			marginTop: 	'-' + target.top  + 'px',
			marginLeft: '-' + target.left + 'px',
			width: 		target.imgWidth 	 + 'px',
			height: 	target.imgHeight  + 'px'							
		});
		$(ip.frame).stop(true).css({
			width: 		target.width,
			height: 	target.height				
		});		
		ip.onComplete(target.onComplete());	
	}	

	gotoAnimated = function(target) {
	
		var ip = $.imgplayer;
		
		ip.status = 'animating';
		
		$(ip.image).stop(true).animate({
			marginTop: 	'-' + target.top  + 'px',
			marginLeft: '-' + target.left + 'px',
			width: 		target.imgWidth   + 'px',
			height: 	target.imgHeight  + 'px'
		}, 	target.options.animateDuration, 
			target.options.animateEasing
		);
		$(ip.frame).stop(true).animate({
			width: 	target.width,
			height: target.height				
		}, 	target.options.animateDuration, 
			target.options.animateEasing,
			function(){ 
				ip.status = 'waiting';
				ip.onComplete(target.onComplete());
			}			
		);		
	}
	
	tpl = function(idString, vars) {
		var ip = $.imgplayer;
		eval('var tpl = ip.options.tpl'+idString+';');

		// Vars …
		
		return tpl; 
	}	

	arrayCount = function(i) {
		
		return parseInt(i) - 1;
	}
	
	
	/* Public methods */
	
	$.imgplayer = function() {};
										
	$.imgplayer.goto = function(targetID, changeEffect) {
				
		var ip = $.imgplayer;	
												
		// Build the object						
		var target = getTargetObject(targetID);
			

		if(target.options) {
		
			// Check for frame.options overwrites
			
			if(target.options.maxHeight===undefined)       target.options.maxHeight       = ip.options.maxHeight;
			if(target.options.maxWidth===undefined)        target.options.maxWidth        = ip.options.maxWidth;
			if(target.options.animateDuration===undefined) target.options.animateDuration = ip.options.animateDuration; 
			if(target.options.animateEasing===undefined)   target.options.animateEasing   = ip.options.animateEasing; 
			if(target.options.changeEffect===undefined)    target.options.changeEffect    = ip.options.changeEffect;  
			if(target.options.loop===undefined)            target.options.loop      	  = ip.options.loop;
			if(target.options.lock===undefined)            target.options.lock      	  = ip.options.lock;
			if(target.options.autoplay===undefined)        target.options.autoplay     	  = ip.options.autoplay;
					
		} else {

			target.options = {};
		}


		if(changeEffect) target.options.changeEffect = changeEffect; 
		
				
		// Exit if locked
		if (ip.options.lock && ip.status=='animating') return false;
		
		
		// Callback onStart		
		if(target.options.onStart) { 
			// Run Callback
			ip.onStart(target.options.onStart()); 
		} else {
			ip.options.onStart();
		}		
		
		// Callback onComplete				
		if(target.options.onComplete) { 
			target.onComplete = target.options.onComplete;  
		} else {
			target.onComplete = ip.options.onComplete;
		}

		// Resize frame & image
		target = resizeMath(target);				
		
		if(target.options.changeEffect===undefined) {
			target.options.changeEffect = ip.options.changeEffect
		}
				
		switch(target.options.changeEffect) {
			case 'animate': gotoAnimated(target); break;
			case 'static':  gotoStatic(target); break;
			default: 		target.options.changeEffect.call(this); 
		}
		
			
		// Update
		ip.activeFrame = parseInt(target.id);
		updateData();
		
		// Update navi buttons
		if(target.options.changeEffect=='static' || ip.options.showControls==false) {
			$('.controls a').css('height', target.height);				
		} else {
			$('.controls a').stop().animate({height: target.height});	
		}			
				
		
		// Callback onComplete		
		/*
		if(target.options && target.options.onComplete) { 
			target.options.onComplete.call(this);  
		} else {
			$.imgplayer.options.onComplete();
		}
		*/
		
	};		

	$.imgplayer.gotoNext = function(effect) {
	
		var ip = $.imgplayer;
						
		if(ip.activeFrame == ip.framesNum) {
			if(ip.options.loop == true) {
				ip.activeFrame = 0;
				TargetFrame = 1;
			}
		} else {
			ip.activeFrame = parseInt(ip.activeFrame);
			TargetFrame = parseInt(ip.activeFrame) + 1;
		}
		ip.goto(TargetFrame, effect);
	};	
			
	$.imgplayer.gotoPrev = function(effect) {
		
		var ip = $.imgplayer;
		
		if(ip.activeFrame == 1) {
			if(ip.options.loop == true) {
				TargetFrame = parseInt(ip.framesNum);
			}
		} else {
			ip.activeFrame = parseInt(ip.activeFrame);
			TargetFrame = parseInt(arrayCount(ip.activeFrame));																
		}
		ip.goto(TargetFrame, effect);											
	};

	$.imgplayer.gotoFirst = function(effect) {
	
		var ip = $.imgplayer;	
	
		ip.activeFrame = 1;
		TargetFrame = 1;
		ip.goto(TargetFrame, effect);		
	};
		
	$.imgplayer.gotoFull = function(effect) {
	
		var ip = $.imgplayer;
		
		ip.activeFrame = parseInt(ip.framesNum);
		TargetFrame = parseInt(ip.framesNum);
		ip.goto(TargetFrame, effect);		
	};
	
	$.imgplayer.onStart = function(startFunction) {
	
		var ip = $.imgplayer;
		
		if(startFunction != undefined && typeof startFunction === 'function') {
			ip.setOptions({onStart: startFunction});
		}	
	};
	
	$.imgplayer.onComplete = function(completeFunction) {
	
		var ip = $.imgplayer;
		
		if(completeFunction != undefined && typeof completeFunction === 'function') {
			ip.setOptions({onComplete: completeFunction});
		}	
	};
	
	$.imgplayer.goFullscreen = function(effect) {
		
		var 
			windowWidth  = $(window).width(),
			windowHeight = $(window).height(),
			imageframe 	 = $('.imgplayer-frame').parent().html();
		
		$('body').append(
			'<div class="imgplayer-fullscreen-bg" style="display:none">' +
				imageframe +
			'</div>'
		);
		$('.imgplayer-fullscreen-bg').fadeIn()
	};	

	$.imgplayer.autoplay = function(delay) {
		
		autoplay = setInterval('$.imgplayer.gotoNext()', delay);
	};
		
	$.imgplayer.stopAutoplay = function(autoplay) {
		
		clearInterval(autoplay);
	};	
		
	$.imgplayer.setOptions = function(options) {
		
		var ip = $.imgplayer;
	
		$.each(options, function(index, value){
			ip.options[index] = value; 
			//alert(index);
		});
	};
			
	$.imgplayer.debug = function(Frame) {
		
		var ip = $.imgplayer;
		
		if($('#imgplayer-data').length == 0) {
			$('body').append('<div id="imgplayer-data"></div>');
		} 
		
		if(Frame.options) {
			var getFrameOptions;
			for(var i in Frame.options){
			    getFrameOptions += i + ': ' + Frame.options[i] + '<br>';
			} 			
		} else {
			getFrameOptions = 'No custom frame options<br>';
		}
		
		$('#imagewalk-data').html(
			
			'FramesNum: ' 		 + ip.framesNum			+ '<br>' +		
			'activeFrame: ' 	 + ip.activeFrame		+ '<br>' +					
			'Frame.id: ' 	 	 + Frame.id 						+ '<br>' +
			'Frame.format: ' 	 + Frame.format 					+ '<br>' +
			'Frame.width: '  	 + Frame.width 						+ '<br>' +
			'Frame.height: ' 	 + Frame.height 					+ '<br>' +
			'Frame.imgWidth: '   + Frame.imgWidth 					+ '<br>' +
			'Frame.imgHeight: '  + Frame.imgHeight 					+ '<br>' +			
			'maxWidth: '     	 + ip.options.maxWidth 	+ '<br>' +
			'maxHeight: '    	 + ip.options.maxHeight 	+ '<br>' +
			'effect: '    	 	 + Frame.effect 					+ '<br>' + 
			'-------------------<br>' +
			getFrameOptions			
		);		
		// log('Frame ' + $.imgplayer.activeFrame + ' of ' + $.imgplayer.framesNum + ' 	(' + Frame.format + ') 	Width: ' + Frame.width + ' 	Height: ' + Frame.height);
	};
	
})(jQuery);  