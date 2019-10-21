var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.findInternal = function (a, b, c) {
	a instanceof String && (a = String(a));
	for (var d = a.length, e = 0; e < d; e++) {
		var f = a[e];
		if (b.call(c, f, e, a)) return {
			i: e,
			v: f
		}
	}
	return {
		i: -1,
		v: void 0
	}
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function (a, b, c) {
	a != Array.prototype && a != Object.prototype && (a[b] = c.value)
};
$jscomp.getGlobal = function (a) {
	return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function (a, b, c, d) {
	if (b) {
		c = $jscomp.global;
		a = a.split(".");
		for (d = 0; d < a.length - 1; d++) {
			var e = a[d];
			e in c || (c[e] = {});
			c = c[e]
		}
		a = a[a.length - 1];
		d = c[a];
		b = b(d);
		b != d && null != b && $jscomp.defineProperty(c, a, {
			configurable: !0,
			writable: !0,
			value: b
		})
	}
};
$jscomp.polyfill("Array.prototype.find", function (a) {
	return a ? a : function (a, c) {
		return $jscomp.findInternal(this, a, c).v
	}
}, "es6", "es3");
servertype = 1;
gxwebver = "1.44.0.0";

function str_pad_left(a, b, c) {
	for (c = c.toString(); c.length < a;) c = b + c;
	return c
}

function getPosition(a, b, c) {
	return a.split(b, c).join(b).length
}

function checkPageAccess(a) {
	a = a.toLowerCase();
	if (-1 < $.inArray(a, ["index", "login"])) return !0;
	"wizard" == a ? (a = $(location).attr("href"), a = -1 < a.indexOf("Expanders") ? "wizardexpander" : -1 < a.indexOf("AccessControl") ? "wizardaccesscontrol" : -1 < a.indexOf("Security") ? "wizardsecurity" : "wizarduser") : "usersearch" == a ? a = "user" : "outputexpander" == a ? a = "pgmexpander" : "settings" == a ? a = "controllersettings" : "license" == a && (a = "licensing");
	runQuery("PRT_CTRL_DIN_ISAPI.dll", "Command&Type=Session&SubType=CheckAccess&Page=" + a, !0, !0).done(function (a) {
		a = decryptAES(a);
		if ("OK" == a) return !0;
		window.location = "index.htm"
	})
}

function openPage(a) {
	discardChanges(function (b) {
		b && (window.location = a)
	});
	return !1
}

function buildMenu(a) {
	1 == servertype && (checkPageAccess(a), $("#MHUsernameStr").html(getCookie("WXUsername")));
	$("ul.dropdown li").hover(function () {
		$(this).addClass("hover")
	}, function () {
		$(this).removeClass("hover")
	});
	$("ul.dropdown li ul li:has(ul)").find("a:first").before("<img src='images/arrow-right.gif' class='submenu'>");
	if (0 == servertype) {
		$("ul.dropdown .ControllerOption").remove();
		$("ul.dropdown > li").removeClass("hiddentab");
		1 == getCookie("WXMuster") ? $("#mgxmusterreport").removeClass("hiddentab") :
			$("#mgxmusterreport").remove();
		1 == getCookie("WXAttendance") ? $("#mgxattendancereport").removeClass("hiddentab") : $("#mgxattendancereport").remove();
		var b = runQuery("ajax_request.php", "type=role", !0, !0);
		b.done(function (b) {
			b = decryptAES(b);
			if ("<no response>" != b) {
				b = b.split("&");
				for (var c = 0; c < b.length; c++) {
					var e = b[c].split("=");
					"2" == e[1] && ($("#m" + e[0]).remove(), e[0] == a.toLowerCase() && (window.location = "index.php"));
					e[0] == a.toLowerCase() && ("1" == e[1] ? ($("#detaillist form input").attr("disabled", "disabled"),
						$("#detaillist form select").attr("disabled", "disabled"), $("a[id$=Link]").parent().addClass("disabled"), $("#alink").remove(), $("#dlink").remove(), $("#slink").remove(), $("#clink").remove(), sessionStorage.setItem("readonly", "true")) : sessionStorage.setItem("readonly", "false"));
					"undefined" !== typeof site && ("allsites" == e[0] && "true" == e[1] ? site.push("%") : "siteid" == e[0].substr(0, 6) && site.push(e[1]))
				}
			}
			$("ul.dropdown > li ul").each(function () {
				0 == $(this).children("li").length && $(this).parent("li").remove()
			})
		})
	} else $("ul.dropdown .ServerOption").remove(),
		$("ul.dropdown li ul li").addClass("hiddentab"), b = runQuery("PRT_CTRL_DIN_ISAPI.dll", "Command&Type=Session&SubType=GetRoleDetails", !0, !0), b.done(function (a) {
			a = decryptAES(a);
			if ("undefined" !== typeof a) {
				a = a.split("&");
				for (var b = 0; b < a.length; b++) $("#m" + a[b]).removeClass("hiddentab"), $("#m" + a[b]).parent().removeClass("hiddentab"), $("#m" + a[b]).parent().parent().removeClass("hiddentab"), "user" == a[b] && ($("#musersearch").removeClass("hiddentab"), $("#musersearch").parent().removeClass("hiddentab"));
				if (-1 < $.inArray("eventreport",
						a) || -1 < $.inArray("centralreport", a)) $("#mmonitoringreport").removeClass("hiddentab"), $("#mmonitoringreport").parent().removeClass("hiddentab")
			}
		}), sessionStorage.setItem("readonly", "false")
}

function logout() {
	var a = 0 == servertype ? "login.php?logout" : "login.htm?logout";
	if ($.active) $(document).one("ajaxStop", function () {
		window.location = a + "&" + Math.random().toString(16).substring(2, 8).toLowerCase()
	});
	else window.location = a + "&" + Math.random().toString(16).substring(2, 8).toLowerCase();
	return !1
}

function isAntiPassBackEvent(a) {
	return -1 < ["789", "790", "791", "792", "823"].indexOf(a || 0) ? !0 : !1
}

function resetAntiPassBackEvent(a, b, c) {
	a = a || null;
	b = b || null;
	c = c || null;
	a && b && c && ($("#messagefg > div > div").css("padding", "0 15px 5px 25px"), showMessage("<h1>" + langtag.ResetAntipassbackTitle + "</h1><p>" + langtag.ResetAntipassbackMessage + " " + a + "</p> <p class='userapprovebuttons'><span id='exporteventalert'></span><input type='button' value='" + langtag.TagReset + "' onClick='sendCommand(\"ResetAntipassback\"," + b + ", 0 ," + c + "," + b + ")& stopAlert()'><input type='button' value='" + langtag.TagCancel + "' onClick='stopAlert();'></p>"));
	return !1
}

function removeDiacritics(a) {
	for (var b = {
			"\u24b6": "A",
			"\uff21": "A",
			"\u00c0": "A",
			"\u00c1": "A",
			"\u00c2": "A",
			"\u1ea6": "A",
			"\u1ea4": "A",
			"\u1eaa": "A",
			"\u1ea8": "A",
			"\u00c3": "A",
			"\u0100": "A",
			"\u0102": "A",
			"\u1eb0": "A",
			"\u1eae": "A",
			"\u1eb4": "A",
			"\u1eb2": "A",
			"\u0226": "A",
			"\u01e0": "A",
			"\u00c4": "A",
			"\u01de": "A",
			"\u1ea2": "A",
			"\u00c5": "A",
			"\u01fa": "A",
			"\u01cd": "A",
			"\u0200": "A",
			"\u0202": "A",
			"\u1ea0": "A",
			"\u1eac": "A",
			"\u1eb6": "A",
			"\u1e00": "A",
			"\u0104": "A",
			"\u023a": "A",
			"\u2c6f": "A",
			"\ua732": "AA",
			"\u00c6": "AE",
			"\u01fc": "AE",
			"\u01e2": "AE",
			"\ua734": "AO",
			"\ua736": "AU",
			"\ua738": "AV",
			"\ua73a": "AV",
			"\ua73c": "AY",
			"\u24b7": "B",
			"\uff22": "B",
			"\u1e02": "B",
			"\u1e04": "B",
			"\u1e06": "B",
			"\u0243": "B",
			"\u0182": "B",
			"\u0181": "B",
			"\u24b8": "C",
			"\uff23": "C",
			"\u0106": "C",
			"\u0108": "C",
			"\u010a": "C",
			"\u010c": "C",
			"\u00c7": "C",
			"\u1e08": "C",
			"\u0187": "C",
			"\u023b": "C",
			"\ua73e": "C",
			"\u24b9": "D",
			"\uff24": "D",
			"\u1e0a": "D",
			"\u010e": "D",
			"\u1e0c": "D",
			"\u1e10": "D",
			"\u1e12": "D",
			"\u1e0e": "D",
			"\u0110": "D",
			"\u018b": "D",
			"\u018a": "D",
			"\u0189": "D",
			"\ua779": "D",
			"\u01f1": "DZ",
			"\u01c4": "DZ",
			"\u01f2": "Dz",
			"\u01c5": "Dz",
			"\u24ba": "E",
			"\uff25": "E",
			"\u00c8": "E",
			"\u00c9": "E",
			"\u00ca": "E",
			"\u1ec0": "E",
			"\u1ebe": "E",
			"\u1ec4": "E",
			"\u1ec2": "E",
			"\u1ebc": "E",
			"\u0112": "E",
			"\u1e14": "E",
			"\u1e16": "E",
			"\u0114": "E",
			"\u0116": "E",
			"\u00cb": "E",
			"\u1eba": "E",
			"\u011a": "E",
			"\u0204": "E",
			"\u0206": "E",
			"\u1eb8": "E",
			"\u1ec6": "E",
			"\u0228": "E",
			"\u1e1c": "E",
			"\u0118": "E",
			"\u1e18": "E",
			"\u1e1a": "E",
			"\u0190": "E",
			"\u018e": "E",
			"\u24bb": "F",
			"\uff26": "F",
			"\u1e1e": "F",
			"\u0191": "F",
			"\ua77b": "F",
			"\u24bc": "G",
			"\uff27": "G",
			"\u01f4": "G",
			"\u011c": "G",
			"\u1e20": "G",
			"\u011e": "G",
			"\u0120": "G",
			"\u01e6": "G",
			"\u0122": "G",
			"\u01e4": "G",
			"\u0193": "G",
			"\ua7a0": "G",
			"\ua77d": "G",
			"\ua77e": "G",
			"\u24bd": "H",
			"\uff28": "H",
			"\u0124": "H",
			"\u1e22": "H",
			"\u1e26": "H",
			"\u021e": "H",
			"\u1e24": "H",
			"\u1e28": "H",
			"\u1e2a": "H",
			"\u0126": "H",
			"\u2c67": "H",
			"\u2c75": "H",
			"\ua78d": "H",
			"\u24be": "I",
			"\uff29": "I",
			"\u00cc": "I",
			"\u00cd": "I",
			"\u00ce": "I",
			"\u0128": "I",
			"\u012a": "I",
			"\u012c": "I",
			"\u0130": "I",
			"\u00cf": "I",
			"\u1e2e": "I",
			"\u1ec8": "I",
			"\u01cf": "I",
			"\u0208": "I",
			"\u020a": "I",
			"\u1eca": "I",
			"\u012e": "I",
			"\u1e2c": "I",
			"\u0197": "I",
			"\u24bf": "J",
			"\uff2a": "J",
			"\u0134": "J",
			"\u0248": "J",
			"\u24c0": "K",
			"\uff2b": "K",
			"\u1e30": "K",
			"\u01e8": "K",
			"\u1e32": "K",
			"\u0136": "K",
			"\u1e34": "K",
			"\u0198": "K",
			"\u2c69": "K",
			"\ua740": "K",
			"\ua742": "K",
			"\ua744": "K",
			"\ua7a2": "K",
			"\u24c1": "L",
			"\uff2c": "L",
			"\u013f": "L",
			"\u0139": "L",
			"\u013d": "L",
			"\u1e36": "L",
			"\u1e38": "L",
			"\u013b": "L",
			"\u1e3c": "L",
			"\u1e3a": "L",
			"\u0141": "L",
			"\u023d": "L",
			"\u2c62": "L",
			"\u2c60": "L",
			"\ua748": "L",
			"\ua746": "L",
			"\ua780": "L",
			"\u01c7": "LJ",
			"\u01c8": "Lj",
			"\u24c2": "M",
			"\uff2d": "M",
			"\u1e3e": "M",
			"\u1e40": "M",
			"\u1e42": "M",
			"\u2c6e": "M",
			"\u019c": "M",
			"\u24c3": "N",
			"\uff2e": "N",
			"\u01f8": "N",
			"\u0143": "N",
			"\u00d1": "N",
			"\u1e44": "N",
			"\u0147": "N",
			"\u1e46": "N",
			"\u0145": "N",
			"\u1e4a": "N",
			"\u1e48": "N",
			"\u0220": "N",
			"\u019d": "N",
			"\ua790": "N",
			"\ua7a4": "N",
			"\u01ca": "NJ",
			"\u01cb": "Nj",
			"\u24c4": "O",
			"\uff2f": "O",
			"\u00d2": "O",
			"\u00d3": "O",
			"\u00d4": "O",
			"\u1ed2": "O",
			"\u1ed0": "O",
			"\u1ed6": "O",
			"\u1ed4": "O",
			"\u00d5": "O",
			"\u1e4c": "O",
			"\u022c": "O",
			"\u1e4e": "O",
			"\u014c": "O",
			"\u1e50": "O",
			"\u1e52": "O",
			"\u014e": "O",
			"\u022e": "O",
			"\u0230": "O",
			"\u00d6": "O",
			"\u022a": "O",
			"\u1ece": "O",
			"\u0150": "O",
			"\u01d1": "O",
			"\u020c": "O",
			"\u020e": "O",
			"\u01a0": "O",
			"\u1edc": "O",
			"\u1eda": "O",
			"\u1ee0": "O",
			"\u1ede": "O",
			"\u1ee2": "O",
			"\u1ecc": "O",
			"\u1ed8": "O",
			"\u01ea": "O",
			"\u01ec": "O",
			"\u00d8": "O",
			"\u01fe": "O",
			"\u0186": "O",
			"\u019f": "O",
			"\ua74a": "O",
			"\ua74c": "O",
			"\u0152": "OE",
			"\u01a2": "OI",
			"\ua74e": "OO",
			"\u0222": "OU",
			"\u24c5": "P",
			"\uff30": "P",
			"\u1e54": "P",
			"\u1e56": "P",
			"\u01a4": "P",
			"\u2c63": "P",
			"\ua750": "P",
			"\ua752": "P",
			"\ua754": "P",
			"\u24c6": "Q",
			"\uff31": "Q",
			"\ua756": "Q",
			"\ua758": "Q",
			"\u024a": "Q",
			"\u24c7": "R",
			"\uff32": "R",
			"\u0154": "R",
			"\u1e58": "R",
			"\u0158": "R",
			"\u0210": "R",
			"\u0212": "R",
			"\u1e5a": "R",
			"\u1e5c": "R",
			"\u0156": "R",
			"\u1e5e": "R",
			"\u024c": "R",
			"\u2c64": "R",
			"\ua75a": "R",
			"\ua7a6": "R",
			"\ua782": "R",
			"\u24c8": "S",
			"\uff33": "S",
			"\u015a": "S",
			"\u1e64": "S",
			"\u015c": "S",
			"\u1e60": "S",
			"\u0160": "S",
			"\u1e66": "S",
			"\u1e62": "S",
			"\u1e68": "S",
			"\u0218": "S",
			"\u015e": "S",
			"\u2c7e": "S",
			"\ua7a8": "S",
			"\ua784": "S",
			"\u1e9e": "SS",
			"\u24c9": "T",
			"\uff34": "T",
			"\u1e6a": "T",
			"\u0164": "T",
			"\u1e6c": "T",
			"\u021a": "T",
			"\u0162": "T",
			"\u1e70": "T",
			"\u1e6e": "T",
			"\u0166": "T",
			"\u01ac": "T",
			"\u01ae": "T",
			"\u023e": "T",
			"\ua786": "T",
			"\ua728": "TZ",
			"\u24ca": "U",
			"\uff35": "U",
			"\u00d9": "U",
			"\u00da": "U",
			"\u00db": "U",
			"\u0168": "U",
			"\u1e78": "U",
			"\u016a": "U",
			"\u1e7a": "U",
			"\u016c": "U",
			"\u00dc": "U",
			"\u01db": "U",
			"\u01d7": "U",
			"\u01d5": "U",
			"\u01d9": "U",
			"\u1ee6": "U",
			"\u016e": "U",
			"\u0170": "U",
			"\u01d3": "U",
			"\u0214": "U",
			"\u0216": "U",
			"\u01af": "U",
			"\u1eea": "U",
			"\u1ee8": "U",
			"\u1eee": "U",
			"\u1eec": "U",
			"\u1ef0": "U",
			"\u1ee4": "U",
			"\u1e72": "U",
			"\u0172": "U",
			"\u1e76": "U",
			"\u1e74": "U",
			"\u0244": "U",
			"\u24cb": "V",
			"\uff36": "V",
			"\u1e7c": "V",
			"\u1e7e": "V",
			"\u01b2": "V",
			"\ua75e": "V",
			"\u0245": "V",
			"\ua760": "VY",
			"\u24cc": "W",
			"\uff37": "W",
			"\u1e80": "W",
			"\u1e82": "W",
			"\u0174": "W",
			"\u1e86": "W",
			"\u1e84": "W",
			"\u1e88": "W",
			"\u2c72": "W",
			"\u24cd": "X",
			"\uff38": "X",
			"\u1e8a": "X",
			"\u1e8c": "X",
			"\u24ce": "Y",
			"\uff39": "Y",
			"\u1ef2": "Y",
			"\u00dd": "Y",
			"\u0176": "Y",
			"\u1ef8": "Y",
			"\u0232": "Y",
			"\u1e8e": "Y",
			"\u0178": "Y",
			"\u1ef6": "Y",
			"\u1ef4": "Y",
			"\u01b3": "Y",
			"\u024e": "Y",
			"\u1efe": "Y",
			"\u24cf": "Z",
			"\uff3a": "Z",
			"\u0179": "Z",
			"\u1e90": "Z",
			"\u017b": "Z",
			"\u017d": "Z",
			"\u1e92": "Z",
			"\u1e94": "Z",
			"\u01b5": "Z",
			"\u0224": "Z",
			"\u2c7f": "Z",
			"\u2c6b": "Z",
			"\ua762": "Z",
			"\u24d0": "a",
			"\uff41": "a",
			"\u1e9a": "a",
			"\u00e0": "a",
			"\u00e1": "a",
			"\u00e2": "a",
			"\u1ea7": "a",
			"\u1ea5": "a",
			"\u1eab": "a",
			"\u1ea9": "a",
			"\u00e3": "a",
			"\u0101": "a",
			"\u0103": "a",
			"\u1eb1": "a",
			"\u1eaf": "a",
			"\u1eb5": "a",
			"\u1eb3": "a",
			"\u0227": "a",
			"\u01e1": "a",
			"\u00e4": "a",
			"\u01df": "a",
			"\u1ea3": "a",
			"\u00e5": "a",
			"\u01fb": "a",
			"\u01ce": "a",
			"\u0201": "a",
			"\u0203": "a",
			"\u1ea1": "a",
			"\u1ead": "a",
			"\u1eb7": "a",
			"\u1e01": "a",
			"\u0105": "a",
			"\u2c65": "a",
			"\u0250": "a",
			"\ua733": "aa",
			"\u00e6": "ae",
			"\u01fd": "ae",
			"\u01e3": "ae",
			"\ua735": "ao",
			"\ua737": "au",
			"\ua739": "av",
			"\ua73b": "av",
			"\ua73d": "ay",
			"\u24d1": "b",
			"\uff42": "b",
			"\u1e03": "b",
			"\u1e05": "b",
			"\u1e07": "b",
			"\u0180": "b",
			"\u0183": "b",
			"\u0253": "b",
			"\u24d2": "c",
			"\uff43": "c",
			"\u0107": "c",
			"\u0109": "c",
			"\u010b": "c",
			"\u010d": "c",
			"\u00e7": "c",
			"\u1e09": "c",
			"\u0188": "c",
			"\u023c": "c",
			"\ua73f": "c",
			"\u2184": "c",
			"\u24d3": "d",
			"\uff44": "d",
			"\u1e0b": "d",
			"\u010f": "d",
			"\u1e0d": "d",
			"\u1e11": "d",
			"\u1e13": "d",
			"\u1e0f": "d",
			"\u0111": "d",
			"\u018c": "d",
			"\u0256": "d",
			"\u0257": "d",
			"\ua77a": "d",
			"\u01f3": "dz",
			"\u01c6": "dz",
			"\u24d4": "e",
			"\uff45": "e",
			"\u00e8": "e",
			"\u00e9": "e",
			"\u00ea": "e",
			"\u1ec1": "e",
			"\u1ebf": "e",
			"\u1ec5": "e",
			"\u1ec3": "e",
			"\u1ebd": "e",
			"\u0113": "e",
			"\u1e15": "e",
			"\u1e17": "e",
			"\u0115": "e",
			"\u0117": "e",
			"\u00eb": "e",
			"\u1ebb": "e",
			"\u011b": "e",
			"\u0205": "e",
			"\u0207": "e",
			"\u1eb9": "e",
			"\u1ec7": "e",
			"\u0229": "e",
			"\u1e1d": "e",
			"\u0119": "e",
			"\u1e19": "e",
			"\u1e1b": "e",
			"\u0247": "e",
			"\u025b": "e",
			"\u01dd": "e",
			"\u24d5": "f",
			"\uff46": "f",
			"\u1e1f": "f",
			"\u0192": "f",
			"\ua77c": "f",
			"\u24d6": "g",
			"\uff47": "g",
			"\u01f5": "g",
			"\u011d": "g",
			"\u1e21": "g",
			"\u011f": "g",
			"\u0121": "g",
			"\u01e7": "g",
			"\u0123": "g",
			"\u01e5": "g",
			"\u0260": "g",
			"\ua7a1": "g",
			"\u1d79": "g",
			"\ua77f": "g",
			"\u24d7": "h",
			"\uff48": "h",
			"\u0125": "h",
			"\u1e23": "h",
			"\u1e27": "h",
			"\u021f": "h",
			"\u1e25": "h",
			"\u1e29": "h",
			"\u1e2b": "h",
			"\u1e96": "h",
			"\u0127": "h",
			"\u2c68": "h",
			"\u2c76": "h",
			"\u0265": "h",
			"\u0195": "hv",
			"\u24d8": "i",
			"\uff49": "i",
			"\u00ec": "i",
			"\u00ed": "i",
			"\u00ee": "i",
			"\u0129": "i",
			"\u012b": "i",
			"\u012d": "i",
			"\u00ef": "i",
			"\u1e2f": "i",
			"\u1ec9": "i",
			"\u01d0": "i",
			"\u0209": "i",
			"\u020b": "i",
			"\u1ecb": "i",
			"\u012f": "i",
			"\u1e2d": "i",
			"\u0268": "i",
			"\u0131": "i",
			"\u24d9": "j",
			"\uff4a": "j",
			"\u0135": "j",
			"\u01f0": "j",
			"\u0249": "j",
			"\u24da": "k",
			"\uff4b": "k",
			"\u1e31": "k",
			"\u01e9": "k",
			"\u1e33": "k",
			"\u0137": "k",
			"\u1e35": "k",
			"\u0199": "k",
			"\u2c6a": "k",
			"\ua741": "k",
			"\ua743": "k",
			"\ua745": "k",
			"\ua7a3": "k",
			"\u24db": "l",
			"\uff4c": "l",
			"\u0140": "l",
			"\u013a": "l",
			"\u013e": "l",
			"\u1e37": "l",
			"\u1e39": "l",
			"\u013c": "l",
			"\u1e3d": "l",
			"\u1e3b": "l",
			"\u0142": "l",
			"\u019a": "l",
			"\u026b": "l",
			"\u2c61": "l",
			"\ua749": "l",
			"\ua781": "l",
			"\ua747": "l",
			"\u01c9": "lj",
			"\u24dc": "m",
			"\uff4d": "m",
			"\u1e3f": "m",
			"\u1e41": "m",
			"\u1e43": "m",
			"\u0271": "m",
			"\u026f": "m",
			"\u24dd": "n",
			"\uff4e": "n",
			"\u01f9": "n",
			"\u0144": "n",
			"\u00f1": "n",
			"\u1e45": "n",
			"\u0148": "n",
			"\u1e47": "n",
			"\u0146": "n",
			"\u1e4b": "n",
			"\u1e49": "n",
			"\u019e": "n",
			"\u0272": "n",
			"\u0149": "n",
			"\ua791": "n",
			"\ua7a5": "n",
			"\u01cc": "nj",
			"\u24de": "o",
			"\uff4f": "o",
			"\u00f2": "o",
			"\u00f3": "o",
			"\u00f4": "o",
			"\u1ed3": "o",
			"\u1ed1": "o",
			"\u1ed7": "o",
			"\u1ed5": "o",
			"\u00f5": "o",
			"\u1e4d": "o",
			"\u022d": "o",
			"\u1e4f": "o",
			"\u014d": "o",
			"\u1e51": "o",
			"\u1e53": "o",
			"\u014f": "o",
			"\u022f": "o",
			"\u0231": "o",
			"\u00f6": "o",
			"\u022b": "o",
			"\u1ecf": "o",
			"\u0151": "o",
			"\u01d2": "o",
			"\u020d": "o",
			"\u020f": "o",
			"\u01a1": "o",
			"\u1edd": "o",
			"\u1edb": "o",
			"\u1ee1": "o",
			"\u1edf": "o",
			"\u1ee3": "o",
			"\u1ecd": "o",
			"\u1ed9": "o",
			"\u01eb": "o",
			"\u01ed": "o",
			"\u00f8": "o",
			"\u01ff": "o",
			"\u0254": "o",
			"\ua74b": "o",
			"\ua74d": "o",
			"\u0275": "o",
			"\u0153": "oe",
			"\u0276": "oe",
			"\u01a3": "oi",
			"\u0223": "ou",
			"\ua74f": "oo",
			"\u24df": "p",
			"\uff50": "p",
			"\u1e55": "p",
			"\u1e57": "p",
			"\u01a5": "p",
			"\u1d7d": "p",
			"\ua751": "p",
			"\ua753": "p",
			"\ua755": "p",
			"\u24e0": "q",
			"\uff51": "q",
			"\u024b": "q",
			"\ua757": "q",
			"\ua759": "q",
			"\u24e1": "r",
			"\uff52": "r",
			"\u0155": "r",
			"\u1e59": "r",
			"\u0159": "r",
			"\u0211": "r",
			"\u0213": "r",
			"\u1e5b": "r",
			"\u1e5d": "r",
			"\u0157": "r",
			"\u1e5f": "r",
			"\u024d": "r",
			"\u027d": "r",
			"\ua75b": "r",
			"\ua7a7": "r",
			"\ua783": "r",
			"\u24e2": "s",
			"\uff53": "s",
			"\u015b": "s",
			"\u1e65": "s",
			"\u015d": "s",
			"\u1e61": "s",
			"\u0161": "s",
			"\u1e67": "s",
			"\u1e63": "s",
			"\u1e69": "s",
			"\u0219": "s",
			"\u015f": "s",
			"\u023f": "s",
			"\ua7a9": "s",
			"\ua785": "s",
			"\u017f": "s",
			"\u1e9b": "s",
			"\u00df": "ss",
			"\u24e3": "t",
			"\uff54": "t",
			"\u1e6b": "t",
			"\u1e97": "t",
			"\u0165": "t",
			"\u1e6d": "t",
			"\u021b": "t",
			"\u0163": "t",
			"\u1e71": "t",
			"\u1e6f": "t",
			"\u0167": "t",
			"\u01ad": "t",
			"\u0288": "t",
			"\u2c66": "t",
			"\ua787": "t",
			"\ua729": "tz",
			"\u24e4": "u",
			"\uff55": "u",
			"\u00f9": "u",
			"\u00fa": "u",
			"\u00fb": "u",
			"\u0169": "u",
			"\u1e79": "u",
			"\u016b": "u",
			"\u1e7b": "u",
			"\u016d": "u",
			"\u00fc": "u",
			"\u01dc": "u",
			"\u01d8": "u",
			"\u01d6": "u",
			"\u01da": "u",
			"\u1ee7": "u",
			"\u016f": "u",
			"\u0171": "u",
			"\u01d4": "u",
			"\u0215": "u",
			"\u0217": "u",
			"\u01b0": "u",
			"\u1eeb": "u",
			"\u1ee9": "u",
			"\u1eef": "u",
			"\u1eed": "u",
			"\u1ef1": "u",
			"\u1ee5": "u",
			"\u1e73": "u",
			"\u0173": "u",
			"\u1e77": "u",
			"\u1e75": "u",
			"\u0289": "u",
			"\u24e5": "v",
			"\uff56": "v",
			"\u1e7d": "v",
			"\u1e7f": "v",
			"\u028b": "v",
			"\ua75f": "v",
			"\u028c": "v",
			"\ua761": "vy",
			"\u24e6": "w",
			"\uff57": "w",
			"\u1e81": "w",
			"\u1e83": "w",
			"\u0175": "w",
			"\u1e87": "w",
			"\u1e85": "w",
			"\u1e98": "w",
			"\u1e89": "w",
			"\u2c73": "w",
			"\u24e7": "x",
			"\uff58": "x",
			"\u1e8b": "x",
			"\u1e8d": "x",
			"\u24e8": "y",
			"\uff59": "y",
			"\u1ef3": "y",
			"\u00fd": "y",
			"\u0177": "y",
			"\u1ef9": "y",
			"\u0233": "y",
			"\u1e8f": "y",
			"\u00ff": "y",
			"\u1ef7": "y",
			"\u1e99": "y",
			"\u1ef5": "y",
			"\u01b4": "y",
			"\u024f": "y",
			"\u1eff": "y",
			"\u24e9": "z",
			"\uff5a": "z",
			"\u017a": "z",
			"\u1e91": "z",
			"\u017c": "z",
			"\u017e": "z",
			"\u1e93": "z",
			"\u1e95": "z",
			"\u01b6": "z",
			"\u0225": "z",
			"\u0240": "z",
			"\u2c6c": "z",
			"\ua763": "z",
			"\uff10": "0",
			"\u2080": "0",
			"\u24ea": "0",
			"\u2070": "0",
			"\u00b9": "1",
			"\u2474": "1",
			"\u2081": "1",
			"\u2776": "1",
			"\u24f5": "1",
			"\u2488": "1",
			"\u2460": "1",
			"\uff11": "1",
			"\u00b2": "2",
			"\u2777": "2",
			"\u2475": "2",
			"\uff12": "2",
			"\u2082": "2",
			"\u24f6": "2",
			"\u2461": "2",
			"\u2489": "2",
			"\u00b3": "3",
			"\uff13": "3",
			"\u248a": "3",
			"\u2476": "3",
			"\u2083": "3",
			"\u2778": "3",
			"\u24f7": "3",
			"\u2462": "3",
			"\u24f8": "4",
			"\u2463": "4",
			"\u248b": "4",
			"\uff14": "4",
			"\u2074": "4",
			"\u2084": "4",
			"\u2779": "4",
			"\u2477": "4",
			"\u248c": "5",
			"\u2085": "5",
			"\u24f9": "5",
			"\u2478": "5",
			"\u277a": "5",
			"\u2464": "5",
			"\uff15": "5",
			"\u2075": "5",
			"\u2479": "6",
			"\u2076": "6",
			"\uff16": "6",
			"\u277b": "6",
			"\u2086": "6",
			"\u2465": "6",
			"\u24fa": "6",
			"\u248d": "6",
			"\uff17": "7",
			"\u2077": "7",
			"\u277c": "7",
			"\u24fb": "7",
			"\u248e": "7",
			"\u2087": "7",
			"\u247a": "7",
			"\u2466": "7",
			"\u2467": "8",
			"\u248f": "8",
			"\u24fc": "8",
			"\u247b": "8",
			"\u2078": "8",
			"\uff18": "8",
			"\u277d": "8",
			"\u2088": "8",
			"\u24fd": "9",
			"\uff19": "9",
			"\u2490": "9",
			"\u277e": "9",
			"\u247c": "9",
			"\u2089": "9",
			"\u2468": "9",
			"\u2079": "9"
		}, c = a.split(""), d = c.length - 1, e = !1, f; 0 <= d; d--) f = c[d], b.hasOwnProperty(f) && (c[d] = b[f], e = !0);
	e && (a = c.join(""));
	return a
}

function convertTimeStamp(a, b) {
	a = new Date(parseInt(a));
	a = a.toUTCString();
	var c = a.split(" ");
	if (3 < c.length) {
		a = c[4].split(":");
		var d = a[0],
			e = 12 <= d ? "pm" : "am";
		d = 12 < d ? d - 12 : d;
		var f = a[1],
			k = a[2],
			g = c[1],
			l = c[2];
		c = c[3];
		if ("undefined" == typeof langtag["Month" + l]) return "";
		var m = langtag["Month" + l],
			n = monthnum[langtag["Month" + l]];
		if ("undefined" == typeof n)
			for (var p in monthnum) removeDiacritics(p) == removeDiacritics(langtag["Month" + l]) && (m = p, n = monthnum[p]);
		return "full" == b ? d + ":" + f + ":" + k + e + " " + g + " " + m + " " + c : "shortfull" ==
			b ? d + ":" + f + e + " " + g + " " + m + " " + c : "date" == b ? g + " " + m + " " + c : "shortdate" == b ? g + "/" + n + "/" + c.substr(2) : "longtime" == b ? a[0] + ":" + f + ":" + k : a[0] + ":" + f
	}
	return ""
}

function displayClock() {
	runQuery("PRT_CTRL_DIN_ISAPI.dll", "Command&Type=Session&SubType=ServerTime", !1, !0).done(function (a) {
		"ts=" == a.substr(0, 3) && (sessionStorage.setItem("headerts", 1E3 * parseInt(a.substr(3, 10), 10)), setInterval(function () {
			var a = parseInt(sessionStorage.getItem("headerts"), 10) + 1E3;
			sessionStorage.setItem("headerts", a);
			$("#headertime").html(convertTimeStamp(a, "full"))
		}, 1E3))
	})
}

function convertDateString(a) {
	if ("" == a) return 0 == servertype ? "1900-01-01" : "01-01-1900";
	a = a.split(" ");
	var b = monthnum[a[1]];
	if ("undefined" == typeof b)
		for (var c in monthnum) removeDiacritics(c) == removeDiacritics(a[1]) && (b = monthnum[c]);
	return 0 == servertype ? a[2] + "-" + b + "-" + a[0] : a[0] + "-" + b + "-" + a[2]
}

function displayDateTime(a, b) {
	if ("NotSet" == a) return "";
	if ("WX" == b) {
		a = a.split(" ");
		b = a[2].split(":");
		var c = 12 <= b[0] ? "pm" : "am";
		12 < b[0] && (b[0] -= 12);
		return a[0] + " " + a[1] + " " + b[0] + ":" + b[1] + ":" + b[2] + c
	}
	if ("WXFull" == b) {
		a = a.split("T");
		var d = a[0].split("-");
		b = a[1].split(":");
		c = 12 <= b[0] ? "pm" : "am";
		12 < b[0] && (b[0] -= 12);
		return d[0] + " " + $.datepicker._defaults.monthNamesShort[parseInt(d[1], 10) - 1] + " " + d[2] + " " + str_pad_left(2, "0", b[0]) + ":" + str_pad_left(2, "0", b[1]) + c
	}
	a = a.split("T");
	d = a[0].split("-");
	b = a[1].split(":");
	c = 12 <= b[0] ? "pm" : "am";
	12 < b[0] && (b[0] -= 12);
	return d[2] + "/" + d[1] + "/" + d[0] + " " + b[0] + ":" + b[1] + c
}

function reportDate(a) {
	a = a.split("T");
	var b = a[0].split("-"),
		c = b[2] + "/" + b[1] + "/" + b[0] + " ";
	b = a[1].split(":");
	return c += b[0] + ":" + b[1]
}

function getLocalTime() {
	(new Date).toString().split(" ");
	var a = (new Date).getTimezoneOffset() / 60 * 36E5;
	return (new Date).getTime() - a
}

function toggleCheckbox(a, b) {
	var c = "keydown" == b.type ? b.which : "";
	if ("click" == b.type || "keydown" == b.type && 32 == c) {
		if (!$("#" + a).parent().hasClass("disabled")) {
			if ("DoesContainLink" == a) 0 == $("#DoesContain").is(":checked") && ($("#DoesContain").attr("checked", "checked"), $("#DoesContainImg").attr("src", "images/checkbox_on.jpg"), $("#DoesNotContain").removeAttr("checked"), $("#DoesNotContainImg").attr("src", "images/checkbox_off.jpg"));
			else if ("DoesNotContainLink" == a) 0 == $("#DoesNotContain").is(":checked") && ($("#DoesNotContain").attr("checked",
				"checked"), $("#DoesNotContainImg").attr("src", "images/checkbox_on.jpg"), $("#DoesContain").removeAttr("checked"), $("#DoesContainImg").attr("src", "images/checkbox_off.jpg"));
			else if ("RecurrenceDailyDayLink" == a) 0 == $("#RecurrenceDailyDay").is(":checked") && ($("#RecurrenceDailyDay").attr("checked", "checked"), $("#RecurrenceDailyDayImg").attr("src", "images/checkbox_on.jpg"), $("#RecurrenceDailyEveryDay").removeAttr("checked"), $("#RecurrenceDailyEveryDayImg").attr("src", "images/checkbox_off.jpg"));
			else if ("RecurrenceDailyEveryDayLink" ==
				a) 0 == $("#RecurrenceDailyEveryDay").is(":checked") && ($("#RecurrenceDailyEveryDay").attr("checked", "checked"), $("#RecurrenceDailyEveryDayImg").attr("src", "images/checkbox_on.jpg"), $("#RecurrenceDailyDay").removeAttr("checked"), $("#RecurrenceDailyDayImg").attr("src", "images/checkbox_off.jpg"));
			else if ("RecurrenceMonthlyDayLink" == a) 0 == $("#RecurrenceMonthlyDay").is(":checked") && ($("#RecurrenceMonthlyDay").attr("checked", "checked"), $("#RecurrenceMonthlyDayImg").attr("src", "images/checkbox_on.jpg"), $("#RecurrenceMonthlyDesc").removeAttr("checked"),
				$("#RecurrenceMonthlyDescImg").attr("src", "images/checkbox_off.jpg"));
			else if ("RecurrenceMonthlyDescLink" == a) 0 == $("#RecurrenceMonthlyDesc").is(":checked") && ($("#RecurrenceMonthlyDesc").attr("checked", "checked"), $("#RecurrenceMonthlyDescImg").attr("src", "images/checkbox_on.jpg"), $("#RecurrenceMonthlyDay").removeAttr("checked"), $("#RecurrenceMonthlyDayImg").attr("src", "images/checkbox_off.jpg"));
			else if ("RecurrenceYearlyDayLink" == a) 0 == $("#RecurrenceYearlyDay").is(":checked") && ($("#RecurrenceYearlyDay").attr("checked",
				"checked"), $("#RecurrenceYearlyDayImg").attr("src", "images/checkbox_on.jpg"), $("#RecurrenceYearlyDesc").removeAttr("checked"), $("#RecurrenceYearlyDescImg").attr("src", "images/checkbox_off.jpg"));
			else if ("RecurrenceYearlyDescLink" == a) 0 == $("#RecurrenceYearlyDesc").is(":checked") && ($("#RecurrenceYearlyDesc").attr("checked", "checked"), $("#RecurrenceYearlyDescImg").attr("src", "images/checkbox_on.jpg"), $("#RecurrenceYearlyDay").removeAttr("checked"), $("#RecurrenceYearlyDayImg").attr("src", "images/checkbox_off.jpg"));
			else if (-1 < $.inArray(a, ["RangeNoEndDateLink", "RangeEndAfterLink", "RangeEndByLink"])) {
				if (0 == $("#" + a.substr(0, a.length - 4)).is(":checked")) {
					c = ["RangeNoEndDateLink", "RangeEndAfterLink", "RangeEndByLink"];
					for (var d = 0; d < c.length; d++) {
						var e = c[d].substr(0, c[d].length - 4);
						c[d] == a ? ($("#" + e).attr("checked", "checked"), $("#" + e + "Img").attr("src", "images/checkbox_on.jpg")) : ($("#" + e).removeAttr("checked"), $("#" + e + "Img").attr("src", "images/checkbox_off.jpg"))
					}
				}
			} else "GeneratePeriodicMinutesTestReportLink" == a && 0 == $("#GeneratePeriodicMinutesTestReport").is(":checked") &&
				"00:01" == $("#TestReport").val() ? userApprove("<h1>" + langtag.MsgError + "</h1><p>" + langtag.InvalidPeriodicTestTime + "</p>", "OK", function () {}) : (changes = -1 == $.inArray(a, ["ModuleSkipVerificationLink", "AutoLicenseLink", "ManualLicenseLink"]), a = a.substr(0, a.length - 4), $("#" + a).is(":checked") ? ($("#" + a).removeAttr("checked"), $("#" + a + "Img").attr("src", "images/checkbox_off.jpg")) : ($("#" + a).attr("checked", "checked"), $("#" + a + "Img").attr("src", "images/checkbox_on.jpg")), "WinAuth" == a ? $("#" + a).is(":checked") ? ($("#uname").slideUp(),
						$("#pswd").slideUp()) : ($("#uname").slideDown(), $("#pswd").slideDown()) : "AutomaticallySynchronizeWithAnInternetTimeServer" == a ? toggleElement("sntpoptions", "AutomaticallySynchronizeWithAnInternetTimeServer", "off") : "GX_DHCP_ENABLED" == a ? toggleElement("dhcpoptions", "GX_DHCP_ENABLED", "on") : "AreaDisarmedANDScheduleValidUnlockDoor" == a || "AreaDisarmedORScheduleValidUnlockDoor" == a ? (c = "AreaDisarmedANDScheduleValidUnlockDoor" == a ? "AreaDisarmedORScheduleValidUnlockDoor" : "AreaDisarmedANDScheduleValidUnlockDoor", $("#" +
						a).is(":checked") && ($("#" + c).removeAttr("checked"), $("#" + c + "Img").attr("src", "images/checkbox_off.jpg"))) : "StartDateValid" == a || "EndDateValid" == a ? (c = "StartDateValid" == a ? "EndDateValid" : "StartDateValid", $("#" + a).is(":checked") || $("#" + c).is(":checked") ? $("#PeriodIdP select").attr("disabled", "disabled") : $("#PeriodIdP select").removeAttr("disabled")) : "AutoLicense" == a || "ManualLicense" == a ? (c = "AutoLicense" == a ? "Auto" : "Manual", d = "AutoLicense" == a ? "Manual" : "Auto", 0 == $("#" + c + "License").is(":checked") ? $("#" + c + "Options").slideUp() :
						($("#" + d + "License").removeAttr("checked"), $("#" + d + "LicenseImg").attr("src", "images/checkbox_off.jpg"), $("#" + d + "Options").slideUp(), $("#" + c + "Options").slideDown())) : "PP_" == a.substr(0, 3) ? "false" == sessionStorage.getItem("readonly") && ($("#" + a).is(":checked") ? ($("#" + a).parent("td").prev("td").removeClass("disabled"), $("#" + a).parent("td").next("td").children("input").removeAttr("disabled")) : ($("#" + a).parent("td").prev("td").addClass("disabled"), $("#" + a).parent("td").next("td").children("input").attr("disabled",
						"disabled"))) : "AccessLevelExpiry" == a.substr(0, 17) ? (a = a.substr(17), $("#AccessLevelExpiry" + a).is(":checked") ? ($("#AccessLevelStartDate" + a).removeAttr("disabled"), $("#AccessLevelStartTime" + a).removeAttr("disabled"), $("#AccessLevelEndDate" + a).removeAttr("disabled"), $("#AccessLevelEndTime" + a).removeAttr("disabled")) : ($("#AccessLevelStartDate" + a).attr("disabled", "disabled"), $("#AccessLevelStartTime" + a).attr("disabled", "disabled"), $("#AccessLevelEndDate" + a).attr("disabled", "disabled"), $("#AccessLevelEndTime" +
						a).attr("disabled", "disabled"))) : "AllRecordGroups" == a ? $("#AllRecordGroups").is(":checked") ? $("#AddRecordGroups").attr("disabled", "disabled") : $("#AddRecordGroups").removeAttr("disabled") : "AllDayEvent" == a ? $("#AllDayEvent").is(":checked") ? ($("#StartTime").addClass("hiddentab"), $("#ExpiryTime").addClass("hiddentab"), $("#StartDate").val() == $("#ExpiryDate").val() && (c = new Date($("#StartDate").val()), d = c.getTimezoneOffset(), c = c.getTime() - 6E4 * d + 864E5, $("#ExpiryDate").val(convertTimeStamp(c, "date")))) : ($("#StartTime").removeClass("hiddentab"),
						$("#ExpiryTime").removeClass("hiddentab")) : "NoRecurrence" == a ? $("#NoRecurrence").is(":checked") ? $("#RecurrenceOptions").addClass("hiddentab") : $("#RecurrenceOptions").removeClass("hiddentab") : "REXTimeDifferentToLockTime" == a ? $("#REXTimeDifferentToLockTime").is(":checked") ? $("#REXActivationP").slideDown() : $("#REXActivationP").slideUp() : "TreatUserPinXXX1AsDuress" == a ? checkDuplicate("PINNumber", "PIN", "force") : "CIDMonitorChannels" == a ? $("#CIDMonitorChannels").is(":checked") ? $("#CIDBackgroundMonitoringSection").slideDown() :
					$("#CIDBackgroundMonitoringSection").slideUp() : "GX_3G_FIREWALL" == a || "3GAllowPing" == a || "3GAllowHTTP" == a ? ("GX_3G_FIREWALL" == a && toggleElement("3GFirewallOptions", "GX_3G_FIREWALL", "on"), reloadsettings = !0) : "ReportIpMonitorChannels" == a ? Service.checkValidConfig(1) : "ReportIpMonitorSecondaryChannels" == a ? Service.checkValidConfig(2) : "CredEntrySequence" == a ? $("#" + a).is(":checked") ? $("tr[id^=EntryCredentialTypesRow] input[type=button]").removeClass("hiddentab") : $("tr[id^=EntryCredentialTypesRow] input[type=button]").addClass("hiddentab") :
					"CredExitSequence" == a && ($("#" + a).is(":checked") ? $("tr[id^=ExitCredentialTypesRow] input[type=button]").removeClass("hiddentab") : $("tr[id^=ExitCredentialTypesRow] input[type=button]").addClass("hiddentab")));
			1 < recordList.length && $("#" + a + "Img").addClass("multiselect")
		}
		b.preventDefault();
		b.stopPropagation();
		return !1
	}
	return !0
}

function linkCheckbox(a, b) {
	$("#" + a).is(":checked") ? ($("#" + b + "Link").parent().removeClass("disabled"), $("#" + b + "Link").attr("tabIndex", "0")) : ($("#" + b + "Link").parent().addClass("disabled"), $("#" + b + "Img").attr("src", "images/checkbox_off.jpg"), $("#" + b).removeAttr("checked"), $("#" + b + "Link").attr("tabIndex", "-1"))
}

function noProp(a) {
	a.preventDefault();
	a.stopPropagation()
}

function stopAlert() {
	$("iframe.camview").attr("src", "about:blank");
	$("#messagefg > div > div").html("");
	$("#messagefg").css("display", "none");
	$("#alertcontainer").css("display", "none");
	$("#alertfg").css("display", "none");
	$("#alerttitle").html("");
	$("#alerttext").html("");
	$("#alertcontainer").css("display", "none");
	$("#alertbg").css("background", "black");
	$("#messagefg > div > div").removeClass("eventreport");
	$("#messagefg > div > div").removeClass("dvrview");
	$("#messagefg > div > div").css("padding",
		"0 25px 25px 25px");
	$("#messagefg > div > div").css("width", "500px");
	$("#messagefg > div > div").css("top", "30%");
	$("#messagefg > div > div").css("left", "50%");
	$("#messagefg > div > div").css("margin-left", "-250px");
	$("#messagefg > div > div").is(".ui-draggable") && $("#messagefg > div > div").draggable("destroy")
}

function hideAlert() {
	$("#alertcontainer").css("display", "none");
	$("#alertbg").css("background", "black")
}

function flashMessage(a, b) {
	$("#messagefg").css("display", "none");
	$("#alerttitle").html(a);
	$("#alerttext").html(b);
	$("#alertcontainer").css("display", "block");
	$("#alertfg").css("display", "block");
	alerttimer = setTimeout("stopAlert();", 2E3)
}

function showMessage(a, b) {
	"undefined" == typeof b && (b = !0);
	$("#alertcontainer").css("display", "block");
	$("#messagefg").css("display", "block");
	$("#messagefg > div > div").html(a);
	$("#messagefg > div > div").hasClass("eventreport") ? $("#messagefg > div > div").draggable() : b && $("#messagefg > div > div").draggable({
		containment: "#container"
	})
}

function userApprove(a, b, c) {
	$("#messagefg > div > div").css("padding", "0 10px 0 15px");
	var d = "<span class='userapprovetext'>" + a + "</span>";
	"YN" == b ? d += "<p class='userapprovebuttons'><input type='button' value='" + langtag.TagYes + "' id='YesButton'> <input type='button' value='" + langtag.TagNo + "' id='NoButton'></p>" : "OK" == b ? d += "<p class='userapprovebuttons'><input type='button' value='" + langtag.TagOK + "' id='YesButton'></p>" : "DC" == b ? d += "<p class='userapprovebuttons'><input type='button' value='" + langtag.TagDiscard +
		"' id='YesButton'> <input type='button' value='" + langtag.TagCancel + "' id='NoButton'></p>" : "OKC" == b ? d += "<p class='userapprovebuttons'><input type='button' value='" + langtag.TagOK + "' id='YesButton'> <input type='button' value='" + langtag.TagCancel + "' id='NoButton'></p>" : "REPORT" == b && (d = a.indexOf("loading.gif") ? d + ("<p class='userapprovebuttons'><input type='button' value='" + langtag.TagPrevious + "' id='PreviousButton'> <input type='button' value='" + langtag.TagNext + "' id='NextButton' disabled> <input type='button' value='" +
			langtag.TagClose + "' id='CloseButton'></p>") : d + ("<p class='userapprovebuttons'><input type='button' value='" + langtag.TagPrevious + "' id='PreviousButton'> <input type='button' value='" + langtag.TagNext + "' id='NextButton'> <input type='button' value='" + langtag.TagClose + "' id='CloseButton'></p>"));
	"REPORT" == b ? showMessage(d, !1) : showMessage(d, !0);
	"REPORT" == b ? ($("#PreviousButton").mouseup(function () {
			c("Previous")
		}), $("#NextButton").mouseup(function () {
			c("Next")
		}), $("#CloseButton").one("mouseup", function () {
			stopAlert()
		})) :
		($("#YesButton").one("mouseup", function () {
			stopAlert();
			c(!0)
		}), $("#NoButton").one("mouseup", function () {
			stopAlert();
			c(!1)
		}))
}

function discardChanges(a) {
	changes ? userApprove("<p>" + langtag.ChangesNotSaved + "</p><p class='redalert'>" + langtag.DiscardChanges + "</p>", "DC", function (b) {
		1 == b ? (changes = !1, a(!0)) : a(!1)
	}) : a(!0)
}

function loadLanguagePack(a, b) {
	runQuery("langpack/" + a + "/" + a + b + ".txt?2.3.216.I0E5", "", !1, !0).done(function (a) {
		a = a.split("&");
		for (var b = 0; b < a.length; b++) {
			var c = a[b].split("="),
				f = c[1].replace("|eq|", "=");
			"Button" == c[0].substr(0, 6) ? $("#" + c[0]).val(f) : "OptGroup" == c[0].substr(0, 8) ? $("#" + c[0]).attr("label", f) : $("#" + c[0]).html(f);
			langtag[c[0]] = f
		}
	})
}

function runQuery(a, b, c, d) {
	var e = $.Deferred();
	runDeferredQuery(e, a, b, c, d, 1, 0 == servertype ? 12E4 : 1E4);
	return e.promise()
}

function runQueryWithTimeout(a, b, c, d, e) {
	var f = $.Deferred();
	runDeferredQuery(f, a, b, c, d, 3, e);
	return f.promise()
}

function runDeferredQuery(a, b, c, d, e, f, k) {
	var g = function (g) {
		g = d ? encryptAES(c + "&Sequence=" + g) : c;
/*		$.ajax({
			mimeType: "text/plain; charset=utf-8",
			url: b,
			data: g,
			type: "GET",
			dataType: "html",
			cache: d,
			async: e,
			timeout: k,
			success: function (b) {
				a.resolve(b)
			},
			error: function () {
				3 > f ? runDeferredQuery(a, b, c, d, e, f + 1, k) : a.reject()
			}
		}) */
	};
	d ? requestSequenceNumber(g) : g("")
}

function initialiseCrosstab() {
	window.sequenceCallbacks = [];
	crosstab.util.events.on("sequenceRequest", function (a) {
		if ("undefined" !== typeof crosstab.util.tabs.MASTER_TAB && crosstab.id === crosstab.util.tabs.MASTER_TAB.id) {
			var b = localStorage.getItem("CrosstabWXSequence");
			b = b && 1 < b.length ? simpleAESd(b, localStorage.getItem("WXKey")) : 1;
			a.data.sequenceNumber = "" !== b ? b : 1;
			localStorage.setItem("CrosstabWXSequence", simpleAES(parseInt(a.data.sequenceNumber, 10) + 1, localStorage.getItem("WXKey")));
			crosstab.broadcast("sequenceResponse",
				a.data, a.origin)
		}
	});
	crosstab.util.events.on("sequenceResponse", function (a) {
		"undefined" !== typeof window.sequenceCallbacks[a.data.requestId] && (window.sequenceCallbacks[a.data.requestId].received = !0, window.sequenceCallbacks[a.data.requestId].callback(a.data.sequenceNumber), delete window.sequenceCallbacks[a.data.requestId])
	})
}

function requestSequenceNumber(a) {
	a("")
}

function displayView(a) {
	$(".listtab").children("a").removeClass("selected");
	$("#" + a + "tab").addClass("selected");
	$("#listdetails").children("div").css("display", "none");
	$("#" + a + "view").css("display", "block");
	return !1
}

function resizeListview() {
	if (0 == $("#detailblock").length) $("#container").css("height", "100%"), $("#fullscreen").css("max-height", "100%");
	else {
		var a = parseInt($("#detailblock").css("height").replace("px", ""), 10);
		600 > a && (a = 600);
		$("#container").css("height", a + "px");
		0 == servertype && 0 < $("#UserId").length ? ($("#listview").css("height", a - 5 + "px"), $("#listcontents").css("height", a - 58 + "px")) : ($("#container").css("height", a + "px"), $("#listview").css("height", a + "px"), $("#listcontents").css("height", a - 25 + "px"));
		$("#listcontents").css("overflow",
			"auto")
	}
}

function displayTab(a) {
	$(".detailtab a").removeClass("selected");
	$("#detaillist form").children("div").css("display", "none");
	$("#" + a + "tab").addClass("selected");
	$("#" + a.toLowerCase() + "details").css("display", "block");
	resizeListview();
	return !1
}

function toggleGroups(a) {
	$("#listdetails div.grouplist").slideUp();
	$("#groupcontents >div>img").attr("src", "images/folder-closed.png");
	a == $("#currentgroup").val() ? $("#currentgroup").val("") : ($("#" + a + "Img").attr("src", "images/folder-open.png"), $("#" + a).slideDown(), $("#currentgroup").val(a))
}

function hideResults() {
	$("#listresults").slideUp();
	$("#searchstr").val(langtag.TagSearch)
}

function selectTableRow(a, b, c) {
	var d = !1,
		e = !1,
		f = -1,
		k = !1;
	c.ctrlKey ? k = e = !0 : c.shiftKey ? "" == sessionStorage.getItem("StartId") ? k = e = d = !0 : (d = !0, f = b) : k = e = d = !0;
	d && $("tr").each(function () {
		var b = this.id.replace(a, "");
		$("#" + a + "Delete" + b).is(":checked") && ($("#" + a + "Delete" + b).removeAttr("checked"), $("#" + this.id).children("td").removeClass("selected"))
	});
	if (-1 < f) {
		b = sessionStorage.getItem("StartId");
		d = $("#" + a + b).index();
		f = $("#" + a + f).index();
		if (f < d) {
			var g = d;
			d = f;
			f = g
		}
		for (g = $("#" + a + b).parent().children();;) {
			b = parseInt(g[d].id.substr(a.length));
			$("#" + a + "Delete" + b).attr("checked", !0);
			$("#" + a + b).children("td").addClass("selected");
			if (d == f) break;
			d++;
			if ("undefined" === typeof g[d]) break
		}
	}
	e && ($("#" + a + b).children("td").toggleClass("selected"), $("#" + a + "Delete" + b).is(":checked") ? $("#" + a + "Delete" + b).removeAttr("checked") : $("#" + a + "Delete" + b).attr("checked", !0));
	if ("AlarmRow" == a) {
		var l = !0;
		$("table.alarmtable tr").each(function () {
			var b = this.id.replace(a, "");
			$("#" + a + "Delete" + b).is(":checked") && (l = !1)
		});
		l ? $("#AckButton").addClass("hiddentab") : $("#AckButton").removeClass("hiddentab")
	}
	k &&
		sessionStorage.setItem("StartId", b);
	c.preventDefault()
}

function toggleElement(a, b, c) {
	"off" == c ? $("#" + b).is(":checked") ? $("#" + a + " input, #" + a + " select").removeAttr("disabled") : $("#" + a + " input, #" + a + " select").attr("disabled", "disabled") : "on" == c ? $("#" + b).is(":checked") ? $("#" + a + " input, #" + a + " select").attr("disabled", "disabled") : $("#" + a + " input, #" + a + " select").removeAttr("disabled") : $("#" + b).val() == c ? $("#" + a + " input, #" + a).attr("disabled", "disabled") : $("#" + a + " input, #" + a).removeAttr("disabled");
	"StartDateType" == b ? $("#StartDateType").val() == c ? $("#StartDateOption").slideUp() :
		$("#StartDateOption").slideDown() : "EndDateType" == b ? $("#EndDateType").val() == c ? $("#EndDateOption").slideUp() : $("#EndDateOption").slideDown() : "StartDateValid" == b ? $("#StartDateValid").is(":checked") == c ? $("#StartP").slideUp() : $("#StartP").slideDown() : "ExpiryDateValid" == b ? $("#ExpiryDateValid").is(":checked") == c ? $("#EndP").slideUp() : $("#EndP").slideDown() : "EndDateValid" == b ? $("#EndDateValid").is(":checked") == c ? $("#EndP").slideUp() : $("#EndP").slideDown() : "CardInactivityPeriodIsActive" == b.substr(0, 28) ? $("#" +
			b).is(":checked") == c ? $("#" + a).css("visibility", "hidden") : $("#" + a).css("visibility", "visible") : "UserInactivityPeriodIsActive" == b ? $("#UserInactivityPeriodIsActive").is(":checked") == c ? $("#UserInactivityPeriodP").slideUp() : $("#UserInactivityPeriodP").slideDown() : "UserInactivityDeletionPeriodIsActive" == b ? $("#UserInactivityDeletionPeriodIsActive").is(":checked") == c ? $("#UserInactivityDeletionPeriodP").slideUp() : $("#UserInactivityDeletionPeriodP").slideDown() : "Enable3GModem" == b ? $("#Enable3GModem").is(":checked") ?
		$("#3GContent").slideUp() : $("#3GContent").slideDown() : "GX_3G_FIREWALL" == b ? $("#GX_3G_FIREWALL").is(":checked") ? $("#3GFirewallOptions").slideDown() : $("#3GFirewallOptions").slideUp() : "GX_CABLE_DDNS_ENABLE" == b ? ($("#GX_CABLE_DDNS_ENABLE").is(":checked") ? $("#DDNSOptions").slideUp() : $("#DDNSOptions").slideDown(), $("#GX_CABLE_DDNS_ENABLE").is(":checked") && !$("#GX_SECURE_WEB_ENABLE").is(":checked") ? $("#HostnameOptions").slideUp() : $("#HostnameOptions").slideDown()) : "GX_SECURE_WEB_ENABLE" == b && ($("#GX_SECURE_WEB_ENABLE").is(":checked") ?
			$("#HTTPSOptions").slideUp() : $("#HTTPSOptions").slideDown(), $("#GX_SECURE_WEB_ENABLE").is(":checked") && !$("#GX_CABLE_DDNS_ENABLE").is(":checked") ? $("#HostnameOptions").slideUp() : $("#HostnameOptions").slideDown())
}

function toggleDropDownMenu(a, b, c, d) {
	"off" == d ? $("#" + a).val() == c ? ("ModuleAddress" == b ? $("#" + b).val(0) : $("#" + b).val("2147483647"), $("#" + b).prop("disabled", !0)) : $("#" + b).prop("disabled", !1) : "on" == d && ($("#" + a).val() == c ? $("#" + b).prop("disabled", !1) : ("ReaderOneKeypadType" != a && "ReaderTwoKeypadType" != a || $("#" + b).val("2147483647"), $("#" + b).prop("disabled", !0)))
}

function toggleModuleAddressDoor(a) {
	8 == a ? ($("#ModuleAddress").addClass("hiddentab"), $("#ModuleAddressDoor").removeClass("hiddentab")) : ($("#ModuleAddressDoor").addClass("hiddentab"), $("#ModuleAddress").removeClass("hiddentab"))
}

function toggleEncryptionSettings() {
	1 == $("#ReportingProtocol").val() || 7 == $("#ReportingProtocol").val() ? ($("#EncryptionLevel").parent("p").slideDown(), $("#EncryptionKey").parent("p").slideDown()) : ($("#EncryptionLevel").parent("p").slideUp(), $("#EncryptionKey").parent("p").slideUp());
	4 == $("#ReportingProtocol").val() ? ($("#CSVIPUserName").parent("p").slideDown(), $("#CSVIPPassword").parent("p").slideDown()) : ($("#CSVIPUserName").parent("p").slideUp(), $("#CSVIPPassword").parent("p").slideUp())
}

function updateStatus(a) {
	var b = 0 == servertype ? "ajax_request.php" : "PRT_CTRL_DIN_ISAPI.dll",
		c = 0 == servertype ? "type=status&subtype=" + a : "Request&Type=Status&SubType=GXT_" + a.toUpperCase() + "S_TBL";
	runQuery(b, c, 1 == servertype, !0).done(function (b) {
		b = decryptAES(b);
		if ("<no response>" != b.substr(0, 13) && "Request Failed" != b.substr(0, 14)) {
			b = b.split("&");
			for (var c = 0; c < b.length; c++) {
				var d = b[c].split("="),
					k = d[0].replace(a, "");
				d = d[1].split(",");
				if ("Area" == a) {
					var g = parseInt(d[2], 10).toString(2);
					g = g.split("").reverse().join("");
					for (var l = [1, 0, 2, 3, 4, 5, 6], m = -1, n = 0; n < l.length; n++)
						if ("1" == g[l[n]]) {
							m = l[n];
							break
						}
					g = -1 < m ? " - " + langtag[notificationlist[m]] : "";
					$("#AreaStatus" + k).html(langtag[status1list[d[0]]] + " - " + langtag[status2list[d[1]]] + g)
				} else if ("Door" == a) $("#DoorStatus" + k).html(langtag[statuslist[d[0]]] + " - " + langtag[positionlist[d[1]]]);
				else if ("Input" == a) {
					g = parseInt(d[1], 10).toString(2);
					g = g.split("").reverse().join("");
					l = [1, 0, 2];
					m = -1;
					for (n = 0; n < l.length; n++)
						if ("1" == g[l[n]]) {
							m = l[n];
							break
						}
					g = -1 < m ? " - " + langtag[functionlist[m]] :
						"";
					$("#InputStatus" + k).html(langtag[statuslist[d[0]]] + g)
				} else if ("TroubleInput" == a) {
					g = parseInt(d[1], 10).toString(2);
					g = g.split("").reverse().join("");
					m = -1;
					for (n = 0; n < g.length; n++)
						if ("1" == g[n]) {
							m = n;
							break
						}
					g = -1 < m ? " - " + langtag[functionlist[m]] : "";
					$("#TroubleInputStatus" + k).html(langtag[statuslist[d[0]]] + g)
				} else "Floor" == a ? $("#FloorStatus_" + k.replace("Elevator", "") + "_" + d[0]).html(langtag[statuslist[d[1]]]) : -1 < $.inArray(a, ["ProgrammableFunction", "Schedule", "Service", "PGM"]) && $("#" + a + "Status" + k).html(langtag[statuslist[d[0]]])
			}
		}
	})
}

function exportEventsSubmit() {
	var a = convertDateString($("#StartDate").val()).split("-");
	a = a[2] + a[1] + a[0] + $("#StartTime").val().replace(":", "");
	var b = convertDateString($("#EndDate").val()).split("-");
	b = b[2] + b[1] + b[0] + $("#EndTime").val().replace(":", "");
	a > b ? (a = convertDateString($("#EndDate").val()) + "T" + $("#EndTime").val() + ":00", b = convertDateString($("#StartDate").val()) + "T" + $("#StartTime").val() + ":00") : (a = convertDateString($("#StartDate").val()) + "T" + $("#StartTime").val() + ":00", b = convertDateString($("#EndDate").val()) +
		"T" + $("#EndTime").val() + ":00");
	var c = 0 == servertype ? "null" : "PRT_CTRL_DIN_ISAPI.dll",
		d = "Request&Type=Events&SubType=ExportCSV&StartDate=" + a + "&EndDate=" + b;
	requestSequenceNumber(function (a) {
		stopAlert();
		window.location = c + "?" + encryptAES(d + "&Sequence=" + a)
	})
}

function exportEvents() {
	$("#messagefg > div > div").css("padding", "0 15px 5px 25px");
	var a = convertTimeStamp(parseInt(sessionStorage.getItem("headerts"), 10), "date"),
		b = convertTimeStamp(parseInt(sessionStorage.getItem("headerts"), 10), "time"),
		c = "<h1>" + langtag.ExportEvents + "</h1>";
	c += "<p class='narrowtop'><label>" + langtag.ExportStart + ":</label><input type='text' id='StartDate' value='" + a + "' class='datewidth' readonly> <input type='text' id='StartTime' value='00:00' onChange=\"checkFormat('StartTime', 'TIME', '');\"' class='timewidth' readonly></p><p class='narrowtop'><label>" +
		langtag.ExportEnd + ":</label><input type='text' id='EndDate' value='" + a + "' class='datewidth' readonly> <input type='text' id='EndTime' value='" + b + "' onChange=\"checkFormat('EndTime', 'TIME', '');\"' class='timewidth' readonly></p><p class='userapprovebuttons'><span id='exporteventalert'></span><input type='button' value='" + langtag.TagOK + "' onClick='exportEventsSubmit();'><input type='button' value='" + langtag.TagCancel + "' onClick='stopAlert();'></p>";
	showMessage(c);
	$("#StartDate").datepicker({
		dateFormat: "dd MM yy",
		gotoCurrent: !0
	});
	$("#StartTime").timeEntry({
		show24Hours: !0,
		spinnerImage: ""
	});
	$("#EndDate").datepicker({
		dateFormat: "dd MM yy",
		gotoCurrent: !0
	});
	$("#EndTime").timeEntry({
		show24Hours: !0,
		spinnerImage: ""
	});
	$.getScript("langpack/jquery.datepicker-" + getCookie("WXLang") + ".js", function () {
		$.datepicker.setDefaults($.datepicker.regional[getCookie("WXLang")])
	});
	return !1
}

function pollController(a) {
	var b = setInterval(function () {
		requestSequenceNumber(function (a) {
			$.ajax({
				mimeType: "text/plain; charset=utf-8",
				url: "PRT_CTRL_DIN_ISAPI.dll",
				data: encryptAES("Request&Type=Health&SubType=Values&Sequence=" + a),
				type: "GET",
				dataType: "html",
				timeout: 1E3,
				success: function () {
					clearInterval(b);
					$("#updatestr").val("complete");
					setTimeout("logout();", 2E3)
				}
			})
		})
	}, 1E3 * a)
}

function showProgress(a, b, c) {
	var d = Math.round(a / b * 100);
	100 < d && (d = 100);
	$("#progressbar").animate({
		width: d + "%"
	}, 1E3, "linear");
	a >= b ? pollController(2) : setTimeout("showProgress(" + (a + 1) + ", " + b + ", '" + c + "');", 1E3)
}

function showModuleProgress() {
	runQuery(0 == servertype ? "dummy.php" : "PRT_CTRL_DIN_ISAPI.dll", 0 == servertype ? "type=status" : "Request&Type=Status&SubType=ModuleFirmwareUpdate", 1 == servertype, !0).done(function (a) {
		a = decryptAES(a);
		if ("Command Failed" == a.substring(0, 14)) {
			var b = 0;
			a.match(/\(([0-9]+)\)/i) && (b = parseInt(RegExp.$1, 10));
			if (16 > b) var c = langtag.FW_FAILED;
			else a = {
				22: "FW_APP_NOT_RESPONDING",
				23: "FW_UPDATE_IN_PROGRESS",
				24: "FW_MODULE_TYPE_INVALID",
				25: "FW_MODULE_ADDRESS_INVALID",
				26: "FW_FIRMWARE_TYPE_INVALID",
				27: "FW_INVALID_RESPONSE"
			}, c = "undefined" !== typeof a[c] && "undefined" !== typeof langtag[a[c]] ? langtag[a[c]] : langtag.FW_FAILED;
			stopAlert();
			userApprove("<p>" + langtag.MsgError + " - " + c + "</p><p>" + langtag.FW_EXPLANATION + "</p>", "OK", function () {})
		} else c = a.substr(17), 254 == c || 255 == c ? setTimeout("showModuleProgress()", 2E3) : (100 >= c ? ($("#messagefg > div > div p").html(langtag.ModuleErasing + " ... " + c + "%"), $("#progressbar").animate({
			width: 100 - c + "%"
		}, 2E3, "linear")) : 200 >= c && ($("#messagefg > div > div p").html(langtag.ModuleProgramming +
			" ... " + (c - 100) + "%"), $("#progressbar").animate({
			width: c - 100 + "%"
		}, 2E3, "linear")), 200 >= c || 203 == c || 207 == c ? (setTimeout("showModuleProgress()", 2E3), 200 < c && $("#progressbar").css("width", "100%"), 203 == c ? $("#messagefg > div > div p").html(langtag.ModuleRestarting + " ...") : 207 == c && $("#messagefg > div > div p").html(langtag.ApplicationRestarting + " ...")) : 209 == c ? ($("#messagefg > div > div p").html(langtag.NetworkRestarting + " ..."), $("#progressbar").css("width", "0%"), $("#progressbar").animate({
				width: "100%"
			}, 5E3,
			"swing"), setTimeout(function () {
			stopAlert();
			userApprove("<p>" + langtag.FW_UPDATED_OK + "</p>", "OK", function () {})
		}, 5E3), $("#modulelist").val(""), $("#ModuleFirmwarefile").val("")) : (a = {
				201: "FW_INCOMPATIBLE_FILE",
				202: "FW_MODULE_NOT_RESPONDING",
				203: "FW_RESTARTING_IN_BOOT",
				204: "FW_FAILED_TO_RESTART_IN_BOOT",
				205: "FW_FAILED_TO_ERASE",
				206: "FW_FAILED_TO_PROGRAM",
				207: "FW_PROGRESS_RESTARTING_APP",
				208: "FW_NO_RESTART_AFTER_UPDATE"
			}, stopAlert(), c = "undefined" !== typeof a[c] && "undefined" !== typeof langtag[a[c]] ? langtag[a[c]] :
			langtag.FW_FAILED, userApprove("<p>" + langtag.MsgError + " - " + c + "</p><p>" + langtag.FW_EXPLANATION + "</p>", "OK", function () {})))
	})
}

function restore(a) {
	if ("" != $("#" + a + "file").val() && ("ModuleFirmware" != a || "" != $("#ForceNewModule").val() || "" != $("#modulelist").val())) {
		var b = !0,
			c = $("#" + a + "file").val().substring($("#" + a + "file").val().length - 3, $("#" + a + "file").val().length);
		"Database" == a && "bak" != c ? b = !1 : "Firmware" == a && "fmw" != c ? b = !1 : "License" == a && "lic" != c ? b = !1 : "CSVImport" == a && "csv" != c ? b = !1 : "ModuleFirmware" == a && "bin" != c && (b = !1);
		b ? (b = "<p id='processingdetail'>" + ("ModuleFirmware" == a ? langtag.Uploadingnewfirmware : langtag["Uploadingnew" + a.toLowerCase()]) +
			"&nbsp;...&nbsp;<span id='updatespan'>" + langtag.Uploadingpleasewait + "</span></p><span id='progresscontainer'><span id='progressbar'></span></span><img src='images/loading.gif' class='pleasewait'>", "CSVImport" == a ? ($("#CSVImportform").css("display", "none"), 0 == servertype ? ($("#messagefg > div > div").css("padding", "0 25px 25px 25px"), b = "<p>" + langtag["Uploadingnew" + a.toLowerCase()] + "&nbsp;...&nbsp;<span id='updatespan'>" + langtag.Uploadingpleasewait + "</span></p><span id='progresscontainer'><span id='progressbar'></span></span><img src='images/loading.gif' class='pleasewait'>") :
				b = "<p>" + langtag["Uploadingnew" + a.toLowerCase()] + "&nbsp;...&nbsp;</p><img src='images/loading.gif' class='pleasewait'><p>" + langtag.AddUsersWait + "</p>", $("#messagefg > div > div").append(b)) : showMessage(b), $("input[name=" + a + "upload]").attr("disabled", !0), requestSequenceNumber(function (b) {
				var c = "";
				if ("Database" == a) c = "PRT_CTRL_DIN_ISAPI.dll?" + encryptAES("Command&Type=Restore&SubType=Database&Sequence=" + b);
				else if ("Template" == a) c = "PRT_CTRL_DIN_ISAPI.dll?" + encryptAES("Command&Type=Restore&SubType=DbTemplate&Sequence=" +
					b);
				else if ("Firmware" == a) c = "PRT_CTRL_DIN_ISAPI.dll?" + encryptAES("Command&Type=Restore&SubType=Firmware&Sequence=" + b);
				else if ("License" == a) c = "PRT_CTRL_DIN_ISAPI.dll?" + encryptAES("Command&Type=System&SubType=OfflineLicenceUpdate&Sequence=" + b);
				else if ("CSVImport" == a) c = 0 == servertype ? "ajax_upload.php" : "PRT_CTRL_DIN_ISAPI.dll?" + encryptAES("Command&Type=Wizard&SubType=BatchAddUsers&Sequence=" + b);
				else if ("ModuleFirmware" == a) {
					if ("" == $("#ForceNewModule").val()) {
						var d = $("#modulelist").val().split(":");
						c = d[0];
						var k = d[1];
						d = d[3]
					} else d = $("#ForceNewModule").val().split(","), c = d[0], k = d[1], d = $("#ForceNewAddress").val();
					k = $("#ModuleSkipVerification").is(":checked") ? 254 : k;
					c = 0 == servertype ? "dummy.php?type=receive" : "PRT_CTRL_DIN_ISAPI.dll?" + encryptAES("Command&Type=Modules&SubType=FirmwareUpdate&Module=" + c + "&ModuleSubType=" + k + "&CurrentAddress=" + d + "&Sequence=" + b)
				}
				$("#" + a + "form").ajaxSubmit({
					url: c,
					dataType: "script",
					uploadProgress: function (b, c, d, e) {
						"CSVImport" != a && (b = 0, b = 1048576 < c ? (c / 1048576).toFixed(1) + " Mb" : (c / 1024).toFixed(1) +
							" Kb", $("#updatespan").html(b + "&nbsp;(" + e + "%)"), $("#progressbar").css("width", e + "%"), 100 == e && $("#processingdetail").html() != langtag.Processing + "&nbsp;..." && setTimeout(function () {
								$("#processingdetail").html(langtag.Processing + "&nbsp;...");
								$("#progresscontainer").remove();
								"Database" == a && setTimeout(function () {
									$("#alertcontainer").is(":visible") && $("#processingdetail").html(langtag.MigratingDatabase)
								}, 1E4)
							}, 2E3))
					},
					complete: function (b) {
						str = decryptAES(b.responseText);
						if ("OK" == str) "Firmware" == a ? (b = "<p>" +
							langtag.Installingnewfirmware + "</p><span id='progresscontainer'><span id='progressbar'></span></span><img src='images/loading.gif' class='pleasewait'>", showMessage(b), showProgress(1, 90, "prerestart")) : "ModuleFirmware" == a ? (b = "<p>" + langtag.Installingnewfirmware + "</p><span id='progresscontainer'><span id='progressbar'></span></span><img src='images/loading.gif' class='pleasewait'>", showMessage(b), showModuleProgress()) : "License" == a ? runQuery("PRT_CTRL_DIN_ISAPI.dll", "Request&Type=System&SubType=LicenceLimits", !0, !0).done(function (a) {
							a = decryptAES(a);
							var b = getCookie("WXLang");
							localStorage.setItem("WXData", encryptAES("WXLang:" + b + "&" + a.replace(/=/g, ":"), !1));
							$("#updatespan").html(langtag.Uploadcomplete);
							$("#progressbar").css("width", "100%");
							setTimeout(function () {
								showMessage("<p>" + langtag.Uploadsuccess + "</p>");
								setTimeout("logout();", 2E3)
							}, 2E3)
						}) : "CSVImport" == a ? (showMessage("<p>" + langtag.Uploadsuccess + "</p>"), initialise("User"), setTimeout("stopAlert();", 2E3)) : ($("#updatespan").html(langtag.Uploadcomplete), $("#progressbar").css("width",
							"100%"), setTimeout(function () {
							stopAlert();
							window.location = "index.htm"
						}, 2E3));
						else if ("CSVImport" == a)
							if (0 == servertype)
								if ("FAIL" == str.substr(0, 4))
									if (b = str.split(":"), "Process" == b[1]) {
										var c = Math.round((b[3] + b[4]) / b[5] * 100);
										100 < c && (c = 100);
										flashMessage(langtag.MsgError, langtag.ImportFailed + "&nbsp;-&nbsp;" + langtag["CSVFail" + b[1]] + "&nbsp;(" + c + "%)")
									} else flashMessage(langtag.MsgError, langtag.ImportFailed + "&nbsp;-&nbsp;" + langtag["CSVFail" + b[1]]);
						else configureCSV(0, 1, str);
						else b = str.indexOf(")"), flashMessage(langtag.MsgError,
							langtag.ImportFailed + "&nbsp;-&nbsp;" + str.substring(b + 1));
						else "ModuleFirmware" == a ? "Command Failed" == str.substring(0, 14) && (b = 0, str.match(/\(([0-9]+)\)/i) && (b = parseInt(RegExp.$1, 10)), 16 > b ? b = langtag.FW_FAILED : (c = {
							22: "FW_APP_NOT_RESPONDING",
							23: "FW_UPDATE_IN_PROGRESS",
							24: "FW_MODULE_TYPE_INVALID",
							25: "FW_MODULE_ADDRESS_INVALID",
							26: "FW_FIRMWARE_TYPE_INVALID",
							27: "FW_INVALID_RESPONSE"
						}, b = "undefined" !== typeof c[b] && "undefined" !== typeof langtag[c[b]] ? langtag[c[b]] : langtag.FW_FAILED), stopAlert(), userApprove("<p>" +
							langtag.MsgError + "&nbsp;-&nbsp;" + b + "</p><p>" + langtag.FW_EXPLANATION + "</p>", "OK",
							function () {})) : ($("#updatespan").html(langtag.Uploadfailed), setTimeout("stopAlert();", 2E3));
						$("input[name=" + a + "upload]").removeAttr("disabled")
					},
					resetForm: !0
				})
			})) : flashMessage(langtag.MsgError, langtag.TagInvalidFormat)
	}
	return !1
}

function displayAddressSelectSubmit(a) {
	selectedaddresses = [];
	for (var b = 1; b <= a; b++) $("#address" + b).is(":checked") && selectedaddresses.push(b);
	$("#displaySelectedAddresses").val(selectedaddresses.join());
	stopAlert()
}

function displayAddressSelect() {
	for (var a = "<h1>Select Addresses</h1><p>Please select the keypads you would like to upgrade</p><div id='addresscheckboxlist'>", b = 1; 255 >= b; b++) {
		var c = -1 < $.inArray(b, selectedaddresses) ? "CHECKED" : "";
		a += "<div>" + b + "<input type='checkbox' id='address" + b + "' " + c + "></div>";
		0 == b % 10 && (a += "<br>")
	}
	a = a + "</div>" + ("<p class='userapprovebuttons'><input type='button' value='" + langtag.TagOK + "' onClick='displayAddressSelectSubmit(255)'> <input type='button' value='" + langtag.TagCancel + "' onClick='stopAlert()'></p>");
	$("#messagefg > div > div").css("width", "800px");
	$("#messagefg > div > div").css("top", "100px");
	$("#messagefg > div > div").css("margin-left", "-400px");
	$("#messagefg > div > div").css("padding", "0 10px 0 15px");
	showMessage(a)
}

function sendCommand(a, b, c, d, e) {
	if ("" !== c) {
		var f = 0 == servertype ? "ajax_command.php" : "PRT_CTRL_DIN_ISAPI.dll";
		"Floor" == a ? (b = b.split("_"), d = 0 == servertype ? "type=command&subtype=FLOOR&id=" + b[0] + "&command=" + c + "&Data1=" + b[1] : "Command&Type=Control&SubType=GXT_FLOORS_TBL&RecId=" + b[0] + "&Command=" + c + "&Data1=" + b[1]) : d = "RESET_ANTIPASSBACK" == a ? 0 == servertype ? "type=command&subtype=ResetAntipassback&id=" + b + "&command=" + c + "&cid=" + d : "Command&Type=Control&SubType=RESET_ANTIPASSBACK&RecId=" + b + "&Command=" + c : 0 == servertype ?
			"type=command&subtype=" + a + "&id=" + b + "&command=" + c + "&cid=" + d : "Command&Type=Control&SubType=GXT_" + a.toUpperCase() + "S_TBL&RecId=" + b + "&Command=" + c;
		"PGM" == a && "2" == c ? (a = $("#Timer" + b).val().split(":"), a = 3600 * parseInt(a[0], 10) + 60 * parseInt(a[1], 10) + parseInt(a[2], 10), 65535 < a && (a = 65535), d += "&Data1=" + a) : "Floor" == a && "1" == c && (a = $("#Timer" + b[1]).val().split(":"), a = 3600 * parseInt(a[0], 10) + 60 * parseInt(a[1], 10) + parseInt(a[2], 10), 65535 < a && (a = 65535), d += "&Data2=" + a);
		runQuery(f, d, 1 == servertype, !0).done(function (a) {
			a = decryptAES(a);
			"OK" == a ? setTimeout("hideControlPanel(" + e + ");", 200) : flashMessage(langtag.MsgError, langtag.MsgAccessDenied)
		})
	}
}

function checkActivationTime(a) {
	var b = $("#" + a).val().split(":");
	18 <= parseInt(b[0], 10) && (b[0] = 17, $("#" + a).val(b[0] + ":" + b[1] + ":" + b[2]))
}

function topWindow(a) {
	$(".cpfg").css("z-index", 2E3);
	$("#cp" + a).css("z-index", 3E3)
}

function displayControlPanel(a, b, c, d, e) {
	var f = "",
		k = 0 == d ? $("#ControlItem" + c).html() : 2 == d ? $("td." + b + c).html() : "Output" == b ? $("#GXT_PGMS_TBL" + c + " span").html() : $("#GXT_" + b.toUpperCase() + "S_TBL" + c + " span").html(),
		g = "undefined" == typeof controller ? -1 : controller[b + c];
	if ("Area" == b) f += "<div class='cptitle'>" + langtag.ControlArea + ":&nbsp;" + k + "</div><div class='cpheading'>" + langtag.ControlTitleDisarm + "</div><div class='cpsingle'><span class='cp1l' onClick='sendCommand(\"Area\", " + c + ", 0, " + g + ", -1);'>" + langtag.ControlDisarm +
		"</span> <span class='cp1r' onClick='sendCommand(\"Area\", " + c + ", 1, " + g + ", -1);'>" + langtag.ControlDisarm24 + "</span></div><div class='cpheading'>" + langtag.ControlTitleArm + "</div><div class='cpdouble'><span class='cp0l' onClick='sendCommand(\"Area\", " + c + ", 3, " + g + ", -1);'>" + langtag.ControlArm + "</span> <span class='cp0r' onClick='sendCommand(\"Area\", " + c + ", 4, " + g + ", -1);'>" + langtag.ControlForceArm + "</span><span class='cp0l' onClick='sendCommand(\"Area\", " + c + ", 10, " + g + ", -1);'>" + langtag.ControlArmStay +
		"</span><span class='cp0r' onClick='sendCommand(\"Area\", " + c + ", 5, " + g + ", -1);'>" + langtag.ControlArmInstant + "</span><span class='cp0l' onClick='sendCommand(\"Area\", " + c + ", 6, " + g + ", -1);'>" + langtag.ControlForceArmInstant + "</span> <span class='cp0r' onClick='sendCommand(\"Area\", " + c + ", 11, " + g + ", -1);'>" + langtag.ControlArm24 + "</span><span class='cp0l' onClick='sendCommand(\"Area\", " + c + ", 7, " + g + ", -1);'>" + langtag.ControlWalkTestEnable + "</span><span class='cp1r' onClick='sendCommand(\"Area\", " +
		c + ", 8, " + g + ", -1);'>" + langtag.ControlWalkTestDisable + "</span><span class='cp1l' onClick='sendCommand(\"Area\", " + c + ", 9, " + g + ", -1);'>" + langtag.ControlSilenceAlarm + "</span></div>";
	else if ("Door" == b) {
		if ($("#cp" + c).hasClass("cpfg")) return !1;
		var l = 0 == d && "undefined" !== typeof cameraurl[c + "_1"],
			m = 0 == d && "undefined" !== typeof cameraurl[c + "_2"];
		l || m ? f = (0 == d ? "<div id='cp" + c + "' class='cpfg doorcp' onClick='topWindow(" + c + ");'>" : "<div id='cp" + c + "' class='cpfg doorcp'>") + ("<div class='cpfgcontainer'><div><div class='cptitle'>" +
			langtag.ControlDoor + ":&nbsp;" + k + " <a href='' onClick='return hideControlPanel(" + c + ");' title='Close'>[x]</a></div><div style='width:300px; float:left;'><div class='cpheading'>" + langtag.ControlDoorControl + "</div><div class='cpdouble'><span class='cp0l' onClick='sendCommand(\"Door\", " + c + ", 0, " + g + ", " + e + ");'>" + langtag.ControlLock + "</span> <span class='cp1r' onClick='sendCommand(\"Door\", " + c + ", 1, " + g + ", " + e + ");'>" + langtag.ControlUnlock + "</span><span class='cp1l' onClick='sendCommand(\"Door\", " + c +
			", 2, " + g + ", " + e + ");'>" + langtag.ControlUnlockLatched + "</span></div><div class='cpheading'>" + langtag.ControlDoorLockout + "</div><div class='cpdouble'><span class='cp0l' onClick='sendCommand(\"Door\", " + c + ", 3, " + g + ", " + e + ");'>" + langtag.ControlAllowEntry + "</span> <span class='cp0r' onClick='sendCommand(\"Door\", " + c + ", 4, " + g + ", " + e + ");'>" + langtag.ControlAllowExit + "</span><span class='cp0l' onClick='sendCommand(\"Door\", " + c + ", 5, " + g + ", " + e + ");'>" + langtag.ControlAllowEntryExit + "</span><span class='cp0r' onClick='sendCommand(\"Door\", " +
			c + ", 9, " + g + ", " + e + ");'>" + langtag.ControlDenyEntryExit + "</span><span class='cpfull' onClick='sendCommand(\"Door\", " + c + ", 6, " + g + ", " + e + ");'>" + langtag.ControlClear + "</span></div></div><div class='camerafeedcontainer'><img src='' id='camerafeed" + c + "' class='camerafeed'></div></div></div></div>") : (f = 0 == d ? "<div id='cp" + c + "' class='cpfg doorcp' onClick='topWindow(" + c + ");'>" : 1 == d ? "<div id='cp" + c + "' class='cpfg doorcp'>" : "", 2 > d && (f += "<div class='cpfgcontainer'><div>"), f = 0 == d ? f + ("<div class='cptitle'>" +
				langtag.ControlDoor + ":&nbsp;" + k + " <a href='' onClick='return hideControlPanel(" + c + ");' title='" + langtag.Close + "'>[x]</a></div>") : f + ("<div class='cptitle'>" + langtag.ControlDoor + ": " + k + "</div>"), f += "<div class='cpheading'>" + langtag.ControlDoorControl + "</div><div class='cpdouble'><span class='cp0l' onClick='sendCommand(\"Door\", " + c + ", 0, " + g + ", " + e + ");'>" + langtag.ControlLock + "</span> <span class='cp1r' onClick='sendCommand(\"Door\", " + c + ", 1, " + g + ", " + e + ");'>" + langtag.ControlUnlock + "</span><span class='cp1l' onClick='sendCommand(\"Door\", " +
			c + ", 2, " + g + ", " + e + ");'>" + langtag.ControlUnlockLatched + "</span></div><div class='cpheading'>" + langtag.ControlDoorLockout + "</div><div class='cpdouble'><span class='cp0l' onClick='sendCommand(\"Door\", " + c + ", 3, " + g + ", " + e + ");'>" + langtag.ControlAllowEntry + "</span> <span class='cp0r' onClick='sendCommand(\"Door\", " + c + ", 4, " + g + ", " + e + ");'>" + langtag.ControlAllowExit + "</span><span class='cp0l' onClick='sendCommand(\"Door\", " + c + ", 5, " + g + ", " + e + ");'>" + langtag.ControlAllowEntryExit + "</span><span class='cp0r' onClick='sendCommand(\"Door\", " +
			c + ", 9, " + g + ", " + e + ");'>" + langtag.ControlDenyEntryExit + "</span><span class='cpfull' onClick='sendCommand(\"Door\", " + c + ", 6, " + g + ", " + e + ");'>" + langtag.ControlClear + "</span></div></div>", 2 > d && (f += "</div></div>"))
	} else if ("SaltoDoor" == b) {
		if ($("#cp" + c).hasClass("cpfg")) return !1;
		l = 0 == d && "undefined" !== typeof cameraurl[c + "_1"];
		m = 0 == d && "undefined" !== typeof cameraurl[c + "_2"];
		l || m ? f = (0 == d ? "<div id='cp" + c + "' class='cpfg doorcp' onClick='topWindow(" + c + ");'>" : "<div id='cp" + c + "' class='cpfg doorcp'>") + ("<div class='cpfgcontainer'><div><div class='cptitle'>" +
			langtag.ControlSaltoDoor + ":&nbsp;" + k + " <a href='' onClick='return hideControlPanel(" + c + ");' title='" + langtag.Close + "'>[x]</a></div><div style='width:300px; float:left;'><div class='cpheading'>" + langtag.ControlSaltoDoorControl + "</div><div class='cpdouble'><span class='cp0l' onClick='sendCommand(\"SaltoDoor\", " + c + ", 0, " + g + ", " + e + ");'>" + langtag.ControlOpen + "</span> <span class='cp0r' onClick='sendCommand(\"SaltoDoor\", " + c + ", 1, " + g + ", " + e + ");'>" + langtag.ControlEmergencyOpen + "</span><span class='cp1l' onClick='sendCommand(\"SaltoDoor\", " +
			c + ", 2, " + g + ", " + e + ");'>" + langtag.ControlEmergencyClose + "</span><span class='cp1r' onClick='sendCommand(\"SaltoDoor\", " + c + ", 3, " + g + ", " + e + ");'>" + langtag.ControlCancelEmergency + "</span></div></div><div class='camerafeedcontainer'><img src='' id='camerafeed" + c + "' class='camerafeed'></div></div></div></div>") : (f = 0 == d ? "<div id='cp" + c + "' class='cpfg doorcp' onClick='topWindow(" + c + ");'>" : 1 == d ? "<div id='cp" + c + "' class='cpfg doorcp'>" : "", 2 > d && (f += "<div class='cpfgcontainer'><div>"), f = 0 == d ? f + ("<div class='cptitle'>" +
				langtag.ControlSaltoDoor + ":&nbsp;" + k + " <a href='' onClick='return hideControlPanel(" + c + ");' title='" + langtag.Close + "'>[x]</a></div>") : f + ("<div class='cptitle'>" + langtag.ControlSaltoDoor + ": " + k + "</div>"), f += "<div class='cpheading'>" + langtag.ControlSaltoDoorControl + "</div><div class='cpdouble'><span class='cp0l' onClick='sendCommand(\"SaltoDoor\", " + c + ", 0, " + g + ", " + e + ");'>" + langtag.ControlOpen + "</span> <span class='cp0r' onClick='sendCommand(\"SaltoDoor\", " + c + ", 1, " + g + ", " + e + ");'>" + langtag.ControlEmergencyOpen +
			"</span><span class='cp1l' onClick='sendCommand(\"SaltoDoor\", " + c + ", 2, " + g + ", " + e + ");'>" + langtag.ControlEmergencyClose + "</span><span class='cp1r' onClick='sendCommand(\"SaltoDoor\", " + c + ", 3, " + g + ", " + e + ");'>" + langtag.ControlCancelEmergency + "</span></div></div>", 2 > d && (f += "</div></div>"))
	} else "Floor" == b ? (c = c.split("_"), f += "<div class='cptitle'>" + langtag.ControlElevator + ":&nbsp;" + $("#Elevator_" + c[0]).html() + "<br>" + langtag.ControlFloor + ": " + k + "</div><div class='cpheading'>" + langtag.ControlControl +
			"</div><div class='cpdouble'><span class='cp0l' onClick='sendCommand(\"Floor\", \"" + c[0] + "_" + c[1] + '", 0, ' + g + ', "' + e + "\");'>" + langtag.ControlLock + "</span> <span class='cp1r' onClick='sendCommand(\"Floor\", \"" + c[0] + "_" + c[1] + '", 2, ' + g + ', "' + e + "\");'>" + langtag.ControlUnlock + "</span><span class='cp1l' onClick='sendCommand(\"Floor\", \"" + c[0] + "_" + c[1] + '", 1, ' + g + ', "' + e + "\");'>" + langtag.ControlUnlockTimed + "</span><div class='timerdiv'><input type='text' id='Timer" + c[1] + "' value='00:00:05' onChange='checkActivationTime(\"Timer" +
			c[1] + "\");'></div></div>", c = c[1]) : "Input" == b ? f += "<div class='cptitle'>" + langtag.ControlInput + ":&nbsp;" + k + "</div><div class='cpheading'>" + langtag.ControlBypass + "</div><div class='cpdouble'><span class='cp0l' onClick='sendCommand(\"Input\", " + c + ", 0, " + g + ", -1);'>" + langtag.ControlRemove + "</span> <span class='cp1r' onClick='sendCommand(\"Input\", " + c + ", 2, " + g + ", -1);'>" + langtag.ControlPermanently + "</span><span class='cp1l' onClick='sendCommand(\"Input\", " + c + ", 1, " + g + ", -1);'>" + langtag.ControlUntilNextDisarm +
		"</span></div>" : "Output" == b ? f += "<div class='cptitle'>" + langtag.ControlOutput + ":&nbsp;" + k + "</div><div class='cpheading'>" + langtag.ControlControl + "</div><div class='cpdouble'><span class='cp0l' onClick='sendCommand(\"PGM\", " + c + ", 1, " + g + ", -1);'>" + langtag.ControlActivate + "</span> <span class='cp1r' onClick='sendCommand(\"PGM\", " + c + ", 0, " + g + ", -1);'>" + langtag.ControlDeactivate + "</span><span class='cp1l' onClick='sendCommand(\"PGM\", " + c + ", 2, " + g + ", -1);'>" + langtag.ActivateForTime + "</span><div class='timerdiv'><input type='text' id='Timer" +
		c + "' value='00:00:05' onChange='checkActivationTime(\"Timer" + c + "\");'></div></div>" : "ProgrammableFunction" == b ? f += "<div class='cptitle'>" + langtag.ControlProgrammableFunction + ":&nbsp;" + k + "</div><div class='cpheading'>" + langtag.ControlControl + "</div><div class='cpdouble'><span class='cp1l' onClick='sendCommand(\"ProgrammableFunction\", " + c + ", 1, " + g + ", -1);'>" + langtag.ControlStart + "</span> <span class='cp1r' onClick='sendCommand(\"ProgrammableFunction\", " + c + ", 0, " + g + ", -1);'>" + langtag.ControlStop +
		"</span></div>" : "Service" == b ? f += "<div class='cptitle'>" + langtag.ControlService + ":&nbsp;" + k + "</div><div class='cpheading'>" + langtag.ControlControl + "</div><div class='cpdouble'><span class='cp1l' onClick='sendCommand(\"Service\", " + c + ", 1, " + g + ", -1);'>" + langtag.StartService + "</span> <span class='cp1r' onClick='sendCommand(\"Service\", " + c + ", 0, " + g + ", -1);'>" + langtag.StopService + "</span></div>" : "User" == b && (f += "<div class='cptitle'>" + langtag.ControlUser + ":&nbsp;" + k + "</div><div class='cpheading'>" + langtag.ControlControl +
			"</div><div class='cpdouble'><span class='cp1l' onClick='sendCommand(\"RESET_ANTIPASSBACK\", " + c + ", 0, " + g + ", -1);'>" + langtag.ResetAntipassback + "</span> </div>");
	"Door" == b || "SaltoDoor" == b ? 0 == d ? $("#cpcontainer").append(f) : 1 == d ? $("#cpcontainer").html("<div id='cpbg' onClick='hideControlPanel(" + e + ");'></div>" + f) : ($(".cpfg div").html(f), $("#cpcontainer").css("display", "block"), $(".cpbg").css("display", "block")) : ($(".cpfg div").html(f), $("#cpcontainer").css("display", "block"), $(".cpbg").css("display",
		"block"), "User" == b && ($(".cpfg div").bind("click", function (a) {
		a.stopPropagation()
	}), $(".cpfg > div").draggable({
		handle: ".cptitle",
		containment: "#fullscreen"
	}))); - 1 < $.inArray(b, ["Output", "Floor"]) && $("#Timer" + c).timeEntry({
		show24Hours: !0,
		spinnerImage: "",
		showSeconds: !0
	});
	if ("Door" == b || "SaltoDoor" == b) {
		$.browser.msie && (m = !1);
		if (l || m) {
			if (m) {
				var n = -1 == cameraurl[c + "_2"].URL.indexOf("?") ? "?" : "&";
				$("#camerafeed" + c).attr("src", cameraurl[c + "_2"].URL + n + "ts=" + Math.floor(1E5 * Math.random()))
			} else l && (n = -1 == cameraurl[c +
				"_1"].URL.indexOf("?") ? "?" : "&", caminterval[c] = setInterval(function () {
				var a = cameraurl[c + "_1"].URL + n + "ts=" + Math.floor(1E5 * Math.random());
				$("#camerafeed" + c).attr("src", a)
			}, cameraurl[c + "_1"].RefreshRate));
			$("#cp" + c + " div.cpfgcontainer").css("width", "auto");
			$("#cp" + c + " div.cpfgcontainer").css("left", "30%")
		} else $("#cp" + c + " div.cpfgcontainer").css("width", "320px");
		0 == d ? $("#cp" + c + " div.cpfgcontainer").draggable({
			handle: ".cptitle",
			containment: "#fullscreen"
		}) : $(".cpfg div.cpfgcontainer").draggable({
			handle: ".cptitle",
			containment: "#detailblock"
		})
	}
	a.preventDefault();
	a.stopPropagation();
	return !1
}

function hideControlPanel(a) {
	0 > a ? ($("#cpcontainer").css("display", "none"), $(".cpfg div").html("")) : ("undefined" !== typeof caminterval && "undefined" !== typeof caminterval[a] && (clearInterval(caminterval[a]), $("#camerafeed" + a).removeAttr("src")), $("#cp" + a).remove(), "undefined" !== typeof $("#DoorId").val() && $("#cpcontainer").html(""));
	return !1
}

function notFoundRedirect() {
	var a = parseInt($("#cdown").html(), 10);
	1 >= a ? ($("#cdown").html("please wait"), window.location = 0 == servertype ? "index.php" : "index.htm") : $("#cdown").html(a - 1)
}

function addHoliday() {
	for (var a = !0, b = 0; b < currentholidays.length; b++) "none" != $("#HolidayRow" + currentholidays[b]).css("display") && 0 == $("input[name='HolidayName" + currentholidays[b] + "']").val().length && (a = !1);
	a && (a = currentholidays.length, b = 0 == servertype ? getLocalTime() : parseInt(sessionStorage.getItem("headerts"), 10), b = "<tr id='HolidayRow" + a + "' onClick='selectTableRow(\"HolidayRow\", " + a + ", event)'><td><input type='text' id='HolidayName" + a + "' name='HolidayName" + a + "' value='' class='wide200' onKeyup='checkFormat(this.id, \"EMPTY\", \"NameError\")' maxlength='32'></td><td align='center'><input type='checkbox' id='HolidayRepeat" +
		a + "' name='HolidayRepeat" + a + "' class='hiddentab'><a href='' id='HolidayRepeat" + a + "Link' onClick='toggleCheckbox(this.id, event)'><img id='HolidayRepeat" + a + "Img' src='images/checkbox_off.jpg'></a></td><td><input type='text' id='HolidayStart" + a + "' name='HolidayStart" + a + "' value='" + convertTimeStamp(b, "date") + "' class='regular' onChange='checkDateDiff(\"Holiday\", " + a + ");' readonly></td><td><input type='text' id='HolidayEnd" + a + "' name='HolidayEnd" + a + "' value='" + convertTimeStamp(b + 864E5, "date") + "' class='regular' onChange='checkDateDiff(\"Holiday\", " +
		a + ");' readonly><input type='checkbox' id='HolidayRowDelete" + a + "' class='hiddentab'></td></tr>", 0 == a ? (b = "<table class='selectableTable' cellspacing=0 cellpadding=3><tr><th>" + langtag.TagName + "</th><th style='text-align:center'>" + langtag.TagRepeat + "</th><th>" + langtag.TagStartDate + "</th><th>" + langtag.TagEndDate + "</th></tr>" + b + "</table>", $("#holidaysdetailslist").html(b)) : $(".selectableTable tbody").append(b), currentholidays.push(a), sessionStorage.setItem("NameError", "error"), $("#HolidayName" + a).focus(),
		$("#HolidayStart" + a).datepicker({
			dateFormat: "dd MM yy",
			gotoCurrent: !0
		}), $("#HolidayEnd" + a).datepicker({
			dateFormat: "dd MM yy",
			gotoCurrent: !0
		}), $.datepicker.setDefaults($.datepicker.regional[langtag.CurrentLanguage]))
}

function displayAPMNum(a, b) {
	var c = parseInt($("#AllegionP" + a + "RSDStart" + b).val(), 10);
	c = 238 < c ? 255 - c : 16;
	for (var d = "", e = 1; e <= c; e++) d += "<option value='" + e + "'>" + e + "</option>";
	$("#AllegionP" + a + "RSDNumberAPM" + b).html(d)
}

function checkDuplicatePIM(a) {
	for (var b = 1 == a ? currentallegion1 : currentallegion2, c = 0; c < b.length; c++) {
		var d = !1;
		$("#AllegionP" + a + "RSDAddress" + c).val();
		for (i = 0; i < b.length; i++) i != c && 0 == $("#AllegionP" + a + "Row" + i).hasClass("hiddentab") && $("#AllegionP" + a + "RSDAddress" + i).val() == $("#AllegionP" + a + "RSDAddress" + c).val() && (d = !0);
		d ? $("#AllegionP" + a + "RSDAddress" + c).addClass("highlight") : $("#AllegionP" + a + "RSDAddress" + c).removeClass("highlight")
	}
}

function addAllegion(a) {
	var b = 1 == a ? currentallegion1.length : currentallegion2.length;
	1 == a ? currentallegion1.push(b) : currentallegion2.push(b);
	var c = "<tr id='AllegionP" + a + "Row" + b + "' onClick='selectTableRow(\"AllegionP" + a + 'Row", ' + b + ", event)'>" + ("<td><select id='AllegionP" + a + "RSDAddress" + b + "' name='AllegionP" + a + "RSDAddress" + b + "' class='vnarrow' onChange='checkDuplicatePIM(" + a + ");' onClick='noProp(event);'>");
	for (var d = 1; 255 > d; d++) 170 != d && (c += "<option value='" + d + "'>" + d + "</option>");
	c = c + "</select></td>" +
		("<td><select id='AllegionP" + a + "RSDStart" + b + "' name='AllegionP" + a + "RSDStart" + b + "' class='vnarrow' onChange='displayAPMNum(" + a + ", " + b + ");' onClick='noProp(event);'>");
	for (d = 1; 255 > d; d++) 170 != d && (c += "<option value='" + d + "'>" + d + "</option>");
	c = c + "</select></td>" + ("<td><select id='AllegionP" + a + "RSDNumberAPM" + b + "' name='AllegionP" + a + "RSDNumberAPM" + b + "' class='vnarrow' onClick='noProp(event);'>");
	for (d = 1; 16 >= d; d++) c += "<option value='" + d + "'>" + d + "</option>";
	c += "</select><input type='checkbox' id='AllegionP" +
		a + "RowDelete" + b + "' class='hiddentab'></td></tr>";
	$("#allegion" + a + "list .selectableTable tbody").append(c);
	checkDuplicatePIM(a)
}

function updateDisplayName(a) {
	a = "keyup" == a.type ? a.which : "";
	if (46 > a && 8 != a) return !1;
	$("#Name").val(($("#FirstName").val() + " " + $("#LastName").val()).substr(0, 16))
}

function checkDuplicate(a, b, c) {
	if (0 == servertype && "KLESLED" != b) return !0;
	if ("PIN" == b) {
		if (isNaN($("#" + a).val()) || 0 == $("#" + a).val().length) return $("#" + a).removeClass("highlight"), $("#" + a).siblings("label").html(langtag.TagPINCode), $("#" + a).siblings("label").removeClass("highlight"), !0;
		c = $("#" + a).val().replace(/[^0-9]/g, "");
		$("#" + a).val(c);
		var d = 0 == servertype ? "type=command&module&subtype=DuplicateCheck&" : "Request&Type=DuplicateCheck&";
		d += "SubType=GXT_USERS_TBL&PINNumber=" + c + "&User=" + $("#UserId").val();
		d += $("#TreatUserPinXXX1AsDuress").is(":checked") ? "&TreatPlusOne=1" : "&TreatPlusOne=0"
	} else if ("CARD" == b) "" != $("#CardFac" + a).val() && $("#CardFac" + a).val(parseInt(0 + $("#CardFac" + a).val(), 10)), "" != $("#CardNum" + a).val() && $("#CardNum" + a).val(parseInt(0 + $("#CardNum" + a).val(), 10)), d = 0 == servertype ? "type=command&module&subtype=DuplicateCheck&SubType=GXT_USERS_TBL&CardFac=" + $("#CardFac" + a).val() + "&CardNum=" + $("#CardNum" + a).val() + "&User=" + $("#UserId").val() : "Request&Type=DuplicateCheck&SubType=GXT_USERS_TBL&CardFac=" +
		$("#CardFac" + a).val() + "&CardNum=" + $("#CardNum" + a).val() + "&User=" + $("#UserId").val();
	else if ("MODULE" == b) d = $("#" + a + "temp").val().split(","), c = {
			Keypad: "GXT_KEYPADS_TBL",
			AnalogExpander: "GXT_ANALOGEXPANDERS_TBL",
			InputExpander: "GXT_INPUTEXPANDERS_TBL",
			OutputExpander: "GXT_PGMEXPANDERS_TBL",
			ReaderExpander: "GXT_READEREXPANDERS_TBL"
		}, d = 0 == servertype ? "type=command&module&subtype=DuplicateCheck&SubType=" + c[d[0]] + "&PhysicalAddress=" + $("#" + a).val() : "Request&Type=DuplicateCheck&SubType=" + c[d[0]] + "&PhysicalAddress=" +
		$("#" + a).val();
	else {
		if ("USERNAME" == b) return $("#" + a).val($("#" + a).val().toLowerCase()), -1 == $.inArray($("#" + a).val(), namelist) ? ($("#" + a).removeClass("highlight"), $("#" + a).siblings("label").removeClass("highlight"), $("#" + a).siblings("label").html(langtag.TagUsername)) : ($("#" + a).addClass("highlight"), $("#" + a).siblings("label").html(langtag.TagDuplicateUsername), $("#" + a).siblings("label").addClass("highlight")), !0;
		if ("KLESLED" == b) {
			if (255 == $("#" + a).val() || $("#" + a).val() == sessionStorage.getItem(a)) return $("#" +
				a).removeClass("highlight"), $("#" + a).siblings("label").html(langtag.AssignedZoneLedDisplay1), $("#" + a).siblings("label").removeClass("highlight"), !0;
			d = a.replace("ZoneLedDisplay", "");
			d = 0 == servertype ? "type=command&module&subtype=DuplicateCheck" : "Request&Type=DuplicateCheck&SubType=InputLedDisplay&InputId=" + $("#InputId").val() + "&AreaId=" + $("#Area" + d).val() + "&LedReference=" + $("#" + a).val()
		}
	}
	runQuery(0 == servertype ? "dummy.php" : "PRT_CTRL_DIN_ISAPI.dll", d, 1 == servertype, !0).done(function (c) {
		c = decryptAES(c);
		if ("No match" == c)
			if ("PIN" == b) $("#" + a).removeClass("highlight"), $("#Dummy" + a).removeClass("highlight"), $("#" + a).siblings("label").html(langtag.TagPINCode), $("#" + a).siblings("label").removeClass("highlight");
			else if ("CARD" == b) {
			$("#CardFac" + a).removeClass("permanent");
			var d = [];
			$("input[id^=CardFac]").each(function () {
				var a = this.id.replace("CardFac", ""),
					b = $("#CardFac" + a).val() + "_" + $("#CardNum" + a).val();
				"_" == b ? ($("#CardFac" + a).removeClass("highlight"), $("#CardNum" + a).removeClass("highlight"), $("#CardFac" +
					a).siblings("label").html(langtag.TagFacilityCardNumber), $("#CardFac" + a).siblings("label").removeClass("highlight")) : -1 == $.inArray(b, d) ? (d.push(b), $("#CardFac" + a).hasClass("permanent") || ($("#CardFac" + a).removeClass("highlight"), $("#CardNum" + a).removeClass("highlight"), $("#CardFac" + a).siblings("label").html(langtag.TagFacilityCardNumber), $("#CardFac" + a).siblings("label").removeClass("highlight"))) : ($("#CardFac" + a).addClass("highlight"), $("#CardNum" + a).addClass("highlight"), $("#CardFac" + a).siblings("label").html(langtag.TagDuplicateCard),
					$("#CardFac" + a).siblings("label").addClass("highlight"))
			})
		} else "MODULE" == b ? ($("#" + a).removeClass("highlight"), $("#" + a).siblings("label").html(langtag.TagPhysicalAddress), $("#" + a).siblings("label").removeClass("highlight")) : "KLESLED" == b && ($("#" + a).removeClass("highlight"), $("#" + a).siblings("label").html(langtag.AssignedZoneLedDisplay1), $("#" + a).siblings("label").removeClass("highlight"));
		else "PIN" == b ? ($("#" + a).addClass("highlight"), $("#Dummy" + a).addClass("highlight"), $("#" + a).siblings("label").html(langtag.TagDuplicatePIN),
			$("#" + a).siblings("label").addClass("highlight")) : "CARD" == b ? ($("#CardFac" + a).addClass("highlight").addClass("permanent"), $("#CardNum" + a).addClass("highlight"), $("#CardFac" + a).siblings("label").html(langtag.TagDuplicateCard), $("#CardFac" + a).siblings("label").addClass("highlight")) : "MODULE" == b ? $("#" + a).val() == sessionStorage.getItem("CurrentAddress") ? ($("#" + a).removeClass("highlight"), $("#" + a).siblings("label").html(langtag.TagPhysicalAddress), $("#" + a).siblings("label").removeClass("highlight")) : ($("#" +
			a).addClass("highlight"), $("#" + a).siblings("label").html(langtag.TagDuplicateAddress), $("#" + a).siblings("label").addClass("highlight")) : "KLESLED" == b && ($("#" + a).val() == sessionStorage.getItem(a) ? ($("#" + a).removeClass("highlight"), $("#" + a).siblings("label").html(langtag.AssignedZoneLedDisplay1), $("#" + a).siblings("label").removeClass("highlight")) : ($("#" + a).addClass("highlight"), $("#" + a).siblings("label").html(langtag.DuplicateZoneLed), $("#" + a).siblings("label").addClass("highlight")))
	})
}

function checkFormat(a, b, c) {
	var d = $("#" + a).val(),
		e = !1;
	if ("LONGTIME" == b) "" == d ? d = "00:00:00" : (d = d.split(":"), 23 < parseInt(d[0], 10) && (d[0] = "00"), 59 < parseInt(d[1], 10) && (d[1] = "00"), 59 < parseInt(d[2], 10) && (d[2] = "00"), d = d[0] + ":" + d[1] + ":" + d[2]);
	else if ("TIME" == b) "" == d ? d = "00:00" : (d = d.split(":"), 23 < parseInt(d[0], 10) && (d[0] = "00"), 59 < parseInt(d[1], 10) && (d[1] = "00"), d = d[0] + ":" + d[1], "TestReport" == a && "00:01" == $("#TestReport").val() && $("#GeneratePeriodicMinutesTestReport").is(":checked") && (d = "00:02"));
	else if ("DATE" ==
		b) d = d.split("/"), 31 < parseInt(d[0], 10) && (d[0] = "01"), 12 < parseInt(d[1], 10) && (d[1] = "01"), d = d[0].substr(0, 2) + "/" + d[1].substr(0, 2) + "/" + d[2].substr(0, 4);
	else if ("IP" == b) {
		d = d.split(".");
		b = "";
		for (var f = 0; 4 > f; f++) {
			"undefined" == typeof d[f] ? d.push("0") : "" == d[f] && (d[f] = "0");
			var k = !1,
				g = parseInt(d[f], 10);
			if (isNaN(g) || 0 > d[f] || 255 < d[f]) k = !0;
			k && (e = !0);
			b += d[f] + "."
		}
		d = b.substr(0, b.length - 1);
		e ? ($("#" + a).addClass("highlight"), $("#" + a).siblings("label").html(langtag.TagInvalidIP), $("#" + a).siblings("label").addClass("highlight"),
			$("#IPError").val("true")) : ($("#" + a).removeClass("highlight"), $("#" + a).siblings("label").html(c), $("#" + a).siblings("label").removeClass("highlight"), $("#IPError").val(""))
	} else "IPDOMAIN" == b ? ("" == $("#" + a).val() || 0 == $("#" + a).val() ? d = "0.0.0.0" : (e = $("#" + a).val().match(/^([0-9.])+$/) ? $("#" + a).val().match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/) : $("#" + a).val().match(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/),
		e = !e), e ? ($("#" + a).addClass("highlight"), $("#" + a).siblings("label").html(langtag.TagInvalidIPDomain), $("#" + a).siblings("label").addClass("highlight"), $("#IPError").val("true")) : ($("#" + a).removeClass("highlight"), $("#" + a).siblings("label").html(c), $("#" + a).siblings("label").removeClass("highlight"), $("#IPError").val(""), "IPAddress" != a && "SecondaryIPAddress" != a || checkIPAddressAndPort("reportip"))) : "DOMAIN" == b ? ("" == $("#" + a).val() ? d = "" : (e = $("#" + a).val().match(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/),
		e = !e), e ? ($("#" + a).addClass("highlight"), $("#" + a).siblings("label").html(langtag.TagInvalidDomain), $("#" + a).siblings("label").addClass("highlight"), $("#IPError").val("true")) : ($("#" + a).removeClass("highlight"), $("#" + a).siblings("label").html(c), $("#" + a).siblings("label").removeClass("highlight"), $("#IPError").val(""))) : "HEX" == b ? d = d.toUpperCase().replace(/[^0-9,A-F]/g, "").substr(0, parseInt(c, 10)) : "ALPHANUMERIC" == b ? (b = d.replace(/[^0-9,a-z,A-Z _\-\.,\(\)\[\]]/g, ""), b != d ? ($("#" + a).addClass("highlight"),
		$("#" + a).siblings("label").addClass("highlight"), $("#" + a + "Error").val("true")) : ($("#" + a).removeClass("highlight"), $("#" + a).siblings("label").removeClass("highlight"), $("#" + a + "Error").val(""))) : "PHONE" == b ? d = d.toUpperCase().replace(/[^0-9,\*#,BCD]/g, "").substr(0, 16) : "NUMBER" == b ? ("" != d && (d = parseInt(d, 10) > parseInt(c, 10) ? d.substr(0, d.length - 1) : parseInt(d, 10)), isNaN(d) && (d = "")) : "AESKEY" == b ? (maxlen = 1 == $("#" + c).val() ? 16 : 2 == $("#" + c).val() ? 24 : 3 == $("#" + c).val() ? 32 : 16, d = d.replace(/[^0-9,a-z,A-Z]/g, "").substr(0,
		maxlen)) : "EMPTY" == b ? 0 == $("#" + a).val().length ? sessionStorage.setItem(c, "true") : sessionStorage.setItem(c, "") : "PASSWORD" == b ? 4 > $("#" + a).val().length ? ($("#" + a).css("background-color", "#BC1F37"), $("#" + a).css("color", "#ffffff"), $("#" + a).siblings("label").addClass("highlight")) : ($("#" + a).css("background-color", "#ffffff"), $("#" + a).css("color", "#606060"), $("#" + a).siblings("label").removeClass("highlight")) : "URL" == b && ($("#" + a).val().match(/^[a-zA-Z0-9\.,\/\[\]#\$\?=&:;\-_~]+$/) ? ($("#" + a).css("background-color",
		"#ffffff"), $("#" + a).css("color", "#606060"), $("#" + a).siblings("label").removeClass("highlight")) : ($("#" + a).css("background-color", "#BC1F37"), $("#" + a).css("color", "#ffffff"), $("#" + a).siblings("label").addClass("highlight")));
	$("#" + a).val() != d && $("#" + a).val(d);
	return e ? !1 : !0
}

function populateTime(a) {
	var b = "Start" == a ? "00:00" : "23:59";
	"" == $("#" + a + "Time").val() && $("#" + a + "Time").val(b)
}

function compareIP() {
	for (var a = $("#GX_THIS_IP").val().split("."), b = $("#GX_SUBNET").val().split("."), c = $("#GX_GATEWAY").val().split("."), d = !0, e = 0; 4 > e; e++) 255 == parseInt(b[e], 10) && parseInt(a[e], 10) != parseInt(c[e], 10) && (d = !1);
	d ? ($("#GX_GATEWAY").removeClass("highlight"), $("#GX_GATEWAY").siblings("label").html(langtag.TagDefaultGateway + " <span class='required'>*</span>"), $("#GX_GATEWAY").siblings("label").removeClass("highlight")) : ($("#GX_GATEWAY").addClass("highlight"), $("#GX_GATEWAY").siblings("label").html(langtag.TagInvalidGateway),
		$("#GX_GATEWAY").siblings("label").addClass("highlight"))
}

function checkDateDiff(a, b) {
	if ("User" == a) {
		var c = $("#StartDate").val().split(" ");
		a = (new Date(monthnum[c[1]] + "/" + c[0] + "/" + c[2] + " " + $("#StartTime").val())).getTime();
		c = $("#ExpiryDate").val().split(" ");
		c = (new Date(monthnum[c[1]] + "/" + c[0] + "/" + c[2] + " " + $("#ExpiryTime").val())).getTime();
		a > c ? ($("#StartDate").addClass("highlight"), $("#StartTime").addClass("highlight"), $("#ExpiryDate").addClass("highlight"), $("#ExpiryTime").addClass("highlight")) : ($("#StartDate").removeClass("highlight"), $("#StartTime").removeClass("highlight"),
			$("#ExpiryDate").removeClass("highlight"), $("#ExpiryTime").removeClass("highlight"))
	} else "Report" == a ? (c = $("#StartDate").val().split(" "), a = c[1] + "/" + c[0] + "/" + c[2] + " " + $("#StartTime").val(), a = (new Date(a)).getTime(), c = $("#EndDate").val().split(" "), c = c[1] + "/" + c[0] + "/" + c[2] + " " + $("#EndTime").val(), c = (new Date(c)).getTime(), a > c ? ($("#StartDate").addClass("highlight"), $("#StartTime").addClass("highlight"), $("#EndDate").addClass("highlight"), $("#EndTime").addClass("highlight")) : ($("#StartDate").removeClass("highlight"),
			$("#StartTime").removeClass("highlight"), $("#EndDate").removeClass("highlight"), $("#EndTime").removeClass("highlight"))) : "Holiday" == a ? (c = $("#HolidayStart" + b).val().split(" "), a = c[1] + "/" + c[0] + "/" + c[2] + " 00:00:00", a = (new Date(a)).getTime(), c = $("#HolidayEnd" + b).val().split(" "), c = c[1] + "/" + c[0] + "/" + c[2] + " 00:00:00", c = (new Date(c)).getTime(), a > c ? ($("#HolidayStart" + b).addClass("highlight"), $("#HolidayEnd" + b).addClass("highlight")) : ($("#HolidayStart" + b).removeClass("highlight"), $("#HolidayEnd" + b).removeClass("highlight"))) :
		"AccessLevelStartDate" == a && (c = $("#AccessLevelStartDate" + b).val().split("/"), a = (new Date(c[1] + "/" + c[0] + "/" + c[2] + " " + $("#AccessLevelStartTime" + b).val())).getTime(), c = $("#AccessLevelEndDate" + b).val().split("/"), c = (new Date(c[1] + "/" + c[0] + "/" + c[2] + " " + $("#AccessLevelEndTime" + b).val())).getTime(), a > c ? ($("#AccessLevelStartDate" + b).addClass("highlight"), $("#AccessLevelStartTime" + b).addClass("highlight"), $("#AccessLevelEndDate" + b).addClass("highlight"), $("#AccessLevelEndTime" + b).addClass("highlight")) : ($("#AccessLevelStartDate" +
			b).removeClass("highlight"), $("#AccessLevelStartTime" + b).removeClass("highlight"), $("#AccessLevelEndDate" + b).removeClass("highlight"), $("#AccessLevelEndTime" + b).removeClass("highlight")))
}

function compareTimes(a, b) {
	var c = parseInt($("#StartTime" + a).val().replace(":", ""), 10),
		d = parseInt($("#EndTime" + a).val().replace(":", ""), 10);
	"Start" == b && c > d && 0 < d && $("#StartTime" + a).val($("#EndTime" + a).val());
	"End" == b && c > d && 0 < d && $("#EndTime" + a).val($("#StartTime" + a).val())
}

function escapeHTML(a) {
	return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}

function specialChars(a, b) {
	if ("undefined" == typeof a) return "";
	var c = "",
		d;
	a = a.toString();
	if ("remove" == b) {
		for (d = 0; d < a.length; d++) c = "&" == a.charAt(d) ? c + String.fromCharCode(17) : "=" == a.charAt(d) ? c + String.fromCharCode(18) : c + a.charAt(d);
		return c
	}
	if ("XMLremove" == b) return a = a.replace(/&/g, "%26"), a = a.replace(/=/g, "%3D");
	if ("XMLreplace" == b) return a = a.replace(/%26/g, "&"), a = a.replace(/%3D/g, "=");
	for (d = 0; d < a.length; d++) c = 17 == a.charCodeAt(d) ? c + "&" : 18 == a.charCodeAt(d) ? c + "=" : c + a.charAt(d);
	return "fullreplace" == b ? escapeHTML(c) :
		c
}

function invalidEmail(a) {
	return a.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/) ? !1 : !0
}

