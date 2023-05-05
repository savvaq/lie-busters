import { useRouter } from 'next/router';

export default function Lobby() {
  const router = useRouter();
  const { code } = router.query;

  return <div>{code}</div>;
}
