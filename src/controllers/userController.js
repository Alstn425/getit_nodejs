export const getUsers = (req, res) => {
    const { active, page } = req.query;
    res.json({
        message: "User List",
        filters: { active, page }
    });
}

export const createUser = (req, res) => {
    const { name, email } = req.body;
    res.status(201).json({
        message: "User Created",
        data: {
            name: name,
            email: email
        }
    });
}