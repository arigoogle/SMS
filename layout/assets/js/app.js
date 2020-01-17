var api_url = "http://localhost/smscode/rest/index.php/",
    api_urlapp = "http://localhost/smscode/rest/",
    full_base_name = "http://localhost/smscode/layout/",
    historyurl = [];
$.pages = "pages/";

$(document).ready(function() {
    // $(".breadcrumb").hide();
    $("#titlePage").html("Dashboard");
    $("#openedPage").html("Dashboard");
    $("#modulePage").attr("style", "display:none");
    var fl = localStorage["firstLog"];

    if (fl == 1) {
        $(".page-title").attr("style", "display:none");
        $(".breadcrumb").attr("style", "display:none");
        $(".side-menu").attr("style", "display:none");
        $(".content-page").attr("style", "margin-left:0");
        $(".konten").load("template/loginFirst.html");
    } else {
        $(".konten").load("dashboard.html");
    }
    // dd = getDataLogin();
    $("#loader").fadeOut("fast");

    $('.sign_out').on('click', function () {
        localStorage.clear();
        window.location = '';
    });



});

function setInputDate(_id){
    var _dat = document.querySelector(_id);
    var hoy = new Date(),
        d = hoy.getDate(),
        m = hoy.getMonth()+1,
        y = hoy.getFullYear(),
        data;

    if(d < 10){
        d = "0"+d;
    };
    if(m < 10){
        m = "0"+m;
    };

    data = y+"-"+m+"-"+d;
    console.log(data);
    _dat.value = data;
};

function getInformationDash(){
    $.ajax({
        url: api_url + 'Dashboard/getDashboardInfo',
        method: 'GET',
        dataType: 'json',
        success:function(data) {
            $("#activeMember").html(data.active_members_count + " Active Member");
            $("#waitMember").html(data.wait_members_count + " Users");
            $("#countContract").html(data.contract_count + " New Contract");
            $("#countLeads").html(data.leads_count + " New Leads");
            $("#logInfo").html('');
            for(var dl in data.action_log){
                const el = data.action_log[dl];
                var activityAct = el.username + ' ' + el.description;
                var ht = '<div class="kt-list-timeline__item">'
                            + '<span class="kt-list-timeline__badge kt-list-timeline__badge--success" id="dashLogDotIndicator"></span>'
                            + '<span class="kt-list-timeline__text" id="dashLogText">'+activityAct+'</span>'
                            + '<span class="kt-list-timeline__time" id="dashLogDate">'+el.created_date+'</span>'
                        + '</div>'
                
                $('#logInfo').append(ht)
            }

            for(var l in data.leads){
                const ll = data.leads[l];
                var fullname = ll.first_name + ' ' + ll.last_name;
                var htm = '<div class="kt-widget4__item">'
                           +' <div class="kt-widget4__pic kt-widget4__pic--pic">'
                           +'   <img src="../assets/media/users/users.jpg" alt="">'
                           +' </div>'
                           +' <div class="kt-widget4__info">'
                           +'   <a href="#" class="kt-widget4__username">'
                           + fullname
                           +'   </a>'
                           +'   <p class="kt-widget4__text">'
                           + ll.company_name
                           +'   </p>'
                           +' </div>'
                        //    +' <a href="#" class="btn btn-sm btn-label-brand btn-bold">Follow</a>'
                        +' </div>';
                $('#ctLeads').append(htm);
            }

            for(var p in data.partner){
                const pp = data.partner[p];
                var stryes = '&#10003;';
                var activeornot = (pp.authorized=="Y")?stryes:'X'
                var htm = '<div class="kt-widget5__item">'
                            +' <div class="kt-widget5__content">'
                            +'  <div class="kt-widget5__pic">'
                            +'      <img class="kt-widget7__img" src="../assets/media/products/product27.jpg" alt="">'
                            +'  </div>'
                            +'  <div class="kt-widget5__section">'
                            +'      <a href="#" class="kt-widget5__title">'
                            + pp.account_name
                            +'      </a>'
                            +'      <p class="kt-widget5__desc">'
                            + pp.city
                            +'      </p>'
                            +'      <div class="kt-widget5__info">'
                            +'          <span>Authorized:</span>'
                            +'          <span class="kt-font-info">'+activeornot+'</span>'
                            +'      </div>'
                            +'  </div>'
                            +'</div>'
                            +'<div class="kt-widget5__content">'
                            +'  <div class="kt-widget5__stats">'
                            +'      <span class="kt-widget5__number">'+pp.countSales+'</span>'
                            +'      <span class="kt-widget5__sales">sales</span>'
                            +'  </div>'
                            +'  <div class="kt-widget5__stats">'
                            +'      <span class="kt-widget5__number">'+replaceDuitTigaDigit(parseFloat(pp.moneySales))+'</span>'
                            +'      <span class="kt-widget5__votes">IDR</span>'
                            +'  </div>'
                            +'</div>'
                        +'</div>';
                $('#ctPartner').append(htm);
            }
        }
    })
}

function resetData() {
    swal.fire({
        title: 'Are you sure want to delete all data ?',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger m-l-10',
        preConfirm: function () {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    $.ajax({
                        url: api_url + 'Data/resetAllData',
                        dataType: 'json',
                        method: 'post',
                        success: function (d) {
                            if (d.success) {
                                resolve();

                            } else {
                                returnErrorMessage(d.msg);
                                reject();
                            }
                        },
                        error: function (xhr) {
                            returnErrorMessage("Oops! " + xhr.status + " " + xhr.statusText);
                            reject();
                        }
                    })
                }, 2000)
            })
        },
        allowOutsideClick: false
    }).then(function () {
        swal.fire({
            type: 'success',
            title: 'All data has been reset!',
            showCancelButton: false,
            confirmButtonColor: '#4fa7f3'
        }).then(function () {
            var url = 'dashboard.html',
                modul = 'Dashboard',
                title = 'Dashboard';
            moveUrl(url, modul, title);
        })
    })
}

$(document).ready(function () {
    checkRules();
    $("a.primary-menu").click(function (event) {
        event.preventDefault();
        event.stopPropagation();
        var url = $(this).attr('href'),
            modul = $(this).data('modul'),
            title = $(this).data('title'),
            liparent = $(this).parent(),
            liparentli = liparent.parent().parent().parent();

        $.ajax({
            type: 'GET',
            url: url + '?u=' + Math.random(),
            beforeSend: function () {
                // cekSession();
                $('.contloader').show();
                $(".breadcrumb").fadeIn();
                $(".kt-menu__subnav li").removeClass('kt-menu__item--active');
                $(".kt-menu__item").removeClass('kt-menu__item--active');
                $(".action-menu").parent().removeClass('kt-menu__item--active');
                // $(".konten").html('<center><div style="margin-top:25vh;" class="loader"></div></center>');
            },
            error: function () {
                $("#titlePage").html(title);
                $("#openedPage").html(title);
                $("#modulePage").html(modul);
                $(".konten").delay(500).fadeIn().html('<div class="content-wrapper d-flex align-items-center text-center error-page bg-primary"> <div class="row flex-grow"> <div class="col-lg-7 mx-auto text-white"> <div class="row align-items-center d-flex flex-row"> <div class="col-lg-6 text-lg-right pr-lg-4"> <h1 class="display-1 mb-0">404</h1> </div> <div class="col-lg-6 error-page-divider text-lg-left pl-lg-4"> <h2>SORRY!</h2> <h3 class="font-weight-light">The page you’re looking for was not found.</h3> </div> </div> <div class="row mt-5"> <div class="col-12 text-center mt-xl-2"> <a class="text-white font-weight-medium" href="'+full_base_name+'">Back to home</a> </div> </div>'); },
            success: function (data) {
                liparent.addClass('kt-menu__item--active');
                liparentli.addClass('kt-menu__item--active');
                runPages();
                $("#titlePage").html(title);
                $("#openedPage").html(title);
                $(this).parent().addClass('kt-menu__item--active');
                if (modul == '') {
                    $("#modulePage").attr('style', 'display:none');
                } else {
                    $("#modulePage").attr('style', 'display:block').html(modul);
                }
                document.title = "SMS - " + title;
                $(".konten").fadeOut(300, function () {
                    $(".konten").html(data).delay(100).fadeIn(300);
                });
            }
        });
    })
});

// ini
function checkRules() {
    if (localStorage["status"] == "login") {
        var allowUrl = localStorage["allowedUrl"].toString().split("[|]");

        // var listMenu = $('#sidebar li:not(:first) a');
        var listMenu = $('.sidemenu li.kt-menu__item--submenu:not(:first) ul li a');
        // var listMenuParent = $('.sidemenu li.kt-menu__item--submenu:not(:first)');
        for (var ls in listMenu) {
            var mn = listMenu.eq(ls);
            // var mnP = listMenuParent.eq(ls);

            if (mn.attr("href") != "javascript:void(0);") {
                mn.addClass("hideForever");
                mn.parent().parent().parent().parent().addClass("hideForever");
                // mnP.addClass("hideForever");
            }
        }
        for (var au in allowUrl) {
            var al = allowUrl[au];

            //        console.log('#kt_aside_menu a[href="' + al + '"]');

            $('#kt_aside_menu .sidemenu a[href="' + al + '"]').removeClass("hideForever");
            $('#kt_aside_menu .sidemenu a[href="' + al + '"]').parent().parent().parent().parent().removeClass("hideForever");
        }

        $(".hideForever").remove();

    }
}

