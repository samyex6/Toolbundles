// ==UserScript==
// @name        Full
// @namespace   Gpxplus Hack V2.3
// @include      http://gpxplus.net/stats/*
// @version      1
// @grant        unsafeWindow
// ==/UserScript==
var Tools = {
    ajax: function(request, page, log, data, queueobj, callback, error) {
        if (typeof data == 'object') data.currentPage = page;
        $.ajax({
            url: 'http://gpxplus.net/AJAX/' + request,
            data: data,
            success: function(i) {
                if (i.userData) Vars.userData = i.userData;
                if (i.userCard && $("#headerUser").length && $("#headerUser").html() != i.userCard && $("#headerUser").html(i.userCard), i.topNotifications && $("#topNotifications").length && $("#topNotifications").html() != $(i.topNotifications).html() && $("#topNotifications").replaceWith(i.topNotifications), i.headerTime && $("#headerTime").length && $("#headerTime").replaceWith(i.headerTime), "object" == typeof i.notifications) {
                    $(".notification, .notification-text").empty();
                    for (var a in i.notifications)
                        if ("bar" != a) {
                            var r = i.notifications[a];
                            $("#notification-" + a).html(r.total === !0 ? "&nbsp;" : r.total), $("#notification-" + a + "-text").html(r.text)
                        }
                }
                if (i.success === 'false') {
                    Tools.writeLog(log, !1);
                    return;
                }
                Gpxplus.responseCheck.perform(i);
                Tools.writeLog(log);
                if (i.notifications && i.notifications.mobile) Vars.mobileAvailable = !0;
                if (typeof callback == 'function') callback(i);
                if (queueobj.queue) queueobj.queue.dequeue();
            },
            timeout: 10000,
            error: function() {
                Tools.writeLog(log, !1);
                if (typeof error == 'function') error();
                if (queueobj.queue) queueobj.queue.dequeue();
            }
        });
    },
    locate: function() {
        navigator.geolocation.getCurrentPosition(function(pos) {
            Vars.location = pos.coords;
        });
    },
    writeLog: function(act, failed) {
        if (act.length > 10) {
            $('#panel-log').val((new Date()).toLocaleString() + ': ' + act + $('#panel-log').val());
            return;
        }
        var failed = (typeof failed != 'undefined') ? !0 : !1;
        if (act === 'feeder' || act === 'mobile' || act === 'defog' || act === 'chest' || act === 'pphitem') {
            if (failed) $('#' + act + '-timeout').html(parseInt($('#' + act + '-timeout').html()) + 1);
            else $('#' + act + '-succeed').html(parseInt($('#' + act + '-succeed').html()) + 1);
        }
    },
    dequeue: function(obj, method) {
        if (typeof obj == 'object' && obj.queue) {
            if (typeof method != 'undefined' && method === 'func') {
                return function() {
                    obj.queue.dequeue();
                };
            }
            obj.queue.dequeue();
            return !1;
        }
    },
    random: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};
