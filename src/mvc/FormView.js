/**
 * UB RIA Base
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file 表单视图基类
 * @exports mvc.FormView
 * @author otakustay
 */
define(
    function (require) {
        require('../ui/DrawerActionPanel');

        var u = require('../util');

        // 使用表单视图，有以下要求：
        //
        // - 有id为`form`的`Form`控件
        // - 所有触发提交的按钮，会触发`form`的`submit`事件
        //
        // 可选：
        //
        // - 可以有一个id为`cancel`的按钮，点击后会触发`cancel`事件

        /**
         * @class mvc.FormView
         * @extends mvc.BaseView
         */
        var exports = {};

        exports.constructor = function () {
            this.$super(arguments);

            // 批量绑定控件事件
            var uiEvents = {
                'form:submit': submit,
                'cancel:click': cancelEdit
            };
            this.addUIEvents(uiEvents);
        };

        /**
         * 提交数据
         *
         * @event
         * @fires mvc.FormView#submit
         */
        function submit() {
            this.fire('submit');
        }

        /**
         * 取消编辑
         *
         * @event
         * @fires mvc.FormView#cancel
         */
        function cancelEdit() {
            this.fire('cancel');
        }

        /**
         * @override
         */
        exports.getUIProperties = function () {
            var uiProperties = this.$super(arguments) || {};

            uiProperties = u.deepClone(uiProperties);
            uiProperties.crumb = {
                linkNodeTemplate: '<a class="${classes}" href="${href}">${text}</a>'
            };

            return uiProperties;
        };

        /**
         * 从表单中获取实体数据
         *
         * @public
         * @method mvc.FormView#getEntity
         * @return {Object}
         */
        exports.getEntity = function () {
            return this.getFormData();
        };

        /**
         * 获取表单数据
         *
         * @protected
         * @method mvc.FormView#getFormData
         * @return {Object}
         */
        exports.getFormData = function () {
            var form = this.get('form');
            return form ? form.getData() : {};
        };

        /**
         * 向用户通知提交错误信息，默认根据`field`字段查找对应`name`的控件并显示错误信息
         *
         * @public
         * @method mvc.FormView#notifyErrors
         * @param {Object} errors 错误信息
         * @param {Array.<meta.FieldError>} errors.fields 出现错误的字段集合
         */
        exports.notifyErrors = function (errors) {
            var Validity = require('esui/validator/Validity');
            var ValidityState = require('esui/validator/ValidityState');
            var form = this.get('form');

            for (var i = 0; i < errors.fields.length; i++) {
                var fail = errors.fields[i];

                var state = new ValidityState(false, fail.message);
                var validity = new Validity();
                validity.addState('server', state);

                var input = form.getInputControls(fail.field)[0];
                if (input && typeof input.showValidity === 'function') {
                    input.showValidity(validity);
                }
            }
        };

        /**
         * 等待用户取消确认
         *
         * @protected
         * @method mvc.FormView#waitCancelConfirm
         * @param {Object} options 配置项
         * @return {er.Promise} 一个`Promise`对象，用户确认则进入`resolved`状态，
         * 用户取消则进入`rejected`状态
         */
        exports.waitCancelConfirm = function (options) {
            return this.waitConfirmForType(options, 'cancel');
        };

        /**
         * 提交时处理函数
         *
         * @method mvc.FormView#waitSubmitConfirm
         * @param {Object} options 配置项
         * @return {er.Promise} 一个`Promise`对象，默认进入`resolved`状态。
         */
        exports.waitSubmitConfirm = function (options) {
            var Deferred = require('er/Deferred');
            return Deferred.resolved();
        };

        /**
         * 等待用户确认操作
         *
         * @param {Object} options 配置项
         * @param {string} type 操作类型
         *
         * @return {er.Promise} 一个`Promise`对象，用户确认则进入`resolved`状态，
         * 用户取消则进入`rejected`状态
         */
        exports.waitConfirmForType = function (options, type) {
            // 加viewContext
            if (!options.viewContext) {
                options.viewContext = this.viewContext;
            }

            var okLabel = '取消' + options.title;
            var cancelLabel = '继续' + options.title;
            if (type === 'update') {
                okLabel = '确认修改';
                cancelLabel = '取消修改';
            }

            var warn = this.get('form-' + type + '-confirm');
            if (warn) {
                warn.hide();
            }

            var wrapper = this.get('submit-section');
            var extendedOptions = {
                wrapper: wrapper,
                id: 'form-' + type + '-confirm',
                okLabel: okLabel,
                cancelLabel: cancelLabel
            };
            u.extend(options, extendedOptions);

            warn = require('../ui/Warn').show(options);

            // 容器的状态要变一下
            var formViewContainer = this.get('form-page');
            formViewContainer.addState('warned');

            // 点击表单编辑区也会关闭
            var formContent = this.get('form-content-main');
            formContent.on(
                'command',
                function (e) {
                    if (e.name === 'form-content-click') {
                        warn.hide();
                    }
                },
                this
            );

            var Deferred = require('er/Deferred');
            var deferred = new Deferred();

            warn.on(
                'ok',
                function () {
                    deferred.resolver.resolve();
                    formViewContainer.removeState('warned');
                }
            );
            warn.on(
                'cancel',
                function () {
                    deferred.resolver.reject();
                    formViewContainer.removeState('warned');
                }
            );
            warn.on(
                'hide',
                function () {
                    deferred.resolver.reject();
                    formViewContainer.removeState('warned');
                }
            );

            return deferred.promise;
        };

        /**
         * 禁用提交操作
         *
         * @protected
         * @method mvc.FormView#disableSubmit
         */
        exports.disableSubmit = function () {
            if (this.viewContext) {
                this.getGroup('submit').disable();
            }
        };

        /**
         * 启用提交操作
         *
         * @protected
         * @method mvc.FormView#enableSubmit
         */
        exports.enableSubmit = function () {
            if (this.viewContext) {
                this.getGroup('submit').enable();
            }
        };

        /**
         * 用户处理弹出抽屉的事件Handle
         *
         * @protected
         * @method mvc.FormView#popDrawerActionPanel
         * @param {mini-event.Event} e 事件参数
         */
        exports.popDrawerActionPanel = function (e) {
            e.preventDefault();
            e.stopPropagation();
            var url = e.target.get('href') + '';
            var targetId = e.target.get('id');

            // 传给 ActionPanel 的 url 是不能带 hash 符号的
            if (url.charAt(0) === '#') {
                url = url.slice(1);
            }
            this.popDrawerAction({url: url}, targetId).show();
        };

        /**
         * 加载 action，参数同 ActionPanel
         *
         * @protected
         * @method mvc.FormView#popDrawerAction
         * @param {Object} options 控件配置项
         * @param {string} targetId 弹出抽屉的源元素id
         * @return {ui.DrawerActionPanel}
         */
        exports.popDrawerAction = function (options, targetId) {
            options.id = options.id || 'form-drawer-action';
            var drawerActionPanel = this.get(options.id);
            var view = this;
            if (!drawerActionPanel) {
                drawerActionPanel = this.create('DrawerActionPanel', options);
                drawerActionPanel.render();
                drawerActionPanel.on('close', saveAndClose, this);
                drawerActionPanel.on(
                    'action@entitysave',
                    function (e) {
                        saveRelatedEntity.call(view, e, targetId);
                    },
                    this
                );
                drawerActionPanel.on('action@handlefinish', handleAfterRelatedEntitySaved, this);
                drawerActionPanel.on('action@submitcancel', cancel);
                drawerActionPanel.on('action@back', back, this);
            }
            else {
                drawerActionPanel.setProperties(options);
            }
            return drawerActionPanel;
        };

        /**
         * 返回并告诉上层保留数据并退出
         *
         * @event
         * @fires mvc.FormView#saveandclose
         * @param {mini-event.Event} e 事件参数
         */
        function saveAndClose(e) {
            e.target.hide();
            this.fire('saveandclose');
        }

        /**
         * 抽屉内Action提交成功后的事件处理句柄
         *
         * @event
         * @param {mini-event.Event} e 事件参数
         * @param {string} targetId 触发事件的链接的id
         */
        function saveRelatedEntity(e, targetId) {
            e.stopPropagation();
            e.preventDefault();
            this.handleAfterRelatedEntitySaved(e.entity, targetId);
        }

        /**
         * 处理抽屉内提交的Action的接口
         *
         * @protected
         * @method mvc.FormView#handleAfterRelatedEntitySaved
         * @param {Object} entity 提交后返回实体
         * @param {string} targetId 触发事件的链接的id
         */
        exports.handleAfterRelatedEntitySaved = function (entity, targetId) {};

        /**
         * 抽屉内Action处理完毕后的事件处理句柄
         *
         * @event
         * @param {mini-event.Event} e 事件参数
         */
        function handleAfterRelatedEntitySaved(e) {
            e.target.hide();
            e.target.dispose();
        }

        /**
         * 取消
         *
         * @event
         * @param {mini-event.Event} e 事件参数
         */
        function cancel(e) {
            e.preventDefault();
            this.dispose();
        }

        /**
         * 返回
         *
         * @event
         * @param {mini-event.Event} e 事件参数
         */
        function back(e) {
            e.stopPropagation();
            e.preventDefault();
            e.target.hide();
        }

        var BaseView = require('./BaseView');
        var FormView = require('eoo').create(BaseView, exports);

        return FormView;
    }
);
