﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Collections;
using System.Reflection;
using System.Data;
using System.Text.RegularExpressions;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using Newtonsoft.Json.Linq;

namespace Lib.Extensions
{
    public class ReportExcelDataSet
    {
        private string m_strOutputFileName;
        private ExcelPackage pck;
        private ExcelWorksheet m_objExcelWorksheet;


        private bool m_init_successful;


        public Hashtable FindAndReplaceCollection;
        /// <summary>
        /// Hàm khởi tạo chuyền vào tên file template và tên file report
        /// </summary>
        /// <param name="i_strTemplatesFileName"></param>
        /// <param name="i_strFileName"></param>
        public ReportExcelDataSet(string i_strTemplatesFileName)
        {
            m_init_successful = false;
            string folderPath = @"\Content\Reports\";
            m_strOutputFileName = folderPath + @"Output\" + i_strTemplatesFileName + DateTime.Now.ToString("MMddHHmmss") + ".xlsx";
            string folderRoot = ConfigurationUtility.GetConfigurationSettingValue("folder");
            string m_strTemplateFileNameWithPath = folderRoot + folderPath + @"Templates\" + i_strTemplatesFileName + ".xlsx";

            pck = new ExcelPackage(new FileInfo(m_strTemplateFileNameWithPath), true);
            m_objExcelWorksheet = pck.Workbook.Worksheets.FirstOrDefault();
            FindAndReplaceCollection = new Hashtable();
            m_init_successful = true;
        }

        public void Dispose()
        {
            pck.Dispose();
        }
        public ReportExcelDataSet AddFindAndReplaceItem(object i_obj_find, object i_obj_replace)
        {
            FindAndReplaceCollection.Add(i_obj_find, i_obj_replace);
            return this;
        }

        public ReportExcelDataSet ClearFindAndReplaceItem(object i_obj_find, object i_obj_replace)
        {
            FindAndReplaceCollection.Clear();
            return this;
        }

        public ReportExcelDataSet FindAndReplace()
        {
            try
            {
                if (!m_init_successful) return this;
                foreach (var v_str_find in FindAndReplaceCollection.Keys)
                {
                    var v_str_replace = FindAndReplaceCollection[v_str_find].ToString();
                    var cells = m_objExcelWorksheet.Cells.Where(x => x.Text.Contains(v_str_find.ToString()));
                    if (cells != null && cells.Count() > 0)
                    {
                        foreach (var cell in cells)
                        {
                            cell.Value = cell.Text.Replace(v_str_find.ToString(), v_str_replace);
                        }
                    }
                }
                return this;
            }
            catch (Exception v_e)
            {
                pck.Save();
                throw v_e;
            }
        }

        public void SetValueToCell(int row, int col, object value)
        {
            var cell = m_objExcelWorksheet.Cells[row, col];
            if (cell != null)
            {
                cell.Value = value;
            }
        }

        public ReportExcelDataSet goToSheet(int sheetIndex)
        {
            if (pck.Workbook.Worksheets.Count >= sheetIndex)
                m_objExcelWorksheet = pck.Workbook.Worksheets[sheetIndex];
            return this;
        }

        /// <summary>
        /// Nhảy tới sheet theo tên
        /// </summary>
        /// <param name="sheetName"></param>
        /// <returns></returns>
        public ReportExcelDataSet goToSheet(string sheetName)
        {
            m_objExcelWorksheet = pck.Workbook.Worksheets.FirstOrDefault(x => x.Name == sheetName);
            return this;
        }

        /// <summary>
        /// Sửa và bổ sung headers
        /// </summary>
        /// <param name="headers"></param>
        /// <param name="colIndex"></param>
        /// <param name="rowIndex"></param>
        /// <param name="ordinalRow">Hiển thị số cột</param>
        /// <param name="mergeCount">Số hàng của headers được merge lại với nhau</param>
        /// <returns></returns>
        public ReportExcelDataSet UpdateHeader(IList headers, int colIndex, int rowIndex, bool ordinalRow = false, int mergeCount = 0, bool isAddColumn = false)
        {
            for (int i = 0; i < headers.Count; i++)
            {
                if (isAddColumn)
                {
                    m_objExcelWorksheet.InsertColumn(colIndex + i, 1, colIndex);
                }

                var cell = m_objExcelWorksheet.Cells[rowIndex, colIndex + i];
                if (mergeCount > 0)
                {
                    cell = m_objExcelWorksheet.Cells[rowIndex, colIndex + i, rowIndex + mergeCount, colIndex + i];
                    cell.Merge = true;
                }
                if (ordinalRow)
                {
                    m_objExcelWorksheet.Cells[rowIndex + 1, colIndex + i, rowIndex + mergeCount + 1, colIndex + i].Value = string.Format("({0})", colIndex + i);
                }
                cell.Style.Font.Bold = true;
                cell.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                cell.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                cell.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                cell.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                cell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                cell.Value = headers[i];
            }
            return this;
        }

