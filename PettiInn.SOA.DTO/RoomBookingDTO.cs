﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PettiInn.DAL.Entities.EF5;

namespace PettiInn.SOA.DTO
{
    public class RoomBookingDTO : DTOBase<RoomBooking>
    {
        public RoomBookingDTO() { }

        public RoomBookingDTO(RoomBooking entity)
            : base(entity)
        {

        }

        public RoomBookingDTO(NHResult<RoomBooking> result)
            : base(result)
        {

        }

        public RoomBookingDTO(IEnumerable<Query> query, RoomBooking entity)
            : base(query, entity)
        {
            
        }

        public string BookingNumber { get; set; }
        public int RoomId { get; set; }
        public int HotelId { get; set; }
        public decimal Price { get; set; }
        public Nullable<decimal> Deposit { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public Nullable<int> AgentId { get; set; }
        public Nullable<int> AdministratorId { get; set; }
        public DateTime BookingDate { get; set; }
        public int Status { get; set; }
        public int CurrencyUnitId { get; set; }
        public Nullable<int> DepositUnitId { get; set; }
        public string GuestName { get; set; }

        public AdministratorDTO Administrator { get; set; }
        public AgentDTO Agent { get; set; }
        public HotelDTO Hotel { get; set; }
        public RoomDTO Room { get; set; }
        public CurrencyUnitDTO PriceCurrencyUnit { get; set; }
        public CurrencyUnitDTO DepositCurrencyUnit { get; set; }
        public RoomBookingCancelDTO RoomBookingCancel { get; set; }
    }
}
