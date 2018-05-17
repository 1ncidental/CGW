'use strict';

/**
 * Machines.js controller
 *
 * @description: A set of functions called "actions" for managing `Machines`.
 */

module.exports = {

  /**
   * Retrieve machines records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    return strapi.services.machines.fetchAll(ctx.query);
  },

  /**
   * Retrieve a machines record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.machines.fetch(ctx.params);
  },

  /**
   * Create a/an machines record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.machines.add(ctx.request.body);
  },

  /**
   * Update a/an machines record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.machines.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an machines record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.machines.remove(ctx.params);
  }
};
