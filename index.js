/* global ngapp, xelib */
registerPatcher({
    info: info,
    gameModes: [xelib.gmTES5, xelib.gmSSE],
    settings: {
        label: 'Ench Restrict Remover',
        hide: true
    },
    execute: {
        initialize: function(patch, helpers, settings, locals) {
          let flst = xelib.AddElement(patch, 'FLST\\FLST');
          helpers.cacheRecord(flst, "NER");
          locals.flst = xelib.LongName(flst);
          helpers.loadRecords('KYWD').forEach(kywd => {
              let name = xelib.LongName(kywd);
              if (!name.match(/^(Clothing|Armor(?!Material)|WeapType)/)) return;
              helpers.logMessage("Allowing "+ xelib.LongName(kywd));
              xelib.AddFormID(flst, xelib.GetHexFormID(kywd));
          });
        },
        process: [{
            load: function(plugin, helpers, settings, locals) {
                return {
                    signature: 'ENCH',
                    filter: function(record) {
                      return xelib.HasElement(record, "ENIT\\Worn Restrictions");
                    }
                }
            },
            patch: function(record, helpers, settings, locals) {
                helpers.logMessage('patching '+xelib.LongName(record));
                xelib.SetValue(record, "ENIT\\Worn Restrictions", locals.flst);
            }
        }]
    }
});
