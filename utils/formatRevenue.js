export const formatRevenue = (data, month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate();

    const map = new Map();
    data.forEach((item) => {
        map.set(item._id, item.revenue);
    });

    const fullData = [];

    for (let i = 1; i <= daysInMonth; i++) {
        fullData.push({
            day: i,
            revenue: map.get(i) || 0,
        });
    }

    return fullData;
};