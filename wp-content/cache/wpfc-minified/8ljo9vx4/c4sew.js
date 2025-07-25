// source --> https://zonainfantil.ibague.gov.co/wp-content/plugins/popup-builder/public/js/Popup.js?ver=4.3.9 
function SGPopup(config)
{var integrations=config.integrations;var popupName=config.popupName;var initialConfig=config;var prefix=config.prefix||'sgpb';var isInited=false;var mainDiv=null;var contentDiv=null;var DIV=null;var opened=false;var resizeTimeout=null;var overlayDiv=null;var defaultZIndex=config.contentBox.zIndex||9999;var defaultWidth="640px";var defaultHeight=config.autoHeight;var closeButtonImage=null;var popupId=config.id;var showOnce=config.showOnce||false;var events=config.events||[];var openDelay=config.openDelay||0;var popupTheme=config.popupTheme;var popupType=config.popupType;var fitBackgroundImg=null;var parentThis=this;var openAnimation=config.openAnimation||{type:"none",speed:0};var closeAnimation=config.closeAnimation||{type:"none",speed:0};var closeBehavior=config.closeBehavior||{allowed:true,showButton:true,buttonPosition:'topLeft',buttonInside:true,autoclose:false,overlayShouldClose:true,contentShouldClose:false,escShouldClose:true};var closeButton=config.closeButton||{data:sgpbPublicUrl+'img/close.png',width:16,height:16,widthType:'px',heightType:'px',closeButtonType:'IMG',closeButtonText:'Close'};var overlay=config.overlay||{visible:true,color:"#000",opacity:0.7};var contentBox=config.contentBox||{padding:8,showBackground:true,backgroundColor:"#fff",borderStyle:"solid",borderColor:"#ccc",borderRadius:config.contentBox.borderRadius,borderRadiusType:config.contentBox.borderRadiusType,borderWidth:1,shadowColor:"#ccc",shadowSpread:0,shadowBlur:10,scrollingEnabled:true,backgroundPosition:''};var contents=config.contents||"";var inline=config.inline||false;var href=config.href||false;var position=config.position||{left:"center",top:"center"};if((typeof position.left==="undefined"||(isNaN(parseInt(position.left))&&position.left!=="center"))&&(typeof position.right==="undefined"||(isNaN(parseInt(position.right))&&position.right!=="center"))){position.left="center";}
if((typeof position.top==="undefined"||(isNaN(parseInt(position.top))&&position.top!=="center"))&&(typeof position.bottom==="undefined"||(isNaN(parseInt(position.bottom))&&position.bottom!=="center"))){position.top="center";}
var sizingRanges=config.sizingRanges||[{screenFrom:{width:-1,height:-1},screenTo:{width:-1,height:-1},width:defaultWidth,height:defaultHeight,maxWidth:-1,maxHeight:-1,minWidth:-1,minHeight:-1}];var shouldOpen=config.shouldOpen||function(){return true;};var willOpen=config.willOpen||function(){};var didOpen=config.didOpen||function(){};var shouldClose=config.shouldClose||function(){return true;};var willClose=config.willClose||function(){};var didClose=config.didClose||function(){};SGPopup.inlinePrevTarget=SGPopup.inlinePrevTarget||{};function resetInlineContent()
{if(inline){var htmlElement=document.getElementById(inline);if(SGPopup.inlinePrevTarget.hasPreviousElement){if(typeof SGPopup.inlinePrevTarget.parentNode!=='undefined'){SGPopup.inlinePrevTarget.parentNode.insertBefore(htmlElement,SGPopup.inlinePrevTarget.node.nextSibling);}}
else{SGPopup.inlinePrevTarget.node.appendChild(htmlElement);}}}
var OPEN_ANIMATION_POP="@-webkit-keyframes popin{from{-webkit-transform:scale(.8);opacity:0}to{-webkit-transform:scale(1);opacity:1}}@-moz-keyframes popin{from{-moz-transform:scale(.8);opacity:0}to{-moz-transform:scale(1);opacity:1}}@keyframes popin{from{transform:scale(.8);opacity:0}to{transform:scale(1);opacity:1}}";var OPEN_ANIMATION_FADE="@-webkit-keyframes fadein{from{opacity:0}to{opacity:1}}@-moz-keyframes fadein{from{opacity:0}to{opacity:1}}@keyframes fadein{from{opacity:0}to{opacity:1}}";var OPEN_ANIMATION_FLIP="@-webkit-keyframes flipintoright{from{-webkit-transform:rotateY(90deg) scale(.9)}to{-webkit-transform:rotateY(0)}}@-moz-keyframes flipintoright{from{-moz-transform:rotateY(90deg) scale(.9)}to{-moz-transform:rotateY(0)}}@keyframes flipintoright{from{transform:rotateY(90deg) scale(.9)}to{transform:rotateY(0)}}";var OPEN_ANIMATION_SLIDELEFT="@-webkit-keyframes slideinfromright{from{-webkit-transform:translate3d({start},0,0)}to{-webkit-transform:translate3d(0,0,0)}}@-moz-keyframes slideinfromright{from{-moz-transform:translateX({start})}to{-moz-transform:translateX(0)}}@keyframes slideinfromright{from{transform:translateX({start})}to{transform:translateX(0)}}";var OPEN_ANIMATION_SLIDERIGHT="@-webkit-keyframes slideinfromleft{from{-webkit-transform:translate3d({start},0,0)}to{-webkit-transform:translate3d(0,0,0)}}@-moz-keyframes slideinfromleft{from{-moz-transform:translateX({start})}to{-moz-transform:translateX(0)}}@keyframes slideinfromleft{from{transform:translateX({start})}to{transform:translateX(0)}}";var OPEN_ANIMATION_FLOW="@-webkit-keyframes flowinfromright{0%{-webkit-transform:translateX(100%) scale(.7)}30%,40%{-webkit-transform:translateX(0) scale(.7)}100%{-webkit-transform:translateX(0) scale(1)}}@-moz-keyframes flowinfromright{0%{-moz-transform:translateX(100%) scale(.7)}30%,40%{-moz-transform:translateX(0) scale(.7)}100%{-moz-transform:translateX(0) scale(1)}}@keyframes flowinfromright{0%{transform:translateX(100%) scale(.7)}30%,40%{transform:translateX(0) scale(.7)}100%{transform:translateX(0) scale(1)}}";var OPEN_ANIMATION_SLIDEUP="@-webkit-keyframes slideinfrombottom{from{-webkit-transform:translateY({start})}to{-webkit-transform:translateY(0)}}@-moz-keyframes slideinfrombottom{from{-moz-transform:translateY({start})}to{-moz-transform:translateY(0)}}@keyframes slideinfrombottom{from{transform:translateY({start})}to{transform:translateY(0)}}";var OPEN_ANIMATION_SLIDEDOWN="@-webkit-keyframes slideinfromtop{from{-webkit-transform:translateY({start})}to{-webkit-transform:translateY(0)}}@-moz-keyframes slideinfromtop{from{-moz-transform:translateY({start})}to{-moz-transform:translateY(0)}}@keyframes slideinfromtop{from{transform:translateY({start})}to{transform:translateY(0)}}";var CLOSE_ANIMATION_SLIDELEFT="@-webkit-keyframes slideouttoleft{from{-webkit-transform:translate3d(0,0,0)}to{-webkit-transform:translate3d({end},0,0)}}@-moz-keyframes slideouttoleft{from{-moz-transform:translateX(0)}to{-moz-transform:translateX({end})}}@keyframes slideouttoleft{from{transform:translateX(0)}to{transform:translateX({end})}}";var CLOSE_ANIMATION_SLIDERIGHT="@-webkit-keyframes slideouttoright{from{-webkit-transform:translate3d(0,0,0)}to{-webkit-transform:translate3d({end},0,0)}}@-moz-keyframes slideouttoright{from{-moz-transform:translateX(0)}to{-moz-transform:translateX({end})}}@keyframes slideouttoright{from{transform:translateX(0)}to{transform:translateX({end})}}";var CLOSE_ANIMATION_POP="@-webkit-keyframes popout{from{-webkit-transform:scale(1);opacity:1}to{-webkit-transform:scale(.8);opacity:0}}@-moz-keyframes popout{from{-moz-transform:scale(1);opacity:1}to{-moz-transform:scale(.8);opacity:0}}@keyframes popout{from{transform:scale(1);opacity:1}to{transform:scale(.8);opacity:0}}";var CLOSE_ANIMATION_FADE="@-webkit-keyframes fadeout{from{opacity:1}to{opacity:0}}@-moz-keyframes fadeout{from{opacity:1}to{opacity:0}}@keyframes fadeout{from{opacity:1}to{opacity:0}}";var CLOSE_ANIMATION_FLIP="@-webkit-keyframes flipouttoright{from{-webkit-transform:rotateY(0)}to{-webkit-transform:rotateY(90deg) scale(.9)}}@-moz-keyframes flipouttoright{from{-moz-transform:rotateY(0)}to{-moz-transform:rotateY(90deg) scale(.9)}}@keyframes flipouttoright{from{transform:rotateY(0)}to{transform:rotateY(90deg) scale(.9)}}";var CLOSE_ANIMATION_FLOW="@-webkit-keyframes flowouttoright{0%{-webkit-transform:translateX(0) scale(1)}60%,70%{-webkit-transform:translateX(0) scale(.7)}100%{-webkit-transform:translateX(100%) scale(.7)}}@-moz-keyframes flowouttoright{0%{-moz-transform:translateX(0) scale(1)}60%,70%{-moz-transform:translateX(0) scale(.7)}100%{-moz-transform:translateX(100%) scale(.7)}}@keyframes flowouttoright{0%{transform:translateX(0) scale(1)}60%,70%{transform:translateX(0) scale(.7)}100%{transform:translateX(100%) scale(.7)}}";var CLOSE_ANIMATION_SLIDEUP="@-webkit-keyframes slideouttotop{from{-webkit-transform:translateY(0)}to{-webkit-transform:translateY({end})}}@-moz-keyframes slideouttotop{from{-moz-transform:translateY(0)}to{-moz-transform:translateY({end})}}@keyframes slideouttotop{from{transform:translateY(0)}to{transform:translateY({end})}}";var CLOSE_ANIMATION_SLIDEDOWN="@-webkit-keyframes slideouttobottom{from{-webkit-transform:translateY(0)}to{-webkit-transform:translateY({end})}}@-moz-keyframes slideouttobottom{from{-moz-transform:translateY(0)}to{-moz-transform:translateY({end})}}@keyframes slideouttobottom{from{transform:translateY(0)}to{transform:translateY({end})}}";function addAnimationClass(classString)
{var style=document.createElement('style');style.type='text/css';style.innerHTML=classString;style.id=prefix+"-effect-custom-style";document.getElementsByTagName('head')[0].appendChild(style);}
function setMainDivStyles(sizeConfig)
{jQuery(window).trigger('sgpbPopupBuilderAdditionalDimensionSettings');contentDiv.style.zIndex=defaultZIndex+10;mainDiv.style.boxSizing='content-box';if(sizeConfig.minHeight!=-1){var minHeight=sizeConfig.minHeight;var popupMinHeight=window.innerHeight;if(typeof minHeight==='string'&&minHeight.indexOf('%')!==-1){var popupMinhHeight=(popupMinhHeight/100)*parseInt(minHeight);mainDiv.style.minHeight=popupMinhHeight+'px';}
else{mainDiv.style.minHeight=parseInt(minHeight)+'px';}}
if(sizeConfig.minWidth!=-1){var popupMinhWidth=window.innerWidth;var minWidth=sizeConfig.minWidth;if(typeof minWidth==='string'&&minWidth.indexOf('%')!==-1){popupMinhWidth=(popupMinhWidth/100)*parseInt(minWidth);mainDiv.style.minWidth=popupMinhWidth+'px';}
else{mainDiv.style.minWidth=parseInt(minWidth)+'px';}}
if(sizeConfig.maxHeight!=-1&&sizeConfig.maxHeight){var maxHeight=sizeConfig.maxHeight;var popupMaxHeight=window.innerHeight;if(maxHeight.indexOf('%')!==-1){popupMaxHeight=(popupMaxHeight/100)*parseInt(maxHeight);this.calculatedMaxHeight=calculateMaxHeight(popupMaxHeight);mainDiv.style.maxHeight=this.calculatedMaxHeight;}
else{this.calculatedMaxHeight=calculateMaxHeight(parseInt(maxHeight));mainDiv.style.maxHeight=this.calculatedMaxHeight;}}
else{var popupMaxHeight=window.innerHeight;mainDiv.style.maxHeight=calculateMaxHeight(popupMaxHeight);}
if(sizeConfig.maxWidth!=-1&&sizeConfig.maxWidth){var maxWidth=sizeConfig.maxWidth;var popupMaxWidth=window.innerWidth;if(maxWidth.indexOf('%')!==-1){popupMaxWidth=(popupMaxWidth/100)*parseInt(maxWidth);this.calculatedMaxWidth=calculateMaxWidth(popupMaxWidth);mainDiv.style.maxWidth=this.calculatedMaxWidth;}
else{this.calculatedMaxWidth=calculateMaxWidth(parseInt(maxWidth));mainDiv.style.maxWidth=this.calculatedMaxWidth;}}
else{var popupMaxWidth=window.innerWidth;mainDiv.style.maxWidth=calculateMaxWidth(popupMaxWidth);}
if(contentBox.borderStyle){mainDiv.style.borderStyle=contentBox.borderStyle;}
if(contentBox.borderColor){mainDiv.style.borderColor=contentBox.borderColor;}
if(contentBox.borderRadius){var borderRadiusMeasure='%';if(contentBox.borderRadiusType){borderRadiusMeasure=contentBox.borderRadiusType;}
mainDiv.style.borderRadius=contentBox.borderRadius+borderRadiusMeasure;}
mainDiv.style.borderWidth=contentBox.borderWidth+"px";if(contentBox.padding){mainDiv.style.padding=contentBox.padding+"px";}
var widthToSet=sizeConfig.width||defaultWidth;if(widthToSet.indexOf("%")>-1){var widthNum=parseFloat(widthToSet);if(widthToSet.indexOf("fullScreen")>-1){widthNum=window.innerWidth;}
var closeButtonWidthToSubtract=parseInt(closeButton.width);if(closeBehavior.showButton===false||config.closeButton.type==='button'){closeButtonWidthToSubtract=0;}
widthToSet=(((widthNum/100)*window.innerWidth)-(2*(contentBox.padding?contentBox.padding:0))-parseFloat(mainDiv.style.borderLeftWidth)-parseFloat(mainDiv.style.borderRightWidth)-(parseFloat(contentBox.shadowSpread)/2)-closeButtonWidthToSubtract)+'px';}
else{widthToSet=parseFloat(widthToSet)-2*(contentBox.padding?contentBox.padding:0)+'px';}
mainDiv.style.width=widthToSet;if(config.popupType==='image'){mainDiv.style.backgroundImage="url("+contentBox.backgroundImage+")";}
if(contentBox.showBackground){if(contentBox.backgroundImage){mainDiv.style.backgroundImage="url("+contentBox.backgroundImage+")";}
if(contentBox.backgroundMode==="cover"){mainDiv.style.backgroundSize="cover";mainDiv.style.backgroundRepeat="no-repeat";}
else if(contentBox.backgroundMode==="contain"){mainDiv.style.backgroundSize="contain";mainDiv.style.backgroundRepeat="no-repeat";}
else if(contentBox.backgroundMode==="repeat"){mainDiv.style.backgroundRepeat="repeat";}
else if(contentBox.backgroundMode==='fit'){if(!fitBackgroundImg){fitBackgroundImg=document.createElement('img');fitBackgroundImg.style.position='fixed';fitBackgroundImg.style.bottom='-9999999999999px';fitBackgroundImg.className='sgpb-background-image-'+config.popupId;document.body.appendChild(fitBackgroundImg);fitBackgroundImg.onload=function(){changePopupDimensionRelatedImage(this);};fitBackgroundImg.src=contentBox.backgroundImage;mainDiv.style.backgroundSize='100% 100%';mainDiv.style.backgroundRepeat='no-repeat';}}
else{mainDiv.style.backgroundRepeat="no-repeat";}}
if(window.sgWindowOldWidth!==window.innerWidth||window.sgWindowOldHeight!==window.innerHeight){window.sgWindowOldWidth=window.innerWidth;window.sgWindowOldHeight=window.innerHeight;var images=document.getElementsByClassName('sgpb-background-image-'+config.popupId);if(images.length){changePopupDimensionRelatedImage(images[0]);}}
mainDiv.style.backgroundPosition=contentBox.backgroundPosition;var heightToSet=sizeConfig.height||defaultHeight;if(typeof heightToSet!=='undefined'&&heightToSet.indexOf("%")>-1){var heightNum=parseFloat(heightToSet);heightToSet=(((heightNum/100)*window.innerHeight)-(2*(contentBox.padding?contentBox.padding:0))-parseInt(mainDiv.style.borderTopWidth)-parseInt(mainDiv.style.borderBottomWidth))+"px";}
else{heightToSet=parseInt(heightToSet)-2*(contentBox.padding?contentBox.padding:0)+"px";if(sizeConfig.width.indexOf("fullScreen")>-1){heightToSet=(window.innerHeight)+"px";}}
mainDiv.style.height=heightToSet;if(contentBox.showBackground&&contentBox.backgroundColor){mainDiv.style.backgroundColor=contentBox.backgroundColor;}
if(contentBox.shadowColor){mainDiv.style.boxShadow="0 0 "+contentBox.shadowBlur+"px "+contentBox.shadowSpread+"px "+contentBox.shadowColor;}
if(contentBox.scrollingEnabled){mainDiv.style.overflow="auto";}
else{mainDiv.style.overflow="hidden";}}
function changePopupDimensionRelatedImage(image)
{var result=resizeConfig(image);var oldSizeConfig=getSizeConfig();oldSizeConfig.width=result.width+'px';oldSizeConfig.height=result.height+'px';oldSizeConfig.modified=true;this.sizeConfig=oldSizeConfig;windowResizeHandler();}
function resizeConfig(backgroundImage)
{var maxWidth=parseInt(this.calculatedMaxWidth);var maxHeight=parseInt(this.calculatedMaxHeight);var imageWidth=backgroundImage.width;var imageHeight=backgroundImage.height;var windowMaxHeight=parseInt(calculateMaxHeight(window.innerHeight));var windowMaxWidth=parseInt(calculateMaxWidth(window.innerWidth));if(isNaN(maxHeight)||maxHeight>windowMaxHeight){maxHeight=windowMaxHeight;}
if(isNaN(maxWidth)||maxWidth>windowMaxWidth){maxWidth=windowMaxWidth;}
var widthDifference=imageWidth-maxWidth;var heightDifference=imageHeight-maxHeight;if(heightDifference>widthDifference){if(imageHeight>maxHeight){var modifiedHeightPercent=100-(maxHeight/imageHeight)*100;var withMustDecrease=(imageWidth*modifiedHeightPercent)/100;var modifiedWidth=imageWidth-withMustDecrease;imageWidth=modifiedWidth;imageHeight=maxHeight;}}
else if(imageWidth>maxWidth){var modifiedWidthPercent=Math.floor((widthDifference/imageWidth)*100);var heightMustDecrease=Math.floor((imageHeight*modifiedWidthPercent)/100);var modifiedHeight=imageHeight-heightMustDecrease;imageWidth-=widthDifference;imageHeight-=heightMustDecrease;}
var result={width:imageWidth,height:imageHeight};return result;}
function calculateMaxWidth(maxWidth)
{var sizeConfig=getSizeConfig();var dimension=sizeConfig.width;var contentPadding=(contentBox.padding||0)*2;var shadowSpread=(contentBox.shadowSpread||0)*2;var borderWidth=(contentBox.borderWidth||0)*2;var boxBorderWidth=(contentBox.boxBorderWidth||0)*4;var closeButtonRight=(parseInt(closeBehavior.right)||0)*2;var closeButtonLeft=(parseInt(closeBehavior.left)||0)*2;if(dimension.indexOf('fullScreen')=='-1'){maxWidth-=contentPadding;maxWidth-=34;maxWidth-=shadowSpread;maxWidth-=borderWidth;maxWidth-=boxBorderWidth;}
if(!closeBehavior.buttonInside){if(closeButtonRight){maxWidth-=Math.abs(closeButtonRight);}
if(closeButtonLeft){maxWidth-=Math.abs(closeButtonLeft);}}
if(maxWidth<0){return'30px';}
return maxWidth+'px';}
function setFitBackground()
{if(!fitBackgroundImg){return;}
var imgHeight=fitBackgroundImg.height;var imgWidth=fitBackgroundImg.width;var winHeight=window.innerHeight;var winWidth=window.innerWidth;var minMargin=40;var popupWidth=0,popupHeight=0;if(imgWidth<(winWidth-2*minMargin)&&imgHeight<(winHeight-2*minMargin)){popupWidth=imgWidth;popupHeight=imgHeight;}else{var widthDif=winWidth-imgWidth;var heightDif=winHeight-imgHeight;if(widthDif<heightDif){popupWidth=winWidth-2*minMargin;popupHeight=popupWidth*imgHeight/imgWidth;}else{popupHeight=winHeight-2*minMargin;popupWidth=popupHeight*imgWidth/imgHeight;}}
var sizeConfig=getSizeConfig();var maxWidth=sizeConfig.maxWidth;var maxHeight=sizeConfig.maxHeight;var border=contentBox.borderWidth||0;var padding=contentBox.padding||0;var shadow=contentBox.shadowSpread||0;popupWidth=parseInt(popupWidth-2);sizeConfig.height=popupHeight+'px';}
function calculateMaxHeight(maxHeight)
{var sizeConfig=getSizeConfig();var dimension=sizeConfig.width;var contentPadding=(contentBox.padding||0)*2;var shadowSpread=(contentBox.shadowSpread||0)*4;var borderHeight=(contentBox.borderWidth||0)*2;var boxBorderHeight=(contentBox.boxBorderWidth||0)*4;var closeButtonTop=(parseInt(closeBehavior.top)||0)*2;var closeButtonBottom=(parseInt(closeBehavior.bottom)||0)*2;if(dimension.indexOf('fullScreen')!='-1'){}
else{maxHeight-=contentPadding;if(shadowSpread){maxHeight-=shadowSpread;maxHeight-=35;}
maxHeight-=borderHeight;maxHeight-=boxBorderHeight;if(!closeBehavior.buttonInside){if(closeButtonBottom){maxHeight-=Math.abs(closeButtonBottom);}
if(closeButtonTop){maxHeight-=Math.abs(closeButtonTop);}}}
if(maxHeight<0){return'30px';}
return maxHeight+'px';}
function positionPopup()
{contentDiv.style.position="fixed";var border=contentBox.borderWidth||0;var padding=contentBox.padding||0;if(typeof position.left!=="undefined"&&(!isNaN(parseInt(position.left))||position.left==="center")){if(position.left==="center"){contentDiv.style.left=(window.innerWidth-parseInt(mainDiv.clientWidth)-2*border)/2+"px";}
else{contentDiv.style.left=parseInt(position.left)+"px";}}
else{if(position.right==="center"){contentDiv.style.left=(window.innerWidth-parseInt(mainDiv.clientWidth)-2*border)/2+"px";}
else{contentDiv.style.left=(window.innerWidth-parseInt(position.right)-parseInt(mainDiv.clientWidth)-2*border)+"px";}}
if(typeof position.top!=="undefined"&&(!isNaN(parseInt(position.top))||position.top==="center")){if(position.top==="center"){contentDiv.style.top=(window.innerHeight-parseInt(mainDiv.clientHeight)-2*border)/2+"px";}
else{contentDiv.style.top=position.top+"px";}}
else{if(position.bottom==="center"){contentDiv.style.top=(window.innerHeight-parseInt(mainDiv.clientHeight)-2*border)/2+"px";}
else{contentDiv.style.bottom=position.bottom+"px";}}}
function getSizeConfig()
{var windowWidth=window.innerWidth;var windowHeight=window.innerHeight;var config=null;var candidates=[];for(var i=0;i<sizingRanges.length;i++){var tmpConf=sizingRanges[i];if((tmpConf.screenFrom.width===-1&&tmpConf.screenTo.width===-1)||(tmpConf.screenFrom.width===-1&&windowWidth<tmpConf.screenTo.width)||(tmpConf.screenTo.width===-1&&windowWidth>tmpConf.screenFrom.width)||(windowWidth<tmpConf.screenTo.width&&windowWidth>tmpConf.screenFrom.width)){candidates.push(tmpConf);}}
for(var i=0;i<candidates.length;i++){var tmpConf=candidates[i];if((tmpConf.screenFrom.height==-1&&tmpConf.screenTo.height==-1)||(tmpConf.screenFrom.height==-1&&windowHeight<tmpConf.screenTo.height)||(tmpConf.screenTo.height==-1&&windowHeight>tmpConf.screenFrom.height)||(windowHeight<tmpConf.screenTo.height&&windowHeight>tmpConf.screenFrom.height)){continue;}
else{candidates.splice(i,1);i--;}}
config=candidates[0];if(!config){config={screenFrom:{width:-1,height:-1},screenTo:{width:-1,height:-1},width:"640px",height:defaultHeight,maxWidth:-1,maxHeight:-1,minWidth:-1,minHeight:-1}}
return config;}
function drawOverlay()
{if(!overlay.visible){return;}
overlayDiv=document.createElement("DIV");overlayDiv.style.zIndex=defaultZIndex;overlayDiv.style.backgroundColor=overlay.color;overlayDiv.style.opacity=overlay.opacity/100;overlayDiv.style.position="fixed";overlayDiv.style.left="0";overlayDiv.style.top="0";overlayDiv.style.width="100%";overlayDiv.style.height="100%";if(overlay.addClass){overlayDiv.className=overlay.addClass;}
if(closeBehavior.overlayShouldClose){overlayDiv.onclick=closePopup;}
document.body.appendChild(overlayDiv);}
function removeOverlay()
{if(overlayDiv){overlayDiv.style.display="none";document.body.removeChild(overlayDiv);overlayDiv=null;}}
function setCloseButton(mainDiv)
{if(!closeButton.data){return;}
if(closeBehavior.showButton===false){return;}
closeButtonImage.style.zIndex=defaultZIndex+20;closeButtonImage.style.position="absolute";closeButtonImage.style.float="left";closeButtonImage.style.top=closeBehavior.top;closeButtonImage.style.right=closeBehavior.right;closeButtonImage.style.bottom=closeBehavior.bottom;closeButtonImage.style.left=closeBehavior.left;closeButtonImage.alt=SGPB_JS_LOCALIZATION.closeButtonAltText;closeButtonImage.title = SGPB_JS_LOCALIZATION.closeButtonAltText;if(closeButton.type=='button'){closeButtonImage.id=prefix+'-close-button';closeButtonImage.innerHTML=config.closeButton.text;}
closeButtonImage.style.width=closeButton.width+closeButton.widthType;closeButtonImage.style.cursor="pointer";closeButtonImage.style.height=closeButton.height+closeButton.heightType;closeButtonImage.src=closeButton.data;closeButtonImage.style.backgroundRepeat="no-repeat";closeButtonImage.style.backgroundSize="cover";closeButtonImage.onclick=closePopup;positionCloseButton(mainDiv);}
function positionCloseButton(mainDiv)
{if(closeBehavior.buttonPosition=="left"){closeButtonImage.style.left=(closeButton.width/2+parseFloat(closeBehavior.leftPosition))+"px";}
else if(closeBehavior.buttonPosition=="right"){var border=contentBox.borderWidth||0;var left=0;var mainDivWidth=mainDiv.style.width;if(mainDiv.style.maxWidth&&parseInt(mainDivWidth)>parseInt(mainDiv.style.maxWidth)){mainDivWidth=mainDiv.style.maxWidth;}
left=parseFloat(mainDivWidth)-Math.ceil(closeButton.width/2)+2*contentBox.padding+2*border;if(closeBehavior.leftPosition){left-=parseFloat(closeBehavior.leftPosition);}
closeButtonImage.style.left=left+"px";}
closeButtonImage.style.top=parseFloat(closeBehavior.topPosition)+"px";}
function onWindowRsize()
{clearTimeout(resizeTimeout);resizeTimeout=setTimeout(function(){resizeBox();positionPopup();positionCloseButton(mainDiv);jQuery(window).trigger('sgpbPopupReload')},0);}
function windowResizeHandler()
{resizeBox();positionPopup();positionCloseButton(mainDiv);jQuery(window).trigger('sgpbPopupReload')}
function setOpenAnimation()
{if(!openAnimation.status){return false;}
contentDiv.style.animationTimingFunction="linear";var border=contentBox.borderWidth||0;var padding=contentBox.padding||0;if(openAnimation.type=="slideleft"){var start=window.innerWidth-parseInt(contentDiv.style.left)+2*border;addAnimationClass(OPEN_ANIMATION_SLIDELEFT.replace(/\{start\}/g,start+"px"));contentDiv.style.animationName="slideinfromright";}
else if(openAnimation.type=="slideright"){var start=parseInt(mainDiv.style.width)+parseInt(contentDiv.style.left)+2*border+2*padding;addAnimationClass(OPEN_ANIMATION_SLIDERIGHT.replace(/\{start\}/g,"-"+start+"px"));contentDiv.style.animationName="slideinfromleft";}
else if(openAnimation.type=="pop"){addAnimationClass(OPEN_ANIMATION_POP);contentDiv.style.transform="scale(1)";contentDiv.style.animationName="popin";contentDiv.style.opacity="1";}
else if(openAnimation.type=="fade"){addAnimationClass(OPEN_ANIMATION_FADE);contentDiv.style.animationName="fadein";contentDiv.style.opacity="1";}
else if(openAnimation.type=="flip"){addAnimationClass(OPEN_ANIMATION_FLIP);contentDiv.style.animationName="flipintoright";contentDiv.style.transform="translateX(0)";}
else if(openAnimation.type=="turn"){addAnimationClass(OPEN_ANIMATION_FLIP);contentDiv.style.animationName="flipintoright";contentDiv.style.transform="translateX(0)";contentDiv.style.transformOrigin="0";}
else if(openAnimation.type=="flow"){addAnimationClass(OPEN_ANIMATION_FLOW);contentDiv.style.animationName="flowinfromright";contentDiv.style.transformOrigin="50% 30%";}
else if(openAnimation.type=="slideup"){var bottom=0;if(contentDiv.style.bottom){bottom=parseInt(mainDiv.style.height)+2*border+parseInt(contentDiv.style.bottom)+2*padding;}
else{bottom=window.innerHeight-parseInt(contentDiv.style.top)+2*border;}
var start=bottom;addAnimationClass(OPEN_ANIMATION_SLIDEUP.replace(/\{start\}/g,start+"px"));contentDiv.style.animationName="slideinfrombottom";}
else if(openAnimation.type=="slidedown"){var top=0;if(contentDiv.style.top){top=parseInt(contentDiv.style.top)+2*border+2*padding;}
else{top=window.innerHeight-parseInt(contentDiv.style.bottom)-parseInt(mainDiv.style.height);}
var start=top+parseInt(mainDiv.style.height);addAnimationClass(OPEN_ANIMATION_SLIDEDOWN.replace(/\{start\}/g,"-"+start+"px"));contentDiv.style.animationName="slideinfromtop";}
else{contentDiv.className+=' sg-animated '+openAnimation.type;}
contentDiv.style.animationDuration=openAnimation.speed+"ms";}
function setCloseAnimation()
{contentDiv.style.animationTimingFunction="linear";var border=contentBox.borderWidth||0;var padding=contentBox.padding||0;if(closeAnimation.type=="slideleft"){var end=parseInt(mainDiv.style.width)+parseInt(contentDiv.style.left)+2*border+2*padding;addAnimationClass(CLOSE_ANIMATION_SLIDELEFT.replace(/\{end\}/g,"-"+end+"px"));contentDiv.style.animationName="slideouttoleft";}
else if(closeAnimation.type=="slideright"){var end=window.innerWidth-parseInt(contentDiv.style.left)+2*border;addAnimationClass(CLOSE_ANIMATION_SLIDERIGHT.replace(/\{end\}/g,end+"px"));contentDiv.style.animationName="slideouttoright";}
else if(closeAnimation.type=="pop"){addAnimationClass(CLOSE_ANIMATION_POP);contentDiv.style.animationName="popout";contentDiv.style.transform="scale(0)";contentDiv.style.opacity="0";}
else if(closeAnimation.type=="fade"){addAnimationClass(CLOSE_ANIMATION_FADE);contentDiv.style.animationName="fadeout";contentDiv.style.opacity="0";}
else if(closeAnimation.type=="flip"){addAnimationClass(CLOSE_ANIMATION_FLIP);contentDiv.style.animationName="flipouttoright";contentDiv.style.transform="rotateY(-90deg) scale(.9)";}
else if(closeAnimation.type=="turn"){addAnimationClass(CLOSE_ANIMATION_FLIP);contentDiv.style.animationName="flipouttoright";contentDiv.style.transform="rotateY(-90deg) scale(.9)";contentDiv.style.transformOrigin="0";}
else if(closeAnimation.type=="flow"){addAnimationClass(CLOSE_ANIMATION_FLOW);contentDiv.style.animationName="flowouttoright";contentDiv.style.transformOrigin="50% 30%";}
else if(closeAnimation.type=="slideup"){var top=0;if(contentDiv.style.top){top=parseInt(contentDiv.style.top)+2*border+2*padding;}
else{top=window.innerHeight-parseInt(contentDiv.style.bottom)-parseInt(mainDiv.style.height);}
var end=top+parseInt(mainDiv.style.height);addAnimationClass(CLOSE_ANIMATION_SLIDEUP.replace(/\{end\}/g,"-"+end+"px"));contentDiv.style.animationName="slideouttotop";}
else if(closeAnimation.type=="slidedown"){var bottom=0;if(contentDiv.style.bottom){bottom=parseInt(mainDiv.style.height)+2*border+parseInt(contentDiv.style.bottom)+2*padding;}
else{bottom=window.innerHeight-parseInt(contentDiv.style.top)+2*border;}
var end=bottom;addAnimationClass(CLOSE_ANIMATION_SLIDEDOWN.replace(/\{end\}/g,end+"px"));contentDiv.style.animationName="slideouttobottom";}
else{contentDiv.className=prefix+'-popup-dialog-main-div-theme-wrapper-'+config.popupTheme+' sg-animated '+closeAnimation.type;}
contentDiv.style.animationDuration=closeAnimation.speed+"ms";window.setTimeout(function(){contentDiv.className=prefix+'-popup-dialog-main-div-theme-wrapper-'+config.popupTheme;contentDiv.style.animationName="";contentDiv.style.transform="";contentDiv.style.transformOrigin="";contentDiv.style.opacity="";},parseInt(closeAnimation.speed)+10);}
function setOpenEvents()
{for(var i=0;i<events.length;i++){var event=events[i];switch(event.type){case"load":setOpenOnLoadEvent();break;case"click":setOpenOnClickEvent(event);break;case"hover":setOpenOnHoverEvent(event);break;case"scroll":setOpenOnScrollEvent(event);break;case"exit":setOpenOnExitEvent(event);break;case"inactivity":setOpenInactivityEvent(event);}}}
function setOpenOnExitEvent(config)
{switch(config.mode){case"soft":setSoftExitEvents(config);break;case"agressive1":setAgressive1ExitEvents(config);break;case"agressive2":setAgressive2ExitEvents(config);break;case"full":setFullExitEvents(config);break;}}
function setAgressive1ExitEvents(config)
{window.addEventListener("beforeunload",function(e){(e||window.event).returnValue=config.message;return config.message})}
function setAgressive2ExitEvents(config)
{window.addEventListener("beforeunload",function(e){openPopup(false,'onExit');e.returnValue=config.message;return config.message});}
function setFullExitEvents(config)
{setSoftExitEvents(config);setAgressive2ExitEvents(config);}
function setSoftExitEvents(config)
{document.addEventListener("mouseout",function(event){if(event.toElement==null&&event.relatedTarget==null){openPopup(false,'onExit');}})}
function setOpenOnScrollEvent(config)
{var scrollPos=parseInt(config.position);if(config.position.indexOf("%")>0){scrollPos=document.body.scrollHeight*(scrollPos/100)-window.innerHeight/2;}
var scrollEventFunction=function(){if(document.body.scrollTop>=scrollPos||document.documentElement.scrollTop>=scrollPos){openPopup(false,'onScroll');window.removeEventListener("scroll",scrollEventFunction);}};window.addEventListener("scroll",scrollEventFunction);}
function setOpenOnLoadEvent()
{if(document.readyState==="complete"){openPopup(false,'onLoad');}
else{window.addEventListener("load",function(){openPopup(false,'onLoad');},false);}}
function setOpenOnClickEvent(config)
{var target=config.target;if(!target){return;}
var elements=document.getElementsByClassName(target);for(var i=0;i<elements.length;i++){elements[i].addEventListener("click",function(){openPopup(false,'onClick');});}}
function setOpenOnHoverEvent(config)
{var target=config.target;if(!target){return;}
var elements=document.getElementsByClassName(target);for(var i=0;i<elements.length;i++){elements[i].addEventListener("mouseover",function(){openPopup(false,'onHover');});}}
function setOpenInactivityEvent(config)
{var timer;var handler=function(){if(timer){clearInterval(timer);}
timer=setInterval(function(){openPopup();},config.timeout*1000);};document.addEventListener("mousemove",handler);document.addEventListener("mousedown",handler);document.addEventListener("keydown",handler);document.addEventListener("scroll",handler);handler();}
function initPopup()
{DIV=document.createElement("div");DIV.id=prefix+"-popup-dialog-main-div-wrapper";DIV.className=prefix+"-popup-dialog-main-div-wrapper";mainDiv=document.createElement("div");mainDiv.id=prefix+"-popup-dialog-main-div";var sizeConfig=getSizeConfig();contentDiv=document.createElement("div");contentDiv.className=prefix+'-popup-dialog-main-div-theme-wrapper-'+config.popupTheme;setMainDivStyles(sizeConfig);if(contentBox.addClass){mainDiv.className=contentBox.addClass;}
DIV.style.display="none";var popupContent=getInlineContent();if(contents){var divElement=document.createElement('div');divElement.setAttribute('style','height:100%;width:100%;overflow:'+(contentBox.scrollingEnabled?'auto':'hidden')+';');divElement.appendChild(contents);mainDiv.appendChild(divElement);}
else{mainDiv.innerHTML='<div style="height:100%;width:100%;overflow:'+(contentBox.scrollingEnabled?"auto":"hidden")+';">'+popupContent.innerHTML+'</div>';}
if(typeof config.closeButton.type!=='undefined'&&config.closeButton.type=='button'){closeButtonImage=document.createElement(config.closeButton.type);}
else{closeButtonImage=document.createElement("IMG");}
if(config.closeBehavior.showButton!==false){closeButtonImage.className=prefix+"-popup-close-button-"+config.popupTheme;contentDiv.appendChild(closeButtonImage);}
contentDiv.appendChild(mainDiv);DIV.appendChild(contentDiv);document.body.appendChild(DIV);isInited=true;setOpenEvents();}
function getInlineContent()
{var divElement=document.createElement("div");divElement.innerHTML='';if(inline){var hrefHtml=document.getElementById(inline);if(hrefHtml.previousElementSibling){SGPopup.inlinePrevTarget={hasPreviousElement:true,node:hrefHtml.previousElementSibling}}
else{SGPopup.inlinePrevTarget={hasPreviousElement:false,node:hrefHtml.parentNode}}
divElement.appendChild(hrefHtml);return divElement;}
return divElement;}
function openPopup(forced,action)
{if(opened){return;}
coockieValue=SGPopup.getCookie(popupId);if(coockieValue){return;}
if(showOnce){SGPopup.setCookie(popupId,"true",parseInt(showOnce));}
if(forced!==true){if(shouldOpen&&typeof shouldOpen=="function"){if(shouldOpen()===false){return;}}}
if(!isInited){initPopup();}
opened=true;var self=this;window.addEventListener("resize",onWindowRsize);if(closeBehavior.contentShouldClose){mainDiv.onclick=closePopup;}
setTimeout(function(){if(willOpen&&typeof willOpen=="function"){willOpen();}
drawOverlay();DIV.style.display="";positionPopup();setOpenAnimation();setCloseButton(mainDiv);if(didOpen){var callbackArgs=parentThis.getCallbackArgs();if(typeof didOpen=="function"){didOpen(callbackArgs);}}},openDelay);if(closeBehavior.autoclose&&closeBehavior.autoclose>0){setTimeout(closePopup,closeBehavior.autoclose*1000);}
if(closeBehavior.escShouldClose){document.onkeydown=function(e){e=e||window.event;if(e.keyCode==27){closePopup();}};}}
function closePopup(forced)
{if(forced!==true){if(shouldClose&&typeof shouldClose=="function"){if(shouldClose()===false){return;}}}
if(closeBehavior.allowed===false&&forced!==true){return;}
if(willClose&&typeof willClose=="function"){willClose();}
window.removeEventListener("resize",onWindowRsize);var closeFunction=function()
{if(!DIV){return;}
DIV.style.display="none";removeOverlay();if(didClose&&typeof didClose=="function"){didClose();opened=false;}
if(resetInlineContent&&typeof resetInlineContent=="function"){resetInlineContent();}};if(closeAnimation.type!="none"&&closeAnimation.speed>0){setCloseAnimation();setTimeout(closeFunction,closeAnimation.speed);}
else{closeFunction();}}
var resizeBox=function()
{var sizeConfig=getSizeConfig();setMainDivStyles(sizeConfig)};this.getCallbackArgs=function()
{var args={event:this.customEvent}
return args;};this.open=function(forced)
{openPopup(forced);};this.init=function()
{initPopup();};this.close=function(forced)
{closePopup(forced);};this.resize=function()
{resizeBox();};this.setOpenDelay=function(delay)
{openDelay=delay;if(isInited){initPopup();}};this.getOpenDelay=function()
{return openDelay;};this.setOpenAnimation=function(animation)
{openAnimation=animation;if(isInited){initPopup();}};this.getOpenAnimation=function()
{return openAnimation;};this.setCloseAnimation=function(animation)
{closeAnimation=animation;if(isInited){initPopup();}};this.getCloseAnimation=function()
{return closeAnimation;};this.setCloseBehavior=function(config)
{closeBehavior=config;if(isInited){initPopup();}};this.getCloseBehavior=function()
{return closeBehavior;};this.setCloseButton=function(button)
{closeButton=button;};this.getCloseButton=function()
{return closeButton;};this.setOverlay=function(config)
{overlay=config;if(isInited){initPopup();}};this.getOverlay=function()
{return overlay;};this.setContentBox=function(config)
{contentBox=config;if(isInited){initPopup();}};this.getContentBox=function()
{return contentBox;};this.setContents=function(content)
{contents=content;if(isInited){initPopup();}};this.getContents=function()
{return contents;};this.setPosition=function(config)
{position=config;};this.getPosition=function()
{return position;};this.setSizingRanges=function(ranges)
{sizingRanges=ranges;if(isInited){initPopup();}};this.getSizingRanges=function()
{return sizingRanges;};this.setShouldOpen=function(func)
{shouldOpen=func;if(isInited){initPopup();}};this.getShouldOpen=function()
{return shouldOpen;};this.setWillOpen=function(func)
{willOpen=func;if(isInited){initPopup();}};this.getWillOpen=function()
{return willOpen;};this.setDidOpen=function(func)
{didOpen=func;if(isInited){initPopup();}};this.getDidOpen=function()
{return didOpen;};this.setShouldClose=function(func)
{shouldClose=func;if(isInited){initPopup();}};this.getShouldClose=function()
{return shouldClose;};this.setWillClose=function(func)
{willClose=func;if(isInited){initPopup();}};this.getWillClose=function()
{return willClose;};this.setDidClose=function(func)
{didClose=func;if(isInited){initPopup();}};this.getDidClose=function()
{return didClose;};}
SGPopup.sendGetRequest=function(url,responseHandler,params)
{var req;if(window.XMLHttpRequest){req=new XMLHttpRequest();}
else if(window.ActiveXObject){req=new ActiveXObject("Microsoft.XMLHTTP");}
req.onreadystatechange=function(){if(req.readyState==4){if(req.status<400){responseHandler(req,params);}else{}}};req.open("GET",url,true);req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');req.send(null);};SGPopup.getCookie=function(cname)
{var name=cname+"=";var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==' '){c=c.substring(1);}
if(c.indexOf(name)==0){return c.substring(name.length,c.length);}}
return"";};SGPopup.setCookie=function(cname,cvalue,exdays)
{var sameSite='Lax';var exdate=new Date();if(!exdays||isNaN(exdays)){exdays=365*50;}
exdate.setDate(exdate.getDate()+exdays);var value=cvalue+((exdays==null)?";":"; expires="+exdate.toUTCString()+'; SameSite='+sameSite);document.cookie=cname+"="+value;};SGPopup.getPopup=function(el)
{var id=null;while(el&&el!=document){if(el.hasAttribute("data-sg-popup-hash-id")){id=el.getAttribute("data-sg-popup-hash-id");break;}
el=el.parentNode;}
if(id){return SGPopupLoader.popups[id];}};SGPopup.openSGPopup=function()
{var ids=SGPopupLoader.ids;var linkTag=document.createElement("link");linkTag.rel="stylesheet";linkTag.type="text/css";linkTag.href=SG_APP_URL+'public/assets/lib/SGPopup.css';document.head.appendChild(linkTag);var responseFunction=function(response,id)
{var config=JSON.parse(response.responseText);var popup=new SGPopup(config);SGPopupLoader.popups[id]=popup;popup.init();};for(var i=0;i<ids.length;i++){SGPopup.sendGetRequest(SG_APP_URL+'api/popups/'+ids[i],responseFunction,ids[i]);}};