function setSessionLogout() {
    localStorage.clear();
    localStorage.removeItem("smsLogin");
    localStorage.removeItem("username");
    localStorage.removeItem("position_id");
    localStorage.removeItem("id");
    localStorage.removeItem("status");
}
function cekSession() {
    var bl = localStorage["smsLogin"],
        id = localStorage["id"];
    if (
        bl == "" ||
        bl == "false" ||
        bl == undefined
    // ||
    // id == "" ||
    // id == undefined
    ) {
        setSessionLogout();
        localStorage.setItem("sessionTimedOut", "true");

        window.location.href = "../";
    } else {
    }
}

function moveUrl(url, modul, title, id, callback) {

    $.ajaxSetup({
        global: true,
        beforeSend: function(jqXHR, settings) {
            $("#loader").fadeIn("slow").attr('style','display:block');
        },
        complete: function() {
            $("#loader").fadeOut().remove();
        },
        error: function() {
            $("#loader").remove();
        }
    });
    $.ajax({
        type: "GET",
        url: url + "?u=" + Math.random(),
        beforeSend: function() {
            $(".konten div").remove();
            $(".breadcrumb").fadeIn();
            $("#loader").fadeIn().attr('style','display:block');
            // $(".konten").html(
            //     '<center><div style="margin-top:25vh;" class="loader"></div></center>'
            // );
        },
        error: function() {
            $(".konten").html(
                '<div class="wrapper-page"> <div class="ex-page-content text-center"> <div class="text-error"><span class="text-primary">4</span><i class="ti-face-sad text-pink"></i><span class="text-info">4</span></div> <h2>Who0ps! Page not found</h2><br> <p class="text-muted">This page cannot found or is missing.</p> <p class="text-muted">Use the navigation above or the button below to get back and track.</p> <br> <a class="btn btn-default waves-effect waves-light" href="index.html"> Return Home</a> </div> </div> '
            );
        },
        success: function(data) {
            $("#titlePage").html(title);
            $(".dta").html("<input type='hidden' id='m_id' value='" + id + "' >");
            $("#openedPage").html(title);
            $("#modulePage").html(modul);

            $(".konten").fadeOut(300, function() {
                $(".konten")
                    .html(data)
                    .delay(100)
                    .fadeIn(300);
                try {
                    if (typeof id == "function") {
                        id();
                    } else if (typeof callback == "function") {
                        callback();
                    }
                } catch (e) {
                    console.log(e);
                }
            });
        }
    });
}

function runPages() {
    localStorage.removeItem('stepContract');
    $.ajaxSetup({
        global: true,
        beforeSend: function (jqXHR, settings) {
            $("#loader").fadeIn().attr('style','display:block');
            $("#loader").fadeIn('slow');

        },
        complete:function() {
            $("#loader").delay(300).fadeOut('slow').attr('style','display:none');
        },
        error:function() {
            $("#loader").attr('style','display:none');
        }
    });
    // $('.datepicker-autoclose').daterangepicker({
    //     buttonClasses: ['btn', 'btn-sm'],
    //     applyClass: 'btn-default',
    //     cancelClass: 'btn-white'
    // });
    var start = moment().subtract(29, 'days');
    var end = moment();
    $("input[type='datetimepicker']").daterangepicker({
        contract_start_date: moment().startOf('month'),
        contract_end_date: end
    });
    $(".select2").select2();
    // $('.tagsinput').tagsinput();

    $(".select2-limiting").select2({
        maximumSelectionLength: 2
    });

    // $('.selectpicker').selectpicker();

    // $('form').parsley();

    $(document)
        .off("click", '[data-plugin="custommodal"]')
        .on("click", '[data-plugin="custommodal"]', function(e) {
            Custombox.open({
                target: $(this).attr("href"),
                effect: $(this).attr("data-animation"),
                overlaySpeed: $(this).attr("data-overlaySpeed"),
                overlayColor: $(this).attr("data-overlayColor")
            });
            e.preventDefault();
        });
    $("a.action-menu")
        .unbind("click")
        .click(function(e) {
            cekSession();
            e.preventDefault();
            var url = $(this).attr("href");
            (modul = $(this).data("modul")), (title = $(this).data("title"));
            document.title = "SMS - " + title;
            $(".primary-menu").parent().parent().parent().parent().removeClass('kt-menu__item--active');
            $(".primary-menu").parent().parent().parent().removeClass('kt-menu__item--active');
            $(".primary-menu").parent().parent().removeClass('kt-menu__item--active');
            $(".primary-menu").parent().removeClass('kt-menu__item--active');

            $(this).parent().addClass('kt-menu__item--active');

            moveUrl(url, modul, title);
        });
    $("[data-toggle='tooltip']").tooltip();
}

// UTILITIES

function replaceDuitTigaDigit(str) {
    if (str != null) {

        var depan = str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return depan;
    } else {
        return "";
    }
}
function runDataTable() {
    if ($.fn.dataTable.isDataTable(".dataTable")) {
        $(".dataTable").DataTable({
            info: false
        });
    } else {
        $(".dataTable").DataTable({
            info: false
        });
    }
}
function runDataTableCustom(params) {
    if (params==undefined) {
        params = 1;
    }
    if ($.fn.dataTable.isDataTable(".dataTable")) {
        $(".dataTable").DataTable({
            info: false,
            order: [[params, "desc"]]
        });
    } else {
        $(".dataTable").DataTable({
            info: false,
            order: [[params, "desc"]]
        });
    }
}

function runDataTableCustomAllocation() {
    if ($.fn.dataTable.isDataTable(".dataTable")) {
        $(".dataTable").DataTable({
            info: false,
            order: [[3, "desc"]]
        });
    } else {
        $(".dataTable").DataTable({
            info: false,
            order: [[3, "desc"]]
        });
    }
}

function runDataTableCheck() {
    $(".dataTableCheck").DataTable({
        columnDefs: [
            {
                orderable: false,
                className: "select-checkbox",
                targets: 0
            }
        ],
        select: {
            style: "os",
            selector: "td:first-child"
        },
        rowCallback: function(row, data) {
            if ($.inArray(data.DT_RowId, selected) !== -1) {
                $(row).addClass("selected");
            }
        },
        order: [[1, "asc"]]
    });
}

function hasDecimal(num) {
    return !!(num % 1);
}


function datePHPJS(format, timestamp) {
    var that = this;
    var jsdate, f;
    // Keep this here (works, but for code commented-out below for file size reasons)
    // var tal= [];
    var txt_words = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
    ];
    // trailing backslash -> (dropped)
    // a backslash followed by any character (including backslash) -> the character
    // empty string -> empty string
    var formatChr = /\\?(.?)/gi;
    var formatChrCb = function(t, s) {
        return f[t] ? f[t]() : s;
    };
    var _pad = function(n, c) {
        n = String(n);
        while (n.length < c) {
            n = "0" + n;
        }
        return n;
    };
    f = {
        // Day
        d: function() {
            // Day of month w/leading 0; 01..31
            return _pad(f.j(), 2);
        },
        D: function() {
            // Shorthand day name; Mon...Sun
            return f.l().slice(0, 3);
        },
        j: function() {
            // Day of month; 1..31
            return jsdate.getDate();
        },
        l: function() {
            // Full day name; Monday...Sunday
            return txt_words[f.w()];
        },
        N: function() {
            // ISO-8601 day of week; 1[Mon]..7[Sun]
            return f.w() || 7;
        },
        S: function() {
            // Ordinal suffix for day of month; st, nd, rd, th
            var j = f.j();
            var i = j % 10;
            if (i <= 3 && parseInt((j % 100) / 10, 10) == 1) {
                i = 0;
            }
            return ["st", "nd", "rd"][i - 1] || "th";
        },
        w: function() {
            // Day of week; 0[Sun]..6[Sat]
            return jsdate.getDay();
        },
        z: function() {
            // Day of year; 0..365
            var a = new Date(f.Y(), f.n() - 1, f.j());
            var b = new Date(f.Y(), 0, 1);
            return Math.round((a - b) / 864e5);
        },
        // Week
        W: function() {
            // ISO-8601 week number
            var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
            var b = new Date(a.getFullYear(), 0, 4);
            return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
        },
        // Month
        F: function() {
            // Full month name; January...December
            return txt_words[6 + f.n()];
        },
        m: function() {
            // Month w/leading 0; 01...12
            return _pad(f.n(), 2);
        },
        M: function() {
            // Shorthand month name; Jan...Dec
            return f.F().slice(0, 3);
        },
        n: function() {
            // Month; 1...12
            return jsdate.getMonth() + 1;
        },
        t: function() {
            // Days in month; 28...31
            return new Date(f.Y(), f.n(), 0).getDate();
        },
        // Year
        L: function() {
            // Is leap year?; 0 or 1
            var j = f.Y();
            return ((j % 4 === 0) & (j % 100 !== 0)) | (j % 400 === 0);
        },
        o: function() {
            // ISO-8601 year
            var n = f.n();
            var W = f.W();
            var Y = f.Y();
            return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
        },
        Y: function() {
            // Full year; e.g. 1980...2010
            return jsdate.getFullYear();
        },
        y: function() {
            // Last two digits of year; 00...99
            return f
                .Y()
                .toString()
                .slice(-2);
        },
        // Time
        a: function() {
            // am or pm
            return jsdate.getHours() > 11 ? "pm" : "am";
        },
        A: function() {
            // AM or PM
            return f.a().toUpperCase();
        },
        B: function() {
            // Swatch Internet time; 000..999
            var H = jsdate.getUTCHours() * 36e2;
            // Hours
            var i = jsdate.getUTCMinutes() * 60;
            // Minutes
            var s = jsdate.getUTCSeconds(); // Seconds
            return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
        },
        g: function() {
            // 12-Hours; 1..12
            return f.G() % 12 || 12;
        },
        G: function() {
            // 24-Hours; 0..23
            return jsdate.getHours();
        },
        h: function() {
            // 12-Hours w/leading 0; 01..12
            return _pad(f.g(), 2);
        },
        H: function() {
            // 24-Hours w/leading 0; 00..23
            return _pad(f.G(), 2);
        },
        i: function() {
            // Minutes w/leading 0; 00..59
            return _pad(jsdate.getMinutes(), 2);
        },
        s: function() {
            // Seconds w/leading 0; 00..59
            return _pad(jsdate.getSeconds(), 2);
        },
        u: function() {
            // Microseconds; 000000-999000
            return _pad(jsdate.getMilliseconds() * 1000, 6);
        },
        // Timezone
        e: function() {
            // Timezone identifier; e.g. Atlantic/Azores, ...
            // The following works, but requires inclusion of the very large
            // timezone_abbreviations_list() function.
            /*              return that.date_default_timezone_get();
             */
            throw "Not supported (see source code of date() for timezone on how to add support)";
        },
        I: function() {
            // DST observed?; 0 or 1
            // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
            // If they are not equal, then DST is observed.
            var a = new Date(f.Y(), 0);
            // Jan 1
            var c = Date.UTC(f.Y(), 0);
            // Jan 1 UTC
            var b = new Date(f.Y(), 6);
            // Jul 1
            var d = Date.UTC(f.Y(), 6); // Jul 1 UTC
            return a - c !== b - d ? 1 : 0;
        },
        O: function() {
            // Difference to GMT in hour format; e.g. +0200
            var tzo = jsdate.getTimezoneOffset();
            var a = Math.abs(tzo);
            return (
                (tzo > 0 ? "-" : "+") + _pad(Math.floor(a / 60) * 100 + (a % 60), 4)
            );
        },
        P: function() {
            // Difference to GMT w/colon; e.g. +02:00
            var O = f.O();
            return O.substr(0, 3) + ":" + O.substr(3, 2);
        },
        T: function() {
            // Timezone abbreviation; e.g. EST, MDT, ...
            return "UTC";
        },
        Z: function() {
            // Timezone offset in seconds (-43200...50400)
            return -jsdate.getTimezoneOffset() * 60;
        },
        // Full Date/Time
        c: function() {
            // ISO-8601 date.
            return "Y-m-d\\TH:i:sP".replace(formatChr, formatChrCb);
        },
        r: function() {
            // RFC 2822
            return "D, d M Y H:i:s O".replace(formatChr, formatChrCb);
        },
        U: function() {
            // Seconds since UNIX epoch
            return (jsdate / 1000) | 0;
        }
    };
    this.date = function(format, timestamp) {
        that = this;
        jsdate =
            timestamp === undefined
                ? new Date() // Not provided
                : timestamp instanceof Date
                ? new Date(timestamp) // JS Date()
                : new Date(timestamp * 1000); // UNIX timestamp (auto-convert to int)
        return format.replace(formatChr, formatChrCb);
    };
    return this.date(format, timestamp);
}

