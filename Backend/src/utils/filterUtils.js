export const applyFilters = (data, filters) => {
    let result = data;

    // Region
    if (filters.region?.length) {
        result = result.filter(item => filters.region.includes(item["Customer Region"]));
    }

    // Gender
    if (filters.gender?.length) {
        result = result.filter(item => filters.gender.includes(item["Gender"]));
    }

    // Age Range
    if (filters.ageMin || filters.ageMax) {
        result = result.filter(item => {
            const age = Number(item["Age"]);
            return (
                (filters.ageMin ? age >= filters.ageMin : true) &&
                (filters.ageMax ? age <= filters.ageMax : true)
            );
        });
    }

    // Product Category
    if (filters.category?.length) {
        result = result.filter(item => filters.category.includes(item["Product Category"]));
    }

    // Tags
    if (filters.tags?.length) {
        result = result.filter(item =>
            item["Tags"]
                ?.split(",")
                .map(t => t.trim())
                .some(t => filters.tags.includes(t))
        );
    }

    // Payment Method
    if (filters.payment?.length) {
        result = result.filter(item => filters.payment.includes(item["Payment Method"]));
    }

    // Date Range
    if (filters.dateFrom || filters.dateTo) {
        result = result.filter(item => {
            const d = new Date(item["Date"]);
            return (
                (filters.dateFrom ? d >= new Date(filters.dateFrom) : true) &&
                (filters.dateTo ? d <= new Date(filters.dateTo) : true)
            );
        });
    }

    return result;
};
