using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lib.BusinessLogic.Model
{
    public class HTRoleMenuModel : BaseModel
    {
        public Guid IdRole { get; set; }
        public Guid IdMenu { get; set; }
        public string Domain { get; set; }
        public decimal UuTien { get; set; }
        public Guid? IdParent { get; set; }
        public string DisplayText { get; set; }
        public string Icon { get; set; }
        public string ControllerName { get; set; }
        public string ActivityName { get; set; }
        public string UrlState { get; set; }
        public string Type { get; set; }
        public string Params { get; set; }
        /// <summary>
        /// Cho biết menu này thuộc nhóm menu cấp 1
        /// </summary>
        public bool IsParentGroup { get; set; }
        public IList<HTRoleMenuModel> Children { get; set; }
    }

    public class ObjMenuItem
    {
        public string Controller { get; set; }
        public string Action { get; set; }
        public string Icon { get; set; }
        public string Text { get; set; }
        public int UuTien { get; set; }
        public bool IsParent { get; set; }
        public string Type { get; set; }
        public string Params { get; set; }
        public string UrlState { get; set; }
        public IEnumerable<ObjMenuItem> Children { get; set; }
    }
}
