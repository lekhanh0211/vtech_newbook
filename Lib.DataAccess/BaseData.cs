using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Dapper;
using System.Data.SqlClient;
using Dapper.Contrib.Extensions;
using System.Reflection;
using System.Text;

namespace Lib.DataAccess
{
    public class BaseData : IDisposable
    {
        #region Hàm khởi tạo
        private string _fixParam = "@";
        BaseSQL data;
        private List<SqlParameter> sp;
        private List<SqlParameter> optSp;

        public List<SqlParameter> Sp
        {
            get
            {
                return sp;
            }

            set
            {
                sp = value;
            }
        }

        public List<SqlParameter> OptSp
        {
            get
            {
                return optSp;
            }
            set
            {
                optSp = value;
            }
        }

        public BaseData(string configName = "")
        {
            data = new BaseSQL(configName);
            Sp = new List<SqlParameter>();
            OptSp = new List<SqlParameter>();
        }

        public void Dispose()
        {
            if (data != null && data.ConnectStatus)
            {
                data.closeConnect();
            }
        }

        public SqlConnection Conn
        {
            get
            {
                data.openConnect();
                return data.conn;
            }
        }
        #endregion
        #region Public method query
        public T SelectById<T>(Guid id)
        {
            var tbName = typeof(T).Name;
            return this.Conn.Query<T>(@"select * from " + tbName + " where Id = @id"
                    , new { id = id }).FirstOrDefault();
        }
        public IEnumerable<T> Query<T>(string sql, object param = null, IDbTransaction transaction = null, bool buffered = true, int? commandTimeout = null, CommandType? commandType = null)
        {
            return this.Conn.Query<T>(sql, param, transaction, buffered, commandTimeout, commandType);
        }
        public IEnumerable<T> QueryAndTotal<T>(string sql, out int _total, object param = null, IDbTransaction transaction = null, int? commandTimeout = null, CommandType? commandType = null)
        {
            _total = 0;
            var vRows =  this.Conn.QueryMultiple(sql, param, transaction, commandTimeout, commandType);
            _total = vRows.Read<int>().FirstOrDefault();
            return vRows.Read<T>();
        }

        public IEnumerable<T> ExecuteProc<T>(string sql, object param = null, IDbTransaction transaction = null, bool buffered = true, int? commandTimeout = null)
        {
            return this.Conn.Query<T>(sql, param, transaction, buffered, commandTimeout, CommandType.StoredProcedure);
        }