        /// <summary>
        /// Sửa và bổ sung headers
        /// </summary>
        /// <param name="headers"></param>
        /// <param name="start"></param>
        /// <param name="row"></param>
        /// <returns></returns>
        public ReportExcelDataSet UpdateHeader(IList headers, int row)
        {
            return UpdateHeader(headers, 0, row);
        }

        /// <summary>
        /// Cập nhật dữ liệu bảng biểu excel
        /// </summary>
        /// <param name="data"></param>
        /// <param name="ipStartRow">Chỉ số hàng bắt đầu</param>
        /// <param name="ipStartCol">Chỉ số cột bắt đầu</param>
        /// <param name="isNewRow">Có chèn thêm hàng mới không</param>
        /// <param name="ipStartColData">Cột dữ liệu bắt đầu</param>
        /// <returns></returns>
        public ReportExcelDataSet Export2ExcelBold(DataTable data, int ipStartRow, int ipStartCol, int ipEndColData = -1, bool isNewRow = true, int ipStartColData = 0)
        {
            try
            {
                if (!m_init_successful) return this;
                int vStartRow = ipStartRow;
                int vStartCol = ipStartCol;

                if (isNewRow)
                {
                    if (data.Rows.Count > 1)
                    {
                        m_objExcelWorksheet.InsertRow(ipStartRow + 1, data.Rows.Count - 2, ipStartRow);
                    }
                    else // Nếu có 1 dòng thì xoá bỏ dòng thừa
                    {
                        m_objExcelWorksheet.DeleteRow(ipStartRow + 1);
                    }
                }

                if (ipEndColData < 0)
                {
                    ipEndColData = data.Columns.Count;
                }

                foreach (DataRow item in data.Rows)
                {
                    int dem = 0;
                    for (int i = ipStartColData; i < ipEndColData; i++)
                    {
                        if (item[i] != null && item[i].ToString() != null)
                        {
                            var cell = m_objExcelWorksheet.Cells[vStartRow, vStartCol + dem];
                            var value = item[i];
                            if (value.ToString().IndexOf("<b>") == 0)
                            {
                                cell.Style.Font.Bold = true;
                                value = value.ToString().Substring(3);
                            }
                            cell.Value = value;
                            dem++;
                        }
                    }
                    vStartRow++;
                }
                return this;
            }
            catch (Exception v_e)
            {
                pck.Save();
                throw v_e;
            }
        }

        public ReportExcelDataSet Export2ExcelBoldLine(DataTable i_DataTabel, int i_intStartRow, int i_intStartCol, int i_intCol, bool is_newRow = true)
        {
            try
            {
                if (!m_init_successful) return this;

                int i_iExcelRow = i_intStartRow;
                int i_iExcelCol = i_intStartCol;
                bool isBold = false;
                if (i_DataTabel.Rows.Count > 1)
                {
                    if (is_newRow)
                    {
                        m_objExcelWorksheet.InsertRow(i_intStartRow + 1, i_DataTabel.Rows.Count - 2, i_intStartRow);
                    }
                }
                foreach (DataRow item in i_DataTabel.Rows)
                {
                    isBold = false;
                    for (int i = 0; i < i_intCol; i++)
                    {
                        if (item[i] != null && item[i].ToString() != "")
                        {
                            var cell = m_objExcelWorksheet.Cells[i_iExcelRow, i_iExcelCol + i];
                            var value = item[i];
                            if (value.ToString().IndexOf("<b>") == 0)
                            {
                                cell.Style.Font.Bold = true;
                                value = value.ToString().Substring(3);
                                if (i == 0)
                                {
                                    isBold = true;
                                }
                            }
                            if (isBold) cell.Style.Font.Bold = true;
                            cell.Value = value;
                        }
                    }
                    i_iExcelRow++;
                }
                // m_objExcelWorksheet.DeleteRow(i_intStartRow);
                return this;
            }
            catch (Exception v_e)
            {
                pck.Save();
                throw v_e;
            }
        }

