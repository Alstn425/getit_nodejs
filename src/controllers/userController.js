// 임시 데이터 (In-Memory)
let users = [];
let nextId = 1;

// 전체 조회
export const getAllUsers = (req, res) => {
  res.status(200).json({ data: users });
};

// 단일 조회
export const getUserById = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) {
  return res.status(404).json({ error: 'User not found' });
  }
  // else
  res.json({ data: user });
};

// 생성
export const createUser = (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const newUser = { id: nextId++, name, email };
  users.push(newUser);
  res.status(201).json({ data: newUser });
};

// 전체 교체 (PUT)
export const replaceUser = (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  users[index] = { id, name, email };
  res.json({ data: users[index] });
};

// 일부 수정 (PATCH)
export const updateUser = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { name, email } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  res.json({ data: user });
};

// 삭제
export const deleteUser = (req, res) => {
  const id = Number(req.params.id);
  // id가 같은 값이 없다면 404 Not found를 줘야 하지 않을까?
  users = users.filter(u => u.id !== id);
  res.status(204).send(); // No Content
};
