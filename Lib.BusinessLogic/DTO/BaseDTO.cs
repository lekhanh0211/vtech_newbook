using Lib.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lib.BusinessLogic.DTO
{
    public class BaseDTO
    {
        [Key]
        public Guid Id { get; set; }
    }
}
