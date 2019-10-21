// mcrypt.js
var mcrypt = mcrypt ? mcrypt : new function () {
	var r = {
			"rijndael-128": [16, 32],
			"rijndael-192": [24, 32],
			"rijndael-256": [32, 32],
			serpent: [16, 32],
			twofish: [16, 32]
		},
		e = {};
	e["rijndael-128"] = function (r, e, t, n) {
		return t.length < 16 ? t += Array(17 - t.length).join(String.fromCharCode(0)) : t.length < 24 && t.length > 16 ? t += Array(25 - t.length).join(String.fromCharCode(0)) : t.length < 32 && t.length > 24 && (t += Array(33 - t.length).join(String.fromCharCode(0))), n ? Rijndael.Encrypt(e, t) : Rijndael.Decrypt(e, t), e
	}, e["rijndael-192"] = e["rijndael-128"], e["rijndael-256"] = e["rijndael-128"], e.serpent = function (r, e, t, n) {
		return n ? Serpent.Encrypt(e) : Serpent.Decrypt(e), e
	}, e.serpent.init = function (r, e, t) {
		for (var n = [], o = 0; o < e.length; o++) n[o] = e.charCodeAt(o);
		Serpent.Init(n)
	}, e.serpent.deinit = function (r, e, t) {
		Serpent.Close()
	}, e.twofish = function (r, e, t, n) {
		return n ? Twofish.Encrypt(e) : Twofish.Decrypt(e), e
	}, e.twofish.init = function (r, e, t) {
		Twofish.Init(e)
	}, e.twofish.deinit = function (r, e, t) {
		Twofish.Close()
	};
	var t = {};
	t.Encrypt = function (r, e, n, o, a) {
		return t.Crypt(!0, r, e, n, o, a)
	}, t.Decrypt = function (r, e, n, o, a) {
		return t.Crypt(!1, r, e, n, o, a)
	}, t.Crypt = function (t, i, c, f, h, s) {
		if (f ? a = f : f = a, h ? o = h : h = o, s ? n = s : s = n, !i) return !0;
		e[h].init && e[h].init(h, f, t);
		var d = r[h][0],
			u = d,
			C = new Array(d);
		switch (s) {
			case "cfb":
				u = 1;
			case "cbc":
			case "ncfb":
			case "nofb":
			case "ctr":
				if (!c) throw "mcrypt.Crypt: IV Required for mode " + s;
				if (c.length != d) throw "mcrypt.Crypt: IV must be " + d + " characters long for " + h;
				for (var l = d - 1; l >= 0; l--) C[l] = c.charCodeAt(l);
				break;
			case "ecb":
				break;
			default:
				throw "mcrypt.Crypt: Unsupported mode of opperation" + n
		}
		var p = Math.ceil(i.length / u),
			v = i.length;
		i += Array(p * u - v + 1).join(String.fromCharCode(0));
		var b = "";
		switch (s) {
			case "ecb":
				for (var l = 0; p > l; l++) {
					for (var g = 0; u > g; g++) C[g] = i.charCodeAt(l * u + g);
					e[h](h, C, a, t);
					for (var g = 0; u > g; g++) b += String.fromCharCode(C[g])
				}
				break;
			case "cbc":
				if (t)
					for (var l = 0; p > l; l++) {
						for (var g = 0; u > g; g++) C[g] = i.charCodeAt(l * u + g) ^ C[g];
						e[h](h, C, a, !0);
						for (var g = 0; u > g; g++) b += String.fromCharCode(C[g])
					} else
						for (var l = 0; p > l; l++) {
							var y = C;
							C = new Array(u);
							for (var g = 0; u > g; g++) C[g] = i.charCodeAt(l * u + g);
							var m = C.slice(0);
							e[h](h, m, a, !1);
							for (var g = 0; u > g; g++) b += String.fromCharCode(y[g] ^ m[g])
						}
				break;
			case "cfb":
				for (var l = 0; p > l; l++) {
					var y = C.slice(0);
					e[h](h, y, a, !0), y = y[0] ^ i.charCodeAt(l), C.push(t ? y : i.charCodeAt(l)), C.shift(), b += String.fromCharCode(y)
				}
				b = b.substr(0, v);
				break;
			case "ncfb":
				for (var l = 0; p > l; l++) {
					e[h](h, C, a, !0);
					for (var g = 0; u > g; g++) {
						var y = i.charCodeAt(l * u + g);
						C[g] = y ^ C[g], b += String.fromCharCode(C[g]), t || (C[g] = y)
					}
				}
				b = b.substr(0, v);
				break;
			case "nofb":
				for (var l = 0; p > l; l++) {
					e[h](h, C, a, !0);
					for (var g = 0; u > g; g++) b += String.fromCharCode(i.charCodeAt(l * u + g) ^ C[g])
				}
				b = b.substr(0, v);
				break;
			case "ctr":
				for (var l = 0; p > l; l++) {
					y = C.slice(0), e[h](h, y, a, !0);
					for (var g = 0; u > g; g++) b += String.fromCharCode(i.charCodeAt(l * u + g) ^ y[g]);
					var w = 1,
						A = u;
					do A--, C[A] += 1, w = C[A] >> 8, C[A] &= 255; while (w)
				}
				b = b.substr(0, v)
		}
		return e[h].deinit && e[h].deinit(h, f, t), b
	}, t.get_block_size = function (e, t) {
		return e || (e = o), r[e] ? r[e][0] : !1
	}, t.get_cipher_name = function (e) {
		return e || (e = o), r[e] ? e : !1
	}, t.get_iv_size = function (e, t) {
		return e || (e = o), r[e] ? r[e][0] : !1
	}, t.get_key_size = function (e, t) {
		return e || (e = o), r[e] ? r[e][1] : !1
	}, t.list_algorithms = function () {
		var e = [];
		for (var t in r) e.push(t);
		return e
	}, t.list_modes = function () {
		return ["ecb", "cbc", "cfb", "ncfb", "nofb", "ctr"]
	};
	var n = "cbc",
		o = "rijndael-128",
		a = "12345678911234567892123456789312";
	return t
};

