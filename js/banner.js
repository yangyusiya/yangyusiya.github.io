(function () {
    var banner = document.getElementById("banner"), bannerInner = utils.firstChild(banner),
        bannerTip = utils.next(bannerInner);
    var imgList = bannerInner.getElementsByTagName("img"),
        uList = bannerTip.getElementsByTagName("li");
    var bannerLeft = utils.children(banner, "a")[0], bannerRight = utils.children(banner, "a")[1];
    console.log(bannerRight);
    //1.实现数据绑定
    // (1)Ajax请求数据
    var jsonData = null, count = null;
    ~function () {
        var xhr = new XMLHttpRequest;
        //同步请求
        xhr.open("get", "json/banner.txt?_=" + Math.random(), false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
                jsonData = utils.jsonParse(xhr.responseText);
            }
        };
        xhr.send(null);
    }();


    //(2)按照字符串凭借的方式绑定数据
    ~function () {
        //1)绑定的是轮播图区域的数据
        var str = "";
        if (jsonData) {
            for (var i = 0; i < jsonData.length; i++) {
                var curData = jsonData[i];
                str += '<div><img src="" trueImg=' + curData["img"] + '/></div>';
            }
            str += '<div><img src="" trueImg=' + jsonData[0]["img"] + '/></div>';
        }
        bannerInner.innerHTML = str;
        count = jsonData.length + 1;
        utils.css(bannerInner, "width", count * 800);

        //2)绑定的是焦点区域的数据
        str = '';
        if (jsonData) {
            for (i = 0; i < jsonData.length; i++) {
                i === 0 ? str += '<li class="bg"></li>' : str += '<li></li>';
            }
        }
        bannerTip.innerHTML = str;

    }();

    //2.实现数据延迟加载

    function lazyImg() {
        for (var i = 0; i < imgList.length; i++) {
            ~function (i) {
                var curImg = imgList[i];
                var oImg = new Image;
                oImg.src = curImg.getAttribute("trueImg");
                oImg.onload = function () {
                    curImg.src = this.src;
                    curImg.style.display = "block";
                    oImg = null;
                    animate(curImg, {opacity: 1}, 500);
                }
            }(i);
        }
    }

    window.setTimeout(lazyImg, 1000);

    //4.实现自动轮播
    var step = 0;
    var interval = 1000;//记录的是当前是哪一张图片， 0是抵账图片
    var autoTimer = window.setInterval(autoMove, interval);

    function autoMove() {
        if (step >= (count - 1)) {
            step = 0;
            utils.css(bannerInner, "left", 0);
        }
        step++;
        animate(bannerInner, {left: -step * 800}, 500);
        changeTip();
    }

    //5.实现焦点对齐
    function changeTip() {
        var tempStep = step >= uList.length ? 0 : step;
        for (var i = 0; i < uList.length; i++) {
            var curLi = uList[i];
            i === tempStep ? utils.addClass(curLi, "bg") : utils.removeClass(curLi, "bg");
        }
    }

    //->6.实现听hi和开启自动轮播
    banner.onmouseover = function () {
        window.clearInterval(autoTimer);
        bannerLeft.style.display = "block";
        bannerRight.style.display = "block";
    };
    banner.onmouseout = function () {
        autoTimer = window.setInterval(autoMove, interval);
        bannerLeft.style.display = "none";
        bannerRight.style.display = "none";
    };

    //7.点击焦点实现轮播图切换
    ~function () {
        for (var i = 0; i < uList.length; i++) {
            var curLi = uList[i];
            curLi.index = i;
            curLi.onclick = function () {
                step = this.index;
                changeTip();
                animate(bannerInner, {left: -step * 800}, 500);
            }
        }
    }();

    bannerRight.onclick = autoMove;
    bannerLeft.onclick = function () {
        if (step <= 0) {
            step = count-1;
            utils.css(bannerInner, "left", -step*800);
        }
        step--;
        animate(bannerInner, {left: -step * 800}, 500);
        changeTip();
    }
})();