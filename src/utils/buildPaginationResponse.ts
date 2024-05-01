export const buildPaginationResponse = (count: number, perPage: number, page: number, rows: any[]) => {
    const totalPages = Math.ceil(count / perPage) || 1

    return {
        page: page,
        perPage: perPage,
        totalPages,
        entries: rows
    }
}