function heartbeat(a) {
	runQuery(0 == servertype ? "ajax_request.php" : "PRT_CTRL_DIN_ISAPI.dll", 0 == servertype ? "type=heartbeat" : "Command&Type=Session&SubType=Heartbeat", 1 == servertype, !0).done(function (b) {
		"<invalid session> < Packet not Init and not encrypted. >" == b ? (b = 0 == servertype ? "login.php" : "login.htm", window.location = b + "?" + Math.random().toString(16).substring(2, 8).toLowerCase()) : "<invalid session>" == b.substr(0, 17) ? (b = 0 == servertype ? "login.php?logout" : "login.htm?logout", window.location = b + "?" + Math.random().toString(16).substring(2,
			8).toLowerCase()) : (1 == servertype && (b = decryptAES(b)), a("OK" == b.substr(0, 2)))
	})
}

function printPage(a) {
	if ("" != $("#" + a).html()) {
		var b = $("h1:first").text() + " - " + $("#CurrentSite option:selected").text(),
			c = $(".exportToPDFReportSubtitle option:selected").text() + " - " + $("#dategenerated").text();
		if (1 == ($.browser.msie && "9." == $.browser.version.substring(0, 2))) {
			var d = window.open("", "", "height=600,width=1000");
			d.document.write($("html").html());
			d.document.getElementsByTagName("body")[0].style.display = "block";
			a = d.document.getElementById("headertop");
			null != a && (a.style.display = "none");
			a = d.document.getElementById("headerbar");
			null != a && (a.style.display = "none");
			a = d.document.getElementsByTagName("h1")[0];
			null != a && (a.style.marginLeft = "0px");
			null != a && (a.innerHTML = b);
			a = d.document.getElementById("buttonbar");
			null != a && (a.style.display = "none");
			a = d.document.getElementById("topfade");
			null != a && (a.style.display = "none");
			a = d.document.getElementById("alertcontainer");
			null != a && (a.style.display = "none");
			a = d.document.getElementById("footer");
			null != a && (a.style.display = "none")
		} else b = "<html><head><title>Protege GX - " + b + "</title><link rel='stylesheet' type='text/css' href='include/stylesheet.css'>" +
			("<body><h1>" + b + "</h1><h1 style='font-size:18px;'>" + c + "</h1>" + $("#" + a).html() + "</div></body></html>"), d = window.open("", "", "height=600,width=1000"), d.document.write(b), d.document.getElementsByTagName("body")[0].style.display = "block";
		a = d.document.getElementById("filterrow");
		null != a && (a.style.display = "none");
		d.document.close();
		d.focus();
		setTimeout(function () {
			d.print();
			d.close()
		}, 100)
	} else userApprove("<p>Please select a Report and click View before Printing.</p>", "OK", function () {});
	return !1
}

