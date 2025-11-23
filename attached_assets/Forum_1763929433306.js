export const ForumPostSchema = {
  postId: '',
  title: '',
  content: '',
  authorId: '',
  authorName: '',
  courseId: '', // Optional: if related to specific course
  tags: [], // ['help', 'question', 'discussion']
  category: 'general', // general, technical, feedback
  upvotes: 0,
  downvotes: 0,
  views: 0,
  isPinned: false,
  isResolved: false,
  createdAt: null,
  updatedAt: null,
  lastActivity: null
};

export const ForumCommentSchema = {
  commentId: '',
  postId: '',
  authorId: '',
  authorName: '',
  content: '',
  upvotes: 0,
  isSolution: false,
  parentId: '', // For nested replies
  createdAt: null,
  mentions: [] // User mentions in comment
};

export class ForumService {
  static async createPost(postData) {
    const post = {
      ...ForumPostSchema,
      ...postData,
      postId: this.generatePostId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActivity: new Date()
    };

    await firestore.collection('forum').doc(post.postId).set(post);
    return post;
  }

  static async addComment(postId, commentData) {
    const comment = {
      ...ForumCommentSchema,
      ...commentData,
      commentId: this.generateCommentId(),
      postId,
      createdAt: new Date()
    };

    await firestore.collection('forum').doc(postId).collection('comments').doc(comment.commentId).set(comment);
    
    // Update post's last activity
    await firestore.collection('forum').doc(postId).update({
      updatedAt: new Date(),
      lastActivity: new Date()
    });

    return comment;
  }

  static generatePostId() {
    return `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static generateCommentId() {
    return `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}