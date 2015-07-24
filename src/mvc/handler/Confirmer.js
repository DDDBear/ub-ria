/**
 * UB RIA Base
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 确认处理组件基类
 * @author dddbear(dddbear@aliyun.com)
 */
define(
    function (require) {
        /**
         * 确认处理组件基类
         *
         * @class mvc.handler.WarnConfirmer
         */
        var exports = {};

        exports.confirmer = null;

        /**
         * 获取下一个组件
         *
         * @method mvc.handler.Confirmer#show
         * @return {Confirmer}
         */
        exports.show = function (options) {
            return this.confirmer;
        };

        var Confirmer = require('eoo').create(require('mini-event/EventTarget'), exports);

        return Confirmer;
    }
);
