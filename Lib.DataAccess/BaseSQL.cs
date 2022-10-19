using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Data.Common;

namespace Lib.DataAccess
{
    /// <summary>
    /// DAO sử lý lấy dữ liệu từ Database
    /// </summary>
    /// NinhVH 18.10.2021
    class BaseSQL
    {
        #region Khởi tạo
        private bool connectStatus = true;
        public bool ConnectStatus
        {
            get { return connectStatus; }
            set { connectStatus = value; }
        }
        private SqlConnection _conn;
        public SqlConnection conn
        {
            get { return _conn; }
            set { _conn = value; }
        }

        public BaseSQL(string configName = "")
        {
            try
            {
                if (conn == null || conn.State == ConnectionState.Closed)
                    initConnection(configName);
            }
            catch (SqlException e)
            {
                // e.StackTrace();
                ConnectStatus = false;
                throw new Exception("Can not open Connection" + e.Message);
            }
        }

        private void initConnection(string configName)
        {
            //get sqlServer
            //string sqlServer=common.getConnectionString();           
            if (_conn == null)
            {
                string strConn = ConfigurationManager.ConnectionStrings[configName].ConnectionString;
                _conn = new SqlConnection(strConn);
            }
        }

        public void openConnect()
        {
            if (_conn != null && _conn.State != ConnectionState.Open)
            {
                _conn.Open();
                ConnectStatus = true;
            }
        }

        public void closeConnect()
        {
            if (_conn != null || _conn.State != ConnectionState.Closed)
            {
                _conn.Close();
                ConnectStatus = false;
            }
        }
        #endregion

        #region Các lệnh Execute       
        public DataSet ExecuteDSQuery(string sql, List<SqlParameter> paramlist)
        {
            openConnect();
            SqlCommand cmd = PrepareCommand(_conn, sql, paramlist, null);
            SqlDataAdapter adapter = new SqlDataAdapter();
            adapter.SelectCommand = cmd;
            DataSet dataset = new DataSet();
            adapter.Fill(dataset);
            cmd.Dispose();
            adapter.Dispose();
            //closeConnect();
            return dataset;
        }

        public DataSet ExecuteDSQuery(string sql, List<SqlParameter> paramlist
            , List<SqlParameter> optParamList, out Dictionary<string, object> optValues)
        {
            openConnect();
            SqlCommand cmd = PrepareCommand(_conn, sql, paramlist, optParamList);
            SqlDataAdapter adapter = new SqlDataAdapter
            {
                SelectCommand = cmd
            };
            DataSet dataset = new DataSet();
            adapter.Fill(dataset);
            // Ouput values
            var vOptValues = new Dictionary<string, object>();
            foreach (var optParam in optParamList)
            {
                vOptValues.Add(optParam.ParameterName, optParam.Value);
            }
            optValues = vOptValues;
            cmd.Dispose();
            adapter.Dispose();
            //closeConnect();
            return dataset;
        }

        protected SqlCommand PrepareCommand(DbConnection Connection, string sql, List<SqlParameter> paramlist, List<SqlParameter> optParamList)
        {
            // Init SqlCommand
            SqlCommand cmd = new SqlCommand();
            cmd.CommandTimeout = 3000;
            cmd.Connection = Connection as SqlConnection;
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = sql;
            // Process paramlist
            if (paramlist != null)
            {
                foreach (SqlParameter param in paramlist)
                {
                    cmd.Parameters.Add(param);
                }
            }
            // Process output paramlist
            if (optParamList != null)
            {
                foreach (SqlParameter param in optParamList)
                {
                    cmd.Parameters.Add(param);
                }
            }
            return cmd;
        }

        #endregion
    }
}