        public ReportExcelDataSet Export2ExcelMergeCell(DataTable i_DataTabel, int i_intStartRow, int i_intStartCol, int i_intCol, bool is_newRow = true)
        {
            try
            {
                if (!m_init_successful) return this;

                int i_iExcelRow = i_intStartRow;
                int i_iExcelCol = i_intStartCol;
                bool isBold = false;
                if (i_DataTabel.Rows.Count > 1)
                {
                    if (is_newRow)
                    {
                        m_objExcelWorksheet.InsertRow(i_intStartRow + 1, i_DataTabel.Rows.Count - 2, i_intStartRow);
                    }
                }
                foreach (DataRow item in i_DataTabel.Rows)
                {
                    isBold = false;
                    int strCellmerge = 0;
                    for (int i = 0; i < i_intCol; i++)
                    {

                        if (item[i] != null && item[i].ToString() != "")
                        {
                            var cell = m_objExcelWorksheet.Cells[i_iExcelRow, i_iExcelCol + i];
                            var value = item[i];
                            if (value.ToString().IndexOf("<b>") == 0)
                            {
                                cell.Style.Font.Bold = true;
                                value = value.ToString().Substring(3);
                                if (i == 0)
                                {
                                    isBold = true;
                                }
                            }
                            if (isBold) cell.Style.Font.Bold = true;
                            if (i == i_intCol - 1)
                            {
                                strCellmerge = int.Parse(item[i].ToString());
                            }
                            else
                            {
                                cell.Value = value;
                            }
                            if (strCellmerge > 0)
                            {
                                cell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                                cell.Style.Font.Bold = true;
                                var addresMerge = m_objExcelWorksheet.Cells[cell.Start.Row, 1, cell.Start.Row, strCellmerge].Address;
                                m_objExcelWorksheet.Cells[addresMerge].Merge = true;
                                var cell2 = m_objExcelWorksheet.Cells[cell.Start.Row, 1];
                                cell2.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                                cell2.Style.Font.Bold = true;
                            }
                        }

                    }

                    i_iExcelRow++;
                }
                // m_objExcelWorksheet.DeleteRow(i_intStartRow);
                return this;
            }
            catch (Exception v_e)
            {
                pck.Save();
                throw v_e;
            }
        }

