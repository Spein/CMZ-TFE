/**	
	* Template Name: Apex App
	* Version: 1.0	
	* Template Scripts
	* Author: MarkUps
	* Author URI: http://www.markups.io/

	Custom JS
	
	1. FULL OVERLAY MENU
	2. MENU SMOOTH SCROLLING
	3. VIDEO POPUP
	4. APPS SCREENSHOT SLIDEER ( SLICK SLIDER )
	5. BOOTSTRAP ACCORDION  
	
	
**/

import * as blackhole from './blackhole.js';




(function($) {

    class ProgressRing extends HTMLElement {
        constructor() {
            super();
            const stroke = this.getAttribute('stroke');
            const radius = this.getAttribute('radius');
            const normalizedRadius = radius - stroke * 2;
            this._circumference = normalizedRadius * 2 * Math.PI;

            this._root = this.attachShadow({ mode: 'open' });
            this._root.innerHTML = `
			<svg
			  height="${radius * 2}"
              width="${radius * 2}"              


			 >
			   <circle
				 stroke="#ff5a60"
				 stroke-dasharray="${this._circumference} ${this._circumference}"
				 style="stroke-dashoffset:${this._circumference}"
				 stroke-width="${stroke}"
				 fill="transparent"
				 r="${normalizedRadius}"
				 cx="${radius}"
				 cy="${radius}"
			  />
			</svg>
	  
			<style>
			  circle {              
                             
				transition: stroke-dashoffset 0.35s;
				transform: rotate(-90deg);
				transform-origin: 50% 50%;
			  }
			</style>
		  `;
        }

        setProgress(percent) {
            const offset = this._circumference - (percent * this._circumference);
            const circle = this._root.querySelector('circle');
            circle.style.strokeDashoffset = offset;
        }

        static get observedAttributes() {
            return ['progress'];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (name === 'progress') {
                this.setProgress(newValue);
            }
        }
    }

    window.customElements.define('progress-ring', ProgressRing);

    // emulate progress attribute change
    let progress = 0;
    const el = document.querySelector('progress-ring');

    const interval = setInterval(() => {
        console.log(progress)

        progress += (1 / 30);
        el.setAttribute('progress', progress);
        if (progress === 60) {
            clearInterval(interval);
            progress = 0
        }

    }, 100);

    blackhole.blackhole('#blackhole', 1, 283, 283, 255)

    function turnlogo(i) {

        var icons = [
            "far fa-heart", "fas fa-guitar", "fas fa-video", "fas fa-gamepad", "far fa-newspaper", "fas fa-palette", "fab fa-gitkraken",
        ]
        console.log()

        $("#main-icon").removeClass().addClass(icons[i]);

        if (i == 7) {
            i = 0;
            $("#main-icon").removeClass().addClass("far fa-heart");
        }


        setTimeout(function() {
            turnlogo(i + 1);

        }, 2000);
    }

    setTimeout(turnlogo(0), 5000);

    /* ----------------------------------------------------------- */
    /*  1. FULL OVERLYAY MENU
    /* ----------------------------------------------------------- */

    /*     $('.mu-menu-btn').on('click', function(event) {

            event.preventDefault();

            $('.mu-menu-full-overlay').addClass('mu-menu-full-overlay-show');

        });

        // when click colose btn

        $('.mu-menu-close-btn').on('click', function(event) {

            event.preventDefault();

            $('.mu-menu-full-overlay').removeClass('mu-menu-full-overlay-show');

        });

        // when click menu item overlay disappear

        $('.mu-menu a').on('click', function(event) {

            event.preventDefault();

            $('.mu-menu-full-overlay').removeClass('mu-menu-full-overlay-show');

        }); */

    /* ----------------------------------------------------------- */
    /*  2. MENU SMOOTH SCROLLING
    /* ----------------------------------------------------------- */

    //MENU SCROLLING WITH ACTIVE ITEM SELECTED

    $(".mu-menu a").click(function(event) {
        event.preventDefault();
        //calculate destination place
        var dest = 0;
        if ($(this.hash).offset().top > $(document).height() - $(window).height()) {
            dest = $(document).height() - $(window).height();
        } else {
            dest = $(this.hash).offset().top;
        }
        //go to destination
        $('html,body').animate({ scrollTop: dest }, 1000, 'swing');
    });



    /* ----------------------------------------------------------- */
    /*  3. VIDEO POPUP
    /* ----------------------------------------------------------- */

    $('.mu-video-play-btn').on('click', function(event) {

        event.preventDefault();

        $('.mu-video-iframe-area').addClass('mu-video-iframe-display');

    });

    // when click the close btn

    // disappear iframe window

    $('.mu-video-close-btn').on('click', function(event) {

        event.preventDefault();

        $('.mu-video-iframe-area').removeClass('mu-video-iframe-display');

    });

    // stop iframe if it is play while close the iframe window

    $('.mu-video-close-btn').click(function() {

        $('.mu-video-iframe').attr('src', $('.mu-video-iframe').attr('src'));

    });

    // when click overlay area

    $('.mu-video-iframe-area').on('click', function(event) {

        event.preventDefault();

        $('.mu-video-iframe-area').removeClass('mu-video-iframe-display');

    });

    $('.mu-video-iframe-area, .mu-video-iframe').on('click', function(e) {
        e.stopPropagation();
    });


    /* ----------------------------------------------------------- */
    /*  4. APPS SCREENSHOT SLIDEER ( SLICK SLIDER )
    /* ----------------------------------------------------------- */

    $('.mu-apps-screenshot-slider').slick({
        slidesToShow: 4,
        responsive: [{
                breakpoint: 768,
                settings: {
                    arrows: true,
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: true,
                    slidesToShow: 1
                }
            }
        ]
    });



    /* ----------------------------------------------------------- */
    /*  5. BOOTSTRAP ACCORDION 
    /* ----------------------------------------------------------- */

    /* Start for accordion #1*/
    $('#accordion .panel-collapse').on('shown.bs.collapse', function() {
        $(this).prev().find(".fa").removeClass("fa-plus").addClass("fa-minus");
    });

    //The reverse of the above on hidden event:

    $('#accordion .panel-collapse').on('hidden.bs.collapse', function() {
        $(this).prev().find(".fa").removeClass("fa-minus").addClass("fa-plus");
    });





})(jQuery);