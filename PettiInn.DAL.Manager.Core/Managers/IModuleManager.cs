﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using PettiInn.DAL.Entities.EF5;

namespace PettiInn.DAL.Manager.Core.Managers
{
    public interface IModuleManager : IManagerBase<Module>
    {
        IEnumerable<Module> GetRoots();

        IEnumerable<Module> GetByRootsAdmin(int adminId);

        IEnumerable<Module> GetAll(bool? isSuper);

        IEnumerable<Module> GetAllByAdmin(int adminId);
    }
}
