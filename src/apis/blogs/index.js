import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import uniqid from "uniqid";
import createHttpError from "http-errors";

const blogPostsRouter = express.Router();

const blogPostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPosts.json"
);

const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath));
const writeBlogPosts = (blogPostsArray) =>
  fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPostsArray));

blogPostsRouter.post("/", (req, res, next) => {
  try {
    const newBlogPost = { ...req.body, createdAt: new Date(), id: uniqid() };
    const blogPostsArray = getBlogPosts();
    blogPostsArray.push(newBlogPost);
    writeBlogPosts(blogPostsArray);
    res.status(201).send({ id: newBlogPost.id });
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get("/", (req, res, next) => {
  try {
    const blogPostsArray = getBlogPosts();
    res.send(blogPostsArray);
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get("/:blogPostId", (req, res, next) => {
  try {
    const blogID = req.params.blogPostId;
    const blogPostsArray = getBlogPosts();
    const blogPostFound = blogPostsArray.find(
      (current) => current.id === blogID
    );
    res.send(blogPostFound);
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.put("/:blogPostId", (req, res, next) => {
  try {
    const blogPostsArray = getBlogPosts();
    const index = blogPostsArray.findIndex(
      (current) => current.id === req.params.blogPostId
    );
    if (index !== -1) {
      const oldPost = blogPostsArray[index];
      const updatedPost = { ...oldPost, ...req.body, updatedAt: new Date() };
      blogPostsArray[index] = updatedPost;
      writeBlogPosts(blogPostsArray);
      res.send(updatedPost);
    } else {
      next(
        createHttpError(404, `Post with id ${req.params.blogPostId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.delete("/:blogPostId", (req, res, next) => {
    try {
        const blogPostsArray = getBlogPosts();
  const remainingPosts = blogPostsArray.filter(
    (current) => current.id !== req.params.blogPostId
  );
  writeBlogPosts(remainingPosts);
  res.status(204).send();
    } catch (error) {
        next(error)
    }
   
});

export default blogPostsRouter;
