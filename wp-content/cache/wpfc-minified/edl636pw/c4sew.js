// source --> https://zonainfantil.ibague.gov.co/wp-content/plugins/popup-builder/public/js/PopupBuilder.js?ver=4.3.9 
function sgAddEvent(element, eventName, fn)
{
	if (element.addEventListener)
		element.addEventListener(eventName, fn, false);
	else if (element.attachEvent)
		element.attachEvent('on' + eventName, fn);
}
/*Popup order count*/
window.SGPB_ORDER = 0;

function SGPBPopup()
{
	this.id = null;
	this.eventName = '';
	this.popupData = null;
	this.additionalPopupData = {};
	this.popupConfig = {};
	this.popupObj = null;
	this.onceListener();
	this.initialsListeners();
	this.countPopupOpen = true;
	this.closeButtonDefaultPositions = {};
	this.closeButtonDefaultPositions[1] = {
		'left': 9,
		'right': 9,
		'bottom': 9
	};
	this.closeButtonDefaultPositions[2] = {
		'left': 0,
		'right': 0,
		'top': parseInt('-20'),
		'bottom': parseInt('-20')
	};
	this.closeButtonDefaultPositions[3] = {
		'right': 4,
		'bottom': 4,
		'left': 4,
		'top': 4
	};
	this.closeButtonDefaultPositions[4] = {
		'left': 12,
		'right': 12,
		'bottom': 9
	};
	this.closeButtonDefaultPositions[5] = {
		'left': 8,
		'right': 8,
		'bottom': 8
	};
	this.closeButtonDefaultPositions[6] = {
		'left': parseInt('-18.5'),
		'right': parseInt('-18.5'),
		'bottom': parseInt('-18.5'),
		'top': parseInt('-18.5')
	};
}

SGPBPopup.htmlCustomButton = function()
{
	var buttons = jQuery('.sgpb-html-custom-button');
	var buttonActionBehaviors = function(button, settings)
	{
		button.bind('click', function() {
			var behavior = settings['sgpb-custom-button'];

			if (behavior === 'redirectToURL') {
				if (settings['sgpb-custom-button-redirect-new-tab']) {
					window.open(settings['sgpb-custom-button-redirect-URL']);
				}
				else {
					window.location.href = settings['sgpb-custom-button-redirect-URL'];
				}
			}
			if (behavior === 'hidePopup') {
				SGPBPopup.closePopup();
			}
			if (behavior === 'copyToClipBoard') {
				var tempInputId = 1;
				var value = settings['sgpb-custom-button-copy-to-clipboard-text'];
				var tempInput = document.createElement("input");
				tempInput.id = tempInputId;
				tempInput.value = value;
				tempInput.style = 'position: absolute; right: -10000px';
				if (!document.getElementById(tempInputId)) {
					document.body.appendChild(tempInput);
				}
				tempInput.select();
				document.execCommand("copy");

				if (settings['sgpb-copy-to-clipboard-close-popup']) {
					SGPBPopup.closePopup();
				}

				if (settings['sgpb-custom-button-copy-to-clipboard-alert']) {
					alert(settings['sgpb-custom-button-copy-to-clipboard-message']);
				}
			}
		});
	};

	buttons.each(function() {
		var settings = jQuery.parseJSON(decodeURIComponent(jQuery(this).attr('data-options')));
		buttonActionBehaviors(jQuery(this), settings);
	});
};

SGPBPopup.listeners = function () {
	var that = this;

	sgAddEvent(window, 'sgpbPopupBuilderAdditionalDimensionSettings', function(e) {
		SGPBPopup.mobileSafariAdditionalSettings(e);
	});

	sgAddEvent(window, 'sgpbDidOpen', function(e) {
		/*for mobile landscape issue*/
		if (typeof (Event) === 'function') {
			var event = new CustomEvent('resize', {
				bubbles: true,
				cancelable: true
			});
		}
		else {
			if (SGPBPopup.isIE()) {
				var event = document.createEvent('Event');
				event.initEvent('resize', true, true);
			}
			else {
				var event = new CustomEvent('resize', {
					bubbles: true,
					cancelable: true
				});
			}
		}
		window.dispatchEvent(event);

		SGPBPopup.mobileSafariAdditionalSettings(e);
		var args = e.detail;
		var popupOptions = args.popupData;

		var obj = e.detail.currentObj.sgpbPopupObj;

		/* if no analytics extension */
		if (typeof SGPB_ANALYTICS_PARAMS === 'undefined') {
			if (obj.getCountPopupOpen()) {
				obj.addToCounter(popupOptions);
			}
		}

		if (popupOptions['sgpb-show-popup-same-user']) {
			obj.setPopupLimitationCookie(popupOptions);
		}
		SGPBPopup.htmlCustomButton();
	});

	setInterval(function() {
		var openedPopups = window.sgpbOpenedPopup || {};
		if (!Object.keys(openedPopups).length) {
			return false;
		}
		var params = {};
		params.popupsIdCollection = window.sgpbOpenedPopup;

		var data = {
			action: 'sgpb_send_to_open_counter',
			nonce: SGPB_JS_PARAMS.nonce,
			params: params
		};


		window.sgpbOpenedPopup = {};
		jQuery.post(SGPB_JS_PARAMS.ajaxUrl, data, function(res) {

		});
	}, 600);
};

SGPBPopup.mobileSafariAdditionalSettings = function(e)
{
	if (typeof e === 'undefined') {
		var args = SGPBPopup.prototype.getAdditionalPopupData();
		if (typeof args === 'undefined') {
			return false;
		}
		var popupOptions = args.popupData;
		var popupId = parseInt(args.popupId);
	}
	else {
		var args = e.detail;
		var alreadySavedArgs = SGPBPopup.prototype.getAdditionalPopupData();
		if (jQuery.isEmptyObject(alreadySavedArgs)) {
			SGPBPopup.prototype.setAdditionalPopupData(args);
		}
		var popupOptions = args.popupData;
		var popupId = parseInt(args.popupId);
	}
	var userAgent = window.navigator.userAgent;
	if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
		if (typeof popupOptions['sgpb-popup-dimension-mode'] !== 'undefined' && popupOptions['sgpb-popup-dimension-mode'] === 'responsiveMode') {
			var openedPopupWidth = parseInt(window.innerHeight-100);
			if (e.detail.popupData['sgpb-type'] === 'iframe' || e.detail.popupData['sgpb-type'] === 'video') {
				if (jQuery('.sgpb-popup-builder-content-'+popupId +' iframe').length) {
					jQuery('.sgpb-popup-builder-content-'+popupId).attr('style', 'height:'+openedPopupWidth+'px !important;');
				}
			}
		}
	}
};

SGPBPopup.prototype.setAdditionalPopupData = function(additionalPopupData)
{
	this.additionalPopupData = additionalPopupData;
};

SGPBPopup.prototype.getAdditionalPopupData = function()
{
	return this.additionalPopupData;
};

SGPBPopup.prototype.setCountPopupOpen = function(countPopupOpen)
{
	this.countPopupOpen = countPopupOpen;
};

SGPBPopup.prototype.getCountPopupOpen = function()
{
	return this.countPopupOpen;
};

SGPBPopup.playMusic = function(e) {
	var args = e.detail;
	var popupId = parseInt(args.popupId);
	var options = SGPBPopup.getPopupOptionsById(popupId);
	var soundUrl = options['sgpb-sound-url'];
	var soundStatus = options['sgpb-open-sound'];

	if (soundStatus && soundUrl && !window.SGPB_SOUND[popupId]) {
		var audio = new Audio(soundUrl);
		audio.play();
		window.SGPB_SOUND[popupId] = audio;
	}
};

SGPBPopup.floatingButton = function (e) {
	SGPBPopup.showFloatingButton(e);

	jQuery(window).on('sgpbFormSuccess', function (e){
		SGPBPopup.hideFloatingButton();
	});
};

SGPBPopup.showFloatingButton = function (e) {
	var popupObj = e || {};
	var popupId = 0;
	var shouldShowFloatingButton = true;

	/* if argument e is event reference the popup object is wrapped inside e.detail.currentObj.sgpbPopupObj  */
	if (e.hasOwnProperty('sgpbPopupObj')) {
		popupObj = e.detail.currentObj.sgpbPopupObj;
	}

	if (popupObj instanceof SGPBPopup) {
		popupId = parseInt(popupObj.id);
		shouldShowFloatingButton = popupObj.forceCheckCurrentPopupType(popupObj);
	}

	/* If there is no cookie which will prevent popup opening we will show floating button */
	if (shouldShowFloatingButton) {
		/* if we have popup id we detect exact button */
		if (popupId) {
			jQuery('.sgpb-floating-button.sg-popup-id-' + popupId).show();
		} else {
			jQuery('.sgpb-floating-button').show();
		}
	}
};

SGPBPopup.hideFloatingButton = function (popupId) {
	/* if we have popup id we detect exact button */
	if (popupId) {
		jQuery('.sgpb-floating-button.sg-popup-id-' + popupId).fadeOut();
	} else {
		jQuery('.sgpb-floating-button').fadeOut();
	}
};

SGPBPopup.prototype.initialsListeners = function()
{
	/* one time calling events (sgpbDidOpen, sgpbDidClose ...) */
	var that = this;
	sgAddEvent(window, 'sgpbDidOpen', function(e) {
		jQuery('.sg-popup-close').unbind('click').bind('click',function(){
			var currentPopupId = jQuery(this).parents('.sg-popup-builder-content').attr('data-id');
			SGPBPopup.closePopupById(currentPopupId);
		});
	});

	sgAddEvent(window, 'sgpbDidClose', function(e) {
		var args = e.detail;
		var popupId = parseInt(args.popupId);
		that.htmlIframeFilterForOpen(popupId, 'close');
	});
};

SGPBPopup.prototype.onceListener = function()
{
	var that = this;

	sgAddEvent(window, 'sgpbDidOpen', function(e) {
		document.onkeydown = function(e) {
			e = e || window.event;

			if (e.keyCode === 27) { /*esc pressed*/
				var currentPopup = that.getPopupIdForNextEsc();
				if (!currentPopup) {
					return false;
				}
				var lastPopupId = parseInt(currentPopup['popupId']);
				SGPBPopup.closePopupById(lastPopupId);
			}
		};
	});

	sgAddEvent(window, 'sgpbDidClose', function(e) {
		if (window.sgPopupBuilder.length !== 0) {
			var popups = [].concat(window.sgPopupBuilder).reverse();
			for (var i in popups) {
				var nextIndex = ++i;
				var nextObj = popups[nextIndex];

				if (typeof nextObj === 'undefined') {
					jQuery('html').removeClass('sgpb-overflow-hidden');
					jQuery('body').removeClass('sgpb-overflow-hidden-body');
					break;
				}

				if (nextObj.isOpen === false) {
					continue;
				}
				var options = SGPBPopup.getPopupOptionsById(nextObj.popupId);
				if (typeof options['sgpb-disable-page-scrolling'] === 'undefined') {
					jQuery('html').removeClass('sgpb-overflow-hidden');
					jQuery('body').removeClass('sgpb-overflow-hidden-body');
				}
				else {
					jQuery('html').addClass('sgpb-overflow-hidden');
					jQuery('body').addClass('sgpb-overflow-hidden-body');
				}
				break;
			}
		}
		else {
			jQuery('html').addClass('sgpb-overflow-hidden');
			jQuery('body').addClass('sgpb-overflow-hidden-body');
		}
	});
};

SGPBPopup.prototype.getPopupIdForNextEsc = function()
{
	var popups = window.sgPopupBuilder;
	var popup = false;

	if (!popups.length) {
		return popup;
	}

	var searchPopups = [].concat(popups).reverse();

	for (var i in searchPopups) {
		var popupData = searchPopups[i];

		if (popupData.isOpen) {
			var popupId = parseInt(popupData['popupId']);
			var popupOptions = SGPBPopup.getPopupOptionsById(popupId);

			if (!popupOptions['sgpb-disable-popup-closing'] && popupOptions['sgpb-esc-key']) {
				popup = popupData;
				break;
			}
		}
	}

	return popup;
};

SGPBPopup.prototype.setPopupId = function(popupId)
{
	this.id = parseInt(popupId);
};

SGPBPopup.prototype.getPopupId = function()
{
	return this.id;
};

SGPBPopup.prototype.setPopupObj = function(popupObj)
{
	this.popupObj = popupObj;
};

SGPBPopup.prototype.getPopupObj = function()
{
	return this.popupObj;
};

SGPBPopup.prototype.setPopupData = function(popupData)
{
	if (typeof popupData == 'string') {
		var popupData = SGPBPopup.JSONParse(popupData);
	}

	this.popupData = popupData;
};

SGPBPopup.prototype.getPopupData = function()
{
	return this.popupData;
};

SGPBPopup.prototype.setPopupConfig = function(config)
{
	this.popupConfig = config;
};

SGPBPopup.prototype.getPopupConfig = function()
{
	return this.popupConfig;
};

