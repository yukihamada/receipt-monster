import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { app } from '../../firebase';

const firestore = getFirestore(app);

const AdminsPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [admins, setAdmins] = useState<{ email: string }[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('ユーザー:', user); // デバッグポイント
      setUser(user);
      if (user) {
        const adminStatus = await checkAdminStatus(user);
        console.log('管理者ステータス:', adminStatus); // デバッグポイント
        setIsAdmin(adminStatus);
        if (adminStatus) {
          fetchAdmins();
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const checkAdminStatus = async (user: User) => {
    const docRef = doc(firestore, 'admins', user.uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  };

  const fetchAdmins = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'admins'));
      const adminsList = querySnapshot.docs.map(doc => ({ email: doc.data().email }));
      setAdmins(adminsList);
    } catch (error) {
      console.error('管理者データの取得に失敗しました:', error);
      setMessage('管理者データの取得に失敗しました');
    }
  };

  const addAdmin = async () => {
    try {
      const newAdminRef = doc(collection(firestore, 'admins'));
      await setDoc(newAdminRef, { email: newAdminEmail });
      setMessage('新しい管理者を追加しました');
      fetchAdmins();
    } catch (error) {
      console.error('管理者の追加に失敗しました:', error);
      setMessage('管理者の追加に失敗しました');
    }
  };

  const deleteAdmin = async (email: string) => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'admins'));
      const adminDoc = querySnapshot.docs.find(doc => doc.data().email === email);
      if (adminDoc) {
        await deleteDoc(doc(firestore, 'admins', adminDoc.id));
        setMessage('管理者を削除しました');
        fetchAdmins();
      }
    } catch (error) {
      console.error('管理者の削除に失敗しました:', error);
      setMessage('管理者の削除に失敗しました');
    }
  };

  const updateSuperAdminUID = async () => {
    try {
      const superAdminDoc = doc(firestore, 'superAdmin', 'superAdminUID');
      await updateDoc(superAdminDoc, { uid: user?.uid });
      setMessage('スーパー管理者UIDを更新しました');
    } catch (error) {
      console.error('スーパー管理者UIDの更新に失敗しました:', error);
      setMessage('スーパー管理者UIDの更新に失敗しました');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">管理者一覧</div>
          {user ? (
            isAdmin ? (
              <>
                <div className="mt-4">
                  <input
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="新しい管者のメールアドレス"
                    className="mr-2 p-2 border rounded text-black" // 文字色を黒に設定
                  />
                  <button
                    onClick={addAdmin}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    管理者を追加
                  </button>
                </div>
                {admins.length > 0 ? (
                  <ul className="mt-4">
                    {admins.map(admin => (
                      <li key={admin.email} className="mt-2 text-gray-700 flex justify-between items-center">
                        <span>{admin.email}</span>
                        <button
                          onClick={() => deleteAdmin(admin.email)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                        >
                          削除
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-gray-500">管理者が見つかりません</p>
                )}
                {message && <p className="mt-4 text-red-500">{message}</p>}
                {isAdmin && (
                  <button
                    onClick={updateSuperAdminUID}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                  >
                    スーパー管理者UIDを更新
                  </button>
                )}
              </>
            ) : (
              <p className="mt-2 text-gray-500">管理者権限がありません</p>
            )
          ) : (
            <p className="mt-2 text-gray-500">ログインしていません</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminsPage;
