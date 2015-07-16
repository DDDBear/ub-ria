/**
 * UB RIA Base
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 抽屉型新页面打开组件基类
 * @author dddbear(dddbear@aliyun.com)
 */
define(
    function (require) {
        require('../../ui/DrawerActionPanel');

        /**
         * 新页面打开组件基类
         *
         * @class mvc.handler.DrawerPageOpener
         */
        var exports = {};

        /**
         * @override
         */
        exports.forwardTo = function (url, options) {
            var viewContext = options.viewContext;
            options.id = options.id || 'drawer-action';
            options.url = url;
            var drawerActionPanel = viewContext.get(options.id);

            if (!drawerActionPanel) {
                drawerActionPanel = require('esui').create('DrawerActionPanel', options);
                drawerActionPanel.render();
            }
            else {
                drawerActionPanel.setProperties(options);
            }

            drawerActionPanel.on('close', close, this);
            drawerActionPanel.show();
            this.container = drawerActionPanel;
        };

        /**
         * 点击弹层关闭按钮退出
         *
         * @event
         * @fires mvc.handler.DrawerPageOpener#close
         * @param {mini-event.Event} e 事件参数
         */
        function close(e) {
            this.fire('close');
        }

        /**
         * @override
         */
        exports.doClose = function () {
            // 关闭弹层
            var container = this.getContainer();
            container.hide();
        };

        /**
         * @override
         */
        exports.dispose = function () {
            var container = this.getContainer();
            container.dispose();
        };

        var DrawerPageOpener = require('eoo').create(require('./PageOpener'), exports);

        return DrawerPageOpener;
    }
);