        public int Execute(string sql, object param = null, IDbTransaction transaction = null, int? commandTimeout = null, CommandType? commandType = null)
        {
            return this.Conn.Execute(sql, param, transaction, commandTimeout, commandType);
        }
        /// <summary>
        /// Inserts an entity into table "Ts" and returns identity id or number of inserted rows if inserting a list.
        /// </summary>
        /// <typeparam name="T">The type to insert.</typeparam>
        /// <param name="entityToInsert">Entity to insert, can be list of entities</param>
        /// <param name="transaction">The transaction to run under, null (the default) if none</param>
        /// <param name="commandTimeout">Number of seconds before command execution timeout</param>
        /// <returns>Identity of inserted entity, or number of inserted rows if inserting a list</returns>
        public int Insert<T>(T entityToInsert, IDbTransaction transaction = null, int? commandTimeout = null) where T : class
        {
            var isList = false;

            var type = typeof(T);

            if (type.IsArray)
            {
                isList = true;
                type = type.GetElementType();
            }
            else if (type.IsGenericType)
            {
                var typeInfo = type.GetTypeInfo();
                bool implementsGenericIEnumerableOrIsGenericIEnumerable =
                    typeInfo.ImplementedInterfaces.Any(ti => ti.IsGenericType && ti.GetGenericTypeDefinition() == typeof(IEnumerable<>)) ||
                    typeInfo.GetGenericTypeDefinition() == typeof(IEnumerable<>);

                if (implementsGenericIEnumerableOrIsGenericIEnumerable)
                {
                    isList = true;
                    type = type.GetGenericArguments()[0];
                }
            }

            var name = typeof(T).Name;
            var sbColumnList = new StringBuilder(null);
            var allProperties = TypeExtension.TypeProperties(type);
            //var keyProperties = TypeExtension.KeyProperties(type);
            var computedProperties = TypeExtension.ComputedProperties(type);
            var allPropertiesExceptKeyAndComputed = allProperties.Except(computedProperties).ToList();

            for (var i = 0; i < allPropertiesExceptKeyAndComputed.Count; i++)
            {
                var property = allPropertiesExceptKeyAndComputed[i];
                sbColumnList.AppendFormat("{0}", property.Name);
                if (i < allPropertiesExceptKeyAndComputed.Count - 1)
                    sbColumnList.Append(", ");
            }

            var sbParameterList = new StringBuilder(null);
            for (var i = 0; i < allPropertiesExceptKeyAndComputed.Count; i++)
            {
                var property = allPropertiesExceptKeyAndComputed[i];
                sbParameterList.AppendFormat("{0}{1}", _fixParam, property.Name);
                if (i < allPropertiesExceptKeyAndComputed.Count - 1)
                    sbParameterList.Append(", ");
            }

            int returnVal;

            if (!isList)    //single entity
            {
                //var cmd = $"insert into {name} ({sbColumnList}) values ({sbParameterList});select SCOPE_IDENTITY() id";
                //var multi = this.Conn.QueryMultiple(cmd, entityToInsert, transaction, commandTimeout);

                //var first = multi.Read().FirstOrDefault();
                //if (first == null || first.id == null) return 0;

                //var id = (int)first.id;
                //var propertyInfos = keyProperties as PropertyInfo[] ?? keyProperties.ToArray();
                //if (propertyInfos.Length == 0) return id;

                //var idProperty = propertyInfos[0];
                //idProperty.SetValue(entityToInsert, Convert.ChangeType(id, idProperty.PropertyType), null);

                //return id;
                var cmd = $"insert into {name} ({sbColumnList}) values ({sbParameterList})";
                returnVal = this.Conn.Execute(cmd, entityToInsert, transaction, commandTimeout);
            }
            else
            {
                //insert list of entities
                var cmd = $"insert into {name} ({sbColumnList}) values ({sbParameterList})";
                returnVal = this.Conn.Execute(cmd, entityToInsert, transaction, commandTimeout);
            }
            return returnVal;

        }
        /// <summary>
        /// Updates entity in table "Ts", checks if the entity is modified if the entity is tracked by the Get() extension.
        /// </summary>
        /// <typeparam name="T">Type to be updated</typeparam>
        /// <param name="entityToUpdate">Entity to be updated</param>
        /// <param name="transaction">The transaction to run under, null (the default) if none</param>
        /// <param name="commandTimeout">Number of seconds before command execution timeout</param>
        /// <returns>true if updated, false if not found or not modified (tracked entities)</returns>
        public bool Update<T>(T entityToUpdate, IDbTransaction transaction = null, int? commandTimeout = null) where T : class
        {
            if (entityToUpdate is IProxy proxy && !proxy.IsDirty)
            {
                return false;
            }

            var type = typeof(T);

            if (type.IsArray)
            {
                type = type.GetElementType();
            }
            else if (type.IsGenericType)
            {
                var typeInfo = type.GetTypeInfo();
                bool implementsGenericIEnumerableOrIsGenericIEnumerable =
                    typeInfo.ImplementedInterfaces.Any(ti => ti.IsGenericType && ti.GetGenericTypeDefinition() == typeof(IEnumerable<>)) ||
                    typeInfo.GetGenericTypeDefinition() == typeof(IEnumerable<>);

                if (implementsGenericIEnumerableOrIsGenericIEnumerable)
                {
                    type = type.GetGenericArguments()[0];
                }
            }

            var keyProperties = TypeExtension.KeyProperties(type).ToList();  //added ToList() due to issue #418, must work on a list copy
            var explicitKeyProperties = TypeExtension.ExplicitKeyProperties(type);
            if (keyProperties.Count == 0 && explicitKeyProperties.Count == 0)
                throw new ArgumentException("Entity must have at least one [Key] or [ExplicitKey] property");

            var name = typeof(T).Name;

            var sb = new StringBuilder();
            sb.AppendFormat("update {0} set ", name);

            var allProperties = TypeExtension.TypeProperties(type);
            keyProperties.AddRange(explicitKeyProperties);
            var computedProperties = TypeExtension.ComputedProperties(type);
            var nonIdProps = allProperties.Except(keyProperties.Union(computedProperties)).ToList();

            for (var i = 0; i < nonIdProps.Count; i++)
            {
                var property = nonIdProps[i];
                sb.AppendFormat("{0} = {1}{0}", property.Name, _fixParam);
                if (i < nonIdProps.Count - 1)
                    sb.Append(", ");
            }
            sb.Append(" where ");
            for (var i = 0; i < keyProperties.Count; i++)
            {
                var property = keyProperties[i];
                sb.AppendFormat("{0} = {1}{0}", property.Name, _fixParam);
                if (i < keyProperties.Count - 1)
                    sb.Append(" and ");
            }
            var updated = this.Conn.Execute(sb.ToString(), entityToUpdate, commandTimeout: commandTimeout, transaction: transaction);
            return updated > 0;

        }
        /// <summary>
        /// Delete entity in table "Ts".
        /// </summary>
        /// <typeparam name="T">Type of entity</typeparam>
        /// <param name="entityToDelete">Entity to delete</param>
        /// <param name="transaction">The transaction to run under, null (the default) if none</param>
        /// <param name="commandTimeout">Number of seconds before command execution timeout</param>
        /// <returns>true if deleted, false if not found</returns>
        public bool Delete<T>(T entityToDelete, IDbTransaction transaction = null, int? commandTimeout = null) where T : class
        {
            if (entityToDelete == null)
                throw new ArgumentException("Cannot Delete null Object", nameof(entityToDelete));

            var type = typeof(T);

            if (type.IsArray)
            {
                type = type.GetElementType();
            }
            else if (type.IsGenericType)
            {
                var typeInfo = type.GetTypeInfo();
                bool implementsGenericIEnumerableOrIsGenericIEnumerable =
                    typeInfo.ImplementedInterfaces.Any(ti => ti.IsGenericType && ti.GetGenericTypeDefinition() == typeof(IEnumerable<>)) ||
                    typeInfo.GetGenericTypeDefinition() == typeof(IEnumerable<>);

                if (implementsGenericIEnumerableOrIsGenericIEnumerable)
                {
                    type = type.GetGenericArguments()[0];
                }
            }

            var keyProperties = TypeExtension.KeyProperties(type).ToList();  //added ToList() due to issue #418, must work on a list copy
            var explicitKeyProperties = TypeExtension.ExplicitKeyProperties(type);
            if (keyProperties.Count == 0 && explicitKeyProperties.Count == 0)
                throw new ArgumentException("Entity must have at least one [Key] or [ExplicitKey] property");

            var name = typeof(T).Name;
            keyProperties.AddRange(explicitKeyProperties);

            var sb = new StringBuilder();
            sb.AppendFormat("delete from {0} where ", name);

            for (var i = 0; i < keyProperties.Count; i++)
            {
                var property = keyProperties[i];
                sb.AppendFormat("{0} = {1}{0}", property.Name, _fixParam);
                if (i < keyProperties.Count - 1)
                    sb.Append(" and ");
            }
            var deleted = this.Conn.Execute(sb.ToString(), entityToDelete, transaction, commandTimeout);
            return deleted > 0;

        }
        #endregion
        #region Public method proc
        public void AddParameter(string key, object value)
        {
            Sp.Add(new SqlParameter(key, value));
        }

