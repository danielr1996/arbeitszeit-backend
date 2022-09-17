/**
 * expands an array of arrays to be used as placeholders in prepared statements
 *
 * SQL supports the insertion of multiple rows with `INSERT INTO table (id, name) VALUES (1,'John'), (2,'Jane')` but
 * `node-postgres` cannot be used to support this query for arrays of unknown size due to limitations in the parsing
 * of prepared statements. Therefore this function can be used in the following way:
 *
 * ```
 * const values = [[1, 'John'], [2, 'Jane']]
 * await client.query(` INSERT INTO users (id, name) VALUES ${expand(values.length, 2)}`,values.flat())
 * ```
 * @param rowCount number of rows to insert, usually `values.length`
 * @param columnCount number of colums per row, i.e. how many properties the object has
 * @param startAt defaults to 1, set to a higher number when you want to use variables before the expansion
 */
export const expand = (rowCount, columnCount, startAt=1)=>{
    let index = startAt
    return Array(rowCount).fill(0).map(() => `(${Array(columnCount).fill(0).map(() => `$${index++}`).join(",")})`).join(",")
}
