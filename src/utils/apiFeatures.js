export class ApiFeature {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery
        this.queryString = queryString
    }
    //^ pagination
    paginate() {
        const PAGE_LIMIT = 5
        let PAGE_NUMBER = this.queryString.page * 1 || 1
        this.PAGE_NUMBER = PAGE_NUMBER
        if (this.queryString.page <= 0) PAGE_NUMBER = 1
        const PAGE_SKIP = (PAGE_NUMBER - 1) * PAGE_LIMIT
        this.mongooseQuery.skip(PAGE_SKIP).limit(PAGE_LIMIT)

        return this
    }

    //* filter
    filter() {
        let filterObj = { ...this.queryString }
        let excludedQuery = ['page', 'sort', 'fields', 'keyword']
        excludedQuery.forEach((q) => {
            delete filterObj[q]
        });

        let finalFilter = {};

        for (let key in filterObj) {
            // هل المفتاح فيه صيغة "field[operator]"؟
            let match = key.match(/^(\w+)\[(gte|gt|lte|lt)\]$/);
            if (match) {
                let field = match[1];      // sold
                let operator = match[2];   // gte

                // لو مش موجود الحقل، نبدأه ككائن
                if (!finalFilter[field]) finalFilter[field] = {};

                // نحول operator لـ Mongo operator مع $
                finalFilter[field]['$' + operator] = Number(filterObj[key]); // حول القيمة لرقم
            } else {
                // لو مش بالمفتاح ده، نخليها عادية
                finalFilter[key] = filterObj[key];
            }
        }
        this.mongooseQuery.find(finalFilter)
        return this
    }

    //& sort
    sort() {
        if (this.queryString.sort) {
            const sortedBy = this.queryString.sort.split(',').join(' ')
            this.mongooseQuery.sort(sortedBy)
        }
        return this
    }
    //! search
    search() {
        if (this.queryString.keyword) {
            this.mongooseQuery.find(
                {
                    $or:
                        [ { title: { $regex: this.queryString.keyword, $options: 'i' } },
                          { name: { $regex: this.queryString.keyword, $options: 'i' } },
                          { description: { $regex: this.queryString.keyword, $options: 'i' } }
                        ]
                })
        }
        return this
    }

    //~ selected fields
    fields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.mongooseQuery.select(fields)
        }
        return this

    }


}