var Vars = {};
var Gpxplus = {
    __modeProperBerry: !0,
    __modeShelter: 'egg',
    __modeShelterSpecific: !0,
    __listShelter: 'Mystery,Unown,Articuno,Zapdos,Moltres,Mewtwo,Mew,Raikou,Entei,Suicune,Lugia,Ho-Oh,Celebi,Regirock,Regice,Registeel,Latias,Latios,Kyogre,Groudon,Rayquaza,Jirachi,Deoxys,Uxie,Mesprit,Azelf,Dialga,Palkia,Heatran,Regigigas,Giratina,Cresselia,Manaphy,Darkrai,Shaymin,Arceus,Victini,Cobalion,Terrakion,Virizion,Tornadus,Thundurus,Reshiram,Zekrom,Landorus,Kyurem,Keldeo,Meloetta,Genesect,Xerneas,Yveltal,Zygarde,Diancie,',
    __listShelterPrio: 'Mystery,Unown,Articuno,Zapdos,Moltres,Mewtwo,Mew,Raikou,Entei,Suicune,Lugia,Ho-Oh,Celebi,Regirock,Regice,Registeel,Latias,Latios,Kyogre,Groudon,Rayquaza,Jirachi,Deoxys,Uxie,Mesprit,Azelf,Dialga,Palkia,Heatran,Regigigas,Giratina,Cresselia,Manaphy,Darkrai,Shaymin,Arceus,Victini,Cobalion,Terrakion,Virizion,Tornadus,Thundurus,Reshiram,Zekrom,Landorus,Kyurem,Keldeo,Meloetta,Genesect,Xerneas,Yveltal,Zygarde,Diancie,',
    __listLab: '4178-y9~hR+,3324-YvAEbT,3399-m6XQNc,3285-ChnT8I,3279-9tBm7W,4044-N9Qtuu,4211-OGHrO9,3725-ZuA3rd,3146-vLj7Tx,2959-R0FzDg,2593-App409,3398-1sSdDh',
    __numPartySpace: 1,
    __hatchItemPP: !1,
    __defogPP: !1,
    counter: {},
    init: function() {
        if ($('#gpxplus-hack').length < 1) {
            $('body').prepend('<table id="gpxplus-hack" style="width:100%;border-bottom:1px solid #999;margin-bottom:50px;verto">' +
                '<tr><td style="border-right:1px solid #999;width:40%;padding:10px" rowspan="2"><b>LOG</b><br>' +
                'Feeder: <span id="feeder-succeed">0</span> / <span id="feeder-timeout">0</span> / <span id="feeder-queue">0</span><br>' +
                'Mobile Walker: <span id="mobile-succeed">0</span> / <span id="mobile-timeout">0</span><br>' +
                'Defog passpower: <span id="defog-succeed">0</span> / <span id="defog-timeout">0</span><br>' +
                'Hatch-item passpower: <span id="pphitem-succeed">0</span> / <span id="pphitem-timeout">0</span><br>' +
                'Pages refreshed: <span id="chest-succeed">0</span> / <span id="chest-timeout">0</span><br>' +
                '<textarea id="panel-log" rows="10" style="width:100%" disabled></textarea></td>' +
                '<td style="padding:10px;border-bottom:1px solid #999;height:50px"><b>PARTY</b><br><br><div id="party-image"></div></td></tr>' +
                '<tr><td style="padding:10px"><b>PANEL</b><br>' +
                '孵蛋蛋 <input type="button" value="Start" onclick="Gpxplus.startFeature(\'party\', !0)"> <input type="button" value="Stop" onclick="Gpxplus.stopFeature(\'party\')"><br>' +
                '点蛋蛋 <input type="button" value="Start" onclick="Gpxplus.startFeature(\'feeder\', \'random\')"> <input type="button" value="Stop" onclick="Gpxplus.stopFeature(\'feeder\')"> (点击Stop后需要等队列点击完毕才会停止)<br>' +
                '刷宝箱 <input type="button" value="Start" onclick="Gpxplus.startFeature(\'chest\')"> <input type="button" value="Stop" onclick="Gpxplus.stopFeature(\'chest\')"><br>' +
                '孤儿院 <input type="button" value="Start" onclick="Gpxplus.startFeature(\'shelter\')"> <input type="button" value="Stop" onclick="Gpxplus.stopFeature(\'shelter\')"><br>' +
                '实验室 <input type="button" value="Start" onclick="Gpxplus.startFeature(\'lab\')"> <input type="button" value="Stop" onclick="Gpxplus.stopFeature(\'lab\')"><br>' +
                '电话机 <input type="button" value="Start" onclick="Gpxplus.startFeature(\'mobileWalker\')"> <input type="button" value="Stop" onclick="Gpxplus.stopFeature(\'mobileWalker\')"><br>' +
                '</table>');
        }
    },
    feeder: {
        timer: 10000,
        fname: [],
        queue: $('<div></div>'),
        start: function(opt) {
            var options = {
                'online': 'Are currently online',
                'random': 'Ordered randomly'
            };
            var feeder = this;
            var interacts = opt.substr(0, 12);
            Gpxplus.counter.feeder = setInterval(function() {
                if (feeder.queue.queue().length > 0) return;
                Tools.ajax('page', 'users', 'feeder-set', {
                    list: interacts === 'interactions' ? interacts : opt,
                    count: 1000,
                    page: 'users',
                    stat: 0,
                    achievement: 0,
                    list_type: '',
                    sort: '',
                    interacts: interacts === 'interactions' ? opt.substring(13) : '',
                    p: 1
                }, {}, function(i) {
                    $(i.html).find('.pIcons').each(function(i, v) {
                        feeder.fname.push($(v).data('fname'));
                    });
                    if (feeder.fname.length > 0) Tools.writeLog(feeder.fname.length + ' Pokemon/eggs detected.\n');
                    feeder.process();
                });
            }, feeder.timer);
 
        },
        process: function() {
            var feeder = this;
            if (feeder.fname.length > 0) {
                Tools.ajax('feeder', 'info', 'NONE', {
                    fnames: feeder.fname.splice(0, 20)
                }, {}, function(i) {
                    $.each(i.html, function(name, value) {
                        feeder.queue.queue(function() {
                            var flavorText = $('#infoInteract em u', value);
                            var data = {
                                fname: name,
                                do_interact: 'Yes',
                                page: 'info',
                                type: 'feeder'
                            };
                            if ($('#infoInteract div', value).length > 0 && !$('#infoInteract div', value).html().match(/egg/))
                                data.berry = (Gpxplus.__modeProperBerry && flavorText.length > 0) ? {
                                    sour: 1,
                                    spicy: 2,
                                    dry: 3,
                                    sweet: 4,
                                    bitter: 5
                                }[flavorText.html().match(/(.+)\sberry/)[1]] : 3;
                            Tools.ajax('page', 'info', 'feeder', data, feeder);
                            $('#feeder-queue').html(feeder.queue.queue().length - 1);
                        });
                    });
                    if (feeder.fname.length > 0) feeder.process();
                });
            }
        }
    },
    responseCheck: {
        queue: $('<div></div>'),
        perform: function(i) {
            var check = this;
            var queuelength = typeof check.queue.queue() !== 'undefined' ? check.queue.queue().length : 0;
            /* Clear the fog */
            if (i.notifications) {
                if (Gpxplus.__defogPP && i.notifications.bar.weather.total === 'foggy' && !i.notifications.bar.power) {
                    Tools.ajax('PassPower', 'shop', 'defog', {
                        power: 2,
                        tier: 3,
                    }, check);
                } else if (Gpxplus.__hatchItemPP && !i.notifications.bar.power) {
                    Tools.ajax('PassPower', 'shop', 'pphitem', {
                        power: 5,
                        tier: 3,
                    }, check);
                }
            }
            /* Obtain the chest */
            if (i.topNotifications && $('[class*=SpriteChest], .SpriteOldman, .SpriteSalesman, .SpriteTinyEgg', i.topNotifications).length > 0) {
                Tools.ajax('TopSpecial', 'main', 'chest', {
                    check: !0
                }, check, function(i) {
                    if (!i.msg) return;
                    var msg = i.msg.match(/You obtained a (.+?)\!/);
                    Tools.writeLog(msg && msg[1] ? 'Obtaned a ' + msg[1] + ' from a chest\n' : i.msg + '\n');
                });
            }
        }
    },
    mobileWalker: {
        timer: 60000,
        queue: $('<div></div>'),
        start: function() {
            var locidx = getCookie('locidx'),
                mobile = this;
            if (locidx === '') {
                locidx = '0';
                setCookie('locidx', locidx, 2222222);
            }
            var x = [
                ['-49.9', '168.75'],
                ['70.9', '-160.3125']
            ];
            Gpxplus.counter.mobileWalker = setInterval(function() {
                if (!Vars.mobileAvailable) return;
                Tools.locate();
                Tools.ajax('MobileWalker', 'main', 'mobile', {
                    /*longitude: Vars.location.longitude,
                    latitude: Vars.location.latitude, */
                    latitude: x[locidx][0],
                    longitude: x[locidx][1],
                    poketch: 'mobile'
                }, {}, function(i) {
                    Vars.mobileAvailable = !1;
                    if (i.success == true) {
                        setCookie('locidx', -~-locidx, 2222222);
                    }
                });
            }, this.timer);
        }
    },
    shelter: {
        timer: 2000,
        queue: $('<div></div>'),
        start: function() {
            var shelter = this;
            Gpxplus.counter.shelter = setInterval(function() {
                if (shelter.queue.queue().length > 0) return;
                var navto = (Gpxplus.__modeShelter === 'egg') ? 'eggs' : 'safari';
                Tools.ajax('page', 'shelter', '', {
                    tab: navto,
                    disabled: 1,
                    ajax: 'page',
                    page: 'shelter',
                    shelter: navto,
                }, shelter, function(i) {
                    if (i.html) {
                        $('.shelter img', i.html).each(function() {
                            var pokemon = $(this);
                            if (Vars.userData.pokesLimit.party - Vars.userData.pokes.party - Gpxplus.__numPartySpace <= 0 &&
                                !Gpxplus.__listShelterPrio.match(((Gpxplus.__modeShelter === 'egg') ? pokemon.data('tooltip').match(/(.+)\sEgg/)[1] : pokemon.data('name')) + ',') ||
                                Gpxplus.__modeShelterSpecific && !Gpxplus.__listShelter.match(((Gpxplus.__modeShelter === 'egg') ? pokemon.data('tooltip').match(/(.+)\sEgg/)[1] : pokemon.data('name')) + ',')) return;
                            Vars.userData.pokes.party++;
                            Tools.ajax('ShelterClaim', 'shelter', 'shelter', {
                                fname: pokemon.data('fname'),
                                hash: pokemon.data('hash')
                            }, shelter, function(i) {
                                if (i.success) Tools.writeLog('Claimed - ' + pokemon.data('tooltip') + '\n');
                            });
                        });
                    }
                });
            }, this.timer);
        }
    },
    party: {
        timer: 10000,
        queue: $('<div></div>'),
        start: function(hatch) {
            Gpxplus.counter.party = setInterval(function() {
                var fnames = [],
                    data = {},
                    boxRemain = {},
                    check = this;
                Tools.ajax('page', 'main', '', {
                    page: 'main'
                }, {}, function(res) {
                    var images = '';
                    $('#UserParty .PartyPokeImg', res.html).each(function() {
                        images += '<img src="' + $(this).attr('src') + '?' + (new Date().getTime()) + '"> ';
                    });
                    $('#party-image').html(images);
                    if (!hatch) return;
                    for (var j = 0; j < 2; j++) {
                        fnames = [], data = {};
                        var boxes = $('#UserParty .button.toggleButton.pSelect.pSelectMove', res.html).eq(0);
                        for (var i = 2;; i++) {
                            var box = boxes.data('' + i);
                            if (!box) break;
                            if (box.match(/THROW/)) boxRemain[boxes.data('keys')[i]] = parseInt(box.match(/THROW\s\[(\d+?)\]/)[1]);
                        }
                        $('#UserParty > ' + (j === 0 ? 'li.pHatch:not(.pFlameOrb)' : 'li.pMovePC'), res.html).each(function() {
                            for (i in boxRemain) {
                                var fname = $(this).data('fname');
                                if (boxRemain[i] < 1) continue;
                                if (!data[fname]) {
                                    data[fname] = i;
                                    fnames.push(fname);
                                    boxRemain[i]--;
                                }
                            }
                        });
                        if (fnames.length > 0) {
                            (function(j) {
                                Tools.ajax('PokeOptions', 'main', '', {
                                    option: (j === 0 ? 'hatch' : 'move'),
                                    fname: fnames,
                                    poketch: '',
                                    data: data
                                }, check, function(i) {
                                    var time = (new Date()).toLocaleString();
                                    if (j === 0 && i.messages) Tools.writeLog(i.messages.join('\n' + time + ': ') + '\n');
                                    else if (j === 1) Tools.writeLog('Moved leftovers ' + fnames.join(',') + ' to PC.\n');
                                });
                            })(j);
                        }
                    }
                });
            }, this.timer);
        }
    },
    lab: {
        timer: 5000,
        queue: $('<div></div>'),
        start: function() {
            var lab = this;
            Gpxplus.counter.lab = setInterval(function() {
                Tools.ajax('page', 'lab', '', {
                    page: 'lab'
                }, lab, function(i) {
                    if (!i.html || Vars.userData.pokesLimit.party - Vars.userData.pokes.party < 1) return;
                    var eggs = {},
                        hashes = {};
                    $('[data-fname].show3D', i.html).each(function() {
                        var fname = $(this).data('fname'),
                            hash = $(this).data('hash');
                        eggs[fname] = $(this).find('.col5a.highlightHovera img').attr('src');
                        hashes[fname] = hash;
                    });
                    if (eggs) {
                        $.ajax({
                            url: 'http://www.pokeuniv.com/bbs/toolbox/Gpxplus-lab-server.php',
                            data: {
                                file: eggs
                            },
                            timeout: 10000,
                            success: function(i) {
                                if (i.mystery) console.log(i.mystery);
                                for (j in i.code) {
                                    if (!Gpxplus.__listLab.match(new RegExp(i.code[j])) /*&& i.code[j] != 'Mystery'*/ ) continue;
                                    //console.log(j);
                                    //console.log(eggs[j] + ': ' + hashes[j]);
                                    Tools.ajax('ClaimEgg', 'lab', '', {
                                        hash: hashes[j],
                                        fname: j
                                    }, lab, function(k) {
                                        Tools.writeLog(k.success ? 'Found an egg - ' + j + ' from lab\n' : 'Attempted to obtain ' + j + ' from lab but failed!' + (k.error ? ' (' + k.error + ')' : '') + '\n');
                                    });
                                    break;
                                }
                                lab.queue.dequeue();
                            },
                            error: function() {
                                lab.queue.dequeue();
                            }
                        });
                    }
                });
            }, lab.timer);
        },
        stop: function() {
            clearInterval(Gpxplus.counter.lab);
        }
    },
    chest: {
        timer: 5000,
        queue: $('<div></div>'),
        pages: ['main', 'explore', 'trinkets', 'battles', 'users', 'dex', 'shop'],
        start: function() {
            var chest = this;
            Gpxplus.counter.chest = setInterval(function() {
                if (chest.queue.queue().length) return;
                chest.queue.queue(function() {
                    $.ajax({
                        url: 'http://gpxplus.net/' + chest.pages[Tools.random(0, 6)],
                        dataType: 'html',
                        success: function() {
                            Tools.writeLog('chest');
                            chest.queue.dequeue();
                        },
                        error: function() {
                            Tools.writeLog('chest', !1);
                            chest.queue.dequeue();
                        }
                    });
                });
            }, chest.timer);
        }
    },
    stopFeature: function(feature) {
        if (this.counter[feature]) {
            Tools.writeLog('~Feature - ' + feature + ' stopped!\n');
            clearInterval(this.counter[feature]);
            this.counter[feature] = null;
        }
    },
    startFeature: function(feature, opt) {
        if (!this.counter[feature] && this[feature]) {
            if (this[feature].queue) this[feature].queue.clearQueue();
            Tools.writeLog('~Feature - ' + feature + ' initiated!\n');
            this[feature].start(opt);
        }
    }
};
 
if (typeof unsafeWindow !== 'undefined') unsafeWindow.Gpxplus = Gpxplus, unsafeWindow.Vars = Vars, unsafeWindow.Tools = Tools;
 
Gpxplus.init();
/*
Gpxplus.mobileWalker.init();
Gpxplus.feeder.init(confirm('Online feeder?') ? 'today' : 'random', 1000);
//Gpxplus.feeder.init('interactions/return', 1000);
Gpxplus.party.start(!0);
Gpxplus.shelter.start();
Gpxplus.lab.start();
Gpxplus.chest.start();*/
