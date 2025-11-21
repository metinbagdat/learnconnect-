forumPosts: {
  postId: {
    courseId: "courseId",
    userId: "user123",
    title: "Post Title",
    content: "Post content...",
    type: "question", // question, discussion, announcement
    tags: ["tag1", "tag2"],
    upvotes: 0,
    downvotes: 0,
    answerCount: 0,
    isAnswered: false,
    createdAt: timestamp,
    updatedAt: timestamp
  }
}

forumReplies: {
  replyId: {
    postId: "postId",
    userId: "user123",
    content: "Reply content...",
    isSolution: false, // marked as solution
    upvotes: 0,
    downvotes: 0,
    createdAt: timestamp,
    updatedAt: timestamp
  }
}