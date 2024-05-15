import { generateUsername } from "unique-username-generator";
import { Button, Box, Stack, Paper, TextField, Typography, Chip, Avatar, Alert } from '@mui/material';
import { green } from '@mui/material/colors';
import { useState, useEffect, useRef } from 'react';
import WS from './WS';

let webSoket = new WS({onData: null});
let userName = generateUsername(" ", 0, 15).split(' ').map(n => n[0].toUpperCase()+n.slice(1)).join(' ');
let userAvatar = userName.split(' ').map(n => n[0]).join('');

function App() {
  const viewPort = useRef();
  const [textValue, setTextValue] = useState('');
  const [conversation, setConversation] = useState([]);
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    webSoket.onData = onData;
    webSoket.onConnected = () => setConnected(true);
    webSoket.onDisconnected = () => setConnected(false);
  });
  useEffect(() => {
    if (viewPort.current) {
      viewPort.current.scrollTo(0, viewPort.current.scrollHeight);
    }
  }, [viewPort, conversation]);


  function onSubmit() {
    const value = textValue.trim();
    const conv = [...conversation];
    if (value) {
      const item = {
        name: userName,
        avatar: userAvatar,
        mess: textValue,
        id: `${Date.now()}-${Math.round((Math.random() * 1000))}`
      }
      conv.push(item);
      setConversation(conv);
      setTextValue('');
      webSoket.send(item);
    }
  }

  function onData(data) {
    const conv = [...conversation];
    conv.push(data);
    setConversation(conv);
  }

  return (
    <Box  style={{ height: '100%', padding: 20, boxSizing: 'border-box' }} >
      <Paper style={{ height: '100%', margin: '0 auto', maxWidth: 600, padding: 20, boxSizing: 'border-box' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
        <Typography variant='h5' >Lite chat - TP1</Typography>
          <TextField variant='standard' label="User Name" value={userName}/>
        </Stack>
        <Box 
          ref={viewPort}
          style={{
            boxShadow: 'inset 0 0 2px #444', 
            borderRadius: 5, 
            width: '100%',
            height: 'calc(100% - 210px)',
            overflowY: 'scroll',
            padding: 10, 
            boxSizing: 'border-box',
            marginBottom: 16,
          }}
        >
          <Stack direction="column" spacing={1} alignItems="flex-start">
          {
            conversation.map( item => {
              return <Chip 
                key={item.id} 
                avatar={<Avatar 
                  sx={{ bgcolor: item.name === userName ? 'primary' : green[700] }}
                  style={{ color: '#FFFFFF' }} 
                    title={item.name}>{item.avatar}
                </Avatar>} 
                label={item.mess}
                color={item.name === userName ? 'primary' : 'success'}
                style={{
                  alignSelf: item.name === userName ? 'end' : 'start'
                }}
                sx={{
                  height: 'auto',
                  padding: 0.5,
                  maxWidth: '80%',
                  '& .MuiChip-label': {
                    display: 'block',
                    whiteSpace: 'normal',
                  }
                }}
                />;
            })
          }
          </Stack>
        </Box>
        <TextField 
          sx={{ width: '100%', marginBottom: 2 }} 
          variant='outlined' 
          value={textValue}
          onKeyDown={evt => evt.key === 'Enter' ? onSubmit() : null}
          onChange={evt => setTextValue(evt.currentTarget.value)} 
        />
        <Stack direction="row" justifyContent="space-between">
          <Alert severity={connected ? 'success' : 'error' }>{connected ? 'WS connected' : 'WS disconnected'}</Alert>
          <Button variant='outlined' onClick={onSubmit} >Envoyer</Button>
        </Stack>
      </Paper>
    </Box>
  )
}



export default App;