SGPBPopup.prototype.setUpPopupConfig = function()
{
	var popupConfig = new PopupConfig();
	this.setPopupConfig(popupConfig);
};

SGPBPopup.createPopupObjById = function(popupId)
{
	var options = SGPBPopup.getPopupOptionsById(popupId);

	if (!options) {
		return false;
	}
	var popupObj = new SGPBPopup();
	popupObj.setPopupId(popupId);
	popupObj.setPopupData(options);

	return popupObj;
};


SGPBPopup.getPopupOptionsById = function(popupId)
{
	var popupDataDiv = jQuery('#sg-popup-content-wrapper-'+popupId);

	if (!popupDataDiv.length) {
		return false;
	}
	var options = popupDataDiv.attr('data-options');

	return SGPBPopup.JSONParse(options);
};

SGPBPopup.prototype.getCompatibleZiIndex = function(popupZIndex)
{
	/*2147483647 it's maximal z index value*/
	if (popupZIndex > 2147483647) {
		return 2147483627;
	}

	return popupZIndex;
};

SGPBPopup.prototype.prepareOpen = function()
{
	var popupId = this.getPopupId();
	var popupData = this.getPopupData();
	var popupZIndex = this.getCompatibleZiIndex(popupData['sgpb-popup-z-index']);
	var popupType = this.popupData['sgpb-type'];
	this.setUpPopupConfig();
	var that = this;
	var popupConfig = this.getPopupConfig();

	function decodeEntities(encodedString)
	{
		if (typeof encodedString == 'undefined') {
			return '';
		}
		var suspiciousStrings = ['document.createElement', 'createElement', 'String.fromCharCode', 'fromCharCode'];
		for (var i in suspiciousStrings) {
			if (encodedString.indexOf(suspiciousStrings[i]) > 0) {
				return '';
			}
		}
		var textArea = document.createElement('textarea');
		textArea.innerHTML = encodedString;

		return textArea.value;
	}

	popupConfig.customShouldOpen = function()
	{
		var instructions = popupData['sgpb-ShouldOpen'];
		instructions = decodeEntities(instructions);
		var F = new Function (instructions);

		return(F());
	};

	popupConfig.customShouldClose = function()
	{
		var instructions = popupData['sgpb-ShouldClose'];
		instructions = decodeEntities(instructions);
		var F = new Function (instructions);

		return(F());
	};

	this.setPopupDimensions();

	if (popupData['sgpb-disable-popup-closing'] == 'on') {
		popupData['sgpb-enable-close-button'] = '';
		popupData['sgpb-esc-key'] = '';
		popupData['sgpb-overlay-click'] = '';
	}
	/*used in the analytics*/
	popupData['eventName'] = this.eventName;

	if (SGPBPopup.varToBool(popupData['sgpb-enable-close-button'])) {
		popupConfig.magicCall('setCloseButtonDelay', parseInt(popupData['sgpb-close-button-delay']));
	}

	popupConfig.magicCall('setShowButton', SGPBPopup.varToBool(popupData['sgpb-enable-close-button']));
	/* Convert seconds to micro seconds */
	var openAnimationSpeed = parseFloat(popupData['sgpb-open-animation-speed'])*1000;
	var closeAnimationSpeed = parseFloat(popupData['sgpb-close-animation-speed'])*1000;
	popupConfig.magicCall('setOpenAnimationEffect', popupData['sgpb-open-animation-effect']);
	popupConfig.magicCall('setCloseAnimationEffect', popupData['sgpb-close-animation-effect']);
	popupConfig.magicCall('setOpenAnimationSpeed', openAnimationSpeed);
	popupConfig.magicCall('setCloseAnimationSpeed', closeAnimationSpeed);
	popupConfig.magicCall('setOpenAnimationStatus', popupData['sgpb-open-animation']);
	popupConfig.magicCall('setCloseAnimationStatus', popupData['sgpb-close-animation']);
	popupConfig.magicCall('setContentPadding', popupData['sgpb-content-padding']);
	if (typeof SgpbRecentSalesPopupType != 'undefined') {
		if (popupType == SgpbRecentSalesPopupType) {
			/* set max z index for recent sales popup */
			popupZIndex = 2147483647;
			popupConfig.magicCall('setCloseAnimationEffect', 'fade');
			popupConfig.magicCall('setCloseAnimationSpeed', 1000);
			popupConfig.magicCall('setCloseAnimationStatus', 'on');
		}
	}

	popupConfig.magicCall('setZIndex', popupZIndex);
	popupConfig.magicCall('setCloseButtonWidth', popupData['sgpb-button-image-width']);
	popupConfig.magicCall('setCloseButtonHeight', popupData['sgpb-button-image-height']);
	popupConfig.magicCall('setPopupId', popupId);
	popupConfig.magicCall('setPopupData', popupData);
	popupConfig.magicCall('setAllowed', !SGPBPopup.varToBool(popupData['sgpb-disable-popup-closing']));
	if (popupData['sgpb-type'] == SGPB_POPUP_PARAMS.popupTypeAgeRestriction) {
		popupConfig.magicCall('setAllowed', false);
	}
	popupConfig.magicCall('setEscShouldClose', SGPBPopup.varToBool(popupData['sgpb-esc-key']));
	popupConfig.magicCall('setOverlayShouldClose', SGPBPopup.varToBool(popupData['sgpb-overlay-click']));

	popupConfig.magicCall('setScrollingEnabled', SGPBPopup.varToBool(popupData['sgpb-enable-content-scrolling']));

	if (SGPBPopup.varToBool(popupData['sgpb-content-click'])) {
		this.contentCloseBehavior();
	}
	sgAddEvent(window, 'sgpbWillOpen', function(e) {
		if (popupId != e.detail.popupId || e.detail.popupData['sgpb-content-click'] == 'undefined') {
			return false;
		}
		/* triggering any popup content click (analytics) */
		that.popupContentClick(e);
	});
	if (SGPBPopup.varToBool(popupData['sgpb-popup-fixed'])) {
		this.addFixedPosition();
	}
	/*ThemeCreator*/
	this.themeCreator();
	this.themeCustomizations();

	popupConfig.magicCall('setContents', document.getElementById('sg-popup-content-wrapper-'+popupId));
	popupConfig.magicCall('setPopupType', popupType);
	this.setPopupConfig(popupConfig);
	this.popupTriggeringListeners();

	/* check popup type, then check if popup can be opened by popup type */
	var allowToOpen = this.checkCurrentPopupType();
	if (allowToOpen) {
		this.open();
	}
};

SGPBPopup.prototype.popupContentClick = function(e)
{
	var args = e.detail;
	var popupId = parseInt(args['popupId']);
	jQuery('.sgpb-content-' + popupId).on('click', function(event) {
		var settings = {
			popupId: popupId,
			eventName: 'sgpbPopupContentclick'
		};
		jQuery(window).trigger('sgpbPopupContentclick', settings);
	});
};

SGPBPopup.prototype.forceCheckCurrentPopupType = function(popupObj)
{
	var allowToOpen = true;
	var popupConfig = new PopupConfig();
	var className = popupObj.popupData['sgpb-type'];
	if (typeof className == 'undefined' || className == 'undefined') {
		return false;
	}

	if (typeof SGPB_POPUP_PARAMS.conditionalJsClasses != 'undefined' && SGPB_POPUP_PARAMS.conditionalJsClasses.length) {
		var isAllowConditions = this.forceIsAllowJsConditions(popupObj);

		if (!isAllowConditions) {
			return false;
		}
	}

	var popupConfig = new PopupConfig();
	var className = this.popupData['sgpb-type'];
	/* make the first letter of a string uppercase, then concat prefix (uppercase all prefix string) */
	className = popupConfig.prefix.toUpperCase() + PopupConfig.firstToUpperCase(className);
	/* hasOwnProperty returns boolean value */
	if (window.hasOwnProperty(className)) {
		className = eval(className);
		/* create current popup type object */
		var obj = new className;
		/* call allowToOpen function if exists */
		if (typeof obj.allowToOpen === 'function') {
			allowToOpen = obj.allowToOpen(this.id);
			if (!allowToOpen) {
				isAllow = allowToOpen;
			}
		}
	}

	var allowToOpen = this.checkCurrentPopupType();
	if (!allowToOpen) {
		return false;
	}

	return allowToOpen;
};

SGPBPopup.prototype.checkCurrentPopupType = function()
{
	var allowToOpen = true;
	var popupConfig = new PopupConfig();

	var isPreview = parseInt(this.popupData['sgpb-is-preview']);
	if (!isNaN(isPreview) && isPreview == 1) {
		return allowToOpen;
	}

	var popupHasLimit = this.isSatistfyForShowingLimitation(this.popupData);
	if (!popupHasLimit) {
		return false;
	}

	var dontShowPopupCookieName = 'sgDontShowPopup' + this.popupData['sgpb-post-id'];
	var dontShowPopup = SGPopup.getCookie(dontShowPopupCookieName);
	if (dontShowPopup != '') {
		return false;
	}

	var className = this.popupData['sgpb-type'];
	if (typeof className == 'undefined' || className == 'undefined') {
		return false;
	}

	if (typeof SGPB_POPUP_PARAMS.conditionalJsClasses != 'undefined' && SGPB_POPUP_PARAMS.conditionalJsClasses.length) {
		var isAllowConditions = this.isAllowJsConditions();

		if (!isAllowConditions) {
			return false;
		}
	}

	/* make the first letter of a string uppercase, then concat prefix (uppercase all prefix string) */
	className = popupConfig.prefix.toUpperCase() + PopupConfig.firstToUpperCase(className);
	/* hasOwnProperty returns boolean value */
	if (window.hasOwnProperty(className)) {
		className = eval(className);
		/* create current popup type object */
		var obj = new className;
		/* call allowToOpen function if exists */
		if (typeof obj.allowToOpen === 'function') {
			allowToOpen = obj.allowToOpen(this.id);
		}
	}

	return allowToOpen;
};

SGPBPopup.prototype.forceIsAllowJsConditions = function(popupObj) {
	var conditions = SGPB_POPUP_PARAMS.conditionalJsClasses;

	var isAllow = true;

	for (var i in conditions) {
		if (!conditions.hasOwnProperty(i)) {
			break;
		}

		try {
			var className = eval(conditions[i]);
		}
		catch (e) {
			continue;
		}
		var obj = new className;
		/* call allowToOpen function if exists */
		if (typeof obj.forceAllowToOpen === 'function') {
			var popupData = this.getPopupData();
			var allowToOpen = obj.forceAllowToOpen(popupObj.id, popupObj);

			if (!allowToOpen) {
				isAllow = allowToOpen;
				break;
			}
		}
	}

	return isAllow;
};

SGPBPopup.prototype.isAllowJsConditions = function() {
	var conditions = SGPB_POPUP_PARAMS.conditionalJsClasses;
	var isAllow = true;

	for (var i in conditions) {
		if (!conditions.hasOwnProperty(i)) {
			break;
		}

		try {
			var className = eval(conditions[i]);
		}
		catch (e) {
			continue;
		}
		var obj = new className;
		/* call allowToOpen function if exists */
		if (typeof obj.allowToOpen === 'function') {
			var allowToOpen = obj.allowToOpen(this.id, this);
			if (!allowToOpen) {
				isAllow = allowToOpen;
				break;
			}
		}
	}

	return isAllow;
};

SGPBPopup.prototype.setPopupLimitationCookie = function(popupData)
{
	var cookieData = this.getPopupShowLimitationCookie(popupData);
	var cookie = cookieData.cookie || {};
	var openingCount = cookie.openingCount || 0;
	var currentUrl = window.location.href;

	if (!popupData['sgpb-show-popup-same-user-page-level']) {
		currentUrl = '';
	}
	cookie.openingCount = openingCount + 1;
	cookie.openingPage = currentUrl;
	var popupShowingLimitExpiry = parseInt(popupData['sgpb-show-popup-same-user-expiry']);

	SGPBPopup.setCookie(cookieData.cookieName, JSON.stringify(cookie), popupShowingLimitExpiry, currentUrl);
};

SGPBPopup.prototype.isSatistfyForShowingLimitation = function(popupData)
{
	/*enable||disable*/
	var popupLimitation = popupData['sgpb-show-popup-same-user'];

	/*if this option unchecked popup must be show*/
	if (!popupLimitation) {
		return true;
	}
	var cookieData = this.getPopupShowLimitationCookie(popupData);

	/*when there is not*/
	if (!cookieData.cookie) {
		return true;
	}

	return popupData['sgpb-show-popup-same-user-count'] > cookieData.cookie.openingCount;
};

SGPBPopup.prototype.getPopupShowLimitationCookie = function(popupData)
{
	var savedCookie = this.getPopupShowLimitationCookieDetails(popupData);
	var savedCookie = this.filterPopupLimitationCookie(savedCookie);

	return savedCookie;
};

