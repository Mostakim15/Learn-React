import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const [error, setError] = React.useState("");
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        setError("");
        try {
            if (post) {
                const file = data.image?.[0] ? await appwriteService.uploadFile(data.image[0]) : null;

                if (file) {
                    await appwriteService.deleteFile(post.blogImage);
                }

                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    blogImage: file ? file.$id : post.blogImage,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                if (!userData) {
                    throw new Error("You must be logged in to create a post.");
                }

                const file = await appwriteService.uploadFile(data.image[0]);
                if (!file) {
                    throw new Error("The featured image could not be uploaded.");
                }

                const dbPost = await appwriteService.createPost({
                    ...data,
                    blogImage: file.$id,
                    userId: userData.$id,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                } else {
                    throw new Error("The post could not be created.");
                }
            }
        } catch (error) {
            setError(error.message || "Your story could not be saved. Please try again.");
            console.error("PostForm :: submit :: error", error);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="grid gap-8 lg:grid-cols-[1fr_340px]">
            {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700 lg:col-span-2">{error}</p>}
            <div id="writing" className="scroll-mt-28">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-5"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-5"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div id="featured-image" className="scroll-mt-28 rounded-2xl border border-[#e9e2d7] bg-white p-5">
                <Input
                    label={<span className="flex items-center gap-2">Featured image <a href="/help#featured-image" title="Learn how to choose the best image" className="text-xs font-normal text-[#b77945] underline underline-offset-2">Image guide</a></span>}
                    type="file"
                    className="mb-5"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                <p className="mb-5 -mt-2 text-xs leading-5 text-[#686b70]">
                    Use a clear JPG, PNG, or GIF. Landscape images work best; your full image will stay visible without cropping.
                </p>
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={post.blogImage ? appwriteService.getFileView(post.blogImage) : undefined}
                            alt={post.title}
                            className="mb-5 aspect-video w-full rounded-xl bg-[#e9e2d7] object-contain"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-5"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}