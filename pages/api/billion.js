function getData(handler,request){
  return new Promise((resolve,rejet)=>{
    wx.request({
      url: 'https://www.ecloud.fit/hym/billion',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        "handler": handler,
        "data": request
      },
      success: function (res) {
        if (res.data.code == 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.data);
        }
      },
      fail: function (err) {
        reject(err);
      },
      complete: function () {
      }
    })
  })
}
function banners(){
  return getData("viewConfigHandler",{"name":"banners"})
}
function goods(data){
  return getData("goodsListHandler",data);
}
function noticeList(){
  return getData("viewConfigHandler", { "name": "notice" })
}
function goodsDetail(uniqNo){
  return getData("detailHandler",{"uniqNo":uniqNo})
}
module.exports = {
  banners: banners,
  goods:goods,
  noticeList: noticeList,
  goodsDetail: goodsDetail
}