function number_format(number, decimals, decPoint, thousandsSep) {
    number = (number + "").replace(/[^0-9+\-Ee.]/g, "");
    var n = !isFinite(+number) ? 0 : +number;
    var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
    var sep = typeof thousandsSep === "undefined" ? "," : thousandsSep;
    var dec = typeof decPoint === "undefined" ? "." : decPoint;
    var s = "";

    var toFixedFix = function(n, prec) {
        var k = Math.pow(10, prec);
        return "" + (Math.round(n * k) / k).toFixed(prec);
    };

    // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || "").length < prec) {
        s[1] = s[1] || "";
        s[1] += new Array(prec - s[1].length + 1).join("0");
    }

    return s.join(dec);
}

function returnErrorMessage(msg) {
    toastr.warning(msg, "Sorry", {
        positionClass: "toast-top-right",
        preventDuplicates: true,
        maxOpened: 1,
        preventOpenDuplicates: true
    });
}
function returnSuccessMessage(msg) {
    toastr.success(msg, "Success", {
        positionClass: "toast-top-right",
        preventDuplicates: true,
        maxOpened: 1,
        preventOpenDuplicates: true
    });
}
function returnErrorExist() {
    toastr.warning("This data has been followed up", "Sorry", {
        positionClass: "toast-top-right"
    });
}
function returnErrorPrivileges() {
    toastr.warning("You don't have privilege to access this module", "Sorry", {
        positionClass: "toast-top-right"
    });
}

function showErrorWithNoAction(m) {
    swal.fire({
        title: "Error",
        text: m,
        type: "error",

        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Ok",
        closeOnConfirm: false
    });
    return false;
}

function financial(x) {
    return Number.parseFloat(x).toFixed(2);
}
function replaceAll(str, find, replace) {
    return str.split(find).join(replace);
}

function nulldefault(value) {
    return (value == null) ? "" : value
}

function replaceDuitTigaDigit(str) {
    if (str != null) {
        var depan = str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return depan;
    } else {
        return "";
    }
}

function replaceDuit(duit) {
    // console.log(duit,'satu');
    duit = duit.toFixed(3).replace(/./g, function(c, i, a) {
        return i && c !== "." && (a.length - i) % 4 === 0 ? "," + c : c;
    });
    // console.log(duit,'dua');
    var duitbaru = duit.toString();
    var split = duitbaru.split(".");
    var depan = split[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    duit = depan + "," + Math.ceil(parseFloat(split[1]) / 10);
    // duit = Math.ceil(duit);
    // console.log(duit,'tiga');
    return duit;
    // return duit.toFixed(2).replace(/./g, function(c, i, a) {
    //     return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
    // });
    // return duit;
}

function commarize(val) {
    // 1e6 = 1 Million, begin with number to word after 1e6.
    var uang = val / 1000;
    var nf = number_format(uang, "2", ".", ",");
    return nf + " K";
}

function strtotime(text, now) {
    var parsed,
        match,
        today,
        year,
        date,
        days,
        ranges,
        len,
        times,
        regex,
        i,
        fail = false;

    if (!text) {
        return fail;
    }

    // Unecessary spaces
    text = text
        .replace(/^\s+|\s+$/g, "")
        .replace(/\s{2,}/g, " ")
        .replace(/[\t\r\n]/g, "")
        .toLowerCase();

    match = text.match(
        /^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/
    );

    if (match && match[2] === match[4]) {
        if (match[1] > 1901) {
            switch (match[2]) {
                case "-": {
                    if (match[3] > 12 || match[5] > 31) {
                        return fail;
                    }

                    return (
                        new Date(
                            match[1],
                            parseInt(match[3], 10) - 1,
                            match[5],
                            match[6] || 0,
                            match[7] || 0,
                            match[8] || 0,
                            match[9] || 0
                        ) / 1000
                    );
                }
                case ".": {
                    return fail;
                }
                case "/": {
                    if (match[3] > 12 || match[5] > 31) {
                        return fail;
                    }

                    return (
                        new Date(
                            match[1],
                            parseInt(match[3], 10) - 1,
                            match[5],
                            match[6] || 0,
                            match[7] || 0,
                            match[8] || 0,
                            match[9] || 0
                        ) / 1000
                    );
                }
            }
        } else if (match[5] > 1901) {
            switch (match[2]) {
                case "-": {
                    if (match[3] > 12 || match[1] > 31) {
                        return fail;
                    }

                    return (
                        new Date(
                            match[5],
                            parseInt(match[3], 10) - 1,
                            match[1],
                            match[6] || 0,
                            match[7] || 0,
                            match[8] || 0,
                            match[9] || 0
                        ) / 1000
                    );
                }
                case ".": {
                    if (match[3] > 12 || match[1] > 31) {
                        return fail;
                    }

                    return (
                        new Date(
                            match[5],
                            parseInt(match[3], 10) - 1,
                            match[1],
                            match[6] || 0,
                            match[7] || 0,
                            match[8] || 0,
                            match[9] || 0
                        ) / 1000
                    );
                }
                case "/": {
                    if (match[1] > 12 || match[3] > 31) {
                        return fail;
                    }

                    return (
                        new Date(
                            match[5],
                            parseInt(match[1], 10) - 1,
                            match[3],
                            match[6] || 0,
                            match[7] || 0,
                            match[8] || 0,
                            match[9] || 0
                        ) / 1000
                    );
                }
            }
        } else {
            switch (match[2]) {
                case "-": {
                    // YY-M-D
                    if (
                        match[3] > 12 ||
                        match[5] > 31 ||
                        (match[1] < 70 && match[1] > 38)
                    ) {
                        return fail;
                    }

                    year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
                    return (
                        new Date(
                            year,
                            parseInt(match[3], 10) - 1,
                            match[5],
                            match[6] || 0,
                            match[7] || 0,
                            match[8] || 0,
                            match[9] || 0
                        ) / 1000
                    );
                }
                case ".": {
                    // D.M.YY or H.MM.SS
                    if (match[5] >= 70) {
                        // D.M.YY
                        if (match[3] > 12 || match[1] > 31) {
                            return fail;
                        }

                        return (
                            new Date(
                                match[5],
                                parseInt(match[3], 10) - 1,
                                match[1],
                                match[6] || 0,
                                match[7] || 0,
                                match[8] || 0,
                                match[9] || 0
                            ) / 1000
                        );
                    }
                    if (match[5] < 60 && !match[6]) {
                        // H.MM.SS
                        if (match[1] > 23 || match[3] > 59) {
                            return fail;
                        }

                        today = new Date();
                        return (
                            new Date(
                                today.getFullYear(),
                                today.getMonth(),
                                today.getDate(),
                                match[1] || 0,
                                match[3] || 0,
                                match[5] || 0,
                                match[9] || 0
                            ) / 1000
                        );
                    }

                    return fail;
                }
                case "/": {
                    if (
                        match[1] > 12 ||
                        match[3] > 31 ||
                        (match[5] < 70 && match[5] > 38)
                    ) {
                        return fail;
                    }

                    year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
                    return (
                        new Date(
                            year,
                            parseInt(match[1], 10) - 1,
                            match[3],
                            match[6] || 0,
                            match[7] || 0,
                            match[8] || 0,
                            match[9] || 0
                        ) / 1000
                    );
                }
                case ":": {
                    if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
                        return fail;
                    }

                    today = new Date();
                    return (
                        new Date(
                            today.getFullYear(),
                            today.getMonth(),
                            today.getDate(),
                            match[1] || 0,
                            match[3] || 0,
                            match[5] || 0
                        ) / 1000
                    );
                }
            }
        }
    }

    if (text === "now") {
        return now === null || isNaN(now)
            ? (new Date().getTime() / 1000) | 0
            : now | 0;
    }
    if (!isNaN((parsed = Date.parse(text)))) {
        return (parsed / 1000) | 0;
    }

    date = now ? new Date(now * 1000) : new Date();
    days = {
        sun: 0,
        mon: 1,
        tue: 2,
        wed: 3,
        thu: 4,
        fri: 5,
        sat: 6
    };
    ranges = {
        yea: "FullYear",
        mon: "Month",
        day: "Date",
        hou: "Hours",
        min: "Minutes",
        sec: "Seconds"
    };

    function lastNext(type, range, modifier) {
        var diff,
            day = days[range];

        if (typeof day !== "undefined") {
            diff = day - date.getDay();

            if (diff === 0) {
                diff = 7 * modifier;
            } else if (diff > 0 && type === "last") {
                diff -= 7;
            } else if (diff < 0 && type === "next") {
                diff += 7;
            }

            date.setDate(date.getDate() + diff);
        }
    }

    function process(val) {
        var splt = val.split(" "), // Todo: Reconcile this with regex using \s, taking into account browser issues with split and regexes
            type = splt[0],
            range = splt[1].substring(0, 3),
            typeIsNumber = /\d+/.test(type),
            ago = splt[2] === "ago",
            num = (type === "last" ? -1 : 1) * (ago ? -1 : 1);

        if (typeIsNumber) {
            num *= parseInt(type, 10);
        }

        if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
            return date["set" + ranges[range]](date["get" + ranges[range]]() + num);
        }

        if (range === "wee") {
            return date.setDate(date.getDate() + num * 7);
        }

        if (type === "next" || type === "last") {
            lastNext(type, range, num);
        } else if (!typeIsNumber) {
            return false;
        }

        return true;
    }

    times =
        "(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec" +
        "|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?" +
        "|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)";
    regex =
        "([+-]?\\d+\\s" + times + "|" + "(last|next)\\s" + times + ")(\\sago)?";

    match = text.match(new RegExp(regex, "gi"));
    if (!match) {
        return fail;
    }

    for (i = 0, len = match.length; i < len; i++) {
        if (!process(match[i])) {
            return fail;
        }
    }
    return date.getTime() / 1000;
}

