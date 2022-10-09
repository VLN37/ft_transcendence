import { useEffect, useState } from 'react';

interface Dashboard {
  id: number;
}

export default function HomePage() {
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    async function getDataSummary() {
      setTimeout(() => {
        setData({ id: 42 });
      }, 2000);
    }

    getDataSummary();
  }, []);

  return (
    <div className="page">
      {data ? <div>waited succesfully</div> : <div>waiting 2000 ms</div>}
    </div>
  );
}
