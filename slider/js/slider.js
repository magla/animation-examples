
function Slider () {
    var that = this;
    var $prev, $next, item, $pager, sliderAnimating, activeSlide, total;

    this.init = function() {
        $prev = $('#slidePagination button.prev'), $next = $('#slidePagination button.next');
        $pager = $('#pager');
        item = '#slideshow div.item';

        sliderAnimating = false;
        activeSlide = 1;
        total = $(item).size();

        var $first = $(item).first();
        var $last = $(item).last();

        var $tFirst = $first.clone();
        var $tLast = $last.clone();

        if (!$last.is(':empty')) {
            $first.replaceWith($tLast);
            $last.replaceWith($tFirst);
        }
        
        $(item).last().addClass('active');

        // Set pager number
        $pager.text(activeSlide + ' / ' + total);
        
        // Set the handlers
        _handlers();
    };

    function _handlers () {
        $prev.on('click', function(e) {
            that.prev();
        });

        $next.on('click', function(e) {
            that.next();
        });
    };

    this.next = function() {
        if (!sliderAnimating) {
            var height = $(item).height();
            var width = $(item).width();

            var mod = (activeSlide + 1) % (total + 1);

            sliderAnimating = true;

            // Change pager number
            activeSlide = mod === 0 ? 1 : mod;
            $pager.text(activeSlide + ' / ' + total);

            $("#slideshow div.item.active").before($(item).first());

            TweenLite.fromTo("#slideshow div.item.active", 0.7, {
                left: 0,
                clip: 'rect(0px,' + width + ',' + height + ',0px)'
            }, {
                left: 100,
                clip: 'rect(0px,' + width + ',' + height + ',' + width + ')',
                ease: Power1.easeInOut,
                onComplete: function() {
                    if ($("#slideshow div.item.active").prev('div.item')) {
                        var clone = $("#slideshow div.item.active").clone().removeClass('active').removeAttr('style');

                        $("#slideshow div.item.active").remove();
                        $(item).last().addClass('active');
                        $("#slideshow div.item.active").before(clone);
                    }

                    sliderAnimating = false;
                }
            });

            TweenLite.fromTo($("#slideshow div.item.active").prev('div.item'), 0.5, {
                left: -100
            }, {
                left: 0,
                ease: Power1.easeInOut
            }, "-=1");
        }
    };

    this.prev = function() {
        if (!sliderAnimating) {
            var height = $(item).height();
            var width = $(item).width();

            var mod = (activeSlide - 1) % (total + 1);

            sliderAnimating = true;

            // Change pager number
            activeSlide = activeSlide - 1 === 0 ? total : mod;
            $pager.text(activeSlide + ' / ' + total);

            TweenLite.fromTo("#slideshow div.item.active", 0.7, {
                left: 0,
                'clip': 'rect(0px,' + width + ',' + height + ',0px)'
            }, {
                left: -100,
                'clip': 'rect(0px,0px,' + height + ',0px)',
                ease: Power1.easeInOut,
                onComplete: function() {
                    if ($("#slideshow div.item.active").prev('div.item')) {
                        var clone = $("#slideshow div.item.active").clone().removeClass('active').removeAttr('style');

                        $("#slideshow div.item.active").remove();
                        $(item).last().addClass('active');
                        $("#slideshow").prepend(clone);
                    }

                    sliderAnimating = false;
                }
            });

            TweenLite.fromTo($("#slideshow div.item.active").prev('div.item'), 0.5, {
                left: 100
            }, {
                left: 0,
                ease: Power1.easeInOut
            }, "-=1");
        }
    };
}