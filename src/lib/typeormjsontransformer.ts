export const TypeOrmJsonTransformer = {
    from: (v) => JSON.parse(v),
    to: (v => JSON.stringify(v))
}
