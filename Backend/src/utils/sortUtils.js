export const applySorting = (data, sortBy, order = "asc") => {
    if (!sortBy) return data;

    const sorted = [...data];

    sorted.sort((a, b) => {
        let v1, v2;

        switch (sortBy) {
            case "date":
                v1 = new Date(a["Date"]);
                v2 = new Date(b["Date"]);
                break;
            case "quantity":
                v1 = Number(a["Quantity"]);
                v2 = Number(b["Quantity"]);
                break;
            case "customerName":
                v1 = a["Customer Name"].toLowerCase();
                v2 = b["Customer Name"].toLowerCase();
                break;
            default:
                return 0;
        }

        return order === "desc" ? v2 - v1 : v1 - v2;
    });

    return sorted;
};
