﻿Ext.define("app.modules.Role",
{
    requires: [
        'app.models.RoleModel',
        'Ext.ux.touch.grid.List',
        'Ext.ux.touch.grid.feature.Feature',
        'Ext.ux.touch.grid.feature.Sorter',
        "app.ux.field.MultiSelect",
        "app.models.ModuleModel"
    ],
    constructor: function (args) {
        this.callParent(arguments);

        var store = Ext.create('Ext.data.Store', {
            model: 'app.models.RoleModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: '/app/Roles',
                actionMethods: { create: "POST", read: "POST", update: "POST", destroy: "POST" },
                reader: {
                    type: 'json'
                }
            }
        });

        var grid = Ext.create('Ext.ux.touch.grid.List', {
            itemId: "roles_grid",
            store: store,

            features: [
                {
                    ftype: 'Ext.ux.touch.grid.feature.Sorter',
                    launchFn: 'initialize'
                }
            ],
            columns: [
                {
                    header: '角色名称',
                    dataIndex: 'Name',
                    style: 'padding-left: 1em;',
                    filter: { type: 'string' }
                }
            ],
            listeners:
            {
                selectionchange: function (view, records, eOpts) {
                    var btn_edit = Ext.Viewport.down("#t_top").down("#btn_edit");
                    btn_edit.setDisabled(!records.length);

                    var btn_delete = Ext.Viewport.down("#t_top").down("#btn_delete");
                    btn_delete.setDisabled(!records.length);
                }
            }
        });

        Ext.Viewport.add(grid);
        this.buildToolbar();
    },

    btn_addHandler: function (btn) {
        var role_add = Ext.Viewport.down("#role_add");

        if (!role_add) {
            var overlay = Ext.Viewport.add({
                xtype: 'app.modules.Role.Add',
                itemId: "role_add"
            });
        }
    },

    buildToolbar: function () {
        var btn_add =
        {
            text: "添加",
            handler: this.btn_addHandler
        };

        var btn_edit =
        {
            itemId: "btn_edit",
            text: "编辑",
            disabled: true,
            handler: function (btn) {
                var selections = Ext.Viewport.down("#roles_grid").getSelection(),
                    role_add = Ext.Viewport.down("#role_add"),
                    id = selections[0].get("Id");

                if (!role_add) {
                    var overlay = Ext.Viewport.add({
                        xtype: 'app.modules.Role.Add',
                        itemId: "role_add",
                        eId: id
                    });
                }
            }
        };

        var btn_delete =
        {
            itemId: "btn_delete",
            text: "删除",
            disabled: true,
            handler: function (btn) {
                util.ask("删除", "您确定要删除角色吗？", function () {
                    var grid = Ext.Viewport.down("#roles_grid"),
                        selections = grid.getSelection(),
                        id = selections[0].get("Id");

                    grid.setMasked({
                        xtype: 'loadmask',
                        message: '请稍候...'
                    });

                    Ext.Ajax.request({
                        url: '/app/DeleteRole',
                        jsonData: {
                            Id: id
                        },
                        scope: this,
                        success: function (response) {
                            var data = Ext.decode(response.responseText);
                            grid.getStore().load();
                            grid.setMasked(false);
                        }
                    });
                });
            }
        };

        var btn_refresh =
        {
            text: "刷新",
            handler: function (btn) {
                var grid = Ext.Viewport.down("#roles_grid");
                grid.getStore().load();
            }
        };

        Ext.Viewport.down("#moduleActions").insert(0, btn_delete);
        Ext.Viewport.down("#moduleActions").insert(0, btn_refresh);
        Ext.Viewport.down("#moduleActions").insert(0, btn_edit);
        Ext.Viewport.down("#moduleActions").insert(0, btn_add);
    },
    destroy: function () {
        var role_add = Ext.Viewport.down("#role_add");

        if (role_add) {
            role_add.destroy();
        }
    }
});

