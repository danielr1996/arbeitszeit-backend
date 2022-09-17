import {expand} from "./pg";

describe('expand', ()=>{
    it('expands an query with 2 rows and 2 values', ()=>{
        const values = [[1,'John'],[2,'Jane']]
        const actual = expand(values.length, 2)
        const expected = `($1,$2),($3,$4)`
        expect(actual).toBe(expected)
    })

    it('expands an query with 1 rows and 1 values', ()=>{
        const values = [[1]]
        const actual = expand(values.length, 1)
        const expected = `($1)`
        expect(actual).toBe(expected)
    })

    it('expands an query with 1 rows and 2 values', ()=>{
        const values = [[1, 'John']]
        const actual = expand(values.length, 2)
        const expected = `($1,$2)`
        expect(actual).toBe(expected)
    })

    it('expands an query with 2 rows and 1 values', ()=>{
        const values = [[1],[2]]
        const actual = expand(values.length, 1)
        const expected = `($1),($2)`
        expect(actual).toBe(expected)
    })
})
