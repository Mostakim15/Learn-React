import React from 'react'
import appwriteServer from "../appwrite/config"
import {Link} from "react-router-dom"

function PostCard() {
  return (
    <Link to={`/post/${post.$id}`}> 
    <div className="w-full bg-gray-100 rounded-xl p-4">
        <div className = "w-full justify-center mb-4">
          <img src = {appwriteServer.storage.getFilePreview(blogImage)} alt={post.title}
          className='rounded-xl'/>

        </div>
        <h2 className='text-2xl font-semibold mb-2'>{post.title}</h2>
    </div>

  </Link>
  )
}

export default PostCard