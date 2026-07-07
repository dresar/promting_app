import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../../db';
import { callGroqApiWithRotation } from './groqService';
import { getOrientationSpec } from './promptHelpers';

// ─── Mood → Atmosphere Mapping ────────────────────────────────────────────────
// Semua atmosphere dirancang: HANYA PEMANDANGAN, tanpa hiasan, sinematik & fotorealistis
const MOOD_ATMOSPHERE_MAP: Record<string, { label: string; atmosphere: string; color: string }> = {
  sedih: {
    label: 'Sedih / Melankolis',
    atmosphere: 'A cinematic night cityscape viewed from a rooftop or hilltop, city lights glowing in the dark, moody blue-grey overcast sky, lone figure sitting at the edge with back to camera, foggy distant buildings, melancholic and solitary mood, photorealistic, cinematic shot, 8K',
    color: '#4A6FA5',
  },
  motivasi: {
    label: 'Motivasi / Semangat',
    atmosphere: 'A breathtaking golden sunrise over a vast mountain range, dramatic rays of light piercing through clouds, silhouette of a person standing at a cliff edge looking into the horizon, warm amber and orange sky, epic cinematic wide shot, photorealistic, 8K',
    color: '#F59E0B',
  },
  cinta: {
    label: 'Cinta / Romantis',
    atmosphere: 'A beautiful night city skyline with warm glowing lights reflected on a calm river or lake, pink and purple sky with stars, a lone figure sitting on a bench or pier looking at the lights, romantic and dreamy atmosphere, cinematic photography, 8K',
    color: '#EC4899',
  },
  religius: {
    label: 'Religius / Spiritual',
    atmosphere: 'A majestic mosque silhouette against a golden dawn sky, divine light rays streaming through clouds, reflective water in the foreground, peaceful and sacred atmosphere, cinematic wide shot, photorealistic, 8K',
    color: '#10B981',
  },
  bijak: {
    label: 'Bijak / Filosofis',
    atmosphere: 'A tranquil night mountain scene with a clear starry sky and Milky Way visible, a small lone figure sitting on a rock looking at the stars, vast landscape, deep blue and purple tones, contemplative and wise mood, astrophotography style, 8K',
    color: '#8B5CF6',
  },
  bahagia: {
    label: 'Kebahagiaan / Gembira',
    atmosphere: 'A vibrant sunset over the ocean with golden and orange sky reflecting on calm water, warm and cheerful colors, a small figure at the shoreline, joyful and uplifting mood, cinematic wide shot, photorealistic, 8K',
    color: '#EAB308',
  },
  perjuangan: {
    label: 'Perjuangan / Kerja Keras',
    atmosphere: 'A dramatic pre-dawn cityscape with deep blue and purple sky, city lights still glowing, a lone figure at a high vantage point looking down at the city, determined and resilient mood, cinematic photography, gritty and raw, 8K',
    color: '#EF4444',
  },
  alam: {
    label: 'Kedamaian / Alam',
    atmosphere: 'A serene misty forest waterfall scene at dawn, soft golden light filtering through tall trees, lush tropical greenery, morning mist rising from the water, a small lone figure sitting by the water, peaceful and tranquil, photorealistic nature photography, 8K',
    color: '#059669',
  },
  nostalgia: {
    label: 'Nostalgia / Kenangan',
    atmosphere: 'A warm golden sunset over a quiet Indonesian rural village, traditional houses, dirt road lined with palm trees, a lone figure sitting and watching the sunset, nostalgic film photography aesthetic, warm sepia and amber tones, cinematic, 8K',
    color: '#D97706',
  },
};

