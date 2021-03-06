﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Objects;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PettiInn.DAL.Entities.EF5;
using PettiInn.DAL.Manager.Core.Managers;
using PettiInn.SOA.DTO;
using PettiInn.SOA.DTO.Shared;
using System.Linq.Dynamic;

namespace PettiInn.DAL.Manager.EF5.Managers
{
    internal class RoleManager : ManagerBase<Role>, IRoleManager
    {
        public PagingResult<Role, RoleDTO> Search(SearchCriterias criterias, string name, bool tracking = false)
        {
            var skip = criterias.iDisplayStart;

            if (skip == null)
            {
                skip = (criterias.pageNumber.Value >= criterias.iDisplayLength) ? criterias.pageNumber.Value : criterias.pageNumber.Value * criterias.iDisplayLength;
            }

            var query = base.Query();
            var total = query.Select(r => r.Id).LongCount();

            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(r => r.Name.Contains(name));
            }

            foreach (var sort in criterias.sortings)
            {
                query = query.OrderBy(string.Concat(sort.sort, " ", sort.dir));
            }
            var totalDisplay = query.LongCount();

            query = query.Include(r => r.Modules).Skip(skip.Value).Take(criterias.iDisplayLength);

            if (!tracking)
            {
                query = query.AsNoTracking();
            }

            var pageCount = (int)Math.Ceiling(totalDisplay / (double)criterias.iDisplayLength);

            return new PagingResult<Role, RoleDTO>
            {
                Total = total,
                PageNumber = criterias.pageNumber ?? 0,
                TotalDisplay = totalDisplay,
                PageCount = pageCount,
                PageOfResults = query
            };
        }

        public NHResult<Role> Create(RoleDTO dto)
        {
            var role = new Role
            {
                Name = dto.Name
            };

            var mManager = new ModuleManager();
            var modules = mManager.GetByIds(dto.Modules.Select(m => m.Id));
            role.Modules = modules.ToList();

            var result = base.SaveOrUpdate(role);

            return result;
        }

        public NHResult<Role> Update(SOA.DTO.RoleDTO dto)
        {
            var role = base.GetById(dto.Id);

            var mManager = new ModuleManager();
            var modules = mManager.GetByIds(dto.Modules.Select(m => m.Id));
            role.Modules.Clear();

            foreach (var r in modules)
            {
                role.Modules.Add(r);
            }

            var result = base.SaveOrUpdate(role);

            return result;
        }

        public override NHResult<Role> Delete(int id)
        {
            var result = new NHResult<Role>();
            var obj = this.GetById(id);

            obj.Modules.Clear();
            obj.Administrators.Clear();
            result = base.Delete(id);

            return result;
        }

        internal override DbSet<Role> DBSet
        {
            get { return base.DBContext.Role; }
        }
    }
}