Ext.define("app.modules.Role.Add",
{
    extend: "Ext.Panel",
    id: "pnlRoleAdd",
    xtype: "app.modules.Role.Add",
    config: {
        modal: true,
        centered: true,
        hideOnMaskTap: false,
        layout: "fit",
        width: Ext.os.deviceType == 'Phone' ? 300 : 400,
        height: Ext.os.deviceType == 'Phone' ? '100%' : 250,
        scrollable: true,

        items: [
            {
                xtype: "formpanel",
                listeners:
                {
                    painted: function (comp, opts) {
                        var panel = Ext.getCmp("pnlRoleAdd"),
                            form = panel.down("formpanel");

                        if (panel.config.eId) {
                            form.setMasked({
                                xtype: 'loadmask',
                                message: '请稍候...'
                            });
                            Ext.Ajax.request({
                                url: '/app/GetRole',
                                jsonData: {
                                    roleId: panel.config.eId
                                },
                                scope: this,
                                success: function (response) {
                                    var data = Ext.decode(response.responseText);
                                    form.setValues(data);

                                    if (Ext.isArray(data.Modules)) {
                                        var modules = Ext.Array.map(data.Modules, function (item) {
                                            return item.Id;
                                        });

                                        form.down("#modules").setValue(modules);
                                    }

                                    form.setMasked(false);
                                }
                            });

                            form.setUrl("/app/UpdateRole");
                        }
                        else {
                            form.setUrl("/app/CreateRole");
                        }
                    }
                },
                items: [
                    {
                        xtype: "fieldset",
                        defaultType: "textfield",
                        defaults: {
                            required: true,
                            labelAlign: 'left',
                            autoComplete: false,
                            labelWidth: '40%'
                        },
                        title: "添加角色",
                        items: [
                            {
                                name: 'Name',
                                label: '角色名称'
                            },
                            {
                                xtype: "multiselectfield",
                                itemId: "modules",
                                usePicker: false,
                                displayField: 'Name',
                                valueField: 'Id',
                                label: '权限',
                                store: {
                                    autoLoad: true,
                                    proxy: {
                                        type: 'ajax',
                                        model: "app.models.ModuleModel",
                                        url: '/app/Modules',
                                        actionMethods: { create: "POST", read: "POST", update: "POST", destroy: "POST" },
                                        reader: {
                                            type: 'json'
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                defaultTypes: "button",
                layout: {
                    pack: 'center',
                    align: 'center'
                },
                items: [
                    {
                        text: "提交",
                        ui: "confirm",
                        handler: function (btn) {
                            var form = btn.up("panel").down("formpanel"),
                                eId = btn.up("panel").config.eId,
                                values = form.getValues(),
                                model = Ext.create('app.models.RoleModel', Ext.apply(values, { Id: eId })),
                                modules = form.down("#modules").getValue(),
                                moduleIds = [],
                                errors = model.validate(),
                                msg = '';

                            if (modules && modules.length) {
                                moduleIds = Ext.Array.map(modules, function (item) {
                                    return { Id: item };
                                });
                            }

                            if (!errors.isValid()) {
                                util.err("错误", errors);
                            }
                            else {
                                form.setMasked({
                                    xtype: 'loadmask',
                                    message: '请稍候...'
                                });

                                Ext.apply(values, { Id: eId, Modules: moduleIds });
                                Ext.Ajax.request(
                                {
                                    url: form.getUrl(),
                                    method: "post",
                                    jsonData: values,
                                    success: function (response, opts) {
                                        var obj = Ext.decode(response.responseText);
                                        form.setMasked(false);
                                        if (obj.success) {
                                            var admins_grid = Ext.Viewport.down("#roles_grid");

                                            if (admins_grid) {
                                                admins_grid.getStore().load();
                                            }

                                            btn.up("panel").destroy();
                                        }
                                        else {
                                            util.err("错误", obj.error);
                                        }
                                    }
                                });
                            };
                        }
                    },
                    {
                        text: "重置",
                        handler: function (btn) {
                            btn.up("panel").down("formpanel").reset();
                        }
                    },
                    {
                        text: "取消",
                        ui: "decline",
                        handler: function (btn) {
                            btn.up("panel").destroy();
                        }
                    }
                ]
            }
        ]
    }
});