const express = require("express");
const router = express.Router();
const db = require("./data/db");

router.post("/", (req, res) => {
  const dbData = req.body;

  if (!dbData.title || !dbData.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  } else {
    db.insert(dbData)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(error => {
        res.status(500).json({
          error: "There was an error while saving the post to the database",
        });
      });
  }
});

// router.post("/:id/comments", (req, res) => {
//   const comment = req.body;

//   if (!comment.text) {
//     res
//       .status(400)
//       .json({ errorMessage: "Please provide text for the comment." });
//   } else {
//     db.insertComment(comment)
//       .then(res => {
//         res.status(201).json(res);
//       })
//       .catch(error => {
//         res.status(500).json({
//           error: "There was an error while saving the comment to the database",
//         });
//       });
//   }
// });

router.post("/:id/comments", (req, res) => {
  const comment = req.body;
  const postId = req.params.id;
  if (!comment.text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  } else {
    db.findById(postId)
      .then(article => {
        if (!article.length > 0) {
          res.status(404).json({
            message: "The post with the specified ID does not exist.",
          });
        } else {
          db.insertComment(comment)
            .then(cm => {
              res.status(201).json(cm);
            })
            .catch(error => {
              res
                .status(500)
                .json({
                  error:
                    "There was an error while saving the comment to the database",
                });
            });
        }
      })

      .catch(error => {
        res.status(500).json({
          error: "There was an error while saving the comment to the database",
        });
      });
  }
});

router.get("/", (req, res) => {
  db.find()
    .then(post => {
      res.send(post);
    })
    .catch(error => {
      res.status(500).json({
        error: "The posts information could not be retrieved.",
      });
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(text => {
      if (!text.length > 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).send(text);
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.get("/:id/comments", (req, res) => {
  const commentId = req.params.id;
  db.findCommentById(commentId)
    .then(comment => {
      if (!comment.length > 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.json(comment);
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(post => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.json(post);
      }
    })
    .catch(error => {
      {
        error: "The post could not be removed";
      }
    });
});

router.put("/:id", (req, res) => {
  const update = req.body;
  const updateId = req.params.id;
  if (!update.title || !update.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  } else {
    db.update(updateId, update)
      .then(res => {
        res.json(res);
      })
      .catch(error => {
        res
          .status(500)
          .json({ error: "The post information could not be modified." });
      });
  }
});

module.exports = router;
