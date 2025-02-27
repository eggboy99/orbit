export default function DateConversion(date) {
    let formattedDate = date.slice(0, 10)
    const year = formattedDate.slice(0, 4);
    let month = formattedDate.slice(5, 7);
    const day = formattedDate.slice(8);

    switch (month) {
        case '01':
            month = 'Janunary';
            break;
        case '02':
            month = 'February';
            break;
        case '03':
            month = 'March';
            break;
        case '04':
            month = 'April';
            break;
        case '05':
            month = 'May';
            break;
        case '06':
            month = 'June';
            break;
        case '07':
            month = 'July';
            break;
        case '08':
            month = 'August';
            break;
        case '09':
            month = 'September';
            break;
        case '10':
            month = 'October';
            break;
        case '11':
            month = 'November';
            break;
        case '12':
            month = 'December';
            break;
        default:
            console.log('Invalid month.')
    }
    return `${day} ${month} ${year}`;
}