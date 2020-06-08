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

    var AICS_VERSION = '0.9.83';

    function AnyImageComparisonSlider( element, params ) {

        var AICS_UID = Math.floor( Math.random() * Math.floor( Math.random() * Date.now() ) );
        var AICS_ID = element.getAttribute( 'id' ) ? element.getAttribute( 'id' ) : AICS_UID;
        var AICS_NAME = 'any-image-comparison-slider';
        var AICS_TYPE = 'data-slider-type';

        //---

        //set default settings
        var settings = {};
            settings.orientation = 'horizontal';
            settings.width = '100%';
            settings.backgroundColor = 'none';
            settings.onPointerDown = false;
            settings.cursor = 'ew-resize';
            settings.dividingLine = 'solid 1px rgba(255, 255, 255, .5)';
            settings.followEasingFactor = 0;
            settings.autoAnimation = true,
            settings.autoAnimationSpeed = 8;
            settings.autoAnimationPause = 1;
            settings.autoAnimationEasing = 'inOutCubic';
            settings.controlOthers = false;
            settings.controlledByOthers = false;
            settings.group = '';

        //get settings from params
        if ( params !== undefined ) {

            for ( var prop in params ) {

                if ( params.hasOwnProperty( prop ) && settings.hasOwnProperty( prop ) ) {

                    settings[ prop ] = params[ prop ];

                }

            }

        }

        //get settings from element data attributes
        var dataAttributes = element.attributes

        for ( var i = 0, l = dataAttributes.length; i < l; i++ ) {

            if ( dataAttributes[ i ].nodeName === 'data-orientation' ) {

                settings.orientation = dataAttributes[ i ].nodeValue;

            } else if ( dataAttributes[ i ].nodeName === 'data-width' ) {

                settings.width = dataAttributes[ i ].nodeValue;

            } else if ( dataAttributes[ i ].nodeName === 'data-background-color' ) {

                settings.backgroundColor = dataAttributes[ i ].nodeValue;

            } else if ( dataAttributes[ i ].nodeName === 'data-on-pointer-down' ) {

                settings.onPointerDown = ( dataAttributes[ i ].nodeValue.toLowerCase() === 'true' );

            } else if ( dataAttributes[ i ].nodeName === 'data-cursor' ) {

                settings.cursor = dataAttributes[ i ].nodeValue;

            } else if ( dataAttributes[ i ].nodeName === 'data-dividing-line' ) {

                settings.dividingLine = dataAttributes[ i ].nodeValue;

            } else if ( dataAttributes[ i ].nodeName === 'data-follow-easing-factor' ) {

                settings.followEasingFactor = parseFloat( dataAttributes[ i ].nodeValue );

            } else if ( dataAttributes[ i ].nodeName === 'data-auto-animation' ) {

                settings.autoAnimation = ( dataAttributes[ i ].nodeValue.toLowerCase() === 'true' );

            } else if ( dataAttributes[ i ].nodeName === 'data-auto-animation-speed' ) {

                settings.autoAnimationSpeed = parseFloat( dataAttributes[ i ].nodeValue );

            } else if ( dataAttributes[ i ].nodeName === 'data-auto-animation-pause' ) {

                settings.autoAnimationPause = parseFloat( dataAttributes[ i ].nodeValue );

            } else if ( dataAttributes[ i ].nodeName === 'data-auto-animation-easing' ) {

                settings.autoAnimationEasing = dataAttributes[ i ].nodeValue;

            } else if ( dataAttributes[ i ].nodeName === 'data-control-others' ) {

                settings.controlOthers = ( dataAttributes[ i ].nodeValue.toLowerCase() === 'true' );

            } else if ( dataAttributes[ i ].nodeName === 'data-controlled-by-others' ) {

                settings.controlledByOthers = ( dataAttributes[ i ].nodeValue.toLowerCase() === 'true' );

            } else if ( dataAttributes[ i ].nodeName === 'data-group' ) {

                settings.group = dataAttributes[ i ].nodeValue;

            }

        }

        //---

        if ( typeof settings.orientation !== 'string' ) {

            throw Error( '\n' + 'orientation must be type of string' );

        } else {

            settings.orientation = settings.orientation.toLowerCase();

        }

        if ( settings.orientation !== 'horizontal' && settings.orientation !== 'h' && settings.orientation !== 'vertical' && settings.orientation !== 'v' && settings.orientation !== 'default' ) {

            throw Error( '\n' + 'orientation must be horizontal, h, vertical, v or default' );

        } else {

            if ( settings.orientation === 'h' || settings.orientation === 'default' ) {

                settings.orientation = 'horizontal';

            } else if ( settings.orientation === 'v' ) {

                settings.orientation = 'vertical';

            }

        }

        if ( typeof settings.width !== 'string' ) {

            throw Error( '\n' + 'width must be type of string' );

        } else {

            settings.width = settings.width.toLowerCase();

        }

        if ( settings.width.indexOf( 'px' ) < 0 && settings.width.indexOf( '%' ) < 0 ) {

            throw Error( '\n' + 'width must be given in px or %' );

        }

        if ( typeof settings.backgroundColor !== 'string' ) {

            throw Error( '\n' + 'backgroundColor must be type of string' );

        } else {

            settings.backgroundColor = settings.backgroundColor.toLowerCase();

        }

        if ( settings.backgroundColor.indexOf( 'none' ) < 0 && settings.backgroundColor.indexOf( '#' ) < 0 && settings.backgroundColor.indexOf( 'rgb' ) < 0 ) {

            throw Error( '\n' + 'backgroundColor must be none, hex, rgb or rgba value' );

        }

        if ( typeof settings.onPointerDown !== 'boolean' ) {

            throw Error( '\n' + 'onPointerDown must be type of boolean' );

        }

        if ( typeof settings.cursor !== 'string' ) {

            throw Error( '\n' + 'cursor must be type of string' );

        }

        if ( typeof settings.cursor === 'string' && settings.cursor.length > 0 && settings.cursor !== '' && settings.cursor !== ' ' ) {

            var cursorTypes = [ 'ew-resize', 'ns-resize', 'grab', 'grabbing', 'w-resize', 's-resize', 'e-resize', 'n-resize', 'row-resize', 'col-resize', 'all-scroll', 'move', 'crosshair', 'pointer', 'default', 'auto', 'inherit', 'initial', 'unset' ];
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

                throw Error( '\n' + 'cursor must contain one of the following values: ' + cursorTypes.join( ', ' ) + ', url("http://yourcursor.cur") 0 0, auto' );

            }

        }

        if ( typeof settings.dividingLine !== 'string' ) {

            throw Error( '\n' + 'dividingLine must be type of string' );

        }

        if ( settings.dividingLine.length < 4 ) {

            throw Error( '\n' + 'dividingLine should look for example as follows: solid 1px rgba(255, 255, 255, .5) or none' );

        }

        if ( typeof settings.followEasingFactor !== 'number' ) {

            throw Error( '\n' + 'followEasingFactor must be of type number' );

        }

        if ( settings.followEasingFactor < 0 || settings.followEasingFactor > 100 ) {

            throw Error( '\n' + 'followEasingFactor must be between 0 and 100' );

        }

        if ( typeof settings.autoAnimation !== 'boolean' ) {

            throw Error( '\n' + 'autoAnimation must be type of boolean' );

        }

        if ( typeof settings.autoAnimationSpeed !== 'number' && settings.autoAnimation === true ) {

            throw Error( '\n' + 'autoAnimationSpeed must be of type number' );

        }

        if ( settings.autoAnimationSpeed < 1 && settings.autoAnimation === true ) {

            throw Error( '\n' + 'autoAnimationSpeed must be 1 or higher' );

        }

        if ( typeof settings.autoAnimationPause !== 'number' && settings.autoAnimation === true ) {

            throw Error( '\n' + 'autoAnimationPause must be of type number' );

        }

        if ( settings.autoAnimationPause < 0 && settings.autoAnimation === true ) {

            throw Error( '\n' + 'autoAnimationPause must be 0 or higher' );

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

                throw Error( '\n' + 'autoAnimationEasing must contain one of the following values: ' + easingTypes.join( ', ' ) );

            }

        }

        if ( typeof settings.controlOthers !== 'boolean' ) {

            throw Error( '\n' + 'controlOthers must be type of boolean' );

        }

        if ( typeof settings.controlledByOthers !== 'boolean' ) {

            throw Error( '\n' + 'controlledByOthers must be type of boolean' );

        }

        if ( typeof settings.group !== 'string' ) {

            throw Error( '\n' + 'group must be type of string' );

        }

        if ( !element ) {

            throw Error( '\n' + 'No slider div element found' );

        }

        //---

        var aicsName = settings.group.length > 0 ? AICS_NAME + '-' + settings.group : AICS_NAME;

        element.setAttribute( AICS_TYPE, aicsName );

        if ( settings.controlOthers === true ) {

            element.aics = this;

        }

        //---

        var orientation = {
            HORIZONTAL: 'horizontal',
            VERTICAL: 'vertical'
        }

        var paused = false;

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

        if ( typeof ui !== 'undefined' ) {

            buttonLft = ui.getElementsByClassName( 'button-lft' )[ 0 ] || ui.getElementsByClassName( 'button-top' )[ 0 ];
            buttonRgt = ui.getElementsByClassName( 'button-rgt' )[ 0 ] || ui.getElementsByClassName( 'button-btm' )[ 0 ];

        }

        var images = element.getElementsByClassName( 'images' )[ 0 ];
        var imageLft = images.getElementsByClassName( 'image-lft' )[ 0 ] || images.getElementsByClassName( 'image-top' )[ 0 ];
        var imageRgt = images.getElementsByClassName( 'image-rgt' )[ 0 ] || images.getElementsByClassName( 'image-btm' )[ 0 ];
        var imagesLoaded = 0;
        var imagesToLoad = 2;

        var imageOnLoad = function( e ) {

            init();

        };

        var imageOnError = function( e ) {

            throw Error( '\n' + 'Image ' + this.src + ' could not be loaded' );

        };

        var imageScrLft = new Image();
            imageScrLft.onload = imageOnLoad;
            imageScrLft.onerror = imageOnError;
            imageScrLft.src = imageLft.getAttribute( 'data-src' );

        var imageScrRgt = new Image();
            imageScrRgt.onload = imageOnLoad;
            imageScrRgt.onerror = imageOnError;
            imageScrRgt.src = imageLft.getAttribute( 'data-src' );

        var imagesWidth = null;
        var imagesHeight = null;

        if ( imageScrLft.width !== imageScrRgt.width || imageScrLft.height !== imageScrRgt.height ) {

            throw Error( '\n' + 'Images must have the same dimensions' );

        }

        if ( !images ) {

            throw Error( '\n' + 'No images div element found' );

        }

        if ( !imageLft ) {

            throw Error( '\n' + 'No imageLft div element found' );

        }

        if ( !imageRgt ) {

            throw Error( '\n' + 'No imageRgt div element found' );

        }

        var tweenToggle = false;

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

            imagesLoaded++;

            if ( imagesLoaded < imagesToLoad ) {

                return;

            }

            //---

            var eventType = !!document.attachEvent;
            var eventListener = eventType ? "attachEvent" : "addEventListener";

            //---

            element.style.position = 'relative';
            element.style.backgroundColor = settings.backgroundColor;

            //---

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

            images.style.position = 'relative';
            images.style.overflow = 'hidden';

            imageLft.style.backgroundImage = 'url("' + imageLft.getAttribute( 'data-src' ) + '")';
            imageLft.style.backgroundRepeat = 'no-repeat';
            imageLft.style.backgroundSize = 'cover';
            imageLft.style.position = 'absolute';
            imageLft.style.cursor = settings.cursor;
            imageLft.style.touchAction = 'none';

            if ( settings.orientation === orientation.HORIZONTAL ) {

                imageLft.style.borderRight = settings.dividingLine;

            } else if ( settings.orientation === orientation.VERTICAL ) {

                imageLft.style.borderBottom = settings.dividingLine;

            }

            imageRgt.style.backgroundImage = 'url("' + imageRgt.getAttribute( 'data-src' ) + '")';
            imageRgt.style.backgroundRepeat = 'no-repeat';
            imageRgt.style.backgroundSize = 'cover';
            imageRgt.style.position = 'absolute';
            imageRgt.style.cursor = settings.cursor;
            imageRgt.style.touchAction = 'none';

            //---

            if ( typeof ui !== 'undefined' ) {

                var btSet = function( element, alignment ) {

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
                    element.setAttribute( 'href', imageLft.getAttribute( 'data-src' ) );

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

                    btSet( buttonLft, 'tl' );

                }

                if ( typeof buttonRgt !== 'undefined' ) {

                   if ( settings.orientation === orientation.HORIZONTAL ) {

                        btSet( buttonRgt, 'tr' );

                    } else if ( settings.orientation === orientation.VERTICAL ) {

                        btSet( buttonRgt, 'bl' );

                    }

                }

            }

            //---

            window[ eventListener ]( eventType ? 'onresize' : 'resize', resizeHandler );

            resize();

            //---

            if ( settings.controlOthers === true ) {

                allOtherElements = getAllOthers();

            }

            //---

            if ( animationFrame != null ) {

                cancelAnimFrame( animationFrame );

            }

            animationFrame = requestAnimFrame( render );

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

            var p = {};
                p.v = position * size;

            return p.v;

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
            
            if ( paused === true ) {

                return;

            }

            if ( pointerActive === true && settings.autoAnimation === true ) {

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

                                animationTimeMaxCalc = ( animationTimeMax * ( ( element.offsetWidth / sliderPosition.x ) - 1 ) / 2 );

                            } else {

                                to = tweenStartPosX;

                                tweenToggle = false;

                                animationTimeMaxCalc = ( animationTimeMax * ( ( sliderPosition.x / element.offsetWidth ) * 2 ) / 2 );

                            }

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

                                animationTimeMaxCalc = ( animationTimeMax * ( ( element.offsetHeight / sliderPosition.y ) - 1 ) / 2 );

                            } else {

                                to = tweenStartPosY;

                                tweenToggle = false;

                                animationTimeMaxCalc = ( animationTimeMax * ( ( sliderPosition.y / element.offsetHeight ) * 2 ) / 2 );

                            }

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

                    tween.run( animationTime );

                    animationTime += animationTimeSpeed;

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

            } else if ( settings.orientation === orientation.VERTICAL ) {

                if ( sliderPosition.y > element.offsetHeight ) {

                    pointerPosliderPositionsition.y = element.offsetHeight;

                } else if ( sliderPosition.y < 1 ) {

                    sliderPosition.y = 1;

                }

                imageLft.style.height = sliderPosition.y + 'px';

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

            ui.style.width = imagesWidth;
            ui.style.height = imagesHeight;

            images.style.width = imagesWidth;
            images.style.height = imagesHeight;

            if ( settings.orientation === orientation.HORIZONTAL ) {

                imageLft.style.width = pointerPosition.x + 'px';
                imageLft.style.height = imagesHeight;

            } else if ( settings.orientation === orientation.VERTICAL ) {

                imageLft.style.width = imagesWidth;
                imageLft.style.height = pointerPosition.y + 'px';

            }

            imageRgt.style.width = imagesWidth;
            imageRgt.style.height = imagesHeight;

            tweenEndPosX = Math.round( element.offsetWidth );
            tweenEndPosY = Math.round( imageScrLft.height / ( imageScrLft.width / element.offsetWidth ) ) - 1;

            animationTime = 0;
            animationPauseTime = 0;

        }

        //---

        this.pause = function() {

            paused = true;

        };

        this.unpause = function() {

            paused = false;

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

        this.getAllOthers = getAllOthers;

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

        this.controlThisSlider = controlThisSlider;
        this.controlOtherSliders = controlOtherSliders;

        //---

        this.getOrientation = function() {

            if ( settings.orientation === orientation.HORIZONTAL ) {

                return orientation.HORIZONTAL;

            } else if ( settings.orientation === orientation.VERTICAL ) {

                return orientation.VERTICAL;

            }

        }

        //---

        this.getId = function() {

            return AICS_ID;

        }

    };

    AnyImageComparisonSlider.VERSION = AICS_VERSION;

    window.AnyImageComparisonSlider = AnyImageComparisonSlider;

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

                        plugin[ params ].apply( this, Array.prototype.slice.call( args, 1 ) );

                    } else {

                        $.error( 'Method ' +  params + ' does not exist on jQuery.anyImageComparisonSlider' );

                    }

                }

            } );

        };

    } ( jQuery ) );

}