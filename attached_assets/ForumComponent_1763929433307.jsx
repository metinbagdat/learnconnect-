// src/components/Forum/ForumComponent.jsx
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc,
  orderBy 
} from 'firebase/firestore';
import { db } from '../../firebase';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
import { ThumbUp, ThumbDown, Comment, Add } from '@mui/icons-material';

const ForumComponent = ({ courseId }) => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newPostDialog, setNewPostDialog] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', type: 'question', tags: [] });
  const [newReply, setNewReply] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!courseId) return;

    const postsQuery = query(
      collection(db, 'forumPosts'),
      where('courseId', '==', courseId),
      orderBy('createdAt', 'desc')
    );
    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribePosts;
  }, [courseId]);

  useEffect(() => {
    if (!selectedPost) return;

    const repliesQuery = query(
      collection(db, 'forumReplies'),
      where('postId', '==', selectedPost.id),
      orderBy('createdAt', 'asc')
    );
    const unsubscribeReplies = onSnapshot(repliesQuery, (snapshot) => {
      setReplies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribeReplies;
  }, [selectedPost]);

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) return;

    const postData = {
      courseId,
      userId: 'currentUserId',
      ...newPost,
      upvotes: 0,
      downvotes: 0,
      answerCount: 0,
      isAnswered: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      await addDoc(collection(db, 'forumPosts'), postData);
      setNewPostDialog(false);
      setNewPost({ title: '', content: '', type: 'question', tags: [] });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleAddReply = async () => {
    if (!newReply || !selectedPost) return;

    const replyData = {
      postId: selectedPost.id,
      userId: 'currentUserId',
      content: newReply,
      isSolution: false,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      await addDoc(collection(db, 'forumReplies'), replyData);
      setNewReply('');
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const handleVote = async (postId, type) => {
    // Implement voting logic
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Course Forum</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setNewPostDialog(true)}
        >
          New Post
        </Button>
      </Box>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
        <Tab label="All Posts" />
        <Tab label="Questions" />
        <Tab label="Discussions" />
      </Tabs>

      <List>
        {posts.map(post => (
          <ListItem key={post.id} button onClick={() => setSelectedPost(post)}>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6">{post.title}</Typography>
                  <Chip label={post.type} size="small" />
                </Box>
              }
              secondary={
                <Typography noWrap>
                  {post.content}
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton size="small" onClick={() => handleVote(post.id, 'up')}>
                  <ThumbUp />
                </IconButton>
                <Typography>{post.upvotes}</Typography>
                <IconButton size="small" onClick={() => handleVote(post.id, 'down')}>
                  <ThumbDown />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                  <Comment />
                  <Typography sx={{ ml: 1 }}>{post.answerCount}</Typography>
                </Box>
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* New Post Dialog */}
      <Dialog open={newPostDialog} onClose={() => setNewPostDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewPostDialog(false)}>Cancel</Button>
          <Button onClick={handleCreatePost} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Post Detail Dialog */}
      <Dialog open={!!selectedPost} onClose={() => setSelectedPost(null)} maxWidth="md" fullWidth>
        {selectedPost && (
          <>
            <DialogTitle>{selectedPost.title}</DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedPost.content}
              </Typography>

              <Typography variant="h6" gutterBottom>
                Replies ({replies.length})
              </Typography>

              <List>
                {replies.map(reply => (
                  <ListItem key={reply.id} divider>
                    <ListItemText
                      primary={reply.content}
                      secondary={`By User • ${reply.createdAt.toDate().toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
              </List>

              <TextField
                label="Add a reply"
                fullWidth
                multiline
                rows={3}
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedPost(null)}>Close</Button>
              <Button onClick={handleAddReply} variant="contained">Reply</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ForumComponent;