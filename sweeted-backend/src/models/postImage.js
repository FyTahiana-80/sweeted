const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

class PostImage {
    static async create(postId, imageUrl, position = 0) {
        const [rows] = await pool.query(
            'INSERT INTO Post_images (id_post, image_url, position) VALUES (?, ?, ?)',
            [postId, imageUrl, position]
        );
        return rows.insertId;
    }

    static async findByPost(postId) {
        const [rows] = await pool.query(
            'SELECT id, id_post, image_url, position FROM Post_images WHERE id_post = ? ORDER BY position, id',
            [postId]
        );
        return rows;
    }

    static async findByPostIds(postIds) {
        if (!postIds || postIds.length === 0) return {};
        const [rows] = await pool.query(
            `SELECT id, id_post, image_url, position FROM Post_images
             WHERE id_post IN (?) ORDER BY position, id`,
            [postIds]
        );
        const map = {};
        for (const row of rows) {
            if (!map[row.id_post]) map[row.id_post] = [];
            map[row.id_post].push(row);
        }
        return map;
    }

    static async deleteByPost(postId) {
        const [files] = await pool.query('SELECT image_url FROM Post_images WHERE id_post = ?', [postId]);
        for (const file of files) {
            if (file.image_url) {
                const fullPath = path.join(__dirname, '..', '..', file.image_url);
                if (fs.existsSync(fullPath)) {
                    try { fs.unlinkSync(fullPath); } catch (ignored) {}
                }
            }
        }
        const [rows] = await pool.query('DELETE FROM Post_images WHERE id_post = ?', [postId]);
        return rows;
    }
}

module.exports = PostImage;