function exportToPDF(a) {
	if ("" != $("#" + a).html()) {
		var b = $("h1:first").text() + " - " + $("#CurrentSite option:selected").text(),
			c = $(".exportToPDFReportSubtitle option:selected").text() + " - " + $("#dategenerated").text(),
			d = location.href.substring(0, location.href.lastIndexOf("/") + 1),
			e = $("<div>" + $("#" + a).html() + "</div>");
		e.find("#filterrow").remove();
		a = "<html><head><title>Protege GX - " + b + "</title>" + ("<link rel='stylesheet' type='text/css' href='" + d + "include/stylesheet.css'>") + ('<body style="display:block"><div id=\'' +
			a + "' style='height: auto; max-height: none;'><h1>" + b + "</h1><h1 style='font-size:18px;'>" + c + "</h1>" + e.html() + "</div></body></html>");
		$("#printtopdfform").html('<form action="include/printToPDF.php" name="printtopdf" method="post" style="display:none;"><input type="hidden" name="html" value="' + encodeURI(a) + '" /><input type="hidden" name="filename" value="Protege GX - ' + b + '" /></form>');
		document.forms.printtopdf.submit()
	} else userApprove("<p>Please select a Report and click View before Exporting.</p>",
		"OK",
		function () {});
	return !1
}

