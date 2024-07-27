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
    IconButton,
    LinearProgress,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PauseIcon from '@mui/icons-material/Pause';

export default function MusicPlayer({ songDetails }) {
    const [songProgress, setSongProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const skipSong = async () => {
        try {
            const response = await axios.post("/spotify/skip")

            console.log(response)
        } catch (error) {
            console.log("Error skipping the song: ", error)
        }
    }

    const pauseSong = async () => {
        try {
            const response = await axios.put("/spotify/pause-song")

            console.log(response)
        } catch (error) {
            console.log("Error pausing the song: ", error)
        }
    }

    const playSong = async () => {
        try {
            const response = await axios.put("/spotify/play-song")

        } catch (error) {
            console.log("Error playing the song: ", error)
        }
    }

    useEffect(() => {
        if (songDetails.duration > 0) {
            setSongProgress((songDetails.time / songDetails.duration) * 100);
        } 
        setIsPlaying(songDetails.is_playing);
    }, [songDetails]);
    
    return (
        <Card 
            sx={{ position: 'relative' }}
        >
            <CardMedia
                component="img"
                sx={{ width: 200, height: 200, borderRadius: 1 }}
                image={songDetails.image_url ?? 'https://via.placeholder.com/200x200'}
                alt="Loading Image"
            />
            <CardContent 
                sx={{ 
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column', 
                    textAlign: 'center', 
                    position: 'absolute', 
                    top: '0', 
                    left: '0', 
                    color: 'white',
                    padding: '0 !important',
                    height: '100%',
                    opacity: '0',
                    transition: 'all 200ms ease-in-out',
                    overflow: 'hidden',
                    ":hover": {
                        opacity: '1',
                    }
                }}
            >
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    background: 'rgba(0, 0, 0, 0.4)',
                    height: '75%',
                }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="h5">
                            {songDetails.title}
                        </Typography>
                        <Typography variant="subtitle1" component="div">
                            {songDetails.artist}
                        </Typography>
                    </CardContent>
                </Box>

                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    background: 'rgba(0, 0, 0, 0.75)',
                    height: '25%',
                }}>
                    <IconButton aria-label="previous" sx={{ color: 'white' }}>
                        <SkipPreviousIcon />
                    </IconButton>
                    <IconButton 
                        aria-label="play/pause" 
                        sx={{ color: 'white' }}
                        onClick={() => { 
                            songDetails?.is_playing ? pauseSong() : playSong() 
                        }}
                    >
                        {songDetails?.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                    <IconButton 
                        aria-label="next" 
                        sx={{ 
                            color: 'white' 
                        }}
                        onClick={() => skipSong()}
                    >
                        <SkipNextIcon />
                    </IconButton>
                </Box>
            </CardContent>
            <LinearProgress sx={{ 
                position: 'absolute', 
                bottom: '0', 
                left: '0', 
                width: '100%',
            }} color='primary' variant='determinate' value={songProgress} />
        </Card>    
    )
}