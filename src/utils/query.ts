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
 * @author mavyfaby (Maverick Fabroa)
 * @param {PaginationQuery} param
 */
export function paginationWrapper({ query, search, pagination, order }: PaginationQuery): PaginationResult {
  query = `SELECT * FROM (${query}) t`;
  const values = [];

  if (search) {
    let condition = " WHERE ";
    let isRequiredColumn = true;
    let isFirstColumn = true;
    let isFirstCondition = true;
    let requiredCount = 0;

    for (let i = 0; i < search.length; i++) {
      const { column, value } = search[i];
      values.push(`%${value}%`);

      isRequiredColumn = column.startsWith('*');

      if (isRequiredColumn) {
        if (requiredCount > 0) {
          condition += ' AND ';
        }
        
        condition += `${sanitize(column.slice(1))} LIKE ? `;
        requiredCount++;
        continue;
      }
      
      if (!column.startsWith("*") && !isRequiredColumn && isFirstColumn) {
        if (requiredCount > 0) {
          condition += ' AND ';
        }

        condition += ` ${sanitize(column)} LIKE ? AND (`;
        isFirstColumn = false;
        continue;
      }

      condition += `${isFirstCondition ? '' : ' OR '} ${sanitize(column)} LIKE ?`;
      isFirstCondition = false;
    }

    if (condition.includes('AND (')) {
      condition += ` )`;
    }

    query += condition;
  }

  const countQuery = `SELECT COUNT(*) AS count FROM (${query}) t`;
  const countValues = [...values];
  
  if (order) {
    const { column, type } = order;
    query += ` ORDER BY ${sanitize(column)} ${sanitize(type)}`;
  }

  if (pagination) {
    const { page, limit } = pagination;

    if (limit > 0) {
      query += ` LIMIT ?, ?`;
  
      values.push((page - 1) * limit);
      values.push(limit);
    }
  }

  return {
    countQuery, query, values, countValues
  };
}