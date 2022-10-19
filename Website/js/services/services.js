'use strict';

var app = angular.module('uiApp');


app.factory('svMenu', function (myAppConfig, $resource) {

    return $resource('/api/menus/:id',
        { id: '@id', key: '@key' },
        {
            'query': {
                method: 'GET'
                , isArray: true
            },
            'createOrUpdate': { method: 'POST' },
            'show': { method: 'GET' },
            'delete': { method: 'POST' }
        });
});

app.factory('svRole', function (myAppConfig, $resource) {
    return $resource('/api/roles/:id',
        { id: '@id', key: '@key' },
        {
            'query': { method: 'GET', isArray: true },
            'createOrUpdate': { method: 'POST' },
            'delete': { method: 'POST' },
            'show': { method: 'GET' },
            'showMenus': {
                method: 'GET',
                url: '/api/roles/menus/:id/:level',
                isArray: true
            },
            'showPage': {
                method: 'GET',
                url: '/api/Roles/showPage',
                params: {
                    sSearch: '@sSearch',
                    from: '@from',
                    to: '@to',
                    iPageIndex: '@iPageIndex',
                    iPageSize: '@iPageSize',
                }
            },
            'addMenu': {
                method: 'POST',
                url: '/api/roles/menus',
            },
            'rmMenu': {
                method: 'POST',
                url: '/api/roles/menus/:id',
            },
            'changeMenuPosition': {
                method: 'POST',
                url: '/api/roles/menus/change/'
            }
        });
});
app.factory('svUsers', function (myAppConfig, $resource) {
    return $resource('/api/users/:id',
        { id: '@id' },
        {
            'query': { method: 'GET', isArray: true },
            'show': { method: 'GET' },
            'createOrUpdate': { method: 'POST' },
            'delete': { method: 'POST' },
            'checkUsername': {
                method: 'POST',
                params: {
                    username: '@username'
                },
                url: '/api/users/checkUsername/:username',
            },
        })
});
app.factory('svUserGroup', function (myAppConfig, $resource) {
    return $resource('/api/usergroup/:id',
        { id: '@id' },
        {
            'query': { method: 'GET', isArray: true },
        })
});

app.factory('svLoaiTuDien', function ($resource) {
    let baseUrl = '/api/CMLoaiTuDien';
    return $resource(baseUrl + '/:id', {
        id: '@id'
    }, {
        'query': {
            method: 'GET',
            isArray: true
        },
        'create': {
            method: 'POST'
        },
        'show': {
            method: 'GET'
        },
        'update': {
            method: 'POST'
        },
        'delete': { method: 'POST' },
        'showPage': {
            method: 'GET',
            params: {
                iPageIndex: '@iPageIndex',
                iPageSize: '@iPageSize',
                sSearch: '@sSearch',
            },
            url: baseUrl + '/showPage',
        },
    })
});
app.factory('svTuDien', function ($resource) {
    let baseUrl = '/api/CMTuDien';
    return $resource(baseUrl + '/:id', {
        id: '@id',
        type: '@type'
    }, {
        'query': {
            method: 'GET',
            url: baseUrl + '/byType',
            isArray: true
        },
        'createOrUpdate': { method: 'POST' },
        'getAllByTypes': {
            method: 'GET',
            url: baseUrl + '/ShowAllByTypes',
            params: {
                types: '@types'
            },
        },
        'ShowByCode': {
            method: 'GET',
            url: baseUrl + '/ShowByCode/:type/:code',
            params: {
                code: '@code'
            },
        },
        'delete': { method: 'POST' },
        'showPage': {
            method: 'GET',
            params: {
                type: '@type',
                sSearch: '@sSearch',
                iPageIndex: '@iPageIndex',
                iPageSize: '@iPageSize',
                isActive: '@isActive',
            },
            url: baseUrl + '/showPage',
        },
    })
});

