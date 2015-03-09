/**
 * UB RIA Base
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file 只读页数据模型基类
 * @author otakustay
 */
define(
    function (require) {
        /**
         * 只读页数据模型基类
         *
         * @class mvc.ReadModel
         * @extends mvc.SingleEntityModel
         */
        var exports = {};

        /**
         * 字段无值时的默认显示文本，默认为`"--"`
         *
         * @member mvc.ReadModel#defaultDisplayText
         * @type {string}
         */
        exports.defaultDisplayText = '--';

        // 全局所有Model都可能有的属性名，这些属性不需要被自动转为`'--'`
        var GLOBAL_MODEL_PROPERTIES = {
            url: true,
            referrer: true,
            isChildAction: true,
            container: true,
            entity: true
        };

        /**
         * 获取属性值
         *
         * @param {string} name 属性名称
         * @return {*} 对应属性的值，如果不存在属性则返回{@link ReadModel#defaultDisplayText}
         * @override
         */
        exports.get = function (name) {
            var value = this.$super(arguments);

            if (GLOBAL_MODEL_PROPERTIES.hasOwnProperty(name)) {
                return value;
            }

            return this.hasReadableValue(name) ? value : this.defaultDisplayText;
        };

        var SingleEntityModel = require('./SingleEntityModel');
        var ReadModel = require('eoo').create(SingleEntityModel, exports);

        return ReadModel;
    }
);