SGPBPopup.prototype.filterPopupLimitationCookie = function(cookie)
{
	var result = {};
	result.cookie = '';
	if (cookie.isPageLevel) {

		result.cookieName = cookie.pageLevelCookieName;
		if (cookie.pageLevelCookie) {
			result.cookie = jQuery.parseJSON(cookie.pageLevelCookie);
		}

		SGPBPopup.deleteCookie(cookie.domainLevelCookieName);

		return result;
	}
	result.cookieName = cookie.domainLevelCookieName;
	if (cookie.domainLevelCookie) {
		result.cookie = jQuery.parseJSON(cookie.domainLevelCookie);
	}
	var currentUrl = window.location.href;

	SGPBPopup.deleteCookie(cookie.pageLevelCookieName, currentUrl);

	return result;
};

SGPBPopup.prototype.getPopupShowLimitationCookieDetails = function(popupData)
{
	var result = false;
	var currentUrl = window.location.href;
	var currentPopupId = popupData['sgpb-post-id'];

	/*Cookie names*/
	var popupLimitationCookieHomePageLevelName = 'SGPBShowingLimitationHomePage' + currentPopupId;
	var popupLimitationCookiePageLevelName = 'SGPBShowingLimitationPage' + currentPopupId;
	var popupLimitationCookieDomainName = 'SGPBShowingLimitationDomain' + currentPopupId;

	var pageLevelCookie = popupData['sgpb-show-popup-same-user-page-level'] || false;

	/*check if current url is home page*/
	if (currentUrl == SGPB_POPUP_PARAMS.homePageUrl) {
		popupLimitationCookiePageLevelName = popupLimitationCookieHomePageLevelName;
	}
	var popupLimitationPageLevelCookie = SGPopup.getCookie(popupLimitationCookiePageLevelName);
	var popupLimitationDomainCookie = SGPopup.getCookie(popupLimitationCookieDomainName);

	result = {
		'pageLevelCookieName': popupLimitationCookiePageLevelName,
		'domainLevelCookieName': popupLimitationCookieDomainName,
		'pageLevelCookie': popupLimitationPageLevelCookie,
		'domainLevelCookie': popupLimitationDomainCookie,
		'isPageLevel': pageLevelCookie
	};

	return result;
};

SGPBPopup.prototype.themeCreator = function()
{
	var noPositionSelected = false;
	var popupData = this.getPopupData();
	var popupId = this.getPopupId();
	var popupConfig = this.getPopupConfig();
	var forceRtlClass = '';
	var forceRtl = SGPBPopup.varToBool(popupData['sgpb-force-rtl']);
	var popupTheme = popupData['sgpb-popup-themes'];
	var popupType = popupData['sgpb-type'];
	var closeButtonWidth = popupData['sgpb-button-image-width'];
	var closeButtonHeight = popupData['sgpb-button-image-height'];
	var contentPadding = parseInt(popupData['sgpb-content-padding']);
	/* close button position */
	var top = parseInt(popupData['sgpb-button-position-top']);
	var right = parseInt(popupData['sgpb-button-position-right']);
	var bottom = parseInt(popupData['sgpb-button-position-bottom']);
	var left = parseInt(popupData['sgpb-button-position-left']);

	var contentClass = popupData['sgpb-content-custom-class'];
	/* for the 2-nd and 3-rd themes only */
	var popupBorder = SGPBPopup.varToBool(popupData['sgpb-disable-border']);
	var closeButtonImage = popupConfig.closeButtonImage;
	var themeNumber = 1;
	var backgroundColor = 'black';
	var borderColor = 'inherit';
	var recentSalesPopup = false;
	if (typeof SgpbRecentSalesPopupType != 'undefined') {
		if (popupType == SgpbRecentSalesPopupType) {
			recentSalesPopup = true;
			popupTheme = 'sgpb-theme-2';
			closeButtonPosition = 'topRight';
			backgroundColor = 'white';
			borderColor = '#ececec';
			top = '-10';
			right = '-10';
			popupConfig.magicCall('setShadowSpread', 1);
			popupConfig.magicCall('setContentShadowBlur', 5);
			popupConfig.magicCall('setOverlayVisible', false);
			popupConfig.magicCall('setContentShadowColor', '#000000b3');
			popupConfig.magicCall('setContentBorderRadius', '5px');
		}
	}
	var themeIndexNum = popupTheme[popupTheme.length -1];

	if (isNaN(top)) {
		top = this.closeButtonDefaultPositions[themeIndexNum].top;
	}
	if (isNaN(right)) {
		right = this.closeButtonDefaultPositions[themeIndexNum].right;
	}
	if (isNaN(bottom)) {
		bottom = this.closeButtonDefaultPositions[themeIndexNum].bottom;
	}
	if (isNaN(left)) {
		left = this.closeButtonDefaultPositions[themeIndexNum].left;
	}
	if (forceRtl) {
		forceRtlClass = ' sgpb-popup-content-direction-right';
	}
	if (popupData['sgpb-type'] == 'countdown') {
		popupConfig.magicCall('setMinWidth', 300);
	}
	popupConfig.magicCall('setContentPadding', contentPadding);
	popupConfig.magicCall('setOverlayAddClass', popupTheme+'-overlay sgpb-popup-overlay-' + popupId);
	popupConfig.magicCall('setContentAddClass', 'sgpb-content sgpb-content-'+popupId+' ' + popupTheme+'-content ' + contentClass + forceRtlClass);

	if (typeof popupData['sgpb-close-button-position'] == 'undefined' || popupData['sgpb-close-button-position'] == '') {
		/*
		 * in the old version we don't have close button position option
		 * and if noPositionSelected is true, the popup was not edited
		 */
		var noPositionSelected = true;
	}
	else {
		var closeButtonPosition = popupData['sgpb-close-button-position'];
		popupConfig.magicCall('setButtonPosition', closeButtonPosition);
	}

	if (popupTheme == 'sgpb-theme-1') {
		themeNumber = 1;
		popupConfig.magicCall('setShadowSpread', 14);
		/* 9px theme default close button position for all cases */
		if (noPositionSelected || closeButtonPosition == 'bottomRight') {
			popupConfig.magicCall('setCloseButtonPositionRight', right+'px');
			popupConfig.magicCall('setCloseButtonPositionBottom', bottom+'px');
		}
		else {
			popupConfig.magicCall('setCloseButtonPositionLeft', left+'px');
			popupConfig.magicCall('setCloseButtonPositionBottom', bottom+'px');
		}
	}
	else if (popupTheme == 'sgpb-theme-2') {
		themeNumber = 2;
		popupConfig.magicCall('setButtonInside', false);
		popupConfig.magicCall('setContentBorderWidth', 1);
		popupConfig.magicCall('setContentBackgroundColor', backgroundColor);
		popupConfig.magicCall('setContentBorderColor', borderColor);
		popupConfig.magicCall('setOverlayColor', 'white');
		var rightPosition = '0';
		var topPosition = '-' + closeButtonHeight + 'px';
		if (recentSalesPopup) {
			rightPosition = '-' + (closeButtonWidth / 2) + 'px';
			topPosition = '-' + (closeButtonHeight / 2) + 'px';
			themeNumber = 6;
		}
		if (noPositionSelected || closeButtonPosition == 'topRight') {
			/* this theme has 1px border */
			popupConfig.magicCall('setCloseButtonPositionRight', right+'px');
			popupConfig.magicCall('setCloseButtonPositionTop', top+'px');
		}
		else {
			if (closeButtonPosition == 'topLeft') {
				popupConfig.magicCall('setCloseButtonPositionLeft', left+'px');
				popupConfig.magicCall('setCloseButtonPositionTop', top+'px');
			}
			else if (closeButtonPosition == 'bottomRight') {
				popupConfig.magicCall('setCloseButtonPositionRight', right+'px');
				popupConfig.magicCall('setCloseButtonPositionBottom', bottom+'px');
			}
			else if (closeButtonPosition == 'bottomLeft') {
				popupConfig.magicCall('setCloseButtonPositionLeft', left+'px');
				popupConfig.magicCall('setCloseButtonPositionBottom', bottom+'px');
			}
		}

		if (popupBorder) {
			popupConfig.magicCall('setContentBorderWidth', 0);
		}
	}
	else if (popupTheme == 'sgpb-theme-3') {
		themeNumber = 3;
		popupConfig.magicCall('setContentBorderWidth', 5);
		popupConfig.magicCall('setContentBorderRadius', popupData['sgpb-border-radius']);
		popupConfig.magicCall('setContentBorderRadiusType', popupData['sgpb-border-radius-type']);
		popupConfig.magicCall('setContentBorderColor', popupData['sgpb-border-color']);
		var closeButtonPositionPx = '4px';
		if (popupBorder) {
			popupConfig.magicCall('setContentBorderWidth', 0);
			closeButtonPositionPx = '0px';
		}
		if (noPositionSelected) {
			popupConfig.magicCall('setCloseButtonWidth', 38);
			popupConfig.magicCall('setCloseButtonHeight', 19);
			popupConfig.magicCall('setCloseButtonPositionRight', right+'px');
			popupConfig.magicCall('setCloseButtonPositionTop', top+'px');
		}
		else {
			if (closeButtonPosition == 'topRight') {
				popupConfig.magicCall('setCloseButtonPositionRight', right+'px');
				popupConfig.magicCall('setCloseButtonPositionTop', top+'px');
			}
			else if (closeButtonPosition == 'topLeft') {
				popupConfig.magicCall('setCloseButtonPositionLeft', left+'px');
				popupConfig.magicCall('setCloseButtonPositionTop', top+'px');
			}
			else if (closeButtonPosition == 'bottomRight') {
				popupConfig.magicCall('setCloseButtonPositionLeft', right+'px');
				popupConfig.magicCall('setCloseButtonPositionBottom', bottom+'px');
			}
			else if (closeButtonPosition == 'bottomLeft') {
				popupConfig.magicCall('setCloseButtonPositionLeft', left+'px');
				popupConfig.magicCall('setCloseButtonPositionBottom', bottom+'px');
			}
		}
	}
	else if (popupTheme == 'sgpb-theme-4') {
		/* in theme-4 close button type is button,not image,
		 * then set type to button, default is image and
		 * set text
		 */
		themeNumber = 4;
		popupConfig.magicCall('setButtonImage', popupData['sgpb-button-text']);
		popupConfig.magicCall('setCloseButtonType', 'button');
		popupConfig.magicCall('setCloseButtonText', popupData['sgpb-button-text']);
		popupConfig.magicCall('setContentBorderWidth', 0);
		popupConfig.magicCall('setContentBackgroundColor', 'white');
		popupConfig.magicCall('setContentBorderColor', 'white');
		popupConfig.magicCall('setOverlayColor', 'white');
		popupConfig.magicCall('setShadowSpread', 4);
		popupConfig.magicCall('setContentShadowBlur', 8);
		/* 8px/12px theme default close button position for all cases */
		if (noPositionSelected || closeButtonPosition == 'bottomRight') {
			popupConfig.magicCall('setCloseButtonPositionRight', right+'px');
			popupConfig.magicCall('setCloseButtonPositionBottom', bottom+'px');
		}
		else {
			popupConfig.magicCall('setCloseButtonPositionLeft', left+'px');
			popupConfig.magicCall('setCloseButtonPositionBottom', bottom+'px');
		}
	}
	else if (popupTheme == 'sgpb-theme-5') {
		themeNumber = 5;
		popupConfig.magicCall('setBoxBorderWidth', 10);
		popupConfig.magicCall('setContentBorderColor', '#4B4B4B');
		if (noPositionSelected || closeButtonPosition == 'bottomRight') {
			popupConfig.magicCall('setCloseButtonPositionRight', right+'px');
			popupConfig.magicCall('setCloseButtonPositionBottom', bottom+'px');
		}
		else {
			popupConfig.magicCall('setCloseButtonPositionLeft', left+'px');
			popupConfig.magicCall('setCloseButtonPositionBottom', bottom+'px');
		}
	}
	else if (popupTheme == 'sgpb-theme-6') {
		themeNumber = 6;
		popupConfig.magicCall('setButtonInside', false);
		popupConfig.magicCall('setContentBorderRadius', 7);
		popupConfig.magicCall('setContentBorderRadiusType', 'px');
		if (noPositionSelected) {
			popupConfig.magicCall('setCloseButtonWidth', 37);
			popupConfig.magicCall('setCloseButtonHeight', 37);
			popupConfig.magicCall('setCloseButtonPositionRight', right+'px');
			popupConfig.magicCall('setCloseButtonPositionTop', top+'px');
		}
		else {
			if (typeof popupData['sgpb-button-position-right'] == 'undefined') {
				right = '-' + (closeButtonWidth / 2);
				top = '-' + (closeButtonHeight / 2);
				left = '-' + (closeButtonWidth / 2);
				bottom = '-' + (closeButtonHeight / 2);
			}
			if (closeButtonPosition == 'topRight') {
				popupConfig.magicCall('setCloseButtonPositionRight', right + 'px');
				popupConfig.magicCall('setCloseButtonPositionTop', top + 'px');
			}
			else if (closeButtonPosition == 'topLeft') {
				popupConfig.magicCall('setCloseButtonPositionLeft', left + 'px');
				popupConfig.magicCall('setCloseButtonPositionTop', top + 'px');
			}
			else if (closeButtonPosition == 'bottomRight') {
				popupConfig.magicCall('setCloseButtonPositionRight', right + 'px');
				popupConfig.magicCall('setCloseButtonPositionBottom', bottom + 'px');
			}
			else if (closeButtonPosition == 'bottomLeft') {
				popupConfig.magicCall('setCloseButtonPositionLeft', left + 'px');
				popupConfig.magicCall('setCloseButtonPositionBottom', bottom + 'px');
			}
		}
	}

	popupConfig.magicCall('setPopupTheme', themeNumber);
	if (!popupData['sgpb-button-image']) {
		closeButtonImage = SGPB_POPUP_PARAMS.defaultThemeImages[themeNumber];
		if (typeof closeButtonImage  != 'undefined') {
			popupConfig.magicCall('setButtonImage', closeButtonImage);
		}
	}
	else {
		popupConfig.magicCall('setButtonImage', 'data:image/png;base64,'+popupData['sgpb-button-image-data']);
		if (popupData['sgpb-button-image-data'] == '' || popupData['sgpb-button-image-data'].indexOf('http') != -1) {
			popupConfig.magicCall('setButtonImage', popupData['sgpb-button-image']);
		}
	}

};

