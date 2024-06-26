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

    useEffect(() => {
        if (songDetails.duration > 0) {
            setSongProgress((songDetails.time / songDetails.duration) * 100);
        }
    }, [songDetails]); // Dependency on songDetails to trigger recalculation
    
    return (
        <Card>
            <Grid container alignItems='center'>
                <Grid item align="center" xs={4}>
                    <CardMedia
                        component="img"
                        sx={{ width: '100%', height: '100%', borderRadius: 1 }}
                        image={songDetails.image_url}
                        alt="image placeholder"
                    />
                </Grid>
                <Grid item align="center" xs={8}>
                    <Typography component="h5" variant="h5">
                        {songDetails.title}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                        {songDetails.artist}
                    </Typography>
                    <div>
                        <IconButton>
                            { songDetails.is_playing ? <PauseIcon /> : <PlayArrowIcon /> }
                        </IconButton>
                        <IconButton>
                            <SkipNextIcon />
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
            <LinearProgress variant='determinate' value={songProgress} />
        </Card>
    )
}

// TIMESTAMP:
// 38:00