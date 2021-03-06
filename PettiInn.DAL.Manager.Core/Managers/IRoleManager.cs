﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using PettiInn.SOA.DTO;
using PettiInn.DAL.Entities.EF5;
using PettiInn.SOA.DTO.Shared;

namespace PettiInn.DAL.Manager.Core.Managers
{
    public interface IRoleManager : IManagerBase<Role>
    {
        NHResult<Role> Create(RoleDTO dto);

        NHResult<Role> Update(RoleDTO dto);

        PagingResult<Role, RoleDTO> Search(SearchCriterias criterias, string name, bool tracking = false);
    }
}