// rijndael.js
var Rijndael = Rijndael ? Rijndael : new function () {
	var r = {};
	r.Encrypt = function (r, e) {
		o(r, e, !0)
	}, r.Decrypt = function (r, e) {
		o(r, e, !1)
	};
	for (var e = [16, 24, 32], a = [
			[10, 12, 14],
			[12, 12, 14],
			[14, 14, 14]
		], n = {}, t = function (r) {
			if (!n[r]) {
				var e, a = r.length,
					t = 1;
				e = 480, keyA = new Array(e);
				for (var o = 0; a > o; o++) keyA[o] = r.charCodeAt(o);
				for (var o = a; e > o; o += 4) {
					var f = keyA.slice(o - 4, o);
					o % a == 0 ? (f = [c[f[1]] ^ t, c[f[2]], c[f[3]], c[f[0]]], (t <<= 1) >= 256 && (t ^= 283)) : a > 24 && o % a == 16 && (f = [c[f[0]], c[f[1]], c[f[2]], c[f[3]]]);
					for (var i = 0; 4 > i; i++) keyA[o + i] = keyA[o + i - a] ^ f[i]
				}
				n[r] = keyA
			}
			return n[r]
		}, o = function (r, e, n) {
			var o = r.length,
				f = e.length,
				l = 0,
				v = 0;
			switch (o) {
				case 32:
					l++;
				case 24:
					l++;
				case 16:
					break;
				default:
					throw "rijndael: Unsupported block size: " + r.length
			}
			switch (f) {
				case 32:
					v++;
				case 24:
					v++;
				case 16:
					break;
				default:
					throw "rijndael: Unsupported key size: " + e.length
			}
			var u = a[l][v];
			e = t(e);
			var w = u * o;
			if (n) {
				A(r, e.slice(0, o));
				for (var p = i[l], j = o; w > j; j += o) h(r, c), d(r, p), g(r), A(r, e.slice(j, j + o));
				h(r, c), d(r, p), A(r, e.slice(j, j + o))
			} else {
				A(r, e.slice(w, w + o));
				var p = y[l];
				d(r, p), h(r, s);
				for (var j = w - o; j >= o; j -= o) A(r, e.slice(j, j + o)), k(r), d(r, p), h(r, s);
				A(r, e.slice(0, o))
			}
		}, c = new Array(99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22), f = [
			[0, 1, 2, 3],
			[0, 1, 2, 3],
			[0, 1, 3, 4]
		], i = Array(3), l = 0; 3 > l; l++) {
		i[l] = Array(e[l]);
		for (var v = e[l]; v >= 0; v--) i[l][v] = (v + (f[l][3 & v] << 2)) % e[l]
	}
	for (var s = new Array(256), l = 0; 256 > l; l++) s[c[l]] = l;
	for (var y = Array(3), l = 0; 3 > l; l++) {
		y[l] = Array(e[l]);
		for (var v = e[l]; v >= 0; v--) y[l][i[l][v]] = v
	}
	for (var u = new Array(256), l = 0; 128 > l; l++) u[l] = l << 1, u[128 + l] = l << 1 ^ 27;
	var h = function (r, e) {
			for (var a = r.length - 1; a >= 0; a--) r[a] = e[r[a]]
		},
		A = function (r, e) {
			for (var a = r.length - 1; a >= 0; a--) r[a] ^= e[a]
		},
		d = function (r, e) {
			for (var a = r.slice(0), n = r.length - 1; n >= 0; n--) r[n] = a[e[n]]
		},
		g = function (r) {
			for (var e = r.length - 4; e >= 0; e -= 4) {
				var a = r[e + 0],
					n = r[e + 1],
					t = r[e + 2],
					o = r[e + 3],
					c = a ^ n ^ t ^ o;
				r[e + 0] ^= c ^ u[a ^ n], r[e + 1] ^= c ^ u[n ^ t], r[e + 2] ^= c ^ u[t ^ o], r[e + 3] ^= c ^ u[o ^ a]
			}
		},
		k = function (r) {
			for (var e = r.length - 4; e >= 0; e -= 4) {
				var a = r[e + 0],
					n = r[e + 1],
					t = r[e + 2],
					o = r[e + 3],
					c = a ^ n ^ t ^ o,
					f = u[c],
					i = u[u[f ^ a ^ t]] ^ c,
					l = u[u[f ^ n ^ o]] ^ c;
				r[e + 0] ^= i ^ u[a ^ n], r[e + 1] ^= l ^ u[n ^ t], r[e + 2] ^= i ^ u[t ^ o], r[e + 3] ^= l ^ u[o ^ a]
			}
		};
	return r
};

