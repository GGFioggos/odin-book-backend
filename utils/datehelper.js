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
        return Math.ceil(diffInMilliseconds / (1000 * 60)) + ' Minutes ago';
    }

    if (diffInHours < 24) {
        if (diffInHours == 1) {
            return diffInHours + ' Hour ago';
        }
        return diffInHours + ' Hours ago';
    } else if (diffInHours < 168) {
        return Math.floor(diffInHours / 24) + ' Days ago';
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
