import { useEffect, useState } from 'react';

interface User {
  uid: string;
  email: string;
  displayName: string;
  [key: string]: any;
}

const AdminUserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (!response.ok) throw new Error('ユーザー一覧の取得に失敗しました');
        const data = await response.json();
        setUsers(data);
    } catch (err: unknown) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="text-center py-4 text-gray-600">読み込み中...</div>;
  if (error) return <div className="text-center py-4 text-red-600">エラー: {error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">ユーザー一覧</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map(user => (
          <div key={user.uid} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{user.email}</h2>
            <p className="text-sm text-gray-600 mb-1"><span className="font-medium">UID:</span> {user.uid}</p>
            {/* 追加のカスタムフィールドがあれば、ここに表示 */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUserList;