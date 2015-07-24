/**
 * UB RIA Base
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file Warn确认处理组件
 * @author dddbear(dddbear@aliyun.com)
 */
define(
    function (require) {
        /**
         * Warn确认处理组件
         *
         * @class mvc.handler.WarnConfirmer
         */
        var exports = {};

        /**
         * @override
         */
        exports.show = function (options) {
            options.id = options.id || this.confirmerId;
            var viewContext = options.viewContext;

            var warn = viewContext.get(options.id);
            if (warn) {
                warn.hide();
            }

            // 根据配置，获取wrapper
            options.wrapper = viewContext.get(this.wrapperId);

            warn = require('../../ui/Warn').show(options);

            // 容器的状态要变一下
            var formViewContainer = viewContext.get('form-page');
            formViewContainer.addState('warned');
            
            var self = this;
            warn.on(
                'ok',
                function () {
                    formViewContainer.removeState('warned');
                    self.fire('ok');
                }
            );
            warn.on(
                'cancel',
                function () {
                    formViewContainer.removeState('warned');
                    self.fire('cancel');
                }
            );
            warn.on(
                'hide',
                function () {
                    formViewContainer.removeState('warned');
                    self.fire('hide');
                }
            );

            this.confirmer = warn;

            return this.confirmer;
        };

        var WarnConfirmer = require('eoo').create(require('./Confirmer'), exports);

        return WarnConfirmer;
    }
);
