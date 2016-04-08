(function (window, document) {
    var $window = $(window),
        $body = $(document.body),
        $layer = $(document.createElement('div')).css({
            position: 'fixed',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            height: '100%',
            width: '100%',
            zIndex: 9999999,
            background: '#000',
            opacity: '0.6',
            display: 'none'
        }),
        $cloneImg;

    $body.append($layer);

    function newCloneImg($node) {
        var offset = $node.offset(),
            left = offset.left,
            top = offset.top,
            nodeW = $node.width(),
            nodeH = $node.height();

        return $node.clone().css({
            position: 'fixed',
            cursor: 'zoom-out',
            width: nodeW,
            height: nodeH,
            left: left,
            top: top,
            zIndex: 10000000
        });
    }

    function justifyCloneImg() {
        if ($cloneImg) {
            var windowW = $window.width(),
                windowH = $window.height(),
                img = new Image();

            img.onload = function () {
                $cloneImg.stop().animate({
                    width: this.width,
                    height: this.height,
                    left: (windowW - this.width) / 2,
                    top: (windowH - this.height) / 2
                }, 300);
            };

            img.src = $cloneImg.attr('src');
        }
    }

    function restore() {
        $layer.fadeOut(300);
        $cloneImg && $cloneImg.remove();
        $cloneImg = null;
    }

    var timer = null;
    $window.on('resize', function () {
        timer && clearTimeout(timer);
        timer = setTimeout(function () {
            justifyCloneImg();
        }, 30);
    });

    $body.on('keydown click', function (evt) {
        if (evt.type === 'click' || evt.which === 27) {
            restore();
        }
    });

    $.fn.popImg = function () {
        this.css('cursor', 'zoom-in');
        return this.each(function () {
            var $this = $(this);
            $this.on('click', function () {
                $layer.fadeIn(300);
                $cloneImg = newCloneImg($this);
                $body.append($cloneImg);
                justifyCloneImg();
                return false;
            });
        });
    };
})(window, document);
