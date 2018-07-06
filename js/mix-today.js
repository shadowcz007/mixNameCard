function getToday() {
    var _date = new Date();
    var _day = _date.getDate().toString(),
        _month = (_date.getMonth() + 1).toString();
    if (_day.length == 1) {
        _day = '0' + _day;
    };
    if (_month.length == 1) {
        _month = '0' + _month;
    };

    var _yearMonth = _date.getFullYear() + '/' + _month;
    
    var todayColor = randomColor();

    return {
        date:_day,
        yearMonth:_yearMonth,
        color:todayColor
    }
};