SGPBPopup.prototype.themeCustomizations = function()
{
	var popupId = this.getPopupId();
	var popupData = this.getPopupData();
	var popupConfig = this.getPopupConfig();

	var contentOpacity = popupData['sgpb-content-opacity'];
	var contentBgColor = popupData['sgpb-background-color'];
	if (popupData['sgpb-background-image-data']) {
		var contentBgImage = 'data:image/png;base64,'+popupData['sgpb-background-image-data'];
	}
	else {
		var contentBgImage = popupData['sgpb-background-image'];
	}
	var showContentBackground = popupData['sgpb-show-background'];
	var contentBgImageMode = popupData['sgpb-background-image-mode'];
	var overlayColor = popupData['sgpb-overlay-color'];
	var popupTheme = popupData['sgpb-popup-themes'];
	var popupType = popupData['sgpb-type'];
	if (typeof popupData['sgpb-overlay-custom-class'] == 'undefined') {
		popupData['sgpb-overlay-custom-class'] = 'sgpb-popup-overlay';
	}
	if (typeof popupData['sgpb-popup-themes'] == 'undefined') {
		popupTheme = 'sgpb-theme-2';
	}

	if (typeof showContentBackground == 'undefined') {
		contentBgColor = '';
		contentBgImage = '';
		contentBgImageMode = '';
	}
	if (typeof SgpbRecentSalesPopupType != 'undefined') {
		if (popupType == SgpbRecentSalesPopupType) {
			showContentBackground = 'on';
			contentBgColor = popupData['sgpb-background-color'];
			contentOpacity = popupData['sgpb-content-opacity'];
		}
	}

	if (contentOpacity) {
		popupConfig.magicCall('setContentBackgroundOpacity', contentOpacity);
	}
	if (contentBgImageMode) {
		popupConfig.magicCall('setContentBackgroundMode', contentBgImageMode);
	}
	if (contentBgImage) {
		popupConfig.magicCall('setContentBackgroundImage', contentBgImage);
	}
	if (contentBgColor) {
		contentBgColor = SGPBPopup.hexToRgba(contentBgColor, contentOpacity);
		popupConfig.magicCall('setContentBackgroundColor', contentBgColor);
	}
	if (overlayColor) {
		popupConfig.magicCall('setOverlayColor', overlayColor);
	}

	var overlayClasses = popupTheme+'-overlay sgpb-popup-overlay-'+popupId;
	if (SGPB_JS_PACKAGES.extensions['advanced-closing']) {
		if (typeof popupData['sgpb-enable-popup-overlay'] != 'undefined' && popupData['sgpb-enable-popup-overlay'] == 'on') {
			popupData['sgpb-enable-popup-overlay'] = true;
		}
		else if (typeof popupData['sgpb-enable-popup-overlay'] == 'undefined') {
			popupData['sgpb-enable-popup-overlay'] = false;
		}
	}
	else {
		popupData['sgpb-enable-popup-overlay'] = true;
	}

	popupConfig.magicCall('setOverlayVisible', SGPBPopup.varToBool(popupData['sgpb-enable-popup-overlay']));
	if (typeof SgpbRecentSalesPopupType != 'undefined') {
		popupConfig.magicCall('setOverlayVisible', false);
	}
	if (SGPBPopup.varToBool(popupData['sgpb-enable-popup-overlay'])) {
		popupConfig.magicCall('setOverlayAddClass', overlayClasses + ' ' + popupData['sgpb-overlay-custom-class']);
		var overlayOpacity = popupData['sgpb-overlay-opacity'] || 0.8;
		popupConfig.magicCall('setOverlayOpacity', overlayOpacity * 100);
	}
};

SGPBPopup.prototype.formSubmissionDetection = function(args)
{
	if (args.length) {
		return false;
	}
	var popupId = args.popupId;
	var options = SGPBPopup.getPopupOptionsById(popupId);

	if (!options['sgpb-reopen-after-form-submission']) {
		return false;
	}

	jQuery('.sgpb-popup-builder-content-' + popupId + ' form').submit(function() {
		SGPBPopup.setCookie('SGPBSubmissionReloadPopup', popupId);
	});
};

SGPBPopup.prototype.htmlIframeFilterForOpen = function(popupId, popupEventName)
{
	var popupContent = jQuery('.sgpb-content-' + popupId);

	if (!popupContent.length) {
		return false;
	}

	popupContent.find('iframe').each(function() {

		if (popupEventName != 'open') {
			/* for do not affect facebook type buttons iframe only */
			if (jQuery(this).closest('.fb_iframe_widget').length) {
				return true;
			}

			/*close*/
			if (typeof jQuery(this).attr('data-attr-src') == 'undefined') {
				var src = jQuery(this).attr('src');
				if (src != '') {
					jQuery(this).attr('data-attr-src', src);
					jQuery(this).attr('src', '');
				}
				return true;
			}
			else {
				var src = jQuery(this).attr('src');
				if (src != '') {
					jQuery(this).attr('data-attr-src', src);
					jQuery(this).attr('src', '');
				}
				return true;
			}
		}
		else {
			/*open*/
			if (typeof jQuery(this).attr('data-attr-src') == 'undefined') {
				var src = jQuery(this).attr('src');
				if (src != '') {
					jQuery(this).attr('data-attr-src', src);
				}

				return true;
			}
			else {
				var src = jQuery(this).attr('data-attr-src');
				if (src != '') {
					jQuery(this).attr('src', src);
					jQuery(this).attr('data-attr-src', src);
				}
				return true;
			}
		}
	});
};

SGPBPopup.prototype.iframeSizesInHtml = function(args)
{
	var popupId = args['popupId'];
	var popupOptions = args.popupData;
	var popupContent = jQuery('.sgpb-content-' + popupId);

	if (!popupContent.length) {
		return false;
	}
	popupContent.find('iframe').each(function() {
		if (typeof jQuery(this) == 'undefined') {
			return false;
		}
		if (popupOptions['sgpb-popup-dimension-mode'] == 'customMode') {
			if (typeof jQuery(this).attr('width') == 'undefined' && typeof popupContent.attr('height') == 'undefined') {
				jQuery(this).css({'width': popupOptions['sgpb-width'], 'height': popupOptions['sgpb-height']});
			}
		}
	});
};

SGPBPopup.prototype.getSearchDataFromContent = function(content)
{
	var pattern = /\[(\[?)(pbvariable)(?![\w-])([^\]\/]*(?:\/(?!\])[^\]\/]*)*?)(?:(\/)\]|\](?:([^\[]\*+(?:\[(?!\/\2\])[^\[]\*+)\*+)\[\/\2\])?)(\]?)/gi;
	var match;
	var collectedData = [];

	while (match = pattern.exec(content)) {
		var currentSearchData = [];
		var attributes;
		var attributesKeyValue = [];
		var parseAttributes = /\s(\w+?)="(.+?)"/g;
		currentSearchData['replaceString'] = this.htmlDecode(match[0]);

		while (attributes = parseAttributes.exec(match[3])) {
			attributesKeyValue[attributes[1]] = this.htmlDecode(attributes[2]);
		}

		currentSearchData['searchData'] = attributesKeyValue;
		collectedData.push(currentSearchData);
	}

	return collectedData;
};

SGPBPopup.prototype.replaceWithCustomShortcode = function(popupId)
{
	var currentHtmlContent = jQuery('.sgpb-content-'+popupId).html();
	var searchData = this.getSearchDataFromContent(currentHtmlContent);
	var that = this;

	if (!searchData.length) {
		return false;
	}

	for (var index in searchData) {
		var currentSearchData = searchData[index];
		var searchAttributes = currentSearchData['searchData'];

		if (typeof searchAttributes['selector'] == 'undefined' || typeof searchAttributes['attribute'] == 'undefined') {
			that.replaceShortCode(currentSearchData['replaceString'], '', popupId);
			continue;
		}

		try {
			if (!jQuery(searchAttributes['selector']).length) {
				that.replaceShortCode(currentSearchData['replaceString'], '', popupId);
				continue;
			}
		}
		catch (e) {
			that.replaceShortCode(currentSearchData['replaceString'], '', popupId);
			continue;
		}

		if (searchAttributes['attribute'] == 'text') {
			var replaceName = jQuery(searchAttributes['selector']).text();
		}
		else {
			var replaceName = jQuery(searchAttributes['selector']).attr(searchAttributes['attribute']);
		}

		if (typeof replaceName == 'undefined') {
			that.replaceShortCode(currentSearchData['replaceString'], '', popupId);
			continue;
		}

		that.replaceShortCode(currentSearchData['replaceString'], replaceName, popupId);
	}
};

SGPBPopup.prototype.replaceShortCode = function(shortCode, replaceText, popupId)
{
	var popupId = parseInt(popupId);

	if (!popupId) {
		return false;
	}

	var popupContentWrapper = jQuery('.sgpb-content-' + popupId);

	if (!popupContentWrapper.length) {
		return false;
	}

	popupContentWrapper.find('div').each(function() {
		var currentHtmlContent = jQuery(this).contents();

		if (!currentHtmlContent.length) {
			return false;
		}

		currentHtmlContent.html(function(i, v) {
			if (typeof v != 'undefined') {
				return v.replace(shortCode, replaceText);
			}
		});
	});

	return true;
};

SGPBPopup.prototype.popupTriggeringListeners = function()
{
	var that = this;
	var popupData = this.getPopupData();
	var popupConfig = this.getPopupConfig();

	sgAddEvent(window, 'sgpbDidOpen', function(e) {
		var args = e.detail;
		that.iframeSizesInHtml(args);
		that.formSubmissionDetection(args);
		var popupOptions = args.popupData;

		var closeButtonDelay = parseInt(popupOptions['sgpb-close-button-delay']);
		if (closeButtonDelay) {
			that.closeButtonDisplay(popupOptions['sgpb-post-id'], 'show', closeButtonDelay);
		}
		var disablePageScrolling = popupOptions['sgpb-disable-page-scrolling'];
		if (popupOptions['sgpb-overlay-color']) {
			jQuery('.sgpb-theme-1-overlay').css({'background-image': 'none'});
		}
		if (SGPBPopup.varToBool(disablePageScrolling)) {
			jQuery('html').addClass('sgpb-overflow-hidden');
			jQuery('body').addClass('sgpb-overflow-hidden-body');
		}
	});

	sgAddEvent(window, 'sgpbWillOpen', function(e) {
		var args = e.detail;
		var popupId = parseInt(args['popupId']);
		that.htmlIframeFilterForOpen(args.popupId, 'open');
		that.replaceWithCustomShortcode(popupId);
		that.sgpbDontShowPopup(popupId);

		var closeButtonDelay = parseInt(popupData['sgpb-close-button-delay']);
		if (closeButtonDelay) {
			that.closeButtonDisplay(popupData['sgpb-post-id'], 'hide');
		}
		/* extra checker for analytics */
		var settings = {
			popupId: popupData['sgpb-post-id'],
			disabledAnalytics: popupData['sgpb-popup-counting-disabled'],
			disabledInGeneral: SGPB_POPUP_PARAMS.disableAnalyticsGeneral
		};
		jQuery(window).trigger('sgpbDisableAnalytics', settings);
	});

	sgAddEvent(window, 'sgpbShouldClose', function(e) {

	});

	sgAddEvent(window, 'sgpbWillClose', function(e) {
		var args = e.detail;
		SGPBPopup.offPopup(e.detail.currentObj);
	});
};