        public bool Export2ExcelByList(IEnumerable<object> data, int i_intStartRow, int i_intStartCol, string[] lstColumn, bool insertSTT = false)
        {
            try
            {
                if (!m_init_successful) return false;
                if (data != null && data.Count() > 0)
                {
                    if (lstColumn == null)
                        lstColumn = data.FirstOrDefault().GetType().GetProperties().Select(x => x.Name).ToArray<string>();

                    m_objExcelWorksheet.InsertRow(i_intStartRow + 1, data.Count(), i_intStartRow);
                    int rowIndex = 1;
                    int stt = 1;
                    foreach (var itemdata in data)
                    {
                        Type type = itemdata.GetType();

                        int iCol = 0;
                        if (insertSTT)
                        {
                            m_objExcelWorksheet.Cells[i_intStartRow + rowIndex, i_intStartCol].Value = stt;
                            // ThaySTT để thay vào cột STT vào reset lại số TT = 1
                            if (type.GetProperty("ThaySTT") != null)
                            {
                                PropertyInfo property1 = type.GetProperty("ThaySTT");
                                object obj1 = property1.GetValue(itemdata, null);
                                if (obj1 != null && obj1.ToString() != "")
                                {
                                    m_objExcelWorksheet.Cells[i_intStartRow + rowIndex, i_intStartCol].Value = obj1;
                                    m_objExcelWorksheet.Cells[i_intStartRow + rowIndex, i_intStartCol].Style.Font.Bold = true;
                                    stt = 0;
                                }
                            }
                            iCol = 1;
                        }
                        foreach (string item in lstColumn)
                        {
                            if (item == "")
                            {
                                var cell = m_objExcelWorksheet.Cells[i_intStartRow + rowIndex, i_intStartCol + iCol];
                                cell.Value = "";
                            }
                            else
                            {
                                var arr = Regex.Split(item, ",");

                                if (arr.Length > 1)
                                {
                                    #region Truong hop truyen vao kieu so sanh
                                    PropertyInfo check = type.GetProperty(arr[0]);
                                    object ValueCheck = check.GetValue(itemdata, null);
                                    var arrValue = Regex.Split(arr[ValueCheck.ToString().ToLower() == arr[1] ? 2 : 3], ":");
                                    if (arrValue[0] != "0")
                                    {
                                        PropertyInfo property = type.GetProperty(arrValue[0]);
                                        object obj2 = property.GetValue(itemdata, null);
                                        if (obj2 != null && obj2.ToString() != "")
                                        {
                                            var cell = m_objExcelWorksheet.Cells[i_intStartRow + rowIndex, i_intStartCol + iCol];
                                            if (obj2.ToString().IndexOf("<b>") == 0)
                                            {
                                                cell.Style.Font.Bold = true;
                                                obj2 = obj2.ToString().Substring(3);
                                            }
                                            cell.Value = obj2;
                                        }
                                    }
                                    else
                                    {
                                        var cell = m_objExcelWorksheet.Cells[i_intStartRow + rowIndex, i_intStartCol + iCol];
                                        cell.Value = arrValue[1];
                                    }
                                    #endregion
                                }
                                else
                                {
                                    PropertyInfo property = type.GetProperty(item);
                                    object obj2 = property.GetValue(itemdata, null);
                                    if (obj2 != null && obj2.ToString() != "")
                                    {
                                        var cell = m_objExcelWorksheet.Cells[i_intStartRow + rowIndex, i_intStartCol + iCol];
                                        if (obj2.ToString().IndexOf("<b>") == 0)
                                        {
                                            cell.Style.Font.Bold = true;
                                            obj2 = obj2.ToString().Substring(3);
                                        }
                                        cell.Value = obj2;
                                    }
                                }
                            }
                            iCol++;
                        }
                        rowIndex++;
                        stt++;
                    }
                    m_objExcelWorksheet.DeleteRow(i_intStartRow);
                }
                return true;
            }
            catch (Exception v_e)
            {
                pck.Save();
                throw v_e;
            }
        }

