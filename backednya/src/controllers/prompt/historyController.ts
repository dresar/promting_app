import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../../db';

export const getPromptHistory = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const page = parseInt(req.query.page as string || '1', 10) || 1;
  const limit = parseInt(req.query.limit as string || '10', 10) || 10;
  const offset = (page - 1) * limit;
  const contentTypeFilter = req.query.contentType as string | undefined;

  try {
    // Build WHERE clause dynamically
    let whereClause = 'WHERE ph.userId = ?';
    const queryParams: any[] = [userId, userId];

    if (contentTypeFilter && contentTypeFilter !== 'Semua' && contentTypeFilter.trim() !== '') {
      whereClause += ' AND ph.contentType = ?';
      queryParams.splice(1, 0, contentTypeFilter); // insert before second userId
      // Adjust: params order is [userId (join), contentType, userId (where)]
      queryParams[0] = userId;
      queryParams[1] = contentTypeFilter;
      queryParams[2] = userId;
    }

    const selectSql = contentTypeFilter && contentTypeFilter !== 'Semua' && contentTypeFilter.trim() !== ''
      ? `SELECT ph.id, ph.userId, ph.title, ph.contentType, ph.slideCount,
              ph.designStyle, ph.targetAudience, ph.language, ph.generatedPrompt,
              ph.imageOrientation, ph.instagramCaption, ph.tiktokCaption, ph.hashtags,
              ph.createdAt, ph.updatedAt, ph.imageUrl, ph.sourceImageUrl,
              fp.id AS favorite_id
       FROM prompt_histories ph
       LEFT JOIN favorite_prompts fp ON fp.promptHistoryId = ph.id AND fp.userId = ?
       WHERE ph.userId = ? AND ph.contentType = ?
       ORDER BY ph.createdAt DESC, ph.id DESC
       LIMIT ${limit} OFFSET ${offset}`
      : `SELECT ph.id, ph.userId, ph.title, ph.contentType, ph.slideCount,
              ph.designStyle, ph.targetAudience, ph.language, ph.generatedPrompt,
              ph.imageOrientation, ph.instagramCaption, ph.tiktokCaption, ph.hashtags,
              ph.createdAt, ph.updatedAt, ph.imageUrl, ph.sourceImageUrl,
              fp.id AS favorite_id
       FROM prompt_histories ph
       LEFT JOIN favorite_prompts fp ON fp.promptHistoryId = ph.id AND fp.userId = ?
       WHERE ph.userId = ?
       ORDER BY ph.createdAt DESC, ph.id DESC
       LIMIT ${limit} OFFSET ${offset}`;

    const selectParams = contentTypeFilter && contentTypeFilter !== 'Semua' && contentTypeFilter.trim() !== ''
      ? [userId, userId, contentTypeFilter]
      : [userId, userId];

    const result = await query(selectSql, selectParams);

    const countSql = contentTypeFilter && contentTypeFilter !== 'Semua' && contentTypeFilter.trim() !== ''
      ? 'SELECT COUNT(*) AS count FROM prompt_histories WHERE userId = ? AND contentType = ?'
      : 'SELECT COUNT(*) AS count FROM prompt_histories WHERE userId = ?';

    const countParams = contentTypeFilter && contentTypeFilter !== 'Semua' && contentTypeFilter.trim() !== ''
      ? [userId, contentTypeFilter]
      : [userId];

    const countResult = await query(countSql, countParams);
    const total = parseInt(countResult.rows[0].count, 10) || 0;

    const histories = result.rows.map((row: any) => ({
      id: row.id,
      userId: row.userId,
      title: row.title,
      contentType: row.contentType,
      slideCount: row.slideCount || 1,
      designStyle: row.designStyle,
      targetAudience: row.targetAudience,
      language: row.language || 'ID',
      generatedPrompt: row.generatedPrompt,
      imageOrientation: row.imageOrientation || 'Persegi (Square 1:1)',
      instagramCaption: row.instagramCaption || '',
      tiktokCaption: row.tiktokCaption || '',
      hashtags: row.hashtags || '',
      imageUrl: row.imageUrl || null,
      sourceImageUrl: row.sourceImageUrl || null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      isFavorite: row.favorite_id !== null,
    }));

    return res.json({
      histories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('getPromptHistory error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};


export const getPromptHistoryById = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const result = await query(
      `SELECT ph.id, ph.userId, ph.title, ph.contentType, ph.slideCount,
              ph.designStyle, ph.targetAudience, ph.language, ph.generatedPrompt,
              ph.imageOrientation, ph.instagramCaption, ph.tiktokCaption, ph.hashtags,
              ph.createdAt, ph.updatedAt, ph.imageUrl, ph.sourceImageUrl, fp.id AS favorite_id
       FROM prompt_histories ph
       LEFT JOIN favorite_prompts fp ON fp.promptHistoryId = ph.id AND fp.userId = ?
       WHERE ph.id = ? AND ph.userId = ?`,
      [userId, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Prompt history tidak ditemukan.' });
    }

    const row = result.rows[0];
    return res.json({
      id: row.id,
      userId: row.userId,
      title: row.title,
      contentType: row.contentType,
      slideCount: row.slideCount || 1,
      designStyle: row.designStyle,
      targetAudience: row.targetAudience,
      language: row.language || 'ID',
      generatedPrompt: row.generatedPrompt,
      imageOrientation: row.imageOrientation || 'Persegi (Square 1:1)',
      instagramCaption: row.instagramCaption || '',
      tiktokCaption: row.tiktokCaption || '',
      hashtags: row.hashtags || '',
      imageUrl: row.imageUrl || null,
      sourceImageUrl: row.sourceImageUrl || null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      isFavorite: row.favorite_id !== null,
    });
  } catch (error: any) {
    console.error('getPromptHistoryById error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const deletePromptHistory = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const check = await query(
      'SELECT id FROM prompt_histories WHERE id = ? AND userId = ?',
      [id, userId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Prompt history tidak ditemukan.' });
    }

    await query('DELETE FROM favorite_prompts WHERE promptHistoryId = ?', [id]);
    await query('DELETE FROM prompt_histories WHERE id = ?', [id]);

    return res.json({ message: 'Prompt history berhasil dihapus.' });
  } catch (error: any) {
    console.error('deletePromptHistory error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const getFavoritePrompts = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const page = parseInt(req.query.page as string || '1', 10) || 1;
  const limit = parseInt(req.query.limit as string || '10', 10) || 10;
  const offset = (page - 1) * limit;

  try {
    const result = await query(
      `SELECT fp.id AS fav_id, fp.userId AS fav_userId, fp.promptHistoryId AS fav_historyId, fp.createdAt AS fav_createdAt,
              ph.id, ph.userId, ph.title, ph.contentType, ph.slideCount,
              ph.designStyle, ph.targetAudience, ph.language, ph.generatedPrompt,
              ph.imageOrientation, ph.instagramCaption, ph.tiktokCaption, ph.hashtags,
              ph.imageUrl, ph.sourceImageUrl,
              ph.createdAt AS ph_createdAt, ph.updatedAt AS ph_updatedAt
       FROM favorite_prompts fp
       JOIN prompt_histories ph ON ph.id = fp.promptHistoryId
       WHERE fp.userId = ?
       ORDER BY fp.createdAt DESC, ph.id DESC
       LIMIT ${limit} OFFSET ${offset}`,
      [userId]
    );

    const countResult = await query(
      'SELECT COUNT(*) AS count FROM favorite_prompts WHERE userId = ?',
      [userId]
    );
    const total = parseInt(countResult.rows[0].count, 10) || 0;

    const favorites = result.rows.map((row: any) => ({
      id: row.fav_id,
      userId: row.fav_userId,
      promptHistoryId: row.fav_historyId,
      createdAt: row.fav_createdAt,
      promptHistory: {
        id: row.id,
        userId: row.userId,
        title: row.title,
        contentType: row.contentType,
        slideCount: row.slideCount || 1,
        designStyle: row.designStyle,
        targetAudience: row.targetAudience,
        language: row.language || 'ID',
        generatedPrompt: row.generatedPrompt,
        imageOrientation: row.imageOrientation || 'Persegi (Square 1:1)',
        instagramCaption: row.instagramCaption || '',
        tiktokCaption: row.tiktokCaption || '',
        hashtags: row.hashtags || '',
        imageUrl: row.imageUrl || null,
        sourceImageUrl: row.sourceImageUrl || null,
        createdAt: row.ph_createdAt,
        updatedAt: row.ph_updatedAt,
        isFavorite: true,
      },
    }));

    return res.json({
      favorites,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('getFavoritePrompts error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const addFavorite = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { id: promptHistoryId } = req.params;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const checkHist = await query(
      'SELECT id FROM prompt_histories WHERE id = ? AND userId = ?',
      [promptHistoryId, userId]
    );
    if (checkHist.rows.length === 0) {
      return res.status(404).json({ message: 'Prompt history tidak ditemukan.' });
    }

    const checkFav = await query(
      'SELECT id FROM favorite_prompts WHERE promptHistoryId = ? AND userId = ?',
      [promptHistoryId, userId]
    );
    if (checkFav.rows.length > 0) {
      return res.status(409).json({ message: 'Prompt sudah ada di favorites.' });
    }

    const favoriteId = uuidv4();
    await query(
      'INSERT INTO favorite_prompts (id, userId, promptHistoryId, createdAt) VALUES (?, ?, ?, NOW())',
      [favoriteId, userId, promptHistoryId]
    );

    return res.status(201).json({
      id: favoriteId,
      userId,
      promptHistoryId,
      createdAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('addFavorite error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const removeFavorite = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { id: promptHistoryId } = req.params;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    await query(
      'DELETE FROM favorite_prompts WHERE promptHistoryId = ? AND userId = ?',
      [promptHistoryId, userId]
    );
    return res.json({ message: 'Prompt berhasil dihapus dari favorites.' });
  } catch (error: any) {
    console.error('removeFavorite error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const updatePromptHistory = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, imageUrl } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title diperlukan' });
  }

  try {
    const result = await query(
      'UPDATE prompt_histories SET title = ?, imageUrl = ?, updatedAt = NOW() WHERE id = ?',
      [title, imageUrl || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'History tidak ditemukan' });
    }

    return res.json({ message: 'History berhasil diperbarui', id });
  } catch (error: any) {
    console.error('updatePromptHistory error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const getAllHistoryAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      `SELECT h.id, h.title, h.contentType, h.slideCount, h.designStyle, h.targetAudience, h.language,
              h.createdAt, h.updatedAt, h.imageUrl, h.sourceImageUrl, h.generatedPrompt,
              h.imageOrientation, h.instagramCaption, h.tiktokCaption, h.hashtags,
              u.name as userName, u.email as userEmail
       FROM prompt_histories h
       LEFT JOIN users u ON h.userId = u.id
       ORDER BY h.createdAt DESC, h.id DESC
       LIMIT 100`
    );

    return res.json(result.rows);
  } catch (error: any) {
    console.error('getAllHistoryAdmin error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};
