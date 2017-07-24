/**
 * Created by wangZhi on 2016/11/30.
 */
document.addEventListener('touchstart',function (e) {e.preventDefault();});
function cssStyle() {
    //根据实参的个数决定是获取还是设置
    if (arguments.length === 2) { //获取
        return arguments[0].style[arguments[1]];
    } else if (arguments.length === 3) {   //设置
        arguments[0].style[arguments[1]] = arguments[2];
    }
}

var common = {
    remChange : function ( myJson ) {
        var html = document.querySelector(myJson.obj);
        var width = html.getBoundingClientRect().width;
        html.style.fontSize = width / 10 + 'px';
    },
    //无缝滚动轮播
    bannerFirstConnect : function ( myJson ) {
        index();
        focus();
        function index() {
            var main = document.querySelector(myJson.indexObj);
            var speed = myJson.indexSpeed;
            var oUl = main.querySelector('ul');
            oUl.innerHTML += oUl.innerHTML;
            var aLi = oUl.querySelectorAll('li');
            var dot = main.querySelectorAll('span');
            oUl.style.width = aLi.length + '00%';
            auto(main, oUl, aLi, 'width', dot, 'pageX', 'left', speed, 'offsetWidth', true);
        }

        function focus() {
            var main = document.querySelector(myJson.focusObj);
            var speed = myJson.focusSpeed;
            var oUl = main.querySelector('ul');
            oUl.innerHTML += oUl.innerHTML;
            var aLi = oUl.querySelectorAll('li');
            auto(main, oUl, aLi, 'height', null, 'pageY', 'top', speed, 'offsetHeight', false);
        }

        function auto( obj , oUl , aLi , Attr , dot , pageX , dir , speed , attr , onOff ) {

            var now = 0;
            var timer = null;

            for (var i = 0; i < aLi.length; i++) {
                aLi[i].style[Attr] = ( 1 / aLi.length ) * 100 + '%';
            }

            var startPoint = 0; //手指按下去的坐标
            var startX = 0; //ul的left值

            cssStyle( oUl , dir , 0 );
            obj.addEventListener(
                'touchstart',
                function (e) {
                    clearInterval(timer);
                    oUl.style.transition = 'none';
                    var left = parseInt( cssStyle( oUl , dir ) );
                    now = Math.round( -left / obj[attr] );

                    if (dot) {
                        if ( now == 0 ) {
                            now = dot.length;
                        }else if ( now == aLi.length - 1 ) {
                            now = dot.length - 1;
                        }
                    }

                    cssStyle(oUl, dir, -now * obj[attr] + 'px');
                    startPoint = e.changedTouches[0][pageX];
                    startX = parseInt( cssStyle( oUl , dir ) );
                }
            );

            obj.addEventListener(
                'touchmove',
                function (e) {
                    var nowPoint = e.changedTouches[0][pageX];
                    var disX = nowPoint - startPoint;
                    var left = startX + disX;
                    cssStyle( oUl , dir , left + 'px' );
                }
            );

            obj.addEventListener(
                'touchend',
                function () {
                    var left = parseInt( cssStyle( oUl , dir ) );
                    now = Math.round(-left/obj[attr]);
                    dur();
                    if (dot) {
                        tab();
                    }
                    autoPlay();
                }
            );

            if ( onOff ) {
                autoPlay();
            }

            function autoPlay() {
                clearInterval(timer);
                timer = setInterval(function () {
                    if ( now == aLi.length-1 ) {
                        now = dot.length-1;
                    }
                    oUl.style.transition = 'none';
                    cssStyle( oUl , dir , -now*obj[attr] + 'px' );
                    setTimeout(function () {
                        now++;
                        dur();
                        if (dot) {
                            tab();
                        }
                    }, 100);
                }, speed);
            }

            function tab(){
                for (var i=0;i<dot.length;i++ ) {
                    dot[i].className = '';
                }
                dot[now%dot.length].className = 'on';
            }
            function dur() {
                oUl.style.transition = 0.5 + 's';
                cssStyle( oUl , dir , -now*obj[attr] + 'px' );
            }
        }
    },
    //今日列表
    todayList : function ( myJson ) {
        var todayList = document.querySelector(myJson.obj);
        var oUl = todayList.querySelector('ul');
        var aLi = oUl.querySelectorAll('li');

        var css = document.querySelector('#css');

        var str = '.todayList ul{width:' + (aLi.length) * 100 + '%}';
        css.innerHTML += str;
        var dis = 0;

        todayList.addEventListener(
            'touchstart',
            function (e) {
                var touchX = e.changedTouches[0].pageX;
                dis = touchX - oUl.offsetLeft;
                oUl.style.webkitTransition = oUl.style.transition = '';
            }
        );
        todayList.addEventListener(
            'touchmove',
            function (e) {
                var touchX = e.changedTouches[0].pageX;
                var left = touchX - dis;
                oUl.style.left = left + 'px';
            }
        );
        todayList.addEventListener(
            'touchend',
            function () {
                var left = oUl.offsetLeft;
                if ( left > 0 ) {
                    left = 0;
                }

                if ( left < -134 ) {
                    left = -134;
                }
                oUl.style.webkitTransition = oUl.style.transition = '1s';
                oUl.style.left = left + 'px';
            }
        );
    },
    //滚动条
    scrollLine : function ( myJson ) {
        var wrap = document.querySelector(myJson.obj);
        var header = wrap.querySelector(myJson.header);
        var con = wrap.querySelector(myJson.con);

        var minY = wrap.clientHeight - con.offsetHeight;
        var startPoint = 0;
        var startY = 0;
        cssStyle( con , 'top' , 0 );

        var lastDis = 0;
        var lastY = 0;

        var lastTime = 0;
        var lastTimeDis = 0;

        wrap.addEventListener(
            'touchstart',
            function (e) {
                startPoint = e.changedTouches[0].pageY;
                startY = parseInt( cssStyle( con , 'top' ) );

                lastY = lastY;
                lastTime = new Date().getTime();

                lastDis = 0;
                lastTimeDis = 0;
            }
        );
        wrap.addEventListener(
            'touchmove',
            function (e) {
                var nowTime = new Date().getTime();
                var nowPoint = e.changedTouches[0].pageY;
                var dis = nowPoint - startPoint;
                var top = startY + dis;

                if ( top > 0 ) {
                    top = 0;
                    header.style.background = '';
                }else {
                    header.style.background = 'red';
                }
                if ( top < minY ) {
                    top = minY;
                }

                lastDis = nowPoint - lastY;
                lastTimeDis = nowTime - lastTime;

                lastY = nowPoint;
                lastTime = nowTime;

                cssStyle( con , 'top' , top + 'px' );
            }
        );
        wrap.addEventListener(
            'touchend',
            function () {
                var speed = (lastDis / lastTimeDis) * 200;

                var left = parseInt( cssStyle( con , 'top' ) );
                var target = left + speed;
                con.style.transition = '2000ms';
                cssStyle( con , 'top' , target );
            }
        );
    }
};