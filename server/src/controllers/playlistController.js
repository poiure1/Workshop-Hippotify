import * as playlistModel from '../models/playlistModel.js'
import { timeFormat, timeFormatHMS } from '../utils/timeFormat.js';

const userId = 26;

export const getOwnedPlaylist = async (req, res) => {
    try {
        const playlist = await playlistModel.getOwnedPlaylist(userId);
        return res.status(200).json({
            success: true,
            data: playlist,
            message: "Playlist retrieved successfully"
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error"
        });
    }
}


export const getUserPlaylists = async (req, res) => {
    try {
        const playlist = await playlistModel.getUserPlaylists(userId); // change model
        return res.status(200).json({
            success: true,
            data: playlist,
            message: "Playlist retrieved successfully"
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error"
        });
    }
}

export const getPlaylistById = async (req, res) => {
    const { playlistId } = req.params; //param in route
    if (!playlistId) {
        return res.status(400).json({
            success: false,
            data: null,
            message: "Playlist ID is required"
        });
    }
    try {
        const playlist = await playlistModel.getPlaylistInfoById(playlistId, userId);
        if (!playlist) {
            return res.status(403).json({
                success: false,
                data: null,
                message: "Access denied"
            });
        }

        const tracks = await playlistModel.getPlaylistTracks(playlistId);

        let totalDuration = 0;
        tracks.forEach((track) => {
            totalDuration += track.duration;
        })

        const response = {
            ...playlist,
            duration: timeFormatHMS(totalDuration),
            edit_access: playlist.author_id === userId,
            tracks: tracks.map((track) => ({
                ...track,
                duration: timeFormat(track.duration)
            }))
        }
        return res.status(200).json({
            success: true,
            data: response,
            message: "Playlist retrieved successfully"
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error"
        });
    }
}

export const updatePlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { title, description } = req.body;
    if (!playlistId || !title || !description) {
        return res.status(400).json({
            success: false,
            data: null,
            message: "Playlist ID, Title and Description is require"
        });
    }
    try {
        await playlistModel.updatePlaylist(playlistId, title, description);
        return res.status(200).json({
            success: true,
            data: null,
            message: "Playlist update successfully"
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error"
        });
    }
}

export const addTracktoPlaylist = async (req, res) => {
    const { playlistId, trackId } = req.params;
    if (!playlistId || !trackId) {
        return res.status(400).json({
            success: false,
            data: null,
            message: "Playlist ID and Track ID is require"
        });
    }

    try {
        await playlistModel.addTrackToPlaylist(playlistId, trackId);
        return res.status(201).json({
            success: true,
            data: null,
            message: "Playlist added successfully"
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error"
        });
    }
}

export const deleteTrackFromPlaylist = async (req, res) => {
    const { playlistId, playlistTrackId } = req.params;
    if (!playlistId || !playlistTrackId) {
        return res.status(400).json({
            success: false,
            data: null,
            message: "Playlist ID and PlaylistTrack ID is require"
        });
    }

    try {
        await playlistModel.removeTrackFromPlaylist(playlistId, playlistTrackId);
        return res.status(201).json({
            success: true,
            data: null,
            message: "Playlist remove successfully"
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error"
        });
    }
}