SGPBPopup.prototype.sgpbDontShowPopup = function(popupId)
{
	var dontShowPopup = jQuery('.sgpb-content-' + popupId).parent().find('[class*="sg-popup-dont-show"]');
	if (!dontShowPopup.length) {
		return false;
	}

	dontShowPopup.each(function() {
		jQuery(this).bind('click', function(e) {
			e.preventDefault();
			var expireTime = SGPB_POPUP_PARAMS.dontShowPopupExpireTime;
			var cookieName = 'sgDontShowPopup' + popupId;
			var classNameSearch = jQuery(this).attr('class').match(/sg-popup-dont-show/);
			var className = classNameSearch['input'];
			var customExpireTime = className.match(/sg-popup-dont-show-(\d+$)/);

			if (customExpireTime) {
				expireTime = parseInt(customExpireTime[1]);
			}

			SGPBPopup.setCookie(cookieName, expireTime, expireTime);
			SGPBPopup.closePopupById(popupId);
		});
	});
};

SGPBPopup.prototype.addToCounter = function(popupOptions)
{
	if (SGPB_POPUP_PARAMS.isPreview || (typeof popupOptions['sgpb-popup-counting-disabled'] != 'undefined')) {
		return false;
	}
	var that = this;
	var openedPopups = window.sgpbOpenedPopup || {};


	var popupId = parseInt(popupOptions['sgpb-post-id']);

	if (typeof openedPopups[popupId] == 'undefined') {
		openedPopups[popupId] = 1;
	}
	else {
		openedPopups[popupId] += 1;
	}
	window.sgpbOpenedPopup = openedPopups;
};

/*
 * closeButtonDisplay()
 * close or hide close button
 * @param popupId
 * @param display
 * @param delay
 */

SGPBPopup.prototype.closeButtonDisplay = function(popupId, display, delay)
{
	if (display == 'show') {
		setTimeout(function() {
				jQuery('.sgpb-content-' + popupId).prev().show();
			},
			delay * 1000 /* received values covert to milliseconds */
		);
	}
	else if (display == 'hide') {
		jQuery('.sgpb-content-' + popupId).prev().hide();
	}
};

SGPBPopup.prototype.open = function(args)
{
	var customEvent = this.customEvent;
	var config = this.getPopupConfig();
	var popupId = this.getPopupId();
	var eventName = this.eventName;

	if (typeof window.sgPopupBuilder == 'undefined') {
		window.sgPopupBuilder = [];
	}
	var popupData = SGPBPopup.getPopupWindowDataById(popupId);

	if (!popupData) {
		window.SGPB_ORDER += 1;
		var currentObj = {
			'eventName': eventName,
			'popupId': popupId,
			'order': window.SGPB_ORDER,
			'isOpen': true,
			'sgpbPopupObj': this
		};
		config.currentObj = currentObj;
		var popupConfig = config.combineConfigObj();
		var popup = new SGPopup(popupConfig);
		currentObj.popup = popup;
		window.sgPopupBuilder.push(currentObj);
	}
	else {
		popup = popupData['popup'];
		popupData['isOpen'] = true;
	}

	if (typeof args != 'undefined' && !args['countPopupOpen']) {
		/* don't allow to count popup opening */
		this.setCountPopupOpen(false);
	}
	popup.customEvent = customEvent;
	popup.open();
	this.setPopupObj(popup);

	/* contact form 7 form submission
	 * TODO: this must be moved to a better place in the future
	 * I'm leaving it here for now, since sgpbDidOpen() gets called way too much!
	 */
	var options = SGPBPopup.getPopupOptionsById(popupId);
	SgpbEventListener.CF7EventListener(popupId, options);
	if (typeof options['sgpb-behavior-after-special-events'] != 'undefined') {
		if (options['sgpb-behavior-after-special-events'].length) {
			options = options['sgpb-behavior-after-special-events'][0][0];
			if (options['param'] == 'contact-form-7') {
				SgpbEventListener.processCF7MailSent(popupId, options);
			}
		}
	}
};

SGPBPopup.varToBool = function(optionName)
{
	var returnValue = optionName ? true : false;

	return returnValue;
};

SGPBPopup.hexToRgba = function(hex, opacity)
{
	var c;
	if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
		c = hex.substring(1).split('');

		if (c.length == 3){
			c= [c[0], c[0], c[1], c[1], c[2], c[2]];
		}
		c = '0x'+c.join('');
		return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+opacity+')';
	}
	throw new Error('Bad Hex');
};

SGPBPopup.prototype.contentCopyToClick = function()
{
	var popupData = this.getPopupData();
	var popupId = this.getPopupId();

	var tempInputId = 'content-copy-to-click-'+popupId;
	var value = this.htmlDecode(popupData['sgpb-copy-to-clipboard-text']);
	var tempInput = document.createElement("input");
	tempInput.id = tempInputId;
	tempInput.value = value;
	tempInput.style = 'position: absolute; right: -10000px';
	if (!document.getElementById(tempInputId)) {
		document.body.appendChild(tempInput);
	}
	tempInput.select();
	document.execCommand("copy");
	document.body.removeChild(tempInput);
};

SGPBPopup.prototype.htmlDecode = function(value)
{
	return jQuery('<textarea/>').html(value).text();
};

SGPBPopup.prototype.findTargetInsideExceptionsList = function(targetName, exceptionList)
{
	var status = false;
	var popupContentMainDiv = document.getElementById('sgpb-popup-dialog-main-div');

	while (targetName.parentNode) {
		targetName = targetName.parentNode;
		if (typeof targetName.tagName == 'undefined') {
			continue;
		}
		var tagName = targetName.tagName.toLowerCase();
		if (targetName === popupContentMainDiv) {
			break;
		}
		if (exceptionList.indexOf(tagName) != -1) {
			status =  true;
			break;
		}
	}

	return status;
};

SGPBPopup.prototype.contentCloseBehavior = function()
{
	var that = this;
	var popupData = this.getPopupData();
	var popupId = this.getPopupId();
	var redirectUrl = popupData['sgpb-click-redirect-to-url'];
	var contentClickBehavior = popupData['sgpb-content-click-behavior'];
	var redirectToNewTab = SGPBPopup.varToBool(popupData['sgpb-redirect-to-new-tab']);
	var closePopupAfterCopy = SGPBPopup.varToBool(popupData['sgpb-copy-to-clipboard-close-popup']);
	var clipboardAlert = SGPBPopup.varToBool(popupData['sgpb-copy-to-clipboard-alert']);

	var separators = ['&amp;', '/&/g'];
	for (var i in separators) {
		redirectUrl = redirectUrl.split(separators[i]).join('&');
	}

	sgAddEvent(window, 'sgpbDidOpen', function(e) {

	});
	sgAddEvent(window, 'sgpbWillOpen', function(e) {
		if (popupId != e.detail.popupId || e.detail.popupData['sgpb-content-click'] == 'undefined') {
			return false;
		}
		if (contentClickBehavior == 'redirect') {
			jQuery('.sgpb-content-'+popupId).addClass('sgpb-cursor-pointer');
		}
		jQuery('.sgpb-content-'+e.detail.popupId).on('click', function(event) {
			/* we need this settings in analytics */
			var settings = {
				popupId: popupId,
				eventName: 'sgpbPopupContentClick'
			};
			jQuery(window).trigger('sgpbPopupContentClick', settings);

			if (contentClickBehavior == 'redirect') {
				if (redirectToNewTab) {
					window.open(redirectUrl);
					SGPBPopup.closePopupById(that.getPopupId());
					return;
				}
				window.location = redirectUrl;
				SGPBPopup.closePopupById(that.getPopupId());
			}
			else if (contentClickBehavior == 'copy') {
				var exceptionList = ['input', 'textarea', 'select', 'button', 'a'];
				var targetName = event.target.tagName.toLowerCase();
				var parentTagName = event.target.parentNode.tagName.toLowerCase();
				var parentsIsInExceptionsList = that.findTargetInsideExceptionsList(event.target, exceptionList);

				/*for do not copy when user click to any input element*/
				if (exceptionList.indexOf(targetName) == -1 && !parentsIsInExceptionsList) {
					that.contentCopyToClick();

					if (closePopupAfterCopy) {
						SGPBPopup.closePopupById(that.getPopupId());
					}
					if (clipboardAlert) {
						alert(popupData['sgpb-copy-to-clipboard-message'])
					}
				}
			}
			else if (popupData['sgpb-disable-popup-closing'] != 'on') {
				SGPBPopup.closePopupById(that.getPopupId());
			}
		});
	});

	sgAddEvent(window, 'sgpbDidClose', function(e) {

	});
};

SGPBPopup.prototype.addFixedPosition = function()
{
	var popupData = this.getPopupData();
	var popupId = this.getPopupId();
	var popupConfig = this.getPopupConfig();

	var fixedPosition = popupData['sgpb-popup-fixed-position'];
	var positionRight = '';
	var positionTop = '';
	var positionBottom = '';
	var positionLeft = '';

	if (fixedPosition == 1) {
		positionTop = 40;
		positionLeft = 20;
	}
	else if (fixedPosition == 2) {
		positionLeft = 'center';
		positionTop = 40;
	}
	else if (fixedPosition == 3) {
		positionTop = 40;
		positionRight = 20;
	}
	else if (fixedPosition == 4) {
		positionTop = 'center';
		positionLeft = 20;
	}
	else if (fixedPosition == 6) {
		positionTop = 'center';
		positionRight = 20;
	}
	else if (fixedPosition == 7) {
		positionLeft = 20;
		positionBottom = 2;
	}
	else if (fixedPosition == 8) {
		positionLeft = 'center';
		positionBottom = 2;
	}
	else if (fixedPosition == 9) {
		positionRight = 20;
		positionBottom = 2;
	}

	if (typeof SgpbRecentSalesPopupType != 'undefined') {
		if (popupData['sgpb-type'] == SgpbRecentSalesPopupType) {
			if (positionTop != '') {
				positionTop = parseInt(positionTop+10);
			}
			else if (positionBottom != '') {
				positionBottom = parseInt(positionBottom+10);
			}
		}
	}
	popupConfig.magicCall('setPositionTop', positionTop);
	popupConfig.magicCall('setPositionRight', positionRight);
	popupConfig.magicCall('setPositionBottom', positionBottom);
	popupConfig.magicCall('setPositionLeft', positionLeft);
};

SGPBPopup.prototype.setPopupDimensions = function()
{
	var popupData = this.getPopupData();
	var popupConfig = this.getPopupConfig();
	var popupId = this.getPopupId();
	var dimensionData = popupData['sgpb-popup-dimension-mode'];
	var maxWidth = popupData['sgpb-max-width'];
	var maxHeight = popupData['sgpb-max-height'];
	var minWidth = popupData['sgpb-min-width'];
	var minHeight = popupData['sgpb-min-height'];
	var contentPadding = popupData['sgpb-content-padding'];
	var popupType = popupData['sgpb-type'];

	popupConfig.magicCall('setMaxWidth', maxWidth);
	popupConfig.magicCall('setMaxHeight', maxHeight);
	popupConfig.magicCall('setMinWidth', minWidth);
	popupConfig.magicCall('setMinHeight', minHeight);

	if (popupType == 'image') {
		popupConfig.magicCall('setContentBackgroundImage', popupData['sgpb-image-url']);
		popupConfig.magicCall('setContentBackgroundMode', 'contain');
		if (dimensionData == 'customMode') {
			popupConfig.magicCall('setContentBackgroundPosition', 'center center');
		}
	}
	if (dimensionData == 'responsiveMode') {
		var dimensionMeasure = popupData['sgpb-responsive-dimension-measure'];
		/* for image popup type and responsive mode, set background image to fit */
		if (popupType == 'image' && dimensionMeasure != 'fullScreen') {
			popupConfig.magicCall('setContentBackgroundMode', 'fit');
			this.setMaxWidthForResponsiveImage();
		}

		var popupConfig = this.getPopupConfig();
		if (dimensionMeasure != 'auto') {
			popupConfig.magicCall('setWidth', dimensionMeasure+'%');

			popupConfig.magicCall('setContentBackgroundPosition', 'center');
		}
		else {
			var widthToSet = jQuery('.sgpb-popup-builder-content-'+popupId).width() + (contentPadding*2);

			if (isNaN(widthToSet)) {
				widthToSet = 'auto';
			}
			else {
				popupConfig.magicCall('setContentBackgroundPosition', 'center center');
				widthToSet += 'px';
			}

			popupConfig.magicCall('setWidth', widthToSet);
			if (dimensionMeasure == 'fullScreen') {
				popupConfig.magicCall('setHeight', widthToSet);
			}
		}

		return popupConfig;
	}

	var popupWidth = popupData['sgpb-width'];
	var popupHeight = popupData['sgpb-height'];

	popupConfig.magicCall('setWidth', popupWidth);
	popupConfig.magicCall('setHeight', popupHeight);

	return popupConfig;
};

