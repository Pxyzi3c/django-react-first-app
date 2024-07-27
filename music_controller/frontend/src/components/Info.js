import React, { useState, useEffect } from 'react';
import {
    Grid,
    Button,
    Typography,
    IconButton
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link } from 'react-router-dom';

const pages = {
    JOIN: "pages.join",
    CREATE: "pages.create",
}

export default function Info({ props }) {
    const [page, setPage] = useState(pages.JOIN);

    const joinInfo = () => {
        return "Join Page"
    }

    const createInfo = () => {
        return "Create Page"
    }

    const renderInfo = () => {
        if (page === pages.JOIN) {
            return joinInfo();
        }
        return createInfo();
    }

    const togglePress = () => {
        setPage(page === pages.JOIN ? pages.CREATE : pages.JOIN)
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant='h3' compact='h4'>
                    What is House Party?
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="body1">
                    {renderInfo()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <IconButton onClick={togglePress}>
                    {page === pages.JOIN ? (
                        <NavigateNextIcon />
                    ) : (
                        <NavigateBeforeIcon />
                    )}
                </IconButton>
            </Grid>
            <Grid item xs={12} align="center">
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/"
                    startIcon={<NavigateBeforeIcon />}
                >
                    Back
                </Button>
            </Grid>
        </Grid>
    )
}