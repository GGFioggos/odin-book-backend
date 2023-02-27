const months = {
    1: 'Jan',
    2: 'Feb',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'Aug',
    9: 'Sept',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
};

function timeDiff(timestamp) {
    const diffInMilliseconds = Math.abs(timestamp - Date.now());
    const diffInHours = Math.ceil(diffInMilliseconds / (1000 * 60 * 60));

    if (diffInHours <= 1) {
        return Math.ceil(diffInMilliseconds / (1000 * 60)) + 'm';
    }

    if (diffInHours < 24) {
        // if (diffInHours == 1) {
        //     return diffInHours + ' h';
        // }
        return diffInHours + 'h';
    } else if (diffInHours < 168) {
        return Math.floor(diffInHours / 24) + 'd';
    } else {
        const date = new Date(timestamp);
        return (
            date.getDate() +
            ' ' +
            months[date.getMonth()] +
            ' ' +
            date.getFullYear()
        );
    }
}

module.exports = {
    months,
    timeDiff,
};
