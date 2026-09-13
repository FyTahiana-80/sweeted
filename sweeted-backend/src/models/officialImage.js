const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

class OfficielImage {
    static async create(officialId, imageUrl, position = 0) {
        const [rows] = await pool.query(
            'INSERT INTO Officiel_images (id_official, image_url, position) VALUES (?, ?, ?)',
            [officialId, imageUrl, position]
        );
        return rows.insertId;
    }

    static async findByOfficial(officialId) {
        const [rows] = await pool.query(
            'SELECT id, id_official, image_url, position FROM Officiel_images WHERE id_official = ? ORDER BY position, id',
            [officialId]
        );
        return rows;
    }

    static async findByOfficialIds(officialIds) {
        if (!officialIds || officialIds.length === 0) return {};
        const [rows] = await pool.query(
            `SELECT id, id_official, image_url, position FROM Officiel_images
             WHERE id_official IN (?) ORDER BY position, id`,
            [officialIds]
        );
        const map = {};
        for (const row of rows) {
            if (!map[row.id_official]) map[row.id_official] = [];
            map[row.id_official].push(row);
        }
        return map;
    }

    static async deleteByOfficial(officialId) {
        const [files] = await pool.query('SELECT image_url FROM Officiel_images WHERE id_official = ?', [officialId]);
        for (const file of files) {
            if (file.image_url) {
                const fullPath = path.join(__dirname, '..', '..', file.image_url);
                if (fs.existsSync(fullPath)) {
                    try { fs.unlinkSync(fullPath); } catch (ignored) {}
                }
            }
        }
        const [rows] = await pool.query('DELETE FROM Officiel_images WHERE id_official = ?', [officialId]);
        return rows;
    }
}

module.exports = OfficielImage;