function getDataListDashboard(module){
    $.ajax({
        url: api_url + module,
        method: 'GET',
        dataType: 'json',
        success:function(data) {
            if(data.success){
                dataTableLeads(data.row);
            }else{
                swal.fire({
                    type: 'error',
                    title: data.msg,
                    showCancelButton: false,
                    confirmButtonColor: '#4fa7f3'
                })
            }
        }
    })
}

function fetchContract(){
    $.ajax({
        url: api_url + "list_contract",
        method: 'GET',
        dataType: 'json',
        success:function(data) {
            if(data.success){
                dataTableContract(data.row);
            }else{
                swal.fire({
                    type: 'error',
                    title: data.msg,
                    showCancelButton: false,
                    confirmButtonColor: '#4fa7f3'
                })
            }
        }
    })
}

function getDataListOptionCountry(module,idfield,modulenameget="country"){
    var idField = $('#'+idfield);

    $.ajax({
        url: api_url + module,
        method: 'GET',
        dataType: 'json',
        success:function(data) {
            idField.html('');
            if(data.success){
                idField.append('<option value="-1">Please Select</option>');
                for(var i in data.row){
                    modulect = modulenameget+"_name";
                    modulename ="id"+modulenameget;
                    var moduleplus = "",dataval="";
                    if(module=='list_leads'){
                        modulect = "company_name";
                    }else if(module=='list_package'){
                        moduleplus = " - IDR" + replaceDuitTigaDigit(data.row[i].price);
                        dataval = data.row[i].price;
                    }else if(module=='list_support'){
                        modulect = "username";
                        dataval = data.row[i].idusers;
                    }else if(module=='list_contract'){
                        modulect = "contract_number";
                        dataval = data.row[i].idcontracts;
                    }
                    idField.append('<option data-val="'+dataval+'" value="'+data.row[i][modulename]+'">'+data.row[i][modulect]+ moduleplus +'</option>');
                }
            }else{
                swal.fire({
                    type: 'error',
                    title: data.msg,
                    showCancelButton: false,
                    confirmButtonColor: '#4fa7f3'
                })
            }
        }
    })
}

function generalGet(module,callback,params) {
    $.ajax({
        url: api_url + module,
        data:params,
        dataType: 'json',
        success:callback
    });
}

function getDataListOptionPackage(module,idfield){
    var idField = $('#'+idfield);

    $.ajax({
        url: api_url + module,
        method: 'GET',
        dataType: 'json',
        success:function(data) {
            idField.html('');
            if(data.success){
                for(var i in data.row){
                    idField.append('<option value="'+data.row[i].idpackage+'">'+data.row[i].package_name+'</option>');
                }
            }else{
                swal.fire({
                    type: 'error',
                    title: data.msg,
                    showCancelButton: false,
                    confirmButtonColor: '#4fa7f3'
                })
            }
        }
    })
}

function dataTableLeads(data) {
    // Latest Orders
    var dataJSONArray = data;
    var no = 1;
    for(var i in data){
        const el = data[i];
        el['no'] = no;
        el['name'] = el['first_name'] + " " + el['last_name'];

        no++;
    }
    // var dataJSONArray = [{
    //     "no": '1',
    //     "name": "Stir it up",
    //     "company": "Jakarta Banjir",
    //     "package": "CN",
    //     "dateSub": "13/Sep/2019",
    //     "pic": "Collins",
    //     "contractStart": "13/Oct/2019",
    //     "contractend": "13/Oct/2020",
    //     "valueContract": "Serebu",
    //     "status": 1,
    //     "Actions": null
    // },{
    //     "no": '2',
    //     "name": "One Love",
    //     "company": "CV. ABC",
    //     "package": "CN",
    //     "dateSub": "20/Sep/2019",
    //     "pic": null,
    //     "contractStart": "20/Oct/2019",
    //     "contractend": "20/Oct/2019",
    //     "valueContract": "Duarebu",
    //     "status": 2,
    //     "Actions": null
    // },{
    //     "no": '3',
    //     "name": "Buffalo Soldier",
    //     "company": "PT AC",
    //     "package": "CN",
    //     "dateSub": "31/Sep/2019",
    //     "pic": "Hoeger",
    //     "contractStart": "31/Oct/2019",
    //     "contractend": "31/Oct/2020",
    //     "valueContract": "Tigarebu",
    //     "status": 3,
    //     "Actions": null
    // },{
    //     "no": '4',
    //     "name": "Redemption Song",
    //     "company": "PT AB",
    //     "package": "CN",
    //     "dateSub": "13/Oct/2019",
    //     "pic": "Balanar",
    //     "contractStart": "02/Nov/2019",
    //     "contractend": "02/Nov/2020",
    //     "valueContract": "Empatrebu",
    //     "status": 4,
    //     "Actions": null
    // }];


    var datatable = $('.tbl-dataListLeads').KTDatatable({
        data: {
            type: 'local',
            source: dataJSONArray,
            pageSize: 10,
            saveState: {
                cookie: false,
                webstorage: true
            },
            serverPaging: false,
            serverFiltering: false,
            serverSorting: false
        },

        layout: {
            scroll: true,
            height: 500,
            footer: false
        },

        sortable: true,

        filterable: false,

        pagination: true,

        columns: [{
            field: "no",
            title: "No.",
            width: 25,
            sortable: true,
            textAlign: 'left'
        },{
            field: "name",
            title: "Name",
            sortable: true,
            textAlign: 'left'
        },{
            field: "company_name",
            title: "Company",
            textAlign: 'left'
        },{
            field: "date_start",
            title: "Date Submitted",
            sortable: true,
            textAlign: 'left'
        },{
            field: "contractStart",
            title: "Contract Start",
            sortable: true,
            textAlign: 'left'
        },{
            field: "contractend",
            title: "Contract End",
            sortable: true,
            textAlign: 'left'
        },{
            field: "valueContract",
            title: "Value Contract",
            textAlign: 'left'
        },{
            field: "status",
            title: "Status",
            sortable: true,
            textAlign: 'left',
            template: function(row) {
                var status = {
                    1: {
                        'title': 'Leads',
                        'class': ' btn-label-brand'
                    },
                    2: {
                        'title': 'Negotiate',
                        'class': ' btn-label-warning'
                    },
                    3: {
                        'title': 'Contract',
                        'class': ' btn-label-success'
                    },
                    4: {
                        'title': 'Canceled',
                        'class': ' btn-label-danger'
                    }
                };
                return '<span class="btn btn-bold btn-sm btn-font-sm ' + status[row.status].class + '">' + status[row.status].title + '</span>';
            }
        }, {
            field: "Actions",
            title: "Actions",
            sortable: false,
            autoHide: false,
            overflow: 'visible',
            template: function (el) {
                return '\
                        <div class="dropdown">\
                            <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown">\
                                <i class="flaticon-more-1"></i>\
                            </a>\
                            <div class="dropdown-menu dropdown-menu-right">\
                                <ul class="kt-nav">\
                                    <li class="kt-nav__item">\
                                        <a href="javascript:void(0);" onclick="editDataLead(\''+el.idleads+'\')" class="kt-nav__link">\
                                            <i class="kt-nav__link-icon flaticon2-contract"></i>\
                                            <span class="kt-nav__link-text">Edit</span>\
                                        </a>\
                                    </li>\
                                    <li class="kt-nav__item">\
                                        <a href="javascript:void(0);" onclick="deleteDataLead(\''+el.idleads+'\')" class="kt-nav__link">\
                                            <i class="kt-nav__link-icon flaticon2-trash"></i>\
                                            <span class="kt-nav__link-text">Delete</span>\
                                        </a>\
                                    </li>\
                                </ul>\
                            </div>\
                        </div>\
                    ';
            }
        }]
    });
}