        public bool Export2ExcelByJson(IEnumerable<object> data, int i_intStartRow, int i_intStartCol, string[] lstColumn, bool insertSTT = false)
        {
            try
            {
                if (!m_init_successful) return false;
                if (data != null && data.Count() > 0)
                {
                    //if (lstColumn == null)
                    //    lstColumn = data.FirstOrDefault().GetType().GetProperties().Select(x => x.Name).ToArray<string>();

                    if (data.Count() > 1)
                    {
                        m_objExcelWorksheet.InsertRow(i_intStartRow + 1, data.Count() - 2, i_intStartRow);
                    }
                    int i_iExcelRow = i_intStartRow;
                    int stt = 1;
                    foreach (JObject itemdata in data)
                    {
                        int iCol = 0;
                        if (insertSTT)
                        {
                            m_objExcelWorksheet.Cells[i_iExcelRow, i_intStartCol].Value = stt;
                            iCol = 1;
                        }
                        foreach (string item in lstColumn)
                        {
                            if (item == "")
                            {
                                var cell = m_objExcelWorksheet.Cells[i_iExcelRow, i_intStartCol + iCol];
                                cell.Value = "";
                            }
                            else
                            {
                                var arr = Regex.Split(item, ",");

                                if (arr.Length > 1)
                                {
                                    #region Truong hop truyen vao kieu so sanh
                                    object ValueCheck = itemdata.SelectToken(arr[0]);
                                    var arrValue = Regex.Split(arr[ValueCheck.ToString().ToLower() == arr[1] ? 2 : 3], ":");
                                    if (arrValue[0] != "0")
                                    {
                                        JValue obj2 = itemdata.SelectToken(arrValue[0]) as JValue;
                                        if (obj2 != null && obj2.ToString() != "")
                                        {
                                            var cell = m_objExcelWorksheet.Cells[i_iExcelRow, i_intStartCol + iCol];
                                            if (obj2.ToString().IndexOf("<b>") == 0)
                                            {
                                                cell.Style.Font.Bold = true;
                                                cell.Value = obj2.ToString().Substring(3);
                                            }
                                            else
                                            {
                                                cell.Value = obj2.Value;
                                            }
                                        }
                                    }
                                    else
                                    {
                                        var cell = m_objExcelWorksheet.Cells[i_iExcelRow, i_intStartCol + iCol];
                                        cell.Value = arrValue[1];
                                    }
                                    #endregion
                                }
                                else
                                {
                                    JValue obj2 = itemdata.SelectToken(item) as JValue;
                                    if (obj2 != null && obj2.ToString() != "")
                                    {
                                        var cell = m_objExcelWorksheet.Cells[i_iExcelRow, i_intStartCol + iCol];
                                        if (obj2.ToString().IndexOf("<b>") == 0)
                                        {
                                            cell.Style.Font.Bold = true;
                                            cell.Value = obj2.ToString().Substring(3);
                                        }
                                        else
                                        {
                                            cell.Value = obj2.Value;
                                        }
                                    }
                                }
                            }
                            iCol++;
                        }
                        i_iExcelRow++;
                        stt++;
                    }
                }
                return true;
            }
            catch (Exception v_e)
            {
                pck.Save();
                throw v_e;
            }
        }
        public ReportExcelDataSet Export2Excel(DataTable data, int i_intStartRow, int i_intStartCol, List<string> lstColumn)
        {
            try
            {
                if (!m_init_successful) return this;
                if (data != null && data.Rows.Count > 0)
                {
                    m_objExcelWorksheet.InsertRow(i_intStartRow, 1, i_intStartRow);
                    m_objExcelWorksheet.InsertRow(i_intStartRow + 2, data.Rows.Count - 1, i_intStartRow);

                    int stt = 1;
                    int iCol = 0;
                    // Headers
                    foreach (string item in lstColumn)
                    {
                        var cell = m_objExcelWorksheet.Cells[i_intStartRow, i_intStartCol + iCol];
                        cell.Style.Font.Bold = true;
                        cell.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        cell.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        cell.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        cell.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        cell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        cell.Value = item;
                        iCol++;
                    }
                    foreach (DataRow row in data.Rows)
                    {
                        iCol = 0;
                        foreach (string item in lstColumn)
                        {
                            var cell = m_objExcelWorksheet.Cells[i_intStartRow + stt, i_intStartCol + iCol];

                            cell.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                            cell.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            cell.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            cell.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                            if (item == "HoTen")
                            {
                                cell.Value = row[item].ToString();
                            }
                            else
                            {
                                decimal temp = 0;
                                decimal.TryParse(row[item].ToString(), out temp);
                                cell.Value = temp;
                                cell.Style.Numberformat.Format = "#,##0.00";
                            }
                            iCol++;
                        }
                        stt++;
                    }
                    foreach (var item in m_objExcelWorksheet.Cells)
                    {
                        //DuyNN: Số cột ko vượt quá AA nếu vượt quá là lỗi
                        var SoRow = Int32.Parse(item.Address.Substring(1));
                        if (SoRow > 4)
                        {
                            item.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                            item.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            item.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            item.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        }
                    }
                }
                else
                {
                    m_objExcelWorksheet.InsertRow(i_intStartRow + 2, 1, i_intStartRow);
                    int iCol = 0;
                    foreach (string item in lstColumn)
                    {
                        var cell = m_objExcelWorksheet.Cells[i_intStartRow, i_intStartCol + iCol];
                        cell.Style.Font.Bold = true;
                        cell.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        cell.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        cell.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        cell.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        cell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        cell.Value = item;
                        iCol++;
                    }
                }

                return this;
            }
            catch (Exception v_e)
            {
                pck.Save();
                throw v_e;
            }
        }

        /// <summary>
        /// Lưu file kết quả kết xuất
        /// </summary>
        /// <returns></returns>
        public string SaveFile()
        {
            var folderRoot = ConfigurationUtility.GetConfigurationSettingValue("folder");
            string m_strOutputFileNameWithPath = folderRoot + m_strOutputFileName;
            if (File.Exists(m_strOutputFileNameWithPath))
            {
                File.Delete(m_strOutputFileNameWithPath);
            }
            pck.SaveAs(new FileInfo(m_strOutputFileNameWithPath));
            return m_strOutputFileName;
        }

        public Stream SaveStream()
        {
            return new MemoryStream(pck.GetAsByteArray());

        }

        /// <summary>
        /// Lấy thông tin file excel kết xuất ra
        /// </summary>
        public string OutputFileName
        {
            get { return m_strOutputFileName; }
        }
    }
}
