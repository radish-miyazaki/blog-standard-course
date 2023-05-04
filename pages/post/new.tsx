import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../../components/AppLayout';
import { NextLayoutComponentType } from 'next';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { getAppProps } from '../../utils/getAppProps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain } from '@fortawesome/free-solid-svg-icons';

const NewPost: NextLayoutComponentType = () => {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGenerating(true);
    try {
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
    } catch (e) {
      setGenerating(false);
    }
  };

  return (
    <div className='h-full overflow-hidden'>
      {!!generating && (
        <div className='text-green-500 flex h-full animate-pulse w-full flex-col justify-center items-center'>
          <FontAwesomeIcon icon={faBrain} className='text-8xl' />
          <h6>生成中…</h6>
        </div>
      )}

      {!generating && (
        <div className='w-full h-full flex flex-col overflow-auto'>
          <form
            onSubmit={handleSubmit}
            className='m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200'
          >
            <div>
              <label>
                <strong>生成したいブログのトピックを入力してください。</strong>
                <textarea
                  className='resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm'
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  maxLength={80}
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
                  maxLength={80}
                />
              </label>
              <small className='block mb-2'>キーワードはカンマ（、）で区切ってください。</small>
            </div>
            <button className='btn' disabled={!topic.trim() || !keywords.trim()}>
              生成する
            </button>
          </form>
        </div>
      )}
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
    if (!props.availableTokens) {
      return {
        redirect: {
          destination: '/token-topup',
          permanent: false,
        },
      };
    }

    return { props };
  },
});
