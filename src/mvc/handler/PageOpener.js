/**
 * UB RIA Base
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 新页面打开组件基类
 * @author dddbear(dddbear@aliyun.com)
 */
define(
    function (require) {
        /**
         * 新页面打开组件基类
         *
         * @class mvc.handler.PageOpener
         */
        var exports = {};

        /**
         * 转至指定的页面
         *
         * @method mvc.handler.PageOpener#forwardTo
         * @param {string} url 目标页面地址
         * @param {Object} options  其余参数
         */
        exports.forwardTo = function (url, options) {};

        /**
         * 获取页面容器
         *
         * @method mvc.handler.PageOpener#getContainer
         * @return {esui.Control} 容器控件
         */
        exports.getContainer = function () {
            return this.container;
        };

        /**
         * 执行隐藏行为接口，不同形式的页面隐藏方式不同
         *
         * @method mvc.handler.PageOpener#doClose
         */
         exports.doClose = function () {};

        /**
         * 隐藏页面
         *
         * @method mvc.handler.PageOpener#close
         */
        exports.close = function () {
            this.doClose();
            this.fire('close');
        };

        /**
         * 销毁页面接口，不同形式的页面销毁方式不同
         *
         * @method mvc.handler.PageOpener#dispose
         */
        exports.dispose = function () {};

        /**
         * 离开页面
         *
         * @method mvc.handler.PageOpener#leave
         * @return {esui.Control} 容器控件
         */
        exports.leave = function () {
            // 关闭页面
            this.close();
            // 销毁页面
            this.dispose();

            this.fire('leave');
        };

        var PageOpener = require('eoo').create(require('mini-event/EventTarget'), exports);

        return PageOpener;
    }
);
