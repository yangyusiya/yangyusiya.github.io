var utils = (function () {
    var flag = "getComputedStyle" in window;

    //->listToArray：把类数组转换为数组
    function listToArray(likeArray) {
        if (flag) {
            return  Array.prototype.slice.call(likeArray);
        }
        var ary = [];
        for (var i = 0; i < likeArray.length; i++) {
            ary[ary.length] = likeArray[i];
        }
        return ary;
    }

    //jsonParse：把JSON格式的字符串转换为JSON格式的对象(IE6-7中window下没有JSON对象)
    function jsonParse(str) {
        var val = null;
        try {
            val = JSON.parse(str);
        } catch (e) {
            val = eval("(" + str + ")");
        }
        return val;
    }

    //->offset：获取页面中任意元素距离BODY的偏移
    function offset(curEle) {
        var totalLeft = curEle.offsetLeft, totalTop = curEle.offsetTop, par = curEle.offsetParent;

        if (par) {
            if (navigator.userAgent.indexOf("MSIE 8.0") === -1) {
                totalLeft += par.clientLeft;
                totalTop += par.clientTop;
            }

            totalLeft += par.offsetLeft;
            totalTop += par.offsetTop;

            par = par.offsetParent;
        }

        return {left: totalLeft, top: totalTop};
    }

    //->win：操作浏览器的盒子模型信息
    function win(attr, value) {
        if (typeof value === "undefined") {
            return document.documentElement[attr] || document.body[attr];
        } else {
            document.documentElement[attr] = value;
            document.body[attr] = value;
        }
    }

    //->getCss：获取元素的样式信息
    function getCss(attr) {
        var val = null, reg = null;
        if (flag) {
            val = window.getComputedStyle(this, null)[attr];
        } else {
            if (attr === "opacity") {
                val = this.currentStyle["filter"];
                reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/i;
                val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
            } else {
                val = this.currentStyle[attr];
            }
        }
        reg = /^(-?\d+(\.\d+)?)(px|pt|em|rem)?$/i;
        return reg.test(val) ? parseFloat(val) : val;
    }

    //->children：获取所有的元素子节点
    function children(curEle, tagName) {
        var ary = [];
        if (!flag) {
            var nodeList = curEle.childNodes;
            for (var i = 0; i < nodeList.length; i++) {
                var curNode = nodeList[i];
                if (curNode.nodeType === 1) {
                    ary[ary.length] = curNode;
                }
            }
            nodeList = null;
        } else {
            ary = this.listToArray(curEle.children);
        }
        if (typeof tagName === "string") {
            for (var j = 0; j < ary.length; j++) {
                var curElementNode = ary[j];
                if (curElementNode.tagName.toLowerCase() !== tagName.toLowerCase()) {
                    ary.splice(j, 1);
                    j--;
                }
            }
        }
        return ary;
    }

    //->prev：获取上一个哥哥元素节点
    //->首先获取当前元素的上一个哥哥节点，判断是否为元素节点，不是的话基于当前的继续
    // 找上面的哥哥节点...一直找到哥哥元素节点为止，如果没有元素节点，返回null即可
    function previous(curEle) {
        if (flag) {
            return curEle.previousElementSibling;
        }
        var pre = curEle.previousSibling;
        while (pre && pre.nodeType !== 1) {
            pre = pre.previousSibling;
        }
        return pre;
    }

    //->next：获取下一个弟弟元素节点
    function next(curEle) {
        if (flag) {
            return curEle.nextElementSibling;
        }
        var next = curEle.nextSibling;
        while (next && next.nodeType !== 1) {
            next = next.nextSibling;
        }
        return next;
    }

    //->prevAll：获取所有的哥哥元素节点
    function previousAll(curEle) {
        var ary = [];
        var pre = this.previous(curEle);
        while (pre) {
            ary.unshift(pre);
            pre = this.previous(pre);
        }
        return ary;
    }

    //->nextAll： 获取所有的弟弟元素节点
    function nextAll(curEle) {
        var ary = [];
        var next = this.next(curEle);
        while (next) {
            ary.push(next);
            next = this.next(next);
        }
        return ary;
    }

    //->sibling：获取相邻的两个元素节点
    function sibling(curEle) {
        var pre = this.previous(curEle);
        var next = this.next(curEle);
        var ary = [];
        pre ? ary.push(pre) : null;
        next ? ary.push(next) : null;
        return ary;
    }

    //->siblings：获取所有的兄弟元素节点
    function siblings(curEle) {
        return this.previousAll(curEle).concat(this.nextAll(curEle));
    }

    //->index：获取当前元素的索引
    function index(curEle) {
        return this.previousAll(curEle).length;
    }

    //->firstChild：获取第一个元素子节点
    function firstChild(curEle) {
        var children = this.children(curEle);
        return children.length > 0 ? children[0] : null;
    }

    //->lastChild：获取最后一个元素子节点
    function lastChild(curEle) {
        var children = this.children(curEle);
        return children.length > 0 ? children[children.length - 1] : null;
    }

    //->append:向指定容器的末尾追加元素
    function append(newEle, container) {
        container.appendChild(newEle);
    }

    //->prepend:向指定容器的开头追加元素
    //->把新元素添加到容器中第一个子元素节点的前面
    //->如果一个元素节点也没有放在前面和后面是一样的
    function prepend(newEle, container) {
        var first = this.firstChild(container);
        if (first) {
            container.insertBefore(newEle, first);
            return;
        }
        container.appendChild(newEle);
    }

    //->insertBefore:向容器指定元素的前面追加
    function insertBefore(newEle, oldEle) {
        oldEle.parentNode.insertBefore(newEle, oldEle);
    }

    //->insertAfter:向容器指定元素的后面追加
    //->相当于追加到oldEle的弟弟元素的前面
    function insertAfter(newEle, oldEle) {
        var next = this.next(oldEle);
        if (next) {
            oldEle.parentNode.insertBefore(newEle, oldEle);
        }
        oldEle.parentNode.appendChild(newEle);
    }

    //->hasClass:验证当前元素是否包含className这个样式类名
    function hasClass(curEle, className) {
        var reg = new RegExp("(^| +)" + className + "( +|$)");
        return reg.test(curEle.className);
    }

    //->addClass:给元素增加样式类名
    function addClass(curEle, className) {
        var ary = className.split(/ +/g);
        for (var i = 0; i < ary.length; i++) {
            var curName = ary[i];
            if (!this.hasClass(curEle, curName)) {
                curEle.className += " " + curName;
            }
        }
    }

    //->removeClass:给元素移除样式类名
    function removeClass(curEle, className) {
        var ary = className.split(/ +/g);
        for (var i = 0; i < ary.length; i++) {
            var curName = ary[i];
            if (this.hasClass(curEle, curName)) {
                var reg = new RegExp("(^| +)" + curName + "( +|$)", "g");
                curEle.className = curEle.className.replace(reg, " ");
            }
        }
    }

    //->getElementsByClass:通过元素的样式类名获取一组元素集合
    function getElementsByClass(strClass, context) {
        context = context || document;
        if (flag) {
            return this.listToArray(context.getElementsByClassName(strClass));
        }
        //->IE6-8
        var ary = [];
        var strClassAry = strClass.replace(/(^ +| +$)/g, "").split(/ +/g);
        var nodeList = context.getElementsByTagName("*");
        for (var i = 0; i < nodeList.length; i++) {
            var curNode = nodeList[i];
            var isExist = true;
            for (j = 0; j < strClassAry.length; j++) {
                var reg = new RegExp("(^| +)" + strClassAry[j] + "( +|$)", "g");
                if (!reg.test(curNode.className)) {
                    isExist = false;
                    break;
                }
            }
            if (isExist) {
                ary[ary.length] = curNode;
            }
        }
        return ary;
    }

    //->setCss：给当前元素的某一个样式设置属性值（增加在行内样式上）
    function setCss(attr, value) {
        if (attr === "float") {
            this["style"]["cssFloat"] = value;
            this["style"]["styleFloat"] = value;
            return;
        }
        if (attr === "opacity") {
            this["style"]["opacity"] = value;
            this["style"]["filter"] = "alpha(opacity=" + value * 100 + ")";
            return;
        }
        var reg = /^(width|height|top|bottom|left|right|((padding|margin)(Top|Bottom|Left|Right)?))$/;
        if (reg.test(attr)) {
            if (!isNaN(value)) {
                value += "px";
            }
        }
        this["style"][attr] = value;
    }


    //->setGroupCss:给当前元素批量的设置样式属性值
    function setGroupCss(object) {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                setCss.call(this, key, object[key]);
            }
        }
    }

    //->css:此方法实现了获取、单独设置、批量设置元素的样式值
    function css(curEle) {
        var ary = Array.prototype.slice.call(arguments, 1);
        var argTwo = arguments[1];
        if (typeof argTwo === "string") {
            if (typeof arguments[2] === "undefined") {
                return getCss.apply(curEle, ary);
            }
            setCss.apply(curEle, ary);
        }
        argTwo = argTwo || 0;
        if (argTwo.toString() === "[object Object]") {
            setGroupCss.apply(curEle, ary);
        }
    }


    //->把外界需要使用的方法暴露给utils
    return {
        listToArray: listToArray,
        jsonParse: jsonParse,
        offset: offset,
        win: win,
        children: children,
        previous: previous,
        next: next,
        previousAll: previousAll,
        nextAll: nextAll,
        sibling: sibling,
        siblings: siblings,
        index: index,
        firstChild: firstChild,
        lastChild: lastChild,
        append: append,
        prepend: prepend,
        insertBefore: insertBefore,
        insertAfter: insertAfter,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        getElementsByClass: getElementsByClass,
        css: css
    }
})();