SGPBPopup.prototype.setMaxWidthForResponsiveImage = function()
{
	var popupData = this.getPopupData();
	var popupConfig = this.getPopupConfig();
	var dimensionMeasure = popupData['sgpb-responsive-dimension-measure'];

	if (dimensionMeasure != 'auto') {
		var maxWidth = popupData['sgpb-max-width'];
		if (maxWidth == '') {
			popupConfig.magicCall('setMaxWidth', dimensionMeasure+'%');
			return true;
		}
		popupConfig.magicCall('setMaxWidth', dimensionMeasure+'%');
		if (maxWidth.indexOf('%') != '-1') {
			if (parseInt(maxWidth) < dimensionMeasure) {
				popupConfig.magicCall('setMaxWidth', maxWidth);
			}
		}
		else {
			var responsiveMeasureInPx = (dimensionMeasure*window.innerWidth)/100;
			if (maxWidth < responsiveMeasureInPx) {
				popupConfig.magicCall('setMaxWidth', maxWidth);
			}
		}
	}
};
SGPBPopup.JSONParse = function(data){
	return JSON.parse(atob(data, true));
};

// unused function!
SGPBPopup.b64DecodeUnicode = function(str)
{
	var Base64 = {

		/* private property */
		_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

		/* public method for decoding */
		decode : function (input) {
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;

			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			while (i < input.length) {
				enc1 = this._keyStr.indexOf(input.charAt(i++));
				enc2 = this._keyStr.indexOf(input.charAt(i++));
				enc3 = this._keyStr.indexOf(input.charAt(i++));
				enc4 = this._keyStr.indexOf(input.charAt(i++));

				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;

				output += String.fromCharCode(chr1);

				if (enc3 != 64) {
					output += String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output += String.fromCharCode(chr3);
				}

			}

			output = Base64._utf8_decode(output);

			return output;

		},

		/* private method for UTF-8 decoding */
		_utf8_decode : function (utftext) {
			var string = "";
			var i = 0;
			var c = c1 = c2 = 0;

			while (i < utftext.length) {

				c = utftext.charCodeAt(i);

				if (c < 128) {
					string += String.fromCharCode(c);
					i++;
				}
				else if ((c > 191) && (c < 224)) {
					c2 = utftext.charCodeAt(i+1);
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;
				}
				else {
					c2 = utftext.charCodeAt(i+1);
					c3 = utftext.charCodeAt(i+2);
					string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}
			}

			return string;
		}
	};

	return Base64.decode(str);
};

// unused function!
SGPBPopup.unserialize_old = function(data)
{
	data = SGPBPopup.b64DecodeUnicode(data);

	var $global = (typeof window !== 'undefined' ? window : global);

	var utf8Overhead = function(str) {
		var s = str.length;
		for (var i = str.length - 1; i >= 0; i--) {
			var code = str.charCodeAt(i);
			if (code > 0x7f && code <= 0x7ff) {
				s++;
			}
			else if (code > 0x7ff && code <= 0xffff) {
				s += 2;
			}
			/* trail surrogate */
			if (code >= 0xDC00 && code <= 0xDFFF) {
				i--;
			}
		}
		return s - 1;
	};

	var error = function(type, msg, filename, line) {
		throw new $global[type](msg, filename, line);
	};
	var readUntil = function(data, offset, stopchr) {
		var i = 2;
		var buf = [];
		var chr = data.slice(offset, offset + 1);

		while (chr !== stopchr) {
			if ((i + offset) > data.length) {
				error('Error', 'Invalid');
			}
			buf.push(chr);
			chr = data.slice(offset + (i - 1), offset + i);
			i += 1;
		}
		return [buf.length, buf.join('')];
	};
	var readChrs = function(data, offset, length) {
		var i, chr, buf;

		buf = [];
		for (i = 0; i < length; i++) {
			chr = data.slice(offset + (i - 1), offset + i);
			buf.push(chr);
			length -= utf8Overhead(chr);
		}
		return [buf.length, buf.join('')];
	};
	function _unserialize(data, offset) {
		var dtype;
		var dataoffset;
		var keyandchrs;
		var keys;
		var contig;
		var length;
		var array;
		var readdata;
		var readData;
		var ccount;
		var stringlength;
		var i;
		var key;
		var kprops;
		var kchrs;
		var vprops;
		var vchrs;
		var value;
		var chrs = 0;
		var typeconvert = function(x) {
			return x
		};

		if (!offset) {
			offset = 0
		}
		dtype = (data.slice(offset, offset + 1)).toLowerCase();

		dataoffset = offset + 2;

		switch (dtype) {
			case 'i':
				typeconvert = function(x) {
					return parseInt(x, 10);
				};
				readData = readUntil(data, dataoffset, ';');
				chrs = readData[0];
				readdata = readData[1];
				dataoffset += chrs + 1;
				break;
			case 'b':
				typeconvert = function(x) {
					return parseInt(x, 10) !== 0;
				};
				readData = readUntil(data, dataoffset, ';');
				chrs = readData[0];
				readdata = readData[1];
				dataoffset += chrs + 1;
				break;
			case 'd':
				typeconvert = function(x) {
					return parseFloat(x);
				};
				readData = readUntil(data, dataoffset, ';');
				chrs = readData[0];
				readdata = readData[1];
				dataoffset += chrs + 1;
				break;
			case 'n':
				readdata = null;
				break;
			case 's':
				ccount = readUntil(data, dataoffset, ':');
				chrs = ccount[0];
				stringlength = ccount[1];
				dataoffset += chrs + 2;

				readData = readChrs(data, dataoffset + 1, parseInt(stringlength, 10));
				chrs = readData[0];
				readdata = readData[1];
				dataoffset += chrs + 2;
				if (chrs !== parseInt(stringlength, 10) && chrs !== readdata.length) {
					error('SyntaxError', 'String length mismatch')
				}
				break;
			case 'a':
				readdata = {};

				keyandchrs = readUntil(data, dataoffset, ':');
				chrs = keyandchrs[0];
				keys = keyandchrs[1];
				dataoffset += chrs + 2;

				length = parseInt(keys, 10);
				contig = true;

				for (i = 0; i < length; i++) {
					kprops = _unserialize(data, dataoffset);
					kchrs = kprops[1];
					key = kprops[2];
					dataoffset += kchrs;

					vprops = _unserialize(data, dataoffset);
					vchrs = vprops[1];
					value = vprops[2];
					dataoffset += vchrs;

					if (key !== i) {
						contig = false;
					}

					readdata[key] = value;
				}

				if (contig) {
					array = new Array(length);
					for (i = 0; i < length; i++) {
						array[i] = readdata[i];
					}
					readdata = array;
				}

				dataoffset += 1;
				break;
			default:
				error('SyntaxError', 'Unknown / Unhandled data type(s): ' + dtype);
				break;
		}

		return [dtype, dataoffset - offset, typeconvert(readdata)]
	}

	return _unserialize((data + ''), 0)[2];
};

SGPBPopup.closePopup = function()
{
	var popupObjs = window.sgPopupBuilder;
	var lastPopupObj = this.getLastPopup();

	if (typeof lastPopupObj == 'undefined') {
		return false;
	}

	var popupId = lastPopupObj.popupId;

	SGPBPopup.closePopupById(popupId);
};

SGPBPopup.closePopupById = function(popupId)
{
	var popupObjs = window.sgPopupBuilder;
	if (!popupObjs.length) {
		return;
	}

	for (var i in popupObjs) {

		var currentObj = popupObjs[i];

		if (currentObj.popupId == popupId) {
			var popupObj = popupObjs[i]['popup'];
			if (popupObj) {
				/*Send true argument to don’t count disable popup option*/
				popupObj.close(true);
			}
		}
	}
};

SGPBPopup.getPopupWindowDataById = function(popupId)
{
	var popups = window.sgPopupBuilder;
	var popup = false;

	if (typeof popups == 'undefined' || !popups.length) {
		return popup;
	}

	for (var i in popups) {
		var popupData = popups[i];

		if (popupData.popupId == popupId) {
			popup = popupData;
			break;
		}
	}

	return popup;
};

SGPBPopup.findPopupObjById = function(popupId)
{
	var popup = false;
	var popupData = SGPBPopup.getPopupWindowDataById(popupId);

	if (popupData) {
		popup = popupData['popup'];
	}

	return popup;
};

SGPBPopup.getLastPopup = function()
{
	var popups = window.sgPopupBuilder;
	var popup = false;

	if (!popups.length) {
		return popup;
	}

	var searchPopups = [].concat(popups);

	for (var i in searchPopups) {
		var popupData = searchPopups[i];

		if (popupData.isOpen) {
			popup = popupData;
			break;
		}
	}

	return popup;
};

SGPBPopup.offPopup = function(currentPopup)
{
	var popups = window.sgPopupBuilder;

	if (!popups.length) {
		return false;
	}

	for (var i in popups) {
		var popupData = popups[i];

		if (popupData.order == currentPopup.order && popupData.eventName == currentPopup.eventName) {
			popups[i]['isOpen'] = false;
			break;
		}
	}

	return true;
};

SGPBPopup.capitalizeFirstLetter = function(string)
{
	return string.charAt(0).toUpperCase() + string.slice(1);
};

SGPBPopup.getParamFromUrl = function(param)
{
	var url = window.location.href;
	param = param.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + param + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) {
		return null;
	}
	if (!results[2]) {
		return '';
	}
	return decodeURIComponent(results[2].replace(/\+/g, " "));
};

/*
 *
 * SGPBPopup Cookies' settings
 *
 */
SGPBPopup.setCookie = function(cName, cValue, exDays, cPageLevel)
{
	var sameSite = 'Lax';
	var isPreview = SGPBPopup.getParamFromUrl('preview');
	if (isPreview) {
		return false;
	}
	var expirationDate = new Date();
	var cookiePageLevel = '';
	var cookieExpirationData = 1;
	if (!exDays || isNaN(exDays)) {
		if (!exDays && exDays === 0) {
			exDays = 'session';
		}
		else {
			exDays = 365*50;
		}
	}

	if (!Boolean(cPageLevel)) {
		cookiePageLevel = 'path=/;';
	}

	if (exDays == 'session') {
		cookieExpirationData = 0;
	}
	else {
		expirationDate.setDate(parseInt(expirationDate.getDate() + parseInt(exDays)));
		cookieExpirationData = expirationDate.toUTCString();
	}
	var expires = 'expires='+cookieExpirationData;
	if (exDays == -1) {
		expires = '';
	}

	if (!cookieExpirationData) {
		expires = '';
	}

	/* in IE there is no need to specify the path */
	if (SGPBPopup.isIE()) {
		cookiePageLevel = '';
	}

	var value = cValue+((exDays == null) ? ';' : '; '+expires+';'+cookiePageLevel+'; SameSite=' + sameSite);
	document.cookie = cName + '=' + value;
};

SGPBPopup.isIE = function()
{
	ua = navigator.userAgent;
	/* MSIE used to detect old browsers and Trident used to newer ones*/
	var isIe = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;

	return isIe;
};

SGPBPopup.getCookie = function(cName)
{
	var name = cName + '=';
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}

	return '';
};

/*
 *
 * Delete the cookie by expiring it
 *
 */

SGPBPopup.deleteCookie = function(cName, cPath)
{
	if (!cPath) {
		cPath = 'path=/;';
	}

	document.cookie = cName + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;' + cPath;
};

/**
 *
 * @SgpbEventListener listen Events and call corresponding events
 *
 */

function SgpbEventListener()
{
	this.evenets = null;
	this.popupObj = {};
}

SgpbEventListener.inactivityIdicator = 0;

SgpbEventListener.prototype.setEvents = function(events)
{
	this.evenets = events;
};

SgpbEventListener.prototype.getEvents = function()
{
	return this.evenets;
};

SgpbEventListener.prototype.setPopupObj = function(popupObj)
{
	this.popupObj = popupObj;
};

SgpbEventListener.prototype.getPopupObj = function()
{
	return this.popupObj;
};

SgpbEventListener.eventsListenerAfterDocumentReady = function()
{
	window.SGPB_SOUND = [];

	sgAddEvent(window, 'sgpbDidOpen', function(e) {
		SGPBPopup.playMusic(e);
	});

	sgAddEvent(window, 'sgpbDidClose', function(e) {
		var args = e.detail;
		var popupId = parseInt(args.popupId);
		if (typeof window.SGPB_SOUND[popupId] && window.SGPB_SOUND[popupId]) {
			window.SGPB_SOUND[popupId].pause();
			delete window.SGPB_SOUND[popupId];
		}
	});
};

SgpbEventListener.init = function()
{
	SgpbEventListener.eventsListenerAfterDocumentReady();
	var popupsData = jQuery('.sg-popup-builder-content');

	if (!popupsData) {
		return '';
	}

	var that = this;

	popupsData.each(function() {
		var popupObj = that.popupObjCreator(jQuery(this));
		SGPBPopup.floatingButton(popupObj);
	});
};

SgpbEventListener.popupObjCreator = function(currentData)
{
	var popupId = currentData.data('id');
	var popupData = currentData.data('options');

	var events = currentData.attr('data-events');
	events = jQuery.parseJSON(events);

	SgpbEventListener.reopenAfterFormSubmission(popupData);

	var popupObj = new SGPBPopup();
	popupObj.setPopupId(popupId);
	popupObj.setPopupData(popupData);

	for (var i in events) {
		var obj = new this;
		obj.setPopupObj(popupObj);
		obj.eventListener(events[i]);
	}

	return popupObj;
};

