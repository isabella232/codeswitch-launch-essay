/* Author: Mike Swartz / Upstatement */
/* March 2013 - Many things could be optimized, but here's a first pass */

$(document).ready(function() {

	var windowW = $(window).width();
	var notouch = $('html').hasClass('no-touch');
	var orig_intro_size = $('#story-intro').height();

	$(window).on('resize', function(e) {
		windowW = $(window).width();
	});

	//Nav open trigger
	$('#nav-trigger').on("click", function(){
		$('#nav').toggleClass('open');
	});

	//Notes
	$('.note-trigger').on("click", function(){
		$('.note').removeClass('highlight');
		var id = $(this).attr('id');
		var target = '#'+id+'-target';
		$target = $(target);
		$target.toggleClass('highlight');
	});
	
	//Comment Open Trigger
	$("#comment-trigger").on("click", function(){
		$(this).toggleClass("active");
		$("#disqus").toggleClass("open");
	});

	//Use Waypoints.js and data-chapter to catch the section and update the nav
	$('section').waypoint(function(){
		$('section').removeClass('on');
		var chapter_num = $(this).addClass('on').data('chapter');
		if(chapter_num !== undefined){
			$("#nav-trigger").text(chapter_num);
		}
	});

	//Initialize LocalScroll
	// http://flesler.blogspot.com/2007/10/jquerylocalscroll-10.html
	$('.toc-anchors').localScroll();

	//this function positions the title at the bottom of the cover
	function CoverBottom(){
		if(windowW>900){
			var $intro = $('.intro-mod');
			var new_margin = $('.intro-cover').height() - $intro.height();

			$intro
				.addClass('absolute')
				.css('margin-top', new_margin);
		}
	}

	function Fade(w){
		var scrollPosition = $(w).scrollTop();
		var alpha = scrollPosition/500;
		var $intro = $("#story-intro");

		var introH = $intro.height();
		if(scrollPosition<500){
			$intro.css('opacity', 1-alpha);
		}

		if(scrollPosition>introH){
			$intro.hide();
		} else {
			$intro.show();
		}
	}

	function Parallax(w){
		$('#story-intro').css('height', (orig_intro_size - ($(w).scrollTop() || 0)));
	}

	function Slide(w){
		$("#story-intro")
			.css({
				'position': 'fixed',
				'height': (orig_intro_size - ( $(this).scrollTop() || 0 ))
			});

		$("#main").css('margin-top', orig_intro_size);
	}

	function ResetTop() {
		$("#story-intro").css({'position':'static', 'margin-top': 0});
		$('.intro-mod')
			.removeClass('absolute')
			.css('margin-top', 0);

		$("#main").css('margin-top', 0);
	}

	function ShowNav(w){
		if( $(w).scrollTop()>500){
			$("#nav").addClass('on');
		} else {
			$("#nav").removeClass('on');
		}
	}

	//This funciton makes the chapter animatin happen
	function Chapters(w){
		$w = $(w).scrollTop();

		$('.ch-intro-mod').each(function(){
			var $coverMod = $(this).find('.cover-mod');

			$s = $(this).offset(); //depth of the chapter in the doc
			$h = $(this).height(); //height of the chapter intro
			$c = $coverMod.height(); //height of the title

			//When the top of the chapter hits the top of the window ...
			if($w >= $s.top){
				var x = $w - $s.top; //distance from bottom of chapter to top of window

				$(this).find('.cover').css('background-attachment', 'fixed');
				$coverMod.addClass('fixed');

				//Fix the chapter title to the top
				if(x>=($h-$c)){
					$coverMod
						.removeClass('fixed')
						.css('margin-top', $h-$c);
				}else {
					$coverMod.css('margin-top', 0);
				}

				//Make it go away when we scroll past it
				if(x>$h){
					$coverMod.css('display', 'none');
				} else {
					$coverMod.css('display', 'block');
				}
			} else {
				$(this).find('.cover').css('background-attachment', 'scroll');
				$coverMod.removeClass('fixed');
				// $(this).find('.cover-vid').css('margin-top', 0); //remove the margin from a video
			}
		});
	}

	//If you want the cover title to appear at the bottom
	if(windowW>900){
		CoverBottom();
	}

	$(window).resize(function(){
		if(windowW>900){
			CoverBottom();
		} else  {
			ResetTop();
		}
	});

	$(window).scroll(function(){
		ShowNav(this); // keep 

		if(windowW>900 && notouch){
			Slide(this);
			Fade(this);
			Chapters(this);
			// Parallax(this);  IF YOU DARE!

			if($(this).scrollTop()<=0){
				ResetTop();
				CoverBottom();
			}
		}
	});
});