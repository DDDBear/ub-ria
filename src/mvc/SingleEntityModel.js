/**
 * UB RIA Base
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file 以单个实体为主要数据源的页面的数据模型基类
 * @author otakustay
 */
define(
    function (require) {
        var u = require('../util');

        /**
         * 把实体信息展开到`Model`自身上，以便直接访问到某些属性
         *
         * @param {Object} entity 加载来的实体信息
         * @return {Object} 返回`entity`自身
         */
        function fillEntityToModel(entity) {
            // 而这个实体信息本身还要单独以`entity`为键保存一份，当取消编辑时用作比对
            this.fill(entity);
            return entity;
        }

        var ENTITY_DATASOURCE = {
            entity: function (model) {
                // 如新建页之类的是不需要这个实体的，因此通过是否有固定的`id`字段来判断
                var id = model.get('id');

                if (id) {
                    // 可能作为子Action的时候，从外面传了进来一个实体，
                    // 这个时候就不用自己加载了，直接展开用就行了
                    var entity = model.get('entity');
                    if (entity) {
                        return fillEntityToModel.call(model, entity);
                    }

                    return model.findById(id).then(u.bind(fillEntityToModel, model));
                }

                return {};
            }
        };

        /**
         * 以单个实体为主要数据源的页面的数据模型基类
         *
         * @class mvc.SingleEntityModel
         * @extends mvc.BaseModel
         */
        var exports = {};

        /**
         * @constructs mvc.SingleEntityModel
         * @override
         */
        exports.constructor = function () {
            this.$super(arguments);

            this.putDatasource(ENTITY_DATASOURCE);
        };

        /**
         * 根据id获取实体
         *
         * @param {string | number} id 实体的id
         * @return {Promise}
         */
        exports.findById = function (id) {
            var data = this.data();
            if (!data) {
                throw new Error('No default data object attached to this Model');
            }
            if (typeof data.findById !== 'function') {
                throw new Error('No findById method implemented on default data object');
            }

            return data.findById(id);
        };

        var BaseModel = require('./BaseModel');
        var SingleEntityModel = require('eoo').create(BaseModel, exports);

        return SingleEntityModel;
    }
);