SgpbEventListener.prototype.eventListener = function(eventData)
{
	if (eventData == null) {
		return '';
	}
	var event = '';
	if (typeof eventData == 'string') {
		event = eventData;
	}
	else if (typeof eventData.param != 'undefined') {
		event = eventData.param;
	}

	if (!event) {
		return false;
	}

	var popupObj = this.getPopupObj();
	var popupData = popupObj.getPopupData();

	if (eventData.value == '') {
		eventData.value = popupData['sgpb-popup-delay'];
	}

	var eventName = SGPBPopup.capitalizeFirstLetter(event);

	eventName = 'sgpb'+eventName;
	popupObj.eventName = eventName;

	var allowToOpen = popupObj.forceCheckCurrentPopupType(popupObj);

	if (!allowToOpen) {
		return false;
	}
	try {
		eval('this.'+eventName)(this, eventData);
	}
	catch (err) {
		console.log(err)
	}

};

SgpbEventListener.reopenAfterFormSubmission = function(eventData)
{
	var popupId = SGPBPopup.getCookie('SGPBSubmissionReloadPopup');
	popupId = parseInt(popupId);

	if (!popupId) {
		return false;
	}
	var popupObj = SGPBPopup.createPopupObjById(popupId);
	if (!popupObj) {
		return false;
	}
	var options = popupObj.getPopupData();

	if (!options['sgpb-reopen-after-form-submission']) {
		return false;
	}

	popupObj.prepareOpen();
	SGPBPopup.deleteCookie('SGPBSubmissionReloadPopup');
};

SgpbEventListener.prototype.sgpbLoad = function(listenerObj, eventData)
{
	var timeout = parseInt(eventData.value);
	var popupObj = listenerObj.getPopupObj();
	var popupOptions = popupObj.getPopupData();
	timeout *= 1000;
	var timerId,
		repetitiveTimeout = null;


	/* same as checkCurrentPopupType(), but it fires ignoring any delay (etc. onload delay) */
	popupObj.forceCheckCurrentPopupType(popupObj);


	var openOnLoadPopup = function() {
		setTimeout(function() {
			jQuery(window).trigger('sgpbLoadEvent', popupOptions);
			popupObj.prepareOpen();
		}, timeout);
	};
	sgAddEvent(window, 'load', openOnLoadPopup(timeout, popupObj));
	sgAddEvent(window, 'sgpbDidOpen', function(e) {
		var args = e.detail;
		clearInterval(repetitiveTimeout);
	});

	sgAddEvent(window, 'sgpbDidClose', function(e) {
		var args = e.detail;
		var options = popupObj.getPopupData();
		if (SGPBPopup.varToBool(eventData['repetitive'])) {
			var intervalTime = parseInt(eventData['value'])*1000;
			repetitiveTimeout = setInterval(function() {
				popupObj.prepareOpen();
			}, intervalTime);
		}
	});
};

SgpbEventListener.prototype.timerIncrement = function(listenerObj , idleInterval)
{
	var lastActivity = SgpbEventListener.inactivityIdicator;

	if (lastActivity == 0) {
		clearInterval(idleInterval);
		listenerObj.getPopupObj().prepareOpen();
	}
	SgpbEventListener.inactivityIdicator = 0;
};

SgpbEventListener.prototype.sgpbInsideclick = function(listenerObj, eventData)
{
	sgAddEvent(window, 'sgpbDidOpen', function(e) {
		var args = e.detail;
		var that = listenerObj;
		var popupObj = that.getPopupObj();
		var popupId = parseInt(popupObj.id);
		var targetClick = jQuery('.sgpb-content .sgpb-popup-id-'+popupId);

		if (!targetClick.length) {
			return false;
		}

		targetClick.each(function() {
			jQuery(this).unbind('click').bind('click', function() {
				var dontCloseCurrentPopup = jQuery(this).attr('dontCloseCurrentPopup');
				if (typeof dontCloseCurrentPopup == 'undefined' || dontCloseCurrentPopup != 'on') {
					SGPBPopup.closePopup();
				}
				popupObj.prepareOpen();
			});
		});
	});
};

SgpbEventListener.prototype.sgpbClick = function(listenerObj, eventData)
{
	var that = listenerObj;
	var popupIds = [];
	var popupObj = that.getPopupObj();
	var popupOptions = popupObj.getPopupData();
	var popupId = parseInt(popupObj.id);
	popupIds.push(popupId);
	var mapId = listenerObj.filterPopupId(popupId);
	popupIds.push(mapId);
	if (jQuery.inArray(mapId, popupIds) === -1) {
		popupIds.push(mapId);
	}

	for(var key in popupIds) {
		var popupId = popupIds[key];
		if (!popupIds.hasOwnProperty(key)) {
			return false;
		}
		var targetClick = jQuery('a[href*="#sg-popup-id-' + popupId + '"], .sg-popup-id-' + popupId + ', .sgpb-popup-id-' + popupId);

		if (typeof eventData.operator != 'undefined' && eventData.operator == 'clickActionCustomClass') {
			targetClick = jQuery('a[href*="#sg-popup-id-' + popupId + '"], .sg-popup-id-' + popupId + ', .sgpb-popup-id-' + popupId+', .'+eventData.value);
		}
		if (!targetClick.length) {
			continue;
		}
		var delay = parseInt(popupOptions['sgpb-popup-delay']) * 1000;
		var clickCount = 1;
		targetClick.each(function() {

			if (!jQuery(this).attr('data-popup-id')) {
				jQuery(this).attr('data-popup-id', popupId);
			}
			var currentTarget = jQuery(this);
			currentTarget.bind('swipe', function(e) {
				return false;
			});
			currentTarget.bind('click', function(e) {
				if (clickCount > 1) {
					return true;
				}

				var allowToOpen = popupObj.forceCheckCurrentPopupType(popupObj);
				if (!allowToOpen) {
					return true;
				}
				++clickCount;
				jQuery(window).trigger('sgpbClickEvent', popupOptions);
				var popupId = jQuery(this).data('popup-id');
				setTimeout(function() {

					var popupObj = SGPBPopup.createPopupObjById(popupId);
					if (!popupObj) {
						var mapId = listenerObj.filterPopupId(popupId);
						popupObj = SGPBPopup.createPopupObjById(mapId);
					}
					popupObj.customEvent = 'Click';
					popupObj.prepareOpen();
					clickCount = 1;
				}, delay);

				return false;
			});
		});
	}
};

SgpbEventListener.prototype.sgpbHover = function(listenerObj, eventData)
{
	var that = listenerObj;
	var popupObj = that.getPopupObj();

	if (!popupObj) {
		return false;
	}
	var popupIds = [];
	var popupOptions = popupObj.getPopupData();
	var popupId = parseInt(popupObj.id);
	popupIds.push(popupId);
	var mapId = listenerObj.filterPopupId(popupId);
	if (jQuery.inArray(mapId, popupIds) === -1) {
		popupIds.push(mapId);
	}

	for(var key in popupIds) {
		var popupId = popupIds[key];
		if (!popupIds.hasOwnProperty(key)) {
			return false;
		}

		var hoverSelector = jQuery('.sg-popup-hover-' + popupId + ', .sgpb-popup-id-' + popupId + '[data-popup-event="hover"]');

		if (typeof eventData.operator != 'undefined' && eventData.operator == 'hoverActionCustomClass') {
			hoverSelector = jQuery('.sg-popup-hover-' + popupId + ', .sgpb-popup-id-' + popupId + '[data-popup-event="hover"]'+', .'+eventData.value);
		}

		if (!hoverSelector) {
			return false;
		}
		var hoverCount = 1;
		var delay = parseInt(popupOptions['sgpb-popup-delay']) * 1000;

		hoverSelector.each(function () {
			if (!jQuery(this).attr('data-popup-id')) {
				jQuery(this).attr('data-popup-id', popupId);
			}
			jQuery(this).bind('mouseenter', function() {
				if (hoverCount > 1) {
					return false;
				}
				++hoverCount;
				var popupId = jQuery(this).data('popup-id');
				jQuery(window).trigger('sgpbHoverEvent', popupOptions);
				setTimeout(function() {
					var popupObj = SGPBPopup.createPopupObjById(popupId);
					if (!popupObj) {
						var mapId = listenerObj.filterPopupId(popupId);
						popupObj = SGPBPopup.createPopupObjById(mapId);
					}
					popupObj.customEvent = 'Hover';
					popupObj.prepareOpen();
					hoverCount = 1;
				}, delay);
			});
		});
	}
};

SgpbEventListener.prototype.sgpbConfirm = function(listenerObj, eventData)
{
	var that = listenerObj;
	var popupObj = that.getPopupObj();

	if (!popupObj) {
		return false;
	}
	var popupIds = [];
	var popupOptions = popupObj.getPopupData();
	var popupId = parseInt(popupObj.id);
	popupIds.push(popupId);
	var mapId = listenerObj.filterPopupId(popupId);
	popupIds.push(mapId);

	for(var key in popupIds) {
		var popupId = popupIds[key];
		if (!popupIds.hasOwnProperty(key)) {
			return false;
		}

		var confirmSelector = jQuery('.sg-confirm-popup-' + popupId);

		if (!confirmSelector) {
			return false;
		}
		var confirmCount = 1;

		confirmSelector.bind('click', function(e) {
			if (confirmCount > 1) {
				return false;
			}
			++confirmCount;
			var allowToOpen = popupObj.forceCheckCurrentPopupType(popupObj);

			if (!allowToOpen) {
				return true;
			}
			jQuery(window).trigger('sgpbConfirmEvent', popupOptions);
			var target = jQuery(this).attr('target');

			if (typeof target == 'undefined') {
				target = 'self';
			}
			var href = jQuery(this).attr('href');
			var delay = parseInt(popupOptions['sgpb-popup-delay']) * 1000;
			setTimeout(function() {
				if (typeof href != 'undefined') {
					popupOptions['sgpb-confirm-' + popupId] = {'target' : target, 'href' : href};
					popupObj.setPopupData(popupOptions);
				}
				popupObj.prepareOpen();
				confirmCount = 1;
			}, delay);

			return false;
		});

		sgAddEvent(window, 'sgpbDidClose', function(e) {
			var args = e.detail;
			var popupId = parseInt(args.popupId);
			var popupOptions = args.popupData;

			if (typeof popupOptions['sgpb-confirm-' + popupId] != 'undefined') {
				var confirmAgrs = popupOptions['sgpb-confirm-' + popupId];

				if (confirmAgrs['target'] == '_blank') {
					window.open(confirmAgrs['href']);
				}
				else {
					window.location.href = confirmAgrs['href'];
				}

				delete popupOptions['sgpb-confirm-' + popupId];
				popupObj.setPopupData(popupOptions);
			}
		});
	}
};

SgpbEventListener.prototype.sgpbAttronload = function(listenerObj, eventData)
{
	var that = listenerObj;
	var popupObj = that.getPopupObj();
	var popupId = parseInt(popupObj.id);
	popupId = listenerObj.filterPopupId(popupId);
	var popupOptions = popupObj.getPopupData();
	var delay = parseInt(popupOptions['sgpb-popup-delay']) * 1000;
	jQuery(window).trigger('sgpbAttronloadEvent', popupOptions);

	setTimeout(function() {
		popupObj.prepareOpen();
	}, delay);
};

/*for the old popups*/
SgpbEventListener.prototype.filterPopupId = function(popupId)
{
	var convertedIds = SGPB_POPUP_PARAMS.convertedIdsReverse;
	var popupNewId = popupId;
	if (convertedIds[popupId]) {
		return convertedIds[popupId];
	}
	else {
		for(var i in convertedIds) {
			if (popupId == convertedIds[i]) {
				popupNewId = parseInt(i);
				break;
			}
		}
	}

	return popupNewId;
};

SgpbEventListener.findCF7InPopup = function(popupId)
{
	return document.querySelector('#sg-popup-content-wrapper-'+popupId+' .wpcf7');
};

SgpbEventListener.CF7EventListener = function(popupId, options)
{
	var wpcf7Elm = SgpbEventListener.findCF7InPopup(popupId);

	if (wpcf7Elm) {
		wpcf7Elm.addEventListener('wpcf7mailsent', function(event) {
			var settings = {
				popupId: popupId,
				eventName: 'sgpbCF7Success'
			};
			jQuery(window).trigger('sgpbCF7Success', settings);
		});
	}
};

SgpbEventListener.processCF7MailSent = function(popupId, options)
{
	var wpcf7Elm = SgpbEventListener.findCF7InPopup(popupId);

	if (wpcf7Elm) {
		wpcf7Elm.addEventListener('wpcf7mailsent', function(event) {
			if (typeof options['operator'] == 'undefined') {
				return;
			}
			if (options['operator'] == 'close-popup') {
				setTimeout(function() {
					SGPBPopup.closePopupById(popupId);
				}, parseInt(options['value'])*1000);
			}
			else if (options['operator'] == 'redirect-url') {
				window.location.href = options['value'];
			}
			else if (options['operator'] == 'open-popup') {
				SGPBPopup.closePopupById(popupId);
				var popupObj = SGPBPopup.createPopupObjById(Object.keys(options['value'])[0]);
				popupObj.prepareOpen();
			}
		}, false);
	}
};

