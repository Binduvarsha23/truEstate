export const applySearch = (data, query) => {
    if (!query) return data;

    const q = query.toLowerCase();

    return data.filter(item =>
        item["Customer Name"].toLowerCase().includes(q) ||
        item["Phone Number"].toLowerCase().includes(q)
    );
};
