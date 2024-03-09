import Database from "../db";
import type { PaginationOutput } from "../types/request";

export type PaginationQuery = {
  query: string;
  request: PaginationOutput
}

type PaginationResult = {
  query: string;
  values: any[];
  countQuery: string;
  countValues: any[];
  search?: string;
  filter?: string;
  filterLogic?: string;
  filter2?: string;
  filter2Value?: string;
}

type Search = {
  key: string[],
  value: string[]
}

/**
 * Pagination query wrapper
 * @author mavyfaby (Maverick Fabroa)
 * @param {Database} db MariaDB database
 * @param {PaginationOutput} request Pagination output from client
 */
export function paginationWrapper(db: Database, { query, request }: PaginationQuery): PaginationResult {
  query = `SELECT * FROM (${query}) t`;
  const values = [];

  if (request.search) {
    const search: Search = typeof request.search === "string" ?
      JSON.parse(atob(request.search)) : request.search;

    let condition = " WHERE ";
    let isRequiredColumn = true;
    let isFirstColumn = true;
    let isFirstCondition = true;
    let requiredCount = 0;

    for (let i = 0; i < search.key.length; i++) {
      const key = search.key[i];
      const value = search.value[i];

      values.push(`%${value}%`);
      isRequiredColumn = key.startsWith('*');

      if (isRequiredColumn) {
        if (requiredCount > 0 || (requiredCount === 0 && !isFirstColumn)) {
          condition += ' AND ';
        }
        
        condition += ` ${db.escapeId(key.slice(1))} LIKE ? `;
        requiredCount++;
        continue;
      }
      
      if (!key.startsWith("*") && !isRequiredColumn && isFirstColumn) {
        if (requiredCount > 0) {
          condition += ' AND ';
        }

        condition += ` ${db.escapeId(key)} LIKE ?`;
        isFirstColumn = false;

        if (i < search.key.length - 1) {
          condition += ` OR (`;
        }

        continue;
      }

      condition += `${isFirstCondition ? '' : ' OR '} ${db.escapeId(key)} LIKE ?`;
      isFirstCondition = false;
    }

    if (condition.includes('OR (')) {
      condition += ` )`;
    }

    query += condition;
  }

  if (request.filter) {
    query = `SELECT * FROM (${query}) t`;
    
    if (request.filter !== "-1") {
      query += ` WHERE ${db.escapeId(request.filter)} ${request.filterLogic === "2" ? ` != 0 ` : `IS ${request.filterLogic === "1" ? "NOT " : ""}NULL`}`;
    }
  }

  if (request.filter2) {
    query = `SELECT * FROM (${query}) t`;
    query += ` WHERE ${db.escapeId(request.filter2)} = ?`;
    values.push(request.filter2Value!);
  }

  const countQuery = `SELECT COUNT(*) AS count FROM (${query}) t`;
  const countValues = [...values];
  
  if (request.sort) {
    const [ key, dir ] = typeof request.sort === "string" ? atob(request.sort).split(":") : [ request.sort.key, request.sort.value ];
    query += ` ORDER BY ${db.escapeId(key)} ${dir === 'ASC' || dir === 'asc' ? 'ASC' : 'DESC'}`;
  }

  // Default
  let page = 1;
  let limit = 10;

  if (request.page) {
    page = parseInt(request.page);
  }

  if (request.limit) {
    limit = parseInt(request.limit);
  }

  if (limit > 0) {
    query += ` LIMIT ?, ?`;

    values.push((page - 1) * limit);
    values.push(limit);
  }

  return {
    countQuery, query, values, countValues,
    search: values[0].toString().replaceAll("%", ""),
    filter: request.filter?.toString(),
    filterLogic: request.filterLogic,
    filter2: request.filter2,
    filter2Value: request.filter2Value
  };
}