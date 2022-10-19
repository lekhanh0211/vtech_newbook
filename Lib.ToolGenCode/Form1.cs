using Lib.DataAccess;
using Lib.Extensions;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Lib.ToolGenCode
{
    public partial class Form1 : Form
    {
        private string _folderRoot;
        private string _folderController;
        private string _folderManager;
        private string _folderModel;
        private string _folderCtrlJSr;
        private string _folderHtml;
        private string _folderDTO;
        public Form1()
        {
            InitializeComponent();
            initLoadForm();
        }
        private void initLoadForm()
        {
            this.loadDSTableNames();
            txtFolderRoot.Text = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location) + @"\Output";
            txtController.Text = @"";
            txtManager.Text = @"";
            txtModel.Text = @"";
            txtCtrlJS.Text = @"";
            txtTHML.Text = @"";
            txtDTO.Text = @"";
        }

        private void loadDSTableNames()
        {
            using (BaseData db = new BaseData("AppConnection"))
            {
                var vNameTables = db.Query<string>(@"SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME").ToList();
                if (vNameTables != null && vNameTables.Count > 0)
                {
                    cBoxNameTables.Items.Clear();
                    foreach (var name in vNameTables)
                    {
                        cBoxNameTables.Items.Add(name);
                    }
                }
            }
        }

        private void checkFolder()
        {
            _folderRoot = txtFolderRoot.Text;
            if (!Directory.Exists(_folderRoot))
            {
                Directory.CreateDirectory(_folderRoot);
            }
            _folderController = _folderRoot + txtController.Text ?? "";
            _folderManager = _folderRoot + txtManager.Text ?? "";
            _folderModel = _folderRoot + txtModel.Text ?? "";
            _folderCtrlJSr = _folderRoot + txtCtrlJS.Text ?? "";
            _folderHtml = _folderRoot + txtTHML.Text ?? "";
            _folderDTO = _folderRoot + txtDTO.Text ?? "";
            if (txtController.Text.IsNotNullOrEmpty())
            {
                if (!Directory.Exists(_folderController))
                {
                    Directory.CreateDirectory(_folderController);
                }
            }
            if (txtManager.Text.IsNotNullOrEmpty())
            {
                if (!Directory.Exists(_folderManager))
                {
                    Directory.CreateDirectory(_folderManager);
                }
            }
            if (txtModel.Text.IsNotNullOrEmpty())
            {
                if (!Directory.Exists(_folderModel))
                {
                    Directory.CreateDirectory(_folderModel);
                }
            }
            if (txtCtrlJS.Text.IsNotNullOrEmpty())
            {
                if (!Directory.Exists(_folderCtrlJSr))
                {
                    Directory.CreateDirectory(_folderCtrlJSr);
                }
            }
            if (txtTHML.Text.IsNotNullOrEmpty())
            {
                if (!Directory.Exists(_folderHtml))
                {
                    Directory.CreateDirectory(_folderHtml);
                }
            }
            if (txtDTO.Text.IsNotNullOrEmpty())
            {
                if (!Directory.Exists(_folderDTO))
                {
                    Directory.CreateDirectory(_folderDTO);
                }
            }
        }

        private void btnStart_Click(object sender, EventArgs e)
        {
            string strService = ""; string strStateRouter = ""; string strLinkJs = "";
            if (cBoxNameTables.CheckedItems.Count > 0)
            {
                this.checkFolder();
                foreach (string nameTable in cBoxNameTables.CheckedItems)
                {
                    strLinkJs += @"
    <script type=""text/javascript"" src=""~/js/app/ChucNang/" + nameTable + @"Ctrl.js""></script>";
                    strService += this.genTxtService(nameTable);
                    strStateRouter += this.genTxtStateRouter(nameTable);

                    // Gen các file theo từng table
                    this.getColumnOneTable(nameTable);
                }
                txtService.Text = strService;
                txtStateRouter.Text = strStateRouter;
                txtLinkJs.Text = strLinkJs;
                MessageBox.Show("Đã sinh các file thành công");
                System.Diagnostics.Process.Start("explorer.exe", _folderRoot);
            }
            else
            {
                MessageBox.Show("Chưa nhập danh sách tên bảng");
            }
        }

        private void getColumnOneTable(string nameTable)
        {
            this.genFileController(nameTable);
            this.genFileManager(nameTable);
            //this.genFileCtrlJS(nameTable);
            using (BaseData db = new BaseData("AppConnection"))
            {
                var vNameCols = db.Query<ColNamesModel>(@"SELECT '   public ' 
+ (case when ty.name = 'DT_YN' then 'bool'  
when ty.name in  ('ntext', 'DT_STR_MAX_LENGTH','DT_LONG_DESCRIPTION','DT_MA_NGAN','DT_MA_DAI','DT_DESCRIPTION_MAX_LENGTH', 'DT_SHORT_STRING', 'DT_MINI_STRING', 'nvarchar', 'varchar') then 'string' 
when ty.name in ( 'DT_SO_DEM','DT_SMALL_FLOAT','DT_SO_TIEN','DT_LEVEL', 'DT_SO_NHO', 'DT_SO_LON', 'DT_SO_LUONG') then 'decimal' 
when ty.name = 'DT_UNIQUE_IDENTIFIER' then 'Guid' 
when ty.name in ('dateTime', 'date') then 'DateTime' 
when ty.name = 'DT_YN' then 'bool'
else ty.name
end)
+ (case when col.is_nullable = 1 and (select name from sys.types where user_type_id = col.user_type_id) not in ('ntext', 'DT_STR_MAX_LENGTH','DT_LONG_DESCRIPTION','DT_MA_NGAN','DT_MA_DAI','DT_DESCRIPTION_MAX_LENGTH', 'DT_SHORT_STRING', 'DT_MINI_STRING') then '?' else '' end)
+' ' +  col.name  + ' { get; set; }' as PubColumn
, col.name NameColumn
, col.is_nullable IsNullAble
, (case when ty.name = 'DT_YN' then 'bool'  
when ty.name in  ('ntext', 'DT_STR_MAX_LENGTH','DT_LONG_DESCRIPTION','DT_MA_NGAN','DT_MA_DAI','DT_DESCRIPTION_MAX_LENGTH', 'DT_SHORT_STRING', 'DT_MINI_STRING', 'nvarchar', 'varchar') then 'string' 
when ty.name in ( 'DT_SO_DEM','DT_SMALL_FLOAT','DT_SO_TIEN','DT_LEVEL', 'DT_SO_NHO', 'DT_SO_LON', 'DT_SO_LUONG') then 'decimal' 
when ty.name = 'DT_UNIQUE_IDENTIFIER' then 'Guid' 
when ty.name in ('dateTime') then 'DateTime' 
when ty.name in ('date') then 'Date' 
when ty.name = 'DT_YN' then 'bool'
else ty.name
end) TypeData
, col.max_length StrLength
  FROM sys.columns col JOIN sys.types ty on ty.user_type_id = col.user_type_id WHERE object_id = OBJECT_ID(@nameTable) and col.name not in ('Id')",
                            new { nameTable }).ToList();
                if (vNameCols != null && vNameCols.Count > 0)
                {
                    this.genFileModel(nameTable, vNameCols);
                    this.genFileDTO(nameTable, vNameCols);
                    //this.genFileHtml(nameTable, vNameCols);
                    //this.genFileHtmlHS(nameTable, vNameCols);
                }
            }
        }

        private void genFileController(string nameTable)
        {
            if (_folderController.IsNotNullOrEmpty())
            {
                string strTextContent = @"using Website.Helper;
using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using System.Web.Http;

namespace Website.Controllers.Api
{
    [RoutePrefix(""api/[NameTable]"")]
    public class [NameTable]Controller : BaseApiController<[NameTable]Manager, [NameTable]Model>
    {
    }
}";

                using (StreamWriter file =
            new StreamWriter(string.Format(@"{0}\{1}Controller.cs", _folderController, nameTable)))
                {
                    file.WriteLine(strTextContent.Replace("[NameTable]", nameTable));
                }
            }
        }

        private void genFileManager(string nameTable)
        {
            if (_folderManager.IsNotNullOrEmpty())
            {
                string strTextContent = @"using Lib.BusinessLogic.DTO;
using Lib.BusinessLogic.Model;

namespace Lib.BusinessLogic.Management
{
    public class [NameTable]Manager : BaseManager<[NameTable]Manager, [NameTable], [NameTable]Model>
    {
    }
}";
                using (StreamWriter file =
            new StreamWriter(string.Format(@"{0}\{1}Manager.cs", _folderManager, nameTable)))
                {
                    file.WriteLine(strTextContent.Replace("[NameTable]", nameTable));
                }
            }
        }

        private string genTxtService(string nameTable)
        {
            string strService = @"
app.factory('sv[NameTable]', function ($resource) {
    var baseUrl = '/api/[NameTable]';
    return $resource(baseUrl + '/:id',
        {
            id: '@id'
        },
        {
            'createOrUpdate': { method: 'POST' },
            'show': { method: 'GET' },
            'delete': { method: 'DELETE' },
            'unActive': { 
                method: 'DELETE',
                url: baseUrl +  '/unActive/:id',
            },
            'showPage': {
                method: 'GET',
                params: {
                    from: '@from',
                    to: '@to',
                    iPageIndex: '@iPageIndex',
                    iPageSize: '@iPageSize',
                    sSearch: '@sSearch'
                },
                url: baseUrl +  '/showPage',
            },
            
        })
});".Replace("[NameTable]", nameTable);

            return strService;
        }

        private void genFileModel(string nameTable, List<ColNamesModel> lColumn)
        {
            if (_folderModel.IsNotNullOrEmpty())
            {
                using (StreamWriter file =
            new StreamWriter(string.Format(@"{0}\{1}Model.cs", _folderModel, nameTable)))
                {
                    file.WriteLine(@"using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Model
{
    public class " + nameTable + @"Model : BaseModel
    {");
                    foreach (var col in lColumn.Where(x => x.NameColumn != "Active" && x.NameColumn != "StrSearch"))
                    {
                        file.WriteLine("        " + col.PubColumn.Trim());
                    }

                    file.WriteLine(@"    }
}");
                }
            }
        }

        private void genFileDTO(string nameTable, List<ColNamesModel> lColumn)
        {
            if (_folderDTO.IsNotNullOrEmpty())
            {
                using (StreamWriter file =
            new StreamWriter(string.Format(@"{0}\{1}.cs", _folderDTO, nameTable)))
                {
                    file.WriteLine(@"using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.DTO
{
    public class " + nameTable + @" : BaseDTO
    {");
                    foreach (var col in lColumn)
                    {
                        file.WriteLine("        " + col.PubColumn.Trim());
                    }

                    file.WriteLine(@"    }
}");
                }
            }
        }

        private string genTxtStateRouter(string nameTable)
        {
            return @"
                .state('[NameTable]', {
                    url: '/[NameTable]/',
                    parent: 'ChucNang',
                    templateUrl: '/partials/ChucNang/[NameTable].html',
                    controller: '[NameTable]Ctrl'
                })".Replace("[NameTable]", nameTable);
        }
    }
}
