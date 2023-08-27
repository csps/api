import { sanitize } from "./security";

export type PaginationQuery = {
  query: string;
  order?: {
    column: string;
    type: 'ASC' | 'DESC';
  },
  search?: {
    column: string;
    value: string;
  }[],
  pagination?: {
    page: number;
    limit: number;
  }
}

/**
 * Pagination query wrapper
 * @param {PaginationQuery} param
 */
export function paginationWrapper({ query, search, pagination, order }: PaginationQuery): { query: string, values: any[] } {
  let sql = `SELECT * FROM (${query}) t`;
  const values = [];

  if (search) {
    for (let i = 0; i < search.length; i++) {
      const { column, value } = search[i];
      values.push(`%${value}%`);

      if (i === 0) {
        sql += ` WHERE ${sanitize(column)} LIKE ?`;
        continue;
      }

      sql += ` ${i === 1 ? 'AND' : 'OR'} ${sanitize(column)} LIKE ?`;
    }
  }

  if (order) {
    const { column, type } = order;
    sql += ` ORDER BY ${sanitize(column)} ${sanitize(type)}`;
  }

  if (pagination) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    sql += ` LIMIT ${sanitize(offset)}, ${sanitize(limit)}`;
  }

  return {
    query: sql, values
  };
}