using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Lib.DataAccess
{
    /// <summary>
    /// Defined a proxy object with a possibly dirty state.
    /// </summary>
    public interface IProxy //must be kept public
    {
        /// <summary>
        /// Whether the object has been changed.
        /// </summary>
        bool IsDirty { get; set; }
    }
    public static class TypeExtension
    {
        public static List<PropertyInfo> ComputedProperties(Type type)
        {
            var computedProperties = TypeProperties(type).Where(p => p.GetCustomAttributes(true).Any(a => a is ComputedAttribute)).ToList();
            return computedProperties;
        }
        public static List<PropertyInfo> ExplicitKeyProperties(Type type)
        {
            var explicitKeyProperties = TypeProperties(type).Where(p => p.GetCustomAttributes(true).Any(a => a is ExplicitKeyAttribute)).ToList();
            return explicitKeyProperties;
        }
        public static List<PropertyInfo> KeyProperties(Type type)
        {
            var allProperties = TypeProperties(type);
            var keyProperties = allProperties.Where(p => p.GetCustomAttributes(true).Any(a => a is KeyAttribute)).ToList();

            if (keyProperties.Count == 0)
            {
                var idProp = allProperties.Find(p => string.Equals(p.Name, "id", StringComparison.CurrentCultureIgnoreCase));
                if (idProp != null && !idProp.GetCustomAttributes(true).Any(a => a is ExplicitKeyAttribute))
                {
                    keyProperties.Add(idProp);
                }
            }
            return keyProperties;
        }

        public static List<PropertyInfo> TypeProperties(Type type)
        {
            var properties = type.GetProperties().Where(IsWriteable).ToArray();
            return properties.ToList();
        }
        private static bool IsWriteable(PropertyInfo pi)
        {
            var attributes = pi.GetCustomAttributes(typeof(WriteAttribute), false).AsList();
            if (attributes.Count != 1) return true;

            var writeAttribute = (WriteAttribute)attributes[0];
            return writeAttribute.Write;
        }
    }

    /// <summary>
    /// Defines the name of a table to use in Dapper.Contrib commands.
    /// </summary>
    [AttributeUsage(AttributeTargets.Class)]
    public class TableAttribute : Attribute
    {
        /// <summary>
        /// Creates a table mapping to a specific name for Dapper.Contrib commands
        /// </summary>
        /// <param name="tableName">The name of this table in the database.</param>
        public TableAttribute(string tableName)
        {
            Name = tableName;
        }

        /// <summary>
        /// The name of the table in the database
        /// </summary>
        public string Name { get; set; }
    }

    /// <summary>
    /// Specifies that this field is a primary key in the database
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public class KeyAttribute : Attribute
    {
    }

    /// <summary>
    /// Specifies that this field is a explicitly set primary key in the database
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public class ExplicitKeyAttribute : Attribute
    {
    }

    /// <summary>
    /// Specifies whether a field is writable in the database.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public class WriteAttribute : Attribute
    {
        /// <summary>
        /// Specifies whether a field is writable in the database.
        /// </summary>
        /// <param name="write">Whether a field is writable in the database.</param>
        public WriteAttribute(bool write)
        {
            Write = write;
        }

        /// <summary>
        /// Whether a field is writable in the database.
        /// </summary>
        public bool Write { get; }
    }

    /// <summary>
    /// Specifies that this is a computed column.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public class ComputedAttribute : Attribute
    {
    }
}
