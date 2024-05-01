import { buildPaginationResponse } from "./buildPaginationResponse";

test('should build pagination response', () => {
    const count = 10
    const perPage = 10
    const page = 1
    const rows = []

    const response = buildPaginationResponse(count, perPage, page, rows)

    expect(response).toEqual({
        page: 1,
        perPage: 10,
        totalPages: 1,
        entries: []
    })
})
