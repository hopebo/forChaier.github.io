/**
 * demo.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2016, Codrops
 * http://www.codrops.com
 */
;(function(window) {

	'use strict';

	// taken from mo.js demos
	function isIOSSafari() {
		var userAgent;
		userAgent = window.navigator.userAgent;
		return userAgent.match(/iPad/i) || userAgent.match(/iPhone/i);
	};

	// taken from mo.js demos
	function isTouch() {
		var isIETouch;
		isIETouch = navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
		return [].indexOf.call(window, 'ontouchstart') >= 0 || isIETouch;
	};

	// taken from mo.js demos
	var isIOS = isIOSSafari(),
		clickHandler = isIOS || isTouch() ? 'touchstart' : 'click';

	function extend( a, b ) {
		for( var key in b ) {
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function Animocon(el, options) {
		this.el = el;
		this.options = extend( {}, this.options );
		extend( this.options, options );

		this.checked = false;

		this.timeline = new mojs.Timeline();

		for(var i = 0, len = this.options.tweens.length; i < len; ++i) {
			this.timeline.add(this.options.tweens[i]);
		}

		var self = this;
		this.el.addEventListener(clickHandler, function() {
			if( self.checked ) {
				self.options.onUnCheck();
			}
			else {
				self.options.onCheck();
				self.timeline.replay();
			}
			self.checked = !self.checked;
		});
	}

	Animocon.prototype.options = {
		tweens : [
			new mojs.Burst({})
		],
		onCheck : function() { return false; },
		onUnCheck : function() { return false; }
	};

	function initHeartButton() {
		var heartButton = document.querySelector('button.icobutton'), heartButtonSpan = heartButton.querySelector('span');
		var opacityCurve = mojs.easing.path('M0,0 L25.333,0 L75.333,100 L100,0');
		var translationCurve = mojs.easing.path('M0,100h25.3c0,0,6.5-37.3,15-56c12.3-27,35-44,35-44v150c0,0-1.1-12.2,9.7-33.3c9.7-19,15-22.9,15-22.9');
		var squashCurve = mojs.easing.path('M0,100.004963 C0,100.004963 25,147.596355 25,100.004961 C25,70.7741867 32.2461944,85.3230873 58.484375,94.8579105 C68.9280825,98.6531013 83.2611815,99.9999999 100,100');
		new Animocon(heartButton, {
			tweens : [
				// burst animation (circles)
				new mojs.Burst({
					parent: 		heartButton,
					count: 			6,
					radius: 		{0:130},
					degree: 		50,
					angle:      -25,
					opacity: 		0.3,
					children: {
						fill: 			'#FF6767',
						scale: 			1,
						radius: 		{'rand(5,15)':0},
						duration: 	1700,
						delay: 			350,
						easing: 		mojs.easing.bezier(0.1, 1, 0.3, 1)
					}
				}),
				new mojs.Burst({
					parent: 	heartButton,
					count: 		3,
					degree: 	0,
					radius: 	{80:250},
					angle:   	180,
					children: {
						top: 			[ 45, 0, 45 ],
						left: 		[ -15, 0, 15 ],
						shape: 		'line',
						radius: 	{60:0},
						scale: 		1,
						stroke: 	'#FF6767',
						opacity:  0.5,
						duration: 650,
						delay: 		200,
						easing: 	mojs.easing.bezier(0.1, 1, 0.3, 1)
					},
				}),
				// icon scale animation
				new mojs.Tween({
					duration : 500,
					onUpdate: function(progress) {
						var translateProgress = translationCurve(progress),
							squashProgress = squashCurve(progress),
							scaleX = 1 - 2*squashProgress,
							scaleY = 1 + 2*squashProgress;

						heartButtonSpan.style.WebkitTransform = heartButtonSpan.style.transform = 'translate3d(0,' + -180*translateProgress + 'px,0) scale3d(' + scaleX + ',' + scaleY + ',1)';

						var opacityProgress = opacityCurve(progress);
						heartButtonSpan.style.opacity = opacityProgress;

						heartButton.style.color = progress >= 0.75 ? '#FF6767' : '#C0C1C3';
					}
				})
			],
			onUnCheck : function() {
				heartButton.style.color = '#C0C1C3';
			}
		});
	}

	function autoclick() {
		var button = document.querySelector('button.icobutton');
		button.click();
	}

    function countTime(startTimeStr) {
        var startTime = new Date(startTimeStr).getTime();
        var currentTime = new Date().getTime();

        var msDiff = currentTime - startTime;

        var day = Math.floor(msDiff / (24 * 3600 * 1000));
        msDiff = msDiff % (24 * 3600 * 1000);
        var hour = Math.floor(msDiff / (3600 * 1000));
        msDiff = msDiff % (3600 * 1000);
        var minute = Math.floor(msDiff / (60 * 1000));
        msDiff = msDiff % (60 * 1000);
        var second = Math.floor(msDiff / 1000);

        return {d: day, h: hour, m: minute, s: second};
    }

    function updateLoveTime() {
        var startTimeStr = "2019/06/09 00:35";
        var obj = countTime(startTimeStr);

        $('#day').text(obj.d);
        $('#hour').text(obj.h);
        $('#minute').text(obj.m);
        $('#second').text(obj.s);
    }

    var pictures = new Array(
        "birthday.jpg", "柴二的22岁生日，和朋友在永济家中度过，祝你生日快乐",
        "graduate.jpg", "柴二同学顺利毕业啦，穿着制服好可爱",
        //"1.PNG", "aaaa"
    );

    function picturePlay() {
        var num = pictures.length / 2;
        var index = Math.floor(Math.random() * num);

        var picture = document.getElementById('picture');
		picture.style.background="url(./img/" + pictures[index * 2] + ")";
        //picture.style.backgroundSize="cover";

        $('.love-mood').text(pictures[index * 2 + 1]);
    }

    function init() {
        initHeartButton();
        updateLoveTime();
        picturePlay();
        setInterval(autoclick, 1250);
        setInterval(updateLoveTime, 1000);
        setInterval(picturePlay, 5000);
    }

    init();

})(window);
