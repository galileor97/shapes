function createdDate(time) {
    const now = new Date();
    const createdInMinutes = Math.floor((now - time) / (1000 * 60));

    if (createdInMinutes < 60) {
        return `${createdInMinutes} minutes ago`;
    } else {
        const createdInHours = Math.floor(createdInMinutes / 60);
        return `${createdInHours} hours ago`;
    }
}

module.exports = createdDate

