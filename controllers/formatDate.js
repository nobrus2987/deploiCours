const { DateTime } = require("luxon");
exports.dateIso = (_date,_heure) => {
    var heure = _heure.replace(':',',')
    var dateFormat = _date.replace(/-/g,',')
    var dateDeEvenement = dateFormat + ',' + heure
    var dateTab = dateDeEvenement.split(",")
    var dateTabNumber = []
    dateTab.forEach(element => {dateTabNumber.push(Number(element))})
    
    var newDate = DateTime.local(dateTabNumber[0],dateTabNumber[1],dateTabNumber[2],dateTabNumber[3],dateTabNumber[4])
    var datetoIso = newDate.toISO()
    return datetoIso
}