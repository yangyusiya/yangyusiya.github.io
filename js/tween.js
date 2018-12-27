~function () {
    var effect = {
        Linear: function (time, duration, distance, begin) {
            return (time / duration) * distance + begin;
        }
    };
    function move(curEle, target, duration, callBack) {

        window.clearInterval(curEle.timer);
        var begin = {}, distance = {};
        for (var key in target) {
            if (target.hasOwnProperty(key)) {
                begin[key] = utils.css(curEle, key);
                distance[key] = target[key] - begin[key];
            }
        }
        var time = 0;
        curEle.timer = window.setInterval(function () {
            time += 10;
            if (time >= duration) {
                callBack && callBack.call(curEle);
                utils.css(curEle, target);
                window.clearInterval(curEle.timer);
                return;
            }
            for (var key in target) {
                if (target.hasOwnProperty(key)) {
                    var curPos = effect.Linear(time, duration, distance[key], begin[key]);
                    utils.css(curEle, key, curPos);
                }
            }
        }, 10);
    }
    window.animate = move;
}();