function dataTableContract(dt) {
    // Latest Orders
    
    var dataJSONArray = [];
    if(dt.length>0){
        dataJSONArray=dt;
    }

    var datatable = $('.tbl-dataTableListContract').KTDatatable({
        data: {
            type: 'local',
            source: dataJSONArray,
            pageSize: 10,
            saveState: {
                cookie: false,
                webstorage: true
            },
            serverPaging: false,
            serverFiltering: false,
            serverSorting: false
        },

        layout: {
            scroll: true,
            height: 500,
            footer: false
        },

        sortable: true,

        filterable: false,

        pagination: true,

        columns: [{
            field: "no",
            title: "No.",
            width: 25,
            sortable: true,
            textAlign: 'left'
        },{
            field: "contract_number",
            title: "Contract ID",
            textAlign: 'left'
        },{
            field: "client_name",
            title: "Client Name",
            textAlign: 'left'
        },{
            field: "contract_priority",
            title: "Priority",
            sortable: true,
            textAlign: 'left'
        },{
            field: "contract_start_date",
            title: "Start Date",
            sortable: true,
            textAlign: 'left',
            template:function(el){
                return datePHPJS("Y-m-d H:i:s",new Date(el.contract_start_date));
            }
        },{
            field: "contract_end_date",
            title: "End Date",
            sortable: true,
            textAlign: 'left',
            template:function(el){
                return datePHPJS("Y-m-d H:i:s",new Date(el.contract_start_date));
            }
        },{
            field: "package_name",
            title: "Package",
            textAlign: 'left'
        },{
            field: "name",
            title: "PIC Partner",
            textAlign: 'left'
        },{
            field: "contract_status",
            title: "Contract Status",
            textAlign: 'left',
            template: function (el) {
                var ctstat;
                if(el.contract_status=='1'){
                    ctstat = "Leads";
                }else if(el.contract_status=='2'){
                    ctstat = "Negotiate";
                }if(el.contract_status=='3'){
                    ctstat = "Contract";
                }else if(el.contract_status=='4'){
                    ctstat = "Users Feedback";
                }else{
                    ctstat = "Canceled";
                }
                return '<label class="label label-default">'+ctstat+'</label>'
            }
        },{
            field: "commision",
            title: "Commission",
            textAlign: 'left'
        },{
            field: "contract_value",
            title: "Contract Value",
            sortable: true,
            textAlign: 'left',
        },{
            field: "final_income",
            title: "Final Income",
            textAlign: 'left'
        },{
            field: "file_attach",
            title: "File Attachment",
            textAlign: 'left',
            template:function(el) {
                return '<a href="javascript:void(0)" onclick="openFile(\''+el.file_attach+'\')">'+el.file_attach+'</a>';
            }
        },{
            field: "note",
            title: "Note",
            textAlign: 'left'
        },{
            field: "Actions",
            title: "Actions",
            sortable: false,
            autoHide: false,
            overflow: 'visible',
            template: function (el) {
                if(el.contract_status!=4){

                return '\
                        <div class="dropdown">\
                            <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown">\
                                <i class="flaticon-more-1"></i>\
                            </a>\
                            <div class="dropdown-menu dropdown-menu-right">\
                                <ul class="kt-nav">\
                                    <li class="kt-nav__item">\
                                        <a href="javascript:void(0);" onclick="openContract(\''+el.idcontracts+'\')" class="kt-nav__link">\
                                            <i class="kt-nav__link-icon flaticon-eye"></i>\
                                            <span class="kt-nav__link-text">View</span>\
                                        </a>\
                                    </li>\
                                    <li class="kt-nav__item">\
                                        <a href="javascript:void(0);" onclick="editDataFirst()" class="kt-nav__link">\
                                            <i class="kt-nav__link-icon flaticon2-contract"></i>\
                                            <span class="kt-nav__link-text">Edit</span>\
                                        </a>\
                                    </li>\
                                    <li class="kt-nav__item">\
                                        <a href="#" class="kt-nav__link">\
                                            <i class="kt-nav__link-icon flaticon2-trash"></i>\
                                            <span class="kt-nav__link-text">Delete</span>\
                                        </a>\
                                    </li>\
                                </ul>\
                            </div>\
                        </div>\
                    ';
                }else{
                    return "<label class='label label-danger'>Contract Canceled</label>";
                }

            }
        }]
    });
}
function getDataHistoryBalance(module) {
    $.ajax({
        url: api_url + module,
        method: 'GET',
        dataType: 'json',
        success:function(data) {
            if(data.success){
                dataTableHistory(data.row);
            }else{
                swal.fire({
                    type: 'error',
                    title: data.msg,
                    showCancelButton: false,
                    confirmButtonColor: '#4fa7f3'
                })
            }
        }
    })
}

function dataTableHistory(data) {
    // Latest Orders

    var dataJSONArray = data;
    var no = 1;
    for(var i in data){
        const el = data[i];
        el['no'] = no;
        el['name'] = el['first_name'] + " " + el['last_name'];

        no++;
    }

    var datatable = $('.tbl-dataTableHistory').KTDatatable({
        data: {
            type: 'local',
            source: dataJSONArray,
            pageSize: 10,
            saveState: {
                cookie: false,
                webstorage: true
            },
            serverPaging: false,
            serverFiltering: false,
            serverSorting: false
        },

        layout: {
            scroll: true,
            height: 500,
            footer: false
        },

        sortable: true,

        filterable: false,

        pagination: true,

        columns: [{
            field: "no",
            title: "No.",
            width: 25,
            sortable: true,
            textAlign: 'left'
        },{
            field: "type_mutation",
            title: "Type",
            textAlign: 'left',
            template:function(el) {
                if(el.type_mutation==1){
                    return "Income";
                }else{
                    return "Withdraw";
                }
            }
        },{
            field: "contract_number",
            title: "Contract ID",
            textAlign: 'left'
        },{
            field: "widthdraw_code",
            title: "Withdraw ID",
            sortable: true,
            textAlign: 'left'
        },{
            field: "created_date",
            title: "Date",
            sortable: true,
            textAlign: 'left',
            template:function(el) {
                return datePHPJS("Y-m-d",new Date(el.created_date));
            }
        },{
            field: "amount",
            title: "Value",
            sortable: true,
            textAlign: 'left',
            template:function(el){
                if(el.amount!=null){
                    return replaceDuitTigaDigit(parseFloat(el.amount));
                }else{
                    return "Rp. 0";
                }
            }
        },{
            field: "partner_credit",
            title: "Saldo",
            textAlign: 'left',
            template:function(el){
                if(el.partner_credit!=null){
                    return replaceDuitTigaDigit(parseFloat(el.partner_credit));
                }else{
                    return "Rp. 0";
                }
            }
        },{
            field: "status",
            title: "Status",
            textAlign: 'left',
            template:function(el){
                if(el.status==1){
                    return ret = "<span style='width:100px;float:left' class='btn btn-bold btn-sm btn-font-sm btn-label-success'>Withdraw Approved</span>";
                }else{
                    return ret = "<span style='width:100px;float:left' class='btn btn-bold btn-sm btn-font-sm btn-label-danger'>Waiting to Approve</span>";
                }
            }
        }
        // ,{
        //     field: "Actions",
        //     title: "Actions",
        //     sortable: false,
        //     autoHide: false,
        //     overflow: 'visible',
        //     template: function () {
        //         return '\
        //                 <div class="dropdown">\
        //                     <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown">\
        //                         <i class="flaticon-more-1"></i>\
        //                     </a>\
        //                     <div class="dropdown-menu dropdown-menu-right">\
        //                         <ul class="kt-nav">\
        //                             <li class="kt-nav__item">\
        //                                 <a href="#" class="kt-nav__link">\
        //                                     <i class="kt-nav__link-icon flaticon2-contract"></i>\
        //                                     <span class="kt-nav__link-text">Edit</span>\
        //                                 </a>\
        //                             </li>\
        //                             <li class="kt-nav__item">\
        //                                 <a href="#" class="kt-nav__link">\
        //                                     <i class="kt-nav__link-icon flaticon2-trash"></i>\
        //                                     <span class="kt-nav__link-text">Delete</span>\
        //                                 </a>\
        //                             </li>\
        //                         </ul>\
        //                     </div>\
        //                 </div>\
        //             ';
        //     }
        // }
    ]
    });
}


