// src/components/Collaboration/StudyGroupChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  orderBy, 
  serverTimestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../../firebase';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Send as SendIcon,
  Group as GroupIcon,
  Add as AddIcon,
  VideoCall as VideoCallIcon
} from '@mui/icons-material';

const StudyGroupChat = ({ courseId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [studyGroups, setStudyGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [createGroupDialog, setCreateGroupDialog] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', maxMembers: 4 });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (activeGroup) {
      loadMessages();
    }
    loadStudyGroups();
  }, [activeGroup, courseId]);

  const loadStudyGroups = () => {
    const groupsQuery = query(
      collection(db, 'studyGroups'),
      where('courseId', '==', courseId),
      where('isActive', '==', true)
    );

    return onSnapshot(groupsQuery, (snapshot) => {
      setStudyGroups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  };

  const loadMessages = () => {
    if (!activeGroup) return;

    const messagesQuery = query(
      collection(db, 'groupMessages'),
      where('groupId', '==', activeGroup.id),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(messagesQuery, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeGroup) return;

    try {
      await addDoc(collection(db, 'groupMessages'), {
        groupId: activeGroup.id,
        userId: 'currentUserId',
        userDisplayName: 'Current User', // Would be actual user name
        message: newMessage,
        timestamp: serverTimestamp(),
        type: 'text'
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCreateGroup = async () => {
    try {
      await addDoc(collection(db, 'studyGroups'), {
        courseId,
        name: newGroup.name,
        description: newGroup.description,
        maxMembers: newGroup.maxMembers,
        createdBy: 'currentUserId',
        members: ['currentUserId'],
        isActive: true,
        createdAt: serverTimestamp()
      });
      setCreateGroupDialog(false);
      setNewGroup({ name: '', description: '', maxMembers: 4 });
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const joinGroup = async (groupId) => {
    try {
      const groupRef = doc(db, 'studyGroups', groupId);
      const groupSnap = await getDoc(groupRef);
      
      if (groupSnap.exists()) {
        const group = groupSnap.data();
        if (group.members.length < group.maxMembers) {
          await updateDoc(groupRef, {
            members: [...group.members, 'currentUserId']
          });
          setActiveGroup({ id: groupId, ...group });
        }
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const ChatInterface = () => (
    <Card sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
        {/* Chat Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6">
            {activeGroup.name}
          </Typography>
          <Typography variant="body2">
            {activeGroup.members?.length || 0} üye • {activeGroup.description}
          </Typography>
        </Box>

        {/* Messages */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          <List>
            {messages.map((message) => (
              <ListItem key={message.id} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>
                    {message.userDisplayName?.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2">
                        {message.userDisplayName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {message.timestamp?.toDate().toLocaleTimeString('tr-TR')}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2">
                      {message.message}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </Box>

        {/* Message Input */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Mesajınızı yazın..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const GroupList = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Çalışma Grupları
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setCreateGroupDialog(true)}
          >
            Grup Oluştur
          </Button>
        </Box>

        {studyGroups.length === 0 ? (
          <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
            Henüz çalışma grubu bulunmuyor
          </Typography>
        ) : (
          <List>
            {studyGroups.map((group) => (
              <ListItem 
                key={group.id} 
                button 
                selected={activeGroup?.id === group.id}
                onClick={() => setActiveGroup(group)}
                sx={{ mb: 1, borderRadius: 2 }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <GroupIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={group.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        {group.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        <Chip 
                          label={`${group.members?.length || 0}/${group.maxMembers} üye`} 
                          size="small" 
                        />
                        {group.members?.includes('currentUserId') && (
                          <Chip label="Katıldınız" size="small" color="success" />
                        )}
                      </Box>
                    </Box>
                  }
                />
                {!group.members?.includes('currentUserId') && (
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      joinGroup(group.id);
                    }}
                  >
                    Katıl
                  </Button>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <GroupIcon sx={{ mr: 2 }} />
        Çalışma Grupları & İş Birliği
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <GroupList />
        </Grid>
        
        <Grid item xs={12} md={8}>
          {activeGroup ? (
            <ChatInterface />
          ) : (
            <Card sx={{ textAlign: 'center', py: 8 }}>
              <GroupIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Bir çalışma grubu seçin
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Grup sohbetine katılmak veya yeni bir grup oluşturmak için sol taraftan seçim yapın.
              </Typography>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Create Group Dialog */}
      <Dialog open={createGroupDialog} onClose={() => setCreateGroupDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Çalışma Grubu Oluştur</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Grup Adı"
            fullWidth
            variant="outlined"
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Açıklama"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={newGroup.description}
            onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Maksimum Üye Sayısı"
            type="number"
            fullWidth
            variant="outlined"
            value={newGroup.maxMembers}
            onChange={(e) => setNewGroup({ ...newGroup, maxMembers: parseInt(e.target.value) || 4 })}
            inputProps={{ min: 2, max: 10 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateGroupDialog(false)}>İptal</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateGroup}
            disabled={!newGroup.name.trim()}
          >
            Grup Oluştur
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudyGroupChat;