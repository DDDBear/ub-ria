/**
 * UB RIA Base
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 直接跳转型新页面打开组件
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
         * @override
         */
        exports.forwardTo = function (url, options) {
            var locator = require('er/locator');
            locator.redirect(url, options);
        };

        var RedirectPageOpener = require('eoo').create(require('./PageOpener'), exports);

        return RedirectPageOpener;
    }
);