function dataTableWithdraw(data) {
    // Latest Orders

    var dataJSONArray = data;
    var no = 1;
    for(var i in data){
        const el = data[i];
        el['no'] = no;
        el['name'] = el['first_name'] + " " + el['last_name'];

        no++;
    }

    var datatable = $('.tbl-dataTableListWithdraw').KTDatatable({
        data: {
            type: 'local',
            source: dataJSONArray,
            pageSize: 10,
            saveState: {
                cookie: false,
                webstorage: true
            },
            serverPaging: false,
            serverFiltering: false,
            serverSorting: false
        },

        layout: {
            scroll: true,
            height: 500,
            footer: false
        },

        sortable: true,

        filterable: false,

        pagination: true,

        columns: [{
            field: "no",
            title: "No.",
            width: 25,
            sortable: true,
            textAlign: 'left'
        },{
            field: "type_mutation",
            title: "Type",
            textAlign: 'left',
            template:function(el) {
                if(el.type_mutation==1){
                    return "Income";
                }else{
                    return "Withdraw";
                }
            }
        },{
            field: "contract_number",
            title: "Contract ID",
            textAlign: 'left'
        },{
            field: "widthdraw_code",
            title: "Withdraw ID",
            sortable: true,
            textAlign: 'left'
        },{
            field: "created_date",
            title: "Date",
            sortable: true,
            textAlign: 'left',
            template:function(el) {
                return datePHPJS("Y-m-d",new Date(el.created_date));
            }
        },{
            field: "amount",
            title: "Value",
            sortable: true,
            textAlign: 'left',
            template:function(el){
                return replaceDuitTigaDigit(parseFloat(el.amount));
            }
        },{
            field: "partner_credit",
            title: "Saldo",
            textAlign: 'left',
            template:function(el){
                if(!isNaN(el)){
                    return replaceDuitTigaDigit(parseFloat(el.partner_credit));
                }else{
                    return "Rp. 0";
                }
            }
        },{
            field: "status",
            title: "Status",
            textAlign: 'left',
            template:function(el){
                if(el.status==1){
                    return ret = "<span style='width:100px;float:left' class='btn btn-bold btn-sm btn-font-sm btn-label-success'>Withdraw Approved</span>";
                }else{
                    return ret = "<span style='width:100px;float:left' class='btn btn-bold btn-sm btn-font-sm btn-label-danger'>Waiting to Approve</span>";
                }
            }
        },{
            field: "Actions",
            title: "Actions",
            sortable: false,
            autoHide: false,
            overflow: 'visible',
            template: function () {
                return '\
                        <div class="dropdown">\
                            <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown">\
                                <i class="flaticon-more-1"></i>\
                            </a>\
                            <div class="dropdown-menu dropdown-menu-right">\
                                <ul class="kt-nav">\
                                    <li class="kt-nav__item">\
                                        <a href="#" class="kt-nav__link">\
                                            <i class="kt-nav__link-icon flaticon2-contract"></i>\
                                            <span class="kt-nav__link-text">Edit</span>\
                                        </a>\
                                    </li>\
                                    <li class="kt-nav__item">\
                                        <a href="#" class="kt-nav__link">\
                                            <i class="kt-nav__link-icon flaticon2-trash"></i>\
                                            <span class="kt-nav__link-text">Delete</span>\
                                        </a>\
                                    </li>\
                                </ul>\
                            </div>\
                        </div>\
                    ';
            }
        }]
    });
}
function getDataListPackage(module){
    $.ajax({
        url: api_url + module,
        method: 'GET',
        dataType: 'json',
        success:function(data) {
            if(data.success){
                dataTablePackage(data.row);
            }else{
                swal.fire({
                    type: 'error',
                    title: data.msg,
                    showCancelButton: false,
                    confirmButtonColor: '#4fa7f3'
                })
            }
        }
    })
}

function getDataListWithdraw(module){
    $.ajax({
        url: api_url + module,
        method: 'GET',
        dataType: 'json',
        success:function(data) {
            if(data.success){
                dataTableWithdraw(data.row);
            }else{
                swal.fire({
                    type: 'error',
                    title: data.msg,
                    showCancelButton: false,
                    confirmButtonColor: '#4fa7f3'
                })
            }
        }
    })
}


function deleteDataLead(id){
    swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        // icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          $.ajax({
              url: api_url + 'leads/softDelete',
              data: {id:id},
              dataType: 'json',
              method: 'get',
              success:function(dt){
                  if(dt.success){
                    var url = 'leads/list.html';
                    var title = "List Leads";
                    moveUrl(url,"Leads",title,'',function(){
                        swal.fire({
                            title:'Deleted!',
                            text:'Leads has been deleted.',
                            type:'success'
                        })
                    });
                  }else{
                    swal.fire({
                        title:'Oops!',
                        text:dt.msg,
                        type:'error'
                    })
                  }
              },
              error:function(xhr) {
                swal.fire(
                    'Oops!',
                    xhr.status + ' ' + xhr.statusText,
                    'error'
                  );
              }
          })
        }else{
            return;
        }
      })
}
function editDataLead(id) {
    $.ajax({
        url: api_url + 'Leads/listbyId/'+id,
        method: 'GET',
        dataType: 'json',
        success:function(data) {
            if(data.success){
                setDataEditLeads(data.row[0]);
            }else{
                swal.fire({
                    type: 'error',
                    title: 'Oops',
                    text: data.msg
                })
            }
        }
    })
}
function setDataEditLeads(data) {
    var formEdit= '<form class="kt-form kt-form--label-right" method="POST" id="editLeadsModalForm" action="javascript:void(0)">' +
    '<div class="kt-portlet__body">' +
        '<div class="form-group row">' +
            '<div class="col-lg-6">' +
                '<label>First Name:</label>' +
                '<input type="hidden" class="form-control" id="idleads" value="'+data.idleads+'" name="idleads">' +
                '<input type="text" class="form-control" value="'+data.first_name+'" id="leadsFname" name="leadsFname" placeholder="Enter first name">' +
            '</div>' +
            '<div class="col-lg-6">' +
                '<label>Last Name:</label>' +
                '<input type="text" class="form-control" value="'+data.last_name+'" id="leadsLname" name="leadsLname" placeholder="Enter last name">' +
            '</div>' +
        '</div>' +
        '<div class="form-group row">' +
            '<div class="col-lg-6">' +
                '<label>Email:</label>' +
                '<input type="email" class="form-control" value="'+data.email+'" id="leadsEmail" name="leadsEmail" placeholder="Enter email address">' +
            '</div>' +
            '<div class="col-lg-6">' +
                '<label>Phone:</label>' +
                '<input type="number" class="form-control" value="'+data.phone+'" id="leadsPhone" name="leadsPhone" placeholder="Enter phone number">' +
            '</div>' +
       ' </div>' +
        '<div class="form-group row">' +
            '<div class="col-lg-6">' +
                '<label>Job Title:</label>' +
                '<input type="text" class="form-control" value="'+data.job_title+'" id="leadsJtitle" name="leadsJtitle" placeholder="Enter job title">' +
            '</div>' +
            '<div class="col-lg-6">' +
                '<label>Company Name:</label>' +
                '<input type="text" class="form-control" value="'+data.company_name+'" id="leadsComName" name="leadsComName" placeholder="Enter company name">' +
            '</div>' +
        '</div>' +
        '<div class="form-group row">' +
            '<div class="col-lg-6">' +
                '<label>Company Url:</label>' +
                '<input type="text" class="form-control" value="'+data.company_url+'" id="leadsComUrl" name="leadsComUrl" placeholder="Enter company URL">' +
            '</div>' +
            
        '</div>' +
            '<div class="form-group row">' +
            '<div class="col-lg-6">' +
                '<label>Country:</label>' +
                '<div class="kt-input-icon">' +
                    '<select class="form-control" id="leadsCountry" value="'+data.idcountry+'" name="leadsCountry"></select>' +
                    '<span class="kt-input-icon__icon kt-input-icon__icon--right"><span><i class="la la-map-marker"></i></span></span>' +
                '</div>' +
            '</div>' +
            '<div class="col-lg-6">' +
                '<label class="">City:</label>' +
                '<div class="kt-input-icon">' +
                    '<input type="text" class="form-control" value="'+data.city+'" id="leadsCity" name="leadsCity" placeholder="Enter city address">' +
                    '<span class="kt-input-icon__icon kt-input-icon__icon--right"><span><i class="la la-bookmark-o"></i></span></span>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="form-group row">' +
            '<div class="col-lg-6">' +
                '<label>Date Start:</label>' +
                '<input type="date" class="form-control" id="leadsDateStart" name="leadsDateStart" placeholder="Enter date start">' +
            '</div>' +
            '<div class="col-lg-6">' +
                '<label>Date End:</label>' +
                '<input type="date" class="form-control" id="leadsDateEnd" name="leadsDateEnd" placeholder="Enter date end">' +
            '</div>' +
        '</div>' +
    '</div>' +
'</form>';

    swal.fire({
        html: formEdit,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Change Data'
      }).then((result) => {
        if (result.value) {
            submitForm("editLeadsModalForm","add_leads");
        }
      })
      getDataListOptionCountry('list_country','leadsCountry');

}
function editDataPackage(id) {
    $.ajax({
        url: api_url + 'Packages/listbyId/'+id,
        method: 'GET',
        dataType: 'json',
        success:function(data) {
            if(data.success){
                setDataEditPackage(data.row[0]);
            }else{
                swal.fire({
                    type: 'error',
                    title: 'Oops',
                    text: data.msg
                })
            }
        }
    })
}