const detectMoodFromText = (text: string): string => {
  const lower = text.toLowerCase();
  if (lower.match(/sedih|tangis|air mata|kehilangan|pergi|rindu|sendirian|sunyi|sepi|duka|lara|pilu/)) return 'sedih';
  if (lower.match(/semangat|bangkit|juara|sukses|raih|mimpi|tujuan|kuat|berani|tekad|gapai|optimis|percaya diri/)) return 'motivasi';
  if (lower.match(/cinta|sayang|kasih|hati|rindu|kekasih|rasa|perasaan|asmara|romantis/)) return 'cinta';
  if (lower.match(/allah|tuhan|doa|syukur|iman|takwa|rezeki|berkah|sholat|bismillah|ibadah|qur'an|hadist/)) return 'religius';
  if (lower.match(/bijak|ilmu|pelajaran|hikmah|falsafah|wisdom|pengetahuan|buku|pikiran|akal|logika/)) return 'bijak';
  if (lower.match(/senang|bahagia|gembira|senyum|tertawa|tawa|kebahagiaan|indah|ceria|hebat/)) return 'bahagia';
  if (lower.match(/berjuang|kerja keras|susah|lelah|capek|usaha|perjuangan|gagal|bangkit|tidak menyerah/)) return 'perjuangan';
  if (lower.match(/alam|angin|pohon|gunung|laut|sungai|hujan|bunga|daun|langit|bumi/)) return 'alam';
  if (lower.match(/dulu|masa lalu|kenangan|ingat|waktu|zaman|masa kecil|nostalgia/)) return 'nostalgia';
  return 'bijak'; // default fallback
};

export const generateQuotePrompt = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const {
    quoteText,
    quoteAuthor,
    characterId,
    useCharacter,
    imageOrientation,
    moodOverride,
  } = req.body;

  if (!quoteText || quoteText.trim().length < 5) {
    return res.status(400).json({ message: 'Kata mutiara wajib diisi (minimal 5 karakter).' });
  }

  const orientationSpec = getOrientationSpec(imageOrientation || 'Persegi (Square 1:1)');
  const shouldAddCharacter = useCharacter === true || useCharacter === 'true';

  // Detect mood — use override or rule-based detection
  let detectedMood = moodOverride || detectMoodFromText(quoteText.trim());
  const moodData = MOOD_ATMOSPHERE_MAP[detectedMood] || MOOD_ATMOSPHERE_MAP['bijak'];

  let characterName = '';
  let characterPromptText = '';

  try {
    // 1. Fetch character if enabled
    if (shouldAddCharacter && characterId) {
      try {
        const charRows = await query('SELECT name, prompt FROM characters WHERE id = ?', [characterId]);
        if (charRows.rows && charRows.rows.length > 0) {
          characterName = charRows.rows[0].name;
          characterPromptText = charRows.rows[0].prompt || '';
        }
      } catch (charErr) {
        console.warn('Failed to fetch character from DB:', charErr);
      }
    }

    const authorLine = quoteAuthor && quoteAuthor.trim().length > 0
      ? `- Penulis / Sumber Kutipan: "${quoteAuthor.trim()}"`
      : `- Penulis: (Tidak disebutkan — jangan tampilkan nama penulis di gambar)`;

    // ─── KARAKTER INSTRUCTION ────────────────────────────────────────────────
    // Gaya referensi: karakter KECIL di pojok bawah, membelakangi kamera, melihat pemandangan
    const characterInstruction = shouldAddCharacter && characterPromptText
      ? `
CHARACTER PLACEMENT RULES (MANDATORY):
- Include character: "${characterName}" — described as: "${characterPromptText}"
- Character MUST be SMALL (maximum 15-20% of total canvas height) — like a tiny figure in the landscape
- Character MUST be positioned at the BOTTOM-LEFT or BOTTOM-RIGHT corner of the image
- Character pose: Sitting down, back FACING THE VIEWER, looking at the scenery ahead — NOT facing camera
- Character must feel like a tiny lonely figure in a vast landscape, NOT a main subject
- DO NOT let the character overlap or cover the quote text area
- The character blends naturally into the scene like a person watching a view`
      : `
CHARACTER: NONE — This image contains NO human figures, NO avatars, NO cartoon characters, NO mascots. Only the pure scenic landscape/environment.`;

    // ─── GROQ PROMPT — REFERENSI GAYA PATRICK SPONGEBOB MELIHAT KOTA ────────
    const groqPrompt = `You are a Senior AI Image Prompt Engineer specializing in cinematic photo-realistic quote wallpapers for social media.

Your goal: Generate a SINGLE pure JSON object (no markdown, no extra text) for an image prompt that follows THIS EXACT VISUAL STYLE:
- BACKGROUND: A stunning, cinematic, photo-realistic SCENIC LANDSCAPE ONLY (city skyline at night, mountains, ocean, forest, etc.). NO decorative frames, NO borders, NO vignettes, NO artistic overlays, NO abstract patterns.
- TEXT: The quote text appears as SMALL, SIMPLE, WHITE or light-colored plain text overlaid on the image — positioned at upper-left, upper-center, or center of the image. Font style: clean sans-serif or simple serif, NOT bold, NOT huge, NOT decorative. Just simple readable text.
- CHARACTER (if any): A very tiny figure (cartoon/anime/realistic) sitting at the bottom-left or bottom-right corner, BACK FACING the viewer, looking at the scenery. Like a person sitting alone watching a city at night or a sunset — small and unobtrusive.
- OVERALL FEEL: Like a viral Indonesian quote wallpaper — minimal, cinematic, emotional, no excess decorations.

STRICT VISUAL REALISM & PROFESSIONAL DESIGN RULES (CRITICAL):
1. The background MUST look like an authentic real photograph or a high-end professional graphic design backdrop.
2. ABSOLUTELY NO typical low-quality AI art styles, no generic 3D CGI look, no fake glossy renders, no cheap fantasy drawing/digital painting styles, no abstract neon vectors.
3. The prompt must describe the scenery with photorealistic camera parameters (e.g. "shot on 35mm lens, realistic depth of field, authentic textures, natural atmospheric fog, award-winning photography, high realism, shot on RED camera") to force the generator to create an organic, real-life photo instead of a generic AI drawing.
4. Ensure the scene feels highly professional, clean, and real.

INPUT DATA:
- Quote text: "${quoteText.trim()}"
${authorLine}
- Mood: "${moodData.label}"
- Scenic atmosphere base: "${moodData.atmosphere}"
- Image dimensions: ${orientationSpec.spec} (Canvas: ${orientationSpec.widthHint}px)
${characterInstruction}

TEXT OVERLAY RULES (MANDATORY — Match reference style):
1. Quote text must be SMALL and readable — NOT giant typography
2. Text color: White or very light colored — high contrast against the background
3. Font style: Simple, clean — NO decorative effects, NO emboss, NO glow halos, NO shadow effects
4. Text position: Upper-left area or center-left of the canvas
5. If author name exists: Show it below the quote in even smaller, italic text
6. NO decorative lines, NO frames around text, NO quote marks as design elements, NO ornaments

OUTPUT JSON FORMAT:
{
  "detected_mood": "${moodData.label}",
  "mood_color_accent": "${moodData.color}",
  "image_prompt_english": "[Full English image generation prompt — Include: (1) The exact scenic background description in full detail, (2) text overlay instruction with small/minimal style, (3) character placement if applicable (tiny figure at corner, back to viewer), (4) canvas dimensions, (5) quality specs. MINIMUM 120 words. Style must match cinematic photorealistic quote wallpaper — NOT an illustrated poster.]",
  "typography_instruction": "[Typography guide: small clean sans-serif or simple serif font, white/light color, no decoration, positioned at upper-left or center, author name smaller below if exists]",
  "visual_style": "[Overall style: e.g. Cinematic photorealistic night cityscape, astrophotography, golden hour photography, etc.]",
  "color_palette": {
    "primary": "[Dominant background color]",
    "accent": "[Accent color]",
    "text_color": "white or #F5F5F5"
  },
  "negative_prompt": "watermark, logo, low quality, blurry, decorative frame, ornamental border, vignette overlay, abstract pattern, illustrated poster style, typography art, bold large text, neon text, glowing text effect, bokeh text, text decoration, bad anatomy, deformed, extra limbs",
  "tiktok_caption": "[TikTok caption in Indonesian — 3-4 sentences, emotional and relatable tone matching ${moodData.label}, invite engagement (like, comment, share, save). Use relevant emojis. Max 200 words.]",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"]
}

CRITICAL: Output ONLY the JSON object above. Exactly 5 hashtags. NO markdown code blocks. NO text before or after the JSON.`;

    const resultRaw = await callGroqApiWithRotation(groqPrompt);
    let cleanedJson = resultRaw.replace(/```json/gi, '').replace(/```/g, '').trim();
    const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);

    let parsedResult: any = null;
    if (jsonMatch) {
      try {
        parsedResult = JSON.parse(jsonMatch[0]);
        // Ensure exactly 5 hashtags
        if (Array.isArray(parsedResult.hashtags) && parsedResult.hashtags.length > 5) {
          parsedResult.hashtags = parsedResult.hashtags.slice(0, 5);
        }
      } catch (parseErr) {
        console.warn('JSON parse failed, using raw:', parseErr);
      }
    }

    // Build the final generated prompt content stored in history
    const imagePromptEnglish = parsedResult?.image_prompt_english || `${moodData.atmosphere}, minimal clean white quote text "${quoteText.trim()}" in small sans-serif font at upper-left area, ${shouldAddCharacter && characterName ? `tiny ${characterName} figure sitting at bottom-right corner with back to camera, ` : ''}${orientationSpec.ratio} aspect ratio, cinematic photorealistic, 8K quality`;
    const typographyInstruction = parsedResult?.typography_instruction || 'Small clean white sans-serif text, positioned upper-left, no decoration';
    const visualStyle = parsedResult?.visual_style || moodData.label;
    const colorPalette = parsedResult?.color_palette || {};
    const negativePrompt = parsedResult?.negative_prompt || 'watermark, blurry, low quality, decorative frame, bold large text';
    const tiktokCaption = parsedResult?.tiktok_caption || '';
    const hashtags = parsedResult?.hashtags ? parsedResult.hashtags.join(' ') : '';
    const detectedMoodLabel = parsedResult?.detected_mood || moodData.label;

    // Store as a rich JSON for the detail screen
    const generatedPromptObj = {
      type: 'kata_mutiara',
      quote: quoteText.trim(),
      author: quoteAuthor?.trim() || null,
      detected_mood: detectedMoodLabel,
      mood_color_accent: parsedResult?.mood_color_accent || moodData.color,
      image_prompt_english: imagePromptEnglish,
      typography_instruction: typographyInstruction,
      visual_style: visualStyle,
      color_palette: colorPalette,
      negative_prompt: negativePrompt,
      orientation: orientationSpec.spec,
      canvas_size: orientationSpec.widthHint,
      character: shouldAddCharacter && characterName ? { name: characterName, prompt: characterPromptText } : null,
    };

    const generatedPrompt = JSON.stringify(generatedPromptObj, null, 2);
    const historyId = uuidv4();

    await query(
      `INSERT INTO prompt_histories (id, userId, title, contentType, slideCount, designStyle, targetAudience, language, generatedPrompt, imageOrientation, tiktokCaption, hashtags, quoteText, quoteAuthor, createdAt, updatedAt)
       VALUES (?, ?, ?, 'Kata Mutiara', 1, ?, '', 'ID', ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        historyId,
        userId,
        quoteText.trim().substring(0, 100),
        detectedMoodLabel,
        generatedPrompt,
        imageOrientation || 'Persegi (Square 1:1)',
        tiktokCaption,
        hashtags,
        quoteText.trim(),
        quoteAuthor?.trim() || null,
      ]
    );

    await query(
      'INSERT INTO activity_logs (id, userId, action, metadata, createdAt) VALUES (?, ?, ?, ?, NOW())',
      [uuidv4(), userId, 'QUOTE_PROMPT_GENERATED', JSON.stringify({ historyId })]
    );

    return res.status(201).json({
      id: historyId,
      userId,
      title: quoteText.trim().substring(0, 100),
      contentType: 'Kata Mutiara',
      slideCount: 1,
      designStyle: detectedMoodLabel,
      targetAudience: '',
      language: 'ID',
      generatedPrompt,
      imageOrientation: imageOrientation || 'Persegi (Square 1:1)',
      tiktokCaption,
      hashtags,
      quoteText: quoteText.trim(),
      quoteAuthor: quoteAuthor?.trim() || null,
      detectedMood: detectedMoodLabel,
      moodColorAccent: parsedResult?.mood_color_accent || moodData.color,
      imagePromptEnglish,
      imageUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
    });
  } catch (err: any) {
    console.error('Quote generate error:', err);
    return res.status(500).json({ message: 'Server error: ' + (err.message || err.toString()) });
  }
};
