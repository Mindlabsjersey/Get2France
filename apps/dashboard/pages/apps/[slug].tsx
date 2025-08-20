import { useRouter } from 'next/router';

export default function OnePager() {
  const router = useRouter();
  const { slug } = router.query;
  return (
    <div style={{ padding: 20 }}>
      <h1>App One-pager: {slug}</h1>
      <p>Published landing page.</p>
    </div>
  );
}
