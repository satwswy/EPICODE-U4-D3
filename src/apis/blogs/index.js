import express from "express"
import { fileURLToPath } from "url"
import {dirname, join} from "path"
import fs from "fs"
import uniqid from "uniqid"


const blogPostsRouter = express.Router()

const blogPostsJSONPath = join(dirname(fileURLToPath(import.meta.url)),"blogPosts.json")

const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath))
const writeBlogPosts = blogPostsArray => fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPostsArray))

blogPostsRouter.post("/", (req, res)=> {
    const newBlogPost = {...req.body, createdAt: new Date(), id: uniqid()}
    const blogPostsArray = getBlogPosts()
    blogPostsArray.push(newBlogPost)
    writeBlogPosts(blogPostsArray)
    res.status(201).send({id: newBlogPost.id})
})

blogPostsRouter.get("/", (req,res)=>{
    const blogPostsArray = getBlogPosts()
    res.send(blogPostsArray)
})

blogPostsRouter.get("/:blogPostId", (req,res)=>{
    const blogID = req.params.blogPostId
    const blogPostsArray = getBlogPosts()
    const blogPostFound = blogPostsArray.find(current => current.id === blogID)
    res.send(blogPostFound)
})

blogPostsRouter.put("/:blogPostId", (req, res)=>{
    const blogPostsArray = getBlogPosts()
    const index = blogPostsArray.findIndex(current => current.id=== req.params.blogPostId)
    const oldPost = blogPostsArray[index]
    const updatedPost = {...oldPost, ...req.body, updatedAt: new Date()}
    blogPostsArray[index]= updatedPost
    writeBlogPosts(blogPostsArray)
    res.send(updatedPost)
})

blogPostsRouter.delete("/:blogPostId", (req, res)=>{
    const blogPostsArray = getBlogPosts()
    const remainingPosts = blogPostsArray.filter(current => current.id !== req.params.blogPostId)
    writeBlogPosts(remainingPosts)
    res.status(204).send()
})

export default blogPostsRouter