/**
 * UB RIA Base
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file 文本框控件自动去除首尾空格
 * @author lixiang(lixiang05@baidu.com)
 */
define(
    function (require) {
        var lib = require('esui/lib');
        var InputControl = require('esui/InputControl');
        var main = require('esui/main');

        /**
         * 文本框自动去除首尾空格扩展
         *
         * @class ui.extension.TrimInput
         * @extends esui.Extension
         */
        var exports = {};

        /**
         * 扩展的类型，始终为`"TrimInput"`
         *
         * @member ui.extension.TrimInput#type
         * @type {string}
         * @readonly
         * @override
         */
        exports.type = 'TrimInput';

        /**
         * @override
         */
        exports.activate = function () {
            var target = this.target;
            // 暂时只对`InputControl`控件生效
            if (!(target instanceof InputControl)) {
                return;
            }

            target.on('afterrender', trim, this);
            target.on('change', trim, this);

            this.$super(arguments);
        };

        /**
         * @override
         */
        exports.inactivate = function () {
            var target = this.target;
            // 只对`InputControl`控件生效
            if (!(target instanceof InputControl)) {
                return;
            }

            target.un('afterrender', trim, this);
            target.un('change', trim, this);

            this.$super(arguments);
        };

        function trim() {
            var trimedValue = lib.trim(this.target.getValue());
            this.target.setValue(trimedValue);
        }

        var Extension = require('esui/Extension');
        var TrimInput = require('eoo').create(Extension, exports);

        main.registerExtension(TrimInput);

        return TrimInput;
    }
);
