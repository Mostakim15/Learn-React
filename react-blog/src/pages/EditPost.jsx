import React, {useEffect, useState} from 'react'
import {Container, PostForm} from '../components'
import appwriteService from "../appwrite/config";
import { useNavigate,  useParams } from 'react-router-dom';

function EditPost() {
    const [post, setPosts] = useState(null)
    const {slug} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPosts(post)
                }
            })
        } else {
            navigate('/')
        }
    }, [slug, navigate])
  return post ? (
    <div className='py-14 sm:py-20'>
        <Container>
            <div className="mb-10 border-b border-[#e9e2d7] pb-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b77945]">Edit story</p>
                <h1 className="editorial-serif mt-3 text-5xl font-bold text-[#172b3a]">Refine your perspective.</h1>
            </div>
            <PostForm post={post} />
        </Container>
    </div>
  ) : null
}

export default EditPost