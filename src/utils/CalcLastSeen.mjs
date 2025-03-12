import DateConversion from "./DateConversion.mjs";

export default function CalcLastSeen(date) {
    const current = new Date();
    const lastSeenDate = new Date(date);

    const timeDifference = current.getTime() - lastSeenDate.getTime();

    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);

    const currentDateStr = DateConversion(current.toISOString());
    const lastSeenDateStr = DateConversion(lastSeenDate.toISOString());

    if (secondsDifference < 60) {
        return `Last seen ${secondsDifference} ${secondsDifference === 1 ? 'second' : 'seconds'} ago`;
    } else if (minutesDifference < 60) {
        return `Last seen ${minutesDifference} ${minutesDifference === 1 ? 'minute' : 'minutes'} ago`;
    } else if (hoursDifference < 24) {
        return `Last seen ${hoursDifference} ${hoursDifference === 1 ? 'hour' : 'hours'} ago`;
    } else if (daysDifference === 1) {
        return "Last seen yesterday";
    } else if (daysDifference < 7) {
        return `Last seen ${daysDifference} ${daysDifference === 1 ? 'day' : 'days'} ago`;
    } else if (currentDateStr === lastSeenDateStr) {
        return "Last seen today";
    } else {
        return `Last seen on ${lastSeenDateStr}`;
    }
}