using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lib.Extensions
{
    public static class GuidExtensions
    {
        /// <summary>
        /// Is null = is null or is guid empty
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static bool IsNull(this Guid value)
        {
            if (value == null || value == Guid.Empty)
                return true;
            else
                return false;
        }

        public static bool IsNull(this Guid? value)
        {
            if (!value.HasValue || value == null || value.Value == Guid.Empty)
                return true;
            else
                return false;
        }
        /// <summary>
        /// Is not null = is not null and is not empty
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static bool IsNotNull(this Guid value)
        {
            if (value != null && value != Guid.Empty)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public static bool IsNotNull(this Guid? value)
        {
            if (value.HasValue && value.Value != null && value.Value != Guid.Empty)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
