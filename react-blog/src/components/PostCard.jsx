import React from 'react'
import appwriteServer from "../appwrite/config"
import {Link} from "react-router-dom"

function PostCard({$id, title, blogImage}) {
  return (
    <Link to={`/post/${$id}`}> 
    <div className="w-full bg-gray-100 rounded-xl p-4">
        <div className = "w-full justify-center mb-4">
          <img src = {appwriteServer.storage.getFilePreview(blogImage)} alt={title}
          className='rounded-xl'/>

        </div>
        <h2 className='text-2xl font-semibold mb-2'>{title}</h2>
    </div>

  </Link>
  )
}

export default PostCard