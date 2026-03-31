export function isValidDateRange(startTime: Date, endTime: Date) {
    return endTime.getTime() > startTime.getTime();
}