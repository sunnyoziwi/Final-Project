const moment = require('moment-timezone');

exports.getVNTime = () => {
  return moment().tz("Asia/Bangkok").format("DD_MM_YYYY_HH_mm");
};