function downloadCSV(a, b) {
	a = new Blob([a], {
		type: "text/csv"
	});
	var c = document.createElement("a");
	c.download = b;
	c.href = window.URL.createObjectURL(a);
	c.style.display = "none";
	c = new Blob([a], {
		type: "text/csv;charset=utf-8;"
	});
	navigator.msSaveBlob ? navigator.msSaveBlob(c, b) : (a = document.createElement("a"), void 0 !== a.download && (c = URL.createObjectURL(c), a.setAttribute("href", c), a.setAttribute("download", b), a.style.visibility = "hidden", document.body.appendChild(a), a.click(), document.body.removeChild(a)))
}

function exportToCSV(a) {
	for (var b = [], c = document.querySelectorAll("table tr"), d = 0; d < c.length; d++) {
		for (var e = [], f = c[d].querySelectorAll("td, th"), k = 0; k < f.length; k++) e.push(f[k].innerText);
		b.push(e.join(","))
	}
	downloadCSV(b.join("\n"), a);
	return !1
}

function jumpTo(a, b) {
	var c = 0 == servertype ? "php" : "htm";
	a = "" == a || "" == b || "" == $("#" + b).val() || "2147483647" == $("#" + b).val() || null == $("#" + b).val() ? a + "." + c : a + "." + c + "?id=" + $("#" + b).val();
	window.open(a)
}

function minsToHours(a) {
	var b = Math.floor(a / 60);
	return b + ":" + str_pad_left(2, "0", Math.round(a - 60 * b))
}

function centreText(a, b) {
	for (; a.length < b;) a = " " + a + " ";
	return a.substr(0, b)
}

function highlightFields(a, b, c) {
	if ("wizard" == a) var d = "IPAddress" + b,
		e = "IPPort" + b;
	else "reportip" == a && (d = 1 == b ? "IPAddress" : "SecondaryIPAddress", e = 1 == b ? "IPPortNumber2" : "SecondaryIPPortNumber");
	c ? ($("#" + d).addClass("highlight"), $("#" + d).siblings("label").addClass("highlight"), $("#" + e).addClass("highlight"), $("#" + e).siblings("label").addClass("highlight")) : ($("#" + d).removeClass("highlight"), $("#" + d).siblings("label").removeClass("highlight"), $("#" + e).removeClass("highlight"), $("#" + e).siblings("label").removeClass("highlight"))
}

function checkIPAddressAndPort(a) {
	if ("wizard" == a) {
		var b = $("#IPAddress1").val() == controllerip[0] && $("#IPPort1").val() == controllerip[1] ? !0 : !1,
			c = $("#IPAddress2").val() == controllerip[0] && $("#IPPort2").val() == controllerip[1] ? !0 : !1;
		b || c ? $("#ButtonSaveandReturntoMenu3").prop("disabled", !0) : $("#ButtonSaveandReturntoMenu3").prop("disabled", !1)
	} else "reportip" == a && (b = $("#IPAddress").val() == controllerip[0] && $("#IPPortNumber2").val() == controllerip[1] ? !0 : !1, c = $("#SecondaryIPAddress").val() == controllerip[0] && $("#SecondaryIPPortNumber").val() ==
		controllerip[1] ? !0 : !1);
	b ? highlightFields(a, 1, !0) : highlightFields(a, 1, !1);
	c ? highlightFields(a, 2, !0) : highlightFields(a, 2, !1)
}

function moduleChangeEvent(a, b) {
	if ("Output" == a)
		if (4 == b) {
			for (var c = $("#ModuleOutput").val(), d = "<option value='2147483647'>" + langtag.OutputNotSet + "</option>", e = 0; 20 > e; e++) d += "<option value='" + e + "'>" + (e + 1) + "</option>";
			$("#ModuleOutput").html(d);
			$("#ModuleOutput").val(c)
		} else {
			c = $("#ModuleOutput").val();
			d = "<option value='2147483647'>" + langtag.OutputNotSet + "</option>";
			for (e = 0; 16 > e; e++) d += "<option value='" + e + "'>" + (e + 1) + "</option>";
			$("#ModuleOutput").html(d);
			16 > c || 2147483647 == c ? $("#ModuleOutput").val(c) :
				$("#ModuleOutput").val(2147483647)
		}
	2 > recordList.length && ("Input" != a && "Output" != a || rePopulateAddressRange(b, "ModuleAddress"), toggleDropDownMenu("Module", "ModuleAddress", 1, "off"), checkAddressConflict(a), "TroubleInput" == a && toggleModuleAddressDoor(b))
}

function convertToOptions(a, b) {
	var c = [];
	if ("<no response>" == a) return 0 == b ? "" : "<option value='2147483647'>" + b + "</option>";
	a = a.split("&");
	0 == b ? b = "" : (b = "<option value='2147483647'>" + b + "</option>", c.push("2147483647"));
	for (var d = [], e = 0; e < a.length; e++) {
		var f = a[e].split("="),
			k = specialChars(f[1], 0 == servertype ? "XMLreplace" : "fullreplace");
		d.push([k, f[0]])
	}
	d.sort(function (a, b) {
		a = a[0].toLowerCase();
		b = b[0].toLowerCase();
		return a > b ? 1 : -1
	});
	for (e = 0; e < d.length; e++) - 1 == $.inArray(d[e][1], c) && (c.push(d[e][1]), b += "<option value='" +
		d[e][1] + "'>" + d[e][0] + "</option>");
	return b
}

function addSlider(a, b, c, d, e) {
	"" != a && $("#" + a).slider({
		range: "min",
		value: e,
		min: c,
		max: d,
		slide: function (c, d) {
			$("#" + b).val(d.value);
			changes = !0;
			"IPPortNumber2" == b ? (Service.checkValidConfig(1), checkIPAddressAndPort("reportip")) : "SecondaryIPPortNumber" == b ? (Service.checkValidConfig(2), checkIPAddressAndPort("reportip")) : "ModuleUDPPort" == b || "TouchScreenUDPPort" == b ? Settings.checkDuplicatePort(b) : "IPPort1" == b || "IPPort2" == b ? checkIPAddressAndPort("wizard") : "ReportingId" == b && 0 == d.value && $("#ReportingId").val(langtag.ReportingIDAuto);
			1 < recordList.length && $("#" + a.replace("Slider", "")).addClass("multiselect")
		}
	});
	$("#" + b).bind("keyup change", function (e) {
		e = "keyup" == e.type ? e.which : "";
		if (9 != e) {
			if ("" === $("#" + b).val()) var f = c;
			else f = parseInt($("#" + b).val(), 10), 38 == e ? f += 1 : 40 == e && --f, f < parseInt(c, 10) ? f = c : f > parseInt(d, 10) ? f = d : isNaN(f) && (f = c);
			$("#" + b).val(f);
			"" != a && $("#" + a).slider("option", "value", f);
			changes = !0;
			"IPPortNumber2" == b ? (Service.checkValidConfig(1), checkIPAddressAndPort("reportip")) : "SecondaryIPPortNumber" == b ? (Service.checkValidConfig(2),
				checkIPAddressAndPort("reportip")) : "ModuleUDPPort" == b || "TouchScreenUDPPort" == b ? Settings.checkDuplicatePort(b) : ("IPPort1" == b || "IPPort2" == b) && checkIPAddressAndPort("wizard")
		}
	})
}

function getRecordIdentifier(a) {
	var b = "GXT_AUTOMATION_TBL" == a ? 9 : 10;
	return (a.substr(4, 1) + a.substr(5, a.length - b).toLowerCase()).replace("level", "Level").replace("type", "Type").replace("report", "Report").replace("expander", "Expander").replace("group", "Group").replace("Pgm", "PGM").replace("evatorcar", "evatorCar").replace("number", "Number").replace("function", "Function").replace("unit", "Unit").replace("input", "Input") + "Id"
}

function addRecordToList(a, b, c) {
	$("#" + a + b).addClass("selected"); - 1 == $.inArray(parseInt(b, 10), recordList) && recordList.push(parseInt(b, 10));
	if (c) {
		c = 0 == servertype ? "ajax_requestdetail.php" : "PRT_CTRL_DIN_ISAPI.dll";
		var d = "";
		0 == servertype ? (d = "subtype=" + a + "&id=" + b, "GXT_MENUGROUPS_TBL" == a && (d += "&ControllerID=" + controller[b])) : d = "GXT_OPERATORS_TBL" == a ? "Command&Type=Session&SubType=GetOperator&OperatorId=" + b : "Request&Type=Detail&SubType=" + a + "&RecId=" + b;
		runQuery(c, d, 1 == servertype, !0).done(function (b) {
			b = decryptAES(b);
			b = convertToObject(b);
			recordStore[b[getRecordIdentifier(a)]] = b
		})
	}
}

function removeFormHighlight(a) {
	$(".multiselect").removeClass("multiselect");
	changes = !1
}

function resetFormFields(a) {
	recordStore.MultiSelect = !1;
	$("#" + a + "_FORM").each(function () {
		$(this).find(":input").each(function () {
			1 != $("#" + this.id).data("disabled") && ($("#" + this.id).prop("disabled", !1), $("#" + this.id + "Slider").slider("enable"))
		})
	});
	removeFormHighlight(a);
	$("#" + a + "_FORM :input").unbind("change.multiselect");
	for (var b = ["CurrentSite", "ControllerID"], c = 0; c < b.length; c++) $("#" + b[c]).prop("disabled", !1);
	"GXT_USERS_TBL" == a && $("#Photoform").each(function () {
		$(this).find(":input").each(function () {
			$("#" +
				this.id).prop("disabled", !1)
		})
	});
	"GXT_USERS_TBL" == a && 0 != $("tr[id*=AccessLevelsRow]").length && $("tr[id*=AccessLevelsRow]").remove()
}

function getFormChanges(a) {
	var b = {};
	$(".multiselect").each(function () {
		if ("Img" == this.id.substr(-3)) {
			var c = this.id.substr(0, this.id.length - 3),
				d = $("#" + c).is(":checked") ? "true" : "false";
			b[c] = d
		} else "GXT_USERS_TBL" == a && "StartDate" == this.id ? b[this.id] = convertDateString(this.value) + "T" + $("#StartTime").val() + ":00" : "GXT_USERS_TBL" == a && "ExpiryDate" == this.id ? b[this.id] = convertDateString(this.value) + "T" + $("#ExpiryTime").val() + ":00" : "GXT_EVENTREPORTS_TBL" == a && "StartDate" == this.id ? b[this.id] = convertDateString(this.value) +
			"T" + $("#StartTime").val() + ":00" : "GXT_EVENTREPORTS_TBL" == a && "EndDate" == this.id ? b[this.id] = convertDateString(this.value) + "T" + $("#EndTime").val() + ":00" : "GXT_OPERATORS_TBL" == a && "Timeout" == this.id ? b[this.id] = 60 * parseInt(this.value, 10) : "GXT_SCHEDULES_TBL" != a || "StartTime" != this.id.substr(0, 9) && "EndTime" != this.id.substr(0, 7) ? b[this.id] = encodeURIComponent(specialChars(this.value, 0 == servertype ? "XMLremove" : "remove")) : b[this.id] = 5 == this.id.length ? "1-1-1970T" + this.id : this.value
	});
	return b
}

