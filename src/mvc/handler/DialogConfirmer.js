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
            options.width = options.width || this.width;

            var viewContext = options.viewContext;

            var dialog = require('esui/Dialog').confirm(options);
            
            var self = this;
            dialog.on(
                'ok',
                function () {
                    self.fire('ok');
                }
            );
            dialog.on(
                'cancel',
                function () {
                    self.fire('cancel');
                }
            );
            dialog.on(
                'hide',
                function () {
                    self.fire('hide');
                }
            );

            this.confirmer = dialog;

            return this.confirmer;
        };

        var DialogConfirmer = require('eoo').create(require('./Confirmer'), exports);

        return DialogConfirmer;
    }
);
