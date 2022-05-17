export const getTime = (time_stamp) =>
{
    var date_obj = new Date(time_stamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = date_obj.getFullYear();
    var month = months[date_obj.getMonth()];
    var date = date_obj.getDate();
    var hour = date_obj.getHours();
    var minute = date_obj.getMinutes() < 10 ? '0' + date_obj.getMinutes() : date_obj.getMinutes();
    var second = date_obj.getSeconds() < 10 ? '0' + date_obj.getSeconds() : date_obj.getSeconds();

    var time = date + ' ' + month + ' ' + year + ' at ' + hour + ':' + minute + ':' + second ;
    return time;
}