function selectRecord(a, b, c) {
	selectedRecordId = b;
	discardChanges(function (d) {
		if (d) {
			0 == b && $("a[id^=" + a + "]").first().each(function () {
				addRecordToList(a, this.id.replace(a, ""), !1)
			});
			var e = !0;
			0 == servertype && "GXT_DAYLIGHTSAVINGS_TBL" == a ? e = !1 : (d = "GXT_ROLES_TBL GXT_CAMERAS_TBL GXT_DAYLIGHTSAVINGS_TBL GXT_FLOORS_TBL GXT_INPUTEXPANDERS_TBL GXT_PGMEXPANDERS_TBL".split(" "), 1 == servertype && -1 < $.inArray(a, d) && (e = !1));
			if (!e) return $("a[id^=" + a + "]").removeClass("selected"), requestDetail(a, b), recordList = [b], $("a[id^=" +
				a + b + "]").addClass("selected"), !1;
			d = !1;
			e = -1;
			var f = !1;
			null == c ? f = d = !0 : c.ctrlKey ? f = $("a[id^=" + a + b + "]").hasClass("selected") ? !1 : !0 : c.shiftKey ? (f = d = !0, recordList != [] && (e = b)) : f = d = !0;
			var k = 0 == recordList.length ? -1 : recordList[recordList.length - 1];
			if (d || -1 < e) $("a[id^=" + a + "]").removeClass("selected"), recordList = [];
			if (-1 < e) {
				var g = !1;
				b > k ? $("#listcontents a[id^=" + a + "]").each(function () {
					var c = this.id.replace(a, "");
					c == k && (g = !0);
					c == b && (g = !1);
					g && addRecordToList(a, c, null == recordStore[c])
				}) : b < k && $("#listcontents a[id^=" +
					a + "]").each(function () {
					var c = this.id.replace(a, "");
					c == b && (g = !0);
					g && addRecordToList(a, c, null == recordStore[c]);
					c == k && (g = !1)
				})
			}
			if (f) 0 == recordList.length ? addRecordToList(a, b, !1) : addRecordToList(a, b, null == recordStore[b]);
			else if (1 < recordList.length)
				for ($("a[id^=" + a + b + "]").removeClass("selected"), e = recordList.length; 0 <= e; e--) recordList[e] == b && recordList.splice(e, 1);
			c && c.preventDefault();
			if (1 == recordList.length) resetFormFields(a), requestDetail(a, recordList[0]);
			else if (selectedRecordId = null, 0 == recordStore.MultiSelect) {
				clearForm(a, !1);
				$("#" + a + "_FORM").each(function () {
					$(this).find(":input").each(function () {
						"disabled" == $("#" + this.id).data("multiselect") && ($("#" + this.id).prop("disabled", !0), $("#" + this.id + "Slider").slider("disable"))
					})
				});
				$("#" + a + "_FORM :input").bind("change.multiselect", function () {
					"disabled" != $(this).data("multiselect") && ($(this).addClass("multiselect"), "GXT_USERS_TBL" == a ? ("StartTime" == this.id && $("#StartDate").addClass("multiselect"), "ExpiryTime" == this.id && $("#ExpiryDate").addClass("multiselect")) : "GXT_EVENTREPORTS_TBL" ==
						a && ("StartTime" == this.id && $("#StartDate").addClass("multiselect"), "EndTime" == this.id && $("#EndDate").addClass("multiselect")))
				});
				d = ["CurrentSite", "ControllerID"];
				for (e = 0; e < d.length; e++) $("#" + d[e]).prop("disabled", !0);
				"GXT_USERS_TBL" == a && $("#Photoform").each(function () {
					$(this).find(":input").each(function () {
						$("#" + this.id).prop("disabled", !0)
					})
				});
				recordStore.MultiSelect = !0
			}
		}
	});
	return !1
}

function ajaxSearch(a, b) {
	if (1 == servertype && "GXT_OPERATORS_TBL" == a) {
		var c = 0 == servertype ? "ajax_search.php" : "PRT_CTRL_DIN_ISAPI.dll";
		b = "Command&Type=Session&SubType=ListOperators&str=" + encodeURIComponent(specialChars(b, "remove"))
	} else c = 0 == servertype ? "ajax_search.php" : "PRT_CTRL_DIN_ISAPI.dll", b = "Request&Type=List&SubType=" + a + "&str=" + encodeURIComponent(specialChars(b, "remove"));
	runQuery(c, b, 1 == servertype, !0).done(function (b) {
		b = decryptAES(b);
		var c = "GXT_AREAS_TBL GXT_DOORS_TBL GXT_INPUTS_TBL GXT_PGMS_TBL GXT_PROGRAMMABLEFUNCTIONS_TBL GXT_SERVICES_TBL GXT_USERS_TBL".split(" "),
			d = {
				GXT_AREAS_TBL: "Area",
				GXT_DOORS_TBL: "Door",
				GXT_INPUTS_TBL: "Input",
				GXT_PGMS_TBL: "Output",
				GXT_SERVICES_TBL: "Service",
				GXT_USERS_TBL: "User"
			};
		if ("<no response>" === b || "" === b || "Request Failed" == b.substr(0, 14)) $("#listcontents").html("<p>" + langtag.TagNonefound + "</p>");
		else {
			b = b.split("&");
			var k = getCookie("WXpert"),
				g = "";
			0 == servertype && -1 < $.inArray(a, c) ? g = "GX" : 1 == servertype && "GXT_USERS_TBL" == a && 1 == k && (g = "WX");
			$("#listcontents").html("");
			for (c = 0; c < b.length; c++) {
				k = b[c].split("=");
				var l = specialChars(k[1], 0 ==
					servertype ? "XMLreplace" : "replace");
				"GX" === g ? l = "<img src='images/buttons/add.png' class='cpimg' onClick='displayControlPanel(event, \"" + d[a] + '", ' + k[0] + ", 1, " + k[0] + ");'><span>" + l + "</span>" : "WX" === g && (l = "<img src='images/buttons/add.png' class='cpimg' onClick='displayControlPanel(event, \"User\", " + k[0] + ", 1, " + k[0] + ");'><span>" + l + "</span>");
				var m = -1 == $.inArray(parseInt(k[0], 10), recordList) ? "" : " class='selected'";
				$("#listcontents").append("<a id='" + a + k[0] + "' href='' " + m + " onClick=\"return selectRecord('" +
					a + "', " + k[0] + ', event);">' + l + "</a>")
			}
		}
	})
}

function ajaxSearchCtrl(a, b, c) {
	controller = [];
	b = "Request&Type=List&SubType=" + a + "&str=" + encodeURIComponent(specialChars(b, "remove")) + "&includectrl";
	"undefined" !== typeof c && (b += "&ControllerID=" + c);
	runQuery("ajax_search.php", b, !1, !0).done(function (b) {
		b = decryptAES(b);
		var c = "",
			d = "GXT_AREAS_TBL GXT_DOORS_TBL GXT_INPUTS_TBL GXT_PGMS_TBL GXT_PROGRAMMABLEFUNCTIONS_TBL GXT_SERVICES_TBL".split(" "),
			k = {
				GXT_AREAS_TBL: "Area",
				GXT_DOORS_TBL: "Door",
				GXT_INPUTS_TBL: "Input",
				GXT_PGMS_TBL: "Output",
				GXT_SERVICES_TBL: "Service"
			};
		if ("<no response>" === b || "" === b) c = "<p>" + langtag.TagNonefound + "</p>";
		else {
			var g = convertToObject(b);
			b = b.split("&");
			for (var l = 0; l < b.length; l++) {
				var m = b[l].split("=");
				if ("Name" == m[0].substr(0, 4)) {
					m[0] = m[0].substr(4);
					var n = specialChars(m[1], "XMLreplace"); - 1 < $.inArray(a, d) && (n = "<img src='images/buttons/add.png' class='cpimg' onClick='displayControlPanel(event, \"" + k[a] + '", ' + m[0] + ", 1, " + m[0] + ");'><span>" + n + "</span>");
					var p = -1 == $.inArray(parseInt(m[0], 10), recordList) ? "" : " class='selected'";
					c += "<a id='" +
						a + m[0] + "' href='' " + p + " onClick=\"return selectRecord('" + a + "', " + m[0] + ', event);">' + n + "</a>";
					controller[m[0]] = g["Controller" + m[0]]
				}
			}
		}
		$("#listcontents").html(c);
		$("#listcontents").slideDown()
	})
}

function ctrlFilter(a) {
	ajaxSearchCtrl(a, $("#searchstr").val() == langtag.TagSearch ? "" : $("#searchstr").val(), $("#ControllerID").val());
	setTimeout(function () {
		var b = $("a[id^=" + a + "]").first().attr("id");
		"undefined" !== typeof b ? selectRecord(a, b.replace(a, "")) : selectRecord(a, "");
		"undefined" !== typeof b && "GXT_DAYLIGHTSAVINGS_TBL" == a ? $("#alink").parent("li").addClass("hiddentab") : $("#alink").parent("li").removeClass("hiddentab")
	}, 500)
}

function newRecord(a) {
	discardChanges(function (b) {
		b && (resetFormFields(a), requestDetail(a, ""))
	});
	return !1
}

function newControllerRecord(a) {
	resetFormFields(a);
	1 == servertype ? newRecord(a) : 2147483647 == $("#ControllerID").val() ? flashMessage(langtag.MsgError, langtag.MsgSelectController) : newRecord(a);
	return !1
}

function selectNextRecord(a) {
	var b = -1;
	0 == $("#listcontents a[id^=" + a + "]").length ? clearForm(a, !0) : ($("#listcontents a[id^=" + a + "]").each(function () {
		b = parseInt(this.id.replace(a, ""), 10);
		if (b > recordList[recordList.length - 1]) return !1
	}), -1 == b ? requestFirst(a) : selectRecord(a, b, null))
}

function addAccessLevelRow(a, b) {
	var c = 0 == servertype ? getLocalTime() : parseInt(sessionStorage.getItem("headerts"), 10);
	b = "<tr id='AccessLevelsRow" + a + "' onClick=\"selectTableRow('AccessLevelsRow', " + a + ", event);\" style='cursor:pointer'><td unselectable='on'>" + accesslevelname[b] + "<input type='checkbox' id='AccessLevelsRowDelete" + a + "' class='hiddentab'></td><td unselectable='on'><input type='checkbox' id='AccessLevelExpiry" + a + "' class='hiddentab'><a href='' id='AccessLevelExpiry" + a + "Link'><img id='AccessLevelExpiry" +
		a + "Img' src='images/checkbox_off.jpg'></a></td><td nowrap unselectable='on'><input type='text' id='AccessLevelStartDate" + a + "' name='AccessLevelStartDate" + a + "' class='datewidth' value='" + convertTimeStamp(c, "shortdate") + "' readonly disabled onChange=\"checkDateDiff('AccessLevelStartDate', " + a + ");\" onClick='noProp(event);'><input type='text' id='AccessLevelStartTime" + a + "' name='AccessLevelStartTime" + a + "' class='timewidth' value='00:00' disabled onChange=\"checkDateDiff('AccessLevelStartDate', " + a + ");\" onClick='noProp(event);'></td><td nowrap unselectable='on'><input type='text' id='AccessLevelEndDate" +
		a + "' name='AccessLevelEndDate" + a + "' class='datewidth' value='" + convertTimeStamp(c, "shortdate") + "' readonly disabled onChange=\"checkDateDiff('AccessLevelStartDate', " + a + ");\" onClick='noProp(event);'><input type='text' id='AccessLevelEndTime" + a + "' name='AccessLevelEndTime" + a + "' class='timewidth' value='00:00' disabled onChange=\"checkDateDiff('AccessLevelStartDate', " + a + ");\" onClick='noProp(event);'></td><td><select id='AccessLevelSchedule" + a + "' name='AccessLevelSchedule" + a + "' class='schedulewidth' onClick='noProp(event);'>" +
		h + "</select></td></tr>";
	$("#accesslevelsdetailslist .selectableTable").append(b);
	$("#AccessLevelExpiry" + a + "Link").attr("tabindex", 0).bind("keydown click", function (a) {
		return toggleCheckbox(this.id, a)
	});
	$("#AccessLevelStartDate" + a).datepicker({
		dateFormat: "dd/mm/y",
		gotoCurrent: !0
	});
	$("#AccessLevelEndDate" + a).datepicker({
		dateFormat: "dd/mm/y",
		gotoCurrent: !0
	});
	$("#AccessLevelStartTime" + a).timeEntry({
		show24Hours: !0,
		spinnerImage: ""
	});
	$("#AccessLevelEndTime" + a).timeEntry({
		show24Hours: !0,
		spinnerImage: ""
	})
}

function dateRangeOverlaps(a, b, c, d) {
	return Math.max(parseInt(b), parseInt(d)) - Math.min(parseInt(a), parseInt(c)) < parseInt(b) - parseInt(a) + (parseInt(d) - parseInt(c))
}

function addChildren(a) {
	a = a.split("_");
	for (var b in parentgroup) parentgroup[b] == a[2] && -1 == $.inArray(a[0] + "_" + a[1] + "_" + b, currentrecordgroups) && ($("#RecordGroupsRow" + a[0] + "_" + a[1] + "_" + b).removeClass("hiddentab"), $("#RecordGroupsRow" + a[0] + "_" + a[1] + "_" + b + " select").each(function () {
		this.selectedIndex = 0
	}), currentrecordgroups.push(a[0] + "_" + a[1] + "_" + b), addChildren(a[0] + "_" + a[1] + "_" + b))
}

function addToListSubmit(a, b) {
	var c = document.getElementById("Add" + a),
		d = "";
	for (b = 0; b < c.length; b++)
		if (c.options[b].selected)
			if (changes = !0, "RecordGroups" == a ? (d = c.options[b].value.split("_"), d = $("#AddSecLevel").val() + "_" + d[1]) : d = c.options[b].value, $("#" + a + "Row" + d).removeClass("hiddentab"), $("#" + a + "Row" + d + " select").each(function () {
					this.selectedIndex = 0
				}), "AccessLevels" == a) currentaccesslevels.push(d), currentaccesslevelsschedules.push(d + "_2147483647"), addAccessLevelRow(currentaccesslevels.length, d);
			else if ("Areas" ==
		a) currentareas.push(d);
	else if ("AreaGroups" == a) currentareagroups.push(d);
	else if ("ArmingAreaGroups" == a) currentarmingareagroups.push(d);
	else if ("CenconLocks" == a) currentlocks.push(d);
	else if ("CenconLockGroups" == a) currentlockgroups.push(d);
	else if ("CredentialTypes" == a) currentcredentialtypes.push(d);
	else if ("EntryCredentialTypes" == a) currententrycredentialtypes.push(d);
	else if ("ExitCredentialTypes" == a) currentexitcredentialtypes.push(d);
	else if ("Devices" == a) {
		"undefined" == typeof currentdevicelist[$("#DeviceType").val().toLowerCase()] &&
			(currentdevicelist[$("#DeviceType").val().toLowerCase()] = []);
		currentdevicelist[$("#DeviceType").val().toLowerCase()].push(d);
		var e = $("#DeviceType").val();
		$("#DevicesRow" + e + "_" + d).removeClass("hiddentab");
		$("#DevicesRow" + e + "_" + d + " select").each(function () {
			this.selectedIndex = 0
		})
	} else "Devices2" == a ? ("undefined" == typeof currentdevicelist2[$("#DeviceType").val().toLowerCase()] && (currentdevicelist2[$("#DeviceType").val().toLowerCase()] = []), currentdevicelist2[$("#DeviceType").val().toLowerCase()].push(d),
			e = $("#DeviceType").val(), $("#Devices2Row" + e + "_" + d).removeClass("hiddentab"), $("#Devices2Row" + e + "_" + d + " select").each(function () {
				this.selectedIndex = 0
			})) : "DisarmingAreaGroups" == a ? currentdisarmingareagroups.push(d) : "Doors" == a ? currentdoors.push(d) : "DoorGroups" == a ? currentdoorgroups.push(d) : "Elevators" == a ? currentelevators.push(d) : "ElevatorGroups" == a ? currentelevatorgroups.push(d) : "Filters" == a ? currentfilters.push(d) : "Floors" == a ? currentfloors.push(d) : "FloorGroups" == a ? currentfloorgroups.push(d) : "Holidays" ==
		a ? currentholidays.push(d) : "HolidayGroups" == a ? currentholidaygroups.push(d) : "Keypads" == a ? currentkeypads.push(d) : "KeypadGroups" == a ? currentkeypadgroups.push(d) : "MenuGroups" == a ? currentmenugroups.push(d) : "Outputs" == a ? currentoutputs.push(d) : "OutputGroups" == a ? currentoutputgroups.push(d) : "RecordGroups" == a ? currentrecordgroups.push(d) : "Services" == a ? currentservices.push(d) : "Sites" == a ? currentsites.push(d) : "Types" == a ? currenttypes.push(d) : "Users" == a && currentusers.push(d);
	if ("RecordGroups" == a)
		if ($("#AllRecordGroups").is(":checked")) {
			a =
				$("#AddSecLevel").val();
			for (b = 0; b < currentrecordgroups.length; b++) currentrecordgroups[b].substr(0, a.length) == a && ($("#RecordGroupsRow" + currentrecordgroups[b]).addClass("hiddentab"), currentrecordgroups.splice(b, 1));
			d = $("#AddSecLevel").val() + "_All";
			currentrecordgroups.push(d);
			$("#RecordGroupsRow" + d).removeClass("hiddentab")
		} else "" != d && addChildren(d);
	else "EntryCredentialTypes" == a ? DoorType.reOrderCredentialList("entry") : "ExitCredentialTypes" == a && DoorType.reOrderCredentialList("exit");
	stopAlert()
}

function populateRecordGroupList() {
	var a = $("#AddSite").val(),
		b = $("#AddSecLevel").val(),
		c = "",
		d;
	for (d in recordgroupname) {
		var e = d.split("_");
		if (e[0] == a) {
			for (var f = !0, k = 0; k < currentrecordgroups.length; k++)
				if (b + "_" + e[1] == currentrecordgroups[k] || "All" == e[1]) f = !1;
			f && (c += "<option value='" + d + "'>" + recordgroupname[d] + "</option>")
		}
	}
	$("#AddRecordGroups").html(c);
	a = !1;
	for (k = 0; k < currentrecordgroups.length; k++) currentrecordgroups[k] == b + "_All" && (a = !0);
	a ? ($("#AllRecordGroups").attr("checked", !0), $("#AllRecordGroupsLink").parent().addClass("disabled"),
		$("#AllRecordGroupsImg").attr("src", "images/checkbox_on.jpg"), $("#AddRecordGroups").attr("disabled", "disabled")) : ($("#AllRecordGroups").removeAttr("checked"), $("#AllRecordGroupsLink").parent().removeClass("disabled"), $("#AllRecordGroupsImg").attr("src", "images/checkbox_off.jpg"), $("#AddRecordGroups").removeAttr("disabled"))
}

function populateSecurityLevelList() {
	var a = $("#AddSite").val(),
		b = "",
		c;
	for (c in securitylevelname) c.substring(0, a.length) == a && (b += "<option value='" + c + "'>" + securitylevelname[c] + "</option>");
	$("#AddSecLevel").html(b);
	populateRecordGroupList()
}

function populateEventTypes() {
	var a = $("#KeywordSearch").val();
	$("#AddTypes").html("");
	for (var b in typename) 2147483647 != b && -1 == $.inArray(b, currenttypes) && -1 < typename[b].toLowerCase().indexOf(a.toLowerCase()) && $("#AddTypes").append("<option value='" + b + "'>" + specialChars(typename[b], "fullreplace") + "</option>")
}

function populateDeviceList(a) {
	if ("" == $("#DeviceType").val()) $("#Add" + a).html("");
	else {
		var b = "";
		var c = $("#DeviceType").val().toLowerCase();
		c = [recordFilterList[c], currentdevicelist[c]];
		for (var d in c[0]) 2147483647 != d && -1 == $.inArray(d, c[1]) && (b += "<option value='" + d + "'>" + c[0][d] + "</option>");
		$("#Add" + a).html(b)
	}
}

function addToList(a, b, c) {
	var d = "Devices2" == a ? "Devices" : a.replace(/ /gi, ""),
		e = "<h1>" + langtag["M" + d] + "</h1>";
	if ("RecordGroups" == d) {
		$("#messagefg > div > div").css("padding", "0 10px 0 15px");
		b = "";
		for (var f in sitename) b += "<option value='" + f + "'>" + sitename[f] + "</option>";
		a = "";
		for (f in securitylevelname) a += "<option value='" + f + "'>" + securitylevelname[f] + "</option>";
		e += "<p><label class='seclevel'>" + langtag.SLTagSite + "</label><select class='narrow' id='AddSite' onChange='populateSecurityLevelList();'>" + b +
			"</select></p><p><label class='seclevel'>" + langtag.SLTagSecLevel + "</label><select class='narrow' id='AddSecLevel' onChange='populateRecordGroupList();'>" + a + "</select></p><p><label class='seclevel'>" + langtag.TagAllRecordGroups + "</label><input type='checkbox' id='AllRecordGroups' class='hiddentab'><a href='' id='AllRecordGroupsLink'><img id='AllRecordGroupsImg' src='images/checkbox_off.jpg'></a></p><p><label class='seclevel'>" + langtag.SLTagRecordGroup + "</label><select id='AddRecordGroups' name='AddRecordGroups' multiple></select></p><p class='userapprovebuttons'><input type='button' value='" +
			langtag.TagOK + "' onClick=\"addToListSubmit('RecordGroups', '" + c + "');\"><input type='button' value='" + langtag.TagCancel + '\' onClick="stopAlert();"></p>'
	} else if ("Types" == d) {
		$("#messagefg > div > div").css("padding", "0 10px 0 15px");
		a = "";
		for (f in b) 2147483647 != f && -1 == $.inArray(f, c) && (a += "<option value='" + f + "'>" + specialChars(b[f], "fullreplace") + "</option>");
		e += "<p><label class='seclevel'>" + langtag.TypeKeywords + "</label><input type='text' id='KeywordSearch' class='narrow' onKeyup='populateEventTypes();'></p><p><select id='AddTypes' name='AddTypes' class='fullwidth' multiple>" +
			a + "</select></p><p class='userapprovebuttons'><input type='button' value='" + langtag.TagOK + "' onClick=\"addToListSubmit('Types', '" + c + "');\"><input type='button' value='" + langtag.TagCancel + '\' onClick="stopAlert();"></p>'
	} else if ("Devices" == d || "Devices2" == d) $("#messagefg > div > div").css("padding", "0 10px 0 15px"), e += "<p><label class='seclevel'>" + langtag.FiltersTagType + "</label><select class='narrow' id='DeviceType' onChange=\"populateDeviceList('" + a + "');\">" + ("<option value='Users'>" + langtag.MUsers +
			"</option><option value='Doors'>" + langtag.MDoors + "</option><option value='Inputs'>" + langtag.MInputs + "</option><option value='Outputs'>" + langtag.MOutputs + "</option><option value='TroubleInputs'>" + langtag.MTroubleInputs + "</option><option value='Areas'>" + langtag.MAreas + "</option><option value='Keypads'>" + langtag.MKeypads + "</option><option value='PhoneNumbers'>" + langtag.MPhoneNumbers + "</option><option value='ProgrammableFunctions'>" + langtag.MProgrammableFunctions + "</option><option value='AreaGroups'>" +
			langtag.MAreaGroups + "</option><option value='Floors'>" + langtag.MFloors + "</option><option value='InputTypes'>" + langtag.MInputTypes + "</option><option value='DoorGroups'>" + langtag.MDoorGroups + "</option><option value='MenuGroups'>" + langtag.MMenuGroups + "</option><option value='DoorTypes'>" + langtag.MDoorTypes + "</option><option value='HolidayGroups'>" + langtag.MHolidayGroups + "</option><option value='Schedules'>" + langtag.MSchedules + "</option>") + "</select></p><p><label class='seclevel'>" + langtag.FilterDevice +
		"</label><select id='Add" + a + "' name='Add" + a + "' multiple></select></p><p class='userapprovebuttons'><input type='button' value='" + langtag.TagOK + "' onClick=\"addToListSubmit('" + a + "', null);\"><input type='button' value='" + langtag.TagCancel + "' onClick='stopAlert();'></p>";
	else {
		$("#messagefg > div > div").css("padding", "0 10px 15px 15px");
		a = "";
		for (f in b) "AccessLevels" === d ? 2147483647 != f && (a += "<option value='" + f + "'>" + specialChars(b[f], "XMLreplace") + "</option>") : 2147483647 != f && -1 == $.inArray(f, c) && (a += "<option value='" +
			f + "'>" + specialChars(b[f], "fullreplace") + "</option>");
		e += "<p><select id='Add" + d + "' name='Add" + d + "' multiple class='multiplesel'>" + a + "</select></p><p class='selectp'>" + langtag.MsgSelectItems + "</p><input type='button' value='" + langtag.TagOK + "' onClick=\"addToListSubmit('" + d + "', '" + c + "');\"><input type='button' value='" + langtag.TagCancel + "' onClick='stopAlert();'>"
	}
	showMessage(e);
	"RecordGroups" == d ? ($("#AllRecordGroupsLink").attr("tabindex", 0).bind("keydown click", function (a) {
		return toggleCheckbox("AllRecordGroupsLink",
			a)
	}), populateSecurityLevelList()) : "Types" == d && $("#KeywordSearch").focus()
}

function deleteFromListAccessLevel(a, b) {
	accesslevelsListLength = accessLevelItems = $("input[id^=" + a + "Delete]").get().length - 1;
	$($("input[id^=" + a + "Delete]").get().reverse()).each(function (c) {
		if (this.checked) {
			var d = this.id.replace(a + "Delete", "");
			0 == servertype ? getLocalTime() : parseInt(sessionStorage.getItem("headerts"), 10);
			$("#" + a + d).remove();
			0 != b.length && (currentaccesslevels.splice(accesslevelsListLength - c, 1), currentaccesslevelsschedules.splice(accesslevelsListLength - c, 1))
		}
	})
}

function deleteFromList(a, b) {
	$("input[id^=" + a + "Delete]").each(function () {
		if (this.checked) {
			var c = this.id.replace(a + "Delete", ""),
				d = !0;
			if ("RecordGroupsRow" == a) {
				var e = c.split("_");
				"undefined" == typeof parentgroup[e[2]] ? d = !0 : -1 == $.inArray(e[0] + "_" + e[1] + "_" + parentgroup[e[2]], b) ? d = !0 : (d = langtag.SLDeleteParent.replace("<PARENTRECORDGROUP>", "(" + recordgroupname[e[0] + "_" + parentgroup[e[2]]] + ")"), userApprove("<h1>" + langtag.MsgError + "</h1><p>" + d + "</p>", "OK", function () {}), d = !1)
			} else if ("DevicesRow" == a || "Devices2Row" ==
				a) e = c.split("_"), devicetype = e[0], deviceid = e[1], b = "DevicesRow" == a ? currentdevicelist[devicetype.toLowerCase()] : currentdevicelist2[devicetype.toLowerCase()];
			if (d) {
				changes = !0;
				"CredentialsRow" == a ? $("#" + a + c).remove() : ($("#" + a + c).children("td").removeClass("selected"), $("#" + a + "Delete" + c).removeAttr("checked"), $("#" + a + c).addClass("hiddentab"));
				for (d = 0; d < b.length; d++) "DevicesRow" != a && "Devices2Row" != a || b[d] != deviceid ? b[d] == c && b.splice(d, 1) : b.splice(d, 1);
				"AllegionP1Row" == a ? checkDuplicatePIM(1) : "AllegionP2Row" ==
					a ? checkDuplicatePIM(2) : "EntryCredentialTypesRow" == a ? DoorType.reOrderCredentialList("entry") : "ExitCredentialTypesRow" == a && DoorType.reOrderCredentialList("exit")
			}
		}
	});
	return b
}

function refreshCurrent(a) {
	discardChanges(function (b) {
		b && (1 == recordList.length ? null != sessionStorage.getItem("tablename") ? (ajaxSearch(sessionStorage.getItem("tablename"), ""), sessionStorage.removeItem("tablename"), $("#TagRefresh").html(langtag.TagRefresh), $("#headertime").html(""), $("#headertime").removeClass("findreminder"), requestFirst("GXT_" + a.toUpperCase() + "S_TBL")) : "Settings" == a ? requestDetail("SETTINGS", 0) : "Policy" == a ? selectRecord("PASSWORDPOLICY", 0) : "OutputGroup" == a ? selectRecord("GXT_PGMGROUPS_TBL",
			$("#PGMGroupId").val()) : "Elevator" == a ? selectRecord("GXT_ELEVATORCARS_TBL", $("#ElevatorId").val()) : "Automation" == a ? selectRecord("GXT_AUTOMATION_TBL", $("#AutomationId").val()) : "DaylightSaving" == a ? selectRecord("GXT_DAYLIGHTSAVINGS_TBL", $("#DaylightSavingsId").val()) : "EventReport" == a ? selectRecord("GXT_EVENTREPORTS_TBL", 0 == servertype ? $("#EventReportId").val() : $("#ReportId").val()) : "EventFilter" == a ? selectRecord("GXT_EVENTFILTERS_TBL", $("#EventFilterId").val()) : "" != $("#" + a + "Id").val() && selectRecord("GXT_" +
			a.toUpperCase() + "S_TBL", $("#" + a + "Id").val()) : (b = "OutputGroup" == a ? "GXT_PGMGROUPS_TBL" : "Elevator" == a ? "GXT_ELEVATORCARS_TBL" : "Automation" == a ? "GXT_AUTOMATION_TBL" : "DaylightSaving" == a ? "GXT_DAYLIGHTSAVINGS_TBL" : "EventReport" == a ? "GXT_EVENTREPORTS_TBL" : "EventFilter" == a ? "GXT_EVENTFILTERS_TBL" : "GXT_" + a.toUpperCase() + "S_TBL", clearForm(b, ""), $("#" + b + "_FORM :input").removeClass("multiselect"), $(".checkboxp a img").removeClass("multiselect")))
	});
	return !1
}

function lockScreen() {
	$("#messagefg").css("display", "none");
	$("#alertfg").css("display", "none");
	$("#alertcontainer").css("display", "block");
	$("#alertbg").css("background", "transparent");
	setTimeout(function () {
		"none" == $("#alertfg").css("display") && "none" == $("#messagefg").css("display") && stopAlert()
	}, 1E3)
}

function getParameterByName(a) {
	a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	a = (new RegExp("[\\?&]" + a + "=([^&#]*)")).exec(window.location.search);
	return null == a ? "" : decodeURIComponent(a[1].replace(/\+/g, " "))
}

function getCookie(a) {
	var b = "";
	if ("SESSID" == a || "WXSequence" == a) {
		var c = document.cookie,
			d = c.indexOf(a + " ="); - 1 == d && (d = c.indexOf(a + "="));
		if (-1 < d)
			if (d = c.indexOf("=", d) + 1, a = c.indexOf(";", d), -1 == a && (a = c.length), c = unescape(c.substring(d, a)), "" == c) b = "";
			else return c
	} else
		for (c = decryptAES(localStorage.getItem("WXData")), c = c.split("&"), d = 0; d < c.length; d++) {
			var e = c[d].split(":");
			if (e[0] == a) {
				b = e[1];
				break
			}
		}
	return b.charAt(0).match(/[0-9]/) ? parseInt(b) : b
}

function licenceLimitReached() {
	$("#alink").attr("onclick", "").unbind("click");
	$("#clink").attr("onclick", "").unbind("click");
	$("#alink, #clink").bind("click", function () {
		userApprove("<h1>" + langtag.MsgLicenseLimit + "</h1><p>" + langtag.MsgUnableToProceed + "</p>", "OK", function () {});
		return !1
	})
}

function licenceLimitNotReached(a, b) {
	$("#alink").attr("onclick", "").unbind("click");
	$("#clink").attr("onclick", "").unbind("click");
	$("#alink").bind("click", function () {
		return newRecord(b)
	});
	$("#clink").bind("click", function () {
		return copyRecord(a)
	})
}

function deleteProgramming(a, b, c, d) {
	requestList(a, function (e) {
		if ("<no response>" != e) {
			e = e.split("&");
			for (var f = 0; f < e.length; f++) {
				var k = e[f].split("=");
				runQuery(0 == servertype ? "ajax_requestdetail.php" : "PRT_CTRL_DIN_ISAPI.dll", "Request&Type=Detail&SubType=" + a + "&RecId=" + k[0], 1 == servertype, !0).done(function (e) {
					e = decryptAES(e);
					e = convertToObject(e);
					e.Module == c && e.ModuleAddress == d && runQuery(0 == servertype ? "ajax_update.php" : "PRT_CTRL_DIN_ISAPI.dll", "Command&Type=Delete&SubType=" + a + "&RecId=" + e[b], 1 == servertype, !0)
				})
			}
		}
	})
}

function deleteExpanderRecord(a, b, c, d) {
	runQuery("PRT_CTRL_DIN_ISAPI.dll", "Request&Type=Detail&SubType=" + a + "&RecId=" + b, !0, !0).done(function (e) {
		e = decryptAES(e);
		var f = convertToObject(e).PhysicalAddress;
		runQuery("PRT_CTRL_DIN_ISAPI.dll", "Command&Type=Delete&SubType=" + a + "&RecId=" + b, !0, !0).done(function (e) {
			1 == servertype && (e = decryptAES(e));
			if ("OK" == e) {
				if (c)
					if (-1 == f) flashMessage(langtag.MsgError, langtag.MsgModuleAddressNotFound);
					else {
						var g = {
							GXT_KEYPADS_TBL: 2,
							GXT_INPUTEXPANDERS_TBL: 3,
							GXT_READEREXPANDERS_TBL: 4,
							GXT_PGMEXPANDERS_TBL: 5,
							GXT_ANALOGEXPANDERS_TBL: 6
						};
						deleteProgramming("GXT_INPUTS_TBL", "InputId", g[a], f);
						deleteProgramming("GXT_PGMS_TBL", "PGMId", g[a], f);
						deleteProgramming("GXT_TROUBLEINPUTS_TBL", "TroubleInputId", g[a], f)
					}
				$("#" + a + b).remove()
			}
			d(e)
		})
	})
}

function copyRecord(a) {
	1 == recordList.length && discardChanges(function (b) {
		if (b) {
			selectRecord("GXT_" + a.toUpperCase() + "S_TBL", $("#" + a + "Id").val());
			var c = [];
			$("#listcontents a").each(function () {
				c.push($(this).text())
			});
			b = $("#listcontents a.selected").text();
			for (var d = 1; - 1 < $.inArray(b + " [" + d + "]", c);) d++;
			"" != $("#" + a + "Id").val() && userApprove("<p>" + langtag["Duplicate" + a] + "</p>", "YN", function (b) {
				b && (b = a + "Id=" + $("#" + a + "Id").val() + "&action=copy&ext=" + d, "undefined" !== typeof controller && (b += "&ControllerID=" + controller[$("#" +
					a + "Id").val()]), runQuery("ajax_update.php?type=" + a.toLowerCase(), b, !1, !0).done(function (b) {
					b = decryptAES(b);
					if ("OK" == b) "MENUGROUP" == a.toUpperCase() ? ajaxSearchCtrl("GXT_" + a.toUpperCase() + "S_TBL", $("#searchstr").val() == langtag.TagSearch ? "" : $("#searchstr").val(), -1) : ajaxSearch("GXT_" + a.toUpperCase() + "S_TBL", $("#searchstr").val() == langtag.TagSearch ? "" : $("#searchstr").val()), requestList("GXT_" + a.toUpperCase() + "S_TBL", function (b) {
						b = b.split("&");
						var c = b[b.length - 1].split("=");
						addRecordToList("GXT_" + a.toUpperCase() +
							"S_TBL", c[0], !0);
						b.length > getCookie("WXNum" + a + "s") && licenceLimitReached()
					});
					else if ("ERROR" == b.substr(0, 5)) {
						var c = b.replace("ERROR ", "");
						flashMessage(langtag.MsgError, "undefined" == typeof langtag["GXMsg" + c] ? msg2 + "&nbsp;(" + b + ")" : langtag["GXMsg" + c])
					} else flashMessage(langtag.MsgError, langtag["Msg" + a + "NotCreated"] + "&nbsp;(" + b + ")")
				}))
			})
		}
	});
	return !1
}

