const BaseRepository = require('./baseRepository');

class ChildRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findByIdWithRelations(id, { populate = null, session = null } = {}) {
        let q = this.model.findById(id);
        if (populate) {
            if (Array.isArray(populate)) {
                for (const p of populate) q = q.populate(p);
            } else {
                q = q.populate(populate);
            }
        }
        if (session) q = q.session(session);
        return q.exec();
    }

    async createChild(data, options = {}) {
        return super.create(data, options);
    }

    async updateProfile(id, data, options = {}) {
        return super.updateById(id, data, options);
    }

    async listChildren(condition = {}, options = {}) {
        if (options.paginate) {
            const opts = {
                page: options.page,
                perPage: options.perPage,
                condition,
                sort: options.sort,
                populate: options.populate,
                select: options.select
            };
            return super.paginate(opts);
        }
        return super.findAll(condition, options);
    }

    async findByWaliId(waliId, options = {}) {
        const condition = Object.assign({}, options.condition || {}, { waliId });
        return super.findAll(condition, options);
    }
}

module.exports = ChildRepository;