function openContract(idct) {
    $.ajax({
        url: api_url + 'find_contract_by_id',
        data: {id: idct},
        method: 'GET',
        dataType: 'json',
        success:function(data) {
            if(data.success){
                const el = data.row[0];
                var url = 'wizard/contract.html',
                    title = "Details for Contract " + el.contract_number,
                    modul = 'Contract';
                var step = el.step;
                localStorage.setItem('stepContract',step);
                moveUrl(url, modul, title,function() {
                    if(el.status_contract==1){
                        status = "Leads";
                    }else if(el.status_contract==2){
                        status = "Negotiate";
                    }else if(el.status_contract==3){
                        status = "Contract";
                    }else{
                        status = "Canceled"
                    }
                    setTimeout(function() {
                        $("#leadsName").html(' for ' + el.client_name);
                        // $("#contractDateEnd").val(el.contract_end_date);
                        $("#idpackage").val(el.idpackage);
                        $("#idpartner").val(el.pic_partner);
                        $("#contractValue").val(el.contract_value);
                        $("#contractDateStart").val(datePHPJS("Y-m-d",new Date(el.contract_start_date)));
                        $("#contractDateEnd").val(datePHPJS("Y-m-d", new Date(el.contract_end_date)));
                        $("#contractNumber").html(el.contract_number);
                        $("#clientName").html(el.client_name);
                        $("#fileAttachmentOpen").html('<a href="javascript:void(0)" onclick="openFile(\''+el.file_attach+'\')">'+el.file_attach+'</a>');
                        $("#noteOpen").html(el.note);
                        $("#contractValueOpen").html(replaceDuitTigaDigit(el.contract_value));
                        $("#statusContract").val(status);
                        $("#note").html(el.note);
                        $("#idcontract").val(el.idcontracts);
                        $("#idleads").val(el.id_leads);
                        $("#datesubmit").val(el.created_date);
                        
                        $("#contractNumber2").html(el.contract_number);
                        $("#finalIncome").html(el.final_income);
                        $("#commision2").html(el.commision);
                        $("#clientName2").html(el.client_name);
                        $("#fileAttachmentOpen2").html('<a href="javascript:void(0)" onclick="openFile(\''+el.file_attach+'\')">'+el.file_attach+'</a>');
                        $("#noteOpen2").html(el.note);
                        $("#memberID").html(el.idmembers);
                        $("#contractValueOpen2").html(replaceDuitTigaDigit(el.contract_value));
                    },500);
                },'');
            }else{
                swal.fire({
                    type: 'error',
                    title: 'Oops',
                    text: data.msg
                })
            }
        },
        error:function(xhr) {
            swal.fire({
                type: 'error',
                title: 'Sorry',
                text: xhr.status + ' ' + xhr.statusText
            })
        }
    })
}

function openFile(filename) {
    if(filename!=""){
        swal.fire({
            title: filename,
            imageUrl: api_urlapp + 'data/contract_attachment/'+filename
        })
    }
}

function setDataEditPackage(data) {
    
    var formEdit= '<form class="kt-form kt-form--label-right" id="editPackageModalForm" method="POST" action="javascript:void(0);">' +
            '<div class="kt-portlet__body">' +
                '<div class="form-group row">' +
                    '<div class="col-lg-6">' +
                        '<label>Name Package:</label>' +
                        '<input type="hidden" value="'+data.idpackage+'" class="form-control" id="packId" name="packId">' +
                        '<input type="text" value="'+data.package_name+'" class="form-control" id="packName" name="packName" placeholder="Enter name package">' +
                    '</div>' +
                    '<div class="col-lg-6">' +
                        '<label>Total Employee/User:</label>' +
                        '<input type="text" class="form-control" value="'+data.total_users+'" id="packTotEmpl" name="packTotEmpl" placeholder="Enter total employee/user">' +
                    '</div>' +
                '</div>' +
                '<div class="form-group row">' +
                    '<div class="col-lg-6">' +
                        '<label>Storage:</label>' +
                        '<input type="text" class="form-control" value="'+data.storage+'" id="packStorage" name="packStorage" placeholder="Enter storage">' +
                    '</div>' +
                    '<div class="col-lg-6">' +
                        '<label>Total Course:</label>' +
                        '<input type="number" class="form-control" value="'+data.total_course+'" id="packTotCourse" name="packTotCourse" placeholder="Enter total course">' +
                    '</div>' +
                '</div>' +
                '<div class="form-group row">' +
                    '<div class="col-lg-6">' +
                        '<label>Price/Month:</label>' +
                        '<input type="number" class="form-control" value="'+data.price+'" id="packPriceMonth" name="packPriceMonth" placeholder="Enter Price/Month">' +
                    '</div>' +
                '</div>' +
                '<div class="form-group row">' +
                    '<div class="col-lg-12">' +
                        '<label>Additional Notes:</label>' +
                        '<textarea class="form-control" id="packNote" name="packNote" >'+data.additional_notes+'</textarea>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</form>';
    swal.fire({
        html: formEdit,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Change Data'
    }).then((result) => {
        if (result.value) {
            submitForm("editPackageModalForm","add_package");
        }
    })
}
function submitForm(idform,module) {
    var val = $("#"+idform).serialize();
    val += "&iduser=" + localStorage.getItem('id');
    $.ajax({
        url: api_url + module,
        data: val,
        method: "POST",
        dataType: 'json',
        success:function(dt){
            if(dt.success){
                typeSwal = 'success';
                var url = 'package/list.html';
                var title = "List Package";
                var tit = "Package";
                if(module=="add_leads"){
                    url = "leads/list.html";
                    title = "List Leads";
                    tit = "Leads";
                }else if(module=="update_member"){
                    url = "member/list.html";
                    title = "List Members";
                    tit = "Members";
                    
                }
                $("#"+idform)[0].reset();
                moveUrl(url,tit,title,'',function(){
                    setTimeout(() => {
                        
                        swal.fire({
                            type: typeSwal,
                            title: dt.msg,
                            showCancelButton: false,
                            confirmButtonColor: '#4fa7f3'
                        })
                    }, 200);
                })
            }else{
                typeSwal = 'error';
                swal.fire({
                    type: typeSwal,
                    title: dt.msg,
                    showCancelButton: false,
                    confirmButtonColor: '#4fa7f3'
                })
            }
            

            
        },
        error:function(xhr){
            $("#"+idform)[0].reset();

            swal.fire({
                type: 'error',
                title: xhr.statusText,
                showCancelButton: false,
                confirmButtonColor: '#4fa7f3'
            })
        }
    })
}
function dataTableUsers(drow) {
    // Latest Orders
    var dataJSONArray = [];
    if(drow.length>0){
        dataJSONArray = drow;
        
        var no = 1;
        for(var i in drow){
            const el = drow[i];
            el['no'] = no;
            
            no++;
        }
    }

    var datatable = $('.tbl-dataListUsers').KTDatatable({
        data: {
            type: 'local',
            source: dataJSONArray,
            pageSize: 10,
            saveState: {
                cookie: false,
                webstorage: true
            },
            serverPaging: false,
            serverFiltering: false,
            serverSorting: false
        },

        layout: {
            scroll: true,
            height: 500,
            footer: false
        },

        sortable: true,

        filterable: false,

        pagination: true,

        columns: [{
            field: "no",
            title: "No.",
            width: 25,
            sortable: true,
            textAlign: 'left'
        },{
            field: "user_type",
            title: "User Type",
            sortable: true,
            textAlign: 'left'
        },{
            field: "account_balance",
            title: "Account Balance",
            textAlign: 'left'
        },{
            field: "created_date",
            title: "Active Since",
            sortable: true,
            textAlign: 'left',
            template:function(el){
                return datePHPJS('Y-m-d H:i:s', new Date(el.created_date));
            }
        },{
            field: "last_login",
            title: "Last Seen",
            sortable: true,
            textAlign: 'left'
        },{
            field: "status",
            title: "Status",
            sortable: true,
            template:function(el) {
                if(el.status==1){
                    return '<span class="btn btn-bold btn-sm btn-font-sm btn-label-success">Active</span>';
                } else{
                    return '<span class="btn btn-bold btn-sm btn-font-sm  btn-label-danger">Inactive</span>';
                }
            },
            textAlign: 'left'
        },{
            field: "Actions",
            title: "Actions",
            sortable: false,
            autoHide: false,
            overflow: 'visible',
            template: function (el) {
                return '\
                        <div class="dropdown">\
                            <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown">\
                                <i class="flaticon-more-1"></i>\
                            </a>\
                            <div class="dropdown-menu dropdown-menu-right">\
                                <ul class="kt-nav">\
                                    <li class="kt-nav__item">\
                                        <a href="#" onclick="editDataUsers(\''+el.status+'\')" class="kt-nav__link">\
                                            <i class="kt-nav__link-icon flaticon2-contract"></i>\
                                            <span class="kt-nav__link-text">Edit</span>\
                                        </a>\
                                    </li>\
                                    <li class="kt-nav__item">\
                                        <a href="#" onclick="deleteUsers(\''+el.idusers+'\')" class="kt-nav__link">\
                                            <i class="kt-nav__link-icon flaticon2-trash"></i>\
                                            <span class="kt-nav__link-text">Delete</span>\
                                        </a>\
                                    </li>\
                                </ul>\
                            </div>\
                        </div>\
                    ';
            }
        }]
    });
}

function editDataUsers(id) {
    console.log(id);
    $('#editUserModal').modal('show');
    $('#selectStatus').val(id);
}

function getDataListUsers(module){
    $.ajax({
        url: api_url + module,
        method: 'GET',
        dataType: 'json',
        success:function(data) {
            if(data.success){
                dataTableUsers(data.row);
            }else{
                swal.fire({
                    type: 'error',
                    title: data.msg,
                    showCancelButton: false,
                    confirmButtonColor: '#4fa7f3'
                })
            }
        }
    })
}

