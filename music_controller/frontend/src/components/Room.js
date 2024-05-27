import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Typography,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Box,
    Divider,
    Chip, 
    Button,
    Grid,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import CreateRoomPage from "./CreateRoomPage";

export default function Room() {
    const navigate = useNavigate();
    const [date, setDate] = useState(new Date());

    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false); 

    const { roomCode } = useParams();

    const handleGetRoom = async () => {
        try {
            const response = await axios.get("/api/get-room" + "?code=" + roomCode);
            
            setVotesToSkip(response.data.votes_to_skip)
            setGuestCanPause(response.data.guest_can_pause)
            setIsHost(response.data.is_host)
        } catch (error) {
            console.log("Error fetching room:", error);
        }
    }

    const imageRandomizer = () => {
        var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return `https://picsum.photos/seed/${retVal}/200/300`;
    }

    const handleLeaveButtonPressed = async () => {
        try {
            const response = await axios.post("/api/leave-room", {
                room_code: roomCode
            });

            if (response.status == 200) {
                navigate("/");
            }
        } catch (error) {
            console.log("Error leaving the room:", error);
        }
    }

    const updateShowSettings = (value) => {
        setShowSettings(value)
    }

    const renderSettings = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage 
                        update={true} 
                        votesToSkip={votesToSkip} 
                        guestCanPause={guestCanPause} 
                        roomCode={roomCode}
                        updateCallback={handleGetRoom}
                        closeButton={
                            <Button 
                                variant="contained" 
                                color="secondary" 
                                className='w-100' 
                                onClick={() => updateShowSettings(false)}
                            >
                                Close
                            </Button>
                        }
                    />
                </Grid>
            </Grid>
        )
    }

    useEffect(() => {
        handleGetRoom();
    }, [roomCode]);

    if (showSettings) {
        return renderSettings();
    } else {
        return (
            <Card className='p-4 flex flex-col gap-4 rounded-lg shadow-lg transition-shadow hover:shadow-2xl' onClick={imageRandomizer}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                    <CardContent sx={{ padding: '0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <CardHeader
                            action={
                                <IconButton 
                                    aria-label="settings" 
                                    disabled={!isHost}
                                    onClick={() => updateShowSettings(true)}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            title={roomCode}
                            subheader={date.toDateString()}
                            sx={{ padding: '0' }}
                        />
                        <Divider />
                        <CardContent 
                            sx={{ padding: '0' }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Votes: <Chip color="primary" label={votesToSkip} size="small" />
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Guest Can Pause: <Chip color="primary" label={guestCanPause.toString()} size="small" />
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Host: <Chip color="primary" label={guestCanPause.toString()} size="small" />
                            </Typography>
                        </CardContent>
                    </CardContent>
                    <CardMedia
                        component="img"
                        sx={{ width: 200, height: 200, borderRadius: 1 }}
                        image={imageRandomizer()}
                        alt="Image placeholder"
                    />
                </Box>
                <Box>
                    <Button 
                        startIcon={<ArrowBackRoundedIcon />} 
                        variant="contained" 
                        color="secondary" 
                        className='w-100' 
                        onClick={handleLeaveButtonPressed}
                    >
                        LEAVE ROOM
                    </Button>
                </Box>
            </Card>
        )
    }
}