function findSubmit(a) {
	if ("" != $("#SearchField").val()) {
		$("#FindButton").attr("disabled", "disabled");
		$("#exporteventalert").html(langtag.MsgSearching + " ... " + langtag.Uploadingpleasewait);
		var b = ""; - 1 < $.inArray($("#rectype").val(), ["select", "list"]) ? b = $("#SearchSelVal").val() : "text" == $("#rectype").val() && (b = $("#SearchVal").val());
		var c = $("#SearchField").val();
		"list" == $("#rectype").val() ? c = $("#SearchField").val().split("_")[3] : "GXT_SECURITYLEVELS_TBL" == a && "Table" == c.substr(0, 5) ? c = c.substr(5) : "GXT_ROLES_TBL" ==
			a && "Table" == c.substr(0, 5) && (c = c.substr(5));
		var d = "date" == $("#rectype").val() ? convertDateString($("#FromDateVal").val()) : "",
			e = "date" == $("#rectype").val() ? convertDateString($("#ToDateVal").val()) : "",
			f = "number" == $("#rectype").val() ? $("#FromNumberVal").val() : "",
			k = "number" == $("#rectype").val() ? $("#ToNumberVal").val() : "";
		"GXT_OPERATORS_TBL" == a && "Timeout" == c && (c = "OperatorTimeout", f = 60 * parseInt(f), k = 60 * parseInt(k));
		b = "type=find&subtype=" + a + "&rectype=" + $("#rectype").val() + "&record=" + c + "&str=" + b + "&contain=" +
			$("#DoesContain").is(":checked") + "&min=" + f + "&max=" + k + "&from=" + d + "&to=" + e;
		runQuery("ajax_request.php", b, !1, !0).done(function (b) {
			b = decryptAES(b);
			if ("<no response>" == b || "" == b) $("#listcontents").html("<p>" + langtag.TagNonefound + "</p>"), newRecord(a);
			else {
				b = b.split("&");
				for (var c = "", d = 0, e = 0; e < b.length; e++) {
					var f = b[e].split("=");
					0 == e && (d = f[0]);
					c += "<a id='" + a + f[0] + "' href='' onclick=\"return selectRecord('" + a + "', " + f[0] + ');">' + specialChars(f[1], "XMLreplace") + "</a>"
				}
				$("#listcontents").html(c);
				selectRecord(a,
					d)
			}
			$("#exporteventalert").html("");
			stopAlert();
			$("#TagRefresh").html(langtag.TagReset);
			$("#headertime").html(langtag.ClickReset);
			$("#headertime").addClass("findreminder");
			sessionStorage.setItem("tablename", a)
		})
	}
}

function changeInputType() {
	var a = $("#SearchField").val();
	if ($("#" + a).is(":checkbox")) $("#rectype").val("checkbox");
	else if ($("#" + a).is("select")) $("#SearchSelVal").html($("#" + a).html()), $("#rectype").val("select");
	else if ($("#" + a).hasClass("hasDatepicker")) $("#rectype").val("date");
	else if ($("#" + a).siblings("span").hasClass("ui-slider")) $("#rectype").val("number");
	else if ($("#" + a).hasClass("detailslist")) {
		var b = a.split("_");
		b = $("#" + b[2]).next("div").attr("id");
		var c = "";
		$("#" + b + " table.selectableTable tr td:first-child").each(function () {
			var b =
				$(this).text(),
				e = $(this).parent("tr").attr("id").split("Row");
			"_list_SecurityLevelsList_SecurityLevel" == a && (b += " > " + $(this).next("td").text() + " > " + $(this).next("td").next("td").text());
			c += "<option value='" + e[1] + "'>" + b + "</option>"
		});
		$("#SearchSelVal").html(c);
		$("#rectype").val("list")
	} else $("#rectype").val("text");
	b = $("#rectype").val();
	"checkbox" == b ? ($("#FindContain").html(langtag.FindChecked), $("#FindNotContain").html(langtag.FindNotChecked), $("#sinput").addClass("hiddentab"), $("#sselect").addClass("hiddentab"),
		$("#sdate1").addClass("hiddentab"), $("#sdate2").addClass("hiddentab"), $("#snumber1").addClass("hiddentab"), $("#snumber2").addClass("hiddentab")) : "select" == b ? ($("#FindContain").html(langtag.FindContain), $("#FindNotContain").html(langtag.FindNotContain), $("#sinput").addClass("hiddentab"), $("#sselect").removeClass("hiddentab"), $("#sdate1").addClass("hiddentab"), $("#sdate2").addClass("hiddentab"), $("#snumber1").addClass("hiddentab"), $("#snumber2").addClass("hiddentab")) : "date" == b ? ($("#FindContain").html(langtag.FindWithin),
		$("#FindNotContain").html(langtag.FindNotWithin), $("#sinput").addClass("hiddentab"), $("#sselect").addClass("hiddentab"), $("#sdate1").removeClass("hiddentab"), $("#sdate2").removeClass("hiddentab"), $("#snumber1").addClass("hiddentab"), $("#snumber2").addClass("hiddentab")) : "list" == b ? ($("#FindContain").html(langtag.FindContain), $("#FindNotContain").html(langtag.FindNotContain), $("#sinput").addClass("hiddentab"), $("#sselect").removeClass("hiddentab"), $("#sdate1").addClass("hiddentab"), $("#sdate2").addClass("hiddentab"),
		$("#snumber1").addClass("hiddentab"), $("#snumber2").addClass("hiddentab")) : "number" == b ? ($("#FindContain").html(langtag.FindWithin), $("#FindNotContain").html(langtag.FindNotWithin), $("#sinput").addClass("hiddentab"), $("#sselect").addClass("hiddentab"), $("#sdate1").addClass("hiddentab"), $("#sdate2").addClass("hiddentab"), $("#snumber1").removeClass("hiddentab"), $("#snumber2").removeClass("hiddentab")) : ($("#FindContain").html(langtag.FindContain), $("#FindNotContain").html(langtag.FindNotContain), $("#sinput").removeClass("hiddentab"),
		$("#sselect").addClass("hiddentab"), $("#sdate1").addClass("hiddentab"), $("#sdate2").addClass("hiddentab"), $("#snumber1").addClass("hiddentab"), $("#snumber2").addClass("hiddentab"))
}

function findRecord(a) {
	1 == recordList.length && discardChanges(function (b) {
		if (b) {
			$("#messagefg > div > div").css("padding", "0 10px 0 15px");
			var c = {
				GXT_ACCESSLEVELS_TBL: {
					general: "Name RecordGroup OperatingSchedule EnableMultiBadgeArming ReaderAccessActivatesPGM KeypadAccessActivatesPGM".split(" "),
					doors: ["_list_AccessLevelDoors_AccessLevelDoor"],
					doorgroups: ["_list_AccessLevelDoorGroups_AccessLevelDoorGroup"],
					armingareagroups: ["_list_AccessLevelArmingAreaGroups_AccessLevelAreaGroup"],
					disarmingareagroups: ["_list_AccessLevelDisarmingAreaGroups_AccessLevelAreaGroup2"],
					floors: ["_list_AccessLevelFloors_AccessLevelFloor"],
					floorgroups: ["_list_AccessLevelFloorGroups_AccessLevelFloorGroup"],
					elevatorgroups: ["_list_AccessLevelElevatorGroups_AccessLevelElevatorGroup"],
					menugroups: ["_list_AccessLevelMenuGroups_AccessLevelMenuGroupGroupDataID"],
					outputs: ["_list_AccessLevelOutputs_AccessLevelPGM"],
					outputgroups: ["_list_AccessLevelOutputGroups_AccessLevelPGMGroup"]
				},
				GXT_AREAS_TBL: {
					general: ["Name", "Camera"],
					configuration: "EntryTimeSeconds AlternateEntryTime ExitTimeSeconds Alarm1TimeMinutes SmartZoneTimer RearmAreaTimeMinutes VaultDisarmDelaySeconds VaultDualCodeDelaySeconds RecentClosingTime ArmDisarmSchedule DisarmAreaWhenScheduleStarts ArmAreaWhenScheduleStarts ChildArea MaximumBypassZoneCount MaxUserCount ClientCode InterlockAreaGroup SmartZoneCount ReportingId LockDoorGroupOnArming DeferWarningKeypadGroup DeferWarningTimeMinutes".split(" "),
					outputs: "BellPGMOutput BellPGMOutputGroup BellPulseOnTime BellPulseOffTime ExitDelayPGMOutput ExitDelayPGMOutputGroup ExitDelayPulseOnTime ExitDelayPulseOffTime EntryDelayPGMOutput EntryDelayPGMOutputGroup EntryDelayPulseOnTime EntryDelayPulseOffTime DisarmedPGMOutput DisarmedPGMOutputGroup DisarmedPulseOnTime DisarmedPulseOffTime ArmedPGMOutput ArmedPGMOutputGroup ArmedPulseOnTime ArmedPulseOffTime ReadyPGMOutput ReadyPGMOutputGroup BypassedZonesPGMOutput BypassedZonesPGMOutputGroup BypassedZonesPulseOnTime BypassedZonesPulseOffTime TamperAlarmPGMOutput TamperAlarmPGMOutputGroup TamperAlarmPulseOnTime TamperAlarmPulseOffTime AlarmMemoryPGMOutput AlarmMemoryPGMOutputGroup AlarmMemoryPulseOnTime AlarmMemoryPulseOffTime UserCountReachedPGMOutput UserCountReachedPGMOutputGroup UserCountReachedPulseOnTime UserCountReachedPulseOffTime AreaDeferArmingStartedPGMOutput AreaDeferArmingStartedPGMOutputGroup DeferArmingStartedPulseOnTime DeferArmingStartedPulseOffTime FailToArmPGM FailToArmPGMGroup".split(" "),
					options1: "ZoneRestoreOnBellCutOff ReArmEnabled ArmChildArea ArmChildIfAllOtherAreasAreArmed DisarmChildArea DisarmChildIfAllOtherAreasAreaDisarmed UseUnattendedBruteForceArming ReportArming ReportDisarming Report24HRAreaDisarming ReportUserBypass ReportEntryAlarmImmediately EnableUserCounting ArmOnUserCountAt0 ClearUserCountWhenArmed".split(" "),
					options2: "EnableStayArming EnableForceArming EnableInstantArming DoNotArmIfTroubleCondition PreventArmingOnCountNotZero AlwaysVerifyAreaSchedule AreaCanBeReset VaultControlArea DualCodeVaultControl EnableSmartInput AlwaysForceArmUsingCardReader DisableExitPGMonStayArming ClearAlarmMemoryafterArming EnableLateArmReport EnableEarlyDisarmReport DisableReArmOnSchedule UserRearmInStayMode DeferAutomaticArming BellSquawkOnArmingStart BellSquawkOnArmingComplete BellSquawkOnlyWhenUnattended BellSquawkOnDisarm BellSquawkOnSuccessfulReport NormalDisarmSchedule NormalArmSchedule".split(" ")
				},
				GXT_AREAGROUPS_TBL: {
					general: ["Name", "RecordGroup"],
					areas: ["_list_AreaGroupAreas_Area"]
				}
			};
			c.GXT_DOORS_TBL = 0 == servertype ? {
				general: ["Name", "UnlockSchedule"]
			} : {
				general: "Name DoorType SlaveDoor AreaInsideDoor AreaOutsideDoor UnlockSchedule DoorPreAlarmDelayTime DoorLeftOpenAlarmTime DoorSupportManualCommands InterlockDoorGroup CameraEntry CameraExit AutoCameraPopupOnDoorEvent AutoCameraPopupOnDoorForcedEvent AutoPopupCamera".split(" "),
				outputs: "LockPGM LockPGMGroup LockActivationTime PreAlarmPGMOutput PreAlarmPGMOutputGroup PreAlarmPulseOnTime PreAlarmPulseOffTime LeftOpenAlarmPGMOutput LeftOpenAlarmPGMOutputGroup LeftOpenAlarmPulseOnTime LeftOpenAlarmPulseOffTime ForcedOpenPGMOutput ForcedOpenPGMOutputGroup ForcedOpenPulseOnTime ForcedOpenPulseOffTime".split(" "),
				options: "AlwaysCheckUnlockSchedule EnableOpenCloseEventsOnSchedule EnablePreAlarmEvents EnableLeftOpenEvents RelockOnDoorClose RelockOnDoorOpen UnlockDoorOnREX UnlockDoorOnREN ScheduleOperatesLateToOpen DoorLockFollowsInsideArea DoorLockFollowsOutsideArea PreventUnlockOnScheduleIfInsideAreaArmed PreventUnlockOnScheduleIfOutsideAreaArmed AreaDisarmedANDScheduleValidUnlockDoor AreaDisarmedORScheduleValidUnlockDoor EnableAccessTakenOnREXRENEvents PreventSlaveUnlockOnInsideArea".split(" "),
				advancedoptions: "LockOutREXWhenInsideAreaArmed DenyEntryIfInsideAreaIsArmed DenyExitIfOutsideAreaIsArmed DisableDoorAlarmsOnScheduleUnlock PromptUserForAccessReasonCode EnableAccessTakenOnDoorUnlockEvents UpdateUserAreaWhenPassbackDisabled DoorADAAlarmDelayTime EntryUserResetTime ExitUserResetTime".split(" ")
			};
			c.GXT_DOORGROUPS_TBL = {
				general: ["Name", "RecordGroup"],
				doors: ["_list_DoorsList_Door"]
			};
			c.GXT_ELEVATORGROUPS_TBL = {
				general: ["Name", "RecordGroup"],
				elevators: ["_list_ElevatorsList_Elevator"]
			};
			c.GXT_EVENTFILTERS_TBL = {
				general: ["Name"],
				eventtypes: ["_list_TypesList_EventFilterEventType"]
			};
			c.GXT_EVENTREPORTS_TBL = {
				general: ["Name", "_list_FiltersList_EventReportEventFilter"]
			};
			c.GXT_FLOORGROUPS_TBL = {
				general: ["Name", "RecordGroup"],
				floors: ["_list_FloorsList_Floor"]
			};
			c.GXT_HOLIDAYGROUPS_TBL = {
				general: ["Name"],
				holidays: ["StartDate",
					"EndDate"
				]
			};
			c.GXT_INPUTS_TBL = {
				general: "Name Module ModuleAddress ModuleZone ControlPGM ControlPGMGroup ControlAutomation SupportManualCommands ReportingId AlarmZoneSpeed RestoreZoneSpeed Camera".split(" "),
				areasandinputtypes: "Area1 ZoneType1 ZoneLedDisplay1 Area2 ZoneType2 ZoneLedDisplay2 Area3 ZoneType3 ZoneLedDisplay3 Area4 ZoneType4 ZoneLedDisplay4".split(" "),
				options: "LogToEventBuffer TestForTroubleCondition BypassingNotAllowed LatchBypassingNotAllowed LogZoneEventwhenBypassed TamperZoneifModuleOffline TamperFollowsBypassState NoBypassIfAnyAreaArmed InputEndOfLine".split(" ")
			};
			c.GXT_MENUGROUPS_TBL = {
				general: "Name OperatingSchedule SecondaryMenuGroup Area1 User2 Events3 Installer4 View5 Time6 Bypass7 System8 AdvancedInstaller48 ExtendedTimeMenus624 BypassTroubleZone72 AreaGroupControlAllowed TamperAreaControlAllowed StayArming ForceArming InstantArming".split(" "),
				options: ["UserAdvancedMenu", "InstallerMenuGroup", "ShowUserGreeting", "UserCanAcknowledgeAlarmMemory", "ShowUserAlarmMemoryOnLogon"]
			};
			c.GXT_OPERATORS_TBL = {
				general: ["Name", "UserName", "GXRole", "Email", "Timeout"]
			};
			c.GXT_PGMS_TBL = {
				general: "Name Module ModuleAddress ModuleOutput Schedule AlwaysVerifySchedule PGMRetrigger SupportManualCommands Camera".split(" "),
				options: "LogPGMEvents InvertPGMOutput PresetPanelPowerUp PanelPresetStateIsOn PresetModulePowerUp ModulePresetStateOn PresetModuleCommsFail CommsFailPresetStateIsOn".split(" ")
			};
			c.GXT_PGMGROUPS_TBL = {
				general: ["Name", "RecordGroup", "PGMTime"],
				doors: ["_list_OutputGroupsOutputs_PGM"]
			};
			c.GXT_ROLES_TBL = {
				general: ["Name", "Preset"],
				tables: "TableSites TableOperators TableRoles TableEventServers TableDownloadServers TableDeviceStates TableEventLogs TableSystem TableModems TableEventTypes TableAccessLevels TableAlarms TableCardTemplateEditor TableCustomFields TableDoorGroups TableHolidays TableJobs TableRecordGroups TableSchedules TableSecurityLevels TableUsers TableControllerProgrammingWindows TableSaltoProgrammingWindows TableSmartReaders TableFloorPlans TableStatusPages TableCamerasAndDVRs TableManualCommands TableAcknowledgeAlarms TableIntercoms TableEventReports TableMusterReports TableAttendanceReports TableUserReports".split(" "),
				sites: ["_list_SitesList_RoleSite2"],
				securitylevels: ["_list_SecurityLevelsList_SecurityLevel"],
				display: ["PopupWhileAlarmsPresent", "PopupFrequency", "OperatorCanDisableUntilNextLogon", "OperatorCanPutPopupToSleep", "AllowCameraPopup"]
			};
			c.GXT_SCHEDULES_TBL = {
				general: ["Name"],
				options: ["InvalidateScheduleIfQualifyPGMOn", "InvalidateScheduleIfQualifyPGMOff", "QualifyPGM"],
				holidaygroups: ["_list_HolidayGroups_ScheduleHolidayGroup"]
			};
			c.GXT_SECURITYLEVELS_TBL = {
				general: ["Name"],
				tables: "TableAccessLevels TableActions TableAlarmPriorities TableAlarms TableAnalogExpanders TableApartments TableAreaGroups TableAreas TableAutomation TableBitDataValues TableCameras TableControllers TableCustomFields TableDataValues TableDaylightSavings TableDoorGroups TableDoorTypes TableDoors TableDVRs TableElevatorCars TableElevatorGroups TableEventFilters TableEventGroups TableEventLogs TableEventReports TableFilters TableFloorGroups TableFloorPlans TableFloors TableHolidays TableZoneExpanders TableZoneTypes TableZones TableIntercoms TableJobs TableKeypadGroups TableKeypads TableMenuGroups TableModems TableMusterReports TablePGMExpanders TablePGMGroups TablePGMs TablePhoneNumbers TablePhotoID TableProgrammableFunctions TablePTZSetup TableReaderExpanders TableRecordGroups TableRecordHistory TableSaltoDoors TableSaltoDoorGroups TableSaltoTimePeriods TableSaltoOutputs TableSaltoCalendars TableUserImports TableSchedules TableSecurityLevels TableServices TableSmartReaders TableStatusDefinitions TableStatusLists TableStatusPages TableStatusTable TableTimeAndAttendance TableTroubleZones TableUserReports TableUsers TableVariables TableWebLinks TableWorkstations".split(" "),
				manualcommands: "AreaControl AreaGroup DoorControl DoorGroup ElevatorControl FloorGroup ElevatorGroup KeypadControl KeypadGroup OutputControl OutputGroup InputControl RestartStopServices ResetUserCommands UpdateModuleCommands VariableControl ProgrammableFunctionControl UpdateControllerTime EditAuditOpeningInTheKeysField".split(" ")
			};
			c.GXT_USERS_TBL = {
				general: "FirstName LastName Name RecordGroup DefaultLanguage CardFac0 StartDate ExpiryDate UserArea".split(" "),
				access: ["_list_AccessLevels_UserAccessLevel"],
				options: "DisableUser Showagreetingmessagetouser GoDirectlyToTheMenuOnLogin UserCanAcknowledgeAlarmMemory ShowAlarmMemoryOnLogin TurnOffthePrimaryAreaIfUserHasAccessOnLogin AcknowledgeSystemTroubles TurnOfftheUserAreaonLoginifUserhasaccess Userhassuperrightsandcanoverrideantipassback UserOperatesADAFunction UserisaDuressUser RearmAreaInStayMode UserCanLogInRemotely DualCustodyMaster DualCustodyProvider".split(" "),
				extended: "BadgeNumber BadgeType ServiceName ServiceNumber EmployeeFunction LicenseNumber Union Site DateOfBadgeProduction ExpirationDateOfBadge CustomField1 CustomField2 CustomField3 CustomField4 CustomField5 CustomNoteField1 CustomNoteField2 CardNumber CardType SalaryNumber".split(" ")
			};
			b = "<option value=''>" + langtag.TagNotSet + "</option>";
			var d = c[a],
				e = c = "";
			for (g in d) {
				b += "<optgroup label='" + langtag["Tab" + g] + "'>";
				for (var f = 0; f < d[g].length; f++) {
					var k = "";
					"_list_" == d[g][f].substr(0, 6) ? (k = d[g][f].split("_"), k = $("#" + k[2]).text(), e += "<input type='text' id='" + d[g][f] + "' class='detailslist hiddentab'>") : k = "GXT_USERS_TBL" == a && -1 < $.inArray(d[g][f], ["StartDate", "ExpiryDate"]) ? langtag["User" + d[g][f]] : $("#" + d[g][f]).is(":checkbox") ? $("#" + d[g][f] + "Link").siblings("span").text() : $("#" + d[g][f]).prev("label").text();
					b += "<option value='" + d[g][f] + "'>" + k + "</option>"
				}
				b += "</optgroup>"
			}
			var g = convertTimeStamp(getLocalTime(), "date");
			c += "<h1>Find</h1><p class='narrowtop'><label id='FindField'>" + langtag.FindField + "</label><select id='SearchField' class='narrow' onChange='changeInputType();'>" + b + "</select></p><input type='checkbox' class='hiddentab' id='DoesContain' CHECKED><input type='checkbox' class='hiddentab' id='DoesNotContain'><p class='checkboxp'><label id='FindContain'>" + langtag.FindContain + "</label><a href='' id='DoesContainLink'><img id='DoesContainImg' src='images/checkbox_on.jpg'></a></p><p class='checkboxp'><label id='FindNotContain'>" +
				langtag.FindNotContain + "</label><a href='' id='DoesNotContainLink'><img id='DoesNotContainImg' src='images/checkbox_off.jpg'></a></p><p id='sinput'><label>" + langtag.FindValue + "</label><input type='text' id='SearchVal' class='narrow'></p><p id='sselect' class='hiddentab'><label>" + langtag.FindValue + "</label><select id='SearchSelVal' class='narrow' multiple></select></p><p id='sdate1' class='hiddentab'><label>" + langtag.FindMin + "</label><input type='text' id='FromDateVal' class='datewidth' value='" + g +
				"' readonly></p><p id='sdate2' class='hiddentab'><label>" + langtag.FindMax + "</label><input type='text' id='ToDateVal' class='datewidth' value='" + g + "' readonly></p><p id='snumber1' class='hiddentab'><label>" + langtag.FindMin + "</label><input type='text' id='FromNumberVal' class='datewidth' value='' onKeyup=\"checkFormat(this.id, 'NUMBER', '');\"></p><p id='snumber2' class='hiddentab'><label>" + langtag.FindMax + "</label><input type='text' id='ToNumberVal' class='datewidth' value='' onKeyup=\"checkFormat(this.id, 'NUMBER', '');\"></p><p class='userapprovebuttons'><input type='hidden' id='rectype' value=''><span id='exporteventalert'></span><input type='button' id='FindButton' value='" +
				langtag.TagOK + "' onClick=\"findSubmit('" + a + "');\"><input type='button' value='" + langtag.TagCancel + "' onClick='hideAlert();'></p>";
			showMessage(c + e);
			$("#DoesContainLink").attr("tabindex", 0).bind("keydown click", function (a) {
				return toggleCheckbox("DoesContainLink", a)
			});
			$("#DoesNotContainLink").attr("tabindex", 0).bind("keydown click", function (a) {
				return toggleCheckbox("DoesNotContainLink", a)
			});
			$("#FromDateVal").datepicker({
				dateFormat: "dd MM yy",
				gotoCurrent: !0
			});
			$("#ToDateVal").datepicker({
				dateFormat: "dd MM yy",
				gotoCurrent: !0
			})
		}
	});
	return !1
}

function convertToObject(a) {
	if ("undefined" === typeof a) return {};
	a = a.split("&");
	for (var b = {}, c = 0; c < a.length; c++)
		if (-1 < a[c].indexOf("=")) {
			var d = a[c].split("=");
			b[d[0]] = d[1]
		}
	return b
}

function checkAssignedDoors(a, b) {
	var c = $("#" + b).val(),
		d = "";
	if ("undefined" !== typeof assigneddoor[c])
		for (var e = assigneddoor[c].split(","), f = 0; f < e.length; f++) {
			var k = "GXT_READEREXPANDERS_TBL" == a ? $("#ReaderExpanderId").val() : $("#ReaderUnitId").val();
			e[f] != k && (d = $("#" + a + e[f]).html())
		}
	"" == d && "undefined" !== typeof crossassigneddoor[c] && (d = crossassigneddoor[c]);
	"" == d ? $("#" + b + "Error").html("").parent("p").slideUp() : $("#" + b + "Error").html(langtag.MsgAlreadyAssigned.replace("<READEREXPANDER>", d)).parent("p").slideDown()
}

function createDoorLookupTable(a) {
	assigneddoor = [];
	requestList(a, function (b) {
		b = b.split("&");
		for (var c = 0; c < b.length; c++) {
			var e = b[c].split("=")[0];
			2147483647 != e && runQuery(0 == servertype ? "ajax_requestdetail.php" : "PRT_CTRL_DIN_ISAPI.dll", 0 == servertype ? "subtype=" + a + "&id=" + e : "Request&Type=Detail&SubType=" + a + "&RecId=" + e, !0, !1).done(function (b) {
				b = decryptAES(b);
				var c = b.split("&");
				b = {};
				for (var d = 0; d < c.length; d++) {
					var f = c[d].split("=");
					b[f[0]] = specialChars(f[1], 0 == servertype ? "XMLreplace" : "replace")
				}
				c = "GXT_READERUNITS_TBL" ==
					a ? "ReaderUnitId" : "ReaderExpanderId";
				for (var m in b) "ReaderOneDoor" != m && "ReaderTwoDoor" != m || 2147483647 == b[m] || (assigneddoor[b[m]] = "undefined" == typeof assigneddoor[b[m]] ? b[c] : assigneddoor[b[m]] + ("," + e))
			})
		}
	});
	crossassigneddoor = [];
	var b = "GXT_READERUNITS_TBL" == a ? "GXT_READEREXPANDERS_TBL" : "GXT_READERUNITS_TBL";
	requestList(b, function (a) {
		a = a.split("&");
		for (var c = 0; c < a.length; c++) {
			var e = a[c].split("=")[0];
			2147483647 != e && runQuery(0 == servertype ? "ajax_requestdetail.php" : "PRT_CTRL_DIN_ISAPI.dll", 0 == servertype ?
				"subtype=" + b + "&id=" + e : "Request&Type=Detail&SubType=" + b + "&RecId=" + e, !0, !1).done(function (a) {
				a = decryptAES(a);
				a = a.split("&");
				for (var b = {}, c = 0; c < a.length; c++) {
					var d = a[c].split("=");
					b[d[0]] = specialChars(d[1], 0 == servertype ? "XMLreplace" : "replace")
				}
				for (var e in b) "ReaderOneDoor" != e && "ReaderTwoDoor" != e || 2147483647 == b[e] || (crossassigneddoor[b[e]] = b.Name)
			})
		}
	})
}

function checkUsage(a) {
	$("#usagedetails table.reporttable").html("<tr id='hrow'><th width='25%'>" + langtag.UsageRecord + "</th><th>" + langtag.UsageField + "</th><th width='25%'>" + langtag.UsageTable + "</th></tr>");
	a = "undefined" == typeof controller ? "subtype=" + a + "&action=usage&id=" + $("#" + a).val() : "subtype=" + a + "&action=usage&id=" + $("#" + a).val() + "&ControllerID=" + controller[$("#" + a).val()];
	runQuery("ajax_requestusage.php", a, !1, !0).done(function (a) {
		a = convertToObject(a);
		var b = "",
			d;
		for (d in a)
			if ("Record" == d.substring(0,
					6)) {
				var e = d.replace("Record", "");
				b += "<tr><td>" + specialChars(a["Record" + e], "XMLreplace") + "</td><td>" + a["Field" + e] + "</td><td>" + a["Table" + e] + "</td></tr>"
			}
		$("#usagedetails table.reporttable").append(b)
	})
}

function showHistory(a) {
	var b = "<h1>" + langtag.HistoryModifiedFields + "</h1>";
	runQuery("ajax_requestdetail.php", "subtype=GXT_RECORDHISTORY_TBL&id=" + a, !0, !0).done(function (a) {
		b += "<table id='recordhistorytable' cellspacing=0 cellpadding=3><tr id='hrow'><th>Field Name</th><th>Old Value</th><th>New Value</th></tr>";
		var c = a.split("&");
		a = {};
		for (var e = 0; e < c.length; e++) {
			var f = c[e].split("=");
			a[f[0]] = specialChars(f[1], "XMLreplace")
		}
		c = 0;
		for (var k in a)
			if ("FieldName" == k.substring(0, 9)) {
				e = k.substring(9);
				f = a["OldValue" +
					e];
				"True" == f ? f = langtag.TagTrue : "False" == f ? f = langtag.TagFalse : "2147483647" == f ? f = langtag.TagNotSet : "" == f && (f = "-");
				var g = a["NewValue" + e];
				"True" == g ? g = langtag.TagTrue : "False" == g ? g = langtag.TagFalse : "2147483647" == g ? g = langtag.TagNotSet : "" == g && (g = "-");
				123 == a.RecordType && ("Start Month" == a["FieldName" + e] || "End Month" == a["FieldName" + e] ? (f = $("#StartMonth option[value='" + f + "']").text(), g = $("#StartMonth option[value='" + g + "']").text()) : "Start Day" == a["FieldName" + e] ? (f = 255 == f ? langtag.DaylightSDNone : prefix = $("#StartDayPrefix option[value='" +
					Math.floor(f / 7) + "']").text() + " " + $("#StartDay option[value='" + parseInt(f, 10) % 7 + "']").text(), g = 255 == g ? langtag.DaylightSDNone : prefix = $("#StartDayPrefix option[value='" + Math.floor(g / 7) + "']").text() + " " + $("#StartDay option[value='" + parseInt(g, 10) % 7 + "']").text()) : "End Day" == a["FieldName" + e] && (f = 255 == f ? langtag.DaylightSDNone : $("#EndDayPrefix option[value='" + Math.floor(f / 7) + "']").text() + " " + $("#EndDay option[value='" + parseInt(f, 10) % 7 + "']").text(), g = 255 == g ? langtag.DaylightSDNone : $("#EndDayPrefix option[value='" +
					Math.floor(g / 7) + "']").text() + " " + $("#EndDay option[value='" + parseInt(g, 10) % 7 + "']").text()));
				b += "<tr " + (0 == c % 2 ? "style='background-color:#f0f0f0'" : "") + " valign='top'><td>" + a["FieldName" + e] + "</td><td>" + f + "</td><td>" + g + "</td></tr>";
				c++
			}
		b += "</table>";
		userApprove(b, "OK", function () {})
	})
}

function checkHistory(a, b) {
	$("#historydetails table.reporttable").html("<tr id='hrow'><th width='30%'>" + langtag.HistoryType + "</th><th>" + langtag.HistoryOperator + "</th><th width='40%'>" + langtag.HistoryDate + "</th></tr>");
	a = "undefined" == typeof controller ? "subtype=" + a + "&action=history&id=" + $("#" + a).val() : "subtype=" + a + "&action=history&id=" + $("#" + a).val() + "&ControllerID=" + controller[$("#" + a).val()];
	runQuery("ajax_requestusage.php", a, !1, !0).done(function (a) {
		a = convertToObject(a);
		var b = ["Modified", "Deleted",
				"Added"
			],
			c;
		for (c in a)
			if ("Data" == c.substring(0, 4)) {
				var f = c.replace("Data", "");
				$("#historydetails table.reporttable tr#hrow").after("<tr onClick='showHistory(" + f + ");'><td>" + langtag["Action" + b[a["Data" + f]]] + "</td><td>" + a["Name" + f] + "</td><td>" + a["Date" + f] + "</td></tr>")
			}
	})
}

