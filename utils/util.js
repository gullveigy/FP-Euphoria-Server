// 根据当前时间和随机数生成流水号

let randomNumber = () => {
    let orderid = "";  //订单号
    for(let i = 0; i < 6; i ++) {
        orderid += Math.floor(Math.random()*10);
    }
    orderid = new Date().getTime() + orderid;  //时间戳，用来生成订单号。
    return orderid
}

module.exports = randomNumber