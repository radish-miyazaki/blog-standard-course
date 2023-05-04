import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../../components/AppLayout';
import { NextLayoutComponentType } from 'next';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { getAppProps } from '../../utils/getAppProps';

const NewPost: NextLayoutComponentType = () => {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const resp = await fetch('/api/generatePost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, keywords }),
    });
    const json = await resp.json();
    if (json.postId) {
      await router.push(`/post/${json.postId}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <strong>生成したいブログのトピックを入力してください。</strong>
            <textarea
              className='resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm'
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            <strong>ターゲットを入力してください。</strong>
            <textarea
              className='resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm'
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </label>
        </div>
        <button className='btn'>生成する</button>
      </form>
    </div>
  );
};

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export default NewPost;

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (ctx) => {
    const props = await getAppProps(ctx);
    return { props };
  },
});
