import express from "express"
import blogPostsRouter from "./apis/blogs/index.js"
import listEndpoints from "express-list-endpoints"
import { badRequestHandler, genericServerErrorHandler, notFoundHandler, unauthorizedHandler } from "./errorHandlers.js"

const server = express()

const port = 3002
server.use(cors())
server.use(express.json())

server.use("/blogPosts",blogPostsRouter )

server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericServerErrorHandler)

server.listen(port, ()=> {
console.table(listEndpoints(server))
console.log("Server is running on port:", port)
})