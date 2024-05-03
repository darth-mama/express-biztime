// //GET /users/[id] With Messages

// {
//     name: "Juanita",
//     type: "admin",
//     messages: [
//       {id: 1, msg: 'msg #1'},
//       {id: 2, msg: 'msg #2'}
//     ]
//   }

router.get("/:id", async (req, res, next) => {
  try {
    const userRes = await db.query(
      `SELECT name, type FROM users
            WHERE $1`,
      [req.params.id]
    );
    const messagesRes = await db.query(
      `SELECT id, msg FROM messages
            WHERE $1`,
      [req.params.id]
    );

    const user = userRes.rows[0];
    user.messages = messagesRes.rows;
    return res.json(user);
  } catch (e) {
    return next(e);
  }
});
