export const clearDb = async (connection) => {
  const entities = connection.entityMetadatas

  for (const entity of entities) {
    const repository = await connection.getRepository(entity.name)
    await repository.query(`DELETE FROM "${entity.tableName}";`)
  }
}
