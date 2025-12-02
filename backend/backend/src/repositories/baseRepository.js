class BaseRepository {
    /**
     * @param {import('mongoose').Model} model
     */
    constructor(model) {
        this.model = model;
    }

    async create(data, options = {}) {
        const doc = new this.model(data);
        if (options.session) return doc.save({ session: options.session });
        return doc.save();
    }

    async findById(id, options = {}) {
        const q = this.model.findById(id);
        if (options.populate) q.populate(options.populate);
        if (options.select) q.select(options.select);
        if (options.session) q.session(options.session);
        return q.exec();
    }

    async findOne(condition = {}, options = {}) {
        const q = this.model.findOne(condition);
        if (options.populate) q.populate(options.populate);
        if (options.sort) q.sort(options.sort);
        if (options.select) q.select(options.select);
        if (options.session) q.session(options.session);
        return q.exec();
    }

    async findAll(condition = {}, options = {}) {
        const q = this.model.find(condition);
        if (options.populate) q.populate(options.populate);
        if (options.sort) q.sort(options.sort);
        if (options.select) q.select(options.select);
        if (options.skip) q.skip(options.skip);
        if (options.limit) q.limit(options.limit);
        if (options.session) q.session(options.session);
        return q.exec();
    }

    async updateById(id, data, options = {}) {
        const opts = { new: true, runValidators: true };
        if (options.session) opts.session = options.session;
        return this.model.findByIdAndUpdate(id, data, opts).exec();
    }

    async deleteById(id, options = {}) {
        const q = this.model.findByIdAndDelete(id);
        if (options.session) q.session(options.session);
        return q.exec();
    }

    async count(condition = {}, options = {}) {
        const q = this.model.countDocuments(condition);
        if (options.session) q.session(options.session);
        return q.exec();
    }

    async paginate({ page = 1, perPage = 10, condition = {}, sort = null, populate = null, select = null } = {}) {
        const skip = (page - 1) * perPage;
        const q = this.model.find(condition).skip(skip).limit(perPage);
        if (sort) q.sort(sort);
        if (populate) q.populate(populate);
        if (select) q.select(select);
        const [rows, total] = await Promise.all([
            q.exec(),
            this.model.countDocuments(condition).exec()
        ]);
        return { rows, total, page, perPage, totalPages: Math.ceil(total / perPage) };
    }

    async transaction(mongoose, callback) {
        const session = await mongoose.startSession();
        let result;
        try {
            await session.withTransaction(async () => {
                result = await callback(session);
            });
            return result;
        } finally {
            session.endSession();
        }
    }
}

module.exports = BaseRepository;