function checkNewPassword(a) {
	var b = !0;
	a = "Operator" == a ? $("#NewPassword1").val() : $("#Password").val();
	if ("true" == sessionStorage.getItem("PP_Length")) {
		var c = parseInt(sessionStorage.getItem("PP_LengthField"), 10);
		a.length < c && (b = !1)
	}
	if ("true" == sessionStorage.getItem("PP_Ucase")) {
		c = parseInt(sessionStorage.getItem("PP_UcaseField"), 10);
		var d = a.match(/[A-Z \u00C6\u00D0\u018E\u0132\u0152\u00DE\u0104\u00C7\u0110\u018A\u0118\u0126\u012E\u0198\u0141\u00D8\u01A0\u015E\u0218\u0162\u021A\u0166\u0172\u01AFY\u0328\u01B3\u00C1\u00C0\u00C2\u00C4\u01CD\u0102\u0100\u00C3\u00C5\u01FA\u0104\u00C6\u01FC\u01E2\u0181\u0106\u010A\u0108\u010C\u00C7\u010E\u1E0C\u0110\u018A\u00D0\u00C9\u00C8\u0116\u00CA\u00CB\u011A\u0114\u0112\u0118\u1EB8\u018E\u0120\u011C\u01E6\u011E\u0122\u0194\u0147\u00D1\u0145\u014A\u00D3\u00D2\u00D4\u00D6\u01D1\u014E\u014C\u00D5\u0150\u1ECC\u00D8\u01FE\u01A0\u0152\u0154\u0158\u0156\u015A\u015C\u0160\u015E\u0218\u1E62\u1E9E\u0164\u0162\u1E6C\u0166\u00DE\u00DA\u00D9\u00DB\u00DC\u01D3\u016C\u016A\u0168\u0170\u016E\u0172\u1EE4\u01AF\u1E82\u1E80\u0174\u1E84\u01F7\u00DD\u1EF2\u0176\u0178\u0232\u1EF8\u01B3\u0179\u017B\u017D\u1E92]/g);
		if (null == d || d.length < c) b = !1
	}
	"true" == sessionStorage.getItem("PP_Digits") && (c = parseInt(sessionStorage.getItem("PP_DigitsField"), 10), d = a.match(/[0-9]/g), null == d || d.length < c) && (b = !1);
	"true" == sessionStorage.getItem("PP_Schars") && (c = parseInt(sessionStorage.getItem("PP_ScharsField"), 10), d = a.match(/[@$,<>#:`~!-+%'"|\.(){}=?_*&;]/g), null == d || d.length < c) && (b = !1);
	if ("true" == sessionStorage.getItem("PP_Uname"))
		for (c = $("#UserName").val().split(/[\s,.\-_]+/), d = 0; d < c.length; d++) 2 < c[d].length && -1 < a.indexOf(c[d]) &&
			(b = !1);
	if (b) return $("#NewPassword1").val() == $("#NewPassword2").val() ? ($("#exporteventalert").html(""), $("#pswdsubmit").removeAttr("disabled")) : ($("#exporteventalert").html(langtag.MsgOperatorPasswordNoMatch), $("#pswdsubmit").attr("disabled", "disabled")), !0;
	$("#exporteventalert").html(langtag.MsgOperatorPolicyError);
	$("#pswdsubmit").attr("disabled", "disabled");
	return !1
}

function updatePassword(a) {
	var b = !0;
	0 == servertype && $.browser.msie && 10 > parseInt($.browser.version.substring(0, 2), 10) && (b = !1);
	if (b) {
		$("#messagefg > div > div").css("padding", "0 10px 0 15px");
		b = "<h1>" + langtag.ControllerChangePassword + "</h1>";
		if ("current" == a) {
			var c = 0 == servertype ? $("#MHUsernameStr").text() : getCookie("WXUsername");
			b += "<input type='hidden' id='UserName' value='" + c + "'></p>";
			1 == servertype && (b += "<p class='narrowtop'><label>" + langtag.EnterOldPassword + ":</label><input type='password' id='OldPassword' class='regular'></p>")
		}
		b +=
			"<p class='narrowtop'><label>" + langtag.EnterNewPassword + ":</label><input type='password' id='NewPassword1' class='regular' onKeyUp='checkNewPassword(\"Operator\")'></p><p><label>" + langtag.ConfirmNewPassword + ":</label><input type='password' id='NewPassword2' class='regular' onKeyUp='checkNewPassword(\"Operator\")'></p><span id='exporteventalert'>" + langtag.LoadingPolicy + "&nbsp;...&nbsp;" + langtag.Uploadingpleasewait + "</span><p class='userapprovebuttons'><input type='button' id='pswdsubmit' value='" +
			langtag.TagOK + "' onClick=\"updateCurrentPasswordSubmit('" + a + "');\"><input type='button' value='" + langtag.TagCancel + "' onClick='stopAlert();'></p>";
		showMessage(b);
		runQuery(0 == servertype ? "ajax_requestdetail.php" : "PRT_CTRL_DIN_ISAPI.dll", 0 == servertype ? "subtype=PASSWORDPOLICY" : "Request&Type=Detail&SubType=GXT_CONTROLLERS_TBL&RecId=0", 1 == servertype, !0).done(function (a) {
			1 == servertype && (a = decryptAES(a));
			if ("<no response>" != a) {
				a = a.split("&");
				for (var b = 0; b < a.length; b++) {
					var c = a[b].split("=");
					"PP_" == c[0].substr(0,
						3) && sessionStorage.setItem(c[0], c[1])
				}
			}
			$("#exporteventalert").html("")
		});
		1 == servertype && "current" == a ? $("#OldPassword").focus() : $("#NewPassword1").focus()
	} else userApprove("<h1>Error</h1><p>You are not able to use IE " + $.browser.version + " to update the Operator password.</p><p>Please update your browser to proceed</p>", "OK", function () {})
}

function updateCurrentPasswordSubmit(a) {
	if ($("#NewPassword1").val() != $("#NewPassword2").val()) return !1;
	if ("current" == a) {
		if (0 == servertype) a = runQuery("ajax_update.php", "type=password&OperatorId=current&pswd=" + $("#NewPassword1").val(), !1, !0);
		else {
			var b = new jsSHA($("#OldPassword").val(), "TEXT");
			a = b.getHash("SHA-1", "HEX");
			b = new jsSHA($("#NewPassword1").val(), "TEXT");
			b = b.getHash("SHA-1", "HEX");
			a = runQuery("PRT_CTRL_DIN_ISAPI.dll", "Command&Type=Session&SubType=UpdateThisOperatorsPass&OldPass=" + a + "&NewPass=" +
				b, !0, !0)
		}
		a.done(function (a) {
			a = decryptAES(a);
			"OK" == a ? stopAlert() : userApprove("<h1>" + langtag.MsgError + "</h1><p>" + langtag.PasswordNotUpdated + "</p>", "OK", function () {})
		})
	} else $("#Password").val($("#NewPassword1").val()).change(), stopAlert()
}

function updateDefaultSite(a) {
	runQuery("ajax_update.php", "type=site&id=" + a, !1, !0).done(function (b) {
		"OK" == b ? (localStorage.setItem("DefaultSiteId", a), "Index" != currentpage && initialise(currentpage)) : flashMessage(langtag.MsgError, "" == b ? langtag.MsgDefaultSiteNotUpdated : langtag.MsgDefaultSiteNotUpdated + "&nbsp;(" + b + ")")
	})
}

function locateModule(a, b) {
	var c = $("#" + a + b + "temp").val().split(","),
		d = $("#" + a + b + "rate").val();
	runQuery(0 == servertype ? "dummy.php" : "PRT_CTRL_DIN_ISAPI.dll", 0 == servertype ? "type=addressing&restart" : "Command&Type=Modules&SubType=Find&Module=" + a + "&SerialNumber=" + b + "&CurrentAddress=" + c[2] + "&FlashRate" + d, 1 == servertype, !0).done(function (a) {
		a = decryptAES(a);
		"OK" != a && flashMessage(langtag.MsgError, langtag.MsgLocationNotSent)
	});
	return !1
}

function restartModule(a, b) {
	discardChanges(function (c) {
		if (c) {
			if ("" === b) {
				var d = $("#PhysicalAddress").val();
				c = $("input[name='Name']").val()
			} else d = $("#" + a + b + "temp").val().split(",")[2], c = a.replace(/([a-z])([A-Z])/g, "$1 $2") + " " + (parseInt(d, 10) + 1);
			"" != d && userApprove("<p>" + langtag.MsgConfirmModuleRestart + " " + c + "?</p>", "YN", function (b) {
				1 == b && runQuery(0 == servertype ? "dummy.php" : "PRT_CTRL_DIN_ISAPI.dll", 0 == servertype ? "type=addressing&restart" : "Command&Type=Modules&SubType=Restart&Module=" + a + "&CurrentAddress=" +
					d, 1 == servertype, !0).done(function (a) {
					a = decryptAES(a);
					"OK" != a && flashMessage(langtag.MsgError, langtag.MsgModuleNotRestarted)
				})
			})
		}
	});
	return !1
}

function restartAllModules(a) {
	a ? userApprove("<p>" + langtag.MsgRestartAllModules + "</p>", "YN", function (a) {
		1 == a && runQuery(0 == servertype ? "dummy.php" : "PRT_CTRL_DIN_ISAPI.dll", 0 == servertype ? "type=addressing&restart" : "Command&Type=Modules&SubType=Restart&Module=All", 1 == servertype, !0).done(function (a) {
			a = decryptAES(a);
			"OK" != a && flashMessage(langtag.MsgError, langtag.MsgModulesNotRestarted)
		})
	}) : runQuery(0 == servertype ? "dummy.php" : "PRT_CTRL_DIN_ISAPI.dll", 0 == servertype ? "type=addressing&restart" : "Command&Type=Modules&SubType=Restart&Module=All",
		1 == servertype, !0).done(function (a) {
		a = decryptAES(a);
		"OK" != a && flashMessage(langtag.MsgError, langtag.MsgModulesNotRestarted)
	});
	return !1
}

function getRecordAddress(a, b, c) {
	setTimeout(function () {
		runQuery(0 == servertype ? "ajax_requestdetail.php" : "PRT_CTRL_DIN_ISAPI.dll", 0 == servertype ? "subtype=" + a + "&id=" + b : "Request&Type=Detail&SubType=" + a + "&RecId=" + b, 1 == servertype, !0).done(function (b) {
			b = decryptAES(b);
			b = b.split("&");
			for (var c = [], d = 0; d < b.length; d++) {
				var k = b[d].split("=");
				c[k[0]] = specialChars(k[1], "replace")
			}
			"GXT_PGMS_TBL" == a ? addresslist[c.PGMId] = c.Module + "" + c.ModuleAddress + c.ModuleOutput : "GXT_TROUBLEINPUTS_TBL" == a ? addresslist[c.TroubleInputId] =
				c.Module + "" + c.ModuleAddress + c.ModuleZone : addresslist[c.InputId] = c.Module + "" + c.ModuleAddress + c.ModuleZone
		})
	}, c)
}

function getAddressList(a) {
	requestList(a, function (b) {
		b = b.split("&");
		for (var c = 0; c < b.length; c++) {
			var d = b[c].split("=");
			"2147483647" != d[0] && getRecordAddress(a, d[0], 25 * c)
		}
	})
}

function rePopulateAddressRange(a, b, c) {
	c = "undefined" !== typeof c ? c : "AddressNotSet";
	var d = $("#" + b).val(),
		e = 32;
	2 == a ? e = 2147483647 == getCookie("WXNumKeypads") ? 255 : getCookie("WXNumKeypads") : 3 == a ? e = 2147483647 == getCookie("WXNumZoneExpanders") ? 255 : getCookie("WXNumZoneExpanders") : 4 == a ? e = 2147483647 == getCookie("WXNumReaderExpanders") ? 255 : getCookie("WXNumReaderExpanders") : 5 == a ? e = 2147483647 == getCookie("WXNumPgmExpanders") ? 255 : getCookie("WXNumPgmExpanders") : 6 == a && (e = 2147483647 == getCookie("WXNumAnalogExpanders") ?
		255 : getCookie("WXNumAnalogExpanders"));
	a = "<option value='2147483647'>" + langtag[c] + "</option>";
	for (c = 0; c < e; c++) a += "<option value='" + c + "'>" + (c + 1) + "</option>";
	$("#" + b).html(a);
	$("#" + b).val(d)
}

function checkAddressConflict(a) {
	if (2 > recordList.length) {
		"Input" != a && "TroubleInput" != a || 4 != $("#Module").val() ? "Input" == a ? ($("#ModuleZone option").filter(function () {
			return 15 < $(this).val() && 2147483647 > $(this).val()
		}).hide(), 15 < $("#ModuleZone").val() && $("#ModuleZone").val(2147483647)) : "TroubleInput" == a && ($("#ModuleZone option").filter(function () {
			return 63 < $(this).val() && 2147483647 > $(this).val()
		}).hide(), 63 < $("#ModuleZone").val() && $("#ModuleZone").val(2147483647)) : $("#ModuleZone option").show();
		var b =
			"";
		b = "Output" == a ? $("#Module").val() + "" + $("#ModuleAddress").val() + $("#ModuleOutput").val() : "TroubleInput" == a && 8 == $("#Module").val() ? $("#Module").val() + "" + $("#ModuleAddressDoor").val() + $("#ModuleZone").val() : $("#Module").val() + "" + $("#ModuleAddress").val() + $("#ModuleZone").val();
		var c = "";
		c = "Output" == a ? "PGMId" : "TroubleInput" == a ? "TroubleInputId" : "InputId";
		var d = !1,
			e;
		for (e in addresslist) addresslist[e] == b && e != $("#" + c).val() && (d = !0);
		d ? "Output" == a ? ($("#ModuleOutput").addClass("highlight"), $("#ModuleOutput").siblings("label").addClass("highlight"),
			$("#ModuleOutput").siblings("label").html(langtag.MsgModuleOutputinuse)) : ($("#ModuleZone").addClass("highlight"), $("#ModuleZone").siblings("label").addClass("highlight"), $("#ModuleZone").siblings("label").html(langtag.MsgModuleInputinuse)) : "Output" == a ? ($("#ModuleOutput").removeClass("highlight"), $("#ModuleOutput").siblings("label").removeClass("highlight"), $("#ModuleOutput").siblings("label").html(langtag.MsgModuleOutputOK)) : ($("#ModuleZone").removeClass("highlight"), $("#ModuleZone").siblings("label").removeClass("highlight"),
			$("#ModuleZone").siblings("label").html(langtag.MsgModuleInputOK))
	}
}

function displayCamera(a, b) {
	runQuery("ajax_requestdetail.php", "subtype=GXT_CAMERAS_TBL&id=" + a + "&dvr", !1, !0).done(function (a) {
		if ("<no response>" != a) {
			a = convertToObject(a);
			if ("live" == b) var c = "Mode=Live";
			else {
				c = b.split(" ");
				var e = c[0].split("/"),
					f = e[2] + e[1] + e[0];
				e = c[1].split(":");
				"pm" == e[1].substr(2) && (e[0] = parseInt(e[0], 10), 12 > e[0] && (e[0] += 12));
				f += e[0] + e[1].substr(0, 2) + "00";
				c = "Mode=Archive&Date=" + f
			}
			a = "http://" + location.hostname + "/GXWebDVR/GXWebDVR.xbap?" + c + "&Address=" + a.DVRIpAddress + "&Port=" + a.DVRPort +
				"&Camera=" + a.CameraNameInDVR + "&User=" + a.DVRUsername + "&Pass=" + simpleAES(a.DVRPassword, spacePad(a.DVRUsername));
			$("#messagefg > div > div").css("padding", "");
			$("#messagefg > div > div").css("width", "");
			$("#messagefg > div > div").css("top", "");
			$("#messagefg > div > div").css("left", "");
			$("#messagefg > div > div").css("margin-left", "");
			$("#messagefg > div > div").addClass("dvrview");
			showMessage("<p class='userapprovebuttons'><iframe class='camview' src='" + a + "'></iframe><input type='button' id='okbutton' value='" +
				langtag.TagOK + "' onClick='stopAlert();'></p>", !1);
			$("#messagefg > div > div").draggable()
		}
	});
	return !1
}

function displayEvents(a, b, c, d) {
	var e = 0 > b ? $("#" + a + "Id").val() : b;
	"" !== e && (d && $("#eventreport").html("<img src='images/loading.gif' class='loading-placeholder-narrow'>"), runQuery(0 == servertype ? "ajax_request.php" : "PRT_CTRL_DIN_ISAPI.dll", 0 == servertype ? "type=eventlist&" + a + "Id=" + e : "User" == a ? "Request&Type=Events&SubType=" + c + "&U0=" + e : "Request&Type=Events&SubType=" + c + "&" + a + "Id0=" + e, 1 == servertype, !0).done(function (a) {
		a = decryptAES(a);
		if ("Latest" == c && "<no response>" == a) 0 > b ? $("#eventreport").html("<p class='noevents'>" +
			langtag.TagNonefound + "</p>") : $("#monitoringeventreport").html("<p class='noevents'>" + langtag.TagNonefound + "</p>");
		else if ("<no response>" != a) {
			var d = "";
			a = a.split("&");
			for (var e = 0; e < a.length; e++)
				if ("EventCodes" != a[e].substr(0, 10)) {
					var f = a[e].split("=");
					1 < f.length && "Event" == f[0].substr(0, 5) && (d = "<tr><td>" + specialChars(f[1].substr(23), "replace") + "</td><td>" + displayDateTime(f[1].substr(0, 23), "WX") + "</td></tr>" + d)
				}
			"Latest" == c && "" == d ? 0 > b ? $("#eventreport").html("<p class='noevents'>" + langtag.TagNonefound +
				"</p>") : $("#monitoringeventreport").html("<p class='noevents'>" + langtag.TagNonefound + "</p>") : "Latest" == c ? (d = "<table class='reporttable'><tbody><tr id='hrow'><th>" + langtag.HeaderDesc + "</th><th width='170'>" + langtag.HeaderTime + "</th></tr>" + d + "</tbody></table>", 0 > b ? $("#eventreport").html(d) : $("#monitoringeventreport").html(d)) : $("table.reporttable #hrow").after(d)
		}
		resizeListview()
	}))
}

function monitoringEvents(a, b) {
	stopEvents();
	$("#messagefg > div > div").css("padding", "");
	$("#messagefg > div > div").css("width", "");
	$("#messagefg > div > div").css("top", "");
	$("#messagefg > div > div").css("left", "");
	$("#messagefg > div > div").css("margin-left", "");
	$("#messagefg > div > div").addClass("eventreport");
	userApprove("<h1>" + langtag.MEvents + "</h1><span id='monitoringeventreport'><img src='images/loading.gif' class='loading-placeholder'></span>", "OK", function (a) {});
	displayEvents(a, b, "Latest", !0);
	1 == servertype && (eventtimer = setInterval("displayEvents('" + a + "', '" + b + "', 'Update', false)", 2E3));
	return !1
}

function startEvents(a, b) {
	stopEvents();
	displayEvents(a, b, "Latest", !0);
	1 == servertype && (eventtimer = setInterval("displayEvents('" + a + "', '" + b + "', 'Update', false)", 2E3));
	return !1
}

function stopEvents() {
	"undefined" !== typeof eventtimer && clearInterval(eventtimer)
}

function eventColours() {
	return {
		0: [0, 2124031],
		1: [0, 6008319],
		2: [0, 2124031],
		3: [0, 2124031],
		4: [0, 2124031],
		6: [0, 255],
		256: [0, 16443110],
		257: [0, 16443110],
		258: [0, 16443110],
		259: [0, 16443110],
		260: [0, 16443110],
		261: [0, 2124031],
		262: [0, 16443110],
		263: [0, 16443110],
		264: [0, 16443110],
		265: [7451452, 55295],
		266: [16711680, 55295],
		267: [16711680, 55295],
		512: [0, 16443110],
		513: [0, 16443110],
		514: [0, 16443110],
		515: [0, 16443110],
		516: [0, 16443110],
		517: [0, 16443110],
		518: [0, 16443110],
		519: [0, 16443110],
		520: [0, 2124031],
		521: [0, 2124031],
		522: [0, 16443110],
		523: [0, 16443110],
		524: [0, 16443110],
		525: [0, 16443110],
		526: [0, 16443110],
		527: [0, 16443110],
		528: [0, 16443110],
		529: [0, 2124031],
		530: [0, 2124031],
		531: [0, 2124031],
		532: [0, 16443110],
		533: [0, 16443110],
		534: [0, 16443110],
		535: [0, 16443110],
		536: [0, 16443110],
		537: [0, 16443110],
		538: [0, 16443110],
		539: [0, 16443110],
		540: [0, 16443110],
		541: [0, 2124031],
		542: [0, 2124031],
		543: [0, 2124031],
		544: [0, 2124031],
		545: [0, 16443110],
		546: [0, 2124031],
		547: [0, 2124031],
		548: [0, 2124031],
		556: [0, 10025880],
		557: [0, 10025880],
		558: [9143144, 65535],
		559: [16443110, 255],
		560: [4210688, 3329330],
		561: [6710886, 65535],
		562: [16443110, 255],
		563: [0, 255],
		576: [0, 10025880],
		577: [0, 16443110],
		768: [0, 3329330],
		769: [0, 3329330],
		770: [0, 2124031],
		771: [0, 255],
		772: [0, 255],
		773: [0, 255],
		774: [0, 255],
		775: [0, 255],
		776: [0, 255],
		777: [0, 255],
		778: [0, 255],
		779: [0, 255],
		780: [16777215, 9143144],
		781: [16777215, 9143144],
		782: [16777215, 9143144],
		783: [0, 255],
		784: [0, 255],
		785: [0, 255],
		786: [0, 255],
		787: [0, 255],
		788: [0, 255],
		789: [0, 65535],
		790: [0, 65535],
		791: [0, 65535],
		792: [0, 65535],
		793: [0, 255],
		794: [0, 255],
		795: [0, 255],
		796: [0,
			255
		],
		797: [0, 3329330],
		798: [0, 3329330],
		799: [0, 3329330],
		800: [0, 3329330],
		801: [0, 2124031],
		802: [0, 255],
		803: [0, 255],
		804: [16777215, 9143144],
		805: [16777215, 9143144],
		806: [0, 65535],
		807: [0, 65535],
		808: [16777215, 9143144],
		809: [16777215, 9143144],
		810: [0, 3329330],
		811: [0, 3329330],
		812: [16777215, 9143144],
		813: [16777215, 9143144],
		814: [16777215, 9143144],
		815: [16777215, 9143144],
		827: [0, 255],
		828: [0, 65535],
		829: [0, 65535],
		831: [0, 0],
		832: [0, 0],
		833: [16777215, 7451452],
		834: [16777215, 7451452],
		835: [0, 0],
		836: [16777215, 255],
		837: [16777215,
			255
		],
		838: [0, 15658671],
		839: [12623485, 65535],
		840: [14745599, 255],
		841: [0, 55295],
		842: [16777215, 2763429],
		843: [16777215, 2763429],
		844: [16777215, 2763429],
		845: [16777215, 2763429],
		846: [16777215, 2763429],
		847: [16777215, 2763429],
		851: [0, 255],
		852: [0, 255],
		855: [0, 255],
		856: [0, 7451452],
		857: [0, 2124031],
		858: [0, 7451452],
		859: [0, 2124031],
		860: [0, 7451452],
		861: [0, 2124031],
		862: [0, 2124031],
		880: [16777215, 7451452],
		881: [16777215, 7451452],
		885: [16777215, 7451452],
		891: [16777215, 7451452],
		892: [16777215, 7451452],
		1024: [3329330, 16777215],
		1025: [2124031, 16711680],
		1026: [16711680, 16711680],
		1027: [8388736, 16711680],
		1028: [0, 2124031],
		1029: [3329330, 16777215],
		1030: [0, 6008319],
		1031: [3329330, 16777215],
		1032: [0, 2124031],
		1033: [3329330, 16777215],
		1034: [0, 2124031],
		1035: [0, 2124031],
		1036: [3329330, 16777215],
		1037: [3329330, 16777215],
		1280: [3329330, 65535],
		1281: [2124031, 65535],
		1282: [16711680, 65535],
		1283: [8388736, 65535],
		1284: [0, 2124031],
		1285: [3329330, 16777215],
		1286: [0, 2124031],
		1287: [3329330, 16777215],
		1288: [3329330, 16777215],
		1289: [3329330, 16777215],
		1290: [0,
			2124031
		],
		1291: [0, 2124031],
		1292: [3329330, 16777215],
		1541: [3329330, 16777215],
		1544: [3329330, 16777215],
		1572: [16777215, 0],
		1573: [16777215, 0],
		1792: [0, 10526880],
		1793: [0, 10526880],
		1794: [2124031, 16777215],
		1795: [2124031, 16777215],
		1796: [2124031, 16777215],
		1797: [2124031, 16777215],
		1798: [255, 16777215],
		1799: [255, 16777215],
		2048: [255, 12632256],
		2049: [255, 12632256],
		2050: [9109504, 12632256],
		2051: [9109504, 12632256],
		2052: [255, 12632256],
		2053: [12632256, 12632256],
		2054: [0, 16711680],
		2055: [0, 65280],
		2056: [0, 65280],
		2057: [255, 12632256],
		2058: [255, 12632256],
		2059: [255, 12632256],
		2060: [9109504, 12632256],
		2061: [9109504, 12632256],
		2062: [255, 12632256],
		2063: [65280, 12632256],
		2064: [0, 65280],
		2065: [255, 12632256],
		2066: [255, 12632256],
		2067: [9109504, 12632256],
		2068: [9109504, 12632256],
		2069: [255, 12632256],
		2070: [65280, 12632256],
		2071: [0, 65280],
		2072: [65535, 12632256],
		2073: [65535, 12632256],
		2074: [65535, 12632256],
		2075: [9109504, 12632256],
		2076: [0, 65280],
		2077: [0, 65280],
		2078: [9109504, 12632256],
		2079: [9109504, 12632256],
		2080: [9109504, 12632256],
		2081: [9109504, 12632256],
		2082: [65535, 12632256],
		2083: [65535, 12632256],
		2084: [9109504, 12632256],
		2085: [9109504, 12632256],
		2086: [255, 12632256],
		2087: [255, 12632256],
		2088: [255, 12632256],
		2089: [255, 12632256],
		2096: [65535, 12632256],
		2097: [65535, 12632256],
		2098: [65535, 12632256],
		2099: [65535, 12632256],
		2102: [65535, 12632256],
		2103: [65535, 12632256],
		2104: [255, 12632256],
		2105: [255, 12632256],
		2106: [65280, 12632256],
		2107: [9109504, 12632256],
		2108: [65280, 12632256],
		2109: [65535, 12632256],
		2110: [0, 12632256],
		2111: [0, 16711680],
		2114: [37632, 12632256],
		2115: [37632,
			12632256
		],
		2116: [37632, 12632256],
		2117: [37632, 12632256],
		2304: [37632, 16777215],
		2305: [37632, 16777215],
		2306: [255, 16777215],
		2307: [65535, 12614523],
		2308: [255, 16777215],
		2309: [255, 16777215],
		2310: [255, 16777215],
		2311: [255, 16777215],
		2312: [255, 16777215],
		2313: [255, 16777215],
		2314: [65535, 12614523],
		2315: [65535, 12614523],
		2316: [65535, 12614523],
		2317: [255, 16777215],
		2318: [255, 16777215],
		2319: [255, 16777215],
		2320: [255, 16777215],
		2321: [255, 16777215],
		2322: [255, 16777215],
		2323: [255, 16777215],
		2324: [255, 16777215],
		2325: [255, 16777215],
		2326: [255, 16777215],
		2327: [255, 16777215],
		2328: [255, 16777215],
		2329: [255, 16777215],
		2330: [255, 16777215],
		2331: [255, 16777215],
		2332: [255, 16777215],
		2333: [255, 16777215],
		2334: [255, 16777215],
		2335: [255, 16777215],
		2336: [255, 16777215],
		2337: [255, 16777215],
		2338: [255, 16777215],
		2339: [65535, 12614523],
		2560: [0, 3329330],
		2561: [16777215, 3329330],
		2562: [0, 2124031],
		2563: [0, 255],
		2564: [0, 255],
		2565: [0, 16777215],
		2566: [6008319, 16777215],
		2567: [6008319, 16777215],
		2568: [16777215, 3329330],
		2569: [16777215, 3329330],
		2570: [16777215, 3329330],
		2571: [16777215, 3329330],
		2572: [0, 3329330],
		2573: [0, 3329330],
		2574: [0, 3329330],
		2575: [6710886, 6008319],
		2576: [6710886, 6008319],
		2577: [6710886, 6008319],
		2578: [0, 255],
		2579: [0, 255],
		2580: [10025880, 0],
		2581: [55295, 0],
		2582: [16777215, 0],
		2583: [65280, 0],
		2587: [0, 255],
		2588: [0, 255],
		2589: [0, 255],
		2590: [0, 255],
		2591: [0, 255],
		2592: [0, 255],
		2593: [0, 255],
		2594: [0, 255],
		2597: [0, 65535],
		2598: [0, 65535],
		2599: [0, 65535],
		2600: [0, 65535],
		2601: [0, 65535],
		2602: [0, 65535],
		2603: [0, 65535],
		2604: [0, 65535],
		2605: [0, 65535],
		2606: [0, 65535],
		3078: [0, 16777215],
		3079: [0, 16777215],
		3080: [0, 16777215],
		3081: [0, 16777215],
		3082: [0, 16777215],
		3083: [0, 16777215],
		3084: [0, 16777215],
		3085: [0, 16777215],
		3086: [0, 16777215],
		3087: [0, 16777215],
		3328: [3329330, 12632256],
		3329: [255, 12632256],
		3330: [0, 16711680],
		3331: [0, 16711680],
		3332: [3329330, 12632256],
		3333: [3329330, 12632256],
		3334: [3329330, 12632256],
		3335: [3329330, 12632256],
		3336: [65535, 12632256],
		3337: [0, 12632256],
		3338: [0, 12632256],
		3339: [0, 255],
		3340: [0, 255],
		3341: [0, 255],
		3342: [0, 255],
		3343: [65535, 12632256],
		3344: [65535, 12632256],
		3345: [65535,
			12632256
		],
		3346: [65535, 12632256],
		3347: [65535, 12632256],
		3348: [65535, 12632256],
		3349: [255, 12632256],
		3350: [255, 12632256],
		3351: [3329330, 12632256],
		3585: [16777152, 4718664],
		3586: [16777152, 4718664],
		3587: [4718664, 16777152],
		3588: [16777152, 4718664],
		3589: [4718664, 16777152],
		3590: [4718664, 16777152],
		3591: [4718664, 16777152],
		3592: [4718664, 16777152],
		3593: [4718664, 16777152],
		3594: [4718664, 16777152],
		3595: [4718664, 16777152],
		3596: [4718664, 16777152],
		3597: [4718664, 16777152],
		3598: [4718664, 16777152],
		3599: [4718664, 16777152],
		3600: [4718664,
			16777152
		],
		3601: [16777215, 3329330],
		3602: [16777215, 3329330],
		3603: [0, 3329330],
		3604: [0, 255],
		3605: [0, 255],
		3606: [0, 16777152],
		3607: [0, 16777152],
		3608: [9221330, 9109504],
		3609: [9221330, 9109504],
		3610: [9221330, 9109504],
		3611: [4718664, 16777152],
		3612: [4718664, 16777152],
		3613: [4718664, 16777152],
		3614: [0, 65535],
		3615: [0, 65535],
		3616: [0, 65535],
		3617: [0, 65535],
		3618: [0, 65535],
		3619: [9221330, 9109504],
		3840: [9221330, 9109504],
		3841: [9221330, 9109504],
		4096: [12632256, 55295],
		4097: [12632256, 55295],
		4098: [12632256, 55295],
		40960: [65535,
			12614523
		],
		40961: [65535, 12614523],
		40962: [65535, 12614523]
	}
}

function eventReport(a) {
	if ("" == $("#StartDate").val()) userApprove("<p>" + langtag.StartDateNotSelected + "</p>", "OK", function () {});
	else if ("" == $("#ExpiryDate").val()) userApprove("<p>" + langtag.EndDateNotSelected + "</p>", "OK", function () {});
	else {
		if ($("#StartDate").hasClass("highlight") || $("#EndDate").hasClass("highlight")) {
			var b = $("#StartDate").val();
			$("#StartDate").val($("#EndDate").val());
			$("#EndDate").val(b);
			b = $("#StartTime").val();
			$("#StartTime").val($("#EndTime").val());
			$("#EndTime").val(b);
			$("#StartDate").removeClass("highlight");
			$("#StartTime").removeClass("highlight");
			$("#EndDate").removeClass("highlight");
			$("#EndTime").removeClass("highlight")
		}
		requestSequenceNumber(function (b) {
			var c = 0 == servertype ? "ajax_request.php" : "PRT_CTRL_DIN_ISAPI.dll";
			b = 0 == servertype ? "screen" == a ? "type=eventlist&subtype=Latest" : "type=eventlist&subtype=ExportCSV" : "screen" == a ? "Request&Type=Events&SubType=Latest&Sequence=" + b : "Request&Type=Events&SubType=ExportCSV&Sequence=" + b;
			var e = "" == $("#StartTime").val() ? "00:00" : $("#StartTime").val(),
				f = "" == $("#EndTime").val() ?
				"23:59" : $("#EndTime").val();
			b += "&StartDate=" + convertDateString($("#StartDate").val()) + "T" + e + "&EndDate=" + convertDateString($("#EndDate").val()) + "T" + f;
			e = 0 == servertype ? "UserId" : "U";
			for (f = 0; f < currentusers.length; f++) b += "&" + e + f + "=" + currentusers[f];
			for (f = 0; f < currentdoors.length; f++) b += "&DoorId" + f + "=" + currentdoors[f];
			for (f = 0; f < currentareas.length; f++) b += "&AreaId" + f + "=" + currentareas[f];
			"screen" == a ? ($("#messagefg > div > div").css("padding", ""), $("#messagefg > div > div").css("width", ""), $("#messagefg > div > div").css("top",
					""), $("#messagefg > div > div").css("left", ""), $("#messagefg > div > div").css("margin-left", ""), $("#messagefg > div > div").addClass("eventreport"), userApprove("<h1>" + langtag.ReportReports + "</h1><span id='monitoringeventreport'><img src='images/loading.gif' class='loading-placeholder'></span>", "REPORT", function (a) {}), 1 == servertype && (b = "q=" + encryptAES(b)), $.ajax({
					mimeType: "text/plain; charset=utf-8",
					url: c,
					data: b,
					type: "POST",
					dataType: "html"
				}).done(function (a) {
					a = decryptAES(a);
					if ("<no response>" == a) $("#monitoringeventreport").html("<p class='noevents'>" +
						langtag.TagNonefound + "</p>"), $("#PreviousButton").remove(), $("#NextButton").remove();
					else {
						if (1 == servertype) var b = eventColours();
						var c = "<h1>" + langtag.ReportReports + "</h1><div class='reporttablecontainer'><table class='reporttablefull' cellspacing=0><tr id='hrow'><th>" + langtag.HeaderDesc + "</th><th width='170'>" + langtag.HeaderTime + "</th></tr>";
						a = convertToObject(a);
						var d = "",
							e = 0,
							f;
						for (f in a)
							if ("Event" == f.substr(0, 5) && "EventCode" != f.substr(0, 9)) {
								e++;
								var k = getPosition(a[f], " ", 3) + 1,
									t = a[f].substr(0, k);
								k =
									a[f].substr(k);
								if (0 == servertype) k = specialChars(k, "replace").replace("OFFLINE USER 00000", "WX Operator"), d = "<tr valign='top'><td>" + k + "</td><td>" + displayDateTime(t, "WX") + "</td></tr>" + d;
								else {
									var q = f.substr(5);
									q = a["EventCodes" + q].split(",")[1];
									var r = "";
									if ("undefined" !== typeof b[q]) {
										var u = decToHex(b[q][1]);
										r = -1 == $.inArray(b[q][1], [0, 255, 55295, 65280, 65535, 15658671, 16443110, 16777152, 16777215]) ? r + ("style='background-color:#" + u + "; color:#fafafa'") : r + ("style='background-color:#" + u + "'")
									}
									k = specialChars(k, "replace").replace("OFFLINE USER 00000",
										"WX Operator");
									d = "<tr " + r + " valign='top'><td>" + k + "</td><td>" + displayDateTime(t, "WX") + "</td></tr>" + d
								}
							}
						c += d + "</table></div>";
						20 > e ? $("#PreviousButton").attr("disabled", "disabled") : $("#PreviousButton").removeAttr("disabled");
						userApprove(c, "REPORT", function (a) {
							var c = 0 == servertype ? "ajax_request.php" : "PRT_CTRL_DIN_ISAPI.dll";
							a = 0 == servertype ? "type=eventlist&subtype=" + a : "Request&Type=Events&SubType=" + a;
							var d = "" == $("#StartTime").val() ? "00:00" : $("#StartTime").val(),
								e = "" == $("#EndTime").val() ? "23:59" : $("#EndTime").val();
							a += "&StartDate=" + convertDateString($("#StartDate").val()) + "T" + d + "&EndDate=" + convertDateString($("#EndDate").val()) + "T" + e;
							for (d = 0; d < currentusers.length; d++) a += "&U" + d + "=" + currentusers[d];
							for (d = 0; d < currentdoors.length; d++) a += "&DoorId" + d + "=" + currentdoors[d];
							for (d = 0; d < currentareas.length; d++) a += "&AreaId" + d + "=" + currentareas[d];
							runQuery(c, a, 1 == servertype, !0).done(function (a) {
								a = decryptAES(a);
								if ("Event" == a.substr(0, 5)) {
									a = convertToObject(a);
									$("table.reporttablefull").html("<tr id='hrow'><th>" + langtag.HeaderDesc +
										"</th><th width='170'>" + langtag.HeaderTime + "</th></tr>");
									var c = 0,
										d;
									for (d in a)
										if ("Event" == d.substr(0, 5) && "EventCode" != d.substr(0, 9)) {
											c++;
											var e = getPosition(a[d], " ", 3) + 1,
												f = a[d].substr(0, e);
											e = a[d].substr(e);
											if (0 == servertype) e = specialChars(e, "replace").replace("OFFLINE USER 00000", "WX Operator"), $("table.reporttablefull #hrow").after("<tr><td>" + e + "</td><td>" + displayDateTime(f, "WX") + "</td></tr>");
											else {
												var g = d.substr(5);
												g = a["EventCodes" + g].split(",")[1];
												var k = "";
												if ("undefined" !== typeof b[g]) {
													var l = decToHex(b[g][1]);
													k = -1 == $.inArray(b[g][1], [0, 255, 55295, 65280, 65535, 15658671, 16443110, 16777152, 16777215]) ? k + ("style='background-color:#" + l + "; color:#fafafa'") : k + ("style='background-color:#" + l + "'")
												}
												e = specialChars(e, "replace").replace("OFFLINE USER 00000", "WX Operator");
												$("table.reporttablefull #hrow").after("<tr " + k + " valign='top'><td>" + e + "</td><td>" + displayDateTime(f, "WX") + "</td></tr>")
											}
										}
									20 > c ? $("#PreviousButton").attr("disabled", "disabled") : $("#PreviousButton").removeAttr("disabled");
									$("#NextButton").removeAttr("disabled")
								}
							})
						})
					}
				})) :
				(c = "<form id='exportform' method='post' action='PRT_CTRL_DIN_ISAPI.dll'><input type='hidden' name='q' value='" + encryptAES(b) + "'></form>", $("#alerttitle").html(c), $("#exportform").submit())
		})
	}
	return !1
}

function displayList(a) {
	var b = $.browser.msie,
		c = "",
		d = 0;
	$("#tablecontent").html("");
	$("img.loading-placeholder").remove();
	for (var e = 0, f = 0; f < list.length; f++)
		if ("EventReport" == a) {
			if (-1 < list[f][1].toLowerCase().indexOf($("#DescFilter").val().toLowerCase()) && -1 < list[f][2].toLowerCase().indexOf($("#NameFilter").val().toLowerCase()) && -1 < list[f][3].toLowerCase().indexOf($("#DoorFilter").val().toLowerCase())) {
				e++;
				var k = 0 == e % 2 ? "class='even'" : "";
				"0" != list[f][7] && (k += " style='background-color:#" + decToHex(list[f][7]).substr(2,
					6) + "; color:#f0f0f0'");
				var g = b ? "" == list[f][8] || -1 < $.inArray(list[f][8], ["2147483647", "-1"]) ? "" : "<a href='' onClick=\"return displayCamera(" + list[f][8] + ", '" + list[f][4] + "');\"><img src='images/icon/camera.png' class='cameraicon'></a>" : "";
				$("#tablecontent").append("<tr " + k + " valign='top'><td align='center'>" + parseInt(list[f][0], 10) + "</td><td>" + g + "</td><td>" + list[f][1] + "</td><td>" + list[f][2] + "</td><td>" + list[f][3] + "</td><td align='center'>" + list[f][4] + "</td><td align='center'>" + list[f][5] + "</td></tr>")
			}
		} else if ("MusterReport" ==
		a) {
		if (-1 < list[f][0].toLowerCase().indexOf($("#NameFilter").val().toLowerCase()) && -1 < list[f][1].toLowerCase().indexOf($("#DoorFilter").val().toLowerCase()) && -1 < list[f][2].toLowerCase().indexOf($("#TimeFilter").val().toLowerCase()) && -1 < list[f][3].toLowerCase().indexOf($("#StatusFilter").val().toLowerCase()) && -1 < list[f][4].toLowerCase().indexOf($("#RecordGroupFilter").val().toLowerCase())) {
			e++;
			k = 0 == e % 2 ? "class='even'" : "";
			g = "" == list[f][1] ? "&nbsp;" : list[f][1];
			var l = "" == list[f][2] ? "&nbsp;" : list[f][2];
			$("#tablecontent").append("<tr " +
				k + "><td>" + list[f][0] + "</td><td>" + g + "</td><td>" + l + "</td><td>" + list[f][3] + "</td><td>" + list[f][4] + "</td></tr>")
		}
	} else if ("UserReport" == a) {
		var m = !0;
		for (g = k = 0; g < column.length; g++)
			if ("FacilityCardNumber" == column[g])
				for (l = 0; l < numcards; l++) - 1 == list[f][g + l].toLowerCase().indexOf($("#CardNumber" + l + "Filter").val().toLowerCase()) && (m = !1), 0 < l && k++;
			else if ("AccessLevels" == column[g])
			for (l = 0; l < numaccesslevels; l++) - 1 == list[f][g + l].toLowerCase().indexOf($("#AccessLevel" + l + "Filter").val().toLowerCase()) && (m = !1), 0 < l &&
				k++;
		else -1 == list[f][g + k].toLowerCase().indexOf($("#" + column[g] + "Filter").val().toLowerCase()) && (m = !1);
		if (m) {
			k = 0 == e % 2 ? "class='even'" : "";
			m = "<tr " + k + ">";
			for (g = k = 0; g < column.length; g++)
				if ("FacilityCardNumber" == column[g])
					for (l = 0; l < numcards; l++) 0 < l && k++, m += "<td>" + list[f][g + k] + "</td>";
				else if ("AccessLevels" == column[g])
				for (l = 0; l < numaccesslevels; l++) 0 < l && k++, m += "<td>" + list[f][g + k] + "</td>";
			else l = list[f][g + k], "2147483647" == l ? l = langtag.TagNotSet : "true" == l ? l = langtag.TagYes : "false" == l && (l = langtag.TagNo), m += "<td>" +
				l + "</td>";
			m += "</tr>";
			e++;
			$("#tablecontent").append(m)
		}
	} else "AttendanceReport" == a && -1 < list[f][0].toLowerCase().indexOf($("#NameFilter").val().toLowerCase()) && -1 < list[f][1].toLowerCase().indexOf($("#DateFilter").val().toLowerCase()) && -1 < list[f][2].toLowerCase().indexOf($("#ShiftNameFilter").val().toLowerCase()) && -1 < list[f][3].toLowerCase().indexOf($("#InTimeFilter").val().toLowerCase()) && -1 < list[f][4].toLowerCase().indexOf($("#InDoorFilter").val().toLowerCase()) && -1 < list[f][5].toLowerCase().indexOf($("#OutTimeFilter").val().toLowerCase()) &&
		-1 < list[f][6].toLowerCase().indexOf($("#OutDoorFilter").val().toLowerCase()) && -1 < list[f][7].toLowerCase().indexOf($("#TotalFilter").val().toLowerCase()) && -1 < list[f][8].toLowerCase().indexOf($("#DeductFilter").val().toLowerCase()) && -1 < list[f][9].toLowerCase().indexOf($("#AccrualFilter").val().toLowerCase()) && -1 < list[f][10].toLowerCase().indexOf($("#PayCodeFilter").val().toLowerCase()) && (list[f][0] != c && "" != c && 1 > sortCol && ($("#tablecontent").append("<tr class='attusertotal'><td colspan=9></td><td align='center'>" +
			minsToHours(d) + "</td><td colspan=1></td></tr>"), e = d = 0), e++, k = 0 == e % 2 ? "class='even'" : "", $("#tablecontent").append("<tr " + k + "><td>" + list[f][0] + "</td><td>" + list[f][1] + "</td><td>" + list[f][2] + "</td><td class='attusertotal'>" + list[f][3] + "</td><td>" + list[f][4] + "</td><td>" + list[f][5] + "</td><td>" + list[f][6] + "</td><td align='center'>" + list[f][7] + "</td><td align='center'>" + list[f][8] + "</td><td align='center'>" + minsToHours(list[f][9]) + "</td><td align='center'>" + list[f][10] + "</td></tr>"), c = list[f][0], d += parseInt(list[f][9],
			10));
	"AttendanceReport" == a && "" != c && 1 > sortCol && $("#tablecontent").append("<tr class='attusertotal'><td colspan=9></td><td align='center'>" + minsToHours(d) + "</td><td colspan=1></td></tr>")
}

function listSort(a, b, c) {
	sortCol != b && (sortDir = 1);
	$("img[id^=col]").each(function () {
		this.id == "col" + b ? (sortCol = b, c && (sortDir = 0 == sortDir ? 1 : 0), 0 == sortDir ? $("#col" + b).css("transform", "rotate(-90deg)") : $("#col" + b).css("transform", "rotate(90deg)"), $("#col" + b).fadeIn("fast")) : $("#" + this.id).fadeOut("fast")
	});
	list.sort(function (a, c) {
		a = a[b].toLowerCase();
		c = c[b].toLowerCase();
		return 0 == sortDir ? a > c ? 1 : -1 : a > c ? -1 : 1
	});
	displayList(a)
}

function populateEventReport() {
	$("#loadingmore").removeClass("hiddentab").html(langtag.LoadingEvents);
	pageNum++;
	var a = "ReportId=" + $("#EventReportId").val() + "&StartDate=" + convertDateString($("#StartDate").val()) + "T" + $("#StartTime").val();
	if ($("#ReportPeriodId").is("[disabled]"))
		if ($("#EndDateValid").is(":checked")) a += "&EndDate=" + convertDateString($("#EndDate").val()) + "T" + $("#EndTime").val();
		else {
			var b = getLocalTime();
			a += "&EndDate=" + convertDateString(convertTimeStamp(b, "date")) + "T" + convertTimeStamp(b,
				"time")
		}
	else a += "&EndDate=" + convertDateString($("#EndDate").val()) + "T" + $("#EndTime").val();
	a += "&page=" + pageNum;
	runQuery("ajax_request.php?type=gxeventlist", a, !1, !0).done(function (a) {
		"<no response>" == a && ($("#loadingmore").addClass("hiddentab"), additionalRequest = !1);
		var b = {};
		a = a.split("&");
		for (var c = 0; c < a.length; c++) {
			var f = a[c].split("=");
			b[f[0]] = specialChars(f[1], "XMLreplace")
		}
		for (var k in b) "EventId" == k.substring(0, 7) && (a = k.replace("EventId", ""), list.push([str_pad_left(10, "0", b["EventId" + a]), b["Desc" +
			a], b["User" + a], b["Door" + a], reportDate(b["Field" + a]), reportDate(b["Logged" + a]), b["Alarm" + a], b["Colour" + a], b["Camera" + a]])); - 1 < sortCol && listSort("EventReport", sortCol, !1);
		displayList("EventReport");
		$("#dategeneratedtext").remove();
		$("#fullscreen").append("<p id='dategeneratedtext'>" + langtag.TagReportGenerated + "&nbsp;<span id='dategenerated'>" + moment().format("DD/MM/YYYY h:mm:ssa") + "</span></p>");
		additionalRequest ? populateEventReport() : $("#loadingmore").addClass("hiddentab")
	})
}

function runGXEventReport(a) {
	"2147483647" !== $("#EventReportId").val() && ("display" == a ? ($("#alertcontainer").css("display", "none"), checkReportPeriod(), list = [], $("#tablecontent").html(""), $("#dategeneratedtext").remove(), additionalRequest = !0, populateEventReport(pageNum), changes = !1) : "absencereport" == a ? ($("#alertcontainer").css("display", "none"), checkReportPeriod(), $("#ReportPeriodTitle").text($("#StartDate").val() + " " + $("#StartTime").val() + " - " + $("#EndDate").val() + " " + $("#EndTime").val()), usersList = [], usersInEventFilterList = [], usersInEventsList = [], $("#tablecontent").html(""), requestList("GXT_USERS_TBL", function (a) {
			a = a.split("&");
			for (var b = 0; b < a.length; b++) {
				var d = a[b].split("=");
				usersList[d[0]] = $.trim(d[1])
			}
			a = "id=" + $("#EventFilterId").val();
			runQuery("ajax_requestdetail.php?subtype=GXT_EVENTFILTERS_TBL", a, !1, !0).done(function (a) {
				if ("<no response>" != a) {
					a = a.split("&");
					for (var b = 0; b < a.length; b++) {
						var c = a[b].split("=");
						"UserId" == c[0].substring(0, 6) && "undefined" != typeof usersList[c[1]] && usersInEventFilterList.push(usersList[c[1]])
					}
				}
			})
		}),
		additionalRequest = !0, GXAbsenceReport.loadEvents()) : (additionalRequest = !1, pageNum = 0, $("#messagefg > div > div").css("padding", "0 10px 0 15px"), $("#alertcontainer").css("display", "block"), $("#messagefg").css("display", "block")));
	return !1
}

function checkReportPeriod() {
	if (!$("#ReportPeriodId").is("[disabled]")) {
		var a = getLocalTime(),
			b = convertDateString(convertTimeStamp(a, "date")).split("-");
		b[1] = parseInt(b[1], 10);
		switch ($("#ReportPeriodId").val()) {
			case "0":
				$("#StartDate").val(convertTimeStamp(a, "date"));
				$("#StartTime").val("00:00");
				$("#EndDate").val(convertTimeStamp(a, "date"));
				$("#EndTime").val("23:59");
				break;
			case "1":
				$("#StartDate").val(convertTimeStamp(a - 864E5, "date"));
				$("#StartTime").val("00:00");
				$("#EndDate").val(convertTimeStamp(a,
					"date"));
				$("#EndTime").val("00:00");
				break;
			case "2":
				$("#StartDate").val(convertTimeStamp(a - 1728E5, "date"));
				$("#StartTime").val("00:00");
				$("#EndDate").val(convertTimeStamp(a - 864E5, "date"));
				$("#EndTime").val("00:00");
				break;
			case "3":
				$("#StartDate").val(convertTimeStamp(a - 36E5, "date"));
				$("#StartTime").val(convertTimeStamp(a - 36E5, "time"));
				$("#EndDate").val(convertTimeStamp(a, "date"));
				$("#EndTime").val(convertTimeStamp(a, "time"));
				break;
			case "4":
				$("#StartDate").val(convertTimeStamp(a - 432E5, "date"));
				$("#StartTime").val(convertTimeStamp(a -
					432E5, "time"));
				$("#EndDate").val(convertTimeStamp(a, "date"));
				$("#EndTime").val(convertTimeStamp(a, "time"));
				break;
			case "5":
				$("#StartDate").val(convertTimeStamp(a - 864E5, "date"));
				$("#StartTime").val(convertTimeStamp(a, "time"));
				$("#EndDate").val(convertTimeStamp(a, "date"));
				$("#EndTime").val(convertTimeStamp(a, "time"));
				break;
			case "6":
				$("#StartDate").val(convertTimeStamp(a - 1728E5, "date"));
				$("#StartTime").val(convertTimeStamp(a, "time"));
				$("#EndDate").val(convertTimeStamp(a, "date"));
				$("#EndTime").val(convertTimeStamp(a,
					"time"));
				break;
			case "7":
				$("#StartDate").val(convertTimeStamp(a - 6048E5, "date"));
				$("#StartTime").val(convertTimeStamp(a, "time"));
				$("#EndDate").val(convertTimeStamp(a, "date"));
				$("#EndTime").val(convertTimeStamp(a, "time"));
				break;
			case "8":
				$("#StartDate").val(convertTimeStamp(a - 12096E5, "date"));
				$("#StartTime").val(convertTimeStamp(a, "time"));
				$("#EndDate").val(convertTimeStamp(a, "date"));
				$("#EndTime").val(convertTimeStamp(a, "time"));
				break;
			case "9":
				$("#StartDate").val(convertTimeStamp(a - 18144E5, "date"));
				$("#StartTime").val(convertTimeStamp(a, "time"));
				$("#EndDate").val(convertTimeStamp(a, "date"));
				$("#EndTime").val(convertTimeStamp(a, "time"));
				break;
			case "10":
				2 > b[1] ? (b[0] = parseInt(b[0], 10) - 1, b[1] = 12) : b[1]--;
				for (var c in monthnum) monthnum[c] == b[1] && (b[1] = c);
				$("#StartDate").val(b[2] + " " + b[1] + " " + b[0]);
				$("#StartTime").val(convertTimeStamp(a, "time"));
				$("#EndDate").val(convertTimeStamp(a, "date"));
				$("#EndTime").val(convertTimeStamp(a, "time"));
				break;
			case "11":
				3 > b[1] ? (b[0] = parseInt(b[0], 10) - 1, b[1] += 10) : b[1] -=
					2;
				for (c in monthnum) monthnum[c] == b[1] && (b[1] = c);
				$("#StartDate").val(b[2] + " " + b[1] + " " + b[0]);
				$("#StartTime").val(convertTimeStamp(a, "time"));
				$("#EndDate").val(convertTimeStamp(a, "date"));
				$("#EndTime").val(convertTimeStamp(a, "time"));
				break;
			case "12":
				4 > b[1] ? (b[0] = parseInt(b[0], 10) - 1, b[1] += 9) : b[1] -= 3;
				for (c in monthnum) monthnum[c] == b[1] && (b[1] = c);
				$("#StartDate").val(b[2] + " " + b[1] + " " + b[0]);
				$("#StartTime").val(convertTimeStamp(a, "time"));
				$("#EndDate").val(convertTimeStamp(a, "date"));
				$("#EndTime").val(convertTimeStamp(a,
					"time"));
				break;
			case "13":
				6 > b[1] ? (b[0] = parseInt(b[0], 10) - 1, b[1] += 6) : b[1] -= 6;
				for (c in monthnum) monthnum[c] == b[1] && (b[1] = c);
				$("#StartDate").val(b[2] + " " + b[1] + " " + b[0]);
				$("#StartTime").val(convertTimeStamp(a, "time"));
				$("#EndDate").val(convertTimeStamp(a, "date"));
				$("#EndTime").val(convertTimeStamp(a, "time"));
				break;
			case "14":
				for (c in monthnum) monthnum[c] == b[1] && (b[1] = c);
				$("#StartDate").val(b[2] + " " + b[1] + " " + (parseInt(b[0], 10) - 1));
				$("#StartTime").val(convertTimeStamp(a, "time"));
				$("#EndDate").val(convertTimeStamp(a,
					"date"));
				$("#EndTime").val(convertTimeStamp(a, "time"));
				break;
			case "15":
				for (c in monthnum) monthnum[c] == b[1] && (b[1] = c);
				$("#StartDate").val(b[2] + " " + b[1] + " " + (parseInt(b[0], 10) - 2));
				$("#StartTime").val(convertTimeStamp(a, "time"));
				$("#EndDate").val(convertTimeStamp(a, "date"));
				$("#EndTime").val(convertTimeStamp(a, "time"));
				break;
			case "101":
				1 == b[1] ? ($("#StartDate").val("1 " + langtag.MonthJan + " " + (parseInt(b[0], 10) - 1)), $("#EndDate").val("1 " + langtag.MonthFeb + " " + (parseInt(b[0], 10) - 1))) : ($("#StartDate").val("1 " +
					langtag.MonthJan + " " + b[0]), $("#EndDate").val("1 " + langtag.MonthFeb + " " + b[0]));
				$("#StartTime").val("00:00");
				$("#EndTime").val("00:00");
				break;
			case "102":
				2 < b[1] ? ($("#StartDate").val("1 " + langtag.MonthFeb + " " + b[0]), $("#EndDate").val("1 " + langtag.MonthMar + " " + b[0])) : ($("#StartDate").val("1 " + langtag.MonthFeb + " " + (parseInt(b[0], 10) - 1)), $("#EndDate").val("1 " + langtag.MonthMar + " " + (parseInt(b[0], 10) - 1)));
				$("#StartTime").val("00:00");
				$("#EndTime").val("00:00");
				break;
			case "103":
				3 < b[1] ? ($("#StartDate").val("1 " +
					langtag.MonthMar + " " + b[0]), $("#EndDate").val("1 " + langtag.MonthApr + " " + b[0])) : ($("#StartDate").val("1 " + langtag.MonthMar + " " + (parseInt(b[0], 10) - 1)), $("#EndDate").val("1 " + langtag.MonthApr + " " + (parseInt(b[0], 10) - 1)));
				$("#StartTime").val("00:00");
				$("#EndTime").val("00:00");
				break;
			case "104":
				4 < b[1] ? ($("#StartDate").val("1 " + langtag.MonthApr + " " + b[0]), $("#EndDate").val("1 " + langtag.MonthMay + " " + b[0])) : ($("#StartDate").val("1 " + langtag.MonthApr + " " + (parseInt(b[0], 10) - 1)), $("#EndDate").val("1 " + langtag.MonthMay +
					" " + (parseInt(b[0], 10) - 1)));
				$("#StartTime").val("00:00");
				$("#EndTime").val("00:00");
				break;
			case "105":
				5 < b[1] ? ($("#StartDate").val("1 " + langtag.MonthMay + " " + b[0]), $("#EndDate").val("1 " + langtag.MonthJun + " " + b[0])) : ($("#StartDate").val("1 " + langtag.MonthMay + " " + (parseInt(b[0], 10) - 1)), $("#EndDate").val("1 " + langtag.MonthJun + " " + (parseInt(b[0], 10) - 1)));
				$("#StartTime").val("00:00");
				$("#EndTime").val("00:00");
				break;
			case "106":
				6 < b[1] ? ($("#StartDate").val("1 " + langtag.MonthJun + " " + b[0]), $("#EndDate").val("1 " +
					langtag.MonthJul + " " + b[0])) : ($("#StartDate").val("1 " + langtag.MonthJun + " " + (parseInt(b[0], 10) - 1)), $("#EndDate").val("1 " + langtag.MonthJul + " " + (parseInt(b[0], 10) - 1)));
				$("#StartTime").val("00:00");
				$("#EndTime").val("00:00");
				break;
			case "107":
				7 < b[1] ? ($("#StartDate").val("1 " + langtag.MonthJul + " " + b[0]), $("#EndDate").val("1 " + langtag.MonthAug + " " + b[0])) : ($("#StartDate").val("1 " + langtag.MonthJul + " " + (parseInt(b[0], 10) - 1)), $("#EndDate").val("1 " + langtag.MonthAug + " " + (parseInt(b[0], 10) - 1)));
				$("#StartTime").val("00:00");
				$("#EndTime").val("00:00");
				break;
			case "108":
				8 < b[1] ? ($("#StartDate").val("1 " + langtag.MonthAug + " " + b[0]), $("#EndDate").val("1 " + langtag.MonthSep + " " + b[0])) : ($("#StartDate").val("1 " + langtag.MonthAug + " " + (parseInt(b[0], 10) - 1)), $("#EndDate").val("1 " + langtag.MonthSep + " " + (parseInt(b[0], 10) - 1)));
				$("#StartTime").val("00:00");
				$("#EndTime").val("00:00");
				break;
			case "109":
				9 < b[1] ? ($("#StartDate").val("1 " + langtag.MonthSep + " " + b[0]), $("#EndDate").val("1 " + langtag.MonthOct + " " + b[0])) : ($("#StartDate").val("1 " +
					langtag.MonthSep + " " + (parseInt(b[0], 10) - 1)), $("#EndDate").val("1 " + langtag.MonthOct + " " + (parseInt(b[0], 10) - 1)));
				$("#StartTime").val("00:00");
				$("#EndTime").val("00:00");
				break;
			case "110":
				10 < b[1] ? ($("#StartDate").val("1 " + langtag.MonthOct + " " + b[0]), $("#EndDate").val("1 " + langtag.MonthNov + " " + b[0])) : ($("#StartDate").val("1 " + langtag.MonthOct + " " + (parseInt(b[0], 10) - 1)), $("#EndDate").val("1 " + langtag.MonthNov + " " + (parseInt(b[0], 10) - 1)));
				$("#StartTime").val("00:00");
				$("#EndTime").val("00:00");
				break;
			case "111":
				12 ==
					b[1] ? ($("#StartDate").val("1 " + langtag.MonthNov + " " + b[0]), $("#EndDate").val("1 " + langtag.MonthDec + " " + b[0])) : ($("#StartDate").val("1 " + langtag.MonthNov + " " + (parseInt(b[0], 10) - 1)), $("#EndDate").val("1 " + langtag.MonthDec + " " + (parseInt(b[0], 10) - 1)));
				$("#StartTime").val("00:00");
				$("#EndTime").val("00:00");
				break;
			case "112":
				$("#StartDate").val("1 " + langtag.MonthDec + " " + (parseInt(b[0], 10) - 1)), $("#EndDate").val("1 " + langtag.MonthJan + " " + b[0]), $("#StartTime").val("00:00"), $("#EndTime").val("00:00")
		}
	}
}

function declareOrResetGlobalVars(a) {
	selectedRecordId = 0;
	recordList = [];
	recordStore = {
		MultiSelect: !1
	};
	switch (a) {
		case "AccessLevel":
			areagroupname = {};
			armingareagroupname = {};
			disarmingareagroupname = {};
			doorname = {};
			doorctrl = [];
			doorgroupname = {};
			floorname = {};
			floorctrl = [];
			floorgroupname = {};
			elevatorgroupname = {};
			menugroupname = {};
			menugroupctrl = [];
			outputname = {};
			outputctrl = [];
			outputgroupname = {};
			lockname = {};
			lockgroupname = {};
			break;
		case "Addressing":
			addresslist = {};
			break;
		case "AnalogExpander":
			analogname = {};
			break;
		case "Area":
			servicename = {};
			servicectrl = {};
			break;
		case "AreaGroup":
			areaname = {};
			areactrl = {};
			break;
		case "CalendarAction":
			doorname = {};
			outputname = {};
			eventList = [];
			break;
		case "Camera":
			namelist = [];
			break;
		case "DataValue":
			dataname = {};
			break;
		case "DaylightSaving":
			controller = [];
			break;
		case "Door":
			controller = [];
			break;
		case "DoorGroup":
			doorname = {};
			doorctrl = [];
			schedulehtml = "";
			break;
		case "DoorType":
			credentialtypename = {};
			break;
		case "Elevator":
			floorname = {};
			outputhtml = inputhtml = areahtml = schedulehtml = "";
			break;
		case "ElevatorGroup":
			elevatorname = {};
			elevatorctrl = [];
			schedulehtml = "";
			break;
		case "EventReport":
			username = {};
			doorname = {};
			areaname = {};
			break;
		case "Firmware":
			errormsg = "";
			selectedaddresses = [];
			retry = 1;
			break;
		case "FloorGroup":
			floorname = {};
			floorctrl = [];
			schedulehtml = "";
			break;
		case "GXAbsenceReport":
			sortCol = -1;
			sortDir = 1;
			list = [];
			pageNum = 0;
			additionalRequest = !0;
			break;
		case "GXAttendanceReport":
			sortCol = -1;
			sortDir = 1;
			list = [];
			recordgroup = {};
			break;
		case "GXDoor":
			controller = [];
			break;
		case "GXEnterpriseMusterReport":
			currentId = -1;
			sortCol = 0;
			sortDir = 1;
			list = [];
			column = [];
			numcards = numcards = 0;
			accesslevel = {};
			area = {};
			areagroup = {};
			recordgroup = {};
			doorgroup = {};
			break;
		case "GXEventFilter":
			typename = [];
			currentdevicelist = {};
			currentdevicelist2 = {};
			break;
		case "GXEventReport":
			sortCol = -1;
			sortDir = 1;
			list = [];
			pageNum = 0;
			additionalRequest = !0;
			break;
		case "GXEventReportSetup":
			filtername = {};
			break;
		case "GXMusterReport":
			sortCol = -1;
			sortDir = 1;
			list = [];
			recordgroup = [];
			intval = 0;
			break;
		case "Role":
			sitename = {};
			securitylevelname = {};
			recordgroupname = {};
			parentgroup = {};
			break;
		case "GXStatusPage":
			statuslist = [];
			substatuslist = [];
			controller = {};
			currentId = -1;
			break;
		case "GXUserReport":
			sortCol = -1;
			sortDir = 1;
			list = [];
			column = [];
			numcards = numcards = 0;
			accesslevel = {};
			area = {};
			areagroup = {};
			recordgroup = {};
			doorgroup = {};
			break;
		case "HolidayGroup":
			currentholidays = [];
			dummy = [];
			break;
		case "Input":
			addresslist = {};
			break;
		case "InputExpander":
			inputname = {};
			break;
		case "Keypad":
			keypadname = {};
			break;
		case "KeypadGroup":
			keypadname = {};
			break;
		case "MenuGroup":
			menuname = {};
			controller = [];
			keypadgroupname = {};
			break;
		case "MonitoringArea":
			status1list = {
				0: "24hrDisabled",
				1: "Busy",
				128: "24hrEnabled"
			};
			status2list = {
				0: "Disarmed",
				1: "ZoneOpenWaitingForUser",
				2: "TroubleConditionWaitingForUser",
				3: "BypassErrorWaitingForUser",
				4: "BypassWarningWaitingForUser",
				5: "UserCountNotZeroWaitingForUser",
				128: "Armed",
				129: "ExitDelay",
				130: "EntryDelay",
				131: "DisarmDelay",
				132: "CodeDelay"
			};
			notificationlist = {
				0: "AlarmActivated",
				1: "SirenActivated",
				2: "AlarmsInMemory",
				3: "RemoteArmed",
				4: "ForceArmed",
				5: "InstantArmed",
				6: "PartialArmed"
			};
			break;
		case "MonitoringDoor":
			cameraurl = {};
			caminterval = {};
			statuslist = {
				0: "Locked",
				1: "UnlockedByUser",
				2: "UnlockedBySchedule",
				3: "UnlockedByUserTimed",
				4: "UnlockedByUserLatched",
				5: "UnlockedByExitDevice",
				6: "UnlockedByEntryDevice",
				7: "UnlockedByOperator",
				8: "UnlockedByOperatorTimed",
				9: "UnlockedByOperatorLatch",
				10: "UnlockedByArea",
				11: "UnlockedByFireAlarm",
				12: "LockedByCalendarAction",
				13: "UnlockedByCalendarAction",
				14: "UnlockedUsingExtendedDoorTime",
				15: "UnlockedUsingExtendedDoorTime",
				16: "UnlockedUsingExtendedDoorTime",
				17: "UnlockedUsingExtendedDoorTime",
				18: "LockedUsingExtendedDoorTime",
				19: "LockedDownEntryAllowed",
				20: "LockedDownEntryExitAllowed",
				21: "LockedDownExitAllowed",
				22: "LockedDownEntryExitDenied",
				23: "NotLocked",
				24: "NotLocked",
				255: "Unknown"
			};
			positionlist = {
				0: "Closed",
				1: "Open",
				2: "OpenAlert",
				3: "LeftOpen",
				4: "ForcedOpen",
				5: "BondingFault",
				255: "Unknown"
			};
			break;
		case "MonitoringElevator":
			statuslist = {
				0: "Locked",
				1: "UnlockedSchedule",
				2: "UnlockedArea",
				3: "Unlocked",
				4: "UnlockedTimed"
			};
			break;
		case "MonitoringEvent":
			timer = {};
			break;
		case "MonitoringInput":
			statuslist = {
				0: "ClosedOff",
				1: "OpenOn",
				2: "Tamper",
				3: "ShortCircuit"
			};
			functionlist = {
				0: "InputBypassed",
				1: "InputBypassedLatched",
				2: "SirenLockout"
			};
			break;
		case "MonitoringOutput":
			statuslist = {
				0: "Off",
				1: "On",
				2: "PulseOn",
				3: "OnTimed",
				4: "OnPulseTimed"
			};
			break;
		case "MonitoringProgrammableFunction":
			statuslist = {
				0: "Halted",
				1: "Running",
				2: "ProgramError"
			};
			commandlist = {
				0: "StopFunction",
				1: "StartFunction"
			};
			break;
		case "MonitoringSchedule":
			statuslist = {
				0: "Inactive",
				1: "Active1",
				2: "Active2",
				3: "Active3",
				4: "Active4",
				5: "Active5",
				6: "Active6",
				7: "Active7"
			};
			break;
		case "MonitoringService":
			statuslist = {
				0: "Halted",
				1: "Running",
				2: "Failure",
				3: "PortInUse",
				4: "ProgramError",
				5: "OnHoldByService"
			};
			break;
		case "MonitoringTroubleInput":
			statuslist = {
				0: "ClosedOff",
				1: "OpenOn"
			};
			functionlist = {
				0: "InputBypassed",
				1: "InputBypassedLatched"
			};
			break;
		case "MonitoringSaltoDoor":
			cameraurl = {};
			caminterval = {};
			break;
		case "Operator":
			namelist = [];
			break;
		case "Output":
			addresslist = {};
			break;
		case "OutputExpander":
			outputname = {};
			break;
		case "OutputGroup":
			outputname = {};
			outputctrl = {};
			break;
		case "ProgrammableFunction":
			programmablename = {};
			break;
		case "Reader":
			addresslist = {};
			assigneddoor = [];
			crossassigneddoor = [];
			credentialtypename = {};
			break;
		case "ReaderExpander":
			currentallegion1 = [];
			currentallegion2 = [];
			dummy = [];
			assigneddoor = [];
			crossassigneddoor = [];
			break;
		case "Schedule":
			holidaygroupname = {};
			break;
		case "SecurityLevel":
			sitename = {};
			break;
		case "Services":
			controllerip = [];
			break;
		case "Settings":
			reloadsettings = !1;
			break;
		case "TroubleInput":
			addresslist = {};
			break;
		case "User":
			accesslevelname = {};
			areagroupname = {};
			lockname = {};
			lockgroupname = {};
			customlist = {};
			credentialtypename = {};
			break;
		case "UserSearch":
			dtInstance = {};
			break;
		case "Wizard":
			areaname = [], doorname = [], expanderlist = {}, numreqs = {}, modulename = {}, schedulename = [], doorlist = {}, doordetails = [], arealist = {}, inputlist = {}, timerval = 0, analogexpanderlist = {}, keypadlist = {}, inputexpanderlist = {}, outputexpanderlist = {}, readerexpanderlist = {}, controllerip = [], areagroup = {}, userlist = {}, userarealist = {}, userdoorlist = {}, accesslevelarea = [], accessleveldoor = []
	}
};
