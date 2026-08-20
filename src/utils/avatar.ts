/**
 * 头像生成工具（纯函数）
 * 从原 4 套头部组件与 profile.vue 中抽取的公共逻辑。
 */

// 生成结果缓存，避免同一种子重复生成
const avatarCache = new Map<string, string>();

/**
 * 生成随机颜色（为用户头像占位背景等场景提供品牌色系随机色）
 */
export const getRandomColor = (): string => {
  const colors = [
    '#42b983',
    '#33c6aa',
    '#00c4ff',
    '#3399ff',
    '#2979ff',
    '#5e72e4',
    '#7795f8',
    '#6772e5',
    '#7b69ee',
    '#6f42c1',
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

/**
 * 根据种子字符串（用户名 / uid）生成稳定的随机矢量图头像（Data URL）
 * 同一种子总是生成相同图案
 */
export const generateAvatarSvg = (seed: string): string => {
  const cached = avatarCache.get(seed);
  if (cached) return cached;

  // 从种子生成稳定哈希，确保同一种子总是生成相同的图案
  const hash = seed.split('').reduce((acc, char, i) => {
    return acc + char.charCodeAt(0) * (i + 1);
  }, 0);

  // 定义一些颜色方案
  const colorSchemes = [
    { bg: '#E8F4F8', fg: ['#2980b9', '#3498db', '#1abc9c', '#16a085'] },
    { bg: '#F8F4E8', fg: ['#E67E22', '#F39C12', '#D35400', '#FFA07A'] },
    { bg: '#F4E8F8', fg: ['#8E44AD', '#9B59B6', '#745399', '#B19CD9'] },
    { bg: '#E8F8F4', fg: ['#27AE60', '#2ECC71', '#1E8449', '#A0DAA9'] },
    { bg: '#F8E8E8', fg: ['#C0392B', '#E74C3C', '#922B21', '#F5B7B1'] },
    { bg: '#E8F0F8', fg: ['#3498DB', '#2874A6', '#2E86C1', '#85C1E9'] },
  ];

  // 根据哈希值选择颜色方案
  const schemeIndex = hash % colorSchemes.length;
  const colorScheme = colorSchemes[schemeIndex];

  // 生成SVG的尺寸
  const size = 200;

  // 生成一些随机形状
  const shapes: string[] = [];
  const shapesCount = 4 + (hash % 4); // 4到7个形状

  for (let i = 0; i < shapesCount; i++) {
    const shapeType = (hash + i) % 3; // 0: 圆形, 1: 矩形, 2: 多边形
    const color = colorScheme.fg[i % colorScheme.fg.length];
    const shapeSeed = hash + i * 13;

    if (shapeType === 0) {
      // 圆形
      const cx = 30 + (shapeSeed % (size - 60));
      const cy = 30 + ((shapeSeed * 5) % (size - 60));
      const r = 10 + (shapeSeed % 40);
      shapes.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.8" />`);
    } else if (shapeType === 1) {
      // 矩形
      const x = 20 + (shapeSeed % (size - 80));
      const y = 20 + ((shapeSeed * 7) % (size - 80));
      const width = 15 + (shapeSeed % 50);
      const height = 15 + ((shapeSeed * 3) % 50);
      const rx = shapeSeed % 15; // 圆角
      shapes.push(
        `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${rx}" fill="${color}" opacity="0.8" />`
      );
    } else {
      // 多边形 (三角形或其他简单形状)
      const points: string[] = [];
      const sides = 3 + (shapeSeed % 3); // 3到5条边
      const centerX = 30 + (shapeSeed % (size - 60));
      const centerY = 30 + ((shapeSeed * 11) % (size - 60));
      const radius = 10 + (shapeSeed % 30);

      for (let j = 0; j < sides; j++) {
        const angle = (j * 2 * Math.PI) / sides + (shapeSeed % Math.PI);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        points.push(`${x},${y}`);
      }

      shapes.push(`<polygon points="${points.join(' ')}" fill="${color}" opacity="0.8" />`);
    }
  }

  // 组合SVG
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <rect width="${size}" height="${size}" fill="${colorScheme.bg}" />
      ${shapes.join('\n      ')}
    </svg>
  `;

  // 返回Data URL形式的SVG
  const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
  avatarCache.set(seed, dataUrl);
  return dataUrl;
};
