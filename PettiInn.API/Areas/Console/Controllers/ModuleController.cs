﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;
using PettiInn.DAL.Manager.Core.Managers;
using PettiInn.SOA.DTO;

namespace PettiInn.API.Areas.Console.Controllers
{
    public class ModuleController : ControllerBase
    {
        //[System.Web.Mvc.HttpPost]
        //public JsonResult GetRootModules(int adminId)
        //{
        //    var manager = this.GetManagerFor<IModuleManager>();
        //    var modules = manager.GetByRootsAdmin(adminId).Select(m => new ModuleDTO(m));

        //    return Json(modules);
        //}

        [System.Web.Mvc.HttpPost]
        public JsonResult GetAll(bool? isSuper)
        {
            var manager = this.GetManagerFor<IModuleManager>();
            var result = manager.GetAll(isSuper);
            var resultDTOs = result.Select(t => new ModuleDTO(t));

            return Json(resultDTOs);
        }

        [System.Web.Mvc.HttpPost]
        public JsonResult GetModules(int adminId)
        {
            var manager = this.GetManagerFor<IModuleManager>();
            var result = manager.GetAllByAdmin(adminId);
            var resultDTOs = result.Select(t => new ModuleDTO(t));

            return Json(resultDTOs);
        }
    }
}
