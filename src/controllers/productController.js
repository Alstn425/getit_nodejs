// In-memory store for demo purposes
let products = [];
let nextProductId = 1;

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const isNonNegativeNumber = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0;

const parseId = (param) => {
    const id = Number(param);
    return Number.isInteger(id) && id > 0 ? id : null;
};

export const getProducts = (req, res) => {
    res.status(200).json({
        data: products
    });
};

export const getProductById = (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
        return res.status(400).json({ error: 'Invalid product id. It must be a positive integer.' });
    }

    const found = products.find((p) => p.id === id);
    if (!found) {
        return res.status(404).json({ error: 'Product not found.' });
    }

    res.status(200).json({ data: found });
};

export const createProduct = (req, res) => {
    const { name, price, description } = req.body ?? {};

    // Required fields check -> 400 Bad Request
    if (!('name' in (req.body ?? {})) || !('price' in (req.body ?? {}))) {
        return res.status(400).json({ error: 'Missing required fields: name and price are required.' });
    }

    // Type/value validation -> 422 Unprocessable Entity
    if (!isNonEmptyString(name)) {
        return res.status(422).json({ error: 'Field "name" must be a non-empty string.' });
    }
    if (!isNonNegativeNumber(price)) {
        return res.status(422).json({ error: 'Field "price" must be a non-negative number.' });
    }
    if (description !== undefined && !isNonEmptyString(description)) {
        return res.status(422).json({ error: 'Field "description" must be a non-empty string when provided.' });
    }

    const newProduct = {
        id: nextProductId++,
        name: name.trim(),
        price,
        description: description?.trim() ?? null
    };
    products.push(newProduct);

    res.status(201).json({ data: newProduct });
};

export const updateProductPut = (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
        return res.status(400).json({ error: 'Invalid product id. It must be a positive integer.' });
    }

    const { name, price, description } = req.body ?? {};

    // PUT requires full resource
    if (!('name' in (req.body ?? {})) || !('price' in (req.body ?? {}))) {
        return res.status(400).json({ error: 'PUT requires "name" and "price".' });
    }

    if (!isNonEmptyString(name)) {
        return res.status(422).json({ error: 'Field "name" must be a non-empty string.' });
    }
    if (!isNonNegativeNumber(price)) {
        return res.status(422).json({ error: 'Field "price" must be a non-negative number.' });
    }
    if (description !== undefined && description !== null && !isNonEmptyString(description)) {
        return res.status(422).json({ error: 'Field "description" must be a non-empty string when provided.' });
    }

    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) {
        return res.status(404).json({ error: 'Product not found.' });
    }

    const updated = {
        id,
        name: name.trim(),
        price,
        description: description === undefined ? null : (description === null ? null : description.trim())
    };
    products[idx] = updated;

    res.status(200).json({ data: updated });
};

export const updateProductPatch = (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
        return res.status(400).json({ error: 'Invalid product id. It must be a positive integer.' });
    }

    const hasAnyField = req.body && (('name' in req.body) || ('price' in req.body) || ('description' in req.body));
    if (!hasAnyField) {
        return res.status(400).json({ error: 'PATCH requires at least one of: name, price, description.' });
    }

    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) {
        return res.status(404).json({ error: 'Product not found.' });
    }

    const current = products[idx];
    let { name, price, description } = req.body;

    if (name !== undefined) {
        if (!isNonEmptyString(name)) {
            return res.status(422).json({ error: 'Field "name" must be a non-empty string when provided.' });
        }
        current.name = name.trim();
    }

    if (price !== undefined) {
        if (!isNonNegativeNumber(price)) {
            return res.status(422).json({ error: 'Field "price" must be a non-negative number when provided.' });
        }
        current.price = price;
    }

    if ('description' in (req.body ?? {})) {
        if (description !== null && description !== undefined && !isNonEmptyString(description)) {
            return res.status(422).json({ error: 'Field "description" must be a non-empty string when provided.' });
        }
        current.description = description === undefined ? current.description : (description === null ? null : description.trim());
    }

    products[idx] = current;
    res.status(200).json({ data: current });
};

export const deleteProduct = (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
        return res.status(400).json({ error: 'Invalid product id. It must be a positive integer.' });
    }

    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) {
        return res.status(404).json({ error: 'Product not found.' });
    }

    products.splice(idx, 1);
    res.status(204).send();
};