function deletePackage(id){
    swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        // icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          $.ajax({
              url: api_url + 'packages/softDelete',
              data: {id:id},
              dataType: 'json',
              method: 'get',
              success:function(dt){
                  if(dt.success){
                    var url = 'package/list.html';
                    var title = "List Package";
                    moveUrl(url,"Package",title,'',function(){
                        swal.fire({
                            title:'Deleted!',
                            text:'Your file has been deleted.',
                            type:'success'
                        })
                    });
                  }else{
                    swal.fire({
                        title:'Oops!',
                        text:dt.msg,
                        type:'error'
                    })
                  }
              },
              error:function(xhr) {
                swal.fire(
                    'Oops!',
                    xhr.status + ' ' + xhr.statusText,
                    'error'
                  );
              }
          })
        }else{
            return;
        }
      })
}
function deleteUsers(id){
    swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        // icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          $.ajax({
              url: api_url + 'users/softDelete',
              data: {id:id},
              dataType: 'json',
              method: 'get',
              success:function(dt){
                  if(dt.success){
                    var url = 'user/list.html';
                    var title = "List Users";
                    moveUrl(url,"Users",title,'',function(){
                        swal.fire({
                            title:'Deleted!',
                            text:'User has been deleted.',
                            type:'success'
                        })
                    });
                  }else{
                    swal.fire({
                        title:'Oops!',
                        text:dt.msg,
                        type:'error'
                    })
                  }
              },
              error:function(xhr) {
                swal.fire(
                    'Oops!',
                    xhr.status + ' ' + xhr.statusText,
                    'error'
                  );
              }
          })
        }else{
            return;
        }
      })
}


function deleteMember(id){
    swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        // icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          $.ajax({
              url: api_url + 'members/softDelete',
              data: {id:id},
              dataType: 'json',
              method: 'get',
              success:function(dt){
                  if(dt.success){
                    var url = 'member/list.html';
                    var title = "List Members";
                    moveUrl(url,"Members",title,'',function(){
                        swal.fire({
                            title:'Deleted!',
                            text:'Member has been deleted.',
                            type:'success'
                        })
                    });
                  }else{
                    swal.fire({
                        title:'Oops!',
                        text:dt.msg,
                        type:'error'
                    })
                  }
              },
              error:function(xhr) {
                swal.fire(
                    'Oops!',
                    xhr.status + ' ' + xhr.statusText,
                    'error'
                  );
              }
          })
        }else{
            return;
        }
      })
}


function dataTablePackage(drow) {
    // Latest Orders
    var dataJSONArray = [];
    if(drow.length>0){
        dataJSONArray = drow;
        
        var no = 1;
        for(var i in drow){
            const el = drow[i];
            el['no'] = no;
            
            no++;
        }
    }

    var datatable = $('.tbl-dataListPackage').KTDatatable({
        data: {
            type: 'local',
            source: dataJSONArray,
            pageSize: 10,
            saveState: {
                cookie: false,
                webstorage: true
            },
            serverPaging: false,
            serverFiltering: false,
            serverSorting: false
        },

        layout: {
            scroll: true,
            height: 500,
            footer: false
        },

        sortable: true,

        filterable: false,

        pagination: true,
        columns: [{
            field: "no",
            title: "No.",
            width: 25,
            sortable: true,
            textAlign: 'left'
        },{
            field: "package_name",
            title: "Name Package",
            sortable: true,
            textAlign: 'left'
        },{
            field: "total_users",
            title: "Total Users",
            textAlign: 'left'
        },{
            field: "storage",
            title: "Storage",
            textAlign: 'left'
        },{
            field: "total_course",
            title: "Total Course",
            sortable: true,
            textAlign: 'left'
        },{
            field: "price",
            title: "Price",
            sortable: true,
            textAlign: 'left'
        },{
            field: "additional_notes",
            title: "Additional Notes",
            sortable: true,
            textAlign: 'left'
        },{
            field: "Actions",
            title: "Actions",
            sortable: false,
            autoHide: false,
            overflow: 'visible',
            template: function (el) {
                return '\
                        <div class="dropdown">\
                            <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown">\
                                <i class="flaticon-more-1"></i>\
                            </a>\
                            <div class="dropdown-menu dropdown-menu-right">\
                                <ul class="kt-nav">\
                                    <li class="kt-nav__item">\
                                        <a href="#" onclick="editDataPackage(\''+el.idpackage+'\')" class="kt-nav__link">\
                                            <i class="kt-nav__link-icon flaticon2-contract"></i>\
                                            <span class="kt-nav__link-text">Edit</span>\
                                        </a>\
                                    </li>\
                                    <li class="kt-nav__item">\
                                        <a href="#" onclick="deletePackage(\''+el.idpackage+'\')" class="kt-nav__link">\
                                            <i class="kt-nav__link-icon flaticon2-trash"></i>\
                                            <span class="kt-nav__link-text">Delete</span>\
                                        </a>\
                                    </li>\
                                </ul>\
                            </div>\
                        </div>\
                    ';
            }
        }]
    });
}

function getDataListMember(module){
    $.ajax({
        url: api_url + module,
        method: 'GET',
        dataType: 'json',
        success:function(data) {
            if(data.success){
                dataTableMember(data.row);
            }else{
                swal.fire({
                    type: 'error',
                    title: data.msg,
                    showCancelButton: false,
                    confirmButtonColor: '#4fa7f3'
                })
            }
        }
    })
}

function dataTableMember(drow) {
    // Latest Orders
    var dataJSONArray = [];
    if(drow.length>0){
        dataJSONArray = drow;
        
        var no = 1;
        for(var i in drow){
            const el = drow[i];
            el['no'] = no;
            
            no++;
        }
    }

    var datatable = $('.tbl-dataListMember').KTDatatable({
        data: {
            type: 'local',
            source: dataJSONArray,
            pageSize: 10,
            saveState: {
                cookie: false,
                webstorage: true
            },
            serverPaging: false,
            serverFiltering: false,
            serverSorting: false
        },

        layout: {
            scroll: true,
            height: 500,
            footer: false
        },

        sortable: true,

        filterable: false,

        pagination: true,
        columns: [{
            field: "no",
            title: "No.",
            width: 25,
            sortable: true,
            textAlign: 'left'
        },{
            field: "el.first_name",
            title: "Member Name",
            sortable: true,
            textAlign: 'left',
            template:function(el){
                return el.first_name + " " + el.last_name + " - " + el.company_name; 
            }
        },{
            field: "contract_start_date",
            title: "Date Contract",
            textAlign: 'left'
        },{
            field: "contract_end_date",
            title: "Date to End Contract",
            textAlign: 'left'
        },{
            field: "priority",
            title: "Priority",
            sortable: true,
            textAlign: 'left'
        },{
            field: "status_activated",
            title: "Status",
            sortable: true,
            template: function(el){
                var ret = "";
                if(el.status_activated==1){
                    return ret = "<span style='width:100px;float:left' class='btn btn-bold btn-sm btn-font-sm btn-label-success'>Member Active</span>";
                }else{
                    return ret = "<span style='width:100px;float:left' class='btn btn-bold btn-sm btn-font-sm btn-label-danger'>Waiting to Activated</span>";
                }
            }
        },{
            field: "package_name",
            title: "Package",
            sortable: true,
            textAlign: 'left'
        },{
            field: "contract_value",
            title: "Value Contract",
            sortable: true,
            textAlign: 'left',
            // template:function(el){
            //     return replaceDuitTigaDigit(parseFloat(el.contract_value));
            // }
        },{
            field: "partnerUser",
            title: "PIC Partner",
            sortable: true,
            textAlign: 'left'
        },{
            field: "supportUser",
            title: "PIC Support",
            sortable: true,
            textAlign: 'left'
        },{
            field: "Actions",
            title: "Actions",
            sortable: false,
            autoHide: false,
            overflow: 'visible',
            template: function (el) {
                return '\
                        <div class="dropdown">\
                            <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown">\
                                <i class="flaticon-more-1"></i>\
                            </a>\
                            <div class="dropdown-menu dropdown-menu-right">\
                                <ul class="kt-nav">\
                                    <li class="kt-nav__item">\
                                        <a href="#" onclick="editDataMember(\''+el.idmembers+'\')" class="kt-nav__link">\
                                            <i class="kt-nav__link-icon flaticon2-contract"></i>\
                                            <span class="kt-nav__link-text">Edit</span>\
                                        </a>\
                                    </li>\
                                    <li class="kt-nav__item">\
                                        <a href="#" onclick="deleteMember(\''+el.idmembers+'\')" class="kt-nav__link">\
                                            <i class="kt-nav__link-icon flaticon2-trash"></i>\
                                            <span class="kt-nav__link-text">Delete</span>\
                                        </a>\
                                    </li>\
                                </ul>\
                            </div>\
                        </div>\
                    ';
            }
        }]
    });
}

function editDataMember(data) {
    $('#editMemberModal').modal('show');
    getDataListOptionPackage('list_package','memberPackage');
    setTimeout(() => {
        $.ajax({
            url: api_url + 'find_member_by_id/' + data,
            method: 'get',
            dataType: 'json', 
            success:function(dt) {
                if(dt.success){
                    const el = dt.row[0];
                    $("#memberCompName").val(el.company_name);
                    $("#idLeads").val(el.idleads);
                    $("#idMember").val(el.idmembers);
                    $("#memberfName").val(el.first_name);
                    $("#memberlName").val(el.last_name);
                    $("#memberPackage").val(el.idpackage);
                    $("#memberConStart").val(datePHPJS('Y-m-d',new Date(el.contract_start_date)));
                    $("#memberConEnd").val(datePHPJS('Y-m-d',new Date(el.contract_end_date)));
    
                    var prior ='',
                        priority = el.priority;
                    if(priority==1){
                        prior = "High";
                    }
                    
                    
                    $("#memberPriority").val(prior);
                    $("#memberContract").val(el.contract_number).attr('disabled',true);
                    $("#memberPICS").val(el.supportUser).attr('disabled',true);
                    $("#memberPICP").val(el.partnerUser).attr('disabled',true);
                    $("#contractValue").val(el.contract_value).attr('disabled',true);
                }else{
                    
                }
            }
        })
    }, 200);
    
}