// encryption.js
function strToHex(a) {
	for (var c = "", b = 0; b < a.length; b++) {
		var d = "" + a.charCodeAt(b).toString(16).toUpperCase();
		c += 1 == d.length ? "0" + d : d
	}
	return c
}

function decToHex(a) {
	for (var c = "", b = a, d; 0 < b;) b = Math.floor(a / 16), d = a % 16, a = b, 10 <= d && (10 == d && (d = "A"), 11 == d && (d = "B"), 12 == d && (d = "C"), 13 == d && (d = "D"), 14 == d && (d = "E"), 15 == d && (d = "F")), c = "" + d + c;
	return c
}

function hexToStr(a) {
	for (var c = "", b = 0; b < a.length; b += 2) c += "" + String.fromCharCode(parseInt(a.charAt(b) + a.charAt(b + 1), 16));
	return c
}

function xor(a, c) {
	a = unescape(encodeURIComponent(a));
	c = str_pad_left(32, "0", parseInt(c, 10).toString(2));
	for (var b = c.length, d = "", e = 0; e < a.length; e++) {
		var f = a.charCodeAt(e);
		b = 0 == b ? c.length - 8 : b - 8;
		var g = parseInt(c.substr(b, 8), 2).toString(10);
		f = (f ^ g).toString(16);
		1 == f.length && (f = "0" + f);
		d += f
	}
	return d.toUpperCase()
}

function addPKCS7(a) {
	var c = 0 == a.length % 16 ? 16 : 16 - parseInt(a.length % 16);
	for (var b = 0; b < c; b++) a += String.fromCharCode(c);
	return a
}

function spacePad(a) {
	var c = 0 == a.length % 16 ? 16 : 16 - parseInt(a.length % 16);
	for (var b = 0; b < c; b++) a += " ";
	return a
}

function removePKCS7(a) {
	var c = a.charCodeAt(a.length - 1);
	return a.substring(0, a.length - c)
}

function simpleAES(a, c) {
	a = a.toString();
	for (var b = "", d = 0; 16 > d; d++) b += String.fromCharCode(Math.floor(75 * Math.random() + 48));
	a = b + mcrypt.Encrypt(addPKCS7(a), b, c, "rijndael-128", "cbc");
	return strToHex(a)
}

function simpleAESd(a, c) {
	if (null == a) return "";
	a = hexToStr(a.toString());
	var b = a.substr(0, 16);
	a = a.substr(16, a.length);
	a = mcrypt.Decrypt(a, b, c, "rijndael-128", "cbc").replace(/\x00+$/g, "");
	return removePKCS7(a)
}

var servertype = 1;

function encryptAES(a, c) {
	a = a.toString();
	a = unescape(encodeURIComponent(a));
	"undefined" == typeof c && (c = !0);
	if (0 == servertype) return a;
	var b = localStorage.getItem("WXKey");
	if ("" == b || null == b) return a;
	for (var d = "", e = 0; 16 > e; e++) d += String.fromCharCode(Math.floor(75 * Math.random() + 48));
	a = d + mcrypt.Encrypt(addPKCS7(a), d, b, "rijndael-128", "cbc");
//	return a = c ? getCookie("SESSID") + strToHex(a) : strToHex(a)
	return a = c ? localStorage.getItem("SESSID") + strToHex(a) : strToHex(a)
}

function decryptAES(a) {
	if (null == a) return "";
	a = a.toString();
	if ("<invalid session> < Packet not Init and not encrypted. >" == a) a = 0 == servertype ? "login.php" : "login.htm", window.location = a + "?" + Math.random().toString(16).substring(2, 8).toLowerCase();
	else if ("<invalid session>" == a.substr(0, 17)) a = 0 == servertype ? "login.php?logout" : "login.htm?logout", window.location = a + "?" + Math.random().toString(16).substring(2, 8).toLowerCase();
	else {
		if (0 == servertype) return a;
		var c = localStorage.getItem("WXKey");
		if ("" == c) return a;
		a = hexToStr(a);
		var b = a.substr(0, 16);
		a = a.substr(16, a.length);
		a = mcrypt.Decrypt(a, b, c, "rijndael-128", "cbc").replace(/\x00+$/g, "");
		a = removePKCS7(a);
		return a = decodeURIComponent(escape(a))
	}
};