        public void AddListParameter(Dictionary<string, object> objParms)
        {
            foreach (string item in objParms.Keys)
            {
                object obj2 = objParms[item];
                sp.Add(new SqlParameter(item, obj2));
            }
        }
        /// <summary>
        /// Add tham số điều kiện vào store procedure
        /// </summary>
        /// <param name="lstKey"></param>
        /// <param name="objParms"></param>
        public void AddListParameter(string[] lstKey, Dictionary<string, object> objParms)
        {
            foreach (string item in lstKey)
            {
                if (item != null && item != "")
                {
                    object obj2 = objParms[item];
                    sp.Add(new SqlParameter("@" + item, obj2));
                }
            }
        }
        /// <summary>
        /// Add tham số để store procedure truyền trả dữ liệu về
        /// </summary>
        /// <param name="lstKey"></param>
        public void AddListOptParameter(string[] lstKey)
        {
            foreach (var key in lstKey)
            {
                var pr = new SqlParameter(key, SqlDbType.Decimal);
                pr.Direction = ParameterDirection.Output;
                optSp.Add(pr);
            }
        }

        public void changParameter(string key, object value)
        {
            Sp.Where(w => w.ParameterName == key).ToList().ForEach(s => s.Value = value);
        }
        public void setParameter(List<SqlParameter> ipSP)
        {
            foreach (var item in ipSP)
            {
                Sp.Add(new SqlParameter(item.ParameterName, item.Value));
            };
        }
        public DataSet GetDataSet(string strProc)
        {
            return data.ExecuteDSQuery(strProc, Sp);
        }

        public DataSet GetDataSet(string strProc, out Dictionary<string, object> optParams)
        {
            return data.ExecuteDSQuery(strProc, Sp, OptSp, out optParams);
        }

        public DataTable GetDataTable(string strProc)
        {
            var dataset = data.ExecuteDSQuery(strProc, Sp);
            if (dataset != null && dataset.Tables.Count > 0)
            {
                return dataset.Tables[0];
            }
            return null;
        }
        #endregion
    }
}
