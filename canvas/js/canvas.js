function CircleCanvas() {
    var that = this;

    var stage, activeMember, localTarget, localMouse, targetCircle, maskMain, hit, num;
    var circles = [], bitmaps = [], overlays = [], containers = [], images = [];
    var circleSize = 100;

    var startedOnce = false;

    this.loaded = false;
    this.bitmaps = function() {
        return bitmaps;
    }

    var windowObject = {
        height: 1080,
        width: 1920
    }

    var Grayscale = new createjs.ColorMatrixFilter([
        0.30, 0.30, 0.30, 0, 0, // red component
        0.30, 0.30, 0.30, 0, 0, // green component
        0.30, 0.30, 0.30, 0, 0, // blue component
        0, 0, 0, 1, 0 // alpha
    ]);

    // Browser check function
    var browser = function() {
        // Return cached result if avalible, else get result then cache it.
        if (browser.prototype._cachedResult)
            return browser.prototype._cachedResult;

        // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
        var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

        // Firefox 1.0+
        var isFirefox = typeof InstallTrigger !== 'undefined';

        // At least Safari 3+: "[object HTMLElementConstructor]"
        var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;

        // Chrome 1+
        var isChrome = !!window.chrome && !isOpera;

        // At least IE6
        var isIE = /*@cc_on!@*/ false || !!document.documentMode;

        // Edge 20+
        var isEdge = !isIE && !!window.StyleMedia;

        return browser.prototype._cachedResult =
            isOpera ? 'Opera' :
            isFirefox ? 'Firefox' :
            isSafari ? 'Safari' :
            isChrome ? 'Chrome' :
            isIE ? 'IE' :
            isEdge ? 'Edge' :
            "Don't know";
    };

    var browser = browser();

    // Color filters
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Circle class
    function Circle(graphics) {
        this.Shape_constructor();
        this.graphics = graphics ? graphics : new createjs.Graphics();
    }
    var protoCircle = createjs.extend(Circle, createjs.Shape);
    window.Circle = createjs.promote(Circle, "Shape");

    // Container class
    function Image() {
        this.Container_constructor();
        this.children = [];
        this.mouseChildren = true;
        this.tickChildren = true;
    }
    var protoImage = createjs.extend(Image, createjs.Container);
    protoImage.addChild = function(child) {
        this.Container_addChild(child);
    }
    protoImage.getChildByName = function(name) {
        this.Container_getChildByName(name);
    };
    window.Image = createjs.promote(Image, "Container");


    ////////////
    // Functions
    this.start = function() {
        stage.enableDOMEvents(false);
        stage.canvas = document.getElementById('canvas');
        stage.enableDOMEvents(true);

        stage.canvas.width = windowObject.width;
        stage.canvas.height = windowObject.height;
        stage.enableMouseOver();

        that.generalPause = false;

        if (startedOnce !== true) {
            setTimeout(function() {
                containers[0].removeAllEventListeners();
                newMember(containers[0], 0);
            }, 1500);

            startedOnce = true;
        }

        // If cached update cache, if not restart caching
        for (var i = canvas.images.length - 1; i >= 0; i--) {
            try {
                bitmaps[i].updateCache(0, 0, windowObject.width, windowObject.height);
            } catch (err) {
                bitmaps[i].cache(0, 0, windowObject.width, windowObject.height);
            }
        }

        canvas.loaded = true;
        createjs.Ticker.addEventListener("tick", that.animateAbout);
    }

    this.init = function() {
        initStage();
        initChildren();

        that.loaded = true;
    }

    function resetContainers(newContainer) {
        for (var i = canvas.images.length - 1; i >= 0; i--) {
            if (containers[i] !== newContainer) {
                circles[i].x = 0;
                circles[i].y = 0;
                circles[i].alpha = 1;

                if (containers[i] === activeMember) {
                    circles[i].scaleX = 1;
                    circles[i].scaleY = 1;

                    // Overlay efect for Ie and rest
                    if (browser == 'IE' || browser == 'Firefox') {
                        bitmaps[i].uncache(0, 0, 1920, 1500);
                    } else {
                        overlays[i].alpha = 0;
                    }

                    containers[i].cursor = "pointer";

                    containers[i].addEventListener("pressmove", function(evt) {
                        drag(evt);
                    });
                    containers[i].addEventListener("pressup", function(evt) {
                        stage.enableMouseOver();
                    });
                    containers[i].addEventListener("mouseover", function(evt) {
                        mouseOver(evt);
                    });
                    containers[i].addEventListener("mouseout", function(evt) {
                        mouseOut(evt);
                    });
                    containers[i].addEventListener("mousedown", function(evt) {
                        stage.enableMouseOver(0);
                    });
                }

                TweenLite.to(circles[i], 0.6, {
                    x: Math.random() * (-((windowObject.width / 5) * 2) - (-windowObject.width / 7)) + (-200),
                    y: Math.random() * (-((windowObject.height / 10) * 3) - ((windowObject.height / 10) * 3)) + ((windowObject.height / 10) * 3),
                    alpha: 0.01
                });
            }
        }
    };

    function newMember(newContainer, time) {
        var scaleCircle = windowObject.width / circleSize;

        // Overlay efect for Ie and rest
        if (browser == 'IE' || browser == 'Firefox') {
            // overlays[newContainer.id].alpha = 0;

            var rgb = hexToRgb(canvas.images[newContainer.id].color.replace(/ /g, ''));
            bitmaps[newContainer.id].filters = [
                new createjs.ColorFilter(rgb.r / 255, rgb.g / 255, rgb.b / 255, 1)
            ];
            bitmaps[newContainer.id].cache(0, 0, 1920, 1500);
        } else {
            overlays[newContainer.id].alpha = 1;
        }
        newContainer.cursor = "auto";

        stage.enableMouseOver(0);
        stage.enableMouseOver();

        TweenLite.to(circles[newContainer.id], 1, {
            scaleX: Math.round(scaleCircle) + 1,
            scaleY: Math.round(scaleCircle) + 1,
            x: -(scaleCircle) * ((windowObject.width / 5) * 4),
            y: -(scaleCircle) * (windowObject.height / 2)
        });

        // Put the container in front
        stage.swapChildrenAt(stage.getChildIndex(newContainer), stage.numChildren - 2);

        setTimeout(function() {
            resetContainers(newContainer);

            if (activeMember && activeMember !== newContainer) {
                stage.swapChildrenAt(stage.getChildIndex(newContainer), stage.getChildIndex(activeMember));
            } else {
                stage.swapChildrenAt(stage.getChildIndex(newContainer), 0);
            }
            activeMember = newContainer;

        }, time);
    }

    function initStage() {
        stage = new createjs.Stage();
    }

    function initChildren() {
        var graphics = new createjs.Graphics().beginFill("#fff").drawCircle((windowObject.width / 5) * 4, windowObject.height / 2, circleSize);
        var graphicsHollow = new createjs.Graphics();
        graphicsHollow.drawCircle((windowObject.width / 5) * 4, windowObject.height / 2, circleSize);

        targetCircle = new Circle(graphicsHollow);

        hit = new createjs.Shape();
        hit.graphics.beginFill("#fff").drawCircle((windowObject.width / 5) * 4, windowObject.height / 2, circleSize);
        targetCircle.hitArea = hit;

        stage.addChild(targetCircle);
        // stage.addChild(text);

        for (var i = canvas.images.length - 1; i >= 0; i--) {
            containers[i] = new Image();
            containers[i].id = i;
            containers[i].cursor = "pointer";
            containers[i].name = 'container' + i;

            bitmaps[i] = new createjs.Bitmap(canvas.images[i].image);
            bitmaps[i].name = 'bitmap' + i;
            // bitmaps[i].cache(0, 0, windowObject.width, windowObject.height);

            // Overlay efect for Ie and rest
            if (browser == 'IE' || browser == 'Firefox') {} else {
                overlays[i] = new createjs.Shape();
                overlays[i].graphics.beginFill(canvas.images[i].color).drawRect(0, 0, windowObject.width, windowObject.height);
                overlays[i].alpha = 0;
                overlays[i].name = 'overlay' + i;
                overlays[i].compositeOperation = "multiply";
            }

            circles[i] = new Circle(graphics);
            circles[i].name = 'circle' + i;
            circles[i].x = 0;
            circles[i].y = 0;
            circles[i].alpha = 0.01;

            bitmaps[i].mask = circles[i];

            // Overlay efect for Ie and rest
            if (browser == 'IE' || browser == 'Firefox') {} else {
                overlays[i].mask = circles[i];
            }

            containers[i].addChild(bitmaps[i]);

            // Overlay efect for Ie and rest
            if (browser == 'IE' || browser == 'Firefox') {} else {
                containers[i].addChild(overlays[i]);
            }

            containers[i].addChild(circles[i]);

            stage.addChild(containers[i]);

            addListeners(i);
        };
    }

    function handleResize() {
        scale = window.innerWidth / windowObject.width;

        windowObject = {
            height: window.innerHeight,
            width: window.innerWidth
        }
    }

    function addListeners(i) {
        containers[i].addEventListener("pressmove", function(evt) {
            drag(evt);
        });
        containers[i].addEventListener("pressup", function(evt) {
            stage.enableMouseOver();
        });
        containers[i].addEventListener("mouseover", function(evt) {
            mouseOver(evt);
        });
        containers[i].addEventListener("mouseout", function(evt) {
            mouseOut(evt);
        });
        containers[i].addEventListener("mousedown", function(evt) {
            stage.enableMouseOver(0);
        });
    }

    this.animateAbout = function() {
        stage.update();
        stage.setChildIndex(targetCircle, stage.numChildren - 1);
    }

    function mouseOver(event) {
        var id = event.currentTarget.id;

        // Overlay efect for Ie and rest
        if (browser == 'IE' || browser == 'Firefox') {
            var rgb = hexToRgb(canvas.images[id].color.replace(/ /g, ''));
            bitmaps[id].filters = [
                new createjs.ColorFilter(rgb.r / 255, rgb.g / 255, rgb.b / 255, 1)
            ];
            bitmaps[id].cache(0, 0, 1920, 1500);
        } else {
            TweenMax.to(overlays[id], 0.5, {
                alpha: '1'
            });
        }

        stage.setChildIndex(event.currentTarget, stage.numChildren - 1);
    }

    function mouseOut(event) {
        var id = event.currentTarget.id;

        // Overlay efect for Ie and rest
        if (browser == 'IE' || browser == 'Firefox') {
            bitmaps[id].uncache(0, 0, 1920, 1500);
        } else {
            TweenMax.to(overlays[id], 0.5, {
                alpha: '0'
            });
        }
    }

    function drag(event) {
        eventCircle = event.target;
        eventContainer = event.currentTarget;

        localTarget = hit.globalToLocal(stage.mouseX, stage.mouseY);
        localMouse = eventCircle.globalToLocal(event.stageX, event.stageY);

        eventCircle.x = event.stageX - (windowObject.width / 5) * 4;
        eventCircle.y = event.stageY - windowObject.height / 2;

        if (hit.hitTest(localTarget.x, localTarget.y)) {
            eventContainer.removeAllEventListeners();

            TweenMax.to(eventCircle, 0.2, {
                x: targetCircle.x,
                y: targetCircle.y,
                onComplete: function() {
                    newMember(eventContainer, 600);
                }
            });
        }
    }

    this.destroy = function() {
        for (var i = bitmaps.length - 1; i >= 0; i--) {
            if (browser == 'IE' || browser == 'Firefox') {
                if (containers[i] !== activeMember)
                    bitmaps[i].filters = [];
                bitmaps[i].cache(0, 0, 1920, 1500);
                bitmaps[i].uncache(0, 0, 1920, 1500);
            }
        };
    }
}
