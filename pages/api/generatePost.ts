// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'bson';

type Data = {
  postId: ObjectId;
};

export default withApiAuthRequired(async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await getSession(req, res);
  const user = session?.user!;

  const client = await clientPromise;
  const db = client.db('BlogStandard');
  const userProfile = await db.collection('users').findOne({
    auth0Id: user.sub,
  });

  if (!userProfile?.availableTokens) {
    res.status(403);
    return;
  }

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(config);

  const { topic, keywords } = req.body;
  const postContentResp = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: 'あなたはブログ投稿ジェネレータです。',
      },
      {
        role: 'user',
        content: `「${topic}」について、以下のキーワード「${keywords}」をターゲットにした、SEOを意識した長文かつ詳細なブログ記事を作成してください。
        内容は、SEOを意識したHTML形式でフォーマットし、以下のHTMLタグだけを使用してください。
        p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i。`,
      },
    ],
  });
  const postContent = postContentResp.data.choices[0].message?.content || '';

  const titleResp = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: 'あなたはブログ投稿ジェネレータです。',
      },
      {
        role: 'user',
        content: `「${topic}」について、以下のキーワード「${keywords}」をターゲットにした、SEOを意識した長文かつ詳細なブログ記事を作成してください。
        内容は、SEOを意識したHTML形式でフォーマットし、以下のHTMLタグだけを使用してください。
        p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i。`,
      },
      {
        role: 'assistant',
        content: postContent,
      },
      {
        role: 'user',
        content: '上記のブログ投稿に、適切なtitleタグを考えてください。ただし、titleタグは省略してください。',
      },
    ],
  });

  const metaDescriptionResp = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: 'あなたはブログ投稿ジェネレータです。',
      },
      {
        role: 'user',
        content: `「${topic}」について、以下のキーワード「${keywords}」をターゲットにした、SEOを意識した長文かつ詳細なブログ記事を作成してください。
        内容は、SEOを意識したHTML形式でフォーマットし、以下のHTMLタグだけを使用してください。
        p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i。`,
      },
      {
        role: 'assistant',
        content: postContent,
      },
      {
        role: 'user',
        content: '上記のブログ投稿に、適切なメタディスクリプションを付けてください。',
      },
    ],
  });

  const title = titleResp.data.choices[0].message?.content || '';
  const metaDescription = metaDescriptionResp.data.choices[0].message?.content || '';

  await db.collection('users').updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        availableTokens: -1,
      },
    },
  );

  const post = await db.collection('posts').insertOne({
    postContent,
    title,
    metaDescription,
    topic,
    keywords,
    userId: userProfile._id,
    created: new Date(),
  });

  res.status(200).json({
    postId: post.insertedId,
  });
});
