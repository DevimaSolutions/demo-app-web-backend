export interface IPaginationOptions<Entity, EntityTransform> {
  /**
   * @default 10
   * the amount of items to be requested per page
   */
  limit?: number | string;

  /**
   * @default 1
   * the page that is requested
   */
  page?: number | string;

  /**
   * For transforming the default data to a custom type
   */
  transformer?: new (item: Entity) => EntityTransform;
}

export interface IPaginationResponse<Entity, EntityTransform> {
  /**
   * the current items this paginator
   */
  items: Entity[];
  /**
   * the current page this paginator
   */
  page: number;

  /**
   * the amount of items that were requested per page
   */
  limit: number;
  /**
   * the total amount of items
   */
  total: number;

  /**
   * For transforming the default data to a custom type
   */
  transformer?: new (item: Entity) => EntityTransform;
}
