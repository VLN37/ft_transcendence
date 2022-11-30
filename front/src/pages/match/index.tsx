import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

export default function MatchPage() {
  const { match_id } = useParams();
  useEffect(() => {
    /*
     * matchApi.connectAsPlayer(match_id)
     * */
  });

  return <div>this is the match page</div>;
}
