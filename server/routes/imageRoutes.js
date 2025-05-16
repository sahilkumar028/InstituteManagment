const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Cache for optimized images
const imageCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Middleware to check if image exists in cache
const checkCache = (req, res, next) => {
    const imagePath = req.params.path;
    const cachedImage = imageCache.get(imagePath);
    
    if (cachedImage && (Date.now() - cachedImage.timestamp) < CACHE_DURATION) {
        res.set('Content-Type', cachedImage.contentType);
        res.set('Cache-Control', 'public, max-age=86400');
        return res.send(cachedImage.buffer);
    }
    next();
};

// Get image with optimization
router.get('/api/images/:path(*)', checkCache, async (req, res) => {
    try {
        const imagePath = path.join(__dirname, '../uploads', req.params.path);
        
        // Check if file exists
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Get image dimensions
        const metadata = await sharp(imagePath).metadata();
        
        // Determine optimal size based on request
        const width = parseInt(req.query.width) || metadata.width;
        const quality = parseInt(req.query.quality) || 80;

        // Optimize image
        const optimizedImage = await sharp(imagePath)
            .resize(width, null, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality })
            .toBuffer();

        // Cache the optimized image
        imageCache.set(req.params.path, {
            buffer: optimizedImage,
            contentType: 'image/jpeg',
            timestamp: Date.now()
        });

        // Set cache headers
        res.set('Content-Type', 'image/jpeg');
        res.set('Cache-Control', 'public, max-age=86400');
        res.send(optimizedImage);

    } catch (error) {
        console.error('Error serving image:', error);
        res.status(500).json({ error: 'Error processing image' });
    }
});

// Clear image cache (can be called periodically or manually)
router.post('/api/clear-image-cache', (req, res) => {
    imageCache.clear();
    res.json({ message: 'Image cache cleared' });
});

module.exports = router; 