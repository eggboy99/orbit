export default function TimeConversion(date) {
    let localTime = new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    return localTime;
}