jQuery(document).ready(function(e) {
	setTimeout(function(){
		SgpbEventListener.init();
		SGPBPopup.listeners();
	}, 1);
});
// source --> https://zonainfantil.ibague.gov.co/wp-content/plugins/sticky-header-effects-for-elementor/assets/js/she-header.js?ver=2.1.0 
var $j = jQuery.noConflict();

$j(document).ready(function () {
    "use strict";
    // She header
    sheHeader();

    $j(window).on('resize', function (e) {
        sheHeader(e);
    });
});


/* ==============================================
HEADER EFFECTS
============================================== */


function sheHeader(e) {
   
    var header = $j('.elementor-element.she-header-yes'),
        container = $j('.she-header-yes .elementor-container, .elementor-element.she-header-yes.e-con'),
        header_elementor = $j('.elementor-edit-mode .she-header-yes'),
        header_logo = $j('.she-header-yes .elementor-widget-theme-site-logo img:not(.elementor-widget-n-menu img), .she-header-yes .elementor-widget-image img:not(.elementor-widget-n-menu img)'),
        header_logo_div = $j('.she-header-yes .elementor-widget-theme-site-logo a::after, .she-header-yes .elementor-widget-image a::after');
    data_settings = header.data('settings');

    if (typeof data_settings != 'undefined') {
        var responsive_settings = data_settings["transparent_on"];
        var width = $j(window).width(),
            header_height = header.height(),
            logo_width = header_logo.width(),
            logo_height = header_logo.height();
    }

    // Check responsive is enabled
    if (typeof width != 'undefined' && width) {
        if (width >= 1025) {
            var enabled = "desktop";
        } else if (width > 767 && width < 1025) {
            var enabled = "tablet";
        } else if (width <= 767) {
            var enabled = "mobile";
        }
    }

    if ($j.inArray(enabled, responsive_settings) != '-1') {

        var scroll_distance = data_settings["scroll_distance"];
        var she_offset = data_settings["she_offset_top"];
        var she_padding = data_settings["she_padding"];
        var she_width = data_settings["she_width"];
        var transparent_header = data_settings["transparent_header_show"];
        var background = data_settings["background"];
        var bottom_border_color = data_settings["custom_bottom_border_color"],
            bottom_border_view = data_settings["bottom_border"],
            bottom_border_width = data_settings["custom_bottom_border_width"];

        var shrink_header = data_settings["shrink_header"],
            data_height = data_settings["custom_height_header"],
            data_height_tablet = data_settings["custom_height_header_tablet"],
            data_height_mobile = data_settings["custom_height_header_mobile"];

        var shrink_logo = data_settings["shrink_header_logo"],
            data_logo_height = data_settings["custom_height_header_logo"],
            data_logo_height_tablet = data_settings["custom_height_header_logo_tablet"],
            data_logo_height_mobile = data_settings["custom_height_header_logo_mobile"];

        var change_logo_color = data_settings["change_logo_color"];

        var blur_bg = data_settings["blur_bg"];

        var scroll_distance_hide_header = data_settings["scroll_distance_hide_header"];

        // offset
        if (width >= 1025) {
            she_offset = data_settings["she_offset_top"];
            she_padding = data_settings["she_padding"];
            she_width = data_settings["she_width"];
        } else if (width > 767 && width < 1025) {
            she_offset = data_settings["she_offset_top_tablet"];
            she_padding = data_settings["she_padding_tablet"];
            she_width = data_settings["she_width_tablet"];
        } else if (width <= 767) {
            she_offset = data_settings["she_offset_top_mobile"];
            she_padding = data_settings["she_padding_mobile"];
            she_width = data_settings["she_width_mobile"];
        }

        if (header.hasClass("she-header")) {
            if( e?.type === 'resize' ){
                header.css("width", she_width.size + she_width.unit);
                header.css("padding-top", she_padding.top + she_padding.unit);
                header.css("padding-bottom", she_padding.bottom + she_padding.unit);
                header.css("padding-left", she_padding.left + she_padding.unit);
                header.css("padding-right", she_padding.right + she_padding.unit);
            }
        }

        // add transparent class
        if (transparent_header == "yes") {
            header.addClass('she-header-transparent-yes');
        }

        // header height shrink
        if (typeof data_height != "undefined" && data_height) {
            if (width >= 1025) {
                var shrink_height = data_height["size"];
            } else if (width > 767 && width < 1025) {
                var shrink_height = data_height_tablet["size"];
                if (shrink_height == "") {
                    shrink_height = data_height["size"];
                }
            } else if (width <= 767) {
                var shrink_height = data_height_mobile["size"];
                if (shrink_height == "") {
                    shrink_height = data_height["size"];
                }
            }
        }

        // Logo height shrink
        if (
            typeof data_logo_height != "undefined" &&
            data_logo_height
        ) {
            if (width >= 1025) {
                var shrink_logo_height = data_logo_height["size"];
            } else if (width > 767 && width < 1025) {
                var shrink_logo_height =
                    data_logo_height_tablet["size"];
            } else if (width <= 767) {
                var shrink_logo_height =
                    data_logo_height_mobile["size"];
            }

            //Calc New width and height
            if (shrink_logo_height == "") {
                //Get logo shrink settings from desktop
                shrink_logo_height = data_logo_height["size"];

                if (shrink_logo_height == "") {
                    // Shrink same settings from height shrink option
                    shrink_logo_height = shrink_height;

                    var percent =
                        parseInt(shrink_logo_height) /
                        parseInt(header_height),
                        width_l = logo_width * percent,
                        height_l = logo_height * percent;
                } else {
                    var width_l =
                        (logo_width * shrink_logo_height) / 100,
                        height_l =
                            (logo_height * shrink_logo_height) / 100;
                }
            } else {
                //Get logo shrink settings from the responsive option
                var width_l = (logo_width * shrink_logo_height) / 100,
                    height_l = (logo_height * shrink_logo_height) / 100;
            }
        }

        // border bottom
        if (typeof bottom_border_width != 'undefined' && bottom_border_width) {
            var bottom_border = bottom_border_width["size"] + "px solid " + bottom_border_color;
        }

        // hide header on scroll
        if (
            typeof scroll_distance_hide_header != "undefined" &&
            scroll_distance_hide_header
        ) {
            var mywindow = $j(window),
                mypos = mywindow.scrollTop();

            mywindow.scroll(function () {
                var sd_hh_s = scroll_distance_hide_header["size"],
                    sd_hh_u = scroll_distance_hide_header["unit"],
                    sd_hh_tablet =
                        data_settings[
                        "scroll_distance_hide_header_tablet"
                        ],
                    sd_hh_tablet_s = sd_hh_tablet["size"],
                    sd_hh_tablet_u = sd_hh_tablet["unit"],
                    sd_hh_mobile =
                        data_settings[
                        "scroll_distance_hide_header_mobile"
                        ],
                    sd_hh_mobile_s = sd_hh_mobile["size"],
                    sd_hh_mobile_u = sd_hh_mobile["unit"];

                // get responsive view
                if (
                    typeof scroll_distance_hide_header != "undefined" &&
                    scroll_distance_hide_header
                ) {
                    if (width >= 1025) {
                        var sd_hh = sd_hh_s,
                            sd_hh_u = sd_hh_u;
                        // calc sise for vh unit
                        if (sd_hh_u == "vh") {
                            sd_hh = window.innerHeight * (sd_hh / 100);
                        }
                    } else if (width > 767 && width < 1025) {
                        var sd_hh = sd_hh_tablet_s,
                            sd_hh_u = sd_hh_tablet_u;

                        if (sd_hh == "") {
                            sd_hh = sd_hh_s;
                        }
                        // calc sise for vh unit
                        if (sd_hh_u == "vh") {
                            sd_hh = window.innerHeight * (sd_hh / 100);
                        }
                    } else if (width <= 767) {
                        var sd_hh = sd_hh_mobile_s,
                            sd_hh_u = sd_hh_mobile_u;

                        if (sd_hh == "") {
                            sd_hh = sd_hh_s;
                        }
                        // calc sise for vh unit
                        if (sd_hh_u == "vh") {
                            sd_hh = window.innerHeight * (sd_hh / 100);
                        }
                    }
                }

                // added option for vh unit
                //if(sd_hh_u == 'px'){
                //	sd_hh  = sd_hh_s;
                //} else {
                //	sd_hh  = (window.innerHeight)*(sd_hh_s/100);
                //}

                if (mypos > sd_hh) {
                    if (mywindow.scrollTop() > mypos) {
                        header.addClass("headerup");
                    } else {
                        header.removeClass("headerup");
                    }
                }
                mypos = mywindow.scrollTop();
            });
        }

        // scroll function
        $j(window).on("load scroll", function (e) {
            var scroll = $j(window).scrollTop();

            if (header_elementor) {
                header_elementor.css("position", "relative");
            }

            var sd_s = scroll_distance["size"],
                sd_u = scroll_distance["unit"],
                sd_tablet = data_settings["scroll_distance_tablet"],
                sd_tablet_s = sd_tablet["size"],
                sd_tablet_u = sd_tablet["unit"],
                sd_mobile = data_settings["scroll_distance_mobile"],
                sd_mobile_s = sd_mobile["size"],
                sd_mobile_u = sd_mobile["unit"];

            // get responsive view
            if (
                typeof scroll_distance != "undefined" &&
                scroll_distance
            ) {
                if (width >= 1025) {
                    var sd = sd_s,
                        sd_u = sd_u;
                    // calc sise for vh unit
                    if (sd_u == "vh") {
                        sd = window.innerHeight * (sd / 100);
                    }
                } else if (width > 767 && width < 1025) {
                    var sd = sd_tablet_s,
                        sd_u = sd_tablet_u;

                    if (sd == "") {
                        sd = sd_s;
                    }
                    // calc sise for vh unit
                    if (sd_u == "vh") {
                        sd = window.innerHeight * (sd / 100);
                    }
                } else if (width <= 767) {
                    var sd = sd_mobile_s,
                        sd_u = sd_mobile_u;

                    if (sd == "") {
                        sd = sd_s;
                    }
                    // calc sise for vh unit
                    if (sd_u == "vh") {
                        sd = window.innerHeight * (sd / 100);
                    }
                }
            }

            if (scroll >= scroll_distance["size"]) {
                header.removeClass('header').addClass("she-header");
                header.css("background-color", background);
                header.css("border-bottom", bottom_border);

                header.css("top", she_offset.size + she_offset.unit);

                if (width >= 768) {
                    if (document.body.classList.contains('admin-bar')) {
                        header.css("top", (32 + she_offset.size) + she_offset.unit);
                    }
                }

                header.css("padding-top", she_padding.top + she_padding.unit);
                header.css("padding-bottom", she_padding.bottom + she_padding.unit);
                header.css("padding-left", she_padding.left + she_padding.unit);
                header.css("padding-right", she_padding.right + she_padding.unit);
                header.css("width", she_width.size + she_width.unit);
                // header.attr("style", "width: " + she_width.size + she_width.unit + " !important;");
                // header.css("width", she_width.size + she_width.unit);

                header.removeClass('she-header-transparent-yes');

                if (shrink_header == "yes") {
                    header.css({ "padding-top": "0", "padding-bottom": "0", "margin-top": "0", "margin-bottom": "0" });
                    container.css({ "min-height": shrink_height, "transition": "all 0.4s ease-in-out", "-webkit-transition": "all 0.4s ease-in-out", "-moz-transition": "all 0.4s ease-in-out" });
                }

                if (change_logo_color == "yes") {
                    header_logo.addClass("change-logo-color");
                }

                // ---------------------------------- SHRINK LOGO
                if (shrink_logo == "yes") {
                    header_logo.css({
                        width: width_l,
                        transition: "all 0.4s ease-in-out",
                        "-webkit-transition": "all 0.4s ease-in-out",
                        "-moz-transition": "all 0.4s ease-in-out",
                    });
                }

            } else {
                header.removeClass("she-header").addClass('header');
                header.css("background-color", "");
                header.css("border-bottom", "");
                header.css("top", "");
                header.css("padding-top", "");
                header.css("padding-bottom", "");
                header.css("padding-left", "");
                header.css("padding-right", "");
                header.css("width", "");

                if (transparent_header == "yes") {
                    header.addClass('she-header-transparent-yes');
                }
                if (shrink_header == "yes") {
                    header.css({ "padding-top": "", "padding-bottom": "", "margin-top": "", "margin-bottom": "" });
                    container.css("min-height", "");
                }

                // ---------------------------------- SHRINK LOGO
                if (shrink_logo == "yes") {
                    header_logo.css({ height: "", width: "" });
                }

                if (change_logo_color == "yes") {
                    header_logo.removeClass("change-logo-color");

                }

            }


        });
    }

};