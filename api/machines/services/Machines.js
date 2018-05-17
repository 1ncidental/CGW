'use strict';

/**
 * Machines.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

module.exports = {

  /**
   * Promise to fetch all machines.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    const convertedParams = strapi.utils.models.convertParams('machines', params);

    return Machines
      .find()
      .where(convertedParams.where)
      .sort(convertedParams.sort)
      .skip(convertedParams.start)
      .limit(convertedParams.limit)
      .populate(_.keys(_.groupBy(_.reject(strapi.models.machines.associations, {autoPopulate: false}), 'alias')).join(' '));
  },

  /**
   * Promise to fetch a/an machines.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    return Machines
      .findOne(_.pick(params, _.keys(Machines.schema.paths)))
      .populate(_.keys(_.groupBy(_.reject(strapi.models.machines.associations, {autoPopulate: false}), 'alias')).join(' '));
  },

  /**
   * Promise to add a/an machines.
   *
   * @return {Promise}
   */

  add: async (values) => {
    const query = await Machines.create(_.omit(values, _.keys(_.groupBy(strapi.models.machines.associations, 'alias'))));
    const data = query.toJSON ? query.toJSON() : query;

    await strapi.hook.mongoose.manageRelations('machines', _.merge(data, { values }));

    return query;
  },

  /**
   * Promise to edit a/an machines.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Note: The current method will return the full response of Mongo.
    // To get the updated object, you have to execute the `findOne()` method
    // or use the `findOneOrUpdate()` method with `{ new:true }` option.
    await strapi.hook.mongoose.manageRelations('machines', _.merge(_.clone(params), { values }));
    return Machines.update(params, values, { multi: true });
  },

  /**
   * Promise to remove a/an machines.
   *
   * @return {Promise}
   */

  remove: async params => {
    // Note: To get the full response of Mongo, use the `remove()` method
    // or add spent the parameter `{ passRawResult: true }` as second argument.
    const data = await Machines.findOneAndRemove(params, {})
      .populate(_.keys(_.groupBy(_.reject(strapi.models.machines.associations, {autoPopulate: false}), 'alias')).join(' '));

    _.forEach(Machines.associations, async association => {
      const search = (_.endsWith(association.nature, 'One')) ? { [association.via]: data._id } : { [association.via]: { $in: [data._id] } };
      const update = (_.endsWith(association.nature, 'One')) ? { [association.via]: null } : { $pull: { [association.via]: data._id } };

      await strapi.models[association.model || association.collection].update(
        search,
        update,
        { multi: true });
    });

    return data;
  }
};
