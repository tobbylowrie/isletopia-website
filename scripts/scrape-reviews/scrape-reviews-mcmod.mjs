#!/usr/bin/env node
/**
 * 爬取 MC百科 (play.mcmod.cn) 服务器评分/评论
 *
 * 用法:
 *   node scrape-reviews.mjs [服务器ID]
 *   默认服务器ID: 20187897 (梦幻之屿)
 *
 * 输出:
 *   out/reviews.json  - 结构化 JSON
 *   out/reviews.csv   - CSV 表格
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SERVER_ID = process.argv[2] || '20187897';
const BASE_URL = `https://play.mcmod.cn/score/list/${SERVER_ID}`;
const OUT_DIR = join(__dirname, 'out');

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Referer': 'https://play.mcmod.cn/',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchPage(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

/** 去掉 HTML 标签并还原常见实体 */
function stripTags(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** 解析单条评论块 */
function parseReview(block, page) {
  const review = { page };

  // 作者: <span class="user"><a href="//center.mcmod.cn/439308/">IU_love</a></span>
  const userM = block.match(
    /<span class="user"><a href="([^"]+)"[^>]*>([^<]+)<\/a><\/span>/
  );
  if (userM) {
    review.author = userM[2].trim();
    review.authorUrl = userM[1].replace(/^\/\//, 'https://');
  }

  // 时间: <span class="time" data-toggle="tooltip" data-original-title="2026-09-17 19:48:04">1天前</span>
  const timeM = block.match(
    /<span class="time"[^>]*data-original-title="([^"]*)"[^>]*>([^<]*)<\/span>/
  );
  if (timeM) {
    review.date = timeM[1].trim(); // 精确日期
    review.relativeTime = timeM[2].trim(); // 如 "1天前"
  }

  // 最后编辑于 (可选): [ 最后编辑于: 2026-05-16 01:31:17 (4月前) ]
  const editM = block.match(/最后编辑于[:：]\s*([\d\- :]+)/);
  if (editM) review.editedAt = editM[1].trim();

  // 评分: 统计 star div 里的星星数量
  const starM = block.match(/<div class="star">([\s\S]*?)<\/div>/);
  if (starM) review.rating = (starM[1].match(/fa-star/g) || []).length;

  // 正文: <div class="text common-text" data-id="20210039">标题<p>内容</p>...
  const textM = block.match(
    /<div class="text common-text" data-id="(\d+)">([\s\S]*?)<\/div>/
  );
  if (textM) {
    review.scoreId = Number(textM[1]);
    review.url = `https://play.mcmod.cn/score/list/${SERVER_ID}-1.html?scoreid=${textM[1]}`;
    const inner = textM[2];

    // 标题 = 第一个 <p> 之前的文本
    const pM = inner.match(/<p>([\s\S]*?)<\/p>/);
    const titlePart = pM ? inner.slice(0, pM.index) : inner;
    review.title = stripTags(titlePart);
    review.content = pM ? stripTags(pM[1]) : '';
  }

  // 点赞 / 点踩
  const upM = block.match(/score-thumbup-btn">[\s\S]*?<span>(\d+)<\/span>/);
  const downM = block.match(/score-thumbdown-btn">[\s\S]*?<span>(\d+)<\/span>/);
  review.thumbsUp = upM ? Number(upM[1]) : 0;
  review.thumbsDown = downM ? Number(downM[1]) : 0;

  return review;
}

/** 解析整页 HTML */
function parsePage(html, page) {
  const blocks = html.split('<li class="score-block">').slice(1);
  return blocks.map((b) => parseReview(b, page)).filter((r) => r.author);
}

function toCsv(reviews) {
  const headers = [
    'scoreId', 'author', 'authorUrl', 'title', 'content',
    'date', 'relativeTime', 'editedAt', 'rating',
    'thumbsUp', 'thumbsDown', 'page', 'url',
  ];
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(',')];
  for (const r of reviews) {
    lines.push(headers.map((h) => esc(r[h])).join(','));
  }
  return lines.join('\r\n');
}

async function main() {
  console.log(`开始爬取服务器 ${SERVER_ID} 的评论...`);

  // 第 1 页
  let html = await fetchPage(`${BASE_URL}-1.html`);
  const totalM = html.match(/共有\s*(\d+)\s*个评分/);
  const total = totalM ? Number(totalM[1]) : 0;
  const pageM = html.match(/当前\s*1\s*\/\s*(\d+)\s*页/);
  const totalPages = pageM ? Number(pageM[1]) : 1;

  let reviews = parsePage(html, 1);
  console.log(`第 1/${totalPages} 页: ${reviews.length} 条 (共 ${total} 条)`);

  for (let p = 2; p <= totalPages; p++) {
    await sleep(1000 + Math.random() * 1000); // 礼貌性延迟
    try {
      html = await fetchPage(`${BASE_URL}-${p}.html`);
      const pageReviews = parsePage(html, p);
      reviews.push(...pageReviews);
      console.log(`第 ${p}/${totalPages} 页: ${pageReviews.length} 条`);
    } catch (e) {
      console.error(`第 ${p} 页抓取失败: ${e.message}，跳过`);
    }
  }

  // 按 scoreId 去重
  const seen = new Set();
  reviews = reviews.filter((r) => {
    if (r.scoreId && seen.has(r.scoreId)) return false;
    if (r.scoreId) seen.add(r.scoreId);
    return true;
  });

  // 按日期倒序
  reviews.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  mkdirSync(OUT_DIR, { recursive: true });
  const jsonPath = join(OUT_DIR, 'reviews.json');
  const csvPath = join(OUT_DIR, 'reviews.csv');
  writeFileSync(jsonPath, JSON.stringify(reviews, null, 2), 'utf8');
  writeFileSync(csvPath, '\uFEFF' + toCsv(reviews), 'utf8'); // BOM 便于 Excel 打开

  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(2)
      : 'N/A';

  console.log(`\n完成! 共 ${reviews.length} 条评论, 平均评分 ${avg}`);
  console.log(`JSON: ${jsonPath}`);
  console.log(`CSV : ${csvPath}`);
}

main().catch((e) => {
  console.error('爬取失败:', e);
  process.exit(1);
});