app.factory('svhisBangMa', function ($resource) {
    let baseUrl = '/api/DMBangMa';
    return $resource(baseUrl + '/:id', {
        id: '@id'
    }, {
        'query': {
            method: 'GET',
            isArray: true
        },
        'create': {
            method: 'POST'
        },
        'show': {
            method: 'GET'
        },
        'update': {
            method: 'PUT'
        },
        'delete': { method: 'POST' },
        'showPage': {
            method: 'GET',
            params: {
                iPageIndex: '@iPageIndex',
                iPageSize: '@iPageSize',
                sSearch: '@sSearch',
            },
            url: baseUrl + '/showPage',
        },
        'getBangMaNew': {
            method: 'GET',
            url: baseUrl + '/getBangMaNew',
            params: {
                idKhoa: '@idKhoa',
                Ma: '@Ma',
                TienTo: '@tienTo',
                DoDai: '@doDai',
                TangSo: '@TangSo'
            },
            transformResponse: function (data) {
                return {
                    str: angular.fromJson(data)
                };
            }
        },
    })
});
app.factory('svPhieuIn', function ($resource) {
    var baseUrl = '/api/DMMauPhieuIn';
    var vm = $resource(baseUrl + '/:id',
        {
            id: '@id'
        },
        {
            'createOrUpdate': { method: 'POST' },
            'show': { method: 'GET' },
            'delete': { method: 'POST' },
            'showPage': {
                method: 'GET',
                params: {
                    maLoai: '@maLoai',
                    sSearch: '@sSearch',
                    iPageIndex: '@iPageIndex',
                    iPageSize: '@iPageSize'
                },
                url: baseUrl + '/showPage',
            },
            'getHTMLPhieuIn': {
                method: 'GET',
                url: baseUrl + '/getByMa/:sMa',
                params: {
                    sMa: '@template.name'
                },
            },
            'getByMa': {
                method: 'GET',
                url: baseUrl + '/getByMa/:sMa',
                params: {
                    sMa: '@sMa',
                },
            },

        }
    );
    var htmlMessageBox = "<div id='printMessageBox' style='z-index: 100000;\
     position:fixed;\
     top:50%; left:50%;\
     text-align:center;\
     margin: -60px 0 0 -155px;\
     width:310px; height:150px; font-size:16px; padding:10px; color:#222; font-family:helvetica, arial;\
     opacity:0;\
     background:#fff url(data:image/gif;base64,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) center 40px no-repeat;\
     border: 6px solid #555;\
     border-radius:8px; -webkit-border-radius:8px; -moz-border-radius:8px;\
     box-shadow:0px 0px 10px #888; -webkit-box-shadow:0px 0px 10px #888; -moz-box-shadow:0px 0px 10px #888'>\
     Đang in, xin chờ chút....</div>";

    var splash = function (delayOpenTime = 300) {
        return new Promise((resolve, reject) => {
            if (!$) return resolve(true);
            $("body").append(htmlMessageBox);
            $("#printMessageBox").css("opacity", 444);

            $("#printMessageBox").delay(delayOpenTime).animate({
                opacity: 0
            }, 700, function () {
                $(this).remove();
                resolve(true);
            });
        });
    }

    // extend $resource prototype
    var vmPrototype = vm.prototype;
    /**
      * print by html string
      * Example:
      *          svPhieuIn.printHtml('<html><body> template mẫu </body></html>')
      *              .then(result => {
      *                  console.log('Trả về khi đóng cửa sổ phiếu in')
      *              })
      *              .catch(err => {
      *                  console.error('Không in được phiếu')
      *              })
      *
      * @param {object} strHtml
      * @param {object} delayOpenTime
      * @param {object} delayCloseTime
      */
    vm.printHtml = vmPrototype.printHtml = function printHtml(strHtml, turnOnSplash, delayOpenTime = 300) {
        var idIframe = newGuid();
        $('body').append('<iframe class="iframePrintPage" id="' + idIframe + '" name="' + idIframe + '" src="" width="0" height="0" frameborder="0"></iframe>');
        window.frames[idIframe].document.open();
        window.frames[idIframe].document.write(strHtml);
        window.frames[idIframe].document.title = '\u200E';
        window.frames[idIframe].document.close();
        return new Promise((resolve, reject) => {
            Promise.resolve(1)
                .then(() => {
                    if (turnOnSplash === false) {
                        return 1;
                    } else {
                        // turn on splash
                        return splash(delayOpenTime);
                    }
                })
                .then(() => {
                    try {
                        window.frames[idIframe].print();
                        resolve(true);
                    }
                    catch (err) {
                        console.log("Không bật được window print!");
                        reject();
                    }
                });
        });
    }

    vm.printUrl = vmPrototype.printUrl = function printUrl(strUrl, turnOnSplash, delayOpenTime = 300) {
        var idIframe = newGuid();
        $('body').append('<iframe id="' + idIframe + '" name="' + idIframe + '" src="' + strUrl + '" width="0" height="0" frameborder="0"></iframe>');
        return new Promise((resolve, reject) => {
            Promise.resolve(1)
                .then(() => {
                    if (turnOnSplash === false) {
                        return 1;
                    } else {
                        // turn on splash
                        return splash(delayOpenTime);
                    }
                })
                .then(() => {
                    try {
                        window.frames[idIframe].print();
                        // $("#"+ idIframe).remove();
                        resolve(true);
                    }
                    catch (err) {
                        console.log("Không bật được window print!");
                        // $("#"+ idIframe).remove();
                        reject();
                    }
                });
        });
    }

    /**
     * print by template
     * Example:
     *          svPhieuIn.printTemplate('TEMPL_NAME_OR_REPORT_NAME', { data }, { options })
     *              .then(result => {
     *                  console.log('Trả về khi đóng cửa sổ phiếu in')
     *              })
     *              .catch(err => {
     *                  console.error('Không in được phiếu')
     *              })
     *
     * @param {object} template name, recipe type, v.v.
     * @param {object} data fill into template
     * @param {object} options other options
     */
    vm.printTemplate = vmPrototype.printTemplate = function printTemplate(reqParams, reqData) {
        return vm.getHtmlTemplate(reqParams, reqData)
            .then(result => {
                return result.str;
            })
            .then(outputHtml => {
                return this.printHtml(outputHtml);
            });
    }

    vm.getHtmlTemplate = vmPrototype.getHtmlTemplate = function getHtmlTemplate(reqParams, reqData) {
        return new Promise((resolve, reject) => {
            var data = reqData || reqParams.data || {};
            if (this instanceof vm) {
                // call the $private instance
                return this.$getHTMLPhieuIn.call(reqParams, {}, function (d) {
                    if (d.Script) {
                        eval(d.Script);
                    }
                    var template = Handlebars.compile(d.NoiDung);
                    return resolve({ str: template(data) });
                }, reject);
            } else {
                return this.getHTMLPhieuIn.call(reqParams, {}, reqParams, async function (d) {
                    if (d.Script) {
                        eval(d.Script);
                    }
                    var template = Handlebars.compile(d.NoiDung);
                    return resolve({ str: template(data) });
                }, reject);
            }
        });
    }

    /**
     * Chức năng in từ thẻ html trên view
     * @argument tempate tên mẫu phiếu in trên report
     * @argument data các trường bắt đầu bằng `html` sẽ được kiểm tra giữ lại local, ví dụ: htmlViewStr
     * @argument options Tùy chỉnh printLocal hoặc tham số mẫu phiếu in
     */
    vm.printHtmlView = vmPrototype.printHtmlView = function printHtmlView(template, data, options) {

        var printLocal = false;
        var tmplOptions = {};
        var tmplData = Object.assign({
            _currentTime: new Date()
        }, data);

        if (typeof options == 'boolean') {
            printLocal = options
            tmplOptions.printLocal = printLocal;
        } else {
            printLocal = !!options.printLocal;
            Object.assign(tmplOptions, options);
        }

        // Đẩy dữ liệu html về report
        if (printLocal === false) {
            // # thì delete
            for (const key in tmplData) {
                if (tmplData.hasOwnProperty(key) && /^html/.test(key)) {
                    delete tmplData[key]
                }
            }
        }

        return vm.getHtmlTemplate({
            template: {
                name: template
            },
            data: tmplData,
            options: tmplOptions
        })
            .then(result => {
                if (printLocal === false) {
                    let str = result.str;
                    for (const key in data) {
                        if (data.hasOwnProperty(key) && /^html/.test(key)) {
                            str = str.replace(`[${key}]`, data[key])
                        }
                    }
                    return this.printHtml(str)
                } else {
                    return this.printHtml(result.str)
                }
            })
    }

    // expose service $resource
    return vm;
});
app.factory('svBaoCao', function ($resource) {
    var baseUrl = '/api/BaoCao';
    return $resource(baseUrl + '/:id',
        {
            id: '@id'
        },
        {
            'getData': {
                method: 'POST',
                url: baseUrl + '/getData',
            },
            'getExcel': {
                method: 'POST',
                url: baseUrl + '/getExcel',
                responseType: 'arraybuffer',
                transformResponse: function (data, headers, status) {
                    var filename = "";
                    var disposition = headers('Content-Disposition');
                    if (disposition && disposition.indexOf('attachment') !== -1) {
                        let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                        let matches = filenameRegex.exec(disposition);
                        if (matches != null && matches[1]) {
                            filename = matches[1].replace(/['"]/g, '');
                        }
                    }
                    var contentType = headers('Content-Type');
                    var blob = new Blob(
                        [data], { type: contentType }
                    );
                    var url = window.URL || window.webkitURL;
                    var link = url.createObjectURL(blob);
                    var a = document.createElement("a");
                    a.setAttribute("download", filename);
                    a.setAttribute("href", link);
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    return;
                }
            },
            'exportExcel': {
                method: 'POST',
                url: baseUrl + '/exportExcel',
                responseType: 'arraybuffer',
                transformResponse: function (data, headers, status) {
                    var filename = "";
                    var disposition = headers('Content-Disposition');
                    if (disposition && disposition.indexOf('attachment') !== -1) {
                        let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                        let matches = filenameRegex.exec(disposition);
                        if (matches != null && matches[1]) {
                            filename = matches[1].replace(/['"]/g, '');
                        }
                    }
                    var contentType = headers('Content-Type');
                    var blob = new Blob(
                        [data], { type: contentType }
                    );
                    var url = window.URL || window.webkitURL;
                    var link = url.createObjectURL(blob);
                    var a = document.createElement("a");
                    a.setAttribute("download", filename);
                    a.setAttribute("href", link);
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    return;
                }
            },
            'exportExcelByName': {
                method: 'POST',
                url: baseUrl + '/:name',
                params: { name: '@name'},
                responseType: 'arraybuffer',
                transformResponse: function (data, headers, status) {
                    var filename = "";
                    var disposition = headers('Content-Disposition');
                    if (disposition && disposition.indexOf('attachment') !== -1) {
                        let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                        let matches = filenameRegex.exec(disposition);
                        if (matches != null && matches[1]) {
                            filename = matches[1].replace(/['"]/g, '');
                        }
                    }
                    var contentType = headers('Content-Type');
                    var blob = new Blob(
                        [data], { type: contentType }
                    );
                    var url = window.URL || window.webkitURL;
                    var link = url.createObjectURL(blob);
                    var a = document.createElement("a");
                    a.setAttribute("download", filename);
                    a.setAttribute("href", link);
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    return;
                }
            }
        })
});

app.factory('svDanhMuc', ['$resource', function ($resource) {
    var baseUrl = '/api';
    var vm = $resource(baseUrl + '/:tbName/:id',
        {
            id: '@id', tbName: '@tbName', fName: '@fName'
        },
        {
            'createOrUpdate': { method: 'POST' },
            'getAll': { method: 'GET', isArray: true },
            'show': { method: 'GET' },
            'delete': { method: 'POST' },
            'showPage': {
                method: 'GET',
                params: {
                    sSearch: '@sSearch',
                    from: '@from',
                    to: '@to',
                    iPageIndex: '@iPageIndex',
                    iPageSize: '@iPageSize'
                },
                url: baseUrl + '/:tbName/showPage',
            },
            'get': {
                method: 'GET',
                url: baseUrl + '/:tbName/:fName',
            },
            'getList': {
                method: 'GET',
                url: baseUrl + '/:tbName/:fName',
                isArray: true
            },
            'post': {
                method: 'POST',
                url: baseUrl + '/:tbName/:fName',
            }

        });
    var vmPrototype = vm.prototype;
    vm.uploadfile = vmPrototype.uploadfile = function (info, dsFiles) {
        var data = new FormData();
        _.each(dsFiles, (x) => data.append('files', x));
        return new Promise((resolve, reject) => {
            var ajaxRequest = $.ajax({
                url: baseUrl + `/${info.tbName}/uploadfile?id=${info.Id || ''}&delFile=${info.delFile || ''}`,
                type: 'POST',
                dataType: 'json',
                contentType: false,
                processData: false,
                data: data,
            });
            ajaxRequest.done(resolve);
            ajaxRequest.fail(reject);
        });
    }
    return vm;
}]);