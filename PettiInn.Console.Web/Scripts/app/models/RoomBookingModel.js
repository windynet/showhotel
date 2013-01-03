﻿Ext.define('app.models.RoomBookingModel', {
    extend: 'app.models.ModelBase',

    config: {
        idProperty: "Id",
        fields: [
            { name: 'Id' },
            { name: 'BookingNumber', type: 'string' },
            { name: 'RoomTypeIds' },
            { name: 'HotelId', type: 'int' },
            { name: 'Price', type: 'NUMBER' },
            { name: 'CurrencyUnitId', type: 'int' },
            { name: 'Deposit', type: 'NUMBER', defaultValue: 0 },
            { name: 'DepositUnitId', type: 'int' },
            { name: 'Start', type: 'MSDate' },
            { name: 'StartTime', type: 'MSDate' },
            { name: 'EndTime', type: 'MSDate' },
            { name: 'End', type: 'MSDate' },
            { name: 'AgentId', type: 'int' },
            { name: 'AdministratorId', type: 'int' },
            { name: 'BookingDate', type: 'MSDate' },
            { name: 'GuestName', type: 'string' },
            { name: 'Status', type: 'int' }
        ],
        validations: [
            { type: 'presence', field: 'RoomTypeIds', message: "请选择预订房型" },
            { type: 'presence', field: 'CurrencyUnitId', message: "请选择价格货币种类" },
            { type: 'presence', field: 'HotelId', message: "请选择房间所属的酒店" },
            {
                type: 'custom', field: 'Price', message: "请输入订房价格，并且价格必须大于零", fn: function (value) {
                    var valid = Ext.data.validations.presence({ field: "Price" }, value) &&
                                value > 0;

                    return valid;
                }
            },
            { type: 'presence', field: 'Start', message: "请输入预订起始时间" },
            { type: 'presence', field: 'End', message: "请输入预订结束时间" },
            { type: 'presence', field: 'GuestName', message: "请输入客人姓名" }
        ]
    }
});