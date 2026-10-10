import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (!slug) {
      navigate("/");
      return;
    }
    appwriteService.getPost(slug).then((result) => {
      if (result) setPost(result);
      else navigate("/");
      setLoading(false);
    });
  }, [slug, navigate]);

  const deletePost = async () => {
    if (!post) return;
    const status = await appwriteService.deletePost(post.$id);
    if (status) {
      if (post.blogImage) await appwriteService.deleteFile(post.blogImage);
      navigate("/");
    }
  };

  if (loading) return <div className="mx-auto max-w-3xl px-5 py-24"><div className="h-10 w-2/3 animate-pulse rounded bg-[#e9e2d7]" /></div>;
  if (!post) return null;

  return (
    <main className="py-10 sm:py-16">
      <Container>
        <Link to="/all-posts" className="text-sm font-bold text-[#b77945] hover:underline">← Back to the journal</Link>
        <article className="mx-auto mt-10 max-w-4xl">
          <div className="mb-10 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#b77945]">
            <span>Essay</span><span className="text-[#e9e2d7]">/</span><span className="text-[#9a9b9d]">A quiet read</span>
          </div>
          <h1 className="editorial-serif max-w-4xl text-5xl font-bold leading-[1.05] text-[#172b3a] sm:text-7xl">{post.title}</h1>
          <div className="mt-7 flex items-center justify-between gap-4 border-b border-[#e9e2d7] pb-7">
            <p className="text-sm text-[#686b70]">Published in The Letterform</p>
            {isAuthor && (
              <div className="flex gap-2">
                <Link to={`/edit-post/${post.$id}`}><Button bgColor="bg-[#b77945]">Edit</Button></Link>
                <Button bgColor="bg-[#8e3b35]" onClick={deletePost}>Delete</Button>
              </div>
            )}
          </div>
          {post.blogImage && (
            <div className="mt-10 flex min-h-[260px] items-center justify-center overflow-hidden rounded-2xl bg-[#e9e2d7] sm:min-h-[420px]">
              <img src={appwriteService.getFileView(post.blogImage)} alt="" className="max-h-[620px] w-full object-contain" />
            </div>
          )}
          <div className="reading-copy mt-12 max-w-3xl text-lg text-[#334a59]">
            {parse(post.content || "")}
          </div>
        </article>
      </Container>
    </main>
  );
}
