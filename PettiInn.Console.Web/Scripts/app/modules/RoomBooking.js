﻿Ext.define("app.modules.RoomBooking",
    {
        requires: [
            'app.models.HotelModel',
            'app.models.RoleModel',
            'app.models.AgentModel',
            'app.models.RoomTypeModel',
            'app.ux.field.MultiSelect',
            'app.models.CurrencyUnitModel',
            'app.ux.field.TimePickerField'
        ],
        constructor: function (args) {
            this.callParent(arguments);

            var overlay = Ext.Viewport.add({
                xtype: 'app.modules.RoomBooking.Add',
                itemId: "booking_add"
            });
        }
    });

Ext.define("app.modules.RoomBooking.Add",
    {
        extend: "Ext.Panel",
        id: "pnlBookingAdd",
        xtype: "app.modules.RoomBooking.Add",
        config: {
            modal: true,
            centered: true,
            hideOnMaskTap: false,
            layout: "fit",
            width: Ext.os.deviceType == 'Phone' ? "100%" : 400,
            height: Ext.os.deviceType == 'Phone' ? "100%" : 500,
            scrollable: true,

            items: [
                {
                    xtype: "formpanel",
                    listeners:
                    {
                        painted: function (comp, opts) {
                            var panel = Ext.getCmp("pnlBookingAdd"),
                                form = panel.down("formpanel");

                            if (panel.config.eId) {
                                form.setMasked({
                                    xtype: 'loadmask',
                                    message: '请稍候...'
                                });
                                Ext.Ajax.request({
                                    url: '/app/GetAgent',
                                    jsonData: {
                                        id: panel.config.eId
                                    },
                                    scope: this,
                                    success: function (response) {
                                        var data = Ext.decode(response.responseText);
                                        form.data = data;
                                        form.setValues(data);
                                        form.setMasked(false);
                                    }
                                });
                                form.setUrl("/app/UpdateAgent");
                            }
                            else {
                                form.setUrl("/app/RoomBookingAddEdit");
                            }
                        }
                    },
                    items: [
                        {
                            xtype: "fieldset",
                            defaultType: "textfield",
                            margin: "0 0 7 0",
                            defaults: {
                                required: true,
                                labelAlign: 'left',
                                autoComplete: false,
                                labelWidth: '40%'
                            },
                            title: "房态信息",
                            items: [
                                {
                                    xtype: "selectfield",
                                    itemId: "hotels",
                                    name: "HotelId",
                                    displayField: 'Name',
                                    valueField: 'Id',
                                    label: '酒店',
                                    store: {
                                        autoLoad: true,
                                        proxy: {
                                            type: 'ajax',
                                            model: "app.models.HotelModel",
                                            url: '/app/HotelsSimple',
                                            actionMethods: { create: "POST", read: "POST", update: "POST", destroy: "POST" },
                                            reader: {
                                                type: 'json'
                                            }
                                        }
                                    },
                                    listeners:
                                        {
                                            change: function (select, newValue, oldValue, eOpts) {
                                                var panel = select.up("panel").up("panel"),
                                                    form = panel.down("formpanel"),
                                                    roomTypes = form.down("#roomTypes");

                                                var store = roomTypes.getStore();
                                                roomTypes.setValue(null);
                                                store.removeAll(true);
                                                form.setMasked({
                                                    xtype: 'loadmask',
                                                    message: '请稍候...'
                                                });
                                                store.load({
                                                    params: { hotelId: newValue },
                                                    callback: function (records, operation, success) {
                                                        roomTypes.setDisabled(false);
                                                        form.setMasked(false);
                                                        if (panel.config.eId) {
                                                            roomTypes.setValue(form.data.RoomTypeId);
                                                        }
                                                    },
                                                    scope: this
                                                });
                                            }
                                        }
                                },
                                {
                                    xtype: "selectfield",
                                    itemId: "roomTypes",
                                    name: "RoomTypeId",
                                    displayField: 'Name',
                                    valueField: 'Id',
                                    label: '房型',
                                    disabled: true,
                                    store: {
                                        autoLoad: false,
                                        proxy: {
                                            type: 'ajax',
                                            model: "app.models.RoomTypeModel",
                                            url: '/app/RoomTypes',
                                            actionMethods: { create: "POST", read: "POST", update: "POST", destroy: "POST" },
                                            reader: {
                                                type: 'json'
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'container',
                                    layout: "hbox",
                                    items: [
                                        {
                                            xtype: "datepickerfield",
                                            itemId: "dtStart",
                                            name: "Start",
                                            required: true,
                                            label: "入住",
                                            flex: 2,
                                            picker:
                                                {
                                                    fullscreen: true,
                                                    yearFrom: new Date().getFullYear(),
                                                    yearTo: new Date().getFullYear() + 1
                                                },
                                            value: Ext.Date.add(new Date(), Ext.Date.DAY, 1)
                                        },
                                        {
                                            xtype: 'timepickerfield',
                                            flex: 1,
                                            required: true,
                                            value: { hours: 14, minutes: 0 },
                                            name: 'StartTime',
                                            picker: {
                                                hoursTitle: "时",
                                                minutesTitle: "分",
                                                increment: 15
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    layout: "hbox",
                                    items: [
                                        {
                                            xtype: "datepickerfield",
                                            itemId: "dtEnd",
                                            required: true,
                                            name: "End",
                                            label: "离开",
                                            flex: 2,
                                            picker:
                                                {
                                                    fullscreen: true,
                                                    yearFrom: new Date().getFullYear(),
                                                    yearTo: new Date().getFullYear() + 1
                                                },
                                            value: Ext.Date.add(new Date(), Ext.Date.DAY, 2)
                                        },
                                        {
                                            xtype: 'timepickerfield',
                                            flex: 1,
                                            required: true,
                                            value: { hours: 12, minutes: 0 },
                                            name: "EndTime",
                                            picker: {
                                                hoursTitle: "时",
                                                minutesTitle: "分",
                                                increment: 15
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: "hbox",
                                pack: 'center',
                                align: 'center'
                            },
                            items:[
                                    {
                                        xtype: "button",
                                        text: "查询房态",
                                        handler: function (btn) {
                                            var panel = btn.up("panel").up("panel"),
                                                form = panel.down("formpanel");

                                            var data = form.getValues(true, false);

                                            form.setMasked({
                                                xtype: 'loadmask',
                                                message: '请稍候...'
                                            });
                                            Ext.Ajax.request({
                                                url: '/app/RoomBookingAvailability',
                                                method: "post",
                                                jsonData: {
                                                    hotelId: data.HotelId,
                                                    RoomTypeId: data.RoomTypeId,
                                                    start: data.Start,
                                                    end: data.End,
                                                    startTime: data.StartTime,
                                                    endTime: data.EndTime
                                                },
                                                success: function(response){
                                                    var obj = Ext.decode(response.responseText);
                                                    form.setMasked(false);
                                                }
                                            });
                                        }
                                    }
                            ]
                        },
                        {
                            xtype: "fieldset",
                            defaultType: "textfield",
                            defaults: {
                                required: true,
                                labelAlign: 'left',
                                autoComplete: false,
                                labelWidth: '40%'
                            },
                            title: "详细信息",
                            items: [
                                    {
                                        xtype: "selectfield",
                                        name: "AgentId",
                                        displayField: 'Name',
                                        valueField: 'Id',
                                        label: '订房中介',
                                        store: {
                                            autoLoad: true,
                                            proxy: {
                                                type: 'ajax',
                                                model: "app.models.AgentModel",
                                                url: '/app/AgentsSimple',
                                                actionMethods: { create: "POST", read: "POST", update: "POST", destroy: "POST" },
                                                reader: {
                                                    type: 'json'
                                                }
                                            }
                                        }
                                    },
                                {
                                    xtype: 'container',
                                    layout: "hbox",
                                    items: [
                                        {
                                            name: "Price",
                                            flex: 2,
                                            required: true,
                                            xtype: "numberfield",
                                            minValue: 0,
                                            label: "房价"
                                        },
                                        {
                                            xtype: "selectfield",
                                            flex: 1,
                                            required: true,
                                            name: "CurrencyUnitId",
                                            displayField: 'Name',
                                            valueField: 'Id',
                                            store: {
                                                autoLoad: true,
                                                proxy: {
                                                    type: 'ajax',
                                                    model: "app.models.CurrencyUnitModel",
                                                    url: '/app/CurrencyUnitsSimple',
                                                    actionMethods: { create: "POST", read: "POST", update: "POST", destroy: "POST" },
                                                    reader: {
                                                        type: 'json'
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'GuestName',
                                    autoComplete: false,
                                    required: true,
                                    label: '客人姓名'
                                },
                                {
                                    xtype: "selectfield",
                                    name: "Status",
                                    displayField: 'Name',
                                    valueField: 'Value',
                                    label: '预订状态',
                                    store: {
                                        autoLoad: true,
                                        fields: ["Name", "Value"],
                                        proxy: {
                                            type: 'ajax',
                                            url: '/app/BookingStatuses',
                                            actionMethods: { create: "POST", read: "POST", update: "POST", destroy: "POST" },
                                            reader: {
                                                type: 'json'
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'container',
                                    layout: "hbox",
                                    items: [
                                            {
                                                name: "Deposit",
                                                xtype: "numberfield",
                                                minValue: 0,
                                                value: 0,
                                                flex: 2,
                                                label: "定金"
                                            },
                                            {
                                                xtype: "selectfield",
                                                flex: 1,
                                                required: true,
                                                name: "DepositUnitId",
                                                displayField: 'Name',
                                                valueField: 'Id',
                                                store: {
                                                    autoLoad: true,
                                                    proxy: {
                                                        type: 'ajax',
                                                        model: "app.models.CurrencyUnitModel",
                                                        url: '/app/CurrencyUnitsSimple',
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
                                    model = Ext.create('app.models.RoomBookingModel', Ext.apply(values, { Id: eId })),
                                    errors = model.validate(),
                                    msg = '';
                                
                                if (!errors.isValid()) {
                                    util.err("错误", errors);
                                }
                                else {
                                    form.setMasked({
                                        xtype: 'loadmask',
                                        message: '请稍候...'
                                    });
                                    Ext.apply(values, { Id: eId });
                                    Ext.Ajax.request(
                                    {
                                        url: form.getUrl(),
                                        method: "post",
                                        jsonData: values,
                                        success: function (response, opts) {
                                            var obj = Ext.decode(response.responseText);
                                            form.setMasked(false);
                                            if (obj.success) {
                                                //var rooms_grid = Ext.Viewport.down("#agents_grid");

                                                //if (rooms_grid) {
                                                //    rooms_grid.getStore().load();
                                                //}

                                                //btn.up("panel").destroy();
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