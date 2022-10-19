using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lib.BusinessLogic
{
    [Serializable]
    public class MyInvalidDataExceptions : Exception
    {
        public MyInvalidDataExceptions()
        {

        }

        public MyInvalidDataExceptions(string message) : base(message)
        {

        }

        public MyInvalidDataExceptions(string message, Exception innerException) : base(message, innerException)
        {

        }
    }
}
