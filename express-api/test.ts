import moment from "moment-timezone";


const t =moment(Date.now()).tz('America/Belem').toDate()
console.log(t)