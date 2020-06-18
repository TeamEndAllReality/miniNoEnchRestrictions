/* global ngapp, xelib */
registerPatcher({
    info: info,
    gameModes: [xelib.gmTES5, xelib.gmSSE],
    settings: {
        label: 'Ench Restrict Remover',
        hide: true
    },
    execute: function(patch, helpers, settings, locals) {
        return {
            initialize: function(patch, helpers, settings, locals) {
                locals.enchcount = 0;
                locals.kywdcnt = 0;
                let flst = xelib.AddElement(patch, 'FLST\\FLST');
                helpers.cacheRecord(flst, "NER");
                locals.flst = xelib.LongName(flst);
                helpers.loadRecords('KYWD').forEach(kywd => {
                    let name = xelib.LongName(kywd);
                    if (!name.match(/^(Clothing|Armor(?!Material)|WeapType)/)) return;
                    locals.kywdcnt ++;
                    xelib.AddFormID(flst, xelib.GetHexFormID(kywd));
                });
            },
            process: [{
                load: {
                    signature: 'ENCH',
                    filter: function(record) {
                        return xelib.HasElement(record, "ENIT\\Worn Restrictions");
                    }
                },
                patch: function(record, helpers, settings, locals) {
                    xelib.SetValue(record, "ENIT\\Worn Restrictions", locals.flst);
                    locals.enchcount ++
                }
            }],
            finalize: function(patch, helpers, settings, locals) {
                helpers.logMessage("Patched " + locals.enchcount + " enchatments, using "+locals.kywdcnt + " keywords");
            }
        }
    }
});
