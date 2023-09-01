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

type PaginationResult = {
  query: string;
  values: any[];
  countQuery: string;
  countValues: any[];
}

/**
 * Pagination query wrapper
 * @param {PaginationQuery} param
 */
export function paginationWrapper({ query, search, pagination, order }: PaginationQuery): PaginationResult {
  query = `SELECT * FROM (${query}) t`;
  const values = [];

  if (search) {
    for (let i = 0; i < search.length; i++) {
      const { column, value } = search[i];
      values.push(`%${value}%`);

      if (i === 0) {
        query += ` WHERE ${sanitize(column)} LIKE ?`;
        continue;
      }

      query += ` ${i === 1 ? 'AND (' : 'OR'} ${sanitize(column)} LIKE ?`;
    }

    query += `)`;
  }

  const countQuery = `SELECT COUNT(*) AS count FROM (${query}) t`;
  const countValues = [...values];
  
  if (order) {
    const { column, type } = order;
    query += ` ORDER BY ${sanitize(column)} ${sanitize(type)}`;
  }

  if (pagination) {
    const { page, limit } = pagination;
    query += ` LIMIT ?, ?`;

    values.push((page - 1) * limit);
    values.push(limit);
  }

  return {
    countQuery, query, values, countValues
  };
}