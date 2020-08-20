/*
any Image Comparison Slider jQuery/js plugin

Copyright (c) 2020 Niklas Knaack (@niklaswebdev)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

( function() {

    var AICS_VERSION = '1.0.4';

    function AnyImageComparisonSlider( element, params ) {

        var AICS_UID = Math.floor( Math.random() * Math.floor( Math.random() * Date.now() ) );
        var AICS_ID = element.getAttribute( 'id' ) ? element.getAttribute( 'id' ) : AICS_UID;
        var AICS_NAME = 'any-image-comparison-slider';
        var AICS_TYPE = 'data-slider-type';

        //---

        //set default settings
        var settings = {};
            settings.orientation = 'horizontal';
            settings.initialPosition = 0.00;
            settings.width = '100%';
            settings.backgroundColor = 'none';
            settings.onPointerDown = false;
            settings.cursor = 'ew-resize';
            settings.dividingLine = 'solid 1px rgba(255, 255, 255, .5)';
            settings.followEasingFactor = 0;
            settings.interactive = true;
            settings.autoAnimation = true,
            settings.autoAnimationSpeed = 8;
            settings.autoAnimationPause = 1;
            settings.autoAnimationEasing = 'inOutCubic';
            settings.controlOthers = false;
            settings.controlledByOthers = false;
            settings.controlledReverse = false;
            settings.group = '';
            settings.groupSync = false;
            settings.loading = 'lazy';
            settings.viewportOffset = '100px';
            settings.sleepMode = true;
            settings.onReady = function(){};

        //get settings from params
        if ( typeof params !== 'undefined' ) {

            for ( var prop in params ) {

                if ( params.hasOwnProperty( prop ) && settings.hasOwnProperty( prop ) ) {

                    settings[ prop ] = params[ prop ];

                }

            }

        }

        //get settings from element data attributes
        var elemAttributes = element.attributes;
        var dataAttributes = [

            { attr: 'data-orientation', prop: 'orientation',type: String },
            { attr: 'data-initial-position', prop: 'initialPosition', type: Number },
            { attr: 'data-width', prop: 'width', type: String },
            { attr: 'data-background-color', prop: 'backgroundColor', type: String },
            { attr: 'data-on-pointer-down', prop: 'onPointerDown', type: Boolean },
            { attr: 'data-cursor', prop: 'cursor', type: String },
            { attr: 'data-dividing-line', prop: 'dividingLine', type: String },
            { attr: 'data-follow-easing-factor', prop: 'followEasingFactor', type: Number },
            { attr: 'data-interactive', prop: 'interactive', type: Boolean },
            { attr: 'data-auto-animation', prop: 'autoAnimation', type: Boolean },
            { attr: 'data-auto-animation-speed', prop: 'autoAnimationSpeed', type: Number },
            { attr: 'data-auto-animation-pause', prop: 'autoAnimationPause', type: Number },
            { attr: 'data-auto-animation-easing', prop: 'autoAnimationEasing', type: String },
            { attr: 'data-control-others', prop: 'controlOthers', type: Boolean },
            { attr: 'data-controlled-by-others', prop: 'controlledByOthers', type: Boolean },
            { attr: 'data-controlled-reverse', prop: 'controlledReverse', type: Boolean },
            { attr: 'data-group', prop: 'group', type: String },
            { attr: 'data-group-sync', prop: 'groupSync', type: Boolean },
            { attr: 'data-loading', prop: 'loading', type: String },
            { attr: 'data-viewport-offset', prop: 'viewportOffset', type: String },
            { attr: 'data-sleep-mode', prop: 'sleepMode', type: Boolean }

        ];

        for ( var i = 0, l = elemAttributes.length; i < l; i++ ) {

            var elemAttr = elemAttributes[ i ];

            for ( var j = 0, m = dataAttributes.length; j < m; j++ ) {

                var dataAttr = dataAttributes[ j ];

                if ( dataAttr.attr === elemAttr.nodeName ) {

                    if ( dataAttr.type === String ) {

                        settings[ dataAttr.prop ] = elemAttr.nodeValue;

                    } else if ( dataAttr.type === Number ) {

                        settings[ dataAttr.prop ] = parseFloat( elemAttr.nodeValue );

                    } else if ( dataAttr.type === Boolean ) {

                        settings[ dataAttr.prop ] = ( elemAttr.nodeValue.toLowerCase() === 'true' );
                        
                    }

                    break;

                }

            }

        }
        
        //---

        if ( typeof settings.orientation !== 'string' ) {

            throwError( 'orientation must be of type string' );

        } else {

            settings.orientation = settings.orientation.toLowerCase();

        }

        if ( settings.orientation !== 'horizontal' && settings.orientation !== 'h' && settings.orientation !== 'vertical' && settings.orientation !== 'v' && settings.orientation !== 'default' ) {

            throwError( 'orientation must be horizontal, h, vertical, v or default' );

        } else {

            if ( settings.orientation === 'h' || settings.orientation === 'default' ) {

                settings.orientation = 'horizontal';

            } else if ( settings.orientation === 'v' ) {

                settings.orientation = 'vertical';

            }

        }

        if ( typeof settings.initialPosition !== 'number' || settings.initialPosition < 0 || settings.initialPosition > 1 ) {

            throwError( 'initialPosition must be of type number and the value must be between 0 to 1' );

        } else {

            if ( settings.initialPosition < 0.01 ) {

                settings.initialPosition = 0.01;

            } else if ( settings.initialPosition > 0.99 ) {

                settings.initialPosition = 0.99;

            }

        }

        if ( typeof settings.width !== 'string' ) {

            throwError( 'width must be of type string' );

        } else {

            settings.width = settings.width.toLowerCase();

        }

        if ( settings.width.indexOf( 'px' ) < 0 && settings.width.indexOf( 'pt' ) < 0 && settings.width.indexOf( '%' ) < 0 && settings.width.indexOf( 'em' ) < 0 && settings.width.indexOf( 'vw' ) < 0 ) {

            throwError( 'width must be given in px, pt, %, em or vw' );

        }

        if ( typeof settings.backgroundColor !== 'string' ) {

            throwError( 'backgroundColor must be of type string' );

        } else {

            settings.backgroundColor = settings.backgroundColor.toLowerCase();

        }

        if ( settings.backgroundColor.indexOf( 'none' ) < 0 && settings.backgroundColor.indexOf( '#' ) < 0 && settings.backgroundColor.indexOf( 'rgb' ) < 0 ) {

            throwError( 'backgroundColor must be none, hex, rgb or rgba value' );

        }

        if ( typeof settings.onPointerDown !== 'boolean' ) {

            throwError( 'onPointerDown must be of type boolean' );

        }

        if ( typeof settings.cursor !== 'string' ) {

            throwError( 'cursor must be of type string' );

        }

        if ( typeof settings.cursor === 'string' && settings.cursor.length > 0 && settings.cursor !== '' && settings.cursor !== ' ' ) {

            var cursorTypes = [ 'ew-resize', 'ns-resize', 'grab', 'grabbing', 'w-resize', 's-resize', 'e-resize', 'n-resize', 'row-resize', 'col-resize', 'all-scroll', 'move', 'crosshair', 'pointer', 'default', 'auto', 'inherit', 'initial', 'unset', 'none' ];
            var cursorTypeError = true;

            for ( var cursorType in cursorTypes ) {

                if ( settings.cursor === cursorTypes[ cursorType ] ) {

                    cursorTypeError = false;

                }

            }

            if ( cursorTypeError === true && settings.cursor.indexOf( 'url' ) > -1 && settings.cursor.indexOf( '.cur' ) > -1 ) {

                cursorTypeError = false;

            }

            if ( cursorTypeError === true ) {

                throwError( 'cursor must contain one of the following values: ' + cursorTypes.join( ', ' ) + ', url("http://yourcursor.cur") 0 0, auto' );

            }

        }

        if ( typeof settings.dividingLine !== 'string' ) {

            throwError( 'dividingLine must be of type string' );

        }

        if ( settings.dividingLine.length < 4 ) {

            throwError( 'dividingLine should look for example as follows: solid 1px rgba(255, 255, 255, .5) or none' );

        }

        if ( typeof settings.followEasingFactor !== 'number' ) {

            throwError( 'followEasingFactor must be of type number' );

        }

        if ( settings.followEasingFactor < 0 || settings.followEasingFactor > 100 ) {

            throwError( 'followEasingFactor must be between 0 and 100' );

        }

        if ( typeof settings.interactive !== 'boolean' ) {

            throwError( 'interactive must be of type boolean' );

        }

        if ( typeof settings.autoAnimation !== 'boolean' ) {

            throwError( 'autoAnimation must be of type boolean' );

        }

        if ( typeof settings.autoAnimationSpeed !== 'number' && settings.autoAnimation === true ) {

            throwError( 'autoAnimationSpeed must be of type number' );

        }

        if ( settings.autoAnimationSpeed < 1 && settings.autoAnimation === true ) {

            throwError( 'autoAnimationSpeed must be 1 or higher' );

        }

        if ( typeof settings.autoAnimationPause !== 'number' && settings.autoAnimation === true ) {

            throwError( 'autoAnimationPause must be of type number' );

        }

        if ( settings.autoAnimationPause < 0 && settings.autoAnimation === true ) {

            throwError( 'autoAnimationPause must be 0 or higher' );

        }

        if ( settings.autoAnimation === true ) {

            var easingTypes = [ 'linear', 'inQuad', 'outQuad', 'inOutQuad', 'inCubic', 'outCubic', 'inOutCubic', 'inQuart', 'outQuart', 'inOutQuart', 'inQuint', 'outQuint', 'inOutQuint', 'inSine', 'outSine', 'inOutSine' ];
            var easingTypeError = true;

            for ( var easingType in easingTypes ) {

                if ( settings.autoAnimationEasing === easingTypes[ easingType ] ) {

                    easingTypeError = false;

                }

            }

            if ( easingTypeError === true ) {

                throwError( 'autoAnimationEasing must contain one of the following values: ' + easingTypes.join( ', ' ) );

            }

        }

        if ( typeof settings.controlOthers !== 'boolean' ) {

            throwError( 'controlOthers must be of type boolean' );

        }

        if ( typeof settings.controlledByOthers !== 'boolean' ) {

            throwError( 'controlledByOthers must be of type boolean' );

        }

        if ( typeof settings.controlledReverse !== 'boolean' ) {

            throwError( 'controlledReverse must be of type boolean' );

        }

        if ( typeof settings.group !== 'string' ) {

            throwError( 'group must be of type string' );

        }

        if ( typeof settings.groupSync !== 'boolean' ) {

            throwError( 'groupSync must be of type boolean' );

        }

        if ( typeof settings.loading !== 'string' ) {

            throwError( 'loading must be of type string' );

        }

        if ( settings.loading !== 'lazy' && settings.loading !== 'eager' ) {

            throwError( 'loading must be given in either lazy or eager' );

        }

        if ( settings.loading === 'lazy' ) {

            if ( typeof settings.viewportOffset !== 'string'  ) {

                throwError( 'viewportOffset must be of type string' );
    
            }
    
            if ( settings.viewportOffset.indexOf( 'px' ) === -1 || settings.viewportOffset.slice( settings.viewportOffset.indexOf( 'px' ) ) !== 'px' ) {
    
                throwError( 'viewportOffset must be given in px' );
    
            }

        }

        if ( typeof settings.sleepMode !== 'boolean' ) {

            throwError( 'sleepMode must be of type boolean' );

        }

        if ( typeof settings.onReady !== 'function' ) {

            throwError( 'onReady must be of type function' );

        }

        if ( !element ) {

            throwError( 'No slider div element found' );

        }

        //---

        var aicsName = settings.group.length > 0 ? AICS_NAME + '-' + settings.group : AICS_NAME;
        var aics = this;

        element.setAttribute( AICS_TYPE, aicsName );

        if ( settings.controlOthers === true || settings.groupSync === true ) {

            element.aics = aics;

        }

        aics.loaded = false;

        //---

        var orientation = {
            HORIZONTAL: 'horizontal',
            VERTICAL: 'vertical'
        }

        var paused = false;
        var viewportIntersection = false;

        var eventType = !!document.attachEvent;
        var eventListener = eventType ? "attachEvent" : "addEventListener";
        var removeListener = eventType ? "detachEvent" : "removeEventListener";

        var pointerActive = false;
        var pointerDown = false;
        var pointerPosition = { x: -1, y: -1 };

        var sliderPosition = { x: 0, y: 0 };

        var allOtherElements = null;

        var animationFrame = null;
        var animationTime = -1;
        var animationTimeSpeed = 0.0166666666666667;
        var animationTimeMax = settings.autoAnimationSpeed;
        var animationTimeMaxCalc = animationTimeMax;
        var animationPauseTime = settings.autoAnimationPause;
        
        var ui = element.getElementsByClassName( 'ui' )[ 0 ];
        var buttonLft = null;
        var buttonRgt = null;
        var dragger = null;

        if ( typeof ui !== 'undefined' ) {

            buttonLft = ui.getElementsByClassName( 'button-lft' )[ 0 ] || ui.getElementsByClassName( 'button-top' )[ 0 ];
            buttonRgt = ui.getElementsByClassName( 'button-rgt' )[ 0 ] || ui.getElementsByClassName( 'button-btm' )[ 0 ];

            dragger = ui.getElementsByClassName( 'dragger' )[ 0 ];

        }

        var images = element.getElementsByClassName( 'images' )[ 0 ];
        var imageLft = images.getElementsByClassName( 'image-lft' )[ 0 ] || images.getElementsByClassName( 'image-top' )[ 0 ];
        var imageRgt = images.getElementsByClassName( 'image-rgt' )[ 0 ] || images.getElementsByClassName( 'image-btm' )[ 0 ];
        var imagesLoaded = 0;
        var imagesToLoad = 2;

        var imageOnLoad = function( e ) {

            load();

        };

        var imageOnError = function( e ) {

            throwError( 'Image ' + this.src + ' could not be loaded' );

        };

        var imageScrLft = null;
        var imageScrRgt = null;
        var imagesWidth = null;
        var imagesHeight = null;

        if ( !images ) {

            throwError( 'No images div element found' );

        }

        if ( !imageLft ) {

            throwError( 'No imageLft div element found' );

        }

        if ( !imageRgt ) {

            throwError( 'No imageRgt div element found' );

        }

        var tweenToggle = false;

        if ( settings.initialPosition > 0.5 ) {

            tweenToggle = true;

        }

        var tweenStartPosX = 0;
        var tweenEndPosX = 0;
        var tweenStartPosY = 0;
        var tweenEndPosY = 0;

        var easing = {};
            easing.linear = function( t, b, c, d ) {

                return c*t/d + b;

            }
            easing.inQuad = function( t, b, c, d ) {

                t /= d;
                return c*t*t + b;

            }
            easing.outQuad = function( t, b, c, d ) {

                t /= d;
                return -c * t*(t-2) + b;

            }
            easing.inOutQuad = function( t, b, c, d ) {

                t /= d/2;
                if (t < 1) {
                    return c/2*t*t + b
                }
                t--;
                return -c/2 * (t*(t-2) - 1) + b;

            }
            easing.inCubic = function( t, b, c, d ) {

                t /= d;
                return c*t*t*t + b;

            }
            easing.outCubic = function( t, b, c, d ) {

                t /= d;
                t--;
                return c*(t*t*t + 1) + b;

            }
            easing.inOutCubic = function( t, b, c, d ) {

                t /= d/2;
                if (t < 1) return c/2*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t + 2) + b;

            }
            easing.inQuart = function( t, b, c, d ) {

                t /= d;
                return c*t*t*t*t + b;

            }
            easing.outQuart = function( t, b, c, d ) {

                t /= d;
                t--;
                return -c * (t*t*t*t - 1) + b;

            }
            easing.inOutQuart = function( t, b, c, d ) {

                t /= d/2;
                if (t < 1) return c/2*t*t*t*t + b;
                t -= 2;
                return -c/2 * (t*t*t*t - 2) + b;

            }
            easing.inQuint = function( t, b, c, d ) {

                t /= d;
                return c*t*t*t*t*t + b;

            }
            easing.outQuint = function( t, b, c, d ) {

                t /= d;
                t--;
                return c*(t*t*t*t*t + 1) + b;

            }
            easing.inOutQuint = function( t, b, c, d ) {

                t /= d/2;
                if (t < 1) return c/2*t*t*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t*t*t + 2) + b;

            }
            easing.inSine = function( t, b, c, d ) {

                return -c * Math.cos(t/d * (Math.PI/2)) + c + b;

            }
            easing.outSine = function( t, b, c, d ) {

                return c * Math.sin(t/d * (Math.PI/2)) + b;

            }
            easing.inOutSine = function( t, b, c, d ) {

                return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;

            }

        var tween = {};

        if ( settings.autoAnimation === true ) {

            tween.props = null;
            tween.time = 0;
            tween.duration = 0;
            tween.increment = 0;
            tween.easing = easing[ settings.autoAnimationEasing ];
            tween.init = function( props, duration ) {

                this.props = props;
                this.duration = duration;

                for ( let i = 0, l = this.props.length; i < l; i++ ) {

                    var tweenProp = this.props[ i ];

                    tweenProp.change = tweenProp.to - tweenProp.from;

                }

            }
            tween.run = function( time ) {

                this.time = time;
                this.increment = this.duration / 100;
                this.time += this.increment;

                for ( let i = 0, l = this.props.length; i < l; i++ ) {

                    const tweenProp = this.props[ i ];

                    if ( tweenProp.property === 'x' ) {

                        sliderPosition.x = this.easing( this.time, tweenProp.from, tweenProp.change, this.duration );

                    } else if ( tweenProp.property === 'y' ) {

                        sliderPosition.y = this.easing( this.time, tweenProp.from, tweenProp.change, this.duration );

                    }

                }

            }

        }

        //---

        function init() {

            var start = function() {

                if ( settings.sleepMode === true ) {

                    addIntersectionOberserver( false );

                }

                loadImages();

            }

            var loadImages = function() {

                imageScrLft = new Image();
                imageScrLft.onload = imageOnLoad;
                imageScrLft.onerror = imageOnError;
                imageScrLft.src = imageLft.getAttribute( 'data-src' );
    
                imageScrRgt = new Image();
                imageScrRgt.onload = imageOnLoad;
                imageScrRgt.onerror = imageOnError;
                imageScrRgt.src = imageLft.getAttribute( 'data-src' );
    
            }

            if ( settings.loading === 'eager' ) {

                loadImages();
    
            } else if ( settings.loading === 'lazy' ) {

                addIntersectionOberserver( true, start );
    
            }

            element.style.overflow = 'hidden';
            element.style.position = 'relative';
            element.style.backgroundColor = settings.backgroundColor;
            element.style.width = settings.width;

            if ( imageLft.getAttribute( 'data-width' ) !== null && imageLft.getAttribute( 'data-height' ) !== null ) {

                var dw = parseInt( imageLft.getAttribute( 'data-width' ) );
                var dh = parseInt( imageLft.getAttribute( 'data-height' ) );

                var elementHeight = element.offsetWidth;

                if ( dw > dh ) {

                    elementHeight = element.offsetWidth / ( dw / dh );

                } else if ( dw < dh ) {

                    elementHeight = element.offsetWidth * ( dh / dw );

                } 

                element.style.height = elementHeight.toString() + 'px';

            }

        }

        function load() {

            imagesLoaded++;

            if ( imagesLoaded === imagesToLoad ) {

                if ( imageScrLft.width !== imageScrRgt.width || imageScrLft.height !== imageScrRgt.height ) {

                    throwError( 'Images must have same dimensions' );
        
                }

                aics.loaded = true;

                sync();

            }

        }

        function sync() {

            if ( settings.groupSync === true ) {

                allOtherElements = getAllOthers();

                var interval = setInterval( function() { 

                    var confirmationCounter = 0;

                    for ( var i = 0, l = allOtherElements.length; i < l; i++ ) {

                        var otherElement = allOtherElements[ i ];

                        if ( otherElement.aics && otherElement.aics.loaded === true ) {

                            confirmationCounter++;
        
                        }
        
                    }

                    if ( confirmationCounter === allOtherElements.length ) {

                        clearInterval( interval );

                        setup();

                    }
                
                }, 10 );

            } else {

                setup();

            }

        }

        function setup() {

            var imageMove = function( e ) {

                var p = getPointerPosition( e.offsetX || e.layerX, e.offsetY || e.layerY );

                if ( settings.onPointerDown === true && pointerDown === true || settings.onPointerDown === false && pointerDown === false ) {

                    pointerPosition.x = p.x;
                    pointerPosition.y = p.y;

                    if ( settings.controlOthers === true ) {

                        controlOtherSliders( true );

                    }

                }

            };

            var imageOver = function( e ) {

                if ( settings.onPointerDown === true && pointerDown === true || settings.onPointerDown === false && pointerDown === false ) {

                    pointerActive = true;

                }

                imageMove( e );

            };

            var imageOut = function( e ) {

                if ( settings.onPointerDown === true && pointerDown === true || settings.onPointerDown === false && pointerDown === false ) {

                    pointerActive = false;

                    animationTime = -1;
                    animationPauseTime = settings.autoAnimationPause;

                    if ( settings.controlOthers === true ) {

                        controlOtherSliders( false );

                    }

                }

            };

            var imageDown = function( e ) {

                if ( settings.onPointerDown === true ) {

                    if ( settings.cursor === 'grab' && imageLft.style.cursor === 'grab' && imageRgt.style.cursor === 'grab' ) {

                        imageLft.style.cursor = 'grabbing';
                        imageRgt.style.cursor = 'grabbing';

                    }

                    pointerActive = true;
                    pointerDown = true;

                    imageMove( e );

                }

            };

            var imageUp = function( e ) {

                if ( settings.onPointerDown === true ) {

                    if ( settings.cursor === 'grab' && imageLft.style.cursor === 'grabbing' && imageRgt.style.cursor === 'grabbing' ) {

                        imageLft.style.cursor = 'grab';
                        imageRgt.style.cursor = 'grab';

                    }

                    imageOut( e );

                    pointerActive = false;
                    pointerDown = false;

                }

            };

            if ( settings.interactive ) {

                if ( window.PointerEvent ) {

                    images[ eventListener ]( eventType ? 'onpointermove' : 'pointermove', imageMove );
                    images[ eventListener ]( eventType ? 'onpointerenter' : 'pointerenter', imageOver );
                    images[ eventListener ]( eventType ? 'onpointerleave' : 'pointerleave', imageOut );
                    images[ eventListener ]( eventType ? 'onpointerdown' : 'pointerdown', imageDown );
                    images[ eventListener ]( eventType ? 'onpointerup' : 'pointerup', imageUp );
    
                } else {
    
                    images[ eventListener ]( eventType ? 'onmousemove' : 'mousemove', imageMove );
                    images[ eventListener ]( eventType ? 'onmouseover' : 'mouseover', imageOver );
                    images[ eventListener ]( eventType ? 'onmouseout' : 'mouseout', imageOut );
                    images[ eventListener ]( eventType ? 'onmousedown' : 'mousedown', imageDown );
                    images[ eventListener ]( eventType ? 'onmouseup' : 'mouseup', imageUp );
    
                }

            }

            images.style.position = 'relative';
            images.style.overflow = 'hidden';

            imageLft.style.backgroundImage = 'url("' + imageLft.getAttribute( 'data-src' ) + '")';
            imageLft.style.backgroundRepeat = 'no-repeat';
            imageLft.style.backgroundSize = 'cover';
            imageLft.style.position = 'absolute';
            imageLft.style.cursor = settings.interactive === true ? settings.cursor : 'default';
            imageLft.style.touchAction = settings.interactive === true ? 'none' : 'auto';

            if ( settings.orientation === orientation.HORIZONTAL ) {

                imageLft.style.borderRight = settings.dividingLine;

            } else if ( settings.orientation === orientation.VERTICAL ) {

                imageLft.style.borderBottom = settings.dividingLine;

            }

            imageRgt.style.backgroundImage = 'url("' + imageRgt.getAttribute( 'data-src' ) + '")';
            imageRgt.style.backgroundRepeat = 'no-repeat';
            imageRgt.style.backgroundSize = 'cover';
            imageRgt.style.position = 'absolute';
            imageRgt.style.cursor = settings.interactive === true ? settings.cursor : 'default';
            imageRgt.style.touchAction = settings.interactive === true ? 'none' : 'auto';

            //---

            if ( typeof ui !== 'undefined' ) {

                var btSet = function( element, image, alignment ) {

                    element.style.pointerEvents = 'auto';
                    element.style.position = 'absolute';
                    element.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                    element.style.color = '#fff';
                    element.style.fontFamily= 'Arial, sans-serif';
                    element.style.fontSize = '12px';
                    element.style.fontWeight = 'bold';
                    element.style.minWidth = '70px';
                    element.style.textAlign =  'center';
                    element.style.lineHeight = '26px';
                    element.style.textDecoration = 'none';
                    element.style.transition = 'all ease-in-out .3s';
                    element.setAttribute( 'href', image.getAttribute( 'data-src' ) );

                    if ( alignment === 'tl' ) {

                        element.style.borderRadius = '0 0 4px 0';

                    } else if ( alignment === 'tr' ) {

                        element.style.right = '0px';
                        element.style.borderRadius = '0 0 0 4px';

                    } else if ( alignment === 'bl' ) {

                        element.style.bottom = '0px';
                        element.style.borderRadius = '0 4px 0 0';

                    } else if ( alignment === 'br' ) {

                        element.style.bottom = '0px';
                        element.style.right = '0px';
                        element.style.borderRadius = '4px 0 0 0';

                    }

                    if ( window.PointerEvent ) {

                        element[ eventListener ]( eventType ? 'onpointerenter' : 'pointerenter', btOver );
                        element[ eventListener ]( eventType ? 'onpointerleave' : 'pointerleave', btOut );

                    } else {

                        element[ eventListener ]( eventType ? 'onmouseover' : 'mouseover', btOver );
                        element[ eventListener ]( eventType ? 'onmouseout' : 'mouseout', btOut );

                    }

                };

                var btOver = function( e ) {

                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                    e.target.style.color = '#ddd';

                };

                var btOut = function( e ) {

                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                    e.target.style.color = '#fff';

                };

                ui.style.position = 'absolute';
                ui.style.pointerEvents = 'none';
                ui.style.top = '0px';
                ui.style.left = '0px';

                if ( typeof buttonLft !== 'undefined' ) {

                    btSet( buttonLft, imageLft, 'tl' );

                }

                if ( typeof buttonRgt !== 'undefined' ) {

                    if ( settings.orientation === orientation.HORIZONTAL ) {

                        btSet( buttonRgt, imageRgt, 'tr' );

                    } else if ( settings.orientation === orientation.VERTICAL ) {

                        btSet( buttonRgt, imageRgt, 'bl' );

                    }

                }

                //---

                if ( typeof dragger !== 'undefined' ) {

                    dragger.style.position = 'absolute';

                } else {

                    dragger = null;

                }

            }

            //---

            window[ eventListener ]( eventType ? 'onresize' : 'resize', resizeHandler );

            resize();

            //---

            if ( settings.controlOthers === true ) {

                if ( allOtherElements === null ) {

                    allOtherElements = getAllOthers();

                }

            }

            //---

            if ( settings.initialPosition > 0 ) {

                if ( settings.orientation === orientation.HORIZONTAL ) {

                    pointerPosition.x = getPositionFromPercentageValue( settings.initialPosition, element.offsetWidth );

                } else if ( settings.orientation === orientation.VERTICAL ) {

                    pointerPosition.y = getPositionFromPercentageValue( settings.initialPosition, element.offsetHeight );

                }

                sliderPosition.x = pointerPosition.x;
                sliderPosition.y = pointerPosition.y;

                tweenToggle = null;
                
            }

            //---

            if ( animationFrame != null ) {

                cancelAnimFrame( animationFrame );

            }

            animationFrame = requestAnimFrame( render );

            //---

            settings.onReady();

        }

        //---

        function getPointerPosition( x, y ) {

            var p = {};
                p.x = Math.min( Math.max( x, 0 ), element.offsetWidth );
                p.y = Math.min( Math.max( y, 0 ), element.offsetHeight );

            return p;

        }

        function getPercentagePosition( position, size ) {

            var p = {};
                p.v = position / size;

            return p;

        }

        function getPositionFromPercentageValue( position, size ) {

            if ( settings.controlledReverse === true ) {

                position = 1 - position;

            }

            var p = {};
                p.v = position * size;

            return p.v;

        }

        function getDistance( x1, x2, y1, y2 ) {

            var a = x1 - x2;
            var b = y1 - y2;

            return Math.sqrt( a * a + b * b );

        }

        //---

        window.requestAnimFrame = ( function() {

            return window.requestAnimationFrame       ||
                   window.webkitRequestAnimationFrame ||
                   window.mozRequestAnimationFrame    ||
                   window.oCancelAnimationFrame       ||
                   window.msRequestAnimationFrame     ||
                   function( callback ) {
                       window.setTimeout( callback, 1000 / 60 );
                   };

        } )();

        window.cancelAnimFrame = ( function() {

            return window.cancelAnimationFrame       || 
                   window.webkitCancelAnimationFrame || 
                   window.mozCancelAnimationFrame    || 
                   window.oCancelAnimationFrame      ||
                   window.msCancelAnimationFrame     ||
                   function (callback) {
                        window.clearTimeout( callback );
                   };

        } )();

        //---

        function render( timestamp ) {

            var allowRendering = true;
            
            if ( paused === true ) {

                allowRendering = false;

            }

            if ( settings.sleepMode === true && viewportIntersection === false ) {

                allowRendering = false;

            }

            if ( allowRendering === true ) {

                if ( pointerActive === true ) {

                    if ( settings.followEasingFactor === 0 ) {

                        sliderPosition.x = pointerPosition.x;
                        sliderPosition.y = pointerPosition.y;

                    } else {

                        sliderPosition.x += ( pointerPosition.x - sliderPosition.x ) / settings.followEasingFactor;
                        sliderPosition.y += ( pointerPosition.y - sliderPosition.y ) / settings.followEasingFactor;

                    }

                    tweenToggle = null;

                }

                if ( pointerActive === false && settings.autoAnimation === true ) {

                    if ( animationTime === 0 ) {

                        var from = 0;
                        var to = 0;

                        if ( settings.orientation === orientation.HORIZONTAL ) {

                            if ( tweenToggle === null ) {

                                from = sliderPosition.x;

                                if ( sliderPosition.x >= element.offsetWidth / 2 ) {

                                    to = tweenEndPosX;

                                    tweenToggle = true;

                                } else {

                                    to = tweenStartPosX;

                                    tweenToggle = false;

                                }

                                var dist = Math.abs( getDistance( sliderPosition.x, element.offsetWidth / 2, 0, 0 ) );
                                var distPercent = 1 - dist / ( element.offsetWidth / 2 );

                                animationTimeMaxCalc = animationTimeMax * distPercent;

                            } else {

                                animationTimeMaxCalc = animationTimeMax;

                                if ( tweenToggle === true ) {

                                    from = tweenEndPosX;
                                    to = tweenStartPosX;

                                } else {

                                    from = tweenStartPosX;
                                    to = tweenEndPosX;

                                }

                                tweenToggle = !tweenToggle;

                            }

                            tween.init( [ { from: from, to: to, property: 'x' } ], animationTimeMaxCalc );

                        } else if ( settings.orientation === orientation.VERTICAL ) {

                            if ( tweenToggle === null ) {

                                from = sliderPosition.y;

                                if ( sliderPosition.y >= element.offsetHeight / 2 ) {

                                    to = tweenEndPosY;

                                    tweenToggle = true;

                                } else {

                                    to = tweenStartPosY;

                                    tweenToggle = false;

                                }

                                var dist = Math.abs( getDistance( 0, 0, sliderPosition.y, element.offsetHeight / 2 ) );
                                var distPercent = 1 - dist / ( element.offsetHeight / 2 );

                                animationTimeMaxCalc = animationTimeMax * distPercent;

                            } else {

                                animationTimeMaxCalc = animationTimeMax;

                                if ( tweenToggle === true ) {

                                    from = tweenEndPosY;
                                    to = tweenStartPosY;

                                } else {

                                    from = tweenStartPosY;
                                    to = tweenEndPosY;

                                }

                                tweenToggle = !tweenToggle;

                            }

                            tween.init( [ { from: from, to: to, property: 'y' } ], animationTimeMaxCalc );

                        }

                    }

                    //---

                    if ( animationTime >= 0 ) {

                        if ( tween.props[ 0 ].from !== tween.props[ 0 ].to ) {

                            tween.run( animationTime );

                            animationTime += animationTimeSpeed;

                        } else {

                            animationTime = animationTimeMaxCalc + 1;

                        }

                    }

                    if ( animationTime > animationTimeMaxCalc ) {

                        animationTime = -1;
                        animationPauseTime = settings.autoAnimationPause;

                    }

                    if ( animationTime === -1 ) {

                        animationPauseTime -= animationTimeSpeed;

                    }

                    if ( animationPauseTime <= 0 && animationTime === -1 ) {

                        animationTime = 0;

                    }

                }

                //---

                if ( settings.orientation === orientation.HORIZONTAL ) {

                    if ( sliderPosition.x > element.offsetWidth ) {

                        sliderPosition.x = element.offsetWidth;

                    } else if ( sliderPosition.x < 1 ) {

                        sliderPosition.x = 1;

                    }

                    imageLft.style.width = sliderPosition.x + 'px';

                    if ( dragger !== null ) {

                        dragger.style.left = ( sliderPosition.x - dragger.offsetWidth / 2 ) + 'px';

                    }
                    

                } else if ( settings.orientation === orientation.VERTICAL ) {

                    if ( sliderPosition.y > element.offsetHeight ) {

                        sliderPosition.y = element.offsetHeight;

                    } else if ( sliderPosition.y < 1 ) {

                        sliderPosition.y = 1;

                    }

                    imageLft.style.height = sliderPosition.y + 'px';

                    if ( dragger !== null ) {

                        dragger.style.top = ( sliderPosition.y - dragger.offsetHeight / 2 ) + 'px';

                    }

                }

            }

            //---

            animationFrame = requestAnimFrame( render );

        }

        //---

        function resizeHandler( e ) {

            resize();

        }

        function resize() {

            element.style.width = settings.width;

            imagesWidth = '100%';
            imagesHeight = Math.round( imageScrLft.height / ( imageScrLft.width / element.offsetWidth ) ).toString() + 'px';

            element.style.height = imagesHeight;

            if ( typeof ui !== 'undefined' ) {

                ui.style.width = imagesWidth;
                ui.style.height = imagesHeight;

            }

            images.style.width = imagesWidth;
            images.style.height = imagesHeight;

            if ( settings.orientation === orientation.HORIZONTAL ) {

                imageLft.style.width = pointerPosition.x + 'px';
                imageLft.style.height = imagesHeight;

                if ( dragger !== null ) {

                    dragger.style.top = ( element.offsetHeight / 2 - dragger.offsetHeight / 2 ) + 'px';
                    dragger.style.left = ( pointerPosition.x - dragger.offsetWidth / 2 ) + 'px';

                }

            } else if ( settings.orientation === orientation.VERTICAL ) {

                imageLft.style.width = imagesWidth;
                imageLft.style.height = pointerPosition.y + 'px';

                if ( dragger !== null ) {

                    dragger.style.left = ( element.offsetWidth / 2 - dragger.offsetWidth / 2 ) + 'px';
                    dragger.style.top = ( pointerPosition.y - dragger.offsetHeight / 2 ) + 'px';

                }

            }

            imageRgt.style.width = imagesWidth;
            imageRgt.style.height = imagesHeight;

            tweenEndPosX = Math.round( element.offsetWidth );
            tweenEndPosY = Math.round( imageScrLft.height / ( imageScrLft.width / element.offsetWidth ) ) - 1;

            animationTime = 0;
            animationPauseTime = 0;

        }

        //---
        
        function throwError( msg ) {

            throw Error( '\n' + 'Slider (id="' + AICS_ID + '") reports following error: ' + msg );

        }
        
        //---

        function controlThisSlider( control, position ) {

            if ( paused === true ) {

                return;

            }

            if ( settings.controlledByOthers === true ) {

                if ( control === true ) {

                    pointerActive = true;

                    if ( settings.orientation === orientation.HORIZONTAL ) {

                        pointerPosition.x = getPositionFromPercentageValue( position.v, element.offsetWidth );

                    } else if ( settings.orientation === orientation.VERTICAL ) {

                        pointerPosition.y = getPositionFromPercentageValue( position.v, element.offsetHeight );

                    }

                } else {

                    pointerActive = false;

                    animationTime = -1;
                    animationPauseTime = settings.autoAnimationPause;

                }

            }

        }

        function controlOtherSliders( control ) {

            for ( var i = 0, l = allOtherElements.length; i < l; i++ ) {

                var otherElement = allOtherElements[ i ];

                if ( otherElement.aics ) {

                    if ( settings.orientation === orientation.HORIZONTAL ) {

                        otherElement.aics.controlThisSlider( control, getPercentagePosition( pointerPosition.x, element.offsetWidth ) );

                    } else if ( settings.orientation === orientation.VERTICAL ) {

                        otherElement.aics.controlThisSlider( control, getPercentagePosition( pointerPosition.y, element.offsetHeight ) );

                    }

                }

            }

        }

        aics.controlThisSlider = controlThisSlider;
        aics.controlOtherSliders = controlOtherSliders;

        //---

        function addIntersectionOberserver( autoUnobserve, callback ) {

            autoUnobserve = ( typeof autoUnobserve !== 'undefined' ) ? autoUnobserve : false;

            var isIntersectionObserverAvailable = !!window.IntersectionObserver;
    
            if ( isIntersectionObserverAvailable === true ) {

                var intersectionHandler = function( elements, observer ) {

                    var element = elements[ 0 ];

                    viewportIntersection = element.isIntersecting;

                    if ( viewportIntersection === true ) {

                        if ( autoUnobserve === true ) {

                            intersectionObserver.unobserve( element.target );

                        }

                        if ( callback ) {

                            callback();

                        }

                    }
                    
                };

                var intersectionObserver = new IntersectionObserver( intersectionHandler, { 
                    
                    rootMargin: settings.viewportOffset + ' ' + settings.viewportOffset + ' ' + settings.viewportOffset + ' ' + settings.viewportOffset 
                
                } );

                intersectionObserver.observe( element );

            } else {

                var viewportOffset = parseInt( settings.viewportOffset.slice( 0, settings.viewportOffset.indexOf( 'px' ) ) );

                var intersectionWithViewport = function() {

                    var rect = element.getBoundingClientRect();

                    return ( 

                        ( rect.top <= ( window.innerHeight || document.documentElement.clientHeight ) + viewportOffset ) && ( ( rect.top + rect.height + viewportOffset ) >= 0 ) && 
                        ( rect.left <= ( window.innerWidth || document.documentElement.clientWidth ) + viewportOffset ) && ( ( rect.left + rect.width + viewportOffset ) >= 0 ) 

                    );

                };

                var scrollHandler = function( e ) {

                    viewportIntersection = intersectionWithViewport();

                    if ( viewportIntersection === true ) {

                        if ( autoUnobserve === true ) {

                            window[ removeListener ]( eventType ? 'onscroll' : 'scroll', scrollHandler );

                        }

                        if ( callback ) {

                            callback();

                        }

                    }
                    
                };

                window[ eventListener ]( eventType ? 'onscroll' : 'scroll', scrollHandler );

                scrollHandler();

            }

        }

        function intersectsViewport() {

            return viewportIntersection;

        }

        aics.intersectsViewport = intersectsViewport;

        //---

        aics.pause = function() {

            paused = true;

        };

        aics.unpause = function() {

            paused = false;

        };

        aics.controlByExternalSource = function( control, position, max ) {

            controlThisSlider( control, { v: position / max } );

        };

        //---

        function getAllOthers() {

            var aicsName = AICS_NAME + '-' + settings.group;
            var allElements = null;
            var sliderElements = [];

            if ( document.querySelectorAll ) {

                if ( Array.from ) {

                    sliderElements = Array.from( document.body.querySelectorAll( '*[' + AICS_TYPE + '="' + aicsName + '"]:not([id="' + AICS_ID + '"])' ) );

                } else {

                    allElements = document.body.querySelectorAll( '*[' + AICS_TYPE + '="' + aicsName + '"]:not([id="' + AICS_ID + '"])' );

                    for ( var i = 0, l = allElements.length; i < l; i++ ) {

                        sliderElements.push( allElements[ i ] );

                    }

                }

            } else {

                allElements = document.body.getElementsByTagName( '*' );

                for ( var i = 0, l = allElements.length; i < l; i++ ) {

                    var el = allElements[ i ];

                    var st = el.getAttribute( AICS_TYPE );
                    var si = el.getAttribute( 'id' );

                    if ( st !== null && si !== null ) {

                        if ( st === aicsName && si !== AICS_ID ) {

                            sliderElements.push( el );

                        }

                    }

                }

            }

            return sliderElements;

        }

        aics.getAllOthers = getAllOthers;

        //---

        aics.getOrientation = function() {

            if ( settings.orientation === orientation.HORIZONTAL ) {

                return orientation.HORIZONTAL;

            } else if ( settings.orientation === orientation.VERTICAL ) {

                return orientation.VERTICAL;

            }

        };

        aics.getId = function() {

            return AICS_ID;

        };

        aics.getPos = function() {

            if ( settings.orientation === orientation.HORIZONTAL ) {

                return getPercentagePosition( sliderPosition.x, element.offsetWidth ).v;

            } else if ( settings.orientation === orientation.VERTICAL ) {

                return getPercentagePosition( sliderPosition.y, element.offsetHeight ).v;

            }

        };

        //---

        init();

    };

    AnyImageComparisonSlider.VERSION = AICS_VERSION;

    window.AnyImageComparisonSlider = AnyImageComparisonSlider;

    //---

    function documentReady( callback ) {

        if ( document.readyState !== 'loading' ) {
            
            callback();

        } else if ( document.addEventListener ) {
            
            document.addEventListener( 'DOMContentLoaded', callback );

        } else document.attachEvent( 'onreadystatechange', function() {

            if ( document.readyState === 'complete' ) {

                callback();

            } 

        } );

    }

    documentReady( function() {
        
        var divs = document.getElementsByTagName( 'div' );

        for ( var i = 0, l = divs.length; i < l; i++ ) {

            var div = divs[ i ];

            if ( div.id.length > 0 && div.id.indexOf( 'aics' ) > -1 && div.id.indexOf( 'autostart' ) > -1 ) {

                new AnyImageComparisonSlider( div );

            }

        }

    });

} () );

if ( typeof jQuery !== 'undefined' ) {

    ( function( $ ) {

        $.fn.anyImageComparisonSlider = function( params ) {

            var args = arguments;

            return this.each( function() {

                if ( !$.data( this, 'plugin_AnyImageComparisonSlider' ) ) {

                    $.data( this, 'plugin_AnyImageComparisonSlider', new AnyImageComparisonSlider( this, params ) );

                } else {

                    var plugin = $.data( this, 'plugin_AnyImageComparisonSlider' );

                    if ( plugin[ params ] ) {

                        var methodArgs = Array.prototype.slice.call( args, 1 );

                        if ( typeof methodArgs[ methodArgs.length - 1 ] === 'function' ) {

                            methodArgs[ methodArgs.length - 1 ]( plugin[ params ].apply( this, Array.prototype.slice.call( methodArgs, 0, methodArgs.length - 1 ) ) );

                        } else {

                            plugin[ params ].apply( this, methodArgs );

                        }
                        
                    } else {

                        $.error( 'Method ' +  params + ' does not exist on jQuery.anyImageComparisonSlider' );

                    }

                }

            } );

        };

    } ( jQuery ) );

}