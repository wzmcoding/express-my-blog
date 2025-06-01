const { findBannerDao, updateBannerdao } = require("../dao/bannerDao");
const { handleDataPattern, formatResponse } = require("../utils/tool");

module.exports.findBannerService = async function() {
    const data = handleDataPattern(await findBannerDao());
    return formatResponse(undefined, undefined, data);
};

module.exports.updateBannerService = async function (bannerArr) {
    const data = handleDataPattern(await updateBannerdao(bannerArr));
    return formatResponse(undefined, undefined, data);
}
